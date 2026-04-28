# Simulador Créditos Hipotecarios UVA

## Stack
- Deploy: Google Apps Script (HtmlService)
- Frontend: React 18 + Babel (inline JSX desde CDN)
- Fuente: Roboto (Google Fonts)
- APIs: BCRA (UVA) + DolarAPI (dólar oficial) — fetch client-side desde el browser

## Estructura del proyecto
Solo existen archivos GAS:
```
src/
  Code.gs          ← solo doGet(), sin server-side API calls
  appsscript.json  ← manifest GAS, sin oauthScopes (no se piden permisos)
  index.html       ← toda la app React inlineada
.clasp.json        ← config clasp (scriptId + rootDir: src)
```
No hay build pipeline, no hay npm, no hay node. Se edita `src/index.html` directo.

## Deploy
```bash
clasp push
clasp deploy --deploymentId "AKfycbw9iy-kfTtUjx2QTr7gmuJCZu1LyqFgxY6C9bfI0bxa3sAWqCt4vf4VzGhz95zquKtA" --description "branch_develop"
```
- **branch_develop**: `AKfycbw9iy-kfTtUjx2QTr7gmuJCZu1LyqFgxY6C9bfI0bxa3sAWqCt4vf4VzGhz95zquKtA`
- **prod**: solo cuando el usuario lo pida explícitamente

## Diseño
- Consultar `DESIGN.md` para tokens, colores, tipografía y especificaciones completas
- Paleta basada en: #D62839, #BA324F, #175676, #4BA3C3, #CCE6F4
- Soporte obligatorio para modo oscuro y claro
- No usar fuentes monospace — todo Roboto

## Convenciones
- Cálculos financieros en UVA con sistema francés
- Valores monetarios formateados con locale es-AR
- Las llamadas a APIs externas van client-side (fetch desde el browser), nunca UrlFetchApp
- No pedir permisos OAuth — la app no accede a ningún servicio de Google
- Persistir preferencia de theme en localStorage

## Créditos
- Desarrollado por [@rombolaagustin](https://github.com/rombolaagustin)
