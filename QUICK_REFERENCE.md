# 📋 Quick Reference Guide

## 🚀 Quick Start Commands

### Terminal 1: Backend
```bash
cd back
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd Front/Front
npm run dev
# App runs on http://localhost:5173
```

### Open in Browser
```
http://localhost:5173
```

## 📝 Sample Test Data

### Register Account
- **Name**: John Developer
- **Email**: john@example.com
- **Password**: password123

### Create Test Note
- **Title**: Python Basics
- **Subject**: Computer Science
- **PDF URL**: https://example.com/python-basics.pdf

(Note: PDF URL should be a valid URL, but content is currently just stored as URL)

## 🔑 File Locations

| File | Purpose | Path |
|------|---------|------|
| Login Component | User authentication page | `src/components/Login.jsx` |
| Register Component | User registration | `src/components/Register.jsx` |
| Dashboard | Main app view | `src/components/Dashboard.jsx` |
| Note Form | Create notes | `src/components/NoteForm.jsx` |
| API Service | Backend calls | `src/services/api.js` |
| Main App | Router setup | `src/App.jsx` |
| Styles | All CSS files | `src/styles/*.css` |

## 🛠️ Common Tasks

### Add New Subject to Dropdown
**File**: `src/components/NoteForm.jsx`
```javascript
// Find the subject select and add:
<option value="New Subject">New Subject</option>
```

### Change API Base URL
**File**: `src/services/api.js`
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
// Change to: 'https://your-production-url.com/api'
```

### Modify Color Scheme
**File**: `src/styles/Dashboard.css` (and other CSS files)
```css
/* Change gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* to your preferred colors */
```

### Add New Component
1. Create file: `src/components/NewComponent.jsx`
2. Add route in `src/App.jsx`
3. Create corresponding CSS file: `src/styles/NewComponent.css`

### Deploy Frontend
```bash
npm run build
# dist folder is ready to deploy
# Upload to Vercel, Netlify, etc.
```

## 🐛 Debug Checklist

- [ ] Is backend running on port 5000?
- [ ] Is frontend running on port 5173?
- [ ] Check browser console for JS errors (F12)
- [ ] Check Network tab for API errors
- [ ] Is MongoDB connection working in backend?
- [ ] Is JWT token in localStorage? (F12 → Application → Storage)
- [ ] Are CORS headers set in backend?

## 📊 Component Props & States

### NoteForm Props
```javascript
<NoteForm onNoteCreated={handleNoteCreated} />
// onNoteCreated: callback function when note is created
```

### Dashboard States
```javascript
notes = [ ]           // Array of note objects
loading = false       // Loading state
error = ""           // Error message if any
user = {             // Logged-in user object
  id,
  name,
  email
}
showForm = false     // Toggle form visibility
```

### Note Object Structure
```javascript
{
  _id: "mongo_id",
  title: "Python Basics",
  subject: "Computer Science",
  pdfUrl: "https://...",
  user: "user_id",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

## 🔐 Security Checklist

- [ ] Never commit API keys to git
- [ ] Use .env file for sensitive data
- [ ] JWT tokens are stored in localStorage (consider using httpOnly cookies)
- [ ] CORS is configured properly
- [ ] Input validation on both frontend and backend
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS prevention (React escapes by default)
- [ ] HTTPS in production

## 📈 Performance Tips

```javascript
// Good: Efficient fetch
const fetchNotes = async () => {
  setLoading(true);
  try {
    const response = await getNotes();
    setNotes(response.data);
  } finally {
    setLoading(false);
  }
};

// Bad: Multiple fetch calls
getNotes().then(r => setNotes(r.data));
getNotes().then(r => setNotes(r.data)); // Duplicate!
```

## 🎨 Styling Tips

### Add Custom Color
```css
.my-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
```

### Add Hover Effect
```css
.my-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}
```

### Responsive Mobile
```css
@media (max-width: 768px) {
  .my-container {
    padding: 1rem;
    flex-direction: column;
  }
}
```

## 📦 Dependencies Reference

```json
{
  "react": "^19.2.6",              // React library
  "react-dom": "^19.2.6",          // React DOM
  "react-router-dom": "^6.20.1",  // Routing
  "axios": "^1.6.5"                // HTTP requests
}
```

## 🚨 Error Messages Guide

| Error | Cause | Fix |
|-------|-------|-----|
| "User not found" | Wrong email | Check email spelling |
| "Invalid password" | Wrong password | Reset password |
| "CORS error" | Backend CORS not configured | Enable CORS in backend |
| "Cannot read localStorage" | Not authenticated | Login first |
| "PDF link not valid" | Invalid URL | Use correct PDF URL |
| "Network error" | Backend not running | Start backend with `npm run dev` |

## 📱 Browser DevTools Shortcuts

| Shortcut | Function |
|----------|----------|
| F12 | Open DevTools |
| Ctrl+Shift+I | Open DevTools |
| Ctrl+Shift+J | Open Console |
| Ctrl+Shift+E | Open Network |
| Ctrl+Shift+K | Open Storage |
| Cmd+Option+I | Mac DevTools |

## 🔄 Git Workflow

```bash
# Before pushing
git status                 # Check changes
git add .                  # Stage changes
git commit -m "message"    # Commit
git push                   # Push to remote

# Keep frontend clean
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
echo "dist/" >> .gitignore
```

## 📚 Useful Links

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Axios Docs](https://axios-http.com)
- [MDN Web Docs](https://developer.mozilla.org)
- [CSS Tricks](https://css-tricks.com)
- [OpenAI API](https://platform.openai.com)
- [Google Gemini API](https://ai.google.dev)

## 💡 Pro Tips

1. **Test on Mobile**: Use Chrome DevTools device emulation (Ctrl+Shift+M)
2. **Clear Cache**: Ctrl+Shift+Delete to clear browser cache
3. **Debug Console**: Use `console.log()` for debugging
4. **Network Throttling**: Simulate slow connections in DevTools
5. **Break on Errors**: DevTools → Sources → Pause on exceptions
6. **Redux DevTools**: Consider for state management if app grows

## 🆘 Getting Help

1. Check browser console for errors (F12)
2. Check network requests in DevTools
3. Verify backend is running
4. Check API responses in Network tab
5. Look for typos in component names and routes
6. Verify file paths are correct

---

**Need the full documentation?** See:
- 📖 `SETUP_GUIDE.md` - Complete setup instructions
- 🏗️ `ARCHITECTURE.md` - Component structure & data flow
- 📘 `FRONTEND_GUIDE.md` - Detailed frontend documentation
