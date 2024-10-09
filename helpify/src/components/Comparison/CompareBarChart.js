// src/components/Comparison/CompareBarChart.js
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';
import './Comparison.css';

const CompareBarChart = ({ title, items, type, criteria }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('spotify_token');
      if (!token) {
        setData([]);
        return;
      }

      try {
        if (type === 'artist') {
          // Fetch artist data individually
          const promises = items.map(async (item) => {
            const response = await axios.get(`https://api.spotify.com/v1/artists/${item.value}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            let value;
            if (criteria === 'popularity') {
              value = response.data.popularity;
            } else if (criteria === 'followers') {
              value = response.data.followers.total;
            } else {
              value = response.data[criteria] || 0;
            }
            return {
              name: response.data.name,
              [criteria]: value,
            };
          });

          const results = await Promise.all(promises);
          setData(results);
        } else if (type === 'track') {
          // Fetch audio features in bulk
          const trackIds = items.map((item) => item.value).join(',');
          const response = await axios.get('https://api.spotify.com/v1/audio-features', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              ids: trackIds,
            },
          });

          // Fetch track names
          const tracksResponse = await axios.get('https://api.spotify.com/v1/tracks', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              ids: trackIds,
            },
          });

          const audioFeatures = response.data.audio_features;
          const tracks = tracksResponse.data.tracks;

          const combinedData = audioFeatures.map((features, index) => {
            if (!features) return null; // Handle possible null values
            let value;
            if (criteria === 'danceability' || criteria === 'valence' || criteria === 'energy' ||
                criteria === 'acousticness' || criteria === 'liveness' || criteria === 'danceability') {
              value = features[criteria];
            } else if (criteria === 'loudness') {
              value = features.loudness;
            } else if (criteria === 'tonality') {
              // Tonality: Combine key and mode for better readability
              const keyMap = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
              const modeMap = ['Minor', 'Major'];
              value = `${keyMap[features.key]} ${modeMap[features.mode]}`;
            } else {
              value = features[criteria] || 0;
            }

            return {
              name: tracks[index].name,
              [criteria]: value,
            };
          }).filter(item => item !== null);

          setData(combinedData);
        }
      } catch (error) {
        console.error('Errore nel recuperare i dati per il grafico:', error);
        setData([]);
      }
    };

    fetchData();
  }, [items, type, criteria]);

  return (
    <div className="compare-bar-chart">
      <h3>{title} - {criteria.charAt(0).toUpperCase() + criteria.slice(1)}</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {criteria === 'tonality' ? (
              <Bar dataKey={criteria} fill="#1DB954" />
            ) : (
              <Bar dataKey={criteria} fill="#1DB954" />
            )}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>Nessun dato disponibile per questo grafico.</p>
      )}
    </div>
  );
};

export default CompareBarChart;
