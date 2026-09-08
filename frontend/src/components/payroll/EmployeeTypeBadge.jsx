const typeClassNames = {
  Padrão: 'standard',
  Comissionado: 'commissioned',
  Produção: 'production',
}

function EmployeeTypeBadge({ type }) {
  return (
    <span className={`employee-type ${typeClassNames[type] ?? 'standard'}`}>
      {type}
    </span>
  )
}

export default EmployeeTypeBadge
