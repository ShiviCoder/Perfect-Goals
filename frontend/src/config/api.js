// API Configuration

// Vite variables are baked in at build time. 
// If the env variable is missing or points to the old URL, we fallback to the new one.
const envApiUrl = import.meta.env.VITE_API_URL;
export const API_URL = (envApiUrl && envApiUrl !== 'https://perfect-goals.onrender.com')
  ? envApiUrl
  : 'https://perfect-goals-15mr.onrender.com';

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, options);
  return response;
};
