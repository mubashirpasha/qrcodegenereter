export type QRType =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "sms"
  | "wifi"
  | "vcard"
  | "whatsapp"
  | "location"
  | "calendar";

export type QRFields = Record<string, string | boolean>;

export const qrTypeMeta: Record<QRType, { label: string; description: string; symbol: string }> = {
  url: { label: "Website URL", description: "Open a link with one scan.", symbol: "↗" },
  text: { label: "Plain text", description: "Share a note, code, or message.", symbol: "T" },
  email: { label: "Email", description: "Pre-fill a new email message.", symbol: "@" },
  phone: { label: "Phone", description: "Prompt a direct call.", symbol: "☎" },
  sms: { label: "SMS", description: "Prepare a text message.", symbol: "▤" },
  wifi: { label: "Wi-Fi", description: "Connect guests to a network.", symbol: "⌁" },
  vcard: { label: "Contact", description: "Save a full contact card.", symbol: "◉" },
  whatsapp: { label: "WhatsApp", description: "Start a WhatsApp conversation.", symbol: "◌" },
  location: { label: "Location", description: "Open a map coordinate.", symbol: "⌖" },
  calendar: { label: "Calendar", description: "Add an event to a calendar.", symbol: "□" },
};

export const defaultQrFields: Record<QRType, QRFields> = {
  url: { url: "https://example.com" },
  text: { text: "" },
  email: { email: "", subject: "", message: "" },
  phone: { phone: "" },
  sms: { phone: "", message: "" },
  wifi: { ssid: "", password: "", security: "WPA", hidden: false },
  vcard: { firstName: "", lastName: "", organization: "", title: "", phone: "", email: "", website: "", address: "" },
  whatsapp: { phone: "", message: "" },
  location: { latitude: "", longitude: "" },
  calendar: { title: "", location: "", start: "", end: "", description: "" },
};

const escapeVCard = (value: string) => value.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

const valueOf = (fields: QRFields, key: string) => String(fields[key] ?? "").trim();

export const isValidHexColor = (value: string) => /^#[0-9A-Fa-f]{6}$/.test(value);

const channelLuminance = (channel: number) => {
  const normalized = channel / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
};

