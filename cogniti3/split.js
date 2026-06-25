/**
 * split.js — one-time: extract index-v1.html → cogniti3/partials/*
 * After this runs, edit partials individually and run build.js to rebuild.
 */
const fs   = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'index-v1.html');
const src     = fs.readFileSync(srcPath, 'utf8');
const lines   = src.split('\n');
const total   = lines.length;
console.log(`Source: index-v1.html (${total} lines)`);

const dir = path.join(__dirname, 'partials');
fs.mkdirSync(dir, { recursive: true });

// Blank lines between sections belong to the NEXT section (leading whitespace).
// Each boundary: prev.to + 1 === next.from (no gaps, no overlaps).
const PARTS = [
  { file: '_01-head.html',            from: 1,    to: 17   }, // DOCTYPE → importmap
  { file: '_02-styles.html',          from: 18,   to: 1589 }, // <style>…</style></head>
  { file: '_03-body-shared.html',     from: 1590, to: 1609 }, // <body> + cursor/scanlines/shared
  { file: 'section-1.html',           from: 1610, to: 1653 }, // Phase 1: logo intro + ring
  { file: 'section-2-hero.html',      from: 1654, to: 2098 }, // Phase 2: hero
  { file: 'section-2-manifesto.html', from: 2099, to: 2122 }, // Section 2: manifesto
  { file: 'section-3.html',           from: 2123, to: 2146 }, // Section 3: challenge
  { file: 'section-4.html',           from: 2147, to: 2200 }, // Section 4: shift
  { file: '_04-cdn-scripts.html',     from: 2201, to: 2203 }, // CDN <script> tags
  { file: '_05-main-js.html',         from: 2204, to: 3241 }, // Main inline script
  { file: 'section-5.html',           from: 3242, to: 3670 }, // Section 5: Three.js module + HTML
  { file: 'section-6.html',           from: 3671, to: 4177 }, // Section 6: HTML + Three.js module
  { file: 'section-7.html',           from: 4178, to: 4546 }, // Section 7: Philosophy HTML + script
  { file: 'section-8.html',           from: 4547, to: 5010 }, // Section 8: Careers HTML + style + script
  { file: 'section-9.html',           from: 5011, to: 5450 }, // Section 9: Contact HTML + style + script
  { file: '_06-close.html',           from: 5451, to: total}, // </body></html>
];

// Sanity check: no gaps
let prevEnd = 0;
for (const p of PARTS) {
  if (p.from !== prevEnd + 1) {
    console.error(`  ✗ Gap: lines ${prevEnd + 1}–${p.from - 1} unassigned!`);
    process.exit(1);
  }
  prevEnd = p.to;
}

for (const { file, from, to } of PARTS) {
  const content = lines.slice(from - 1, to).join('\n');
  fs.writeFileSync(path.join(dir, file), content, 'utf8');
  const n = to - from + 1;
  console.log(`  ✓ ${file.padEnd(35)} lines ${String(from).padStart(4)}–${to}  (${n})`);
}

console.log(`\nSplit complete → ${PARTS.length} partials in cogniti3/partials/`);
console.log('Run `node cogniti3/build.js` to reassemble index-v1.html.');
