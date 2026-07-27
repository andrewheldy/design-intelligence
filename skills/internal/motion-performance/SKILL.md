---
name: motion-performance
description: Performance budgets and measurement for motion — the compositor path, per-surface bundle and frame budgets, layout thrash, CLS and INP impact, and how to verify frame rate rather than assert it. Use when writing the performance_budget section of a motion spec and when auditing an implementation.
---

# Motion Performance

Motion competes for the same frame budget as everything else on the page. This skill decides what it may spend, before it is spent.

## 1. The compositor path

A frame the browser can composite without recalculating layout or repainting costs almost nothing. A frame that forces layout costs everything.

| Property | Cost | Verdict |
|---|---|---|
| `transform` | Composite only | **Animate freely** |
| `opacity` | Composite only | **Animate freely** |
| `filter`, `backdrop-filter` | Paint (GPU) | Acceptable sparingly; expensive on large areas and on mobile |
| `color`, `background-color` | Paint | Acceptable on small areas |
| `width`, `height`, `top`, `left`, `margin`, `padding` | **Layout + paint + composite, every frame** | **Hard failure** where a transform would do (`agents/motion-reviewer.md`) |
| `box-shadow` | Paint, often large area | Animate a pseudo-element's opacity instead |

`performance_budget.compositor_only: false` requires a written justification. Sometimes it is genuinely necessary — animating `height: auto` has no transform equivalent — but it must be a decision, not an accident. When it is necessary, prefer `grid-template-rows: 0fr → 1fr` or a scale-with-counter-scale technique over animating `height` directly.

### `will-change`

Promote sparingly and temporarily. `will-change: transform` on a permanent stylesheet rule holds GPU memory for layers that are not animating; on mobile this causes the exact jank it was added to prevent. Add it just before the animation, remove it after — or omit it and let the browser decide, which is usually correct.

### Layout thrash

Reading a layout property (`offsetHeight`, `getBoundingClientRect`) after writing a style forces a synchronous layout. In a loop over N elements this is N layouts per frame. Batch: read all, then write all. GSAP's Flip and Motion's `layout` handle this internally; hand-written FLIP frequently does not.

## 2. Budgets by surface

Defaults, to be overridden explicitly in the spec rather than silently.

| Surface | Added JS (gz) | Frame floor | Notes |
|---|---|---|---|
| `conversion-flow` | **0 KB** | 60fps | Native only. A new animation dependency on a checkout path is a revenue decision, not a design one. |
| `dashboard` | ≤ 40 KB | 60fps | Long sessions; a leak that is invisible in a demo is fatal here. |
| `product-ui` | ≤ 40 KB | 60fps | One engine. A second requires `layer_ownership`. |
| `internal-tool` | ≤ 40 KB | 45fps | Speed over polish; motion is rarely worth any bytes. |
| `mobile-app` | ≤ 30 KB | 60fps | Weakest devices, tightest thermal budget. |
| `editorial` | ≤ 70 KB | 60fps desktop / 45fps mobile | Reading must never wait on motion. |
| `marketing` | ≤ 70 KB | 60fps desktop / 45fps mobile | Highest tolerance, still measured. |

Reference costs, gzipped and approximate — measure the real number in the project, do not quote these:

- Native (CSS, WAAPI, View Transitions, scroll-driven): **0 KB**
- Motion, typical React usage: **~30–40 KB** (less with `LazyMotion`)
- GSAP core + ScrollTrigger: **~50–70 KB**, more per plugin
- Lottie player + a JSON asset: player plus the asset, which is often the larger half
- Rive: WASM runtime plus the `.riv` file

**The tier-0 argument is a performance argument.** Zero bytes and zero frames is always the cheapest option, and often the correct one.

## 3. Core Web Vitals

### CLS — layout shift

The classic failure: content animates in from `opacity: 0` with no reserved space, so everything below it jumps. Reserve the space in the static layout and animate only `transform`/`opacity` within it. `performance_budget.cls_contribution` should state the expected contribution, and "none — space is reserved" is the answer you want.

Scroll-triggered reveals are the highest-risk pattern here: they fire exactly when the user is reading the content below.

### INP — interaction responsiveness

Motion must not sit between the input and the response. Concretely:

- Start the animation **after** the state change is committed, not before.
- Never `await` an animation before applying its result.
- Keep the animation's setup work off the interaction handler — heavy measurement on click delays the response the animation was meant to acknowledge.
- `confirm-action` motion in particular must never delay the action it confirms.

### LCP

An entrance animation on the largest element delays LCP by its full duration. Above-the-fold content should not animate in. If it must, animate from a visible state — never from `opacity: 0` in server-rendered HTML, which also means a hydration failure leaves the content invisible permanently.

## 4. Measurement — do not assert, measure

**Frame rate is verified, not claimed.** Per `motion-verification`:

1. Record a Chrome DevTools performance trace while the effect runs. Playwright can capture one via CDP.
2. Read **dropped frames** and long tasks over 50ms during the effect window.
3. Confirm the animated element is on its own compositor layer, and that no `Layout` or `Recalculate Style` entries appear inside the effect window.
4. Repeat with **4× CPU throttling** — the desktop test tells you almost nothing about a mid-range phone.

Bundle cost:

```sh
npx source-map-explorer dist/**/*.js     # or the bundler's own analyzer
```

Record the measured delta caused by *this* dependency, not the library's advertised size.

## 5. Recurring failure modes

| Failure | Symptom | Cause |
|---|---|---|
| Stale animation instances | Degrades over a session; memory climbs | Animations not cancelled on unmount |
| Orphaned ScrollTriggers | Jank after several route changes | No `kill()`/`revert()` on cleanup |
| Uncancelled rAF loop | CPU stays busy after the effect ends | Loop not stopped on unmount |
| Permanent `will-change` | Worse on mobile than without it | Left in a stylesheet rule |
| Layout thrash in a loop | Frame time scales with element count | Interleaved reads and writes |
| Everything animates at once | Frame drops on entrance | No stagger, no scoping |
| Scroll listener without throttle | Scroll stutters | Work on every scroll event instead of rAF or a scroll timeline |
| `transition: all` | Unexpected properties animate; layout runs | Never use it |

Stale instances and orphaned triggers are explicit checks in `motion-verification` because they are invisible in a single interaction and obvious after twenty.

## 6. What this skill does not do

WCAG and reduced motion → **`motion-accessibility`** (a performance saving is never a reason to skip the reduced-motion branch). Engine choice → **`motion-selection`**, though a budget failure is a legitimate reason to send a decision back there. Duration and easing character → **`emil-design-skills`**.

## Output contract

The `performance_budget` block of the spec: compositor-only true/false with justification if false, measured added bytes, frame-rate floor, CLS contribution, INP notes. During audit: measured evidence — trace results and bundle deltas — never assertions that something "should be fast".
