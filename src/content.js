// content.js — all six missions, in English, with the real story beats.

// ---------------------------------------------------------------------------
// Card-page drawings — each chapter has a tiny procedural illustration that
// shows up framed on the card page.  The canvas is 256x176, pixelated.
// ---------------------------------------------------------------------------

function _drawBg(ctx, fill) {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, 256, 176);
}
function _px(ctx, color, x, y, w = 1, h = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Chapter I — A back room at Balagan: couch against the wall, staircase
// behind, two small figures.
function drawCardBalagan(canvas) {
  const ctx = canvas.getContext('2d');
  _drawBg(ctx, '#1a1a20');
  // Back wall (stone grey)
  _px(ctx, '#40434a', 0, 0, 256, 70);
  // Staircase (diagonal bands)
  for (let i = 0; i < 6; i++) {
    _px(ctx, '#2a2c32', 100 + i * 10, 20 + i * 6, 40, 6);
  }
  // Couch
  _px(ctx, '#0c0c10', 40, 80, 180, 40);
  _px(ctx, '#22222a', 44, 84, 172, 12);
  // Aida on couch (left)
  _px(ctx, '#120809', 100, 62, 14, 14); // hair
  _px(ctx, '#c99070', 102, 70, 10, 8);  // face
  _px(ctx, '#1a1a20', 96, 78, 20, 28);  // dress
  // David standing right
  _px(ctx, '#2a1510', 150, 64, 12, 12); // hair
  _px(ctx, '#c19270', 152, 72, 8, 8);   // face
  _px(ctx, '#e8e2d6', 146, 80, 18, 22); // white shirt
  _px(ctx, '#2a2a2a', 148, 102, 14, 20); // pants
  // Smoke curls from ashtray
  for (let i = 0; i < 3; i++) {
    _px(ctx, '#a0a0a0', 210 + i * 2, 90 - i * 6, 2, 2);
  }
}

// Chapter II — NYE: big clock at top, silver pants under confetti.
function drawCardNYE(canvas) {
  const ctx = canvas.getContext('2d');
  _drawBg(ctx, '#0c0818');
  // Confetti
  const colors = ['#ff88d4', '#66ddff', '#ffd04a', '#c88aff', '#4aff6a'];
  for (let i = 0; i < 60; i++) {
    _px(ctx, colors[i % 5],
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 120),
      2, 2);
  }
  // Big TV projection with "2025" at the top
  _px(ctx, '#181820', 40, 10, 176, 48);
  _px(ctx, '#c88aff', 44, 14, 168, 40);
  _px(ctx, '#0a0a12', 48, 18, 160, 32);
  ctx.fillStyle = '#ffd04a';
  ctx.font = 'bold 26px "Press Start 2P", monospace';
  ctx.textBaseline = 'top';
  ctx.fillText('2025', 70, 22);
  // Silver-pants David dancing
  _px(ctx, '#2a1510', 100, 72, 14, 14);
  _px(ctx, '#c19270', 102, 80, 10, 8);
  _px(ctx, '#181818', 96, 88, 22, 24); // t-shirt
  _px(ctx, '#c8c8d8', 98, 110, 18, 26); // SILVER pants
  _px(ctx, '#ffffff', 102, 114, 2, 12); // silver shine
  // Aida
  _px(ctx, '#120809', 138, 72, 14, 16);
  _px(ctx, '#c99070', 140, 82, 10, 8);
  _px(ctx, '#b2184f', 134, 90, 22, 26); // sweater colors
  _px(ctx, '#e0a000', 134, 94, 22, 4);
  _px(ctx, '#4a2090', 134, 102, 22, 4);
  _px(ctx, '#1a1a20', 136, 116, 18, 20);
}

// Chapter III — Lisa's place: dark couch, red lamp in the corner.
function drawCardLisa(canvas) {
  const ctx = canvas.getContext('2d');
  _drawBg(ctx, '#0d0509');
  // Red rug
  _px(ctx, '#3d0e1a', 40, 120, 176, 40);
  _px(ctx, '#521628', 44, 124, 168, 32);
  // Black couch
  _px(ctx, '#151117', 50, 70, 140, 50);
  _px(ctx, '#221621', 52, 72, 136, 10);
  // Red lamp on right
  _px(ctx, '#6a4a22', 210, 130, 6, 30);
  _px(ctx, '#ff5a30', 200, 90, 26, 40);
  _px(ctx, '#f8c850', 206, 96, 14, 24);
  // Two silhouettes on couch
  _px(ctx, '#120809', 90, 60, 12, 12);
  _px(ctx, '#c99070', 92, 68, 8, 6);
  _px(ctx, '#2a1510', 140, 60, 12, 12);
  _px(ctx, '#c19270', 142, 68, 8, 6);
  // Wine bottle
  _px(ctx, '#0a0a0a', 118, 120, 4, 16);
  _px(ctx, '#7a1a2c', 115, 100, 10, 20);
}

// Chapter III½ — Restaurant dinner: long table, shot glasses, blushing faces.
function drawCardRestaurant(canvas) {
  const ctx = canvas.getContext('2d');
  _drawBg(ctx, '#2a1510');
  // Table
  _px(ctx, '#5a3a20', 20, 70, 216, 50);
  _px(ctx, '#f2dcad', 24, 74, 208, 8);  // tablecloth
  // Shot glasses
  for (let i = 0; i < 5; i++) {
    _px(ctx, '#eaf0ff', 44 + i * 40, 64, 8, 10);
    _px(ctx, '#ffffff', 46 + i * 40, 64, 4, 2);
  }
  // Two figures on the LEFT side of the table (Aida + David seated)
  _px(ctx, '#120809', 66, 30, 14, 14);
  _px(ctx, '#c99070', 68, 40, 10, 8);
  _px(ctx, '#d03030', 66, 46, 14, 18); // blush-red top (fever)
  _px(ctx, '#2a1510', 98, 30, 12, 12);
  _px(ctx, '#c19270', 100, 38, 8, 8);
  _px(ctx, '#e8e2d6', 94, 46, 18, 18);
  // Two figures RIGHT (Lisa + Katya)
  _px(ctx, '#2d1418', 152, 32, 12, 12);
  _px(ctx, '#c99070', 154, 42, 8, 8);
  _px(ctx, '#2d1418', 182, 32, 12, 12);
  _px(ctx, '#c99070', 184, 42, 8, 8);
}

// Chapter IV — Pharmacy walk: brick buildings, streetlamp, snow falling.
function drawCardPharmacy(canvas) {
  const ctx = canvas.getContext('2d');
  _drawBg(ctx, '#0c1224');
  // Buildings (top half)
  _px(ctx, '#6a2a22', 0, 0, 256, 80);
  // Windows glowing
  for (let i = 0; i < 6; i++) {
    _px(ctx, '#f7c24a', 14 + i * 40, 16, 12, 10);
    _px(ctx, '#f7c24a', 22 + i * 40, 40, 8, 8);
  }
  // Door with "13"
  _px(ctx, '#3a240d', 200, 30, 36, 50);
  ctx.fillStyle = '#f7c24a';
  ctx.font = 'bold 12px "Press Start 2P", monospace';
  ctx.fillText('13', 210, 50);
  // Sidewalk
  _px(ctx, '#5a6070', 0, 100, 256, 76);
  _px(ctx, '#e8eef4', 0, 100, 256, 4);
  // Streetlamp
  _px(ctx, '#2e323a', 100, 80, 4, 40);
  _px(ctx, '#fff2c8', 90, 74, 24, 12);
  // Snow
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 30; i++) {
    _px(ctx, '#ffffff',
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 176),
      1, 1);
  }
  // Two small figures walking
  _px(ctx, '#120809', 130, 110, 12, 12);
  _px(ctx, '#c99070', 132, 120, 8, 6);
  _px(ctx, '#b2184f', 128, 128, 16, 20);
  _px(ctx, '#2a1510', 154, 110, 10, 10);
  _px(ctx, '#c19270', 156, 118, 6, 6);
  _px(ctx, '#e8e2d6', 150, 124, 14, 20);
}

// Chapter V — Fever: a phone with hearts floating above it.
function drawCardFever(canvas) {
  const ctx = canvas.getContext('2d');
  _drawBg(ctx, '#2a1510');
  // Large phone silhouette
  _px(ctx, '#0a0a0a', 80, 20, 96, 140);
  _px(ctx, '#e8eef4', 86, 30, 84, 120);
  // Text messages
  _px(ctx, '#c88aff', 92, 40, 50, 12);
  _px(ctx, '#ffffff', 118, 56, 50, 12);
  _px(ctx, '#c88aff', 92, 72, 60, 12);
  _px(ctx, '#ffffff', 110, 88, 58, 12);
  _px(ctx, '#c88aff', 92, 104, 44, 12);
  // Hearts above
  const hs = '#c88aff';
  for (let i = 0; i < 5; i++) {
    const x = 30 + i * 48;
    const y = 10 + (i % 2) * 6;
    _px(ctx, hs, x - 4, y - 2, 3, 3);
    _px(ctx, hs, x + 1, y - 2, 3, 3);
    _px(ctx, hs, x - 3, y + 1, 7, 3);
    _px(ctx, hs, x - 1, y + 4, 3, 2);
  }
}

// Chapter VI — Mo Bar: mirrored bar, one DJ, colored spotlights.
function drawCardMoBar(canvas) {
  const ctx = canvas.getContext('2d');
  _drawBg(ctx, '#0c1224');
  // Colored spotlights
  const cols = ['rgba(255, 136, 212, 0.45)', 'rgba(102, 221, 255, 0.35)', 'rgba(200, 138, 255, 0.4)'];
  cols.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(40 + i * 90, 40, 40, 0, Math.PI * 2);
    ctx.fill();
  });
  // Bar counter
  _px(ctx, '#3a2a20', 0, 110, 256, 66);
  _px(ctx, '#1a0e06', 0, 110, 256, 6);
  // Disco ball (top right)
  _px(ctx, '#b2b2b8', 200, 14, 30, 30);
  _px(ctx, '#ffffff', 204, 18, 6, 6);
  _px(ctx, '#ffffff', 218, 24, 4, 4);
  _px(ctx, '#ffffff', 210, 30, 4, 4);
  _px(ctx, '#5a5a62', 212, 2, 6, 16);
  // Table with two glasses
  _px(ctx, '#1a0e06', 100, 86, 56, 24);
  _px(ctx, '#8a5a1c', 104, 86, 48, 4);
  _px(ctx, '#d4a24a', 112, 70, 8, 18);
  _px(ctx, '#d4a24a', 136, 70, 8, 18);
  // Two figures at the table
  _px(ctx, '#120809', 80, 68, 14, 14);
  _px(ctx, '#c99070', 82, 76, 10, 8);
  _px(ctx, '#2a1510', 160, 68, 14, 14);
  _px(ctx, '#c19270', 162, 76, 10, 8);
}

