const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Development-only logging
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Loading Valorant routes...');
}

// Valorant API configuration
const VALORANT_API_BASE = 'https://api.henrikdev.xyz/valorant/v2';
const VALORANT_API_KEY = process.env.VALORANT_API_KEY;

if (process.env.NODE_ENV === 'development') {
  console.log('🔑 API Key configured:', VALORANT_API_KEY ? 'Yes' : 'No');
}

// Helper functions for data extraction
const extractProfileImageUrl = (apiData) => {
  try {
    // The API response has images in current_data.images
    if (apiData?.data?.current_data?.images?.large) {
      return apiData.data.current_data.images.large;
    }
    if (apiData?.data?.current_data?.images?.small) {
      return apiData.data.current_data.images.small;
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error extracting profile image URL:', error);
    }
    return null;
  }
};

const extractRankFromApiData = (apiData) => {
  try {
    // The API response has currenttierpatched in data.current_data
    if (apiData?.data?.current_data?.currenttierpatched) {
      return apiData.data.current_data.currenttierpatched;
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error extracting rank from API data:', error);
    }
    return null;
  }
};

const extractLifetimeStatsFromMmr = (apiData) => {
  try {
    let totalWins = 0;
    let totalGames = 0;

    // The API response has by_season in data.by_season
    if (apiData?.data?.by_season && typeof apiData.data.by_season === 'object') {
      if (process.env.NODE_ENV === 'development') {
        console.log('Found by_season data, calculating lifetime stats...');
      }
      
      Object.keys(apiData.data.by_season).forEach(seasonKey => {
        const seasonData = apiData.data.by_season[seasonKey];
        
        // Skip seasons with errors
        if (seasonData?.error) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Season ${seasonKey}: ${seasonData.error}`);
          }
          return;
        }
        
        if (seasonData && typeof seasonData === 'object') {
          const wins = parseInt(seasonData.wins) || 0;
          const games = parseInt(seasonData.number_of_games) || 0;
          
          totalWins += wins;
          totalGames += games;
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`Season ${seasonKey}: ${wins} wins out of ${games} games`);
          }
        }
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`Total lifetime stats: ${totalWins} wins out of ${totalGames} games`);
    }
    return { lifetimeWins: totalWins, lifetimeGamesPlayed: totalGames };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error extracting lifetime stats from MMR data:', error);
    }
    return { lifetimeWins: 0, lifetimeGamesPlayed: 0 };
  }
};

// Simple GET route
router.get('/ping', (req, res) => {
  res.json({ message: 'Valorant routes are working!', timestamp: new Date().toISOString() });
});

// Complete validate-profile route with real API integration
router.post('/validate-profile', async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 Validate-profile route hit');
    console.log('📝 Request body:', req.body);
  }
  
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

    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Validating profile: ${valorantName}#${valorantTag}`);
    }

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
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API call successful');
      console.log('📊 Raw API response:', JSON.stringify(apiData, null, 2));
    }

    // Process the data
    const lifetimeStats = extractLifetimeStatsFromMmr(apiData);
    const processedData = {
      valorantRank: extractRankFromApiData(apiData),
      profilePhotoUrl: extractProfileImageUrl(apiData),
      lifetimeWins: lifetimeStats.lifetimeWins,
      lifetimeGamesPlayed: lifetimeStats.lifetimeGamesPlayed
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Processed data:', processedData);
    }

    res.status(200).json({
      success: true,
      data: processedData
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Profile validation error:', error);
    }
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router; 