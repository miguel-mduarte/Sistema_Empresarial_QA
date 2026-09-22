import type { PayrollItem } from "../../types/colaborador";
import { Link } from "react-router-dom";
import { formatarMoeda } from '../../utils/formatters'
import EmployeeTypeBadge from '../employees/EmployeeTypeBadge'

function PayrollTable({ employees }: { employees: PayrollItem[] }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th scope="col">Matrícula</th>
            <th scope="col">Nome</th>
            <th scope="col">Tipo de colaborador</th>
            <th scope="col">Salário base</th>
            <th scope="col">Adicionais</th>
            <th scope="col" className="salary-column">Salário final</th>
            <th scope="col" className="no-print">Relatório</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.matricula}>
              <td data-label="Matrícula">
                <span className="registration">{employee.matricula}</span>
              </td>
              <td data-label="Nome" className="employee-name">{employee.nome}</td>
              <td data-label="Tipo de colaborador">
                <EmployeeTypeBadge type={employee.tipo} />
              </td>
              <td data-label="Salário base">{formatarMoeda(employee.salarioBase)}</td>
              <td data-label="Adicionais">{formatarMoeda(employee.adicional)}</td>
              <td data-label="Salário final" className="salary-column salary-value">
                {formatarMoeda(employee.salarioFinal)}
              </td>
              <td data-label="Relatório" className="no-print">
                <Link to={`/folha/${encodeURIComponent(employee.matricula)}`}>Ver folha individual</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PayrollTable
