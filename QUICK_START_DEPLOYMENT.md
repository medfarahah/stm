# Quick Start: Deploy Your POS Shop

## 🚀 Fastest Solution (Recommended)

### Step 1: Deploy Backend to Railway (5 minutes)

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway will auto-detect Node.js
5. **Important:** Set the root directory to `server` in project settings
6. Railway will automatically:
   - Install dependencies
   - Run your server
   - Give you a URL like `https://your-app.railway.app`

7. **Update CORS in `server/index.js`:**
   ```javascript
   // Change this line:
   app.use(cors());
   
   // To this (add your Railway URL):
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://your-vercel-app.vercel.app' // Add this after Vercel deployment
     ]
   }));
   ```

### Step 2: Deploy Frontend to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New Project" → Import from GitHub
3. Select your repository
4. **Configure:**
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

5. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-app.railway.app`
   - Make sure it's set for "Production", "Preview", and "Development"

6. Click "Deploy"

### Step 3: Update CORS with Vercel URL

1. After Vercel deployment, copy your Vercel URL
2. Go back to Railway
3. Update `server/index.js` CORS to include Vercel URL
4. Redeploy backend (Railway auto-redeploys on git push)

## ✅ That's It!

Your app should now work:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- API calls automatically go to Railway backend

## 🔧 Alternative: Deploy Everything to Railway

If you prefer one platform:

1. Deploy to Railway (point to project root)
2. Configure:
   - **Build Command:** `cd client && npm install && npm run build`
   - **Start Command:** `cd server && node index.js`
   - **Root Directory:** `.` (project root)
3. Railway will serve both frontend and backend

## 📝 Notes

- **Free tiers available** on both platforms
- **SQLite works perfectly** on Railway
- **Vercel is optimized** for frontend (CDN, edge network)
- **Railway is better** for full-stack with databases

## 🆘 Troubleshooting

**Frontend shows errors:**
- Check `VITE_API_URL` environment variable in Vercel
- Check browser console for API errors
- Verify backend URL is correct

**Backend not responding:**
- Check Railway logs
- Verify CORS includes your frontend URL
- Check if port is set correctly (Railway uses PORT env var)

**Database issues:**
- SQLite file persists on Railway
- Check Railway logs for database errors
- Database file is in `/server/inventory.db`
