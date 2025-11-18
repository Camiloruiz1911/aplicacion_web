import theMovieDB from "./theMovieDB";

// 🚀 Películas por categoría (popular, top_rated, upcoming)
export const getMoviesByCategory = async (category: string, genreId?: number) => {
  try {
    if (genreId) {
      const response = await theMovieDB.get('/discover/movie', {
        params: {
          with_genres: genreId,
          sort_by: 'popularity.desc'
        }
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

// 🔍 Buscar películas
export const searchMovies = async (query: string) => {
  try {
    const response = await theMovieDB.get('/search/movie', {
      params: { query },
    });
    return response.data.results;
  } catch {
    return [];
  }
};

// 📌 Detalles de una película
export const getMovieDetails = async (id: number) => {
  try {
    const response = await theMovieDB.get(`/movie/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

// 🎭 Créditos / Reparto
export const getMovieCredits = async (id: number) => {
  try {
    const response = await theMovieDB.get(`/movie/${id}/credits`);
    return response.data;
  } catch {
    return { cast: [] };
  }
};

// 🎬 Videos (trailers)
export const getMovieVideos = async (id: number) => {
  try {
    const response = await theMovieDB.get(`/movie/${id}/videos`);
    return response.data;
  } catch {
    return { results: [] };
  }
};
