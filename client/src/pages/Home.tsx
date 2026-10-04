/** Studio Instrument landing page: asymmetrical editorial proof imagery and direct routes into functional tools. */
import { ArrowRight, CheckCircle2, Download, LockKeyhole, Printer, QrCode, ScanLine, Sparkles } from "lucide-react";
import { Link } from "wouter";
import AppShell from "@/components/AppShell";
import PublisherReserve from "@/components/PublisherReserve";

const precisionImage = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=85";

const features = [
  { icon: <Sparkles />, label: "Instant generation", detail: "Updates while you work—no account or upload queue." },
  { icon: <ScanLine />, label: "Built for scanning", detail: "Error correction, quiet zones, and format-aware validation." },
  { icon: <Download />, label: "Clean exports", detail: "Download crisp PNG, SVG, and JPG proofs whenever supported." },
  { icon: <LockKeyhole />, label: "Local by default", detail: "Your payloads, history, and favorites remain in this browser." },
  { icon: <Printer />, label: "Print-ready", detail: "Prepare an uncluttered proof for common print workflows." },
  { icon: <QrCode />, label: "Many payloads", detail: "URLs, Wi-Fi, contacts, events, retail codes, and more." },
];

const steps = [
  ["01", "Select your code", "Choose the payload or barcode standard that matches your label."],
  ["02", "Enter the detail", "Add the destination, product ID, network, or contact information."],
  ["03", "Calibrate the proof", "Tune color, size, correction, margin, or human-readable text."],
  ["04", "Export with intent", "Download the right format, save a favorite, or print your proof."],
];

