/**
 * Sabhaym Trivedi Editorial Scrapbook & Portfolio Test Suite
 * Verifies clean URLs (zero .html in links), asset integrity, book matrix, and strict constraints.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('[TEST] Running Sabhaym Portfolio Verification Suite...\n');

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

// 2. Clean URLs (Zero .html in navigation or internal links)
runTest('Clean URLs: Never show .html in navigation or internal links', () => {
  // Extract all href attributes
  const hrefMatches = indexHtml.match(/href=["'](.*?)["']/g) || [];
  for (const m of hrefMatches) {
    const val = m.replace(/href=["']|["']/g, '');
    if (val.startsWith('#') || val.startsWith('mailto:') || val.startsWith('https://') || val.startsWith('http://')) {
      // Valid clean anchor, mailto, or external link
      continue;
    }
    assert(!val.includes('.html'), `Found forbidden .html in link: ${val}`);
  }
  // Verify root index has no link to vision.html, about.html, etc.
  assert(!indexHtml.includes('vision.html'), 'Must not link to vision.html');
  assert(!indexHtml.includes('about.html'), 'Must not link to about.html');
  assert(!indexHtml.includes('contact.html'), 'Must not link to contact.html');
});

// 3. Bookshelf Matrix: Exactly 3 books
runTest('Bookshelf contains exactly 3 books: Steve Jobs, Zero to One, Build Don\'t Talk', () => {
  assert(indexHtml.includes('book-steve-jobs'), 'Must include Steve Jobs');
  assert(indexHtml.includes('book-zero-to-one'), 'Must include Zero to One');
  assert(indexHtml.includes('book-build-dont-talk'), 'Must include Build Don\'t Talk');

  assert(!indexHtml.includes('The Mom Test'), 'Must NOT include The Mom Test');
  assert(!indexHtml.includes('Refactoring UI'), 'Must NOT include Refactoring UI');
  assert(!appJs.includes('the-mom-test'), 'app.js must not contain the-mom-test');
  assert(!appJs.includes('refactoring-ui'), 'app.js must not contain refactoring-ui');
});

// 4. Strict Exclusion Constraints
runTest('Exclusions: No HoloVerse AI, No Virtual Try-On, No "inspired by"', () => {
  assert(!indexHtml.toLowerCase().includes('holoverse'), 'Must not include HoloVerse');
  assert(!indexHtml.toLowerCase().includes('virtual try-on'), 'Must not include Virtual Try-On');
  assert(!indexHtml.toLowerCase().includes('inspired by'), 'Must not include inspired by');
  assert(!appJs.toLowerCase().includes('inspired by'), 'app.js must not include inspired by');
});

// 5. Nikul Scrapbook Features Integration
runTest('Nikul Scrapbook Features: Vector Box, Washi Tape, Equalizer, Marquee, Idea Notebook', () => {
  assert(indexHtml.includes('vector-box'), 'Must include vector-box');
  assert(indexHtml.includes('vector-handle'), 'Must include vector-handle');
  assert(indexHtml.includes('washi-tape'), 'Must include washi-tape');
  assert(indexHtml.includes('portrait-eq-strip'), 'Must include portrait-eq-strip');
  assert(indexHtml.includes('animate-marquee-track'), 'Must include animate-marquee-track');
  assert(indexHtml.includes('notebook-idea-title'), 'Must include notebook-idea-title');
  assert(appJs.includes('toggleMicrophone'), 'Must include toggleMicrophone');
  assert(appJs.includes('cycleNotebookIdea'), 'Must include cycleNotebookIdea');
});

// 6. Strict Zero Emojis Constraint
runTest('Strict zero emojis check across HTML, CSS, JS, and Markdown', () => {
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  const filesToCheck = [indexHtml, stylesCss, appJs, mascotJs];
  for (const content of filesToCheck) {
    assert(!emojiRegex.test(content), 'Emoji found in codebase!');
  }
});

console.log(`\n[RESULTS] ${passedTests}/${totalTests} tests passed.\n`);
