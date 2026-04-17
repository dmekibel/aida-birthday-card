// assets.js — palette system, procedural tiles, and character sprites.
//
// Every tile / sprite is pre-rendered to a canvas at boot, so the runtime
// render cost is a single drawImage per object. Cheap and pixel-perfect.
//
// Tiles are authored as 16×16 strings using a character-to-colour mapping:
//    '.' = palette[0], '1' = palette[1], '2' = palette[2], etc.
//    ' ' = transparent.
// Palettes are plain arrays of CSS colour strings. Swap a palette and the
// same tile definition becomes, e.g. sickbed pink or apartment warm-brown.

import { TILE } from './engine.js';

// -------- palettes ---------------------------------------------------------

export const PALETTES = {
  // Moscow winter night — Bolshaya Nikitskaya.  Brick-red buildings, snowy
  // sidewalk, dark asphalt road, warm sodium streetlamps.
  winter: [
    '#00000000', // 0 transparent
    '#050810',   // 1 deep sky
    '#0c1224',   // 2 night blue
    '#1a2340',   // 3 window glow navy
    '#3a1e18',   // 4 brick shadow
    '#6a2a22',   // 5 brick red
    '#8a3a2e',   // 6 brick highlight
    '#2e323a',   // 7 sidewalk dark
    '#5a6070',   // 8 sidewalk mid
    '#e8eef4',   // 9 snow white
    '#12141a',   // a asphalt dark
    '#22252e',   // b asphalt mid
    '#f7c24a',   // c lamp warm yellow
    '#fff2c8',   // d lamp bright
    '#701820',   // e car red
    '#c5e0ff'    // f car glass / reflective
  ],
  // Lisa's apartment — back to the original dark/gothic look (black walls,
  // black leather couch, red lamp) but with the NEW floral-rose carpet
  // (near-black + dark-green leaves + scattered red roses) keeping slots 4-9.
  goth: [
    '#00000000', // 0 transparent
    '#050305',   // 1 near-black shadow
    '#0d0509',   // 2 black wall base
    '#1a0c12',   // 3 wall highlight (maroon)
    '#121a15',   // 4 rug near-black ground
    '#1e2e25',   // 5 rug dark green (leaves)
    '#2d4636',   // 6 rug green highlight
    '#6a0f1c',   // 7 rose shadow (deep crimson)
    '#b81a28',   // 8 rose red
    '#e83040',   // 9 rose highlight
    '#151117',   // a couch shadow
    '#221621',   // b couch black
    '#3a2430',   // c couch highlight
    '#f8c850',   // d lamp warm gold
    '#ff5a30',   // e red lamp shade
    '#f2e1ca'    // f off-white / candle
  ],
  // David's real apartment — cream walls, light blond wood floor,
  // navy-blue floral-damask couches, beige oriental rug, gold-framed art.
  // Sampled from the reference photos.
  home: [
    '#00000000', // 0 transparent
    '#9a8a6a',   // 1 wall shadow / crown-molding line
    '#e8dec4',   // 2 wall main (cream / off-white)
    '#f6efd8',   // 3 wall highlight (warm near-white)
    '#7a5a32',   // 4 floor shadow (dark wood plank line)
    '#b78f5c',   // 5 floor main (blond wood)
    '#d2ae7c',   // 6 floor highlight
    '#c9b38c',   // 7 rug base (beige oriental)
    '#8a6a46',   // 8 rug darker thread
    '#a02e38',   // 9 rug accent (dusty rose / red)
    '#141a2c',   // a couch navy dark
    '#1e2a46',   // b couch navy mid
    '#c6b29a',   // c couch damask cream pattern
    '#c89a3e',   // d gold frame / lamp shade
    '#3a2410',   // e dark wood (piano, end tables)
    '#f4efe4'    // f cream / white
  ],
  // Interior warm — restaurant, bar, sickbed base
  warm: [
    '#241812', // 0 deep brown (shadow / outline)
    '#3d2716', // 1 dark brown
    '#5a3a20', // 2 wood mid
    '#7a5230', // 3 wood light
    '#a07645', // 4 wood highlight
    '#c49a6c', // 5 paper / soft highlight
    '#f2dcad', // 6 candle cream
    '#8a5a1c', // 7 deep gold
    '#d4a24a', // 8 gold
    '#1a0e06', // 9 black
    '#6b4217', // a bronze
    '#3a1f0d', // b shadow deep
    '#e8cc8e', // c parchment
    '#a02a2a', // d wine red
    '#2a4a3a', // e forest green
    '#5a8a6a' // f mint / plant
  ],
  // Interior cold — club staircase (neon + black leather)
  cold: [
    '#060810', // 0 near-black
    '#0f1420', // 1 deep navy
    '#1d1a2a', // 2 dark purple
    '#2e2440', // 3 bruise purple
    '#6a3d7a', // 4 neon violet
    '#d03a95', // 5 hot pink
    '#38a0d4', // 6 neon cyan
    '#eaf0ff', // 7 moonlight
    '#181820', // 8 leather black
    '#2a2a34', // 9 leather shine
    '#4a4a5a', // a metal rail
    '#8090a8', // b metal shine
    '#ff88d4', // c neon magenta bright
    '#66ddff', // d neon cyan bright
    '#a030c0', // e neon purple bright
    '#ffffff' // f pure white
  ],
  // Aida's sprite + portrait palette — darker, straighter hair.
  aida: [
    '#00000000', // 0 transparent
    '#20110a', // 1 shadow
    '#3a1e10', // 2 skin shadow
    '#c99070', // 3 skin
    '#e6b38a', // 4 skin highlight
    '#080306', // 5 hair deepest (near black)
    '#120809', // 6 hair main (very dark)
    '#6b3a18', // 7 warm brown (used for Lisa's hair)
    '#b2184f', // 8 pink / sweater
    '#e0a000', // 9 yellow / sweater
    '#e03a30', // a orange / sweater
    '#4a2090', // b purple / sweater sleeve
    '#1a1a20', // c black (dress / base)
    '#c0a5c8', // d silver (pendant)
    '#f5d0e0', // e lip tone
    '#ffffff' // f white
  ],
  // Zombie Lisa palette — sickly green skin, dark hair, blood-red torn dress
  zombie: [
    '#00000000', // 0 transparent
    '#0a0a06',   // 1 deep shadow
    '#1f2a15',   // 2 green shadow
    '#3a4a28',   // 3 zombie skin base (sickly green)
    '#5a6a3e',   // 4 zombie skin highlight
    '#1a0a0e',   // 5 hair shadow
    '#2d1418',   // 6 hair dark
    '#4a2424',   // 7 hair mid
    '#8a1020',   // 8 blood red
    '#4a0a10',   // 9 dark blood
    '#f8f8d0',   // a dead-eye white / yellowed
    '#1a1010',   // b torn black dress base
    '#a0a090',   // c pale torn cloth
    '#202020',   // d black outline
    '#7a3a5a',   // e bruise purple
    '#ff3a3a'    // f bright red (eye gleam)
  ],
  // Stone — cold greys for the Balagan back room (white-grey walls, dark grey floor).
  stone: [
    '#00000000', // 0 transparent
    '#141416',   // 1 near-black shadow
    '#212125',   // 2 very dark grey — floor speckle darker
    '#303036',   // 3 dark grey — floor main
    '#3f3f46',   // 4 floor highlight
    '#5a5a62',   // 5 wall shadow
    '#8e8e95',   // 6 wall mid (light grey)
    '#b2b2b8',   // 7 wall highlight (lighter grey)
    '#dcdce0',   // 8 wall brightest (near-white)
    '#060608',   // 9 couch leather (deep black)
    '#18181a',   // a couch black mid
    '#2d2d30',   // b couch highlight / chair dark
    '#4a4a52',   // c chair cushion / generic mid
    '#e04048',   // d cigarette ember red
    '#a8a8b0',   // e smoke grey (light)
    '#ffffff'    // f pure white
  ],
  // David in his NYE outfit — metallic silver trousers, same top.
  paladinSilver: [
    '#00000000', // 0 transparent
    '#1a1208', // 1 shadow
    '#2a1c10', // 2 skin shadow
    '#c19270', // 3 skin
    '#dfad83', // 4 skin highlight
    '#2a1510', // 5 hair dark / beard
    '#3d2018', // 6 hair mid
    '#5a2f22', // 7 hair light
    '#e8e2d6', // 8 white shirt
    '#b8afa0', // 9 white shirt shadow
    '#181818', // a black t-shirt
    '#8a6030', // b piano/wood prop
    '#d03030', // c Ozzy red text (tshirt accent)
    '#c0a04a', // d bronze / bracelet
    '#c8c8d8', // e SILVER pants (was dark)
    '#ffffff' // f white (pant highlight / chrome shine)
  ],
  // Paladin's sprite + portrait palette
  paladin: [
    '#00000000', // 0 transparent
    '#1a1208', // 1 shadow
    '#2a1c10', // 2 skin shadow
    '#c19270', // 3 skin
    '#dfad83', // 4 skin highlight
    '#2a1510', // 5 hair dark / beard
    '#3d2018', // 6 hair mid
    '#5a2f22', // 7 hair light
    '#e8e2d6', // 8 white shirt
    '#b8afa0', // 9 white shirt shadow
    '#181818', // a black t-shirt
    '#8a6030', // b piano/wood prop
    '#d03030', // c Ozzy red text (tshirt accent)
    '#c0a04a', // d bronze / bracelet
    '#2a2a2a', // e pants
    '#ffffff' // f white
  ]
};

// -------- tile authoring helper -------------------------------------------

