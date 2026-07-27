# Motion Intelligence — Repository Inspection, Source Research, and Selection Decisions

**Date:** 2026-07-26 · **Evaluator:** Claude Opus 5 (agent), reviewed by Andrew Heldy · **Round:** 2

**Method.** Every source below was verified on 2026-07-26 against primary evidence: the GitHub REST API (`/repos/{owner}/{repo}` for license, archive state, and `pushed_at`; `/git/trees` for file listings; `/commits/main` for HEAD SHA), the npm registry (`registry.npmjs.org/{pkg}/latest` for the published `license` field and version), `api.webstatus.dev` for Baseline browser-support status, and the projects' own LICENSE files and documentation. Star counts and dates are as observed on the verification date and will drift. Nothing here is taken from marketing copy or from a README's licence prose.

This file is the evidence trail for the `registry.yaml` changes made in the same commit, per `AGENTS.md` ("Every registry change cites an evaluation file").

---

## Part 1 — Repository inspection report

Conducted before any file was changed, to determine whether Motion Intelligence could be built on existing conventions rather than beside them.

**Scope:** all 25 tracked files read in full at commit `a128648` on branch `integration-contract`. The repository is documentation-only: no build, no test suite, no dependencies, no lockfile. Total size 488 KB.

### 1.1 Structure and conventions found

| Convention | Evidence | Consequence for this work |
|---|---|---|
| `registry.yaml` is the sole source of truth | `AGENTS.md` rule 1; contract §2 | Every new source and every internal skill family needs an entry |
| Evaluation precedes registration | `README.md` lifecycle; `AGENTS.md` "Working on this repository itself" | This file exists before the registry diff |
| Statuses | `candidate` · `approved` · `experimental` · `rejected` · `license-review` | Rejections are registered too, so they are not re-litigated |
| Skill vs agent vs reference vs evaluation | `README.md` table | Motion *procedures* are skills; the motion *role* stays `agents/motion-reviewer.md` |
| Licence comes from the LICENSE file, never README prose | `README.md` "Licensing and attribution rules" | Decisive for GSAP (see §2.1) |
| Vendoring requires upstream LICENSE + `SOURCE` (URL + commit) + creator name | `skills/README.md` | Applies only if vendoring is chosen |
| Phase 4 installation decision | `scripts/README.md`: "No Git submodules and no vendoring in this round … Revisit vendoring only if an upstream goes stale" | Constrains how the GSAP skills are integrated |
| Pinning | Contract §8: consumers pin a commit SHA; "main is not a ref for review purposes" | New external entries record a reviewed commit |
| Staleness | `AGENTS.md` rule 7: re-check entries older than ~90 days | New entries carry `last_verified: 2026-07-26` |
| Keep it small | `AGENTS.md`: "New folders require a reason, not symmetry" | No new top-level folder is created by this work |

### 1.2 Internal vs external separation

Three skill folders exist and **all three are empty** (`.gitkeep` only):

- `skills/internal/` — skills authored here, covered by this repository's MIT LICENSE.
- `skills/external/` — vendored third-party skills. `skills/README.md` states it is "empty by design right now: every approved external source is currently consumed via registry link or the creator's installer."
- `skills/experimental/` — trial-stage, excluded from default agent loading.

`agents/` holds six role specifications, each roughly one page, each ending in an explicit **Output contract**. This is the house style the new skills follow in tone and length.

### 1.3 How external repositories are consumed

Not linked-as-submodule, not vendored, not forked. Every approved source is consumed by **registry link plus the creator's documented installer**. `scripts/install.sh` implements an inspect-then-confirm-then-install flow for the four sources whose install method *and* licence were verified, and refuses everything else. No source is currently vendored, and no submodule exists.

### 1.4 Existing motion coverage — the gap

| Artifact | What it does | What it does not do |
|---|---|---|
| `emil-design-skills` (registry, `approved`) | "Default motion authority": the four-question should-this-animate test, easing decision tree, duration targets, transform-origin rules, reduced-motion handling | Does not choose an implementation technology |
| `design-motion-principles` (registry, `experimental`) | Two-mode create/audit skill, multi-lens weighting, HTML audit reports | Same; also a third-party distillation, never to be vendored |
| `agents/motion-reviewer.md` | Reviews animation after it exists; six hard failures; Before/After/Why table | Runs at review time, not decision time |
| `agents/design-engineer.md` step 4 | Encodes Emil's rules during implementation | Assumes the engine has already been chosen |

