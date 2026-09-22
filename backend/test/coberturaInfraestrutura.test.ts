import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import type { AddressInfo } from "node:net";
import express from "express";
import { body, oneOf } from "express-validator";
import { afterEach, describe, expect, test, vi } from "vitest";
import createApp, { startServer } from "../src/app.js";
import { obterRepositorio } from "../src/data/colaboradorContext.js";
import validarColaborador, { validarObjeto } from "../src/data/colaboradorParser.js";
import ColaboradorRepository from "../src/data/colaboradorRepository.js";
import { validate } from "../src/middlewares/handleValidation.js";
import ColaboradorPadrao from "../src/models/colaboradorPadraoModel.js";

const directories: string[] = [];

function temporaryDatabasePath() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "folha-clara-coverage-"));
  directories.push(directory);
  return path.join(directory, "nested", "colaboradores.json");
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  for (const directory of directories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("Inicialização e contexto", () => {
  test("inicia a API com arquivo de dados isolado e responde à folha vazia", async () => {
    const databasePath = temporaryDatabasePath();
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const server = startServer({ databasePath, port: 0 });

    try {
      await new Promise<void>((resolve) => server.once("listening", resolve));
      const port = (server.address() as AddressInfo).port;
      const response = await fetch(`http://127.0.0.1:${port}/api/folha-pagamento`);
      const folha = await response.json();

      expect(response.status).toBe(200);
      expect(folha.resumo).toMatchObject({ quantidadeColaboradores: 0, totalFolha: 0 });
      expect(fs.readFileSync(databasePath, "utf8")).toBe("[]\n");
      expect(log).toHaveBeenCalledWith("Servidor iniciado na porta 0");
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
    }
  });

  test("obtém o repositório configurado e rejeita aplicação sem configuração", () => {
    const databasePath = temporaryDatabasePath();
    const app = createApp({ databasePath });

    expect(obterRepositorio(app).databasePath).toBe(databasePath);
    expect(() => obterRepositorio(express())).toThrow(
      "O repositório de colaboradores não foi configurado.",
    );
  });

  test("usa caminho e porta definidos no ambiente ao iniciar sem opções", async () => {
    const databasePath = temporaryDatabasePath();
    const reservation = net.createServer();
    reservation.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => reservation.once("listening", resolve));
    const port = (reservation.address() as AddressInfo).port;
    await new Promise<void>((resolve) => reservation.close(() => resolve()));

    vi.stubEnv("COLABORADORES_DB_PATH", databasePath);
    vi.stubEnv("PORT", String(port));
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const server = startServer();

    try {
      await new Promise<void>((resolve) => server.once("listening", resolve));
      const response = await fetch(`http://127.0.0.1:${port}/api/colaboradores`);
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual([]);
      expect(fs.existsSync(databasePath)).toBe(true);
      expect(log).toHaveBeenCalledWith(`Servidor iniciado na porta ${port}`);
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
    }
  });
});

