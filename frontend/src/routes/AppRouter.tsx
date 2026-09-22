import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import EmployeesPage from '../pages/EmployeesPage'
import OverviewPage from '../pages/OverviewPage'
import PayrollPage from '../pages/PayrollPage'
import IndividualPayrollPage from '../pages/IndividualPayrollPage'

const routes = [
  { path: '/folha/:matricula', title: 'Folha individual', component: IndividualPayrollPage },
  {
    path: '/',
    title: 'Visão geral',
    component: OverviewPage,
  },
  {
    path: '/colaboradores',
    title: 'Colaboradores',
    component: EmployeesPage,
  },
  {
    path: '/folha',
    title: 'Folha de pagamento',
    component: PayrollPage,
  },
]

function AppRouter() {
  return (
    <Routes>
      {routes.map(({ component: Page, path, title }) => (
        <Route
          element={(
            <AppLayout currentPage={title}>
              <Page />
            </AppLayout>
          )}
          key={path}
          path={path}
        />
      ))}
      <Route path="*" element={<Navigate to="/folha" replace />} />
    </Routes>
  )
}

export default AppRouter
