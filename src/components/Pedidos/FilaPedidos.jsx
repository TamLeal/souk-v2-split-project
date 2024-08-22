import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ArrowUp, ArrowDown, Pause, Check, Clock } from 'lucide-react';

const FilaPedidos = ({
  filaPedidos,
  moverPedido,
  togglePedidoOnHold,
  removerPedido,
  configExpedicao,
}) => {
  return (
    <>
      {filaPedidos.map((pedido, index) => {
        const tempoNaFila =
          (new Date().getTime() - new Date(pedido.horario).getTime()) / 60000;
        const isBordaPiscante =
          configExpedicao.bordaPiscante &&
          tempoNaFila > configExpedicao.tempoBordaPiscante;
        return (
          <Draggable key={pedido.id} draggableId={`${pedido.id}`} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`flex-shrink-0 w-80 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                  pedido.prioritario ? 'bg-red-100' : 'bg-white'
                } ${
                  isBordaPiscante ? 'animate-pulse border-4 border-red-500' : ''
                }`}
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
                      onClick={() => moverPedido(index, -1)}
                      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                      disabled={index === 0}
                    >
                      <ArrowUp size={20} />
                    </button>
                    <button
                      onClick={() => moverPedido(index, 1)}
                      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                      disabled={index === filaPedidos.length - 1}
                    >
                      <ArrowDown size={20} />
                    </button>
                    <button
                      onClick={() => togglePedidoOnHold(pedido)}
                      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                      title="Colocar em espera"
                    >
                      <Pause size={20} />
                    </button>
                    <button
                      onClick={() => removerPedido(pedido.id)}
                      className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
                      title="Pedido entregue"
                    >
                      <Check size={20} />
                    </button>
                    {pedido.subidaAutomatica && (
                      <Clock className="text-red-500" size={20} />
                    )}
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
              </div>
            )}
          </Draggable>
        );
      })}
    </>
  );
};

export default FilaPedidos;