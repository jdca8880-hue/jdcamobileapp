// scripts/verify_player_stats.mjs
// ----------------------------------------------------------------------------
// READ-ONLY verification harness for the player-stats pipeline.
//
// It independently recomputes each player's CAREER batting / bowling / fielding
// numbers from the raw `deliveries` rows — using exactly the semantics encoded in
// 32_authoritative_player_stats.sql — and diffs them against the SQL views
// (v_player_career_batting / _bowling / _fielding). Any mismatch is a bug in
// either the views or this harness; they must agree to 100%.
//
// Usage:
//   node scripts/verify_player_stats.mjs
//
// Env (.env): VITE_SUPABASE_URL + a key that can read deliveries/matches.
//   The anon key only sees what RLS allows. To verify everything, put a
//   service-role key in SUPABASE_SERVICE_ROLE_KEY (never commit it).
// ----------------------------------------------------------------------------
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

const BOWLER_WICKETS = new Set(['BOWLED', 'CAUGHT', 'CAUGHT_BEHIND', 'STUMPED', 'LBW', 'HIT_WICKET']);
const NOT_BOWLER_CONCEDED = new Set(['BYE', 'LEG_BYE', 'PENALTY']);

function round2(n) { return Math.round(n * 100) / 100; }

async function fetchAll(table, columns) {
  // Page through so we are not capped at PostgREST's default 1000-row limit.
  const out = [];
  const size = 1000;
  for (let from = 0; ; from += size) {
    const { data, error } = await supabase.from(table).select(columns).range(from, from + size - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...data);
    if (data.length < size) break;
  }
  return out;
}

function recompute(deliveries, liveMatchIds) {
  const bat = new Map();   // player -> { runs, balls, fours, sixes, inningsSet, dismissals, perInnRuns:Map }
  const bowl = new Map();  // player -> { legal, conceded, wickets, inningsSet }
  const field = new Map(); // player -> { catches, catchesBehind, runOuts, stumpings }

  const bInn = new Map();  // batter -> Map(inningsId -> {runs, dismissed})
  const bwInn = new Map(); // bowler -> Set(inningsId)

  for (const d of deliveries) {
    if (d.event_type !== 'DELIVERY') continue;
    if (!liveMatchIds.has(d.match_id)) continue; // exclude soft-deleted matches

    // ---- batting (striker) ----
    if (d.striker_id) {
      const p = d.striker_id;
      if (!bat.has(p)) bat.set(p, { runs: 0, balls: 0, fours: 0, sixes: 0, dismissals: 0 });
      const b = bat.get(p);
      b.runs += d.runs_off_bat || 0;
      if (d.extra_type !== 'WIDE') b.balls += 1;
      if (d.runs_off_bat === 4) b.fours += 1;
      if (d.runs_off_bat === 6) b.sixes += 1;

      if (!bInn.has(p)) bInn.set(p, new Map());
      const inns = bInn.get(p);
      if (!inns.has(d.innings_id)) inns.set(d.innings_id, { runs: 0, dismissed: 0 });
      const ir = inns.get(d.innings_id);
      ir.runs += d.runs_off_bat || 0;
      if (d.wicket_type !== 'NONE' && d.dismissed_player_id === p) ir.dismissed = 1;
    }

    // ---- bowling ----
    if (d.bowler_id) {
      const p = d.bowler_id;
      if (!bowl.has(p)) bowl.set(p, { legal: 0, conceded: 0, wickets: 0 });
      const b = bowl.get(p);
      if (d.extra_type !== 'WIDE' && d.extra_type !== 'NO_BALL') b.legal += 1;
      b.conceded += NOT_BOWLER_CONCEDED.has(d.extra_type) ? 0 : (d.runs_total || 0);
      if (BOWLER_WICKETS.has(d.wicket_type)) b.wickets += 1;
      if (!bwInn.has(p)) bwInn.set(p, new Set());
      bwInn.get(p).add(d.innings_id);
    }

    // ---- fielding / wk ----
    const fp = d.fielder_id || d.wicketkeeper_id;
    if (fp) {
      if (!field.has(fp)) field.set(fp, { catches: 0, catchesBehind: 0, runOuts: 0, stumpings: 0 });
      const f = field.get(fp);
      if (d.wicket_type === 'CAUGHT' && d.fielder_id) f.catches += 1;
      if (d.wicket_type === 'CAUGHT_BEHIND' && d.wicketkeeper_id) f.catchesBehind += 1;
      if (d.wicket_type === 'RUN_OUT' && d.fielder_id) f.runOuts += 1;
      if (d.wicket_type === 'STUMPED' && d.wicketkeeper_id) f.stumpings += 1;
    }
  }

  // Finalize batting career from per-innings.
  const battingCareer = new Map();
  for (const [p, inns] of bInn) {
    const b = bat.get(p);
    let dismissals = 0, highest = 0;
    for (const ir of inns.values()) { dismissals += ir.dismissed; highest = Math.max(highest, ir.runs); }
    battingCareer.set(p, {
      career_runs: b.runs,
      career_balls: b.balls,
      total_fours: b.fours,
      total_sixes: b.sixes,
      highest_score: highest,
      times_dismissed: dismissals,
      strike_rate: b.balls ? round2(b.runs * 100 / b.balls) : 0,
      batting_average: dismissals ? round2(b.runs / dismissals) : round2(b.runs),
    });
  }
  const bowlingCareer = new Map();
  for (const [p, b] of bowl) {
    bowlingCareer.set(p, {
      legal_balls: b.legal,
      runs_conceded: b.conceded,
      wickets: b.wickets,
      economy: b.legal ? round2(b.conceded * 6 / b.legal) : 0,
      bowling_average: b.wickets ? round2(b.conceded / b.wickets) : 0,
    });
  }
  return { battingCareer, bowlingCareer, fieldingCareer: field };
}

