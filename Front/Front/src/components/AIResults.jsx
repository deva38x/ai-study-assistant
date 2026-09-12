import { useState } from 'react';
import {
  generateSummary,
  generateAssignment
} from '../services/api';

import '../styles/AIResults.css';

export default function AIResults({ note }) {
  const [activeTab, setActiveTab] = useState('summary');

  const [summary, setSummary] = useState('');
  const [assignment, setAssignment] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ==========================================
  // GENERATE SUMMARY
  // ==========================================
  const handleGenerateSummary = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await generateSummary(note._id);

      setSummary(response.data.summary);
      setActiveTab('summary');

    } catch (err) {
      console.error('Summary error:', err);

      setError(
        err.response?.data?.message ||
        'Error generating summary'
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // GENERATE ASSIGNMENT
  // ==========================================
  const handleGenerateAssignment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await generateAssignment(note._id);

      setAssignment(response.data.assignment);
      setActiveTab('assignment');

    } catch (err) {
      console.error('Assignment error:', err);

      setError(
        err.response?.data?.message ||
        'Error generating assignment'
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="ai-results-container">

      {/* HEADER */}
      <div className="ai-header">
        <h2>
          🤖 AI Analysis for: {note.title}
        </h2>

        <span className="subject-label">
          {note.subject}
        </span>
      </div>


      {/* TABS */}
      <div className="ai-tabs">

        <button
          className={`tab-btn ${
            activeTab === 'summary' ? 'active' : ''
          }`}
          onClick={() => {
            setActiveTab('summary');
            setError('');
          }}
        >
          📝 Summary
        </button>


        <button
          className={`tab-btn ${
            activeTab === 'assignment' ? 'active' : ''
          }`}
          onClick={() => {
            setActiveTab('assignment');
            setError('');
          }}
        >
          ✏️ Assignment
        </button>

      </div>


      {/* CONTENT */}
      <div className="ai-content">

        {activeTab === 'summary' ? (

          <div className="ai-section">

            <div className="ai-actions">

              <button
                onClick={handleGenerateSummary}
                disabled={loading || !!summary}
                className="generate-btn"
              >
                {loading
                  ? 'Reading PDF & Generating Summary...'
                  : summary
                    ? 'Summary Generated ✓'
                    : 'Generate Summary'
                }
              </button>

            </div>


            {summary && (
              <div className="ai-result">

                <div className="result-content">

                  {summary
                    .split('\n')
                    .map((line, idx) =>
                      line.trim() ? (
                        <p key={idx}>
                          {line}
                        </p>
                      ) : null
                    )
                  }

                </div>

              </div>
            )}


            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

          </div>

        ) : (

          <div className="ai-section">

            <div className="ai-actions">

              <button
                onClick={handleGenerateAssignment}
                disabled={loading || !!assignment}
                className="generate-btn"
              >
                {loading
                  ? 'Reading PDF & Generating Assignment...'
                  : assignment
                    ? 'Assignment Generated ✓'
                    : 'Generate Assignment'
                }
              </button>

            </div>


            {assignment && (
              <div className="ai-result">

                <div className="result-content">

                  {assignment
                    .split('\n')
                    .map((line, idx) =>
                      line.trim() ? (
                        <p key={idx}>
                          {line}
                        </p>
                      ) : null
                    )
                  }

                </div>

              </div>
            )}


            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

          </div>

        )}

      </div>

    </div>
  );
}