/** Studio Instrument generator page: the proof canvas is primary; calibrated controls stay compact and explicit. */
import { useEffect, useMemo, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import JsBarcode from "jsbarcode";
import { ChevronDown, Clipboard, Download, FileImage, Heart, History, ImageUp, Printer, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import CodeHistory from "@/components/CodeHistory";
import PublisherReserve from "@/components/PublisherReserve";
import {
  barcodeMeta,
  buildQrPayload,
  defaultQrFields,
  getColorValidationMessage,
  getContrastWarning,
  loadLocalRecords,
  normalizeBarcodeValue,
  persistLocalRecords,
  qrTypeMeta,
  type BarcodeFormat,
  type LocalCodeRecord,
  type QRFields,
  type QRType,
} from "@/lib/code-utils";

type QRSettings = { size: number; foreground: string; background: string; level: "L" | "M" | "Q" | "H"; margin: number; dots: "square" | "rounded" | "dots"; corner: "square" | "extra-rounded" | "dot"; logo: string; logoSize: number };
type BarcodeSettings = { width: number; height: number; foreground: string; background: string; displayValue: boolean; fontSize: number; margin: number; textAlign: "left" | "center" | "right" };

const qrDefaultSettings: QRSettings = { size: 320, foreground: "#111827", background: "#FFFFFF", level: "M", margin: 12, dots: "square", corner: "square", logo: "", logoSize: 20 };
const barcodeDefaultSettings: BarcodeSettings = { width: 2, height: 112, foreground: "#111827", background: "#FFFFFF", displayValue: true, fontSize: 16, margin: 12, textAlign: "center" };
const qrTypes = Object.keys(qrTypeMeta) as QRType[];
const barcodeFormats = Object.keys(barcodeMeta) as BarcodeFormat[];

function getRequestedQrType(): QRType {
  if (typeof window === "undefined") return "url";
  const requested = new URLSearchParams(window.location.search).get("type") as QRType | null;
  return requested && qrTypes.includes(requested) ? requested : "url";
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function canvasToBlob(canvas: HTMLCanvasElement, type: "image/png" | "image/jpeg") {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Canvas conversion failed.")), type, 1);
  });
}

function escapePrintText(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character] ?? character));
}

function printImage(dataUrl: string, title: string, subtitle: string) {
  const printWindow = window.open("", "_blank", "popup,width=900,height=800");
  if (!printWindow) {
    toast.error("Your browser blocked the print window. Please allow pop-ups and try again.");
    return;
  }
  printWindow.opener = null;
  printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapePrintText(title)}</title><style>@page{size:auto;margin:16mm}body{margin:0;display:grid;place-items:center;min-height:100vh;font-family:Arial,sans-serif;color:#111827}.proof{width:min(100%,760px);text-align:center}.proof img{display:block;max-width:100%;max-height:72vh;object-fit:contain;margin:auto}.meta{font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin:18px 0 6px}.value{font-size:14px;line-height:1.45;word-break:break-word;margin:0}@media print{body{min-height:auto}.proof{width:100%}}</style></head><body><section class="proof"><img src="${dataUrl}" alt="${escapePrintText(title)}"/><p class="meta">${escapePrintText(title)}</p><p class="value">${escapePrintText(subtitle)}</p></section><script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}</script></body></html>`);
  printWindow.document.close();
}

function FieldLabel({ label, detail, children }: { label: string; detail?: string; children: React.ReactNode }) {
  return <label className="field-label"><span><b>{label}</b>{detail && <small>{detail}</small>}</span>{children}</label>;
}

