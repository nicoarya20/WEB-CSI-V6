/**
 * build.js — concatenate cogniti3/partials/* → index-v1.html
 * Usage: node cogniti3/build.js
 */
const fs   = require('fs');
const path = require('path');

const ORDER = [
  '_01-head.html',
  '_02-styles.html',
  '_03-body-shared.html',
  'section-1.html',
  'section-2-hero.html',
  'section-2-manifesto.html',
  'section-3.html',
  'section-4.html',
  '_04-cdn-scripts.html',
  '_05-main-js.html',
  'section-5.html',
  'section-6.html',
  'section-7.html',
  'section-8.html',
  'section-9.html',
  '_06-close.html',
];

const dir = path.join(__dirname, 'partials');
const parts = ORDER.map(f => {
  const fp = path.join(dir, f);
  if (!fs.existsSync(fp)) throw new Error(`Missing partial: ${f}`);
  return fs.readFileSync(fp, 'utf8');
});

const output   = parts.join('\n');
const outPath  = path.join(__dirname, 'index-v1.html');
fs.writeFileSync(outPath, output, 'utf8');

const lineCount = output.split('\n').length;
console.log(`✓ Built index-v1.html (${lineCount} lines) from ${ORDER.length} partials`);
