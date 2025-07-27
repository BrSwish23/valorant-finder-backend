const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

console.log('🚀 Loading Valorant routes...');

// Valorant API configuration
const VALORANT_API_BASE = 'https://api.henrikdev.xyz/valorant/v2';
const VALORANT_API_KEY = process.env.VALORANT_API_KEY;

console.log('🔑 API Key configured:', VALORANT_API_KEY ? 'Yes' : 'No');

// Simple test route
router.get('/ping', (req, res) => {
  res.json({ message: 'Valorant routes are working!', timestamp: new Date().toISOString() });
});

// Simple POST test route
router.post('/test-post', (req, res) => {
  console.log('📝 POST test route hit');
  res.json({ 
    message: 'POST route is working!', 
    body: req.body,
    timestamp: new Date().toISOString() 
  });
});

// Helper functions for data extraction
const extractProfileImageUrl = (apiData) => {
  try {
    const imagePaths = [
      apiData?.card?.small,
      apiData?.card?.large,
      apiData?.current_data?.images?.small,
      apiData?.current_data?.images?.large,
      apiData?.images?.small,
      apiData?.images?.large
    ];
    
    for (const path of imagePaths) {
      if (path && typeof path === 'string' && path.startsWith('http')) {
        return path;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting profile image URL:', error);
    return null;
  }
};

const extractRankFromApiData = (apiData) => {
  try {
    if (apiData?.current_data?.currenttierpatched) {
      return apiData.current_data.currenttierpatched;
    }
    if (apiData?.currenttierpatched) {
      return apiData.currenttierpatched;
    }
    return null;
  } catch (error) {
    console.error('Error extracting rank from API data:', error);
    return null;
  }
};

const extractLifetimeStatsFromMmr = (apiData) => {
  try {
    let totalWins = 0;
    let totalGames = 0;

    if (apiData?.by_season && typeof apiData.by_season === 'object') {
      console.log('Found by_season data, calculating lifetime stats...');
      
      Object.keys(apiData.by_season).forEach(seasonKey => {
        const seasonData = apiData.by_season[seasonKey];
        
        if (seasonData && typeof seasonData === 'object') {
          const wins = parseInt(seasonData.wins) || 0;
          const games = parseInt(seasonData.number_of_games) || 0;
          
          totalWins += wins;
          totalGames += games;
          
          console.log(`Season ${seasonKey}: ${wins} wins out of ${games} games`);
        }
      });
    }

    console.log(`Total lifetime stats: ${totalWins} wins out of ${totalGames} games`);
    return { lifetimeWins: totalWins, lifetimeGamesPlayed: totalGames };
  } catch (error) {
    console.error('Error extracting lifetime stats from MMR data:', error);
    return { lifetimeWins: 0, lifetimeGamesPlayed: 0 };
  }
};

// POST /api/valorant/validate-profile
router.post('/validate-profile', async (req, res) => {
  console.log('🎯 Validate-profile route hit');
  console.log('📝 Request body:', req.body);
  
  try {
    const { valorantName, valorantTag } = req.body;

    // Validation
    if (!valorantName || !valorantTag) {
      return res.status(400).json({
        success: false,
        error: 'Missing valorantName or valorantTag'
      });
    }

    // Check API key
    if (!VALORANT_API_KEY) {
      console.error('❌ VALORANT_API_KEY environment variable not set');
      return res.status(500).json({
        success: false,
        error: 'API configuration error'
      });
    }

    console.log(`🚀 Validating profile: ${valorantName}#${valorantTag}`);

    // Make API call to Valorant API
    const apiUrl = `${VALORANT_API_BASE}/mmr/AP/${encodeURIComponent(valorantName)}/${encodeURIComponent(valorantTag)}`;
    
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': VALORANT_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      console.error(`API request failed: ${apiResponse.status}`);
      if (apiResponse.status === 404) {
        return res.status(404).json({
          success: false,
          error: 'Player not found. Please check your Valorant Name and Tag ID.'
        });
      }
      return res.status(apiResponse.status).json({
        success: false,
        error: `API request failed: ${apiResponse.status}`
      });
    }

    const apiData = await apiResponse.json();
    console.log('✅ API call successful');

    // Process the data
    const lifetimeStats = extractLifetimeStatsFromMmr(apiData);
    const processedData = {
      valorantRank: extractRankFromApiData(apiData),
      profilePhotoUrl: extractProfileImageUrl(apiData),
      lifetimeWins: lifetimeStats.lifetimeWins,
      lifetimeGamesPlayed: lifetimeStats.lifetimeGamesPlayed
    };

    console.log('📊 Processed data:', processedData);

    res.status(200).json({
      success: true,
      data: processedData
    });

  } catch (error) {
    console.error('❌ Profile validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/valorant/test
router.get('/test', (req, res) => {
  res.json({
    message: 'Valorant API routes are working!',
    timestamp: new Date().toISOString(),
    apiKey: VALORANT_API_KEY ? 'Configured' : 'Missing'
  });
});

module.exports = router; 