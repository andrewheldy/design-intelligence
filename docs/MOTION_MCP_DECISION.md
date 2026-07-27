# MCP Decision Record — Motion Intelligence

**Status:** decided · **Decision:** do not build an MCP server · **Date:** 2026-07-26
**Decided by:** Andrew Heldy · **Evidence:** [`evaluations/2026-07-26-motion-intelligence.md`](../evaluations/2026-07-26-motion-intelligence.md)

Governed by [`INTEGRATION_CONTRACT.md`](INTEGRATION_CONTRACT.md). Where the two differ, the contract wins.

---

## 1. Decision

**No GSAP-specific MCP server, and no internal Design Intelligence MCP server, is built in this phase.**

Two separate proposals were considered and both are declined:

1. **A GSAP MCP server exposing GSAP documentation.** Declined outright. This would be a proxy for static documentation that is already agent-readable — the definition of an MCP server that should not exist.
2. **An internal Design Intelligence MCP server** exposing registry queries and motion operations. Declined *for now*, with a written threshold for revisiting (§5).

This decision does not create a new position. Three normative documents already state that no MCP server exists here:

- [`README.md`](../README.md): *"There is no submodule, package, sync script, or MCP server."*
- [`INTEGRATION_CONTRACT.md`](INTEGRATION_CONTRACT.md) §2: *"no MCP server … Nothing pulls, nothing pushes."*
- [`HELDYOS_BRIDGE.md`](HELDYOS_BRIDGE.md) §1: *"No MCP server, plugin, CLI, or sync script exists in this repository, and this document does not create one."*

Building one would have required amending all three. Nothing in the motion research justified that.

---

## 2. Required capabilities, and what already provides them

Each capability proposed for a motion MCP, tested against the question: **is a server the best mechanism, or merely the most fashionable one?**

| Required capability | Best mechanism | Why not an MCP tool |
|---|---|---|
| **Recommend a motion stack** | **Skill** — [`motion-selection`](../skills/internal/motion-selection/SKILL.md) | The hierarchy is a deterministic policy with no runtime state and no data source. A tool call would return what a file read returns, with a network hop and a server to maintain. Policy in a file is also *reviewable in a diff*; policy behind an API is not. |
| **Retrieve approved motion patterns** | **Repository files at a pinned ref** | Consumers already read this repository at `canonical_ref` (contract §2). The patterns are Markdown. Nothing about serving them dynamically improves them, and serving them dynamically breaks the pinning guarantee that makes a decision reproducible. |
| **Generate a motion brief** | **Skill + schema** — [`motion-director`](../skills/internal/motion-director/SKILL.md) with [`motion-spec.schema.json`](../schemas/motion-spec.schema.json) | Generation is the agent's own work. The schema constrains the output. A server would add a round trip to a task the model performs in context, with the project's brand and constraints — which the server would not have. |
| **Audit a motion specification** | **Any JSON Schema validator** | The schema is standard draft 2020-12. `check-jsonschema`, `ajv`, or six lines of Python validate it. Wrapping a standard validator in a bespoke protocol is strictly worse than using the validator. |
| **Check dependency policy** | **`registry.yaml`, read at a ref** | One YAML file with a license, status and conflicts per entry. Structured, small, greppable, diffable. A query API over 23 entries solves a problem that does not exist. |
| **Compare engines** | **The evaluation matrix** — [`evaluations/2026-07-26-motion-intelligence.md`](../evaluations/2026-07-26-motion-intelligence.md) §2 | The comparison's value is the *verified evidence and the dates on it*, not the query interface. A live comparison endpoint would be less trustworthy, because it would lose the "verified on this date, by this method" provenance that makes the matrix worth anything. |
| **Expose approved motion resources** | **The upstream sources themselves** | GSAP and Motion both publish `llms.txt` at their documentation roots (both verified HTTP 200 on 2026-07-26). Their documentation is already agent-consumable over plain HTTP. A proxy would add staleness, a cache to invalidate, and a second thing to be wrong. |
| **Verify motion in a browser** | **Playwright MCP — an *existing* MCP** | This is the one capability that genuinely needs a live executable connection, and it already has one. The pattern is registered (`oneredoak-design-review`) and [`motion-verification`](../skills/internal/motion-verification/SKILL.md) uses it. **Needing an MCP is not the same as needing to build one.** |

**Result: zero capabilities are unserved.** Every proposed capability is either static knowledge (a skill or a file), a standard operation (schema validation), or already covered by an existing MCP (browser control).

---

## 3. Why a documentation MCP is the wrong shape

The specific proposal — a GSAP MCP server exposing GSAP docs — fails on its own terms:

- **The content is static.** GSAP's documentation changes on GreenSock's release schedule, not per request. Static content behind a dynamic protocol gains nothing and acquires a cache-invalidation problem.
- **The upstream already solved it.** `gsap.com/llms.txt` exists and is served publicly. So does `motion.dev/llms.txt`. The vendors have already done the work of making their docs agent-readable.
- **Official skills already exist and are MIT.** `greensock/gsap-skills` (registry: `gsap-skills`) is eight `SKILL.md` files written by the vendor. Re-serving that content through a server we maintain is duplication with an added failure mode.
- **It would invert the trust model.** This repository's value is that every source is *verified on a date and pinned to a reviewed commit*. A live documentation proxy returns whatever upstream says today, unversioned and unreviewed — the opposite of what `registry.yaml` exists to provide.

