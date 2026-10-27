/* eslint-disable sonarjs/no-floating-point-equality -- A saída em centavos deve ser exata, não aproximada. */
import { afterAll, beforeAll, beforeEach, expect, test } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import createApp from "../src/app.js";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "a3-precisao-"));
const databasePath = path.join(dir, "dados.json");
let server: Server;
let url: string;
beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = createApp({ databasePath }).listen(0, "127.0.0.1", () => {
      url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
      resolve();
    });
  });
});
beforeEach(() => fs.writeFileSync(databasePath, "[]\n"));
afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  fs.rmSync(dir, { recursive: true });
});
const dados = (matricula: string, salarioBase: number) => ({ matricula, salarioBase, nome: "Teste", tipo: "Padrão" });
const gravar = (body: object, matricula?: string) => fetch(url + "/colaboradores" + (matricula ? "/" + matricula : ""), {
  method: matricula ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});

test("RF003/RF006/RF007/RF008 - comissão corrigida persiste e aparece nas duas folhas", async () => {
  const res = await gravar({ ...dados("C", 1000), tipo: "Comissionado", valorVendas: 4.27, percentualComissao: 50 });
  expect(res.status).toBe(201);
  expect((await res.json()).salarioFinal).toBe(1002.14);
  expect(JSON.parse(fs.readFileSync(databasePath, "utf8"))[0].adicional).toBe(2.14);
  const individual = await (await fetch(`${url}/folha-pagamento/C`)).json();
  const folha = await (await fetch(`${url}/folha-pagamento`)).json();
  expect(individual.salarioFinal).toBe(1002.14);
  expect(folha.resumo.totalFolha).toBe(1002.14);
  expect(folha.resumo.totaisPorCategoria[1].total).toBe(1002.14);
});

test("RF008/RF009 - rejeita cadastro e alteração que excedem total sem alterar o JSON", async () => {
  expect((await gravar(dados("A", 6e11))).status).toBe(201);
  expect((await gravar(dados("B", 1))).status).toBe(201);
  const antes = fs.readFileSync(databasePath, "utf8");
  expect((await gravar(dados("C", 6e11))).status).toBe(400);
  expect((await gravar(dados("B", 6e11), "B")).status).toBe(400);
  expect(fs.readFileSync(databasePath, "utf8")).toBe(antes);
  const folha = await (await fetch(`${url}/folha-pagamento`)).json();
  expect(folha.resumo.totalFolha).toBe(600000000001);
});
