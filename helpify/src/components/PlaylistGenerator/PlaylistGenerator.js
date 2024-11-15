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
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'energetic', label: 'Enercetic' },
    { value: 'calm', label: 'Calm' },
  ];

  const playlistOptions = [
    { value: 'mood', label: 'Mood' },
    { value: 'weather', label: 'Weather' },
    { value: 'recommended', label: 'Recommended' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
      alert('You must log in with Spotify to generate a playlist.');
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
        console.error('Error retrieving top artists:', error);
      }
    };

    fetchTopArtists();
  }, []);

  const handleGeneratePlaylist = async () => {
    if (!playlistType) {
      alert('Please select the playlist type.');
      return;
    }

    if (playlistType.value === 'weather' && !weather) {
      alert('Please enter a city to get the weather.');
      return;
    }

    setLoading(true);
    setGeneratedTracks([]);

    const token = localStorage.getItem('spotify_token');

    try {
      let tracks = [];

      if (playlistType.value === 'mood') {
        if (!mood) {
          alert('Please select a mood.');
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
      console.error('Error generating playlist:', error);
      alert('C\'there was an error in generating the playlist. Please try again.');
    }

    setLoading(false);
  };

  const handleSavePlaylist = async () => {
    if (generatedTracks.length === 0) {
      alert('There are no songs to save.');
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

      alert('Playlist successfully saved to your Spotify account!');
      setGeneratedTracks([]);
      setPlaylistName('');
    } catch (error) {
      console.error('Error saving playlist:', error);
      alert('C\'there was an error saving the playlist. Please try again.');
    }
  };

  return (
    <div className="playlist-generator">
      <h2>Generate Custom Playlist</h2>
      <div className="form-group">
        <label>Playlist Type:</label>
        <Select
          options={playlistOptions}
          value={playlistType}
          onChange={setPlaylistType}
          placeholder="Seleziona il tipo di playlist"
        />
      </div>

      {playlistType && playlistType.value === 'mood' && (
        <div className="form-group">
          <label>Choose a Mood:</label>
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
          <label>Enter a City:</label>
          <input
            type="text"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            placeholder="Es. Milano"
          />
        </div>
      )}

      <button onClick={handleGeneratePlaylist} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Playlist'}
      </button>

      {generatedTracks.length > 0 && (
        <div className="generated-playlist">
          <h3>Playlist Generated</h3>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Playlist Name"
          />
          <ul>
            {generatedTracks.map((track, index) => (
              <li key={index}>
                {track.name} - {track.artists.map((artist) => artist.name).join(', ')}
              </li>
            ))}
          </ul>
          <button onClick={handleSavePlaylist}>Save Playlists to Spotify</button>
        </div>
      )}

      {weatherData && (
        <div className="weather-info">
          <h4>Current Weather at {weatherData.name}:</h4>
          <p>
            {weatherData.weather[0].description}, {weatherData.main.temp}°C
          </p>
        </div>
      )}
    </div>
  );
};

export default PlaylistGenerator;