function diffRow(label, pid, expected, actual, fields) {
  const problems = [];
  for (const f of fields) {
    const e = Number(expected[f] ?? 0);
    const a = Number(actual?.[f] ?? 0);
    if (Math.abs(e - a) > 0.011) problems.push(`${f}: view=${a} recomputed=${e}`);
  }
  if (problems.length) console.log(`  ✗ [${label}] player ${pid}\n     ${problems.join('\n     ')}`);
  return problems.length;
}

async function main() {
  if (!url || !key) { console.error('Missing Supabase env.'); process.exit(1); }
  console.log(`Using ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service-role' : 'anon'} key.\n`);

  const matches = await fetchAll('matches', 'id, deleted_at');
  const liveMatchIds = new Set(matches.filter(m => !m.deleted_at).map(m => m.id));

  const deliveries = await fetchAll(
    'deliveries',
    'match_id, innings_id, event_type, extra_type, wicket_type, runs_off_bat, runs_total, striker_id, dismissed_player_id, bowler_id, fielder_id, wicketkeeper_id'
  );
  console.log(`Fetched ${deliveries.length} deliveries across ${liveMatchIds.size} live matches.`);
  if (deliveries.length === 0) {
    console.log('\nNo deliveries visible — nothing to verify yet (or RLS is hiding them; try a service-role key).');
    return;
  }

  const { battingCareer, bowlingCareer, fieldingCareer } = recompute(deliveries, liveMatchIds);

  const [vBat, vBowl, vField] = await Promise.all([
    fetchAll('v_player_career_batting', '*'),
    fetchAll('v_player_career_bowling', '*'),
    fetchAll('v_player_career_fielding', '*'),
  ]);
  const mBat = new Map(vBat.map(r => [r.player_id, r]));
  const mBowl = new Map(vBowl.map(r => [r.player_id, r]));
  const mField = new Map(vField.map(r => [r.player_id, r]));

  let fails = 0;
  console.log('\n— Batting —');
  for (const [pid, exp] of battingCareer)
    fails += diffRow('batting', pid, exp, mBat.get(pid),
      ['career_runs', 'career_balls', 'total_fours', 'total_sixes', 'highest_score', 'times_dismissed', 'strike_rate', 'batting_average']);
  console.log('— Bowling —');
  for (const [pid, exp] of bowlingCareer)
    fails += diffRow('bowling', pid, exp, mBowl.get(pid),
      ['legal_balls', 'runs_conceded', 'wickets', 'economy', 'bowling_average']);
  console.log('— Fielding —');
  for (const [pid, exp] of fieldingCareer)
    fails += diffRow('fielding', pid,
      { catches: exp.catches, catches_behind: exp.catchesBehind, run_outs: exp.runOuts, stumpings: exp.stumpings },
      mField.get(pid), ['catches', 'catches_behind', 'run_outs', 'stumpings']);

  console.log(`\n${fails === 0 ? '✅ ALL PLAYERS MATCH — views == independent recompute.' : `❌ ${fails} mismatch(es) found.`}`);
  process.exit(fails === 0 ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });
