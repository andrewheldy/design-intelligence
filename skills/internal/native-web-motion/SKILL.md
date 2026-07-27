---
name: native-web-motion
description: Implements tiers 1 and 2 of the motion hierarchy with zero dependencies — CSS transitions and keyframes, the Web Animations API, View Transitions, and CSS scroll-driven animations, including their required fallbacks and SSR guards. Use once motion-selection has chosen a native engine.
---

# Native Web Motion

Tiers 1–2. No bundle cost, no dependency, no version to maintain. Most UI motion belongs here and ends up elsewhere only because the author reached for a library first.

Read [`references/browser-support.md`](references/browser-support.md) for verified Baseline data before relying on any tier-2 feature.

## Tier 1 — CSS transitions and keyframes

### Transitions — for state changes

```css
.panel {
  transform: translateY(8px);
  opacity: 0;
  transition:
    transform 240ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 160ms linear;
}
.panel[data-open="true"] { transform: none; opacity: 1; }
```

Rules:

- **Never `transition: all`.** It animates properties you did not intend, including ones that force layout. `agents/motion-reviewer.md` lists it as a hard failure.
- **Name every property.** Different properties usually want different durations — opacity typically finishes before movement.
- **Never a bare CSS keyword** (`ease`, `ease-in`, `linear` for UI). State a curve. `ease-in` on an entrance is a hard failure: it starts slow and arrives fast, the opposite of how things settle.
- **Enter and exit differ.** Entrances decelerate into place; exits may accelerate away and are usually shorter.
- **Never animate from `scale(0)`.** Hard failure. Start near the resting size (`0.96`–`0.98`) so the element grows into place rather than erupting.
- **`transform-origin` is the spatial story.** A popover must scale from its trigger, not its own centre.

### Keyframes — for multi-step or looping motion

Use when the effect has intermediate states a transition cannot express. Set `animation-fill-mode: forwards` when the end state must persist, and remember that an infinite loop over 5 seconds needs a pause control (WCAG 2.2.2).

### Approximating springs in pure CSS

`linear()` accepts stops and can approximate spring character without a dependency:

```css
transition-timing-function: linear(0, 0.25 25%, 0.99 60%, 1.02 78%, 1);
```

Useful when a single element wants spring feel and adding a library for it would not survive the escalation gate.

### Reduced motion — opt in, so the safe state is the default

```css
@media (prefers-reduced-motion: no-preference) {
  .panel { transition: transform 240ms cubic-bezier(0.32, 0.72, 0, 1), opacity 160ms linear; }
}
```

Avoid blanket `* { animation: none !important }` — it also kills functional indicators such as spinners that convey status.

### Cleanup and SSR

Nothing to clean up. Nothing to guard. This is a real advantage, not a consolation.

## Tier 2a — Web Animations API

Baseline widely available (Chrome 84, Firefox 75, Safari 13.1).

Choose it over CSS when values are computed at runtime, or when the animation must be **interrupted and re-targeted**.

```js
const mq = matchMedia('(prefers-reduced-motion: reduce)');

let animation;
function open(el, distance) {
  animation?.cancel();                 // interruption: cancel before re-targeting
  if (mq.matches) { el.style.transform = 'none'; return; }
  animation = el.animate(
    [{ transform: `translateY(${distance}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }],
    { duration: 240, easing: 'cubic-bezier(0.32, 0.72, 0, 1)', fill: 'both' }
  );
}
```

- **Interruption:** keep a reference. `cancel()` reverts, `finish()` jumps to the end, `reverse()` plays back from the current position. Reversal preserving position is WAAPI's main advantage over CSS.
- **`commitStyles()`** when the end state must persist beyond the animation's lifetime; prefer it to leaving `fill: 'both'` animations alive indefinitely.
- **SSR:** `element.animate` does not exist on the server. Guard, or run it in an effect.
- **Cleanup:** cancel outstanding animations on unmount; a `fill: 'both'` animation on a removed element holds a reference.

## Tier 2b — View Transitions

Same-document: **Baseline newly (2025-10-14)** — Chrome 111, Safari 18, Firefox 144.
Cross-document: **Baseline limited** — Chrome 126, Safari 18.2, **no Firefox**.

```js
function update() { /* the DOM change — must happen regardless */ }

if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.startViewTransition(update);
} else {
  update();
}
```

- **Progressive enhancement, always.** The `else` branch is not optional; the state change must happen without the transition.
- **`view-transition-name` must be unique** among elements present at the same time. Duplicates throw and abort the transition — a common cause of a transition silently not running.
- **Suppress the transition wholesale under reduced motion**, via the `::view-transition-*` pseudo-elements, not by skipping the DOM update.
- **Cross-document** (`@view-transition { navigation: auto }`) is polish only while Firefox lacks support.
- **Interruption:** starting a new transition while one is running skips the first. For rapid navigation, that is usually correct — verify it looks intentional.
- **SSR:** the API is client-only. Cross-document transitions do work with server-rendered MPAs, which is their point.

## Tier 2c — CSS scroll-driven animations

**Baseline limited: Chrome 115, Safari 26, no Firefox as of 2026-07-26.**

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: scroll()) {
    .progress { animation: grow linear; animation-timeline: scroll(root block); }
    .card     { animation: reveal linear both; animation-timeline: view(); animation-range: entry 0% cover 40%; }
  }
}
```

**Conditional-use rule (from `motion-selection`):** this may not be the sole implementation of a scroll effect when Firefox is in scope. Either the spec explicitly accepts the degraded static state, or the work escalates to GSAP ScrollTrigger. The `@supports` guard above is what makes the degraded state safe — without it, a non-supporting browser can be left holding the animation's start state, showing nothing.

- Runs off the main thread, so it outperforms scroll-listener implementations.
- No scroll listeners means nothing to clean up.
- Elements must have a stable size for `view()` ranges to behave predictably.

## Choosing within native

| Need | Use |
|---|---|
| Discrete state change, values known at author time | CSS transition |
| Multi-step or looping | CSS keyframes |
| Runtime-computed values, or interrupt-and-retarget | WAAPI |
| Morph between two DOM states or routes | View Transitions |
| Driven by scroll position, static fallback acceptable | Scroll-driven CSS |
| Spring character on one element | CSS `linear()` stops |

## Performance

- Animate **`transform` and `opacity`** only. `filter` is acceptable but costs more.
- Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` when a transform will do — hard failure in `agents/motion-reviewer.md`.
- `will-change` sparingly and temporarily. Left on permanently, it holds memory for layers that are not animating.
- Reserve space for elements that animate in, or you have shipped a CLS regression.

## What this skill does not do

React lifecycle motion — animated unmount, `layout`, `layoutId` — is **`motion-react`**. Timelines with dependent offsets, scroll scrubbing and pinning, SVG morphing are **GSAP** (registry `gsap-skills`). Easing character and duration feel are **`emil-design-skills`**.

## Output contract

Working native implementation, the reduced-motion branch, the fallback path for any non-Baseline feature used, and the cleanup notes (frequently "none — pure CSS", which is a good answer).
