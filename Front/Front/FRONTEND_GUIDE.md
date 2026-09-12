# AI Study Assistant - Frontend Documentation

## 🎯 Project Overview

This is a React-based frontend for an AI Study Assistant application. Users can upload study materials (PDFs), organize them by subject, and receive AI-generated summaries and assignments.

## 📁 Project Structure

```
src/
├── components/
│   ├── Login.jsx           # User authentication page
│   ├── Register.jsx        # User registration page
│   ├── Dashboard.jsx       # Main dashboard with notes list
│   └── NoteForm.jsx        # Form to create new notes
├── services/
│   └── api.js              # API client with axios and auth interceptor
├── styles/
│   ├── Auth.css            # Authentication pages styling
│   ├── Dashboard.css       # Dashboard styling
│   └── NoteForm.css        # Form styling
├── App.jsx                 # Main app with routing
├── App.css                 # App-level styles
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
```bash
cd Front/Front
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Dependencies

### Core
- **react**: ^19.2.6 - UI library
- **react-dom**: ^19.2.6 - React DOM rendering
- **react-router-dom**: ^6.20.1 - Client-side routing
- **axios**: ^1.6.5 - HTTP client for API calls

## 🔌 API Integration

The frontend connects to the backend API with the following endpoints:

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

### Notes Management
- `POST /api/notes` - Create new note
- `GET /api/notes` - Get all user notes (protected)
- `PUT /api/notes/:id` - Update note (protected)
- `DELETE /api/notes/:id` - Delete note (protected)

### API Service
The `services/api.js` file handles:
- Base URL configuration
- Automatic JWT token injection in headers
- Error handling
- Request/response interceptors

## 🎨 Features

### 1. Authentication
- User registration with validation
- Secure login with JWT tokens
- Token persistence in localStorage
- Auto-redirect based on auth status

### 2. Dashboard
- Display all user study materials
- Show statistics (total notes count)
- View PDF links
- Delete notes
- Toggle form visibility

### 3. Note Creation
- Title input
- Subject selection (Mathematics, Science, History, etc.)
- PDF URL input
- Success/error feedback

### 4. UI/UX
- Responsive design (mobile-friendly)
- Beautiful gradient color scheme
- Smooth animations and transitions
- Clean, modern interface

## 🔐 Security

- JWT tokens stored in localStorage
- Token sent automatically with each request
- Protected routes require authentication
- Automatic redirect to login for unauthorized access

## 🤖 Adding AI Features (ChatGPT/Gemini)

To integrate ChatGPT or Gemini for summarization and assignment generation:

### Backend Implementation

1. **Install AI SDK**:
```bash
# For OpenAI
npm install openai

# For Google Gemini
npm install @google/generative-ai
```

2. **Create AI Service** (in backend):

```javascript
// For ChatGPT
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function summarizePDF(pdfText, subject) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert in ${subject}. Summarize the following content in a clear, concise manner.`
      },
      {
        role: "user",
        content: pdfText
      }
    ]
  });
  
  return response.choices[0].message.content;
}

async function generateAssignment(pdfText, subject) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert educator in ${subject}. Create a comprehensive assignment based on the following study material. Include 5-7 questions of varying difficulty.`
      },
      {
        role: "user",
        content: pdfText
      }
    ]
  });
  
  return response.choices[0].message.content;
}
```

3. **Add Backend Routes**:
```javascript
router.post("/:id/summarize", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    const summary = await summarizePDF(note.content, note.subject);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/assignment", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    const assignment = await generateAssignment(note.content, note.subject);
    res.json({ assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

4. **Update Frontend Components**:

```javascript
// In Dashboard.jsx - Update button handlers
const handleSummarize = async (noteId) => {
  try {
    const response = await fetch(`/api/notes/${noteId}/summarize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setSelectedSummary(data.summary);
    setShowSummaryModal(true);
  } catch (err) {
    console.error('Error fetching summary:', err);
  }
};

const handleAssignment = async (noteId) => {
  try {
    const response = await fetch(`/api/notes/${noteId}/assignment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setSelectedAssignment(data.assignment);
    setShowAssignmentModal(true);
  } catch (err) {
    console.error('Error generating assignment:', err);
  }
};
```

## 🛠️ Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🐛 Troubleshooting

### CORS Error
- Ensure backend has CORS enabled
- Backend should run on `http://localhost:5000`

### 404 Not Found
- Verify backend API endpoints match the frontend API calls
- Check network tab in browser developer tools

### Token Expiration
- Tokens expire after 7 days
- User will be redirected to login automatically

## 📱 Responsive Design

The app is fully responsive with breakpoints for:
- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (below 768px)

## 🎨 Color Scheme

- Primary Gradient: `#667eea` to `#764ba2` (Purple)
- Success: `#3c3` (Green)
- Error: `#c33` (Red)
- Background: `#f5f7fa` (Light Gray)

## 📝 License

ISC

## 🤝 Support

For issues or questions, please check the backend repository or contact the development team.