// Chapter VII — His apartment: piano + Christmas tree + guitar on couch.
function drawCardApartment(canvas) {
  const ctx = canvas.getContext('2d');
  _drawBg(ctx, '#e8dec4');
  // Wooden floor
  _px(ctx, '#b78f5c', 0, 110, 256, 66);
  _px(ctx, '#d2ae7c', 0, 110, 256, 4);
  // Oriental rug
  _px(ctx, '#c9b38c', 60, 120, 140, 44);
  _px(ctx, '#a02e38', 62, 122, 136, 4);
  _px(ctx, '#a02e38', 62, 158, 136, 4);
  // Piano on the left
  _px(ctx, '#1a0e06', 16, 30, 76, 70);
  _px(ctx, '#f4efe4', 22, 80, 64, 10);
  for (let i = 0; i < 6; i++) _px(ctx, '#2a1a0a', 28 + i * 10, 82, 2, 7);
  // Christmas tree right
  _px(ctx, '#2a4a3a', 200, 20, 40, 24);
  _px(ctx, '#3a6a4a', 198, 40, 44, 20);
  _px(ctx, '#2a4a3a', 196, 58, 48, 18);
  _px(ctx, '#3a2410', 214, 76, 12, 14);
  // Christmas lights
  ['#ff5a30', '#f7c24a', '#66ddff', '#c88aff'].forEach((c, i) => {
    _px(ctx, c, 208 + i * 8, 30 + (i % 2) * 8, 2, 2);
    _px(ctx, c, 202 + i * 10, 50 - (i % 2) * 6, 2, 2);
  });
  // Navy couch with guitar
  _px(ctx, '#141a2c', 110, 60, 80, 44);
  _px(ctx, '#1e2a46', 112, 62, 76, 12);
  // Guitar silhouette
  _px(ctx, '#3a240d', 130, 70, 10, 36);
  _px(ctx, '#8a5a1c', 126, 88, 18, 18);
  _px(ctx, '#3a240d', 130, 106, 10, 4);
}

// Chapter X — The Knock: closed door with a sliver of red light.
function drawCardKnock(canvas) {
  const ctx = canvas.getContext('2d');
  _drawBg(ctx, '#050305');
  // Wall
  _px(ctx, '#0d0509', 0, 0, 256, 176);
  // Door
  _px(ctx, '#3a240d', 80, 30, 96, 140);
  _px(ctx, '#6a4020', 84, 34, 88, 132);
  _px(ctx, '#3a240d', 86, 36, 84, 128);
  // Handle
  _px(ctx, '#c89a3e', 160, 100, 4, 4);
  // Red light sliver from under the door
  _px(ctx, '#d42a4e', 80, 168, 96, 2);
  // Shadowy silhouette (monster)
  _px(ctx, '#050305', 102, 40, 52, 120);
  // Glowing eyes
  _px(ctx, '#f8f8d0', 114, 76, 4, 4);
  _px(ctx, '#f8f8d0', 136, 76, 4, 4);
}

// Final card — a big heart with "Aida" in it.
function drawCardFinale(canvas) {
  const ctx = canvas.getContext('2d');
  _drawBg(ctx, '#f7e0f2');
  ctx.fillStyle = '#c88aff';
  const cx = 128, cy = 88, s = 18;
  ctx.fillRect(cx - s * 2, cy - s, s * 2, s);
  ctx.fillRect(cx, cy - s, s * 2, s);
  ctx.fillRect(cx - s * 2 + 1, cy, s * 4 - 2, s);
  ctx.fillRect(cx - s * 2 + 3, cy + s, s * 4 - 6, s);
  ctx.fillRect(cx - s, cy + s * 2, s * 2, s);
  // Name inside
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Press Start 2P", monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('AIDA', cx, cy + 8);
}


const F = 'apt.floor';
const F2 = 'apt.floor-alt';
const W = 'apt.wall';
const R = 'apt.rug';
const P1 = 'apt.piano-tl';
const LT = 'apt.lamp-top';
const LB = 'apt.lamp-bot';
const XT = 'apt.xmas-top';
const XB = 'apt.xmas-bot';
const PT = 'apt.painting';
const KA = 'apt.katana';
const RC = 'apt.record';
const TVT = 'apt.tv-top';
const TVB = 'apt.tv-bot';
const CB = 'apt.cabinet';
const AL = 'apt.arch-l';
const AR = 'apt.arch-r';
// Navy damask couches — matching the real apartment photos.
const CCL = 'apt.couch-l';
const CCC = 'apt.couch-c';
const CCR = 'apt.couch-r';
const CVT = 'apt.couch-vt';
const CVC = 'apt.couch-vc';
const CVB = 'apt.couch-vb';
const CH  = 'apt.chair';

const CF = 'club.floor';
const CS = 'club.stair';
const CW = 'club.wall';
const CL = 'club.couch-l';
const CR = 'club.couch-r';
const CT = 'club.table';
const CC = 'club.chair';
const CK = 'club.clock';
const CBC = 'club.bar-counter';
const CBS = 'club.bar-back';

// Balagan back room — cold-grey, white walls, dark floor, stairs at top.
const BLF = 'bal.floor';
const BLW = 'bal.wall';
const BLS = 'bal.stair';
const BLCL = 'bal.couch-l';
const BLCC = 'bal.couch-c';
const BLCR = 'bal.couch-r';
const BLA = 'bal.ashtray';
const BLH = 'bal.chair'; // (H)armchair

const BF = 'bar.floor';
const BW = 'bar.wall';
const BM = 'bar.mirror';
const BB = 'bar.booth';
const BT = 'bar.table';
const BC = 'bar.chair';
const BD = 'bar.dj';
const BG = 'bar.globe';

const SF = 'sick.floor';
const SW = 'sick.wall';
const SB = 'sick.bed-l';
const DW = 'apt.wall'; // divider wall for split-screen
const DF = 'apt.floor'; // David's room floor
// David's bedroom — dark-wood-frame bed, grey-blue bedding.
const DBH = 'apt.bed-head';
const DBB = 'apt.bed-body';
const DBF = 'apt.bed-foot';
const DNS = 'apt.nightstand';
const DBS = 'apt.bookshelf';

// ---------------------------------------------------------------------------
// Shared apartment layout — Missions 5 & 6
// ---------------------------------------------------------------------------

function apartmentMap() {
  // David's place, matched to the real photos:
  //   - piano at the TOP-CENTRE  (cols 8-9, row 0)
  //   - a big lamp next to the piano (col 12)
  //   - a Christmas tree blinking upper-right (col 16)
  //   - flatscreen TV on wheels on the LEFT (col 1, row 6), facing the rug
  //   - a vertical NAVY damask couch on the RIGHT (col 17, rows 5-7),
  //     across from the TV  — where they sit to listen to guitar
  //   - a second NAVY damask couch at the BOTTOM (row 11, cols 6-9),
  //     across from the piano
  //   - a wooden CHAIR next to the piano (col 10, row 1) — gets pulled closer
  //   - katana + cabinet keep their old corners
  return [
    [W,   W,   W,   W,   W,   W,   PT,  W,   P1,  P1,  W,   W,   LT,  W,   W,   W,   W,   W,   W,   W ],
    [W,   F,   F,   F,   F,   F,   F,   F,   F,   F,   CH,  F,   LB,  F,   F,   F,   XT,  F,   F,   W ],
    [W,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   XB,  F,   F,   W ],
    [W,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   W ],
    [W,   F,   F,   F,   R,   R,   R,   R,   R,   R,   R,   R,   F,   F,   F,   F,   F,   F,   F,   W ],
    [W,   TVT, F,   F,   R,   R,   R,   R,   R,   R,   R,   R,   F,   F,   F,   F,   F,   CVT, F,   W ],
    [AL,  TVB, F,   F,   R,   R,   R,   R,   R,   R,   R,   R,   F,   F,   F,   F,   F,   CVC, F,   W ],
    [F,   F,   F,   F,   R,   R,   R,   R,   R,   R,   R,   R,   F,   F,   F,   F,   F,   CVB, F,   W ],
    [F,   F,   F,   F,   R,   R,   R,   R,   R,   R,   R,   R,   F,   F,   F,   F,   KA,  F,   F,   W ],
    [AR,  F,   F,   F,   R,   R,   R,   R,   R,   R,   R,   R,   F,   F,   F,   F,   CB,  F,   F,   W ],
    [W,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   W ],
    [W,   F,   F,   F,   F,   F,   CCL, CCC, CCC, CCR, F,   F,   F,   F,   F,   F,   F,   F,   F,   W ],
    [W,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   W ],
    [W,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   F,   W ],
    [W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W ]
  ];
}

// Lisa's apartment tile keys.
const LW = 'lisa.wall';
const LF = 'lisa.floor';
const LR = 'lisa.rug';
const LCU = 'lisa.couch';
const LLT = 'lisa.lamp-top';
const LLB = 'lisa.lamp-bot';

function walkFromMap(map, extraBlocked = []) {
  const blocked = new Set([
    W, PT, P1, LT, LB, XT, XB, KA, RC, TVT, TVB, CB, CW, CL, CR, CT, CC, CK,
    CBC, CBS, CCL, CCC, CCR, CVT, CVC, CVB, CH,
    DBH, DBB, DBF, DNS, DBS,
    BLW, BLS, BLCL, BLCC, BLCR, BLA, BLH,
    BW, BM, BB, BT, BC, BD, SW, SB,
    LW, LCU, LLT, LLB, ...extraBlocked
  ]);
  return map.map((row) => row.map((key) => (blocked.has(key) ? 1 : 0)));
}

// Helper — schedule repeating cigarette-smoke particles at a world position.
function startSmokeLoop(addParticle, px, py) {
  let stopped = false;
  (function tick() {
    if (stopped) return;
    addParticle({
      x: px + (Math.random() - 0.5) * 2,
      y: py,
      vx: (Math.random() - 0.5) * 4,
      vy: -10 - Math.random() * 6,
      life: 1.8,
      color: '#d8d0c0',
      size: 1
    });
    setTimeout(tick, 220 + Math.random() * 260);
  })();
  return () => { stopped = true; };
}

// ===========================================================================
// CHAPTER I — "A Goth on the Stairs"
// ===========================================================================

