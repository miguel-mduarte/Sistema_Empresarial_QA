import type { Colaborador, FormErrors, MaintenanceProps } from "../types/colaborador";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import EmployeeFormFields from "../components/employees/EmployeeFormFields";
import EmployeesList from "../components/employees/EmployeesList";
import EmployeeMaintenancePanel from "../components/employees/EmployeeMaintenancePanel";
import { tiposColaborador } from "../data/tiposColaborador";
import { cadastrarColaborador } from "../services/colaboradoresApi";
import useColaboradores from "../hooks/useColaboradores";
import {
  buildEmployeePayload,
  initialEmployeeForm,
  validateEmployeeForm,
} from "../utils/colaboradorForm";
import { formatarMoeda } from "../utils/formatters";

function EmployeesPage() {
  const [form, setForm] = useState(initialEmployeeForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [savedEmployee, setSavedEmployee] = useState<Colaborador | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    adicionarColaborador,
    atualizarColaborador,
    carregarColaboradores,
    colaboradores,
    isLoading,
    loadError,
    removerColaborador,
  } = useColaboradores();
  const [maintenance, setMaintenance] = useState<Pick<MaintenanceProps, "action" | "employee"> | null>(null);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => (
      name === "tipo" ? {} : { ...current, [name]: undefined }
    ));
    setSubmitError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      adicionarColaborador(employee);
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
          <h1 id="employees-title">Colaboradores</h1>
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
          <span>RF005</span>
          <span>RF006</span>
          <span>RF009</span>
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

          <EmployeeFormFields
            errors={errors}
            form={form}
            onChange={handleChange}
          />

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

      <EmployeesList
        employees={colaboradores}
        isLoading={isLoading}
        loadError={loadError}
        onDelete={(employee) => {
          setMaintenance({ action: "delete", employee });
          setMaintenanceMessage("");
        }}
        onEdit={(employee) => {
          setMaintenance({ action: "edit", employee });
          setMaintenanceMessage("");
        }}
        onRetry={carregarColaboradores}
      />

      {maintenanceMessage && (
        <p className="maintenance-result" role="status">
          {maintenanceMessage}
        </p>
      )}

      {maintenance && (
        <EmployeeMaintenancePanel
          key={
            `${maintenance.action}-${
              maintenance.employee.id ?? maintenance.employee.matricula
            }`
          }
          action={maintenance.action}
          employee={maintenance.employee}
          onCancel={() => setMaintenance(null)}
          onDeleted={(employee) => {
            removerColaborador(employee.matricula);
            setSavedEmployee((current) => (
              current?.id === employee.id ? null : current
            ));
            setMaintenance(null);
            setMaintenanceMessage(`${employee.nome} foi excluído com sucesso.`);
          }}
          onUpdated={(employee) => {
            atualizarColaborador(employee);
            setSavedEmployee((current) => (
              current?.id === employee.id ? employee : current
            ));
            setMaintenance(null);
            setMaintenanceMessage(`${employee.nome} foi atualizado com sucesso.`);
          }}
        />
      )}
    </main>
  );
}

export default EmployeesPage;
