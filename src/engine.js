// engine.js — the heart of AIDA II.
//
// Pipeline: every frame we draw into a 320x240 offscreen canvas, then blit
// it upscaled (crisp pixels) to the visible canvas. One source of truth.
//
// Scenes implement a small interface:
//   { enter?, exit?, update(dt), draw(ctx), onPointer(x,y), onKey(k) }
//
// All positions passed to scenes are already in internal (320x240) coords.

export const INTERNAL_W = 320;
export const INTERNAL_H = 240;
export const TILE = 16;
export const GRID_W = INTERNAL_W / TILE; // 20
export const GRID_H = INTERNAL_H / TILE; // 15

// ----- internal state ------------------------------------------------------

let mainCanvas = null;
let mainCtx = null;
let off = null;
let offCtx = null;

let currentScene = null;
let pendingScene = null; // swap-in after a fade-out completes
let lastTime = 0;
let running = false;

let fadeAlpha = 0; // 0 transparent, 1 opaque black
let fadeTarget = 0;
let fadeSpeed = 0; // alpha units per second
let fadeCallback = null; // fires when alpha hits target

// Scene-level visual effects flagged by missions (e.g. 'disco', 'rain')
let sceneEffects = [];
let sceneTime = 0;
export function setSceneEffects(arr) {
  sceneEffects = Array.isArray(arr) ? arr.slice() : [];
  sceneTime = 0;
}

// Heavenly god-ray burst — triggered at the kiss. Rotating white rays from
// the centre, slowly fading. One call starts a timed effect.
let godRays = null;
export function triggerGodRays(durationMs = 3000) {
  godRays = { start: performance.now(), duration: durationMs };
}

// Spotlight effect — darken the whole scene and leave two circular "lights"
// on two world positions (aida + david during the first-look moment).
// Positions are world coords (internal pixel space). Keeps running until stop.
let spotlight = null;
let spotlightCanvas = null;
export function startSpotlight({ a, b }) {
  spotlight = { a, b, started: performance.now() };
}
export function stopSpotlight() {
  spotlight = null;
}

// Camera — crops a portion of the offscreen canvas before blitting, creating
// a close-up "zoomed" view that follows the hero.
let cameraZoom = 1.5;
let cameraX = 0;
let cameraY = 0;
let cameraTarget = null; // { px: () => number, py: () => number } — usually the hero
export function setCameraZoom(z) {
  cameraZoom = Math.max(1, z);
}
export function setCameraTarget(t) {
  cameraTarget = t;
}
export function getCamera() {
  return {
    x: cameraX,
    y: cameraY,
    w: INTERNAL_W / cameraZoom,
    h: INTERNAL_H / cameraZoom,
    zoom: cameraZoom
  };
}

let particles = [];
let shakeTime = 0;
let shakeMag = 0;

// input — one-shot "pressed" cleared every frame, continuous "down" state kept
const input = {
  pointerX: -1,
  pointerY: -1,
  pointerDown: false,
  pointerClicked: false, // one-shot
  keysDown: new Set(),
  keysPressed: new Set() // one-shot, cleared per-frame
};

// ----- initialisation ------------------------------------------------------

export function initEngine(canvas) {
  mainCanvas = canvas;
  mainCtx = canvas.getContext('2d');
  mainCtx.imageSmoothingEnabled = false;

  off = document.createElement('canvas');
  off.width = INTERNAL_W;
  off.height = INTERNAL_H;
  offCtx = off.getContext('2d');
  offCtx.imageSmoothingEnabled = false;

  attachInput();
}

