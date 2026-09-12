import { useState } from 'react';
import { createNote } from '../services/api';
import '../styles/NoteForm.css';

export default function NoteForm({ onNoteCreated }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    // Validate fields
    if (!title.trim() || !subject.trim() || !pdfFile) {
      setError('Title, subject and PDF are required');
      return;
    }

    // Make sure the selected file is actually a PDF
    if (pdfFile.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('pdf', pdfFile);

      await createNote(formData);

      // Clear form after successful upload
      setTitle('');
      setSubject('');
      setPdfFile(null);

      // Reset the file input
      e.target.reset();

      setSuccess('Study material created successfully!');

      if (onNoteCreated) {
        onNoteCreated();
      }

      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (err) {
      console.error('Create note error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to create study material'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-form-container">
      <h2>Create New Study Material</h2>

      <form onSubmit={handleSubmit}>

        {/* TITLE */}
        <div className="form-group">
          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter study material title"
            required
          />
        </div>

        {/* SUBJECT */}
        <div className="form-group">
          <label>Subject</label>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="">Select a subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Literature">Literature</option>
            <option value="English">English</option>
            <option value="Geography">Geography</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* PDF */}
        <div className="form-group">
          <label>Study PDF</label>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            required
          />

          {pdfFile && (
            <p className="selected-file">
              Selected: {pdfFile.name}
            </p>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading
            ? 'Uploading PDF...'
            : 'Create Study Material'}
        </button>

      </form>
    </div>
  );
}