# AGENTS.md — how coding agents use this repository

This file is the operating manual for any agent (Claude Code, Codex, Cursor, Gemini CLI) working in or consuming `design-intelligence`.

## Ground rules

1. **`registry.yaml` is the source of truth.** Do not install, recommend, or cite a design skill that is not registered. If you find something new, create an evaluation from `evaluations/TEMPLATE.md` instead of installing it.
2. **Respect status.** `approved` may be used per its `recommended_use`. `experimental` only in isolated trials. `candidate` is link/reference only. `rejected` and `license-review` are never installed.
3. **One design-opinion skill at a time.** `taste-skill`, Anthropic `frontend-design`, and `ui-ux-pro-max` are competing sources of typography/palette/layout truth. Never load two of them for the same task. Selection rule:
   - Landing page / portfolio / marketing surface → `taste-skill` (its own scope limit).
   - Product UI, dashboards, apps → Anthropic `frontend-design`.
   - Conventional scaffolding trial, isolated project → `ui-ux-pro-max` (experimental).
   - Motion work under any of the above → add `emil-design-skills` (motion skills compose; opinion skills don't).
4. **Brand beats skill.** If a venture's brand guidelines conflict with a skill's directive (e.g. taste-skill's font bans, mandated asymmetry), the brand wins. Note the override in the brief.
5. **Accessibility is not overridable.** `prefers-reduced-motion`, focus visibility, and WCAG AA contrast take precedence over any skill's motion or styling mandates — including taste-skill's "must animate" dial behavior.
6. **Never execute an untrusted install script.** Read any third-party script (including SKILL.md pre/post hooks) before running. Prefer `scripts/install.sh`, which forces inspection.
7. **Verify before citing.** `last_verified` dates go stale; if acting on an entry more than ~90 days old, re-check the upstream repo and update the entry.

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
