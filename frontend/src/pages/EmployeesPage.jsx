import { useState } from "react";
import { cadastrarColaborador } from "../services/colaboradoresStorage";
import { formatarMoeda } from "../utils/formatters";

const initialForm = {
  matricula: "",
  nome: "",
  salarioBase: "",
  tipo: "Padrão",
};

function validate(form) {
  const errors = {};
  const salary = Number(form.salarioBase);

  if (!form.matricula.trim()) errors.matricula = "Informe a matrícula.";
  if (!form.nome.trim()) errors.nome = "Informe o nome do colaborador.";
  if (form.salarioBase === "") errors.salarioBase = "Informe o salário base.";
  else if (!Number.isFinite(salary) || salary < 0) {
    errors.salarioBase = "O salário base deve ser igual ou maior que zero.";
  }

  return errors;
}

function EmployeesPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [savedEmployee, setSavedEmployee] = useState(null);
  const [submitError, setSubmitError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSavedEmployee(null);
      return;
    }

    try {
      const employee = cadastrarColaborador({
        matricula: form.matricula.trim(),
        nome: form.nome.trim(),
        salarioBase: Number(form.salarioBase),
        tipo: form.tipo,
      });

      setSavedEmployee(employee);
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      setSavedEmployee(null);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o cadastro.",
      );
    }
  }

  return (
    <main id="colaboradores">
      <section
        className="page-heading employee-page-heading"
        aria-labelledby="employees-title"
      >
        <div>
          <p className="eyebrow">GESTÃO DA EQUIPE</p>
          <h1 id="employees-title">Novo colaborador</h1>
          <p className="subtitle">
            Cadastre colaboradores do tipo padrão para manter as informações
            essenciais da folha organizadas.
          </p>
        </div>
        <div className="requirement-chip" aria-label="Requisitos contemplados">
          <span>RF001</span>
          <span>RF002</span>
        </div>
      </section>

      <div className="employee-form-layout">
        <form className="employee-form-card" onSubmit={handleSubmit} noValidate>
          <header className="form-card-header">
            <div>
              <p className="card-label">DADOS CADASTRAIS</p>
              <h2>Informações do colaborador</h2>
            </div>
            <span className="form-step" aria-label="Etapa única">
              01
            </span>
          </header>

          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="matricula">Matrícula</label>
              <input
                id="matricula"
                name="matricula"
                value={form.matricula}
                onChange={handleChange}
                placeholder="Ex.: FC-1007"
                aria-describedby={
                  errors.matricula ? "matricula-error" : "matricula-hint"
                }
                aria-invalid={Boolean(errors.matricula)}
                autoComplete="off"
              />
              {errors.matricula ? (
                <small className="field-error" id="matricula-error">
                  {errors.matricula}
                </small>
              ) : (
                <small id="matricula-hint">
                  Identificador único do colaborador.
                </small>
              )}
            </div>

            <div className="field-group field-group-wide">
              <label htmlFor="nome">Nome completo</label>
              <input
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex.: Mariana Oliveira"
                aria-describedby={errors.nome ? "nome-error" : undefined}
                aria-invalid={Boolean(errors.nome)}
                autoComplete="name"
              />
              {errors.nome && (
                <small className="field-error" id="nome-error">
                  {errors.nome}
                </small>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="salarioBase">Salário base</label>
              <div className="money-input">
                <span aria-hidden="true">R$</span>
                <input
                  id="salarioBase"
                  name="salarioBase"
                  value={form.salarioBase}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0,00"
                  aria-describedby={
                    errors.salarioBase ? "salario-error" : undefined
                  }
                  aria-invalid={Boolean(errors.salarioBase)}
                />
              </div>
              {errors.salarioBase && (
                <small className="field-error" id="salario-error">
                  {errors.salarioBase}
                </small>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="tipo">Tipo de colaborador</label>
              <select
                id="tipo"
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
              >
                <option value="Padrão">Padrão</option>
              </select>
              <small>Recebe somente o salário base.</small>
            </div>
          </div>

          <div className="form-actions">
            <p>Os campos deste formulário são obrigatórios.</p>
            <button className="primary-button" type="submit">
              Salvar colaborador
              <span aria-hidden="true">→</span>
            </button>
          </div>

          {submitError && (
            <p className="form-message error" role="alert">
              {submitError}
            </p>
          )}
          {savedEmployee && (
            <p className="form-message success" role="status">
              <strong>{savedEmployee.nome}</strong> foi cadastrado com sucesso.
            </p>
          )}
        </form>

        <aside className="employee-summary" aria-label="Resumo do cadastro">
          <p className="card-label">COLABORADOR PADRÃO</p>
          <h2>Uma remuneração simples e direta.</h2>
          <p>
            Para esta categoria, o salário final será exatamente igual ao
            salário base informado no cadastro.
          </p>

          <div className="salary-rule">
            <span>Salário final</span>
            <strong>= Salário base</strong>
          </div>

          {savedEmployee ? (
            <div className="last-saved-card">
              <span>ÚLTIMO CADASTRO</span>
              <strong>{savedEmployee.nome}</strong>
              <p>
                {savedEmployee.matricula} ·{" "}
                {formatarMoeda(savedEmployee.salarioBase)}
              </p>
            </div>
          ) : (
            <p className="storage-note">
              <span className="status-dot" aria-hidden="true" />
              Os dados serão mantidos neste navegador em formato JSON.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}

export default EmployeesPage;
