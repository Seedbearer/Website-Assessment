"use client";

import { useState } from "react";

type Note = { id: string; note_type: string; content: string; created_at: string };

const DEFAULT_NOTE_TYPES = ["observation", "pattern", "session", "followup"];

export default function CoachingNotes({
  submissionId,
  familyCode,
  initialNotes,
  noteTypes = DEFAULT_NOTE_TYPES,
  title = "Coaching notes",
}: {
  submissionId?: string;
  familyCode?: string | null;
  initialNotes: Note[];
  noteTypes?: string[];
  title?: string;
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [noteType, setNoteType] = useState(noteTypes[0]);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!content.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/coaching-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId, familyCode, noteType, content }),
    });
    const data = await res.json();
    if (data.note) {
      setNotes((prev) => [data.note, ...prev]);
      setContent("");
    }
    setSaving(false);
  }

  return (
    <div className="rounded-lg border border-mid-gray bg-off-white p-6">
      <h3 className="font-lora text-lg text-soil">{title}</h3>

      <div className="mt-4 space-y-3">
        <select
          value={noteType}
          onChange={(e) => setNoteType(e.target.value)}
          className="rounded border border-mid-gray bg-linen p-2 text-sm text-dark-gray"
        >
          {noteTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Add a note…"
          className="w-full rounded border border-mid-gray bg-linen p-2 text-dark-gray"
        />
        <button
          onClick={handleAdd}
          disabled={saving || !content.trim()}
          className="rounded bg-deep-green px-4 py-2 text-sm font-medium text-linen transition hover:opacity-90 disabled:opacity-50"
        >
          Add note
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {notes.length === 0 && <p className="text-sm text-dark-gray">No notes yet.</p>}
        {notes.map((note) => (
          <div key={note.id} className="border-t border-mid-gray pt-3">
            <div className="flex items-center gap-2 text-xs text-bark">
              <span className="rounded bg-straw px-2 py-0.5 font-medium text-soil">{note.note_type}</span>
              <span>{new Date(note.created_at).toLocaleString()}</span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-dark-gray">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
