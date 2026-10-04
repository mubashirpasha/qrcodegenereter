# Manual Vercel Deployment Guide

This repository is a **client-side React 19 + Vite** application. Its QR and barcode rendering, validation, local history, downloads, printing, and dark mode all run in the browser. There is no required server process, database, API proxy, or secret.

## Exact Vercel Project Settings

| Setting | Value |
|---|---|
| Framework Preset | **Vite** |
| Root Directory | `.` |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm exec vite build` |
| Output Directory | `dist/public` |
| Node.js version | `22.x`, matching the validated local build |
| Environment Variables | **None required** |

The committed `vercel.json` enforces the Vite framework, the static output directory, and a single-page application rewrite from all paths to `index.html`. This preserves direct entry to public routes such as `/qr-generator`, `/barcode-generator`, `/wifi-qr-code-generator`, and `/faq`.

## Deploy Without GitHub

Vercel’s official **Vercel Drop** supports source folders and `.zip` archives without Git or the command line. Export this entire project as a ZIP, excluding generated build folders and `node_modules` if the export tool includes them. Then visit [vercel.com/drop](https://vercel.com/drop), drag the project folder or ZIP onto the page, choose your team, use the project name `qr-barcode-generator`, and select **Deploy**. Vercel detects Vite and uses the committed project configuration. [1]

If the Drop flow opens build settings, use the exact values in the table above. The import needs no environment variables. Do not add the Manus-only injected variables that may appear in a development environment; they are not used by the Vercel static build.

## Post-Deployment Checks

Open the production site, then test `/`, `/qr-generator`, `/barcode-generator`, `/wifi-qr-code-generator`, `/vcard-qr-code-generator`, `/faq`, and a deliberately invalid route. Confirm the live QR and barcode proofs render and try the PNG/SVG export controls.

The static `robots.txt` and `sitemap.xml` currently target `https://qrcodegenereter.work.gd/`. If Vercel assigns a different production domain, update that canonical base in `client/index.html`, `client/public/robots.txt`, and `client/public/sitemap.xml`, then redeploy. For ongoing deployments to the same URL, Vercel recommends connecting a Git repository; each Vercel Drop creates a new project and production URL. [1]

## Package Contents

The exported source contains `package.json`, `pnpm-lock.yaml`, `vercel.json`, `client/`, `shared/`, the static public crawl files, and the deployment guide. It contains no `.env` file, private credential, or production backend requirement.

## References

[1]: https://vercel.com/docs/deployments "Vercel – Deploying to Vercel"