function attachInput() {
  const toInternal = (clientX, clientY) => {
    const rect = mainCanvas.getBoundingClientRect();
    const localX = (clientX - rect.left) * (mainCanvas.width / rect.width);
    const localY = (clientY - rect.top) * (mainCanvas.height / rect.height);
    const sx = mainCanvas.width / INTERNAL_W;
    const sy = mainCanvas.height / INTERNAL_H;
    return {
      x: Math.floor(localX / sx),
      y: Math.floor(localY / sy)
    };
  };

  const down = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    if (!touch) return;
    const { x, y } = toInternal(touch.clientX, touch.clientY);
    input.pointerX = x;
    input.pointerY = y;
    input.pointerDown = true;
    input.pointerClicked = true;
    e.preventDefault?.();
  };
  const move = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    if (!touch) return;
    const { x, y } = toInternal(touch.clientX, touch.clientY);
    input.pointerX = x;
    input.pointerY = y;
  };
  const up = () => {
    input.pointerDown = false;
  };

  mainCanvas.addEventListener('mousedown', down);
  mainCanvas.addEventListener('mousemove', move);
  mainCanvas.addEventListener('mouseup', up);
  mainCanvas.addEventListener('touchstart', down, { passive: false });
  mainCanvas.addEventListener('touchmove', move, { passive: false });
  mainCanvas.addEventListener('touchend', up);

  window.addEventListener('keydown', (e) => {
    if (!input.keysDown.has(e.key)) input.keysPressed.add(e.key);
    input.keysDown.add(e.key);
  });
  window.addEventListener('keyup', (e) => {
    input.keysDown.delete(e.key);
  });
}

// ----- scene management ----------------------------------------------------

export function setScene(scene, { fade = false } = {}) {
  if (!fade) {
    swapScene(scene);
    return;
  }
  fadeTo(1, 320, () => {
    swapScene(scene);
    fadeTo(0, 320);
  });
}

function swapScene(scene) {
  if (currentScene?.exit) currentScene.exit();
  currentScene = scene;
  if (scene?.enter) scene.enter();
}

export function getScene() {
  return currentScene;
}

// ----- fade ----------------------------------------------------------------

export function fadeTo(target, durationMs, cb) {
  fadeTarget = target;
  fadeSpeed = (target - fadeAlpha) / (durationMs / 1000);
  fadeCallback = cb ?? null;
}

export function snapFade(v) {
  fadeAlpha = v;
  fadeTarget = v;
  fadeSpeed = 0;
  fadeCallback = null;
}

// ----- particles -----------------------------------------------------------

export function addParticle(p) {
  // { x, y, vx, vy, ax, ay, life, maxLife, color, size, glyph, scene }
  particles.push({ maxLife: p.life, size: 1, ...p });
}

export function clearParticles() {
  particles = [];
}

// Burst of colourful particles — used for the kiss.
export function spawnFirework(
  x,
  y,
  {
    count = 24,
    colors = ['#ff4470', '#ffd04a', '#4affcc', '#d04aff', '#4aff6a', '#ffffff'],
    power = 55
  } = {}
) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.1;
    const speed = power * (0.6 + Math.random() * 0.7);
    addParticle({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      ay: 38,
      life: 1.1 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2
    });
  }
  // Inner white crackle
  for (let i = 0; i < 14; i++) {
    addParticle({
      x,
      y,
      vx: (Math.random() - 0.5) * 44,
      vy: (Math.random() - 0.5) * 44 - 8,
      ay: 40,
      life: 0.55 + Math.random() * 0.35,
      color: '#ffffff',
      size: 1
    });
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    if (p.ax) p.vx += p.ax * dt;
    if (p.ay) p.vy += p.ay * dt;
    p.x += (p.vx ?? 0) * dt;
    p.y += (p.vy ?? 0) * dt;
  }
}

function drawParticles(ctx) {
  for (const p of particles) {
    const alpha = Math.min(1, p.life / (p.maxLife * 0.8));
    ctx.globalAlpha = alpha;
    if (p.glyph) {
      ctx.fillStyle = p.color ?? '#ffffff';
      drawPixelText(ctx, p.glyph, Math.floor(p.x), Math.floor(p.y), p.color ?? '#fff');
    } else {
      ctx.fillStyle = p.color ?? '#ffffff';
      ctx.fillRect(
        Math.floor(p.x),
        Math.floor(p.y),
        p.size ?? 1,
        p.size ?? 1
      );
    }
  }
  ctx.globalAlpha = 1;
}

// ----- screen shake --------------------------------------------------------

export function shake(magnitude, durationMs) {
  shakeMag = magnitude;
  shakeTime = durationMs / 1000;
}

// ----- loop ----------------------------------------------------------------

