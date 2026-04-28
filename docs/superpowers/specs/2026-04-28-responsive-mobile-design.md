# Responsive Mobile Design

**Date:** 2026-04-28  
**Status:** Approved

## Context

Single-file React app deployed via Google Apps Script HtmlService. All styles are inline (`style={{}}`). No build pipeline, no CSS modules, no external framework. Target: make the app usable on phones without breaking desktop.

## Approach

`useIsMobile()` hook + conditional inline style objects. One breakpoint: `≤ 640px`. Hook instantiated once in `App`, passed as prop to components that need it. All browser APIs (`window.innerWidth`, `resize`) are client-side — compatible with GAS.

## Breakpoint

`640px` — single cutoff. Below = mobile, above = desktop. No intermediate breakpoints needed.

## Hook: `useIsMobile()`

```js
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 640);
  useEffect(() => {
    let t;
    const debounced = () => { clearTimeout(t); t = setTimeout(() => setMobile(window.innerWidth <= 640), 100); };
    window.addEventListener('resize', debounced);
    return () => window.removeEventListener('resize', debounced);
  }, []);
  return mobile;
}
```

Debounce 100ms to avoid thrashing on resize. Initialized from current `window.innerWidth` to avoid flash.

## Component Changes

### Header
- **Desktop**: logo + title + rates widget + theme toggle (current behavior, unchanged)
- **Mobile**: logo + title + theme toggle only. Rates widget hidden (`display: 'none'` when `isMobile`).

### RatesBar (new component)
- Only renders when `isMobile && !rates.loading`
- Position: immediately below the sticky header
- Height: ~48px, `background: var(--bg-elevated)`, `borderBottom: '1px solid var(--border)'`
- Content: `UVA $ X | TC Oficial $ Y` centered + `Dato al <fecha>` below in muted text
- Same data from the `rates` prop already available in `App`

### TabBar
- **Desktop**: horizontal button row (current, unchanged)
- **Mobile**: full-width `<select>` element, styled with `var(--bg-input)` / `var(--border)` / `var(--text)`, `marginBottom: 20px`, `padding: 10px 12px`, `borderRadius: var(--radius-sm)`, `fontSize: 14px`. Controlled by the same `active`/`setActive` props.

### SimuladorTab
- **Desktop**: `gridTemplateColumns: '340px 1fr'` (current, unchanged)
- **Mobile**: `gridTemplateColumns: '1fr'`. Input panel loses `position: sticky` (not useful when stacked). Dashboard stacks below.

### HeroMetrics row (inside SimuladorTab)
- **Desktop**: `gridTemplateColumns: '1fr 1fr'`
- **Mobile**: `gridTemplateColumns: '1fr'`

### Metrics grid (inside SimuladorTab)
- **Desktop**: `gridTemplateColumns: 'repeat(3, 1fr)'`
- **Mobile**: `gridTemplateColumns: 'repeat(2, 1fr)'`

### DonutChart + summary row (inside SimuladorTab)
- **Desktop**: `gridTemplateColumns: '1fr 1fr'`
- **Mobile**: `gridTemplateColumns: '1fr'`

### Main container
- **Desktop**: `padding: '20px 28px 60px'` (current)
- **Mobile**: `padding: '16px 16px 60px'`

### VariationBarChart (inside InflacionTab)
- **Desktop**: header row is `flexDirection: 'row'`, `justifyContent: 'space-between'` (title left, date pickers right)
- **Mobile**: header row is `flexDirection: 'column'`, date pickers stack below title, inputs get `width: '100%'`

## Props threading

`isMobile` flows from `App` down as a prop:
- `App` → `Header` (to hide rates widget)
- `App` → `TabBar` (to switch to select)
- `App` → `SimuladorTab` (layout grid + subcomponent grids)
- `SimuladorTab` → `DonutChart`, inner grids (as needed)
- `InflacionTab` → `VariationBarChart` (date picker layout)

`RatesBar` is rendered directly in `App` with access to `rates` and `isMobile`.

## What does NOT change

- SVG charts (`AmortChart`, `VariationBarChart`) already use `viewBox` + `width: 100%` — they scale automatically.
- `AmortTable` already has `overflowX: 'auto'` — horizontal scroll on mobile.
- Dark/light theme — no changes.
- Footer — no changes needed.
- All financial calculations — no changes.
