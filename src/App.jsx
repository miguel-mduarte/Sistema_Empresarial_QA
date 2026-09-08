function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#inicio" aria-label="Folha Clara, início">
          <span className="brand-mark" aria-hidden="true">f.</span>
          <span>folha<strong>clara</strong></span>
        </a>

        <nav aria-label="Navegação principal">
          <p>ESPAÇO DE TRABALHO</p>
          <a className="nav-item active" href="#inicio" aria-current="page">Visão geral</a>
          <a className="nav-item" href="#colaboradores">Colaboradores</a>
          <a className="nav-item" href="#folha">Folha de pagamento</a>
        </nav>

        <div className="sidebar-note">
          <span aria-hidden="true" />
          <p>Um lugar para organizar<br /><strong>quem faz acontecer.</strong></p>
        </div>
      </aside>

      <div className="page">
        <header className="topbar">
          <span>Meu escritório <i>/</i> <strong>Visão geral</strong></span>
          <small>GESTÃO DE PAGAMENTOS</small>
        </header>

        <main id="inicio">
          <p className="eyebrow">PRIMEIRA ETAPA</p>
          <h1>A base está pronta.</h1>
          <p className="subtitle">
            O projeto React foi iniciado. Agora podemos construir o sistema aos poucos,
            mantendo cada regra clara e testável.
          </p>

          <section className="status-card" aria-labelledby="status-title">
            <div>
              <span className="status-icon" aria-hidden="true">✓</span>
              <div>
                <p className="card-label">ESTRUTURA INICIAL</p>
                <h2 id="status-title">React + Vite configurados</h2>
                <p>Uma fundação leve para avançarmos para o cadastro e a persistência em JSON.</p>
              </div>
            </div>
            <span className="status-badge">PRONTO</span>
          </section>

          <section className="next-step" aria-labelledby="next-title">
            <p className="card-label">PRÓXIMA ETAPA</p>
            <h2 id="next-title">Construir uma parte de cada vez.</h2>
            <p>Quando você indicar, começamos pelo primeiro fluxo funcional.</p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
