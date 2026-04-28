# Simulador Créditos Hipotecarios UVA

Simulador de créditos hipotecarios UVA para Argentina. Calcula cuotas con sistema de amortización francés, salario neto mínimo requerido y muestra cuadro de amortización con gráficos. Consume APIs del BCRA y DolarAPI para cotizaciones en tiempo real. Soporta modo oscuro/claro.

## Stack

- **Deploy**: Google Apps Script (HtmlService)
- **Frontend**: React 18 + Babel inline desde CDN
- **APIs**: BCRA (UVA) + DolarAPI (dólar oficial) — fetch client-side

## Estructura

```
src/
  Code.gs          ← doGet() únicamente
  appsscript.json  ← manifest GAS
  index.html       ← app completa (React + CSS inlineado)
.clasp.json        ← config clasp
```

## Deploy

```bash
# Desarrollo
clasp push
clasp deploy --deploymentId "AKfycbw9iy-kfTtUjx2QTr7gmuJCZu1LyqFgxY6C9bfI0bxa3sAWqCt4vf4VzGhz95zquKtA" --description "branch_develop"
```

**URL branch_develop**: https://script.google.com/macros/s/AKfycbw9iy-kfTtUjx2QTr7gmuJCZu1LyqFgxY6C9bfI0bxa3sAWqCt4vf4VzGhz95zquKtA/exec

## Desarrollado por

[@rombolaagustin](https://github.com/rombolaagustin)
