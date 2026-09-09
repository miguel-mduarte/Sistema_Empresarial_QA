import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import createApp from "../src/app.js";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import type { DadosColaborador } from "../src/models/colaboradorTypes.js";

type Registro = DadosColaborador & { adicional: number; salarioFinal: number };

const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "folha-clara-test-"));
const databasePath = path.join(tempDirectory, "colaboradores.json");
const app = createApp({ databasePath });
let server: Server;
let apiRoot: string;
let apiUrl: string;

function cadastrarColaborador(dados: unknown) {
  return fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

function alterarColaborador(matricula: string, dados: unknown) {
  return fetch(`${apiUrl}/${encodeURIComponent(matricula)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

before(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as AddressInfo;
      apiRoot = `http://127.0.0.1:${port}/api`;
      apiUrl = `${apiRoot}/colaboradores`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  fs.rmSync(tempDirectory, { recursive: true, force: true });
});

test("cadastra e persiste um colaborador padrão", async () => {
  const response = await cadastrarColaborador({
    matricula: "FC-1007",
    nome: "Mariana Oliveira",
    salarioBase: 0,
    tipo: "Padrão",
  });
  const colaborador = await response.json();

  assert.equal(response.status, 201);
  assert.equal(colaborador.salarioFinal, 0);
  assert.equal(colaborador.adicional, 0);
  assert.equal(colaborador.tipo, "Padrão");
  assert.ok(colaborador.id);

  const persistidos = (JSON.parse(fs.readFileSync(databasePath, "utf8")) as Registro[]);
  assert.deepEqual(persistidos, [colaborador]);
});

test("lista e consulta colaboradores persistidos", async () => {
  const listResponse = await fetch(apiUrl);
  const colaboradores = await listResponse.json();
  const detailResponse = await fetch(`${apiUrl}/fc-1007`);
  const colaborador = await detailResponse.json();

  assert.equal(listResponse.status, 200);
  assert.equal(colaboradores.length, 1);
  assert.equal(detailResponse.status, 200);
  assert.equal(colaborador.nome, "Mariana Oliveira");
});

test("rejeita matrícula duplicada sem diferenciar maiúsculas", async () => {
  const response = await cadastrarColaborador({
    matricula: "fc-1007",
    nome: "Outro nome",
    salarioBase: 1000,
    tipo: "Padrão",
  });

  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), {
    mensagem: "A matrícula já está cadastrada.",
  });
});

test("cadastra colaborador comissionado e calcula a comissão", async () => {
  const response = await cadastrarColaborador({
    matricula: "FC-1008",
    nome: "Bruno Martins",
    salarioBase: 2000,
    tipo: "Comissionado",
    valorVendas: 10500,
    percentualComissao: 7.5,
  });
  const colaborador = await response.json();

  assert.equal(response.status, 201);
  assert.equal(colaborador.adicional, 787.5);
  assert.equal(colaborador.salarioFinal, 2787.5);
  assert.equal(colaborador.valorVendas, 10500);
  assert.equal(colaborador.percentualComissao, 7.5);
});

test("cadastra colaborador por produção e calcula a produtividade", async () => {
  const response = await cadastrarColaborador({
    matricula: "FC-1009",
    nome: "Camila Rocha",
    salarioBase: 1800,
    tipo: "Produção",
    quantidadeProduzida: 180,
    valorPorUnidade: 12.35,
  });
  const colaborador = await response.json();

  assert.equal(response.status, 201);
  assert.equal(colaborador.adicional, 2223);
  assert.equal(colaborador.salarioFinal, 4023);
  assert.equal(colaborador.quantidadeProduzida, 180);
  assert.equal(colaborador.valorPorUnidade, 12.35);
});

test("recalcula salários ao consultar os registros persistidos", async () => {
  const persistidos = (JSON.parse(fs.readFileSync(databasePath, "utf8")) as Registro[]);
  const comissionado = persistidos.find(
    (colaborador) => colaborador.tipo === "Comissionado",
  );
  const producao = persistidos.find(
    (colaborador) => colaborador.tipo === "Produção",
  );

  assert.ok(comissionado);
  assert.ok(producao);
  comissionado.adicional = 1;
  comissionado.salarioFinal = 1;
  producao.adicional = 1;
  producao.salarioFinal = 1;
  fs.writeFileSync(databasePath, JSON.stringify(persistidos), "utf8");

  const response = await fetch(apiUrl);
  const colaboradores = await response.json() as Registro[];
  const comissionadoCalculado = colaboradores.find(
    (colaborador) => colaborador.tipo === "Comissionado",
  );
  const producaoCalculada = colaboradores.find(
    (colaborador) => colaborador.tipo === "Produção",
  );

  assert.equal(response.status, 200);
  assert.ok(comissionadoCalculado);
  assert.ok(producaoCalculada);
  assert.equal(comissionadoCalculado.adicional, 787.5);
  assert.equal(comissionadoCalculado.salarioFinal, 2787.5);
  assert.equal(producaoCalculada.adicional, 2223);
  assert.equal(producaoCalculada.salarioFinal, 4023);
});

