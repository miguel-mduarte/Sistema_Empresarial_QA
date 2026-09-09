# Backend — Folha Clara

API Express em TypeScript estrito, com ES Modules (`"type": "module"`).
Os registros continuam persistidos em arquivo JSON, sem banco de dados.

## Executar

Requer Node.js 22.13 ou superior (incluindo as ferramentas de desenvolvimento).

```sh
npm install --registry=https://registry.npmmirror.com
npm run dev
```

O servidor usa a porta 3000 por padrão. As variáveis estão documentadas em
`.env.example`; podem ser fornecidas pelo ambiente ou por um arquivo `.env`.
`COLABORADORES_DB_PATH` mantém compatibilidade com a configuração anterior.
Sem essa variável, o arquivo é `backend/data/colaboradores.json`, tanto em
desenvolvimento quanto no código compilado.

```sh
npm run build
npm start
```

O comando de build gera `dist/`. Os imports locais usam a extensão `.js`
para funcionarem diretamente no Node após a compilação.

## Organização

```text
src/
  app.ts          Única entrada: ambiente, Express, rotas e servidor HTTP
  controllers/    Entrada e saída HTTP
  models/         Classes, tipos e fábrica de colaboradores
  validations/    Chains de express-validator para corpo e parâmetros
  middlewares/    Normalização do tipo e tratamento de validationResult
  routes/         Routers por classe/categoria e folha de pagamento
  services/       Regras de cadastro, manutenção e geração da folha
  data/           Repositório que lê e grava o JSON
  errors/         Erros de negócio e tratamento centralizado
test/             Testes de integração em TypeScript
data/             Arquivo JSON persistido (ignorado pelo Git)
```

As pastas de código usam minúsculas, seguindo o padrão do projeto.
O JSON de registros fica separado do código da camada `src/data`.

Controllers e services exportam funções nomeadas, seguindo o estilo do
`mesa-facil-api`. As rotas importam essas funções diretamente e exportam
um `Router` pronto, registrado em `app.ts` com `app.use(caminho, router)`.
Não há classes, construtores ou `bind` nos controllers.

O repositório JSON é configurado por aplicação em `app.locals`; os controllers
obtêm essa configuração por `data/colaboradorContext.ts` e passam o repositório
às funções dos services. Isso permite testar aplicações com arquivos distintos
sem alterar configuração global. As classes de domínio e seus cálculos permanecem
na camada `models`.

As rotas executam `colaboradorValidation()`, `validate` e o controller, nessa
ordem, como no projeto de referência. Os controllers usam `matchedData` para
obter apenas os campos validados. Erros de entrada retornam 400 com `mensagem`
e uma lista `errors`, preservando o contrato do frontend.
O parser em `data` confere o arquivo persistido; ele não valida requisições HTTP.

`app.ts` configura e inicia o servidor quando executado diretamente.
A função exportada permite criar aplicações isoladas nos testes sem iniciar
o servidor de desenvolvimento. Não há um segundo arquivo de entrada.

## Rotas

| Base | Recurso |
| --- | --- |
| `/api/colaboradores` | Todos os colaboradores; aceita `tipo` ou `tipoColaborador` |
| `/api/colaboradores-padrao` | Classe ColaboradorPadrao |
| `/api/colaboradores-comissionados` | Classe ColaboradorComissionado |
| `/api/colaboradores-producao` | Classe ColaboradorProducao |

Cada base oferece `GET /`, `POST /`, `GET /:matricula`,
`PUT /:matricula` e `DELETE /:matricula`.
Nas rotas de categoria, o tipo é definido pela rota. Um tipo incompatível
no corpo recebe 400 e o acesso a matrícula de outra categoria recebe 404.
O `PUT` continua recebendo o cadastro completo.

`GET /api/folha-pagamento` retorna `{ itens, resumo }`, preservando o
contrato usado pelo frontend.

Exemplo de corpo para `POST /api/colaboradores-comissionados`:

```json
{
  "matricula": "FC-001",
  "nome": "Exemplo",
  "salarioBase": 2000,
  "valorVendas": 10000,
  "percentualComissao": 5
}
```

## Verificar

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Os testes usam uma porta HTTP livre e um diretório temporário com JSON próprio,
removido ao final. Não utilizam os registros de desenvolvimento.
