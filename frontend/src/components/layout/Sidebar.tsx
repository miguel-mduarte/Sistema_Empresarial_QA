import { Link, NavLink } from 'react-router-dom'

const navigationItems = [
  { id: 'inicio', label: 'Visão geral', path: '/' },
  { id: 'colaboradores', label: 'Colaboradores', path: '/colaboradores' },
  { id: 'folha', label: 'Folha de pagamento', path: '/folha' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <Link className="brand" to="/folha" aria-label="Folha Clara, folha de pagamento">
        <span className="brand-mark" aria-hidden="true">f.</span>
        <span>folha<strong>clara</strong></span>
      </Link>

      <nav aria-label="Navegação principal">
        <p>ESPAÇO DE TRABALHO</p>
        {navigationItems.map((item) => (
          <NavLink
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            end={item.path === '/'}
            to={item.path}
            key={item.id}
          >
            {item.label}
          </NavLink>
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
