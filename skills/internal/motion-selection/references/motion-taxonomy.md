# Motion taxonomy

Reference for `motion-selection`. Defines the vocabulary the motion spec uses: what motion can communicate, on which surfaces, from which triggers — and how duration is derived rather than prescribed.

---

## 1. Semantic purposes

Every motion communicates one thing. If it communicates two, it is probably two effects and deserves two specs.

### `orient`
**Communicates:** where you are, where you came from, where this fits.
**Recognise it by:** the user would otherwise have to re-read the screen to work out what happened.
**Examples:** a drawer sliding from the edge it will return to; a wizard step moving left as you advance; a route transition that preserves the shared header.
**Typical tier:** 1–2. View Transitions are purpose-built for this.
**Fails when:** the movement has no spatial logic — a panel that slides in from the left and dismisses to the bottom teaches nothing.

### `reveal-relationship`
**Communicates:** this came from that; these two things are the same thing in different places.
**Recognise it by:** two elements that are logically one object across a state change.
**Examples:** a grid thumbnail expanding into a detail hero; a row expanding into an editor; a notification collapsing into a badge.
**Typical tier:** 2–3. `view-transition-name`, Motion's `layoutId`, or GSAP Flip.
**Fails when:** the two elements are not actually related and the motion asserts a connection that does not exist.

### `confirm-action`
**Communicates:** the system received your input.
**Recognise it by:** without it, users repeat the action because nothing acknowledged it.
**Examples:** a button press state; a toggle knob travelling; a save indicator appearing.
**Typical tier:** 1, always. This is the shortest motion on any surface.
**Fails when:** it delays the actual result. Confirmation must not sit between the user and the outcome.
**Note:** this is the one purpose that regularly justifies motion on a *frequent* trigger — but only at the very short end, and it must be suppressible.

### `explain-state-change`
**Communicates:** what changed, and how it got there.
**Recognise it by:** the before and after differ enough that an instant swap reads as a glitch.
**Examples:** list items reflowing after a filter; a chart re-scaling; an item leaving a sorted list.
**Typical tier:** 1–3. Reordering and removal in React is the canonical Motion case.
**Fails when:** many items animate at once and the result is noise rather than explanation. Stagger, or animate only what changed.

### `direct-attention`
**Communicates:** look here, now.
**Recognise it by:** something changed outside the user's current focus and they must know.
**Examples:** an inline error appearing; a toast; a queued item arriving.
**Typical tier:** 1. Brief and local.
**Fails when:** it competes with the user's current task, repeats, or loops. Attention-directing motion that never stops is an accessibility failure (WCAG 2.2.2), not a design choice.

### `express-brand`
**Communicates:** who this product is.
**Recognise it by:** removing it costs personality, not comprehension.
**Examples:** an editorial hero sequence; a signature loading state; a scroll-driven narrative.
**Typical tier:** 4–5, and legitimately so — this is what GSAP timelines and Rive are for.
**Constraint:** allowed on marketing and editorial surfaces; suspect on dashboards; hostile on conversion flows. It must fully collapse under reduced motion without losing information, because it carries none.

### `decorative`
**Communicates:** nothing.
Legal to declare, and declaring it honestly is better than mislabelling it as `express-brand`. On a marketing surface it may be fine. On a dashboard or conversion flow it is a defect. Always reconsider tier 0 first.

---

## 2. Surface classes

Surface sets the restraint level and the performance budget.

| Surface | Motion appetite | Budget | Notes |
|---|---|---|---|
| `marketing` | High | Generous | Highest tolerance for tier 4–5. Still bound by the accessibility floor. |
| `editorial` | High, but reading comes first | Generous | Motion must never fight scrolling or delay text. |
| `product-ui` | Moderate | Tight | Repeated use; every effect is seen hundreds of times. |
| `dashboard` | Low | Tight | Dense, data-first, long sessions. Motion competes with comprehension. |
| `conversion-flow` | Very low | Very tight | Bytes and delay cost money directly. Confirmation feedback only. |
| `mobile-app` | Moderate | Tight | Platform gestures come first; never fight the OS. |
| `internal-tool` | Very low | Loose | Speed beats polish. Users are experts repeating tasks. |

