# Design Intelligence — Integration Contract

**Status:** normative · **Version:** 1 · **Last updated:** 2026-07-26
**Canonical repository:** <https://github.com/andrewheldy/design-intelligence>

This document defines how external project repositories and the AI agents working in them consume `design-intelligence`. It adds nothing to the repository's existing mechanics — [`registry.yaml`](../registry.yaml), [`AGENTS.md`](../AGENTS.md), [`evaluations/`](../evaluations/), [`agents/`](../agents/), and the link/vendor/fork/submodule table in [`README.md`](../README.md) remain authoritative. Where this document and those files appear to disagree, **those files win** and this one is a defect to be fixed.

Key words **MUST**, **MUST NOT**, **SHOULD**, and **MAY** are used in the RFC 2119 sense.

---

## 1. Ownership boundaries

Three systems, three non-overlapping responsibilities. Duplication across the boundary is the failure mode this contract exists to prevent.

### Design Intelligence owns (this repository)

- Reusable design agent specifications ([`agents/`](../agents/))
- The verified source registry, statuses, licenses, install methods, and conflicts ([`registry.yaml`](../registry.yaml))
- Cross-venture design standards and selection rules ([`AGENTS.md`](../AGENTS.md))
- The evaluation system and its evidence trail ([`evaluations/`](../evaluations/))
- Reusable skills we author or vendor under recorded license terms ([`skills/`](../skills/))
- Verified creator/canonical-source references ([`references/`](../references/))
- Implementation-oriented design guidance that generalizes across ventures
- This contract and the consumer template

This repository's own content above is [MIT licensed](../LICENSE). That covers our text and code only — it is a separate thing from the licenses of the sources `registry.yaml` describes, which are unaffected (see §12).

Design Intelligence **MUST NOT** contain: venture strategy, portfolio priorities, founder preferences, product roadmaps, per-project brand tokens, screenshots of project UI, or any project's implementation code.

### An individual project repository owns

- Product code, components, and the brand system *as implemented*
- Project-specific design constraints, exceptions, and their justifications
- Screenshots and implementation evidence
- Local design decisions and their decision log
- Its own `docs/DESIGN_INTELLIGENCE.md` connection record (see §4)

A project repository **MUST NOT** become a second copy of the registry or the agent specifications (see §11).

### HeldyOS / Obsidian owns

- Portfolio relationships and venture context
- Founder preferences and strategic reasoning
- Adoption status per venture, evaluation summaries, and lessons learned
- Decision rationale that spans more than one repository
- Links to GitHub evidence

See [`HELDYOS_BRIDGE.md`](HELDYOS_BRIDGE.md) for the note types and metadata contract.

---

## 2. How an external agent discovers and reads this repository

There is **no automatic synchronization**, no package, no submodule, and no MCP server. An agent working in a consumer repository reads this repository over the network (or from a local clone the operator already has) and follows what it reads. Nothing pulls, nothing pushes.

An agent **MUST** follow this discovery order:

1. Read the consumer repository's `docs/DESIGN_INTELLIGENCE.md`. If it is absent, the project has not been integrated — see §5.
2. Take `canonical_design_intelligence_url` and `canonical_ref` from that file. The agent **MUST** read this repository at the recorded ref, not at whatever `main` happens to be, unless the task is explicitly "re-review against latest".
3. Read, in this order: [`AGENTS.md`](../AGENTS.md) (operating rules) → this contract → [`registry.yaml`](../registry.yaml) (the entries listed in `applicable_registry_entries`) → the specs in [`agents/`](../agents/) named in `applicable_agents`.
4. Read the project's brand system and design decision log at the paths the connection record names.

Rules on reading:

- The agent **MUST** treat `registry.yaml` as the sole source of truth for what may be installed, at what status, under what license.
- The agent **MUST NOT** install, recommend, or cite any design source absent from the registry. New finds go through [`evaluations/TEMPLATE.md`](../evaluations/TEMPLATE.md) — as a *proposal back to this repository* (§9), never as a local install.
- If an entry's `last_verified` is more than ~90 days older than the current date, the agent **SHOULD** flag it as stale in its output and **MUST NOT** silently treat it as fresh (`AGENTS.md` rule 7).
- The agent **MUST NOT** execute any install script — including [`scripts/install.sh`](../scripts/install.sh) or third-party installers — without a human reading it first (`AGENTS.md` rule 6).

---

## 3. Minimum required files in a consumer repository

A project repository is **integrated** when it contains all of the following. Fewer than all four means the project is *not* integrated and an agent **MUST** say so rather than proceeding as if it were.

