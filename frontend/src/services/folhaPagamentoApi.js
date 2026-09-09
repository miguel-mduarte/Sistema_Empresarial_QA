import { apiRequest } from "./apiClient";

export function gerarFolhaPagamento() {
  return apiRequest("/folha-pagamento");
}
