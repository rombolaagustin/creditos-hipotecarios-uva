# DESIGN.md — Simulador Créditos Hipotecarios UVA

## Paleta de colores

Basada en: https://coolors.co/palette/d62839-ba324f-175676-4ba3c3-cce6f4

| Color | Hex | Rol |
|-------|-----|-----|
| Rojo | `#D62839` | Errores, estados destructivos |
| Rosa oscuro | `#BA324F` | Intereses, warnings, acento secundario |
| Azul oscuro | `#175676` | Color primario (accent) — tabs, sliders, gradientes, logo |
| Azul medio | `#4BA3C3` | Valores destacados, donut capital, links, focus |
| Azul claro | `#CCE6F4` | Fondos claros, highlights sutiles |

## Tokens — Dark mode (por defecto)

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#080c10` | Fondo base |
| `--bg-elevated` | `#0c1218` | Header, footer |
| `--bg-card` | `#101820` | Cards, paneles |
| `--bg-input` | `#162028` | Inputs, filas alternas |
| `--border` | `#1e2e3a` | Bordes generales |
| `--border-focus` | `#4BA3C3` | Borde en focus |
| `--text` | `#e4ecf4` | Texto principal |
| `--text-secondary` | `#90a8c0` | Texto secundario |
| `--text-muted` | `#506878` | Labels, hints, placeholders |
| `--accent` | `#175676` | Primario |
| `--accent-hover` | `#1e6e96` | Primario hover |
| `--accent-glow` | `rgba(23,86,118,0.3)` | Sombra glow en sliders/botones |
| `--cyan` | `#4BA3C3` | Valores numéricos, highlights |
| `--amber` | `#BA324F` | Intereses, warnings |
| `--red` | `#D62839` | Errores |

## Tokens — Light mode

| Token | Valor |
|-------|-------|
| `--bg` | `#f0f4f8` |
| `--bg-elevated` | `#ffffff` |
| `--bg-card` | `#ffffff` |
| `--bg-input` | `#e8eef4` |
| `--border` | `#c8d4e0` |
| `--text` | `#0c1828` |
| `--text-secondary` | `#2e4458` |
| `--text-muted` | `#688098` |
| `--accent` | `#175676` |
| `--cyan` | `#3a8aaa` |
| `--amber` | `#a02840` |
| `--red` | `#c02030` |

## Tipografía

| Elemento | Font | Size | Weight | Extras |
|----------|------|------|--------|--------|
| Hero values (salario, cuota) | Roboto | 32px | 700 | — |
| Metric values | Roboto | 20px | 700 | — |
| Labels uppercase | Roboto | 10–12px | 500 | letter-spacing: 0.04–0.08em, uppercase |
| Body / descripciones | Roboto | 12–14px | 400–500 | — |
| Tab labels | Roboto | 13px | 500 (inactive) / 600 (active) | — |
| Tabla datos | Roboto | 12px | 400 | — |

**No usar fuentes monospace.** Todo el texto, incluidos números y valores monetarios, usa Roboto.

## Espaciado y radios

| Token | Valor |
|-------|-------|
| Card padding | 16–24px |
| Grid gaps | 12–24px |
| `--radius` (cards) | 14px |
| `--radius-sm` (badges) | 8px |
| Input border-radius | 6px |
| Header height | 56px |
| Sidebar width | 340px (sticky, top: 72px) |

## Sombras

| Contexto | Valor |
|----------|-------|
| Dark general | `0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)` |
| Light general | `0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)` |
| Hero cards | `0 8px 32px var(--accent-glow)` |

## Componentes

### Inputs duales (slider + número)
- Slider con track `var(--border)`, fill con gradiente `var(--accent) → var(--cyan)`
- Thumb: 16px circle, `var(--accent)`, border 2px `var(--bg-card)`, glow 3px `var(--accent-glow)`
- Click en el valor abre input editable; Enter/blur confirma, Escape cancela
- Min/max labels debajo del slider en 10px muted

### Hero Metric Card
- Gradiente: `linear-gradient(135deg, var(--accent) 0%, #3a9ad8 50%, var(--green) 100%)`
- Radial highlight: `circle at 80% 20%, rgba(255,255,255,0.08)`
- Texto blanco, label 10px uppercase, valor 32px bold
- Box-shadow: `0 8px 32px var(--accent-glow)`

### Metric Card
- Background `var(--bg-card)`, border 1px `var(--border)`, radius 14px
- Ícono 28×28 en esquina superior derecha con fondo color-dim
- Label 10px uppercase muted, valor 20px bold, subtítulo 11px muted

### Donut Chart
- SVG 100×100, radio 42, stroke-width 8
- Capital: `var(--cyan)`, Interés: `var(--amber)`
- Centro: porcentaje 13px bold + label "capital" 8px

### Stacked Area Chart
- SVG responsive, viewBox 600×220
- Gradientes verticales con opacity 0.5→0.05
- Líneas stroke 1.5px: capital `var(--green)`, interés `var(--amber)`
- Ejes en 9px muted

### Tab Bar
- Border-bottom 1px `var(--border)`
- Active: `var(--text)` + underline 2px `var(--accent)`
- Inactive: `var(--text-secondary)`
- Disabled (pronto): opacity 0.4 + badge "Pronto"

### Tabla amortización
- Font 12px, header 10px uppercase muted
- Cuota $: `var(--cyan)` bold
- Interés: `var(--amber)`
- Capital: `var(--green)`
- Paginada 12 filas (1 año), botones ←/→

## Iconografía

| Elemento | Tipo |
|----------|------|
| Favicon | SVG inline: casa blanca sobre rect `#175676` rx=6 |
| Logo header | SVG casa 14×14 blanca sobre gradiente accent→green, contenedor 28×28 rx=7 |
| Métricas | Unicode: $ ↗ ◆ |
| Theme toggle | ☀ (dark) / ☾ (light) |

## Responsive

- Breakpoint 800px: grid de 2 columnas colapsa a 1 columna
- Grid de 3 métricas colapsa a 2 columnas
- Header se mantiene sticky con backdrop-filter blur(16px)

## Background
- Dot grid sutil: `radial-gradient(circle, var(--text) 0.5px, transparent 0.5px)`, size 24px, opacity 0.03 (dark) / 0.02 (light)