function mkTile(paletteName, rows) {
  // rows = array of 16 strings, each 16 chars.
  const pal = PALETTES[paletteName];
  const c = document.createElement('canvas');
  c.width = TILE;
  c.height = TILE;
  const g = c.getContext('2d');
  for (let y = 0; y < TILE; y++) {
    const row = rows[y] ?? '';
    for (let x = 0; x < TILE; x++) {
      const ch = row[x] ?? ' ';
      if (ch === ' ' || ch === '-') continue; // transparent
      const idx = ch === '.' ? 0 : parseInt(ch, 16);
      if (Number.isNaN(idx)) continue;
      const col = pal[idx];
      if (!col || col === '#00000000') continue;
      g.fillStyle = col;
      g.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

// -------- sprite authoring helper (arbitrary dimensions) ------------------

function mkSprite(paletteName, rows, w, h) {
  const pal = PALETTES[paletteName];
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  for (let y = 0; y < h; y++) {
    const row = rows[y] ?? '';
    for (let x = 0; x < w; x++) {
      const ch = row[x] ?? ' ';
      if (ch === ' ' || ch === '-') continue;
      const idx = ch === '.' ? 0 : parseInt(ch, 16);
      if (Number.isNaN(idx)) continue;
      const col = pal[idx];
      if (!col || col === '#00000000') continue;
      g.fillStyle = col;
      g.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

// -------- procedural tile fills (for large repeating surfaces) ------------

// Accept either a number (0-15) or a hex digit string ('0'-'f') as a palette index.
function pIdx(v) {
  return typeof v === 'string' ? parseInt(v, 16) : v;
}

function proceduralFloor(palette, base, accent, accent2) {
  const c = document.createElement('canvas');
  c.width = TILE;
  c.height = TILE;
  const g = c.getContext('2d');
  const pal = PALETTES[palette];
  g.fillStyle = pal[pIdx(base)];
  g.fillRect(0, 0, TILE, TILE);
  // horizontal wood-plank grain
  g.fillStyle = pal[pIdx(accent)];
  for (let y = 0; y < TILE; y += 4) g.fillRect(0, y + 3, TILE, 1);
  // small speckle
  g.fillStyle = pal[pIdx(accent2)];
  const dots = [
    [2, 1],
    [9, 2],
    [5, 6],
    [13, 7],
    [3, 10],
    [11, 11],
    [7, 14]
  ];
  for (const [x, y] of dots) g.fillRect(x, y, 1, 1);
  return c;
}

function proceduralWall(palette, base, shadow, highlight) {
  const c = document.createElement('canvas');
  c.width = TILE;
  c.height = TILE;
  const g = c.getContext('2d');
  const pal = PALETTES[palette];
  g.fillStyle = pal[pIdx(base)];
  g.fillRect(0, 0, TILE, TILE);
  g.fillStyle = pal[pIdx(highlight)];
  g.fillRect(0, 0, TILE, 1);
  g.fillStyle = pal[pIdx(shadow)];
  g.fillRect(0, TILE - 2, TILE, 2);
  // brick join lines
  g.fillStyle = pal[pIdx(shadow)];
  g.fillRect(7, 0, 1, 8);
  g.fillRect(0, 8, TILE, 1);
  g.fillRect(3, 8, 1, 8);
  g.fillRect(11, 8, 1, 8);
  return c;
}

function proceduralRug(palette, base, stripe, warm) {
  const c = document.createElement('canvas');
  c.width = TILE;
  c.height = TILE;
  const g = c.getContext('2d');
  const pal = PALETTES[palette];
  g.fillStyle = pal[pIdx(base)];
  g.fillRect(0, 0, TILE, TILE);
  g.fillStyle = pal[pIdx(stripe)];
  for (let y = 2; y < TILE; y += 5) g.fillRect(0, y, TILE, 1);
  g.fillStyle = pal[pIdx(warm)];
  for (let x = 0; x < TILE; x += 4) g.fillRect(x, 0, 1, TILE);
  return c;
}

// -------- tile library ----------------------------------------------------
// Key naming convention: <location>.<object> or <location>.<surface>-<variant>

export const tiles = {};

export function buildTiles() {
  // APARTMENT — David's real place: cream walls, blond-wood floor, beige rug.
  tiles['apt.floor'] = proceduralFloor('home', 5, 4, 6);
  tiles['apt.floor-alt'] = proceduralFloor('home', 6, 4, 5);
  tiles['apt.wall'] = proceduralWall('home', 2, 1, 3);
  tiles['apt.rug'] = proceduralRug('home', 7, 8, 9);
  tiles['apt.rug-edge'] = proceduralRug('home', 8, 7, 'd');

  // Piano — made up of 2x2 tiles (piano is 2 wide × 2 tall)
  tiles['apt.piano-tl'] = mkTile('warm', [
    '9999999999999999',
    '9111111111111119',
    '91cccccccccccc19',
    '91c22222222cc19',
    '91c2caca2cac219',
    '91c2aaaa2aaa219',
    '91c2cccc2ccc219',
    '91c22222222cc19',
    '91cccccccccccc19',
    '9122222222222219',
    '91ffffffffff1119',
    '91f9f9f9f9f9ff19',
    '91ffffffffff1119',
    '91f9f9f9f9f9ff19',
    '91ffffffffff1119',
    '9999999999999999'
  ]);
  tiles['apt.piano-tr'] = tiles['apt.piano-tl']; // mirror at draw time if desired

  // Christmas tree (2 tiles tall)
  tiles['apt.xmas-top'] = mkTile('warm', [
    '.......9........',
    '......989.......',
    '......ee8.......',
    '.....eee8e......',
    '....e88ee8e.....',
    '....ee8e8ee.....',
    '...eee8ee8ee....',
    '...ee888eee8e...',
    '..ee8eee8e8eee..',
    '..e888ee8888ee..',
    '.eee8eeee8ee8e..',
    '.ee8888eee888ee.',
    'eeeee8ee8eee8ee.',
    'ee888ee8888ee8e.',
    'eeee8eee8ee8eee.',
    '....aaaaaaaa....'
  ]);
  tiles['apt.xmas-bot'] = mkTile('warm', [
    'ee8888888eee8eee',
    'eeeee8ee8e88eeee',
    'e88ee8ee8e8ee8ee',
    'eee8888ee8888eee',
    '..88..........88',
    '...8a8888888a8..',
    '....aaaaaaaa....',
    '....a222222a....',
    '....a222222a....',
    '....a222222a....',
    '.....aaaaaa.....',
    '................',
    '................',
    '................',
    '................',
    '................'
  ]);

  // Floral-lamp (2 tiles tall)
  tiles['apt.lamp-top'] = mkTile('warm', [
    '................',
    '......8888......',
    '.....8dcdc8.....',
    '....8dccccd8....',
    '...8acdccdca8...',
    '..8aaccdccaa8...',
    '..8aa8cc8caa8...',
    '..88ddcccdd88...',
    '...8ccdcdcc8....',
    '....88888888....',
    '........8.......',
    '........8.......',
    '........8.......',
    '........8.......',
    '........8.......',
    '........8.......'
  ]);
  tiles['apt.lamp-bot'] = mkTile('warm', [
    '........8.......',
    '........8.......',
    '........8.......',
    '.......222......',
    '......22222.....',
    '.....2222222....',
    '....222b2b222...',
    '....2b2222b2....',
    '....222222222...',
    '....2bbbbbbb2...',
    '.....22222222...',
    '................',
    '................',
    '................',
    '................',
    '................'
  ]);

  // Framed painting (1 tile)
  tiles['apt.painting'] = mkTile('warm', [
    '1111111111111111',
    '1777777777777771',
    '1722e2222eeee271',
    '172eee22eeeee271',
    '172e55eeeee55271',
    '172eeeeee5e5e271',
    '17255eeeeeeee271',
    '172e55eeee55ee71',
    '172e5eeeeeeee271',
    '172ee55eeeeee271',
    '172eeeeee555e271',
    '172e555eeeeee271',
    '172eeeeeee55e271',
    '172e55eeee5e5271',
    '1777777777777771',
    '1111111111111111'
  ]);

  // Katana leaning against wall (1 tile)
  tiles['apt.katana'] = mkTile('warm', [
    '.............9..',
    '............97..',
    '............c7..',
    '...........97...',
    '...........c7...',
    '..........97....',
    '..........c7....',
    '.........97.....',
    '.........c7.....',
    '........97......',
    '........c7......',
    '.......97.......',
    '.......c9.......',
    '......ccd.......',
    '.....cccd.......',
    '.....ccd........'
  ]);

  // David's BEDROOM bed — dark wood frame, grey-blue bedding, cream sheets,
  // small red accent cushion. Tiles cleanly when placed in a 4x4 block.
  // apt.bed-head: the headboard + pillow row (top of the bed)
  tiles['apt.bed-head'] = mkTile('home', [
    'eeeeeeeeeeeeeeee',
    'eeeeeeeeeeeeeeee',
    'e11111111111111e',
    'e11111111111111e',
    'e11111111111111e',
    'eeeeeeeeeeeeeeee',
    'e...ffffffff...e',
    'e..f9fff9ff9f..e',
    'e..f99fffff9f..e',
    'e..f9f999f99f..e',
    'e...ffffffff...e',
    'eeeeeeeeeeeeeeee',
    'ebbbbbbbbbbbbbbe',
    'ebbcbbbbbbbbbbbe',
    'ebbbbbbbcbbbbbbe',
    'ebbbbcbbbbbbbbbe'
  ]);
  // apt.bed-body: middle of the bed — grey-blue blanket with speckled pattern.
  tiles['apt.bed-body'] = mkTile('home', [
    'ebbbbbbbbbbbbbbe',
    'ebbbbbbbcbbbbbbe',
    'ebbcbbbbbbbbbbbe',
    'ebbbbbbbbbbcbbbe',
    'ebbbbbbbbbbbbbbe',
    'ebbbbcbbbbbbbbbe',
    'ebbbbbbbbbbbbcbe',
    'ebbbbbbbcbbbbbbe',
    'ebbcbbbbbbbbbbbe',
    'ebbbbbbbbbbbbbbe',
    'ebbbbbbbbbbbcbbe',
    'ebbbbbcbbbbbbbbe',
    'ebbbbbbbbbbbbbbe',
    'ebbbbbbbbbbcbbbe',
    'ebbbbcbbbbbbbbbe',
    'ebbbbbbbbbbbbbbe'
  ]);
  // apt.bed-foot: bottom of the bed — dark wood foot rail.
  tiles['apt.bed-foot'] = mkTile('home', [
    'ebbbbbbbcbbbbbbe',
    'ebbbbbbbbbbbbbbe',
    'ebbbbcbbbbbbbcbe',
    'ebbbbbbbbbbbbbbe',
    'ebbbcbbbbbbbbbbe',
    'ebbbbbbbbbbbbbbe',
    'ebbbbbbbbbcbbbbe',
    'ebbbbbbbbbbbbbbe',
    'eeeeeeeeeeeeeeee',
    'eeeeeeeeeeeeeeee',
    'e4444444444444e.',
    'e4444444444444e.',
    'eeeeeeeeeeeeeeee',
    '................',
    '................',
    '................'
  ]);
  // Nightstand with a small blue bottle on top.
  tiles['apt.nightstand'] = mkTile('home', [
    '................',
    '.eeeeeeeeeeeeee.',
    '.eccccccccccccd.',
    '.eccccccccccccd.',
    '.eddeeeeeeeeeee.',
    '.e............e.',
    '.e.bbb..ffff.e..',
    '.e.bbb..ffff.e..',
    '.e.bbb..ffff.e..',
    '.eddeeeeeeeeeee.',
    '.e............e.',
    '.e............e.',
    '.eddeeeeeeeeeee.',
    '.e............e.',
    '.eeeeeeeeeeeeee.',
    '................'
  ]);
  // Dark bookshelf (left wall of David's bedroom).
  tiles['apt.bookshelf'] = mkTile('home', [
    'eeeeeeeeeeeeeeee',
    'eeeeeeeeeeeeeeee',
    'ec7799d7c79977de',
    'ec7799d7c79977de',
    'eeeeeeeeeeeeeeee',
    'ec79c7d977c79c7e',
    'ec79c7d977c79c7e',
    'eeeeeeeeeeeeeeee',
    'ed99c7c99dc7799e',
    'ed99c7c99dc7799e',
    'eeeeeeeeeeeeeeee',
    'ec79d7c79d97c7de',
    'ec79d7c79d97c7de',
    'eeeeeeeeeeeeeeee',
    'ed9c7d99d7c99c7e',
    'eeeeeeeeeeeeeeee'
  ]);

  // Navy-blue floral-damask couches — match the real apartment photos.
  // Horizontal 3-tile strip: left end, centre (tile-able), right end.
  tiles['apt.couch-l'] = mkTile('home', [
    '................',
    '..aaaaaaaaaaaaaa',
    '.abbbbbbbbbbbbbb',
    '.abccbbcbbbbbbbb',
    '.abbbbbcbbbcbbbb',
    '.abbbbbbbbcbbbbb',
    '.abbbbcbbbbbbbcc',
    '.aaaaaaaaaaaaaaa',
    '.abbbbbbbbbbbbbb',
    '.abbbbcbbbbbcbbb',
    '.abbbbbbcbbbbbbb',
    '.abcbbbbbbbbcbbb',
    '.abbbbbbbbbbbbbb',
    '.abbbbbbbbbbbbbb',
    '.aaaaaaaaaaaaaaa',
    '..aa............'
  ]);
  tiles['apt.couch-c'] = mkTile('home', [
    '................',
    'aaaaaaaaaaaaaaaa',
    'bbbbbbbbbbbbbbbb',
    'bbcbbbbcbbbbbbbb',
    'bbbbbbbbbbbcbbbb',
    'bbbbcbbbbbbbbcbb',
    'bbbbbbbbbcbbbbbc',
    'aaaaaaaaaaaaaaaa',
    'bbbbbbbbbbbbbbbb',
    'bbbcbbbbbbbcbbbb',
    'bbbbbbbcbbbbbbbb',
    'bbbbbbbbbbbbbbbc',
    'bbcbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbbbb',
    'aaaaaaaaaaaaaaaa',
    '................'
  ]);
  tiles['apt.couch-r'] = mkTile('home', [
    '................',
    'aaaaaaaaaaaaaa..',
    'bbbbbbbbbbbbbba.',
    'bbbbbbbbccbbbba.',
    'bbbbcbbbbbbbbba.',
    'bbbbbbbbbbcbbba.',
    'ccbbbbbbcbbbbba.',
    'aaaaaaaaaaaaaaa.',
    'bbbbbbbbbbbbbba.',
    'bbbbcbbbbbbcbba.',
    'bbbbbbbcbbbbbba.',
    'bbbcbbbbbbbbbba.',
    'bbbbbbbbbbbbbba.',
    'bbbbbbbbbbbbbba.',
    'aaaaaaaaaaaaaaa.',
    '............aa..'
  ]);
  // Vertical 3-tile column: top end, centre, bottom end — couch back on RIGHT.
  tiles['apt.couch-vt'] = mkTile('home', [
    '....aaaaaaaaaaaa',
    '....abbbbbbbbbba',
    '....abccbbbbbbba',
    '....abbbbbbbbcba',
    '....abbbcbbbbbba',
    '....abbbbbbbbbba',
    '....abbbbcbbbbba',
    '....abbbbbbbbcba',
    '....abbbbbbbbbba',
    'aaaaabbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbbba'
  ]);
  tiles['apt.couch-vc'] = mkTile('home', [
    'abbbbbbbbbbbbbba',
    'abbbbcbbbbbbbbba',
    'abbbbbbbbbbcbbba',
    'abbbbbbbbbbbbbba',
    'abbbcbbbbbbbbbba',
    'abbbbbbbbcbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbcba',
    'abbbcbbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbcbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbcbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbcba',
    'abbbbbbbbbbbbbba'
  ]);
  tiles['apt.couch-vb'] = mkTile('home', [
    'abbbbbbbbbbbbbba',
    'abbbbbbbcbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbcbbbbbbbbbba',
    'abbbbbbbbbbcbbba',
    'abbbbbbbbbbbbbba',
    'aaaaabbbbbbbbbba',
    '....abbbbbbbbbba',
    '....abbbbbcbbbba',
    '....abbbbbbbbbba',
    '....abbbbbbbbcba',
    '....abbbbbbbbbba',
    '....abbcbbbbbbba',
    '....abbbbbbbbbba',
    '....aaaaaaaaaaaa',
    '................'
  ]);

  // Wooden dining/piano chair — simple kitchen chair.
  tiles['apt.chair'] = mkTile('home', [
    '................',
    '................',
    '....eeeeeeee....',
    '....e......e....',
    '....e......e....',
    '....eeeeeeee....',
    '................',
    '....ccccccccc...',
    '....c5555555c...',
    '....ccccccccc...',
    '....e......e....',
    '....e......e....',
    '....e......e....',
    '....e......e....',
    '....e......e....',
    '................'
  ]);

  // BIG vertical flatscreen TV on wheels — 2 tiles tall (apt.tv-top +
  // apt.tv-bot). Bright cool-blue screen emits light into the room.
  // (apt.record is kept as a single-tile alias so old maps still render.)
  tiles['apt.tv-top'] = mkTile('home', [
    '.eeeeeeeeeeeeee.',
    '.eeeeeeeeeeeeee.',
    '.eeeeeeeeeeeeee.',
    '.eeffffffffffee.',
    '.efffcfffffffee.',
    '.efcfffffffffee.',
    '.efffffffcfffee.',
    '.efffffffffffee.',
    '.efffffcfffffee.',
    '.efffffffffcfee.',
    '.efcfffffffffee.',
    '.efffffffcfffee.',
    '.efffffffffffee.',
    '.efffcffffcffee.',
    '.efffffffffffee.',
    '.efffffffffffee.'
  ]);
  tiles['apt.tv-bot'] = mkTile('home', [
    '.efffffffffffee.',
    '.efffffffffffee.',
    '.efffcffffffffe.',
    '.efffffffffffee.',
    '.efffffcffcffee.',
    '.efffffffffffee.',
    '.efffffffffffee.',
    '.eeeeeeeeeeeeee.',
    '.eeeeeeeeeeeeee.',
    '........1.......',
    '........1.......',
    '........1.......',
    '......11111.....',
    '....ee.....ee...',
    '....ee.....ee...',
    '................'
  ]);
  // Kept for backwards compatibility — still works as a small single-tile TV.
  tiles['apt.record'] = tiles['apt.tv-top'];

  // Cabinet with photos
  tiles['apt.cabinet'] = mkTile('warm', [
    '2222222222222222',
    '2333333333333332',
    '2366223366223362',
    '2366223366223362',
    '2366223366223362',
    '2333333333333332',
    '22444222444442332',
    '2444442444444432'.slice(0, 16),
    '2444442444444432'.slice(0, 16),
    '2444442444444432'.slice(0, 16),
    '2333333333333332',
    '2666666666666662',
    '2333333333333332',
    '2666666666666662',
    '2333333333333332',
    '2222222222222222'
  ]);

  // Archway doorway (2 tiles tall: left + right edge; middle is floor)
  tiles['apt.arch-l'] = mkTile('warm', [
    '5555555555555551',
    '5555555555555551',
    '5555555551111511',
    '55555555.....111',
    '5555555.........',
    '5555555.........',
    '5555555.........',
    '555555..........',
    '555555..........',
    '555555..........',
    '555555..........',
    '555555..........',
    '555555..........',
    '555555..........',
    '555555..........',
    '555555..........'
  ]);
  tiles['apt.arch-r'] = mkTile('warm', [
    '5555555555555555',
    '5555555555555555',
    '1155555555555555',
    '11.5555555555555',
    '.555555555555555',
    '.555555555555555',
    '.555555555555555',
    '..55555555555555',
    '..55555555555555',
    '..55555555555555',
    '..55555555555555',
    '..55555555555555',
    '..55555555555555',
    '..55555555555555',
    '..55555555555555',
    '..55555555555555'
  ]);

  // MOSCOW WINTER STREET — Bolshaya Nikitskaya 13 at night.
  tiles['street.sidewalk'] = proceduralFloor('winter', 8, 7, 9);
  tiles['street.road'] = proceduralFloor('winter', 'a', 1, 'b');
  tiles['street.building'] = proceduralWall('winter', 5, 4, 6);
  tiles['street.window'] = mkTile('winter', [
    '4444444444444444',
    '4555555555555554',
    '4533333333333354',
    '4533dddddddd3354',
    '4533d999999d3354',
    '4533d333333d3354',
    '4533d999999d3354',
    '4533d333333d3354',
    '4533d999999d3354',
    '4533dddddddd3354',
    '4533333333333354',
    '4555555555555554',
    '4555555555555554',
    '4555555555555554',
    '4444444444444444',
    '4444444444444444'
  ]);
  tiles['street.lamp-top'] = mkTile('winter', [
    '.....999999.....',
    '....dddddddd....',
    '....dccccccd....',
    '....dccccccd....',
    '....ddccccdd....',
    '....dddddddd....',
    '.....999999.....',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......'
  ]);
  tiles['street.lamp-bot'] = mkTile('winter', [
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '.......77.......',
    '......7777......',
    '.....777777.....',
    '....99999999....',
    '....99999999....',
    '................'
  ]);
  // Parked car (1 tile) — dark red sedan seen from the side.
  tiles['street.car'] = mkTile('winter', [
    '................',
    '................',
    '.....eeeeee.....',
    '....eeffffee....',
    '...eeffffffee...',
    'eeeeeeeeeeeeeee.',
    'e1eeeeeeeeeee1e.',
    'e1eeeeeeeeeee1e.',
    'eeeeeeeeeeeeeee.',
    '.1aa11111111aa1.',
    '..a11aaaaaa11a..',
    '..a1aaaaaaaa1a..',
    '..a1aaaaaaaa1a..',
    '...1aaaaaaaa1...',
    '................',
    '................'
  ]);
  // Snow pile — small drift on the sidewalk.
  tiles['street.snow'] = mkTile('winter', [
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '.....999........',
    '....99999.......',
    '...9999999......',
    '..999999999.....',
    '.99999999999....',
    '999999988999....',
    '9999998888899...',
    '99999888888999..',
    '................'
  ]);
  // Door — pharmacy / residential — with the number "13" glowing.
  tiles['street.door'] = mkTile('winter', [
    '4444444444444444',
    '4ccccccccccccc44',
    '4cdd999ddd999d44',
    '4c999999d99d9d44',
    '4c999999ddd9dd44',
    '4ccccccccccccc44',
    '4aa4444444444444',
    '4a4bbbbbbbbbbb44',
    '4a4b777777777b44',
    '4a4b7ba77ba77b44',
    '4a4b7777777bb44.',
    '4a4b77777777b44.',
    '4a4b77777777b44.',
    '4a4b77dd77dd7b44',
    '4a4bbbbbbbbbbb44',
    '4444444444444444'
  ]);

  // LISA'S APARTMENT — back to the original dark/gothic walls, black
  // leather couch, and red lamp.  Only the CARPET is new: scattered red
  // roses on a dark-green leafy ground.
  tiles['lisa.floor'] = proceduralFloor('goth', 1, 2, 3);
  tiles['lisa.wall'] = proceduralWall('goth', 2, 1, 3);
  // Rose-floral rug — dark green/black ground, clusters of red petals with
  // green leaves. Two tile variants so the carpet doesn't look repetitive.
  tiles['lisa.rug'] = mkTile('goth', [
    '4141414141414141',
    '4555555555155555',
    '4565565655555655',
    '1556656555556555',
    '5588777558555555',
    '5879989755555555',
    '5887789855555565',
    '4557788555555555',
    '5555555555577555',
    '5555565558787755',
    '4555555557889875',
    '5555655555788875',
    '5555555555577555',
    '4555555555555555',
    '5565555555555565',
    '4141414141414141'
  ]);
  // A second variant to break the repeat — flowers in the OPPOSITE corner.
  tiles['lisa.rug-alt'] = mkTile('goth', [
    '4141414141414141',
    '5555555557755555',
    '5555555578887555',
    '5555555589988855',
    '1555555578889755',
    '5555555555787555',
    '5555655655555555',
    '4555555555555555',
    '5555555555555555',
    '5577555555565555',
    '5788755555555555',
    '5889875555556555',
    '5788875555555555',
    '4577555555555555',
    '5565555555555555',
    '4141414141414141'
  ]);
  // Big black-leather couch — three-seat, flush against the wall.
  tiles['lisa.couch'] = mkTile('goth', [
    'aaaaaaaaaaaaaaaa',
    'abbbbbbbbbbbbbba',
    'abcccccccccccccb',
    'abcccccccccccccb',
    'abcccccccccccccb',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'aaaaaaaaaaaaaaaa',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'abbbbbbbbbbbbbba',
    'aaaaaaaaaaaaaaaa',
    '................'
  ]);
  // Red lamp — red shade with a gold bulb glow.
  tiles['lisa.lamp-top'] = mkTile('goth', [
    '......eeee......',
    '.....eeeeee.....',
    '....eeeeeeee....',
    '....eedddddd....',
    '....edddddde....',
    '....eeddddee....',
    '....eeeedeee....',
    '......eeee......',
    '......eeee......',
    '......edde......',
    '......eede......',
    '......edde......',
    '......eede......',
    '......edde......',
    '......eede......',
    '......edde......'
  ]);
  tiles['lisa.lamp-bot'] = mkTile('goth', [
    '......edde......',
    '......eede......',
    '......edde......',
    '......eede......',
    '......edde......',
    '......eede......',
    '......edde......',
    '......eede......',
    '......edde......',
    '......eede......',
    '.....aabbaa.....',
    '....aabbbbaa....',
    '...aabbbbbbaa...',
    '..aabbbbbbbbaa..',
    '.aaaaaaaaaaaaaa.',
    '................'
  ]);

  // BALAGAN back room — stone palette: white-grey walls, dark-grey floor.
  tiles['bal.wall'] = proceduralWall('stone', 6, 5, 8);
  tiles['bal.floor'] = proceduralFloor('stone', 3, 2, 4);
  // Stair steps — horizontal bands, shading from light top to dark bottom.
  tiles['bal.stair'] = mkTile('stone', [
    '8888888888888888',
    '7777777777777777',
    '5555555555555555',
    '8888888888888888',
    '7777777777777777',
    '5555555555555555',
    '8888888888888888',
    '7777777777777777',
    '5555555555555555',
    '8888888888888888',
    '7777777777777777',
    '5555555555555555',
    '8888888888888888',
    '7777777777777777',
    '5555555555555555',
    '8888888888888888'
  ]);
  // Ashtray — bigger, round, clearly visible on the dark floor.
  tiles['bal.ashtray'] = mkTile('stone', [
    '................',
    '................',
    '................',
    '................',
    '....ccccccccc...',
    '...cc7777777cc..',
    '..cc77aaaaa77cc.',
    '..c77a1111117ac.',
    '..c7a11dfd111ac.',
    '..c7a111111111a.',
    '..c77a111111177c',
    '..cc7711aaaa77cc',
    '...ccc7777777cc.',
    '....ccccccccc...',
    '................',
    '................'
  ]);
  // Couch — black leather, against the grey wall.
  tiles['bal.couch-l'] = mkTile('stone', [
    '1999999999999999',
    '19aaaaaaaaaaaaa9',
    '19abbbbbbbbbbba9',
    '19abbbbbbbbbbba9',
    '19abbbbbbbbbbba9',
    '19abbbbbbbbbbba9',
    '1999999999999999',
    '1999999999999999',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    '1aaaaaaaaaaaaaa1',
    '1111111111111111'
  ]);
  tiles['bal.couch-r'] = mkTile('stone', [
    '9999999999999991',
    '9aaaaaaaaaaaaa91',
    '9abbbbbbbbbbba91',
    '9abbbbbbbbbbba91',
    '9abbbbbbbbbbba91',
    '9abbbbbbbbbbba91',
    '9999999999999991',
    '9999999999999991',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    '1aaaaaaaaaaaaaa1',
    '1111111111111111'
  ]);
  tiles['bal.couch-c'] = mkTile('stone', [
    '9999999999999999',
    'aaaaaaaaaaaaaaaa',
    'bbbbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbbbb',
    'bbbbbbbbbbbbbbbb',
    '9999999999999999',
    '9999999999999999',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    '1111111111111111',
    'aaaaaaaaaaaaaaaa',
    '1111111111111111'
  ]);
  // Small armchair — cushion + wooden legs.
  tiles['bal.chair'] = mkTile('stone', [
    '................',
    '................',
    '.....55555555...',
    '....5ccccccc5...',
    '....5cccccccc...',
    '....5cccccccc...',
    '....5ccccccc5...',
    '.....5555555....',
    '.....11...11....',
    '.....11...11....',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................'
  ]);

  // CLUB (cold palette) — for the main dance floor (NYE)
  tiles['club.floor'] = proceduralFloor('cold', 1, 0, 2);
  tiles['club.stair'] = mkTile('cold', [
    '0000000000000000',
    '2222222222222222',
    '1111111111111111',
    '0000000000000000',
    '2222222222222222',
    '1111111111111111',
    '0000000000000000',
    '2222222222222222',
    '1111111111111111',
    '0000000000000000',
    '2222222222222222',
    '1111111111111111',
    '0000000000000000',
    '2222222222222222',
    '1111111111111111',
    '0000000000000000'
  ]);
  tiles['club.wall'] = proceduralWall('cold', 2, 0, 3);
  tiles['club.couch-l'] = mkTile('cold', [
    '0088888888888888',
    '0089999999999998',
    '0089aaaaaaaaaa98',
    '0089aaaaaaaaaa98',
    '0089aaaaaaaaaa98',
    '0089aaaaaaaaaa98',
    '0088888888888888',
    '0088888888888888',
    '0011111111111111',
    '0011111111111111',
    '0011111111111111',
    '0011111111111111',
    '0011111111111111',
    '0011111111111111',
    '0000000000000000',
    '0000000000000000'
  ]);
  tiles['club.couch-r'] = mkTile('cold', [
    '8888888888888800',
    '8999999999999800',
    '89aaaaaaaaaaa800',
    '89aaaaaaaaaaa800',
    '89aaaaaaaaaaa800',
    '89aaaaaaaaaaa800',
    '8888888888888800',
    '8888888888888800',
    '1111111111111100',
    '1111111111111100',
    '1111111111111100',
    '1111111111111100',
    '1111111111111100',
    '1111111111111100',
    '0000000000000000',
    '0000000000000000'
  ]);

  // NYE dinner tables — cold palette, white cloth with a candle.
  tiles['club.table'] = mkTile('cold', [
    '................',
    '................',
    '..7777777777777.',
    '.777777777777777',
    '.755555555555555',
    '.755555cd5555555',
    '.755555cd5555555',
    '.755555cd5555555',
    '.755555555555555',
    '..33333333333333',
    '..11............',
    '..11............',
    '..11............',
    '..11............',
    '..11............',
    '................'
  ]);
  tiles['club.chair'] = mkTile('cold', [
    '................',
    '................',
    '................',
    '....11111111....',
    '....13333331....',
    '....13333331....',
    '....11111111....',
    '....11111111....',
    '....11111111....',
    '....1........1..',
    '....1........1..',
    '....1........1..',
    '....1........1..',
    '................',
    '................',
    '................'
  ]);
  // Bar counter (front-facing) — dark wood top, bottle shelf behind.
  tiles['club.bar-counter'] = mkTile('cold', [
    '1111111111111111',
    '1bbbbbbbbbbbbbb1',
    '1abbbbbbbbbbbba1',
    '1aaaaaaaaaaaaaa1',
    '1aaaaaaaaaaaaaa1',
    '1aaaaaaaaaaaaaa1',
    '1aaaaaaaaaaaaaa1',
    '1aaaaaaaaaaaaaa1',
    '1aaaaaaaaaaaaaa1',
    '1aaaaaaaaaaaaaa1',
    '1aaaaaaaaaaaaaa1',
    '1aaaaaaaaaaaaaa1',
    '1aaaaaaaaaaaaaa1',
    '1aaaaaaaaaaaaaa1',
    '1111111111111111',
    '................'
  ]);
  tiles['club.bar-back'] = mkTile('cold', [
    '2222222222222222',
    '2ccccccccccccc22',
    '2c44c44c44c44c22',
    '2c44c44c44c44c22',
    '2c55c55c55c55c22',
    '2c55c55c55c55c22',
    '2cccccccccccccc2',
    '2222222222222222',
    '2cccccccccccccc2',
    '2c66c66c66c66c22',
    '2c66c66c66c66c22',
    '2c77c77c77c77c22',
    '2c77c77c77c77c22',
    '2cccccccccccccc2',
    '2222222222222222',
    '................'
  ]);
  // Countdown clock mounted on the wall — glowing neon digits placeholder.
  tiles['club.clock'] = mkTile('cold', [
    '1111111111111111',
    '1cccccccccccccc1',
    '1c22222222222cc1',
    '1c2dddddddddd2c1',
    '1c2d77777777d2c1',
    '1c2d77dddd77d2c1',
    '1c2d77dffd77d2c1',
    '1c2d77dffd77d2c1',
    '1c2d77dddd77d2c1',
    '1c2d77777777d2c1',
    '1c2dddddddddd2c1',
    '1c22222222222cc1',
    '1cccccccccccccc1',
    '1111111111111111',
    '1111111111111111',
    '................'
  ]);

  // BAR (warm palette, but dressed with cold-palette disco accents drawn at runtime)
  tiles['bar.floor'] = proceduralFloor('warm', 2, 1, 3);
  tiles['bar.wall'] = proceduralWall('warm', 1, 0, 5);
  tiles['bar.mirror'] = mkTile('warm', [
    '5555555555555555',
    '5ccccccccccccc55',
    '5ccccccccccccc55',
    '5cccccccccccc555',
    '55ccccccccccc555',
    '5ccccccccccccc55',
    '5ccccccccccccc55',
    '55cccccccccccc55',
    '5ccccccccccccc55',
    '5ccccccccccccc55',
    '5cccccccccccc555',
    '55ccccccccccc555',
    '5ccccccccccccc55',
    '5ccccccccccccc55',
    '55cccccccccccc55',
    '5555555555555555'
  ]);
  tiles['bar.booth'] = mkTile('warm', [
    'eeeeeeeeeeeeeeee',
    'e22222222222222e',
    'e2ffffffffffff2e',
    'e2f2222222222f2e',
    'e2f2ffffffff2f2e',
    'e2f2f222222f2f2e',
    'e2f2ffffffff2f2e',
    'e2f2222222222f2e',
    'e2ffffffffffff2e',
    'e22222222222222e',
    'eeeeeeeeeeeeeeee',
    'e22222222222222e',
    'e2ffffffffffff2e',
    'e2f2222222222f2e',
    'eeeeeeeeeeeeeeee',
    '2222222222222222'
  ]);
  tiles['bar.table'] = mkTile('warm', [
    '................',
    '................',
    '....5555555.....',
    '...5cccccc55....',
    '..5ccccccccc5...',
    '.5cc77cccccc5...',
    '.5ccccc77cccc5..',
    '.5ccc77ccc77c5..',
    '.5c77ccc77ccc5..',
    '.5cccccccccc5...',
    '..5cc77ccccc5...',
    '...5ccccccc5....',
    '....55555555....',
    '.....7....7.....',
    '.....7....7.....',
    '.....7....7.....'
  ]);
  tiles['bar.chair'] = mkTile('warm', [
    '................',
    '................',
    '.....55555......',
    '....5ccccc5.....',
    '....5ccccc5.....',
    '....5ccccc5.....',
    '....5ccccc5.....',
    '.....55555......',
    '................',
    '......7..7......',
    '......7..7......',
    '......7..7......',
    '................',
    '................',
    '................',
    '................'
  ]);
  tiles['bar.dj'] = mkTile('warm', [
    '1111111111111111',
    '1777777777777771',
    '17a7a7a7a7a7a771',
    '17a7a7a7a7a7a771',
    '17a7a7a7a7a7a771',
    '17a7a7a7a7a7a771',
    '1111111111111111',
    '1999999999999991',
    '19cccccccccccc91',
    '19c1c91991c1c191',
    '19c9c91991c9c191',
    '19cccccccccccc91',
    '1999999999999991',
    '1111111111111111',
    '1222222222222221',
    '1111111111111111'
  ]);
  tiles['bar.globe'] = mkTile('warm', [
    '................',
    '................',
    '................',
    '................',
    '.......66.......',
    '.....6cccc6.....',
    '....6ccffcc6....',
    '...6ccffffcc6...',
    '...6ccffffcc6...',
    '....6ccffcc6....',
    '.....6cccc6.....',
    '.......66.......',
    '................',
    '................',
    '................',
    '................'
  ]);

  // RESTAURANT (warm) — reuses apartment tiles, adds one table variant
  tiles['rest.floor'] = proceduralFloor('warm', 3, 4, 2);
  tiles['rest.wall'] = proceduralWall('warm', 3, 1, 5);
  tiles['rest.table'] = tiles['bar.table'];
  tiles['rest.chair'] = tiles['bar.chair'];

  // SICKBED (warm, soft variant)
  tiles['sick.floor'] = proceduralFloor('warm', 5, 4, 6);
  tiles['sick.wall'] = proceduralWall('warm', 6, 5, 'c');
  tiles['sick.bed-l'] = mkTile('warm', [
    '................',
    '................',
    '................',
    '...............5',
    '..555555555555.5',
    '.5ccccccccccc5.5',
    '.5ccccccccccc5.5',
    '.5ccccccccccc5.5',
    '.5cdccccccccc5.5',
    '.5ccdcccccccc5.5',
    '.5ccccccccccc5.5',
    '.5ccccccccccc5.5',
    '..555555555555.5',
    '...............5',
    '................',
    '................'
  ]);
  tiles['sick.bed-r'] = tiles['sick.bed-l'];

  return tiles;
}

// -------- HERO sprites ----------------------------------------------------
// Each hero has 4 directions × 3 frames. For v1 I'm shipping 4 static frames
// (idle per direction) and treating "walking" as a 2-frame alternation.
// This is enough to sell motion at 16×16 without over-investing in animation.

export const sprites = {};

export function buildSprites() {
  // Aida — chibi anime: long straight dark hair, big eyes, toothy grin.
  sprites['aida.down'] = mkSprite('aida', [
    '................................',
    '................................',
    '..........555555555555..........',
    '........5566666666666655........',
    '.......556666666666666655.......',
    '......55666666666666666655......',
    '......566666666666666666655.....',
    '.....5566633333333336666655.....',
    '.....566633334444433336666655...',
    '.....56663334444444433336666....',
    '.....566633344444444333366665...',
    '.....566633344444444333366665...',
    '.....566633111444411133366665...',
    '.....566633111444411133366665...',
    '.....566633344444444333366665...',
    '.....566633344eeeeee4333366665..',
    '.....566633344effffe4333366655..',
    '.....5666333344eeeeee4333366....',
    '.....6666333333333333336666.....',
    '.....6666333333333333336666.....',
    '.....6666.8888aaaaaa8888.6666...',
    '.....666.888aa99a99aa888.6666...',
    '.....666.8a99a9999a99a8..666....',
    '......66.baaaaaaaaaaaab..66.....',
    '......6..baaaaaaaaaaaab...6.....',
    '.........bbaaaaaaaaaabb.........',
    '.........cccccccccccccc.........',
    '........cccccccdcccccccc........',
    '........cccccccccccccccc........',
    '.........ccccc..cccccc..........',
    '.........cccc....ccccc..........',
    '..........11......11............'
  ], 32, 32);
  sprites['aida.up'] = sprites['aida.down'];
  sprites['aida.left'] = sprites['aida.down'];
  sprites['aida.right'] = sprites['aida.down'];
  // Walk cycle alt frames — re-use the idle for now; multi-frame animation TBD.
  sprites['aida.down-b'] = sprites['aida.down'];
  sprites['aida.up-b'] = sprites['aida.down'];
  sprites['aida.left-b'] = sprites['aida.down'];
  sprites['aida.right-b'] = sprites['aida.down'];

  // Aida Mission 1 variant — black dress "goth" silhouette
  // Aida — Mission 1 "sitting on couch" variant: head + torso only (lower half
  // hidden under the couch cushion so she reads as seated).
  sprites['aida1.down'] = mkSprite('aida', [
    '................................',
    '................................',
    '..........555555555555..........',
    '........5566666666666655........',
    '.......556666666666666655.......',
    '......55666666666666666655......',
    '......566666666666666666655.....',
    '.....5566633333333336666655.....',
    '.....566633334444433336666655...',
    '.....56663334444444433336666....',
    '.....566633344444444333366665...',
    '.....566633344444444333366665...',
    '.....566633111444411133366665...',
    '.....566633111444411133366665...',
    '.....566633344444444333366665...',
    '.....566633344eeeeee4333366665..',
    '.....566633344effffe4333366655..',
    '.....5666333344eeeeee4333366....',
    '.....6666333333333333336666.....',
    '.....6666333333333333336666.....',
    '.....6666.cccccccccccc.6666.....',
    '.....666.cccccccccccccc6666.....',
    '.....666.cccccccccccccc.666.....',
    '......66.cccccccccccccc.66......',
    '......6..cccccccccccccc..6......',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................',
    '................................'
  ], 32, 32);
  sprites['aida1.up'] = sprites['aida1.down'];
  sprites['aida1.left'] = sprites['aida1.down'];
  sprites['aida1.right'] = sprites['aida1.down'];

  // David — Mission 1 white-shirt variant (short hair, beard, no nose).
  sprites['pal1.down'] = mkSprite('paladin', [
    '................................',
    '................................',
    '................................',
    '..........555555555555..........',
    '.........556666666666655........',
    '........5566777777776655........',
    '........5677777777777665........',
    '.....5566633333333336666655.....',
    '.....566633334444433336666655...',
    '.....56663334444444433336666....',
    '.....566633344444444333366665...',
    '.....566633344444444333366665...',
    '.....566633111444411133366665...',
    '.....566633111444411133366665...',
    '.....566633344444444333366665...',
    '.....566655544eeeeee4553366665..',
    '.....566655555effffe555553366655',
    '.....55666555544eeeeee44553666..',
    '.....5555555555555555555555.....',
    '.......888888888888888..........',
    '......88888888888888888.........',
    '......88888888888888888.........',
    '......88888888888888888.........',
    '......88899999999998888.........',
    '......88888888888888888.........',
    '........eeeeeeeeeeeeee..........',
    '........eeeeeeeeeeeeee..........',
    '........eeeeeeeeeeeeee..........',
    '.........eeeee..eeeeee..........',
    '.........eeee....eeeee..........',
    '..........11......11............',
    '..........11......11............'
  ], 32, 32);
  sprites['pal1.up'] = sprites['pal1.down'];
  sprites['pal1.left'] = sprites['pal1.down'];
  sprites['pal1.right'] = sprites['pal1.down'];
  // Other directions fall back to 'down' for v1.
  sprites['pal1.up'] = sprites['pal1.down'];
  sprites['pal1.left'] = sprites['pal1.down'];
  sprites['pal1.right'] = sprites['pal1.down'];
  // David — chibi: short curly dark hair (cut above brow), full beard, no nose.
  sprites['pal.down'] = mkSprite('paladin', [
    '................................',
    '................................',
    '................................',
    '..........555555555555..........',
    '.........556666666666655........',
    '........5566777777776655........',
    '........5677777777777665........',
    '.....5566633333333336666655.....',
    '.....566633334444433336666655...',
    '.....56663334444444433336666....',
    '.....566633344444444333366665...',
    '.....566633344444444333366665...',
    '.....566633111444411133366665...',
    '.....566633111444411133366665...',
    '.....566633344444444333366665...',
    '.....566655544eeeeee4553366665..',
    '.....566655555effffe555553366655',
    '.....55666555544eeeeee44553666..',
    '.....5555555555555555555555.....',
    '.......aaaaaaaaaaaaaaaa.........',
    '......aaaaaaaaaaaaaaaaaa........',
    '......aaaaacccccccccaaaaa.......',
    '......aaaaccccccccccaaaaa.......',
    '......aaaccccccccccaaaaaa.......',
    '......aaaaaaaaaaaaaaaaaa........',
    '........eeeeeeeeeeeeee..........',
    '........eeeeeeeeeeeeee..........',
    '........eeeeeeeeeeeeee..........',
    '.........eeeee..eeeeee..........',
    '.........eeee....eeeee..........',
    '..........11......11............',
    '..........11......11............'
  ], 32, 32);
  sprites['pal.up'] = sprites['pal.down'];
  sprites['pal.left'] = sprites['pal.down'];
  sprites['pal.right'] = sprites['pal.down'];

  // David — NYE silver-pants variant. Same geometry as pal.down, rendered
  // against the paladinSilver palette so the trousers shine like chrome.
  sprites['palNYE.down'] = mkSprite('paladinSilver', [
    '................................',
    '................................',
    '................................',
    '..........555555555555..........',
    '.........556666666666655........',
    '........5566777777776655........',
    '........5677777777777665........',
    '.....5566633333333336666655.....',
    '.....566633334444433336666655...',
    '.....56663334444444433336666....',
    '.....566633344444444333366665...',
    '.....566633344444444333366665...',
    '.....566633111444411133366665...',
    '.....566633111444411133366665...',
    '.....566633344444444333366665...',
    '.....566655544eeeeee4553366665..',
    '.....566655555efefef555553366655',
    '.....55666555544eeeeee44553666..',
    '.....5555555555555555555555.....',
    '.......aaaaaaaaaaaaaaaa.........',
    '......aaaaaaaaaaaaaaaaaa........',
    '......aaaaacccccccccaaaaa.......',
    '......aaaaccccccccccaaaaa.......',
    '......aaaccccccccccaaaaaa.......',
    '......aaaaaaaaaaaaaaaaaa........',
    '........eeeefefeeeefee..........',
    '........efeeeeefeeeeef..........',
    '........eeeefefeeeefee..........',
    '.........eeeee..eeeeee..........',
    '.........eeee....eeeee..........',
    '..........11......11............',
    '..........11......11............'
  ], 32, 32);
  sprites['palNYE.up'] = sprites['palNYE.down'];
  sprites['palNYE.left'] = sprites['palNYE.down'];
  sprites['palNYE.right'] = sprites['palNYE.down'];

  // Lisa — chibi: brown hair (indices 5/6/7), red-pink top, black skirt.
  sprites['lisa.down'] = mkSprite('aida', [
    '................................',
    '................................',
    '..........555555555555..........',
    '........5566666666666655........',
    '.......556666666666666655.......',
    '......55666777777777666655......',
    '......566677777777777766655.....',
    '.....5566633333333336666655.....',
    '.....566633334444433336666655...',
    '.....56663334444444433336666....',
    '.....566633344444444333366665...',
    '.....566633344444444333366665...',
    '.....566633111444411133366665...',
    '.....566633111444411133366665...',
    '.....566633344444444333366665...',
    '.....566633344eeeeee4333366665..',
    '.....566633344effffe4333366655..',
    '.....5666333344eeeeee4333366....',
    '.....6666333333333333336666.....',
    '.......8888aaaaaaaa8888.........',
    '......888aaaaaaaaaaaa888........',
    '......8aaaaaaaaaaaaaaa8.........',
    '......8aaaaaa9aaaa9aaaa.........',
    '......8aaaaaaaaaaaaaaa8.........',
    '......8aaaaaaaaaaaaaaa8.........',
    '........ccccccccccccc...........',
    '........ccccccccccccc...........',
    '........ccccccccccccc...........',
    '.........ccccc..cccccc..........',
    '.........cccc....ccccc..........',
    '..........99......99............',
    '..........99......99............'
  ], 32, 32);
  sprites['lisa.up'] = sprites['lisa.down'];
  sprites['lisa.left'] = sprites['lisa.down'];
  sprites['lisa.right'] = sprites['lisa.down'];

  // Maha — chibi in Aida's style: dark hair, beard as block, no nose.
  sprites['maha.down'] = mkSprite('paladin', [
    '................................',
    '................................',
    '..........555555555555..........',
    '........5555555555555555........',
    '.......555555555555555555.......',
    '......55555555555555555555......',
    '......555555555555555555555.....',
    '.....5555533333333335555555.....',
    '.....555533334444433335555555...',
    '.....55553334444444433335555....',
    '.....555533344444444333355555...',
    '.....555533344444444333355555...',
    '.....555533111444411133355555...',
    '.....555533111444411133355555...',
    '.....555533344444444333355555...',
    '.....555555554444455555355555...',
    '.....555555555ee555555355555....',
    '......5555555555555555555.......',
    '.......55555555555555555........',
    '.......aaaaaaaaaaaaaaa..........',
    '......aaaaaaaaaaaaaaaaa.........',
    '......aaaaaaaaaaaaaaaaa.........',
    '......aaaaaaaaaaaaaaaaa.........',
    '......aaaaaaaaaaaaaaaaa.........',
    '......aaaaaaaaaaaaaaaaa.........',
    '........eeeeeeeeeeeeee..........',
    '........eeeeeeeeeeeeee..........',
    '........eeeeeeeeeeeeee..........',
    '.........eeeee..eeeeee..........',
    '.........eeee....eeeee..........',
    '..........11......11............',
    '..........11......11............'
  ], 32, 32);
  sprites['maha.up'] = sprites['maha.down'];
  sprites['maha.left'] = sprites['maha.down'];
  sprites['maha.right'] = sprites['maha.down'];

  // Smoker — chibi in Aida's style: muted grey tones, no nose.
  sprites['smoker.down'] = mkSprite('paladin', [
    '................................',
    '................................',
    '..........999999999999..........',
    '........99bbbbbbbbbbbb99........',
    '.......99bbbbbbbbbbbbbb99.......',
    '......99bbbbbbbbbbbbbbbb99......',
    '......9bbbbbbbbbbbbbbbbbb99.....',
    '.....9999933333333339999999.....',
    '.....999933334444433339999999...',
    '.....99993334444444433339999....',
    '.....999933344444444333399999...',
    '.....999933344444444333399999...',
    '.....999933111444411133399999...',
    '.....999933111444411133399999...',
    '.....999933344444444333399999...',
    '.....999955554444455553399999...',
    '.....999955555ee555553399999....',
    '......9999955555555553999.......',
    '.......99555555555555999........',
    '.......bbbbbbbbbbbbbbb..........',
    '......bbbbbbbbbbbbbbbbb.........',
    '......bbbbbbbbbbbbbbbbb.........',
    '......bbbbbbbbbbbbbbbbb.........',
    '......bbbbbbbbbbbbbbbbb.........',
    '......bbbbbbbbbbbbbbbbb.........',
    '........eeeeeeeeeeeeee..........',
    '........eeeeeeeeeeeeee..........',
    '........eeeeeeeeeeeeee..........',
    '.........eeeee..eeeeee..........',
    '.........eeee....eeeee..........',
    '..........99......99............',
    '..........99......99............'
  ], 32, 32);
  sprites['smoker.up'] = sprites['smoker.down'];
  sprites['smoker.left'] = sprites['smoker.down'];
  sprites['smoker.right'] = sprites['smoker.down'];

  // Zombie Lisa — 16x16 sprite, shambling, pale green skin, blood on torn dress
  sprites['zombie.down'] = mkSprite('zombie', [
    '................',
    '......55555.....',
    '.....5666665....',
    '.....5344445...',
    '....53344345....',
    '....53aaaa45....',
    '....54a..a45....',
    '....5334433d....',
    '....5bbbbbb5....',
    '....5b8bb8b5....',
    '....5bbbbbb5....',
    '....5b9bb9b5....',
    '....5bbbbbb5....',
    '....5bb55bb5....',
    '.....5bb5b5.....',
    '......5.5.......'
  ], 16, 16);
  sprites['zombie.up'] = sprites['zombie.down'];
  sprites['zombie.left'] = sprites['zombie.down'];
  sprites['zombie.right'] = sprites['zombie.down'];

  // Big-boss monster — Lisa after the transformation. Taller, hunched, with
  // horns and glowing red eyes.  Rendered at 32x48 so its head rises above
  // the standard tile line when it stands next to Aida.
  sprites['bigmon.down'] = mkSprite('zombie', [
    '................................',
    '...5.........................5..',
    '..555.......................555.',
    '.55555.....................55555',
    '.555555...................555555',
    '..5555555...............5555555.',
    '...55555555...........55555555..',
    '....5566666655......556666655...',
    '.....566699996655556699999655...',
    '......5669a9a9aa66a9a9a99965....',
    '......566699999988999999965.....',
    '.......5666...aa....666665......',
    '........566666aaaa6666665.......',
    '.........56333333333333665......',
    '........5633333aa3333333365.....',
    '.......56333333aa333333333365...',
    '......5633bbbbbbbbbbbbbb3333365.',
    '.....563bbbb88bbbbbb88bbb33336..',
    '....5633bbb888bbbbbb888bbb33336.',
    '....563bbbbbbbbbbbbbbbbbbbb3336.',
    '....563bbbbbbbbbbbbbbbbbbbb3336.',
    '....563bbbb99bbbbbb99bbbbbb3336.',
    '....563bbbbbbbbbbbbbbbbbbbb3336.',
    '....563bbbbbbbbbbbbbbbbbbbb3336.',
    '....563bbbbbbbbbbbbbbbbbbbb3336.',
    '....563bbbbbbbbbbbbbbbbbbbb3336.',
    '....563bbbbbbbbbbbbbbbbbbbb3336.',
    '.....56bbbbbbbbbbbbbbbbbbb336...',
    '.....56bbbbbbbbbbbbbbbbbbb336...',
    '......5bbbbbbbbbbbbbbbbbbb36....',
    '......5bbbbbb......bbbbbbb36....',
    '......5bbbbb........bbbbbb36....',
    '......5bbbb..........bbbbb36....',
    '......5bbb............bbb536....',
    '......5bb..............bb536....',
    '......5b................b536....',
    '......53................3536....',
    '......53................3536....',
    '......53................3536....',
    '.......5................536.....',
    '.......5................536.....',
    '.......5................536.....',
    '........................36......',
    '........................36......',
    '........................36......',
    '........................36......',
    '........................36......',
    '................................'
  ], 32, 48);
  sprites['bigmon.up'] = sprites['bigmon.down'];
  sprites['bigmon.left'] = sprites['bigmon.down'];
  sprites['bigmon.right'] = sprites['bigmon.down'];

  // Selection ring (16x16 green circle marker under hero)
  const ring = document.createElement('canvas');
  ring.width = TILE;
  ring.height = TILE;
  const rg = ring.getContext('2d');
  rg.strokeStyle = '#4aff4a';
  rg.lineWidth = 1;
  rg.beginPath();
  rg.ellipse(8, 13, 7, 3, 0, 0, Math.PI * 2);
  rg.stroke();
  sprites['selection'] = ring;

  return sprites;
}

// -------- Portrait canvases (48×48) ---------------------------------------
// Drawn with mkSprite but at 48x48. For the MVP we ship two portraits per
// character (club-costume + true-self).

export const portraits = {};

export function buildPortraits() {
  portraits['aida-goth'] = makeAidaGothPortrait();
  portraits['aida'] = makeAidaPortrait();
  portraits['paladin-white'] = makePaladinWhitePortrait();
  portraits['paladin'] = makePaladinPortrait();
  portraits['lisa'] = makeLisaPortrait();
  portraits['lisa-zombie'] = makeLisaZombiePortrait();
  return portraits;
}

function makeLisaPortrait() {
  const c = makePortraitCanvas();
  const g = c.getContext('2d');
  const aidaPal = PALETTES.aida;
  g.fillStyle = '#241812';
  g.fillRect(0, 0, 48, 48);
  // Hair — shorter, blonde streak vibe (tavern-owner)
  g.fillStyle = aidaPal[7];
  g.fillRect(10, 6, 28, 12);
  g.fillStyle = aidaPal[9];
  g.fillRect(12, 4, 24, 6);
  // Face
  g.fillStyle = aidaPal[3];
  g.fillRect(14, 12, 20, 22);
  g.fillStyle = aidaPal[4];
  g.fillRect(16, 14, 14, 2);
  // Eyes — focused, warm
  g.fillStyle = aidaPal[1];
  g.fillRect(17, 20, 3, 2);
  g.fillRect(28, 20, 3, 2);
  // Lip
  g.fillStyle = aidaPal[8];
  g.fillRect(21, 28, 6, 1);
  // Simple top (tavern-owner red dress)
  g.fillStyle = aidaPal[8];
  g.fillRect(0, 34, 48, 14);
  g.fillStyle = aidaPal[10];
  g.fillRect(0, 34, 48, 2);
  drawPortraitFrame(g);
  return c;
}

function makeLisaZombiePortrait() {
  const c = makePortraitCanvas();
  const g = c.getContext('2d');
  const pal = PALETTES.zombie;
  g.fillStyle = '#050a04';
  g.fillRect(0, 0, 48, 48);
  // Matted hair
  g.fillStyle = pal[5];
  g.fillRect(9, 5, 30, 13);
  g.fillStyle = pal[6];
  g.fillRect(11, 8, 26, 4);
  // Side strands (messy)
  g.fillStyle = pal[5];
  g.fillRect(8, 10, 3, 10);
  g.fillRect(37, 10, 3, 10);
  // Zombie skin
  g.fillStyle = pal[3];
  g.fillRect(13, 14, 22, 20);
  g.fillStyle = pal[4];
  g.fillRect(15, 14, 18, 2);
  // Hollow eyes — whites with red gleam
  g.fillStyle = pal[10];
  g.fillRect(17, 20, 3, 3);
  g.fillRect(28, 20, 3, 3);
  g.fillStyle = pal[15];
  g.fillRect(18, 21, 1, 1);
  g.fillRect(29, 21, 1, 1);
  // Eyebrows drooped
  g.fillStyle = pal[1];
  g.fillRect(15, 19, 6, 1);
  g.fillRect(27, 19, 6, 1);
  // Open gaping mouth
  g.fillStyle = pal[1];
  g.fillRect(19, 27, 10, 4);
  g.fillStyle = pal[10];
  g.fillRect(20, 28, 2, 1);
  g.fillRect(24, 28, 2, 1);
  // Bruise/scratch on cheek
  g.fillStyle = pal[14];
  g.fillRect(14, 24, 4, 2);
  g.fillRect(30, 26, 4, 1);
  // Blood streak from mouth
  g.fillStyle = pal[8];
  g.fillRect(22, 31, 2, 3);
  g.fillStyle = pal[9];
  g.fillRect(22, 34, 2, 2);
  // Torn dress
  g.fillStyle = pal[11];
  g.fillRect(0, 36, 48, 12);
  g.fillStyle = pal[8];
  g.fillRect(18, 40, 6, 2);
  g.fillRect(28, 42, 8, 2);
  // Frame
  drawPortraitFrame(g);
  return c;
}

function makePortraitCanvas() {
  const c = document.createElement('canvas');
  c.width = 48;
  c.height = 48;
  return c;
}

function makeAidaPortrait() {
  const c = makePortraitCanvas();
  const g = c.getContext('2d');
  const pal = PALETTES.aida;
  // background
  g.fillStyle = '#2a1d0d';
  g.fillRect(0, 0, 48, 48);
  // hair (long, center-parted, dark)
  g.fillStyle = pal[6];
  g.fillRect(8, 6, 32, 40);
  g.fillStyle = pal[5];
  g.fillRect(10, 6, 28, 4);
  g.fillRect(8, 10, 6, 36); // left strand
  g.fillRect(34, 10, 6, 36); // right strand
  // face oval
  g.fillStyle = pal[3];
  g.fillRect(14, 12, 20, 24);
  g.fillRect(12, 16, 24, 16);
  // face highlight
  g.fillStyle = pal[4];
  g.fillRect(15, 14, 14, 2);
  // eyes
  g.fillStyle = pal[1];
  g.fillRect(17, 20, 3, 2);
  g.fillRect(28, 20, 3, 2);
  // brows
  g.fillRect(17, 18, 3, 1);
  g.fillRect(28, 18, 3, 1);
  // smile + lips
  g.fillStyle = pal[14];
  g.fillRect(20, 28, 8, 1);
  g.fillRect(22, 29, 4, 1);
  // center-parting on forehead
  g.fillStyle = pal[6];
  g.fillRect(23, 12, 2, 6);
  // colorful flower sweater (bottom stripe of portrait)
  const sweater = [pal[8], pal[9], pal[10], pal[11], pal[8]];
  for (let i = 0; i < sweater.length; i++) {
    g.fillStyle = sweater[i];
    g.fillRect(0, 36 + i, 48, 1);
  }
  g.fillStyle = pal[12];
  g.fillRect(0, 41, 48, 7);
  // daisy in sweater
  g.fillStyle = pal[9];
  g.fillRect(22, 42, 4, 4);
  g.fillStyle = pal[10];
  g.fillRect(21, 43, 1, 1);
  g.fillRect(26, 43, 1, 1);
  g.fillRect(23, 41, 1, 1);
  g.fillRect(23, 46, 1, 1);
  // pendant
  g.fillStyle = pal[13];
  g.fillRect(23, 38, 2, 2);
  // gold portrait frame
  drawPortraitFrame(g);
  return c;
}

function makeAidaGothPortrait() {
  const c = makePortraitCanvas();
  const g = c.getContext('2d');
  const pal = PALETTES.aida;
  g.fillStyle = '#1a1208';
  g.fillRect(0, 0, 48, 48);
  // same hair
  g.fillStyle = pal[6];
  g.fillRect(8, 6, 32, 40);
  g.fillStyle = pal[5];
  g.fillRect(10, 6, 28, 4);
  g.fillRect(8, 10, 6, 36);
  g.fillRect(34, 10, 6, 36);
  // face
  g.fillStyle = pal[3];
  g.fillRect(14, 12, 20, 24);
  g.fillRect(12, 16, 24, 16);
  g.fillStyle = pal[4];
  g.fillRect(15, 14, 14, 2);
  g.fillStyle = pal[1];
  g.fillRect(17, 20, 3, 2);
  g.fillRect(28, 20, 3, 2);
  g.fillRect(17, 18, 3, 1);
  g.fillRect(28, 18, 3, 1);
  g.fillStyle = pal[14];
  g.fillRect(20, 28, 8, 1);
  g.fillRect(22, 29, 4, 1);
  g.fillStyle = pal[6];
  g.fillRect(23, 12, 2, 6);
  // black dress — severe silhouette
  g.fillStyle = pal[12];
  g.fillRect(0, 36, 48, 12);
  drawPortraitFrame(g);
  return c;
}

function makePaladinPortrait() {
  const c = makePortraitCanvas();
  const g = c.getContext('2d');
  const pal = PALETTES.paladin;
  g.fillStyle = '#2a1d0d';
  g.fillRect(0, 0, 48, 48);
  // Curly hair — wider and more textured
  g.fillStyle = pal[5];
  g.fillRect(10, 4, 28, 11);
  g.fillStyle = pal[6];
  g.fillRect(12, 6, 24, 5);
  // Side curls (slightly asymmetric)
  g.fillStyle = pal[5];
  g.fillRect(8, 9, 3, 7);
  g.fillRect(37, 9, 3, 7);
  // Face (skin)
  g.fillStyle = pal[3];
  g.fillRect(13, 14, 22, 18);
  g.fillStyle = pal[4];
  g.fillRect(15, 14, 18, 2);
  g.fillRect(17, 22, 4, 1);
  g.fillRect(27, 22, 4, 1);
  // Eyebrows
  g.fillStyle = pal[5];
  g.fillRect(15, 18, 6, 1);
  g.fillRect(27, 18, 6, 1);
  // Eyes (dark irises with a highlight dot)
  g.fillStyle = pal[1];
  g.fillRect(17, 20, 3, 2);
  g.fillRect(28, 20, 3, 2);
  g.fillStyle = pal[4];
  g.fillRect(19, 20, 1, 1);
  g.fillRect(30, 20, 1, 1);
  // Nose shadow
  g.fillStyle = pal[2];
  g.fillRect(23, 24, 2, 2);
  // Moustache (thin line across the lip)
  g.fillStyle = pal[5];
  g.fillRect(16, 26, 16, 2);
  g.fillStyle = pal[6];
  g.fillRect(17, 26, 14, 1);
  // Mouth — visible slit
  g.fillStyle = pal[2];
  g.fillRect(21, 28, 6, 1);
  // Chin beard — contoured, narrower than before, with skin peeking through
  g.fillStyle = pal[5];
  g.fillRect(14, 29, 20, 5);
  g.fillStyle = pal[6];
  g.fillRect(16, 30, 16, 3);
  g.fillStyle = pal[3];
  g.fillRect(22, 31, 4, 1); // tiny skin peek — 5 o'clock shadow feel
  // Black band tee
  g.fillStyle = pal[10];
  g.fillRect(0, 36, 48, 12);
  g.fillStyle = pal[12];
  g.fillRect(18, 40, 12, 2);
  g.fillRect(20, 42, 8, 1);
  // Bracelet (BALA)
  g.fillStyle = pal[13];
  g.fillRect(2, 40, 4, 2);
  drawPortraitFrame(g);
  return c;
}

function makePaladinWhitePortrait() {
  const c = makePortraitCanvas();
  const g = c.getContext('2d');
  const pal = PALETTES.paladin;
  g.fillStyle = '#1a1208';
  g.fillRect(0, 0, 48, 48);
  // Hair (matches main portrait)
  g.fillStyle = pal[5];
  g.fillRect(10, 4, 28, 11);
  g.fillStyle = pal[6];
  g.fillRect(12, 6, 24, 5);
  g.fillStyle = pal[5];
  g.fillRect(8, 9, 3, 7);
  g.fillRect(37, 9, 3, 7);
  // Face
  g.fillStyle = pal[3];
  g.fillRect(13, 14, 22, 18);
  g.fillStyle = pal[4];
  g.fillRect(15, 14, 18, 2);
  g.fillRect(17, 22, 4, 1);
  g.fillRect(27, 22, 4, 1);
  // Brows
  g.fillStyle = pal[5];
  g.fillRect(15, 18, 6, 1);
  g.fillRect(27, 18, 6, 1);
  // Eyes
  g.fillStyle = pal[1];
  g.fillRect(17, 20, 3, 2);
  g.fillRect(28, 20, 3, 2);
  g.fillStyle = pal[4];
  g.fillRect(19, 20, 1, 1);
  g.fillRect(30, 20, 1, 1);
  // Nose
  g.fillStyle = pal[2];
  g.fillRect(23, 24, 2, 2);
  // Moustache
  g.fillStyle = pal[5];
  g.fillRect(16, 26, 16, 2);
  g.fillStyle = pal[6];
  g.fillRect(17, 26, 14, 1);
  // Mouth
  g.fillStyle = pal[2];
  g.fillRect(21, 28, 6, 1);
  // Chin beard (same structure as main portrait)
  g.fillStyle = pal[5];
  g.fillRect(14, 29, 20, 5);
  g.fillStyle = pal[6];
  g.fillRect(16, 30, 16, 3);
  g.fillStyle = pal[3];
  g.fillRect(22, 31, 4, 1);
  // White dress shirt — the costume
  g.fillStyle = pal[8];
  g.fillRect(0, 36, 48, 12);
  g.fillStyle = pal[9];
  g.fillRect(0, 36, 48, 2);
  g.fillRect(22, 38, 4, 10);
  drawPortraitFrame(g);
  return c;
}

function drawPortraitFrame(g) {
  // Chunky gold border, W2-ish
  g.fillStyle = '#8a5a1c';
  g.fillRect(0, 0, 48, 2);
  g.fillRect(0, 46, 48, 2);
  g.fillRect(0, 0, 2, 48);
  g.fillRect(46, 0, 2, 48);
  g.fillStyle = '#d4a24a';
  g.fillRect(1, 1, 46, 1);
  g.fillRect(1, 46, 46, 1);
  g.fillRect(1, 1, 1, 46);
  g.fillRect(46, 1, 1, 46);
}

// -------- main entry ------------------------------------------------------

// -------- PNG OVERRIDE LOADER ----------------------------------------------
// Drop a PNG into /public/sprites/<name>.png and it replaces my procedural
// sprite for that character. Portraits go in /public/portraits/<name>.png.

async function tryLoadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const g = c.getContext('2d');
      g.imageSmoothingEnabled = false;
      g.drawImage(img, 0, 0);
      resolve(c);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function loadOverrides() {
  const base = import.meta.env?.BASE_URL ?? './';
  const charOverrides = [
    'aida', 'aida1', 'pal', 'pal1', 'lisa', 'maha', 'smoker', 'zombie'
  ];
  for (const name of charOverrides) {
    const c = await tryLoadImage(`${base}sprites/${name}.png`);
    if (c) {
      sprites[`${name}.down`] = c;
      sprites[`${name}.up`] = c;
      sprites[`${name}.left`] = c;
      sprites[`${name}.right`] = c;
      console.log(`[sprite override] ${name}.png loaded (${c.width}×${c.height})`);
    }
  }
  const portraitOverrides = [
    'aida', 'aida-goth', 'paladin', 'paladin-white', 'lisa', 'lisa-zombie'
  ];
  for (const name of portraitOverrides) {
    const c = await tryLoadImage(`${base}portraits/${name}.png`);
    if (c) {
      portraits[name] = c;
      console.log(`[portrait override] ${name}.png loaded (${c.width}×${c.height})`);
    }
  }
}

export async function loadAssets() {
  buildTiles();
  buildSprites();
  buildPortraits();
  await loadOverrides();
  return { tiles, sprites, portraits };
}
