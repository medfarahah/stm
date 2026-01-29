# Deployment Guide for POS Shop System

## ⚠️ Critical Architecture Issue

Your current setup has a **fundamental incompatibility** with Vercel:

### The Problem:
1. **SQLite Database**: Your app uses SQLite, which requires a persistent file system
2. **Vercel's Serverless Model**: Vercel uses stateless serverless functions that:
   - Don't have persistent file storage
   - Reset on each function invocation
   - Can't maintain a SQLite database file

### What's Happening:
- Vercel can't find your API routes because Express servers need special configuration
- Even if configured, SQLite won't work because the database file gets wiped
- The NOT_FOUND error occurs because Vercel doesn't know how to route your requests

## Solution Options

### Option 1: Frontend on Vercel + Backend on Railway/Render (Recommended)

**Frontend (Vercel):**
- Deploy only the `client` folder
- Use environment variables for API URL

**Backend (Railway/Render):**
- Deploy the `server` folder
- SQLite works fine on these platforms
- Get a backend URL and configure CORS

### Option 2: Convert to Serverless Functions (Complex)

Convert Express routes to Vercel serverless functions and use a cloud database (PostgreSQL, MongoDB, etc.)

### Option 3: Full Stack on Railway/Render

Deploy everything together on a platform that supports persistent storage.

## Quick Fix for Frontend-Only Deployment

If you want to deploy just the frontend to Vercel right now:

1. Point Vercel to the `client` folder
2. Add environment variable: `VITE_API_URL=https://your-backend-url.com`
3. Update axios calls to use the environment variable