---

## 3. Trigger classes

| Trigger | Frequency it usually implies | Watch for |
|---|---|---|
| `page-load` | once-per-session | Blocking content behind an entrance animation. Content-first, always. |
| `route-change` | occasional | Interruption when a user navigates twice quickly; cleanup of the outgoing route. |
| `hover` | constant | Pointer-only — no touch equivalent. Almost never worth animating on list rows. |
| `focus` | frequent | Focus indicators must appear **instantly**. Never animate the indicator's visibility. |
| `click-or-tap` | frequent–occasional | The strongest case for `confirm-action`. Keep it off the response path. |
| `scroll` | constant | The most abused trigger. Scroll-linked motion must be interruptible and must not hijack. |
| `drag` | occasional | Requires velocity preservation and a real interruption strategy. |
| `state-change` | varies | Programmatic changes may fire in bursts; interruption behaviour is mandatory. |
| `data-arrival` | varies | Never move content under a user's cursor or reading position. |
| `timer` | varies | Anything auto-playing over 5s needs a pause control (WCAG 2.2.2). |

---

## 4. Deriving duration — there are no universal numbers

**This taxonomy deliberately prescribes no duration constants.** Published ranges (including Emil's) describe *character*, not values to paste. A specification that says "300ms because UI transitions are 300ms" has not made a decision.

Derive from five inputs, and write the derivation into `timing.derivation`:

**1. Distance.** Perceived speed is distance over time. An 8px nudge and a 340px slide at the same duration feel like different speeds — the nudge sluggish, the slide frantic. Longer travel earns longer duration, sub-linearly.

**2. Hierarchy depth.** The larger the surface and the higher it sits in the layout, the more time it may take. A full-screen sheet may take roughly twice what an inline chip takes. A whole-page transition takes longer still.

**3. Content amount.** More content arriving needs more time to be read as arriving. Staggering trades total duration for legibility — and past a certain count, the last item's delay becomes the real duration the user feels.

**4. Input method.** Pointer-initiated motion can afford presence; the user is watching the thing they clicked. **Keyboard-initiated motion should generally not animate at all** — a keyboard user has moved on. Touch sits between, but travel distances are shorter and durations should follow.

**5. Purpose.** `confirm-action` is the shortest thing on the surface — it must not sit between input and result. `orient` needs enough time for the spatial relationship to register. `express-brand` may take real time, once, on a surface that has earned it.

**Interactions between inputs:**
- High frequency compresses everything. The same effect on a frequent trigger should be shorter than on a rare one, or absent.
- Exits are usually shorter than entrances — the user has decided; do not make them wait for the decision.
- Enter and exit take different easing families. An entrance should decelerate into place; an exit may accelerate away.

**The check:** if you cannot explain a duration using at least three of the five inputs, you copied it.

---

## 5. Vestibular triggers

These require explicit treatment in `reduced_motion.vestibular_review`. They are not stylistic concerns.

- Large-area movement — anything crossing a substantial share of the viewport
- Parallax — layers moving at different rates
- Zoom or scale on large surfaces
- Spin or rotation
- Scroll hijacking, including smooth-scroll libraries
- Rapid flashing or strobing
- Motion filling the peripheral field

Presence of any of these does not forbid the effect. It requires that reduced motion suppresses it fully, and that the information survives.

---

## 6. Purpose → tier reference

Guidance for the starting point, not a substitute for the escalation gates in `motion-selection`.

| Purpose | Start at | Escalate only when |
|---|---|---|
| `confirm-action` | 1 | Essentially never |
| `direct-attention` | 1 | Essentially never |
| `explain-state-change` | 1 | Elements unmount, or many items reorder |
| `orient` | 1–2 | Two DOM states must morph |
| `reveal-relationship` | 2 | Shared element crosses components/routes |
| `express-brand` | 4 | Dependent offsets, scrub/pin, SVG, canvas |
| `decorative` | 0 | It does not escalate; it gets removed |