| Path | Required | What it holds |
|---|---|---|
| `docs/DESIGN_INTELLIGENCE.md` | **MUST** | The connection record — copy of [`CONSUMER_TEMPLATE.md`](CONSUMER_TEMPLATE.md), filled in |
| Brand system (path declared in the record) | **MUST** | Tokens, type roles, palette, motion language *as implemented in this project* |
| Design decision log (path declared in the record) | **MUST** | Dated accepted/rejected design decisions, including rejected recommendations (§10) |
| Reusable findings file (path declared in the record) | **SHOULD** | Staging area for lessons proposed back to this repository (§9) |

A project **MAY** additionally keep a machine-readable connection record validating against [`schemas/project-consumer.schema.json`](../schemas/project-consumer.schema.json). This is optional: the Markdown record is the contract, the YAML/JSON record is a convenience for tooling and for the HeldyOS bridge.

---

## 4. Expected inputs to the Design Director

[`agents/design-director.md`](../agents/design-director.md) defines the Director's own inputs. A consumer repository **MUST** supply all of them, and **MUST** supply them from project-owned sources rather than from strategic memory:

1. **Product context** — who it is for, what it must communicate, from `docs/DESIGN_INTELLIGENCE.md` (target users, product type) plus the specific task brief.
2. **Surface type** — marketing, product-UI, or mixed. If the record says `mixed`, the Director **MUST** resolve it to one surface type for the task before selecting a loadout.
3. **Brand constraints** — the project's brand system, in full, not summarized. Brand beats skill (`AGENTS.md` rule 4).
4. **Existing tokens and prior art** — current implementation, so the Engineer extends rather than forks.
5. **Standing exceptions** — the `exceptions` section of the connection record. An exception the Director does not see will be re-litigated as a finding.
6. **Constraint envelope** — accessibility requirements, responsive requirements, motion constraints, from the record.

The Director's output remains a single `DESIGN_BRIEF.md` per its own output contract. The brief lives in the **project** repository.

---

## 5. Expected outputs from each reviewer

Each reviewer's output contract is defined in its own spec and **MUST NOT** be redefined here or in a consumer repository. Summary for routing only:

| Agent | Runs when | Output | Blocking authority |
|---|---|---|---|
| [Accessibility Reviewer](../agents/accessibility-reviewer.md) | **Always**, on any changed UI | Findings table: Location · Issue · WCAG SC · Severity · Fix, plus what passed | Blockers = no ship; **not overridable** by brand or taste (`AGENTS.md` rule 5) |
| [Anti-Slop Reviewer](../agents/anti-slop-reviewer.md) | Any new or restyled visual surface | Verdict DISTINCTIVE / COMPETENT-GENERIC / SLOP + ≤10 findings | Advisory; a "tell" the brief chose is not a finding |
| [Motion Reviewer](../agents/motion-reviewer.md) | Only when the change contains animation or transitions | Element · Before · After · Why, split Blockers / Refinements | Hard failures block ship |
| [Mobile UX Reviewer](../agents/mobile-ux-reviewer.md) | Only when a mobile or responsive surface changed | Findings table incl. viewports actually tested | Blockers block ship |

Routing rules:

- An agent **MUST** run only the reviewers relevant to the change. Running all four on a copy-only change produces noise and trains everyone to ignore reviews.
- An agent **MUST** consolidate overlapping findings before reporting. Target-size and reflow overlaps between Mobile UX and Accessibility are reported **once**, under the Accessibility Reviewer's WCAG citation (per the Mobile UX spec).
- Reviewer output lives in the **project** repository. It **MUST NOT** be committed here.

---

## 6. The one-opinion-skill rule

`AGENTS.md` rule 3 is binding on consumers and is restated here because it is the rule most often broken by accident:

- An agent **MUST NOT** load more than one of `taste-skill`, Anthropic `frontend-design`, or `ui-ux-pro-max` for the same task. They are competing sources of typography/palette/layout truth.
- Selection: marketing/landing/portfolio → `taste-skill`; product UI, dashboards, apps → Anthropic `frontend-design`; conventional scaffolding trial in an isolated project → `ui-ux-pro-max` (experimental status — isolated trials only).
- `emil-design-skills` is a motion authority, not an opinion skill. It **MAY** compose with any of the above.
- Loading a second opinion skill requires an explicit written justification in the `DESIGN_BRIEF.md`, naming which skill wins on each axis of conflict. Absent that, it is a defect.
- The chosen loadout **MUST** be recorded in the brief so reviewers know which rules were in force.

Cursor stacks project rules silently; agents working in Cursor **MUST** verify that no second opinion skill is active as a background rule.

---

## 7. Project brand rules override generic recommendations

Precedence, highest first:

1. **Accessibility floor** — `prefers-reduced-motion`, focus visibility, WCAG AA contrast. Not overridable by anything, including a skill's mandate to animate and including brand (`AGENTS.md` rule 5).
2. **Project brand system** — fonts, palette, layout symmetry, motion language, as implemented in the project repository.
3. **Registry-approved skill directives** — taste-skill's bans, `frontend-design`'s defaults, Emil's motion rules.
4. **Generic agent judgment.**

