import { API_KEY, BASE_URL } from '@env';
import axios from 'axios';

const theMovieDB = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export default theMovieDB;