function TextField({ label, detail, value, onChange, type = "text", placeholder, inputMode }: { label: string; detail?: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"] }) {
  return <FieldLabel label={label} detail={detail}><input type={type} inputMode={inputMode} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></FieldLabel>;
}

function TextAreaField({ label, detail, value, onChange, placeholder }: { label: string; detail?: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <FieldLabel label={label} detail={detail}><textarea value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} rows={3} /></FieldLabel>;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const valid = /^#[0-9A-Fa-f]{6}$/.test(value);
  return <FieldLabel label={label}><span className="color-control"><input aria-label={`${label} color picker`} type="color" value={valid ? value : "#000000"} onChange={(event) => onChange(event.target.value.toUpperCase())} /><input aria-label={`${label} hex value`} value={value} maxLength={7} onChange={(event) => onChange(event.target.value.toUpperCase())} /></span></FieldLabel>;
}

function QrContentFields({ type, fields, onField }: { type: QRType; fields: QRFields; onField: (key: string, value: string | boolean) => void }) {
  const value = (key: string) => String(fields[key] ?? "");
  switch (type) {
    case "url": return <TextField label="Website URL" detail="Include https://" value={value("url")} onChange={(v) => onField("url", v)} placeholder="https://example.com" inputMode="url" />;
    case "text": return <TextAreaField label="Your text" detail="Any scan-readable message" value={value("text")} onChange={(v) => onField("text", v)} placeholder="Write a short message" />;
    case "email": return <><TextField label="Email address" value={value("email")} onChange={(v) => onField("email", v)} placeholder="hello@example.com" inputMode="email" /><TextField label="Subject" value={value("subject")} onChange={(v) => onField("subject", v)} placeholder="Optional" /><TextAreaField label="Message" value={value("message")} onChange={(v) => onField("message", v)} placeholder="Optional" /></>;
    case "phone": return <TextField label="Phone number" value={value("phone")} onChange={(v) => onField("phone", v)} placeholder="+1 555 123 4567" inputMode="tel" />;
    case "sms": return <><TextField label="Phone number" value={value("phone")} onChange={(v) => onField("phone", v)} placeholder="+1 555 123 4567" inputMode="tel" /><TextAreaField label="Message" value={value("message")} onChange={(v) => onField("message", v)} placeholder="Optional message" /></>;
    case "wifi": return <><TextField label="Network name (SSID)" value={value("ssid")} onChange={(v) => onField("ssid", v)} placeholder="Studio guest Wi-Fi" /><TextField label="Password" value={value("password")} onChange={(v) => onField("password", v)} type="password" placeholder="Network password" /><FieldLabel label="Security type"><select value={value("security") || "WPA"} onChange={(event) => onField("security", event.target.value)}><option value="WPA">WPA / WPA2</option><option value="WEP">WEP</option><option value="nopass">None</option></select></FieldLabel><label className="check-row"><input type="checkbox" checked={Boolean(fields.hidden)} onChange={(event) => onField("hidden", event.target.checked)} /> <span>Hidden network</span></label></>;
    case "vcard": return <div className="field-pair"><TextField label="First name" value={value("firstName")} onChange={(v) => onField("firstName", v)} /><TextField label="Last name" value={value("lastName")} onChange={(v) => onField("lastName", v)} /><TextField label="Organization" value={value("organization")} onChange={(v) => onField("organization", v)} /><TextField label="Job title" value={value("title")} onChange={(v) => onField("title", v)} /><TextField label="Phone" value={value("phone")} onChange={(v) => onField("phone", v)} inputMode="tel" /><TextField label="Email" value={value("email")} onChange={(v) => onField("email", v)} inputMode="email" /><TextField label="Website" value={value("website")} onChange={(v) => onField("website", v)} inputMode="url" /><TextField label="Address" value={value("address")} onChange={(v) => onField("address", v)} /></div>;
    case "whatsapp": return <><TextField label="WhatsApp number" detail="Include country code" value={value("phone")} onChange={(v) => onField("phone", v)} placeholder="+1 555 123 4567" inputMode="tel" /><TextAreaField label="Pre-filled message" value={value("message")} onChange={(v) => onField("message", v)} placeholder="Optional message" /></>;
    case "location": return <div className="field-pair"><TextField label="Latitude" value={value("latitude")} onChange={(v) => onField("latitude", v)} placeholder="40.7128" inputMode="decimal" /><TextField label="Longitude" value={value("longitude")} onChange={(v) => onField("longitude", v)} placeholder="-74.0060" inputMode="decimal" /></div>;
    case "calendar": return <><TextField label="Event title" value={value("title")} onChange={(v) => onField("title", v)} placeholder="Product launch" /><TextField label="Location" value={value("location")} onChange={(v) => onField("location", v)} placeholder="Optional location" /><div className="field-pair"><TextField label="Start" value={value("start")} onChange={(v) => onField("start", v)} type="datetime-local" /><TextField label="End" value={value("end")} onChange={(v) => onField("end", v)} type="datetime-local" /></div><TextAreaField label="Description" value={value("description")} onChange={(v) => onField("description", v)} placeholder="Optional event details" /></>;
  }
}

function QrPreview({ type, settings, payload, error, contrastWarning, onExport, onPrint, onCopy }: { type: QRType; settings: QRSettings; payload: string; error?: string; contrastWarning?: string; onExport: (format: "png" | "svg" | "jpg") => void; onPrint: () => void; onCopy: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [renderError, setRenderError] = useState<string | undefined>();
  const activeError = error || renderError;

  useEffect(() => {
    if (!mountRef.current) return;
    mountRef.current.innerHTML = "";
    setRenderError(undefined);
    if (!payload || error) return;
    try {
      const qr = new QRCodeStyling({
        width: settings.size,
        height: settings.size,
        type: "svg",
        data: payload,
        image: settings.logo || undefined,
        margin: settings.margin,
        qrOptions: { errorCorrectionLevel: settings.level },
        dotsOptions: { color: settings.foreground, type: settings.dots },
        cornersSquareOptions: { color: settings.foreground, type: settings.corner },
        cornersDotOptions: { color: settings.foreground, type: settings.corner === "extra-rounded" ? "dot" : settings.corner },
        backgroundOptions: { color: settings.background },
        imageOptions: { crossOrigin: "anonymous", margin: 6, imageSize: Math.min(settings.logoSize / 100, 0.3), hideBackgroundDots: true },
      });
      qr.append(mountRef.current);
      qrRef.current = qr;
    } catch {
      qrRef.current = null;
      setRenderError("Unable to generate this QR code. Shorten the content or adjust the selected settings.");
    }
    return () => { qrRef.current = null; };
  }, [payload, error, settings]);

  useEffect(() => {
    (window as Window & { __qrStudio?: QRCodeStyling | null }).__qrStudio = qrRef.current;
  }, [payload, settings]);

  return <section className="proof-area">
    <div className="proof-heading"><div><span className="signal-dot" /><span>Live proof</span></div><small>{activeError ? "Needs attention" : "Scan-ready"}</small></div>
    <div className="ruler-top" aria-hidden="true" />
    <div className={`qr-proof-card ${activeError ? "proof-invalid" : ""}`} style={{ "--proof-bg": settings.background } as React.CSSProperties}>
      <i className="proof-corner proof-corner-a" aria-hidden="true" /><i className="proof-corner proof-corner-b" aria-hidden="true" />
      {activeError ? <div className="proof-empty"><X size={20} /><b>Unable to generate</b><span>{activeError}</span></div> : <div ref={mountRef} className="qr-mount" aria-label={`Live ${qrTypeMeta[type].label} QR code preview`} />}
    </div>
    <p className="proof-caption"><b>{qrTypeMeta[type].label}</b><span>{payload ? `${payload.length} encoded characters` : "Awaiting valid content"}</span></p>
    <div className="export-grid">
      <button onClick={() => onExport("png")} disabled={Boolean(activeError)}><Download size={16} />PNG</button>
      <button onClick={() => onExport("svg")} disabled={Boolean(activeError)}><Download size={16} />SVG</button>
      <button onClick={() => onExport("jpg")} disabled={Boolean(activeError)}><FileImage size={16} />JPG</button>
      <button onClick={onPrint} disabled={Boolean(activeError)}><Printer size={16} />Print</button>
      <button onClick={onCopy} disabled={Boolean(activeError)} className="export-copy"><Clipboard size={16} />Copy data</button>
    </div>
    {contrastWarning && <p className="scan-warning" role="status">{contrastWarning}</p>}
    {settings.logoSize >= 22 && settings.logo && <p className="logo-warning">Large logo detected. High correction is enforced, but scan-test this code before production use.</p>}
  </section>;
}

function QrGenerator() {
  const [type, setType] = useState<QRType>(() => getRequestedQrType());
  const [fields, setFields] = useState<QRFields>(() => defaultQrFields[getRequestedQrType()]);
  const [settings, setSettings] = useState<QRSettings>(qrDefaultSettings);
  const [history, setHistory] = useState<LocalCodeRecord[]>(() => loadLocalRecords("code-studio-qr-history"));
  const [favorites, setFavorites] = useState<LocalCodeRecord[]>(() => loadLocalRecords("code-studio-qr-favorites"));
  const logoInput = useRef<HTMLInputElement>(null);
  const payloadResult = useMemo(() => buildQrPayload(type, fields), [type, fields]);

  const updateFields = (key: string, value: string | boolean) => setFields((current) => ({ ...current, [key]: value }));
  const updateSettings = <K extends keyof QRSettings>(key: K, value: QRSettings[K]) => setSettings((current) => {
    const next = { ...current, [key]: value };
    if (key === "logo" && value && current.level !== "H") next.level = "H";
    return next;
  });
  const updateHistory = (next: LocalCodeRecord[]) => { setHistory(next); if (!persistLocalRecords("code-studio-qr-history", next)) toast.error("This browser could not save local history."); };
  const updateFavorites = (next: LocalCodeRecord[]) => { setFavorites(next); if (!persistLocalRecords("code-studio-qr-favorites", next)) toast.error("This browser could not save local favorites."); };
  const colorError = getColorValidationMessage(settings.foreground, settings.background);
  const contrastWarning = getContrastWarning(settings.foreground, settings.background);
  const displayError = payloadResult.error || colorError;

  const createRecord = (): LocalCodeRecord | null => {
    if (!payloadResult.value || displayError) { toast.error(displayError || "Enter valid content before saving."); return null; }
    return { id: crypto.randomUUID(), kind: "qr", label: qrTypeMeta[type].label, preview: payloadResult.value, createdAt: new Date().toISOString(), snapshot: { type, fields, settings } };
  };
  const addHistory = () => {
    const record = createRecord(); if (!record) return;
    updateHistory([record, ...history.filter((item) => item.preview !== record.preview)].slice(0, 6));
  };
  const saveFavorite = () => { const record = createRecord(); if (!record) return; updateFavorites([record, ...favorites].slice(0, 6)); toast.success("Saved to favorites in this browser."); };
  const uploadLogo = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file for the logo."); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Choose a logo image smaller than 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => { updateSettings("logo", String(reader.result)); toast.info("Logo added. Error correction is set to H for safer scanning."); };
    reader.readAsDataURL(file);
  };
  const exportQr = async (format: "png" | "svg" | "jpg") => {
    if (displayError || !payloadResult.value) return;
    const qr = (window as Window & { __qrStudio?: QRCodeStyling | null }).__qrStudio;
    if (!qr) { toast.error("The QR preview is still preparing. Please try again."); return; }
    try {
      const extension = format === "jpg" ? "jpeg" : format;
      const raw = await qr.getRawData(extension as "png" | "svg" | "jpeg");
      if (!raw || !(raw instanceof Blob)) throw new Error();
      const prefix = type === "url" ? "qr-code" : `${type}-qr-code`;
      downloadBlob(raw, `${prefix}.${format}`);
      addHistory();
      toast.success(`QR code downloaded as ${format.toUpperCase()}.`);
    } catch { toast.error("Unable to export this QR code. Please try again."); }
  };
  const printQr = async () => {
    const qr = (window as Window & { __qrStudio?: QRCodeStyling | null }).__qrStudio;
    if (!qr || !payloadResult.value || displayError) return;
    try {
      const blob = await qr.getRawData("png");
      if (!blob || !(blob instanceof Blob)) throw new Error();
      const reader = new FileReader();
      reader.onload = () => printImage(String(reader.result), `${qrTypeMeta[type].label} QR`, payloadResult.value);
      reader.readAsDataURL(blob);
      addHistory();
    } catch { toast.error("Unable to prepare this QR code for printing."); }
  };
  const copyQr = async () => { if (!payloadResult.value) return; try { await navigator.clipboard.writeText(payloadResult.value); toast.success("Encoded content copied successfully."); } catch { toast.error("Your browser could not copy the content."); } };
  const reopen = (record: LocalCodeRecord) => {
    if (record.kind !== "qr") return;
    const snapshot = record.snapshot as Partial<{ type: QRType; fields: QRFields; settings: QRSettings }>;
    if (!snapshot.type || !qrTypeMeta[snapshot.type] || !snapshot.fields || !snapshot.settings) { toast.error("This saved QR item is incomplete and cannot be restored."); return; }
    setType(snapshot.type); setFields(snapshot.fields); setSettings(snapshot.settings); toast.success("Saved QR configuration restored.");
  };
  const deleteRecord = (id: string, list: "history" | "favorites") => { if (list === "history") updateHistory(history.filter((record) => record.id !== id)); else updateFavorites(favorites.filter((record) => record.id !== id)); toast.success("Removed from this browser."); };
  const clearRecords = (list: "history" | "favorites") => { if (!window.confirm(`Clear all local ${list}? This cannot be undone.`)) return; if (list === "history") updateHistory([]); else updateFavorites([]); toast.success(`Local ${list} cleared.`); };
  const reset = () => { setType("url"); setFields(defaultQrFields.url); setSettings(qrDefaultSettings); toast.success("QR settings restored to defaults."); };

  return <AppShell>
    <section className="generator-hero"><div><p className="eyebrow"><span />QR code generator</p><h1>Make the code.<br /><em>Keep the data.</em></h1><p>Compose a scan-ready QR code locally, then export a sharp print or vector proof.</p></div><aside><b>Browser-native</b><span>Nothing you enter leaves this device.</span></aside></section>
    <div className="generator-layout">
      <section className="control-bench">
        <div className="control-heading"><div><span className="bench-index">01</span><div><b>Choose payload</b><small>What should a scan do?</small></div></div><SlidersHorizontal size={18} /></div>
        <div className="type-grid" aria-label="QR code type">
          {qrTypes.map((item) => <button key={item} className={`type-chip ${type === item ? "type-chip-active" : ""}`} onClick={() => { setType(item); setFields(defaultQrFields[item]); }}><span>{qrTypeMeta[item].symbol}</span><b>{qrTypeMeta[item].label}</b></button>)}
        </div>
        <div className="control-section"><div className="section-kicker"><span className="bench-index">02</span><b>Enter information</b></div><QrContentFields type={type} fields={fields} onField={updateFields} />{displayError && <p className="field-error" role="alert"><X size={15} />{displayError}</p>}</div>
        <div className="control-section customization-section"><div className="section-kicker"><span className="bench-index">03</span><b>Calibrate output</b><span className="section-line" /></div>
          <div className="setting-row"><FieldLabel label="Proof size"><select value={settings.size} onChange={(event) => updateSettings("size", Number(event.target.value))}><option value={220}>Small · 220 px</option><option value={320}>Medium · 320 px</option><option value={440}>Large · 440 px</option><option value={560}>XL · 560 px</option></select></FieldLabel><FieldLabel label="Custom pixels"><input type="number" min="120" max="1200" value={settings.size} onChange={(event) => updateSettings("size", Math.min(1200, Math.max(120, Number(event.target.value) || 120)))} /></FieldLabel></div>
          <div className="setting-row"><ColorField label="Code ink" value={settings.foreground} onChange={(value) => updateSettings("foreground", value)} /><ColorField label="Paper" value={settings.background} onChange={(value) => updateSettings("background", value)} /></div>
          <div className="setting-row"><FieldLabel label="Error correction" detail="Higher protects codes with a logo"><select value={settings.level} onChange={(event) => updateSettings("level", event.target.value as QRSettings["level"])}><option value="L">L · 7% recovery</option><option value="M">M · 15% recovery</option><option value="Q">Q · 25% recovery</option><option value="H">H · 30% recovery</option></select></FieldLabel><FieldLabel label="Quiet zone"><input type="number" min="0" max="50" value={settings.margin} onChange={(event) => updateSettings("margin", Math.min(50, Math.max(0, Number(event.target.value) || 0)))} /></FieldLabel></div>
          <div className="setting-row"><FieldLabel label="Module style"><select value={settings.dots} onChange={(event) => updateSettings("dots", event.target.value as QRSettings["dots"])}><option value="square">Square</option><option value="rounded">Rounded</option><option value="dots">Dots</option></select></FieldLabel><FieldLabel label="Corner style"><select value={settings.corner} onChange={(event) => updateSettings("corner", event.target.value as QRSettings["corner"])}><option value="square">Square</option><option value="extra-rounded">Rounded</option><option value="dot">Dot</option></select></FieldLabel></div>
          <div className="logo-control"><div><b>Center logo</b><small>Optional, maximum 2 MB</small></div><input ref={logoInput} type="file" accept="image/*" hidden onChange={(event) => uploadLogo(event.target.files?.[0])} />{settings.logo ? <><img src={settings.logo} alt="Uploaded QR logo" /><input aria-label="Logo size" type="range" min="10" max="24" value={Math.min(settings.logoSize, 24)} onChange={(event) => updateSettings("logoSize", Number(event.target.value))} /><button onClick={() => updateSettings("logo", "")} aria-label="Remove logo"><X size={16} /></button></> : <button className="upload-button" onClick={() => logoInput.current?.click()}><ImageUp size={15} />Upload logo</button>}</div>
        </div>
        <div className="control-footer"><button className="reset-button" onClick={reset}><RotateCcw size={16} />Reset</button><button className="history-button" onClick={addHistory}><History size={16} />Save history</button><button className="favorite-button" onClick={saveFavorite}><Heart size={16} />Save favorite</button></div>
      </section>
      <QrPreview type={type} settings={settings} payload={payloadResult.value} error={displayError} contrastWarning={contrastWarning} onExport={exportQr} onPrint={printQr} onCopy={copyQr} />
      <CodeHistory history={history} favorites={favorites} onOpen={reopen} onDelete={deleteRecord} onClear={clearRecords} />
    </div>
    <div className="generator-publisher-wrap"><PublisherReserve placement="QR generator output area" /></div>
  </AppShell>;
}

function BarcodePreview({ format, rawValue, settings, onExport, onPrint, onCopy }: { format: BarcodeFormat; rawValue: string; settings: BarcodeSettings; onExport: (format: "png" | "svg" | "jpg") => void; onPrint: () => void; onCopy: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const normalized = useMemo(() => normalizeBarcodeValue(format, rawValue), [format, rawValue]);
  const [error, setError] = useState<string | undefined>(normalized.error);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = "";
    const colorError = getColorValidationMessage(settings.foreground, settings.background);
    setError(normalized.error || colorError);
    if (normalized.error || colorError) return;
    try {
      JsBarcode(svg, normalized.value, { format, lineColor: settings.foreground, background: settings.background, width: settings.width, height: settings.height, margin: settings.margin, displayValue: settings.displayValue, fontSize: settings.fontSize, textAlign: settings.textAlign, flat: true });
    } catch {
      setError("Unable to generate this barcode. Please check the value and try again.");
    }
  }, [format, normalized, settings]);

  return <section className="proof-area barcode-proof-area">
    <div className="proof-heading"><div><span className="signal-dot" /><span>Live proof</span></div><small>{error ? "Needs attention" : "Scan-ready"}</small></div>
    <div className="ruler-top" aria-hidden="true" />
    <div className={`barcode-proof-card ${error ? "proof-invalid" : ""}`} style={{ "--proof-bg": settings.background } as React.CSSProperties}>
      <i className="proof-corner proof-corner-a" aria-hidden="true" /><i className="proof-corner proof-corner-b" aria-hidden="true" />
      {error ? <div className="proof-empty"><X size={20} /><b>Unable to generate</b><span>{error}</span></div> : <svg ref={svgRef} className="barcode-svg" aria-label={`Live ${barcodeMeta[format].label} barcode preview`} />}
    </div>
    <p className="proof-caption"><b>{barcodeMeta[format].label}</b><span>{error ? "Awaiting valid data" : "Check digit calculated where applicable"}</span></p>
    <div className="export-grid"><button onClick={() => onExport("png")} disabled={Boolean(error)}><Download size={16} />PNG</button><button onClick={() => onExport("svg")} disabled={Boolean(error)}><Download size={16} />SVG</button><button onClick={() => onExport("jpg")} disabled={Boolean(error)}><FileImage size={16} />JPG</button><button onClick={onPrint} disabled={Boolean(error)}><Printer size={16} />Print</button><button onClick={onCopy} disabled={Boolean(error)} className="export-copy"><Clipboard size={16} />Copy data</button></div>
    {getContrastWarning(settings.foreground, settings.background) && <p className="scan-warning" role="status">{getContrastWarning(settings.foreground, settings.background)}</p>}
  </section>;
}