export default function Home() {
  return <AppShell>
    <section className="home-hero">
      <div className="home-hero-content"><p className="eyebrow hero-eyebrow"><span />Browser-native code studio</p><h1>Generate QR codes<br />and barcodes <em>in seconds.</em></h1><p className="hero-copy">Create customizable, scan-ready codes locally. Export crisp proofs without an account, a subscription wall, or a data handoff.</p><div className="hero-actions"><Link href="/qr-generator" className="primary-cta">Create QR code <ArrowRight size={17} /></Link><Link href="/barcode-generator" className="secondary-cta">Create barcode <ScanLine size={17} /></Link></div><div className="hero-proof-metadata"><span className="signal-dot" /> <b>LIVE PROOF</b><i /> <span>QR + EAN</span><i /> <span>LOCAL RENDER</span></div><p className="hero-note"><CheckCircle2 size={15} /> Free browser tool · no registration · local history</p></div>
      <div className="hero-proof-sheet" aria-hidden="true"><div className="proof-sheet-meta"><span>LOCAL / OUTPUT PROOF</span><span>320 PX</span></div><div className="proof-sheet-ruler" /><div className="proof-sheet-code">{Array.from({ length: 81 }, (_, index) => <i key={index} className={(index % 7 === 0 || index % 11 === 0 || (index > 57 && index < 72)) ? "proof-module-on" : ""} />)}</div><div className="proof-sheet-caption"><span>QR / VECTOR SAFE</span><b>READY TO SCAN</b></div><i className="sheet-registration sheet-registration-a" /><i className="sheet-registration sheet-registration-b" /></div>
      <div className="hero-calibration" aria-hidden="true"><span>00</span><i /><span>50</span><i /><span>100</span><i /><span>150</span></div>
    </section>

    <section className="launch-pair"><article className="launch-card launch-qr"><span className="launch-index">01</span><div><p>QR code generator</p><h2>Make one scan do more.</h2><span>URLs, contacts, Wi-Fi, events, WhatsApp, and a careful set of production controls.</span><Link href="/qr-generator">Open QR studio <ArrowRight size={16} /></Link></div><div className="launch-visual"><QrCode size={88} strokeWidth={1.35} /></div></article><article className="launch-card launch-bar"><span className="launch-index">02</span><div><p>Barcode generator</p><h2>Proof every printed line.</h2><span>Retail, logistics, inventory, and pharmacy formats with format-aware checks.</span><Link href="/barcode-generator">Open barcode studio <ArrowRight size={16} /></Link></div><div className="bars-visual" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div></article></section>

    <section className="feature-section"><div className="section-intro"><p className="eyebrow"><span />Built for the actual output</p><h2>A small studio for<br /><em>high-stakes details.</em></h2><p>Everything is designed around a clear, durable result—not a flashy demo. Start with the correct code standard, preview changes immediately, then choose the output you need.</p></div><div className="feature-grid">{features.map((feature, index) => <article key={feature.label} className="feature-card"><span className="feature-number">0{index + 1}</span><div className="feature-icon">{feature.icon}</div><h3>{feature.label}</h3><p>{feature.detail}</p></article>)}</div></section>

    <section className="process-section"><div className="process-heading"><p className="eyebrow hero-eyebrow"><span />The production flow</p><h2>From payload<br />to <em>proof.</em></h2><p>Every code begins as structured information. This workspace keeps the sequence deliberate so the finished output is easier to trust.</p></div><ol className="process-list">{steps.map(([number, title, description]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><ArrowRight size={17} /></li>)}</ol></section>
    <section className="home-explainer"><div><p className="eyebrow"><span />A practical field guide</p><h2>What these codes<br /><em>are built to do.</em></h2></div><div className="explainer-copy"><article><h3>What is a QR code?</h3><p>A QR code is a two-dimensional visual pattern that can carry structured information. A phone or scanner reads the pattern and uses the encoded payload to open a link, create a contact, draft a message, join Wi-Fi, or save another supported action.</p></article><article><h3>What is a barcode?</h3><p>A barcode represents an identifier through a set of bars and spaces. The correct format depends on the workflow: retail, inventory, shipping, packaging, or an industry-specific standard. Start with the standard your scanner or downstream system expects.</p></article><article><h3>Make an output that scans</h3><p>Use a high-contrast foreground and background, retain a clear quiet zone, test a printed version at its real size, and validate the final code with the device or scanner used in the actual workflow.</p></article></div></section>
    <div className="publisher-wrap"><PublisherReserve placement="Homepage production guide area" /></div>

    <section className="precision-section"><div className="precision-image"><img src={precisionImage} alt="Close-up graphic of barcode lines and QR code calibration marks" /><span>Print precision<br />starts locally.</span></div><div className="precision-copy"><p className="eyebrow"><span />Privacy by architecture</p><h2>Your content stays<br /><em>where you make it.</em></h2><p>The generators run in your browser. Optional history and favorites use local storage on this device, so there is no account to create and no personal payload sent to a generation service.</p><div className="precision-points"><p><LockKeyhole size={17} /><span><b>No upload step</b><small>Generate without handing code content to an external service.</small></span></p><p><Download size={17} /><span><b>Output ownership</b><small>Download standard image and vector files for your own workflow.</small></span></p></div><Link href="/privacy" className="text-link">Read the privacy approach <ArrowRight size={16} /></Link></div></section>

    <section className="home-faq"><div><p className="eyebrow"><span />Quick answers</p><h2>Ready when<br /><em>you are.</em></h2></div><div className="quick-faq"><details open><summary>Is this QR and barcode generator free?<span>+</span></summary><p>Yes. The core browser-based generator, downloads, printing, local history, and favorites are available without an account.</p></details><details><summary>Are my codes stored online?<span>+</span></summary><p>No. The generators operate in your browser. Saved history and favorites are stored locally on the device you are using.</p></details><details><summary>Can I make a Wi-Fi or vCard QR code?<span>+</span></summary><p>Yes. The QR studio supports URL, text, email, phone, SMS, Wi-Fi, vCard, WhatsApp, location, and calendar event payloads.</p></details><Link href="/faq" className="text-link">See all answers <ArrowRight size={16} /></Link></div></section>
  </AppShell>;
}
