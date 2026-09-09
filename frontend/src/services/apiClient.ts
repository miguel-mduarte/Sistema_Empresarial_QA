const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function parseResponse<T>(response: Response): Promise<T> {
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof body === "object" && body !== null && "mensagem" in body && typeof body.mensagem === "string"
        ? body.mensagem : "Não foi possível concluir a operação no servidor.",
    );
  }

  return body as T;
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique se o backend está em execução.",
    );
  }

  return parseResponse<T>(response);
}
