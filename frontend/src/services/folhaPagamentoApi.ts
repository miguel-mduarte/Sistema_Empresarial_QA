import { apiRequest } from "./apiClient";
import type { FolhaPagamento, PayrollItem } from "../types/colaborador";

export function gerarFolhaIndividual(matricula: string) {
  return apiRequest<PayrollItem>(`/folha-pagamento/${encodeURIComponent(matricula)}`);
}

export function gerarFolhaPagamento() {
  return apiRequest<FolhaPagamento>("/folha-pagamento");
}
