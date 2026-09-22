import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { AddressInfo } from "node:net";
import createApp from "../src/app.js";

test("relatórios individuais refletem cadastro, alteração, exclusão e total por categoria", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "relatorios-test-"));
  const app = createApp({ databasePath: path.join(directory, "dados.json") });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const root = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
  const casos = [
    { matricula: "PAD", nome: "Padrão", tipo: "Padrão", salarioBase: 1000.25 },
    { matricula: "COM", nome: "Comissão", tipo: "Comissionado", salarioBase: 2000, valorVendas: 1000, percentualComissao: 10 },
    { matricula: "PRO", nome: "Produção", tipo: "Produção", salarioBase: 1500, quantidadeProduzida: 10, valorPorUnidade: 2.5 },
    { matricula: "PAD2", nome: "Outro padrão", tipo: "Padrão", salarioBase: 0.1 },
  ];
  try {
    for (const dados of casos) {
      const cadastro = await fetch(`${root}/colaboradores`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados),
      });
      assert.equal(cadastro.status, 201);
      const criado = await cadastro.json();
      const response = await fetch(`${root}/folha-pagamento/${dados.matricula.toLowerCase()}`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), {
        matricula: dados.matricula, nome: dados.nome, tipo: dados.tipo,
        salarioBase: criado.salarioBase, adicional: criado.adicional, salarioFinal: criado.salarioFinal,
      });
    }
    const folha = await (await fetch(`${root}/folha-pagamento`)).json();
    assert.deepEqual(folha.resumo, {
      quantidadeColaboradores: 4, totalFolha: 4625.35,
      totaisPorCategoria: [
        { tipo: "Padrão", quantidadeColaboradores: 2, total: 1000.35 },
        { tipo: "Comissionado", quantidadeColaboradores: 1, total: 2100 },
        { tipo: "Produção", quantidadeColaboradores: 1, total: 1525 },
      ],
    });
    const alteracao = await fetch(`${root}/colaboradores/PAD`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...casos[0], salarioBase: 3000 }),
    });
    assert.equal(alteracao.status, 200);
    assert.equal((await (await fetch(`${root}/folha-pagamento/PAD`)).json()).salarioFinal, 3000);
    assert.equal((await fetch(`${root}/colaboradores/PAD`, { method: "DELETE" })).status, 204);
    assert.equal((await fetch(`${root}/folha-pagamento/PAD`)).status, 404);
    assert.equal((await fetch(`${root}/folha-pagamento/INEXISTENTE`)).status, 404);
    assert.equal((await fetch(`${root}/folha-pagamento/%20`)).status, 400);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
