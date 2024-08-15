import React from 'react';
import {
  ShoppingCart,
  Edit3,
  Trash2,
  Plus,
  Minus,
  Send,
  AlertTriangle,
} from 'lucide-react';
import Opcionais from './Opcionais';

const Carrinho = ({
  carrinho,
  nomeCliente,
  setNomeCliente,
  pedidoPrioritario,
  togglePrioridade,
  editarQuantidade,
  editarOpcionais,
  removerItem,
  calcularTotal,
  enviarParaProducao,
  apagarPedido,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg mb-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center mr-6">
            <ShoppingCart className="mr-2" size={24} />
            Carrinho
          </h2>
          <input
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            className="ml-2 p-2 border border-gray-300 rounded-lg text-sm w-40 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do cliente"
          />
          <button
            onClick={togglePrioridade}
            className={`ml-4 p-2 rounded-full ${
              pedidoPrioritario
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-800'
            } hover:bg-red-500 hover:text-white transition-all duration-300`}
            title={
              pedidoPrioritario
                ? 'Remover prioridade'
                : 'Marcar como prioritário'
            }
          >
            <AlertTriangle size={24} />
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={apagarPedido}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
            title="Apagar Pedido"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </div>

      <ul className="mb-6">
        {Object.entries(carrinho).map(
          ([chave, { nome, preco, qtd, opcionais }]) => (
            <li key={chave} className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <span className="font-medium text-gray-800">{nome}</span>
              </div>
              <div className="flex-1 text-center flex items-center justify-center">
                <button
                  onClick={() => editarQuantidade(chave, -1)}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                >
                  <Minus size={20} />
                </button>
                <span className="mx-4 text-gray-700 font-semibold">
                  x {qtd}
                </span>
                <button
                  onClick={() => editarQuantidade(chave, 1)}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex-1 text-right">
                {opcionais.length > 0 && (
                  <span className="text-sm text-gray-600">
                    Opcionais: {opcionais.join(', ')}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => editarOpcionais(chave)}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={() => removerItem(chave)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          )
        )}
      </ul>
      <div className="text-right">
        <p className="font-medium text-gray-700">
          Total de itens: {Object.keys(carrinho).length}
        </p>
        <p className="text-2xl font-bold text-gray-800 mt-2">
          Total: R$ {calcularTotal(carrinho).toFixed(2)}
        </p>
        <div className="flex justify-end mt-6">
          <button
            onClick={enviarParaProducao}
            className="p-3 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300"
            disabled={Object.keys(carrinho).length === 0}
          >
            <span>Enviar Pedido</span>
            <Send size={24} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrinho;
