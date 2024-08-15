import React from 'react';
import FlipNumber from './FlipNumber';
import { FaHamburger } from 'react-icons/fa';
import { GiTacos, GiFrenchFries } from 'react-icons/gi';

const getItemIcon = (name) => {
  switch (name.toLowerCase()) {
    case 'kft':
    case 'marys':
    case 'falafel':
      return <FaHamburger className="mr-1" />;
    case 'fritas':
      return <GiFrenchFries className="mr-1" />;
    default:
      return null;
  }
};

const PanelCard = ({ icon, label, value, items, color }) => (
  <div className={`p-4 rounded-lg shadow-md bg-${color}-100 hover:bg-${color}-200 transition-all duration-300 flex flex-col justify-between h-full`}>
    <div className="flex items-center justify-center mb-2">
      {icon}
      <span className="ml-2 text-lg font-semibold text-gray-800">{label}</span>
    </div>
    <div className="flex items-center justify-center">
      {items ? (
        <>
          <div className="text-3xl font-bold text-gray-800 mr-4">
            <FlipNumber value={value} />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-700">
            {items.map((item, index) => (
              <div key={index} className="flex items-center whitespace-nowrap">
                {getItemIcon(item.name)}
                <span>{item.name}: {item.quantity}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-3xl font-bold text-gray-800">
          <FlipNumber value={value} />
        </div>
      )}
    </div>
  </div>
);

export default PanelCard;