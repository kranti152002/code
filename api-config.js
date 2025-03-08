// API configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// API versioning
export const API_VERSION = 'v1';

// Configure axios defaults
import axios from 'axios';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common = { ...DEFAULT_HEADERS };
axios.defaults.timeout = REQUEST_TIMEOUT;

// Add a request interceptor for authentication tokens
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);
