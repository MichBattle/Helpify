import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlaylistPersonalizzate from './pages/PlaylistPersonalizzate';
import Statistiche from './pages/Statistiche';
import Confronto from './pages/Confronto';
import GestionePlaylist from './pages/GestionePlaylist';
import TimeCapsule from './pages/TimeCapsule';
import Callback from './pages/Callback';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playlist-personalizzate" element={<PlaylistPersonalizzate />} />
        <Route path="/statistiche" element={<Statistiche />} />
        <Route path="/confronto" element={<Confronto />} />
        <Route path="/gestione-playlist" element={<GestionePlaylist />} />
        <Route path="/gestione-playlist/:playlistId" element={<GestionePlaylist />} />
        <Route path="/time-capsule" element={<TimeCapsule />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
