# Manual técnico

## Arquitetura e dependências

Frontend React 19, TypeScript, Vite 8, React Router e CSS próprio. Backend Node.js,
TypeScript, Express 5 e Express Validator. Qualidade: Vitest, cobertura V8, ESLint
e SonarJS. Versões resolvidas estão nos dois package-lock.json; instalar com npm ci.

O fluxo HTTP passa por rota, normalização, validação, controller, service, modelos
e repositório. Controllers usam matchedData; campos externos não autorizados não
determinam id, datas ou salário final. Serviços executam regras e limites antes
de chamar o repositório. O frontend usa serviços de API, hooks de estado, páginas
e componentes reutilizáveis. O código do domínio não depende do React.

## Organização e execução

- backend/src/models: hierarquia de colaboradores, fábrica e aritmética monetária.
- backend/src/services: cadastro, consulta, alteração, exclusão e folhas.
- backend/src/data: parser do arquivo, contexto e repositório JSON.
- backend/src/validations: validação de requisições antes do cálculo.
- backend/src/controllers e routes: contrato HTTP e encaminhamento.
- backend/test: testes unitários, integração e regressão por requisito.
- frontend/src: pages, components, hooks, services, types e utils.
- frontend/test: testes unitários dos formulários e formatadores.
- scripts: servidor compilado, manutenção de dados, verificação e empacotamento.

Desenvolvimento: npm run dev em backend e frontend, com proxy /api do Vite.
Distribuição local: npm run build na raiz e npm start. O servidor integrado serve
frontend/dist e a API numa origem, e suporta reload nas rotas React. Rotas /api
inexistentes retornam 404, não o HTML da aplicação. Para encerrar: Ctrl+C.

## Modelo de dados e persistência

Arquivo JSON contendo uma lista. Campos comuns: id (UUID), matricula, nome, tipo,
salarioBase, criadoEm, atualizadoEm opcional, adicional e salarioFinal. Comissionado
inclui valorVendas e percentualComissao. Produção inclui quantidadeProduzida e
valorPorUnidade. A matrícula é única sem diferenciar maiúsculas; acentos continuam
significativos. id e criadoEm são preservados na alteração.

O arquivo é validado na leitura. A gravação usa temporário seguido de rename.
A aplicação usa um escritor por arquivo e operações síncronas; não oferece
isolamento entre múltiplos processos. Cálculos derivados são refeitos ao consultar.
Não há migração SQL porque não há SGBD relacional. O entregável 06_Banco_Dados
contém scripts equivalentes de inicialização, dados fictícios, backup e restauração.

scripts/banco_a3.mjs usa os modelos compilados e valida lista, campos, matrículas
reservadas/duplicadas e limite de remuneração/folha. init, demo, backup e restore
usam criação exclusiva; destino existente causa erro. Pare a API antes de usar.

## Contrato da API

| Método e rota | Resultado |
| --- | --- |
| POST /api/colaboradores | 201 com cadastro validado |
| GET /api/colaboradores | Lista com remuneração recalculada |
| GET /api/colaboradores/:matricula | Cadastro individual ou 404 |
| PUT /api/colaboradores/:matricula | Substitui campos e recalcula; preserva identidade |
| DELETE /api/colaboradores/:matricula | 204 ou 404 |
| GET /api/folha-pagamento | Itens, quantidade, total e totais por categoria |
| GET /api/folha-pagamento/:matricula | Folha individual |

400 identifica entrada/cálculo não suportado; 409 matrícula duplicada; 404 cadastro
inexistente; 500 problema de persistência. A resposta de erro contém mensagem.
As bases /api/colaboradores-padrao, -comissionados e -producao oferecem CRUD por
categoria, com validação de compatibilidade. Matrículas são codificadas na URL.

## Precisão e extensibilidade

valoresMonetarios.ts converte cada número decimal em fração inteira, incluindo
notação científica. Multiplicação, divisão percentual e arredondamento half-up
usam BigInt; totais somam centavos. A base e o adicional são normalizados antes
da soma final. O limite de um trilhão de reais preserva centavos no retorno JSON.
Não se utiliza Number.EPSILON como correção financeira.

Novas categorias estendem Colaborador e implementam calcularAdicional. Registrar
tipo, fábrica, parser, validação e interface é necessário; não alterar fórmulas
das categorias existentes. A fixture Bônus experimental demonstra esse mecanismo
sem incluir uma quarta categoria no sistema entregue.

## Verificação e manutenção

npm run a3:verificar executa typecheck, lint, build, Vitest com cobertura backend,
Vitest frontend e teste dos scripts de banco. Logs e relatórios são gravados em
docs/a3/evidencias. Uma falha interrompe a rodada; não representa aprovação parcial.
A cobertura mínima de 80% por arquivo é aplicada às quatro métricas do backend.
Não se afirma cobertura de interface por esse percentual.

Antes de alterações: backup, mudança pequena, teste de regressão, nova rodada de
evidências e geração do pacote. Não fazer deploy sem autorização; o pacote desta
rodada é local. Segredos, dependências instaladas, dados reais e .git não vão ao ZIP.
O manifesto identifica a revisão-base e os hashes dos arquivos alterados; não
confundir commit-base com a totalidade do conteúdo local ainda não commitado.