test("gera a folha consolidada e o valor total", async () => {
  const response = await fetch(`${apiRoot}/folha-pagamento`);
  const folha = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(folha.resumo, {
    quantidadeColaboradores: 3,
    totalFolha: 6810.5,
  });
  assert.deepEqual(folha.itens, [
    {
      matricula: "FC-1007",
      nome: "Mariana Oliveira",
      tipo: "Padrão",
      salarioFinal: 0,
    },
    {
      matricula: "FC-1008",
      nome: "Bruno Martins",
      tipo: "Comissionado",
      salarioFinal: 2787.5,
    },
    {
      matricula: "FC-1009",
      nome: "Camila Rocha",
      tipo: "Produção",
      salarioFinal: 4023,
    },
  ]);
});

test("valida valores negativos e tipos desconhecidos", async () => {
  const invalidSalary = await cadastrarColaborador({
    matricula: "FC-1010",
    nome: "Nome válido",
    salarioBase: -1,
    tipo: "Padrão",
  });
  const invalidCommission = await cadastrarColaborador({
    matricula: "FC-1011",
    nome: "Nome válido",
    salarioBase: 1000,
    tipo: "Comissionado",
    valorVendas: 500,
    percentualComissao: -1,
  });
  const invalidType = await cadastrarColaborador({
    matricula: "FC-1012",
    nome: "Nome válido",
    salarioBase: 1000,
    tipo: "Terceirizado",
  });

  assert.equal(invalidSalary.status, 400);
  assert.equal(invalidCommission.status, 400);
  assert.equal(invalidType.status, 400);
});

test("altera um colaborador, preserva sua identidade e recalcula o salário", async () => {
  const persistidosAntes = (JSON.parse(fs.readFileSync(databasePath, "utf8")) as Registro[]);
  const colaboradorAntes = persistidosAntes.find(
    (colaborador) => colaborador.matricula === "FC-1007",
  );
  const response = await alterarColaborador("fc-1007", {
    matricula: "FC-2007",
    nome: "Mariana Oliveira Atualizada",
    salarioBase: 1000,
    tipo: "Comissionado",
    valorVendas: 2000,
    percentualComissao: 10,
  });
  const colaborador = await response.json();

  assert.equal(response.status, 200);
  assert.ok(colaboradorAntes);
  assert.equal(colaborador.id, colaboradorAntes.id);
  assert.equal(colaborador.criadoEm, colaboradorAntes.criadoEm);
  assert.ok(colaborador.atualizadoEm);
  assert.equal(colaborador.adicional, 200);
  assert.equal(colaborador.salarioFinal, 1200);

  const consultaAntiga = await fetch(`${apiUrl}/FC-1007`);
  const consultaAtualizada = await fetch(`${apiUrl}/FC-2007`);
  assert.equal(consultaAntiga.status, 404);
  assert.equal(consultaAtualizada.status, 200);

  const persistidosDepois = (JSON.parse(fs.readFileSync(databasePath, "utf8")) as Registro[]);
  assert.equal(persistidosDepois.length, 3);
  assert.deepEqual(
    persistidosDepois.find((item) => item.matricula === "FC-2007"),
    colaborador,
  );
});

test("impede matrícula duplicada durante uma alteração", async () => {
  const response = await alterarColaborador("FC-2007", {
    matricula: "fc-1008",
    nome: "Mariana Oliveira Atualizada",
    salarioBase: 1000,
    tipo: "Padrão",
  });

  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), {
    mensagem: "A matrícula já está cadastrada.",
  });
});

test("exclui o colaborador do arquivo JSON e atualiza a folha", async () => {
  const response = await fetch(`${apiUrl}/fc-2007`, { method: "DELETE" });
  const consulta = await fetch(`${apiUrl}/FC-2007`);
  const folhaResponse = await fetch(`${apiRoot}/folha-pagamento`);
  const folha = await folhaResponse.json();
  const persistidos = (JSON.parse(fs.readFileSync(databasePath, "utf8")) as Registro[]);

  assert.equal(response.status, 204);
  assert.equal(consulta.status, 404);
  assert.equal(persistidos.length, 2);
  assert.equal(
    persistidos.some((colaborador) => colaborador.matricula === "FC-2007"),
    false,
  );
  assert.deepEqual(folha.resumo, {
    quantidadeColaboradores: 2,
    totalFolha: 6810.5,
  });
});

