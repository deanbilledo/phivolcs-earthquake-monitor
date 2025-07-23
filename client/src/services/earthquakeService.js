import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const earthquakeService = {
  // Get all earthquakes
  async getEarthquakes() {
    try {
      const response = await api.get('/earthquakes');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch earthquakes: ${error.message}`);
    }
  },

  // Get latest earthquake
  async getLatestEarthquake() {
    try {
      const response = await api.get('/earthquakes/latest');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch latest earthquake: ${error.message}`);
    }
  },

  // Get statistics
  async getStatistics() {
    try {
      const response = await api.get('/earthquakes/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },
};

export default api;
