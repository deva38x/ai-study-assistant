# 🎯 Frontend Architecture & Component Flow

## Application Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Main App (App.jsx)                   │
│              Router + Route Configuration               │
└─────────────────────────────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
        ┌────────┐    ┌────────┐    ┌──────────┐
        │ Login  │    │Register│    │Dashboard │
        │Component│    │Component│    │Component │
        └────────┘    └────────┘    └──────────┘
            │              │              │
            └──────────────┴──────────────┘
                           │
                (JWT Token stored in localStorage)
                           │
                    ┌──────────────┐
                    │  Auth Guard  │
                    │ (Redirects   │
                    │  if no token)│
                    └──────────────┘
```

## Component Tree

```
App.jsx (Router & Routes)
│
├── /login → Login.jsx
│   ├── Email Input
│   ├── Password Input
│   ├── Login Button
│   └── Link to Register
│
├── /register → Register.jsx
│   ├── Name Input
│   ├── Email Input
│   ├── Password Input
│   ├── Confirm Password Input
│   ├── Register Button
│   └── Link to Login
│
└── /dashboard → Dashboard.jsx (Protected)
    ├── Header
    │   ├── Title (📚 AI Study Assistant)
    │   ├── Welcome Message
    │   └── Logout Button
    │
    ├── Sidebar
    │   ├── "New Note" Button
    │   └── Statistics Card
    │       └── Total Notes Count
    │
    └── Main Content
        ├── NoteForm.jsx (Conditional - Shows when "New Note" clicked)
        │   ├── Title Input
        │   ├── Subject Dropdown
        │   ├── PDF URL Input
        │   ├── Create Button
        │   └── Success/Error Messages
        │
        └── Notes Grid
            └── For Each Note:
                ├── Note Card
                │   ├── Note Title
                │   ├── Subject Badge
                │   ├── Creation Date
                │   ├── PDF Link
                │   ├── Delete Button
                │   ├── Summarize Button (AI)
                │   └── Generate Assignment Button (AI)
                └── (Repeats for each note)
```

## Data Flow

### Authentication Flow
```
User Input (Login/Register)
         ↓
    API Request (services/api.js)
         ↓
    Backend Validation
         ↓
    JWT Token Response
         ↓
    Store in localStorage
         ↓
    Redirect to Dashboard
```

### Note Creation Flow
```
User fills NoteForm
         ↓
    Form Submit
         ↓
API Request (POST /api/notes)
         ↓
    Auto-add JWT token (interceptor)
         ↓
    Backend Creates Note
         ↓
    Return created note
         ↓
Refresh notes list
         ↓
Show success message
```

### Protected Route Flow
```
User tries to access /dashboard
         ↓
    Check localStorage for token
         ↓
    Token exists? → YES → Load Dashboard
         ↓                      ↓
         NO                   Display Notes
         ↓
    Redirect to /login
```

## State Management (by Component)

### Login Component
```javascript
State:
  - email: string
  - password: string
  - error: string
  - loading: boolean

Actions:
  - setEmail()
  - setPassword()
  - handleSubmit() → API call
  - Navigate to /dashboard on success
```

### Dashboard Component
```javascript
State:
  - notes: array
  - loading: boolean
  - error: string
  - user: object
  - showForm: boolean

Actions:
  - fetchNotes() → API call
  - handleDeleteNote(id) → API call
  - handleLogout() → Clear localStorage
  - handleNoteCreated() → Refresh notes list
```

### NoteForm Component
```javascript
State:
  - title: string
  - subject: string
  - pdfUrl: string
  - error: string
  - loading: boolean
  - success: string

Actions:
  - handleSubmit() → API call
  - Form validation
  - onNoteCreated() callback
```

## API Service (api.js) - Under the Hood

```javascript
┌────────────────────────────────────┐
│   Axios Instance Created           │
│   baseURL: localhost:5000/api      │
└────────────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
Request Interceptor    Response Interceptor
      │                     │
  ┌───────────┐         ┌───────────┐
  │Add JWT    │         │Handle     │
  │token from │         │errors     │
  │localStorage          │           │
  └───────────┘         └───────────┘
      │                     │
      └──────────┬──────────┘
                 │
      ┌──────────────────────┐
      │  Exported Functions  │
      ├──────────────────────┤
      │ registerUser()       │
      │ loginUser()          │
      │ getProfile()         │
      │ createNote()         │
      │ getNotes()           │
      │ updateNote()         │
      │ deleteNote()         │
      └──────────────────────┘
