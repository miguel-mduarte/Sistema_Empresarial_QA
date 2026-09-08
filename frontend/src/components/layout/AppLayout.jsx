import Sidebar from './Sidebar'
import Topbar from './Topbar'

function AppLayout({ activePage, children, currentPage }) {
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} />

      <div className="page">
        <Topbar currentPage={currentPage} />
        {children}
      </div>
    </div>
  )
}

export default AppLayout
