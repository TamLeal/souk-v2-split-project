import React from 'react';
import { Edit3 } from 'lucide-react';
import { GiHamburger } from 'react-icons/gi';
import { FaHamburger } from 'react-icons/fa';
import { PiHamburgerFill } from 'react-icons/pi';
import { CiFries } from 'react-icons/ci';

const Produto = ({ produto, adicionarAoCarrinho, abrirModal }) => {
  const getIcon = (nome) => {
    switch (nome) {
      case 'KFT':
        return <GiHamburger className="mr-2" />;
      case 'Falafel':
        return <FaHamburger className="mr-2" />;
      case 'Marys':
        return (
          <PiHamburgerFill className="mr-2" style={{ fontSize: '1.2rem' }} />
        );
      case 'Fritas':
        return <CiFries className="mr-2" style={{ fontSize: '1.4rem' }} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`${produto.cor} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left border border-gray-300 cursor-pointer`}
      onClick={() => adicionarAoCarrinho(produto, [])}
    >
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        {getIcon(produto.nome)}
        {produto.nome}
      </h3>
      <p className="text-gray-600 text-sm mt-1">
        R$ {produto.preco.toFixed(2)}
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          abrirModal(produto);
        }}
        className="mt-3 p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-all duration-300"
      >
        <Edit3 size={18} />
      </button>
    </div>
  );
};

export default Produto;
