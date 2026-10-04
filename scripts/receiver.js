import express from 'express';

const app = express();
// Simple CORS config to allow browser requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json({ limit: '50mb' }));

app.post('/report', (req, res) => {
  console.log('\n========================================');
  console.log('BROWSER REPORT RECEIVED');
  console.log('========================================');
  console.log(JSON.stringify(req.body, null, 2));
  console.log('========================================\n');
  res.send('ok');
});

app.listen(9999, () => {
  console.log('Receiver server listening on port 9999');
});
