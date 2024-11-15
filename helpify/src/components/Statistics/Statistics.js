import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';
import TopGenres from './TopGenres';
import './Statistics.css';

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('medium_term'); 
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  const timeRanges = [
    { value: 'short_term', label: 'Last 4 weeks' },
    { value: 'medium_term', label: 'Last 6 months' },
    { value: 'long_term', label: 'All time' },
  ];

  useEffect(() => {
    const fetchStatistics = async () => {
      const token = localStorage.getItem('spotify_token');
      if (!token) {
        alert('You must log in with Spotify to view statistics.');
        window.location.href = '/';
        return;
      }

      setLoading(true);

      try {
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

        const genresCount = {};
        artistsResponse.data.items.forEach((artist) => {
          artist.genres.forEach((genre) => {
            genresCount[genre] = (genresCount[genre] || 0) + 1;
          });
        });

        const sortedGenres = Object.entries(genresCount)
          .map(([genre, count]) => ({ genre, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setTopGenres(sortedGenres);
      } catch (error) {
        console.error('Error retrieving statistics:', error);
        alert('There was an error retrieving the statistics.');
      }

      setLoading(false);
    };

    fetchStatistics();
  }, [timeRange]);

  return (
    <div className="statistics">
      <h2>Your Music Statistics</h2>
      <div className="time-range-selector">
        <label htmlFor="timeRange">Select the period:</label>
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
        <p>Loading statistics...</p>
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
