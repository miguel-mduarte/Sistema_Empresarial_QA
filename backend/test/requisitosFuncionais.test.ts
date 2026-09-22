import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import createApp from "../src/app.js";

type CorpoJson = Record<string, unknown>;

describe("Requisitos funcionais RF001 a RF009", () => {
  let directory: string;
  let databasePath: string;
  let server: Server;
  let apiRoot: string;
  let colaboradoresUrl: string;

  beforeEach(async () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "folha-clara-rf-"));
    databasePath = path.join(directory, "colaboradores.json");
    const app = createApp({ databasePath });
    server = app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const { port } = server.address() as AddressInfo;
    apiRoot = `http://127.0.0.1:${port}/api`;
    colaboradoresUrl = `${apiRoot}/colaboradores`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    fs.rmSync(directory, { recursive: true, force: true });
  });

  async function cadastrar(dados: CorpoJson) {
    return fetch(colaboradoresUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  }

  async function corpo(response: Response) {
    return response.json() as Promise<CorpoJson>;
  }

  test("RF001 - cadastra colaborador com matrícula, nome, salário base e tipo", async () => {
    const response = await cadastrar({
      matricula: "RF001-01",
      nome: "Ana Souza",
      salarioBase: 2500,
      tipo: "Padrão",
    });
    const colaborador = await corpo(response);

    expect(response.status).toBe(201);
    expect(colaborador).toMatchObject({
      matricula: "RF001-01",
      nome: "Ana Souza",
      salarioBase: 2500,
      tipo: "Padrão",
    });
    expect(colaborador.id).toEqual(expect.any(String));
  });

  test("RF002 - cadastra colaborador padrão que recebe somente o salário base", async () => {
    const response = await cadastrar({
      matricula: "RF002-01",
      nome: "Bruno Lima",
      salarioBase: 1800,
      tipo: "Padrão",
    });
    const colaborador = await corpo(response);

    expect(response.status).toBe(201);
    expect(colaborador).toMatchObject({
      tipo: "Padrão",
      salarioBase: 1800,
      adicional: 0,
      salarioFinal: 1800,
    });
  });

  test("RF003 - cadastra colaborador comissionado com vendas e percentual", async () => {
    const response = await cadastrar({
      matricula: "RF003-01",
      nome: "Carla Mendes",
      salarioBase: 2000,
      tipo: "Comissionado",
      valorVendas: 10000,
      percentualComissao: 5,
    });
    const colaborador = await corpo(response);

    expect(response.status).toBe(201);
    expect(colaborador).toMatchObject({
      tipo: "Comissionado",
      valorVendas: 10000,
      percentualComissao: 5,
    });
  });

  test("RF004 - cadastra colaborador por produção com quantidade e valor unitário", async () => {
    const response = await cadastrar({
      matricula: "RF004-01",
      nome: "Diego Alves",
      salarioBase: 1500,
      tipo: "Produção",
      quantidadeProduzida: 80,
      valorPorUnidade: 12.5,
    });
    const colaborador = await corpo(response);

    expect(response.status).toBe(201);
    expect(colaborador).toMatchObject({
      tipo: "Produção",
      quantidadeProduzida: 80,
      valorPorUnidade: 12.5,
    });
  });

  test("RF005 - consulta a lista com dados cadastrais e remuneratórios", async () => {
    await cadastrar({
      matricula: "RF005-01",
      nome: "Elisa Ramos",
      salarioBase: 2200,
      tipo: "Comissionado",
      valorVendas: 3000,
      percentualComissao: 10,
    });

    const response = await fetch(colaboradoresUrl);
    const colaboradores = await response.json() as CorpoJson[];

    expect(response.status).toBe(200);
    expect(colaboradores).toHaveLength(1);
    expect(colaboradores[0]).toMatchObject({
      matricula: "RF005-01",
      nome: "Elisa Ramos",
      tipo: "Comissionado",
      salarioBase: 2200,
      adicional: 300,
      salarioFinal: 2500,
    });
  });

  test("RF006 - calcula automaticamente o salário final conforme a categoria", async () => {
    const padrao = await corpo(await cadastrar({
      matricula: "RF006-PAD",
      nome: "Padrão",
      salarioBase: 1000,
      tipo: "Padrão",
    }));
    const comissionado = await corpo(await cadastrar({
      matricula: "RF006-COM",
      nome: "Comissionado",
      salarioBase: 1000,
      tipo: "Comissionado",
      valorVendas: 2000,
      percentualComissao: 10,
    }));
    const producao = await corpo(await cadastrar({
      matricula: "RF006-PRO",
      nome: "Produção",
      salarioBase: 1000,
      tipo: "Produção",
      quantidadeProduzida: 20,
      valorPorUnidade: 5,
    }));

    expect(padrao.salarioFinal).toBe(1000);
    expect(comissionado.salarioFinal).toBe(1200);
    expect(producao.salarioFinal).toBe(1100);
  });

  test("RF007 - gera folha detalhada para todos os colaboradores cadastrados", async () => {
    await cadastrar({
      matricula: "RF007-01",
      nome: "Fábio Castro",
      salarioBase: 2100,
      tipo: "Padrão",
    });
    await cadastrar({
      matricula: "RF007-02",
      nome: "Gisele Moraes",
      salarioBase: 2000,
      tipo: "Comissionado",
      valorVendas: 5000,
      percentualComissao: 4,
    });

    const response = await fetch(`${apiRoot}/folha-pagamento`);
    const folha = await corpo(response);

    expect(response.status).toBe(200);
    expect(folha.itens).toEqual([
      {
        matricula: "RF007-01",
        nome: "Fábio Castro",
        tipo: "Padrão",
        salarioBase: 2100,
        adicional: 0,
        salarioFinal: 2100,
      },
      {
        matricula: "RF007-02",
        nome: "Gisele Moraes",
        tipo: "Comissionado",
        salarioBase: 2000,
        adicional: 200,
        salarioFinal: 2200,
      },
    ]);
  });

  test("RF008 - emite resumo com o valor total da folha", async () => {
    await cadastrar({
      matricula: "RF008-01",
      nome: "Helena Reis",
      salarioBase: 1800,
      tipo: "Padrão",
    });
    await cadastrar({
      matricula: "RF008-02",
      nome: "Igor Nunes",
      salarioBase: 1200,
      tipo: "Produção",
      quantidadeProduzida: 100,
      valorPorUnidade: 3,
    });

    const response = await fetch(`${apiRoot}/folha-pagamento`);
    const folha = await corpo(response);

    expect(response.status).toBe(200);
    expect(folha.resumo).toMatchObject({
      quantidadeColaboradores: 2,
      totalFolha: 3300,
    });
  });

  test("RF009 - inclui, consulta, altera e exclui um cadastro", async () => {
    const cadastro = await cadastrar({
      matricula: "RF009-01",
      nome: "Joana Freitas",
      salarioBase: 1600,
      tipo: "Padrão",
    });
    expect(cadastro.status).toBe(201);

    const consulta = await fetch(`${colaboradoresUrl}/RF009-01`);
    expect(consulta.status).toBe(200);

    const alteracao = await fetch(`${colaboradoresUrl}/RF009-01`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matricula: "RF009-01",
        nome: "Joana Freitas Atualizada",
        salarioBase: 1900,
        tipo: "Padrão",
      }),
    });
    expect(alteracao.status).toBe(200);
    expect(await corpo(alteracao)).toMatchObject({
      nome: "Joana Freitas Atualizada",
      salarioFinal: 1900,
    });

    const exclusao = await fetch(`${colaboradoresUrl}/RF009-01`, {
      method: "DELETE",
    });
    expect(exclusao.status).toBe(204);
    expect((await fetch(`${colaboradoresUrl}/RF009-01`)).status).toBe(404);
  });
});