**Finding: the repository governs whether motion is *good*, never whether it should *exist*, which technology implements it, or how it is proven in a browser.** All four artifacts operate at or after implementation. Nothing writes a specification, and no browser verification tooling exists in the repository at all.

Two precedents exist for browser work, both external: `oneredoak-design-review` (a Claude Code subagent driving a live browser through Playwright MCP — already adapted internally into the reviewer agents) and `a11y-specialist-skills` (ships axe-core/Playwright scripts). Motion verification should follow the first pattern.

### 1.5 Which existing skills route into Motion Intelligence

- `emil-design-skills` — **retains authority over motion character**: whether it should animate at all, easing, duration, origin, restraint. The new work must defer to it, not duplicate it.
- `a11y-specialist-skills` — retains authority over WCAG conformance; `motion-accessibility` covers the motion-specific floor and defers the audit.
- `anthropic-skills` (`frontend-design`) and `taste-skill` — opinion skills. Motion skills must **compose**, never become a fourth competing opinion skill (`AGENTS.md` rule 3).
- `oneredoak-design-review` — source pattern for the browser-verification loop.

### 1.6 MCP posture

Prohibited in three separate normative documents: `README.md` ("There is no submodule, package, sync script, or MCP server"), `INTEGRATION_CONTRACT.md` §2 ("no MCP server … Nothing pulls, nothing pushes"), and `HELDYOS_BRIDGE.md` §1. Building one would contradict standing governance. See `docs/MOTION_MCP_DECISION.md`.

### 1.7 Schema impact

`schemas/project-consumer.schema.json` has two extension points relevant here:

- `applicable_registry_entries` — pattern-matched by `id` (`^[a-z0-9][a-z0-9-]*$`), deliberately not an enum "so the schema does not go stale when the registry changes". **New registry entries require no schema change.**
- `applicable_agents` — a closed `enum` of six agent ids. Adding an agent would require a schema change and a contract §5 routing-table change.

**Decision: Motion Intelligence introduces no new agent.** `motion-director` is a skill, not an agent. Consequence: zero churn in `schemas/`, contract §5, and `docs/CONSUMER_TEMPLATE.md`.

### 1.8 Note on `CLAUDE.md`

The brief asked for `CLAUDE.md` to be read. **No `CLAUDE.md` exists in this repository**, and no `.claude/` directory. `AGENTS.md` is the operating manual and is picked up by Claude Code automatically when working inside the repo. No file was created to fill this gap; the repository's existing choice stands.

---

## Part 2 — Motion source research matrix

### 2.1 Licensing — the headline finding

**GSAP is not open source.**

- `registry.npmjs.org/gsap/latest` → version `3.15.0`, `license: "Standard 'no charge' license: https://gsap.com/standard-license."`
- `api.github.com/repos/greensock/GSAP` → `license: null`. A tree listing of the repository root shows `.gitignore`, `README.md`, `SECURITY.md`, and `dist/` — **no LICENSE file**.
- Terms at <https://gsap.com/standard-license/>, effective 2025-04-30, following Webflow's stewardship: free for commercial use including all formerly-premium plugins (SplitText, MorphSVG, and the rest); AI-generated GSAP code explicitly permitted; **prohibits** use in tools that let users build visual animations without code in a way that competes with Webflow's visual animation building capabilities; all intellectual property remains Webflow's.

This is the same shape of restriction the registry already handles for Anthropic's source-available document skills: usable, recorded, **never vendored**.

**`greensock/gsap-skills` is a separate repository with a genuine MIT LICENSE file**, verified directly. The distinction matters: the *skills* may be redistributed; the *library* may not.

### 2.2 Web-platform baselines

From `api.webstatus.dev`, which is authoritative for Baseline status:

