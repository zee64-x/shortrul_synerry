import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'
    : 'https://shortrul-synerry.onrender.com',
  timeout: 10000,
});

export default axiosInstance;
