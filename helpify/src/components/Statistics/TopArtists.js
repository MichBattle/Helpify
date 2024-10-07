// src/components/Statistics/TopArtists.js
import React from 'react';
import './Statistics.css';

const TopArtists = ({ artists }) => {
  return (
    <div className="top-section">
      <h3>Top 10 Artisti</h3>
      <ul className="list artists-list">
        {artists.map((artist, index) => (
          <li key={artist.id} className="artist-item">
            <img src={artist.images[2]?.url} alt={artist.name} className="artist-image" />
            <div>
              <strong>{index + 1}. {artist.name}</strong>
              <p>{artist.genres.join(', ')}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopArtists;
