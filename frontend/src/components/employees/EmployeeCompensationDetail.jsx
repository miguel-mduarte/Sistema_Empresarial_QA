import { formatarMoeda, formatarNumero } from "../../utils/formatters";

function EmployeeCompensationDetail({ employee }) {
  if (employee.tipo === "Comissionado") {
    return (
      <span className="compensation-detail">
        {formatarMoeda(employee.valorVendas)} em vendas ·{" "}
        {formatarNumero(employee.percentualComissao)}%
      </span>
    );
  }

  if (employee.tipo === "Produção") {
    return (
      <span className="compensation-detail">
        {formatarNumero(employee.quantidadeProduzida)} un. ·{" "}
        {formatarMoeda(employee.valorPorUnidade)}/un.
      </span>
    );
  }

  return <span className="compensation-detail">Somente salário base</span>;
}

export default EmployeeCompensationDetail;
