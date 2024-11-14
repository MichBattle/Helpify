import React from 'react';

const Home = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Benvenuto su Helpify</h1>
      <p>
        Helpify ti aiuta a creare playlist personalizzate basate sul tuo mood, il meteo e i tuoi artisti preferiti.
        Scopri le tue statistiche di ascolto, confronta i tuoi brani preferiti e tanto altro!
      </p>
      <img
        src="https://source.unsplash.com/800x400/?music,playlist"
        alt="Helpify"
        style={{ width: '80%', borderRadius: '10px', marginTop: '20px' }}
      />
    </div>
  );
};

export default Home;
