import { Movie } from './movies';
import theMovieDB from './theMovieDB';

export const getMoviesByCategory = async (category: string, genreId?: number): Promise<Movie[]> => {
  try {
    if (genreId) {
      const response = await theMovieDB.get('/discover/movie', {
        params: { with_genres: genreId, sort_by: 'popularity.desc' },
      });
      return response.data.results;
    }
    const response = await theMovieDB.get(`/movie/${category}`);
    return response.data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await theMovieDB.get('/search/movie', { params: { query } });
    return response.data.results;
  } catch {
    return [];
  }
};

// 🔹 Esta es la clave: export nombrado
export const getMovieDetails = async (id: number) => {
  try {
    const response = await theMovieDB.get(`/movie/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

export const getMovieCredits = async (id: number) => {
  try {
    const response = await theMovieDB.get(`/movie/${id}/credits`);
    return response.data;
  } catch {
    return { cast: [] };
  }
};

