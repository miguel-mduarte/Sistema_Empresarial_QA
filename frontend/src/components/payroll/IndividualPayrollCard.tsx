import type { PayrollItem } from "../../types/colaborador";
import { formatarMoeda } from "../../utils/formatters";

export default function IndividualPayrollCard({ employee }: { employee: PayrollItem }) {
  return (
    <section className="payroll-card individual-payroll" aria-labelledby="individual-title">
      <p className="card-label">FOLHA INDIVIDUAL</p>
      <h2 id="individual-title">{employee.nome}</h2>
      <dl className="individual-fields">
        <div><dt>Matrícula</dt><dd>{employee.matricula}</dd></div>
        <div><dt>Tipo de colaborador</dt><dd>{employee.tipo}</dd></div>
        <div><dt>Salário base</dt><dd>{formatarMoeda(employee.salarioBase)}</dd></div>
        <div><dt>Adicionais</dt><dd>{formatarMoeda(employee.adicional)}</dd></div>
        <div><dt>Salário final</dt><dd>{formatarMoeda(employee.salarioFinal)}</dd></div>
      </dl>
      <p>Valores calculados a partir do cadastro atual. Este relatório não representa um histórico mensal.</p>
    </section>
  );
}
