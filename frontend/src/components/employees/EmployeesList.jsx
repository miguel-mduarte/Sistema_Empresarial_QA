import EmployeesTable from "./EmployeesTable";

function EmployeesList({
  employees,
  isLoading,
  loadError,
  onDelete,
  onEdit,
  onRetry,
}) {
  let content;

  if (isLoading) {
    content = (
      <p className="employees-feedback" role="status">
        Consultando colaboradores...
      </p>
    );
  } else if (loadError) {
    content = (
      <div className="employees-feedback error" role="alert">
        <p>{loadError}</p>
        <button className="secondary-button" type="button" onClick={onRetry}>
          Tentar novamente
        </button>
      </div>
    );
  } else if (employees.length === 0) {
    content = (
      <div className="employees-feedback empty">
        <span aria-hidden="true">0</span>
        <div>
          <strong>Nenhum colaborador cadastrado</strong>
          <p>Use o formulário acima para criar o primeiro registro.</p>
        </div>
      </div>
    );
  } else {
    content = (
      <EmployeesTable
        employees={employees}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
  }

  return (
    <section
      id="lista-colaboradores"
      className="employees-list-card"
      aria-labelledby="employees-list-title"
    >
      <header className="employees-list-header">
        <div>
          <p className="card-label">CONSULTA DE COLABORADORES</p>
          <h2 id="employees-list-title">Equipe cadastrada</h2>
        </div>
        <div
          className="record-count"
          aria-label={`${employees.length} colaboradores cadastrados`}
        >
          <strong>{employees.length}</strong>
          <span>colaboradores</span>
        </div>
      </header>

      {content}

      {!isLoading && !loadError && employees.length > 0 && (
        <footer className="employees-list-footer">
          <span className="status-dot" aria-hidden="true" />
          Salários recalculados automaticamente pela API.
        </footer>
      )}
    </section>
  );
}

export default EmployeesList;
