# Valorant Finder Backend

A dedicated Node.js backend API for the Valorant Team Finder application.

## 🚀 Features

- Valorant profile validation
- Player statistics retrieval
- CORS-enabled for frontend integration
- Environment-based configuration
- Health monitoring endpoints

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
cd valorant-finder-backend
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
VALORANT_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

### 3. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 🌐 API Endpoints

### Health Check
- **GET** `/health`
- Returns server status and uptime

### Valorant Profile Validation
- **POST** `/api/valorant/validate-profile`
- Body: `{ "valorantName": "Player", "valorantTag": "123" }`
- Returns player rank, stats, and profile information

### Test Endpoint
- **GET** `/api/valorant/test`
- Returns API status and configuration

## 🚀 Deployment Options

### Option 1: Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically

### Option 2: Render
1. Create new Web Service
2. Connect repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Option 3: Heroku
```bash
heroku create your-app-name
heroku config:set VALORANT_API_KEY=your_key
git push heroku main
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VALORANT_API_KEY` | HenrikDev Valorant API key | Yes |
| `PORT` | Server port (default: 3001) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `ALLOWED_ORIGINS` | CORS allowed origins | No |

## 🐳 Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 Logs

The server logs all requests and responses for debugging:
```
2024-01-20T10:30:00.000Z - POST /api/valorant/validate-profile
🚀 Validating profile: TenZ#SEN
✅ API call successful
📊 Processed data: { rank: "Radiant", wins: 1500, games: 2000 }
``` 