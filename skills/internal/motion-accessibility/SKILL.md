---
name: motion-accessibility
description: The non-overridable accessibility floor for motion — reduced-motion strategies, vestibular triggers, keyboard and focus behaviour, autoplay limits, and assistive-technology consequences. Use before implementing any animation and again during review. Applies to every engine, including runtimes that provide no reduced-motion handling of their own.
---

# Motion Accessibility

`AGENTS.md` rule 5: **`prefers-reduced-motion`, focus visibility, and WCAG AA contrast take precedence over any skill's motion or styling mandates.** Brand does not override this. A skill directive does not override this. A deadline does not override this.

`prefers-reduced-motion` has been Baseline **widely available** since 2020-01-15 (Safari shipped it in 2017). **There is no browser-support argument for omitting it.**

## 1. Reduced motion — the four strategies

Pick one per effect and record it in `reduced_motion.strategy`. The rule underneath all four: **remove the movement, never the outcome.**

| Strategy | What remains | Use when |
|---|---|---|
| `none` | Nothing — the effect does not run | Purely decorative motion; brand flourishes; anything carrying no information |
| `opacity-only` | A short cross-fade, no movement | The transition needs to read as a change, but the travel is what causes discomfort |
| `instant-state-change` | The end state, applied immediately | The motion explained a change the user can still see in the result |
| `static-alternative` | A non-moving equivalent conveys the same information | The motion carried information — a pulse becomes a badge, a progress sweep becomes a number |

### The end-state rule

`reduced_motion.end_state_preserved` must be `true`. The schema enforces it with `const: true`, deliberately.

If the end state cannot be reached without the animation playing, the design is broken — not only for reduced-motion users, but for anyone on a slow device or anyone who interrupts. That is a design defect to fix, not an animation to add a fallback to.

### Common mistake

Setting `animation-duration: 0.01ms` globally and calling it done. That handles CSS and nothing else. It does not stop a GSAP timeline, a Motion spring, a Rive artboard, a Lottie player, or a `requestAnimationFrame` loop. Every engine needs its own branch.

### Per-engine implementation

**CSS** — prefer opting *in* to motion, so the safe state is the default:

```css
@media (prefers-reduced-motion: no-preference) {
  .panel { transition: transform 240ms cubic-bezier(0.32, 0.72, 0, 1); }
}
```

The reduce-branch form is also fine, but must be specific — a blanket `* { animation: none !important }` can break functional CSS animations such as loading indicators that convey status.

**WAAPI / vanilla JS** — branch before creating the animation, and honour changes at runtime:

```js
const mq = matchMedia('(prefers-reduced-motion: reduce)');
if (mq.matches) { el.style.transform = 'none'; }
else { el.animate(keyframes, options); }
mq.addEventListener('change', handlePreferenceChange);
```

The `change` listener matters: users toggle this setting mid-session, and an app that only reads it once ignores them.

**Motion (React)** — `useReducedMotion()` per component, or `MotionConfig reducedMotion="user"` at the root. The provider is the safer default because it cannot be forgotten in a new component; it disables transform animations while leaving opacity and colour.

**GSAP** — `gsap.matchMedia()` with a `(prefers-reduced-motion: reduce)` branch. The official `gsap-core` skill documents this and cites vestibular disorders. **The GSAP skills repository has no repository-level accessibility guidance** — this skill supplies it. Do not nest `gsap.context()` inside `matchMedia()`.

