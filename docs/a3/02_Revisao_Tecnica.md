# Revisão técnica

Revisão técnica realizada em 27/10/2026 sobre frontend, backend, testes e scripts.
Método: inspeção de código e análise dos resultados de testes. A revisão não
substitui a avaliação acadêmica do professor.

## Não conformidades e providências

1. Precisão monetária inconsistente: substituída a multiplicação binária por frações
   decimais com BigInt. Base e adicional normalizados para centavos; soma final exata.
2. Total sem limite: aplicada a mesma proteção ao total geral e às categorias,
   com validação do estado resultante antes da persistência de cadastro/alteração.
3. Testes de cálculo indiretos: adicionada suíte unitária específica, incluindo
   10 mil comissões comparadas com referência inteira independente.
4. Ausência de testes do frontend: incluídos testes Vitest das funções de formulário,
   montagem de payload, preenchimento de edição e apresentação de valores inválidos.
5. Execução dependente do Vite: adicionado servidor local da versão compilada,
   frontend e API na mesma origem, com fallback para rotas da aplicação.
6. Operação do JSON não documentada: scripts init, demo, check, backup e restore
   validados em diretórios temporários; nenhuma operação sobrescreve arquivo existente.

## Decisões técnicas vigentes

- Arredondamento decimal half-up em duas casas. Os decimais são obtidos da
  representação textual do número recebido, antes de multiplicações. BigInt só é
  usado internamente; a API continua retornando números JSON.
- Limite técnico: R$ 1.000.000.000.000,00 por base, adicional, salário final e total.
  Não é teto salarial do cliente: evita perda de centavos no contrato JSON numérico.
- Soma utiliza centavos inteiros. Operações que excedem o limite são recusadas com
  erro 400, sem mutar os dados. Registros antigos são recalculados ao consultar.
- Entradas com mais de duas casas na base são arredondadas ao salvar. Percentual
  e quantidades podem ter fração; o cliente não exigiu quantidade inteira ou teto de 100%.
- Persistência continua JSON, com um processo escritor por arquivo. Não é um banco
  SQL nem um serviço multiusuário com controle transacional concorrente.

Estas decisões atualizam D03 e D06 da ERS da A1, sem reescrever o artefato histórico.
As fórmulas comerciais continuam iguais; somente a representação numérica mudou.

## Extensibilidade e CT-030

A classe base aceita um identificador de categoria genérico. O teste isolado cria
uma subclasse Bônus experimental e uma fábrica local de teste. Base=1000 e bônus=100
geram 1100; Padrão, Comissionado e Produção continuam gerando 1000, 1200 e 1100 nos
exemplos de referência. A categoria experimental não entra na aplicação de produção.

Para adicionar uma categoria real: declarar dados, criar a subclasse, registrar
na fábrica, parser e validações, adicionar campos/opção na interface e cobrir API
e relatórios. As fórmulas das três classes existentes não precisam ser alteradas.
O experimento da A3 usa fixture automatizada, em vez de um ramo Git permanente;
isso substitui o procedimento planejado na A1 e é explicitamente rastreado.

## Lições aprendidas e limitações

Cobertura alta não comprova todos os resultados: os defeitos decimais passaram
despercebidos em uma suíte com mais de 98% de linhas cobertas. Casos de fronteira
e valores esperados calculados independentemente são necessários.
Não misturar aprovação automatizada com aceitação humana. A conferência visual
da interface não valida o PDF de impressão nem substitui uma avaliação de acessibilidade.
O sistema não implementa autenticação, tributos, histórico mensal ou múltiplos
escritores concorrentes; esses itens não constam do escopo solicitado pelo cliente.
