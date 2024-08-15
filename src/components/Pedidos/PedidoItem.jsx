import React from 'react';

const PedidoItem = ({ id, nome, qtd, opcionais }) => {
  return (
    <li className="flex justify-between items-center mb-4">
      <div className="flex-1">
        <span className="text-gray-800 font-medium">
          {nome} x {qtd}
        </span>
      </div>
      {opcionais && opcionais.length > 0 && (
        <div className="flex-1 text-right text-sm text-gray-600">
          Opcionais: {opcionais.join(', ')}
        </div>
      )}
    </li>
  );
};

export default PedidoItem;
