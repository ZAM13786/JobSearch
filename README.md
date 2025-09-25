TalentFlow - A Mini Hiring Platform
TalentFlow is a feature-rich frontend application designed to simulate a modern hiring platform or Applicant Tracking System (ATS). It provides a comprehensive interface for managing job postings, tracking candidates through various hiring stages, and creating custom skill assessments. The application is built entirely on the frontend, utilizing Mock Service Worker (MSW) and IndexedDB to create a realistic and persistent backend experience without needing a server.

Live Demo: https://job-search-taupe-rho.vercel.app/
(You can update this link with your final Vercel URL)

Features
Job Management: Create, view, and edit job postings.

Candidate Tracking: View a list of candidates and track their progress through the hiring pipeline.

Interactive Kanban Board: A visual, drag-and-drop interface to move candidates between different hiring stages (Applied, Screening, Interview, etc.).

Custom Assessments: A dedicated module to build, edit, and preview custom skill assessments for different job roles.

Dynamic Dashboard: An overview of key metrics like active jobs and total candidates.

Client-Side Persistence: All data is stored locally in your browser using IndexedDB, so your changes persist between sessions.

Realistic API Simulation: Uses Mock Service Worker (MSW) to intercept network requests and simulate a real backend API, complete with artificial latency and error rates.

Dark/Light Mode: A theme toggler for user preference.

Technologies Used
Framework: React

Build Tool: Vite

Routing: React Router DOM

Styling: Tailwind CSS

API Mocking: Mock Service Worker (MSW)

Client-Side Database: Dexie.js (IndexedDB Wrapper)

Deployment: Vercel

Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
You need to have Node.js and npm installed on your machine.

Node.js

Installation
Clone the repository:

Bash

git clone https://github.com/ZAM13786/JobSearch.git
Navigate into the project directory:

Bash

cd JobSearch/talentflow
Install NPM packages:

Bash

npm install
Running the Development Server
Run the development server:

Bash

npm run dev
Open http://localhost:5173 to view it in your browser.

Deployment
This project is configured for easy deployment on Vercel. Simply connect your GitHub repository to a new Vercel project, set the Root Directory to talentflow, and it will deploy automatically on every push to the main branch.