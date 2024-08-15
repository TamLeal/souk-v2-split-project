import React, { useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import Chart from 'chart.js/auto';

const ResumoEvento = ({
  historicoVendas,
  faturamentoTotal,
  exportarCSV,
  limparDadosPersistidos,
  produtos,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: produtos.map((p) => p.nome),
        datasets: [
          {
            label: 'Vendas',
            data: produtos.map((p) => historicoVendas[p.id] || 0),
            backgroundColor: produtos.map((p) =>
              p.cor.replace('bg-', '').replace('-', '')
            ),
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [historicoVendas, produtos]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Resumo do Evento</h2>
        <div className="flex space-x-2">
          <button
            onClick={exportarCSV}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
          >
            <Download size={20} />
          </button>
          <button
            onClick={limparDadosPersistidos}
            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-300"
          >
            Limpar Dados
          </button>
        </div>
      </div>
      <canvas
        id="vendasChart"
        ref={chartRef}
        className="mb-4"
        style={{ maxHeight: '200px', width: '100%' }}
      ></canvas>
      <div className="flex flex-wrap justify-between items-center">
        {produtos.map((produto) => (
          <div key={produto.id} className="flex items-center mr-4 mb-2">
            <span className="font-medium text-gray-700 mr-2">
              {produto.nome}:
            </span>
            <span className="bg-gray-200 px-3 py-1 rounded-lg text-gray-800">
              {historicoVendas[produto.id] || 0}
            </span>
          </div>
        ))}
        <div className="flex items-center mt-4">
          <span className="font-medium text-gray-700 mr-2">Faturamento:</span>
          <span className="bg-green-100 px-3 py-1 rounded-lg font-bold text-green-800">
            R$ {faturamentoTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResumoEvento;
