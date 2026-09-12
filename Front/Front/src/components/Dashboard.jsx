import { useState, useEffect } from 'react';
import { getNotes, deleteNote } from '../services/api';
import NoteForm from './NoteForm';
import AIResults from './AIResults';
import '../styles/Dashboard.css';

export default function Dashboard({ onLogout }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [aiTab, setAiTab] = useState('summary'); // 'summary' or 'assignment'

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await getNotes();
      setNotes(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      onLogout();
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchNotes();
  }, [onLogout]);

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        setNotes(notes.filter((note) => note._id !== id));
        if (selectedNote?._id === id) {
          setSelectedNote(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete note');
      }
    }
  };

  const handleNoteCreated = () => {
    fetchNotes();
    setShowForm(false);
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setAiTab('summary');
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>📚 AI Study Assistant</h1>
          <div className="header-actions">
            {user && <span className="welcome">Welcome, {user.name}!</span>}
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Left Sidebar - Notes List */}
        <div className="sidebar">
          <button
            className="toggle-form-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Close' : '+ New Note'}
          </button>

          <div className="stats">
            <div className="stat-card">
              <h3>Total Notes</h3>
              <p className="stat-number">{notes.length}</p>
            </div>
          </div>

          <div className="notes-list">
            <h3>📋 Your Materials</h3>
            {loading ? (
              <div className="loading">Loading...</div>
            ) : notes.length === 0 ? (
              <div className="empty">No notes yet</div>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  className={`note-item ${selectedNote?._id === note._id ? 'active' : ''}`}
                  onClick={() => handleSelectNote(note)}
                >
                  <div className="note-title">{note.title}</div>
                  <div className="note-subject">{note.subject}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {error && <div className="error-message">{error}</div>}

          {/* Create Note Form */}
          {showForm && <NoteForm onNoteCreated={handleNoteCreated} />}

          {/* Notes Grid + AI Results */}
          <div className="content-area">
            {/* Notes Grid */}
            <div className="notes-section">
              <h2>All Study Materials</h2>
              {loading ? (
                <div className="loading">Loading your notes...</div>
              ) : notes.length === 0 ? (
                <div className="empty-state">
                  <p>No study materials yet. Create one to get started!</p>
                </div>
              ) : (
                <div className="notes-grid">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className={`note-card ${selectedNote?._id === note._id ? 'selected' : ''}`}
                      onClick={() => handleSelectNote(note)}
                    >
                      <div className="note-header">
                        <h3>{note.title}</h3>
                        <span className="subject-badge">{note.subject}</span>
                      </div>
                      <div className="note-content">
                        <p>
                          <strong>Created:</strong>{' '}
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>PDF:</strong>{' '}
                          <a
                            href={`http://localhost:5000${note.pdfUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pdf-link"
                          >
                            View PDF →
                          </a>
                        </p>
                      </div>
                      <div className="note-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note._id);
                          }}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Results Section - Shows on same page */}
            {selectedNote && <AIResults note={selectedNote} />}
          </div>
        </div>
      </main>
    </div>
  );
}
