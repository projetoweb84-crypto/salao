import { useState, useEffect } from 'preact/hooks'
import './app.css'

export function App() {
  // Controla qual aba administrativa está visível: 'novo-cliente', 'cliente-antigo' ou 'servicos'
  const [telaAtiva, setTelaAtiva] = useState('novo-cliente')

  // Listas que vêm do Banco de Dados
  const [clientesDisponiveis, setClientesDisponiveis] = useState([])
  const [servicosDisponiveis, setServicosDisponiveis] = useState([])

  // --- ESTADOS: ABA 1 (NOVO CLIENTE + AGENDAMENTO) ---
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [servicoIdNovo, setServicoIdNovo] = useState('')
  const [dataHoraNova, setDataHoraNova] = useState('')

  // --- ESTADOS: ABA 2 (CLIENTE EXISTENTE + AGENDAMENTO) ---
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState('')
  const [servicoIdAntigo, setServicoIdAntigo] = useState('')
  const [dataHoraAntiga, setDataHoraAntiga] = useState('')

  // --- ESTADOS: ABA 3 (CADASTRAR SERVIÇOS) ---
  const [novoNomeServico, setNovoNomeServico] = useState('')
  const [novoPrecoServico, setNovoPrecoServico] = useState('')
  const [novaDuracaoServico, setNovaDuracaoServico] = useState('')

  // Funções para carregar dados do banco de dados Java
  const carregarDadosDoBanco = () => {
    fetch('http://localhost:8080/clientes')
      .then(res => res.json())
      .then(dados => setClientesDisponiveis(dados))
      .catch(err => console.error("Erro ao carregar clientes:", err));

    fetch('http://localhost:8080/servicos')
      .then(res => res.json())
      .then(dados => setServicosDisponiveis(dados))
      .catch(err => console.error("Erro ao carregar serviços:", err));
  }

  useEffect(() => {
    carregarDadosDoBanco();
  }, []);

  // 1. SALVAR NOVO CLIENTE E JÁ AGENDAR
  const salvarNovoEAgendar = async (e) => {
    e.preventDefault();
    try {
      // Cria o cliente primeiro
      const clienteRes = await fetch('http://localhost:8080/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, telefone })
      });

      if (!clienteRes.ok) return alert("Erro ao salvar cliente.");
      const clienteSalvo = await clienteRes.json();

      // Envia o agendamento usando o ID do cliente recém-criado
      const agendamentoDados = {
        dataHora: dataHoraNova,
        cliente: { id: clienteSalvo.id },
        servico: { id: Number(servicoIdNovo) }
      };

      const agendamentoRes = await fetch('http://localhost:8080/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agendamentoDados)
      });

      if (agendamentoRes.status === 409) {
        alert("⚠️ HORÁRIO JÁ PREENCHIDO!");
      } else if (agendamentoRes.ok) {
        alert(`✅ Sucesso! Cliente ${clienteSalvo.nome} cadastrado e agendado.`);
        setNome(''); setTelefone(''); setServicoIdNovo(''); setDataHoraNova('');
        carregarDadosDoBanco(); // Atualiza a lista de clientes do select
      }
    } catch (err) {
      alert("Erro ao conectar com o Java.");
    }
  };

  // 2. AGENDAR PARA UM CLIENTE QUE JÁ EXISTE NO BANCO
  const agendarClienteExistente = async (e) => {
    e.preventDefault();
    
    const agendamentoDados = {
      dataHora: dataHoraAntiga,
      cliente: { id: Number(clienteSelecionadoId) },
      servico: { id: Number(servicoIdAntigo) }
    };

    try {
      const response = await fetch('http://localhost:8080/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agendamentoDados)
      });

      if (response.status === 409) {
        alert("⚠️ HORÁRIO JÁ PREENCHIDO!");
      } else if (response.ok) {
        alert("✅ Agendamento do cliente cadastrado realizado com sucesso!");
        setClienteSelecionadoId(''); setServicoIdAntigo(''); setDataHoraAntiga('');
      } else {
        alert("Erro no servidor ao tentar realizar o agendamento.");
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    }
  };

  // 3. CADASTRAR UM NOVO SERVIÇO NO BANCO
  const cadastrarNovoServico = async (e) => {
    e.preventDefault();
    const dadosServico = {
      nome: novoNomeServico,
      preco: Number(novoPrecoServico),
      duracaoMinutos: Number(novaDuracaoServico)
    };

    try {
      const response = await fetch('http://localhost:8080/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosServico)
      });

      if (response.ok) {
        alert(`✅ Serviço "${novoNomeServico}" adicionado!`);
        setNovoNomeServico(''); setNovoPrecoServico(''); setNovaDuracaoServico('');
        carregarDadosDoBanco(); // Atualiza os serviços nos selects
      }
    } catch (err) {
      alert("Erro ao conectar com o Java.");
    }
  };

  return (
    <div class="pagina">
      <header class="topo">
        <h1>💇‍♀️ Salão de Cláudia</h1>
        <p>Painel Administrativo do Sistema</p>
        
        {/* NAVEGAÇÃO ENTRE AS TRES ABAS ADMINISTRATIVAS */}
        <nav class="menu-abas">
          <button 
            class={telaAtiva === 'novo-cliente' ? 'aba-ativa' : ''} 
            onClick={() => setTelaAtiva('novo-cliente')}
          >
            👤 Novo Cliente + Agendar
          </button>
          <button 
            class={telaAtiva === 'cliente-antigo' ? 'aba-ativa' : ''} 
            onClick={() => setTelaAtiva('cliente-antigo')}
          >
            📋 Cliente Cadastrado + Agendar
          </button>
          <button 
            class={telaAtiva === 'servicos' ? 'aba-ativa' : ''} 
            onClick={() => setTelaAtiva('servicos')}
          >
            ➕ Adicionar Serviços
          </button>
        </nav>
      </header>

      <main class="conteudo-aba">
        
        {/* ================= TELA 1: NOVO CLIENTE + AGENDAMENTO ================= */}
        {telaAtiva === 'novo-cliente' && (
          <section class="cadastro">
            <h2>Cadastrar Novo Cliente e Agendar</h2>
            <form onSubmit={salvarNovoEAgendar} className="formulario">
              <input type="text" placeholder="Nome Completo" value={nome} onInput={e => setNome(e.target.value)} required />
              <input type="text" placeholder="Telefone" value={telefone} onInput={e => setTelefone(e.target.value)} required />
              
              <select value={servicoIdNovo} onChange={e => setServicoIdNovo(e.target.value)} required>
                <option value="">Escolha o serviço...</option>
                {servicosDisponiveis.map(s => (
                  <option key={s.id} value={s.id}>{s.nome} — R$ {s.preco.toFixed(2)}</option>
                ))}
              </select>

              <input type="datetime-local" value={dataHoraNova} onInput={e => setDataHoraNova(e.target.value)} required />
              <button type="submit" class="btn-cadastrar">Cadastrar e Criar Agendamento</button>
            </form>
          </section>
        )}

        {/* ================= TELA 2: CLIENTE JÁ CADASTRADO + AGENDAMENTO ================= */}
        {telaAtiva === 'cliente-antigo' && (
          <section class="cadastro">
            <h2>Agendar para Cliente Existente</h2>
            <form onSubmit={agendarClienteExistente} className="formulario">
              
              {/* Menu de seleção contendo os clientes vindos do banco de dados */}
              <select value={clienteSelecionadoId} onChange={e => setClienteSelecionadoId(e.target.value)} required>
                <option value="">Selecione o Cliente Cadastrado...</option>
                {clientesDisponiveis.map(cli => (
                  <option key={cli.id} value={cli.id}>{cli.nome} ({cli.telefone})</option>
                ))}
              </select>

              <select value={servicoIdAntigo} onChange={e => setServicoIdAntigo(e.target.value)} required>
                <option value="">Escolha o serviço...</option>
                {servicosDisponiveis.map(s => (
                  <option key={s.id} value={s.id}>{s.nome} — R$ {s.preco.toFixed(2)}</option>
                ))}
              </select>

              <input type="datetime-local" value={dataHoraAntiga} onInput={e => setDataHoraAntiga(e.target.value)} required />
              <button type="submit" class="btn-cadastrar" style={{backgroundColor: '#7b1fa2'}}>Confirmar Agendamento</button>
            </form>
          </section>
        )}

        {/* ================= TELA 3: CADASTRAR NOVOS SERVIÇOS ================= */}
        {telaAtiva === 'servicos' && (
          <section class="cadastro">
            <h2>Cadastrar Novo Serviço no Salão</h2>
            <form onSubmit={cadastrarNovoServico} className="formulario">
              <input type="text" placeholder="Nome do Serviço" value={novoNomeServico} onInput={e => setNovoNomeServico(e.target.value)} required />
              <input type="number" step="0.01" placeholder="Preço" value={novoPrecoServico} onInput={e => setNovoPrecoServico(e.target.value)} required />
              <input type="number" placeholder="Duração em Minutos" value={novaDuracaoServico} onInput={e => setNovaDuracaoServico(e.target.value)} required />
              <button type="submit" class="btn-cadastrar" style={{backgroundColor: '#4CAF50'}}>Salvar Serviço no Banco</button>
            </form>
          </section>
        )}

      </main>

      <footer>
        <p>Maria Santos, Claudia Rodrigues, Jessica Xavier</p>
        <p>IFPE Afogados da Ingazeira | Disciplina: Web 2</p>
      </footer>
    </div>
  )
}