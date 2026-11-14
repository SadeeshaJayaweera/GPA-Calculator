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
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  // Populate realistic academic demo data for compelling screenshots
  await page.evaluate(() => {
    const sampleData = [
      {
        id: 'sem-1',
        name: 'Year 1 — Semester 1',
        year: 1,
        semesterNumber: 1,
        subjects: [
          { id: 'sub-1', code: 'SE1010', name: 'Software Engineering Fundamentals', credits: 4, grade: 'A', gradePoint: 4.0 },
          { id: 'sub-2', code: 'IT1020', name: 'Data Structures & Algorithms', credits: 4, grade: 'A-', gradePoint: 3.7 },
          { id: 'sub-3', code: 'CS1030', name: 'Database Management Systems', credits: 3, grade: 'A', gradePoint: 4.0 },
          { id: 'sub-4', code: 'MA1040', name: 'Discrete Mathematics', credits: 3, grade: 'B+', gradePoint: 3.3 },
          { id: 'sub-5', code: 'EN1050', name: 'Technical Communication', credits: 2, grade: 'A', gradePoint: 4.0 },
        ],
      },
      {
        id: 'sem-2',
        name: 'Year 1 — Semester 2',
        year: 1,
        semesterNumber: 2,
        subjects: [
          { id: 'sub-6', code: 'SE1060', name: 'Object Oriented Programming (Java)', credits: 4, grade: 'A+', gradePoint: 4.0 },
          { id: 'sub-7', code: 'SE1070', name: 'Software Architecture & Design', credits: 4, grade: 'A', gradePoint: 4.0 },
          { id: 'sub-8', code: 'CS1080', name: 'Computer Networks', credits: 3, grade: 'A-', gradePoint: 3.7 },
          { id: 'sub-9', code: 'IT1090', name: 'Operating Systems', credits: 3, grade: 'B+', gradePoint: 3.3 },
        ],
      },
    ];
    localStorage.setItem('gpa_semesters_data', JSON.stringify(sampleData));
    localStorage.setItem('gpa_theme', 'light');
  });

  // Reload with sample data in light mode
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  // 1. Dashboard Light Mode
  console.log('Capturing dashboard-light.png...');
  await page.screenshot({ path: path.join(outDir, 'dashboard-light.png'), fullPage: false });

  // 2. Click "Target Planner" tab
  console.log('Capturing planner.png...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const plannerTab = tabs.find((t) => t.textContent && (t.textContent.includes('Planner') || t.getAttribute('value') === 'planner'));
    if (plannerTab) plannerTab.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'planner.png'), fullPage: false });

  // 3. Click "AI Advisor" tab
  console.log('Capturing ai-advisor.png...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const aiTab = tabs.find((t) => t.textContent && (t.textContent.includes('Advisor') || t.getAttribute('value') === 'ai'));
    if (aiTab) aiTab.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'ai-advisor.png'), fullPage: false });

  // 4. Click "Grading Scales" tab
  console.log('Capturing grading-scales.png...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const gradingTab = tabs.find((t) => t.textContent && (t.textContent.includes('Grading') || t.getAttribute('value') === 'grading'));
    if (gradingTab) gradingTab.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'grading-scales.png'), fullPage: false });

  // 5. Switch to Dark Mode & capture Calculator in Dark Mode
  console.log('Capturing dashboard-dark.png...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    const calcTab = tabs.find((t) => t.textContent && (t.textContent.includes('Calculator') || t.getAttribute('value') === 'calculator'));
    if (calcTab) calcTab.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Toggle theme to dark
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('gpa_theme', 'dark');
    const allButtons = Array.from(document.querySelectorAll('button'));
    const themeBtn = allButtons.find((b) => b.getAttribute('title')?.includes('Mode') || b.querySelector('svg[data-testid*="Mode"]'));
    if (themeBtn) themeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'dashboard-dark.png'), fullPage: false });

  await browser.close();
  console.log('All screenshots captured successfully in docs/screenshots/!');
}

capture().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