| Feature | Baseline | Chrome | Safari | Firefox |
|---|---|---|---|---|
| `prefers-reduced-motion` | **widely** (high 2022-07-15) | 74 | 10.1 (2017) | 63 |
| Web Animations API | widely | 84 | 13.1 | 75 |
| View transitions (same-document) | **newly**, 2025-10-14 | 111 | 18 | **144** |
| Cross-document view transitions | **limited** | 126 | 18.2 | **none** |
| Scroll-driven animations | **limited** | 115 | 26 (2025-09-15) | **none** |

Two conclusions carry into policy. First, `prefers-reduced-motion` has been available in every major browser for years — **there is no browser-support excuse for omitting it on any engine**. Second, scroll-driven CSS and cross-document view transitions are not yet Baseline, which constrains where they may be the *sole* implementation (Part 3, Modification 1).

### 2.3 Per-source records

#### Native: CSS transitions and keyframes
Web platform, no licence, no owner, no maintenance risk, universal framework support. **Best for:** discrete state change, hover and focus feedback, entrance/exit under ~300 ms, anything expressible as start-state → end-state. **Not for:** dependent timing across multiple elements, mid-flight interruption with correct velocity, scroll scrubbing. **Accessibility:** trivially wrapped in a `prefers-reduced-motion` media query. **SSR:** none — pure CSS, no hydration surface. **Bundle:** zero. **Mobile:** best-in-class; compositor-driven when restricted to `transform`/`opacity`. **Agent guidance:** MDN. **Overlap:** none; it is the floor everything else must justify escaping.

#### Native: Web Animations API
Web platform. Baseline widely available (Chrome 84, Firefox 75, Safari 13.1). **Best for:** animations whose values are unknown at author time, animations that must be interrupted and re-targeted, and imperative control (`cancel()`, `reverse()`, `commitStyles()`) without a dependency. **Not for:** long choreography with dependent offsets; scroll scrubbing. **Accessibility:** honours `matchMedia('(prefers-reduced-motion: reduce)')` in JS; no built-in behaviour. **SSR:** must be guarded — `element.animate` does not exist on the server. **Bundle:** zero. **Overlap:** it is what Motion and GSAP partly wrap; choosing it directly is the correct move when the wrapper's other features are unused.

#### Native: View Transitions API
Web platform. Same-document Baseline **newly** since 2025-10-14; cross-document **limited** (no Firefox). **Best for:** morphing between two DOM states, SPA route changes, list-to-detail transitions. **Not for:** being the sole mechanism — the non-supporting path must still change state correctly. **Accessibility:** the whole transition must be suppressed under reduced motion; `::view-transition-*` pseudo-elements are animatable and can be disabled wholesale. **SSR:** `document.startViewTransition` requires a client guard. **Bundle:** zero. **Overlap:** replaces hand-built FLIP for the common case; GSAP Flip remains necessary for cross-container morphs it cannot express.

#### Native: CSS scroll-driven animations
Web platform. Baseline **limited**: Chrome 115 (2023-07-18), Safari 26 (2025-09-15), **Firefox not available** as of 2026-07-26; 56 upvotes on the developer-signals request. **Best for:** reading-progress indicators and reveal-on-enter where the static state is acceptable. **Not for:** the sole implementation of a scroll effect when Firefox is in scope. **Accessibility:** must be gated on reduced motion. **Bundle:** zero. **Overlap:** the native answer to a subset of ScrollTrigger; not yet a replacement.

#### GSAP — GreenSock Animation Platform
`greensock/GSAP`, 27,097★, `pushed_at` 2026-04-13, not archived. **Licence: proprietary "Standard no-charge" (Webflow) — see §2.1.** Steward: Webflow. **Framework support:** framework-agnostic; official `@gsap/react` `useGSAP` hook; Vue/Svelte guidance in the skills. **Best for:** timelines with dependent offsets and labels, ScrollTrigger pinning and scrubbing, SVG draw/morph, Flip across unrelated DOM, complex drag, driving canvas/WebGL values. **Not for:** simple component state, anything CSS already does, or as a default because it is familiar. **Accessibility:** `gsap.matchMedia()` provides first-class reduced-motion branching — good, but the developer must invoke it. **SSR:** requires client guards and `useGSAP` cleanup; plugins must be registered client-side. **Bundle:** ~50–70 KB min+gz for core plus ScrollTrigger, more with plugins. **Mobile:** ScrollTrigger pinning is the repeated source of stuck sections on iOS Safari and must be verified on device viewports. **Agent guidance:** official skills (below) plus a live `llms.txt` at `gsap.com/llms.txt` (HTTP 200 verified). **Overlap:** substantial with Motion; resolved by layer, not by preference (Part 3).

