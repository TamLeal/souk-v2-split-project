import React from 'react';
import { ClipboardList } from 'lucide-react';

const HistoricoAcoes = ({
  historicoAcoes,
  mostrarHistorico,
  setMostrarHistorico,
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md mt-10 cursor-pointer transition-all duration-300 ease-in-out ${
        mostrarHistorico
          ? 'max-h-64 overflow-y-auto py-4'
          : 'max-h-14 py-2 flex items-center'
      }`}
      onClick={() => setMostrarHistorico(!mostrarHistorico)}
    >
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <ClipboardList className="mr-2" size={24} />
        Histórico de Ações
      </h2>
      {mostrarHistorico && historicoAcoes.length > 0 ? (
        <ul className="mt-4">
          {historicoAcoes.map((acao, index) => (
            <li
              key={index}
              className={`mb-2 p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm ${
                index === 0 ? 'mt-2' : ''
              }`}
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
