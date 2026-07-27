# Browser support for native motion features

**Verified 2026-07-26** against `api.webstatus.dev`, the authoritative source for Baseline status. Re-verify before relying on any row marked *limited* — `AGENTS.md` rule 7 applies to this file as much as to a registry entry.

## Baseline status

| Feature | Baseline | Chrome | Safari | Firefox |
|---|---|---|---|---|
| `prefers-reduced-motion` | **widely** (high 2022-07-15, low 2020-01-15) | 74 (2019-04) | 10.1 (2017-03) | 63 (2018-10) |
| CSS transitions / keyframes | widely | — | — | — |
| Web Animations API | widely | 84 (2020) | 13.1 | 75 |
| View transitions (same-document) | **newly** — 2025-10-14 | 111 (2023-03-07) | 18 (2024-09-16) | 144 (2025-10-14) |
| Cross-document view transitions | **limited** | 126 (2024-06-11) | 18.2 (2024-12-11) | **none** |
| Scroll-driven animations | **limited** | 115 (2023-07-18) | 26 (2025-09-15) | **none** |

## What the statuses mean

- **widely** — available across all major browsers for at least 30 months. Use freely.
- **newly** — available in all major browsers, but recently. Usable, with attention to the floor your project supports; a fallback is cheap insurance.
- **limited** — missing from at least one major browser. **Progressive enhancement only.** Never load-bearing.

## Consequences for policy

**1. Reduced motion has no excuse.** Available in every major browser for years — Safari since 2017. An animation shipped without a reduced-motion branch is a defect, never a compatibility trade-off.

**2. Same-document View Transitions are usable.** Baseline as of 2025-10-14. Still wrap in a capability check: the DOM update must happen whether or not the transition runs.

**3. Scroll-driven CSS and cross-document View Transitions need Firefox fallbacks.** Both are missing from Firefox. This is the basis of the conditional-use rule in `motion-selection`: scroll-driven CSS may not be the sole implementation of a scroll effect when Firefox is in scope.

Always pair with `@supports`:

```css
@supports (animation-timeline: scroll()) { /* enhanced */ }
```

Without the guard, a non-supporting browser can be left holding the animation's start state — typically `opacity: 0` — which shows the user nothing at all. This failure mode is worse than having no animation, and it is why the guard is mandatory rather than advisory.

## Re-verification

```sh
curl -s https://api.webstatus.dev/v1/features/scroll-driven-animations   | python3 -m json.tool | head -30
curl -s https://api.webstatus.dev/v1/features/cross-document-view-transitions | python3 -m json.tool | head -30
```

Firefox support for scroll-driven animations is the single most likely change to relax current policy — there is an open developer-signals request with 56 upvotes. Check it each verification cycle and update `motion-selection`'s conditional-use rule if it lands.
