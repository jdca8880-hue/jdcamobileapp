import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const targetUUIDs = [
    'b1dfe465-aef2-4dea-a977-a5f690ef07fb',
    '0b30730a-9fcb-41cb-84df-2023d47f8fb6',
    '2d9c14f4-7a42-495b-8906-f487e70d1547',
    'b63a8ec3-5c5c-45e5-bb63-fff0b81b8510',
    '899c26c3-18b1-4418-b8af-9663cde077ba',
    '527afc08-de9c-4472-8b10-0b8ac29b58b0',
    'fed5c316-6c0d-434f-9811-c899614a2c3a'
];

async function stage1Review() {
  console.log("=== STAGE 1: FINAL ORPHAN REVIEW ===");
  
  for (const id of targetUUIDs) {
    const { data: m } = await supabase.from('matches').select('id, status, tournament_id').eq('id', id).single();
    if (!m) {
        console.log(`Match ${id} not found.`);
        continue;
    }
    
    const { count: inningsCount } = await supabase.from('innings').select('*', { count: 'exact', head: true }).eq('match_id', id);
    const { count: deliveriesCount } = await supabase.from('deliveries').select('*', { count: 'exact', head: true }).eq('match_id', id);
    const { count: rosterCount } = await supabase.from('match_rosters').select('*', { count: 'exact', head: true }).eq('match_id', id);
    
    console.log(`\nMatch: ${m.id}`);
    console.log(`Status: ${m.status}`);
    console.log(`Tournament ID: ${m.tournament_id}`);
    console.log(`Innings Count: ${inningsCount}`);
    console.log(`Delivery Count: ${deliveriesCount}`);
    console.log(`Roster Count: ${rosterCount}`);
  }
}

stage1Review();
