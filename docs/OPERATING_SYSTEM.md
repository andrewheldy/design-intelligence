# Design Intelligence Operating System

Design Intelligence is a small governed layer for design quality across Heldy projects. It contains verified skills, agent roles, consumer integration contracts, and harness checks. It is not a package manager, design-token monorepo, or universal automation platform.

## Structure

| Layer | Location | Job |
| --- | --- | --- |
| Registry | `registry.yaml` | Source of truth for skills, workflows, libraries, status, conflicts, and install guidance |
| Evaluations | `evaluations/` | Evidence behind every registry decision |
| Agents | `agents/` | Role specs for direction, implementation, review, integration, and verification |
| Skills | `skills/internal/` | First-party reusable skill instructions |
| Schemas | `schemas/` | Machine-checkable records for motion, consumers, agents, and connections |
| Harness | `harness/` | Local checks that prove the operating layer is coherent |
| Connections | `connections/` | Non-secret connector inventory and setup boundaries |
| Deliverables | `deliverables/` | Briefs, static sites, PDFs, and packaged outputs generated from the project |

## Default workflow

1. Read `AGENTS.md`.
2. Read `registry.yaml` before using or recommending a skill.
3. Use `agents/design-intelligence-orchestrator.md` to scope the work.
4. If the work changes a skill, create an evaluation and update the registry.
5. If the work touches UI, create a brief before implementation and verify in a browser.
6. If the work touches motion, start at `skills/internal/motion-director/SKILL.md`.
7. Run `harness/validate.mjs` before handoff.

## Non-goals

- No automatic vendoring of third-party skills.
- No hidden credential storage.
- No background sync from this repository into consumer projects.
- No competing design philosophy inside consumer projects.
- No production infrastructure unless the user explicitly asks for deployment or hosted services.

## Human-review gates

Human review is required for unresolved license questions, accessibility exceptions, legal or financial claims, production publishing, and brand conflicts that override a registered skill.
