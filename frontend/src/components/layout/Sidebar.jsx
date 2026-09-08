const navigationItems = [
  { id: 'inicio', label: 'Visão geral' },
  { id: 'colaboradores', label: 'Colaboradores' },
  { id: 'folha', label: 'Folha de pagamento' },
]

function Sidebar({ activePage }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#folha" aria-label="Folha Clara, folha de pagamento">
        <span className="brand-mark" aria-hidden="true">f.</span>
        <span>folha<strong>clara</strong></span>
      </a>

      <nav aria-label="Navegação principal">
        <p>ESPAÇO DE TRABALHO</p>
        {navigationItems.map((item) => (
          <a
            className={`nav-item${item.id === activePage ? ' active' : ''}`}
            href={`#${item.id}`}
            aria-current={item.id === activePage ? 'page' : undefined}
            key={item.id}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-note">
        <span aria-hidden="true" />
        <p>Um lugar para organizar<br /><strong>quem faz acontecer.</strong></p>
      </div>
    </aside>
  )
}

export default Sidebar
