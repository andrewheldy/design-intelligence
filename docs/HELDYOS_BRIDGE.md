# HeldyOS / Obsidian Bridge

**Status:** normative for the boundary, proposed for the note schemas · **Version:** 1 · **Last updated:** 2026-07-26

This document defines the boundary between the canonical `design-intelligence` repository, HeldyOS (the Obsidian second brain), and individual project repositories — and the minimum metadata contract for the Obsidian notes that carry design intelligence into strategic memory.

It is governed by [`INTEGRATION_CONTRACT.md`](INTEGRATION_CONTRACT.md). Where the two differ, the contract wins.

---

## 1. Transfer mechanism — read this first

**There is no automatic connection between this repository and Obsidian.**

- No MCP server, plugin, CLI, or sync script exists in this repository, and this document does not create one. Nothing here consumes a package dependency or a Git submodule, consistent with the README's link/vendor/fork/submodule policy.
- An agent **MUST NOT** assume it can read from or write to an Obsidian vault. It may do so only when a supported access path is explicitly available in the current environment — a local vault path the operator has provided, an Obsidian CLI, a plugin, or an MCP connection — and the operator has said to use it.
- Absent such a path, the agent's deliverable is **note content the human pastes into Obsidian**, produced in the frontmatter format below, with the target note type named. That is the whole mechanism, and it is deliberate.
- Direction of travel is one-way for facts: GitHub is evidence, Obsidian is memory. Obsidian notes **MUST** link to GitHub evidence by URL and ref. GitHub files **MUST NOT** depend on the vault to be understood.

If an agent cannot verify a vault path, it **MUST** say "no vault access — here is the note to paste" rather than claiming a note was created.

---

## 2. Ownership

### Design Intelligence owns (this repository)

- Reusable design agents (`agents/`)
- Design standards and selection rules (`AGENTS.md`)
- Approved external sources, statuses, licenses (`registry.yaml`)
- Evaluation templates and the evidence trail (`evaluations/`)
- Reusable skills (`skills/`)
- Implementation-oriented design guidance that generalizes across ventures

### HeldyOS / Obsidian owns

- Portfolio relationships — which ventures exist, how they relate
- Venture context — stage, audience, market, priority
- Founder preferences — taste, standing directives, what has been tried
- Strategic reasoning — why a venture gets design attention now
- Decisions and their rationale, where the rationale spans more than one repository
- Adoption status — which project uses which agents and sources, and how well it went
- Evaluation summaries — the *so what*, linking to the evaluation file for the evidence
- Lessons learned across ventures
- Links to GitHub evidence

HeldyOS **MUST NOT** become the source of truth for a registry status, a license, or an agent spec. It summarizes and links; the repository decides.

### Individual project repositories own

- Product-specific code
- Current brand implementation
- Project-specific design constraints
- Screenshots and implementation evidence
- Local design decisions
- Accepted exceptions
- The filled-in `docs/DESIGN_INTELLIGENCE.md` connection record

### Boundary tests

Use these when it is unclear where something belongs:

| Ask | If yes |
|---|---|
| Would this hold for a different venture with a different brand? | Design Intelligence |
| Is this a reason, a priority, or a preference rather than a rule? | HeldyOS |
| Does it reference a file, component, or screenshot in one codebase? | Project repository |
| Is it a license, status, or install method? | Design Intelligence (`registry.yaml`), never duplicated elsewhere |
| Is it "which venture should get this next"? | HeldyOS, never here |

---

## 3. Minimum metadata contract

Every design-related Obsidian note **MUST** carry YAML frontmatter with these fields, regardless of type:

```yaml
---
type: <one of the six note types below>
title: <human-readable title>
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [design-intelligence]          # at minimum
di_repo: https://github.com/andrewheldy/design-intelligence
di_ref: <commit SHA, tag, or "registry v1 (2026-07-26)">
---
```

Rules:

