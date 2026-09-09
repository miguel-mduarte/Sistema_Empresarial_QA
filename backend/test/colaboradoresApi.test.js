const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { after, before, test } = require("node:test");
const createApp = require("../src/app");

const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "folha-clara-test-"));
const databasePath = path.join(tempDirectory, "colaboradores.json");
const app = createApp({ databasePath });
let server;
let apiUrl;

function cadastrarColaborador(dados) {
  return fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      apiUrl = `http://127.0.0.1:${port}/api/colaboradores`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve, reject) => {
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

  const persistidos = JSON.parse(fs.readFileSync(databasePath, "utf8"));
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
