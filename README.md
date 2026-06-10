<div align="center">

# SkillBridge
**AI-Powered Resume Analyzer & Job Recommendation Platform**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## Overview

SkillBridge is a full-stack MERN application that analyzes resumes using AI, matches users with relevant job listings, identifies skill gaps, and generates personalized learning roadmaps — all in one platform.

![Landing Page](https://raw.githubusercontent.com/mrjfsd/SkillBridge/main/assets/Screenshots/landing%20Page.png)

---

## Features

![Features](https://raw.githubusercontent.com/mrjfsd/SkillBridge/main/assets/Screenshots/features.png)

- **AI Resume Analysis** — Upload a PDF and extract skills, experience, and education automatically
- **Job Matching** — Real-time job listings via JSearch API, ranked by AI match score
- **Skill Gap Detection** — Side-by-side comparison of your skills vs job requirements
- **Learning Roadmap** — AI-generated 4-week plan with curated courses per missing skill
- **AI Resume Enhancement** — Gemini AI rewrites and optimizes your resume for ATS compatibility
- **PDF Export** — Download your analyzed report and improved resume

---

## Resume Dashboard

![Dashboard](https://raw.githubusercontent.com/mrjfsd/SkillBridge/main/assets/Screenshots/dashboard.png)

Create a new resume from scratch with AI assistance or upload an existing PDF for automatic parsing. Uploaded resumes are listed with quick actions to Edit, Find Jobs, Rename, or Delete.

---

## Job Recommendations

![Job Search](https://raw.githubusercontent.com/mrjfsd/SkillBridge/main/assets/Screenshots/job-search.png)

After parsing your resume, SkillBridge queries the **JSearch API** in real-time to fetch live job listings from across the web — including LinkedIn, Indeed, and other major job boards. Each listing is then scored by **Gemini AI** against your resume's extracted skills and experience. Jobs are ranked by relevance so the most suitable opportunities appear first. Use **Check Match** on any listing for a detailed breakdown of how well your profile fits that role.

---

## Skill Gap Analysis

![Skill Gap](https://raw.githubusercontent.com/mrjfsd/SkillBridge/main/assets/Screenshots/skill-gap.png)

For any job listing, SkillBridge compares your resume's skills against the job requirements and shows a match score. Missing skills are clearly highlighted, and Gemini AI generates a personalized **4-week learning roadmap** with curated resources to help you close those gaps efficiently.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React.js, Vite, CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| AI | Gemini 2.5 Flash (via OpenAI-compatible API) |
| Job Data | JSearch API (RapidAPI) |
| Media | ImageKit |
| Auth | JWT, bcrypt |

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Gemini API key
- JSearch API key (RapidAPI)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/mrjfsd/SkillBridge.git
cd SkillBridge
```

**2. Setup the server**
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
JSEARCH_API_KEY=your_jsearch_api_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_key
```

Start the server:
```bash
node server.js
```

**3. Setup the client**
```bash
cd ../client
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Project Structure

```
SkillBridge/
├── assets/
│   └── Screenshots/
├── client/                 # React frontend (Vite)
│   └── src/
│       └── components/
├── server/                 # Node.js backend
│   ├── configs/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
└── README.md
```

---

## Author

**Mohammad Rayyan Jameel**
- GitHub: [@mrjfsd](https://github.com/mrjfsd)
- LinkedIn: [Mohammad Rayyan Jameel](https://www.linkedin.com/in/rayyan-jameel-521b06341)
