import { useSyncExternalStore } from 'react'
import AppLayout from '../components/layout/AppLayout'
import EmployeesPage from '../pages/EmployeesPage'
import OverviewPage from '../pages/OverviewPage'
import PayrollPage from '../pages/PayrollPage'

const routes = {
  inicio: {
    id: 'inicio',
    title: 'Visão geral',
    component: OverviewPage,
  },
  colaboradores: {
    id: 'colaboradores',
    title: 'Colaboradores',
    component: EmployeesPage,
  },
  folha: {
    id: 'folha',
    title: 'Folha de pagamento',
    component: PayrollPage,
  },
}

function subscribeToHash(callback) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function getHash() {
  return window.location.hash.slice(1) || 'folha'
}

function AppRouter() {
  const hash = useSyncExternalStore(subscribeToHash, getHash, () => 'folha')
  const activeRoute = routes[hash] ?? routes.folha
  const ActivePage = activeRoute.component

  return (
    <AppLayout activePage={activeRoute.id} currentPage={activeRoute.title}>
      <ActivePage />
    </AppLayout>
  )
}

export default AppRouter
