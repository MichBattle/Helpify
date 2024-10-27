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
        setError('Token non trovato. Effettua il login con Spotify.');
        setLoading(false);
        return;
      }

      // Step 1: Ottieni l'ID dell'utente
      const userResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = userResponse.data.id;

      // Step 2: Ottieni le top 30 tracce degli ultimi 4 settimane (short_term)
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

      // Step 3: Crea una nuova playlist
      const playlistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: `Time Capsule - Ultime 4 Settimane`,
          description: 'Le tue 30 canzoni più ascoltate nelle ultime 4 settimane.',
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

      // Step 4: Aggiungi le tracce alla playlist
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

      // Step 5: Ottieni l'URL della playlist
      setPlaylistUrl(playlistResponse.data.external_urls.spotify);
    } catch (err) {
      console.error(err);
      setError('Si è verificato un errore durante la generazione della Time Capsule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="time-capsule-container">
      <h1>Time Capsule</h1>
      <p>
        Crea una playlist con le tue 30 canzoni più ascoltate nelle ultime 4 settimane.
      </p>
      <button onClick={generateTimeCapsule} disabled={loading}>
        {loading ? 'Generando...' : 'Genera Time Capsule'}
      </button>
      {playlistUrl && (
        <div className="playlist-link">
          <p>La tua Time Capsule è stata creata!</p>
          <a href={playlistUrl} target="_blank" rel="noopener noreferrer">
            Apri la Playlist su Spotify
          </a>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TimeCapsule;
