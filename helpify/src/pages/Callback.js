// src/pages/Callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Estrai il token dall'URL
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (token) {
      // Salva il token (es. localStorage)
      localStorage.setItem('spotify_token', token);
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
