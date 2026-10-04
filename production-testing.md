# Production Verification Notes

## QR workspace — 19 August 2026

The live QR generator loaded with the expected browser-native payload controls, scan-ready proof, PNG/SVG/JPG/print/copy actions, explicit local-history and favorite actions, and inactive transparent publisher reserve. The document title updated to the QR-specific title. The revised self-contained vector mark rendered in the header and footer without project-scoped storage references.

The initial desktop proof maintained readable contrast, displayed a valid QR code, and showed no visible application error state during the view inspection.

An attempted low-contrast value entry did not change the rendered controlled input through browser automation, so the contrast calculation is covered by the automated unit suite rather than asserted from this interaction. The explicit Save history control remained keyboard-visible and was invoked on a valid URL configuration; the workspace controls remained stable with no error fallback shown.

## Barcode workspace — 19 August 2026

The barcode studio loaded all nine advertised formats and showed its PNG/SVG/JPG/print/copy controls. Selecting EAN-13 changed the field detail to automatic check-digit handling, rendered a live EAN-13 proof, and converted the valid twelve-digit source value `590123412345` to the thirteen-digit output `5901234123457`. A previously saved EAN-13 favorite remained available in the browser-local workspace.

## Theme and public-route checks — 19 August 2026

The dark-mode toggle updated the barcode page to an ink-navy interface while preserving readable labels, visible controls, the white barcode proof surface, and the EAN-13 code. The dedicated Wi-Fi QR page loaded its route-specific title, original explanatory content, local-first wording, and functional call-to-action into `/qr-generator?type=wifi`.

Following the Wi-Fi call-to-action, the generator correctly preselected Wi-Fi, presented the required SSID and password fields, showed a friendly required-network validation state with disabled output actions, and generated a scan-ready 52-character Wi-Fi proof after valid values were supplied.

## QR exports — 19 August 2026

The valid Wi-Fi proof produced browser-native PNG and SVG download confirmations. Both exports used the type-aware QR filename flow and created one browser-local history record for the Wi-Fi configuration, demonstrating that export and persistence paths work together without an account or server request.

After a route reload, the Wi-Fi generator correctly restored the requested payload type while resetting unsaved form values and returning to its safe required-network state; previously saved local history remained visible.

The reloaded Wi-Fi form again transitioned to a valid proof after the network details were supplied. The JPG control was invoked through browser automation; unlike PNG and SVG, the automation did not surface a confirmation toast. A direct browser-side renderer check then confirmed a valid `image/jpeg` Blob of 51,707 bytes, validating the QR JPG payload path. Actual downloaded-file inspection remains a follow-up recommended in a full browser environment.