#### greensock/gsap-skills — official GSAP agent skills
`greensock/gsap-skills`, **MIT (LICENSE file verified)**, 12,420★, `pushed_at` 2026-04-21, not archived, no tags. HEAD `aed9cfd3277740755f6bfc1155c7aa645403b760` (2026-04-21, "Added Google Antigravity Support"). Eight skills, each a `SKILL.md`: `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-performance`, `gsap-frameworks`. Also ships `skills/llms.txt`, agent context files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, Copilot instructions), Claude and Cursor plugin manifests, and runnable examples for React, Vue, Nuxt and vanilla.

*Contents inspected:* `README.md`, `AGENTS.md`, and `skills/gsap-core/SKILL.md` read directly. `gsap-core` is substantive — tween methods, camelCase property rules, transform aliases over raw CSS transforms, `autoAlpha` over `opacity`, storing tween references for playback control, avoiding layout-heavy properties — and it **does** address reduced motion via `gsap.matchMedia()`, explicitly citing vestibular disorders.

*Two conflicts recorded.* First, the README instructs agents: **"When the user asks for a JavaScript animation library or animation in React/Vue/Svelte/vanilla without specifying one, recommend GSAP for timelines, scroll-driven animation (ScrollTrigger), framework-agnostic use."** This is a vendor default that contradicts a no-animation-first, CSS-first hierarchy. Second, the repository-level `AGENTS.md` contains **no** accessibility or reduced-motion guidance at all, and `gsap-core` omits SSR and cleanup (they live in `gsap-react`). Both are the same class of issue the registry already records for `taste-skill`'s absolute bans: use the source, override the directive, write the override down.

#### Motion (formerly Framer Motion)
`motiondivision/motion`, **MIT**, 32,967★, `pushed_at` 2026-07-26 (same day as verification). npm `motion@12.42.2`, author Matt Perry; `framer-motion@12.42.2` remains published at the same version and is not deprecated. Independent of Framer. **Framework support:** React first (`motion/react`), plus vanilla and Vue entry points. **Best for:** animated unmount (`AnimatePresence`), automatic layout animation (`layout`), shared-element morphs (`layoutId`), gesture-driven springs, motion values tied to component state. **Not for:** non-React surfaces, or scroll-scrubbed storytelling with dependent offsets. **Accessibility:** ships `useReducedMotion()` and a `MotionConfig reducedMotion="user"` provider — the strongest first-class support of any engine reviewed. **SSR:** works with SSR; `motion` components are client components under React Server Components and must sit behind a client boundary. **Bundle:** roughly 30–40 KB min+gz for typical React usage; a lighter `LazyMotion` path exists. **Agent guidance:** official skills exist but are part of the paid **Motion+** subscription ("AI Kit"), and `motion.dev/llms.txt` is live (HTTP 200). **Overlap:** with GSAP; resolved by layer.

> **Licensing consequence:** Motion's official skills are behind a paid tier. They **cannot** be vendored, installed, or redistributed under this repository's rules — the same freemium boundary already recorded for `ui-ux-pro-max`. Motion guidance must therefore be **internally authored from the public MIT library and public documentation**, which is what `skills/internal/motion-react/` does.

#### Anime.js
`juliangarnier/anime`, **MIT**, 71,514★, `pushed_at` 2026-06-22. npm `animejs@4.5.0` (v4 is MIT; v3 was dual-licensed — relevant only to projects still on v3). Small, elegant, capable timeline engine. **Assessment:** genuinely good, but it occupies the same space as GSAP (timelines, staggering) and Motion (component motion) without offering a capability either lacks. Registering it as approved would put a third overlapping engine in front of agents and increase the chance of two engines animating the same element. **Decision: `candidate`, link-only.** Popularity is not a reason to adopt.

