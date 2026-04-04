# Feedpulse - Feedback Management System with AI Analysis

A modern full-stack web application for collecting, analyzing, and managing user feedback using **Gemini AI** for intelligent sentiment analysis, categorization, and priority scoring.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![Express](https://img.shields.io/badge/Express-5.2-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-9.3-green)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)
![License](https://img.shields.io/badge/License-ISC-blue)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Available Scripts](#available-scripts)
- [Project Architecture](#project-architecture)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Feedpulse is a complete feedback management solution that:
- Collects user feedback with categorization (Bug, Feature Request, Improvement, Other)
- Uses **Google Gemini AI** to automatically analyze feedback sentiment, priority, and extract key themes
- Provides an **admin dashboard** for managing, filtering, and analyzing feedback
- Generates **weekly AI-powered insights** from collected feedback
- Supports feedback reanalysis and status tracking

**Demo Flow:**
1. Users submit feedback on the home page (`/`)
2. Backend processes feedback with Gemini AI
3. Admins view and manage feedback on dashboard (`/dashboard`)
4. Generate weekly summaries with AI analysis

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16.2.2** - React framework with App Router
- **React 19.2.4** - Modern UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS styling
- **ESLint 9** - Code quality

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.2.1** - Web framework
- **TypeScript 6.0.2** - Type safety
- **MongoDB 9.3.3** + **Mongoose** - NoSQL database with ODM
- **Google Gemini API 2.5 Flash** - AI analysis engine
- **CORS** - Cross-origin resource sharing
- **Express Rate Limiting** - API request throttling
- **Axios** - HTTP client

---

## ✨ Key Features

### Frontend Features
✅ **Feedback Submission Form**
- Collect name, email, title, description, and category
- Real-time character count with validation (20-200 chars)
- Instant success/error feedback messages

✅ **Admin Dashboard** (`/dashboard`)
- View all submitted feedback in a paginated list (10 items per page)
- **Filter & Sort**:
  - By Category: Bug, Feature Request, Improvement, Other
  - By Status: New, In Review, Resolved
  - Sort by: Latest, Oldest, Priority (High→Low), Sentiment
  - Search by title or AI summary
- **AI Insights Panel**:
  - Sentiment badge (Positive, Neutral, Negative)
  - Priority score with visual progress bar (0-10)
  - AI-generated summary of feedback
- **Weekly AI Summary**: Generate theme analysis of last 7 days
- **Actions**: Update status, reanalyze with AI, delete feedback

✅ **Authentication**
- Simple login system (localStorage-based token)
- Logout functionality

### Backend Features
✅ **Feedback Management**
- CRUD operations for feedback
- MongoDB persistence with indexed queries
- Comprehensive error handling

✅ **AI Integration**
- Automatic Gemini API analysis on submission
- Safe error handling (doesn't break on AI failure)
- Manual reanalysis option
- Extracts:
  - **Category**: Bug, Feature, Improvement
  - **Sentiment**: Positive, Neutral, Negative
  - **Priority Score**: 1-10 scale
  - **Summary**: AI-generated brief description
  - **Tags**: Automated keyword extraction

✅ **Analytics**
- Weekly summary generation
- Theme extraction from feedback
- AI-powered insights

✅ **Security**
- Rate limiting on feedback submissions
- Email validation
- CORS protection
- Input validation (min/max lengths)

---

## 📁 Project Structure

```
Feedpulse/
├── frontend/                           # Next.js Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Home page (feedback form)
│   │   │   ├── dashboard/             # Admin dashboard
│   │   │   │   └── page.tsx           # Dashboard with feedback management
│   │   │   ├── login/                 # Login page
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx             # Root layout
│   │   │   └── page.css               # Dashboard styles
│   │   ├── components/
│   │   │   ├── FeedbackForm.tsx       # Feedback submission form
│   │   │   └── FeedbackForm.css       # Form styles
│   │   ├── services/
│   │   │   └── api.ts                 # API service (fetch wrapper)
│   │   ├── types/                     # TypeScript types
│   │   └── utils/                     # Helper utilities
│   ├── public/                        # Static assets
│   ├── package.json                   # Frontend dependencies
│   ├── tsconfig.json                  # TypeScript config
│   ├── next.config.js                 # Next.js config
│   └── tailwind.config.ts             # Tailwind CSS config
│
├── backend/                           # Express.js Backend API
│   ├── src/
│   │   ├── server.ts                  # Entry point (Port 4000)
│   │   ├── config/                    # Database & environment configs
│   │   ├── controllers/
│   │   │   ├── feedback.controller.ts # CRUD + reanalysis logic
│   │   │   └── analytics.controller.ts # Weekly summary logic
│   │   ├── models/
│   │   │   └── feedback.model.ts      # MongoDB schema with AI fields
│   │   ├── routes/
│   │   │   ├── feedback.routes.ts     # Feedback endpoints
│   │   │   └── analytics.routes.ts    # Analytics endpoints
│   │   ├── services/
│   │   │   └── gemini.service.ts      # Gemini API integration
│   │   ├── middleware/
│   │   │   └── rateLimiter.ts         # Rate limiting middleware
│   │   └── utils/                     # Helper utilities
│   ├── package.json                   # Backend dependencies
│   ├── tsconfig.json                  # TypeScript config
│   └── .env.example                   # Environment variables template
│
├── .gitignore                        # Git ignore rules
├── README.md                         # This file
└── SETUP.md                          # Quick setup guide
```

---

## 📦 Prerequisites

**Required:**
- **Node.js v18+** - [Download](https://nodejs.org/)
- **npm v9+** or **yarn v3+**
- **MongoDB** - Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Google Gemini API Key** - [Get it here](https://ai.google.dev/)

**Check installation:**
```bash
node --version
npm --version
```

---

## ⚙️ Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd Feedpulse
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

#### Backend `.env` (in `backend/` directory)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```bash
# Server
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/feedpulse
# OR MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/feedpulse

# Gemini AI
GEMINI_API_KEY=your_actual_gemini_api_key
```

#### Frontend `.env.local` (in `frontend/` directory)
Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🚀 Running the Project

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
✅ Backend runs on: **http://localhost:4000**
✅ Health check: **GET http://localhost:4000/**

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Frontend runs on: **http://localhost:3000**

### Access Application
- **Submit Feedback**: http://localhost:3000 (home page)
- **Admin Dashboard**: http://localhost:3000/dashboard (requires login)
- **Login Page**: http://localhost:3000/login

---

## 📡 API Endpoints

All endpoints use `http://localhost:4000/api` as the base URL.

### Feedback Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/feedback` | Submit new feedback (rate-limited) |
| **GET** | `/feedback` | Get all feedback |
| **GET** | `/feedback/:id` | Get single feedback by ID |
| **PUT** | `/feedback/reanalyze/:id` | Reanalyze feedback with Gemini AI |
| **PATCH** | `/feedback/:id/status` | Update feedback status |
| **DELETE** | `/feedback/:id` | Delete feedback |

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/analytics/weekly-summary` | Generate AI-powered weekly summary |

### Request/Response Examples

#### Submit Feedback
```bash
POST /api/feedback
Content-Type: application/json

{
  "title": "Login button not working",
  "description": "The login button on the homepage is not clickable. I tried clicking multiple times but nothing happens.",
  "category": "Bug",
  "submitterName": "John Doe",
  "submitterEmail": "john@example.com"
}
```

Response (201 Created):
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Login button not working",
    "description": "The login button on the homepage is not clickable...",
    "category": "Bug",
    "status": "New",
    "ai_sentiment": "Negative",
    "ai_priority": 8,
    "ai_summary": "Critical login button malfunction affecting user access",
    "ai_tags": ["button", "login", "ui"],
    "ai_processed": true,
    "createdAt": "2026-04-04T12:00:00Z",
    "updatedAt": "2026-04-04T12:00:00Z"
  }
}
```

#### Reanalyze Feedback
```bash
PUT /api/feedback/507f1f77bcf86cd799439011/reanalyze
```

#### Get All Feedback
```bash
GET /api/feedback
```

Returns paginated feedback list with AI analysis.

---

## 📝 Available Scripts

### Backend Scripts
```bash
npm run dev     # Start development server with auto-reload (Port 4000)
npm test        # Run test suite with in-memory MongoDB
```

### Frontend Scripts
```bash
npm run dev     # Start development server (http://localhost:3000)
npm run build   # Build for production
npm start       # Run production build
npm run lint    # Run ESLint
```

---

## 🧪 Testing

The backend includes comprehensive Jest test suites for feedback and Gemini service functionality. Tests use an in-memory MongoDB instance for isolated, fast execution without requiring external databases.

### Run All Tests
```bash
cd backend
npm test
```

### Run Tests in Watch Mode
```bash
cd backend
npm test -- --watch
```

### Test Coverage Report
```bash
cd backend
npm test -- --coverage
```

### Test Files
- `src/tests/feedback.test.ts` - Feedback API endpoint tests (POST, PATCH operations)
- `src/tests/gemini.test.ts` - Gemini AI service tests (mocked API responses)
- `src/tests/setup.ts` - Jest setup with MongoDB Memory Server integration

### Key Testing Features
✅ **In-memory MongoDB** - No external database needed for tests  
✅ **Mocked Gemini API** - No API key required; responses are controlled  
✅ **Fast Execution** - Tests complete in ~2-3 seconds  
✅ **Proper Async Cleanup** - `afterAll()` ensures connections are closed  
✅ **Test Isolation** - `beforeEach()` clears mocks between tests  

### Test Examples
```typescript
// Feedback submission test
it("should save feedback and return AI result", async () => {
  const res = await request(app)
    .post("/api/feedback")
    .send({
      title: "Test bug",
      description: "Something is broken with the application",
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.data.title).toBe("Test bug");
});
```

---

## 🧠 Project Architecture

### Data Flow

```
1. User submits feedback on home page
   ↓
2. Frontend sends POST request to /api/feedback
   ↓
3. Backend receives request & saves to MongoDB
   ↓
4. Backend calls Gemini API for analysis
   ↓
5. AI returns: sentiment, priority, category, summary, tags
   ↓
6. Feedback saved with AI results to DB
   ↓
7. Admin views on dashboard with filtering/sorting
   ↓
8. Admin can reanalyze, update status, or delete
```

### Feedback Model Schema

```typescript
interface Feedback {
  _id: ObjectId;
  title: string;              // Max 120 chars
  description: string;        // 20-200 chars
  category: "Bug" | "Feature Request" | "Improvement" | "Other";
  status: "New" | "In Review" | "Resolved";
  submitterName?: string;
  submitterEmail?: string;    // Validated email format

  // AI Analysis Fields
  ai_category?: string;
  ai_sentiment?: "Positive" | "Neutral" | "Negative";
  ai_priority?: number;       // 1-10 scale
  ai_summary?: string;
  ai_tags?: string[];
  ai_processed?: boolean;

  createdAt: Date;
  updatedAt: Date;
}
```

### Authentication
- Login page accepts credentials (currently simple token-based)
- Token stored in `localStorage` as `admin-auth`
- Dashboard redirects to login if token missing

---

## 🔐 Environment Variables Reference

### Backend (.env)
| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | ✅ | Server port (default: 4000) |
| `NODE_ENV` | ✅ | Environment mode (development/production) |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |

### Frontend (.env.local)
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL |

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

### Development Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `cd backend && npm test`
4. Commit with clear messages: `git commit -m "feat: add new feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

### Coding Standards
- Use TypeScript for all code
- Follow existing code style
- Write tests for new features
- Update README for significant changes
- Use meaningful variable and function names

### Reporting Issues
- Use GitHub Issues to report bugs
- Include steps to reproduce
- Provide error messages and logs
- Specify your environment (OS, Node.js version, etc.)

---

## 🛠️ Troubleshooting

### Port 4000 Already in Use
```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error
- Verify MongoDB is running (`mongod` command)
- Check `MONGO_URI` in `.env`
- For MongoDB Atlas: whitelist your IP address

### Gemini API Issues
- Verify `GEMINI_API_KEY` is correct
- Check API quota limits
- Test with a simple prompt in Gemini Studio

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Backend CORS is enabled for all origins
- Frontend API URL must match `NEXT_PUBLIC_API_URL`

### Test Timeout Issues
- MongoDB Memory Server takes time to download on first run
- Increase timeout: `jest --testTimeout=30000`
- Clear cache: `rm -rf node_modules/.cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Build Errors
```bash
# Clear all caches
cd backend && rm -rf dist build .next
cd ../frontend && rm -rf .next out

# Reinstall dependencies
npm install
```

---

## 📦 Project Maintenance

### Regular Tasks
- Run tests before deploying: `npm test`
- Keep dependencies updated: `npm outdated` and `npm update`
- Monitor API rate limits and quotas
- Review error logs and user feedback
- Backup MongoDB Atlas data regularly

### Performance Optimization
- Use MongoDB indexes for large datasets
- Implement pagination in frontend
- Cache API responses where appropriate
- Monitor Gemini API costs and usage

---

## 📈 Deployment Guide

### Deploy Backend
Recommended platforms: Heroku, Railway, Render, or AWS

```bash
# Set environment variables in your deployment platform:
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
GEMINI_API_KEY=your_api_key
PORT=4000
```

**Steps:**
1. Commit your code to Git
2. Connect repository to deployment platform
3. Set environment variables
4. Deploy (platform automatically runs `npm install`)

### Deploy Frontend  
Recommended platforms: Vercel, Netlify, or AWS S3 + CloudFront

```bash
# Build for production
npm run build

# Deploy the .next directory (Vercel/Netlify handle this automatically)
```

**Environment for Frontend:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

---

## 📊 Database Indexes

The Feedback model includes a compound index for optimal query performance:
```
Index: { status: 1, category: 1, ai_priority: 1, createdAt: -1 }
```

This enables fast filtering by status, category, and sorting.

---

## 📚 Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [Google Gemini API](https://ai.google.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Jest Testing Framework](https://jestjs.io/)
- [MongoDB Memory Server](https://github.com/mongodb-js/mongodb-memory-server)
- [Supertest - HTTP Testing](https://github.com/visionmedia/supertest)

---

## 🎓 Development Tips

1. **API Testing**: Use Postman or Thunder Client to test endpoints
2. **Database**: Use MongoDB Compass for visual database management
3. **Logging**: Check browser console (frontend) and terminal (backend) for debugging
4. **Rate Limiting**: Default 100 requests per 15 minutes on feedback submission
5. **AI Fallback**: If Gemini fails, feedback still saves but without AI analysis
6. **Testing**: Run tests before each commit to catch issues early

---

**Happy Building! 🚀**

> For detailed setup instructions, see [SETUP.md](SETUP.md)  
> For troubleshooting help, check the [Troubleshooting](#troubleshooting) section above
