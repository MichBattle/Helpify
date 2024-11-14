import React, { useState } from 'react';
import axios from 'axios';
import './PlaylistManagement.css';

const CreatePlaylist = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [publicPlaylist, setPublicPlaylist] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleCreatePlaylist = async () => {
    if (!playlistName) {
      alert('Il nome della playlist è obbligatorio.');
      return;
    }

    const token = localStorage.getItem('spotify_token');
    if (!token) {
      alert('Devi effettuare il login con Spotify per creare una playlist.');
      window.location.href = '/';
      return;
    }

    setCreating(true);
    try {
      const userResponse = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = userResponse.data.id;

      await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName,
          description: description,
          public: publicPlaylist,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Playlist creata con successo!');
      setPlaylistName('');
      setDescription('');
      setPublicPlaylist(false);
    } catch (err) {
      console.error('Errore nel creare la playlist:', err);
      setError('C\'è stato un errore nel creare la playlist.');
    }
    setCreating(false);
  };

  return (
    <div className="create-playlist">
      <h3>Crea una Nuova Playlist</h3>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label htmlFor="playlistName">Nome Playlist:</label>
        <input
          type="text"
          id="playlistName"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Inserisci il nome della playlist"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Descrizione:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Inserisci una descrizione (opzionale)"
        />
      </div>
      <div className="form-group">
        <label htmlFor="publicPlaylist">Pubblica:</label>
        <input
          type="checkbox"
          id="publicPlaylist"
          checked={publicPlaylist}
          onChange={(e) => setPublicPlaylist(e.target.checked)}
        />
      </div>
      <button onClick={handleCreatePlaylist} disabled={creating}>
        {creating ? 'Creando...' : 'Crea Playlist'}
      </button>
    </div>
  );
};

export default CreatePlaylist;