export function getContrastRatio(foreground: string, background: string) {
  if (!isValidHexColor(foreground) || !isValidHexColor(background)) return 0;
  const luminance = (hex: string) => {
    const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
    return 0.2126 * channelLuminance(channels[0]) + 0.7152 * channelLuminance(channels[1]) + 0.0722 * channelLuminance(channels[2]);
  };
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

export function getColorValidationMessage(foreground: string, background: string) {
  if (!isValidHexColor(foreground) || !isValidHexColor(background)) return "Use a full 6-digit HEX color such as #111827.";
  return undefined;
}

export function getContrastWarning(foreground: string, background: string) {
  if (!isValidHexColor(foreground) || !isValidHexColor(background)) return undefined;
  return getContrastRatio(foreground, background) < 3.5 ? "Low contrast may make this code difficult to scan. Choose darker ink or a lighter paper color." : undefined;
}

export function buildQrPayload(type: QRType, fields: QRFields): { value: string; error?: string } {
  const required = (key: string, label: string) => {
    const value = valueOf(fields, key);
    return value ? value : `${label} is required.`;
  };

  switch (type) {
    case "url": {
      const value = required("url", "Website URL");
      if (value.includes(" is required.")) return { value: "", error: value };
      try {
        const parsed = new URL(value);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
        return { value: parsed.toString() };
      } catch {
        return { value: "", error: "Please enter a valid URL starting with http:// or https://." };
      }
    }
    case "text": {
      const value = required("text", "Text");
      return value.includes(" is required.") ? { value: "", error: value } : { value };
    }
    case "email": {
      const email = required("email", "Email address");
      if (email.includes(" is required.")) return { value: "", error: email };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { value: "", error: "Please enter a valid email address." };
      const subject = valueOf(fields, "subject");
      const message = valueOf(fields, "message");
      const query = new URLSearchParams();
      if (subject) query.set("subject", subject);
      if (message) query.set("body", message);
      return { value: `mailto:${email}${query.toString() ? `?${query.toString()}` : ""}` };
    }
    case "phone": {
      const phone = required("phone", "Phone number");
      if (phone.includes(" is required.")) return { value: "", error: phone };
      if (!/^[+()\-\s\d]{5,}$/.test(phone)) return { value: "", error: "Please enter a valid phone number." };
      return { value: `tel:${phone.replace(/[\s()\-]/g, "")}` };
    }
    case "sms": {
      const phone = required("phone", "Phone number");
      if (phone.includes(" is required.")) return { value: "", error: phone };
      if (!/^[+()\-\s\d]{5,}$/.test(phone)) return { value: "", error: "Please enter a valid phone number." };
      return { value: `SMSTO:${phone.replace(/[\s()\-]/g, "")}:${valueOf(fields, "message")}` };
    }
    case "wifi": {
      const ssid = required("ssid", "Network name");
      if (ssid.includes(" is required.")) return { value: "", error: ssid };
      const security = valueOf(fields, "security") || "WPA";
      const password = valueOf(fields, "password");
      if (security !== "nopass" && !password) return { value: "", error: "A password is required for protected Wi-Fi networks." };
      const sanitize = (v: string) => v.replace(/([;,:\\])/g, "\\$1");
      return { value: `WIFI:T:${security};S:${sanitize(ssid)};P:${sanitize(password)};H:${fields.hidden ? "true" : "false"};;` };
    }
    case "vcard": {
      const firstName = valueOf(fields, "firstName");
      const lastName = valueOf(fields, "lastName");
      if (!firstName && !lastName) return { value: "", error: "Enter a first or last name for the contact." };
      const email = valueOf(fields, "email");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { value: "", error: "Please enter a valid contact email address." };
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
        `FN:${escapeVCard(`${firstName} ${lastName}`.trim())}`,
        valueOf(fields, "organization") && `ORG:${escapeVCard(valueOf(fields, "organization"))}`,
        valueOf(fields, "title") && `TITLE:${escapeVCard(valueOf(fields, "title"))}`,
        valueOf(fields, "phone") && `TEL:${escapeVCard(valueOf(fields, "phone"))}`,
        email && `EMAIL:${escapeVCard(email)}`,
        valueOf(fields, "website") && `URL:${escapeVCard(valueOf(fields, "website"))}`,
        valueOf(fields, "address") && `ADR:;;${escapeVCard(valueOf(fields, "address"))};;;;`,
        "END:VCARD",
      ].filter(Boolean);
      return { value: lines.join("\n") };
    }
    case "whatsapp": {
      const phone = required("phone", "WhatsApp number");
      if (phone.includes(" is required.")) return { value: "", error: phone };
      const normalized = phone.replace(/\D/g, "");
      if (normalized.length < 7) return { value: "", error: "Please enter a valid WhatsApp number with country code." };
      const text = valueOf(fields, "message");
      return { value: `https://wa.me/${normalized}${text ? `?text=${encodeURIComponent(text)}` : ""}` };
    }
    case "location": {
      const lat = required("latitude", "Latitude");
      const lng = required("longitude", "Longitude");
      if (lat.includes(" is required.")) return { value: "", error: lat };
      if (lng.includes(" is required.")) return { value: "", error: lng };
      const latitude = Number(lat);
      const longitude = Number(lng);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return { value: "", error: "Enter valid latitude (-90 to 90) and longitude (-180 to 180) coordinates." };
      }
      return { value: `geo:${latitude},${longitude}` };
    }
    case "calendar": {
      const title = required("title", "Event title");
      if (title.includes(" is required.")) return { value: "", error: title };
      const start = valueOf(fields, "start");
      const end = valueOf(fields, "end");
      if (!start || !end) return { value: "", error: "Start and end times are required for a calendar event." };
      if (new Date(end).getTime() <= new Date(start).getTime()) return { value: "", error: "The event end time must be later than the start time." };
      const formatDate = (date: string) => date.replace(/[-:]/g, "").replace("T", "T") + "00";
      return {
        value: [
          "BEGIN:VEVENT",
          `SUMMARY:${title.replace(/\n/g, " ")}`,
          `DTSTART:${formatDate(start)}`,
          `DTEND:${formatDate(end)}`,
          valueOf(fields, "location") && `LOCATION:${valueOf(fields, "location").replace(/\n/g, " ")}`,
          valueOf(fields, "description") && `DESCRIPTION:${valueOf(fields, "description").replace(/\n/g, "\\n")}`,
          "END:VEVENT",
        ].filter(Boolean).join("\n"),
      };
    }
  }
}

