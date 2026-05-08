// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'https://perfect-goals-15mr.onrender.com';

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, options);
  return response;
};
