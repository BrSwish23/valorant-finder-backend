#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Valorant Finder Backend...\n');

// Create .env file from .env.example
const envExamplePath = path.join(__dirname, '.env.example');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
  } else {
    // Create basic .env file
    const envContent = `# Valorant Finder Backend Environment Variables

# Valorant API Configuration
VALORANT_API_KEY=HDEV-f1588d35-627e-4c94-8bc9-8d967b3d2f88

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Origins
ALLOWED_ORIGINS=http://localhost:3000,https://valorant-finder-app.vercel.app
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with default configuration');
  }
} else {
  console.log('ℹ️  .env file already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('\n📦 Installing dependencies...');
  console.log('Run: npm install');
} else {
  console.log('✅ Dependencies already installed');
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Start development server: npm run dev');
console.log('3. Test API: curl http://localhost:3001/health');
console.log('\n🌐 API will be available at: http://localhost:3001');
console.log('📊 Health check: http://localhost:3001/health');
console.log('🧪 Test endpoint: http://localhost:3001/api/valorant/test'); 