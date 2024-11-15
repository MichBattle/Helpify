import React, { useState } from 'react';
import './TimeCapsule.css';
import axios from 'axios';

const TimeCapsule = () => {
  const [loading, setLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [error, setError] = useState('');

  const generateTimeCapsule = async () => {
    setLoading(true);
    setError('');
    setPlaylistUrl('');

    try {
      const token = localStorage.getItem('spotify_token');
      if (!token) {
        setError('Token not found. Log in with Spotify.');
        setLoading(false);
        return;
      }

      const userResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = userResponse.data.id;

      const topTracksResponse = await axios.get(
        'https://api.spotify.com/v1/me/top/tracks',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 30,
            time_range: 'short_term',
          },
        }
      );
      const topTracks = topTracksResponse.data.items;
      const trackUris = topTracks.map((track) => track.uri);

      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: `Time Capsule - Last 4 Weeks`,
          description: 'Your 30 most listened to songs in the last 4 weeks.',
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

      setPlaylistUrl(playlistResponse.data.external_urls.spotify);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the Time Capsule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="time-capsule-container">
      <h1>Time Capsule</h1>
      <p>
        Create a playlist with your 30 most listened to songs in the last 4 weeks.
      </p>
      <button onClick={generateTimeCapsule} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Time Capsule'}
      </button>
      {playlistUrl && (
        <div className="playlist-link">
          <p>Your Time Capsule has been created!</p>
          <a href={playlistUrl} target="_blank" rel="noopener noreferrer">
          Open the playlist on Spotify
          </a>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TimeCapsule;
