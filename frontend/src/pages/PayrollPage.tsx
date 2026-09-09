import PayrollCard from '../components/payroll/PayrollCard'
import PayrollFeedback from '../components/payroll/PayrollFeedback'
import PayrollPageHeader from '../components/payroll/PayrollPageHeader'
import useFolhaPagamento from '../hooks/useFolhaPagamento'
import { formatarCompetencia } from '../utils/formatters'

function PayrollPage() {
  const { carregarFolha, folha, isLoading, loadError } = useFolhaPagamento()

  return (
    <main id="folha">
      <PayrollPageHeader />
      {isLoading || loadError ? (
        <PayrollFeedback
          isLoading={isLoading}
          loadError={loadError}
          onRetry={carregarFolha}
        />
      ) : (
        <PayrollCard
          payroll={folha}
          period={formatarCompetencia(new Date())}
        />
      )}
    </main>
  )
}

export default PayrollPage
