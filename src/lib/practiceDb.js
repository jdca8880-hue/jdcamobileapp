import Dexie from 'dexie';

export const practiceDb = new Dexie('JDCAPracticeDB');

practiceDb.version(1).stores({
  matches: 'id, tournament_id, scheduled_at, status',
  players: 'id, full_name, primary_role',
  teams: 'id, name, district_id',
  tournaments: 'id, name, status',
  deliveries: 'id, match_id, innings_id, delivery_sequence, over_number, ball_number',
  innings: 'id, match_id, innings_number, [match_id+innings_number]',
  match_rosters: 'id, match_id, team_id, player_id',
  seasons: 'id, name, is_current_active',
  age_categories: 'id, name, short_name',
  districts: 'id, name'
});

export const initializePracticeDb = async () => {
  const count = await practiceDb.seasons.count();
  if (count === 0) {
    // Seed some basic data
    await practiceDb.seasons.add({ id: 'season-1', name: '2026-27', is_current_active: true });
    await practiceDb.age_categories.bulkAdd([
      { id: 'ac-1', name: 'Senior', short_name: 'SEN' },
      { id: 'ac-2', name: 'Under-19', short_name: 'U19' },
      { id: 'ac-3', name: 'Under-16', short_name: 'U16' },
      { id: 'ac-4', name: 'Under-14', short_name: 'U14' },
      { id: 'ac-5', name: 'Women', short_name: 'WOM' }
    ]);
    await practiceDb.districts.bulkAdd([
      { id: 'dist-1', name: 'Practice District 1' },
      { id: 'dist-2', name: 'Practice District 2' },
      { id: 'dist-3', name: 'Practice District 3' }
    ]);
  }
};
