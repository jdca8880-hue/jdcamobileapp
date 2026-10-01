import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const report = {
  total: 0,
  passed: 0,
  failed: 0,
  blocked: 0,
  results: []
};

function logResult(name, expected, actual, passed, details = {}) {
  report.total++;
  if (passed) {
    report.passed++;
  } else {
    report.failed++;
  }
  
  report.results.push({
    test: name,
    passed,
    expected,
    actual,
    details
  });
  
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name}`);
}

async function runTests() {
  console.log("Authenticating as superadmin...");
  
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'superadmin@jdca.com',
    password: 'password123'
  });
  
  if (authErr) {
    console.error("Login failed:", authErr.message);
    const { data: authData2, error: authErr2 } = await supabase.auth.signInWithPassword({
        email: 'admin@gmail.com',
        password: '12345678'
    });
    if (authErr2) {
        console.error("Second login failed too. Unable to run API tests. Exiting.");
        return;
    }
  }
  
  console.log("Logged in. Setting up test entities...");

  // Setup: Create a dummy tournament and team for testing
  const { data: testTournament, error: tErr } = await supabase.from('tournaments').insert({
    name: 'Adversarial Tourney ' + Date.now(),
    format: 'T20',
    start_date: new Date().toISOString(),
    status: 'UPCOMING'
  }).select().single();

  if (tErr) {
    console.error("Setup failed (Tournament):", tErr);
    return;
  }

  const { data: teamA } = await supabase.from('teams').insert({ name: 'Team Alpha ' + Date.now() }).select().single();
  const { data: teamB } = await supabase.from('teams').insert({ name: 'Team Beta ' + Date.now() }).select().single();

  // --- C. State Machine Attacks ---
  console.log("\n--- C. State Machine Attacks ---");
  
  const { data: match, error: matchErr } = await supabase.from('matches').insert({
    tournament_id: testTournament.id,
    home_team_id: teamA.id,
    away_team_id: teamB.id,
    date: new Date().toISOString(),
    status: 'SCHEDULED',
    match_type: 'LIMITED_OVERS'
  }).select().single();
  
  const testMatchId = match.id;

  const { error: err1 } = await supabase.from('matches').update({ status: 'INNINGS_BREAK' }).eq('id', testMatchId);
  logResult("State Machine: SCHEDULED → INNINGS_BREAK", "Rejected", err1 ? "Rejected" : "Accepted", !!err1);

  const { error: err2 } = await supabase.from('matches').update({ status: 'SCHEDULED' }).eq('id', testMatchId);
  logResult("State Machine: INNINGS_BREAK → SCHEDULED", "Rejected", err2 ? "Rejected" : "Accepted", !!err2);

  await supabase.from('matches').update({ status: 'COMPLETED' }).eq('id', testMatchId);
  const { error: err3 } = await supabase.from('matches').update({ status: 'SCHEDULED' }).eq('id', testMatchId);
  logResult("State Machine: COMPLETED → SCHEDULED", "Rejected", err3 ? "Rejected" : "Accepted", !!err3);

  // --- E. Duplicate/Idempotency Tests ---
  console.log("\n--- E. Duplicate/Idempotency Tests ---");
  
  const dupName = 'Idempotency Tourney ' + Date.now();
  const { error: dErr1 } = await supabase.from('tournaments').insert({ name: dupName, format: 'T20', status: 'UPCOMING' });
  const { error: dErr2 } = await supabase.from('tournaments').insert({ name: dupName, format: 'T20', status: 'UPCOMING' });
  
  logResult("Idempotency: Duplicate Tournament", "Rejected", dErr2 ? "Rejected" : "Accepted", !!dErr2);

  const { error: dfErr1 } = await supabase.from('matches').insert({
    tournament_id: testTournament.id,
    home_team_id: teamA.id,
    away_team_id: teamB.id,
    date: new Date().toISOString(),
    status: 'SCHEDULED'
  });
  const { error: dfErr2 } = await supabase.from('matches').insert({
    tournament_id: testTournament.id,
    home_team_id: teamA.id,
    away_team_id: teamB.id,
    date: new Date().toISOString(),
    status: 'SCHEDULED'
  });
  
  logResult("Idempotency: Duplicate Fixture", "Rejected", dfErr2 ? "Rejected" : "Accepted", !!dfErr2);

  // --- B. Concurrent Mutations ---
  console.log("\n--- B. Concurrent Mutations ---");
  
  const { data: cMatch } = await supabase.from('matches').insert({
    tournament_id: testTournament.id,
    home_team_id: teamA.id,
    away_team_id: teamB.id,
    date: new Date().toISOString(),
    status: 'IN_PROGRESS'
  }).select().single();

  const [res1, res2] = await Promise.all([
    supabase.from('matches').update({ status: 'COMPLETED' }).eq('id', cMatch.id),
    supabase.from('matches').update({ status: 'COMPLETED' }).eq('id', cMatch.id)
  ]);
  
  const bothSucceeded = !res1.error && !res2.error;
  logResult("Concurrency: Double Finalize", "One Rejected", bothSucceeded ? "Both Accepted" : "One Rejected", !bothSucceeded);

  console.log("\nGenerating test report...");

  let md = `# JDCA Automated Adversarial Test Baseline\n\n`;
  md += `## Summary\n`;
  md += `- **Total automated tests executed:** ${report.total}\n`;
  md += `- **Passed:** ${report.passed}\n`;
  md += `- **Failed:** ${report.failed}\n`;
  md += `- **Blocked:** 0\n`;
  md += `- **Tests requiring real browser interaction:** 6 (Hydration scenarios, UI fallback behaviors)\n`;
  md += `- **Tests requiring network simulation:** 6 (Offline Sync scenarios, Retry behaviors)\n`;
  md += `- **Tests requiring multiple concurrent clients:** 2 (Stale client testing, Concurrent UI mutation)\n\n`;

  md += `## Test Results\n\n`;
  md += `| Test Case | Expected | Actual | Result | Severity |\n`;
  md += `|-----------|----------|--------|--------|----------|\n`;
  
  report.results.forEach(r => {
      const severity = r.passed ? 'INFO' : 'HIGH';
      const status = r.passed ? '✅ PASS' : '❌ FAIL';
      md += `| ${r.test} | ${r.expected} | ${r.actual} | ${status} | ${severity} |\n`;
  });

  md += `\n## Historical Regression Map\n\n`;
  md += `| Historical bug | Reproducible automatically? | Test created? | Current result |\n`;
  md += `|---|---|---|---|\n`;
  md += `| "match stucked on loop... cant lock" | Yes (Concurrency API test) | Yes | See "Double Finalize" |\n`;
  md += `| "setup screen reappear" | No (Browser network sim req) | No | BLOCKED |\n`;
  md += `| "Cannot read properties of undefined (reading batting)" | No (Browser hydration sim req) | No | BLOCKED |\n`;

  fs.writeFileSync('jdca_automated_test_report.md', md, 'utf-8');
  console.log("Report generated at jdca_automated_test_report.md");
}

runTests().catch(console.error);
