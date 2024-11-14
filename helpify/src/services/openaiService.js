import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const determineMood = async (lyrics) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: `Determina il mood di questa canzone basandoti sui seguenti testi:\n\n${lyrics}\n\nMood:`,
        max_tokens: 10,
        temperature: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text.trim();
  } catch (err) {
    console.error('Errore nella determinazione del mood:', err);
    throw new Error('Impossibile determinare il mood della canzone.');
  }
};
