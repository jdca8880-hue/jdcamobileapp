import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting puppeteer to drain queue...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  
  // Wait 15 seconds for recovery to run and report
  await new Promise(r => setTimeout(r, 15000));
  
  await browser.close();
})();
