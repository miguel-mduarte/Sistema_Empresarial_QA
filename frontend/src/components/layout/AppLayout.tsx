import type { ReactNode } from "react";
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function AppLayout({ children, currentPage }: { children: ReactNode; currentPage: string }) {
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
