/**
 * Sabhaym Trivedi 3D Immersive Portfolio Test Suite
 * Verifies 3D structure, asset integrity, book matrix, mascot companion dock, and strict constraints.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('[TEST] Running 3D Portfolio Verification Suite...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    process.exitCode = 1;
  }
}

const portfolioDir = __dirname;
const indexHtml = fs.readFileSync(path.join(portfolioDir, 'index.html'), 'utf-8');
const stylesCss = fs.readFileSync(path.join(portfolioDir, 'styles.css'), 'utf-8');
const appJs = fs.readFileSync(path.join(portfolioDir, 'app.js'), 'utf-8');
const mascotJs = fs.readFileSync(path.join(portfolioDir, 'assets/mascot.js'), 'utf-8');

// 1. Identity Verification
runTest('Identity matches Sabhaym Trivedi and sabhyamtrivedy@gmail.com', () => {
  assert(indexHtml.includes('Sabhaym Trivedi'), 'Must include Sabhaym Trivedi');
  assert(indexHtml.includes('sabhyamtrivedy@gmail.com'), 'Must include sabhyamtrivedy@gmail.com');
  assert(indexHtml.includes('mailto:sabhyamtrivedy@gmail.com'), 'Must have mailto link');
});

// 2. Bookshelf Matrix: Exactly 3 books
runTest('Bookshelf contains exactly 3 books: Steve Jobs, Zero to One, Build Don\'t Talk', () => {
  assert(indexHtml.includes('book-steve-jobs'), 'Must include Steve Jobs');
  assert(indexHtml.includes('book-zero-to-one'), 'Must include Zero to One');
  assert(indexHtml.includes('book-build-dont-talk'), 'Must include Build Don\'t Talk');

  assert(!indexHtml.includes('The Mom Test'), 'Must NOT include The Mom Test');
  assert(!indexHtml.includes('Refactoring UI'), 'Must NOT include Refactoring UI');
  assert(!appJs.includes('the-mom-test'), 'app.js must not contain the-mom-test');
  assert(!appJs.includes('refactoring-ui'), 'app.js must not contain refactoring-ui');
});

// 3. Strict Exclusion Constraints
runTest('Exclusions: No HoloVerse AI, No Virtual Try-On, No "inspired by"', () => {
  assert(!indexHtml.toLowerCase().includes('holoverse'), 'Must not include HoloVerse');
  assert(!indexHtml.toLowerCase().includes('virtual try-on'), 'Must not include Virtual Try-On');
  assert(!indexHtml.toLowerCase().includes('inspired by'), 'Must not include inspired by');
  assert(!appJs.toLowerCase().includes('inspired by'), 'app.js must not include inspired by');
});

// 4. Mascot Companion Dock & Interactive Elements
runTest('Mascot Companion Dock and Speech Bubble configured', () => {
  assert(indexHtml.includes('mascot-companion-stage'), 'Must include companion stage');
  assert(indexHtml.includes('mascot-speech-bubble'), 'Must include speech bubble');
  assert(indexHtml.includes('mascot-cloud-base'), 'Must include cloud island base');
  assert(indexHtml.includes('mascot-action-chips'), 'Must include emotion trigger chips');
  assert(mascotJs.includes('triggerMascotEmotion'), 'Mascot JS must expose emotion trigger');
});

// 5. Asset Existence
runTest('All required 3D Framer and Book assets exist on disk', () => {
  const requiredAssets = [
    'assets/framer/balloon.png',
    'assets/framer/cloud3.webp',
    'assets/framer/purple-mist.webp',
    'assets/framer/middle-land.png',
    'assets/framer/front-grass.png',
    'assets/framer/butterflies.png',
    'assets/books/steve-jobs.jpg',
    'assets/books/zero-to-one-cover.png',
    'assets/books/build-dont-talk-cover.png',
    'assets/mascots/sabhyam-directions.webp',
    'assets/mascots/sabhyam-reactions.webp'
  ];

  for (const asset of requiredAssets) {
    const fullPath = path.join(portfolioDir, asset);
    assert(fs.existsSync(fullPath), `Missing asset: ${asset}`);
    assert(fs.statSync(fullPath).size > 1000, `Asset is suspiciously small: ${asset}`);
  }
});

// 6. Zero Emojis Constraint
runTest('Strict zero emojis check across HTML, CSS, JS, and Markdown', () => {
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  const filesToCheck = [indexHtml, stylesCss, appJs, mascotJs];
  for (const content of filesToCheck) {
    assert(!emojiRegex.test(content), 'Emoji found in codebase!');
  }
});

console.log(`\n[RESULTS] ${passedTests}/${totalTests} tests passed.\n`);
