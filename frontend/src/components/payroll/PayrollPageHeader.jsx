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

      <button className="print-button" type="button" onClick={() => window.print()}>
        <PrintIcon />
        Imprimir folha
      </button>
    </section>
  )
}

export default PayrollPageHeader
