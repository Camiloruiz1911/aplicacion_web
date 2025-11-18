import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getMovieCredits,
  getMovieDetails,
  getMoviesByCategory,
  searchMovies,
} from '../../src/api/movieService';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
}

interface MovieDetailInfo {
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];
  runtime: number;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', padding: 10 },
  scrollWrapper: { flexGrow: 1, paddingBottom: 80 },
  scrollHorizontal: { flexDirection: 'row' },
  scrollbar: { height: 4, backgroundColor: '#e50914', marginTop: 5, borderRadius: 2, opacity: Platform.OS === 'web' ? 0.8 : 0 },
  searchInput: { height: 45, borderColor: '#222', borderWidth: 1, borderRadius: 10, marginBottom: 10, paddingLeft: 10, color: '#fff', backgroundColor: '#1a1a1a' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 10, color: '#fff' },
  welcomeTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 5, color: '#e50914' },
  welcomeSubtitle: { fontSize: 16, marginBottom: 15, color: '#bbb' },
  item: { marginRight: 10, alignItems: 'center', width: 140 },
  image: { width: 140, height: 210, borderRadius: 12 },
  title: { marginTop: 5, fontSize: 14, textAlign: 'center', color: '#fff' },
  details: { fontSize: 12, textAlign: 'center', color: '#ccc' },
  backButton: { padding: 10, backgroundColor: '#e50914', borderRadius: 8, marginBottom: 10, alignSelf: 'flex-start' },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
  detailPoster: { width: '100%', borderRadius: 10, marginBottom: 10 },
  detailTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, textAlign: 'center', color: '#fff' },
  detailInfo: { fontSize: 14, marginBottom: 5, textAlign: 'center', color: '#bbb' },
  detailOverview: { fontSize: 16, marginBottom: 10, color: '#ddd', textAlign: 'justify' },
  castItem: { marginRight: 10, marginBottom: 10, alignItems: 'center', width: 80 },
  castImage: { width: 80, height: 120, borderRadius: 8, marginBottom: 5 },
  castName: { fontSize: 12, textAlign: 'center', color: '#fff' },
  castCharacter: { fontSize: 12, textAlign: 'center', color: 'gray' },
});

const MoviePopular: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [animeMovies, setAnimeMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [movieDetail, setMovieDetail] = useState<MovieDetailInfo | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      setPopularMovies(await getMoviesByCategory('popular'));
      setTopRatedMovies(await getMoviesByCategory('top_rated'));
      setUpcomingMovies(await getMoviesByCategory('upcoming'));
      setAnimeMovies(await getMoviesByCategory('popular', 16));
    };
    fetchAll();
  }, []);

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.trim() !== '') {
      const results = await searchMovies(text);
      setPopularMovies(results);
      setTopRatedMovies([]);
      setUpcomingMovies([]);
      setAnimeMovies([]);
    } else {
      setPopularMovies(await getMoviesByCategory('popular'));
      setTopRatedMovies(await getMoviesByCategory('top_rated'));
      setUpcomingMovies(await getMoviesByCategory('upcoming'));
      setAnimeMovies(await getMoviesByCategory('popular', 16));
    }
  };

  const handleSelectMovie = async (id: number) => {
    setSelectedMovieId(id);
    const detail = await getMovieDetails(id);
    const credits = await getMovieCredits(id);
    setMovieDetail(detail);
    setCast(credits.cast || []);
  };

  const renderMovieItem = (movie: Movie) => (
    <TouchableOpacity key={movie.id} style={styles.item} onPress={() => handleSelectMovie(movie.id)}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={styles.image} />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.details}>
        {movie.release_date ? new Date(movie.release_date).toLocaleDateString('es-ES') : ''}
      </Text>
      <Text style={styles.details}>{movie.vote_average ? `${Math.round(movie.vote_average * 10)}% votos` : ''}</Text>
    </TouchableOpacity>
  );

  // 🔹 Detalle de película seleccionado
  if (selectedMovieId && movieDetail) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollWrapper} showsVerticalScrollIndicator nestedScrollEnabled>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedMovieId(null)}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>

        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}` }} style={[styles.detailPoster, { height: width * 1.2 }]} resizeMode="cover" />

        <Text style={styles.detailTitle}>{movieDetail.title}</Text>
        <Text style={styles.detailInfo}>
          Duración: {movieDetail.runtime} min | Géneros: {movieDetail.genres.map(g => g.name).join(', ')}
        </Text>
        <Text style={styles.detailInfo}>Fecha: {movieDetail.release_date}</Text>
        <Text style={styles.detailInfo}>Votos: {Math.round(movieDetail.vote_average * 10)}%</Text>
        <Text style={styles.detailOverview}>{movieDetail.overview}</Text>

        <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Reparto</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled style={styles.scrollHorizontal}>
          {cast.map(member => (
            <View key={member.id} style={styles.castItem}>
              <Image source={{ uri: `https://image.tmdb.org/t/p/w200${member.profile_path}` }} style={styles.castImage} />
              <Text style={styles.castName}>{member.name}</Text>
              <Text style={styles.castCharacter}>{member.character}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.scrollbar} />
      </ScrollView>
    );
  }

  // 🔹 Vista principal (lista de películas)
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollWrapper} showsVerticalScrollIndicator nestedScrollEnabled>
      <Text style={styles.welcomeTitle}>🎬 Bienvenido</Text>
      <Text style={styles.welcomeSubtitle}>Explora el tipo de película que te gusta</Text>

      <TextInput style={styles.searchInput} placeholder="Buscar películas..." placeholderTextColor="#888" value={searchText} onChangeText={handleSearch} />

      {[
        { title: '🔥 Más Populares', data: popularMovies },
        { title: '⭐ Mejor Valoradas', data: topRatedMovies },
        { title: '🎞 Próximos Estrenos', data: upcomingMovies },
        { title: '🍿 Animes', data: animeMovies },
      ].map((section, i) =>
        section.data.length > 0 ? (
          <View key={i}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator style={styles.scrollHorizontal}>
              {section.data.map(renderMovieItem)}
            </ScrollView>
            <View style={styles.scrollbar} />
          </View>
        ) : null
      )}
    </ScrollView>
  );
};

export default MoviePopular;
