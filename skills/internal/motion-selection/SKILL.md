---
name: motion-selection
description: Decides whether motion is appropriate, what it communicates, and the lowest-complexity engine that can deliver it. Owns the ratified engine hierarchy (none, CSS, native browser APIs, Motion, GSAP, specialist runtimes) and the escalation gates between tiers. Use before writing any animation code or adding any animation dependency.
---

# Motion Selection

Two decisions, in this order: **should this move at all**, and **what is the least machinery that can move it**.

## Part 1 — Should this animate at all?

Motion carries the burden of proof. Stillness never has to justify itself.

Run all four. A single failure returns `engine: none`.

1. **What breaks without it?** If the interface still communicates correctly when the change is instant, the motion is decorative. Decorative is not automatically forbidden — but it must be declared as `semantic_purpose: decorative` in the spec and justified, and on a conversion or dashboard surface it is almost always the wrong answer.

2. **Frequency test.** How often does one user trigger this?

   | Frequency | Verdict |
   |---|---|
   | Constant (typing, hovering rows, tab switches) | **None.** Motion here becomes latency. |
   | Frequent (opening a menu many times a session) | Very short tier 1, or none. |
   | Occasional (opening a detail panel) | Motion is defensible. |
   | Rare / once-per-session (first load, checkout success) | Motion has the most room here. |

   This is Emil's rule, registered as `emil-design-skills`: the more often it is triggered, the less it should move.

3. **Does it survive reduced motion and mobile?** Work out the reduced-motion fallback and the 375px behaviour *now*. If together they remove more than half of what the effect was for, the effect was decoration wearing a purpose. Return `none`.

4. **Is it load-bearing?** If the user cannot reach the end state without the animation playing, the design is broken — for reduced-motion users, for slow devices, and for anyone who interrupts it. Fix the design, do not add the animation.

## Part 2 — Semantic purpose

Name what the motion communicates. This drives the tier, the duration derivation, and what the audit will check. Full definitions in [`references/motion-taxonomy.md`](references/motion-taxonomy.md).

| Purpose | Communicates | Typical tier |
|---|---|---|
| `orient` | Where you are, where you came from | 1–2 |
| `reveal-relationship` | This came from that; these belong together | 2–3 |
| `confirm-action` | The system received your input | 1 |
| `explain-state-change` | What just changed, and how | 1–3 |
| `direct-attention` | Look here, now | 1 |
| `express-brand` | Who this product is | 4–5 |
| `decorative` | Nothing | 0 — reconsider |

A purpose you cannot name is a purpose the motion does not have.

## Part 3 — The ratified hierarchy

Start at 0. Move up **only** through a gate you can write down.

| Tier | Engine | Selected when |
|---|---|---|
| **0** | **No animation** | Default. |
| **1** | CSS transition / keyframes | Discrete state change, hover, focus, micro-feedback, entrance/exit expressible as start → end. |
| **2** | WAAPI · View Transitions · scroll-driven CSS | See tier-2 selection below. |
| **3** | **Motion** (`motion/react`) | React's lifecycle owns the problem. |
| **4** | **GSAP** | Timeline choreography over a scene. |
| **5** | Rive · Lottie | A designer authored the artifact in a tool. |

### Choosing inside tier 2

- **WAAPI** — values unknown at author time, or the animation must be interrupted and re-targeted with correct velocity. Baseline widely available.
- **View Transitions** — morphing between two DOM states or route changes. Same-document is Baseline (newly, 2025-10-14). **Cross-document is not Baseline — no Firefox.** Either is progressive enhancement only: the non-supporting path must still change state correctly.
- **CSS scroll-driven** — scroll progress indicators, reveal-on-enter. **Baseline limited: Chrome 115, Safari 26, no Firefox as of 2026-07-26.**

  > **Conditional-use rule.** Scroll-driven CSS may not be the *sole* implementation of a scroll effect when Firefox is in scope. Either the spec explicitly accepts the degraded static state, or the work escalates to GSAP ScrollTrigger. Re-check support before relying on this rule; it is expected to relax.

### The escalation gates

Write the gate you passed into `selection_rationale.escalation_reason`. If you cannot, you have not passed it.

**Tier 1 → 2**
- The animation must be interruptible mid-flight with correct velocity, or
- the values are computed at runtime, or
- two DOM states must morph into each other, or
- the effect is driven by scroll position rather than time.

**Tier 2 → 3 (Motion)**
- An element must animate **as it unmounts** — React removes it from the DOM before CSS can run (`AnimatePresence`), or
- a shared element must morph across two components or routes (`layoutId`), or
- layout changes must animate automatically without hand-authoring from/to values (`layout`), or
- a gesture must drive a spring continuously (drag, pan, pull-to-refresh).

Not a gate: "the project already uses React". React alone does not require Motion — a CSS transition inside a React component is still a CSS transition, and is still the better answer.

**Tier 3 → 4 (GSAP)**
- Three or more elements with **dependent** timing offsets that must survive edits to any one of them (a timeline, not a pile of delays), or
- scroll **scrubbing** or **pinning**, or
- SVG path drawing or shape morphing, or
- FLIP across unrelated DOM that View Transitions and `layoutId` cannot express, or
- the animation drives values into canvas or WebGL, or
- complex drag with inertia, bounds, and snapping.

Not a gate: "the timeline is easier to read". Sequential CSS delays are ugly, not disqualifying. The gate is *dependency* — if changing step 2's duration should automatically move steps 3 and 4, that is a timeline.

**Tier 4 → 5 (specialist)**
- The artifact is designer-authored in Rive or After Effects and code cannot reasonably reproduce it. Rive adds a proprietary editor to the pipeline; Lottie is for rendering an **existing** asset, never for authoring new UI motion.

### The downgrade gate — run it last

After choosing, look back down. If the reduced-motion path and the mobile path both reduce the effect to something the tier below could have produced, **use the tier below**. The complexity was paid for a case that mostly does not run.

## Part 4 — Motion and GSAP are complementary

They are not two answers to one question.

|  | Motion | GSAP |
|---|---|---|
| Owns | Component-state motion **inside React's lifecycle** | **Timeline choreography over a scene** |
| Strong at | Unmount, layout/shared-element morphs, gesture springs | Dependent offsets, scrub/pin, SVG, canvas, drag |
| Weak at | Multi-element dependent sequencing; non-React | Reacting to React mount/unmount |
| Licence | MIT | **Proprietary, free of charge (Webflow)** |

Both may live in one project when each owns a different layer — state this in `selection_rationale.layer_ownership`. **Both animating the same element is a defect** and is a `motion-audit` finding.

## Part 5 — Standing prohibitions

- **No smooth-scroll library by default** (Lenis, ScrollSmoother). Replacing native scroll degrades find-in-page, keyboard paging, scroll anchoring and AT behaviour, and is a vestibular trigger. Requires written justification plus verification evidence for keyboard paging, find-in-page, and reduced motion.
- **No engine on popularity.** Star counts are not evidence of fit.
- **No engine because it is familiar.** The registry, not recall, decides what is available.
- **No unregistered engine.** `AGENTS.md` rule 1.
- **No new dependency on a conversion-critical path** without `performance_budget.added_bytes_gz` in the spec.

## What this skill does not do

Easing curves, duration character, transform-origin, restraint → **`emil-design-skills`**. This skill hands over a tier and an engine; Emil governs how the result feels. Where both speak, Emil wins on character and this skill wins on engine.

## Output contract

Semantic purpose · tier and engine · the gate passed at every escalation · every lower tier rejected with a reason · the downgrade check result. Feed straight into `selection_rationale` in the motion spec.
