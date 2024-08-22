import React from 'react';
import { Pause, Zap, Check } from 'lucide-react';

const PedidosOnHold = ({
  pedidosOnHold,
  moverParaEsquecidos,
  removerPedido,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-64 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Pause className="mr-2" size={24} />
        Pedidos em Espera
      </h2>
      {pedidosOnHold.length === 0 ? (
        <p className="text-gray-700">Nenhum pedido em espera.</p>
      ) : (
        <ul>
          {pedidosOnHold.map((pedido) => (
            <li
              key={pedido.id}
              className="mb-4 p-4 bg-blue-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">
                  {pedido.cliente} #{pedido.id}
                </h3>
                <div className="text-sm text-gray-500">
                  {new Date(pedido.horario).toLocaleTimeString()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => moverParaEsquecidos(pedido)}
                    className="p-2 rounded-full bg-yellow-300 hover:bg-yellow-400 transition-all duration-300"
                    title="Mover para Esquecidos"
                  >
                    <Zap size={20} />
                  </button>
                  <button
                    onClick={() => removerPedido(pedido.id)}
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
                    title="Pedido entregue"
                  >
                    <Check size={20} />
                  </button>
                </div>
              </div>
              <ul>
                {Object.entries(pedido.itens).map(
                  ([id, { nome, qtd, opcionais }]) => (
                    <li
                      key={id}
                      className="flex justify-between items-center mb-4"
                    >
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
                  )
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PedidosOnHold;