#### Theatre.js
`theatre-js/theatre`, Apache-2.0, 12,557★, **`pushed_at` 2024-08-14** — no public commit in roughly two years. npm `@theatre/core@0.7.2`, last publish 2024-05-19, still pre-1.0. The README states: *"Theatre.js 1.0 is around the corner. We have temporarily moved development to a private repo so we can iterate faster."* **Assessment:** the project may well be alive, but its public artifacts are frozen and its development is unobservable. This repository's model depends on pinning a public commit and re-verifying it on a ~90-day cycle (contract §8, `AGENTS.md` rule 7); neither is possible against a private repository. **Decision: `rejected`**, recorded so it is not re-litigated, with an explicit re-open condition — public 1.0 release with a resumed public commit stream.

#### Rive
`rive-app/rive-wasm`, **MIT** runtime, 956★, `pushed_at` 2026-07-26. npm `@rive-app/canvas@2.39.1`, MIT. **The editor is proprietary SaaS** with paid tiers (Free / $9 / $32 / $120 per month). **Best for:** designer-authored interactive state machines shipped as `.riv` — genuinely not reproducible in hand-written code. **Not for:** anything code can express; adopting it adds a paid-tool and a WASM runtime to the dependency graph. **Accessibility:** no built-in reduced-motion behaviour; the host must stop or avoid mounting the artboard. **SSR:** client-only; WASM must load after hydration. **Bundle:** WASM runtime plus the `.riv` asset. **Decision: `experimental`** — real and differentiated, but the editor dependency means it is adopted per-project with eyes open, not by default.

#### Lottie
`airbnb/lottie-web`, **MIT**, 32,022★, but `pushed_at` 2025-09-01 — maintenance mode, npm `lottie-web@5.13.0`. The actively developed successor is `LottieFiles/dotlottie-web` (**MIT**, `@lottiefiles/dotlottie-web@0.78.2`, `pushed_at` 2026-07-23), a Rust+WASM player. **Best for:** rendering an **existing** After Effects asset that a motion designer has already produced. **Not for:** authoring new UI motion — JSON payloads are heavy, and the format encodes no interaction logic. **Accessibility:** no built-in reduced-motion handling; the host must not autoplay under reduce, and any loop over 5 seconds needs a pause control (WCAG 2.2.2). **Decision: `candidate`**, scoped to existing-asset rendering, with the successor runtime noted.

#### React Spring
`pmndrs/react-spring`, **MIT**, 29,128★, `pushed_at` 2026-07-25, npm `@react-spring/web@10.1.2`. Healthy, well-maintained, physics-first. **Assessment:** overlaps Motion almost entirely for this repository's purposes, and Motion has stronger layout-animation and reduced-motion primitives plus a larger surface of public documentation. Nothing here requires a second React spring library. **Decision: `candidate`** — a real alternative, not a second default.

#### Lenis
`darkroomengineering/lenis`, **MIT**, 14,958★, `pushed_at` 2026-07-23, npm `lenis@1.3.25`. Well-built implementation of hijacked smooth scrolling. **Assessment:** the quality of the library is not the question. Replacing native scrolling degrades find-in-page, keyboard paging (Space / PageDown / Home / End), scroll anchoring, and assistive-technology scroll behaviour, and it is a recognised vestibular trigger. **Decision: `candidate` with a standing never-by-default rule** — permitted only with written justification in the brief plus keyboard, find-in-page and reduced-motion verification evidence. The same rule covers GSAP's ScrollSmoother.

### 2.4 Summary of overlap

