import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './PlaylistGenerator.css';

const PlaylistGenerator = () => {
  const [playlistType, setPlaylistType] = useState(null);
  const [mood, setMood] = useState(null);
  const [weather, setWeather] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [generatedTracks, setGeneratedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const moods = [
    { value: 'happy', label: 'Felice' },
    { value: 'sad', label: 'Triste' },
    { value: 'energetic', label: 'Energetico' },
    { value: 'calm', label: 'Calmo' },
  ];

  const playlistOptions = [
    { value: 'mood', label: 'Per Mood' },
    { value: 'weather', label: 'Per Meteo' },
    { value: 'recommended', label: 'Consigliata' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
      alert('Devi effettuare il login con Spotify per generare una playlist.');
      window.location.href = '/';
      return;
    }

    const fetchTopArtists = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=10', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTopArtists(response.data.items);
      } catch (error) {
        console.error('Errore nel recuperare i top artisti:', error);
      }
    };

    fetchTopArtists();
  }, []);

  const handleGeneratePlaylist = async () => {
    if (!playlistType) {
      alert('Per favore, seleziona il tipo di playlist.');
      return;
    }

    if (playlistType.value === 'weather' && !weather) {
      alert('Per favore, inserisci una città per ottenere il meteo.');
      return;
    }

    setLoading(true);
    setGeneratedTracks([]);

    const token = localStorage.getItem('spotify_token');

    try {
      let tracks = [];

      if (playlistType.value === 'mood') {
        if (!mood) {
          alert('Per favore, seleziona un mood.');
          setLoading(false);
          return;
        }

        let targetAudioFeatures = {};

        switch (mood.value) {
          case 'happy':
            targetAudioFeatures = { valence: 0.7, energy: 0.7 };
            break;
          case 'sad':
            targetAudioFeatures = { valence: 0.2, energy: 0.3 };
            break;
          case 'energetic':
            targetAudioFeatures = { energy: 0.8, danceability: 0.7 };
            break;
          case 'calm':
            targetAudioFeatures = { energy: 0.3, acousticness: 0.7 };
            break;
          default:
            targetAudioFeatures = {};
        }

        const response = await axios.get('https://api.spotify.com/v1/recommendations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 100,
            ...targetAudioFeatures,
            seed_genres: 'pop', 
          },
        });

        tracks = response.data.tracks;
      } else if (playlistType.value === 'weather') {
        const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${weather}&appid=${apiKey}&units=metric`
        );

        setWeatherData(weatherResponse.data);

        const currentWeather = weatherResponse.data.weather[0].main.toLowerCase();

        let targetAudioFeatures = {};

        if (currentWeather.includes('rain')) {
          targetAudioFeatures = { valence: 0.2, energy: 0.3 };
        } else if (currentWeather.includes('clear')) {
          targetAudioFeatures = { valence: 0.7, energy: 0.7 };
        } else if (currentWeather.includes('cloud')) {
          targetAudioFeatures = { valence: 0.5, energy: 0.5 };
        } else if (currentWeather.includes('snow')) {
          targetAudioFeatures = { valence: 0.3, energy: 0.4 };
        } else {
          targetAudioFeatures = { valence: 0.5, energy: 0.5 };
        }

        const response = await axios.get('https://api.spotify.com/v1/recommendations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 100,
            ...targetAudioFeatures,
            seed_genres: 'pop', 
          },
        });

        tracks = response.data.tracks;
      } else if (playlistType.value === 'recommended') {
        const seedArtists = topArtists.map((artist) => artist.id).slice(0, 5).join(',');

        const response = await axios.get('https://api.spotify.com/v1/recommendations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 100,
            seed_artists: seedArtists,
          },
        });

        tracks = response.data.tracks;
      }

      const topArtistIds = topArtists.map((artist) => artist.id);
      const topArtistTracks = tracks.filter((track) => topArtistIds.includes(track.artists[0].id)).slice(0, 25);
      const otherTracks = tracks.filter((track) => !topArtistIds.includes(track.artists[0].id)).slice(0, 75);

      tracks = [...topArtistTracks, ...otherTracks];

      setGeneratedTracks(tracks);
    } catch (error) {
      console.error('Errore nella generazione della playlist:', error);
      alert('C\'è stato un errore nella generazione della playlist. Per favore, riprova.');
    }

    setLoading(false);
  };

  const handleSavePlaylist = async () => {
    if (generatedTracks.length === 0) {
      alert('Non ci sono brani da salvare.');
      return;
    }

    const token = localStorage.getItem('spotify_token');

    try {
      const userResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = userResponse.data.id;

      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName || 'Helpify Playlist',
          description: 'Playlist generata da Helpify',
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const playlistId = playlistResponse.data.id;

      const trackUris = generatedTracks.map((track) => track.uri);

      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: trackUris,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Playlist salvata con successo nel tuo account Spotify!');
      setGeneratedTracks([]);
      setPlaylistName('');
    } catch (error) {
      console.error('Errore nel salvare la playlist:', error);
      alert('C\'è stato un errore nel salvare la playlist. Per favore, riprova.');
    }
  };

  return (
    <div className="playlist-generator">
      <h2>Genera Playlist Personalizzata</h2>
      <div className="form-group">
        <label>Tipo di Playlist:</label>
        <Select
          options={playlistOptions}
          value={playlistType}
          onChange={setPlaylistType}
          placeholder="Seleziona il tipo di playlist"
        />
      </div>

      {playlistType && playlistType.value === 'mood' && (
        <div className="form-group">
          <label>Scegli un Mood:</label>
          <Select
            options={moods}
            value={mood}
            onChange={setMood}
            placeholder="Seleziona il mood"
          />
        </div>
      )}

      {playlistType && playlistType.value === 'weather' && (
        <div className="form-group">
          <label>Inserisci una Città:</label>
          <input
            type="text"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            placeholder="Es. Milano"
          />
        </div>
      )}

      <button onClick={handleGeneratePlaylist} disabled={loading}>
        {loading ? 'Generando...' : 'Genera Playlist'}
      </button>

      {generatedTracks.length > 0 && (
        <div className="generated-playlist">
          <h3>Playlist Generata</h3>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Nome della playlist"
          />
          <ul>
            {generatedTracks.map((track, index) => (
              <li key={index}>
                {track.name} - {track.artists.map((artist) => artist.name).join(', ')}
              </li>
            ))}
          </ul>
          <button onClick={handleSavePlaylist}>Salva Playlist su Spotify</button>
        </div>
      )}

      {weatherData && (
        <div className="weather-info">
          <h4>Meteo Attuale a {weatherData.name}:</h4>
          <p>
            {weatherData.weather[0].description}, {weatherData.main.temp}°C
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaylistGenerator;