function BarcodeGenerator() {
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");
  const [value, setValue] = useState(barcodeMeta.CODE128.sample);
  const [settings, setSettings] = useState<BarcodeSettings>(barcodeDefaultSettings);
  const [history, setHistory] = useState<LocalCodeRecord[]>(() => loadLocalRecords("code-studio-barcode-history"));
  const [favorites, setFavorites] = useState<LocalCodeRecord[]>(() => loadLocalRecords("code-studio-barcode-favorites"));
  const normalized = useMemo(() => normalizeBarcodeValue(format, value), [format, value]);
  const updateSettings = <K extends keyof BarcodeSettings>(key: K, setting: BarcodeSettings[K]) => setSettings((current) => ({ ...current, [key]: setting }));
  const updateHistory = (next: LocalCodeRecord[]) => { setHistory(next); if (!persistLocalRecords("code-studio-barcode-history", next)) toast.error("This browser could not save local history."); };
  const updateFavorites = (next: LocalCodeRecord[]) => { setFavorites(next); if (!persistLocalRecords("code-studio-barcode-favorites", next)) toast.error("This browser could not save local favorites."); };
  const record = (): LocalCodeRecord | null => { if (normalized.error || !normalized.value) { toast.error(normalized.error || "Enter valid barcode data before saving."); return null; } return { id: crypto.randomUUID(), kind: "barcode", label: barcodeMeta[format].label, preview: normalized.value, createdAt: new Date().toISOString(), snapshot: { format, value, settings } }; };
  const addHistory = () => { const item = record(); if (!item) return; updateHistory([item, ...history.filter((entry) => entry.preview !== item.preview)].slice(0, 6)); };
  const saveFavorite = () => { const item = record(); if (!item) return; updateFavorites([item, ...favorites].slice(0, 6)); toast.success("Saved to favorites in this browser."); };
  const renderCanvas = () => {
    if (normalized.error) throw new Error();
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, normalized.value, { format, lineColor: settings.foreground, background: settings.background, width: settings.width * 3, height: settings.height * 3, margin: settings.margin * 3, displayValue: settings.displayValue, fontSize: settings.fontSize * 3, textAlign: settings.textAlign, flat: true });
    return canvas;
  };
  const exportBarcode = async (output: "png" | "svg" | "jpg") => {
    if (normalized.error) return;
    try {
      if (output === "svg") {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        JsBarcode(svg, normalized.value, { format, lineColor: settings.foreground, background: settings.background, width: settings.width, height: settings.height, margin: settings.margin, displayValue: settings.displayValue, fontSize: settings.fontSize, textAlign: settings.textAlign, flat: true });
        downloadBlob(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml;charset=utf-8" }), `barcode-${format.toLowerCase()}.svg`);
      } else {
        const canvas = renderCanvas();
        const blob = await canvasToBlob(canvas, output === "jpg" ? "image/jpeg" : "image/png");
        downloadBlob(blob, `barcode-${format.toLowerCase()}.${output}`);
      }
      addHistory(); toast.success(`Barcode downloaded as ${output.toUpperCase()}.`);
    } catch { toast.error("Unable to export this barcode. Please check the value and try again."); }
  };
  const printBarcode = () => { try { const canvas = renderCanvas(); printImage(canvas.toDataURL("image/png"), `${barcodeMeta[format].label} barcode`, normalized.value); addHistory(); } catch { toast.error("Unable to prepare this barcode for printing."); } };
  const copyBarcode = async () => { if (!normalized.value || normalized.error) return; try { await navigator.clipboard.writeText(normalized.value); toast.success("Barcode value copied successfully."); } catch { toast.error("Your browser could not copy the barcode value."); } };
  const reopen = (item: LocalCodeRecord) => { if (item.kind !== "barcode") return; const snapshot = item.snapshot as Partial<{ format: BarcodeFormat; value: string; settings: BarcodeSettings }>; if (!snapshot.format || !barcodeMeta[snapshot.format] || !snapshot.value || !snapshot.settings) { toast.error("This saved barcode item is incomplete and cannot be restored."); return; } setFormat(snapshot.format); setValue(snapshot.value); setSettings(snapshot.settings); toast.success("Saved barcode configuration restored."); };
  const deleteRecord = (id: string, list: "history" | "favorites") => { if (list === "history") updateHistory(history.filter((item) => item.id !== id)); else updateFavorites(favorites.filter((item) => item.id !== id)); toast.success("Removed from this browser."); };
  const clearRecords = (list: "history" | "favorites") => { if (!window.confirm(`Clear all local ${list}? This cannot be undone.`)) return; if (list === "history") updateHistory([]); else updateFavorites([]); toast.success(`Local ${list} cleared.`); };
  const reset = () => { setFormat("CODE128"); setValue(barcodeMeta.CODE128.sample); setSettings(barcodeDefaultSettings); toast.success("Barcode settings restored to defaults."); };

  return <AppShell>
    <section className="generator-hero barcode-hero"><div><p className="eyebrow"><span />Barcode generator</p><h1>Proof every line.<br /><em>Print with confidence.</em></h1><p>Generate precise product, inventory, shipping, and pharmacy barcodes in your browser.</p></div><aside><b>Sharp by design</b><span>Raster, vector, and print outputs are all made locally.</span></aside></section>
    <div className="generator-layout">
      <section className="control-bench">
        <div className="control-heading"><div><span className="bench-index">01</span><div><b>Choose symbology</b><small>Match your label standard.</small></div></div><SlidersHorizontal size={18} /></div>
        <div className="barcode-type-list">{barcodeFormats.map((item) => <button key={item} className={`barcode-type-row ${format === item ? "barcode-type-active" : ""}`} onClick={() => { setFormat(item); setValue(barcodeMeta[item].sample); }}><b>{barcodeMeta[item].label}</b><span>{barcodeMeta[item].description}</span><ChevronDown size={16} /></button>)}</div>
        <div className="control-section"><div className="section-kicker"><span className="bench-index">02</span><b>Enter barcode value</b></div><TextField label={barcodeMeta[format].label} detail={format === "EAN13" || format === "EAN8" || format === "UPC" || format === "ITF14" ? "Check digit is calculated automatically" : "Enter a supported value"} value={value} onChange={setValue} placeholder={barcodeMeta[format].sample} />{normalized.error && <p className="field-error" role="alert"><X size={15} />{normalized.error}</p>}</div>
        <div className="control-section customization-section"><div className="section-kicker"><span className="bench-index">03</span><b>Calibrate output</b><span className="section-line" /></div><div className="setting-row"><FieldLabel label="Line width"><input type="number" min="1" max="5" step="0.25" value={settings.width} onChange={(event) => updateSettings("width", Math.min(5, Math.max(1, Number(event.target.value) || 1)))} /></FieldLabel><FieldLabel label="Bar height"><input type="number" min="40" max="300" value={settings.height} onChange={(event) => updateSettings("height", Math.min(300, Math.max(40, Number(event.target.value) || 40)))} /></FieldLabel></div><div className="setting-row"><ColorField label="Bar ink" value={settings.foreground} onChange={(setting) => updateSettings("foreground", setting)} /><ColorField label="Paper" value={settings.background} onChange={(setting) => updateSettings("background", setting)} /></div><div className="setting-row"><FieldLabel label="Text size"><input type="number" min="10" max="32" value={settings.fontSize} onChange={(event) => updateSettings("fontSize", Math.min(32, Math.max(10, Number(event.target.value) || 10)))} /></FieldLabel><FieldLabel label="Text align"><select value={settings.textAlign} onChange={(event) => updateSettings("textAlign", event.target.value as BarcodeSettings["textAlign"])}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></FieldLabel></div><div className="setting-row single-setting"><FieldLabel label="Quiet zone"><input type="number" min="0" max="50" value={settings.margin} onChange={(event) => updateSettings("margin", Math.min(50, Math.max(0, Number(event.target.value) || 0)))} /></FieldLabel><label className="switch-row"><span><b>Human-readable value</b><small>Show text under the bars</small></span><input type="checkbox" checked={settings.displayValue} onChange={(event) => updateSettings("displayValue", event.target.checked)} /><i /></label></div></div>
        <div className="control-footer"><button className="reset-button" onClick={reset}><RotateCcw size={16} />Reset</button><button className="history-button" onClick={addHistory}><History size={16} />Save history</button><button className="favorite-button" onClick={saveFavorite}><Heart size={16} />Save favorite</button></div>
      </section>
      <BarcodePreview format={format} rawValue={value} settings={settings} onExport={exportBarcode} onPrint={printBarcode} onCopy={copyBarcode} />
      <CodeHistory history={history} favorites={favorites} onOpen={reopen} onDelete={deleteRecord} onClear={clearRecords} />
    </div>
    <div className="generator-publisher-wrap"><PublisherReserve placement="Barcode generator output area" /></div>
  </AppShell>;
}

export default function GeneratorPage({ mode }: { mode: "qr" | "barcode" }) { return mode === "qr" ? <QrGenerator /> : <BarcodeGenerator />; }
