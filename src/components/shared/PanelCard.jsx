import React from 'react';
import FlipNumber from './FlipNumber';

const PanelCard = ({ icon, label, value, color }) => (
  <div
    className={`p-4 rounded-lg shadow-md bg-${color}-100 hover:bg-${color}-200 transition-all duration-300`}
  >
    <div className="flex items-center mb-2">
      {icon}
      <span className="ml-2 text-lg font-semibold text-gray-800">{label}</span>
    </div>
    <FlipNumber value={value} />
  </div>
);

export default PanelCard;
