// src/pages/Callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Estrai il token e la scadenza dall'URL
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    const expiresIn = params.get('expires_in'); // in secondi

    if (token) {
      // Calcola il tempo di scadenza
      const expirationTime = new Date().getTime() + expiresIn * 1000;

      // Salva il token e il tempo di scadenza nel localStorage
      localStorage.setItem('spotify_token', token);
      localStorage.setItem('spotify_token_expiration', expirationTime);

      // Reindirizza alla home
      navigate('/');
    } else {
      // Gestisci l'errore
      console.error('Token di accesso non trovato');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Autenticazione in corso...</h2>
    </div>
  );
};

export default Callback;