test("responde 404 ao alterar ou excluir cadastro inexistente", async () => {
  const alteracao = await alterarColaborador("NAO-EXISTE", {
    matricula: "FC-9999",
    nome: "Nome válido",
    salarioBase: 1000,
    tipo: "Padrão",
  });
  const exclusao = await fetch(`${apiUrl}/NAO-EXISTE`, { method: "DELETE" });

  assert.equal(alteracao.status, 404);
  assert.equal(exclusao.status, 404);
});

test("aplica RN002 a RN007 a todos os dados de remuneração", async () => {
  const casosInvalidos = [
    {
      matricula: "RN-002",
      nome: "   ",
      salarioBase: 1000,
      tipo: "Padrão",
    },
    {
      matricula: "RN-003",
      nome: "Nome válido",
      salarioBase: -0.01,
      tipo: "Padrão",
    },
    {
      matricula: "RN-004",
      nome: "Nome válido",
      salarioBase: 1000,
      tipo: "Comissionado",
      valorVendas: -0.01,
      percentualComissao: 10,
    },
    {
      matricula: "RN-005",
      nome: "Nome válido",
      salarioBase: 1000,
      tipo: "Comissionado",
      valorVendas: 100,
      percentualComissao: -0.01,
    },
    {
      matricula: "RN-006",
      nome: "Nome válido",
      salarioBase: 1000,
      tipo: "Produção",
      quantidadeProduzida: -1,
      valorPorUnidade: 10,
    },
    {
      matricula: "RN-007",
      nome: "Nome válido",
      salarioBase: 1000,
      tipo: "Produção",
      quantidadeProduzida: 1,
      valorPorUnidade: -0.01,
    },
  ];

  for (const casoInvalido of casosInvalidos) {
    const response = await cadastrarColaborador(casoInvalido);
    assert.equal(response.status, 400, casoInvalido.matricula);
  }
});

test("as rotas de categoria fixam o tipo e permitem CRUD com isolamento", async () => {
  const categorias = [
    { rota: "padrao", tipo: "Padrão", adicionais: {}, salarioFinal: 1000 },
    { rota: "comissionados", tipo: "Comissionado", adicionais: { valorVendas: 2000, percentualComissao: 10 }, salarioFinal: 1200 },
    { rota: "producao", tipo: "Produção", adicionais: { quantidadeProduzida: 20, valorPorUnidade: 5 }, salarioFinal: 1100 },
  ];

  for (const categoria of categorias) {
    const url = `${apiUrl}-${categoria.rota}`;
    const dados = { matricula: `ROTA-${categoria.rota}`, nome: "Teste de rota", salarioBase: 1000, ...categoria.adicionais };
    const options = { headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) };
    const cadastro = await fetch(url, { ...options, method: "POST" });
    const criado = await cadastro.json();
    assert.equal(cadastro.status, 201);
    assert.equal(criado.tipo, categoria.tipo);
    assert.equal(criado.salarioFinal, categoria.salarioFinal);

    const lista = await (await fetch(url)).json() as Registro[];
    assert.ok(lista.length > 0);
    assert.ok(lista.every((registro) => registro.tipo === categoria.tipo));
    const detalhe = await fetch(`${url}/${dados.matricula}`);
    assert.equal(detalhe.status, 200);

    const outraRota = categoria.rota === "padrao" ? "producao" : "padrao";
    const alvoIncorreto = `${apiUrl}-${outraRota}/${dados.matricula}`;
    for (const method of ["GET", "DELETE"]) {
      assert.equal((await fetch(alvoIncorreto, { method })).status, 404);
    }
    const alteracaoOutraCategoria = {
      ...options,
      method: "PUT",
      body: JSON.stringify({ ...dados, quantidadeProduzida: 10, valorPorUnidade: 2 }),
    };
    assert.equal((await fetch(alvoIncorreto, alteracaoOutraCategoria)).status, 404);
    const alteracao = await fetch(`${url}/${dados.matricula}`, {
      method: "PUT",
      headers: options.headers,
      body: JSON.stringify({ ...dados, nome: "Nome atualizado", salarioBase: 2000 }),
    });
    const atualizado = await alteracao.json();
    assert.equal(alteracao.status, 200);
    assert.equal(atualizado.id, criado.id);
    assert.equal(atualizado.salarioFinal, categoria.salarioFinal + 1000);
    assert.equal((await fetch(`${url}/${dados.matricula}`, { method: "DELETE" })).status, 204);
    assert.equal((await fetch(`${url}/${dados.matricula}`)).status, 404);
  }
});

