import React from 'react';
import PlaylistList from '../components/PlaylistManagement/PlaylistList';
import CreatePlaylist from '../components/PlaylistManagement/CreatePlaylist';
import { useParams } from 'react-router-dom';
import PlaylistDetails from '../components/PlaylistManagement/PlaylistDetails';
import './GestionePlaylist.css';

const GestionePlaylist = () => {
  const { playlistId } = useParams();

  return (
    <div className="gestione-playlist">
      {playlistId ? (
        <PlaylistDetails playlistId={playlistId} />
      ) : (
        <>
          <CreatePlaylist />
          <PlaylistList />
        </>
      )}
    </div>
  );
};

export default GestionePlaylist;
