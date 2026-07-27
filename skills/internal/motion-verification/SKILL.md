---
name: motion-verification
description: Proves motion works in a real browser rather than approving it from code or screenshots. Defines the verification workflow, the applicability rules that select which checks a given effect must pass, concrete acceptance criteria, and the failure-report format. Use before any motion change is called done.
---

# Motion Verification

**Motion is not reviewable from code, and not from screenshots.** A screenshot cannot show a dropped frame, a stuck pinned section, a leaked animation instance, a lost focus ring, or a hydration flash. This repository's reviewer agents already run against live UI (adapted from `oneredoak-design-review`); motion inherits that standard and tightens it.

Output of this skill is evidence. "It looks right" is not evidence.

## Tooling, in order of preference

1. **Playwright MCP** — an agent drives a live browser directly. Preferred: it can observe, retry, and reason about what it sees. This is an existing MCP; no new server is needed or permitted (see [`docs/MOTION_MCP_DECISION.md`](../../../docs/MOTION_MCP_DECISION.md)).
2. **Playwright script** — run in the consumer project. Start from [`assets/verify-motion.template.ts`](assets/verify-motion.template.ts). The template lives here; the executable spec lives in the consumer repo, per `INTEGRATION_CONTRACT.md` §1.
3. **Manual browser walk** — the fallback. **Explicitly weaker evidence.** If used, say so in the report and name what could not be checked.

Never report unverified motion as verified. If nothing is available, the honest output is "not verified — here is what would need to run".

## Applicability — which checks are required

Run every check whose condition matches. The spec's `verification.required_checks` must list them all; an audit compares the two.

| Condition | Required check ids |
|---|---|
| **Always** | `RM-1` `RM-2` `A11Y-1` `A11Y-2` `PERF-1` `CON-1` `VP-1` `VP-2` `VP-3` `OVF-1` `CLS-1` |
| Trigger is `page-load` | `LOAD-1` `LOAD-2` |
| Trigger is `route-change`, or the app is an SPA | `NAV-1` `NAV-2` `CLEAN-1` `CLEAN-2` |
| Trigger is `hover` | `HOV-1` `HOV-2` |
| Trigger is `click-or-tap` or `state-change` | `INT-1` `INT-2` |
| Trigger is `scroll` | `SCR-1` `SCR-2` `SCR-3` |
| Trigger is `drag` | `DRAG-1` `DRAG-2` |
| Engine is `gsap` **and** ScrollTrigger pin/scrub is used | `SCR-3` `CLEAN-2` (mandatory, not optional) |
| Engine is `motion-react` | `CLEAN-1` `SSR-1` |
| Server-rendered (`ssr.renders_on_server: true`) | `SSR-1` `SSR-2` |
| Engine is `view-transitions` or `css-scroll-driven` | `FALL-1` |
| Any smooth-scroll library is enabled | `SCR-4` `SCR-5` `A11Y-3` |

Full definitions, acceptance criteria and reproduction steps: [`references/verification-checklist.md`](references/verification-checklist.md).

## The workflow

### 1. Set up

Start the app at a real URL. Confirm the build under test is the one that contains the change. Open a console listener before the first navigation — errors thrown during initial load are the ones most often missed.

### 2. Baseline pass — default preferences, desktop viewport

Walk the effect's trigger. Capture a performance trace across the effect window. Record console output.

### 3. Reduced-motion pass

```js
await context.emulateMedia({ reducedMotion: 'reduce' });
```

Re-run the same walk. **This pass has two acceptance criteria, and the second is the one people forget:**
- movement is gone or reduced per the spec's strategy, **and**
- **the end state is still reached.** A reduced-motion user who cannot open the panel has been given an accessibility failure dressed as an accommodation.

### 4. Viewport pass

375×812, 768×1024, 1440×900 minimum. At each: no horizontal overflow, no clipped or overlapping fixed elements, and travel distances that still make sense — a slide that reads well at 1440px often overshoots at 375px.

### 5. Interaction-stress pass

Trigger rapidly and repeatedly (ten times in quick succession). Interrupt mid-flight. Reverse mid-flight. Compare against the spec's `interruption.behavior`. This is where most motion bugs live.

### 6. Lifecycle pass

Navigate away and back, five times. Unmount and remount the component. Then check for accumulation: growing animation counts, orphaned ScrollTriggers, listeners that were never removed. A single pass proves nothing here; repetition is the test.

### 7. Report

Use the format below. Include what passed — absence of findings must be distinguishable from absence of review.

## Acceptance criteria

A motion change ships only when **all** of these hold:

1. Every applicable check passes, or fails with a recorded justification accepted by the owner.
2. Reduced motion: movement removed per strategy **and** end state reached.
3. Zero new console errors and zero new hydration warnings across all passes.
4. No horizontal overflow at 320px, 375px, 768px, or 1440px.
5. No new layout shift attributable to the effect.
6. Focus is never lost, hidden, or moved unpredictably; focus indicators are never animated.
7. Rapid repeated triggering produces the spec's `interruption.behavior` — never a stuck, doubled, or visually corrupted state.
8. After five navigate-away-and-back cycles, no animation instances, ScrollTriggers, or listeners have accumulated.
9. No pinned section is left stuck, mispositioned, or overlapping after resize or navigation.
10. Frame rate holds the surface's floor under 4× CPU throttling.

## Failure reporting

One row per finding. Every finding must be reproducible by someone who did not run the test.

| Field | Content |
|---|---|
| **Check id** | e.g. `SCR-3` |
| **Severity** | **Blocker** — accessibility floor, stuck state, console error, overflow, focus loss, lost end state · **Major** — spec violation without user-facing breakage · **Minor** — polish |
| **Observed** | What actually happened, concretely |
| **Expected** | What the spec said |
| **Reproduce** | Viewport, preference state, exact interaction sequence, iteration count |
| **Evidence** | Trace path, video, screenshot, or console output |

Report what passed alongside what failed, and name the viewports and preference states actually exercised. A report that lists only failures cannot be distinguished from a report where little was tested.

## Environment limits

If Playwright is unavailable in the consumer project, say so at the top of the report and run the manual walk. If a check cannot be performed at all — no real device for thermal behaviour, for instance — record it as **not verified** rather than passing it by inference. The gap is stated in the report, never hidden.

## What this skill does not do

It does not judge whether the motion is *good* — that is `motion-audit` plus `emil-design-skills`. It does not run the WCAG audit — that is `a11y-specialist-skills` and [`agents/accessibility-reviewer.md`](../../../agents/accessibility-reviewer.md). It supplies evidence; others render verdicts.

## Output contract

A verification report: tooling used · passes executed · every applicable check with pass/fail · findings table · viewports and preference states exercised · what could not be verified and why.
