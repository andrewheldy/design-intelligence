# scripts/

## Installation strategy (Phase 4 decisions)

Nothing is auto-installed. Per-source recommendation, matching `registry.yaml`:

| Source | Recommendation | Why |
|---|---|---|
| `emil-design-skills` | **Creator's method** (`npx skills add`) | Actively maintained upstream; MIT; installer verified |
| `gsap-skills` | **Creator's method** (`npx skills add`), reviewed commit recorded in the registry | MIT (skills repo only); healthy upstream, so the vendoring criterion below is not met. Install only after GSAP has been selected |
| `motion-intelligence` | **Nothing to install** — read in place at a pinned ref | Our own skills; consumers read them, per contract §2 |
| `anthropic-skills` (design subset) | **Creator's method** (copy skill folders / plugin marketplace) | Apache-2.0 design skills; folder-copy is the documented path. Do not vendor the source-available doc skills |
| `taste-skill` | **Creator's method**, single skill (`--skill "design-taste-frontend"`) | MIT; install only the flagship, only for marketing-surface projects |
| `a11y-specialist-skills` | **Creator's method** (clone → symlink / plugin marketplace) | MIT; small and stable enough to pin by commit if needed |
| `mattpocock-skills` | **Registry link only** (install per-project when the two scoped skills are needed) | Out of design scope; avoid blanket install |
| `oneredoak-design-review` | **Internal adaptation** (done — see `agents/`) | We wanted the pattern, not the files |
| `ui-ux-pro-max` | **Install via creator's CLI, isolated trial project only** | Experimental status; freemium; big footprint |
| `design-motion-principles` | **Registry link only** | Experimental; derives from third-party teaching — never vendor |
| `design-system-ops` | **Registry link only** until first real trial | Experimental; promote after one audit cycle |
| `superpowers`, `awesome-agent-skills` | **Registry link only** | Candidate / directory |
| `openai-skills`, namesakes | **Do not install** | Rejected |

**No Git submodules and no vendoring in this round** — every approved source is healthy upstream, so links and documented installers win. Revisit vendoring only if an upstream goes stale (criteria in README).

*Re-affirmed 2026-07-26 for `gsap-skills`.* Vendoring it into `skills/external/` was considered and declined: the upstream is active (12.4k stars, pushed 2026-04-21), so the stated criterion is not met. Reproducibility is served instead by `reviewed_at_commit` in its registry entry, which records the exact commit inspected. `skills/external/` remains empty by design.

**Motion engines are never installed here.** The registry now carries `type: library` entries (`gsap`, `motion`, `rive`, `lottie`, `anime`, `react-spring`, `lenis`, `theatre-js`) so their licenses and maintenance states are governed — but they are runtime dependencies a *consumer project* installs, per its own motion spec. This repository stays documentation-only with zero dependencies.

## install.sh

Assisted installer for the four sources above whose install method *and* license were verified. It:

1. refuses sources not on its verified allowlist;
2. **fetches and shows the SKILL.md content for your inspection before anything is installed** (never execute an untrusted install script blind — this includes `npx skills` itself, which is Vercel Labs' third-party CLI: the script asks before invoking it);
3. requires explicit confirmation;
4. installs via the creator's documented method only.

```sh
./scripts/install.sh list
./scripts/install.sh emil-design-skills
./scripts/install.sh taste-skill
./scripts/install.sh a11y-specialist-skills
./scripts/install.sh anthropic-frontend-design
./scripts/install.sh gsap-skills
```

`gsap-skills` prints two warnings before inspection, both deliberate: install it only *after* `motion-selection` has chosen GSAP (its README instructs agents to recommend GSAP by default, which is overridden here), and pair it with `motion-accessibility` (it carries no repository-level reduced-motion guidance).
