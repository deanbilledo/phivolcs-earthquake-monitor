import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Activity } from 'lucide-react';

const Navbar = ({ onRefresh, refreshing, lastUpdate }) => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg"
            >
              <Activity className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                PHIVOLCS Earthquake Monitor
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                Real-time earthquake monitoring for the Philippines
              </p>
            </div>
          </div>

          {/* Refresh Button and Status */}
          <div className="flex items-center space-x-4">
            {/* Last Update Info */}
            {lastUpdate && (
              <div className="hidden md:block text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {new Date(lastUpdate).toLocaleTimeString()}
                </p>
              </div>
            )}

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              disabled={refreshing}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${refreshing 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
                }
              `}
            >
              <RefreshCw 
                className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} 
              />
              <span className="hidden sm:inline">
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            {refreshing && (
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Updating...</span>
              </div>
            )}
          </div>
          
          <div className="hidden sm:block">
            Source: PHIVOLCS Official Website
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
