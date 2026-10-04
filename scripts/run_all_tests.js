import { execSync } from 'child_process';

const commands = [
  'node tests/test_sync_service.js',
  'node tests/test_scoring_validation.js',
  'node tests/test_match_lifecycle.js',
  'node test_run_out.js',
  'node test_no_ball.js',
  'node test_wide.js',
  'node test_byes_legbyes.js',
  'node tests/test_penalty_runs.js',
  'npm run build'
];

for (const cmd of commands) {
  console.log(`\n================================`);
  console.log(`Running: ${cmd}`);
  console.log(`================================`);
  execSync(cmd, { stdio: 'inherit' });
}
