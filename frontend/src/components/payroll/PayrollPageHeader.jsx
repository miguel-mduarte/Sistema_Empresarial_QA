import { PrintIcon } from '../ui/Icons'

function PayrollPageHeader() {
  return (
    <section className="page-heading" aria-labelledby="page-title">
      <div>
        <p className="eyebrow">FECHAMENTO MENSAL</p>
        <h1 id="page-title">Folha de pagamento</h1>
        <p className="subtitle">
          Consulte os salários finais de todos os colaboradores em uma visão clara e organizada.
        </p>
      </div>

      <div className="payroll-heading-actions">
        <div className="requirement-chip" aria-label="Requisitos contemplados">
          <span>RF007</span>
          <span>RF008</span>
        </div>
        <button className="print-button" type="button" onClick={() => window.print()}>
          <PrintIcon />
          Imprimir folha
        </button>
      </div>
    </section>
  )
}

export default PayrollPageHeader
