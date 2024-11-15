import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaSpotify } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [token, setToken] = useState('');
  const [expiresIn, setExpiresIn] = useState(null);
  const [tokenExpirationTime, setTokenExpirationTime] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('spotify_token');
    const expirationTime = localStorage.getItem('spotify_token_expiration');

    if (accessToken && expirationTime) {
      const now = new Date().getTime();
      if (now < parseInt(expirationTime, 10)) {
        setToken(accessToken);
        setExpiresIn(parseInt(expirationTime, 10) - now);
      } else {
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    if (expiresIn) {
      const timeout = setTimeout(() => {
        handleLogout();
      }, expiresIn);

      return () => clearTimeout(timeout);
    }
  }, [expiresIn]);

  const handleLogin = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    const scopes = [
      'playlist-modify-public',
      'playlist-modify-private',
      'playlist-read-private', 
      'playlist-read-collaborative', 
      'user-read-private',
      'user-read-email',
      'user-top-read',
    ];   
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const responseType = 'token';
    const showDialog = true;

    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scopes.join('%20')}&response_type=${responseType}&show_dialog=${showDialog}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_expiration');
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
          Custom Playlists
          </NavLink>
        </li>
        <li>
          <NavLink to="/statistiche" className={({ isActive }) => isActive ? 'active' : ''}>
            Statistics
          </NavLink>
        </li>
        <li>
          <NavLink to="/confronto" className={({ isActive }) => isActive ? 'active' : ''}>
            Comparison
          </NavLink>
        </li>
        <li>
          <NavLink to="/gestione-playlist" className={({ isActive }) => isActive ? 'active' : ''}>
            Playlist Management
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
            Login with Spotify
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
