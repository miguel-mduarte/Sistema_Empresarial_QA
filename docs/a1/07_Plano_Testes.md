# 7. Plano de testes

## Escopo

RF001-RF009, RN001-RN008 e RNF001-RNF004: cadastro das três categorias,
manutenção, cálculos, folhas, totais, entradas inválidas, persistência,
usabilidade e extensibilidade. Não se planejam testes de tributos, login,
folha mensal ou integrações não especificadas.

## Estratégia e níveis

Testar caminhos positivos, classes de equivalência (válido, vazio, inválido),
fronteiras (zero e negativo), duplicidade e ciclo de vida do cadastro.
Verificar valores esperados por cálculo independente e dados fictícios.
Executar a suíte completa após mudanças que afetem contratos, modelos ou dados.

| Nível / técnica | Situação | Ferramenta / evidência |
| --- | --- | --- |
| Unidade | Parser, contexto e repositório testados diretamente | Vitest, cobertura V8 |
| Integração | API real + validação + domínio + JSON | Vitest e fetch, portas e diretórios temporários |
| Funcional por requisito | Um teste nominal por RF001-RF009 | requisitosFuncionais.test.ts |
| Aceitação da interface | Planejada; não executada nesta entrega | CT-029, observação e registro pelo operador |
| Revisão de extensibilidade | Planejada; critérios explicitados | CT-030, revisão de classes e pontos de registro |

Os testes RF são de integração funcional; não são todos unitários. Casos de
relatório individual e resumo por categoria estão na suíte de relatórios.
Automação atual não comprova impressão visual, acessibilidade ou tarefas de
usuário no navegador.

## Ambiente e ferramentas

Node >=22.13, npm, TypeScript, Vitest, V8, ESLint e navegador moderno. Execução
local em Linux; frontend Vite e API Express. Dados em diretórios temporários
separados do JSON de desenvolvimento, removidos ao encerrar. HTTP local usa
porta livre; não precisa de internet para executar testes com dependências já
instaladas. Instalação requer acesso ao registry configurado.

## Procedimento reproduzível

1. Na raiz, instalar dependências com `npm ci` em backend e frontend conforme README.
2. No backend, executar `npm run test:coverage`; examinar testes e limites por arquivo.
3. Executar `npm run typecheck`, `npm run lint` e `npm run build` em cada projeto.
4. Para evidência legível por máquina: adicionar `-- --reporter=default --reporter=json --outputFile=/caminho/resultados.json` ao comando de cobertura.
5. Registrar data, revisão Git, comando, resultado, falhas e cobertura; relacionar ao CT.
6. Para CTs manuais, iniciar frontend/API com dados fictícios e registrar o observado sem preencher antecipadamente o resultado.

CT001-009 são independentes. Os CTs adicionais documentam cenários das suítes
existentes: alguns compartilham preparação sequencial dentro do arquivo. Ao
reproduzir evidências automatizadas, executar a suíte completa. Para reprodução
manual/API isolada, preparar exatamente a pré-condição indicada em cada CT.

## Entrada, saída e aprovação

Entrada: ERS disponível, dependências instaladas, código compilável, JSON de
teste isolado e permissão para HTTP local. Bloqueios do ambiente são registrados
e resolvidos antes de classificar falha como defeito do produto.
Saída da rodada automatizada: todos os testes executados, zero falhas e zero
ignorados, cobertura >=80% por arquivo, verificações estáticas e builds aprovados.
Saída A1: pelo menos 20 CTs completos e rastreáveis, resultados disponíveis
registrados com evidência, testes futuros identificados como não executados.
Aceite A3: executar também os testes manuais planejados e obter aceite do cliente.

## Suspensão, retomada e registro

Suspender se o ambiente não abre porta ou o dado de preparação está incorreto.
Preservar o diagnóstico; corrigir o ambiente e repetir a rodada pertinente.
Falha de asserção reproduzível gera registro de defeito pelo modelo do PGQ.
Reteste deve identificar a correção e executar regressão dos fluxos afetados.
Sem execução, deixar as três opções de status desmarcadas; não confundir
“não executado” com “bloqueado”.
