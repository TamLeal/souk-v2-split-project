import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Switch from 'react-switch';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

import Carrinho from './Carrinho/Carrinho';
import Produto from './Carrinho/Produto';
import Opcionais from './Carrinho/Opcionais';
import FilaPedidos from './Pedidos/FilaPedidos';
import PedidosOnHold from './Pedidos/PedidosOnHold';
import Esquecidos from './Pedidos/Esquecidos';
import ResumoEvento from './Painel/ResumoEvento';
import HistoricoDeProducao from './Painel/HistoricoDeProducao';
import PanelCard from './shared/PanelCard';

import { ChefHat, Clock, AlertTriangle, FaHamburger, CiFries, Settings, MoreVertical, User } from './shared/Icones';

// Dados iniciais
const opcionais = [
  { id: 1, nome: 'Sem alface' },
  { id: 2, nome: 'Sem maionese' },
  { id: 3, nome: 'Rúcula extra' },
  { id: 4, nome: 'Duplo burger' },
];

const produtos = [
  { id: 1, nome: 'KFT', preco: 15, cor: 'bg-red-200' },
  { id: 2, nome: 'Falafel', preco: 12, cor: 'bg-yellow-200' },
  { id: 3, nome: 'Marys', preco: 18, cor: 'bg-green-200' },
  { id: 4, nome: 'Fritas', preco: 8, cor: 'bg-yellow-100' },
];