- `di_ref` **MUST** be concrete. A note that says "as of main" is undated memory and cannot be trusted later.
- Dates **MUST** be absolute (`2026-07-26`), never relative ("last week").
- Any claim about a registry status, license, or agent behavior **MUST** carry a link to the file in this repository at `di_ref`.
- A note **MUST NOT** paste a registry entry, an agent spec, or an evaluation file in full. Summarize and link (contract §11).
- Wiki-links between notes are encouraged; the frontmatter fields below are what makes them queryable.

---

## 4. Proposed note types

These schemas are **proposed**, not enforced — nothing in this repository validates a vault. Adopt them in HeldyOS as-is or adjust there; if they change, update this file so the two do not silently diverge.

All six inherit the common fields in §3.

### 4.1 `design-intelligence-hub`

One note per vault. The entry point that links everything else.

| Field | Required | Notes |
|---|---|---|
| `type` | ✅ | `design-intelligence-hub` |
| `di_repo`, `di_ref` | ✅ | Common fields |
| `registry_version` | ✅ | `version` + `updated` from `registry.yaml` at `di_ref` |
| `last_repo_review` | ✅ | Date a human last read the canonical repo end to end |
| `active_projects` | ✅ | List of links to `design-intelligence-adoption` notes |
| `agent_specs` | ➖ | List of agent ids available at `di_ref` |
| `open_questions` | ➖ | Free list |
| `next_review_due` | ➖ | Date |

### 4.2 `design-intelligence-adoption`

One note per project repository. The HeldyOS mirror of that project's connection record — **summary and status only**, never a copy.

| Field | Required | Notes |
|---|---|---|
| `type` | ✅ | `design-intelligence-adoption` |
| `project_id` | ✅ | Matches `project_id` in the project's connection record |
| `project_name` | ✅ | |
| `repository_url` | ✅ | |
| `integration_doc` | ✅ | URL to that repo's `docs/DESIGN_INTELLIGENCE.md` |
| `status` | ✅ | `planned` · `active` · `paused` · `archived` |
| `di_ref` | ✅ | The ref *that project* last reviewed against |
| `last_reviewed` | ✅ | Date |
| `applicable_agents` | ✅ | Agent ids in use |
| `applicable_registry_entries` | ✅ | Registry `id`s in use |
| `owner` | ✅ | Person accountable |
| `adoption_health` | ➖ | `healthy` · `drifting` · `stale` · `blocked` — founder's judgment, not a computed value |
| `open_exceptions` | ➖ | Count or list of exception ids |
| `evidence` | ➖ | Links to PRs, briefs, review outputs in the project repo |
| `notes` | ➖ | Why this project is at this level of design investment — strategy lives here, not in the repo |

### 4.3 `design-evaluation`

The strategic summary of a source evaluation. The evidence stays in `evaluations/` in this repository.

| Field | Required | Notes |
|---|---|---|
| `type` | ✅ | `design-evaluation` |
| `source_id` | ✅ | Registry `id` |
| `source_name` | ✅ | |
| `canonical_source` | ✅ | Upstream URL |
| `registry_status` | ✅ | `candidate` · `approved` · `experimental` · `rejected` · `license-review` — copied from the registry at `di_ref`, and stale by definition after that |
| `evaluation_file` | ✅ | Link to `evaluations/YYYY-MM-DD-<name>.md` at `di_ref` |
| `evaluated_on` | ✅ | Date |
| `verdict_summary` | ✅ | One or two sentences — the *so what* |
| `license` | ➖ | Informational only; `registry.yaml` is authoritative |
| `rating` | ➖ | 1–5, mirrors the registry |
| `used_by` | ➖ | Links to adoption notes |
| `revisit_after` | ➖ | Date — `last_verified` goes stale at ~90 days |

### 4.4 `design-decision`

A decision whose rationale spans more than one repository, or that the founder wants remembered. Project-local decisions stay in the project's decision log.