test("rejeita tipo incompatível, corpo ausente e JSON malformado", async () => {
  const tipoIncompativel = await fetch(`${apiUrl}-padrao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matricula: "TIPO", nome: "Nome", salarioBase: 1000, tipo: "Produção" }),
  });
  assert.equal(tipoIncompativel.status, 400);
  assert.equal((await fetch(apiUrl, { method: "POST" })).status, 400);
  const jsonInvalido = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(jsonInvalido.status, 400);
  assert.deepEqual(await jsonInvalido.json(), { mensagem: "O corpo da requisição contém JSON inválido." });
});

test("mantém compatibilidade com tipoColaborador e com dados após reiniciar", async () => {
  const cadastro = await cadastrarColaborador({
    matricula: "ALIAS", nome: "Nome", salarioBase: 100, tipoColaborador: "Padrão",
  });
  assert.equal(cadastro.status, 201);
  const outraApp = createApp({ databasePath });
  const outroServidor = await new Promise<Server>((resolve) => {
    const iniciado = outraApp.listen(0, "127.0.0.1", () => resolve(iniciado));
  });
  try {
    const { port } = outroServidor.address() as AddressInfo;
    const consulta = await fetch(`http://127.0.0.1:${port}/api/colaboradores/ALIAS`);
    assert.equal(consulta.status, 200);
    assert.equal((await consulta.json()).salarioFinal, 100);
  } finally {
    await new Promise<void>((resolve, reject) => {
      outroServidor.close((error) => error ? reject(error) : resolve());
    });
    await fetch(`${apiUrl}/ALIAS`, { method: "DELETE" });
  }
});

test("routers compartilhados mantêm os arquivos JSON isolados por aplicação", async () => {
  const appIsolada = createApp({ databasePath: path.join(tempDirectory, "isolado.json") });
  const servidorIsolado = await new Promise<Server>((resolve) => {
    const iniciado = appIsolada.listen(0, "127.0.0.1", () => resolve(iniciado));
  });
  try {
    const { port } = servidorIsolado.address() as AddressInfo;
    const url = `http://127.0.0.1:${port}/api/colaboradores`;
    const cadastro = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matricula: "ISOLADO", nome: "Teste", tipo: "Padrão", salarioBase: 100 }),
    });
    assert.equal(cadastro.status, 201);
    assert.equal((await fetch(`${url}/ISOLADO`)).status, 200);
    assert.equal((await fetch(`${apiUrl}/ISOLADO`)).status, 404);
    const folhaPrincipal = await (await fetch(`${apiRoot}/folha-pagamento`)).json();
    assert.equal(folhaPrincipal.resumo.totalFolha, 6810.5);
  } finally {
    await new Promise<void>((resolve, reject) => {
      servidorIsolado.close((error) => error ? reject(error) : resolve());
    });
  }
});

test("express-validator normaliza campos e descarta dados não autorizados", async () => {
  const cadastro = await cadastrarColaborador({
    matricula: "  VALIDATOR  ", nome: "  Nome validado  ", tipo: "Padrão",
    salarioBase: "1234.50", id: "forjado", salarioFinal: 1,
    valorVendas: 999, campoExtra: "ignorar",
  });
  const registro = await cadastro.json();
  assert.equal(cadastro.status, 201);
  assert.equal(registro.nome, "Nome validado");
  assert.equal(registro.matricula, "VALIDATOR");
  assert.equal(registro.salarioBase, 1234.5);
  assert.equal(registro.salarioFinal, 1234.5);
  assert.notEqual(registro.id, "forjado");
  assert.equal(registro.campoExtra, undefined);
  assert.equal(registro.valorVendas, undefined);
  await fetch(`${apiUrl}/VALIDATOR`, { method: "DELETE" });
});

test("express-validator retorna erros de campos sem alterar o arquivo", async () => {
  const antes = fs.readFileSync(databasePath, "utf8");
  for (const valor of [null, true, [], {}, " ", "abc", -1]) {
    const resposta = await cadastrarColaborador({
      matricula: "INVALIDO", nome: "Teste", tipo: "Comissionado",
      salarioBase: 1000, valorVendas: valor, percentualComissao: 10,
    });
    assert.equal(resposta.status, 400);
    const resultado = await resposta.json();
    assert.equal(typeof resultado.mensagem, "string");
    assert.ok(resultado.errors.some((erro: { campo: string }) => erro.campo === "valorVendas"));
  }
  assert.equal(fs.readFileSync(databasePath, "utf8"), antes);
});

test("arquivo corrompido resulta em 500 e não é sobrescrito", async () => {
  const anterior = fs.readFileSync(databasePath, "utf8");
  try {
    fs.writeFileSync(databasePath, "{invalido", "utf8");
    const resposta = await fetch(apiUrl);
    assert.equal(resposta.status, 500);
    assert.equal(fs.readFileSync(databasePath, "utf8"), "{invalido");
  } finally {
    fs.writeFileSync(databasePath, anterior, "utf8");
  }
});
