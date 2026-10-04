# Design Exploration: QR & Barcode Generator

## Three possible visual directions

### 1. Studio Instrument
**Very Brief Intro:** A precision-first creative tool that feels like a carefully calibrated desktop instrument rather than a generic landing page. It uses a warm paper-like canvas, restrained cobalt accents, measurement ticks, and purposeful panels to make technical controls feel approachable.
**Probability:** 0.04

### 2. Signal Grid
**Very Brief Intro:** A dark information-dense workspace inspired by scanner optics and data transmission, with luminous code motifs and high-contrast components. It conveys technical speed, but has a more industrial atmosphere.
**Probability:** 0.07

### 3. Civic Utility
**Very Brief Intro:** A calm, public-service-inspired interface built around clarity, generous white space, and understated blue guidance. It feels exceptionally accessible and dependable, with minimal expressive ornament.
**Probability:** 0.02

## Chosen direction: Studio Instrument

### Design Movement
The application follows a **contemporary editorial utility** aesthetic: Swiss-informed typographic hierarchy, a carefully constrained technical palette, and tactile workspace panels informed by professional studio instruments. The interface should feel suitable for small businesses and production teams while remaining friendly to first-time users.

### Core Principles

1. **The code is the hero.** Generated QR codes and barcodes always occupy the clearest, most generous visual space; controls support them rather than compete with them.
2. **Technical, never intimidating.** Labels use plain language, contextual explanations appear close to consequential controls, and complex settings are progressively disclosed.
3. **Warm precision.** Dark ink text, off-white surfaces, clean cobalt actions, and fine ruled dividers make the product feel engineered yet human.
4. **State is visible.** Selection, validation, local-only storage, and download readiness are communicated with clear text, icons, and restrained motion rather than color alone.

### Color Philosophy
The base is a **warm parchment white** instead of sterile pure white, evoking printed labels and high-quality paper stock. Ink navy provides dependable contrast for extended use. A saturated cobalt—**Signal Blue**—is reserved for actions, selected controls, and active data; sage and red only indicate success and error states. Dark mode inverts this relationship into graphite panels with luminous-but-not-neon cobalt accents, preserving a professional production-tool character.

### Layout Paradigm
The primary generator uses an **asymmetric instrument bench**: a narrow, vertically structured control rail on the left and a broad, sticky proofing surface on the right. On the home page, editorial ribbons, offset cards, and compact feature bands lead the eye from product promise to actions without relying on a centered marketing-template stack. Mobile collapses this to a clear sequence: content type, primary fields, preview, refinements, output controls.

### Signature Elements

1. **Calibration rulers:** subtle tick-mark bands appear beside preview canvases and section labels, hinting at print precision without becoming decorative clutter.
2. **Proof cards:** QR and barcode previews sit within paper-like cards using a corner registration mark and compact metadata strip.
3. **Cobalt signal dots:** small blue circular indicators mark active tabs, saved items, and ready-to-export states.

### Interaction Philosophy
The application should behave like a reliable instrument: every action produces immediate, specific feedback. Values update previews in place, form errors name the exact correction, and export buttons become available only when output is valid. Hover states are quiet; selection is decisive. Shortcuts and keyboard navigation should work without sacrificing discoverability.

### Animation
Motion is subtle, functional, and under 250ms. Preview changes use a brief opacity transition rather than animated code geometry. Tabs and segmented controls slide their cobalt indicator with a crisp ease-out curve. Toasts rise a few pixels and fade; drawers and mobile navigation enter from the nearest screen edge. All nonessential animations are disabled for reduced-motion preferences.

### Typography System
**Space Grotesk** is the display and interface font, lending technical character to headings, metrics, and controls. **DM Sans** is used for explanatory text and forms for readable density. Page titles use 700 weight with slight negative tracking; section labels use 600 weight in sentence case; technical metadata uses a compact 500 weight with tabular numerals. The application avoids generic default sans-serif styling.

### Brand Essence
**QR & Barcode Generator is a private, browser-native code studio for people who need trustworthy, production-ready labels without friction.**

The personality is **precise, reassuring, and capable**.

### Brand Voice
Headlines should be concrete and confident; CTAs should name their resulting action; microcopy should explain technical constraints without blame. Examples: “Make the code. Keep the data.” and “Export a crisp, scan-ready SVG.” Generic filler such as “Welcome to our website” and “Get started today” is not used.

### Wordmark & Logo
The logo is a bold, text-free **offset finder-frame mark**: three rounded-square QR finder cues joined by a single open barcode stripe, creating a compact symbol that reads as both a code and a production mark. The wordmark pairs the symbol with a custom-spaced, uppercase “QR / BARCODE” lockup rather than a default font treatment.

### Signature Brand Color
**Signal Blue — #2457F5**. This clear cobalt is the product’s unmistakable action color and should not be diluted by unrelated gradients.

## Style Decisions

Headlines use **Space Grotesk** as the primary display voice; hierarchy comes from scale, weight, tracking, and Signal Blue rather than a decorative serif emphasis. Signal Blue is held for primary actions, active states, status dots, key technical signals, and small proof accents; large decorative fields in this color are avoided. Every supporting page incorporates at least one Studio Instrument cue, such as a calibration ruler, registration marks, a metadata strip, or ruled proof-like panel.

The landing hero leads with a self-contained proof-sheet artifact—generated-code modules, a paper surface, calibration ticks, registration corners, and output metadata—rather than generic technical imagery. Generator proof cards receive the strongest visual weight through generous paper surfaces, a top signal rule, and more measured separation from secondary rails. Every major landing section carries an explicit calibration, ruled, metadata, or registration cue so the public narrative and code workspaces read as one instrument system.

## Product Architecture Decisions

The first release remains a privacy-forward static React application. QR and barcode encoding, format conversion, printing, theme preferences, history, and favorites operate within the browser. QR generation will use a browser-compatible library with SVG/canvas output and custom-dot support; barcode rendering will use a browser-compatible library with per-format validation. Local history stores only intentional user-generated configurations in `localStorage` and is never transmitted.

Core navigation will include the product landing page, dedicated QR and barcode generator routes, educational type pages, FAQ, About, Contact, Privacy, and Terms. The initial route prioritizes the QR workflow, while the barcode generator preserves the same visual model and export quality.
