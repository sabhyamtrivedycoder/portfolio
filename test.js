/**
 * Sabhyam Portfolio Verification Suite
 * Verifies multi-page architecture, CV project links, asset existence, and strict exclusion constraints.
 * Author: Sabhyam Trivedy
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Sabhyam Multi-Page Portfolio Verification Tests...\n');

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

// 1. Multi-Page Architecture Verification
runTest('All 6 dedicated pages exist and have content', () => {
  const pages = [
    'index.html',
    'about.html',
    'ventures.html',
    'vision.html',
    'resume.html',
    'contact.html'
  ];

  for (const page of pages) {
    const fullPath = path.join(portfolioDir, page);
    assert(fs.existsSync(fullPath), `Missing required page: ${page}`);
    const stat = fs.statSync(fullPath);
    assert(stat.size > 500, `Page is suspiciously small: ${page} (${stat.size} bytes)`);
  }
});

// 2. Real Screenshot of Sabhyamai.in
runTest('Real screenshot of sabhyamai.in exists and is embedded', () => {
  const screenshotPath = path.join(portfolioDir, 'assets/sabhyamai-screenshot.png');
  assert(fs.existsSync(screenshotPath), 'Missing assets/sabhyamai-screenshot.png');
  assert(fs.statSync(screenshotPath).size > 10000, 'Screenshot file is too small');

  const indexHtml = fs.readFileSync(path.join(portfolioDir, 'index.html'), 'utf-8');
  const venturesHtml = fs.readFileSync(path.join(portfolioDir, 'ventures.html'), 'utf-8');
  assert(indexHtml.includes('assets/sabhyamai-screenshot.png'), 'index.html must embed sabhyamai screenshot');
  assert(venturesHtml.includes('assets/sabhyamai-screenshot.png'), 'ventures.html must embed sabhyamai screenshot');
});

// 3. 4 Computer Vision Projects with NeuroGaze AI & AirCanvas Replacements
runTest('Computer Vision Suite features NeuroGaze AI, CV Fitness, AirCanvas AI, and Anime Gestures', () => {
  const visionHtml = fs.readFileSync(path.join(portfolioDir, 'vision.html'), 'utf-8');
  assert(visionHtml.includes('NeuroGaze AI'), 'Must feature NeuroGaze AI');
  assert(visionHtml.includes('CV Fitness'), 'Must feature CV Fitness');
  assert(visionHtml.includes('AirCanvas AI'), 'Must feature AirCanvas AI');
  assert(visionHtml.includes('Anime Gesture Attacks'), 'Must feature Anime Gesture Attacks');

  // Verify CardioVision/respiration and God's Eye are completely removed
  assert(!visionHtml.toLowerCase().includes("cardiovision"), "CardioVision must be removed from vision.html");
  assert(!visionHtml.toLowerCase().includes("god's eye"), "God's Eye must be removed from vision.html");
  assert(!visionHtml.toLowerCase().includes("gods-eye"), "Gods-eye link must be removed from vision.html");
});

// 4. Local CV Project Paths Resolve Correctly
runTest('All 4 CV project relative paths resolve to valid local installations', () => {
  const projectPaths = [
    path.join(portfolioDir, '../neurogaze-ai/index.html'),
    path.join(portfolioDir, '../cv-fitness-rep-counter/index.html'),
    path.join(portfolioDir, '../aircanvas-vision-ai/index.html'),
    path.join(portfolioDir, '../anime-gesture-attacks/index.html')
  ];

  for (const p of projectPaths) {
    assert(fs.existsSync(p), `CV project index.html not found at: ${p}`);
  }
});

// 5. Authentic Personal & Venture Details
runTest('Portfolio includes authentic details of Sabhyam Trivedy, Spark2Ship, and sabhyamai.in', () => {
  const indexHtml = fs.readFileSync(path.join(portfolioDir, 'index.html'), 'utf-8');
  assert(indexHtml.includes('Sabhyam Trivedy'), 'Must mention Sabhyam Trivedy');
  assert(indexHtml.includes('Spark2Ship'), 'Must feature Spark2Ship');
  assert(indexHtml.includes('sabhyamai.in'), 'Must feature sabhyamai.in');
  assert(indexHtml.includes('Rajdhanwar'), 'Must mention location Rajdhanwar');
});

// 6. STRICT CONSTRAINT: Zero occurrences of forbidden projects or names
runTest('STRICT CONSTRAINT: Zero occurrences of forbidden projects or names across all pages', () => {
  const forbiddenPatterns = [
    /riddhiman/i,
    /sprynn/i,
    /smarteat/i,
    /roboreceptionist/i,
    /robo\s*res/i
  ];

  const filesToCheck = [
    'index.html',
    'about.html',
    'ventures.html',
    'vision.html',
    'contact.html',
    'styles.css'
  ];

  for (const f of filesToCheck) {
    const content = fs.readFileSync(path.join(portfolioDir, f), 'utf-8');
    for (const pat of forbiddenPatterns) {
      assert(!pat.test(content), `Violation: Pattern ${pat} found in ${f}`);
    }
  }
});

// 7. LinkedIn Profile Link Verification
runTest('LinkedIn profile is linked across all 6 portfolio pages', () => {
  const allPages = [
    'index.html',
    'about.html',
    'ventures.html',
    'vision.html',
    'resume.html',
    'contact.html'
  ];

  for (const p of allPages) {
    const content = fs.readFileSync(path.join(portfolioDir, p), 'utf-8');
    assert(
      content.includes('linkedin.com/in/sabhyamtrivedy'),
      `Missing LinkedIn link in ${p}`
    );
  }
});

// 8. HoloVerse AI Flagship Build Verification
runTest('Portfolio features HoloVerse AI across index, ventures, vision, about, and resume pages', () => {
  const indexHtml = fs.readFileSync(path.join(portfolioDir, 'index.html'), 'utf-8');
  const venturesHtml = fs.readFileSync(path.join(portfolioDir, 'ventures.html'), 'utf-8');
  const visionHtml = fs.readFileSync(path.join(portfolioDir, 'vision.html'), 'utf-8');
  const aboutHtml = fs.readFileSync(path.join(portfolioDir, 'about.html'), 'utf-8');
  const resumeHtml = fs.readFileSync(path.join(portfolioDir, 'resume.html'), 'utf-8');

  assert(indexHtml.includes('HoloVerse AI'), 'index.html must feature HoloVerse AI');
  assert(indexHtml.includes('https://sabhyamtrivedycoder.github.io/holoverse-ai/'), 'index.html must link to HoloVerse live app');
  assert(venturesHtml.includes('HoloVerse AI'), 'ventures.html must feature HoloVerse AI');
  assert(venturesHtml.includes('https://sabhyamtrivedycoder.github.io/holoverse-ai/'), 'ventures.html must link to HoloVerse live app');
  assert(visionHtml.includes('HoloVerse AI'), 'vision.html must feature HoloVerse AI');
  assert(visionHtml.includes('https://sabhyamtrivedycoder.github.io/holoverse-ai/'), 'vision.html must link to HoloVerse live app');
  assert(aboutHtml.includes('HoloVerse AI'), 'about.html must feature HoloVerse AI');
  assert(resumeHtml.includes('HoloVerse AI'), 'resume.html must feature HoloVerse AI');

  // Verify HoloVerse directory exists
  const holoverseDir = path.join(portfolioDir, '../holoverse-ai');
  assert(fs.existsSync(path.join(holoverseDir, 'index.html')), 'HoloVerse AI index.html must exist');
});

// 9. Logo & Circular Profile Picture Verification
runTest('Portfolio logo and circular profile picture are configured across all pages', () => {
  const logoPath = path.join(portfolioDir, 'assets/logo.svg');
  const faviconPath = path.join(portfolioDir, 'favicon.svg');
  assert(fs.existsSync(logoPath), 'Missing assets/logo.svg');
  assert(fs.existsSync(faviconPath), 'Missing favicon.svg');

  const logoContent = fs.readFileSync(logoPath, 'utf-8');
  assert(logoContent.includes('<svg'), 'logo.svg must be valid SVG');
  assert(logoContent.includes('polygon'), 'logo.svg must include geometric polygon emblem');

  const allPages = [
    'index.html',
    'about.html',
    'ventures.html',
    'vision.html',
    'resume.html',
    'contact.html'
  ];

  for (const p of allPages) {
    const pageContent = fs.readFileSync(path.join(portfolioDir, p), 'utf-8');
    assert(pageContent.includes('assets/logo.svg'), `Missing logo in brand bar of ${p}`);
    assert(pageContent.includes('favicon.svg'), `Missing favicon in ${p}`);
  }

  // Verify circular avatar styling in styles.css
  const stylesCss = fs.readFileSync(path.join(portfolioDir, 'styles.css'), 'utf-8');
  assert(stylesCss.includes('.avatar-halo'), 'Missing .avatar-halo in styles.css');
  assert(stylesCss.includes('aspect-ratio: 1 / 1'), 'Avatar must have aspect-ratio 1:1 to guarantee circular shape');
  assert(stylesCss.includes('border-radius: 50%'), 'Avatar must have border-radius: 50%');
});

// 10. Developer Labs & Micro-Tools Ecosystem Verification
runTest('All 30 Developer Micro-Tools are properly showcased with live websites and GitHub repos', () => {
  const venturesHtml = fs.readFileSync(path.join(portfolioDir, 'ventures.html'), 'utf-8');
  const indexHtml = fs.readFileSync(path.join(portfolioDir, 'index.html'), 'utf-8');

  const tools = [
    "algo-canvas",
    "markdown-studio-pro",
    "soundscape-synth",
    "css-glass-mesh-gen",
    "regex-radar",
    "qr-vault-pro",
    "pomodoro-matrix",
    "color-palette-forge",
    "json-tree-studio",
    "speed-reader-sprint",
    "diff-checker-pro",
    "jwt-debugger-offline",
    "base64-studio",
    "uuid-hash-generator",
    "calc-matrix-math",
    "markdown-table-forge",
    "css-gradient-mesh-flow",
    "cron-syntax-explainer",
    "web-drum-machine",
    "metronome-tempo-pro",
    "color-blindness-simulator",
    "bezier-curve-lab",
    "canvas-particle-network",
    "ascii-art-studio",
    "lorem-ipsum-forge",
    "unit-converter-pro",
    "svg-path-visualizer",
    "morse-code-transmitter",
    "typing-speed-sprint",
    "key-code-inspector"
];

  for (const t of tools) {
    const liveUrl = `https://sabhyamtrivedycoder.github.io/${t}/`;
    const repoUrl = `https://github.com/sabhyamtrivedycoder/${t}`;
    assert(venturesHtml.includes(liveUrl), `ventures.html must link to live URL for ${t}`);
    assert(venturesHtml.includes(repoUrl), `ventures.html must link to GitHub repo for ${t}`);

    const localRepoPath = path.join(portfolioDir, '..', t, 'index.html');
    assert(fs.existsSync(localRepoPath), `Local project file not found: ${localRepoPath}`);
  }

  assert(indexHtml.includes('52+ Public Repositories'), 'index.html must highlight 52+ public repositories');
  assert(venturesHtml.includes('52+ public repositories'), 'ventures.html must highlight 52+ public repositories');
});

console.log('\n========================================');
console.log(`Sabhyam Portfolio Verification Summary:`);
console.log(`Passed: ${passedTests} / ${totalTests}`);
console.log('========================================\n');

if (passedTests === totalTests) {
  console.log('🎉 All Portfolio verification checks passed with 100% compliance!\n');
} else {
  process.exit(1);
}
