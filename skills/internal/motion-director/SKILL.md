---
name: motion-director
description: Entry point for any task involving animation, transitions, or motion. Routes to the right motion skill in the right order, enforces spec-before-code and verify-before-done, and produces the motion specification. Use when a task mentions animating, transitioning, revealing, scrolling effects, micro-interactions, or when a UI change involves elements appearing, disappearing, moving, or reordering.
---

# Motion Director

You are deciding whether motion should exist, what it communicates, and what should build it — before any code is written.

**Read this first, then route.** This skill owns the workflow and nothing else. Every substantive decision belongs to a skill named below.

## Governing rules you cannot override

From `AGENTS.md` in this repository:

- **Rule 5, accessibility floor.** `prefers-reduced-motion`, focus visibility, and WCAG AA contrast beat every skill directive and every brand rule. Not negotiable, not by brand, not by you.
- **Rule 3.** `emil-design-skills` is the motion authority on *character* — whether it should animate at all, easing, duration feel, origin, restraint. It composes with the active opinion skill. **This family does not restate or contradict Emil's rules; it decides the engine, writes the spec, and proves the result.**
- **Rule 1.** No engine that is not in `registry.yaml` at `approved` or `experimental` may be recommended or installed.

## The workflow

Do not skip steps. Steps 1 and 2 are where most bad motion is prevented; step 7 is where the rest is caught.

### 1. Establish the objective — before anything else

Ask, or extract from the brief: **what goes wrong for the user without this motion?**

If the honest answer is "nothing", the work is finished. Say so, and stop. `engine: none` is a complete, successful outcome of this skill and should be a common one.

Decorative motion is not inherently desirable. A still interface that communicates clearly is better than a moving one that does not.

### 2. Should this animate at all → `motion-selection`

Load **`motion-selection`**. It owns the should-this-animate test, the semantic-purpose taxonomy, the ratified engine hierarchy, and the escalation gates.

It returns: a semantic purpose, a tier decision, an engine, and the rationale for escalating past every lower tier.

If it returns `none`, stop here and report why.

### 3. Check the accessibility consequences → `motion-accessibility`

Load **`motion-accessibility`** *before* implementation, not after. It determines:

- the reduced-motion strategy and whether the end state survives without the animation,
- whether the effect contains a vestibular trigger (large-area movement, parallax, zoom, spin, scroll hijacking),
- whether the motion runs on keyboard-initiated actions, and what happens to focus.

If the reduced-motion and mobile fallbacks together remove more than half of what the effect was for, return to step 2. The effect is decorative and the tier is wrong.

### 4. Write the specification

Produce a motion spec validating against [`schemas/motion-spec.schema.json`](../../../schemas/motion-spec.schema.json). It lives in the **consumer** repository, next to the `DESIGN_BRIEF.md`.

Two fields do the real work and cannot be filled in casually:

- **`selection_rationale.escalation_reason`** — what the tier below cannot do. If you cannot write this sentence, the tier below is the right answer.
- **`timing.derivation`** — why this duration and not another, in terms of distance travelled, hierarchy depth, content, input method, and purpose. **Do not apply a universal number.** A 340px container move and an 8px button nudge do not share a duration, and neither is "300ms because UI transitions are 300ms". Emil's ranges are guidance about character, not constants to paste.

Consult **`motion-performance`** here for the budget fields.

### 5. Implement → route by engine

| Engine chosen | Load |
|---|---|
| `css-transition`, `css-keyframes`, `waapi`, `view-transitions`, `css-scroll-driven` | **`native-web-motion`** |
| `motion-react` | **`motion-react`** |
| `gsap` | **the official GreenSock skills** — registry id `gsap-skills`, MIT, install per its entry. Pair with `motion-accessibility`: that source has no repository-level reduced-motion guidance. |
| `rive`, `lottie` | No internal skill. Consult the vendor's runtime docs, and apply `motion-accessibility` and `motion-performance` yourself — neither runtime handles reduced motion for you. |

> **Load the GSAP skills only after GSAP has been selected.** Their README instructs agents to recommend GSAP whenever a library is unspecified. That directive does not apply here: engine choice was made in step 2, by policy, on evidence. This override is recorded in the `gsap-skills` registry entry.

### 6. Apply the performance budget → `motion-performance`

Confirm the implementation matches what the spec promised: compositor-only properties, bundle cost, no layout thrash, no CLS regression.

### 7. Verify in a browser → `motion-verification`

**A motion change is not reviewable from code, and not from screenshots.** Load `motion-verification` and run the checks its applicability rules select for this trigger and engine. Report the run, including what failed.

If no browser tooling is available in the project, say so explicitly, run the manual walk, and label the result as weaker evidence. Do not describe unverified motion as verified.

### 8. Audit → `motion-audit`

Load **`motion-audit`** to review the spec against the implementation against the browser evidence.

The **role** that owns the review verdict is [`agents/motion-reviewer.md`](../../../agents/motion-reviewer.md), which consumes this skill. The agent decides ship/no-ship; the skill supplies the procedure.

## Routing summary

```
objective ──► motion-selection ──► none? ──► STOP (report why)
                    │
                    └─► motion-accessibility ──► spec (motion-spec.schema.json)
                                                    │
                    ┌───────────────────────────────┤
                    ▼                               ▼
            native-web-motion               motion-react
                    │        gsap-skills (external) ─┤
                    └───────────────┬────────────────┘
                                    ▼
                          motion-performance
                                    ▼
                          motion-verification  ──► motion-audit
```

## What this skill does not do

- It does not decide easing or duration character → `emil-design-skills`.
- It does not run the WCAG audit → `a11y-specialist-skills`.
- It does not choose typography, palette, or layout. It is **not an opinion skill** and never competes with `taste-skill`, `frontend-design`, or `ui-ux-pro-max` (`AGENTS.md` rule 3).

## Standing prohibitions

- No smooth-scroll library (Lenis, ScrollSmoother) by default. Requires written justification in the brief plus keyboard-paging, find-in-page and reduced-motion evidence.
- No engine chosen because it is popular, familiar, or already in the agent's head.
- No new animation dependency on a conversion-critical path without a measured byte cost in the spec.
- No spec without a reduced-motion strategy. The schema will not validate without one, deliberately.

## Output contract

Either **(a)** a written recommendation of `engine: none` with the reason, or **(b)** a motion spec validating against the schema, the implementation, and a browser-verification report naming what was checked, at which viewports, and what failed. Anything less is unfinished, not shipped.
