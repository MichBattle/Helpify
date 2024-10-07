// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaSpotify } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('spotify_token');
    setToken(accessToken);
  }, []);

  const handleLogin = () => {
    const clientId = 'CLIENT_ID'; // Sostituisci con il tuo Client ID di Spotify
    const redirectUri = 'http://localhost:3000/callback'; // Assicurati che corrisponda all'URI di reindirizzamento registrato
    const scopes = [
      'playlist-modify-public',
      'playlist-modify-private',
      'user-read-private',
      'user-read-email',
      // Aggiungi altri scope necessari
    ];
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const responseType = 'token';

    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scopes.join('%20')}&response_type=${responseType}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    setToken('');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <FaSpotify size={30} />
        <Link to="/" className="navbar-title">Helpify</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/playlist-personalizzate" className={({ isActive }) => isActive ? 'active' : ''}>
            Playlist Personalizzate
          </NavLink>
        </li>
        <li>
          <NavLink to="/statistiche" className={({ isActive }) => isActive ? 'active' : ''}>
            Statistiche
          </NavLink>
        </li>
        <li>
          <NavLink to="/confronto" className={({ isActive }) => isActive ? 'active' : ''}>
            Confronto
          </NavLink>
        </li>
        <li>
          <NavLink to="/gestione-playlist" className={({ isActive }) => isActive ? 'active' : ''}>
            Gestione Playlist
          </NavLink>
        </li>
        <li>
          <NavLink to="/mood-monitor" className={({ isActive }) => isActive ? 'active' : ''}>
            Mood Monitor
          </NavLink>
        </li>
        <li>
          <NavLink to="/analisi-brano" className={({ isActive }) => isActive ? 'active' : ''}>
            Analisi Brano
          </NavLink>
        </li>
        <li>
          <NavLink to="/time-capsule" className={({ isActive }) => isActive ? 'active' : ''}>
            Time Capsule
          </NavLink>
        </li>
      </ul>
      <div className="navbar-auth">
        {token ? (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="login-button" onClick={handleLogin}>
            Login con Spotify
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
