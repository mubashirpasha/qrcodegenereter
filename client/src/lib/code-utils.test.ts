import { describe, expect, it, vi } from "vitest";
import {
  buildQrPayload,
  getContrastWarning,
  loadLocalRecords,
  normalizeBarcodeValue,
  type BarcodeFormat,
} from "./code-utils";

describe("QR payload construction", () => {
  it("creates valid payloads for every supported QR type", () => {
    const cases = [
      ["url", { url: "https://example.com/path?source=studio" }],
      ["text", { text: "A long-form plain-text payload with useful content for scan testing." }],
      ["email", { email: "hello@example.com", subject: "Studio note", message: "Prepared locally." }],
      ["phone", { phone: "+1 (555) 123-4567" }],
      ["sms", { phone: "+1 (555) 123-4567", message: "Your order is ready." }],
      ["wifi", { ssid: "Studio;Guest", password: "c0de:pass", security: "WPA", hidden: false }],
      ["vcard", { firstName: "Mira", lastName: "Stone", organization: "Code Studio", title: "Designer", phone: "+15551234567", email: "mira@example.com", website: "https://example.com", address: "123 Calibration Ave" }],
      ["whatsapp", { phone: "+1 (555) 123-4567", message: "Hello from the studio" }],
      ["location", { latitude: "40.7128", longitude: "-74.0060" }],
      ["calendar", { title: "Product proof", location: "Studio A", start: "2026-08-20T10:00", end: "2026-08-20T11:00", description: "Review code artwork." }],
    ] as const;

    cases.forEach(([type, fields]) => {
      const result = buildQrPayload(type, fields);
      expect(result.error).toBeUndefined();
      expect(result.value.length).toBeGreaterThan(3);
    });
  });

  it("rejects malformed and unsafe QR inputs", () => {
    expect(buildQrPayload("url", { url: "javascript:alert(1)" }).error).toMatch(/valid URL/i);
    expect(buildQrPayload("email", { email: "not-an-email" }).error).toMatch(/valid email/i);
    expect(buildQrPayload("location", { latitude: "190", longitude: "0" }).error).toMatch(/valid latitude/i);
    expect(buildQrPayload("calendar", { title: "Test", start: "2026-01-02T10:00", end: "2026-01-02T09:00" }).error).toMatch(/later/i);
  });
});

describe("barcode validation", () => {
  const samples: Record<BarcodeFormat, string> = {
    CODE128: "STUDIO-128/ABC",
    CODE39: "CODE39-TEST",
    EAN13: "590123412345",
    EAN8: "9638507",
    UPC: "12345678901",
    ITF14: "1234567890123",
    ITF: "12345670",
    MSI: "1234567",
    pharmacode: "12345",
  };

  it("accepts a valid source value for every advertised barcode format", () => {
    (Object.keys(samples) as BarcodeFormat[]).forEach((format) => {
      const result = normalizeBarcodeValue(format, samples[format]);
      expect(result.error).toBeUndefined();
      expect(result.value.length).toBeGreaterThan(0);
    });
  });

  it("enforces specific numeric and character constraints", () => {
    expect(normalizeBarcodeValue("EAN13", "123").error).toMatch(/requires 12 digits/i);
    expect(normalizeBarcodeValue("EAN8", "ABC").error).toMatch(/digits only/i);
    expect(normalizeBarcodeValue("ITF", "123").error).toMatch(/even number/i);
    expect(normalizeBarcodeValue("CODE39", "lowercase").error).toMatch(/uppercase/i);
    expect(normalizeBarcodeValue("pharmacode", "2").error).toMatch(/3 to 131070/i);
  });
});

describe("readability and persistence safeguards", () => {
  it("warns when selected colors provide unsafe scanner contrast", () => {
    expect(getContrastWarning("#777777", "#888888")).toMatch(/Low contrast/i);
    expect(getContrastWarning("#111827", "#FFFFFF")).toBeUndefined();
  });

  it("recovers gracefully from malformed local storage data", () => {
    const removeItem = vi.fn();
    vi.stubGlobal("localStorage", { getItem: () => "{not-json", removeItem });
    expect(loadLocalRecords("broken-records")).toEqual([]);
    expect(removeItem).toHaveBeenCalledWith("broken-records");
    vi.unstubAllGlobals();
  });
});
