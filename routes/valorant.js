const express = require('express');
const router = express.Router();

console.log('🚀 Loading Valorant routes...');

// Simple GET route
router.get('/ping', (req, res) => {
  res.json({ message: 'Valorant routes are working!', timestamp: new Date().toISOString() });
});

// Simple POST route
router.post('/test-post', (req, res) => {
  console.log('📝 POST test route hit');
  res.json({ 
    message: 'POST route is working!', 
    body: req.body,
    timestamp: new Date().toISOString() 
  });
});

// Simple validate-profile route
router.post('/validate-profile', (req, res) => {
  console.log('🎯 Validate-profile route hit');
  console.log('📝 Request body:', req.body);
  
  const { valorantName, valorantTag } = req.body;
  
  if (!valorantName || !valorantTag) {
    return res.status(400).json({
      success: false,
      error: 'Missing valorantName or valorantTag'
    });
  }
  
  // Return test data for now
  res.json({
    success: true,
    data: {
      valorantRank: 'Test Rank',
      profilePhotoUrl: null,
      lifetimeWins: 100,
      lifetimeGamesPlayed: 200
    },
    message: 'Test validation successful'
  });
});

module.exports = router; 