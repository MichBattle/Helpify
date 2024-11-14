import React from 'react';
import './Statistics.css';

const TopTracks = ({ tracks }) => {
  return (
    <div className="top-section">
      <h3>Top 10 Brani</h3>
      <ul className="list tracks-list">
        {tracks.map((track, index) => (
          <li key={track.id} className="track-item">
            <img src={track.album.images[2]?.url} alt={track.name} className="track-image" />
            <div>
              <strong>{index + 1}. {track.name}</strong>
              <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopTracks;
