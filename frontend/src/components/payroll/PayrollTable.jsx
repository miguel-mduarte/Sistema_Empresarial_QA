import { formatarMoeda } from '../../utils/formatters'
import EmployeeTypeBadge from '../employees/EmployeeTypeBadge'

function PayrollTable({ employees }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th scope="col">Matrícula</th>
            <th scope="col">Nome</th>
            <th scope="col">Tipo de colaborador</th>
            <th scope="col" className="salary-column">Salário final</th>
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
              <td data-label="Salário final" className="salary-column salary-value">
                {formatarMoeda(employee.salarioFinal)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PayrollTable
