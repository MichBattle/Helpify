import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlaylistManagement.css';

const PlaylistDetails = ({ playlistId }) => {
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [duplicatePositions, setDuplicatePositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); 
  const [excludedTracks, setExcludedTracks] = useState([]); 

  const fetchCurrentUser = async (token) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUserId(response.data.id);
    } catch (err) {
      console.error('Error getting current user:', err);
      setError('There was an error retrieving user information.');
    }
  };

  const fetchAllTracks = async (initialURL, token) => {
    let fetchedTracks = [];
    let nextURL = initialURL;
    let totalFetched = 0;
    let excluded = 0;

    while (nextURL) {
      try {
        const response = await axios.get(nextURL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const validTracks = response.data.items.filter(item => item.track && item.track.id);
        const invalidTracks = response.data.items.filter(item => !item.track || !item.track.id);

        fetchedTracks = [...fetchedTracks, ...validTracks];
        excluded += invalidTracks.length;
        totalFetched += response.data.items.length;

        setExcludedTracks(prev => [...prev, ...invalidTracks]);
        nextURL = response.data.next;
      } catch (err) {
        console.error('Error retrieving a traces page:', err);
        throw err;
      }
    }

    return fetchedTracks;
  };

  const fetchPlaylistDetails = async () => {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
      alert('You must log in with Spotify to view playlist details.');
      window.location.href = '/';
      return;
    }

    setLoading(true);
    setExcludedTracks([]); 
    try {
      await fetchCurrentUser(token);

      const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylist(playlistResponse.data);

      const initialURL = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;
      const fetchedTracks = await fetchAllTracks(initialURL, token);
      setTracks(fetchedTracks);

      const trackCount = {};
      const positionsToRemove = [];
      fetchedTracks.forEach((item, index) => {
        const trackId = item.track.id;
        if (trackId) {
          if (trackCount[trackId]) {
            trackCount[trackId].count += 1;
            trackCount[trackId].positions.push(index);
          } else {
            trackCount[trackId] = { count: 1, positions: [index] };
          }
        }
      });

      Object.keys(trackCount).forEach((trackId) => {
        if (trackCount[trackId].count > 1) {
          const duplicatePositions = trackCount[trackId].positions.slice(1);
          positionsToRemove.push(...duplicatePositions);
        }
      });

      setDuplicatePositions(positionsToRemove);
    } catch (err) {
      console.error('Error retrieving playlist details:', err);
      setError('There was an error retrieving the playlist details.');
    }
    setLoading(false);
  };

  const handleRemoveDuplicates = async () => {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
      alert('Missing token. Log in again.');
      window.location.href = '/';
      return;
    }

    setRemoving(true);
    try {
      const sortedPositions = [...duplicatePositions].sort((a, b) => b - a);

      for (let i = 0; i < sortedPositions.length; i += 100) {
        const batch = sortedPositions.slice(i, i + 100);
        await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: {
            positions: batch,
          },
        });
      }

      alert('Duplicates successfully removed.');
      fetchPlaylistDetails();
    } catch (err) {
      console.error('Error removing duplicates:', err);
      alert('Error removing duplicates');
    }
    setRemoving(false);
  };

  useEffect(() => {
    fetchPlaylistDetails();
  }, [playlistId]);

  if (loading) return <p>Loading playlist details...</p>;
  if (error) return <p>{error}</p>;
  if (!playlist) return null;

  const isOwner = currentUserId === playlist.owner.id;

  return (
    <div className="playlist-details">
      <h3>Playlist Management: {playlist.name}</h3>
      <p>Tracks number: {playlist.tracks.total}</p>

      {duplicatePositions.length === 0 ? (
        <p>No duplicate songs were found in the playlist.</p>
      ) : (
        <div className="duplicates-section">
          <p>{duplicatePositions.length} duplicates tracks found.</p>
          {isOwner && (
            <button onClick={handleRemoveDuplicates} disabled={removing}>
              {removing ? 'Removing...' : 'Removing duplicates'}
            </button>
          )}
          <ul>
            {duplicatePositions.map((position) => {
              const track = tracks[position].track;
              return (
                <li key={position}>
                  {track.name} - {track.artists.map((artist) => artist.name).join(', ')} (Position: {position + 1})
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="track-list">
        <h4>Tracks in the playlist</h4>
        <ul>
          {tracks.map((item, index) => (
            <li key={index}>
              {item.track.name} - {item.track.artists.map((artist) => artist.name).join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaylistDetails;
