import axios from 'axios';

export const fetchLyrics = async (artist, track) => {
  try {
    const response = await axios.get(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(track)}`
    );
    return response.data.lyrics;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.warn(`Testi non trovati per: ${artist} - ${track}`);
      return null;
    } else {
      console.error('Errore nel recupero dei testi:', err);
      throw new Error('Impossibile recuperare i testi della canzone.');
    }
  }
};
