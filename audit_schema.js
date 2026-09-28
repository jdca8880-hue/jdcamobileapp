
const supabaseUrl = 'https://qxrngeasemveguixlzlf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4cm5nZWFzZW12ZWd1aXhsemxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzcyNTQsImV4cCI6MjEwNDk1MzI1NH0.XDZmyr34uphmZYhQr6115NRQj2LS3V3yCw7KULeGM8c';

async function fetchSchema() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseAnonKey}`);
    const swagger = await res.json();
    console.log(Object.keys(swagger));
    if (swagger.components && swagger.components.schemas) {
       for (const [defName, def] of Object.entries(swagger.components.schemas)) {
          if (!def.properties) continue;
          const columns = Object.keys(def.properties);
          console.log(`\nTable: ${defName}`);
          console.log(`Columns: ${columns.join(', ')}`);
       }
    } else if (swagger.definitions) {
       for (const [defName, def] of Object.entries(swagger.definitions)) {
          if (!def.properties) continue;
          const columns = Object.keys(def.properties);
          console.log(`\nTable: ${defName}`);
          console.log(`Columns: ${columns.join(', ')}`);
       }
    }
  } catch (err) {
    console.error("Error fetching schema", err);
  }
}

fetchSchema();
