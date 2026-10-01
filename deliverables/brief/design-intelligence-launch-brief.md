# Design Intelligence Launch Brief

Date: August 20, 2026

## Recommendation

Treat Design Intelligence as a governed operating layer, not a pile of prompts. The project now has a clear route from request to authority selection, subagent routing, implementation, review, and artifact delivery.

## What exists now

- A source-of-truth registry for approved, experimental, candidate, rejected, and license-review design sources.
- A first-pass orchestrator for deciding the right agent and skill route.
- Specialist subagents for registry curation, consumer integration, implementation review, accessibility, mobile UX, anti-slop review, motion review, and harness verification.
- Non-secret connection records for Google Drive, Sites, and browser verification.
- A local harness that checks the operating layer before handoff.
- Brief artifacts for quick sharing: Google Doc, PDF, and HTML site.

## How to use it

1. Start with `agents/design-intelligence-orchestrator.md` for setup or package requests.
2. Use `registry.yaml` before recommending or installing any design skill.
3. Use `agents/AGENT_GRAPH.md` to pick subagents.
4. Use `connections/design-intelligence.connections.json` to understand connector boundaries.
5. Run `harness/validate.mjs` before shipping a structure change.

## Boundaries

- Do not stack competing design-opinion skills.
- Do not copy the registry into consumer projects.
- Do not store credentials in connection files.
- Do not call a document, PDF, frontend, or motion artifact verified until its medium-specific check has run.

## Next useful step

Use this structure as the default package shape for future Design Intelligence work, then promote only the pieces that survive real project use.