const mission1 = {
  id: 'm1',
  chapter: 'I',
  when: 'December 2024',
  title: 'A Goth on the Stairs',
  briefing:
    "I remember the first time I saw you.\n\nLisa's mother's birthday. A back room at Balagan \u2014 cigarettes, perfume, music through the ceiling. You were sitting on the couch like you didn't want to be seen.\n\nI walked in and said the worst line of my life.\n\nYou laughed anyway.",
  outro:
    "(You were laughing before you could stop yourself. I saw it.)\n\nI didn't know what you were then. I only knew I wasn't going to forget your face.",
  audioLoop: 'club',
  audioOpts: { muffled: true },
  buildScene() {
    // Balagan back room — stairs TOP (connected to the room via openings in
    // the dividing wall), couch directly against that wall, chairs around it.
    const map = [
      [BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW],
      [BLW, BLW, BLS, BLS, BLS, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLS, BLS, BLS, BLW, BLW],
      [BLW, BLW, BLS, BLS, BLS, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLS, BLS, BLS, BLW, BLW],
      [BLW, BLW, BLS, BLS, BLS, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLS, BLS, BLS, BLW, BLW],
      [BLW, BLW, BLF, BLF, BLF, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLF, BLF, BLF, BLW, BLW],
      [BLW, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLCL, BLCC, BLCR, BLH, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLW],
      [BLW, BLF, BLF, BLF, BLF, BLH, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLH, BLF, BLF, BLF, BLF, BLF, BLW],
      [BLW, BLF, BLF, BLF, BLA, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLA, BLF, BLF, BLF, BLF, BLW],
      [BLW, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLH, BLF, BLH, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLW],
      [BLW, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLW],
      [BLW, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLW],
      [BLW, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLW],
      [BLW, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLF, BLW],
      [BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLF, BLF, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW],
      [BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW, BLW]
    ];
    return {
      id: 'm1',
      map,
      walk: walkFromMap(map),
      // Aida sits on the LEFT end of the couch so David has room next to her.
      spawn: { x: 8, y: 5 },
      heroFacing: 'down',
      heroSprite: 'aida1',
      npcs: [
        // Lisa waits near the door, pouring drinks.
        { id: 'lisa',   x: 5,  y: 12, sprite: 'lisa',   facing: 'up',    name: 'Lisa' },
        // Maha on the chair by the ashtray (upper right).
        { id: 'maha',   x: 13, y: 6,  sprite: 'maha',   facing: 'left',  name: 'Maha' },
        // An employee smoking near the other ashtray.
        { id: 'smoker', x: 13, y: 9,  sprite: 'smoker', facing: 'left',  name: 'Employee' },
        // David at the door opening — will walk in.
        { id: 'david',  x: 9,  y: 13, sprite: 'pal1',   facing: 'up',    name: '???' }
      ],
      waypoints: []
    };
  },
  async play({
    mission, dialogue, setAffection, sfx, delay, spawnSmoke, audio,
    startSpotlight, stopSpotlight, playAngelic, spawnTeardrop, spawnExclaim,
    stopLoop, playLoop, spawnHeart, actionButton
  }) {
    // Cigarette smoke — two ashtrays burn for the whole mission.
    let smokeStopped = false;
    (function smokeTick() {
      if (smokeStopped) return;
      // Ashtrays at (4,7) and (14,7) in the new layout.
      spawnSmoke(4 * 16 + 8, 7 * 16 + 4);
      spawnSmoke(14 * 16 + 8, 7 * 16 + 4);
      setTimeout(smokeTick, 320 + Math.random() * 260);
    })();

    await delay(400);
    // Aida, on the couch, half-watching the room.
    await dialogue({ name: 'Aida', text: '(Music through the ceiling.)' });
    await dialogue({ name: 'Aida', text: "(Lisa's mom's birthday.)" });
    await dialogue({ name: 'Aida', text: "(You're already here.)" });

    // --- PUFF MINIGAME — settle the nerves with a couple of drags. ---
    await dialogue({
      name: 'Aida',
      text: '(Light one. Just a couple of pulls.)'
    });
    const puffs = await actionButton({
      label: '\uD83D\uDEAC Puff',
      subtitle: 'Three drags and it\u2019s done.',
      target: 3
    });
    // Each puff spawns a plume of smoke at Aida's hand position.
    for (let i = 0; i < puffs; i++) {
      setTimeout(() => {
        const h = mission.hero;
        spawnSmoke(h.px + 12, h.py + 4);
      }, i * 160);
    }
    await delay(220);

    // --- DAVID ENTERS ---
    // He steps in on the RIGHT; Lisa runs up on the LEFT so their speech
    // bubbles appear on different sides of the room and never cover each other.
    sfx.click();
    await mission.moveNpcTo('david', 10, 12);
    await delay(300);

    // Lisa runs up to hug him — stops to his LEFT.
    await mission.moveNpcTo('lisa', 8, 12);
    mission.setNpcFacing?.('lisa', 'right');
    mission.setNpcFacing?.('david', 'left');
    await delay(220);
    sfx.chime();
    await dialogue({ name: 'Lisa', text: 'DAVID! You made it.' });
    await dialogue({ name: 'David', text: '(He hugs her. She hugs him harder.)' });

    // Lisa announces him to the room.
    await dialogue({
      name: 'Lisa',
      text: 'Everyone \u2014 this is my favourite person in the world.'
    });
    await dialogue({ name: 'David', text: 'She says that to everyone.' });
    await dialogue({ name: 'Lisa', text: "I don't. Just you." });

    // --- THE FIRST LOOK (spotlight moment) ---
    // World goes dark. Music stops. Two spotlights on Aida + David.
    // She is flushed (teardrop anime symbol). He is stunned (exclamation marks).
    // A slow angelic violin/harp rises. Hearts bloom at the end.
    await delay(400);
    const aidaNpc = mission.hero;
    const davidNpc = mission.npcs.get('david');
    stopLoop();
    // Target the torso (py + 0) not the feet, so the whole character is lit.
    startSpotlight(
      { x: aidaNpc.px + 8,  y: aidaNpc.py + 0 },
      { x: davidNpc.px + 8, y: davidNpc.py + 0 }
    );
    await delay(260);
    playAngelic();
    // Aida — flushed, looks down.
    spawnTeardrop(aidaNpc.px + 18, aidaNpc.py - 6);
    await dialogue({
      name: 'Aida',
      thought: true,
      text: '(Oh. The most beautiful person.)'
    });
    // David — stunned, eyes wide.
    spawnExclaim(davidNpc.px + 8, davidNpc.py - 8);
    sfx.blip();
    await dialogue({
      name: 'David',
      thought: true,
      text: '(\u2026 wow. Who is she?)'
    });
    // Hearts at the end of the moment.
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const ax = aidaNpc.px + 8 + (Math.random() - 0.5) * 14;
        const ay = aidaNpc.py - 4 + (Math.random() - 0.5) * 6;
        spawnHeart(ax, ay);
        const dx = davidNpc.px + 8 + (Math.random() - 0.5) * 14;
        const dy = davidNpc.py - 4 + (Math.random() - 0.5) * 6;
        spawnHeart(dx, dy);
      }, i * 90);
    }
    sfx.heart();
    await delay(900);
    stopSpotlight();
    playLoop('club', { muffled: true });
    await delay(250);

    // --- DAVID GOES TO MAHA ---
    // Lisa drifts back to the LEFT of the room (stays left of everyone).
    mission.moveNpcTo('lisa', 3, 12);
    await mission.moveNpcTo('david', 12, 6);
    await delay(300);
    await dialogue({
      name: 'David',
      text: 'Maha, right? Is that short for Rasomaha? Like the Wolverine?'
    });
    await dialogue({
      name: 'Maha',
      text: "No one's ever asked me that."
    });
    await dialogue({
      name: 'David',
      text: "It was on the tip of my tongue since I walked in."
    });

    // Lisa heckles from across the room.
    await delay(300);
    await dialogue({
      name: 'Lisa',
      text: 'By the way \u2014 David was too greedy to buy me a COOKIE in Israel.'
    });
    await dialogue({ name: 'David', text: 'It was a small cookie!' });
    await dialogue({ name: 'Lisa', text: 'It was NOT.' });
    await dialogue({
      name: 'Maha',
      text: 'Knew it. Figured.'
    });

    // --- DAVID WALKS OVER AND SITS BESIDE AIDA ON THE COUCH ---
    // Step 1: walk to the floor in front of the couch. Step 2: sit down —
    // teleport onto the couch tile next to Aida (couch tiles are blocked for
    // pathfinding, but we can place him there directly).
    await delay(350);
    await mission.moveNpcTo('david', 9, 6);
    await delay(200);
    mission.setNpcPos('david', 9, 5, 'down');
    mission.setHeroFacing('right');
    // Use the sitting sprite variant for David too.
    mission.setNpcSprite('david', 'pal1');
    await delay(260);

    await dialogue({ name: '???', text: '\u2026' });
    await dialogue({ name: 'David', text: 'Are you a goth?' });

    const reply = await dialogue({
      name: 'Aida',
      text: 'What did you just say to me?',
      choices: [
        'Are you serious?',
        'Unbelievable. Hi.',
        'Do I look like a goth to you?'
      ]
    });
    const heLine = [
      "I mean \u2014 the dress. Sorry. I'm bad at this.",
      "Hi. I'm \u2014 yeah, I'm bad at this.",
      "Honestly? A little. In the best way."
    ][reply] || "I'm bad at this.";
    await dialogue({ name: 'David', text: heLine });
    await dialogue({
      name: 'Aida',
      text: '(You laugh. Not at him \u2014 almost with him.)'
    });

    // --- MAHA COMES OVER AND RUNS INTERFERENCE ---
    await delay(300);
    await mission.moveNpcTo('maha', 11, 8);
    await delay(260);
    await dialogue({
      name: 'Maha',
      text: 'So, David. What do you do for a living?'
    });
    await dialogue({
      name: 'David',
      text: 'A bit of everything. Some product, some code, some art.'
    });
    await dialogue({
      name: 'Maha',
      text: 'Hmm. Won\u2019t work for us.'
    });
    await dialogue({ name: 'Aida', text: '(Maha. Do NOT.)' });
    await dialogue({
      name: 'Maha',
      text: 'Are you close with your mother?'
    });
    await dialogue({ name: 'David', text: 'Yeah. Very.' });
    await dialogue({
      name: 'Maha',
      text: 'Hmm. Won\u2019t work for us.'
    });
    await dialogue({ name: 'Aida', text: '(MAHA. I will end you.)' });
    await dialogue({
      name: 'Maha',
      text: 'Last one. If you met a girl tonight \u2014 goth or otherwise \u2014 what would you do?'
    });
    await dialogue({
      name: 'David',
      text: "I... don't know. Figure it out?"
    });
    // This time Maha flips it — the answer passes.
    await dialogue({
      name: 'Maha',
      text: 'Hmm. \u2014 That WILL work for us.'
    });
    await dialogue({
      name: 'David',
      text: "Wait \u2014 what changed?"
    });
    await dialogue({
      name: 'Maha',
      text: 'Nothing. Never mind.'
    });
    // Aida's thought — she caught Maha catching her blush.
    await dialogue({
      name: 'Aida',
      text: '(He saw me blush. That\u2019s how he knew.)'
    });

    // Maha strolls back to his chair.
    mission.moveNpcTo('maha', 13, 6);

    setAffection(1);
    sfx.heart();
    smokeStopped = true;
    await delay(500);
  }
};

// ===========================================================================
// CHAPTER II — "Silver Pants" (New Year's Eve at Balagan)
// ===========================================================================

