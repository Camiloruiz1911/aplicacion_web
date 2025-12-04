import theMovieDB from '../api/theMovieDB';

const API_KEY = '05ac89357c35ca375cdf8bed94115ab5';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

/* ---------------------------- POPULARES ---------------------------- */
export const getPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await theMovieDB.get('/movie/popular', {
      params: { api_key: API_KEY, language: 'es-ES' },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener las películas populares:', error);
    return [];
  }
};

/* ---------------------------- BÚSQUEDA ---------------------------- */
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await theMovieDB.get('/search/movie', {
      params: { query, api_key: API_KEY, language: 'es-ES' },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error al buscar películas:', error);
    return [];
  }
};

/* ---------------------- PELÍCULAS POR CATEGORÍA ---------------------- */
export const getMoviesByCategory = async (
  category: string,
  genreId?: number
): Promise<Movie[]> => {
  try {
    let url = `/movie/${category}`;

    if (genreId) {
      url = `/discover/movie`;
      const response = await theMovieDB.get(url, {
        params: {
          with_genres: genreId,
          sort_by: 'popularity.desc',
          api_key: API_KEY,
          language: 'es-ES'
        },
      });
      return response.data.results;
    }

    const response = await theMovieDB.get(url, {
      params: { api_key: API_KEY, language: 'es-ES' },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Error al obtener películas de la categoría ${category}:`, error);
    return [];
  }
};

/* ---------------------------- DETALLES ---------------------------- */
export const getMovieDetails = async (id: number) => {
  try {
    const response = await theMovieDB.get(`/movie/${id}`, {
      params: { api_key: API_KEY, language: 'es-ES' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los detalles de la película:', error);
    return null;
  }
};

/* ---------------------------- CRÉDITOS ---------------------------- */
export const getMovieCredits = async (id: number) => {
  try {
    const response = await theMovieDB.get(`/movie/${id}/credits`, {
      params: { api_key: API_KEY, language: 'es-ES' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el elenco de la película:', error);
    return { cast: [] };
  }
};

/* ---------------------------- VIDEOS ---------------------------- */
export const getMovieVideos = async (id: number) => {
  try {
    const response = await theMovieDB.get(`/movie/${id}/videos`, {
      params: { api_key: API_KEY, language: 'es-ES' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener videos:', error);
    return { results: [] };
  }
};

/* ---------------------------- IMÁGENES ---------------------------- */
export const getMovieImages = async (movieId: number): Promise<any> => {
  try {
    const response = await theMovieDB.get(`/movie/${movieId}/images`, {
      params: { include_image_language: 'es,en,null', api_key: API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    return { backdrops: [] };
  }
};

/* ---------------------------- TOP RATED ---------------------------- */
export const getTopRatedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await theMovieDB.get('/movie/top_rated', {
      params: { api_key: API_KEY, language: 'es-ES' },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener las películas mejor valoradas:', error);
    return [];
  }
};

/* ---------------------------- UPCOMING ---------------------------- */
export const getUpcomingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await theMovieDB.get('/movie/upcoming', {
      params: { api_key: API_KEY, language: 'es-ES' },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener las próximas películas:', error);
    return [];
  }
};

/* ---------------------------- ANIME ---------------------------- */
export const getAnimeMovies = async (): Promise<Movie[]> => {
  try {
    const response = await theMovieDB.get('/discover/movie', {
      params: { with_genres: 16, api_key: API_KEY, language: 'es-ES' },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener animes:', error);
    return [];
  }
};
