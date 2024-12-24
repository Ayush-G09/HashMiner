import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://hash-miner-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;