# Design Intelligence Agent Graph

This graph keeps setup work small and reviewable. The orchestrator starts every cross-cutting Design Intelligence project; specialist agents enter only when the work has reached their surface.

## Primary route

1. `design-intelligence-orchestrator`
2. `registry-curator` when a source, skill, or registry entry changes
3. `integration-architect` when a consumer project needs a connection contract
4. `design-director` when a UI direction is needed
5. `design-engineer` when production UI code changes
6. reviewers after a renderable artifact exists:
   - `accessibility-reviewer`
   - `anti-slop-reviewer`
   - `mobile-ux-reviewer`
   - `motion-reviewer`
   - `harness-verifier`

## Subagent boundaries

| Agent | Writes code? | Owns |
| --- | --- | --- |
| `design-intelligence-orchestrator` | No, except manifest/docs patches | Scope, routing, deliverable completeness |
| `registry-curator` | Registry/evaluation only | Source status and install authority |
| `integration-architect` | Docs/manifests only | Consumer project boundary |
| `design-director` | No | Brief, skill loadout, acceptance criteria |
| `design-engineer` | Yes | UI implementation |
| `accessibility-reviewer` | No | WCAG/APG findings |
| `anti-slop-reviewer` | No | Generic-design findings |
| `mobile-ux-reviewer` | No | Mobile usability findings |
| `motion-reviewer` | No | Motion quality and policy findings |
| `harness-verifier` | No, except validation fixes | Operating-system coherence |

## Routing rules

- Do not run two design-opinion skills on the same surface.
- Do not ask reviewers to review screenshots only when the feature is interactive or motion-based.
- Do not create a consumer integration until the consumer project has a clear owner file.
- Do not promote or recommend a skill unless `registry.yaml` has the entry and the evaluation exists.