export function startLoop() {
  if (running) return;
  running = true;
  lastTime = performance.now();
  requestAnimationFrame(tick);
}

function tick(now) {
  if (!running) return;
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  // update fade
  if (fadeSpeed !== 0) {
    fadeAlpha += fadeSpeed * dt;
    if (
      (fadeSpeed > 0 && fadeAlpha >= fadeTarget) ||
      (fadeSpeed < 0 && fadeAlpha <= fadeTarget)
    ) {
      fadeAlpha = fadeTarget;
      fadeSpeed = 0;
      const cb = fadeCallback;
      fadeCallback = null;
      cb?.();
    }
  }

  // process pending pointer click via scene hook
  if (currentScene?.onPointer && input.pointerClicked) {
    currentScene.onPointer(input.pointerX, input.pointerY);
  }
  if (currentScene?.onKey && input.keysPressed.size) {
    for (const k of input.keysPressed) currentScene.onKey(k);
  }
  if (currentScene?.update) currentScene.update(dt, input);
  updateParticles(dt);

  // one-shot inputs clear after update
  input.pointerClicked = false;
  input.keysPressed.clear();

  // ---- draw ----
  offCtx.fillStyle = '#000';
  offCtx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);

  if (shakeTime > 0) {
    const dx = (Math.random() - 0.5) * shakeMag * 2;
    const dy = (Math.random() - 0.5) * shakeMag * 2;
    offCtx.save();
    offCtx.translate(Math.floor(dx), Math.floor(dy));
    shakeTime -= dt;
  }

  if (currentScene?.draw) currentScene.draw(offCtx);

  // Scene-level effects (disco lights, strobes etc.) layered above the scene.
  if (currentScene) {
    sceneTime += dt;
    for (const effect of sceneEffects) {
      if (effect === 'disco') drawDiscoLights(offCtx, sceneTime);
      if (effect === 'moodynight') drawMoodyNight(offCtx, sceneTime);
      if (effect === 'lampglow') drawLampGlow(offCtx, sceneTime);
    }
  }

  // Moody vignette — darkens edges, keeps a warm pool in centre.
  drawMoodyLight(offCtx);

  drawParticles(offCtx);

  // Spotlight — dramatic stage lighting on the characters.
  // Trick: build the dark overlay on a SEPARATE offscreen canvas, cut two
  // circular holes in THAT canvas (destination-out), then composite the
  // darkness over the scene. This keeps the characters intact inside the
  // light pools — the earlier version used destination-out directly on the
  // scene canvas, which erased the characters along with the darkness.
  if (spotlight) {
    if (!spotlightCanvas) {
      spotlightCanvas = document.createElement('canvas');
      spotlightCanvas.width = INTERNAL_W;
      spotlightCanvas.height = INTERNAL_H;
    }
    const sctx = spotlightCanvas.getContext('2d');
    sctx.clearRect(0, 0, INTERNAL_W, INTERNAL_H);
    // Near-total darkness — nobody else in the room should be visible.
    sctx.fillStyle = 'rgba(4, 2, 8, 0.97)';
    sctx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);
    sctx.globalCompositeOperation = 'destination-out';
    const drawLight = (p) => {
      // Small, tight circle — just the character, no one near them.
      const R = 22;
      // Centre the pool on the torso/face so the whole 32px chibi is lit.
      const cy = p.y - 6;
      const g = sctx.createRadialGradient(p.x, cy, 2, p.x, cy, R);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(0.6, 'rgba(0,0,0,0.92)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      sctx.fillStyle = g;
      sctx.fillRect(p.x - R - 2, cy - R - 2, R * 2 + 4, R * 2 + 4);
    };
    drawLight(spotlight.a);
    drawLight(spotlight.b);
    sctx.globalCompositeOperation = 'source-over';
    // Composite the (holed) dark overlay over the scene.
    offCtx.drawImage(spotlightCanvas, 0, 0);
    // Warm amber rim on the lit regions for that "stage spotlight" glow.
    offCtx.save();
    offCtx.globalCompositeOperation = 'screen';
    const drawRim = (p) => {
      const cy = p.y - 6;
      const g = offCtx.createRadialGradient(p.x, cy, 8, p.x, cy, 28);
      g.addColorStop(0, 'rgba(255, 226, 186, 0.26)');
      g.addColorStop(1, 'rgba(255, 220, 180, 0)');
      offCtx.fillStyle = g;
      offCtx.fillRect(p.x - 32, cy - 32, 64, 64);
    };
    drawRim(spotlight.a);
    drawRim(spotlight.b);
    offCtx.restore();
  }

  // God rays (kiss climax) — drawn last so they wash over everything.
  if (godRays) {
    const t = (performance.now() - godRays.start) / godRays.duration;
    if (t >= 1) {
      godRays = null;
    } else {
      const alpha = Math.sin(t * Math.PI) * 0.85;
      offCtx.save();
      const cx = INTERNAL_W / 2;
      const cy = INTERNAL_H / 2;
      // Warm white radial halo
      const grad = offCtx.createRadialGradient(cx, cy, 0, cx, cy, 200);
      grad.addColorStop(0, `rgba(255, 250, 230, ${alpha})`);
      grad.addColorStop(0.35, `rgba(255, 220, 180, ${alpha * 0.55})`);
      grad.addColorStop(1, 'rgba(255, 200, 220, 0)');
      offCtx.fillStyle = grad;
      offCtx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);
      // Rotating ray beams
      offCtx.globalCompositeOperation = 'screen';
      offCtx.globalAlpha = alpha * 0.55;
      offCtx.fillStyle = '#fff3d8';
      offCtx.translate(cx, cy);
      offCtx.rotate(t * Math.PI);
      for (let i = 0; i < 12; i++) {
        offCtx.rotate(Math.PI / 6);
        offCtx.fillRect(0, -3, 220, 6);
      }
      offCtx.restore();
    }
  }

  if (shakeTime > 0 || shakeMag > 0) {
    if (shakeTime <= 0) shakeMag = 0;
    offCtx.restore();
  }

  if (fadeAlpha > 0) {
    offCtx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
    offCtx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);
  }

  // Camera — center on the target (hero) and clamp to the offscreen bounds.
  const viewW = INTERNAL_W / cameraZoom;
  const viewH = INTERNAL_H / cameraZoom;
  let desiredX = INTERNAL_W / 2 - viewW / 2;
  let desiredY = INTERNAL_H / 2 - viewH / 2;
  if (cameraTarget) {
    desiredX = cameraTarget.px + TILE / 2 - viewW / 2;
    desiredY = cameraTarget.py + TILE / 2 - viewH / 2;
  }
  cameraX = Math.max(0, Math.min(INTERNAL_W - viewW, desiredX));
  cameraY = Math.max(0, Math.min(INTERNAL_H - viewH, desiredY));

  // upscale blit (crop to camera rect)
  mainCtx.fillStyle = '#000';
  mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
  mainCtx.drawImage(
    off,
    cameraX,
    cameraY,
    viewW,
    viewH,
    0,
    0,
    mainCanvas.width,
    mainCanvas.height
  );

  requestAnimationFrame(tick);
}

