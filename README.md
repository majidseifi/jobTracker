# Job Application Tracker

A full-stack web application to track job applications with Kanban board, analytics dashboard, and interview scheduling.

## Tech Stack

**Frontend:** React, JavaScript, React Router, React Beautiful DnD, Recharts
**Database:** Google Sheets API
**Automation:** n8n (jobseeker workflow for auto-populating jobs)

## Architecture

- **Google Sheets** - Single source of truth for all job data
- **React App** - Direct integration with Google Sheets API for CRUD operations
- **n8n** - Automated job collection and insertion into Google Sheets

## Project Status

🚧 In Development
