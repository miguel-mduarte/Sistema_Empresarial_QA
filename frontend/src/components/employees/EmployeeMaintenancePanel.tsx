import type { MaintenanceProps, FormErrors } from "../../types/colaborador";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import {
  alterarColaborador,
  excluirColaborador,
} from "../../services/colaboradoresApi";
import {
  buildEmployeePayload,
  employeeToForm,
  validateEmployeeForm,
} from "../../utils/colaboradorForm";
import EmployeeFormFields from "./EmployeeFormFields";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function EmployeeEditForm({ employee, onCancel, onUpdated }: Pick<MaintenanceProps, "employee" | "onCancel" | "onUpdated">) {
  const [form, setForm] = useState(() => employeeToForm(employee));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const updatedEmployee = await alterarColaborador(
        employee.matricula,
        buildEmployeePayload(form),
      );
      onUpdated(updatedEmployee);
    } catch (error) {
      setSubmitError(getErrorMessage(
        error,
        "Não foi possível atualizar o colaborador.",
      ));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <EmployeeFormFields
        errors={errors}
        form={form}
        idPrefix="edit-"
        onChange={handleChange}
      />
      <div className="maintenance-actions">
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
      {submitError && (
        <p className="maintenance-feedback error" role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}

function EmployeeDeleteConfirmation({ employee, onCancel, onDeleted }: Pick<MaintenanceProps, "employee" | "onCancel" | "onDeleted">) {
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDelete() {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await excluirColaborador(employee.matricula);
      onDeleted(employee);
    } catch (error) {
      setSubmitError(getErrorMessage(
        error,
        "Não foi possível excluir o colaborador.",
      ));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="delete-confirmation">
      <p>
        O cadastro de <strong>{employee.nome}</strong>, matrícula{" "}
        <strong>{employee.matricula}</strong>, será removido do arquivo JSON.
      </p>
      <p>Essa ação não pode ser desfeita pela interface.</p>
      <div className="maintenance-actions">
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button
          className="danger-button"
          type="button"
          disabled={isSubmitting}
          onClick={handleDelete}
        >
          {isSubmitting ? "Excluindo..." : "Confirmar exclusão"}
        </button>
      </div>
      {submitError && (
        <p className="maintenance-feedback error" role="alert">
          {submitError}
        </p>
      )}
    </div>
  );
}

function EmployeeMaintenancePanel({
  action,
  employee,
  onCancel,
  onDeleted,
  onUpdated,
}: MaintenanceProps) {
  const isEditing = action === "edit";

  return (
    <section
      className={`maintenance-panel ${isEditing ? "" : "danger"}`}
      aria-labelledby="maintenance-title"
    >
      <header className="maintenance-header">
        <div>
          <p className="card-label">MANUTENÇÃO DE CADASTRO</p>
          <h2 id="maintenance-title">
            {isEditing ? `Editar ${employee.nome}` : "Confirmar exclusão"}
          </h2>
        </div>
        <span className="form-step" aria-hidden="true">09</span>
      </header>

      {isEditing ? (
        <EmployeeEditForm
          employee={employee}
          onCancel={onCancel}
          onUpdated={onUpdated}
        />
      ) : (
        <EmployeeDeleteConfirmation
          employee={employee}
          onCancel={onCancel}
          onDeleted={onDeleted}
        />
      )}
    </section>
  );
}

export default EmployeeMaintenancePanel;
