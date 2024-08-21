import React from 'react';
import FlipNumber from './FlipNumber';
import { FaHamburger } from 'react-icons/fa';
import { GiFrenchFries } from 'react-icons/gi';

const getItemIcon = (name) => {
  switch (name.toLowerCase()) {
    case 'kft':
      return <FaHamburger className="mr-1" />;
    case 'marys':
    case 'falafel':
      return <FaHamburger className="mr-1" />;
    case 'fritas':
      return <GiFrenchFries className="mr-1" />;
    default:
      return null;
  }
};

const PanelCard = ({ icon, label, value, items = [], color }) => {
  let content;

  if (label === "Total de Itens") {
    // Ordem fixa dos produtos apenas para o card "Total de Itens"
    const produtos = ['KFT', 'Falafel', 'Marys', 'Fritas'];

    const itensFixos = produtos.map((produto) => {
      const item = items.find(item => item.name.toLowerCase() === produto.toLowerCase());
      return {
        name: produto,
        quantity: item ? item.quantity : 0,
      };
    });

    content = (
      <>
        <div className="text-3xl font-bold text-gray-800 mr-4">
          <FlipNumber value={value} />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-700">
          {itensFixos.map((item, index) => (
            <div key={index} className="flex items-center whitespace-nowrap">
              {getItemIcon(item.name)}
              <span>{item.name}: {item.quantity}</span>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    // Conteúdo padrão para os outros cards
    content = (
      <>
        <div className="text-3xl font-bold text-gray-800 mr-4">
          <FlipNumber value={value} />
        </div>
      </>
    );
  }

  return (
    <div className={`p-4 rounded-lg shadow-md bg-${color}-100 hover:bg-${color}-200 transition-all duration-300 flex flex-col justify-between h-full`}>
      <div className="flex items-center justify-center mb-2">
        {icon}
        <span className="ml-2 text-lg font-semibold text-gray-800">{label}</span>
      </div>
      <div className="flex items-center justify-center">
        {content}
      </div>
    </div>
  );
};

export default PanelCard;
