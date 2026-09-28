
const supabaseUrl = 'https://qxrngeasemveguixlzlf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4cm5nZWFzZW12ZWd1aXhsemxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzcyNTQsImV4cCI6MjEwNDk1MzI1NH0.XDZmyr34uphmZYhQr6115NRQj2LS3V3yCw7KULeGM8c';

async function fetchData() {
  const res = await fetch(`${supabaseUrl}/rest/v1/age_categories?select=*`, {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  });
  const data = await res.json();
  console.log("Age Categories:", data);
}

fetchData();
