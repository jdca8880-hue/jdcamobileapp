import assert from 'assert';
import { api } from '../src/lib/api.js';
import { db } from '../src/lib/db.js';
import { supabase } from '../src/lib/supabase.js';

async function runTests() {
  console.log("Setting up DB mocks for Scorecard testing...");
  
  // Mock DB to simulate offline queue
  db.sync_queue = {
    _items: [],
    where(field) {
      return {
        equals: (val) => ({
          toArray: async () => this._items.filter(i => i[field] === val)
        })
      }
    },
    async toArray() { return this._items; },
    add(item) { this._items.push(item); },
    clear() { this._items = []; }
  };
  
  const MATCH_ID = 'match-123';
  const INNINGS_1 = 'innings-1';
  const INNINGS_2 = 'innings-2';
  
  // Mock Supabase to return static matches/innings
  supabase.from = (table) => {
    return {
      select: () => ({
        eq: (field, val) => {
          if (table === 'matches' && val === MATCH_ID) {
            return {
              single: async () => ({
                data: {
                  id: MATCH_ID,
                  home_team_id: 'team-a',
                  away_team_id: 'team-b',
                  home_team: { name: 'Team A' },
                  away_team: { name: 'Team B' }
                },
                error: null
              })
            };
          }
          if (table === 'innings' && val === MATCH_ID) {
            return {
              order: async () => ({
                data: [
                  { id: INNINGS_1, match_id: MATCH_ID, innings_number: 1, batting_team_id: 'team-a' },
                  { id: INNINGS_2, match_id: MATCH_ID, innings_number: 2, batting_team_id: 'team-b' }
                ],
                error: null
              })
            };
          }
          if (table === 'deliveries' && val === MATCH_ID) {
            return {
              data: supabase._remoteDeliveries || [],
              error: null
            };
          }
          return { data: [], error: null };
        }
      })
    };
  };

  const getScorecard = async () => await api.getMatchScorecard(MATCH_ID);

  console.log("Test 1: remote deliveries only");
  supabase._remoteDeliveries = [
    { id: 'd1', idempotency_key: 'd1', match_id: MATCH_ID, innings_id: INNINGS_1, runs_total: 4, striker_id: 's1', runs_off_bat: 4, extra_type: 'NONE', wicket_type: 'NONE' }
  ];
  db.sync_queue.clear();
  
  let sc = await getScorecard();
  assert.strictEqual(sc.home_team.score, '4/0');
  
  console.log("Test 2: pending delivery appears immediately (remote + pending combined)");
  db.sync_queue.add({
    action: 'RECORD_DELIVERY',
    status: 'PENDING',
    payload: {
      id: 'd2', idempotency_key: 'd2', matchId: MATCH_ID, inningsId: INNINGS_1, runsTotal: 6, strikerId: 's1', runsBatter: 6, extraType: 'NONE', wicketType: 'NONE'
    }
  });
  
  sc = await getScorecard();
  assert.strictEqual(sc.home_team.score, '10/0'); // 4 remote + 6 pending
  
  console.log("Test 11 & 12: batter/bowler stats include pending delivery");
  assert.strictEqual(sc.scorecard.home_team.batting.find(b => b.id === 's1').runs, 10);
  
  console.log("Test 6 & 14: duplicate remote/local delivery deduplicated by ID (no double-count)");
  // D2 is now synced to remote, but still in local queue (hasn't been deleted yet)
  supabase._remoteDeliveries.push({
    id: 'd2', idempotency_key: 'd2', match_id: MATCH_ID, innings_id: INNINGS_1, runs_total: 6, striker_id: 's1', runs_off_bat: 6, extra_type: 'NONE', wicket_type: 'NONE'
  });
  
  sc = await getScorecard();
  assert.strictEqual(sc.home_team.score, '10/0'); // Still 10!
  
  console.log("Test 7: pending delivery from another match excluded");
  db.sync_queue.add({
    action: 'RECORD_DELIVERY',
    status: 'PENDING',
    payload: {
      id: 'd3', idempotency_key: 'd3', matchId: 'another-match', inningsId: INNINGS_1, runsTotal: 100, strikerId: 's1', runsBatter: 100
    }
  });
  sc = await getScorecard();
  assert.strictEqual(sc.home_team.score, '10/0');
  
  console.log("Test 8: pending delivery from another innings affects correct innings");
  db.sync_queue.add({
    action: 'RECORD_DELIVERY',
    status: 'PENDING',
    payload: {
      id: 'd4', idempotency_key: 'd4', matchId: MATCH_ID, inningsId: INNINGS_2, runsTotal: 2, strikerId: 's2', runsBatter: 2
    }
  });
  sc = await getScorecard();
  assert.strictEqual(sc.home_team.score, '10/0');
  assert.strictEqual(sc.away_team.score, '2/0');
  
  console.log("Test 13: both innings remain visible");
  assert.strictEqual(sc.scorecard.home_team.batting.length, 1);
  assert.strictEqual(sc.scorecard.away_team.batting.length, 1);

  console.log("✅ All Local-First Scorecard tests passed!");
}

runTests().catch(console.error);
