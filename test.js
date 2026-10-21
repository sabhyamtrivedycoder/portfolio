/**
 * Sabhyam Portfolio Verification Suite
 * Verifies file integrity, CV project links, asset existence, and strict exclusion constraints.
 * Author: Sabhyam Trivedy
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Sabhyam Portfolio Verification Tests...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    process.exitCode = 1;
  }
}

const portfolioDir = __dirname;
const htmlContent = fs.readFileSync(path.join(portfolioDir, 'index.html'), 'utf-8');
const jsContent = fs.readFileSync(path.join(portfolioDir, 'app.js'), 'utf-8');
const cssContent = fs.readFileSync(path.join(portfolioDir, 'styles.css'), 'utf-8');

// 1. Static Assets Integrity
runTest('All required assets and files exist in portfolio directory', () => {
  const requiredFiles = [
    'index.html',
    'styles.css',
    'app.js',
    'package.json',
    'resume.html',
    'assets/sabhyam.jpg',
    'assets/spark2ship-preview.png'
  ];

  for (const rel of requiredFiles) {
    const fullPath = path.join(portfolioDir, rel);
    assert(fs.existsSync(fullPath), `Missing required file: ${rel}`);
    const stat = fs.statSync(fullPath);
    assert(stat.size > 0, `File is empty: ${rel}`);
  }
});

// 2. Authentic Personal & Venture Details
runTest('Portfolio includes authentic details of Sabhyam Trivedy, Spark2Ship, and sabhyamai.in', () => {
  assert(htmlContent.includes('Sabhyam Trivedy'), 'Must mention Sabhyam Trivedy');
  assert(htmlContent.includes('Spark2Ship'), 'Must feature Spark2Ship');
  assert(htmlContent.includes('sabhyamai.in'), 'Must feature sabhyamai.in');
  assert(htmlContent.includes('Rajdhanwar'), 'Must mention location Rajdhanwar');
  assert(htmlContent.includes('Manthan Valley ST. Albert'), 'Must mention education');
});

// 3. All 4 Computer Vision Projects Featured
runTest('Portfolio features all 4 Computer Vision showcase projects', () => {
  assert(htmlContent.includes('Anime Gesture Attacks'), 'Must feature Anime Gesture Attacks');
  assert(htmlContent.includes('CV Fitness Rep Counter'), 'Must feature CV Fitness Rep Counter');
  assert(htmlContent.includes('CardioVision Pulse Monitor'), 'Must feature CardioVision Pulse Monitor');
  assert(htmlContent.includes('God\'s Eye AR HUD'), 'Must feature God\'s Eye AR HUD');

  // Verify modal mapping covers all 4 keys
  assert(jsContent.includes("'anime'"), 'Demo map must include anime');
  assert(jsContent.includes("'fitness'"), 'Demo map must include fitness');
  assert(jsContent.includes("'cardio'"), 'Demo map must include cardio');
  assert(jsContent.includes("'hud'"), 'Demo map must include hud');
});

// 4. Local CV Project Paths Resolve Correctly
runTest('All 4 CV project relative paths resolve to valid local installations', () => {
  const projectPaths = [
    path.join(portfolioDir, '../anime-gesture-attacks/index.html'),
    path.join(portfolioDir, '../cv-fitness-rep-counter/index.html'),
    path.join(portfolioDir, '../cardiovision-pulse-monitor/index.html'),
    path.join(portfolioDir, '../gods-eye-vision-hud/index.html')
  ];

  for (const p of projectPaths) {
    assert(fs.existsSync(p), `CV project index.html not found at: ${p}`);
  }
});

// 5. STRICT CONSTRAINT: Complete Exclusion of Riddhiman Gupta Projects
runTest('STRICT CONSTRAINT: Zero occurrences of forbidden projects or names', () => {
  const forbiddenPatterns = [
    /riddhiman/i,
    /sprynn/i,
    /smarteat/i,
    /roboreceptionist/i,
    /robo\s*res/i
  ];

  const filesToCheck = [
    { name: 'index.html', content: htmlContent },
    { name: 'app.js', content: jsContent },
    { name: 'styles.css', content: cssContent }
  ];

  for (const file of filesToCheck) {
    for (const pat of forbiddenPatterns) {
      assert(!pat.test(file.content), 
        `CRITICAL CONSTRAINT VIOLATION: Found forbidden pattern ${pat} in ${file.name}`);
    }
  }
});

console.log(`\n========================================`);
console.log(`Sabhyam Portfolio Verification Summary:`);
console.log(`Passed: ${passedTests} / ${totalTests}`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
  console.log('🎉 All Portfolio verification checks passed with 100% compliance!\n');
} else {
  console.error('❌ Verification failed.');
  process.exit(1);
}
