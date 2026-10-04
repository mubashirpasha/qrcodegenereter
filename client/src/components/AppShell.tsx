/** Studio Instrument shell: warm editorial utility surfaces, ink navigation, and decisive Signal Blue actions. */
import { Link, useLocation } from "wouter";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

function BrandMark({ size = 42 }: { size?: number }) {
  return <svg className="brand-logo" width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M5 5h16v16H5zM9 9h8v8H9zM27 5h16v16H27zM31 9h8v8h-8zM5 27h16v16H5zM9 31h8v8H9z" fill="currentColor" /><path d="M27 27h6v6h-6zM37 27h6v10h-6zM27 37h10v6H27z" fill="currentColor" /><path d="M33 33h4v4h-4z" fill="var(--paper)" /></svg>;
}

const navItems = [
  { href: "/qr-generator", label: "QR Generator" },
  { href: "/barcode-generator", label: "Barcode Generator" },
  { href: "/qr-types", label: "QR Types" },
  { href: "/barcode-types", label: "Barcode Types" },
  { href: "/faq", label: "FAQ" },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${isDark ? "light" : "dark"} mode`} title={`Switch to ${isDark ? "light" : "dark"} mode`}>
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = () => setMobileOpen(false);

  return (
    <div className="studio-shell">
      <header className="studio-header">
        <div className="studio-header-inner">
          <Link href="/" className="brand-lockup" aria-label="QR and Barcode Generator home">
            <BrandMark />
            <span className="brand-wordmark"><b>QR</b><i>/</i><b>BARCODE</b></span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`nav-link ${location === item.href ? "nav-link-active" : ""}`}>{item.label}</Link>
            ))}
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <Link href="/qr-generator" className="header-generate">Generate <span aria-hidden="true">↗</span></Link>
            <button className="mobile-menu-button" onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => <Link key={item.href} href={item.href} onClick={closeMenu} className={`mobile-nav-link ${location === item.href ? "nav-link-active" : ""}`}>{item.label}</Link>)}
            <div className="mobile-theme-row"><ThemeToggle /></div>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="studio-footer">
        <div className="footer-brand"><BrandMark size={34} /><span><b>QR / BARCODE</b><small>Code studio, kept local.</small></span></div>
        <div className="footer-links" aria-label="Footer navigation">
          <Link href="/qr-generator">QR Generator</Link><Link href="/barcode-generator">Barcode Generator</Link><Link href="/about">About</Link><Link href="/faq">FAQ</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link>
        </div>
        <p>© 2026 QR &amp; BARCODE GENERATOR</p>
      </footer>
    </div>
  );
}