export type BarcodeFormat = "CODE128" | "CODE39" | "EAN13" | "EAN8" | "UPC" | "ITF14" | "ITF" | "MSI" | "pharmacode";

export const barcodeMeta: Record<BarcodeFormat, { label: string; sample: string; description: string }> = {
  CODE128: { label: "CODE128", sample: "123456789", description: "Flexible alphanumeric product and logistics labels." },
  CODE39: { label: "CODE39", sample: "CODE39", description: "Industrial and inventory labels using uppercase characters." },
  EAN13: { label: "EAN-13", sample: "590123412345", description: "Retail identifiers used outside North America." },
  EAN8: { label: "EAN-8", sample: "9638507", description: "Compact retail identifiers for small packages." },
  UPC: { label: "UPC-A", sample: "12345678901", description: "North American retail product identifiers." },
  ITF14: { label: "ITF-14", sample: "1234567890123", description: "Shipping carton identifiers based on GTIN." },
  ITF: { label: "ITF", sample: "12345670", description: "Interleaved 2 of 5 numeric labels." },
  MSI: { label: "MSI", sample: "1234567", description: "Inventory control labels with numeric data." },
  pharmacode: { label: "Pharmacode", sample: "12345", description: "Pharmaceutical packaging control code." },
};

const checksum = (digits: string) => {
  let total = 0;
  for (let i = 0; i < digits.length; i += 1) total += Number(digits[i]) * ((digits.length - i) % 2 === 1 ? 3 : 1);
  return (10 - (total % 10)) % 10;
};

export function normalizeBarcodeValue(format: BarcodeFormat, raw: string): { value: string; error?: string } {
  const value = raw.trim();
  if (!value) return { value: "", error: "Enter a value to generate a barcode." };
  if (format === "CODE128") return { value };
  if (format === "CODE39") return /^[0-9A-Z \-.$/+%]+$/.test(value) ? { value } : { value: "", error: "CODE39 accepts uppercase letters, numbers, spaces, and - . $ / + %." };
  if (format === "pharmacode") {
    const number = Number(value);
    return Number.isInteger(number) && number >= 3 && number <= 131070 ? { value } : { value: "", error: "Pharmacode must be a whole number from 3 to 131070." };
  }
  if (!/^\d+$/.test(value)) return { value: "", error: `${barcodeMeta[format].label} must contain digits only.` };
  const expected: Partial<Record<BarcodeFormat, number>> = { EAN13: 12, EAN8: 7, UPC: 11, ITF14: 13 };
  if (format in expected) {
    const baseLength = expected[format]!;
    if (value.length === baseLength) return { value };
    if (value.length === baseLength + 1) {
      const base = value.slice(0, -1);
      return Number(value.at(-1)) === checksum(base) ? { value: base } : { value: "", error: `The ${barcodeMeta[format].label} check digit is not valid.` };
    }
    return { value: "", error: `${barcodeMeta[format].label} requires ${baseLength} digits; the check digit is calculated automatically.` };
  }
  if (format === "ITF") return value.length % 2 === 0 ? { value } : { value: "", error: "ITF requires an even number of digits." };
  return { value };
}

export type LocalCodeRecord = {
  id: string;
  kind: "qr" | "barcode";
  label: string;
  preview: string;
  createdAt: string;
  snapshot: unknown;
};

export function loadLocalRecords(key: string): LocalCodeRecord[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]") as LocalCodeRecord[];
    if (!Array.isArray(parsed)) throw new Error("Stored records are not an array.");
    return parsed.filter((record): record is LocalCodeRecord => Boolean(
      record &&
      typeof record === "object" &&
      typeof record.id === "string" &&
      (record.kind === "qr" || record.kind === "barcode") &&
      typeof record.label === "string" &&
      typeof record.preview === "string" &&
      typeof record.createdAt === "string" &&
      record.snapshot &&
      typeof record.snapshot === "object",
    )).slice(0, 12);
  } catch {
    try { localStorage.removeItem(key); } catch { /* Storage can be unavailable in private modes. */ }
    return [];
  }
}

export function persistLocalRecords(key: string, records: LocalCodeRecord[]) {
  try {
    localStorage.setItem(key, JSON.stringify(records.slice(0, 12)));
    return true;
  } catch {
    return false;
  }
}
