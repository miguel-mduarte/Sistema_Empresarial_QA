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

async function request(url, options) {
  try {
    return await fetch(url, options);
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique se o backend está em execução.",
    );
  }
}

export async function listarColaboradores() {
  const response = await request(`${API_URL}/colaboradores`);
  return parseResponse(response);
}

export async function cadastrarColaborador(employee) {
  const response = await request(`${API_URL}/colaboradores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });

  return parseResponse(response);
}
