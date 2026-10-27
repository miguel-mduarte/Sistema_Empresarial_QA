# Conferência do executável empacotado

Data: 27/10/2026. Método: verificação em terminal local.

Extraído 07_Executavel do ZIP em diretório temporário isolado. Dependências
instaladas com npm ci --omit=dev --offline --ignore-scripts (117 pacotes).
Servidor iniciado com Node 24, PORT=5188 e banco vazio no diretório temporário.
Nenhum dado pessoal foi copiado e nenhuma implantação foi feita.

| Consulta | Resultado observado |
| --- | --- |
| GET / | 200, HTML pt-BR |
| GET /folha | 200, HTML da aplicação (fallback SPA) |
| GET /api/colaboradores | 200, lista JSON vazia |
| GET /api/folha-pagamento | 200, itens vazios, quantidade e total zero |
| GET /api/inexistente | 404, JSON Rota não encontrada |

Conferência aprovada de inicialização e rotas. Não substitui os casos de aceitação
nem comprova impressão. Dependências foram obtidas do cache local; uma máquina
sem cache precisa de acesso ao registro npm. O pacote final foi regenerado para
incluir este registro; os arquivos do executável permaneceram iguais.
