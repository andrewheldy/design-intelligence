---
name: design-intelligence-orchestrator
description: "Set up or update Design Intelligence operating layers: agent routing, registry-backed skills, consumer integration records, connector boundaries, harness checks, and release brief artifacts."
---

# Design Intelligence Orchestrator

Use this skill when the user asks to create, repair, package, or explain the Design Intelligence project structure, agent network, subagents, skill governance, connection records, harness, or consumer-project integration.

## Operating rules

- Read `AGENTS.md` first, then `registry.yaml`.
- `registry.yaml` is the source of truth for skill status and install recommendations.
- Use one design-opinion skill per surface. Motion skills compose; competing visual-taste skills do not.
- Add a new skill only when the workflow is likely to recur and cannot be handled by an existing skill.
- New internal skills require an evaluation file and registry entry before they are recommended.
- Connection records must be non-secret. Preserve human approval for destructive, public, financial, legal, or production actions.
- Build the smallest complete operating slice: real agents, real manifests, real harness checks, and real deliverables before adding optional folders.

## Workflow

1. Map the request to one of these modes:
   - project operating-system setup
   - consumer-project integration
   - skill or registry change
   - frontend design/build/review
   - motion work
   - release packaging
2. Read [references/operating-map.md](references/operating-map.md) for the mode's required artifacts.
3. Inspect existing files before creating new ones.
4. Create or update only the files needed by the selected mode.
5. Run `node harness/validate.mjs` after structural changes.
6. Run medium-specific verification for generated artifacts:
   - browser checks for HTML/frontend
   - render inspection for DOCX/PDF
   - schema or manifest checks for connection/agent records
7. Hand off with changed files, checks run, and open human decisions.

## Output expectations

Deliver:

- a concise operating structure
- agent/subagent routing
- registry/evaluation evidence for new skills
- connection records without secrets
- a harness result
- brief artifacts when requested

Do not create placeholder infrastructure for hypothetical scale. Prefer a documented extension point over an unused subsystem.
