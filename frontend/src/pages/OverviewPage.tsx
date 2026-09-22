import { Link } from 'react-router-dom'
import useFolhaPagamento from '../hooks/useFolhaPagamento'
import PayrollFeedback from '../components/payroll/PayrollFeedback'
import PayrollCategorySummary from '../components/payroll/PayrollCategorySummary'
import PayrollSummary from '../components/payroll/PayrollSummary'

function OverviewPage() {
  const { folha, isLoading, loadError, carregarFolha } = useFolhaPagamento()
  return (
    <main id="inicio">
      <h1>Visão geral</h1>
      <p>Acompanhe o cadastro atual e os custos da folha de pagamento.</p>
      {isLoading || loadError ? (
        <PayrollFeedback isLoading={isLoading} loadError={loadError} onRetry={carregarFolha} />
      ) : (
        <section className="payroll-card">
          <div className="category-summary">
            <h2>{folha.resumo.quantidadeColaboradores} colaboradores cadastrados</h2>
            <p><Link to="/colaboradores">Gerenciar colaboradores</Link> · <Link to="/folha">Abrir relatórios</Link></p>
          </div>
          <PayrollSummary total={folha.resumo.totalFolha} />
          <PayrollCategorySummary categories={folha.resumo.totaisPorCategoria} />
        </section>
      )}
    </main>
  )
}

export default OverviewPage
