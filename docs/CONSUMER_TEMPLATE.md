# Consumer Template — `docs/DESIGN_INTELLIGENCE.md`

Copy everything below the line into your project repository at **`docs/DESIGN_INTELLIGENCE.md`** and fill it in. Delete the guidance in *italics*; keep the section headings — agents look for them by name.

This template is governed by [`INTEGRATION_CONTRACT.md`](INTEGRATION_CONTRACT.md). Where the two differ, the contract wins.

Rules that survive even if the canonical repository is unreachable are restated inside the template on purpose (contract §13). Do not delete them.

---

# Design Intelligence — Project Connection Record

> This file is the project's contract with the canonical
> [`design-intelligence`](https://github.com/andrewheldy/design-intelligence) repository.
> It is read **first** by any agent doing design work here.
> It is owned by this project repository. It is not synchronized with anything.

## 1. Identity

| Field | Value |
|---|---|
| **Project name** | *e.g. The Feed* |
| **Project repository** | *e.g. `https://github.com/andrewheldy/the-feed`* |
| **Product type** | *one of: `marketing` · `product-ui` · `mixed` · `mobile-app` · `internal-tool`* |
| **Primary surfaces** | *e.g. public feed (web), item detail, submission flow, admin console* |
| **Target users** | *who actually uses it, in one or two sentences — not a persona deck* |
| **Project owner** | *person accountable for design decisions here* |
| **Integration status** | *one of: `planned` · `active` · `paused` · `archived`* |

## 2. Constraint envelope

*Everything here is an input to the Design Director. An unstated constraint becomes a review finding later.*

| Field | Value |
|---|---|
| **Accessibility requirements** | *baseline is WCAG 2.2 AA. State anything stricter, plus any known open defects with remediation dates.* |
| **Responsive requirements** | *e.g. 320–430px must survive; desktop ≥1280 primary; 200% zoom without horizontal scroll* |
| **Motion constraints** | *e.g. UI transitions ≤300ms; no motion on list hover; `prefers-reduced-motion` honored on every animation* |

**Non-overridable floor (do not edit):** `prefers-reduced-motion`, visible focus indicators, and WCAG AA contrast take precedence over every skill directive and every brand rule. An accessibility failure is never recorded as a permanent exception; it is recorded as an open defect with a remediation date.

## 3. Project-owned locations

| Field | Path (repo-relative) |
|---|---|
| **Brand-system location** | *e.g. `docs/brand/README.md` or `src/styles/tokens.css`* |
| **Design-decision-log location** | *e.g. `docs/design-decisions.md`* |
| **Reusable-findings location** | *e.g. `docs/design-findings.md` — staging for lessons proposed upstream* |

## 4. Canonical Design Intelligence link

| Field | Value |
|---|---|
| **Canonical repository URL** | `https://github.com/andrewheldy/design-intelligence` |
| **Canonical commit / release / version last reviewed** | *a concrete commit SHA (preferred), tag, or `registry version N (updated YYYY-MM-DD)`. `main` is not a ref.* |
| **Last review date** | *YYYY-MM-DD — when a human last re-read the canonical repo for this project* |
| **Reviewed by** | *person* |

**Mechanism note (do not edit):** nothing is synchronized. This project does not pull, install, submodule, or vendor the canonical repository. Agents read it over the network at the ref above; a human updates the ref during a re-review.

## 5. Applicable Design Intelligence agents

*Tick only what this project actually runs. Specs live at `agents/<name>.md` in the canonical repo at the ref above.*

- [ ] `design-director` — **required** for any design task
- [ ] `design-engineer` — **required** for any implementation
- [ ] `accessibility-reviewer` — **always** runs on changed UI
- [ ] `anti-slop-reviewer` — new or restyled visual surfaces
- [ ] `motion-reviewer` — only when the change contains animation
- [ ] `mobile-ux-reviewer` — only when a mobile/responsive surface changed

## 6. Applicable registry entries

*Reference by `id` from `registry.yaml`. Never copy the entries themselves into this repository.*

| Registry `id` | Status at last review | Why it applies here |
|---|---|---|
| *e.g. `anthropic-skills`* | *approved* | *product-UI opinion skill for the app surfaces* |
| *e.g. `emil-design-skills`* | *approved* | *motion authority; composes with the opinion skill* |
| *e.g. `a11y-specialist-skills`* | *approved* | *backs the Accessibility Reviewer* |

**One-opinion-skill rule (do not edit):** never load more than one of `taste-skill`, Anthropic `frontend-design`, or `ui-ux-pro-max` for the same task. Marketing surfaces → `taste-skill`. Product UI → Anthropic `frontend-design`. `ui-ux-pro-max` is experimental and isolated-trial only. `emil-design-skills` is a motion authority, not an opinion skill, and may compose with any of them. A second opinion skill requires written justification in the brief naming which skill wins on each axis of conflict.

## 7. Current exceptions

*Standing overrides and permanently-rejected recommendations. Reviewers read this before reporting and must not re-report a valid exception as a new finding.*

| ID | Rule or recommendation overridden | Source | Reason | Approved by | Expires / review by | Status |
|---|---|---|---|---|---|---|
| *EX-1* | *e.g. taste-skill's Inter ban* | *`taste-skill`* | *brand system mandates Inter* | *owner* | *YYYY-MM-DD or `permanent`* | *active* |

*An exception with no expiry becomes silent policy — set a review date unless it is genuinely permanent brand law.*

## 8. HeldyOS link (optional)

| Field | Value |
|---|---|
| **Obsidian note** | *vault-relative path of the `design-intelligence-adoption` note for this project, if one exists* |

*Strategic reasoning, venture context, and portfolio priorities live in HeldyOS, not here. See the canonical repo's `docs/HELDYOS_BRIDGE.md`.*

---

## Required workflow

Follow in order. Do not skip steps to save time; the ordering is what keeps reviews cheap.

1. **Load project context.** Read this file in full — identity, constraint envelope, exceptions.
2. **Load project-specific design and brand rules.** Read the brand system at the path in §3, in full, not summarized.
3. **Read the canonical Design Intelligence integration contract** at the ref in §4: `AGENTS.md`, then `docs/INTEGRATION_CONTRACT.md`, then the `registry.yaml` entries listed in §6, then the agent specs listed in §5.
4. **Select no more than one opinionated design skill** (§6). More than one requires explicit written justification in the brief.
5. **Run the Design Director.** Output: `DESIGN_BRIEF.md` in this repository — design read, skill loadout with brand overrides stated, acceptance criteria.
6. **Produce the Design Engineer implementation plan** from the brief. Tokens before components; extend the existing system, never fork a parallel one.
7. **Implement within this project repository.** All code, tokens, and screenshots stay here.
8. **Run only the relevant reviewer agents** (§5 routing). A copy-only change does not need all four.
9. **Consolidate findings and remove duplicates.** Target-size and reflow overlaps between Mobile UX and Accessibility are reported once, under the Accessibility Reviewer's WCAG citation.
10. **Record accepted and rejected decisions** in the design decision log (§3). Every rejected recommendation gets: date, recommendation, source agent + registry entry, reason, decider. Recurring rejections are promoted to §7.
11. **Propose reusable lessons back to Design Intelligence.** Only findings that would hold for a different venture with a different brand. Stage them in the reusable-findings file (§3), then open a PR or issue against the canonical repo — a completed evaluation file for a new source, or a proposed diff plus evidence for an agent-spec refinement. Never commit directly to the canonical repo's `registry.yaml`, `agents/`, or `skills/` from a project workflow.

## If the canonical repository is unavailable

Network failure, unresolvable ref, or no access. Then:

- **State it explicitly at the top of the output** — which resource, which ref, what failed.
- Fall back only to material already in this repository: this file, the brand system, the decision log, prior briefs, and any `.claude/agents/` copies that record their source ref.
- Keep enforcing the accessibility floor (§2) and the one-opinion-skill rule (§6).
- Label all output **unverified loadout** and note in the brief that the registry was unreachable.
- Do **not**: install any skill, substitute a web-search result for a registry entry, reconstruct a registry entry or agent spec from memory, change §4, or propose anything upstream.
