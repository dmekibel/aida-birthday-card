// main.js — director.
// Boot → preload → title → for each mission { briefing → scene → play → outro } → credits.

import {
  initEngine,
  startLoop,
  setScene,
  setSceneEffects,
  setCameraTarget,
  setCameraZoom,
  getCamera,
  triggerGodRays,
  startSpotlight,
  stopSpotlight,
  fadeTo,
  snapFade,
  addParticle,
  spawnFirework,
  shake as engineShake,
  findPath,
  TILE,
  GRID_W,
  GRID_H,
  INTERNAL_W,
  INTERNAL_H
} from './engine.js';
import { loadAssets, tiles, sprites } from './assets.js';
import {
  showTitle,
  showBriefing,
  showOutro,
  showDialogue,
  showBubble,
  showNarration,
  showCredits,
  showFadeText,
  showTextMessages,
  showActionButton,
  setSimlishHandler,
  setCampaignProgress,
  installMuteButton,
  installAffection,
  setAffection,
  isUiBlocking,
  clearUi
} from './ui.js';
import {
  initAudio,
  playLoop,
  stopLoop,
  playClick,
  playSelect,
  playChime,
  playBlip,
  playHeartPop,
  playMetalRiff,
  playPianoPhrase,
  playPianoNote,
  playSweetChildIntro,
  playTillThen,
  playBestFriend,
  playSimlish,
  playFireworkBoom,
  playKnock,
  playGroan,
  playSwing,
  playHit,
  playAngelic
} from './audio.js';
import { missions, credits as creditsData } from './content.js';

const ui = document.getElementById('ui');
const canvas = document.getElementById('game');
const SAVE_KEY = 'aida.save';

// ---------------------------------------------------------------------------
// Preload
// ---------------------------------------------------------------------------

function showPreload(onDone) {
  ui.innerHTML = `
    <div class="preload" id="preload-screen">
      <div class="preload-heart">💜</div>
      <div class="preload-bar"><div class="preload-fill" id="preload-fill"></div></div>
      <div class="preload-msg" id="preload-msg">Wrapping your card…</div>
    </div>
  `;
  const fill = document.getElementById('preload-fill');
  const msg = document.getElementById('preload-msg');
  const steps = [
    'Picking flowers…',
    'Tying the ribbon…',
    'Lighting the candles…',
    'Writing the note…',
    'Almost ready…'
  ];
  let pct = 0;
  const tick = setInterval(() => {
    pct = Math.min(90, pct + 10);
    fill.style.width = pct + '%';
    msg.textContent = steps[Math.floor((pct / 90) * (steps.length - 1))];
  }, 90);
  loadAssets().then(async () => {
    await document.fonts?.ready;
    clearInterval(tick);
    fill.style.width = '100%';
    setTimeout(onDone, 260);
  });
}

// ---------------------------------------------------------------------------
// Mission scene + control API
// ---------------------------------------------------------------------------

