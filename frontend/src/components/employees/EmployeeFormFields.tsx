import type { EmployeeFormProps } from "../../types/colaborador";
import {
  nomesTiposColaborador,
  tiposColaborador,
} from "../../data/tiposColaborador";
import CompensationFields from "./CompensationFields";

function EmployeeFormFields({ errors, form, idPrefix = "", onChange }: EmployeeFormProps) {
  const selectedType = tiposColaborador[form.tipo];
  const fieldId = (name: string) => `${idPrefix}${name}`;

  return (
    <div className="form-grid">
      <div className="field-group">
        <label htmlFor={fieldId("matricula")}>Matrícula</label>
        <input
          id={fieldId("matricula")}
          name="matricula"
          value={form.matricula}
          onChange={onChange}
          placeholder="Ex.: FC-1007"
          aria-describedby={
            errors.matricula
              ? fieldId("matricula-error")
              : fieldId("matricula-hint")
          }
          aria-invalid={Boolean(errors.matricula)}
          autoComplete="off"
        />
        {errors.matricula ? (
          <small className="field-error" id={fieldId("matricula-error")}>
            {errors.matricula}
          </small>
        ) : (
          <small id={fieldId("matricula-hint")}>
            Identificador único do colaborador.
          </small>
        )}
      </div>

      <div className="field-group field-group-wide">
        <label htmlFor={fieldId("nome")}>Nome completo</label>
        <input
          id={fieldId("nome")}
          name="nome"
          value={form.nome}
          onChange={onChange}
          placeholder="Ex.: Mariana Oliveira"
          aria-describedby={errors.nome ? fieldId("nome-error") : undefined}
          aria-invalid={Boolean(errors.nome)}
          autoComplete="name"
        />
        {errors.nome && (
          <small className="field-error" id={fieldId("nome-error")}>
            {errors.nome}
          </small>
        )}
      </div>

      <div className="field-group">
        <label htmlFor={fieldId("salarioBase")}>Salário base</label>
        <div className="money-input">
          <span aria-hidden="true">R$</span>
          <input
            id={fieldId("salarioBase")}
            name="salarioBase"
            value={form.salarioBase}
            onChange={onChange}
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0,00"
            aria-describedby={
              errors.salarioBase ? fieldId("salario-error") : undefined
            }
            aria-invalid={Boolean(errors.salarioBase)}
          />
        </div>
        {errors.salarioBase && (
          <small className="field-error" id={fieldId("salario-error")}>
            {errors.salarioBase}
          </small>
        )}
      </div>

      <div className="field-group">
        <label htmlFor={fieldId("tipo")}>Tipo de colaborador</label>
        <select
          id={fieldId("tipo")}
          name="tipo"
          value={form.tipo}
          onChange={onChange}
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
        idPrefix={idPrefix}
        onChange={onChange}
      />
    </div>
  );
}

export default EmployeeFormFields;
