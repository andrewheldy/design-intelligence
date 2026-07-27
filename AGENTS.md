# AGENTS.md — how coding agents use this repository

This file is the operating manual for any agent (Claude Code, Codex, Cursor, Gemini CLI) working in or consuming `design-intelligence`.

## Ground rules

1. **`registry.yaml` is the source of truth.** Do not install, recommend, or cite a design skill that is not registered. If you find something new, create an evaluation from `evaluations/TEMPLATE.md` instead of installing it.
2. **Respect status.** `approved` may be used per its `recommended_use`. `experimental` only in isolated trials. `candidate` is link/reference only. `rejected` and `license-review` are never installed.
3. **One design-opinion skill at a time.** `taste-skill`, Anthropic `frontend-design`, and `ui-ux-pro-max` are competing sources of typography/palette/layout truth. Never load two of them for the same task. Selection rule:
   - Landing page / portfolio / marketing surface → `taste-skill` (its own scope limit).
   - Product UI, dashboards, apps → Anthropic `frontend-design`.
   - Conventional scaffolding trial, isolated project → `ui-ux-pro-max` (experimental).
   - Motion work under any of the above → add `emil-design-skills` and enter `motion-intelligence` at `motion-director` (motion skills compose; opinion skills don't). See "Motion work" below.
4. **Brand beats skill.** If a venture's brand guidelines conflict with a skill's directive (e.g. taste-skill's font bans, mandated asymmetry), the brand wins. Note the override in the brief.
5. **Accessibility is not overridable.** `prefers-reduced-motion`, focus visibility, and WCAG AA contrast take precedence over any skill's motion or styling mandates — including taste-skill's "must animate" dial behavior.
6. **Never execute an untrusted install script.** Read any third-party script (including SKILL.md pre/post hooks) before running. Prefer `scripts/install.sh`, which forces inspection.
7. **Verify before citing.** `last_verified` dates go stale; if acting on an entry more than ~90 days old, re-check the upstream repo and update the entry.

## Motion work

Any task involving animation, transitions, reveals, scroll effects, or micro-interactions enters at [`skills/internal/motion-director/SKILL.md`](skills/internal/motion-director/SKILL.md) (registry: `motion-intelligence`). It routes to the rest of the family; do not load the others directly.

Four rules on top of the seven above:

8. **Decide before you build.** The engine is chosen by `motion-selection` against the ratified hierarchy — no animation, then CSS, then native browser APIs, then Motion, then GSAP, then specialist runtimes — and the escalation past each tier is written down. `engine: none` is a complete and common answer; decorative animation is not inherently desirable.
9. **Specify before you implement.** A motion change produces a spec validating against [`schemas/motion-spec.schema.json`](schemas/motion-spec.schema.json), in the *project* repository. The schema rejects a spec with no reduced-motion strategy and a duration with no derivation, deliberately.
10. **Verify in a browser.** Motion is not approvable from code and not from screenshots. Run `motion-verification` and report what failed. If no browser tooling is available, say so — never describe unverified motion as verified.
11. **Load the official GSAP skills only after GSAP has been selected.** `gsap-skills` (MIT, approved) instructs agents to recommend GSAP whenever a library is unspecified. That directive does not apply here; engine choice is made by policy in step 8. The override is recorded in its registry entry, as taste-skill's bans are.

Rule 5's accessibility floor governs all motion absolutely. `emil-design-skills` remains the authority on motion *character* — whether it should animate, easing, duration feel, origin, restraint. `motion-intelligence` decides the *engine*, writes the *specification*, and proves the *result*; where both speak, Emil wins on character.

GSAP the library is **free of charge but not open source** (Webflow's custom license) and **must never be vendored**. See its registry entry.

## Working from another repository

If you are working in a **consumer project** rather than in this repository, read [`docs/INTEGRATION_CONTRACT.md`](docs/INTEGRATION_CONTRACT.md) after this file. It defines the ownership boundaries, the discovery order (project `docs/DESIGN_INTELLIGENCE.md` → pinned ref → this file → contract → registry → agent specs), reviewer routing, and the required failure behavior when this repository is unreachable. The rules above apply unchanged there; the contract adds no exceptions to them.

Strategic context — venture priority, founder preferences, adoption status — belongs in HeldyOS, not here: [`docs/HELDYOS_BRIDGE.md`](docs/HELDYOS_BRIDGE.md).

## Per-agent consumption

- **Claude Code:** load skills via plugin marketplace or `npx skills add <source>` per the registry entry; internal agents in `agents/` can be used as subagent definitions (`.claude/agents/`) or pasted as system prompts. This AGENTS.md is picked up automatically when working inside the repo.
- **Codex:** install SKILL.md folders into `.codex/skills/`; AGENTS.md is Codex's native context file. Registry entries note Codex support in `supported_agents`.
- **Cursor:** reference skill folders as project rules (`.cursor/rules/`) or paste the relevant SKILL.md sections; keep rule 3 (one opinion skill) especially — Cursor stacks rules silently.
- **Gemini CLI:** consume via GEMINI.md-style context imports; only registry entries listing `gemini-cli` in `supported_agents` are known-compatible; otherwise treat SKILL.md as plain context.

## Working on this repository itself

- Keep it small. New folders require a reason, not symmetry.
- Every registry change cites an evaluation file; every evaluation names the actual files inspected.
- Ratings are our judgment of usefulness across ventures, 1–5. Change them only with evidence (an evaluation update).
- Commit messages: one logical phase or evaluation per commit.