// ----- A* pathfinding ------------------------------------------------------
// grid: 2D array where 0 = walkable, 1 = blocked
// start/end: { x, y } in grid coordinates
// Returns array of { x, y } nodes (empty if no path).

export function findPath(grid, start, end) {
  const w = grid[0].length;
  const h = grid.length;

  const inBounds = (x, y) => x >= 0 && x < w && y >= 0 && y < h;
  const walkable = (x, y) => inBounds(x, y) && grid[y][x] === 0;
  const key = (x, y) => y * w + x;

  if (!walkable(start.x, start.y) || !walkable(end.x, end.y)) return [];

  const open = new Map();
  const closed = new Set();
  const startKey = key(start.x, start.y);
  open.set(startKey, {
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic(start, end),
    f: heuristic(start, end),
    parent: null
  });

  while (open.size) {
    // pick lowest-f node
    let currentKey = null;
    let current = null;
    for (const [k, n] of open) {
      if (!current || n.f < current.f) {
        current = n;
        currentKey = k;
      }
    }
    if (current.x === end.x && current.y === end.y) {
      const path = [];
      let n = current;
      while (n) {
        path.push({ x: n.x, y: n.y });
        n = n.parent;
      }
      return path.reverse();
    }
    open.delete(currentKey);
    closed.add(currentKey);

    // 4-way neighbours (grid movement; feels chunkier, W2-ish)
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
    for (const [dx, dy] of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      const nk = key(nx, ny);
      if (closed.has(nk) || !walkable(nx, ny)) continue;
      const g = current.g + 1;
      const existing = open.get(nk);
      if (!existing || g < existing.g) {
        const h2 = heuristic({ x: nx, y: ny }, end);
        open.set(nk, {
          x: nx,
          y: ny,
          g,
          h: h2,
          f: g + h2,
          parent: current
        });
      }
    }
  }
  return [];
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Moody-night effect — second half of the apartment evening.
// Drops the base light, pumps a cool blue glow from the TV on the left, and a
// warm red/green flicker from the Christmas tree on the upper-right.
function drawMoodyNight(ctx, t) {
  // Overall dim.
  ctx.save();
  ctx.fillStyle = 'rgba(6, 8, 18, 0.32)';
  ctx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);
  ctx.restore();
  // TV blue pulse (left side, around the TV at col 1-2, row 6).
  const tvX = 1 * TILE + TILE / 2;
  const tvY = 6 * TILE + TILE / 2;
  const tvPulse = 0.55 + Math.sin(t * 1.6) * 0.12;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const tvGrad = ctx.createRadialGradient(tvX, tvY, 6, tvX, tvY, 72);
  tvGrad.addColorStop(0, `rgba(120, 180, 255, ${0.35 * tvPulse})`);
  tvGrad.addColorStop(0.5, `rgba(80, 120, 220, ${0.16 * tvPulse})`);
  tvGrad.addColorStop(1, 'rgba(60, 80, 180, 0)');
  ctx.fillStyle = tvGrad;
  ctx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);
  // Christmas tree red+green blinker (upper-right, around col 16, row 1-2).
  const xtX = 16 * TILE + TILE / 2;
  const xtY = 2 * TILE;
  const blink = (Math.sin(t * 3.0) + 1) * 0.5;
  const hue = blink > 0.5 ? 'rgba(255, 70, 80,' : 'rgba(90, 220, 120,';
  const treeGrad = ctx.createRadialGradient(xtX, xtY, 2, xtX, xtY, 44);
  treeGrad.addColorStop(0, `${hue} 0.55)`);
  treeGrad.addColorStop(0.5, `${hue} 0.22)`);
  treeGrad.addColorStop(1, `${hue} 0)`);
  ctx.fillStyle = treeGrad;
  ctx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);
  // Little twinkle bulbs flickering.
  const bulb = (t * 4) % 1;
  ctx.fillStyle = `rgba(255, 200, 80, ${0.5 + bulb * 0.3})`;
  ctx.fillRect(xtX - 1, xtY + 4, 2, 2);
  ctx.fillStyle = `rgba(120, 220, 255, ${0.3 + (1 - bulb) * 0.4})`;
  ctx.fillRect(xtX + 3, xtY + 8, 2, 2);
  ctx.restore();
}

