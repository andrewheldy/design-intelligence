# Harness

The harness checks that Design Intelligence's operating layer is internally coherent. It does not replace browser QA, document render QA, or human review; it proves that the project files point to real agents, skills, schemas, and connection records.

Run from the repository root:

```bash
node harness/validate.mjs
```

The harness currently checks:

- required operating-system files exist
- agent manifests point to real agent specs
- scenarios reference real agents
- connection records are non-secret and schema-shaped
- the internal orchestrator skill has a `SKILL.md`, UI metadata, evaluation, and registry entry
