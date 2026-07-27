# Motion verification checklist

Check definitions for `motion-verification`. Applicability rules — which checks a given effect must run — are in that skill's SKILL.md. Each id here is stable and is quoted directly in a motion spec's `verification.required_checks` and in failure reports.

Severity key: **B** = Blocker (does not ship) · **M** = Major · **m** = Minor.

---

## Reduced motion

### `RM-1` — Movement is removed or reduced · **B**
Emulate `prefers-reduced-motion: reduce`, trigger the effect.
**Pass:** behaviour matches the spec's `reduced_motion.strategy`.
**Fail:** the effect plays unchanged, or a *different* unspecified animation plays.
**Playwright:** `await context.emulateMedia({ reducedMotion: 'reduce' })`

### `RM-2` — The end state is still reached · **B**
Under reduce, complete the interaction.
**Pass:** the panel opens, the route changes, the item appears — the outcome is identical to the default pass.
**Fail:** the interaction does nothing, half-completes, or leaves the element at its animation start state (commonly `opacity: 0`).
*The single most common reduced-motion defect. Suppressing the animation must not suppress the result.*

> **`RM-1` alone will not catch this — verified empirically.** A page using the blanket override `@media (prefers-reduced-motion: reduce) { * { animation: none !important } }`, with its end state defined only inside the keyframe, **passes `RM-1`** (nothing is animating, correctly) and **fails `RM-2`** (the element is stranded at `opacity: 0`, permanently invisible). Confirmed in a browser run on 2026-07-26; see `evaluations/2026-07-26-motion-intelligence.md` §3.5. Always run both.

### `RM-3` — The preference is honoured when toggled at runtime · **M**
Change the emulated preference while the page is open, then trigger.
**Pass:** the new preference takes effect without a reload.
**Fail:** the preference is read only at first render.

---

## Accessibility

### `A11Y-1` — Focus is never lost · **B**
Tab to the trigger, activate by keyboard, complete the effect.
**Pass:** focus is on a deliberate element throughout and afterwards; on close it returns to the trigger.
**Fail:** focus lands on `document.body`, on a removed element, or somewhere unpredictable.
**Playwright:** `await page.evaluate(() => document.activeElement?.tagName)`

### `A11Y-2` — Focus indicators are not animated and stay visible · **B**
Tab through every element the effect touches.
**Pass:** indicators appear instantly and remain fully visible; the effect never clips or slides one out of view.
**Fail:** the indicator fades in, or is obscured mid-animation.

### `A11Y-3` — Keyboard scrolling still works · **B**
*(smooth-scroll libraries)* Press Space, PageDown, Home, End; run browser find-in-page and jump to a match.
**Pass:** each moves the viewport correctly and lands where expected.
**Fail:** any is swallowed, overshoots, or leaves the match off-screen.

### `A11Y-4` — Keyboard-initiated actions do not animate · **M**
Trigger the same action by pointer and by keyboard.
**Pass:** the keyboard path is instant, or the spec justifies `runs_on_keyboard_trigger: true`.
**Fail:** it animates with no justification. *(Hard failure in `agents/motion-reviewer.md`.)*

---

## Console, SSR, hydration

### `CON-1` — No new console errors · **B**
Listen from before the first navigation, through every pass.
**Pass:** no new errors or warnings attributable to the change.
**Fail:** any. Duplicate `view-transition-name` values and GSAP plugin-registration errors both surface here.
**Playwright:** `page.on('console', …)` and `page.on('pageerror', …)`

### `SSR-1` — No hydration warnings · **B**
Load the server-rendered page with a clean console.
**Pass:** no hydration mismatch warnings.
**Fail:** any — typically an animated value differing between server and client render.

### `SSR-2` — No flash of pre-animation state · **M**
Load with a throttled network so hydration is observably slow.
**Pass:** content is readable before hydration completes.
**Fail:** content is invisible or displaced until JS runs. *An `initial={{ opacity: 0 }}` on above-the-fold content fails here, and fails permanently if JS never loads.*

### `FALL-1` — The non-supporting path still works · **B**
For View Transitions and scroll-driven CSS: run in a browser lacking the feature, or disable it.
**Pass:** the state change still happens; the static state is readable.
**Fail:** the DOM update is skipped, or elements are stranded at the animation's start state.

---

## Load and navigation

### `LOAD-1` — Load motion does not block content · **M**
Load the page cold.
**Pass:** content is present and readable; motion is enhancement.
**Fail:** text is invisible until an entrance completes.

### `LOAD-2` — Load motion runs once · **m**
Reload, then navigate away and back.
**Pass:** matches the spec — usually once per session, not on every return.

### `NAV-1` — Route transitions complete · **B**
Navigate forward and back, including the browser back button.
**Pass:** each transition completes and the destination renders correctly.
**Fail:** a route is left partially transitioned, or scroll position is wrong.

### `NAV-2` — Rapid navigation does not corrupt state · **B**
Navigate three times in under a second.
**Pass:** the final route renders correctly; superseded transitions are abandoned cleanly.
**Fail:** overlapping routes, a stuck overlay, or a frozen transition.

---

## Interaction

### `HOV-1` — Hover motion does not fight the pointer · **M**
Move across the element repeatedly, and along its boundary.
**Pass:** no flicker; the element does not move out from under the cursor.
**Fail:** hover causes movement that ends the hover, which restarts it — a loop.

### `HOV-2` — Touch has an equivalent · **M**
On a touch viewport, attempt the same action.
**Pass:** the functionality is reachable without hover.
**Fail:** it is hover-only. *(Also a Mobile UX Reviewer blocker.)*

