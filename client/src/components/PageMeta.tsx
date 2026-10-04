/** Production SEO metadata: route-aware document title, description, canonical URL, and social metadata without hard-coded localhost values. */
import { useEffect } from "react";
import { useLocation } from "wouter";

const metadata: Record<string, { title: string; description: string }> = {
  "/": { title: "Free QR Code & Barcode Generator Online", description: "Generate free QR codes and barcodes online. Create, customize, download and print QR codes and barcodes instantly." },
  "/qr-generator": { title: "Free QR Code Generator Online", description: "Create custom QR codes for links, Wi-Fi, contacts, events, messages and more. Download sharp PNG, SVG, or JPG QR codes locally." },
  "/barcode-generator": { title: "Free Barcode Generator Online", description: "Create CODE128, EAN-13, UPC-A, ITF and other browser-generated barcodes. Validate, customize, download and print locally." },
  "/wifi-qr-code-generator": { title: "Wi-Fi QR Code Generator", description: "Create a secure Wi-Fi QR code in your browser so guests can connect without typing the network details." },
  "/vcard-qr-code-generator": { title: "vCard QR Code Generator", description: "Create a contact QR code that packages names, phone numbers, email addresses, websites and addresses into one scan." },
  "/qr-types": { title: "QR Code Types and Uses", description: "Explore practical QR code payload types for URLs, Wi-Fi, contacts, email, phone, SMS, locations and calendar events." },
  "/barcode-types": { title: "Barcode Types and Formats", description: "Compare common barcode formats, including CODE128, CODE39, EAN-13, EAN-8, UPC-A, ITF, MSI and Pharmacode." },
  "/faq": { title: "QR & Barcode Generator FAQ", description: "Find concise answers about local code generation, downloads, printing, storage, privacy and supported barcode formats." },
  "/about": { title: "About QR & Barcode Generator", description: "Learn why this browser-native code studio focuses on clear validation, local processing and practical production-ready outputs." },
  "/privacy": { title: "Privacy Policy | QR & Barcode Generator", description: "Understand how code generation, optional browser-local history, favorites and logo uploads are handled locally." },
  "/terms": { title: "Terms of Service | QR & Barcode Generator", description: "Review the practical terms for using locally generated QR codes and barcodes responsibly." },
  "/contact": { title: "Contact QR & Barcode Generator", description: "Contact the QR & Barcode Generator team about code formats, accessibility, workflow feedback or support." },
};

function updateMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, key); document.head.append(element); }
  element.content = content;
}

export default function PageMeta() {
  const [location] = useLocation();
  const current = metadata[location] ?? { title: "Page Not Found | QR & Barcode Generator", description: "The requested QR & Barcode Generator page could not be found." };

  useEffect(() => {
    document.title = current.title;
    updateMeta('meta[name="description"]', "name", "description", current.description);
    updateMeta('meta[property="og:title"]', "property", "og:title", current.title);
    updateMeta('meta[property="og:description"]', "property", "og:description", current.description);
    updateMeta('meta[name="twitter:title"]', "name", "twitter:title", current.title);
    updateMeta('meta[name="twitter:description"]', "name", "twitter:description", current.description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = new URL(location, window.location.origin).toString();
  }, [current.description, current.title, location]);

  return null;
}