const ControleCaixaExpedicao = () => {
  const [carrinho, setCarrinho] = useState({});
  const [opcionaisSelecionados, setOpcionaisSelecionados] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoItem, setEditandoItem] = useState(null);
  const [filaPedidos, setFilaPedidos] = useState(() => {
    const savedFilaPedidos = localStorage.getItem('filaPedidos');
    return savedFilaPedidos ? JSON.parse(savedFilaPedidos) : [];
  });
  const [pedidosOnHold, setPedidosOnHold] = useState([]);
  const [esquecidos, setEsquecidos] = useState([]);
  const [historicoVendas, setHistoricoVendas] = useState(() => {
    const savedHistoricoVendas = localStorage.getItem('historicoVendas');
    return savedHistoricoVendas ? JSON.parse(savedHistoricoVendas) : {};
  });
  const [numeroPedido, setNumeroPedido] = useState(() => {
    const savedNumeroPedido = localStorage.getItem('numeroPedido');
    return savedNumeroPedido ? parseInt(savedNumeroPedido, 10) : 1;
  });
  const [pedidoPrioritario, setPedidoPrioritario] = useState(false);
  const [nomeCliente, setNomeCliente] = useState('');
  const [contadorFila, setContadorFila] = useState({});
  const [mostrarResumo, setMostrarResumo] = useState(false);
  const [senha, setSenha] = useState('');
  const [senhaCorreta, setSenhaCorreta] = useState(false);
  const [mostrarInputSenha, setMostrarInputSenha] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [historicoAcoes, setHistoricoAcoes] = useState([]);
  const [historicoProducao, setHistoricoProducao] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [mostrarHistoricoProducao, setMostrarHistoricoProducao] = useState(false);
  const [configExpedicao, setConfigExpedicao] = useState({
    subidaAutomatica: false,
    tempoSubida: 15,
    bordaPiscante: false,
    tempoBordaPiscante: 20,
  });
  const [mostrarConfig, setMostrarConfig] = useState(false);

  // ... (useEffects e funções auxiliares virão nas próximas partes)

  useEffect(() => {
    atualizarContadorFila();
  }, [filaPedidos]);

  useEffect(() => {
    localStorage.setItem('filaPedidos', JSON.stringify(filaPedidos));
  }, [filaPedidos]);

  useEffect(() => {
    localStorage.setItem('historicoVendas', JSON.stringify(historicoVendas));
  }, [historicoVendas]);

  useEffect(() => {
    localStorage.setItem('numeroPedido', numeroPedido);
  }, [numeroPedido]);

  useEffect(() => {
    if (configExpedicao.subidaAutomatica) {
      const intervalo = setInterval(() => {
        verificarSubidaAutomatica();
      }, 60000);
      return () => clearInterval(intervalo);
    }
  }, [filaPedidos, configExpedicao]);

  // ... (funções auxiliares virão na próxima parte)

  const calcularFaturamentoTotal = () => {
    return Object.entries(historicoVendas).reduce((total, [id, qtd]) => {
      const produto = produtos.find((p) => p.id === parseInt(id.split('-')[0]));
      if (produto) {
        return total + produto.preco * qtd;
      } else {
        console.error(`Produto com ID ${id} não encontrado!`);
        return total;
      }
    }, 0);
  };

  const faturamentoTotal = calcularFaturamentoTotal();

  const verificarSubidaAutomatica = () => {
    const agora = new Date().getTime();
    const novosPedidos = [...filaPedidos];

    novosPedidos.forEach((pedido, index) => {
      const tempoNaFila = (agora - new Date(pedido.horario).getTime()) / 60000;
      if (tempoNaFila > configExpedicao.tempoSubida) {
        novosPedidos.splice(index, 1);
        novosPedidos.unshift({ ...pedido, subidaAutomatica: true });
      }
    });

    setFilaPedidos(novosPedidos);
  };

  const atualizarContadorFila = () => {
    const novoContador = {};
    filaPedidos.forEach((pedido) => {
      Object.entries(pedido.itens).forEach(([id, { nome, qtd }]) => {
        novoContador[nome] = (novoContador[nome] || 0) + qtd;
      });
    });
    setContadorFila(novoContador);
  };

  // ... (mais funções auxiliares virão na próxima parte)

  const adicionarAoCarrinho = (produto, opcionais) => {
    const chaveProduto = `${produto.id}-${opcionais.join('-')}`;

    setCarrinho((prev) => {
      if (editandoItem) {
        return {
          ...prev,
          [editandoItem]: {
            ...prev[editandoItem],
            opcionais: [...opcionais],
          },
        };
      } else {
        return {
          ...prev,
          [chaveProduto]: {
            ...produto,
            qtd: (prev[chaveProduto]?.qtd || 0) + 1,
            opcionais: [...opcionais],
          },
        };
      }
    });

    setMostrarModal(false);
    setEditandoItem(null);
  };

  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setOpcionaisSelecionados([]);
    setMostrarModal(true);
  };

  const editarQuantidade = (chave, delta) => {
    setCarrinho((prev) => {
      const itemExistente = prev[chave];
      if (!itemExistente) return prev;

      const novaQuantidade = Math.max(0, itemExistente.qtd + delta);
      if (novaQuantidade === 0) {
        const { [chave]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [chave]: { ...itemExistente, qtd: novaQuantidade } };
    });
  };

  const editarOpcionais = (chave) => {
    setEditandoItem(chave);
    const item = carrinho[chave];
    setProdutoSelecionado(item);
    setOpcionaisSelecionados(item.opcionais);
    setMostrarModal(true);
  };

  const removerItem = (chave) => {
    setCarrinho((prev) => {
      const { [chave]: _, ...rest } = prev;
      return rest;
    });
  };

  // ... (mais funções auxiliares virão na próxima parte)

  const apagarPedido = () => {
    if (window.confirm('Tem certeza de que deseja limpar todos os dados?')) {
      setCarrinho({});
      setPedidoPrioritario(false);
      setNomeCliente('');
    }
  };

  const enviarParaProducao = () => {
    if (!nomeCliente.trim()) {
      alert('Por favor, insira o nome do cliente.');
      return;
    }

    const novoPedido = {
      id: numeroPedido,
      cliente: nomeCliente,
      itens: carrinho,
      total: calcularTotal(carrinho),
      prioritario: pedidoPrioritario,
      horario: new Date().toISOString(),
    };

    setFilaPedidos((prev) => [...prev, novoPedido]);
    setNumeroPedido((prev) => prev + 1);

    const horarioAcao = new Date().toLocaleTimeString();
    setHistoricoAcoes((prev) => [
      ...prev,
      `Pedido ${nomeCliente} #${numeroPedido} enviado para produção (${horarioAcao})`,
    ]);

    setCarrinho({});
    setPedidoPrioritario(false);
    setNomeCliente('');
  };

  const calcularTotal = (itens) => {
    return Object.entries(itens).reduce((total, [id, { qtd }]) => {
      const produto = produtos.find((p) => p.id === parseInt(id.split('-')[0]));
      if (produto) {
        return total + produto.preco * qtd;
      } else {
        console.error(`Produto com ID ${id} não encontrado!`);
        return total;
      }
    }, 0);
  };

  // ... (mais funções auxiliares virão na próxima parte)

  const moverPedido = (sourceIndex, destinationIndex) => {
    const novosPedidos = Array.from(filaPedidos);
    const [movedPedido] = novosPedidos.splice(sourceIndex, 1);
    novosPedidos.splice(destinationIndex, 0, movedPedido);

    const horarioAcao = new Date().toLocaleTimeString();
    setFilaPedidos(novosPedidos);
    setHistoricoAcoes((prev) => [
      ...prev,
      `Pedido ${movedPedido.cliente} #${movedPedido.id} movido na fila (${horarioAcao})`,
    ]);
  };

  const togglePedidoOnHold = (pedido) => {
    const horarioAcao = new Date().toLocaleTimeString();
    if (filaPedidos.includes(pedido)) {
      setFilaPedidos((prev) => prev.filter((p) => p.id !== pedido.id));
      setPedidosOnHold((prev) => [...prev, pedido]);
    } else {
      setPedidosOnHold((prev) => prev.filter((p) => p.id !== pedido.id));
      setFilaPedidos((prev) => [...prev, pedido]);
    }
    setHistoricoAcoes((prev) => [
      ...prev,
      `Pedido ${pedido.cliente} #${pedido.id} colocado em espera (${horarioAcao})`,
    ]);
  };

  const moverParaEsquecidos = (pedido) => {
    const horarioAcao = new Date().toLocaleTimeString();
    setPedidosOnHold((prev) => prev.filter((p) => p.id !== pedido.id));
    setEsquecidos((prev) => [...prev, pedido]);
    setHistoricoAcoes((prev) => [
      ...prev,
      `Pedido ${pedido.cliente} #${pedido.id} movido para esquecidos (${horarioAcao})`,
    ]);
  };

  const removerPedido = (id) => {
    const horarioAcao = new Date().toLocaleTimeString();
    const pedidoRemovido =
      filaPedidos.find((pedido) => pedido.id === id) ||
      pedidosOnHold.find((pedido) => pedido.id === id) ||
      esquecidos.find((pedido) => pedido.id === id);

    if (pedidoRemovido) {
      // Adiciona o pedido ao histórico de produção
      setHistoricoProducao((prev) => [
        ...prev,
        {
          pedido: pedidoRemovido.id,
          cliente: pedidoRemovido.cliente,
          itens: pedidoRemovido.itens,
          horario: horarioAcao,
          total: pedidoRemovido.total,
        },
      ]);

      // Atualiza o histórico de vendas
      setHistoricoVendas((prev) => {
        const novoHistorico = { ...prev };
        Object.entries(pedidoRemovido.itens).forEach(([id, { qtd }]) => {
          const produtoId = parseInt(id.split('-')[0]);
          novoHistorico[produtoId] = (novoHistorico[produtoId] || 0) + qtd;
        });
        return novoHistorico;
      });

      // Remove o pedido das listas
      setFilaPedidos((prev) => prev.filter((pedido) => pedido.id !== id));
      setPedidosOnHold((prev) => prev.filter((pedido) => pedido.id !== id));
      setEsquecidos((prev) => prev.filter((pedido) => pedido.id !== id));

      setHistoricoAcoes((prev) => [
        ...prev,
        `Pedido ${pedidoRemovido.cliente} #${id} finalizado e adicionado ao histórico (${horarioAcao})`,
      ]);
    } else {
      console.error(`Pedido com ID ${id} não encontrado.`);
    }
  };

  const togglePrioridade = () => {
    const horarioAcao = new Date().toLocaleTimeString();
    setPedidoPrioritario(!pedidoPrioritario);
    setHistoricoAcoes((prev) => [
      ...prev,
      `Pedido marcado como ${
        pedidoPrioritario ? 'normal' : 'prioritário'
      } (${horarioAcao})`,
    ]);
  };

  const exportarCSV = () => {
    const dadosPedidos = gerarDadosCSV(filaPedidos);
    const consolidadoProdutos = gerarConsolidadoCSV(historicoVendas);

    const csvPedidos = Papa.unparse(dadosPedidos);
    const csvConsolidado = Papa.unparse(consolidadoProdutos);

    const csvCompleto = `${csvPedidos}\n\n--- Consolidado ---\n\n${csvConsolidado}`;

    const blob = new Blob([csvCompleto], { type: 'text/csv;charset=utf-8;' });
    saveAs(
      blob,
      `exportacao_pedidos_consolidado_${new Date().toISOString()}.csv`
    );
  };

  const gerarDadosCSV = (filaPedidos) => {
    return filaPedidos.map((pedido) => {
      const horario = new Date(pedido.horario).toLocaleTimeString();

      const produtoQuantidade = produtos.map((produto) => {
        const itemPedido = Object.values(pedido.itens).find(
          (item) => item.nome === produto.nome
        );
        return itemPedido ? itemPedido.qtd : 0;
      });

      return {
        numero_pedido: pedido.id,
        nome_cliente: pedido.cliente,
        horario_pedido: horario,
        ...produtoQuantidade.reduce((acc, qtd, index) => {
          acc[produtos[index].nome] = qtd;
          return acc;
        }, {}),
      };
    });
  };

  const gerarConsolidadoCSV = (historicoVendas) => {
    return Object.entries(historicoVendas).map(([id, qtd]) => {
      const produto = produtos.find((p) => p.id === parseInt(id));
      return {
        produto: produto.nome,
        quantidade: qtd,
        total_faturado: `R$ ${(produto.preco * qtd).toFixed(2)}`,
      };
    });
  };

  const limparDadosPersistidos = () => {
    if (window.confirm('Tem certeza de que deseja limpar todos os dados?')) {
      localStorage.removeItem('filaPedidos');
      localStorage.removeItem('historicoVendas');
      localStorage.removeItem('numeroPedido');
      setFilaPedidos([]);
      setHistoricoVendas({});
      setNumeroPedido(1);
      setHistoricoAcoes((prev) => [
        ...prev,
        `Todos os dados persistidos foram limpos (${new Date().toLocaleTimeString()})`,
      ]);
    }
  };

  const handleSenhaSubmit = (e) => {
    e.preventDefault();
    if (senha === 'lec123') {
      setSenhaCorreta(true);
      setMostrarResumo(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfigExpedicao((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value, 10),
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    moverPedido(result.source.index, result.destination.index);
  };

  const filteredPedidos = filaPedidos.filter((pedido) => {
    const matchSearch = pedido.cliente
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (filterStatus === 'todos') return matchSearch;
    if (filterStatus === 'prioritario')
      return matchSearch && pedido.prioritario;
    if (filterStatus === 'normal') return matchSearch && !pedido.prioritario;
    return true;
  });

  const handleToggleResumo = () => {
    if (mostrarResumo) {
      setSenhaCorreta(false);
      setMostrarResumo(false);
      setMostrarInputSenha(false);
      setSenha('');
    } else {
      setMostrarInputSenha(!mostrarInputSenha);
    }
  };

  return (
    <div className="relative p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Controle de Caixa
      </h1>

      <div className="flex justify-end mb-6 relative">
        <button
          onClick={handleToggleResumo}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
        >
          <Settings size={24} />
        </button>

        {mostrarInputSenha && (
          <div
            className={`absolute top-0 right-0 transition-all duration-300 transform ${
              mostrarInputSenha
                ? 'opacity-100 translate-x-[-70px]'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <form
              onSubmit={handleSenhaSubmit}
              className="flex items-center space-x-2"
            >
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                style={{ width: '150px' }}
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg text-sm"
              >
                Confirmar
              </button>
            </form>
          </div>
        )}
      </div>

      {mostrarResumo && senhaCorreta && (
        <ResumoEvento
          historicoVendas={historicoVendas}
          faturamentoTotal={faturamentoTotal}
          exportarCSV={exportarCSV}
          limparDadosPersistidos={limparDadosPersistidos}
          produtos={produtos}
          historicoAcoes={historicoAcoes}
          mostrarHistorico={mostrarHistorico}
          setMostrarHistorico={setMostrarHistorico}
        />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        {produtos.map((produto) => (
          <Produto
            key={produto.id}
            produto={produto}
            adicionarAoCarrinho={adicionarAoCarrinho}
            abrirModal={abrirModal}
          />
        ))}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-lg shadow-lg relative z-50 animate-fadeInUp">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Opcionais para {produtoSelecionado?.nome}
            </h2>
            <Opcionais
              opcionais={opcionais}
              opcionaisSelecionados={opcionaisSelecionados}
              setOpcionaisSelecionados={setOpcionaisSelecionados}
            />
            <button
              onClick={() =>
                adicionarAoCarrinho(produtoSelecionado, opcionaisSelecionados)
              }
              className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
            >
              Confirmar
            </button>
            <button
              onClick={() => setMostrarModal(false)}
              className="p-3 bg-red-500 text-white rounded-lg ml-4 hover:bg-red-600 transition-all duration-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <Carrinho
        carrinho={carrinho}
        nomeCliente={nomeCliente}
        setNomeCliente={setNomeCliente}
        pedidoPrioritario={pedidoPrioritario}
        togglePrioridade={togglePrioridade}
        editarQuantidade={editarQuantidade}
        editarOpcionais={editarOpcionais}
        removerItem={removerItem}
        calcularTotal={calcularTotal}
        enviarParaProducao={enviarParaProducao}
        apagarPedido={apagarPedido}
      />

      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Expedição
      </h1>

      <div className="relative bg-gray-200 p-6 rounded-lg shadow-md mb-8 transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-800">
              Painel de Produção
            </h2>
            <button
              onClick={() => setMostrarConfig(!mostrarConfig)}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300"
            >
              <MoreVertical size={24} />
            </button>
          </div>
          <div className="flex items-center space-x-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar pedidos..."
              className="p-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
        </div>
        {mostrarConfig && (
          <div className="absolute left-0 top-0 mt-16 ml-0 bg-white p-6 rounded-lg shadow-lg z-20 animate-fadeInUp">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Configurações de Expedição
            </h3>
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-6">
                <label className="flex items-center text-gray-800">
                  <Switch
                    onChange={() =>
                      setConfigExpedicao((prev) => ({
                        ...prev,
                        subidaAutomatica: !prev.subidaAutomatica,
                      }))
                    }
                    checked={configExpedicao.subidaAutomatica}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    handleDiameter={22}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={44}
                  />
                  <span className="ml-3">Subida automática após</span>
                </label>
                <input
                  type="number"
                  name="tempoSubida"
                  value={configExpedicao.tempoSubida}
                  onChange={handleConfigChange}
                  className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  style={{ width: '60px' }}
                  disabled={!configExpedicao.subidaAutomatica}
                />
                <span className="text-gray-800">minutos</span>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center text-gray-800">
                  <Switch
                    onChange={() =>
                      setConfigExpedicao((prev) => ({
                        ...prev,
                        bordaPiscante: !prev.bordaPiscante,
                      }))
                    }
                    checked={configExpedicao.bordaPiscante}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    handleDiameter={22}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={44}
                  />
                  <span className="ml-3">Borda piscante após</span>
                </label>
                <input
                  type="number"
                  name="tempoBordaPiscante"
                  value={configExpedicao.tempoBordaPiscante}
                  onChange={handleConfigChange}
                  className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  style={{ width: '60px' }}
                  disabled={!configExpedicao.bordaPiscante}
                />
                <span className="text-gray-800">minutos</span>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
          <PanelCard
            icon={<ChefHat size={24} />}
            label="Total de Itens"
            value={Object.keys(contadorFila).reduce(
              (total, key) => total + contadorFila[key],
              0
            )}
            items={Object.entries(contadorFila).map(([name, quantity]) => ({
              icon: name === 'KFT' ? <FaHamburger /> : name === 'Fritas' ? <CiFries /> : null,
              name,
              quantity,
            }))}
            color="blue"
          />

          <PanelCard
            icon={<AlertTriangle size={24} />}
            label="Pedidos Prioritários"
            value={filaPedidos.filter((p) => p.prioritario).length}
            color="red"
          />

          <PanelCard
            icon={<Clock size={24} />}
            label="Tempo Médio na Fila"
            value={
              filaPedidos.length > 0
                ? `${Math.round(
                    filaPedidos.reduce(
                      (total, pedido) =>
                        total +
                        (new Date().getTime() - new Date(pedido.horario).getTime()) /
                          60000,
                      0
                    ) / filaPedidos.length
                  )} min`
                : '0 min'
            }
            color="green"
          />


          {/* Novo Card para Contagem de Pessoas */}
          <PanelCard
            icon={<User size={24} />}  // Ícone de usuário para representar pessoas
            label="Pessoas na Fila"
            value={filaPedidos.length}  // Contagem de pessoas na fila
            color="yellow"  // Escolha a cor desejada
          />
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="filaPedidos" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="bg-white p-6 rounded-lg shadow-md mb-8 overflow-x-auto transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-6">
                <div className="flex items-center">
                  <ChefHat className="mr-2" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Fila de Pedidos</h2>
                </div>
              </div>
              <div className="flex space-x-4">
                {filteredPedidos.length === 0 ? (
                  <p className="text-gray-700">Nenhum pedido na fila.</p>
                ) : (
                  <FilaPedidos
                    filaPedidos={filteredPedidos}
                    moverPedido={moverPedido}
                    togglePedidoOnHold={togglePedidoOnHold}
                    removerPedido={removerPedido}
                    configExpedicao={configExpedicao}
                  />
                )}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <div className="grid grid-cols-2 gap-6">
        <PedidosOnHold
          pedidosOnHold={pedidosOnHold}
          moverParaEsquecidos={moverParaEsquecidos}
          removerPedido={removerPedido}
        />
        <Esquecidos esquecidos={esquecidos} removerPedido={removerPedido} />
      </div>

      <HistoricoDeProducao
        historicoProducao={historicoProducao}
        mostrarHistorico={mostrarHistoricoProducao}
        setMostrarHistorico={setMostrarHistoricoProducao}
      />
    </div>
  );
};

export default ControleCaixaExpedicao;
