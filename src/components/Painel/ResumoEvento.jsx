import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import HistoricoAcoes from './HistoricoAcoes';

const ResumoEvento = ({
  historicoVendas,
  faturamentoTotal,
  exportarCSV,
  limparDadosPersistidos,
  produtos,
  historicoAcoes,
  mostrarHistorico,
  setMostrarHistorico,
}) => {
  const [metas, setMetas] = useState(() => {
    const metasSalvas = localStorage.getItem('metas');
    return metasSalvas ? JSON.parse(metasSalvas) : {};
  });

  useEffect(() => {
    localStorage.setItem('metas', JSON.stringify(metas));
  }, [metas]);

  const handleMetaChange = (produtoId, valor) => {
    setMetas(prevMetas => ({
      ...prevMetas,
      [produtoId]: parseInt(valor) || 0
    }));
  };

  const getKFTColor = (percentagem) => {
    if (percentagem < 50) return '#EF4444'; // vermelho
    if (percentagem < 85) return '#FBBF24'; // amarelo
    return '#10B981'; // verde
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg mb-8">
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {produtos.map((produto) => {
          const vendas = historicoVendas[produto.id] || 0;
          const meta = metas[produto.id] || 100;
          const percentagem = Math.min((vendas / meta) * 100, 100);
          
          const pathColor = produto.nome === 'KFT' 
            ? getKFTColor(percentagem)
            : produto.cor.replace('bg-', '').replace('-500', '');

          return (
            <div key={produto.id} className="flex flex-col items-center">
              <span className="mb-2 font-medium text-gray-700">{produto.nome}</span>
              <div style={{ width: '100px', height: '100px' }}>
                <CircularProgressbar
                  value={percentagem}
                  styles={buildStyles({
                    pathColor: pathColor,
                    textColor: '#333',
                  })}
                  text={(
                    <tspan>
                      <tspan x="50" y="45" textAnchor="middle" fontSize="22px" fontWeight="bold">
                        {vendas}
                      </tspan>
                      <tspan x="50" y="70" textAnchor="middle" fontSize="14px">
                        {percentagem.toFixed(0)}%
                      </tspan>
                    </tspan>
                  )}
                />
              </div>
              <div className="flex flex-col items-center mt-2">
                <input
                  type="number"
                  value={meta}
                  onChange={(e) => handleMetaChange(produto.id, e.target.value)}
                  className="p-1 w-20 text-center border rounded"
                  placeholder="Meta"
                />
                <label className="mt-1 text-xs text-gray-500">
                  Meta {produto.nome}
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end mt-4">
        <span className="font-medium text-gray-700 mr-2">Faturamento:</span>
        <span className="bg-green-100 px-3 py-1 rounded-lg font-bold text-green-800">
          R$ {faturamentoTotal.toFixed(2)}
        </span>
      </div>

      <div className="mt-6">
        <HistoricoAcoes
          historicoAcoes={historicoAcoes}
          mostrarHistorico={mostrarHistorico}
          setMostrarHistorico={setMostrarHistorico}
        />
      </div>
    </div>
  );
};

export default ResumoEvento;