**View Transitions** — suppress the whole transition, not the individual pseudo-elements:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none; }
}
```
The DOM update must still happen. Skipping the transition must never skip the state change.

**Scroll-driven CSS** — gate `animation-timeline` behind `no-preference`. The static state must be the readable one.

**Rive** — no built-in handling. Do not mount the artboard, or stop the state machine, under reduce. A `.riv` that carries information needs a static alternative.

**Lottie / dotLottie** — no built-in handling. Do not autoplay under reduce. Any loop over 5 seconds needs a pause control regardless of preference (WCAG 2.2.2).

## 2. Vestibular triggers

Presence of these does not forbid an effect; it requires that reduced motion suppresses it **fully** and that the information survives. Record in `reduced_motion.vestibular_review`.

- Large-area movement crossing a substantial share of the viewport
- Parallax — layers at different rates
- Zoom or scale on large surfaces
- Spin and rotation
- Scroll hijacking, including any smooth-scroll library
- Rapid flashing or strobing
- Motion in the peripheral field

For these, `opacity-only` is usually insufficient. Prefer `none` or `instant-state-change`.

## 3. Keyboard and focus

**Motion must never damage keyboard operation.** These are hard failures, not preferences.

- **Focus indicators appear instantly.** Never animate the appearance of a focus ring. A 150ms fade on a focus indicator is a 150ms window in which a keyboard user does not know where they are.
- **Focus is never lost to an animation.** If an element animates out, focus must move somewhere deliberate before it goes — usually the trigger, or the container. Focus landing on `document.body` is a failure.
- **Focus is never moved unpredictably** by an animation completing. Motion must not steal focus.
- **Keyboard-initiated actions should generally not animate.** Registered guidance from `emil-design-skills`; `agents/motion-reviewer.md` lists it as a hard failure. A keyboard user is moving quickly and has already moved on. Setting `keyboard_and_focus.runs_on_keyboard_trigger: false` is the expected answer; `true` requires a reason in the spec.
- **Focus must stay visible throughout.** An element that animates while focused must not scroll, clip, or slide the focus ring out of view.
- **Skip links and focus targets must be reachable immediately.** No entrance animation may delay them.

## 4. Timing, autoplay, and WCAG

| Requirement | Success criterion |
|---|---|
| Motion from interaction can be disabled | **2.3.3 Animation from Interactions** (AAA, but treated as our floor) |
| Anything auto-playing, blinking, or scrolling for over 5s needs pause/stop/hide | **2.2.2 Pause, Stop, Hide** (A) |
| No more than three flashes per second | **2.3.1 Three Flashes** (A) |
| Motion must not create a time limit on comprehension | **2.2.1 Timing Adjustable** (A) |
| Content must remain operable during motion | **2.1.1 Keyboard** (A) |

## 5. Assistive technology

- **Animating an element does not announce it.** A toast that fades in is silent to a screen reader unless it is in a live region. The motion and the announcement are separate concerns; a spec that relies on motion alone to convey arrival is inaccessible.
- **Do not animate `aria-live` region content** while it is being announced — DOM churn during announcement causes repeated or truncated output.
- **Elements animating out must leave the accessibility tree** when they leave visually. An `opacity: 0` element is still focusable and still announced; use `visibility`, `display`, or unmount.
- **Motion must not be the only indicator of state.** Colour-alone is a known failure; motion-alone is the same failure with extra steps.

## 6. What this skill does not do

The full WCAG 2.2 audit — semantics, contrast, landmarks, forms, ARIA patterns — belongs to **`a11y-specialist-skills`** and to [`agents/accessibility-reviewer.md`](../../../agents/accessibility-reviewer.md), whose findings are blockers. This skill covers the motion-specific floor and hands everything else over.

Per `INTEGRATION_CONTRACT.md` §5, overlaps are reported **once**, under the Accessibility Reviewer's WCAG citation.

## 7. Non-negotiable checklist

Every one must be answerable before an effect ships:

- [ ] A reduced-motion strategy is stated, and it is engine-specific — not a global CSS override alone
- [ ] The end state is reachable with motion fully disabled
- [ ] The preference is re-checked at runtime, not only at first render
- [ ] Vestibular triggers are identified and suppressed under reduce
- [ ] Focus indicators are not animated
- [ ] Focus is not lost, hidden, or moved unpredictably by the effect
- [ ] Keyboard-initiated actions do not animate, or the exception is justified in the spec
- [ ] Nothing auto-plays beyond 5s without a pause control
- [ ] Motion is not the sole carrier of any information
- [ ] Elements animating out leave the accessibility tree

## Output contract

The reduced-motion strategy with its concrete implementation, the vestibular review, the keyboard and focus decision, and any WCAG criterion at risk — written into the spec's `reduced_motion` and `keyboard_and_focus` fields. During review: findings, with blockers separated from refinements, deferring WCAG citations to the Accessibility Reviewer.
