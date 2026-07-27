---
name: motion-audit
description: Reviews motion that already exists — specification against implementation against browser evidence. Produces findings split into blockers and refinements. Use when reviewing a change containing animation, or when auditing motion in an inherited codebase that has no specification.
---

# Motion Audit

The review procedure. The **role** that owns the ship/no-ship verdict is [`agents/motion-reviewer.md`](../../../agents/motion-reviewer.md); this skill is what that agent runs.

Audit in three layers, in order. Do not begin layer 2 before layer 1 is answered, because most motion defects are decision defects wearing an implementation costume.

## Layer 1 — Should this exist?

Before any code is read.

1. **Is there a spec?** If not, that is finding one. Reconstruct the intent from the implementation and say so — an audit of undocumented motion is weaker evidence and the report must admit it.
2. **Is the semantic purpose real?** Re-run the should-this-animate test from `motion-selection`. Motion whose purpose cannot be named is a removal candidate, not a tuning candidate.
3. **Frequency.** The more often it is triggered, the less it should move. Constant-frequency animation is a finding regardless of how well it is built.
4. **Is it load-bearing?** If the end state is unreachable without the animation playing, that is a blocker and a design defect, not an animation defect.

The most valuable finding this skill produces is often **"remove this"**. Do not soften it into "shorten this".

## Layer 2 — Is the engine right?

5. **Does the tier survive its gate?** Take the engine used and ask what the tier below could not have done. If `selection_rationale.escalation_reason` is missing, weak, or circular, the finding is over-escalation — the most common defect in inherited motion code, and the one that quietly costs the most bytes.
6. **Is a dependency paying for itself?** A library imported for one fade is a finding. Check `performance_budget.added_bytes_gz` against what it actually buys.
7. **Two engines on one element?** Motion and GSAP animating the same element is a defect, always. Check `selection_rationale.layer_ownership` and verify it is honoured in the code.
8. **Is a smooth-scroll library enabled?** If so, it needs written justification plus `SCR-4`, `SCR-5` and `A11Y-3` evidence. Absent that, blocker.
9. **Is every engine registered?** `AGENTS.md` rule 1 — an unregistered animation dependency is a governance finding regardless of its quality.

## Layer 3 — Is it built correctly?

10. **Accessibility floor** — run `motion-accessibility`'s non-negotiable checklist. Every failure is a blocker; none are overridable by brand (`AGENTS.md` rule 5).
11. **Hard failures** — the list in [`agents/motion-reviewer.md`](../../../agents/motion-reviewer.md) is authoritative and is not restated here. Missing reduced-motion handling, animation on keyboard-initiated actions, animating layout properties where transform would do, entrance from `scale(0)` or default `ease`/`ease-in`, `transition: all`, high-frequency interactions animated.
12. **Interruption** — does the implementation match the spec's `interruption.behavior`? Verified by `INT-1`/`INT-2`, not by reading.
13. **Cleanup** — every animation instance, ScrollTrigger, observer, listener and rAF loop created must be destroyed. Verified by `CLEAN-1`/`CLEAN-2` over repeated cycles; a single pass proves nothing.
14. **SSR and hydration** — server-rendered initial state, client boundary placement, no flash of the pre-animation state.
15. **Performance** — `motion-performance`. Compositor path, measured bundle delta, CLS, INP. Measured, not asserted.
16. **Responsive** — travel distances that make sense at 375px, not only at 1440px.

## Evidence rules

- **Code review alone is not an audit.** Findings about interruption, cleanup, frame rate, pinning, focus, and hydration cannot be made from source. They require `motion-verification` output.
- **Screenshots are not evidence** of motion. They are evidence of two static states.
- **A missing check is a finding**, distinct from a failing check. Say which.
- Read the project's `docs/DESIGN_INTELLIGENCE.md` exceptions section first. Per `INTEGRATION_CONTRACT.md` §10, a documented, still-valid exception **must not** be re-reported as a new finding.

## Boundaries

| Question | Belongs to |
|---|---|
| Does this easing curve suit the motion's character? Is 240ms right here? | **`emil-design-skills`** — the registered motion authority on character |
| Does this meet WCAG 2.2 AA? | **`a11y-specialist-skills`** and [`agents/accessibility-reviewer.md`](../../../agents/accessibility-reviewer.md) |
| Does this ship? | [`agents/motion-reviewer.md`](../../../agents/motion-reviewer.md) |
| Is the visual design generic? | [`agents/anti-slop-reviewer.md`](../../../agents/anti-slop-reviewer.md) |

Overlaps are consolidated and reported **once** (`INTEGRATION_CONTRACT.md` §5). Motion findings that are also WCAG failures are reported under the Accessibility Reviewer's citation, not duplicated here.

## Findings format

Matches the Motion Reviewer's output contract so findings pass through without translation.

**Blockers** — do not ship:

| Element | Before | After | Why |
|---|---|---|---|
| `PanelSheet` | no reduced-motion branch | `MotionConfig reducedMotion="user"` at the app root | `AGENTS.md` rule 5; `RM-1` failed under emulated reduce |

**Refinements** — should fix:

| Element | Before | After | Why |
|---|---|---|---|
| `FilterChip` | GSAP timeline, 3 sequential tweens, no dependent offsets | CSS transition, 160ms | Over-escalation: no gate passed. Removes ~60 KB from a conversion path |

Every **After** is a concrete value — a duration, a curve, a property, a specific API. Never "smooth this out".

## Missed opportunities

Maximum three. The audit is for *feel*, not only restraint — a state change that snaps confusingly is as much a defect as an animation that overstays. Each must name the semantic purpose the motion would serve; "this could use some animation" is not a finding.

## Output contract

Layer 1 verdict (should it exist) · Layer 2 verdict (is the engine right, with the gate quoted or its absence noted) · Blockers table · Refinements table · up to three missed opportunities · the verification evidence relied on, and anything that could not be verified. Close with one sentence on overall motion character against the brief.