Consequences:

- When a brand rule beats a skill directive, the Director **MUST** record the override in the brief (`AGENTS.md` rule 4), naming the skill, the directive, and the brand rule that displaced it.
- The Anti-Slop Reviewer **MUST NOT** report a "tell" that the brief explicitly chose. This is absolute; it is what separates the reviewer from taste-skill's bans.
- A brand rule **MUST NOT** be used to override an accessibility finding. If a brand rule cannot be implemented accessibly, that is a brand defect and belongs in the project's decision log as an open item.
- Project-specific overrides **MUST** stay in the project repository. They **MUST NOT** be promoted into this repository's agent specs — a rule that is true for one venture only is not design intelligence.

---

## 8. Version pinning and change awareness

- A consumer's `canonical_ref` **MUST** name a concrete commit SHA (preferred), tag, or the registry's `version` + `updated` pair. "main" is not a ref for review purposes.
- Consumers **MUST NOT** add this repository as a Git submodule, npm/pip dependency, or vendored copy. The README's link/vendor/fork/submodule table governs, and no approved source currently justifies a submodule.
- Re-review is **manual and human-initiated**. Nothing in this repository notifies consumers of changes. A project **SHOULD** re-read this repository when it starts significant design work, and **MUST** update `canonical_ref` and `last_reviewed` when it does.
- When a re-review changes a project's loadout or applicable entries, the change **MUST** be recorded in the project's design decision log.

---

## 9. Proposing reusable findings back to this repository

A finding is **reusable** only if it would hold for a different venture with a different brand. Everything else stays in the project.

Proposal path — a consumer **MUST NOT** commit directly to `agents/`, `registry.yaml`, or `skills/` from a project workflow:

1. Record the candidate lesson in the project's reusable-findings file, with the evidence (which project, which surface, what happened).
2. Open a pull request or issue against this repository containing:
   - **New source discovered** → a completed evaluation file from [`evaluations/TEMPLATE.md`](../evaluations/TEMPLATE.md), named `evaluations/YYYY-MM-DD-<name>.md`. A URL with no verification is not a submission. The registry entry is added only after the evaluation exists.
   - **Refinement to an existing agent spec** → the proposed diff to the file in `agents/`, plus the project evidence that motivated it.
   - **A pattern worth becoming a skill** → a proposal, not a skill. Internal skills follow the authoring bar in [`skills/README.md`](../skills/README.md); nothing lands in `skills/` without a registry entry.
3. A status change on an existing entry (e.g. `experimental` → `approved`) **MUST** cite an evaluation update with real evidence, per `AGENTS.md`. One successful trial cycle is the stated bar for the experimental entries.
4. Strategic conclusions ("this venture should prioritize X") **MUST NOT** be proposed here. They belong in HeldyOS.

---

## 10. Documenting rejected recommendations

A rejected recommendation that is not written down comes back every review cycle. Therefore:

- Every recommendation an agent makes that the project declines **MUST** be recorded in the project's design decision log with: date, the recommendation, its source (agent + registry entry), the reason for rejection, and who decided.
- A rejection that will recur — a skill directive the brand permanently overrides, a taste-skill ban the project will not honor — **MUST** additionally be promoted to the `Current exceptions` section of `docs/DESIGN_INTELLIGENCE.md`, so future Directors and reviewers see it as an input rather than rediscovering it.
- Reviewers **MUST** read the exceptions section before reporting, and **MUST NOT** re-report a documented, still-valid exception as a new finding.
- Exceptions **SHOULD** carry an expiry or review date. An exception with no expiry becomes silent policy.
- Accessibility findings **MUST NOT** be recorded as permanent exceptions. They may be recorded as *open defects with a remediation date*; that is a different thing and **MUST** be labelled as such.
- Rejections that reveal a genuine flaw in a shared agent spec or registry entry **SHOULD** also travel back via §9.

---

## 11. What must never be duplicated into consumer repositories

A consumer repository **MUST NOT** contain a copy of:

- `registry.yaml`, or any partial fork of it. Reference entries by `id`.
- The agent specifications in `agents/`. Reference them by repo-relative path at a pinned ref. *(Exception: an operator **MAY** install a spec as a local Claude Code subagent definition under `.claude/agents/` for execution, as `AGENTS.md` describes. That copy is a runtime artifact — it **MUST** record the source ref, and it **MUST NOT** be edited locally. Edits go through §9.)*
- Evaluation files from `evaluations/`.
- Third-party skill content in any form not permitted by that source's license and its registry entry.
- This contract or `HELDYOS_BRIDGE.md`.

A consumer repository **MUST** instead hold: its filled-in connection record, its brand system, its decision log, its briefs, its reviewer outputs, and its reusable-findings staging file.

---

## 12. What may be linked, installed, or copied

