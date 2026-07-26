#!/usr/bin/env bash
# design-intelligence assisted installer.
# Only sources whose installation method AND license were verified (registry.yaml)
# are installable here. The skill content is shown for inspection and explicit
# confirmation is required before anything runs. Never extend this allowlist
# without a completed evaluation in evaluations/.
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: install.sh <source-id> | list

Verified sources:
  emil-design-skills          Emil Kowalski's design-engineering skills (MIT)
  taste-skill                 Leonxlnx design-taste-frontend only (MIT)
  a11y-specialist-skills      masuP9 WCAG 2.2 review skills (MIT)
  anthropic-frontend-design   Anthropic frontend-design skill (Apache-2.0)

Everything else in registry.yaml is link-only, experimental (install manually
per its entry, in an isolated project), or rejected. See scripts/README.md.
EOF
}

confirm() {
  printf '%s [y/N] ' "$1"
  read -r reply
  [ "$reply" = "y" ] || [ "$reply" = "Y" ] || { echo "Aborted."; exit 1; }
}

# Show a skill's SKILL.md for inspection before installing.
inspect() {
  local url="$1"
  echo "── Inspect before install ─────────────────────────────────────────"
  echo "Fetching: $url"
  echo "───────────────────────────────────────────────────────────────────"
  curl -fsSL "$url" | ${PAGER:-less}
  confirm "You have read the skill content above. Proceed with install?"
}

# `npx skills` is Vercel Labs' third-party CLI (github.com/vercel-labs/skills).
npx_skills_notice() {
  echo "This uses the third-party 'skills' CLI by Vercel Labs via npx."
  confirm "Run 'npx skills' now?"
}

case "${1:-}" in
  list|"")
    usage
    ;;

  emil-design-skills)
    inspect "https://raw.githubusercontent.com/emilkowalski/skills/main/skills/emil-design-eng/SKILL.md"
    npx_skills_notice
    npx skills@latest add emilkowalski/skills
    ;;

  taste-skill)
    echo "NOTE: approved for marketing surfaces (landing/portfolio) only — see registry.yaml conflicts."
    inspect "https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/SKILL.md"
    npx_skills_notice
    npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
    ;;

  a11y-specialist-skills)
    inspect "https://raw.githubusercontent.com/masuP9/a11y-specialist-skills/main/README.md"
    dest="${HOME}/.claude/skills/a11y-specialist-skills"
    [ -e "$dest" ] && { echo "Already present at $dest — remove it first to reinstall."; exit 1; }
    confirm "Clone masuP9/a11y-specialist-skills to $dest?"
    git clone --depth 1 https://github.com/masuP9/a11y-specialist-skills "$dest"
    echo "Installed. Pin: $(git -C "$dest" rev-parse --short HEAD)"
    ;;

  anthropic-frontend-design)
    inspect "https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md"
    dest="${HOME}/.claude/skills/frontend-design"
    [ -e "$dest" ] && { echo "Already present at $dest — remove it first to reinstall."; exit 1; }
    confirm "Copy anthropics/skills frontend-design (Apache-2.0) to $dest?"
    tmp="$(mktemp -d)"
    trap 'rm -rf "$tmp"' EXIT
    git clone --depth 1 https://github.com/anthropics/skills "$tmp/anthropic-skills"
    mkdir -p "$dest"
    cp -R "$tmp/anthropic-skills/skills/frontend-design/." "$dest/"
    # Apache-2.0 requires the license text to travel with the copy.
    cp "$tmp/anthropic-skills/skills/frontend-design/LICENSE.txt" "$dest/" 2>/dev/null \
      || cp "$tmp/anthropic-skills/LICENSE" "$dest/LICENSE" 2>/dev/null \
      || echo "WARNING: no license file found to copy — add attribution manually."
    printf 'Source: https://github.com/anthropics/skills (skills/frontend-design)\nCommit: %s\n' \
      "$(git -C "$tmp/anthropic-skills" rev-parse HEAD)" > "$dest/SOURCE"
    echo "Installed to $dest with SOURCE + license."
    ;;

  *)
    echo "Unknown or non-installable source: $1"
    echo "If it's in registry.yaml as experimental/link-only, follow its entry manually."
    usage
    exit 1
    ;;
esac
