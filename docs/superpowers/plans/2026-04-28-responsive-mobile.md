# Responsive Mobile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the UVA mortgage simulator fully usable on mobile phones using a `useIsMobile()` hook and conditional inline styles.

**Architecture:** Single breakpoint at 640px. `useIsMobile()` hook in `App`, passed as prop to components that need layout changes. No CSS changes — all logic is in React inline style objects.

**Tech Stack:** React 18 + Babel standalone, inline JSX in `src/index.html`, no build pipeline.

---

## File Map

- **Modify:** `src/index.html` — sole file. All changes are here.

No automated test framework exists. Each task includes a manual verification step.

---

### Task 1: Add `useIsMobile()` hook and remove existing hacky CSS

**Files:**
- Modify: `src/index.html` (after `useTheme` function ~line 199, and remove `<style>` block ~lines 905-910)

- [ ] **Step 1: Add `useIsMobile` hook after `useTheme`**

After the closing `}` of `useTheme` (around line 199), insert:

```jsx
/* ─── Mobile ─── */
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

- [ ] **Step 2: Remove the existing `<style>` block with `!important` inside `SimuladorTab`**

In `SimuladorTab`, find and remove this entire block (around lines 905-910):

```jsx
      <style>{`
        @media (max-width: 800px) {
          div[style*="grid-template-columns: 340px"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
```

- [ ] **Step 3: Manual verification**

Open `src/index.html` in a browser. Open DevTools, resize to 400px wide. The app should still render (the CSS hack is gone but nothing new is in place yet — layout may look broken, that's expected at this step).

- [ ] **Step 4: Commit**

```bash
git add src/index.html
git commit -m "refactor: add useIsMobile hook, remove !important CSS hack"
```

---

### Task 2: Add `RatesBar` component

**Files:**
- Modify: `src/index.html` (add new component after `useRates` ~line 227)

- [ ] **Step 1: Add `RatesBar` component after `useRates`**

After the closing `}` of `useRates` (around line 227), insert:

```jsx
/* ─── Rates Bar (mobile only) ─── */
function RatesBar({ rates }) {
  return (
    <div style={{
      padding: '8px 16px', background: 'var(--bg-elevated)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    }}>
      <div style={{ display: 'flex', gap: 10, fontSize: 11, fontFamily: 'var(--mono)' }}>
        <span>UVA <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{fmtARS(rates.uva)}</span></span>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span>TC Oficial <span style={{ color: 'var(--green)', fontWeight: 600 }}>{fmtARS(rates.usdOficial)}</span></span>
      </div>
      {rates.fecha && (
        <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>Dato al {rates.fecha}</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Manual verification**

No visual change yet — `RatesBar` is not rendered anywhere. Check there are no Babel errors in the browser console.

- [ ] **Step 3: Commit**

```bash
git add src/index.html
git commit -m "feat: add RatesBar component for mobile header"
```

---

### Task 3: Modify `App` — wire `isMobile`, update header, render `RatesBar`, fix main padding

**Files:**
- Modify: `src/index.html` (`App` component, ~lines 719-838)

- [ ] **Step 1: Call `useIsMobile` inside `App`**

In `App`, after `const rates = useRates();`, add:

```jsx
const isMobile = useIsMobile();
```

- [ ] **Step 2: Hide rates widget in header on mobile**

Find the header's right-side `<div>` (the one with `display: 'flex', alignItems: 'center', gap: 10`). Change the condition for the rates widget from:

```jsx
{!rates.loading && (
  <div style={{ ... }}>
```

to:

```jsx
{!rates.loading && !isMobile && (
  <div style={{ ... }}>
```

- [ ] **Step 3: Render `RatesBar` below the header**

After the closing `</header>` tag and before the error banner `{rates.error && ...}`, insert:

```jsx
{isMobile && !rates.loading && <RatesBar rates={rates} />}
```

- [ ] **Step 4: Fix main container padding**

Find the `<main>` element. Change its padding from:

```jsx
padding: '20px 28px 60px'
```

to:

```jsx
padding: isMobile ? '16px 16px 60px' : '20px 28px 60px'
```

- [ ] **Step 5: Pass `isMobile` to `TabBar`, `SimuladorTab`, `InflacionTab`**

Update the `TabBar` render call:
```jsx
<TabBar active={tab} setActive={setTab} isMobile={isMobile} />
```

Update the `SimuladorTab` render call:
```jsx
<SimuladorTab tna={tna} setTna={setTna} valorUSD={valorUSD} setValorUSD={setValorUSD}
  anticipo={anticipo} setAnticipo={setAnticipo} maxCuota={maxCuota} setMaxCuota={setMaxCuota}
  plazo={plazo} setPlazo={setPlazo} calc={calc} isMobile={isMobile} />
```

Update the `InflacionTab` render call:
```jsx
<InflacionTab isMobile={isMobile} />
```

- [ ] **Step 6: Manual verification**

Open at 400px wide. Header should show only logo + theme toggle. A slim rates bar should appear below the header with UVA and TC Oficial values. Main content should have 16px horizontal padding.

- [ ] **Step 7: Commit**

```bash
git add src/index.html
git commit -m "feat: responsive App shell — RatesBar, padding, prop threading"
```

---

### Task 4: Modify `TabBar` for mobile dropdown

**Files:**
- Modify: `src/index.html` (`TabBar` component, ~lines 473-494)

- [ ] **Step 1: Add `isMobile` prop to `TabBar` and render select on mobile**

Replace the entire `TabBar` function with:

```jsx
/* ─── Tab Bar ─── */
function TabBar({ active, setActive, isMobile }) {
  if (isMobile) {
    return (
      <div style={{ marginBottom: 20 }}>
        <select value={active} onChange={e => setActive(e.target.value)} style={{
          width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--text)',
          fontSize: 14, fontFamily: 'var(--font)', outline: 'none', cursor: 'pointer',
          colorScheme: 'dark', appearance: 'auto',
        }}>
          {TABS.filter(t => !t.soon).map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <nav style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
      {TABS.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => !t.soon && setActive(t.id)} style={{
            padding: '12px 20px', border: 'none', cursor: t.soon ? 'default' : 'pointer',
            background: 'transparent', color: isActive ? 'var(--text)' : t.soon ? 'var(--text-muted)' : 'var(--text-secondary)',
            fontFamily: 'var(--font)', fontSize: 13, fontWeight: isActive ? 600 : 500,
            borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
            transition: 'all 0.2s', opacity: t.soon ? 0.4 : 1, marginBottom: -1,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {t.label}
            {t.soon && <span style={{ fontSize: 9, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 6px' }}>Pronto</span>}
          </button>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Manual verification**

At 400px: tabs show as a `<select>` dropdown. Selecting an option navigates to that tab.  
At 800px: tabs show as horizontal button row, same as before.

- [ ] **Step 3: Commit**

```bash
git add src/index.html
git commit -m "feat: TabBar shows select dropdown on mobile"
```

---

### Task 5: Modify `SimuladorTab` grids for mobile

**Files:**
- Modify: `src/index.html` (`SimuladorTab` component, ~lines 841-913)

- [ ] **Step 1: Add `isMobile` prop and fix outer grid**

Change the `SimuladorTab` function signature:
```jsx
function SimuladorTab({ tna, setTna, valorUSD, setValorUSD, anticipo, setAnticipo, maxCuota, setMaxCuota, plazo, setPlazo, calc, isMobile }) {
```

Change the outer `<div>` grid style from:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start', animation: 'fadeIn 0.3s ease forwards' }}>
```
to:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '340px 1fr', gap: 24, alignItems: 'start', animation: 'fadeIn 0.3s ease forwards' }}>
```

- [ ] **Step 2: Remove `sticky` from input panel on mobile**

Change the input panel `<div>` style from:
```jsx
<div style={{
  background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
  padding: '24px 22px', position: 'sticky', top: 72,
}}>
```
to:
```jsx
<div style={{
  background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
  padding: '24px 22px', position: isMobile ? 'static' : 'sticky', top: 72,
}}>
```

- [ ] **Step 3: Fix HeroMetrics grid**

Change from:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
```
to:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
```

- [ ] **Step 4: Fix Metrics grid**

Change from:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
```
to:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
```

- [ ] **Step 5: Fix DonutChart + summary grid**

Change from:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
```
to:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
```

- [ ] **Step 6: Manual verification**

At 400px wide, Simulador tab:
- Parameters panel is full width at top (not sticky)
- Dashboard stacks below: two hero cards one per row, metrics in 2 columns, donut and summary stacked
- No horizontal overflow

At 800px: original 2-column layout unchanged.

- [ ] **Step 7: Commit**

```bash
git add src/index.html
git commit -m "feat: SimuladorTab responsive grids for mobile"
```

---

### Task 6: Modify `VariationBarChart` and `InflacionTab` for mobile

**Files:**
- Modify: `src/index.html` (`VariationBarChart` ~line 540, `InflacionTab` ~line 647)

- [ ] **Step 1: Add `isMobile` prop to `VariationBarChart`**

Change the function signature from:
```jsx
function VariationBarChart({ data, title, subtitle, from, setFrom, to, setTo, minYM, maxYM, showLegend }) {
```
to:
```jsx
function VariationBarChart({ data, title, subtitle, from, setFrom, to, setTo, minYM, maxYM, showLegend, isMobile }) {
```

- [ ] **Step 2: Stack date pickers on mobile**

Find the header `<div>` inside `VariationBarChart` (the one with `display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12`). Replace it with:

```jsx
<div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
```

Then find the date pickers `<div>` (the one with `display: 'flex', gap: 8, alignItems: 'center'`). Replace it with:

```jsx
<div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
```

- [ ] **Step 3: Add `isMobile` prop to `InflacionTab` and pass it to `VariationBarChart`**

Change `InflacionTab` signature from:
```jsx
function InflacionTab() {
```
to:
```jsx
function InflacionTab({ isMobile }) {
```

Update all four `<VariationBarChart ... />` calls inside `InflacionTab` to include `isMobile={isMobile}`:

```jsx
<VariationBarChart data={uvaMonthly} title="Variación mensual UVA" subtitle="Variación % respecto al mes anterior"
  from={uvaMFrom} setFrom={setUvaMFrom} to={uvaMTo} setTo={setUvaMTo} minYM={uvaMinYM} maxYM={uvaMaxYM} isMobile={isMobile} />
<VariationBarChart data={uvaAnnual} title="Variación anual UVA" subtitle="Variación % respecto al mismo mes del año anterior"
  from={uvaAFrom} setFrom={setUvaAFrom} to={uvaATo} setTo={setUvaATo} minYM={uvaMinYM} maxYM={uvaMaxYM} isMobile={isMobile} />
<VariationBarChart data={tcMonthly} title="Variación mensual tipo de cambio oficial" subtitle="Variación % respecto al mes anterior"
  from={tcMFrom} setFrom={setTcMFrom} to={tcMTo} setTo={setTcMTo} minYM={tcMinYM} maxYM={tcMaxYM} showLegend isMobile={isMobile} />
<VariationBarChart data={tcAnnual} title="Variación anual tipo de cambio oficial" subtitle="Variación % respecto al mismo mes del año anterior"
  from={tcAFrom} setFrom={setTcAFrom} to={tcATo} setTo={setTcATo} minYM={tcMinYM} maxYM={tcMaxYM} showLegend isMobile={isMobile} />
```

- [ ] **Step 4: Manual verification**

At 400px, open "Inflación y tipo de cambio" tab. Each chart should show title and subtitle, then date pickers stacked below on their own row. SVG bars should scale to full width.

At 800px: date pickers remain on the right of the title, unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/index.html
git commit -m "feat: VariationBarChart responsive date pickers on mobile"
```

---

### Task 7: Deploy to branch_develop

- [ ] **Step 1: Push and deploy**

```bash
clasp push && clasp deploy --deploymentId "AKfycbw9iy-kfTtUjx2QTr7gmuJCZu1LyqFgxY6C9bfI0bxa3sAWqCt4vf4VzGhz95zquKtA" --description "branch_develop"
```

- [ ] **Step 2: Smoke test on mobile**

Open the branch_develop URL on a phone (or Chrome DevTools device emulation at 390px). Verify:
- Header shows logo + theme toggle only
- Rates bar visible below header with UVA and TC values
- Tabs render as a dropdown select
- Simulador: parameters full width top, dashboard stacked below
- Inflación: date pickers stack below each chart title
- Amortización: table scrolls horizontally, chart scales correctly
- Theme toggle works
- No console errors
