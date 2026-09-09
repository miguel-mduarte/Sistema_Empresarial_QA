import Sidebar from './Sidebar'
import Topbar from './Topbar'

function AppLayout({ children, currentPage }) {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="page">
        <Topbar currentPage={currentPage} />
        {children}
      </div>
    </div>
  )
}

export default AppLayout
