// Render Loop brand assets for the mobile app from the boomerang mark
// (same geometry as didi/docker/branding/assets/loop-icon.svg, 40x40 grid).
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

// Usage: cd branding && npm i --no-save @resvg/resvg-js && node render-assets.js ..
const OUT = process.argv[2] || path.join(__dirname, '..');
const INDIGO = '#6366F1';

// Boomerang mark on a 40x40 grid, white. `s` scales the whole group, `tx/ty` translate.
const mark = (fill, s, tx, ty) => `
  <g transform="translate(${tx} ${ty}) scale(${s})" fill="${fill}">
    <rect x="10.6" y="7" width="5.6" height="19" rx="2.8" transform="rotate(18 13 26)"/>
    <rect x="13" y="23.2" width="19" height="5.6" rx="2.8" transform="rotate(-18 13 26)"/>
  </g>`;

// Measured bbox of the mark in the 40-grid: x 11.4..31.1, y 7.9..27.9 (≈19.9 wide, centre 21.25, 17.9).
// `frac` = width of the mark as a fraction of the canvas.
const centred = (fill, size, frac) => {
  const s = (size * frac) / 19.9;
  return mark(fill, s, size / 2 - 21.25 * s, size / 2 - 17.9 * s);
};

const svgs = {
  // iOS/App-store icon: full-bleed square (system applies the mask)
  'assets/icon.png': `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <rect width="1024" height="1024" fill="${INDIGO}"/>${centred('#ffffff', 1024, 0.54)}</svg>`,

  // Android adaptive foreground: transparent, artwork inside the centre safe zone
  'assets/adaptive-icon.png': `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    ${centred('#ffffff', 1024, 0.38)}</svg>`,

  // Splash: white ground, rounded badge centred (matches loop-icon.svg)
  'assets/splash.png': `<svg xmlns="http://www.w3.org/2000/svg" width="1284" height="2778" viewBox="0 0 1284 2778">
    <rect width="1284" height="2778" fill="#ffffff"/>
    <g transform="translate(${642 - 130} ${1389 - 130})">
      <rect width="260" height="260" rx="65" fill="${INDIGO}"/>${centred('#ffffff', 260, 0.54)}
    </g></svg>`,

  // Login screen logo (rendered at 40x40 dp)
  'src/assets/images/logo.png': `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
    <rect width="144" height="144" rx="36" fill="${INDIGO}"/>${centred('#ffffff', 144, 0.54)}</svg>`,
};

for (const [rel, svg] of Object.entries(svgs)) {
  const png = new Resvg(svg, { fitTo: { mode: 'original' } }).render().asPng();
  const dest = path.join(OUT, rel);
  fs.writeFileSync(dest, png);
  console.log(rel, png.length, 'bytes');
}