function createMission(data) {
  // hero
  const hero = {
    gx: data.spawn.x,
    gy: data.spawn.y,
    px: data.spawn.x * TILE,
    py: data.spawn.y * TILE,
    facing: data.heroFacing ?? 'down',
    sprite: data.heroSprite ?? 'aida',
    path: [],
    stepT: 0,
    speed: 5.0,
    moveResolver: null
  };
  // npcs keyed by id
  const npcs = new Map();
  for (const n of data.npcs ?? []) {
    npcs.set(n.id, {
      ...n,
      gx: n.x,           // grid coord, updated as NPC walks
      gy: n.y,
      px: n.x * TILE,
      py: n.y * TILE,
      path: [],
      stepT: 0,
      speed: 2.6, // slower, more natural walking
      moveResolver: null
    });
  }
  // waypoint state
  const waypointDefs = new Map();
  for (const wp of data.waypoints ?? []) waypointDefs.set(wp.id, wp);
  const waypointOnce = new Map();
  const waypointResolvers = new Map();
  const waypointListeners = new Map();

  // NPC click handlers — keyed by npc id, fires when player clicks adjacent tile.
  const npcClickHandlers = new Map();
  function onNpcClick(id, fn) {
    npcClickHandlers.set(id, fn);
  }
  function offNpcClick(id) {
    npcClickHandlers.delete(id);
  }

  // Hint marker — pulsing purple arrow pointing to where the player should go.
  let hint = null; // { x, y, pulse }
  function setHint(gx, gy) {
    hint = { x: gx, y: gy, pulse: 0 };
  }
  function clearHint() {
    hint = null;
  }

  // Fire tiles — set alight by the boss. Block movement, burn out on their
  // own. Stored as a Map keyed by "x,y".
  const fireTiles = new Map(); // key -> { gx, gy, life, maxLife }
  function spawnFireTile(gx, gy, life = 6) {
    const key = gx + ',' + gy;
    fireTiles.set(key, { gx, gy, life, maxLife: life });
  }
  function clearFireTiles() {
    fireTiles.clear();
  }
  function isFireAt(gx, gy) {
    return fireTiles.has(gx + ',' + gy);
  }

  // Heart pickups — purple collectible hearts on the floor.
  const hearts = new Map(); // id -> { x, y, id, handler }
  let heartCounter = 0;
  function spawnHeartPickup(gx, gy, handler) {
    const id = `hp${++heartCounter}`;
    hearts.set(id, { id, x: gx, y: gy, handler, pulse: Math.random() * Math.PI * 2 });
    return id;
  }
  function removeHeartPickup(id) {
    hearts.delete(id);
  }

  let targetMark = null;

  // --- control API ---

  // Build a walkability grid that treats all OTHER characters as blocked, so
  // the player and NPCs can't walk through each other.
  function dynamicWalk(excludeId) {
    const grid = data.walk.map((row) => row.slice());
    if (excludeId !== 'hero' && grid[hero.gy]) {
      grid[hero.gy][hero.gx] = 1;
    }
    for (const [id, n] of npcs) {
      if (id === excludeId) continue;
      if (grid[n.gy]) grid[n.gy][n.gx] = 1;
    }
    // Fire tiles block everyone — you can't walk through flame.
    for (const f of fireTiles.values()) {
      if (grid[f.gy]) grid[f.gy][f.gx] = 1;
    }
    return grid;
  }

  function moveHeroTo(gx, gy) {
    if (data.walk[gy]?.[gx] !== 0) return Promise.resolve(false);
    // Don't walk into an NPC's tile.
    for (const n of npcs.values()) {
      if (n.gx === gx && n.gy === gy) return Promise.resolve(false);
    }
    const path = findPath(
      dynamicWalk('hero'),
      { x: hero.gx, y: hero.gy },
      { x: gx, y: gy }
    );
    if (path.length <= 1) return Promise.resolve(false);
    hero.path = path.slice(1);
    targetMark = { x: gx, y: gy, life: 0.6 };
    return new Promise((resolve) => {
      hero.moveResolver = () => resolve(true);
    });
  }

  function waitForWaypoint(id) {
    if (waypointOnce.get(id)) return Promise.resolve();
    return new Promise((resolve) => {
      const existing = waypointResolvers.get(id) ?? [];
      existing.push(resolve);
      waypointResolvers.set(id, existing);
    });
  }

  function onWaypointEnter(id, fn) {
    const existing = waypointListeners.get(id) ?? [];
    existing.push(fn);
    waypointListeners.set(id, existing);
  }

  function setHeroFacing(dir) {
    hero.facing = dir;
  }
  function setHeroSprite(key) {
    hero.sprite = key;
  }

  function setNpcPos(id, gx, gy, facing) {
    const n = npcs.get(id);
    if (!n) return;
    n.x = gx;
    n.y = gy;
    n.gx = gx;
    n.gy = gy;
    n.px = gx * TILE;
    n.py = gy * TILE;
    n.path = [];
    if (facing) n.facing = facing;
  }
  function setNpcFacing(id, facing) {
    const n = npcs.get(id);
    if (n && facing) n.facing = facing;
  }
  function setNpcSprite(id, sprite) {
    const n = npcs.get(id);
    if (n) n.sprite = sprite;
  }
  function removeNpc(id) {
    npcs.delete(id);
  }
  function addNpc(npc) {
    npcs.set(npc.id, {
      ...npc,
      gx: npc.x,
      gy: npc.y,
      px: npc.x * TILE,
      py: npc.y * TILE,
      path: [],
      stepT: 0,
      speed: 2.6,
      moveResolver: null
    });
  }

  function moveNpcTo(id, gx, gy) {
    const n = npcs.get(id);
    if (!n) return Promise.resolve(false);
    if (data.walk[gy]?.[gx] !== 0) return Promise.resolve(false);
    // Don't walk into the hero or any other NPC.
    if (hero.gx === gx && hero.gy === gy) return Promise.resolve(false);
    for (const [otherId, other] of npcs) {
      if (otherId === id) continue;
      if (other.gx === gx && other.gy === gy) return Promise.resolve(false);
    }
    const path = findPath(
      dynamicWalk(id),
      { x: n.gx, y: n.gy },
      { x: gx, y: gy }
    );
    if (path.length <= 1) return Promise.resolve(false);
    n.path = path.slice(1);
    return new Promise((resolve) => {
      n.moveResolver = () => resolve(true);
    });
  }

  function spawnHeart(px, py) {
    addParticle({
      x: px,
      y: py,
      vx: (Math.random() - 0.5) * 6,
      vy: -12 - Math.random() * 10,
      ay: 10,
      life: 1.0,
      glyph: '\u2764',
      color: '#e06090'
    });
  }
  function spawnMusicNote(px, py) {
    addParticle({
      x: px,
      y: py,
      vx: (Math.random() - 0.5) * 3,
      vy: -10 - Math.random() * 4,
      life: 1.6,
      glyph: '\u266A',
      color: '#ffd080'
    });
  }

  // --- update ---

  function updateEntity(ent, dt) {
    if (ent.path.length === 0) return;
    const next = ent.path[0];
    const dx = next.x - ent.gx;
    const dy = next.y - ent.gy;
    if (dx > 0) ent.facing = 'right';
    else if (dx < 0) ent.facing = 'left';
    else if (dy > 0) ent.facing = 'down';
    else if (dy < 0) ent.facing = 'up';
    ent.stepT += ent.speed * dt;
    if (ent.stepT >= 1) {
      // Stacking guard: if another entity has moved onto our next tile
      // while we were walking, abort the step rather than overlapping them.
      // Caller can click again to get a fresh path around the new blocker.
      let blocked = false;
      if (ent !== hero && hero.gx === next.x && hero.gy === next.y) {
        blocked = true;
      }
      if (!blocked) {
        for (const [, other] of npcs) {
          if (other === ent) continue;
          if (other.gx === next.x && other.gy === next.y) {
            blocked = true;
            break;
          }
        }
      }
      if (blocked) {
        // Don't move. Drop the rest of the path and let the move resolver
        // fire so waiting awaits don't hang.
        ent.stepT = 0;
        ent.path = [];
        const r = ent.moveResolver;
        ent.moveResolver = null;
        r?.();
        return;
      }
      ent.stepT = 0;
      ent.gx = next.x;
      ent.gy = next.y;
      // Keep the legacy x/y fields in sync so scripts that read them still work.
      ent.x = next.x;
      ent.y = next.y;
      ent.path.shift();
      if (ent === hero) {
        // waypoint check
        for (const [id, wp] of waypointDefs) {
          if (wp.x === hero.gx && wp.y === hero.gy) {
            waypointOnce.set(id, true);
            const resolvers = waypointResolvers.get(id);
            if (resolvers) {
              waypointResolvers.delete(id);
              for (const r of resolvers) r();
            }
            const listeners = waypointListeners.get(id);
            if (listeners) for (const fn of listeners) fn();
          }
        }
        // heart pickup check
        for (const [hid, h] of hearts) {
          if (h.x === hero.gx && h.y === hero.gy) {
            hearts.delete(hid);
            spawnHeart(h.x * TILE + 8, h.y * TILE - 2);
            playHeartPop();
            h.handler?.(h);
          }
        }
      }
      if (ent.path.length === 0) {
        const r = ent.moveResolver;
        ent.moveResolver = null;
        r?.();
      }
    }
    ent.px = (ent.gx + (next.x - ent.gx) * ent.stepT) * TILE;
    ent.py = (ent.gy + (next.y - ent.gy) * ent.stepT) * TILE;
  }

  // --- draw ---

  function drawMap(ctx) {
    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        const key = data.map[y]?.[x];
        if (!key) continue;
        const tile = tiles[key];
        if (tile) ctx.drawImage(tile, x * TILE, y * TILE);
      }
    }
  }

  function drawTargetMark(ctx) {
    if (!targetMark) return;
    const alpha = Math.min(1, targetMark.life * 2);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#c88aff';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      targetMark.x * TILE + 1,
      targetMark.y * TILE + 1,
      TILE - 2,
      TILE - 2
    );
    ctx.globalAlpha = 1;
  }

  function drawHint(ctx) {
    if (!hint) return;
    const bob = Math.sin(hint.pulse) * 2;
    const px = hint.x * TILE + TILE / 2;
    const py = hint.y * TILE - 6 - bob;
    // Arrow pointing down
    ctx.fillStyle = '#c88aff';
    ctx.beginPath();
    ctx.moveTo(px, py + 8);
    ctx.lineTo(px - 5, py);
    ctx.lineTo(px + 5, py);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5a228c';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Tile highlight ring
    const pulseAlpha = 0.3 + 0.25 * (1 + Math.sin(hint.pulse * 1.5)) * 0.5;
    ctx.strokeStyle = `rgba(200, 138, 255, ${pulseAlpha})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      hint.x * TILE + 1,
      hint.y * TILE + 1,
      TILE - 2,
      TILE - 2
    );
  }

  function drawHearts(ctx) {
    for (const h of hearts.values()) {
      const bob = Math.sin(h.pulse) * 2;
      const px = h.x * TILE + TILE / 2;
      const py = h.y * TILE + TILE / 2 - 2 - bob;
      const s = 4 + Math.sin(h.pulse * 1.5) * 0.4;
      // Chunky pixel heart
      ctx.fillStyle = '#c88aff';
      ctx.fillRect(px - s, py - s / 2, s, s);
      ctx.fillRect(px, py - s / 2, s, s);
      ctx.fillRect(px - s + 1, py + s / 2, s * 2 - 2, s / 2);
      ctx.fillRect(px - s / 2, py + s, s, s / 2);
      // glow
      ctx.fillStyle = 'rgba(200, 138, 255, 0.3)';
      ctx.fillRect(h.x * TILE, h.y * TILE, TILE, TILE);
    }
  }

  function drawEntity(ctx, ent, selectionRing) {
    const spr =
      sprites[`${ent.sprite}.${ent.facing}`] ??
      sprites[`${ent.sprite}.down`];
    if (selectionRing) {
      const ring = sprites['selection'];
      if (ring) ctx.drawImage(ring, Math.floor(ent.px), Math.floor(ent.py));
    }
    if (spr) {
      // Centre the sprite horizontally on its tile; align its feet to the tile's bottom.
      const offX = (spr.width - TILE) / 2;
      const offY = spr.height - TILE;
      ctx.drawImage(
        spr,
        Math.floor(ent.px - offX),
        Math.floor(ent.py - offY - 2)
      );
    }
  }

  const scene = {
    enter() {},
    exit() {
      // clear any pending resolvers so promises don't dangle after mission end
      waypointResolvers.clear();
      hero.moveResolver = null;
      for (const n of npcs.values()) n.moveResolver = null;
    },
    update(dt) {
      if (targetMark) {
        targetMark.life -= dt;
        if (targetMark.life <= 0) targetMark = null;
      }
      if (hint) hint.pulse += dt * 4;
      for (const h of hearts.values()) h.pulse += dt * 3;
      // Burn fire tiles down; spawn flame particles from each while alive.
      for (const [key, f] of fireTiles) {
        f.life -= dt;
        if (f.life <= 0) {
          fireTiles.delete(key);
          continue;
        }
        // A handful of embers each frame.
        if (Math.random() < 0.75) {
          const cx = f.gx * TILE + 8 + (Math.random() - 0.5) * 10;
          const cy = f.gy * TILE + 12 + (Math.random() - 0.5) * 4;
          const hues = ['#ffcc33', '#ff7a1a', '#d03010', '#5a1a08'];
          addParticle({
            x: cx, y: cy,
            vx: (Math.random() - 0.5) * 6,
            vy: -18 - Math.random() * 10,
            ay: -4,
            life: 0.45 + Math.random() * 0.4,
            color: hues[Math.floor(Math.random() * hues.length)],
            size: 2
          });
        }
      }
      updateEntity(hero, dt);
      for (const n of npcs.values()) updateEntity(n, dt);
    },
    draw(ctx) {
      drawMap(ctx);
      drawTargetMark(ctx);
      drawHearts(ctx);
      // Helper for z-sort: taller sprites should always draw ON TOP so a
      // shorter character (Aida, 32x32) can never cover a much taller one
      // (bigmon, 32x48) even if they happen to overlap tile rows.
      const spriteHeight = (ent) => {
        const spr =
          sprites[`${ent.sprite}.${ent.facing}`] ??
          sprites[`${ent.sprite}.down`];
        return spr ? spr.height : TILE;
      };
      // Fire tiles — glowing scorch rectangle under the particles.
      for (const f of fireTiles.values()) {
        const a = Math.min(1, f.life / f.maxLife);
        ctx.fillStyle = `rgba(90, 18, 8, ${0.55 * a})`;
        ctx.fillRect(f.gx * TILE + 1, f.gy * TILE + 1, TILE - 2, TILE - 2);
        ctx.fillStyle = `rgba(255, 180, 60, ${0.35 * a})`;
        ctx.fillRect(f.gx * TILE + 3, f.gy * TILE + 6, TILE - 6, TILE - 10);
        ctx.fillStyle = `rgba(255, 230, 120, ${0.4 * a})`;
        ctx.fillRect(f.gx * TILE + 6, f.gy * TILE + 9, TILE - 12, TILE - 13);
      }
      // Sort every character by on-screen Y so the one whose feet are
      // further down is drawn LAST (their head isn't covered by someone
      // behind them). Exception: any sprite that's taller than a standard
      // 32-px chibi (e.g. the 48-px bigmon boss) is pushed to the very end
      // of the order so a shorter sprite can never cover them.
      const ordered = [hero, ...npcs.values()].sort((a, b) => {
        const ha = spriteHeight(a);
        const hb = spriteHeight(b);
        const aTall = ha > 32;
        const bTall = hb > 32;
        if (aTall && !bTall) return 1;
        if (bTall && !aTall) return -1;
        return a.py - b.py;
      });
      for (const ent of ordered) {
        drawEntity(ctx, ent, ent === hero);
      }
      drawHint(ctx);
    },
    onPointer(x, y) {
      if (isUiBlocking()) return;
      const gx = Math.floor(x / TILE);
      const gy = Math.floor(y / TILE);
      // If clicking on an NPC with a registered handler, FIRE THE HANDLER —
      // don't fall back to walk-to-tile. This is important for the boss
      // fight: clicking the monster should always register as an attack,
      // never make Aida try to walk to the monster's tile (which is blocked
      // anyway). The handler itself decides whether the click is a valid
      // strike (e.g. in-range or not).
      //
      // Hitbox: sprite-accurate — tall sprites count every row they cover,
      // wide sprites count gx-1 / gx / gx+1.
      for (const [id, npc] of npcs) {
        const handler = npcClickHandlers.get(id);
        if (!handler) continue;
        const spr =
          sprites[`${npc.sprite}.${npc.facing}`] ??
          sprites[`${npc.sprite}.down`];
        const tilesTall = spr ? Math.max(1, Math.ceil(spr.height / TILE)) : 1;
        const wide = spr && spr.width > TILE;
        const wPad = wide ? 1 : 0;
        const inCol = gx >= npc.gx - wPad && gx <= npc.gx + wPad;
        const inRow = gy >= npc.gy - (tilesTall - 1) && gy <= npc.gy;
        if (!(inCol && inRow)) continue;
        playClick();
        handler(npc);
        return;
      }
      playClick();
      moveHeroTo(gx, gy);
    },
    onKey(k) {}
  };

  return {
    scene,
    hero,
    npcs,
    data,
    moveHeroTo,
    waitForWaypoint,
    onWaypointEnter,
    setHeroFacing,
    setHeroSprite,
    setNpcPos,
    setNpcFacing,
    setNpcSprite,
    moveNpcTo,
    addNpc,
    removeNpc,
    onNpcClick,
    offNpcClick,
    setHint,
    clearHint,
    spawnHeartPickup,
    removeHeartPickup,
    spawnHeart,
    spawnMusicNote,
    spawnFireTile,
    clearFireTiles,
    isFireAt
  };
}

// ---------------------------------------------------------------------------
// Save / load
// ---------------------------------------------------------------------------

function readSave() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null');
  } catch {
    return null;
  }
}
function writeSave(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

// ---------------------------------------------------------------------------
// The director — runs the campaign end-to-end.
// ---------------------------------------------------------------------------

async function runCampaign(startIndex = 0, opts = {}) {
  installMuteButton();
  installAffection(10);
  installDevPanel();
  installSkipScene();
  setAffection(startIndex); // show prior progress on continue

  let skipFirstBriefing = !!opts.skipBriefing;

  for (let i = startIndex; i < missions.length; i++) {
    const m = missions[i];
    // Heart density grows with chapter index.
    setCampaignProgress(i);
    stopLoop();
    if (skipFirstBriefing) {
      skipFirstBriefing = false; // only skip once, subsequent chapters still brief
    } else {
      await showBriefing({
        chapter: m.chapter,
        title: m.title,
        when: m.when,
        text: m.briefing,
        drawing: m.drawing,
        page: i + 1
      });
    }
    // Instantiate mission
    const mission = createMission(m.buildScene());
    snapFade(1); // start black
    setScene(mission.scene);
    setSceneEffects(m.effects ?? []);
    setCameraZoom(m.cameraZoom ?? 1.0);
    // If the mission wants a zoomed-in view, glue the camera to the hero by
    // default so the player is always on screen. Missions can override later.
    setCameraTarget((m.cameraZoom ?? 1.0) > 1.01 ? mission.hero : null);
    playLoop(m.audioLoop, m.audioOpts ?? {});
    fadeTo(0, 600);

    // Play the mission script
    // Infer speaker from dialogue name so we can show a bubble over their head.
    const speakerFromName = (name) => {
      if (!name) return null;
      const map = {
        'Aida': 'hero',
        'David': 'paladin',
        'Liza': 'lisa',
        'Maha': 'maha',
        'Employee': 'smoker',
        'DJ': 'dj',
        '???': 'paladin',
        'Stranger': 'paladin',
        'A Stranger in a White Shirt': 'paladin'
      };
      // Also handle name suffixes like "David — a message"
      for (const key of Object.keys(map)) {
        if (name.startsWith(key)) return map[key];
      }
      return null;
    };
    const dialogue = (opts) => {
      // The top narration card is RESERVED for David narrating the story.
      //
      //   * Aida's parens text (her inner world)  → her thought bubble.
      //   * David's parens text (stage directions about what he / the
      //     scene did)  → top narration card (his voice as the narrator).
      //   * Anyone else's parens text  → their own speech bubble, as-is.
      //   * A dialogue call with `choices:` ALWAYS lands in the speaker's
      //     bubble (the choices are what the speaker is about to say).
      const isExplicitThought = opts.thought === true;
      const hasChoices = Array.isArray(opts.choices) && opts.choices.length > 0;
      const startsWithParen =
        typeof opts.text === 'string' && opts.text.trim().startsWith('(');
      const speakerKey = opts.speaker ?? speakerFromName(opts.name);

      if (startsWithParen && !hasChoices && !isExplicitThought) {
        if (speakerKey === 'hero') {
          // Aida's inner monologue — auto-promote to a thought bubble.
          opts = { ...opts, thought: true };
        } else if (speakerKey === 'paladin' || speakerKey === 'david') {
          // David is the narrator — his parens go to the top card.
          return showNarration({ text: opts.text, choices: opts.choices });
        }
        // Anyone else (Lisa, Maha, Katya, DJ, …) falls through to their
        // own speech bubble, keeping the text as-is.
      }
      // isThought now picks up the auto-promoted flag for Aida's parens too.
      const isThought = opts.thought === true;
      // Speech → bubble over the resolved speaker.
      const speaker = opts.speaker ?? speakerFromName(opts.name);
      if (speaker) {
        const spriteTopY = (ent) => {
          const key = `${ent.sprite}.${ent.facing}`;
          const spr = sprites[key] ?? sprites[`${ent.sprite}.down`];
          const spriteExtra = spr ? Math.max(0, spr.height - TILE) : 0;
          return ent.py - spriteExtra;
        };
        let pos = null;
        if (speaker === 'hero') {
          pos = {
            ix: mission.hero.px + TILE / 2,
            iy: spriteTopY(mission.hero)
          };
        } else {
          // Different missions used 'david' vs 'paladin' as the NPC id.
          // Try the mapped id first, then common aliases.
          const aliases =
            speaker === 'paladin' ? ['paladin', 'david']
            : speaker === 'david' ? ['david', 'paladin']
            : [speaker];
          let npc = null;
          for (const a of aliases) {
            npc = mission.npcs.get(a);
            if (npc) break;
          }
          if (npc) {
            pos = { ix: npc.px + TILE / 2, iy: spriteTopY(npc) };
          }
        }
        if (pos) {
          // Closure over the speaker so the bubble can follow a walking
          // character.  getLive() recomputes the speaker's current position
          // in viewport coords — called every animation frame by showBubble.
          const getEntity = () => {
            if (speaker === 'hero') return mission.hero;
            const aliases =
              speaker === 'paladin' ? ['paladin', 'david']
              : speaker === 'david' ? ['david', 'paladin']
              : [speaker];
            for (const a of aliases) {
              const n = mission.npcs.get(a);
              if (n) return n;
            }
            return null;
          };
          const getLive = () => {
            const ent = getEntity();
            if (!ent) return null;
            const cam2 = getCamera();
            const ix2 = ent.px + TILE / 2;
            const iy2 = spriteTopY(ent);
            return {
              ix: ((ix2 - cam2.x) / cam2.w) * INTERNAL_W,
              iy: ((iy2 - cam2.y) / cam2.h) * INTERNAL_H
            };
          };
          const initial = getLive() ?? { ix: (pos.ix - 0) / 1, iy: pos.iy };
          // Map speaker → Simlish voice key (thoughts don't play simlish).
          const voice = isThought
            ? null
            : speaker === 'hero' ? 'aida'
            : speaker === 'paladin' ? 'david'
            : speaker === 'lisa' ? 'lisa'
            : speaker === 'maha' ? 'maha'
            : 'default';
          // Each speaker gets a distinct colour on their bubble.
          const color =
            speaker === 'hero' ? 'aida'
            : speaker === 'paladin' || speaker === 'david' ? 'david'
            : speaker === 'lisa' ? 'lisa'
            : speaker === 'maha' ? 'maha'
            : 'paper';
          return showBubble({
            ix: initial.ix,
            iy: initial.iy,
            name: opts.name,
            text: opts.text,
            choices: opts.choices,
            voice,
            thought: isThought,
            color,
            track: getLive
          });
        }
      }
      // Last resort when speaker can't be resolved — fall back to top card.
      return showNarration({ text: opts.text, choices: opts.choices });
    };

    const ctx = {
      mission,
      dialogue,
      fadeText: showFadeText,
      phone: showTextMessages,
      actionButton: showActionButton,
      setAffection: (n) => setAffection(n),
      playLoop,
      stopLoop,
      sfx: {
        click: playClick,
        select: playSelect,
        chime: playChime,
        blip: playBlip,
        heart: playHeartPop,
        boom: playFireworkBoom,
        knock: playKnock,
        groan: playGroan,
        swing: playSwing,
        hit: playHit
      },
      audio: {
        pianoPhrase: playPianoPhrase,
        pianoNote: playPianoNote,
        metalRiff: playMetalRiff,
        sweetChild: playSweetChildIntro,
        tillThen: playTillThen,
        bestFriend: playBestFriend
      },
      delay: (ms) => new Promise((r) => setTimeout(r, Math.max(0, ms / (window.__devSpeed || 1)))),
      setSceneEffects,
      setCameraTarget,
      setCameraZoom,
      fadeTo,
      snapFade,
      spawnHeart: mission.spawnHeart,
      spawnMusicNote: mission.spawnMusicNote,
      spawnFirework: (x, y, opts) => spawnFirework(x, y, opts),
      godRays: (dur) => triggerGodRays(dur ?? 3000),
      startSpotlight: (a, b, opts = {}) => startSpotlight({ a, b, ...opts }),
      stopSpotlight,
      playAngelic,
      spawnTeardrop: (px, py) => {
        // Anime-style big teardrop hovering above the character's head.
        addParticle({
          x: px,
          y: py,
          vx: 0,
          vy: -2,
          life: 1.3,
          glyph: '\u{1F4A6}',
          color: '#8ecbff'
        });
      },
      spawnExclaim: (px, py) => {
        // Shock exclamation marks popping above the character's head.
        for (let i = 0; i < 3; i++) {
          addParticle({
            x: px + (i - 1) * 6,
            y: py - i * 2,
            vx: (Math.random() - 0.5) * 4,
            vy: -16 - Math.random() * 6,
            ay: 28,
            life: 0.9,
            glyph: '!',
            color: '#ffeb6a'
          });
        }
      },
      spawnSmoke: (x, y) => addParticle({
        x: x + (Math.random() - 0.5) * 3,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: -10 - Math.random() * 6,
        life: 2.6,
        color: '#e8e8ec',
        size: 2
      }),
      spawnSnow: (x, y) => addParticle({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: 14 + Math.random() * 18,
        life: 4.5,
        color: '#e8eef4',
        size: 1
      }),
      spawnFire: (x, y, vx = 0, vy = 0) => {
        // A little burst of ember + smoke — spits in the given direction.
        const colors = ['#ffcc33', '#ff7a1a', '#d03010', '#2b1008'];
        for (let i = 0; i < 10; i++) {
          addParticle({
            x: x + (Math.random() - 0.5) * 4,
            y: y + (Math.random() - 0.5) * 4,
            vx: vx + (Math.random() - 0.5) * 20,
            vy: vy + (Math.random() - 0.5) * 20,
            ay: -6,
            life: 0.7 + Math.random() * 0.6,
            color: colors[i % colors.length],
            size: 2
          });
        }
      },
      spawnBlood: (x, y) => {
        for (let i = 0; i < 8; i++) {
          addParticle({
            x, y,
            vx: (Math.random() - 0.5) * 40,
            vy: -20 - Math.random() * 30,
            ay: 60,
            life: 0.9 + Math.random() * 0.4,
            color: '#8a1020',
            size: 1
          });
        }
      },
      shake: (mag, dur) => engineShake(mag, dur)
    };
    // Wait for the scene to finish fading in before the first dialogue
    // bubble appears — otherwise characters start talking over a black
    // screen while the environment is still washing in.
    await ctx.delay(700);
    try {
      await m.play(ctx);
    } catch (err) {
      console.error('Mission', m.id, 'errored:', err);
    }

    // Outro (skip on the zombie finale which ends with its own fade)
    if (m.id !== 'm10') {
      stopLoop();
      fadeTo(1, 500);
      await ctx.delay(600);
      setScene(null);
      await showOutro({ text: m.outro });
      writeSave({ completed: i + 1, ts: Date.now() });
      snapFade(1);
    } else {
      writeSave({ completed: missions.length, ts: Date.now() });
    }
  }

  // Credits
  setScene(null);
  snapFade(0);
  await showCredits(creditsData);
  clearUi();
  await backToTitle();
}

// Skip to the next mission — uses the same devJump mechanism as the dev panel.
function installSkipScene() {
  if (document.querySelector('.skip-scene')) return;
  const btn = document.createElement('button');
  btn.className = 'skip-scene';
  btn.textContent = 'Skip Scene \u2192';
  btn.title = 'Skip to the next scene';
  btn.addEventListener('click', () => {
    const save = (() => {
      try {
        return JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null');
      } catch {
        return null;
      }
    })();
    const completed = save?.completed ?? 0;
    const next = Math.min(completed + 1, missions.length);
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({ completed: next, ts: Date.now(), devJump: true })
    );
    location.reload();
  });
  document.getElementById('ui').appendChild(btn);
}

// Dev-mode chapter jumper — lets you skip to any mission.
function installDevPanel() {
  if (document.querySelector('.dev-panel')) return;
  const panel = document.createElement('div');
  panel.className = 'dev-panel';
  const btn = document.createElement('button');
  btn.className = 'dev-toggle';
  btn.textContent = '⚙';
  btn.title = 'Dev: jump to chapter';
  const list = document.createElement('div');
  list.className = 'dev-list';
  list.style.display = 'none';
  missions.forEach((m, i) => {
    const b = document.createElement('button');
    b.className = 'dev-chapter';
    b.textContent = `${m.chapter}. ${m.title}`;
    b.addEventListener('click', () => {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({ completed: i, ts: Date.now(), devJump: true })
      );
      location.reload();
    });
    list.appendChild(b);
  });
  const end = document.createElement('button');
  end.className = 'dev-chapter';
  end.textContent = '🏁 Skip to Credits';
  end.addEventListener('click', () => {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({ completed: missions.length, ts: Date.now(), devJump: true })
    );
    location.reload();
  });
  list.appendChild(end);
  const clear = document.createElement('button');
  clear.className = 'dev-chapter dev-reset';
  clear.textContent = '🔄 Reset save';
  clear.addEventListener('click', () => {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  });
  list.appendChild(clear);

  // 2x speed toggle — speeds up all delays/dialogue wait times so you can
  // speed-run the whole game for testing.
  const speed = document.createElement('button');
  speed.className = 'dev-chapter dev-speed';
  const applySpeedLabel = () => {
    const s = window.__devSpeed || 1;
    speed.textContent = s === 1 ? '\u23E9 Speed: 1x' : `\u23E9 Speed: ${s}x`;
  };
  applySpeedLabel();
  speed.addEventListener('click', () => {
    const cur = window.__devSpeed || 1;
    const next = cur === 1 ? 2 : cur === 2 ? 4 : 1;
    window.__devSpeed = next;
    applySpeedLabel();
  });
  list.appendChild(speed);

  btn.addEventListener('click', () => {
    list.style.display = list.style.display === 'none' ? 'flex' : 'none';
  });
  panel.appendChild(btn);
  panel.appendChild(list);
  document.getElementById('ui').appendChild(panel);
}

async function backToTitle() {
  // Loop back to the title for another playthrough if they want.
  clearUi();
  snapFade(0);
  boot();
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function boot() {
  showPreload(async () => {
    ui.innerHTML = '';
    initEngine(canvas);
    startLoop();
    setSimlishHandler(playSimlish);
    const save = readSave();

    // Dev jump — skip title + briefing and drop straight into the target mission.
    if (save?.devJump) {
      const idx = Math.min(save.completed, missions.length - 1);
      // Re-write save without the devJump flag so a plain reload stays in place.
      writeSave({ completed: idx, ts: Date.now() });
      initAudio();
      runCampaign(idx, { skipBriefing: true });
      return;
    }

    // Audio init waits for user gesture — the title button click counts.
    const action = await showTitle({
      hasSave: !!save && save.completed < missions.length
    });
    initAudio();
    if (action === 'continue' && save) {
      runCampaign(save.completed);
    } else {
      clearSave();
      runCampaign(0);
    }
  });
}

if (document.fonts?.ready) {
  document.fonts.ready.then(boot);
} else {
  boot();
}
