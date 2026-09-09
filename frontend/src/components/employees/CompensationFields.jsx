function NumberField({
  addon,
  error,
  hint,
  label,
  min = "0",
  name,
  onChange,
  step,
  value,
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <div className="field-group">
      <label htmlFor={name}>{label}</label>
      <div className={`number-input ${addon ? "has-addon" : ""}`}>
        {addon && <span aria-hidden="true">{addon}</span>}
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          type="number"
          min={min}
          step={step}
          inputMode="decimal"
          aria-describedby={error ? errorId : hintId}
          aria-invalid={Boolean(error)}
        />
      </div>
      <small className={error ? "field-error" : undefined} id={error ? errorId : hintId}>
        {error ?? hint}
      </small>
    </div>
  );
}

function CompensationFields({ errors, form, onChange }) {
  if (form.tipo === "Padrão") return null;

  return (
    <fieldset className="compensation-fields">
      <legend>Dados da remuneração variável</legend>
      <div className="compensation-grid">
        {form.tipo === "Comissionado" ? (
          <>
            <NumberField
              addon="R$"
              error={errors.valorVendas}
              hint="Total de vendas usado no cálculo da comissão."
              label="Valor das vendas"
              name="valorVendas"
              onChange={onChange}
              step="0.01"
              value={form.valorVendas}
            />
            <NumberField
              addon="%"
              error={errors.percentualComissao}
              hint="Percentual aplicado sobre o valor das vendas."
              label="Percentual de comissão"
              name="percentualComissao"
              onChange={onChange}
              step="0.01"
              value={form.percentualComissao}
            />
          </>
        ) : (
          <>
            <NumberField
              error={errors.quantidadeProduzida}
              hint="Quantidade total produzida no período."
              label="Quantidade produzida"
              name="quantidadeProduzida"
              onChange={onChange}
              step="1"
              value={form.quantidadeProduzida}
            />
            <NumberField
              addon="R$"
              error={errors.valorPorUnidade}
              hint="Valor pago por cada unidade produzida."
              label="Valor por unidade"
              name="valorPorUnidade"
              onChange={onChange}
              step="0.01"
              value={form.valorPorUnidade}
            />
          </>
        )}
      </div>
    </fieldset>
  );
}

export default CompensationFields;
