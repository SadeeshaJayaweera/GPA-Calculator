import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'docs/screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  // 1. Dashboard Light Mode
  console.log('Capturing dashboard-light.png...');
  await page.screenshot({ path: path.join(outDir, 'dashboard-light.png'), fullPage: false });

  // 2. Click "Target & Scenarios"
  console.log('Capturing planner.png...');
  const plannerBtn = await page.waitForSelector('nav button:nth-child(2)');
  await plannerBtn.click();
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'planner.png'), fullPage: false });

  // 3. Click "AI Advisor"
  console.log('Capturing ai-advisor.png...');
  const aiBtn = await page.waitForSelector('nav button:nth-child(3)');
  await aiBtn.click();
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'ai-advisor.png'), fullPage: false });

  // 4. Click "Grading Scales"
  console.log('Capturing grading-scales.png...');
  const gradingBtn = await page.waitForSelector('nav button:nth-child(4)');
  await gradingBtn.click();
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'grading-scales.png'), fullPage: false });

  // 5. Switch to Dark Mode & capture Calculator in Dark Mode
  console.log('Capturing dashboard-dark.png...');
  const calcBtn = await page.waitForSelector('nav button:nth-child(1)');
  await calcBtn.click();
  await new Promise((r) => setTimeout(r, 500));

  // Click theme toggle button (button with Sun/Moon icon in header)
  const themeBtn = await page.waitForSelector('header button[title*="Mode"]');
  await themeBtn.click();
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark.png'), fullPage: false });

  await browser.close();
  console.log('All screenshots captured successfully in docs/screenshots/');
}

capture().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
