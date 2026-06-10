import { useState, useEffect } from 'preact/hooks'
import './app.css'

export function App() {
  // Estados para as listas dinâmicas do banco de dados
  const [clientesDisponiveis, setClientesDisponiveis] = useState([]);
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
  
  // Estados para os valores selecionados no formulário
  const [clienteId, setClienteId] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [dataHora, setDataHora] = useState('');

  // BUSCA OS CLIENTES E OS SERVIÇOS DO JAVA ASSIM QUE O SITE ABRE
  useEffect(() => {
    // Busca Clientes
    fetch('http://localhost:8080/clientes')
      .then(res => res.json())
      .then(dados => setClientesDisponiveis(dados))
      .catch(err => console.error("Erro ao carregar clientes do banco:", err));

    // Busca Serviços Cadastrados (Manicure, Corte, etc.)
    fetch('http://localhost:8080/servicos')
      .then(res => res.json())
      .then(dados => setServicosDisponiveis(dados))
      .catch(err => console.error("Erro ao carregar serviços do banco:", err));
  }, []);

  // Descobre o nome do serviço pelo ID dinamicamente para mostrar no alerta de sucesso
  const obterNomeServico = (id) => {
    const servicoEncontrado = servicosDisponiveis.find(s => s.id === Number(id));
    return servicoEncontrado ? servicoEncontrado.nome : "Serviço Selecionado";
  };

  const handleAgendar = async (e) => {
    e.preventDefault();
    
    // Monta o JSON perfeitamente para o AgendamentoController do Java
    const dados = {
      dataHora: dataHora,
      cliente: { 
        id: Number(clienteId) 
      },
      servico: { 
        id: Number(servicoId) 
      }
    };

    try {
      const response = await fetch('http://localhost:8080/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (response.status === 409) {
        alert("⚠️ DATA E HORÁRIO JÁ PREENCHIDO!");
      } else if (response.ok) {
        const msg = `✅ AGENDAMENTO REALIZADO COM SUCESSO!\n\nServiço: ${obterNomeServico(servicoId)}\nData/Hora: ${new Date(dataHora).toLocaleString()}\n\nClique em OK para imprimir.`;
        alert(msg);
        window.print();
        
        // Limpa o formulário após o sucesso
        setClienteId('');
        setServicoId('');
        setDataHora('');
      } else {
        alert("Erro no servidor ao tentar salvar o agendamento.");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor. Garanta que o Spring Boot (Java) está rodando!");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🌸 Salão de Cláudia 🌸</h1>
        <p>Beleza, autoestima e cuidado para você.</p>
      </header>

      <main className="slide-container">
        <h2>Agendamento de Serviço</h2>
        <form onSubmit={handleAgendar} className="formulario">
          
          {/* SELECT DE CLIENTES (VINDO DO BANCO) */}
          <select value={clienteId} onChange={e => setClienteId(e.target.value)} required>
            <option value="">Selecione o Cliente...</option>
            {clientesDisponiveis.map(cli => (
              <option key={cli.id} value={cli.id}>
                {cli.nome} ({cli.telefone})
              </option>
            ))}
          </select>
          
          {/* SELECT DE SERVIÇOS (TOTALMENTE DINÂMICO VINDO DO BANCO) */}
          <select value={servicoId} onChange={e => setServicoId(e.target.value)} required>
            <option value="">Selecione o Serviço...</option>
            {servicosDisponiveis.map(serv => (
              <option key={serv.id} value={serv.id}>
                {serv.nome} - R$ {serv.preco.toFixed(2)}
              </option>
            ))}
          </select>

          {/* INPUT DE DATA E HORA */}
          <input type="datetime-local" value={dataHora} onInput={e => setDataHora(e.target.value)} required />
          
          <button type="submit">Finalizar Agendamento</button>
        </form>
      </main>

      <footer>
        <p>Maria Santos, Claudia Rodrigues, Jessica Xavier</p>
        <p>IFPE Afogados da Ingazeira | Disciplina: Web 2</p>
      </footer>
    </div>
  )
}