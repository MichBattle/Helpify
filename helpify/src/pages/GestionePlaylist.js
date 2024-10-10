// src/pages/GestionePlaylist.js
import React from 'react';
import PlaylistList from '../components/PlaylistManagement/PlaylistList';
import PlaylistDetails from '../components/PlaylistManagement/PlaylistDetails';
import { useParams } from 'react-router-dom';
import '../components/PlaylistManagement/PlaylistManagement.css';

const GestionePlaylist = () => {
  const { playlistId } = useParams();

  return (
    <div className="gestione-playlist">
      {playlistId ? (
        <PlaylistDetails playlistId={playlistId} />
      ) : (
        <PlaylistList />
      )}
    </div>
  );
};

export default GestionePlaylist;
