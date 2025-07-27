# Deploy Valorant Finder Backend to Render

## 🌐 Step-by-Step Render Deployment

### 1. **Create Render Account**
- Go to [render.com](https://render.com)
- Sign up with GitHub (recommended for easy repo connection)

### 2. **Connect Your Repository**
- Push your `valorant-finder-backend` folder to GitHub
- In Render dashboard, click "New +" → "Web Service"
- Choose "Connect a repository"
- Select your repository

### 3. **Configure Deployment Settings**

**Basic Settings:**
- **Name**: `valorant-finder-backend`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `valorant-finder-backend` (if it's in a subfolder)

**Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. **Environment Variables**
In the "Environment" section, add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `VALORANT_API_KEY` | `HDEV-f1588d35-627e-4c94-8bc9-8d967b3d2f88` |

### 5. **Advanced Settings**
- **Health Check Path**: `/health`
- **Auto-Deploy**: `Yes` (deploys on git push)

### 6. **Deploy**
- Click "Create Web Service"
- Wait 2-5 minutes for deployment
- Your backend will be available at: `https://your-app-name.onrender.com`

## 🧪 **Test Your Deployment**

After deployment, test these endpoints:

```bash
# Health check
curl https://your-app-name.onrender.com/health

# API test
curl https://your-app-name.onrender.com/api/valorant/test

# Profile validation
curl -X POST https://your-app-name.onrender.com/api/valorant/validate-profile \
  -H "Content-Type: application/json" \
  -d '{"valorantName":"TenZ","valorantTag":"SEN"}'
```

## 🔧 **Update Frontend Configuration**

After successful deployment, update your frontend:

1. Copy your Render URL (e.g., `https://valorant-finder-backend.onrender.com`)
2. Update `valorant-finder-app/src/config/apiConfig.js`:

```javascript
BACKEND_BASE_URL: isDevelopment && isLocalhost 
  ? 'http://localhost:3001' 
  : 'https://YOUR-RENDER-URL.onrender.com', // <- Update this
```

## 🚨 **Important Notes**

- **Free Plan Limitations**: Service sleeps after 15 minutes of inactivity
- **Cold Starts**: First request after sleep takes ~30 seconds
- **Custom Domain**: Available on paid plans
- **Logs**: Available in Render dashboard for debugging

## 🔄 **Automatic Deployments**

Once connected:
- Push to GitHub → Automatic deployment
- Environment variables persist
- Zero-downtime deployments
- Rollback capability

## 💡 **Pro Tips**

1. **Keep Services Awake**: Use a service like UptimeRobot to ping `/health` every 5 minutes
2. **Monitor Logs**: Check Render dashboard for any deployment issues
3. **Environment Management**: Use Render's environment variable management
4. **Custom Domains**: Add your own domain in Render settings 