| Field | Required | Notes |
|---|---|---|
| `type` | ✅ | `design-decision` |
| `decision_id` | ✅ | Stable slug |
| `decided_on` | ✅ | Date |
| `decided_by` | ✅ | Person |
| `scope` | ✅ | `portfolio` · `venture` · `project` |
| `projects` | ✅ | Affected project ids (may be one) |
| `decision` | ✅ | One sentence, imperative |
| `rationale` | ✅ | Why — the part that does not survive in a diff |
| `outcome` | ✅ | `accepted` · `rejected` · `superseded` |
| `supersedes` | ➖ | Link to a prior decision note |
| `related_sources` | ➖ | Registry `id`s |
| `evidence` | ➖ | GitHub URLs at a ref |
| `review_by` | ➖ | Date |

A **rejected recommendation** that recurs across ventures belongs here with `outcome: rejected`. A rejection specific to one project belongs in that project's decision log and, if standing, its exceptions table.

### 4.5 `reusable-pattern-candidate`

Something observed in a project that might generalize. The staging area before a proposal is opened against this repository (contract §9).

| Field | Required | Notes |
|---|---|---|
| `type` | ✅ | `reusable-pattern-candidate` |
| `candidate_id` | ✅ | Stable slug |
| `observed_in` | ✅ | Project id(s) |
| `observed_on` | ✅ | Date |
| `pattern` | ✅ | What the pattern is, in one or two sentences |
| `generalizes` | ✅ | `yes` · `no` · `unclear` — would it hold for a different brand? |
| `proposal_status` | ✅ | `noted` · `drafted` · `proposed` · `accepted` · `declined` |
| `target` | ➖ | `agents/<file>` · `registry.yaml` · `skills/internal/` |
| `proposal_url` | ➖ | PR or issue URL once opened |
| `evidence` | ➖ | GitHub URLs at a ref |

`generalizes: no` is a valid, useful terminal state — record it so it is not re-proposed.

### 4.6 `internal-skill-candidate`

A pattern that has proven out enough to be worth authoring as a skill in `skills/internal/`.

| Field | Required | Notes |
|---|---|---|
| `type` | ✅ | `internal-skill-candidate` |
| `skill_slug` | ✅ | Proposed folder name |
| `problem` | ✅ | What an agent does badly without it |
| `proven_in` | ✅ | Project ids where the pattern already worked, with evidence links |
| `status` | ✅ | `idea` · `drafting` · `proposed` · `registered` · `declined` |
| `overlaps` | ➖ | Existing registry `id`s it would duplicate — checked before drafting |
| `authoring_bar` | ➖ | Confirmation that Anthropic `spec/`+`template/` and `writing-great-skills` were followed (`skills/README.md`) |
| `registry_entry` | ➖ | `id` once registered — nothing lands in `skills/` without a registry entry |

---

## 5. Consistency rules between vault and repository

- A note's `registry_status`, `license`, or `rating` is a **snapshot at `di_ref`**. When they disagree with the repository, the repository is right and the note is stale.
- Updating a note **MUST NOT** be treated as updating the registry. Registry changes go through an evaluation and a commit here (`AGENTS.md`).
- Promotion of a `reusable-pattern-candidate` into this repository **MUST** follow contract §9 — evaluation file or proposed diff, opened as a PR or issue. A vault note is not a submission.
- If a project's adoption note and its `docs/DESIGN_INTELLIGENCE.md` disagree, the **project repository** is right for anything mechanical (paths, refs, agents, entries); the **vault** is right for anything strategic (why, priority, health).

---

## Related documents

- [`INTEGRATION_CONTRACT.md`](INTEGRATION_CONTRACT.md) — the consumer contract (authoritative)
- [`CONSUMER_TEMPLATE.md`](CONSUMER_TEMPLATE.md) — copy-ready project connection record
- [`../AGENTS.md`](../AGENTS.md) — operating rules for agents
- [`../schemas/project-consumer.schema.json`](../schemas/project-consumer.schema.json) — machine-readable connection record