---

## 4. Costs avoided

### Maintenance

An MCP server is running software: a package, a version, a release process, a dependency tree, a compatibility surface across MCP clients, and a deprecation path. This repository is currently **25 files of documentation with zero dependencies and no build**, and that is deliberate — it can be read, audited and pinned by a human in an afternoon. A server would make it the first thing here that can *break* rather than merely *go stale*, and staleness is already handled by `last_verified` and the ~90-day rule (`AGENTS.md` rule 7).

### Security

A server that reads consumer repositories to answer questions about them creates a **new trust boundary that the contract does not currently permit**. `INTEGRATION_CONTRACT.md` §2 guarantees that *nothing pulls, nothing pushes* — an agent reads this repository and follows what it reads. A server that ingests project context would need credentials to consumer repositories, would become a place where several ventures' design context is aggregated, and would need its own authorization model, audit log, and incident story.

There is also a subtler risk: an MCP tool returning a recommendation is **not diffable**. Today, a change to the selection hierarchy is a commit a human reviews. Behind a server, the same change ships silently to every consumer at once — which is precisely the automatic-synchronization behaviour §8 of the contract prohibits.

### Correctness

Skills load into the agent's context alongside the project's brand system, exceptions and prior decisions. An MCP tool answers from its own inputs. For a question like *"which motion engine should this surface use?"* — where the answer depends on brand constraints, an exceptions table, an existing dependency graph and a performance budget — **the in-context skill has strictly more information than the tool would.** The server would give more confident answers with less context, which is the worst combination.

---

## 5. Threshold for revisiting

An internal Design Intelligence MCP may be **proposed** — not built — when **at least two** of the following are demonstrably true. Each must be evidenced, not asserted.

1. **An executable operation exists that cannot reasonably be a script in the consumer repository.** Browser verification does not qualify: Playwright MCP already covers it.
2. **A structured query over the registry is needed that a file read cannot answer.** Concretely: the registry exceeds roughly 100 entries, or agents demonstrably need joins across entries, evaluations and consumer records that a human cannot perform by reading.
3. **A cross-repository write with an audit trail is needed.** For example, proposals flowing back from consumers automatically. Today this is a pull request, which is a better audit trail than any server would provide.
4. **At least three consumer repositories are actively integrated and repeating the same lookup**, with evidence that the file-read path is the actual bottleneck — not merely that a tool would feel tidier.

**Additional hard preconditions**, regardless of the count above:

- `README.md`, `INTEGRATION_CONTRACT.md` §2 and `HELDYOS_BRIDGE.md` §1 are amended first, in the same change, with the new trust boundary stated explicitly.
- A security model is written before any code: what it reads, what it stores, whose credentials it holds, and what an incident looks like.
- The versioning and pinning story is answered: how a consumer pins a *server response*, given that contract §8 requires decisions to be reproducible against an immutable ref.
- The server exposes **operations, never documentation**. Any capability that reduces to "return this file's contents" stays a file.

**Zero of the four conditions are met on 2026-07-26.** No consumer repository is integrated yet; the registry holds 23 entries; every motion capability is served by a skill, a file, a standard validator, or an existing MCP.

---

## 6. What was built instead

| Instead of an MCP tool | We built |
|---|---|
| `recommend_motion_stack()` | [`motion-selection`](../skills/internal/motion-selection/SKILL.md) — hierarchy, gates, taxonomy |
| `generate_motion_brief()` | [`motion-director`](../skills/internal/motion-director/SKILL.md) + [`motion-spec.schema.json`](../schemas/motion-spec.schema.json) |
| `audit_motion_spec()` | The schema itself, which rejects unjustified specs, plus [`motion-audit`](../skills/internal/motion-audit/SKILL.md) |
| `check_dependency_policy()` | Registry entries for every engine, with licenses and conflicts |
| `compare_engines()` | The dated research matrix in the evaluation |
| `get_motion_resources()` | Registry `canonical_source` fields, and the vendors' own `llms.txt` |
| `verify_in_browser()` | [`motion-verification`](../skills/internal/motion-verification/SKILL.md) over **Playwright MCP** — an existing server |

---

## Related

- [`INTEGRATION_CONTRACT.md`](INTEGRATION_CONTRACT.md) §2 (no synchronization), §8 (version pinning), §13 (failure behavior)
- [`HELDYOS_BRIDGE.md`](HELDYOS_BRIDGE.md) §1 (no automatic connection)
- [`../evaluations/2026-07-26-motion-intelligence.md`](../evaluations/2026-07-26-motion-intelligence.md) — `llms.txt` availability and the full source evidence
- [`../skills/internal/README.md`](../skills/internal/README.md) — the skill family this decision applies to
