import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export const fetchWeather = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
          lang: 'it',
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error('Errore nel recupero del meteo:', err);
    throw new Error('Impossibile recuperare i dati meteo.');
  }
};
