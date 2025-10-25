import React, { useState, useEffect } from 'react';
import NoteCard from './NoteCard';
import Chatbot from './Chatbot';
import '../styles/notes.css';

export default function NotesPage({ token, user, onLogout }) {
  const [notes, setNotes] = useState([]);  // ✅ Initialize as empty array
  const [noteText, setNoteText] = useState('');

  const fetchNotes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('✅ Fetched notes:', data);
      setNotes(data);  // Set the notes array
    } catch (err) {
      console.error('❌ Failed to fetch notes:', err);
      setNotes([]);  // Set to empty array on error
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const saveNote = async () => {
    if (!noteText.trim()) return;
    
    try {
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: noteText }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      setNoteText('');
      fetchNotes();  // Refresh notes list
      console.log('✅ Note saved successfully');
    } catch (err) {
      console.error('❌ Failed to save note:', err);
    }
  };

  return (
    <div className="notes-container">
      <header className="notes-header">
        <div className="logo">
          <span className="logo-text">NEOLEARN</span>
        </div>
        <nav>
          <a href="#home">Home</a>
          <a href="#notes" className="active">Notes</a>
          <button className="btn-logout" onClick={onLogout}>
            Sign Out
          </button>
        </nav>
      </header>

      <div className="notes-content">
        <div className="notes-main">
          <h2>Your Digital Notebook 📓</h2>
          <textarea
            className="note-editor"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a new note here..."
          />
          <button className="btn-save" onClick={saveNote}>
            Save Note
          </button>

          <div className="notes-grid">
            {notes.length > 0 ? (
              notes.map((note) => (
                <NoteCard key={note.id} note={note} token={token} onDelete={fetchNotes} />
              ))
            ) : (
              <p style={{ color: '#aaa', marginTop: '2rem' }}>
                No notes yet. Create your first note above!
              </p>
            )}
          </div>
        </div>

        <Chatbot token={token} notes={notes} />
      </div>
    </div>
  );
}
