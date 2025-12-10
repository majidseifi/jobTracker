# 📊 Job Application Tracker

A full-stack web application to track job applications with Kanban board, analytics dashboard, and interview scheduling. Uses Google Sheets as the database with automated job collection via n8n.

## 🚀 Features

- ✅ **Google Sheets Integration** - Single source of truth for all job data
- 📋 **Kanban Board** - Drag-and-drop status updates synced to Google Sheets
- 📊 **Analytics Dashboard** - Response rate tracking, status breakdowns, timeline analysis
- 🔍 **Search & Filter** - Real-time filtering by status, company, position
- 📝 **Interview Tracking** - Schedule interviews with notes and feedback
- 🤖 **Job Automation** - Auto-populated via n8n jobseeker workflow
- 💰 **Salary Tracking** - Track compensation ranges and offers
- 📅 **Application Timeline** - Visual timeline of your job search journey

## 🛠️ Tech Stack

**Frontend:**
- React 19 (functional components + hooks)
- React Router for navigation
- @dnd-kit for Kanban drag-and-drop
- Axios for API calls
- CSS3 with CSS variables for styling

**Backend:**
- Node.js + Express.js
- **Google Sheets API** (database layer)
- RESTful API architecture
- Input validation middleware
- CORS enabled

**Automation:**
- n8n workflow for automated job collection
- Direct integration with Google Sheets

## 🏗️ Architecture

```
┌─────────────┐
│   n8n       │  Scrapes job boards
│  Workflow   │  Writes to Google Sheets
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Google Sheets      │  ← Single Source of Truth
│  (Database)         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Express Backend    │  Reads/Writes via Sheets API
│  (REST API)         │  Validates data
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  React Frontend     │  Kanban, Analytics, Forms
│  (UI)               │
└─────────────────────┘
```

## 📁 Project Structure

```
jobTracker/
├── backend/                    # Express API server
│   ├── config/                 # Configuration files
│   │   └── googleSheets.js     # Google Sheets API setup
│   ├── credentials/            # Google Cloud credentials (gitignored)
│   │   └── google-sheets-credentials.json
│   ├── routes/                 # API routes
│   │   ├── applications.js     # CRUD operations
│   │   └── stats.js            # Analytics endpoints
│   ├── utils/                  # Helper functions
│   │   ├── db.js               # Google Sheets database layer
│   │   └── validation.js       # Input validation
│   └── server.js               # Express server setup
└── frontend/                   # React application
    └── src/
        ├── components/         # Reusable components
        │   ├── ApplicationCard.jsx
        │   ├── ApplicationForm.jsx
        │   ├── ApplicationList.jsx
        │   ├── Charts.jsx
        │   ├── Dashboard.jsx
        │   ├── FilterBar.jsx
        │   ├── KanbanBoard.jsx
        │   ├── KanbanCard.jsx
        │   ├── KanbanColumn.jsx
        │   └── Navbar.jsx
        ├── pages/              # Route pages
        │   ├── AnalyticsPage.jsx
        │   ├── ApplicationsPage.jsx
        │   ├── HomePage.jsx
        │   └── KanbanPage.jsx
        └── utils/              # API client & helpers
            ├── api.js
            ├── constants.js
            └── formatters.js
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 16+ and npm
- Google Cloud account (for Sheets API)
- Google Sheet with job data

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd jobTracker
```

2. Set up Google Cloud credentials:
   - Create a project in Google Cloud Console
   - Enable Google Sheets API
   - Create a service account
   - Download credentials JSON
   - Place in `backend/credentials/google-sheets-credentials.json`
   - Share your Google Sheet with the service account email

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Configure environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Update `SPREADSHEET_ID` with your Google Sheet ID

5. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server (from `backend/` directory):
```bash
npm start
# Server runs on http://localhost:5050
```

2. Start the frontend (from `frontend/` directory):
```bash
npm start
# App runs on http://localhost:3000
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 API Endpoints

### Applications
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get application by ID
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Analytics
- `GET /api/stats` - Get analytics and statistics

### Health Check
- `GET /api/health` - Server health check

## 🎯 What I Learned

- **Google Sheets API Integration** - Using Google Sheets as a database with the googleapis npm package
- **Service Account Authentication** - Setting up and using Google Cloud service accounts
- **RESTful API Design** - Implementing clean API patterns with Express.js
- **React State Management** - Managing complex state with hooks (useState, useEffect, useCallback)
- **Drag-and-Drop UI** - Creating intuitive Kanban interfaces with @dnd-kit
- **Data Visualization** - Building custom bar charts and dashboards
- **n8n Automation** - Integrating automated workflows with the application
- **Full-Stack Architecture** - Designing a system with multiple data sources (n8n + manual entry)

## 🚀 Future Enhancements

- [ ] Real-time updates using Google Sheets webhooks
- [ ] User authentication with Google OAuth
- [ ] Multi-user support with row-level permissions
- [ ] Email reminders for follow-ups using Gmail API
- [ ] Mobile app with React Native
- [ ] Chrome extension for one-click job saving
- [ ] AI-powered resume matching using OpenAI API
- [ ] Interview prep resources integration

## 🤖 n8n Integration

This app integrates with an n8n workflow that:
- Scrapes job boards (LinkedIn, Indeed, etc.)
- Filters jobs based on criteria
- Generates custom cover letters
- Automatically adds jobs to Google Sheets
- Runs on a schedule

The backend reads from the same Google Sheet, creating a seamless pipeline from job discovery to application tracking.

## 📝 License

MIT License
