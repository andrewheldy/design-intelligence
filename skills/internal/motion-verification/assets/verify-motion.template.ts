/**
 * Motion verification template — design-intelligence / motion-verification
 *
 * TEMPLATE ONLY. Copy into the CONSUMER project (e.g. tests/motion/) and fill in
 * the CONFIG block. This repository holds no project implementation code
 * (INTEGRATION_CONTRACT.md §1) and installs no dependencies — Playwright is a
 * dependency of the project under test, never of this repository.
 *
 * Check ids map to skills/internal/motion-verification/references/verification-checklist.md.
 * Delete the blocks that do not apply; the applicability table in SKILL.md says which.
 *
 * Run:  npx playwright test tests/motion/verify-motion.spec.ts
 */

import { test, expect, type Page } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — fill in from the motion spec
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  url: '/',                                  // page containing the effect
  trigger: '[data-testid="motion-trigger"]', // element that starts it
  target: '[data-testid="motion-target"]',   // element that moves
  /** The end state that MUST be reached with motion disabled (RM-2). */
  endStateAssertion: async (page: Page) => {
    await expect(page.locator(CONFIG.target)).toBeVisible();
  },
  /** Frame-rate floor for this surface — see motion-performance budgets. */
  minFps: 60,
  /** From the spec's performance_budget.compositor_only. */
  compositorOnly: true,
};

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },   // VP-1
  tablet: { width: 768, height: 1024 },  // VP-2
  desktop: { width: 1440, height: 900 }, // VP-3
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Collect console errors and uncaught exceptions from before first navigation (CON-1). */
function collectConsole(page: Page) {
  const errors: string[] = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  return errors;
}

/** Hydration warnings are console errors with framework-specific wording (SSR-1). */
const isHydrationWarning = (t: string) =>
  /hydrat|did not match|server rendered|text content does not match/i.test(t);

const liveAnimations = (page: Page) =>
  page.evaluate(() => document.getAnimations().length);

const scrollTriggerCount = (page: Page) =>
  page.evaluate(() => (window as any).ScrollTrigger?.getAll?.().length ?? 0);

const hasHorizontalOverflow = (page: Page) =>
  page.evaluate(() => {
    const d = document.documentElement;
    return d.scrollWidth > d.clientWidth + 1; // 1px tolerance for subpixel rounding
  });

