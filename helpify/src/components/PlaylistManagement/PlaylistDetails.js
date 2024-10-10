// src/components/PlaylistManagement/PlaylistDetails.js
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
  const [currentUserId, setCurrentUserId] = useState(null); // Stato per l'ID dell'utente corrente
  const [excludedTracks, setExcludedTracks] = useState([]); // Stato per tracce escluse

  // Funzione per recuperare l'ID dell'utente corrente
  const fetchCurrentUser = async (token) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUserId(response.data.id);
    } catch (err) {
      console.error('Errore nel recuperare l\'utente corrente:', err);
      setError('C\'è stato un errore nel recuperare le informazioni dell\'utente.');
    }
  };

  // Funzione per recuperare tutte le tracce
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
        // Filtra le tracce non valide (null)
        const validTracks = response.data.items.filter(item => item.track && item.track.id);
        const invalidTracks = response.data.items.filter(item => !item.track || !item.track.id);

        // Aggiorna i contatori
        fetchedTracks = [...fetchedTracks, ...validTracks];
        excluded += invalidTracks.length;
        totalFetched += response.data.items.length;

        // Aggiorna il progresso
        setExcludedTracks(prev => [...prev, ...invalidTracks]);
        nextURL = response.data.next;
      } catch (err) {
        console.error('Errore nel recuperare una pagina di tracce:', err);
        throw err; // Propaga l'errore per gestirlo altrove
      }
    }

    return fetchedTracks;
  };

  const fetchPlaylistDetails = async () => {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
      alert('Devi effettuare il login con Spotify per visualizzare i dettagli della playlist.');
      window.location.href = '/';
      return;
    }

    setLoading(true);
    setExcludedTracks([]); // Resetta le tracce escluse
    try {
      // Recupera l'ID dell'utente corrente
      await fetchCurrentUser(token);

      // Fetch Playlist Info
      const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylist(playlistResponse.data);

      // Fetch All Tracks
      const initialURL = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;
      const fetchedTracks = await fetchAllTracks(initialURL, token);
      setTracks(fetchedTracks);

      // Detect Duplicates and collect positions to remove
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
          // Keep the first occurrence, remove the rest
          const duplicatePositions = trackCount[trackId].positions.slice(1);
          positionsToRemove.push(...duplicatePositions);
        }
      });

      setDuplicatePositions(positionsToRemove);
    } catch (err) {
      console.error('Errore nel recuperare i dettagli della playlist:', err);
      setError('C\'è stato un errore nel recuperare i dettagli della playlist.');
    }
    setLoading(false);
  };

  const handleRemoveDuplicates = async () => {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
      alert('Token mancante. Effettua nuovamente il login.');
      window.location.href = '/';
      return;
    }

    setRemoving(true);
    try {
      // Preparare le posizioni delle tracce da rimuovere, ordinate in ordine decrescente
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

      alert('Duplicati rimossi con successo.');
      // Ricarica i dettagli della playlist
      fetchPlaylistDetails();
    } catch (err) {
      console.error('Errore nel rimuovere i duplicati:', err);
      alert('C\'è stato un errore nel rimuovere i duplicati.');
    }
    setRemoving(false);
  };

  useEffect(() => {
    fetchPlaylistDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistId]);

  if (loading) return <p>Caricamento dei dettagli della playlist...</p>;
  if (error) return <p>{error}</p>;
  if (!playlist) return null;

  // Determina se l'utente corrente è il proprietario della playlist
  const isOwner = currentUserId === playlist.owner.id;

  return (
    <div className="playlist-details">
      <h3>Gestione Playlist: {playlist.name}</h3>
      <p>Numero totale di brani: {playlist.tracks.total}</p>

      {duplicatePositions.length === 0 ? (
        <p>Non sono stati trovati brani duplicati nella playlist.</p>
      ) : (
        <div className="duplicates-section">
          <p>Sono stati trovati {duplicatePositions.length} brani duplicati.</p>
          {isOwner && (
            <button onClick={handleRemoveDuplicates} disabled={removing}>
              {removing ? 'Rimuovendo...' : 'Rimuovi Duplicati'}
            </button>
          )}
          <ul>
            {duplicatePositions.map((position) => {
              const track = tracks[position].track;
              return (
                <li key={position}>
                  {track.name} di {track.artists.map((artist) => artist.name).join(', ')} (Posizione: {position + 1})
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="track-list">
        <h4>Brani nella Playlist</h4>
        <ul>
          {tracks.map((item, index) => (
            <li key={index}>
              {item.track.name} di {item.track.artists.map((artist) => artist.name).join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaylistDetails;
