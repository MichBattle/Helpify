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
      alert('The playlist name is mandatory.');
      return;
    }

    const token = localStorage.getItem('spotify_token');
    if (!token) {
      alert('You must log in with Spotify to create a playlist.');
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

      alert('Playlist created successfully!');
      setPlaylistName('');
      setDescription('');
      setPublicPlaylist(false);
    } catch (err) {
      console.error('Error creating playlist:', err);
      setError('it was a mistake in creating the playlist.');
    }
    setCreating(false);
  };

  return (
    <div className="create-playlist">
      <h3>Create new playlist</h3>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label htmlFor="playlistName">Playlist Name:</label>
        <input
          type="text"
          id="playlistName"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Enter the playlist name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description (optional)"
        />
      </div>
      <div className="form-group">
        <label htmlFor="publicPlaylist">Publish:</label>
        <input
          type="checkbox"
          id="publicPlaylist"
          checked={publicPlaylist}
          onChange={(e) => setPublicPlaylist(e.target.checked)}
        />
      </div>
      <button onClick={handleCreatePlaylist} disabled={creating}>
        {creating ? 'Creating...' : 'Create Playlist'}
      </button>
    </div>
  );
};

export default CreatePlaylist;
