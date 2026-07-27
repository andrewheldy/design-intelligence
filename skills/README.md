# skills/

- `external/` — vendored third-party skills. Empty by design right now: every approved external source is currently consumed via **registry link or the creator's installer** (see Phase 4 recommendations in `registry.yaml` / `evaluations/`). A vendored skill must include the upstream `LICENSE`, a `SOURCE` file (URL + commit hash), and the creator's name.
- `internal/` — skills we author. Follow Anthropic's `spec/` + `template/` in [anthropics/skills](https://github.com/anthropics/skills) and Matt Pocock's `writing-great-skills` as the authoring bar. Currently holds the **Motion Intelligence** family (registry: `motion-intelligence`) — eight skills entered through `motion-director`; see [`internal/README.md`](internal/README.md).
- `experimental/` — trial-stage skills (internal drafts or vendored trials). Anything here is excluded from default agent loading.

No skill lands in any of these folders without a registry entry.

## Licensing

`internal/` skills we author are our own content, covered by this repository's [MIT LICENSE](../LICENSE). `external/` (vendored) and `experimental/` skills that originated upstream are **not** relicensed by living in this repository — each keeps its own upstream `LICENSE` and `SOURCE` note, and stays subject to whatever restriction its registry entry records (freemium tier limits, no-vendor rules, source-available exclusions). This repository's license does not override those restrictions.
