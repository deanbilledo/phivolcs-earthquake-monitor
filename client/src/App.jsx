import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LatestEarthquake from './components/LatestEarthquake';
import EarthquakeTable from './components/EarthquakeTable';
import EarthquakeMap from './components/EarthquakeMap';
import EarthquakeCharts from './components/EarthquakeCharts';
import ExportButtons from './components/ExportButtons';
import ThemeToggle from './components/ThemeToggle';
import LoadingSpinner from './components/LoadingSpinner';
import { earthquakeService } from './services/earthquakeService';

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [latestEarthquake, setLatestEarthquake] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for theme preference
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const fetchEarthquakeData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch all data in parallel
      const [earthquakeResponse, latestResponse, statsResponse] = await Promise.all([
        earthquakeService.getEarthquakes(),
        earthquakeService.getLatestEarthquake(),
        earthquakeService.getStatistics()
      ]);

      setEarthquakes(earthquakeResponse.data || []);
      setLatestEarthquake(latestResponse.data || null);
      setStatistics(statsResponse.data || null);
      setLastUpdate(earthquakeResponse.lastUpdate || new Date().toISOString());

    } catch (err) {
      console.error('Error fetching earthquake data:', err);
      setError('Failed to fetch earthquake data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchEarthquakeData(true);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Initial data fetch
  useEffect(() => {
    fetchEarthquakeData();
  }, []);

  // Auto-refresh every 5 minutes (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEarthquakeData(true);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <Navbar 
        onRefresh={handleRefresh} 
        refreshing={refreshing}
        lastUpdate={lastUpdate}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-100 px-4 py-3 rounded-lg"
          >
            <p className="font-medium">⚠️ {error}</p>
          </motion.div>
        )}

        {/* Latest Earthquake Highlight */}
        {latestEarthquake && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LatestEarthquake earthquake={latestEarthquake} />
          </motion.div>
        )}

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <EarthquakeCharts 
            earthquakes={earthquakes} 
            statistics={statistics}
          />
        </motion.div>

        {/* Map and Table Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                🗺️ Earthquake Map
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({earthquakes.length} locations)
                </span>
              </h2>
            </div>
            <div className="h-96">
              <EarthquakeMap earthquakes={earthquakes} />
            </div>
          </motion.div>

          {/* Data Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <EarthquakeTable earthquakes={earthquakes} />
          </motion.div>
        </div>

        {/* Export and Theme Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <ExportButtons earthquakes={earthquakes} />
          <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-center text-gray-500 dark:text-gray-400 py-4"
        >
          <p className="text-sm">
            Data source: <a 
              href="https://www.phivolcs.dost.gov.ph" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              PHIVOLCS (Philippine Institute of Volcanology and Seismology)
            </a>
          </p>
          <p className="text-xs mt-1">
            Last updated: {lastUpdate ? new Date(lastUpdate).toLocaleString() : 'Never'}
          </p>
        </motion.footer>
      </main>
    </div>
  );
}

export default App;
