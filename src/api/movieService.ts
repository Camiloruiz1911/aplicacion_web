import theMovieDB from '../api/theMovieDB';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const getPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await theMovieDB.get('/movie/popular');
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener las películas populares:', error);
    return [];
  }
};

const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await theMovieDB.get('/search/movie', {
      params: {
        query: query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error al buscar películas:', error);
    return [];
  }
};

// movieService.ts
const getMoviesByCategory = async (category: string, genreId?: number): Promise<Movie[]> => {
  try {
    let url = `/movie/${category}`;

    if (genreId) {
      // Usamos el endpoint de discover para filtrar por género
      url = `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`;
    }

    const response = await theMovieDB.get(url);
    return response.data.results;
  } catch (error) {
    console.error(`Error al obtener películas de la categoría ${category}:`, error);
    return [];
  }
};


const API_KEY = '05ac89357c35ca375cdf8bed94115ab5'; // reemplaza con tu API key de TMDB
const BASE_URL = 'https://api.themoviedb.org/3';

export const getMovieDetails = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener los detalles de la película:', error);
    return null;
  }
};

export const getMovieCredits = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=es-ES`);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener el elenco de la película:', error);
    return { cast: [] };
  }
};
export const getMovieVideos = async (id: number) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=TU_API_KEY&language=es-ES`);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener videos:', error);
    return { results: [] };
  }
};
export const getTopRatedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await theMovieDB.get('/movie/top_rated', {
      params: { language: 'es-ES' },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener las películas mejor valoradas:', error);
    return [];
  }
};
export async function getMovieImages(movieId: number): Promise<any> {
  const apiKey = 'TU_API_KEY'; // 🔹 reemplaza con tu clave real de TMDB
  const url = `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener las imágenes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getMovieImages:', error);
    return { backdrops: [] }; // retornamos vacío si falla
  }
}


export const getUpcomingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await theMovieDB.get('/movie/upcoming', {
      params: { language: 'es-ES' },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener las películas próximas:', error);
    return [];
  }
};

export const getAnimeMovies = async (): Promise<Movie[]> => {
  try {
    const response = await theMovieDB.get('/discover/movie', {
      params: {
        with_genres: 16,
        language: 'es-ES',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener los animes:', error);
    return [];
  }
};




export { getMoviesByCategory, getPopularMovies, searchMovies };

