import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'zentask_quick_notes';

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    content: 'Review sprint deliverables and prepare weekly sync presentation.',
    color: 'lavender',
    updatedAt: new Date().toLocaleDateString(),
  },
  {
    id: 'note-2',
    content: 'Ideas: test dark mode contrast levels and keyboard shortcuts for quick task entry.',
    color: 'amber',
    updatedAt: new Date().toLocaleDateString(),
  }
];

export const QuickNotes = ({ onConvertNoteToTask }) => {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  });

  const [newContent, setNewContent] = useState('');
  const [noteColor, setNoteColor] = useState('lavender');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes:', e);
    }
  }, [notes]);

  const handleAddNote = (e) => {
    e.preventDefault();
    const trimmed = newContent.trim();
    if (!trimmed) return;

    const newNote = {
      id: `note-${Date.now()}`,
      content: trimmed,
      color: noteColor,
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    setNotes([newNote, ...notes]);
    setNewContent('');
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const colorStyles = {
    lavender: 'bg-lavender-subtle text-lavender-dark border-lavender-subtle',
    amber: 'bg-warning-subtle text-dark border-warning-subtle',
    mint: 'bg-success-subtle text-success border-success-subtle',
    rose: 'bg-danger-subtle text-danger border-danger-subtle',
  };

  return (
    <div className="card border-0 rounded-4 shadow-xs mb-4 bg-white overflow-hidden">
      <div className="card-header bg-white border-0 pt-3 px-3 px-md-4 pb-0 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-3 p-1.5 bg-warning-subtle text-warning-emphasis">
            <i className="bi bi-sticky-fill fs-5"></i>
          </div>
          <div>
            <h6 className="fw-bold mb-0 text-dark">Quick Scratchpad</h6>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Jot thoughts &amp; brainstorm notes
            </span>
          </div>
        </div>
        <span className="badge bg-light text-secondary border rounded-pill py-1 px-2.5 small">
          {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
        </span>
      </div>

      <div className="card-body p-3 p-md-4">
        {/* Note input form */}
        <form onSubmit={handleAddNote} className="mb-3">
          <div className="position-relative">
            <textarea
              className="form-control rounded-3 p-2.5 small shadow-none border-light-subtle"
              rows="2"
              placeholder="Jot down a quick thought or idea..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              style={{ fontSize: '0.82rem', resize: 'none' }}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <div className="d-flex align-items-center gap-1">
              {['lavender', 'amber', 'mint', 'rose'].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`rounded-circle border p-0 ${noteColor === c ? 'ring-2' : ''}`}
                  style={{
                    width: '18px',
                    height: '18px',
                    backgroundColor:
                      c === 'lavender' ? '#ede9fe' : c === 'amber' ? '#fef3c7' : c === 'mint' ? '#dcfce7' : '#fee2e2',
                    borderColor: noteColor === c ? '#7c3aed' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setNoteColor(c)}
                  title={`Color: ${c}`}
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={!newContent.trim()}
              className="btn btn-lavender-primary btn-xs rounded-pill px-3 py-1 fw-semibold small shadow-xs"
              style={{ fontSize: '0.75rem' }}
            >
              <i className="bi bi-plus-lg me-1"></i> Save Note
            </button>
          </div>
        </form>

        {/* Note Cards List */}
        <div className="d-flex flex-column gap-2" style={{ maxHeight: '240px', overflowY: 'auto' }}>
          {notes.length === 0 ? (
            <div className="text-center text-muted small py-3 fst-italic">
              No scratchpad notes. Type above to add one!
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`p-2.5 rounded-3 border ${colorStyles[note.color] || colorStyles.lavender} transition-all`}
              >
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <p className="mb-1 small text-dark text-break fw-medium" style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                    {note.content}
                  </p>
                  <button
                    type="button"
                    className="btn btn-link text-muted p-0 border-0 flex-shrink-0 opacity-75 hover-opacity-100"
                    onClick={() => handleDeleteNote(note.id)}
                    title="Delete note"
                  >
                    <i className="bi bi-x fs-6"></i>
                  </button>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-1 text-muted" style={{ fontSize: '0.7rem' }}>
                  <span>{note.updatedAt}</span>
                  {onConvertNoteToTask && (
                    <button
                      type="button"
                      className="btn btn-link text-lavender-dark p-0 text-decoration-none fw-semibold"
                      style={{ fontSize: '0.7rem' }}
                      onClick={() => onConvertNoteToTask(note.content)}
                      title="Convert note into a task"
                    >
                      <i className="bi bi-arrow-right-short"></i> Make Task
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
