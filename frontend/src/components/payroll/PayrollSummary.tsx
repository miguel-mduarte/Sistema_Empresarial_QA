import { formatarMoeda } from "../../utils/formatters";

function PayrollSummary({ total }: { total: number }) {
  return (
    <footer className="payroll-summary">
      <div className="payroll-source">
        <span className="status-dot" aria-hidden="true" />
        Valores calculados e consolidados pela API.
      </div>
      <div className="payroll-total">
        <span>Custo total da folha</span>
        <strong>{formatarMoeda(total)}</strong>
      </div>
    </footer>
  );
}

export default PayrollSummary;
