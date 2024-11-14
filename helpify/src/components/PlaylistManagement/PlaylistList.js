import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PlaylistManagement.css';

const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaylists = async () => {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
      alert('Devi effettuare il login con Spotify per visualizzare le playlist.');
      window.location.href = '/';
      return;
    }

    setLoading(true);
    try {
      let fetchedPlaylists = [];
      let nextURL = 'https://api.spotify.com/v1/me/playlists';

      while (nextURL) {
        const response = await axios.get(nextURL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Response Data:', response.data); 
        fetchedPlaylists = [...fetchedPlaylists, ...response.data.items];
        nextURL = response.data.next;
      }

      setPlaylists(fetchedPlaylists);
    } catch (err) {
      console.error('Errore nel recuperare le playlist:', err);
      setError('C\'è stato un errore nel recuperare le playlist.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  if (loading) return <p>Caricamento delle playlist...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="playlist-list">
      <h3>Le Tue Playlist</h3>
      {playlists.length === 0 ? (
        <p>Non hai playlist.</p>
      ) : (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <Link to={`/gestione-playlist/${playlist.id}`}>
                {playlist.name} ({playlist.tracks.total} brani)
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaylistList;
