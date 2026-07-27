# examples/

Illustrative, **non-authoritative** filled-in records. Every file here carries an `EXAMPLE ONLY` header and invented values — projects, paths, owners, dates and metrics do not describe real products. Their purpose is to exercise every field of a schema and to show the shape of a good record.

The authoritative record for a project lives in **that project's** repository (`INTEGRATION_CONTRACT.md` §3, §11).

## Connection record

| File | Schema |
|---|---|
| [`project-consumer.example.yaml`](project-consumer.example.yaml) | [`schemas/project-consumer.schema.json`](../schemas/project-consumer.schema.json) |

## Motion specification fixtures

Three fixtures validating against [`schemas/motion-spec.schema.json`](../schemas/motion-spec.schema.json). They are also the **self-test for `motion-selection`**: three genuinely different problems must produce three different engines. If a change to the hierarchy ever collapses them onto one engine, the hierarchy has stopped discriminating and the change is wrong.

| Fixture | Scenario | Engine | The gate that decided it |
|---|---|---|---|
| [`motion-spec.dashboard.example.yaml`](motion-spec.dashboard.example.yaml) | React dashboard, layout and state transitions | **`motion-react`** | Filtering **unmounts** rows — React removes them before CSS can run. Reorder distances are unknown at author time. |
| [`motion-spec.editorial.example.yaml`](motion-spec.editorial.example.yaml) | Editorial landing page, coordinated choreography | **`gsap`** | **Dependent** timing offsets across five elements, plus scroll **scrub and pin**. Scroll-driven CSS rejected on verified Firefox support, not preference. |
| [`motion-spec.conversion.example.yaml`](motion-spec.conversion.example.yaml) | Conversion interface, restrained feedback | **`css-transition`** | **No gate passed.** Discrete state change, author-time values. 0 KB budget on a payment path. |

### What each fixture is meant to demonstrate

**Dashboard** — that a React project does not automatically justify a React animation library. The gate is React's *lifecycle*, and the spec says so explicitly. It also shows a legitimate `compositor_only: false` with its cost accepted and bounded (50 rows, then virtualize).

**Editorial** — that escalating two tiers is correct when the gates are genuinely passed, and that a lower tier can be rejected on **verified support data** rather than taste. It carries the heaviest budget (62 KB measured), the fullest vestibular review, and the `strategy: none` reduced-motion case where the static state must be the authored default.

**Conversion** — that `selection_rationale` is worth filling in even when the answer is tier 1, and that "no escalation" is a decision with a record. It also shows a *narrow, justified* single-feature escalation to WAAPI inside an otherwise-CSS spec, documented specifically so a future contributor does not reach for a library instead.

### Validating a spec

```sh
python3 -m pip install jsonschema pyyaml
python3 - <<'PY'
import json, yaml
from jsonschema import Draft202012Validator
schema = json.load(open('schemas/motion-spec.schema.json'))
doc = yaml.safe_load(open('examples/motion-spec.dashboard.example.yaml'))
errs = sorted(Draft202012Validator(schema).iter_errors(doc), key=lambda e: e.path)
print('valid' if not errs else [f'{list(e.path)}: {e.message}' for e in errs])
PY
```

The schema deliberately rejects more than malformed data. It also rejects **unjustified** data: a missing `reduced_motion`, `end_state_preserved: false`, a duration with no `derivation`, an escalation with no `rejected_alternatives`, and a bare CSS easing keyword all fail validation. That is policy enforcement, not shape checking, and it is intentional.