### `INT-1` — Rapid repeated triggering · **B**
Trigger ten times in quick succession.
**Pass:** matches `interruption.behavior`; ends in a correct, stable state.
**Fail:** stuck mid-animation, doubled elements, drifting values, or a state that no longer matches the data.

### `INT-2` — Interruption and reversal mid-flight · **B**
Trigger, then reverse before completion; repeat at several points.
**Pass:** the spec's interruption behaviour, with no visual jump.
**Fail:** the animation restarts from the origin when it should retarget, or snaps.

### `DRAG-1` — Drag preserves velocity · **M**
Drag and release at speed, in several directions.
**Pass:** motion continues naturally from release velocity; constraints hold.
**Fail:** it snaps to zero velocity, or escapes its bounds.

### `DRAG-2` — Drag does not break scrolling · **B**
On touch, drag along and across the drag axis.
**Pass:** page scroll works on the non-drag axis; no scroll lock is left behind.
**Fail:** the page cannot be scrolled after a drag.

---

## Scroll

### `SCR-1` — Scroll motion is interruptible · **M**
Scroll fast, reverse, stop abruptly.
**Pass:** the effect tracks scroll position without lag or overshoot.
**Fail:** it continues after scrolling stops, or fights the input.

### `SCR-2` — Scroll motion does not cause layout shift · **B**
Watch elements below the effect while scrolling through it.
**Pass:** nothing below jumps.
**Fail:** revealed content pushes content while the user is reading.

### `SCR-3` — Pinned sections release correctly · **B**
*(mandatory for GSAP ScrollTrigger pin/scrub)* Scroll through the pinned section forward and back; resize mid-pin; navigate away and back; repeat at all three viewports.
**Pass:** the section pins and releases at the right offsets, and no pin spacer is left behind.
**Fail:** the section stays stuck, overlaps the next, or leaves a gap after resize or navigation. *The single most common GSAP defect in production, and worst on iOS Safari.*

### `SCR-4` — Smooth scroll does not break anchors · **M**
Follow in-page anchor links; use browser find-in-page.
**Pass:** the target is reached and correctly positioned.
**Fail:** it overshoots, undershoots, or never arrives.

### `SCR-5` — Smooth scroll is fully disabled under reduce · **B**
Emulate reduce; scroll.
**Pass:** native scrolling is restored completely.
**Fail:** interpolated scrolling continues in any form.

---

## Viewport and layout

### `VP-1` / `VP-2` / `VP-3` — Mobile 375×812 · Tablet 768×1024 · Desktop 1440×900 · **B**
Run the effect at each.
**Pass:** the effect completes and remains legible; travel distances suit the viewport.
**Fail:** clipped, overlapping, off-screen, or a distance that overshoots at small width.

### `OVF-1` — No horizontal overflow · **B**
At 320px and each viewport above, during **and after** the effect.
**Pass:** `document.documentElement.scrollWidth <= clientWidth` throughout.
**Fail:** any horizontal scrollbar. *Off-screen start positions (`translateX(100%)`) are the usual cause, and often appear only mid-animation.*

> **Sample across the effect window, not after it.** Verified 2026-07-26: an element animating from `translateX(90vw)` overflowed only mid-flight and was clean at rest. Checking once after settling — the intuitive implementation — reports a false pass. Poll every ~40ms for the effect's duration.
**Playwright:** `await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)`

### `CLS-1` — No new layout shift · **B**
Observe layout-shift entries across the effect window.
**Pass:** no shift attributable to the effect; space was reserved.
**Fail:** entrance animation displaces surrounding content.
**Playwright:** `PerformanceObserver` on `layout-shift`

---

## Lifecycle and cleanup

### `CLEAN-1` — No stale animation instances · **B**
Mount and unmount the component five times; count live animations.
**Pass:** the count returns to baseline.
**Fail:** it grows each cycle.
**Playwright:** `await page.evaluate(() => document.getAnimations().length)`

### `CLEAN-2` — No orphaned ScrollTriggers or listeners · **B**
Navigate away and back five times.
**Pass:** trigger and listener counts return to baseline; scroll performance is unchanged.
**Fail:** counts accumulate, or scrolling degrades with each cycle.
**Playwright:** `await page.evaluate(() => window.ScrollTrigger?.getAll().length)`

### `CLEAN-3` — Animation frame loops stop · **M**
Idle the page after the effect completes; observe CPU in a trace.
**Pass:** activity returns to idle.
**Fail:** a `requestAnimationFrame` loop continues after the effect ends.

---

## Performance

### `PERF-1` — Frame rate holds under throttling · **B**
4× CPU throttling, capture a trace across the effect window.
**Pass:** meets the surface's frame floor; no long tasks over 50ms caused by the effect.
**Fail:** dropped frames, or layout/paint work inside the effect window when the spec claims `compositor_only: true`.
**Playwright:** CDP `Emulation.setCPUThrottlingRate`, `{ rate: 4 }`

### `PERF-2` — Bundle cost matches the spec · **M**
Measure the bundle with and without the dependency.
**Pass:** within `performance_budget.added_bytes_gz`.
**Fail:** over budget, or the field was never filled in.

### `PERF-3` — No memory growth over a session · **M**
Repeat the effect fifty times; sample heap size.
**Pass:** memory returns to near baseline after collection.
**Fail:** monotonic growth. *Matters most on `dashboard`, where sessions are long.*
