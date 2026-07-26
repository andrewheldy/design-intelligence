# skills/

- `external/` — vendored third-party skills. Empty by design right now: every approved external source is currently consumed via **registry link or the creator's installer** (see Phase 4 recommendations in `registry.yaml` / `evaluations/`). A vendored skill must include the upstream `LICENSE`, a `SOURCE` file (URL + commit hash), and the creator's name.
- `internal/` — skills we author. Follow Anthropic's `spec/` + `template/` in [anthropics/skills](https://github.com/anthropics/skills) and Matt Pocock's `writing-great-skills` as the authoring bar. First internal skills will be extracted from `agents/` specs as they prove out in real projects.
- `experimental/` — trial-stage skills (internal drafts or vendored trials). Anything here is excluded from default agent loading.

No skill lands in any of these folders without a registry entry.
