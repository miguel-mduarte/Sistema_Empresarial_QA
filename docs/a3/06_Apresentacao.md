# Roteiro de apresentação

## Preparação

Instalar dependências e compilar antes da aula. Criar dados fictícios em arquivo
novo com npm run banco -- demo dados-demo.json. Iniciar npm start apontando
COLABORADORES_DB_PATH para esse arquivo. Testar o navegador e a impressão antes.
Levar o dossiê e o ZIP; não depender apenas de acesso à internet ou ao GitHub.

## Demonstração sugerida em oito minutos

1. Objetivo e escopo: folha acadêmica de três categorias, sem tributos ou histórico mensal.
2. Stack e arquitetura: React/TypeScript, API Express, modelos orientados a objetos e JSON.
3. Cadastrar um comissionado com base 1000, vendas 4,27 e 50%; mostrar final 1002,14.
4. Exibir os três tipos, alterar a base e demonstrar recálculo; excluir um dado fictício.
5. Abrir folha individual, consolidada, totais por categoria e prévia de impressão.
6. Mostrar testes por requisito, relatório da rodada atual e escopo da cobertura.
7. Explicar os cinco defeitos registrados e o que os testes de regressão protegem.
8. Mostrar manuais, manifesto da versão e termo de homologação para a decisão do avaliador.

## Divisão sugerida

Felipe: testes e métricas. Nicolas: requisitos e documentação. Victor: interface e
demonstração. Miguel: backend e persistência. A divisão é proposta, não registro
de quem já apresentou ou aprovou cada parte.

## Perguntas esperadas

Por que JSON? Atende persistência do cliente em execução local com um escritor;
os limites estão documentados. Se o professor exigir um SGBD especificamente,
isso requer uma alteração de persistência antes do aceite, não afirmar que JSON é SQL.
Por que BigInt? Evita erro binário ao calcular centavos; a API continua numérica.
Cobertura significa ausência de bugs? Não. Há testes de fronteira, integração e
aceitação; a impressão e o aceite humano têm evidências próprias.
