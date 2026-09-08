import PayrollCard from '../components/payroll/PayrollCard'
import PayrollPageHeader from '../components/payroll/PayrollPageHeader'
import { folhaPagamento } from '../data/folhaPagamento'
import { formatarCompetencia } from '../utils/formatters'

function PayrollPage() {
  return (
    <main id="folha">
      <PayrollPageHeader />
      <PayrollCard employees={folhaPagamento} period={formatarCompetencia(new Date())} />
    </main>
  )
}

export default PayrollPage
