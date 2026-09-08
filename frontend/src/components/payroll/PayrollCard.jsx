import { DocumentIcon } from '../ui/Icons'
import PayrollTable from './PayrollTable'

function PayrollCard({ employees, period }) {
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

        <div className="record-count" aria-label={`${employees.length} colaboradores na folha`}>
          <strong>{employees.length}</strong>
          <span>colaboradores</span>
        </div>
      </header>

      <PayrollTable employees={employees} />

      <footer className="payroll-footer">
        <span className="status-dot" aria-hidden="true" />
        Dados demonstrativos locais — prontos para serem substituídos pela futura fonte JSON.
      </footer>
    </section>
  )
}

export default PayrollCard
