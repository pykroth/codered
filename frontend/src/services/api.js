import axios from 'axios';

const API_BASE_URL = 'https://codered-w5ep.onrender.com';
//process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for AI processing
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const uploadFile = async (formData) => {
  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const simplifyText = async (text) => {
  try {
    const response = await api.post('/simplify', { text });
    return response.data;
  } catch (error) {
    console.error('Simplify error:', error);
    throw error;
  }
};

export const askQuestion = async (question, context) => {
  try {
    const response = await api.post('/ask', {
      question,
      context
    });
    return response.data;
  } catch (error) {
    console.error('Q&A error:', error);
    throw error;
  }
};

export const translateText = async (text, targetLanguage) => {
  try {
    const response = await api.post('/translate', {
      text,
      target_language: targetLanguage
    });
    return response.data;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

export const textToSpeech = async (text) => {
  try {
    const response = await api.post('/text-to-speech', { text });
    return response.data;
  } catch (error) {
    console.error('Text-to-speech error:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

export default api;