const mission2 = {
  id: 'm2',
  chapter: 'II',
  when: "New Year's Eve, 2024",
  title: 'Silver Pants',
  briefing:
    "A few nights later \u2014 the same club, a different room.\n\nI wore silver pants. You pretended this was normal. We didn't say a word to each other.\n\nI thought about you the whole countdown.",
  outro:
    "(I drank too much and lost you in the crowd.)\n\nI wrote to you from the taxi home. You wrote back at one in the afternoon, already awake. I read it twice.",
  audioLoop: 'nightclub',
  effects: ['disco'],
  buildScene() {
    // NYE at Balagan — TALL layout (narrow dance floor, vertical feel).
    // Tall TV projection strip across the very top with the countdown.
    // Tables: a tall column along the LEFT side, a cluster at the TOP-RIGHT,
    // and a long table across the BOTTOM. BAR runs along the RIGHT SIDE
    // (cols 17-18 are the bar counter + back, col 16 is the floor in front).
    const map = [
      [CW, CW, CW, CW, CK, CK, CK, CK, CK, CK, CK, CK, CK, CK, CW, CW, CF,  CBS, CBS, CW],
      [CW, CW, CC, CT, CF, CF, CF, CF, CF, CF, CF, CF, CF, CC, CC, CF, CF,  CBC, CBS, CW],
      [CW, CW, CC, CT, CF, CF, CF, CF, CF, CF, CF, CF, CF, CT, CT, CF, CF,  CBC, CBS, CW],
      [CW, CW, CC, CT, CF, CF, CF, CF, CF, CF, CF, CF, CF, CC, CC, CF, CF,  CBC, CBS, CW],
      [CW, CW, CC, CT, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF,  CBC, CBS, CW],
      [CW, CW, CC, CT, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF,  CBC, CBS, CW],
      [CW, CW, CC, CT, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF,  CBC, CBS, CW],
      [CW, CW, CC, CT, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF,  CBC, CBS, CW],
      [CW, CW, CC, CT, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF,  CBC, CBS, CW],
      [CW, CW, CC, CT, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF,  CBC, CBS, CW],
      [CW, CW, CC, CT, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF,  CBC, CBS, CW],
      [CW, CW, CC, CT, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF,  CBC, CBS, CW],
      [CW, CW, CF, CF, CC, CT, CT, CT, CT, CT, CT, CT, CT, CT, CC, CF, CF,  CBC, CBS, CW],
      [CW, CW, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF, CF,  CF,  CF,  CW],
      [CW, CW, CW, CW, CW, CW, CW, CW, CW, CW, CW, CW, CW, CW, CW, CW, CW, CW,  CW,  CW]
    ];
    return {
      id: 'm2',
      map,
      walk: walkFromMap(map),
      spawn: { x: 7, y: 8 },
      heroFacing: 'up',
      heroSprite: 'aida',
      npcs: [
        // David dances next to her, silver pants catching every laser.
        { id: 'david',  x: 8,  y: 8,  sprite: 'palNYE', facing: 'left',  name: 'David' },
        // Lisa by the left tables.
        { id: 'lisa',   x: 4,  y: 6,  sprite: 'lisa',   facing: 'left',  name: 'Lisa' },
        // Maha at the bottom table.
        { id: 'maha',   x: 9,  y: 13, sprite: 'maha',   facing: 'up',    name: 'Maha' },
        // A handful of strangers scattered in the dance floor.
        { id: 'crowd1', x: 5,  y: 5,  sprite: 'smoker', facing: 'right', name: 'Stranger' },
        { id: 'crowd2', x: 11, y: 4,  sprite: 'smoker', facing: 'down',  name: 'Stranger' },
        { id: 'crowd3', x: 6,  y: 10, sprite: 'smoker', facing: 'right', name: 'Stranger' },
        { id: 'crowd4', x: 13, y: 6,  sprite: 'smoker', facing: 'left',  name: 'Stranger' },
        { id: 'crowd5', x: 5,  y: 11, sprite: 'smoker', facing: 'up',    name: 'Stranger' },
        { id: 'crowd6', x: 12, y: 11, sprite: 'smoker', facing: 'up',    name: 'Stranger' }
      ],
      waypoints: []
    };
  },
  async play({ mission, dialogue, phone, setAffection, sfx, delay, fadeTo, snapFade, actionButton, fadeText, spawnHeart }) {
    await delay(400);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "(New Year\u2019s at Balagan. The room is all elbows and laser.)"
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "(In SILVER pants. Actual silver pants \u2014 catching every laser in the room.)"
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "(Neither of you is talking. Neither of you needs to.)"
    });

    // --- SHOTS MINIGAME — tap the glass a few times before midnight ---
    await dialogue({
      portrait: 'lisa',
      name: 'Lisa',
      text: 'Shots before the countdown. Everyone!'
    });
    const shots = await actionButton({
      label: '\uD83E\uDD43 Shot',
      subtitle: 'Clink with David',
      target: 4
    });
    // Each shot spawns a heart on David — team drinking is bonding.
    for (let i = 0; i < shots; i++) {
      setTimeout(() => {
        const d = mission.npcs.get('david');
        if (d) spawnHeart(d.px + 8, d.py - 4);
      }, i * 120);
    }
    sfx.heart();
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "(He clinks his glass against yours. You down them together.)"
    });

    // --- COUNTDOWN ---
    await delay(260);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(The clock on the wall reads 23:59:50. Everyone turns.)'
    });
    for (const n of [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]) {
      await fadeText(String(n), { duration: 520 });
    }
    await fadeText('\uD83C\uDF89  HAPPY NEW YEAR  \uD83C\uDF89', { duration: 1600 });
    sfx.chime();
    // Firework notes bloom around the dance floor.
    for (let i = 0; i < 10; i++) {
      setTimeout(
        () => mission.spawnMusicNote((7 + (i % 3)) * 16 + Math.random() * 6, 8 * 16),
        i * 180
      );
    }
    await delay(900);

    // He drifts into the crowd and disappears.
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "(A song shifts. He raises his glass \u2014 then he\u2019s gone.)"
    });
    await mission.moveNpcTo('david', 1, 14);
    await delay(200);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "(You look for him. The crowd closes. You let it.)"
    });
    setAffection(1);
    sfx.heart();

    // Fade to black → "Later, at dawn..."
    fadeTo(1, 900);
    await delay(1100);
    snapFade(1);

    // Phone arrives — morning after
    await phone({
      contactName: 'David',
      contactEmoji: '🧃',
      messages: [
        { side: 'them', text: 'Hey', time: '7:36' },
        { side: 'them', text: "I left 🥸", time: '7:36' },
        { side: 'me',   text: 'Hey', time: '13:02' },
        { side: 'me',   text: 'Figured', time: '13:02' },
        { side: 'them', text: 'Good end to the night?', time: '13:03' },
        { side: 'me',   text: 'Yeah, everyone survived', time: '17:32' },
        { side: 'me',   text: 'You?', time: '17:32' },
        { side: 'them', text: 'Fine. Woke up energetic', time: '20:08' },
        { side: 'them', text: 'But slept forever', time: '20:08' },
        { side: 'me',   text: "I'm still exploiting your pearl necklace btw", time: '20:54' },
        { side: 'them', text: 'Wow', time: '21:23' },
        { side: 'them', text: 'Exploiter.', time: '21:24' },
        { side: 'them', text: 'Is that your new look for 2025?', time: '21:24' }
      ]
    });
  }
};

// ===========================================================================
// CHAPTER III — "Lisa's Place" (get to know each other)
// ===========================================================================

const mission3 = {
  id: 'm3',
  chapter: 'III',
  when: 'A few nights later',
  title: "Lisa's Place",
  briefing:
    "Lisa's flat on Patriki. A film with the sound off. A bottle of wine on the table and the lamp turning everything red.\n\nYou and me, finally, with nothing to do but talk.\n\nI asked about your favourite movie. I already knew the answer.",
  outro:
    "(Same films. Same painters. The same way of going quiet when a song you love comes on.)\n\nI shuffled the cards and dealt three. I swear I didn't cheat.",
  audioLoop: 'apartment',
  buildScene() {
    // Lisa's flat on Patriki — small, low-lit, dark red rug, black couch
    // against one wall, red lamp in the corner. Gothic by accident.
    const map = [
      [LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW],
      [LW, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LW],
      [LW, LF, LF, LF, LF, LF, LF, LCU, LCU, LCU, LCU, LF, LF, LF, LF, LLT, LF, LF, LF, LW],
      [LW, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LLB, LF, LF, LF, LW],
      [LW, LF, LF, LF, LR, LR, LR, LR, LR, LR, LR, LR, LF, LF, LF, LF, LF, LF, LF, LW],
      [LW, LF, LF, LF, LR, LR, LR, LR, LR, LR, LR, LR, LF, LF, LF, LF, LF, LF, LF, LW],
      [LW, LF, LF, LF, LR, LR, LR, LR, LR, LR, LR, LR, LF, LF, LF, LF, LF, LF, LF, LW],
      [LW, LF, LF, LF, LR, LR, LR, LR, LR, LR, LR, LR, LF, LF, LF, LF, LF, LF, LF, LW],
      [LW, LF, LF, LF, LR, LR, LR, LR, LR, LR, LR, LR, LF, LF, LF, LF, LF, LF, LF, LW],
      [LW, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LW],
      [LW, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LW],
      [LW, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LW],
      [LW, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LW],
      [LW, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LF, LW],
      [LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW, LW]
    ];
    return {
      id: 'm3',
      map,
      walk: walkFromMap(map),
      spawn: { x: 5, y: 7 },
      heroFacing: 'right',
      heroSprite: 'aida',
      npcs: [
        { id: 'paladin', x: 10, y: 7, sprite: 'pal', facing: 'left', name: 'David' },
        { id: 'lisa',    x: 13, y: 12, sprite: 'lisa', facing: 'up', name: 'Lisa' }
      ],
      waypoints: []
    };
  },
  async play({ dialogue, setAffection, sfx, delay, mission }) {
    await delay(300);
    await dialogue({
      portrait: 'lisa',
      name: 'Lisa',
      text: "Drinks. Film. I'll sit over here and pretend not to watch you two."
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "So \u2014 what's your favourite movie?"
    });
    const fav = await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(Easy.)',
      choices: [
        'The Lord of the Rings.',
        'Solaris.',
        'Something with Audrey Hepburn.'
      ]
    });
    const lotrPicked = fav === 0;
    if (lotrPicked) {
      await dialogue({
        portrait: 'paladin',
        name: 'David',
        text: 'Lord of the Rings. \u2014 Cool.'
      });
      await dialogue({
        portrait: 'aida',
        name: 'Aida',
        text: '(He said it like he meant it.)'
      });
    } else {
      await dialogue({
        portrait: 'paladin',
        name: 'David',
        text: 'Good answer. \u2014 Mine is Lord of the Rings, actually.'
      });
    }
    await delay(220);
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "Can I read your cards? I brought a deck."
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(A tarot reading. On the second meeting.)',
      choices: ['Read them.', 'Only if you\u2019re good.']
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: '(He shuffles. Deals three. Looks at them. Looks at you.)'
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: 'The Lovers. The Star. The Fool.'
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(That can\u2019t be a coincidence.)'
    });
    await delay(260);

    // Match-the-pair mini-game — 4 rounds.
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "Okay \u2014 I name something, you tell me if you love it or hate it. Then I\u2019ll guess yours."
    });
    const questions = [
      {
        prompt: "Frodo or Aragorn?",
        options: ["Frodo.", "Aragorn."],
        answer: 1,
        right: "Knew it. Ranger energy.",
        wrong: "Oh \u2014 fine, we\u2019ll argue about this later."
      },
      {
        prompt: "A quiet Sunday \u2014 Klimt or Schiele?",
        options: ["Klimt, please.", "Schiele. Always Schiele."],
        answer: 1,
        right: "The nerves. The hands. Of course.",
        wrong: "Alright, noted. Klimt works too."
      },
      {
        prompt: "Album on repeat \u2014 Mills Brothers or Guns N' Roses?",
        options: ["Mills Brothers.", "Guns N' Roses."],
        answer: 1,
        right: "Metalhead energy. Approved.",
        wrong: "Jazz it is. I'll learn."
      },
      {
        prompt: "Moscow winter \u2014 stay in or go to Patriki?",
        options: ["Stay in, with a book.", "Patriki, with coffee."],
        answer: 0,
        right: "Same. The book wins.",
        wrong: "Patriki it is \u2014 I know a place."
      }
    ];
    let score = 0;
    for (const q of questions) {
      // David asks the question — no choices here.
      await dialogue({
        portrait: 'paladin',
        name: 'David',
        text: q.prompt
      });
      // Aida is the one answering — the choices belong in HER bubble.
      const c = await dialogue({
        portrait: 'aida',
        name: 'Aida',
        text: '\u2026',
        choices: q.options
      });
      if (c === q.answer) {
        score++;
        sfx.chime();
        mission.spawnHeart(mission.hero.px + 8, mission.hero.py - 4);
        await dialogue({
          portrait: 'aida',
          name: 'Aida',
          text: q.right
        });
      } else {
        await dialogue({
          portrait: 'aida',
          name: 'Aida',
          text: q.wrong
        });
      }
    }
    const affectionEarned = Math.min(3, 2 + Math.floor(score / 2));
    setAffection(affectionEarned);
    if (score >= 3) {
      await dialogue({
        portrait: 'paladin',
        name: 'David',
        text: "(He watches you longer than necessary. You don\u2019t look away.)"
      });
    } else {
      await dialogue({
        portrait: 'paladin',
        name: 'David',
        text: "(He laughs. He actually laughs. That\u2019s new.)"
      });
    }
    await delay(400);
  }
};

// ===========================================================================
// INTERLUDE — "Dinner at the Restaurant" (before the pharmacy walk)
// ===========================================================================
// Aida is starting to get sick. She drinks vodka to feel better. It doesn't.
// Around the table: Lisa, Katya, Maha. Aida and David sit next to each other
// and both blush every time their shoulders bump.

