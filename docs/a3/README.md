# A3 Folha Clara

Prazo do enunciado: 01/12/2026. Preparação técnica: 27/10/2026.
Equipe: Felipe Vergara Chico (1292416373), Nicolas Uliana Ramos (1292413395),
Victor Pithan Altnetter (1292414778), Miguel Marques Durte (1292413635).
Professor: Paulo Cesar Furlanetto Marques.

O sistema e o pacote técnico estão preparados para validação final da equipe.
QA responsável: Felipe Vergara Chico. Após a correção de impressão, aceite aprovado
registrado em 27/10/2026. A execução manual do CT-A3-010
foi confirmada pelo QA; ressalva encerrada.
Apresentação/submissão pendentes. Não foi atualizada a VPS.

| Enunciado | Entregável | Evidência |
| --- | --- | --- |
| 6.1 | Sistema implementado | Fontes, build e aceitação registrada |
| 6.2 | Código, configuração e instalação | 05_Codigo_Fonte, manual técnico e scripts de persistência |
| 6.3 | Testes unitários | valoresMonetarios.test.ts, coberturaInfraestrutura.test.ts, frontend/test |
| 6.4 | Integração | requisitosFuncionais, colaboradoresApi, relatorios e precisaoApi |
| 6.5 | Aceitação | aceitacao.json e relatório; impressão confirmada pelo QA após correção |
| 6.6 | Defeitos | 01_Defeitos.md |
| 6.7 | Métricas | Evidências JSON e relatório gerado |
| 6.8 | Revisão técnica | 02_Revisao_Tecnica.md |
| 6.9 | Manual do usuário | 03_Manual_Usuario.md |
| 6.10 | Manual técnico | 04_Manual_Tecnico.md |
| 6.11 | Termo de homologação | 05_Termo_Homologacao.md; assinado pelo QA; aprovado |
| 6.12 | Relatório final | Dossiê PDF, rastreabilidade e evidências |

## Procedimento de fechamento

1. Executar npm run a3:verificar e conferir zero falhas.
2. Executar o CT-A3-010 em Chrome ou Firefox: imprimir/salvar as duas folhas, abrir
   os PDFs e conferir colunas, valores, paginação e ausência de cortes.
3. Registrar resultado real, operador, data e arquivos em aceitacao.json.
4. Manter o termo e o registro de aceite associados à versão avaliada.
5. Regenerar o dossiê e o ZIP com npm run a3:documentos; conferir visualmente o PDF.
6. Apresentar o sistema e enviar o pacote. Guardar o comprovante de submissão.

O gerador usa evidências existentes e rejeita mudanças posteriores nas fontes
testadas. Não reexecuta o navegador, não assina o termo e não faz deploy.
Os documentos da A1 são preservados como histórico; decisões atuais estão na A3.
