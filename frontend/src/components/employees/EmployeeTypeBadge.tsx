import type { TipoColaborador } from "../../types/colaborador";
const typeClassNames = {
  Padrão: "standard",
  Comissionado: "commissioned",
  Produção: "production",
};

function EmployeeTypeBadge({ type }: { type: TipoColaborador }) {
  return (
    <span className={`employee-type ${typeClassNames[type] ?? "standard"}`}>
      {type}
    </span>
  );
}

export default EmployeeTypeBadge;
