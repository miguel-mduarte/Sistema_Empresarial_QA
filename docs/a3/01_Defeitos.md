# Registro de defeitos

Os cinco primeiros defeitos foram registrados nas auditorias anteriores.
DEF-006 foi relatado pelo QA com imagem da impressão em 27/10/2026.
As três primeiras correções já existiam; as demais foram implementadas na A3.
Status corrigido significa correção e regressão técnica aprovadas, não homologação.

| ID | Descrição e impacto | Severidade / prioridade | Status e solução | Reteste |
| --- | --- | --- | --- | --- |
| DEF-001 | Entradas numéricas como 0x10 ou 1e309 podiam persistir null e bloquear consultas | Alta / P1 | Corrigido; formato decimal, finitude e conversão consistente antes de gravar | colaboradoresApi: números inválidos em POST e PUT; arquivo inalterado |
| DEF-002 | Cálculo extremo retornava null e a tela apresentava R$ 0,00 | Média / P2 | Corrigido; limite explícito, aritmética decimal e mensagem de valor indisponível | colaboradoresApi: estouro numérico; valoresMonetarios: produtos e limites |
| DEF-003 | Matrículas ponto e dois pontos consecutivos quebravam navegação e edição | Média / P2 | Corrigido; rejeição na API e formulário | colaboradoresApi e formulario: reservadas; REG.01 continua válido |
| DEF-004 | Comissão de 50% sobre 4,27 resultava em 2,13, não 2,14 | Alta / P1 | Corrigido; frações decimais com BigInt e arredondamento half-up | valoresMonetarios: 10 mil exemplos; precisaoApi: persistência e folhas; CT-A3-003 |
| DEF-005 | Totais podiam ultrapassar precisão segura sem validação, apesar de salários aceitos | Média / P2 | Corrigido; soma inteira de centavos, limite agregado, verificação antes de POST/PUT | precisaoApi: rejeição de total e JSON preservado; valoresMonetarios: limites |
| DEF-006 | Impressão consolidada cortava colunas à direita e mostrava rolagem horizontal | Alta / P1 | Corrigido; CSS A4 com tabela fixa, quebra de texto, overflow visível e regras móveis restritas à tela | 6 cenários Chrome headless aprovados; PDFs individual, consolidado e 80 registros em desktop e móvel; confirmação final do QA registrada em 27/10/2026 |

Reprodução DEF-004: base=1000, vendas=4,27, comissão=50. Antes: final=1002,13.
Depois: adicional=2,14 e final=1002,14, inclusive ao ler o registro e emitir a folha.
Reprodução DEF-005 atual: primeiro salário=600 bilhões e segundo=1. Tentar incluir
outros 600 bilhões ou alterar o segundo para 600 bilhões retorna 400 e não grava.

## Pendências que não são defeitos confirmados do produto

- ENV-001: o ambiente de navegador integrado não expõe a janela nativa de impressão.
  O bloqueio inicial foi superado com testes Chrome headless e confirmação manual
  posterior do QA no CT-A3-010. Limitação histórica do ambiente integrado.
- GOV-001: após a correção DEF-006, Felipe Vergara Chico confirmou a conferência manual e o aceite em 27/10/2026. Apresentação/submissão pendentes.

Seis registros corrigidos tecnicamente; DEF-006 confirmado pelo QA após a correção.
Isso não é garantia de ausência de outros defeitos: a cobertura tem escopo definido.
