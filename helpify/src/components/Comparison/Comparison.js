import React, { useState } from 'react';
import SearchSelect from './SearchSelect';
import CompareBarChart from './CompareBarChart';
import './Comparison.css';

const Comparison = () => {
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  
  const [artistCriteria, setArtistCriteria] = useState('popularity');
  const [trackCriteria, setTrackCriteria] = useState('danceability');

  const artistComparisonCriteria = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'followers', label: 'Follower Number' },
  ];

  const trackComparisonCriteria = [
    { value: 'danceability', label: 'Danceability' },
    { value: 'valence', label: 'Valence' },
    { value: 'energy', label: 'Energy' },
    { value: 'acousticness', label: 'Acousticness' },
    { value: 'liveness', label: 'Liveness' },
    { value: 'loudness', label: 'Loudness' },
  ];

  return (
    <div className="comparison">
      <h2>Comparison between Artists and Songs</h2>
      
      <div className="comparison-controls">
        <div className="selection">
          <h3>Select Artists</h3>
          <SearchSelect
            type="artist"
            selectedItems={selectedArtists}
            setSelectedItems={setSelectedArtists}
            max={3}
          />
        </div>
        
        <div className="criteria">
          <h3>Select Comparison Criteria for Artists</h3>
          <select value={artistCriteria} onChange={(e) => setArtistCriteria(e.target.value)}>
            {artistComparisonCriteria.map((criterion) => (
              <option key={criterion.value} value={criterion.value}>
                {criterion.label}
              </option>
            ))}
          </select>
        </div>

        <div className="selection">
          <h3>Select Tracks</h3>
          <SearchSelect
            type="track"
            selectedItems={selectedTracks}
            setSelectedItems={setSelectedTracks}
            max={3}
          />
        </div>
        
        <div className="criteria">
          <h3>Select Comparison Criteria for Songs</h3>
          <select value={trackCriteria} onChange={(e) => setTrackCriteria(e.target.value)}>
            {trackComparisonCriteria.map((criterion) => (
              <option key={criterion.value} value={criterion.value}>
                {criterion.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="charts">
        {selectedArtists.length > 0 && (
          <CompareBarChart
            title="Artists Comparison"
            items={selectedArtists}
            type="artist"
            criteria={artistCriteria}
          />
        )}
        
        {selectedTracks.length > 0 && (
          <CompareBarChart
            title="Tracks Comparison"
            items={selectedTracks}
            type="track"
            criteria={trackCriteria}
          />
        )}
      </div>
    </div>
  );
};

export default Comparison;
