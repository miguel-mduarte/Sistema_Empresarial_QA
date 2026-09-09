import { DocumentIcon } from '../ui/Icons'
import PayrollTable from './PayrollTable'
import PayrollSummary from './PayrollSummary'

function PayrollCard({ payroll, period }) {
  const { itens, resumo } = payroll

  return (
    <section className="payroll-card" aria-labelledby="payroll-title">
      <header className="payroll-header">
        <div className="payroll-title-group">
          <span className="document-icon"><DocumentIcon /></span>
          <div>
            <p className="card-label">FOLHA CONSOLIDADA</p>
            <h2 id="payroll-title">{period}</h2>
          </div>
        </div>

        <div className="record-count" aria-label={`${resumo.quantidadeColaboradores} colaboradores na folha`}>
          <strong>{resumo.quantidadeColaboradores}</strong>
          <span>colaboradores</span>
        </div>
      </header>

      {itens.length > 0 ? (
        <PayrollTable employees={itens} />
      ) : (
        <div className="payroll-empty">
          <span aria-hidden="true">0</span>
          <div>
            <strong>Folha sem colaboradores</strong>
            <p>Cadastre colaboradores para gerar os primeiros lançamentos.</p>
          </div>
        </div>
      )}

      <PayrollSummary total={resumo.totalFolha} />
    </section>
  )
}

export default PayrollCard
