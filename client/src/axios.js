import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://tasky-j89h.onrender.com', // URL of your backend API
});

export default instance;