# Reteste técnico de impressão - DEF-006

Em 27/10/2026, o QA enviou imagem com corte de colunas e rolagem na impressão.
Correção em styles.css: regras responsivas limitadas à tela; A4 com margens de
12 mm; tabela de largura fixa e quebra de texto; sem overflow horizontal oculto;
cabeçalho de tabela repetido; linhas e resumos protegidos de quebras internas.

Executado scripts/test_impressao_a3.mjs com Chrome headless e API simulada para
dados fictícios determinísticos. Seis cenários aprovados: consolidada, individual
e consolidada de 80 registros, cada um iniciado em 1366x844 e 390x844.
Foram verificadas largura útil A4, ausência de conteúdo excedendo células e
PDFs gerados pelo mecanismo de impressão do Chrome. Inspeção visual dos PDFs
consolidado/individual e das seis páginas do caso longo sem cortes laterais.
Esses cenários são separados dos 90 testes anteriores; não são testes Vitest.

PDFs e resultado.json em output/a3/impressao e em 04_Testes/impressao no ZIP.
Reprodução: iniciar servidor compilado e executar node scripts/test_impressao_a3.mjs
com PLAYWRIGHT_MODULE apontando ao index.mjs do Playwright instalado,
CHROME_PATH ao executável Chrome e PRINT_BASE_URL à URL local.

Atualização em 27/10/2026: Felipe Vergara Chico (QA) confirmou que
já realizou o teste manual descrito no CT-A3-010 após a correção. Caso aprovado
por relato do responsável; ressalva encerrada. Não foram anexados novos PDFs
manuais. Os PDFs desta pasta continuam sendo os produzidos automaticamente.