Governed entirely by the existing rules in [`README.md`](../README.md) ("Link, vendor, fork, or submodule?" and "Licensing and attribution rules") and each entry's `installation_method` and `status`. Restated as consumer-facing constraints:

| Action | Permitted when |
|---|---|
| **Link** to a registry entry by `id` | Always. This is the default and costs nothing. |
| **Install via the creator's documented method** | Entry status is `approved` and the task matches its `recommended_use`. Human reads the installer first. |
| **Install in an isolated trial project** | Entry status is `experimental`. Never in a production project by default. |
| **Copy an agent spec into `.claude/agents/`** | Always, as a runtime artifact, per §11's exception. |
| **Vendor third-party skill content** | Only if the entry's license permits redistribution *and* the vendoring decision is recorded in the registry. No approved source currently qualifies for consumer-side vendoring — the registry's Phase 4 decision is links and installers only. |
| **Anything with status `candidate`** | Reference and link only. No install. |
| **Anything with status `rejected` or `license-review`** | **MUST NOT** be installed, cited as authority, or copied. |

Hard licensing rules that consumers inherit unchanged:

- A source's license comes from its LICENSE file, never README prose.
- Anthropic's document skills (docx/pdf/pptx/xlsx) are source-available, **not** open source — **MUST NOT** be vendored. Anthropic's design skills are Apache-2.0 and require attribution on redistribution.
- MIT-licensed distillations of third parties' teaching (e.g. `design-motion-principles`) are **link or install only, never vendored** — the distiller's license cannot launder the derivation.
- Freemium sources (`ui-ux-pro-max`) are used within their open tier only.
- Any vendored copy anywhere keeps the upstream LICENSE, a `SOURCE` note (URL + commit), and the creator's name.

**This repository's own license does not touch any of the above.** This repository's original content — `registry.yaml`, the agent specs, this contract, and everything else authored here — is [MIT licensed](../LICENSE). That license:

- **MUST NOT** be read as relicensing any external repository, skill, specification, or source described in `registry.yaml`. Each keeps its own license exactly as recorded in its entry.
- **MUST NOT** be treated as extending to a runtime artifact installed in a consumer project (`.claude/agents/` copies, `npx skills add` installs, plugin-marketplace installs) — those remain governed by their own upstream license, per §11's exception.
- **MUST NOT** be cited to override, narrow, or waive any provenance requirement, attribution requirement, source-available restriction, or vendoring restriction recorded in `registry.yaml` or above. This repository being MIT licensed changes nothing about what may be vendored, installed, or redistributed from any registered source.

---

## 13. Failure behavior when this repository is unavailable

Unavailable means: network failure, the pinned ref cannot be resolved, the repository is private to the current actor, or the connection record points at something that no longer exists.

An agent **MUST**:

1. Say so explicitly, at the top of its output: which resource, which ref, what failed. Silent degradation is the prohibited outcome.
2. Fall back **only** to material already inside the project repository: the connection record, the brand system, the decision log, previously recorded briefs, and any `.claude/agents/` copies with a recorded source ref.
3. Continue to enforce the accessibility floor and the one-opinion-skill rule. Both are restated in every filled-in connection record precisely so they survive this failure.
4. Label all design output produced in this state as **unverified loadout**, and record in the brief that the registry was not reachable and at which ref the local copies were taken.

An agent **MUST NOT**, while this repository is unavailable:

- Install any design skill. Registry status and license cannot be confirmed, so nothing is installable.
- Substitute a source found by web search for a registry entry.
- Invent, reconstruct, or paraphrase-from-memory a registry entry, license, status, or agent spec.
- Change a project's `canonical_ref` or `last_reviewed`.
- Promote a finding back to this repository.

If the project has **no** local record at all, the agent **MUST** stop and report that the project is not integrated, rather than improvise a design process.

---

## 14. Change control for this contract

This contract is versioned by the repository's commit history; there is no separate release train. A change here **MUST** be a normal commit with a message naming what changed for consumers, and **MUST NOT** silently contradict `AGENTS.md`, `README.md`, or `registry.yaml`. Consumers pick up changes only when a human re-reviews and bumps `canonical_ref` (§8).

---

## Related documents

- [`AGENTS.md`](../AGENTS.md) — operating rules for agents (authoritative)
- [`CONSUMER_TEMPLATE.md`](CONSUMER_TEMPLATE.md) — copy-ready `docs/DESIGN_INTELLIGENCE.md`
- [`HELDYOS_BRIDGE.md`](HELDYOS_BRIDGE.md) — HeldyOS / Obsidian boundary and note metadata
- [`../schemas/project-consumer.schema.json`](../schemas/project-consumer.schema.json) — optional machine-readable connection record
- [`../examples/project-consumer.example.yaml`](../examples/project-consumer.example.yaml) — illustrative example