describe("Validação dos registros persistidos", () => {
  test.each([null, [], "texto", 5])("rejeita entrada que não é objeto JSON: %j", (entrada) => {
    expect(() => validarObjeto(entrada)).toThrow(
      "Informe os dados do colaborador em um objeto JSON.",
    );
  });

  test.each([
    [{ matricula: " ", nome: "Ana", tipo: "Padrão", salarioBase: 10 }, "Matrícula, nome e tipo são obrigatórios."],
    [{ matricula: "A", nome: " ", tipo: "Padrão", salarioBase: 10 }, "Matrícula, nome e tipo são obrigatórios."],
    [{ matricula: "A", nome: "Ana", tipo: "Padrão" }, "O salário base é obrigatório."],
    [{ matricula: "A", nome: "Ana", tipo: "Padrão", salarioBase: "abc" }, "O salário base deve ser um número igual ou maior que zero."],
    [{ matricula: "A", nome: "Ana", tipo: "Outro", salarioBase: 10 }, "O tipo de colaborador informado é inválido."],
    [{ matricula: "A", nome: "Ana", tipo: "Comissionado", salarioBase: 10, valorVendas: 100 }, "O percentual de comissão é obrigatório."],
    [{ matricula: "A", nome: "Ana", tipo: "Comissionado", salarioBase: 10, valorVendas: -1, percentualComissao: 5 }, "O valor das vendas deve ser um número igual ou maior que zero."],
    [{ matricula: "A", nome: "Ana", tipo: "Produção", salarioBase: 10, quantidadeProduzida: null, valorPorUnidade: 2 }, "A quantidade produzida é obrigatório."],
    [{ matricula: "A", nome: "Ana", tipo: "Produção", salarioBase: 10, quantidadeProduzida: 2, valorPorUnidade: -1 }, "O valor por unidade deve ser um número igual ou maior que zero."],
  ] as const)("rejeita registro persistido inválido: %j", (entrada, mensagem) => {
    expect(() => validarColaborador(entrada)).toThrow(mensagem);
  });

  test("normaliza números e textos dos três tipos válidos", () => {
    expect(validarColaborador({ matricula: " A ", nome: " Ana ", tipo: "Padrão", salarioBase: "100" }))
      .toEqual({ matricula: "A", nome: "Ana", tipo: "Padrão", salarioBase: 100 });
    expect(validarColaborador({ matricula: "B", nome: "Bia", tipo: "Comissionado", salarioBase: 100, valorVendas: "200", percentualComissao: "10" }))
      .toMatchObject({ valorVendas: 200, percentualComissao: 10 });
    expect(validarColaborador({ matricula: "C", nome: "Caio", tipo: "Produção", salarioBase: 100, quantidadeProduzida: "3", valorPorUnidade: "5" }))
      .toMatchObject({ quantidadeProduzida: 3, valorPorUnidade: 5 });
  });

  test("não sobrescreve arquivo com formato geral ou registro inválido", () => {
    const databasePath = temporaryDatabasePath();
    const repository = new ColaboradorRepository(databasePath);

    for (const contents of ['{"colaboradores":[]}', '[{"matricula":"A"}]']) {
      fs.writeFileSync(databasePath, contents, "utf8");
      expect(() => repository.listar()).toThrow(/formato inválido|registro inválido/);
      expect(fs.readFileSync(databasePath, "utf8")).toBe(contents);
    }
  });

  test("preserva metadados e usa valores validados ao ler registro legado", () => {
    const databasePath = temporaryDatabasePath();
    const repository = new ColaboradorRepository(databasePath);
    fs.writeFileSync(databasePath, JSON.stringify([{
      matricula: " A ", nome: " Ana ", tipo: "Padrão", salarioBase: "100",
      id: "id-a", criadoEm: "2026-01-01T00:00:00.000Z", atualizadoEm: "2026-01-02T00:00:00.000Z",
    }]), "utf8");

    expect(repository.listar()).toEqual([{
      matricula: "A", nome: "Ana", tipo: "Padrão", salarioBase: 100,
      id: "id-a", criadoEm: "2026-01-01T00:00:00.000Z", atualizadoEm: "2026-01-02T00:00:00.000Z",
    }]);
  });

  test("lê registro sem metadados e mantém o arquivo ao alterar ou excluir matrícula ausente", () => {
    const databasePath = temporaryDatabasePath();
    const repository = new ColaboradorRepository(databasePath);
    const contents = JSON.stringify([{
      matricula: "LEGADO", nome: "Registro legado", tipo: "Padrão", salarioBase: 100,
    }]);
    fs.writeFileSync(databasePath, contents, "utf8");

    expect(repository.listar()).toEqual([{
      matricula: "LEGADO", nome: "Registro legado", tipo: "Padrão", salarioBase: 100,
    }]);
    const atualizado = new ColaboradorPadrao({
      matricula: "NOVO", nome: "Novo", tipo: "Padrão", salarioBase: 200,
    });
    expect(repository.substituir("AUSENTE", atualizado)).toBeUndefined();
    expect(repository.excluir("AUSENTE")).toBeUndefined();
    expect(fs.readFileSync(databasePath, "utf8")).toBe(contents);
  });

  test("retorna erro estruturado para validação alternativa sem campo único", async () => {
    const app = express();
    app.disable("x-powered-by");
    app.use(express.json());
    app.post(
      "/validar",
      oneOf([body("email").isEmail(), body("telefone").notEmpty()]),
      validate,
      (_req, res) => res.sendStatus(204),
    );
    const server = app.listen(0, "127.0.0.1");

    try {
      await new Promise<void>((resolve) => server.once("listening", resolve));
      const port = (server.address() as AddressInfo).port;
      const response = await fetch(`http://127.0.0.1:${port}/validar`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
      });
      const result = await response.json();
      expect(response.status).toBe(400);
      expect(result.errors[0].campo).toBe("");
      expect(typeof result.errors[0].mensagem).toBe("string");
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
    }
  });
});
