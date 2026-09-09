import { formatarMoeda } from "../../utils/formatters";
import EmployeeCompensationDetail from "./EmployeeCompensationDetail";
import EmployeeTypeBadge from "./EmployeeTypeBadge";

function EmployeesTable({ employees }) {
  return (
    <div className="table-wrapper">
      <table className="employees-table">
        <thead>
          <tr>
            <th scope="col">Matrícula</th>
            <th scope="col">Colaborador</th>
            <th scope="col">Tipo e critérios</th>
            <th scope="col" className="salary-column">Salário base</th>
            <th scope="col" className="salary-column">Adicional</th>
            <th scope="col" className="salary-column">Salário final</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id ?? employee.matricula}>
              <td data-label="Matrícula">
                <span className="registration">{employee.matricula}</span>
              </td>
              <td data-label="Colaborador" className="employee-name">
                {employee.nome}
              </td>
              <td data-label="Tipo e critérios">
                <div className="employee-type-detail">
                  <EmployeeTypeBadge type={employee.tipo} />
                  <EmployeeCompensationDetail employee={employee} />
                </div>
              </td>
              <td data-label="Salário base" className="salary-column">
                {formatarMoeda(employee.salarioBase)}
              </td>
              <td data-label="Adicional" className="salary-column">
                {formatarMoeda(employee.adicional ?? 0)}
              </td>
              <td
                data-label="Salário final"
                className="salary-column salary-value"
              >
                {formatarMoeda(employee.salarioFinal)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeesTable;
