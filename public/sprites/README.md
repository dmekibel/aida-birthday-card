# Custom character art

Drop PNG files here to replace my hand-typed pixel art with your own images (AI-generated or hand-drawn).

## Character sprites (top-down view)

Filename → replaces in-game sprite:

- `aida.png` — Aida in her normal colourful sweater (Missions 2–8)
- `aida1.png` — Aida in the black dress at the club (Mission 1)
- `pal.png` — David in band tee (Missions 4–8)
- `pal1.png` — David in white shirt at the club (Missions 1–3)
- `lisa.png` — Lisa
- `maha.png` — Maha
- `smoker.png` — generic employee NPC
- `zombie.png` — zombie-Lisa

## Recommended format

- **32×32 or 48×48 px** PNG with transparency
- The sprite's feet should sit at the **bottom** of the image; the image's top is empty space above the head
- Pixel art or chibi anime works best — smaller is cleaner

## Portraits

See `/public/portraits/README.md` — those are the faces used in the dialogue parchment / phone UI.

## How overrides work

On game boot the loader tries to fetch each PNG. If it exists, it replaces the procedural sprite. If it's missing, the built-in pixel art is used. No restart or rebuild needed — just drop the file and reload the page.
