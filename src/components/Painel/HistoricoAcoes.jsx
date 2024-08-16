import React from 'react';
import { ClipboardList } from 'lucide-react';

const HistoricoAcoes = ({
  historicoAcoes,
  mostrarHistorico,
  setMostrarHistorico,
}) => {
  return (
    <div
      className={`${
        mostrarHistorico
          ? 'rounded-lg shadow-md mt-10 cursor-pointer transition-all duration-300 ease-in-out max-h-64 overflow-y-auto py-4 bg-white p-6'
          : 'cursor-pointer'
      }`}
      onClick={() => setMostrarHistorico(!mostrarHistorico)}
      style={{
        maxWidth: mostrarHistorico ? '50%' : 'fit-content', // O contêiner se adapta ao conteúdo quando fechado
      }}
    >
      <h2
        className="text-base font-medium text-gray-800 flex items-center"
        style={{
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Sombra ao redor do texto
          backgroundColor: '#f0f0f0', // Fundo cinza claro ao redor do texto
          padding: '0.5rem 1rem', // Espaçamento ao redor do texto
          borderRadius: '0.375rem', // Arredonda os cantos
          transition: 'box-shadow 0.3s ease-in-out', // Transição suave
        }}
      >
        <ClipboardList className="mr-2" size={16} />
        Histórico de Ações
      </h2>
      {mostrarHistorico && historicoAcoes.length > 0 ? (
        <ul className="mt-4">
          {historicoAcoes.map((acao, index) => (
            <li
              key={index}
              className="mb-2 p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
              style={{
                maxWidth: '100%', // Garante que os itens do histórico ocupem a largura do contêiner pai
              }}
            >
              {acao}
            </li>
          ))}
        </ul>
      ) : (
        mostrarHistorico && (
          <p className="text-sm text-gray-700 mt-4">Nenhuma ação registrada.</p>
        )
      )}
    </div>
  );
};

export default HistoricoAcoes;