const mission3b = {
  id: 'm3b',
  chapter: 'III\u00BD',
  when: 'Later that same night',
  title: 'Dinner, Before the Pharmacy',
  briefing:
    "Then a long table off Nikitskaya. Lisa and Katya across, Maha at the head, the two of us sitting too close on the same side.\n\nYour shoulder kept bumping mine. Neither of us moved away.\n\nYou kept saying you were fine. You weren't.",
  outro:
    "(The shots didn't work. I could see it in your face.)\n\nI put on my coat. I told you the pharmacy was two blocks over \u2014 mostly as an excuse to get you outside with me.",
  audioLoop: 'apartment',
  buildScene() {
    // Restaurant — warm palette, dinner table centred, chairs on 4 sides.
    const RF = 'apt.floor';
    const RW = 'apt.wall';
    const RR = 'apt.rug-edge';
    const RT = 'club.table';
    const RC2 = 'club.chair';
    const map = [
      [RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW],
      [RW, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RF, RF, RF, RC2, RC2, RF, RF, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RR, RR, RR, RR, RR, RR, RR, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RR, RT, RT, RT, RT, RT, RR, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RR, RT, RT, RT, RT, RT, RR, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RR, RT, RT, RT, RT, RT, RR, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RR, RR, RR, RR, RR, RR, RR, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RF, RF, RF, RC2, RC2, RF, RF, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RF, RW],
      [RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW, RW]
    ];
    return {
      id: 'm3b',
      map,
      walk: walkFromMap(map),
      // Aida sits to the LEFT of the table, facing right. David to her right.
      spawn: { x: 5, y: 7 },
      heroFacing: 'right',
      heroSprite: 'aida',
      npcs: [
        // David — right next to Aida.
        { id: 'paladin', x: 5, y: 8, sprite: 'pal', facing: 'right', name: 'David' },
        // Lisa + Katya across from them.
        { id: 'lisa',    x: 12, y: 7, sprite: 'lisa',   facing: 'left', name: 'Lisa' },
        { id: 'katya',   x: 12, y: 8, sprite: 'lisa',   facing: 'left', name: 'Katya' },
        // Maha at the head of the table.
        { id: 'maha',    x: 9, y: 4, sprite: 'maha',   facing: 'down', name: 'Maha' }
      ],
      waypoints: []
    };
  },
  async play({ mission, dialogue, sfx, delay, spawnHeart, actionButton, setAffection }) {
    await delay(260);
    await dialogue({
      name: 'Lisa',
      text: 'Are you two starting to come down with something? You look flushed.'
    });
    await dialogue({
      name: 'Aida',
      text: '(Your throat is glass. You\u2019re fine. You\u2019re fine.)'
    });
    await dialogue({
      name: 'Katya',
      text: 'Shots. Shots are the cure. Everyone knows.'
    });
    await dialogue({
      name: 'Maha',
      text: '(Pours one. Slides it toward you.)'
    });

    // Shot mini-game — three quick shots while she still can.
    const shots = await actionButton({
      label: '\uD83E\uDD43 Vodka',
      subtitle: 'You insist you\u2019re fine.',
      target: 3
    });
    const aida = mission.hero;
    const david = mission.npcs.get('paladin');
    // Blush particles on BOTH Aida and David (small pink hearts at their cheeks).
    for (let i = 0; i < shots; i++) {
      setTimeout(() => {
        spawnHeart(aida.px + 8, aida.py - 2);
        if (david) spawnHeart(david.px + 8, david.py - 2);
      }, i * 140);
    }
    sfx.heart();
    await dialogue({
      name: 'Aida',
      text: '(Your face is hot. His too. You can tell.)'
    });
    await dialogue({
      name: 'David',
      text: '(He leans in, whispers.) You okay? You\u2019re shaking.'
    });
    await dialogue({
      name: 'Aida',
      text: 'I\u2019m fine. I\u2019m a LIAR. I\u2019m fine.'
    });
    await dialogue({
      name: 'David',
      text: "The pharmacy\u2019s only two blocks. Let\u2019s step out \u2014 I\u2019ll walk you."
    });
    await dialogue({
      name: 'Lisa',
      text: 'Go, go. We\u2019ll hold the table.'
    });
    setAffection(2);
    await delay(300);
  }
};

// ===========================================================================
// CHAPTER IV — "The Pharmacy Walk"
// ===========================================================================

const mission4 = {
  id: 'm4',
  chapter: 'IV',
  when: 'The walk to the pharmacy',
  title: 'The Pharmacy Walk',
  briefing:
    "We went out into the snow. Bolshaya Nikitskaya was empty. Yellow streetlamps, old buildings, one or two cars going past.\n\nThe pharmacy was at number thirteen. I had no idea if it would be open.\n\nYou were so quiet. Your hand was cold.",
  outro:
    "(Closed. Of course it was closed.)\n\nOn the walk back I put my hand on your back, then your neck. You didn't move away. By the time we got inside, you were burning up.",
  audioLoop: 'sickbed',
  buildScene() {
    // Bolshaya Nikitskaya 13, Moscow, January night. Brick buildings on the
    // far side, snowy sidewalk in the middle where Aida and David walk, a
    // narrow strip of dark asphalt along the top where the odd car is parked.
    const SB2 = 'street.building';
    const SV = 'street.window';
    const SK = 'street.road';
    const SI = 'street.sidewalk';
    const SL1 = 'street.lamp-top';
    const SL2 = 'street.lamp-bot';
    const SC = 'street.car';
    const SS = 'street.snow';
    const SD = 'street.door';
    const map = [
      [SB2, SV,  SB2, SV,  SB2, SB2, SV,  SB2, SV,  SB2, SB2, SV,  SB2, SV,  SB2, SB2, SV,  SB2, SD,  SB2],
      [SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2, SB2],
      [SK,  SK,  SK,  SC,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SC,  SK,  SK,  SK,  SK,  SK,  SK,  SK],
      [SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK,  SK],
      [SI,  SI,  SL1, SI,  SI,  SI,  SI,  SL1, SI,  SI,  SI,  SI,  SL1, SI,  SI,  SI,  SI,  SL1, SI,  SI],
      [SI,  SI,  SL2, SI,  SS,  SI,  SI,  SL2, SI,  SI,  SI,  SS,  SL2, SI,  SI,  SI,  SS,  SL2, SI,  SI],
      [SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI],
      [SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI],
      [SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI],
      [SI,  SI,  SI,  SS,  SI,  SI,  SI,  SI,  SI,  SS,  SI,  SI,  SI,  SI,  SI,  SS,  SI,  SI,  SI,  SI],
      [SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI],
      [SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI],
      [SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI],
      [SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI],
      [SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI,  SI]
    ];
    return {
      id: 'm4',
      map,
      walk: walkFromMap(
        map,
        ['street.building', 'street.window', 'street.road',
         'street.lamp-top', 'street.lamp-bot', 'street.car',
         'street.snow', 'street.door']
      ),
      spawn: { x: 1, y: 7 },
      heroFacing: 'right',
      heroSprite: 'aida',
      npcs: [
        { id: 'paladin', x: 2, y: 7, sprite: 'pal', facing: 'right', name: 'David' }
      ],
      waypoints: [
        // First beat — a few tiles along the sidewalk.
        { id: 'lamp1', x: 5,  y: 7 },
        // Middle beat — past the middle streetlamp.
        { id: 'lamp2', x: 11, y: 7 },
        // Final beat — directly below the "13" door, on a walkable sidewalk
        // tile (row 4, col 18).  The adjacent lamp tile was blocked, so the
        // old waypoint at (17,5) was unreachable and the scene got stuck.
        { id: 'pharmacy', x: 18, y: 4 },
        // Then they walk BACK the way they came.
        { id: 'back-home', x: 2, y: 7 }
      ]
    };
  },
  async play({ mission, dialogue, setAffection, sfx, delay, spawnHeart, spawnSnow }) {
    // Heavy Moscow snowfall — drifting snowflakes the whole mission.
    let snowStopped = false;
    (function snowTick() {
      if (snowStopped) return;
      if (spawnSnow) {
        for (let i = 0; i < 2; i++) {
          spawnSnow(Math.random() * 320, -4);
        }
      }
      setTimeout(snowTick, 140);
    })();
    await delay(300);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "(Your throat is glass. The vodka didn't help.)"
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "Come on \u2014 I'll walk you. Two blocks."
    });

    // David follows a tile behind her as she walks.
    const follow = setInterval(() => {
      if (!mission.npcs.get('paladin')) { clearInterval(follow); return; }
      const h = mission.hero;
      mission.moveNpcTo('paladin', Math.max(0, h.gx - 1), h.gy);
    }, 900);

    // Stroll past the lamps — each lamp = a small beat of dialogue.
    // Hints land on WALKABLE sidewalk tiles so Aida can actually reach them.
    mission.setHint(5, 7);
    await mission.waitForWaypoint('lamp1');
    mission.clearHint();
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "You alright? You're a bit quiet."
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "I'm fine. I'm always fine. It's a trick."
    });

    mission.setHint(11, 7);
    await mission.waitForWaypoint('lamp2');
    mission.clearHint();
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "(Puts a hand on your back. Then your neck. Quiet.)"
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "(Not expected. Not unwelcome.)"
    });
    spawnHeart(mission.hero.px + 8, mission.hero.py - 4);
    sfx.heart();

    mission.setHint(18, 4);
    await mission.waitForWaypoint('pharmacy');
    mission.clearHint();
    // Pharmacy door — closed.
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "\u2014 of course it's closed."
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(You laugh. It hurts your chest.)'
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "Come on. I'll walk you back."
    });
    // --- WALK BACK — the long way home. ---
    // Re-aim the follow so David stays one tile to her RIGHT now that she
    // is walking left.
    clearInterval(follow);
    const followBack = setInterval(() => {
      if (!mission.npcs.get('paladin')) { clearInterval(followBack); return; }
      const h = mission.hero;
      mission.moveNpcTo('paladin', Math.min(19, h.gx + 1), h.gy);
    }, 900);
    mission.setHint(2, 7);
    await mission.waitForWaypoint('back-home');
    mission.clearHint();
    clearInterval(followBack);
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: 'I should have checked the hours before we walked.'
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: 'You wanted to get me out of there.'
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: '\u2026 yeah. I did.'
    });
    spawnHeart(mission.hero.px + 8, mission.hero.py - 4);
    setAffection(3);
    sfx.heart();
    snowStopped = true;
    await delay(300);
  }
};

// ===========================================================================
// CHAPTER V — "Forty Degrees" (the fever)
// ===========================================================================

