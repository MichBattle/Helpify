// src/components/Statistics/TopGenres.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './Statistics.css';

const TopGenres = ({ genres }) => {
  return (
    <div className="top-section">
      <h3>Top 5 Generi</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={genres} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="genre" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#1DB954" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopGenres;
