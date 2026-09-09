const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function parseResponse(response) {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.mensagem ?? "Não foi possível concluir a operação no servidor.",
    );
  }

  return body;
}

export async function apiRequest(path, options) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique se o backend está em execução.",
    );
  }

  return parseResponse(response);
}