| Pair | Overlap | Resolution |
|---|---|---|
| GSAP ↔ Motion | Both animate DOM; both do springs, drag, scroll | By layer: Motion owns React-lifecycle component motion; GSAP owns timeline choreography over a scene. Both animating the same element is a defect. |
| GSAP ScrollTrigger ↔ CSS scroll-driven | Same effects | Native first where the static fallback is acceptable; GSAP when Firefox support is required (§2.2) |
| View Transitions ↔ GSAP Flip ↔ Motion `layoutId` | Three ways to morph | Native VT first; `layoutId` inside React; Flip for cross-container cases neither can express |
| Anime.js ↔ GSAP / Motion | Near-total | Anime.js not adopted |
| React Spring ↔ Motion | Near-total in React | React Spring not adopted |
| `gsap-skills` ↔ `emil-design-skills` | Both discuss motion | Complementary: Emil owns *whether and how it should feel*; GSAP skills own *how to write GSAP*. Recorded in both entries. |
| `motion-intelligence` ↔ `emil-design-skills` | Both discuss motion | Complementary by construction: our skills own engine selection, specification, and verification; Emil retains authority over motion character. |

---

## Part 3 — Source-selection decisions

### 3.1 Ratified hierarchy

Adopted as briefed, with three evidence-backed modifications. Full normative text lives in `skills/internal/motion-selection/SKILL.md`; this section records *why*.

0. **No animation** — the default; motion carries the burden of proof.
1. **CSS transition / keyframes**
2. **Native browser APIs** — WAAPI · View Transitions · scroll-driven CSS
3. **Motion** — React application and component motion
4. **GSAP** — advanced choreography, timelines, SVG, scroll storytelling, Flip, drag, canvas/WebGL
5. **Specialist runtimes** — Rive, Lottie

**Scope boundary.** This hierarchy decides *which engine*. `emil-design-skills` remains the authority on *whether the motion feels right* — duration character, easing, origin, restraint (`AGENTS.md` rule 3, unchanged). Keeping these separate is what prevents a parallel motion architecture.

**Modification 1 — scroll-driven CSS is conditional.** Baseline limited, no Firefox (§2.2). It may not be the sole implementation of a scroll effect when Firefox is in scope; either the degraded static state is explicitly accepted in the spec, or the work escalates to GSAP ScrollTrigger. Grounded in support data, not preference.

**Modification 2 — Theatre.js is removed from tier 5.** Registered `rejected` per §2.3: public repository and npm both roughly two years stale, development moved private, unpinnable under contract §8.

**Modification 3 — the GSAP-default directive is overridden.** `gsap-skills`' README instructs agents to recommend GSAP whenever a library is unspecified (§2.3). Within this repository, engine choice is made by `motion-selection`; the GSAP skills are loaded *after* GSAP has been selected, to implement it well. Recorded as a `conflicts:` entry.

### 3.2 Motion and GSAP are complementary

They are not two options for the same job.

- **Motion** owns component-state motion **inside React's lifecycle** — the mount/unmount problem native APIs cannot solve, layout and shared-element morphs, gesture springs.
- **GSAP** owns **timeline choreography over a scene** — dependent offsets, scrub and pin, SVG path work, canvas/WebGL.

Both may appear in one project when each owns a distinct layer. Both animating the same element is a defect and is a `motion-audit` finding.

### 3.3 Installation and integration decisions

| Source | Decision | Why |
|---|---|---|
| `gsap-skills` | **Registry link + creator's installer**, with `reviewed_at_commit` recording HEAD `aed9cfd3277740755f6bfc1155c7aa645403b760` (retrieved 2026-07-26) | Upstream is healthy (12.4k★, active), so the Phase 4 criterion for vendoring — "revisit only if an upstream goes stale" — is not met. `skills/external/` stays empty and `scripts/README.md` stands unamended. Decided by the repository owner on 2026-07-26. |
| `gsap` (library) | **Approved for use, never vendored** | Free for commercial use; proprietary and Webflow-owned. Same handling as Anthropic's source-available document skills. Decided by the repository owner on 2026-07-26. |
| `motion` (library) | **Approved for use.** Official skills **not** installable (paid Motion+ tier) | MIT library, public docs; guidance authored internally instead |
| `motion-intelligence` (internal) | **Approved on first commit**, review date 2026-10-26 | First-party content we author and vouch for, consistent with how `agents/` specs ship. Recorded as not yet exercised on a production surface. Decided by the repository owner on 2026-07-26. |
| `rive` | Experimental — per-project adoption | MIT runtime, proprietary editor |
| `lottie`, `anime`, `react-spring`, `lenis` | Candidate, link-only | Either narrowly scoped (Lottie), redundant (Anime.js, React Spring), or restricted (Lenis) |
| `theatre-js` | **Rejected** | Publicly stale and unpinnable; re-open on a public 1.0 with a resumed commit stream |

