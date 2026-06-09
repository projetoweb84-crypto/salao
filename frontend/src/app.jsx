import { useState } from 'preact/hooks'
import './app.css'

export function App() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [servico, setServico] = useState('');
  const [dataHora, setDataHora] = useState('');

  const handleAgendar = async (e) => {
    e.preventDefault();
    
    // Ajustado para enviar exatamente a estrutura das tuas entidades Java
    const dados = {
      dataHora: dataHora, // O Java vai ler como LocalDateTime automaticamente
      cliente: { 
        nome: nome, 
        telefone: telefone, 
        email: email 
      },
      servico: { 
        nome: servico 
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
        const msg = `✅ CLIENTE CADASTRADO NO SERVIÇO!\n\nServiço: ${servico}\nData/Hora: ${new Date(dataHora).toLocaleString()}\n\nClique em OK para imprimir.`;
        alert(msg);
        window.print(); // Abre a janela de impressão nativa
      } else {
        alert("Erro no servidor ao tentar salvar o agendamento.");
      }
    } catch (err) {
      alert("Erro ao conectar com o servidor. Garanta que o Spring Boot (Java) está a rodar no IntelliJ!");
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
          <input type="text" placeholder="Nome do Cliente" value={nome} onInput={e => setNome(e.target.value)} required />
          <input type="text" placeholder="Telefone" value={telefone} onInput={e => setTelefone(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onInput={e => setEmail(e.target.value)} required />
          
          <select value={servico} onChange={e => setServico(e.target.value)} required>
            <option value="">Selecione o Serviço...</option>
            <option value="Manicure">Manicure</option>
            <option value="Corte Feminino">Corte Feminino</option>
            <option value="Coloração">Coloração</option>
            <option value="Hidratação">Hidratação</option>
          </select>

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