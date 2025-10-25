import React from 'react';

export default function NoteCard({ note, token, onDelete }) {
  const shareNote = async () => {
    const emailID = prompt('Enter email to share with:');
    if (!emailID) return;
    try {
      await fetch(`http://localhost:5000/api/notes/share/${note.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emailID }),
      });
      alert('Note shared successfully!');
    } catch (err) {
      alert('Failed to share note');
    }
  };

  return (
    <div className="note-card">
      <p className="note-content">{note.content}</p>
      <div className="note-footer">
        <span className="note-time">
          Last edited: {new Date(note.lastEdited).toLocaleString()}
        </span>
        <button className="btn-share" onClick={shareNote}>
          Share
        </button>
      </div>
    </div>
  );
}
