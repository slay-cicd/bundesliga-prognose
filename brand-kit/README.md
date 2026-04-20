# Concorde — Brand Kit

## Logos

All in `/logos`:

| File | Use case |
|------|----------|
| `concorde-mark-orange.svg` | Mark only, burnt orange (on any bg except orange) |
| `concorde-mark-white.svg` | Mark only, white (dark/photo backgrounds) |
| `concorde-mark-black.svg` | Mark only, black (light backgrounds, print) |
| `concorde-wordmark-orange-on-dark.svg` | Mark + "Concorde" word, orange mark + light text on dark |
| `concorde-wordmark-white-on-dark.svg` | All white on dark bg (stripped / monochrome) |
| `concorde-wordmark-orange-on-light.svg` | Orange mark + black text on light bg |
| `concorde-wordmark-italic-on-dark.svg` | Italic Cormorant variant on dark (more editorial) |

Mark geometry: angular diagonal swoosh pointing up-right, with a terminator dot. Scalable, print-safe.

Stroke width should stay at `1.75` relative to `viewBox 0 0 24 24` — if you scale for print/large contexts, keep the stroke ratio constant.

## Fonts

### Cormorant Garamond (Display / Headlines)
Weights included (OFL license): 300, 400, 500, 600, 700 (regular + italic for 300/400/500/700)

**Primary use:**
- Hero headlines (light weight 300, often italic for accent words)
- Editorial pull-quotes (italic)
- Big display numerals (tnum when in data context)

**Do NOT use for:**
- Body text (hard to read at small sizes)
- CTAs
- Small UI elements

### Inter (UI / Body)
Weights included (OFL): 300, 400, 500, 600, 700, 800

**Primary use:**
- All body text
- CTAs (semibold 600)
- Labels / eyebrows (uppercase + tracked, weight 500-600)
- Navigation
- Data-heavy UI

## Colors

### Primary Accent
- `#C4622D` — Burnt Orange (CTAs, accent words in headlines, slider handles, badges)
- `#a85322` — Burnt Orange Hover
- `rgba(196, 98, 45, 0.08)` — Burnt Orange Tint (backgrounds, glows)

### Surfaces (dark)
- `#0a0a0b` — Surface 0 (base bg — near-black, not pure)
- `#1a1a1d` — Surface 1 (elevated cards)
- `#232326` — Surface 2 (inputs, tabs)
- `#2b2b2f` — Surface 3 (deepest panel)

### Borders
- `#27272a` — Border (default)
- `#333338` — Border Light (hover)

### Text
- `#e5e5e7` — Text Primary (headlines, numbers)
- `#8b8b8e` — Text Secondary (body)
- `#5a5a5d` — Text Muted (meta, labels)

### Signal Colors
- `#22c55e` — Up / Long / Profit
- `rgba(34, 197, 94, 0.12)` — Up Dim (bg)
- `#ef4444` — Down / Short / Loss
- `rgba(239, 68, 68, 0.12)` — Down Dim (bg)

## Ad Creative Guidelines

- **Background:** always dark (`#0a0a0b`), never pure black
- **Accent usage:** sparingly — one burnt orange element max per composition
- **Numerals:** always `tabular-nums` (mono-digit spacing) — sells "finance, not casino"
- **Italics for emphasis:** serif italic on the money word (e.g. "*Hebel.*", "*Perpetual.*")
- **Whitespace:** generous — 60%+ of the frame should be surface/air
- **NO emojis.** Use SVG icons with hand-drawn 1.5–1.75 stroke, or the Concorde mark itself as visual punctuation.
- **NO gradients as primary surfaces.** Radial glows at 5–8% alpha are ok as subtle atmosphere.
- **NO generic stock photography.** If you need imagery: screens/trading UI, charts, abstract geometric forms. Never hands-on-laptop or diverse-suit-people stock.
- **Copy tone:** German du-form, short sentences, confident. No exclamation marks. Every word earns its place.

## File list

```
brand-kit/
├── README.md  (this file)
├── logos/
│   ├── concorde-mark-orange.svg
│   ├── concorde-mark-white.svg
│   ├── concorde-mark-black.svg
│   ├── concorde-wordmark-orange-on-dark.svg
│   ├── concorde-wordmark-white-on-dark.svg
│   ├── concorde-wordmark-orange-on-light.svg
│   └── concorde-wordmark-italic-on-dark.svg
└── fonts/
    ├── cormorant-garamond/
    │   ├── *.ttf  (5 weights + 4 italics)
    │   ├── *.woff2 (web)
    │   └── LICENSE.txt (OFL)
    └── inter/
        ├── *.ttf  (6 weights)
        ├── *.woff2 (web)
        └── LICENSE.txt (OFL)
```

Both fonts are **SIL Open Font License** — free for commercial use, modification, redistribution.
