import axios from 'axios';

const API_BASE_URL = 'https://ai-study-assistant-backend-p5t4.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ===============================
// USER AUTHENTICATION
// ===============================

export const registerUser = (userData) =>
  api.post('/users/register', userData);

export const loginUser = (credentials) =>
  api.post('/users/login', credentials);

export const getProfile = () =>
  api.get('/users/profile');


// ===============================
// NOTES
// ===============================

// Create note with PDF
export const createNote = (formData) =>
  api.post('/notes', formData);

// Get user's notes
export const getNotes = () =>
  api.get('/notes');

// Update note
export const updateNote = (id, noteData) =>
  api.put(`/notes/${id}`, noteData);

// Delete note
export const deleteNote = (id) =>
  api.delete(`/notes/${id}`);


// ===============================
// AI FEATURES
// ===============================

// Generate summary from the note's PDF
export const generateSummary = (noteId) =>
  api.post(`/ai/summarize/${noteId}`);

// Generate assignment from the note's PDF
export const generateAssignment = (noteId) =>
  api.post(`/ai/assignment/${noteId}`);


export default api;