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
      alert('You must log in with Spotify to view playlists.');
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
      console.error('Error retrieving playlists:', err);
      setError('There was an error retrieving the playlists.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  if (loading) return <p>Loading playlists...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="playlist-list">
      <h3>Your Playlists</h3>
      {playlists.length === 0 ? (
        <p>You have no playlist.</p>
      ) : (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <Link to={`/gestione-playlist/${playlist.id}`}>
                {playlist.name} ({playlist.tracks.total} tracks)
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaylistList;
