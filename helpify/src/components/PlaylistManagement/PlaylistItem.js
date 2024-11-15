import React from 'react';
import { Link } from 'react-router-dom';
import './PlaylistManagement.css';

const PlaylistItem = ({ playlist }) => {
  return (
    <li className="playlist-item">
      <img src={playlist.images[0]?.url} alt={playlist.name} className="playlist-image" />
      <div className="playlist-info">
        <h4>{playlist.name}</h4>
        <p>{playlist.tracks.total} brani</p>
      </div>
      <Link to={`/gestione-playlist/${playlist.id}`} className="btn btn--details">
        Details
      </Link>
    </li>
  );
};

export default PlaylistItem;