const mission5Fever = {
  id: 'm5',
  chapter: 'V',
  when: 'Three days, one screen',
  title: 'Forty Degrees',
  briefing:
    "You went home to Presnya. Forty of fever. The flat quiet, the phone the only light in the room.\n\nFor three days we only had each other through a screen.\n\nYou promised me you'd stop believing in magic if it didn't break by Sunday.",
  outro:
    "(It broke. You got up. You called me Davidka for the first time.)\n\nThere was one thing left to do \u2014 find each other in a room, not through glass.",
  audioLoop: 'sickbed',
  buildScene() {
    // Split-screen: Aida's room on Presnya (left) · wall · David near TSUM (right)
    // LEFT half (cols 0-8) — Aida's parents' flat on Presnya, cream/sick.
    // RIGHT half (cols 12-19) — David's bedroom: cream walls, blond-wood
    // floor, dark-wood bed with grey-blue bedding, nightstand with a blue
    // bottle, dark bookshelf on the left wall.
    const map = [
      [SW, SW, SW, SW, SW, SW, SW, SW, SW, DW, DW, W,  W,  W,  W,  W,  W,  W,  W,  W ],
      [SW, SF, SF, SF, SF, SF, SF, SF, SF, DW, DW, W,  DBS,DF, DF, DF, DF, DF, DF, W ],
      [SW, SF, SF, SF, SF, SF, SF, SF, SF, DW, DW, W,  DBS,DF, DBH,DBH,DBH,DBH,DF, W ],
      [SW, SF, SF, SB, SB, SB, SB, SF, SF, DW, DW, W,  DNS,DF, DBB,DBB,DBB,DBB,DF, W ],
      [SW, SF, SF, SB, SB, SB, SB, SF, SF, DW, DW, W,  DF, DF, DBB,DBB,DBB,DBB,DF, W ],
      [SW, SF, SF, SB, SB, SB, SB, SF, SF, DW, DW, W,  DF, DF, DBF,DBF,DBF,DBF,DF, W ],
      [SW, SF, SF, SB, SB, SB, SB, SF, SF, DW, DW, W,  DF, DF, DF, DF, DF, DF, DF, W ],
      [SW, SF, SF, SF, SF, SF, SF, SF, SF, DW, DW, W,  DF, DF, DF, DF, DF, DF, DF, W ],
      [SW, SF, SF, SF, SF, SF, SF, SF, SF, DW, DW, W,  DF, DF, DF, DF, DF, DF, DF, W ],
      [SW, SF, SF, SF, SF, SF, SF, SF, SF, DW, DW, W,  DF, DF, DF, DF, DF, DF, DF, W ],
      [SW, SF, SF, SF, SF, SF, SF, SF, SF, DW, DW, W,  DF, DF, DF, DF, DF, DF, DF, W ],
      [SW, SF, SF, SF, SF, SF, SF, SF, SF, DW, DW, W,  DF, DF, DF, DF, DF, DF, DF, W ],
      [SW, SF, SF, SF, SF, SF, SF, SF, SF, DW, DW, W,  DF, DF, DF, DF, DF, DF, DF, W ],
      [SW, SF, SF, SF, SF, SF, SF, SF, SF, DW, DW, W,  DF, DF, DF, DF, DF, DF, DF, W ],
      [SW, SW, SW, SW, SW, SW, SW, SW, SW, DW, DW, W,  W,  W,  W,  W,  W,  W,  W,  W ]
    ];
    return {
      id: 'm3',
      map,
      walk: walkFromMap(map, [DW]),
      spawn: { x: 4, y: 4 }, // Aida on her bed (left)
      heroFacing: 'right',
      heroSprite: 'aida',
      npcs: [
        // David on his bed (right half)
        { id: 'david', x: 15, y: 4, sprite: 'pal', facing: 'left', name: 'David' }
      ],
      waypoints: []
    };
  },
  async play({ dialogue, phone, sfx, spawnHeart, delay }) {
    await delay(600);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(Fever of 40. Everything tastes like paper.)'
    });
    await delay(300);
    sfx.blip();
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(Your phone buzzes.)'
    });
    await phone({
      contactName: 'David',
      contactEmoji: '🧃',
      messages: [
        { side: 'them', text: 'Alive?', time: '00:18' },
        { side: 'them', text: 'You held up well', time: '00:18' },
        { side: 'me',   text: 'No', time: '01:22' },
        { side: 'me',   text: "It's hell", time: '01:22' },
        { side: 'me',   text: 'I have a fever of 40. Can you believe it', time: '01:22' },
        { side: 'them', text: 'God', time: '01:24' },
        { side: 'me',   text: "I don't understand how I was dancing at all", time: '01:26' },
        { side: 'them', text: 'It was magical Jewish energy keeping you up', time: '01:27' },
        { side: 'me',   text: "If it doesn't pick me up in 2 days", time: '01:27' },
        { side: 'me',   text: 'I will never believe in magic again', time: '01:27' },
        { side: 'them', text: 'Hi hi. How are you feeling?', time: '13:20' },
        { side: 'me',   text: 'A little better', time: '16:18' },
        { side: 'them', text: 'When you recover — Coldrex, then straight to Secret', time: '23:38' },
        { side: 'me',   text: 'I think I need a couple more days', time: '23:43' },
        { side: 'me',   text: 'And then straight', time: '23:44' },
        { side: 'me',   text: 'To Secret', time: '23:44' },
        { side: 'me',   text: "It's all your metallic pants", time: '02:38' },
        { side: 'them', text: 'They really helped over there', time: '03:06' },
        { side: 'me',   text: "You're just waiting for me to recover", time: '02:36' },
        { side: 'me',   text: 'so we can go to Secret, aren\'t you?', time: '02:36' },
        { side: 'them', text: 'Your health is my top priority', time: '02:47' },
        { side: 'me',   text: 'Like 💙', time: '02:47' },
        { side: 'me',   text: 'Davidka', time: '15:28' },
        { side: 'them', text: 'Aidka', time: '15:44' },
        { side: 'them', text: 'And Davidka', time: '15:44' },
        { side: 'them', text: 'Sounds good', time: '15:44' }
      ]
    });
    spawnHeart(7 * 16 + 8, 4 * 16);
    sfx.heart();
    await delay(500);
  }
};

// ===========================================================================
// CHAPTER VI — "First Date: Mo Bar"
// ===========================================================================

const mission6MoBar = {
  id: 'm6',
  chapter: 'VI',
  when: 'The first date',
  title: 'Mo Bar',
  briefing:
    "The plan was Secret. We landed at Mo Bar instead.\n\nMirrored walls, one DJ playing for absolutely nobody, the colour of the lights the kind a child picks when they're happy.\n\nOur first date \u2014 just us, as if the whole room had been waiting.",
  outro:
    "(You told me about the character in your favourite book. The one who was a nerve too sensitive. You said that's you.)\n\nI thought: that's me too, in my own way. I told you we had leftovers to drop off at mine.",
  audioLoop: 'bar',
  // Dark room + drifting colored lights = Mo Bar's disco-ball feel.
  effects: ['disco'],
  buildScene() {
    const map = [
      [BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW],
      [BW, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BM, BW],
      [BF, BF, BB, BB, BB, BB, BB, BB, BB, BB, BB, BB, BB, BB, BB, BB, BB, BB, BF, BW],
      [BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BW],
      [BF, BF, BG, BF, BF, BG, BF, BF, BG, BF, BF, BG, BF, BF, BG, BF, BF, BG, BF, BW],
      [BF, BD, BF, BF, BF, BC, BT, BC, BF, BF, BF, BC, BT, BC, BF, BF, BF, BF, BF, BW],
      [BF, BD, BF, BF, BF, BF, BC, BF, BF, BF, BF, BF, BC, BF, BF, BF, BF, BF, BF, BW],
      [BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BW],
      [BF, BF, BF, BF, BF, BC, BT, BC, BF, BF, BF, BC, BT, BC, BF, BF, BF, BF, BF, BW],
      [BF, BF, BF, BF, BF, BF, BC, BF, BF, BF, BF, BF, BC, BF, BF, BF, BF, BF, BF, BW],
      [BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BW],
      [BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BW],
      [BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BW],
      [BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BF, BW],
      [BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW, BW]
    ];
    return {
      id: 'm4',
      map,
      walk: walkFromMap(map),
      spawn: { x: 0, y: 12 },
      heroFacing: 'right',
      heroSprite: 'aida',
      npcs: [
        { id: 'paladin', x: 11, y: 6, sprite: 'pal', facing: 'down', name: 'David' },
        { id: 'dj', x: 1, y: 5, sprite: 'maha', facing: 'right', name: 'DJ' }
      ],
      waypoints: [
        { id: 'the-table', x: 12, y: 7 }
      ]
    };
  },
  async play({ mission, dialogue, setAffection, sfx, delay }) {
    await delay(240);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "(The room is empty. One DJ. Just us.)"
    });
    mission.setHint(12, 7);
    // A few hearts on the way to make it playful.
    mission.spawnHeartPickup(5, 10, () => setAffection(3));
    mission.spawnHeartPickup(9, 8, () => setAffection(3));
    await mission.waitForWaypoint('the-table');
    mission.clearHint();
    sfx.select();
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "I picked somewhere quiet. Figured you'd hate a crowd on a first date."
    });
    const r = await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "That's either very sweet or very suspicious.",
      choices: ['Sweet.', 'Suspicious.', 'Both. Definitely both.']
    });
    const heLine = [
      "Good. I was aiming for sweet.",
      "Fair. I'd suspect me too.",
      "Honestly? Both. Let's order."
    ][r];
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: heLine
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "My favorite book. There\u2019s a character in it who is like a nerve \u2014 one that\u2019s too sensitive."
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "That\u2019s me."
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "Me too. In my own way."
    });
    await delay(260);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "Let\u2019s go to Secret."
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "Yes \u2014 but we\u2019ve got dinner leftovers. Let me drop them at my place first."
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(Your place. Right.)'
    });
    setAffection(3);
    sfx.heart();
    await delay(400);
  }
};

// ===========================================================================
// CHAPTER VII — "His Apartment" (Guitar → Piano → Dance → Kiss — one evening)
// ===========================================================================

