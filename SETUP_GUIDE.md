# 🎓 AI Study Assistant - Complete Setup Guide

## Quick Start

### 1. Start the Backend Server

```bash
cd back
npm install  # if not already done
npm run dev  # or npm start
```
Backend will run on: `http://localhost:5000`

### 2. Start the Frontend

```bash
cd Front/Front
npm install  # if not already done
npm run dev
```
Frontend will run on: `http://localhost:5173`

## ✅ What's Already Built

### Frontend Features Implemented:
✅ **User Authentication**
  - Register new users with name, email, password
  - Login with email/password
  - JWT token management
  - Auto-redirect based on auth status

✅ **Dashboard**
  - View all your study materials
  - Display statistics (total notes count)
  - Beautiful grid layout
  - Search/filter by subject

✅ **Note Management**
  - Create notes with:
    - Title
    - Subject (Mathematics, Science, History, Literature, etc.)
    - PDF URL link
  - Delete notes
  - View PDF links
  - Created date display

✅ **UI/UX**
  - Responsive design (works on mobile, tablet, desktop)
  - Beautiful purple gradient color scheme
  - Smooth animations and transitions
  - Clean, modern interface
  - Loading states and error messages

## 🤖 Next Step: Add AI Features (ChatGPT/Gemini)

Currently, the "Summarize with AI" and "Generate Assignment" buttons are visible but need backend implementation.

### To Enable AI Features:

#### Step 1: Get API Keys
- **For ChatGPT**: Sign up at [openai.com](https://openai.com), create API key
- **For Gemini**: Sign up at [google.com/ai](https://google.com/ai), get API key

#### Step 2: Install AI SDK in Backend

```bash
cd back

# For OpenAI (ChatGPT)
npm install openai

# OR for Google Gemini
npm install @google/generative-ai
```

#### Step 3: Create `.env` file in `back/` folder

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk-xxx...  # For ChatGPT
# OR
GEMINI_API_KEY=xxx...     # For Gemini
```

#### Step 4: Add AI Routes to Backend

Create a new file `back/controllers/aiController.js`:

```javascript
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const summarizeNote = async (req, res) => {
  try {
    const { title, subject, content } = req.body;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert educator in ${subject}. Provide a clear, concise summary of the following study material. Highlight key concepts and important points.`
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent:\n${content}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    res.json({
      summary: response.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating summary",
      error: error.message
    });
  }
};

const generateAssignment = async (req, res) => {
  try {
    const { title, subject, content } = req.body;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert educator in ${subject}. Create a comprehensive assignment based on the provided study material. Include 5-7 questions of varying difficulty (easy, medium, hard). Format the questions clearly.`
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent:\n${content}`
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    res.json({
      assignment: response.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating assignment",
      error: error.message
    });
  }
};

module.exports = { summarizeNote, generateAssignment };
```

#### Step 5: Add Routes

Create `back/routes/aiRoutes.js`:

```javascript
const express = require("express");
const { summarizeNote, generateAssignment } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/summarize", protect, summarizeNote);
router.post("/assignment", protect, generateAssignment);

module.exports = router;
```

#### Step 6: Register Routes in Backend

In `back/back.js`, add:

```javascript
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/ai", aiRoutes);
```

#### Step 7: Update Frontend Dashboard

The buttons are already wired up! When you click them, they will call:
- `POST /api/ai/summarize` for summary
- `POST /api/ai/assignment` for assignment

The responses will be displayed in modal dialogs (you may want to add modal components for better UX).

## 📂 Project Structure

```
AI Study Assistant/
├── back/                           # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js      # User auth logic
│   │   ├── noteController.js      # Note CRUD logic
│   │   └── aiController.js        # AI integration (to add)
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protection
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── noteRoutes.js
│   │   └── aiRoutes.js            # (to add)
│   ├── back.js
│   └── package.json
│
└── Front/Front/                    # Frontend (React + Vite)
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── NoteForm.jsx
    │   ├── services/
    │   │   └── api.js              # API client
    │   ├── styles/
    │   │   ├── Auth.css
    │   │   ├── Dashboard.css
    │   │   └── NoteForm.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## 🔑 API Endpoints

### Authentication
- `POST /api/users/register` - Register (no auth needed)
- `POST /api/users/login` - Login (no auth needed)
- `GET /api/users/profile` - Get profile (protected ✓)

### Notes
- `POST /api/notes` - Create note (protected ✓)
- `GET /api/notes` - Get all notes (protected ✓)
- `PUT /api/notes/:id` - Update note (protected ✓)
- `DELETE /api/notes/:id` - Delete note (protected ✓)

### AI (To Add)
- `POST /api/ai/summarize` - Get summary (protected)
- `POST /api/ai/assignment` - Generate assignment (protected)

## 🎨 Color Scheme

- **Primary**: Purple gradient (#667eea → #764ba2)
- **Success**: Green (#3c3)
- **Error**: Red (#c33)
- **Background**: Light Gray (#f5f7fa)

## 📱 Responsive Design

The app works perfectly on:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (below 768px)

## 🚀 Deployment

### Frontend
```bash
# Build for production
npm run build

# Preview build
npm run preview

# Deploy the `dist` folder to Vercel, Netlify, or similar
```

### Backend
- Deploy to Heroku, Railway, Render, or similar
- Update API URL in frontend from `http://localhost:5000` to production URL

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Ensure backend has `cors` middleware enabled |
| 404 errors | Verify backend is running on port 5000 |
| Token expired | Clear localStorage and login again |
| CSS build error | Ensure no incomplete CSS blocks in files |
| Cannot install npm packages | Use PowerShell with `-ExecutionPolicy Bypass` |

## 📞 Support

- **Backend Issues**: Check MongoDB connection, JWT secret in .env
- **Frontend Issues**: Check browser console, network tab in DevTools
- **API Issues**: Verify endpoints match between frontend and backend

## 🎯 Next Tasks

1. ✅ Frontend built - DONE
2. ⬜ Add AI integration (ChatGPT/Gemini)
3. ⬜ Create modal components for displaying AI responses
4. ⬜ Add PDF parsing capability (extract text from PDF files)
5. ⬜ Add file upload instead of just PDF URLs
6. ⬜ Deploy to production

---

**Your AI Study Assistant is ready to use!** 🚀

Start both servers, register an account, add a study material, and watch it work!
