// src/components/Statistics/Statistics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';
import TopGenres from './TopGenres';
import './Statistics.css';

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('medium_term'); // Default: Ultimi 6 mesi
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  const timeRanges = [
    { value: 'short_term', label: 'Ultime 4 settimane' },
    { value: 'medium_term', label: 'Ultimi 6 mesi' },
    { value: 'long_term', label: 'Di sempre' },
  ];

  useEffect(() => {
    const fetchStatistics = async () => {
      const token = localStorage.getItem('spotify_token');
      if (!token) {
        alert('Devi effettuare il login con Spotify per visualizzare le statistiche.');
        window.location.href = '/';
        return;
      }

      setLoading(true);

      try {
        // Fetch Top Tracks
        const tracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 10,
            time_range: timeRange,
          },
        });
        setTopTracks(tracksResponse.data.items);

        // Fetch Top Artists
        const artistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 10,
            time_range: timeRange,
          },
        });
        setTopArtists(artistsResponse.data.items);

        // Aggregate Top Genres
        const genresCount = {};
        artistsResponse.data.items.forEach((artist) => {
          artist.genres.forEach((genre) => {
            genresCount[genre] = (genresCount[genre] || 0) + 1;
          });
        });

        // Convert genresCount to an array and sort by count descending
        const sortedGenres = Object.entries(genresCount)
          .map(([genre, count]) => ({ genre, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setTopGenres(sortedGenres);
      } catch (error) {
        console.error('Errore nel recuperare le statistiche:', error);
        alert('C\'è stato un errore nel recuperare le statistiche. Per favore, riprova.');
      }

      setLoading(false);
    };

    fetchStatistics();
  }, [timeRange]);

  return (
    <div className="statistics">
      <h2>Le Tue Statistiche Musicali</h2>
      <div className="time-range-selector">
        <label htmlFor="timeRange">Seleziona il periodo:</label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          {timeRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Caricamento delle statistiche...</p>
      ) : (
        <div className="statistics-content">
          <TopTracks tracks={topTracks} />
          <TopArtists artists={topArtists} />
          <TopGenres genres={topGenres} />
        </div>
      )}
    </div>
  );
};

export default Statistics;