const mission7Apartment = {
  id: 'm7',
  chapter: 'VII',
  when: 'The long evening at mine',
  title: 'His Apartment',
  briefing:
    "You came up for one minute. Just to drop the food.\n\nThere was a guitar on the couch. A piano in the corner. The TV across the room. The Christmas tree still blinking.\n\nWe didn't leave for hours.",
  outro:
    "(Guitar. Piano. A cheek, a thank-you, and then later \u2014 the record.)\n\nThe Mills Brothers. The rug. A kiss against the wall.\n\nAnd then someone knocked.",
  audioLoop: 'apartment',
  // First half of the night — warm lamp glow from next to the piano.
  effects: ['lampglow'],
  buildScene() {
    const map = apartmentMap();
    return {
      id: 'm7',
      map,
      walk: walkFromMap(map),
      spawn: { x: 2, y: 7 },
      heroFacing: 'right',
      heroSprite: 'aida',
      // David starts on the RIGHT couch, already holding the guitar.
      npcs: [
        { id: 'paladin', x: 17, y: 5, sprite: 'pal1', facing: 'left', name: 'David' }
      ],
      waypoints: [
        // The RIGHT couch, across from the TV — where they listen to guitar.
        { id: 'couch-guitar', x: 16, y: 6 },
        // The PIANO, across from the bottom couch — Aida sits on the LEFT seat.
        { id: 'piano-bench', x: 7, y: 1 },
        { id: 'katana', x: 15, y: 8 },
        { id: 'record-player', x: 2, y: 6 },
        { id: 'rug-center', x: 7, y: 7 },
        // Where they end up during the final kiss — top-left corner.
        { id: 'kiss-corner', x: 2, y: 1 }
      ]
    };
  },
  async play({
    mission,
    dialogue,
    fadeText,
    sfx,
    delay,
    audio,
    setAffection,
    spawnMusicNote,
    spawnHeart,
    spawnFirework,
    fadeTo,
    playLoop,
    stopLoop,
    setSceneEffects,
    startSpotlight,
    stopSpotlight,
    actionButton
  }) {
    // ~~~~~~~ ACT 1 — Guitar on the RIGHT couch (across from the TV) ~~~~~~~
    // First half of the night: the big lamp by the piano is the main light.
    await delay(300);
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "Come in. Just dropping the food. \u2014 unless you want to hear something first?"
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(He\u2019s got the guitar in his lap already.)',
      choices: ['Sit by him.', 'I\u2019m listening.']
    });
    // Hint her toward the floor tile next to the right couch.
    mission.setHint(16, 6);
    await mission.waitForWaypoint('couch-guitar');
    mission.clearHint();
    // She sits — swap to the sitting sprite.
    mission.setHeroSprite('aida1');
    mission.setHeroFacing('right');
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: '(He cracks his knuckles, tunes a string, looks at you once. Starts to play.)'
    });
    // --- SPOTLIGHT: the room dims, only David is lit up playing the guitar.
    setSceneEffects([]);
    const davidForSpot = mission.npcs.get('paladin');
    // Two overlapping light pools on David = one tight circle around him.
    startSpotlight(
      { x: davidForSpot.px + 8, y: davidForSpot.py + 2 },
      { x: davidForSpot.px + 8, y: davidForSpot.py + 2 }
    );
    await delay(220);
    audio.sweetChild();
    for (let i = 0; i < 14; i++) {
      setTimeout(() => {
        spawnMusicNote(17 * 16 + (i % 3) * 3, 5 * 16 - 2);
      }, i * 340);
    }
    await delay(5400);
    // Lights come back up, lamp glow resumes.
    stopSpotlight();
    setSceneEffects(['lampglow']);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "(You look at him differently. You can\u2019t help it.)"
    });
    spawnHeart(mission.hero.px + 8, mission.hero.py - 2);
    sfx.heart();
    setAffection(6);

    // ~~~~~~~ ACT 2 — Piano (Aida LEFT, David RIGHT) ~~~~~~~
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: 'One more. \u2014 Come sit at the piano.'
    });
    // David WALKS from the couch to the piano. Hop one tile off the blocked
    // couch first, then pathfind the rest of the way.
    mission.setNpcPos('paladin', 17, 8, 'left');
    mission.setNpcSprite('paladin', 'pal');
    await mission.moveNpcTo('paladin', 9, 1);
    mission.setNpcFacing('paladin', 'left');

    mission.setHeroSprite('aida');
    mission.onWaypointEnter('katana', async () => {
      await dialogue({
        portrait: 'aida',
        name: 'Aida',
        text: '(A real katana. Of course he has a real katana.)'
      });
    });
    // Aida walks up to the LEFT seat (col 7, row 1). Hint at her target.
    mission.setHint(7, 1);
    mission.spawnHeartPickup(4, 4, () => {});
    await mission.waitForWaypoint('piano-bench');
    mission.clearHint();
    mission.setHeroFacing('right');
    mission.setHeroSprite('aida1'); // sitting at the piano
    sfx.chime();
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: 'Play the one we sang in the car.'
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "\u201cI Think I\u2019m in Love with My Best Friend\u201d? You\u2019re dangerous."
    });
    audio.bestFriend();
    for (let i = 0; i < 12; i++) {
      setTimeout(
        () => spawnMusicNote(8 * 16 + (i % 3) * 3, 1 * 16 + (i % 2) * 2),
        i * 380
      );
    }
    await delay(4600);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(You sang the second verse with him. Neither of you mentioned it after.)'
    });

    // --- He pulls her chair closer before leaning in ---
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: '(He reaches for the leg of your chair and slides it closer. Closer.)'
    });
    // Aida slides from col 7 → col 8 (one tile RIGHT, toward David at col 9).
    // She is LEFT, David is RIGHT, shoulder to shoulder now.
    if (mission.hero) {
      mission.hero.gx = 8; mission.hero.gy = 1;
      mission.hero.x = 8;  mission.hero.y = 1;
      mission.hero.px = 8 * 16; mission.hero.py = 1 * 16;
      mission.hero.path = [];
    }
    mission.setHeroFacing('right');
    sfx.chime();
    await delay(260);
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: '(He\u2019s looking at you instead of the keys. He leans in.)'
    });
    await delay(400);
    // --- CHEEK KISS — no multiple choice here (she chooses with her face). ---
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(You turn your cheek. Say thank you.)'
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: 'Thank you.'
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "I'm not trying anything. I promise."
    });
    await delay(400);

    // ~~~~~~~ INTERLUDE — fade to later ~~~~~~~
    // Second half of the night: the big lamp is off, the TV glow + tree
    // lights do the heavy lifting. Moodier, dimmer.
    fadeTo(1, 900);
    await delay(1100);
    await fadeText('\u2014 later that night \u2014', { duration: 2400 });
    // Swap the scene lighting: lamp off, TV + tree glow.
    setSceneEffects(['moodynight']);
    fadeTo(0, 700);
    await delay(800);
    // David gets off the piano and WALKS down to the bottom couch.
    mission.setNpcPos('paladin', 9, 2, 'down');
    mission.setNpcSprite('paladin', 'pal');
    await mission.moveNpcTo('paladin', 9, 10);
    mission.setNpcSprite('paladin', 'pal1');
    mission.setNpcFacing('paladin', 'up');
    mission.setHeroSprite('aida'); // standing up
    mission.setHeroFacing('right');

    // ~~~~~~~ ACT 3 — TV + Dance + FINAL KISS (top-left) ~~~~~~~
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: 'Turn on the TV. There\u2019s a playlist queued.'
    });
    mission.setHint(2, 6);
    mission.spawnHeartPickup(5, 7, () => {});
    mission.spawnHeartPickup(3, 6, () => {});
    await mission.waitForWaypoint('record-player');
    mission.clearHint();
    sfx.select();
    const c = await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(The Mills Brothers. Of course.)',
      choices: ['Press play.', '\u25B6 Play the real thing on YouTube.']
    });
    if (c === 1) {
      window.open(
        'https://www.youtube.com/results?search_query=mills+brothers+till+then',
        '_blank',
        'noopener'
      );
    }

    // --- SHOTS before Mills Brothers — he pours two. ---
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: 'Wait \u2014 one more shot first. It\u2019s the rule.'
    });
    const shotsAct3 = await actionButton({
      label: '\uD83E\uDD43 Shot',
      subtitle: 'Clink with David.',
      target: 2
    });
    for (let i = 0; i < shotsAct3; i++) {
      setTimeout(() => {
        if (mission.hero) spawnHeart(mission.hero.px + 8, mission.hero.py - 4);
        const d = mission.npcs.get('paladin');
        if (d) spawnHeart(d.px + 8, d.py - 4);
      }, i * 160);
    }
    sfx.heart();
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(Warm. Honest. A little brave.)'
    });

    stopLoop();
    await delay(200);
    playLoop('dance');
    sfx.chime();
    audio.tillThen();
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: 'Come here.'
    });
    // David WALKS from the bottom couch up to the middle of the rug.
    mission.setNpcSprite('paladin', 'pal');
    mission.setNpcPos('paladin', 9, 10, 'up');
    await mission.moveNpcTo('paladin', 8, 7);
    mission.setHint(7, 7);
    await mission.waitForWaypoint('rug-center');
    mission.clearHint();
    mission.setNpcFacing('paladin', 'left');
    mission.setHeroFacing('right');
    await delay(600);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(He puts a hand on your waist. You put yours on his shoulder. You sway.)'
    });
    await delay(600);
    for (let i = 0; i < 6; i++) {
      setTimeout(
        () => mission.spawnMusicNote((7 + (i % 2)) * 16 + Math.random() * 4, 7 * 16),
        i * 220
      );
    }
    await delay(900);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: 'This is stupid.'
    });
    await delay(260);
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: 'Yeah.'
    });
    await delay(260);

    // --- FINAL KISS CHOICE — keep dancing, or finally kiss him. ---
    const finalChoice = await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(It\u2019s now or another song.)',
      choices: ['Keep dancing.', 'Finally kiss David.']
    });
    if (finalChoice === 0) {
      // One more turn on the rug, then the kiss anyway.
      await dialogue({
        portrait: 'aida',
        name: 'Aida',
        text: '(One more turn. One more. Okay \u2014 now.)'
      });
      for (let i = 0; i < 4; i++) {
        setTimeout(
          () => mission.spawnMusicNote((7 + (i % 2)) * 16, 7 * 16 - 2),
          i * 240
        );
      }
      await delay(1000);
    }

    // Both WALK to the TOP-LEFT corner — no teleports, they walk together.
    mission.setHint(2, 1);
    // Kick David off on his walk first so he goes in parallel.
    mission.moveNpcTo('paladin', 3, 1);
    // Aida walks to (2, 1) via the waypoint hint — player can also just click.
    await mission.waitForWaypoint('kiss-corner');
    mission.clearHint();
    // If David hasn't finished walking yet, wait a moment for him to catch up.
    let tries = 0;
    while (tries < 12) {
      const d = mission.npcs.get('paladin');
      if (d && d.gx === 3 && d.gy === 1) break;
      await delay(200);
      tries++;
    }
    mission.setNpcFacing('paladin', 'left');
    mission.setHeroFacing('right');
    await delay(500);

    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(Your back\u2019s against the wall. His hand\u2019s on your jaw.)'
    });
    await delay(300);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: '(She kisses him.)'
    });
    // Soft hearts + fireworks only — no god rays.
    const burstAt = (x, y, delayMs) => {
      setTimeout(() => {
        spawnFirework(x, y);
        sfx.boom();
      }, delayMs);
    };
    burstAt(2 * 16 + 8, 1 * 16 - 4, 0);
    burstAt(3 * 16 + 8, 2 * 16 - 4, 260);
    burstAt(1 * 16 + 6, 2 * 16 - 2, 520);
    burstAt(4 * 16 + 4, 1 * 16, 820);
    // Cascading hearts across the screen.
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const x = 30 + Math.random() * 260;
        const y = 40 + Math.random() * 140;
        mission.spawnHeart(x, y);
      }, 200 + i * 90);
    }
    setAffection(9);
    await delay(2000);
  }
};

// ===========================================================================
// CHAPTER X — "The Knock" (the real finale)
// ===========================================================================

