# design-intelligence

A curated, executable library of verified design skills, design-engineering agents, UI review systems, and reusable design principles, shared across ventures.

**This is not a bookmark dump.** Every entry in [`registry.yaml`](registry.yaml) was verified against its live source — repository inspected, license read from the LICENSE file, SKILL.md contents reviewed — before earning a status. Quality over quantity, deliberately small.

This repository's own original content — `registry.yaml`, the specs in `agents/`, the docs in `docs/`, and everything else authored here — is [MIT licensed](LICENSE). That license covers our words and our code; it does not extend to, and does not relicense, any external repository, skill, or source this repository describes or links to. See [`LICENSE`](LICENSE) and "Licensing and attribution rules" below.

## How the repository works

```
registry.yaml        Single source of truth: every known source, its status,
                     license, install method, conflicts, and rating.
skills/
  external/          Vendored copies of third-party skills (only when license
                     and the vendoring decision are recorded in the registry).
  internal/          Skills we author ourselves.
  experimental/      Skills under trial — internal or vendored — not yet
                     cleared for default use.
agents/              Internal agent specifications (reviewers, design roles).
references/          Verified creators, canonical repos, and principle notes.
evaluations/         One file per evaluation round + the evaluation template.
scripts/             install.sh — assisted install for verified sources only.
docs/                Integration contract, consumer template, HeldyOS bridge.
schemas/             JSON Schema for a project's connection record.
examples/            Illustrative (non-authoritative) filled-in records.
```

The **registry is the product**. Folders hold only what has passed through it.

### Skills vs agents vs references vs evaluations

| Thing | What it is | Lives in |
|---|---|---|
| **Skill** | Instructions an agent loads to do a task better (a `SKILL.md` folder). Reusable, tool-agnostic where possible. | `skills/`, or upstream (link-only) |
| **Agent** | A role with a mission, inputs, process, and output contract — typically *consumes* skills. | `agents/` |
| **Reference** | A verified pointer: creator, canonical repo, principle write-up. Nothing executable. | `references/` |
| **Evaluation** | The dated evidence for why a source has its status. | `evaluations/` |

## Lifecycle

```
candidate → (evaluation) → approved | experimental | rejected | license-review
```

1. **Submit a candidate:** copy `evaluations/TEMPLATE.md` to `evaluations/YYYY-MM-DD-<name>.md` and fill in the *Identity* section. A URL with no verification is not a submission.
2. **Evaluate:** complete the template. Non-negotiables: confirm the canonical repo (not a namesake), read the LICENSE file, read the actual SKILL.md — never only the README — and name the overlaps/conflicts with existing entries.
3. **Register:** add the entry to `registry.yaml` with all fields, including an installation recommendation (see below). Rejections are registered too, so we don't re-litigate.
4. **Install (approved only):** follow the entry's `installation_method` / recommendation. `scripts/install.sh` assists for sources whose method and license are verified — and shows you the skill content before installing.

## Link, vendor, fork, or submodule?

| Choose | When |
|---|---|
| **Registry link only** (default) | Source is well-maintained upstream; we consume via the creator's install method. |
| **Creator's documented install** | Actively used in a project; upstream handles updates (`npx skills add …`, plugin marketplace). |
| **Git submodule** | We need version pinning against a moving upstream but no modifications. Costs friction; use sparingly. |
| **Vendored copy + attribution** | Upstream is small/at-risk, license permits redistribution (MIT/Apache-2.0), and we record source commit + license in the vendored folder. Never vendor source-available or unverified-license content. |
| **Fork** | We must modify and track upstream. Last resort. |
| **Internal adaptation** | We want the *pattern*, not the text — rewrite in our own words in `skills/internal/` or `agents/`, crediting the inspiration (e.g. our reviewer agents adapt OneRedOak's design-review loop). |
| **Do not install** | Directories, rejected entries, or anything whose license is unresolved. |

## How coding agents consume this repo

See [`AGENTS.md`](AGENTS.md) — it is written to be loaded directly by Claude Code, Codex, Cursor, and Gemini CLI, and defines skill-selection and conflict rules (short version: **one design-opinion skill at a time**).

## How other repositories consume this repo

[`docs/INTEGRATION_CONTRACT.md`](docs/INTEGRATION_CONTRACT.md) is the contract for external project repositories (Rent With Heldy, The Feed, Miami Roots, SideQuests, and so on): ownership boundaries, discovery order, required consumer files, reviewer routing, how findings travel back, and what happens when this repo is unreachable.

A project integrates by copying [`docs/CONSUMER_TEMPLATE.md`](docs/CONSUMER_TEMPLATE.md) to its own `docs/DESIGN_INTELLIGENCE.md` and filling it in — optionally alongside a machine-readable record validating against [`schemas/project-consumer.schema.json`](schemas/project-consumer.schema.json) ([example](examples/project-consumer.example.yaml)).

**Nothing is synchronized.** There is no submodule, package, sync script, or MCP server: consumers pin a commit, read this repository at that ref, and a human bumps the ref on re-review. The link/vendor/fork/submodule table above governs consumers unchanged.

The boundary with strategic memory — what belongs in HeldyOS/Obsidian rather than here — is in [`docs/HELDYOS_BRIDGE.md`](docs/HELDYOS_BRIDGE.md).

## Licensing and attribution rules

**Repository license vs. registry content.** [`LICENSE`](LICENSE) (MIT) covers this repository's original content only — the registry text, agent specs, docs, schemas, scripts, and evaluations we authored. It is a separate thing from the licenses of the sources the registry *describes*:

- Registering a source in `registry.yaml` — describing it, rating it, recommending an install method — does not relicense that source. Its own license (recorded in the entry's `license` field, from its LICENSE file) governs it, unchanged, forever.
- Any skill or agent spec installed at runtime into a project — via `npx skills add`, a plugin marketplace, or copied into `.claude/agents/` — remains governed by its upstream license, not by this repository's MIT license.
- Any future vendored copy under `skills/external/` keeps the upstream LICENSE; MIT here does not spread to it.
- Source-specific restrictions recorded in `registry.yaml` — freemium tier boundaries, source-available exclusions (Anthropic's document skills), no-vendor rules on third-party distillations — continue to apply in full. This repository's own license does not narrow, waive, or override provenance, attribution, source-available restrictions, or vendoring restrictions on any registered source.

Rules for evaluating and handling those source licenses:

- A source's license comes from its LICENSE file, never from README prose. Unclear → status `license-review`, and it is not installed.
- Vendored copies keep the upstream LICENSE, a `SOURCE` note (URL + commit), and the creator's name. Attribution is preserved even when licenses don't strictly require it.
- MIT-licensed *distillations of other people's teaching* (e.g. third-party summaries of a course) are treated cautiously: link or install, never vendor. The distiller's license can't launder the derivation.
- Anthropic's document skills (docx/pdf/pptx/xlsx) are source-available, not open source — excluded from vendoring; their design skills are Apache-2.0.
- Freemium sources (e.g. UI/UX Pro Max) are used within their open tier only; tier boundaries checked before any redistribution.
- Never run an install script from an external repo without reading it first. `scripts/install.sh` prints skill contents for inspection before any install.

## Status

Initial registry: 13 entries (6 approved, 3 experimental, 2 candidate, 2 rejected). See `evaluations/2026-07-26-initial-research.md` for the full evidence trail.