// Lamp glow effect — first half of the apartment evening.
// A big warm spot at the lamp next to the piano; softens the base vignette.
function drawLampGlow(ctx, t) {
  const lx = 12 * TILE + TILE / 2;
  const ly = 1 * TILE + TILE;
  const flicker = 0.9 + Math.sin(t * 6) * 0.05;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const g = ctx.createRadialGradient(lx, ly, 6, lx, ly, 110);
  g.addColorStop(0, `rgba(255, 220, 160, ${0.42 * flicker})`);
  g.addColorStop(0.45, `rgba(255, 200, 140, ${0.18 * flicker})`);
  g.addColorStop(1, 'rgba(255, 180, 120, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);
  ctx.restore();
}

// Disco lights — calm, cute. Two soft pastel spots drifting slowly.
function drawDiscoLights(ctx, t) {
  const lights = [
    { hue: 310, freq: 0.18, phase: 0,               radius: 90 }, // soft pink
    { hue: 260, freq: 0.14, phase: Math.PI * 1.0,   radius: 85 }  // lavender
  ];
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (const L of lights) {
    const x = Math.floor(INTERNAL_W / 2 + Math.sin(t * L.freq + L.phase) * 90);
    const y = Math.floor(INTERNAL_H / 2 + Math.cos(t * L.freq * 0.8 + L.phase) * 55);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, L.radius);
    grad.addColorStop(0, `hsla(${L.hue}, 78%, 72%, 0.34)`);
    grad.addColorStop(0.55, `hsla(${L.hue}, 78%, 72%, 0.12)`);
    grad.addColorStop(1, `hsla(${L.hue}, 78%, 72%, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);
  }
  ctx.restore();
}

// Moody vignette — gentle, warm, slightly rose-tinted for cute feel.
let lightingCanvas = null;
function drawMoodyLight(ctx) {
  if (!lightingCanvas) {
    lightingCanvas = document.createElement('canvas');
    lightingCanvas.width = INTERNAL_W;
    lightingCanvas.height = INTERNAL_H;
    const lctx = lightingCanvas.getContext('2d');
    // Soft rose-tint overlay
    lctx.fillStyle = 'rgba(255, 170, 200, 0.04)';
    lctx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);
    // Radial darkness at edges, but gentler
    const grad = lctx.createRadialGradient(
      INTERNAL_W / 2,
      INTERNAL_H / 2 + 10,
      80,
      INTERNAL_W / 2,
      INTERNAL_H / 2 + 10,
      200
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.6, 'rgba(30, 10, 40, 0.10)');
    grad.addColorStop(1, 'rgba(20, 8, 30, 0.35)');
    lctx.fillStyle = grad;
    lctx.fillRect(0, 0, INTERNAL_W, INTERNAL_H);
  }
  ctx.drawImage(lightingCanvas, 0, 0);
}

// ----- tiny pixel-text renderer --------------------------------------------
// A 3x5 bitmap font for tiny in-world text (numbers, hints, scene labels).
// For dialogue / menus we use DOM + Press Start 2P instead — that's prettier.

const FONT3x5 = {
  A: '01011110111110011001', // 4 rows actually — we use 3x5 grid per glyph
  // The font is a luxury; for v1 we'll defer and just use DOM text for everything
  // except numbers. Kept as a stub so engine API stays stable.
};

export function drawPixelText(ctx, str, x, y, color) {
  // Minimal monospaced 3x5 font (uppercase A-Z, 0-9, space, . , ! ?)
  const GLYPHS = MINI_FONT;
  let cx = x;
  ctx.fillStyle = color ?? '#fff';
  for (const raw of String(str)) {
    const ch = raw.toUpperCase();
    const bits = GLYPHS[ch] ?? GLYPHS[' '];
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < 3; i++) {
        if (bits[j * 3 + i] === '1') ctx.fillRect(cx + i, y + j, 1, 1);
      }
    }
    cx += 4;
  }
}

// 3x5 bitmap font — just enough to label things in-world.
const MINI_FONT = {
  A: '010101111101101',
  B: '110101110101110',
  C: '011100100100011',
  D: '110101101101110',
  E: '111100110100111',
  F: '111100110100100',
  G: '011100101101011',
  H: '101101111101101',
  I: '111010010010111',
  J: '001001001101010',
  K: '101101110101101',
  L: '100100100100111',
  M: '101111101101101',
  N: '101111111111101',
  O: '010101101101010',
  P: '110101110100100',
  Q: '010101101111011',
  R: '110101110101101',
  S: '011100010001110',
  T: '111010010010010',
  U: '101101101101011',
  V: '101101101010010',
  W: '101101101111101',
  X: '101101010101101',
  Y: '101101010010010',
  Z: '111001010100111',
  0: '010101101101010',
  1: '010110010010111',
  2: '110001010100111',
  3: '110001010001110',
  4: '101101111001001',
  5: '111100110001110',
  6: '011100110101010',
  7: '111001010010010',
  8: '010101010101010',
  9: '010101011001110',
  ' ': '000000000000000',
  '.': '000000000000010',
  ',': '000000000010100',
  '!': '010010010000010',
  '?': '110001010000010',
  ':': '000010000010000',
  '-': '000000111000000',
  "'": '010010000000000'
};
