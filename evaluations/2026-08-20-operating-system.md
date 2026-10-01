# Evaluation: Design Intelligence Operating System

**Date:** 2026-08-20 · **Evaluator:** Codex · **Proposed status:** approved

## Identity (all required - no README claims accepted at face value)
- Canonical repo/page (how was canonicity confirmed?): This repository, `design-intelligence`, inspected directly in the working tree.
- Creator (real identity if verifiable; otherwise say "handle only"): Andrew Heldy / Design Intelligence, first-party internal content.
- License (from LICENSE file / sidebar, not README prose): MIT, from this repository's `LICENSE`.
- Install method (exact command): None. Read in place at a pinned ref per `docs/INTEGRATION_CONTRACT.md`; optional manual copy of `skills/internal/design-intelligence-orchestrator`.
- Supported platforms: Codex, Claude Code, Cursor, Gemini CLI, and SKILL.md-compatible agents.

## Inspection
- Files actually read (list paths - a SKILL.md must be read in full): `AGENTS.md`, `README.md`, `registry.yaml`, `agents/*.md`, `docs/INTEGRATION_CONTRACT.md`, `evaluations/TEMPLATE.md`, `skills/internal/design-intelligence-orchestrator/SKILL.md`.
- What it concretely does (rules, scripts, data - not its pitch): Adds an orchestrator skill, operating agents, agent graph, connection records, schemas, harness manifests, scenarios, and a validation script for project setup and package handoff.
- Substantive or thin? Evidence: Substantive. It defines reusable routing, source-of-truth boundaries, harness checks, connector safety, and release-package expectations, and can be validated by `harness/validate.mjs`.

## Fit
- Category & overlap with existing registry entries: Internal governance and orchestration. It complements Motion Intelligence and the existing reviewer agents; it is not a competing visual-design opinion skill.
- Conflicts (absolute directives, competing sources of truth): Must not override `registry.yaml`, `AGENTS.md`, accessibility rules, or the one-opinion-skill rule. Does not authorize production publishing or secret storage.
- Useful vs marketing verdict: Useful. It converts project setup requests into a consistent, harnessed operating layer without creating a new platform.

## Decision
- Status: approved
- Installation recommendation: internal adaptation
- Justification (2-3 sentences): This is first-party repository governance that closes a real gap between registry entries, agents, skills, connection records, and generated deliverables. It is approved because the repository owns it, the boundaries are explicit, and the harness can detect missing structure before handoff.
