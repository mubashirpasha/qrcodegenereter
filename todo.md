# Production Optimization Checklist

- [x] Audit the current routes, controls, error boundaries, exports, print flow, storage handling, and static build configuration. Priority findings: production error details are exposed, theme persistence trusts malformed local data, the 404 page is incomplete, crawl-control files are absent, and the static build needs route-level splitting.
- [x] Verify every QR payload type, long-content handling, customizer setting, contrast safeguard, and logo-size safeguard. Automated payload coverage exercises all ten types; live Wi-Fi validation and proofing were verified in-browser; contrast and local-data safeguards are covered by unit tests.
- [x] Verify every advertised barcode format, remove any unreliable option, and harden per-format validation and check-digit behavior. Automated coverage validates all nine advertised formats and a live EAN-13 proof confirmed the automatic check digit.
- [x] Confirm PNG, SVG, and JPG exports create sharp files with meaningful type-aware filenames and accurately match the proofs. PNG/SVG browser downloads and a 51,707-byte JPEG renderer Blob were verified; final file opening remains a physical-browser follow-up.
- [x] Confirm print layouts retain the code, metadata, aspect ratio, and A4-safe margins without application controls. The print window now has encoded metadata, safe escaping, A4-compatible margins, aspect-ratio containment, and no application chrome; physical printer output remains a deployment follow-up.
- [x] Complete responsive and dark-mode checks from 320px through desktop widths, then resolve overflow, touch-target, contrast, and navigation issues. Mobile screenshots at 375px and representative desktop views were checked; dark mode and the live proof were verified in-browser.
- [x] Strengthen accessible error messaging, keyboard behavior, semantic landmarks, headings, focus visibility, and the 404 route.
- [x] Add useful QR/barcode explanatory content, dedicated Wi-Fi and vCard routes, per-page metadata, accurate structured data, sitemap, robots, and reserved non-misleading ad integration locations.
- [x] Reduce the initial JavaScript payload through route-level loading and verify a Vercel-compatible static build without local-only dependencies.
- [x] Complete final functional, responsive, browser-console, and production-build checks; record residual limitations honestly in production-testing.md.

## Manual Vercel Export Readiness

- [x] Confirm Vercel build command, output directory, SPA rewrite, and framework declaration match the current static project.
- [x] Confirm the Vercel build contains only portable source, public crawl files, static output, and no private credentials or local-only runtime requirements. Removed the environment-dependent analytics tag so no Vercel variable is required.
- [x] Run a fresh Vercel-mode production build and inspect the generated artifacts for sitemap, robots, client entry, and route fallback compatibility. Type check and Vercel-mode build passed; the artifact contains `index.html`, `robots.txt`, and `sitemap.xml`.
- [x] Provide the exact import settings and no-GitHub dashboard export instructions for the user in `VERCEL_DEPLOYMENT.md`.
