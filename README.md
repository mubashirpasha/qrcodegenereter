# ⚡ QR & Barcode Generator — Premium Code Studio

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F172A,50:2457F5,100:06B6D4&height=230&section=header&text=QR%20%2F%20BARCODE&fontSize=55&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Create%20Codes.%20Keep%20Your%20Data%20Private.&descAlignY=60&descSize=17" width="100%" />

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=19&duration=3000&pause=1000&color=2457F5&center=true&vCenter=true&width=650&lines=Generate+Smart+QR+Codes;Create+Professional+Barcodes;Customize+Every+Detail;Export+High-Quality+Code+Images;Privacy-First+Browser+Experience" />

<br/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />

**A powerful, privacy-focused QR Code and Barcode Generator built for modern businesses, creators, and professionals.**

</div>

---

## 🚀 About The Project

**QR & Barcode Generator** is a modern browser-based code creation studio that allows users to generate, customize, preview, and export professional QR codes and barcodes.

Whether you need a QR code for your website, Wi-Fi network, WhatsApp, business contact, or a barcode for retail products and inventory, this platform provides everything in one place.

With real-time previews, customizable designs, multiple export formats, and local browser storage, creating professional codes has never been easier.

## ✨ Key Features

### 📱 QR Code Generator

Create QR codes for multiple purposes:

- Website URLs
- Plain Text
- Email Addresses
- Phone Numbers
- SMS Messages
- Wi-Fi Connections
- Business Contacts (vCard)
- WhatsApp Messages
- Geographic Locations
- Calendar Events

### 🏷️ Barcode Generator

Generate professional barcodes using multiple industry formats:

| Barcode Format | Usage |
|---|---|
| CODE128 | Logistics and product identification |
| CODE39 | Industrial and inventory labels |
| EAN-13 | Retail product identification |
| EAN-8 | Compact retail packaging |
| UPC-A | Retail product identification |
| ITF-14 | Shipping carton identification |
| ITF | Numeric product labels |
| MSI | Inventory management |
| Pharmacode | Pharmaceutical packaging |

### 🎨 Advanced Customization

- Custom foreground and background colors.
- Adjustable QR code dimensions.
- Multiple QR dot styles.
- Custom corner styles.
- QR error correction levels.
- Adjustable barcode width and height.
- Custom barcode text size and alignment.
- Adjustable margins.
- Optional QR logo support.
- Live design previews.
- Contrast validation warnings.

### 📥 Export & Download

- PNG export.
- SVG export.
- JPG export.
- Print-ready output.
- Download customized QR codes.
- Export professional barcode images.

### 💎 Productivity Features

- Local code history.
- Save favorite codes.
- Reuse previously generated codes.
- Dark and light themes.
- Responsive user interface.
- Instant generation.
- Input validation.
- Browser-based processing.

## 🔐 Privacy First

Privacy is a core principle of this application.

- QR and barcode generation happens locally in the browser.
- No account registration is required.
- No backend or database is required for core generation.
- Code history and favorites are stored in browser storage.
- Your QR payloads do not need to be uploaded to an external server.

**Your data stays where you create it.**

## 🛠️ Technology Stack

<div align="center">

| Technology | Purpose |
|---|---|
| React 19 | Frontend framework |
| TypeScript | Type-safe development |
| Vite 7 | Development and build tooling |
| Tailwind CSS 4 | Styling and responsive design |
| QR Code Styling | QR code generation and customization |
| JsBarcode | Barcode generation |
| Wouter | Client-side routing |
| Framer Motion | UI animations |
| Lucide React | Interface icons |
| LocalStorage | Local history and favorites |

</div>

## 🎯 Why Choose This Generator?

- ⚡ Instant QR and barcode generation.
- 🔒 Privacy-focused architecture.
- 🎨 Professional customization controls.
- 📦 Multiple barcode standards.
- 📱 Fully responsive design.
- 🖨️ Print-friendly output.
- 📥 Multiple download formats.
- 🌙 Dark and light mode.
- 💾 Local history and favorites.
- 🚀 Simple static deployment.

## 📸 Screenshots

<div align="center">

### Homepage

_Add your homepage screenshot here._

### QR Code Generator

_Add your QR generator screenshot here._

### Barcode Generator

_Add your barcode generator screenshot here._

</div>

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- Node.js 22.x
- pnpm 10.x
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/qr-barcode-generator.git
```

**2. Navigate to the project**

```bash
cd qr-barcode-generator
```

**3. Install dependencies**

```bash
pnpm install
```

**4. Start development server**

```bash
pnpm dev
```

**5. Build the project**

```bash
pnpm exec vite build
```

## 🌍 Deployment on Vercel

This project is configured for Vercel deployment.

### Vercel Configuration

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Root Directory | `.` |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm exec vite build` |
| Output Directory | `dist/public` |
| Node.js Version | 22.x |
| Environment Variables | None required |

### Deployment Steps

1. Upload your project to GitHub.
2. Open Vercel.
3. Import your GitHub repository.
4. Configure the build settings.
5. Click Deploy.
6. Your application will be live!

## 📂 Project Structure

```text
qr-barcode-generator/
│
├── client/
│   ├── public/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   │
│   └── src/
│       ├── components/
│       │   ├── ui/
│       │   ├── AppShell.tsx
│       │   ├── CodeHistory.tsx
│       │   └── ErrorBoundary.tsx
│       │
│       ├── contexts/
│       │   └── ThemeContext.tsx
│       │
│       ├── lib/
│       │   ├── code-utils.ts
│       │   └── code-utils.test.ts
│       │
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── GeneratorPage.tsx
│       │   ├── InfoPage.tsx
│       │   └── NotFound.tsx
│       │
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
│
├── server/
├── shared/
├── patches/
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── vercel.json
├── VERCEL_DEPLOYMENT.md
└── README.md
```

## 🧪 Quality & Validation

The project includes code utility tests and TypeScript validation.

Run the following commands:

```bash
pnpm check
```

Run tests:

```bash
pnpm exec vitest run
```

Build:

```bash
pnpm exec vite build
```

## 🔮 Future Improvements

- Bulk QR code generation.
- Bulk barcode generation.
- More export options.
- Advanced label templates.
- Enhanced print layouts.
- Additional barcode standards.
- Improved code management tools.

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository.
2. Create a feature branch.
3. Make your changes.
4. Commit your improvements.
5. Open a Pull Request.

## ⭐ Support

If you find this project useful, please consider giving it a ⭐ on GitHub.

Your support helps improve and expand the project!

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:06B6D4,50:2457F5,100:0F172A&height=160&section=footer&text=MAKE%20THE%20CODE.%20KEEP%20THE%20DATA.&fontSize=23&fontColor=ffffff&animation=twinkling" width="100%" />

### 💎 QR / BARCODE STUDIO

**Precision • Privacy • Performance**

<sub>Built for creators, developers, businesses, and professionals.</sub>

<br/><br/>

<img src="https://img.shields.io/badge/CRAFTED_WITH-❤️-red?style=for-the-badge" />
<img src="https://img.shields.io/badge/BUILT_FOR-THE_FUTURE-2457F5?style=for-the-badge" />

</div>
