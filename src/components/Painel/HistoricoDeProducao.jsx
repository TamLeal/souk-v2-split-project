import React, { useState } from 'react';

const HistoricoDeProducao = ({ historicoProducao, mostrarHistorico, setMostrarHistorico }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Função auxiliar para converter string de data em objeto Date
  const parseDate = (dateString) => {
    // Tenta primeiro o formato ISO
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Se falhar, tenta um formato mais específico
      const [time, meridiem] = dateString.split(' ');
      const [hours, minutes, seconds] = time.split(':');
      date = new Date();
      date.setHours(
        meridiem === 'PM' ? parseInt(hours) + 12 : parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
    }
    return date;
  };

  // Ordenar o histórico de produção do mais recente para o mais antigo
  const historicoOrdenado = [...historicoProducao].sort((a, b) => {
    return parseDate(b.horario) - parseDate(a.horario);
  });

  const filteredHistorico = historicoOrdenado.filter(item =>
    item.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setMostrarHistorico(!mostrarHistorico)}
        className="p-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 rounded-lg"
      >
        Histórico de Produção
      </button>
      {mostrarHistorico && (
        <div className="absolute top-0 right-0 mt-2 bg-white p-4 rounded-lg shadow-lg z-20 w-full max-w-md h-96 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Produção</h2>
          <input
            type="text"
            placeholder="Buscar pelo nome do cliente..."
            className="mb-4 p-2 border rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul>
            {filteredHistorico.length > 0 ? (
              filteredHistorico.map((item, index) => (
                <li key={index} className="mb-2 p-2 border-b">
                  <strong>Pedido:</strong> {item.pedido} <br />
                  <strong>Cliente:</strong> {item.cliente} <br />
                  <strong>Horário:</strong> {item.horario} <br />
                  <strong>Total:</strong> R$ {item.total.toFixed(2)} <br />
                  <strong>Itens:</strong>
                  <ul className="ml-4">
                    {Object.entries(item.itens).map(([key, { nome, qtd, opcionais }]) => (
                      <li key={key}>
                        {nome} x{qtd}
                        {opcionais && opcionais.length > 0 && (
                          <span className="text-sm text-gray-600"> (Opcionais: {opcionais.join(', ')})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            ) : (
              <li className="text-gray-700">Nenhum histórico encontrado.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HistoricoDeProducao;