const mission10Knock = {
  id: 'm10',
  chapter: 'X',
  when: 'Still that same night',
  title: 'The Knock',
  briefing:
    "The record got to the end of its side and the room went quiet.\n\nThen three thumps at the door.\n\nNeither of us had invited anybody.",
  outro:
    "(Every fairy tale has a monster. We took turns with ours.)\n\nThe room went quiet again. The tree kept blinking.\n\nWe were both fine. We were both here.",
  audioLoop: 'apartment',
  // Finale keeps the moody TV + tree lighting from the kiss.
  effects: ['moodynight'],
  // Zoom in a little for the boss fight — fits the intensity and keeps
  // Lisa / Aida / David visibly big in frame.
  cameraZoom: 1.6,
  buildScene() {
    const map = apartmentMap();
    return {
      id: 'm10',
      map,
      walk: walkFromMap(map),
      spawn: { x: 7, y: 7 },
      heroFacing: 'down',
      heroSprite: 'aida',
      npcs: [
        { id: 'paladin', x: 8, y: 7, sprite: 'pal', facing: 'left', name: 'David' }
      ],
      waypoints: [
        { id: 'door', x: 1, y: 8 }
      ]
    };
  },
  async play({
    mission,
    dialogue,
    fadeText,
    sfx,
    delay,
    spawnHeart,
    spawnFirework,
    spawnBlood,
    spawnFire,
    shake,
    fadeTo,
    snapFade,
    stopLoop,
    startSpotlight,
    stopSpotlight,
    setCameraTarget,
    setCameraZoom
  }) {
    const ctxSpawnFire = spawnFire;
    await delay(500);

    // Three knocks at the door.
    sfx.knock();
    await delay(200);
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "(\u2026 what was that?)"
    });
    sfx.knock();
    await delay(200);
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "Someone\u2019s at the door. At this hour."
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "(Walk to the door.)"
    });

    mission.setHint(1, 8);
    await mission.waitForWaypoint('door');
    mission.clearHint();

    // Open the door — Lisa is there. At first, she looks normal.
    sfx.chime();
    // Spawn Lisa directly inside the room (was out of bounds at -1 before,
    // which broke pathfinding so she couldn\u2019t walk). She takes several
    // steps into the room BEFORE transforming — first as Lisa.
    mission.addNpc({
      id: 'lisa',
      x: 1, y: 8,
      sprite: 'lisa',
      facing: 'right',
      name: 'Lisa'
    });
    await delay(250);
    // She walks a few tiles in — still as Lisa.
    await mission.moveNpcTo('lisa', 4, 8);

    await dialogue({
      portrait: 'lisa',
      name: 'Lisa',
      text: "Guys\u2026 I came from the club\u2026 something\u2019s wrong\u2026"
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "(Her skin. Her eyes. She\u2019s not right.)"
    });
    await delay(260);
    // She stumbles a couple more tiles closer — then stops.
    await mission.moveNpcTo('lisa', 5, 8);
    await dialogue({
      portrait: 'lisa',
      name: 'Lisa',
      text: 'I don\u2019t feel\u2026 I don\u2019t feel like\u2026 me.'
    });
    await delay(400);

    // --- DRAMATIC TRANSFORMATION ---
    // Music cuts. Camera zooms IN on Lisa (we briefly target her, then
    // snap back to the hero once the sprite has swapped).  Big shakes,
    // spotlight only on her, then she grows.
    stopLoop();
    const lisaNow = mission.npcs.get('lisa');
    // Zoom the camera onto Lisa for the transformation itself.
    if (lisaNow) setCameraTarget(lisaNow);
    setCameraZoom(2.2);
    if (lisaNow) {
      startSpotlight(
        { x: lisaNow.px + 8, y: lisaNow.py + 2 },
        { x: lisaNow.px + 8, y: lisaNow.py + 2 }
      );
    }
    sfx.groan();
    shake(5, 800);
    await delay(500);
    sfx.groan();
    shake(7, 700);
    await delay(500);
    sfx.boom();
    // Swap to big-boss sprite. She doubles in size.
    mission.setNpcSprite('lisa', 'bigmon');
    // Bump her walking speed so the fight feels aggressive.
    if (lisaNow) lisaNow.speed = 3.8;
    shake(10, 900);
    // Big fire burst around her — she's literally igniting.
    if (lisaNow) {
      for (let i = 0; i < 20; i++) {
        ctxSpawnFire?.(
          lisaNow.px + 8, lisaNow.py - 8,
          (Math.random() - 0.5) * 120,
          (Math.random() - 0.5) * 120 - 20
        );
      }
    }
    await delay(900);
    stopSpotlight();
    // Pull the camera back — follow Aida now, wider view so you can see
    // the whole fight unfold.
    setCameraZoom(1.6);
    setCameraTarget(mission.hero);
    await dialogue({
      portrait: 'lisa-zombie',
      name: 'Lisa',
      text: 'RRRGGGHHHHHHH\u2014 AIIIIIDDAAAAA\u2026'
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "(She\u2019s TWICE her size. Dodge the fire. Click her to strike.)"
    });

    // ==============================================================
    // BOSS FIGHT — real mechanics:
    //
    //   * Aida is free to move at any time. Click anywhere walkable
    //     to dash there. Stepping ONTO a fire tile is blocked —
    //     you have to path around the floor as it burns.
    //   * The monster chases, but only ever targets a tile ADJACENT
    //     to Aida — she can always click to strike.
    //   * Every ~2 s the monster spits a gout of fire at Aida's
    //     CURRENT tile. The fire lands as a burning patch that
    //     persists for ~5 s, blocking movement.  Dodge.
    //   * 25 % of AI ticks she breaks off the chase and lurches to
    //     a random apartment tile instead, smashing things (wander).
    //   * David helps: every ~3 s he flicks an assist burst toward
    //     the monster (pure visual — the fight is Aida's).
    //   * 8 hits to win. Each hit: blood burst, shake, groan.
    // ==============================================================
    let hits = 0;
    const TOTAL_HITS = 8;
    await new Promise((resolveFight) => {

      // Shared chase helper — pick an adjacent-to-Aida tile and send Lisa.
      const chaseStep = () => {
        const lisa = mission.npcs.get('lisa');
        const h = mission.hero;
        if (!lisa || !h) return false;
        const dist = Math.abs(lisa.gx - h.gx) + Math.abs(lisa.gy - h.gy);
        if (dist <= 1) return false; // already in striking range
        if (lisa.path.length > 0) return false; // already walking
        const candidates = [
          [h.gx - 1, h.gy], [h.gx + 1, h.gy],
          [h.gx,     h.gy - 1], [h.gx, h.gy + 1]
        ];
        for (const [x, y] of candidates) {
          mission.moveNpcTo('lisa', x, y);
          if (lisa.path.length > 0) return true;
        }
        return false;
      };

      // FIRE the first chase synchronously so Lisa starts walking the
      // instant the fight begins — no dead 700 ms.
      chaseStep();

      // Hint follows the monster so the player always knows where to click.
      const hintTick = setInterval(() => {
        const lisa = mission.npcs.get('lisa');
        if (lisa) mission.setHint(lisa.gx, lisa.gy);
      }, 350);

      mission.onNpcClick('lisa', async (lisa) => {
        hits++;
        sfx.swing();
        await delay(60);
        sfx.hit();
        shake(3 + hits, 260 + hits * 55);
        // Blood spray.
        spawnBlood(lisa.gx * 16 + 8, lisa.gy * 16 + 6);
        spawnBlood(lisa.gx * 16 + 10, lisa.gy * 16 + 2);
        spawnBlood(lisa.gx * 16 + 6, lisa.gy * 16 + 10);
        const paladin = mission.npcs.get('paladin');
        if (paladin) spawnBlood(paladin.px + 8, paladin.py - 4);
        if (hits >= TOTAL_HITS) {
          mission.offNpcClick('lisa');
          clearInterval(hintTick);
          clearInterval(aiTick);
          clearInterval(fireTick);
          clearInterval(davidTick);
          mission.clearHint();
          resolveFight();
          return;
        }
        sfx.groan();
      });

      // --- Chase / wander AI -------------------------------------
      // Faster tick (500 ms) so she visibly chases.
      const aiTick = setInterval(() => {
        if (hits >= TOTAL_HITS) return;
        const lisa = mission.npcs.get('lisa');
        if (!lisa) return;
        // 20 % chance to lurch to a random apartment tile (destruction).
        if (Math.random() < 0.20 && lisa.path.length === 0) {
          const rx = 2 + Math.floor(Math.random() * 16);
          const ry = 2 + Math.floor(Math.random() * 11);
          mission.moveNpcTo('lisa', rx, ry);
          if (lisa.path.length > 0) return;
        }
        chaseStep();
      }, 500);

      // --- Fire breath — aim at Aida's CURRENT tile -------------
      // Spit a gout of particles + light the tile on fire afterward.
      const fireTick = setInterval(() => {
        if (hits >= TOTAL_HITS) return;
        const lisa = mission.npcs.get('lisa');
        const h = mission.hero;
        if (!lisa || !h) return;
        const targetGx = h.gx;
        const targetGy = h.gy;
        const tx = targetGx * 16 + 8;
        const ty = targetGy * 16 + 8;
        const dx = tx - (lisa.px + 8);
        const dy = ty - (lisa.py - 8);
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const speed = 110;
        // Particle stream from her mouth toward the target.
        ctxSpawnFire?.(
          lisa.px + 8, lisa.py - 12,
          (dx / len) * speed, (dy / len) * speed
        );
        sfx.groan();
        // Fire lands on the target tile ~0.6 s later.
        setTimeout(() => {
          if (hits >= TOTAL_HITS) return;
          // Only light walkable floor — never a wall / furniture tile.
          if (mission.data.walk[targetGy]?.[targetGx] !== 0) return;
          mission.spawnFireTile(targetGx, targetGy, 5.5);
        }, 600);
      }, 2000);

      // --- David assist — visual flourishes from his position ----
      const davidTick = setInterval(() => {
        if (hits >= TOTAL_HITS) return;
        const paladin = mission.npcs.get('paladin');
        const lisa = mission.npcs.get('lisa');
        if (!paladin || !lisa) return;
        const px = lisa.px + 8 - (paladin.px + 8);
        const py = lisa.py + 8 - (paladin.py + 8);
        const len = Math.sqrt(px * px + py * py) || 1;
        ctxSpawnFire?.(
          paladin.px + 8, paladin.py - 4,
          (px / len) * 90, (py / len) * 90
        );
        sfx.swing();
      }, 3000);
    });

    // Clean up any remaining fire so the room isn't still burning.
    mission.clearFireTiles();

    sfx.boom();
    spawnFirework(1 * 16 + 8, 8 * 16);
    mission.removeNpc('lisa');
    await delay(400);

    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "(She\u2019s down. He\u2019s at your side.)"
    });
    await dialogue({
      portrait: 'aida',
      name: 'Aida',
      text: "Did that just happen?"
    });
    await dialogue({
      portrait: 'paladin',
      name: 'David',
      text: "Every good story needs a monster."
    });

    // Final fireworks — the real birthday.
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const x = 60 + Math.random() * 200;
        const y = 40 + Math.random() * 120;
        spawnFirework(x, y);
        sfx.boom();
      }, i * 400);
    }
    await delay(2400);

    fadeTo(1, 1400);
    await delay(1500);
    await fadeText('— Happy Birthday, Aida. —', { duration: 3600 });
    stopLoop();
  }
};

// ---------------------------------------------------------------------------
// Credits
// ---------------------------------------------------------------------------

export const credits = {
  finalCard: 'Happy Birthday,\nAida.',
  lines: [
    { heading: true, text: 'for Aidka' },
    { text: '' },
    { heading: true, text: 'Cast' },
    { text: 'Aida' },
    { text: 'David' },
    { text: 'Lisa  \u2014  keeper of Balagan' },
    { text: 'Maha  \u2014  (not the Wolverine)' },
    { text: 'The Mills Brothers  \u2014  playing somewhere else' },
    { text: '' },
    { heading: true, text: 'Places' },
    { text: 'Balagan  \u2014  the back room' },
    { text: 'Balagan  \u2014  the dance floor, New Year\u2019s' },
    { text: 'A flat on Patriki' },
    { text: 'Bolshaya Nikitskaya 13' },
    { text: 'Presnya  \u2014  a room with a fever' },
    { text: 'Mo Bar  \u2014  mirrored, empty, ours' },
    { text: 'Our place, with a Christmas tree' },
    { text: '' },
    { heading: true, text: 'Soundtrack' },
    { text: 'Sweet Child O\u2019 Mine' },
    { text: 'I Think I\u2019m in Love with My Best Friend' },
    { text: 'Till Then  \u2014  the Mills Brothers,' },
    { text: 'somewhere else, in your memory' },
    { text: '' },
    { heading: true, text: 'With love' },
    { text: 'to Aida  \u2014  for "are you serious"' },
    { text: 'and laughing anyway.' },
    { text: 'For "this is stupid"' },
    { text: 'and the kiss.' },
    { text: 'And every day since.' },
    { text: '' },
    { text: '\u2014 David \u{1F49C}' }
  ]
};

// ---------------------------------------------------------------------------
// Campaign order
// ---------------------------------------------------------------------------

export const missions = [
  mission1,          // I     — A Goth on the Stairs
  mission2,          // II    — Silver Pants (NYE)
  mission3,          // III   — Lisa's Place
  mission3b,         // III\u00BD  — Dinner, Before the Pharmacy
  mission4,          // IV    — The Pharmacy Walk
  mission5Fever,     // V     — Forty Degrees
  mission6MoBar,     // VI    — First Date: Mo Bar
  mission7Apartment, // VII   — His Apartment
  mission10Knock     // VIII  — The Knock (finale)
];
