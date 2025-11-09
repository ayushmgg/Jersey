# Quick Start Guide

## Step-by-Step Setup

### 1. ✅ Start Backend Server (Already Done)
```powershell
cd server
npm run dev
```
**Status**: Should be running on `http://localhost:5000`

### 2. Add Sample Data to MongoDB
Open a **new terminal window** and run:
```powershell
cd D:\FS\recommendation4\server
node scripts/add-sample-jerseys.js
```
This adds 10 sample jerseys to your database.

### 3. Start Frontend (React)
Open **another new terminal window** and run:
```powershell
cd D:\FS\recommendation4\client
npm install  # Only needed first time
npm run dev
```
**Status**: Should be running on `http://localhost:5173`

### 4. Make Sure MongoDB is Running
- If you have MongoDB installed locally, make sure it's running
- Or use MongoDB Atlas (cloud) and update `MONGODB_URI` in `server/.env`

### 5. (Optional) Seed Sample Users
Open a **new terminal window** and run:
```powershell
cd D:\FS\recommendation4\server
node scripts/seed.js
```
This creates:
- 5 sample jerseys
- 1 test user (email: `test@example.com`, password: `password123`)
- Sample interactions

## Testing the Application

1. **Open Browser**: Go to `http://localhost:5173`
2. **Register/Login**: 
   - Use the test account: `test@example.com` / `password123`
   - Or create a new account
3. **Browse Jerseys**: View recommended and popular jerseys
4. **Interact**: Click jerseys, add to cart, make purchases
5. **View Profile**: Check your interaction history

## All Services Running?

You should have **2 terminal windows** open:
1. ✅ Backend (Node.js) - Port 5000
2. ⏳ Frontend (React) - Port 5173

## Troubleshooting

### Backend not connecting to MongoDB?
- Check if MongoDB is running: `mongod` or check MongoDB service
- Verify `MONGODB_URI` in `server/.env`

### No jerseys showing?
- Run `node scripts/add-sample-jerseys.js` to add sample data
- Check MongoDB connection

### Frontend not loading?
- Make sure backend is running first
- Check browser console for errors

## API Endpoints (for testing)

- Health: `http://localhost:5000/health`

