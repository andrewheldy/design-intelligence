# skills/internal/

Skills authored in this repository. Our own content, covered by the repository's [MIT LICENSE](../../LICENSE). Every skill here has a `registry.yaml` entry (`skills/README.md`).

Authoring bar: Anthropic's `spec/` + `template/` in [anthropics/skills](https://github.com/anthropics/skills), and Matt Pocock's `writing-great-skills` (registry: `mattpocock-skills`).

## Motion Intelligence

Registry id: **`motion-intelligence`** · status `approved` · review 2026-10-26.

Eight skills covering the path from "should this move?" to browser-verified. **Enter through `motion-director`** — it routes to the rest, and the rest assume its ordering.

| Skill | Owns |
|---|---|
| [`motion-director`](motion-director/) | Entry point. Workflow, routing, spec-before-code, verify-before-done |
| [`motion-selection`](motion-selection/) | Should this animate; semantic purpose; the ratified engine hierarchy and escalation gates |
| [`native-web-motion`](native-web-motion/) | Tiers 1–2: CSS, WAAPI, View Transitions, scroll-driven, and their fallbacks |
| [`motion-react`](motion-react/) | Tier 3: Motion for React — unmount, layout, `layoutId`, gesture springs, RSC |
| [`motion-accessibility`](motion-accessibility/) | The non-overridable floor: reduced motion, vestibular triggers, focus and keyboard |
| [`motion-performance`](motion-performance/) | Compositor path, per-surface budgets, CLS/INP, measurement |
| [`motion-verification`](motion-verification/) | Browser proof: workflow, 30+ check definitions, Playwright template |
| [`motion-audit`](motion-audit/) | Review procedure: spec vs implementation vs browser evidence |

Tier 4 (GSAP) has **no internal skill** by design — the official GreenSock skills are used instead (registry: `gsap-skills`, MIT, link + installer). Tier 5 runtimes (Rive, Lottie) use vendor documentation plus `motion-accessibility` and `motion-performance`.

### What these skills are not

They are **not an opinion skill**. They never compete with `taste-skill`, Anthropic `frontend-design`, or `ui-ux-pro-max` for typography, palette or layout truth, and they compose freely with whichever one is active (`AGENTS.md` rule 3).

They do **not** replace `emil-design-skills`, which remains the registered authority on motion *character* — whether it should animate, easing, duration feel, origin, restraint. This family decides the **engine**, writes the **specification**, and proves the **result**. Where both speak, Emil wins on character and this family wins on engine choice, specification and verification.

### Supporting artifacts

- [`schemas/motion-spec.schema.json`](../../schemas/motion-spec.schema.json) — the specification format
- [`examples/`](../../examples/) — three worked fixtures selecting three different engines
- [`docs/MOTION_MCP_DECISION.md`](../../docs/MOTION_MCP_DECISION.md) — why no MCP server was built
- [`evaluations/2026-07-26-motion-intelligence.md`](../../evaluations/2026-07-26-motion-intelligence.md) — the evidence behind every decision above
