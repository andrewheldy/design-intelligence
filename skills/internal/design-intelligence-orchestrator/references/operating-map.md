# Operating Map

Use the smallest artifact set that satisfies the request.

## Project operating-system setup

Required:

- `agents/design-intelligence-orchestrator.md`
- specialist agents only for real boundaries
- `agents/AGENT_GRAPH.md`
- `docs/OPERATING_SYSTEM.md`
- `connections/design-intelligence.connections.json`
- `harness/agent-manifest.json`
- `harness/connection-manifest.json`
- at least one realistic `harness/scenarios/*.json`
- `harness/validate.mjs`

## Skill or registry change

Required:

- `skills/internal/<skill>/SKILL.md`
- `skills/internal/<skill>/agents/openai.yaml` when UI metadata helps discovery
- `evaluations/YYYY-MM-DD-<name>.md`
- `registry.yaml` entry
- harness pass

## Consumer-project integration

Required:

- project-owned `docs/DESIGN_INTELLIGENCE.md`
- pinned Design Intelligence reference or explicit local path
- selected skill loadout and one-opinion-skill decision
- project-local verification requirements
- human-review gates for unresolved conflicts

Do not copy `registry.yaml` into the consumer project.

## Frontend work

Required:

- design brief from `design-director`
- one opinion skill
- implementation by `design-engineer`
- browser verification
- accessibility, mobile, and anti-slop review

## Motion work

Required:

- `skills/internal/motion-director/SKILL.md`
- motion spec validated against `schemas/motion-spec.schema.json`
- reduced-motion strategy
- browser motion verification
- motion audit

## Release package

Required:

- source artifact in `deliverables/`
- brief document, PDF, or HTML artifacts requested by the user
- manifest or checksum when the package is meant for external distribution
- validation result and unresolved human-review items
