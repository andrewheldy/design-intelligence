---
name: motion-react
description: Implements tier 3 of the motion hierarchy with Motion (formerly Framer Motion) for React — animated unmount via AnimatePresence, automatic layout animation, shared-element morphs with layoutId, gesture springs, plus RSC boundaries, hydration, and cleanup. Use once motion-selection has chosen motion-react.
---

# Motion for React

Tier 3. Chosen when **React's lifecycle owns the problem** — not because the project uses React.

> **Licensing note.** The Motion library is MIT (registry id `motion`). Motion's *official* AI skills are part of the paid **Motion+** subscription and are therefore not installable, vendorable, or redistributable under this repository's rules. This skill is authored from the MIT library and Motion's public documentation. If you hold a Motion+ subscription, use their skills directly in your own environment — do not copy their content here.

## When Motion is the right answer

Only these gates justify tier 3:

- An element must animate **as it unmounts** — React removes it from the DOM before CSS can transition it (`AnimatePresence`)
- Layout changes must animate **automatically**, without hand-authoring from/to values (`layout`)
- A **shared element** must morph across components or routes (`layoutId`)
- A **gesture** drives a spring continuously (drag, pan, pull-to-refresh)

**Not a gate:** "the project already uses React." A CSS transition inside a React component is still a CSS transition, and is still the better answer. Verify the gate before importing.

## Import surface

```jsx
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from 'motion/react';
```

`framer-motion` is still published at the same version and is not deprecated, but `motion` is the current package name. Do not mix both in one project.

## Reduced motion — set it once, at the root

```jsx
<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```

This is the safer default than per-component `useReducedMotion()`, because it cannot be forgotten in a component written later. It disables transform and layout animations while leaving opacity and colour — which is `opacity-only` in the vocabulary of `motion-accessibility`.

Use `useReducedMotion()` on top when a specific effect needs a different strategy:

```jsx
const reduce = useReducedMotion();
<motion.div animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }} />
```

Motion's reduced-motion support is the strongest of any engine reviewed — which does not make it automatic. `MotionConfig` still has to be mounted.

## The four capabilities

### 1. Animated unmount — `AnimatePresence`

The capability native CSS genuinely cannot provide.

```jsx
<AnimatePresence initial={false} mode="popLayout">
  {items.map(item => (
    <motion.li
      key={item.id}                        // stable key — required, not decorative
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
    />
  ))}
</AnimatePresence>
```

- **Keys must be stable and unique.** Index keys break exit animations in exactly the case they matter — reordering.
- `initial={false}` suppresses the entrance on first mount, so a page load does not animate an already-present list.
- `mode="wait"` when the outgoing element must finish before the incoming starts; `"popLayout"` when siblings should close the gap immediately.
- The child must be a direct descendant of `AnimatePresence` for `exit` to be detected.

### 2. Automatic layout animation — `layout`

```jsx
<motion.div layout transition={{ type: 'spring', visualDuration: 0.3, bounce: 0.2 }} />
```

- Animates layout changes without authored from/to values.
- **Text content distorts** during layout animation — apply `layout` to the container, and `layout="position"` to text children.
- Every `layout` element measures on every render in its subtree. On a long list this is a real cost; scope it.
- `LayoutGroup` when siblings must measure together.

### 3. Shared-element morph — `layoutId`

```jsx
{isOpen ? <motion.div layoutId="card-1" className="detail" />
        : <motion.div layoutId="card-1" className="thumb" />}
```

Exactly one element with a given `layoutId` may be mounted at a time. Two mounted simultaneously produce an undefined morph.

Compare with View Transitions (tier 2): if the morph is between two *page states* rather than two React components, `view-transition-name` is the cheaper answer and does not require this tier.

### 4. Gesture springs

```jsx
const x = useMotionValue(0);
<motion.div drag="x" style={{ x }} dragConstraints={{ left: -100, right: 0 }} dragElastic={0.1} />
```

Sharing a `MotionValue` is what makes a gesture interruptible with correct velocity — the concrete implementation of `interruption: retarget-preserving-velocity` in the spec.

## Springs vs durations

Springs are physical, not timed: `stiffness`, `damping`, `mass`, or the more legible `visualDuration` + `bounce` pair. Use a spring when the motion is gesture- or state-driven and should feel responsive to interruption. Use a duration and a bezier when the effect must land at a predictable moment — for example, coordinating with something that is not a spring.

`bounce: 0` on a spring for UI that should feel precise rather than playful. Bounce on an entrance is a stylistic choice; bounce on a dismissal usually reads as an error.

Record the choice and its character in the spec's `easing` field, which accepts both shapes.

## Server rendering and RSC

- **`motion` components are client components.** Under React Server Components they must sit behind a client boundary. Placing `'use client'` at a page root to make one animation work drags the whole tree client-side — put the boundary at the smallest component that needs it, and record it in `ssr.client_boundary`.
- **`initial` renders on the server.** `initial={{ opacity: 0 }}` means the server-rendered HTML has opacity 0. If hydration is slow or JS fails, the content stays invisible. For above-the-fold content, prefer `initial={false}` or animate from a visible state.
- **Never guard motion behind `useEffect`-only mounting** to avoid hydration warnings — that produces a flash of unstyled content and shifts the layout. Fix the mismatch instead.
- **`layout` measurements are client-only.** The first client frame does the measuring; a layout animation cannot begin server-side.

## Cleanup

- Motion cleans up its own animations when a component unmounts. Do not hand-cancel.
- **You must clean up what you create:** `useMotionValueEvent` subscriptions, manual `.on()` handlers, `animate()` calls started imperatively outside the component lifecycle.
- `useAnimationFrame` loops stop on unmount, but work scheduled inside them into external systems does not.
- On route change, ensure `AnimatePresence` unmounts rather than being torn down with its children still animating — otherwise exits are skipped and the next route's entrance overlaps.

## Performance

- Motion adds roughly **30–40 KB gzipped** for typical React usage. Record it in `performance_budget.added_bytes_gz`. On a conversion surface, that number alone often fails the budget — return to tier 1.
- `LazyMotion` with a feature bundle reduces the initial payload where only a subset is used.
- Transform and opacity stay on the compositor; `layout` animations do not — they are the main performance risk in this tier.
- Do not put `layout` on every item of a long list.

## What this skill does not do

Timelines with dependent offsets, scroll scrubbing and pinning, SVG morphing → **GSAP** (registry `gsap-skills`). If both engines are in one project, record `selection_rationale.layer_ownership`; **both animating the same element is a defect.**

Easing character and duration feel → **`emil-design-skills`**.

## Output contract

Working implementation, the `MotionConfig`/`useReducedMotion` strategy, the client boundary named, the hydration behaviour of any `initial` state, cleanup notes for anything manually subscribed, and the measured byte cost.
