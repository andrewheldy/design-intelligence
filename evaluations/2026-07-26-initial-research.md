# Phase 1 Research — Initial Source Verification

**Date:** 2026-07-26
**Method:** Every source below was verified against its live GitHub repository (description, file tree, license sidebar, README install instructions), and where noted, the underlying `SKILL.md` files were inspected directly. Star counts are as observed on the verification date and will drift. Nothing here is taken from marketing copy alone.

Statuses: `approved` | `experimental` | `candidate` | `rejected` | `license-review`

---

## Approved

### 1. Emil Kowalski — Skills for Design Engineers
- **Repo:** https://github.com/emilkowalski/skills (verified canonical; ~20.8k stars)
- **Creator:** Emil Kowalski (design engineer; author of Sonner/Vaul; teaches animations.dev)
- **License:** MIT (LICENSE file present)
- **Install:** `npx skills@latest add emilkowalski/skills`
- **Platforms:** Any SKILL.md-compatible agent (Claude Code, Cursor, Codex, etc.)
- **Contents inspected:** `skills/emil-design-eng/SKILL.md` read in full. Seven skills: `emil-design-eng`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `animation-vocabulary`, `apple-design`, `pick-ui-library`.
- **What it actually does:** Encodes a concrete animation/polish decision framework: 4-question "should this animate" test, easing decision tree with custom bezier values, duration targets by component (100–500ms, UI under 300ms), transform-origin rules, `prefers-reduced-motion` handling, "never animate from scale(0)", "no animation on keyboard-initiated actions", mandated Before/After/Why review tables.
- **Useful vs marketing:** Genuinely useful. The SKILL.md is a dense, opinionated ruleset, not a persona wrapper.
- **Conflicts:** Overlaps with `design-motion-principles` (which distills Emil's own published work — prefer this canonical source). Its strict duration/easing rules can conflict with brand-mandated motion languages.
- **Status:** `approved` — canonical, first-party, substantive, MIT. Our default motion authority.

### 2. Anthropic — anthropics/skills
- **Repo:** https://github.com/anthropics/skills (official Anthropic org; ~141k+ stars)
- **Creator:** Anthropic
- **License:** Apache-2.0 for most skills; **document skills (`docx`, `pdf`, `pptx`, `xlsx`) are source-available, not open source** — see `THIRD_PARTY_NOTICES.md` and per-skill licenses.
- **Install:** Claude plugin marketplace / copy skill folders; each skill is a standalone folder.
- **Platforms:** Claude Code / Claude API natively; SKILL.md format is portable.
- **Contents inspected:** skill folder listing + `skills/frontend-design/SKILL.md` read in full.
- **Design-relevant skills:** `frontend-design`, `brand-guidelines`, `theme-factory`, `canvas-design`, `algorithmic-art`, `web-artifacts-builder`, `webapp-testing`.
- **What it actually does:** `frontend-design` is a substantive anti-generic design methodology: ground design in subject matter, explicit warnings against the three AI default aesthetics (cream+serif, dark+neon, broadsheet), token discipline (4–6 colors, 2+ typeface roles, one signature element), "spend boldness in one place," reduced-motion + focus-visibility requirements.
- **Useful vs marketing:** Useful; the reference implementation of the skill format itself.
- **Conflicts:** Philosophy overlaps taste-skill but is less prescriptive; compatible if taste-skill is scoped to marketing surfaces.
- **Status:** `approved` — with license note: avoid vendoring the document skills; the design skills are Apache-2.0.

### 3. Leonxlnx — Taste Skill
- **Repo:** https://github.com/Leonxlnx/taste-skill (canonical, confirmed by official site tasteskill.dev; ~67.6k stars)
- **Creator:** Leonxlnx
- **License:** MIT
- **Install:** `npx skills add https://github.com/Leonxlnx/taste-skill` (or `--skill "design-taste-frontend"` for one skill)
- **Platforms:** Claude Code, Codex, Cursor; framework-agnostic; separate ChatGPT-image variants.
- **Contents inspected:** `skills/` folder enumerated (13 skills incl. `taste-skill` v2, `taste-skill-v1`, `gpt-tasteskill`, `image-to-code-skill`, `redesign-skill`, `brandkit`, `minimalist-skill`, `brutalist-skill`, `stitch-skill`); v2 `SKILL.md` read in full.
- **What it actually does:** 14+ section prescriptive framework: brief-inference step, three global dials (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`), hard bans on AI "tells" (em-dashes, three equal feature cards, default Inter, centered hero + purple gradients, div-based fake screenshots), mandatory asymmetry above variance 4, mandatory motion above intensity 4, mechanical pre-flight checklist.
- **Useful vs marketing:** Substantive — 100+ concrete rules with override gates. But it is aggressive: absolute bans can override legitimate brand or accessibility requirements, and the current default ("v2") is self-labeled experimental.
- **Conflicts:** HIGH. Conflicts with `frontend-design` (softer philosophy), brand guidelines mandating serif/Inter/centered layouts, and any reduced-motion policy when dials are high. Never run simultaneously with UI/UX Pro Max or `frontend-design` on the same task.
- **Status:** `approved` — but scope-limited: landing pages / portfolios / marketing surfaces only (its own stated scope excludes dashboards and product UI). Treat as a preference framework with override gates, not law.

### 4. OneRedOak — claude-code-workflows (design-review)
- **Repo:** https://github.com/OneRedOak/claude-code-workflows (~3.9k stars)
- **Creator:** OneRedOak (Patrick Ellis)
- **License:** MIT
- **Install:** No packaged installer — copy the `design-review/` agent + command files into your project.
- **Platforms:** Claude Code (uses subagents + Playwright MCP).
- **Contents inspected:** repo tree (`code-review/`, `design-review/`, `security-review/`).
- **What it actually does:** A design-review *workflow*, not a style guide: spins a design-review agent that drives a live browser via Playwright MCP, evaluates against Stripe/Airbnb/Linear-tier standards, WCAG AA+, responsiveness, and interaction patterns; triggered on PRs or via slash command.
- **Useful vs marketing:** Useful — the live-environment review loop is the piece none of the style skills provide.
- **Conflicts:** None inherent; it consumes whatever principles you give it in CLAUDE.md.
- **Status:** `approved` — via **internal adaptation** (its pattern informs our reviewer agents) rather than verbatim install.

### 5. masuP9 — a11y-specialist-skills
- **Repo:** https://github.com/masuP9/a11y-specialist-skills (54 stars)
- **Creator:** masuP9 (GitHub handle; accessibility specialist — identity beyond handle not verified)
- **License:** MIT
- **Install:** Claude Code plugin marketplace, or symlink skill folders; also works as Codex plugin. Ships npm package `@a11y-skills/audit`.
- **Platforms:** Claude Code, Codex.
- **Contents inspected:** skill folders `reviewing-a11y`, `auditing-wcag`, `planning-wcag-audit`, `planning-a11y-improvement`; 138 commits, actively maintained.
- **What it actually does:** WCAG 2.2 + WAI-ARIA APG review skills with automated axe-core/Playwright scripts (focus indicators, reflow, text spacing, target size), a four-phase audit process, and audit-planning templates.
- **Useful vs marketing:** Genuinely useful and unusually rigorous for its size. Low star count is not a quality signal here — content is specialist-grade.
- **Conflicts:** None; complements everything.
- **Status:** `approved` — our accessibility review authority.

### 6. Matt Pocock — mattpocock/skills
- **Repo:** https://github.com/mattpocock/skills (~188k stars)
- **Creator:** Matt Pocock (Total TypeScript)
- **License:** MIT
- **Install:** `npx skills@latest add mattpocock/skills`, then `/setup-matt-pocock-skills`
- **Platforms:** Claude Code and SKILL.md-compatible agents.
- **Contents inspected:** full skill list enumerated. Engineering workflow skills (`tdd`, `triage`, `to-spec`, `implement`, `code-review`, `domain-modeling`, …) plus `writing-great-skills` and `prototype`.
- **What it actually does:** Production engineering workflows. **Not a design library** — only `prototype` (UI variations to answer a design question) is design-adjacent.
- **Useful vs marketing:** Very high quality, but out of this repository's design scope.
- **Conflicts:** None with design skills.
- **Status:** `approved` — registry **link only**, scoped to two uses: `writing-great-skills` as our skill-authoring reference, `prototype` for design-exploration workflow.

---

## Experimental

### 7. nextlevelbuilder — UI/UX Pro Max
- **Repo:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (~110k stars)
- **Creator:** nextlevelbuilder (team identity behind the org not independently verified)
- **License:** MIT for the open-source "Basic" tier; **a paid "Premium" tier exists** — freemium structure is disclosed in the README.
- **Install:** `npm i -g ui-ux-pro-max-cli && uipro init --ai claude`, or Claude plugin marketplace (`/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill`).
- **Platforms:** 19 listed agents (Claude Code, Cursor, Codex CLI, Gemini CLI, Windsurf, Copilot, …).
- **Contents inspected:** repo tree: real CSV databases (192 product types, 84 UI styles, 192 palettes, 74 font pairings, 161 reasoning rules, 98 UX guidelines, 22 stacks) + Python search scripts that query them at generation time.
- **What it actually does:** A retrieval layer: given a product type it selects style/palette/typography/UX rules from its database and applies stack-specific templates.
- **Useful vs marketing:** Mixed. The databases are real and inspection confirms substance, but marketing language overclaims ("complete design system in seconds"), the footprint is large, and database-driven selection tends toward competent-but-templated output — the exact thing taste-skill exists to fight.
- **Conflicts:** HIGH with taste-skill and `frontend-design` (three competing sources of palette/typography truth). Must never be active alongside them.
- **Status:** `experimental` — install in an isolated project to trial; do not make default. Freemium upsell noted.

### 8. kylezantos — design-motion-principles
- **Repo:** https://github.com/kylezantos/design-motion-principles (858 stars)
- **Creator:** kylezantos
- **License:** MIT
- **Install:** `npx skills add kylezantos/design-motion-principles`
- **Platforms:** SKILL.md-compatible agents.
- **Contents inspected:** full tree — `workflows/create.md`, `workflows/audit.md`, references (motion-cookbook, audit-checklist, anti-checklist, accessibility, performance, HTML report templates).
- **What it actually does:** Two-mode motion skill (build vs audit) that weights guidance across three "lenses" distilled from the published work of Emil Kowalski, Jakub Krehel, and Jhey Tompkins; produces HTML audit reports with looping CSS demos.
- **Useful vs marketing:** Well-built and substantive.
- **Conflicts:** Direct overlap with Emil's own `review-animations`/`improve-animations`. **Attribution concern:** it is a third-party distillation of named designers' teaching (MIT-licensed by the distiller, with the sources credited by name). Prefer Emil's first-party skill; keep this for the audit-report format and the multi-lens idea.
- **Status:** `experimental` — attribution/derivation noted; do not vendor.

### 9. Murphy Trueman — design-system-ops
- **Repo:** https://github.com/murphytrueman/design-system-ops (147 stars)
- **Creator:** Murphy Trueman
- **License:** MIT
- **Install:** clone to `~/.claude/skills/design-system-ops`, or `.plugin` drop-in.
- **Platforms:** Claude Code.
- **Contents inspected:** 30+ skills across five domains — audit (token drift, tier leakage, naming violations), govern (deprecation workflows, decision logs), document, validate (design-to-code alignment, token compliance), communicate (adoption metrics, stakeholder briefs); chained via `/full-diagnostic`.
- **What it actually does:** Design-system *operations* — the maintenance work, not component generation. Reads actual token files and component code.
- **Useful vs marketing:** Substantive; genuinely differentiated (nothing else in this registry covers DS ops).
- **Conflicts:** None.
- **Status:** `experimental` — young, single-maintainer, low adoption; promote to approved after we use it on a real design system.

---

## Candidates (verified, link-only, not yet adopted)

### 10. obra (Jesse Vincent) — superpowers
- **Repo:** https://github.com/obra/superpowers · MIT · engineering methodology (planning, TDD, worktrees, review) for Claude Code/Cursor/Codex/Gemini CLI.
- **Why candidate:** high quality, but engineering-process scope, not design. Revisit if we adopt its methodology venture-wide.

### 11. VoltAgent — awesome-agent-skills
- **Repo:** https://github.com/VoltAgent/awesome-agent-skills · MIT · ~28.9k stars · a **directory of links** (1000+ skills), organized by source team, no skill files of its own.
- **Why candidate:** useful discovery index only. Never "install"; never bulk-import — that's the bookmark dump this repo exists to avoid.

---

## Rejected

### 12. openai/skills (Skills Catalog for Codex)
- **Repo:** https://github.com/openai/skills (~24.2k stars) · per-skill LICENSE.txt files.
- **Why rejected:** contains no first-party design skills (its `frontend-design` content is imported from Anthropic's, which we already track at the canonical source), and the repo carries a deprecation notice pointing to OpenAI's plugins repo. *Uncertainty flag: deprecation status observed once on the repo page; re-verify before citing.* Registry keeps Codex compatibility notes on each skill entry instead.

### 13. Taste-skill namesakes: senlindesign/taste-skill, nxpatterns/claude-taste-skill, Dragoon0x/taste-skills
- **Why rejected (as registry entries):** name-collision repos riding the Taste Skill wave. Not individually inspected in depth; excluded because Leonxlnx/taste-skill is confirmed canonical (official site links to it). senlindesign's "reverse-engineer a site's design tokens" angle is conceptually interesting — re-open as a candidate only with a real use case.

### 14. Aggregator mega-collections (alirezarezvani/claude-skills "345 skills", obviousworks, BbgnsurfTech, etc.)
- **Why rejected:** volume-first collections with mixed provenance; contradicts the quality standard of this repository. Individual gems inside them should be submitted as standalone candidates with their true upstream source.

---

## Not yet evaluated (noted for future candidate submissions)
- Accessibility alternatives seen but not inspected: `airowe/claude-a11y-skill` (axe-core + jsx-a11y), `snapsynapse/skill-a11y-audit` (WCAG 2.1 AA), `zivtech/a11y-meta-skills`, `joedevon/a11y-skills`, `mrKanoh/claude-wcag-accessibility-skill`. masuP9 was selected on inspected substance; these remain unranked, not rejected.
- `bergside/awesome-design-skills` (67 DESIGN.md/SKILL.md files) — directory, same handling as VoltAgent.
- `hamen/material-3-skill` — adopt only if a venture standardizes on Material 3.

## Tooling note
- **`npx skills` CLI** is https://github.com/vercel-labs/skills (Vercel Labs) with the skills.sh directory. It installs skills from arbitrary git repos — treat every `skills add` as executing untrusted instructions: read the SKILL.md first (`scripts/install.sh` enforces this).