/** Cumulative layout shift observed over a window (CLS-1). */
async function measureCLS(page: Page, during: () => Promise<void>) {
  await page.evaluate(() => {
    (window as any).__cls = 0;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) (window as any).__cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await during();
  return page.evaluate(() => (window as any).__cls as number);
}

// ─────────────────────────────────────────────────────────────────────────────
// RM — reduced motion
// ─────────────────────────────────────────────────────────────────────────────
test.describe('reduced motion', () => {
  test('RM-1/RM-2: movement is suppressed AND the end state is still reached', async ({ page, context }) => {
    await context.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(CONFIG.url);
    await page.click(CONFIG.trigger);

    // RM-2 is the check people forget: suppressing the animation must not
    // suppress the outcome. A reduced-motion user who cannot open the panel
    // has been handed an accessibility failure dressed as an accommodation.
    await CONFIG.endStateAssertion(page);

    // RM-1: nothing should still be animating once the interaction settles.
    await page.waitForTimeout(400);
    expect(await liveAnimations(page)).toBe(0);
  });

  test('RM-3: preference change is honoured without a reload', async ({ page, context }) => {
    await page.goto(CONFIG.url);
    await context.emulateMedia({ reducedMotion: 'reduce' });
    await page.click(CONFIG.trigger);
    await page.waitForTimeout(400);
    expect(await liveAnimations(page)).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// A11Y — focus and keyboard
// ─────────────────────────────────────────────────────────────────────────────
test.describe('accessibility', () => {
  test('A11Y-1: focus is never lost to the animation', async ({ page }) => {
    await page.goto(CONFIG.url);
    await page.focus(CONFIG.trigger);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(600);

    const active = await page.evaluate(() => ({
      tag: document.activeElement?.tagName ?? 'NONE',
      inDom: !!document.activeElement && document.body.contains(document.activeElement),
    }));
    expect(active.tag).not.toBe('BODY'); // focus fell through
    expect(active.inDom).toBe(true);     // focus is on a removed element
  });

  test('A11Y-3: keyboard scrolling still works (smooth-scroll libraries only)', async ({ page }) => {
    await page.goto(CONFIG.url);
    const before = await page.evaluate(() => window.scrollY);
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(600);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(before);

    await page.keyboard.press('End');
    await page.waitForTimeout(800);
    const atEnd = await page.evaluate(() =>
      window.scrollY + window.innerHeight >= document.body.scrollHeight - 50);
    expect(atEnd).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CON / SSR
// ─────────────────────────────────────────────────────────────────────────────
test('CON-1 + SSR-1: no console errors and no hydration warnings', async ({ page }) => {
  const errors = collectConsole(page);           // attached BEFORE goto, deliberately
  await page.goto(CONFIG.url);
  await page.click(CONFIG.trigger);
  await page.waitForTimeout(1000);

  expect(errors.filter(isHydrationWarning), 'hydration warnings').toEqual([]);
  expect(errors, 'console errors').toEqual([]);
});

// ─────────────────────────────────────────────────────────────────────────────
// VP / OVF / CLS — viewports
// ─────────────────────────────────────────────────────────────────────────────
for (const [name, size] of Object.entries(VIEWPORTS)) {
  test(`VP/OVF/CLS @ ${name}: completes, no overflow, no layout shift`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto(CONFIG.url);

    // OVF-1 must hold DURING the animation, not only after it settles —
    // off-screen start positions often overflow only mid-flight.
    const cls = await measureCLS(page, async () => {
      await page.click(CONFIG.trigger);
      for (let i = 0; i < 10; i++) {
        expect(await hasHorizontalOverflow(page), `overflow mid-animation @ ${name}`).toBe(false);
        await page.waitForTimeout(50);
      }
    });

    await CONFIG.endStateAssertion(page);
    expect(await hasHorizontalOverflow(page), `overflow after @ ${name}`).toBe(false);
    expect(cls, `CLS @ ${name}`).toBeLessThan(0.1);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// INT — interruption
// ─────────────────────────────────────────────────────────────────────────────
test('INT-1: rapid repeated triggering ends in a stable state', async ({ page }) => {
  const errors = collectConsole(page);
  await page.goto(CONFIG.url);

  for (let i = 0; i < 10; i++) {
    await page.click(CONFIG.trigger, { force: true });
    await page.waitForTimeout(30); // deliberately shorter than the effect
  }
  await page.waitForTimeout(1200);

  expect(errors).toEqual([]);
  expect(await liveAnimations(page), 'animations still running after settle').toBe(0);
  // Compare the resting state against the spec's interruption.behavior.
});

// ─────────────────────────────────────────────────────────────────────────────
// CLEAN — lifecycle
// ─────────────────────────────────────────────────────────────────────────────
test('CLEAN-1/CLEAN-2: nothing accumulates across navigation cycles', async ({ page }) => {
  await page.goto(CONFIG.url);
  await page.waitForTimeout(500);
  const baseAnim = await liveAnimations(page);
  const baseST = await scrollTriggerCount(page);

  for (let i = 0; i < 5; i++) {
    await page.goto('/about');       // any other route
    await page.waitForTimeout(200);
    await page.goto(CONFIG.url);
    await page.waitForTimeout(400);
  }

  // Growth here is the leak signature: invisible after one pass, fatal after twenty.
  expect(await liveAnimations(page), 'stale animation instances').toBeLessThanOrEqual(baseAnim + 1);
  expect(await scrollTriggerCount(page), 'orphaned ScrollTriggers').toBeLessThanOrEqual(baseST);
});

// ─────────────────────────────────────────────────────────────────────────────
// SCR-3 — pinned sections (GSAP ScrollTrigger: mandatory)
// ─────────────────────────────────────────────────────────────────────────────
test('SCR-3: pinned sections release correctly after scroll and resize', async ({ page }) => {
  await page.goto(CONFIG.url);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.setViewportSize(VIEWPORTS.mobile);   // resize mid-pin
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  expect(await hasHorizontalOverflow(page)).toBe(false);
  // Assert the pinned section's box is where the spec says it should be,
  // and that no orphaned pin-spacer was left behind.
});

// ─────────────────────────────────────────────────────────────────────────────
// PERF-1 — frame rate under throttling
// ─────────────────────────────────────────────────────────────────────────────
test('PERF-1: holds the frame floor under 4x CPU throttling', async ({ page, browser }) => {
  test.skip(browser.browserType().name() !== 'chromium', 'CDP throttling is Chromium-only');

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.goto(CONFIG.url);
  await page.evaluate(() => {
    (window as any).__frames = 0;
    const tick = () => { (window as any).__frames++; requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });

  await page.click(CONFIG.trigger);
  await page.waitForTimeout(1000);

  const fps = await page.evaluate(() => (window as any).__frames as number);
  expect(fps, `fps under 4x throttle (floor ${CONFIG.minFps})`).toBeGreaterThan(CONFIG.minFps * 0.8);

  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
});