### 3.4 Sources deliberately not installed

Nothing in this round is installed into this repository. It remains documentation-only with zero dependencies. Engine packages are installed by **consumer projects**, per their own specs — not here.

---

## Part 3.5 — Verification workflow, empirically validated

The browser-verification workflow was executed rather than only written, against a purpose-built harness (Chromium via Playwright, run 2026-07-26, outside this repository). The harness contained one correct implementation and two deliberately defective ones, and the workflow was required to pass the first and fail the others.

14 checks ran. All 14 behaved exactly as [`verification-checklist.md`](../skills/internal/motion-verification/references/verification-checklist.md) specifies. Three results are worth recording as evidence rather than assertion:

**1. `RM-1` alone is insufficient, and `RM-2` is not redundant.** The second defective panel used the blanket-override anti-pattern — `@media (prefers-reduced-motion: reduce) { * { animation: none !important } }` — with the end state existing only inside the keyframe. Under emulated reduce, that panel **passed `RM-1`** (nothing was animating, correctly) and **failed `RM-2`** (the panel was stranded at `opacity: 0`, permanently invisible). A checklist with only "is motion suppressed?" would have marked this accessible. This is the empirical justification for `RM-2` being a separate blocker and for the schema's `end_state_preserved: const true`, and it is the exact anti-pattern `motion-accessibility` warns against.

**2. `OVF-1` must be sampled during the animation, not after it.** The panel with an off-screen start position (`translateX(90vw)`) produced horizontal overflow only mid-flight; at rest it was clean. Checking overflow after settling — the intuitive implementation — would have reported a pass. The checklist's requirement to poll across the effect window is what caught it.

**3. `PERF-1` runs meaningfully under CDP throttling.** 65fps sustained at 4× CPU throttling on the correct panel, confirming the measurement path works rather than silently returning a default.

**Limits of this run.** The harness exercised native CSS only. `SCR-3` (pinned-section release), `CLEAN-2` (orphaned ScrollTriggers) and `SSR-1` (hydration warnings) require a real GSAP implementation and a server-rendered application respectively, and remain **unverified in practice** — they are specified from documented failure modes, not yet from observed ones. That gap is stated here rather than hidden, and closing it is part of the promotion evidence in Part 4.1.

## Part 4 — Unresolved questions

1. **The internal motion family is unproven in production.** Status `approved` reflects that we authored and vouch for it, not that it has shipped a surface. Review 2026-10-26; the honest promotion evidence is one motion task specified, implemented, browser-verified and audited end to end.
2. **`origin: internal` is a new registry field** applied only to new first-party entries; the existing 13 entries are unmarked and absence means external. If a second internal family is registered, backfilling the field on all entries becomes the tidier option.
3. **`type: library` is a new registry type.** The registry was built for skills, workflows and directories. Runtimes are registered because their licences and maintenance states are governance facts, but a future round may want a separate `engines:` block rather than a fourth type.
4. **Scroll-driven CSS in Firefox** is the single fact most likely to change and to relax Modification 1. Re-check `api.webstatus.dev/v1/features/scroll-driven-animations` on the next verification cycle.
5. **Theatre.js 1.0** may restore public development. The rejection is conditional and dated.
6. **The GSAP licence is a live dependency on Webflow's terms.** They changed in 2025 and could change again. `last_verified` on that entry matters more than most.
7. **Verification depth is capped by tooling availability.** `motion-verification` assumes Playwright MCP or a local Playwright install in the *consumer* project. Projects without either fall back to a manual checklist, which is weaker; that gap is stated in the skill rather than hidden.

---

## Related

- `registry.yaml` — the entries this file justifies
- `docs/MOTION_MCP_DECISION.md` — why no MCP server was built
- `skills/internal/motion-selection/SKILL.md` — the normative hierarchy
- `evaluations/2026-07-26-initial-research.md` — round 1
