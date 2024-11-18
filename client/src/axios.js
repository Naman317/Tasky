import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000'||'https://tasky-j89h.onrender.com', // URL of your backend API
});

export default instance;