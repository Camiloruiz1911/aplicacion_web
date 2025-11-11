import axios from 'axios';

const API_KEY: string = '05ac89357c35ca375cdf8bed94115ab5'; 
const BASE_URL: string = 'https://api.themoviedb.org/3';

const theMovieDB = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export default theMovieDB;