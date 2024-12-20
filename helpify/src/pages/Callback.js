import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    const expiresIn = params.get('expires_in'); 

    if (token) {
      const expirationTime = new Date().getTime() + expiresIn * 1000;

      localStorage.setItem('spotify_token', token);
      localStorage.setItem('spotify_token_expiration', expirationTime);

      navigate('/');
    } else {
      console.error('Access Token not found');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Authentication...</h2>
    </div>
  );
};

export default Callback;
