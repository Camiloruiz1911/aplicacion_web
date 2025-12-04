import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
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
  getMovieVideos,
  searchMovies
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
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 0,
    margin: 0,
    paddingTop: 0,
  },
  scrollWrapper: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  scrollHorizontal: {
    flexDirection: 'row',
  },
  scrollbar: {
    height: 4,
    backgroundColor: '#e50914',
    marginTop: 5,
    borderRadius: 2,
    opacity: Platform.OS === 'web' ? 0.8 : 0,
  },
  searchInput: {
    height: 45,
    borderColor: '#222',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
  },
  item: {
    marginRight: 10,
    alignItems: 'center',
    width: 140,
  },
  image: {
    width: 140,
    height: 210,
    borderRadius: 12
  },
  title: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    color: '#fff'
  },
  details: {
    fontSize: 12,
    textAlign: 'center',
    color: '#ccc'
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
    zIndex: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  detailPoster: {
    width: '100%',
    height: width * 1.8,
    borderRadius: 0,
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#fff',
  },
  detailInfo: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
    color: '#bbb',
  },
  detailOverview: {
    fontSize: 16,
    marginBottom: 10,
    color: '#ddd',
    textAlign: 'justify',
  },
  castItem: {
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    width: 80
  },
  castImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginBottom: 5
  },
  castName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#fff'
  },
  castCharacter: {
    fontSize: 12,
    textAlign: 'center',
    color: 'gray'
  },
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
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  // Usuario
  const [loggedIn, setLoggedIn] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const buttonColor = '#e50914';
  const bgColor = darkMode ? '#222' : '#fff';
  const textColor = darkMode ? '#fff' : '#000';
  const inputBg = darkMode ? '#333' : '#eee';

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
    const videos = await getMovieVideos(id);

    const trailer = videos.results.find(
      (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
    );

    setMovieDetail(detail);
    setCast(credits.cast || []);
    setTrailerKey(trailer ? trailer.key : null);
  };

  const renderMovieItem = (movie: Movie) => (
    <TouchableOpacity
      key={movie.id}
      style={styles.item}
      onPress={() => handleSelectMovie(movie.id)}
    >
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }}
        style={styles.image}
      />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.details}>
        {movie.release_date
          ? new Date(movie.release_date).toLocaleDateString('es-ES')
          : ''}
      </Text>
      <Text style={styles.details}>
        {movie.vote_average ? `${Math.round(movie.vote_average * 10)}% votos` : ''}
      </Text>
    </TouchableOpacity>
  );

  const handleUserButton = () => {
    if (loggedIn) {
      setUserMenuVisible(prev => !prev);
    } else {
      setShowLoginForm(true);
    }
  };

  const handleLogin = () => {
    if (username && password) {
      setLoggedIn(true);
      setShowLoginForm(false);
      setUserMenuVisible(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0d0d0d', marginTop: 0, paddingTop: 0 }}>

      {/* Botón usuario */}
      <TouchableOpacity
        onPress={handleUserButton}
        style={{ position: 'absolute', top: 15, right: 15, zIndex: 100 }}
      >
        <Text style={{ fontSize: 22, color: buttonColor }}>👤</Text>
      </TouchableOpacity>

      {/* Título Cinemax */}
      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          color: '#e50914',
          textAlign: 'center',
          marginTop: 15,
          marginBottom: 5
        }}
      >
        Cinemax
      </Text>

      {/* Menú usuario */}
      {userMenuVisible && loggedIn && (
        <View
          style={{
            position: 'absolute',
            top: 50,
            right: 15,
            backgroundColor: bgColor,
            padding: 10,
            borderRadius: 8,
            zIndex: 101,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setLoggedIn(false);
              setUserMenuVisible(false);
            }}
          >
            <Text style={{ color: textColor, marginBottom: 5 }}>Cerrar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setDarkMode(prev => !prev)}>
            <Text style={{ color: textColor }}>
              Modo {darkMode ? 'Claro' : 'Oscuro'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Form login */}
      {showLoginForm && !loggedIn && (
        <View
          style={{
            position: 'absolute',
            top: 70,
            right: 15,
            backgroundColor: bgColor,
            borderRadius: 10,
            padding: 15,
            zIndex: 101,
            width: 200,
          }}
        >
          <TextInput
            placeholder="Usuario"
            placeholderTextColor={darkMode ? '#888' : '#999'}
            style={{
              backgroundColor: inputBg,
              color: textColor,
              marginBottom: 10,
              borderRadius: 6,
              padding: 8,
            }}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor={darkMode ? '#888' : '#999'}
            style={{
              backgroundColor: inputBg,
              color: textColor,
              marginBottom: 10,
              borderRadius: 6,
              padding: 8,
            }}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={{
              backgroundColor: buttonColor,
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 5,
            }}
            onPress={handleLogin}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: '#555',
            }}
            onPress={() => setShowLoginForm(false)}
          >
            <Text style={{ color: '#fff' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Vista detalle */}
      {selectedMovieId && movieDetail ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollWrapper}
          showsVerticalScrollIndicator
          nestedScrollEnabled
        >
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedMovieId(null)}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/original${movieDetail.poster_path}`,
              }}
              style={styles.detailPoster}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.detailTitle}>{movieDetail.title}</Text>

          {trailerKey && (
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                paddingHorizontal: 25,
                backgroundColor: '#e50914',
                borderRadius: 8,
                marginBottom: 15,
                alignSelf: 'center',
              }}
              onPress={() =>
                Linking.openURL(`https://www.youtube.com/watch?v=${trailerKey}`)
              }
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                ▶ Ver Tráiler
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.detailInfo}>
            Duración: {movieDetail.runtime} min | Géneros:{' '}
            {movieDetail.genres.map(g => g.name).join(', ')}
          </Text>

          <Text style={styles.detailInfo}>
            Fecha: {movieDetail.release_date}
          </Text>

          <Text style={styles.detailInfo}>
            Votos: {Math.round(movieDetail.vote_average * 10)}%
          </Text>

          <Text style={styles.detailOverview}>{movieDetail.overview}</Text>

          <Text style={[styles.sectionTitle, { marginTop: 15 }]}>
            Reparto
          </Text>

          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator
            style={styles.scrollHorizontal}
          >
            {cast.map(member => (
              <View key={member.id} style={styles.castItem}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w200${member.profile_path}`,
                  }}
                  style={styles.castImage}
                />

                <Text style={styles.castName}>{member.name}</Text>
                <Text style={styles.castCharacter}>{member.character}</Text>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollWrapper}
          showsVerticalScrollIndicator
          nestedScrollEnabled
        >
          {/* Sin texto "Películas" */}

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar películas..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={handleSearch}
          />

          {[
            { title: '🔥 Más Populares', data: popularMovies },
            { title: '⭐ Mejor Valoradas', data: topRatedMovies },
            { title: '🎞 Próximos Estrenos', data: upcomingMovies },
            { title: '🍿 Animes', data: animeMovies },
          ].map(
            (section, i) =>
              section.data.length > 0 && (
                <View key={i}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>

                  <ScrollView
                    horizontal
                    nestedScrollEnabled
                    showsHorizontalScrollIndicator
                    style={styles.scrollHorizontal}
                  >
                    {section.data.map(renderMovieItem)}
                  </ScrollView>

                  <View style={styles.scrollbar} />
                </View>
              )
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default MoviePopular;
