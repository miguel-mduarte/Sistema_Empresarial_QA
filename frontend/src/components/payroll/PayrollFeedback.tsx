import type { FeedbackProps } from "../../types/colaborador";
function PayrollFeedback({ isLoading, loadError, onRetry }: FeedbackProps) {
  if (isLoading) {
    return (
      <section className="payroll-feedback" aria-live="polite">
        <span className="loading-mark" aria-hidden="true" />
        <div>
          <h2>Gerando folha de pagamento</h2>
          <p>Calculando e consolidando os salários dos colaboradores...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="payroll-feedback error" role="alert">
      <div>
        <h2>Não foi possível gerar a folha</h2>
        <p>{loadError}</p>
      </div>
      <button className="secondary-button" type="button" onClick={onRetry}>
        Tentar novamente
      </button>
    </section>
  );
}

export default PayrollFeedback;
