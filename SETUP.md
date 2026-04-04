# Setup Guide for New Devices

A quick-start guide for getting **Feedpulse** running on a new device with AI-powered feedback analysis.

---

## ✅ Prerequisites Checklist

Before you start, verify you have these installed:

- [ ] **Node.js v18+** - Check with: `node --version`
- [ ] **npm v9+** - Check with: `npm --version`
- [ ] **Git** - Check with: `git --version`
- [ ] **MongoDB** - Either locally installed or MongoDB Atlas account
- [ ] **Google Gemini API Key** - Get from: https://ai.google.dev/

---

## 🔧 Step-by-Step Setup

### Step 1: Clone & Navigate to Project
```bash
git clone <repository-url>
cd Feedpulse
```

### Step 2: Install Dependencies

#### Backend Installation
```bash
cd backend
npm install
```

#### Frontend Installation (Open new terminal)
```bash
cd frontend
npm install
```

---

## 🗄️ Database Setup

### Option A: Local MongoDB (Recommended for Development)

#### Windows
1. **Download MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows and download the installer

2. **Install MongoDB**
   - Run the installer
   - Choose "Run service as Network Service" (for auto-start)
   - Default installation path: `C:\Program Files\MongoDB\Server\7.0`

3. **Start MongoDB**
   - Open Services (services.msc)
   - Find "MongoDB Server"
   - Right-click → Start

4. **Verify Connection**
   ```bash
   mongosh
   # Should open MongoDB shell
   ```

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify
mongosh
```

#### Linux (Ubuntu/Debian)
```bash
# Install MongoDB
sudo apt-get install mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

### Option B: MongoDB Atlas (Cloud - Easy for Teams)

1. **Create Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up (free tier: 512MB storage, no credit card needed)

2. **Create a Cluster**
   - Click "Create" → Select "Free" tier
   - Choose your region (closest to you)
   - Wait 5-10 minutes for cluster deployment

3. **Get Connection String**
   - Click "Connect"
   - Choose "Drivers" (not "Shell")
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/feedpulse`

4. **Update Backend `.env`**
   - Replace `MONGO_URI` value with your Atlas connection string
   - Make sure to replace `<password>` and `<username>`

---

## 🔑 Get Google Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://ai.google.dev/

2. **Create a New API Key**
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key to `.env` in backend

3. **Enable Generative Language API**
   - The API should be auto-enabled for free tier

---

## 🌍 Environment Variables Setup

### Backend Configuration (.env)

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Copy the example file**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file** (use any text editor)
   ```
   PORT=4000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/feedpulse
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

### Frontend Configuration (.env.local)

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Create `.env.local` file** with this content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

---

## 🚀 Starting the Application

### Terminal 1 - Start Backend Server
```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 4000
MongoDB Connected
```

### Terminal 2 - Start Frontend Server
```bash
cd frontend
npm run dev
```

You should see:
```
▲ Next.js 16.2.2
- ready started server on 0.0.0.0:3000
```

### Access the Application

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Main app - submit feedback |
| http://localhost:3000/dashboard | Admin dashboard - manage feedback |
| http://localhost:3000/login | Login to dashboard |
| http://localhost:4000 | Backend API health check |

---

## ✨ Test the Setup

### 1. Submit Test Feedback
1. Go to: http://localhost:3000
2. Fill in the form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Title: "Test Feedback"
   - Description: "This is a test feedback to verify the system is working properly with AI analysis."
   - Category: "Bug"
3. Click "Submit Feedback"
4. You should see: ✅ "Feedback submitted successfully!"

### 2. View in Dashboard
1. Go to: http://localhost:3000/dashboard
2. You might see a login page (use any credentials for dev)
3. You should see your feedback with:
   - AI-generated sentiment (Positive/Neutral/Negative)
   - Priority score (1-10)
   - AI summary (auto-generated description)
   - Tags (auto-extracted keywords)

### 3. Test Backend API Directly
```bash
# Check health
curl http://localhost:4000

# Get all feedback
curl http://localhost:4000/api/feedback
```

---

## 📁 Important Directories

```
Feedpulse/
├── backend/
│   ├── src/
│   │   ├── server.ts (Entry point - port 4000)
│   │   ├── routes/ (API endpoints)
│   │   ├── models/ (MongoDB schemas)
│   │   └── services/ (Gemini AI service)
│   └── .env (Your config - NEVER commit this!)
│
├── frontend/
│   ├── src/
│   │   ├── app/ (Pages: /, /dashboard, /login)
│   │   ├── components/ (React components)
│   │   └── services/ (API calls)
│   └── .env.local (Your config - NEVER commit this!)
│
└── README.md (Full project documentation)
```

---

## 🛠️ Common Commands

### Backend
```bash
# Start dev server (auto-reload)
npm run dev

# Install dependencies
npm install

# Reset everything
rm -rf node_modules package-lock.json
npm install
```

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Check for lint errors
npm run lint
```

---

## ⚠️ Troubleshooting

### "Cannot find module" Errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 4000 or 3000 Already in Use

**Windows (PowerShell):**
```bash
# Find process
netstat -ano | findstr :4000

# Kill it (replace PID)
taskkill /PID 12345 /F
```

**macOS/Linux:**
```bash
# Find process
lsof -i :4000

# Kill it
kill -9 <PID>
```

### MongoDB Connection Failed
- **Local**: Make sure `mongod` is running
  - Windows: Check Services
  - macOS: `brew services list`
  - Linux: `sudo systemctl status mongod`
- **Atlas**:
  - Check connection string in `.env`
  - Verify IP whitelist (Security → Network Access)
  - Check username/password are correct

### Gemini API Error
```
Error: API Key is missing
```
- Verify `GEMINI_API_KEY` is in `.env`
- Double-check the key is correct (no spaces)
- Make sure it's a valid Gemini API key from ai.google.dev

### ".env not found" Error
- Copy `.env.example` to `.env`:
  ```bash
  cp .env.example .env
  ```
- Then fill in your values

### CORS Error in Browser
```
Access-Control-Allow-Origin error
```
- Backend CORS is already enabled
- Make sure `NEXT_PUBLIC_API_URL` in frontend matches backend

### "Feedback not saved" on Submit
- Check backend terminal for errors
- Verify MongoDB is connected
- Check browser console for error details

### "Module not found: 'express'"
- Run `npm install` in backend folder
- Make sure you're in the right directory

---

## 📊 What Each Port Does

| Port | Service | Purpose |
|------|---------|---------|
| **3000** | Next.js Frontend | Application UI |
| **4000** | Express Backend | REST API server |
| **27017** | MongoDB | Database (local only) |

---

## 🎓 Next Steps

1. ✅ **Setup Complete!** Your app is running
2. 📝 **Submit some feedback** on http://localhost:3000
3. 📊 **View analytics** on /dashboard
4. 🔄 **Reanalyze feedback** with new AI insights
5. 📖 **Read README.md** for full documentation
6. 🚀 **Deploy to production** when ready

---

## 📞 Need Help?

1. Check the **Troubleshooting** section above
2. Read **README.md** for architecture details
3. Review logs in terminal for error messages
4. Check browser console (F12) for frontend errors

---

## 🎉 Success!

When you see:
- ✅ "Server running on port 4000"
- ✅ "MongoDB Connected"
- ✅ "ready started server on 0.0.0.0:3000"

**You're good to go!** 🚀

---

**Happy Coding!** 👨‍💻👩‍💻
