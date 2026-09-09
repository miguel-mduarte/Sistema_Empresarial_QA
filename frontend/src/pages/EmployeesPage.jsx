import { useState } from "react";
import CompensationFields from "../components/employees/CompensationFields";
import {
  nomesTiposColaborador,
  tiposColaborador,
} from "../data/tiposColaborador";
import { cadastrarColaborador } from "../services/colaboradoresApi";
import {
  buildEmployeePayload,
  initialEmployeeForm,
  validateEmployeeForm,
} from "../utils/colaboradorForm";
import { formatarMoeda } from "../utils/formatters";

function EmployeesPage() {
  const [form, setForm] = useState(initialEmployeeForm);
  const [errors, setErrors] = useState({});
  const [savedEmployee, setSavedEmployee] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => (
      name === "tipo" ? {} : { ...current, [name]: undefined }
    ));
    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateEmployeeForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSavedEmployee(null);
      return;
    }

    setIsSubmitting(true);

    try {
      const employee = await cadastrarColaborador(buildEmployeePayload(form));

      setSavedEmployee(employee);
      setForm(initialEmployeeForm);
      setErrors({});
    } catch (error) {
      setSavedEmployee(null);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o cadastro.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedType = tiposColaborador[form.tipo];

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
            Cadastre colaboradores padrão, comissionados ou por produção com
            os dados necessários para calcular cada remuneração.
          </p>
        </div>
        <div className="requirement-chip" aria-label="Requisitos contemplados">
          <span>RF001</span>
          <span>RF002</span>
          <span>RF003</span>
          <span>RF004</span>
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
                {nomesTiposColaborador.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              <small>{selectedType.descricao}</small>
            </div>

            <CompensationFields
              errors={errors}
              form={form}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <p>Os campos deste formulário são obrigatórios.</p>
            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar colaborador"}
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
          <p className="card-label">COLABORADOR {form.tipo.toUpperCase()}</p>
          <h2>{selectedType.titulo}</h2>
          <p>{selectedType.descricao}</p>

          <div className="salary-rule">
            <span>Salário final</span>
            <strong>= {selectedType.formula}</strong>
          </div>

          {savedEmployee ? (
            <div className="last-saved-card">
              <span>ÚLTIMO CADASTRO</span>
              <strong>{savedEmployee.nome}</strong>
              <p>
                {savedEmployee.matricula} ·{" "}
                {formatarMoeda(savedEmployee.salarioFinal)}
              </p>
            </div>
          ) : (
            <p className="storage-note">
              <span className="status-dot" aria-hidden="true" />
              Os dados serão armazenados no arquivo JSON do servidor.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}

export default EmployeesPage;
