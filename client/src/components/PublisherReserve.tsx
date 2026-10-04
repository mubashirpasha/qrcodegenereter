/** Studio Instrument publisher reserve: a transparent, non-interactive region for future official advertising integrations. */
export default function PublisherReserve({ placement }: { placement: string }) {
  return <aside className="publisher-reserve" aria-label={`Reserved publisher placement: ${placement}`} data-publisher-placement={placement}>
    <span className="signal-dot" aria-hidden="true" />
    <span><b>Reserved publisher placement</b><small>No advertising code is active in this version.</small></span>
  </aside>;
}
