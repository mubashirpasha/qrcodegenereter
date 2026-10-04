/** Studio Instrument side panel: local-only saved code records with compact production metadata. */
import { Clock3, Heart, RotateCcw, Star, Trash2 } from "lucide-react";
import type { LocalCodeRecord } from "@/lib/code-utils";

type CodeHistoryProps = {
  history: LocalCodeRecord[];
  favorites: LocalCodeRecord[];
  onOpen: (record: LocalCodeRecord) => void;
  onDelete: (id: string, list: "history" | "favorites") => void;
  onClear: (list: "history" | "favorites") => void;
};

const formatTime = (date: string) => new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(date));

function RecordList({ records, list, onOpen, onDelete, onClear }: Omit<CodeHistoryProps, "history" | "favorites"> & { records: LocalCodeRecord[]; list: "history" | "favorites" }) {
  const label = list === "history" ? "recent generation" : "saved configuration";
  return (
    <section className="record-panel" aria-label={list === "history" ? "Local history" : "Local favorites"}>
      <div className="record-panel-heading">
        <div><span className="signal-dot" />{list === "history" ? <Clock3 size={15} /> : <Heart size={15} />}<b>{list === "history" ? "Local history" : "Favorites"}</b></div>
        {records.length > 0 && <button className="text-action" onClick={() => onClear(list)}>Clear</button>}
      </div>
      {records.length === 0 ? (
        <p className="record-empty">No {label}s yet. Export a code or save a configuration to keep it here.</p>
      ) : (
        <ul className="record-list">
          {records.map((record) => (
            <li key={record.id}>
              <button className="record-open" onClick={() => onOpen(record)} title={`Reopen ${record.label}`}>
                <span className="record-kind">{record.kind === "qr" ? "QR" : "BAR"}</span>
                <span><b>{record.label}</b><small>{record.preview.slice(0, 46)}{record.preview.length > 46 ? "…" : ""}</small><em>{formatTime(record.createdAt)}</em></span>
                <RotateCcw size={14} aria-hidden="true" />
              </button>
              <button className="record-delete" onClick={() => onDelete(record.id, list)} aria-label={`Delete ${record.label}`}><Trash2 size={14} /></button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function CodeHistory({ history, favorites, onOpen, onDelete, onClear }: CodeHistoryProps) {
  return (
    <aside className="saved-workspace" aria-label="Saved workspace">
      <div className="saved-workspace-title"><Star size={16} /><span>Saved workspace</span></div>
      <RecordList records={history} list="history" onOpen={onOpen} onDelete={onDelete} onClear={onClear} />
      <RecordList records={favorites} list="favorites" onOpen={onOpen} onDelete={onDelete} onClear={onClear} />
      <p className="local-note">Stored only in this browser. Nothing is uploaded.</p>
    </aside>
  );
}
