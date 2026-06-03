import { useState } from 'preact/hooks'
import './app.css'

export function App() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')

  const cadastrarCliente = () => {
    alert(
      `Cliente cadastrado!\n\nNome: ${nome}\nTelefone: ${telefone}\nEmail: ${email}`
    )

    setNome('')
    setTelefone('')
    setEmail('')
  }

  return (
    <div class="pagina">
      <header class="topo">
        <h1>💇‍♀️ Salão de Cláudia</h1>
        <p>Beleza, autoestima e cuidado para você.</p>
      </header>

      <section class="servicos">
        <h2>Nossos Serviços</h2>

        <div class="cards">
          <div class="card">
            <div class="emoji">💅</div>
            <h3>Manicure</h3>
            <button>Agendar</button>
          </div>

          <div class="card">
            <div class="emoji">💇‍♀️</div>
            <h3>Corte Feminino</h3>
            <button>Agendar</button>
          </div>

          <div class="card">
            <div class="emoji">🎨</div>
            <h3>Coloração</h3>
            <button>Agendar</button>
          </div>

          <div class="card">
            <div class="emoji">✨</div>
            <h3>Hidratação</h3>
            <button>Agendar</button>
          </div>
        </div>
      </section>

      <section class="cadastro">
        <h2>Cadastro de Cliente</h2>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onInput={(e) => setNome(e.target.value)}
        />

        <input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onInput={(e) => setTelefone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onInput={(e) => setEmail(e.target.value)}
        />

        <button class="btn-cadastrar" onClick={cadastrarCliente}>
          Cadastrar Cliente
        </button>
      </section>
    </div>
  )
}