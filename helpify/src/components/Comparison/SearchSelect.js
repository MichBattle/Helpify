import React from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';

const SearchSelect = ({ type, selectedItems, setSelectedItems, max }) => {
  const loadOptions = async (inputValue, callback) => {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
      callback([]);
      return;
    }

    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: inputValue,
          type: type === 'artist' ? 'artist' : 'track',
          limit: 10,
        },
      });

      let options = [];
      if (type === 'artist') {
        options = response.data.artists.items.map((artist) => ({
          label: artist.name,
          value: artist.id,
          data: artist,
        }));
      } else {
        options = response.data.tracks.items.map((track) => ({
          label: track.name,
          value: track.id,
          data: track,
        }));
      }

      callback(options);
    } catch (error) {
      console.error('Errore nella ricerca:', error);
      callback([]);
    }
  };

  const handleChange = (selectedOptions) => {
    if (selectedOptions.length > max) {
      selectedOptions = selectedOptions.slice(0, max);
    }
    setSelectedItems(selectedOptions);
  };

  return (
    <AsyncSelect
      isMulti
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      value={selectedItems}
      onChange={handleChange}
      placeholder={`Cerca e seleziona fino a ${max} ${type === 'artist' ? 'artisti' : 'brani'}`}
      noOptionsMessage={() => 'Nessun risultato trovato'}
      isClearable
    />
  );
};

export default SearchSelect;
