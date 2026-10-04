/** Studio Instrument 404: clear recovery routes into the home, QR, and barcode workspaces. */
import { ArrowRight, Barcode, Home, QrCode } from "lucide-react";
import { Link } from "wouter";
import AppShell from "@/components/AppShell";

export default function NotFound() {
  return <AppShell><main className="not-found-page"><section className="not-found-proof"><span className="not-found-code">404 / ROUTE NOT FOUND</span><div className="not-found-number" aria-hidden="true">404</div><h1>Page not found.</h1><p>The address may be outdated, or it may never have been part of this code studio. Use a verified route below to continue.</p><div className="not-found-actions"><Link href="/" className="primary-cta"><Home size={16} />Go home</Link><Link href="/qr-generator" className="secondary-recovery"><QrCode size={16} />QR Generator</Link><Link href="/barcode-generator" className="secondary-recovery"><Barcode size={16} />Barcode Generator</Link></div></section><aside className="not-found-ruler" aria-hidden="true"><span>000</span><i /><span>032</span><i /><span>064</span><i /><span>096</span><ArrowRight size={18} /></aside></main></AppShell>;
}
