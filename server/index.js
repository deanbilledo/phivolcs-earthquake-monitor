const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Cache to store last scraped data
let cachedData = null;
let lastScrapeTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main earthquake data endpoint
app.get('/api/earthquakes', async (req, res) => {
  try {
    // Check if we have cached data that's still fresh
    const now = Date.now();
    if (cachedData && lastScrapeTime && (now - lastScrapeTime) < CACHE_DURATION) {
      console.log('📋 Serving cached data');
      return res.json({
        data: cachedData,
        cached: true,
        lastUpdate: new Date(lastScrapeTime).toISOString()
      });
    }

    console.log('🌐 Scraping fresh data from PHIVOLCS...');
    
    const response = await axios.get(
      'https://www.phivolcs.dost.gov.ph/index.php/earthquake/earthquake-information3',
      {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );

    const $ = cheerio.load(response.data);
    
    // Find the earthquake data table
    const tableRows = $('table tr').slice(1); // Skip header row
    const earthquakes = [];

    tableRows.each((index, row) => {
      const cols = $(row).find('td').map((_, td) => $(td).text().trim()).get();
      
      if (cols.length >= 9) {
        const earthquake = {
          id: index + 1,
          date: cols[0],
          time: cols[1],
          latitude: parseFloat(cols[2]) || 0,
          longitude: parseFloat(cols[3]) || 0,
          depth: cols[4],
          magnitude: parseFloat(cols[5]) || 0,
          location: cols[6],
          origin: cols[7],
          intensity: cols[8],
          timestamp: new Date(`${cols[0]} ${cols[1]}`).getTime()
        };
        
        // Only add valid earthquakes with proper coordinates
        if (earthquake.latitude !== 0 && earthquake.longitude !== 0) {
          earthquakes.push(earthquake);
        }
      }
    });

    // Sort by timestamp (most recent first)
    earthquakes.sort((a, b) => b.timestamp - a.timestamp);

    // Cache the data
    cachedData = earthquakes;
    lastScrapeTime = now;

    console.log(`✅ Successfully scraped ${earthquakes.length} earthquakes`);

    res.json({
      data: earthquakes,
      cached: false,
      lastUpdate: new Date().toISOString(),
      count: earthquakes.length
    });

  } catch (error) {
    console.error('❌ Error scraping earthquake data:', error.message);
    
    // If we have cached data, serve it even if scraping fails
    if (cachedData) {
      return res.json({
        data: cachedData,
        cached: true,
        error: 'Failed to fetch fresh data, serving cached data',
        lastUpdate: new Date(lastScrapeTime).toISOString()
      });
    }

    res.status(500).json({ 
      error: 'Failed to scrape earthquake data',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get latest earthquake endpoint
app.get('/api/earthquakes/latest', async (req, res) => {
  try {
    // First try to get data from the main endpoint
    const earthquakeResponse = await axios.get(`http://localhost:${PORT}/api/earthquakes`);
    const earthquakes = earthquakeResponse.data.data;
    
    if (earthquakes && earthquakes.length > 0) {
      const latest = earthquakes[0]; // Already sorted by timestamp
      res.json({
        data: latest,
        lastUpdate: earthquakeResponse.data.lastUpdate
      });
    } else {
      res.status(404).json({ error: 'No earthquake data available' });
    }
  } catch (error) {
    console.error('❌ Error getting latest earthquake:', error.message);
    res.status(500).json({ 
      error: 'Failed to get latest earthquake data',
      message: error.message 
    });
  }
});

// Statistics endpoint
app.get('/api/earthquakes/stats', async (req, res) => {
  try {
    const earthquakeResponse = await axios.get(`http://localhost:${PORT}/api/earthquakes`);
    const earthquakes = earthquakeResponse.data.data;
    
    if (!earthquakes || earthquakes.length === 0) {
      return res.json({ error: 'No data available for statistics' });
    }

    // Calculate statistics
    const stats = {
      total: earthquakes.length,
      averageMagnitude: (earthquakes.reduce((sum, eq) => sum + eq.magnitude, 0) / earthquakes.length).toFixed(2),
      maxMagnitude: Math.max(...earthquakes.map(eq => eq.magnitude)),
      minMagnitude: Math.min(...earthquakes.map(eq => eq.magnitude)),
      regionsCount: [...new Set(earthquakes.map(eq => eq.location))].length,
      byMagnitudeRange: {
        minor: earthquakes.filter(eq => eq.magnitude < 3).length,
        light: earthquakes.filter(eq => eq.magnitude >= 3 && eq.magnitude < 4).length,
        moderate: earthquakes.filter(eq => eq.magnitude >= 4 && eq.magnitude < 5).length,
        strong: earthquakes.filter(eq => eq.magnitude >= 5 && eq.magnitude < 6).length,
        major: earthquakes.filter(eq => eq.magnitude >= 6).length
      },
      byDepth: {
        shallow: earthquakes.filter(eq => {
          const depth = parseFloat(eq.depth);
          return depth <= 70;
        }).length,
        intermediate: earthquakes.filter(eq => {
          const depth = parseFloat(eq.depth);
          return depth > 70 && depth <= 300;
        }).length,
        deep: earthquakes.filter(eq => {
          const depth = parseFloat(eq.depth);
          return depth > 300;
        }).length
      }
    };

    res.json({
      data: stats,
      lastUpdate: earthquakeResponse.data.lastUpdate
    });
  } catch (error) {
    console.error('❌ Error calculating statistics:', error.message);
    res.status(500).json({ 
      error: 'Failed to calculate statistics',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🌍 PHIVOLCS Earthquake Monitor Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET /api/health - Health check`);
  console.log(`   GET /api/earthquakes - All earthquake data`);
  console.log(`   GET /api/earthquakes/latest - Latest earthquake`);
  console.log(`   GET /api/earthquakes/stats - Statistics`);
});