```

## CSS Architecture

### File Organization
```
src/styles/
├── Auth.css          (Login & Register pages)
│   ├── .auth-container
│   ├── .auth-card
│   ├── .form-group
│   ├── .error-message
│   └── .success-message
│
├── NoteForm.css      (Create note form)
│   ├── .note-form-container
│   ├── .form-group
│   ├── .submit-btn
│   └── Messages
│
├── Dashboard.css     (Main dashboard & notes)
│   ├── .dashboard (main container)
│   ├── .header (top navigation)
│   ├── .sidebar (left panel)
│   ├── .notes-grid (responsive grid)
│   ├── .note-card (individual note)
│   └── .note-actions (buttons)
│
├── App.css           (App-level styles)
│
└── index.css         (Global reset & typography)
    ├── * { box-sizing reset }
    ├── Global fonts & colors
    └── Utility classes
```

### Responsive Breakpoints
```
Desktop:  1024px and above
├── 2 column grid
├── Full sidebar visible
└── All features visible

Tablet:   768px - 1023px
├── 1-2 column grid
├── Compact sidebar
└── Adjusted spacing

Mobile:   Below 768px
├── 1 column grid
├── Sidebar hides or stacks
├── Touch-friendly buttons
└── Simplified layout
```

## Authentication & Security

```
┌─────────────────────────────────────────────┐
│    User Credentials (email, password)       │
└─────────────────────────────────────────────┘
              ↓ (via HTTPS in production)
┌─────────────────────────────────────────────┐
│          Backend Validation                 │
│  - Email exists check                       │
│  - Password bcrypt comparison               │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│      JWT Token Generated                    │
│  - User ID embedded                         │
│  - Expires in 7 days                        │
│  - Secret key in .env                       │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  Token stored in localStorage               │
│  (Sent with every API request)              │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│    Protected API Routes                     │
│  - Middleware verifies token                │
│  - Decrypts user ID from token              │
│  - Performs action as authenticated user    │
└─────────────────────────────────────────────┘
```

## Color Scheme & Design System

```
Primary Brand:
┌──────────────────────────────────────┐
│  Gradient: #667eea → #764ba2         │
│  Used for: Buttons, headers, badges  │
└──────────────────────────────────────┘

Status Colors:
┌──────────────────────────────────────┐
│  Success: #3c3  (Green)              │
│  Error:   #c33  (Red)                │
│  Info:    #09c  (Blue)               │
└──────────────────────────────────────┘

Neutral:
┌──────────────────────────────────────┐
│  Background: #f5f7fa  (Light gray)   │
│  Text:       #333     (Dark gray)    │
│  Borders:    #ddd     (Light gray)   │
│  Cards:      #fff     (White)        │
└──────────────────────────────────────┘
```

## Form Validation

```
Login Form:
├── Email: Required, valid email format
└── Password: Required

Register Form:
├── Name: Required, non-empty
├── Email: Required, valid format, unique
├── Password: Required
└── Confirm Password: Must match password

Note Form:
├── Title: Required, non-empty
├── Subject: Required, from dropdown
└── PDF URL: Required, valid URL format
```

## Event Listeners & Handlers

```
Login.jsx
├── form.onSubmit() → handleSubmit()
├── email.onChange() → setEmail()
└── password.onChange() → setPassword()

Register.jsx
├── form.onSubmit() → handleSubmit()
├── name.onChange() → setName()
├── email.onChange() → setEmail()
├── password.onChange() → setPassword()
└── confirmPassword.onChange() → setConfirmPassword()

Dashboard.jsx
├── logout-btn.onClick() → handleLogout()
├── toggle-form-btn.onClick() → setShowForm()
├── delete-btn.onClick() → handleDeleteNote()
├── summarize-btn.onClick() → (Coming with AI)
└── assignment-btn.onClick() → (Coming with AI)

NoteForm.jsx
├── form.onSubmit() → handleSubmit()
├── title.onChange() → setTitle()
├── subject.onChange() → setSubject()
└── pdfUrl.onChange() → setPdfUrl()
```

## Performance Optimizations

```
Current:
✓ React lazy loading (routes could use React.lazy)
✓ CSS minification (Vite handles this)
✓ JWT token reuse (no repeated login)
✓ Efficient grid layout (CSS Grid)

Potential Future:
□ React.lazy() for route-based code splitting
□ useMemo() for expensive computations
□ useCallback() for handler functions
□ Image optimization
□ Caching strategies
```

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable component structure
- ✅ Secure authentication
- ✅ Responsive design
- ✅ Good performance
- ✅ Easy to extend with AI features
