#!/usr/bin/env python3
"""Gera A3 com evidências existentes, sem simular testes ou homologação."""
import hashlib
import json
import subprocess
import textwrap
import zipfile
from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak, Preformatted
from gerar_entrega_a1 import styles, render_md

ROOT = Path(__file__).resolve().parents[1]
DOC = ROOT / 'docs/a3'
OUT = ROOT / 'output/a3'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def inventory(directory):
    for p in sorted(directory.iterdir()):
        if p.is_symlink() or p.name in {'node_modules', 'dist', 'coverage', '.git', '__pycache__'}:
            continue
        if p == ROOT / 'backend/data' or (p.name.startswith('.env') and p.name != '.env.example'):
            continue
        if p.is_dir():
            yield from inventory(p)
        else:
            yield p


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, text=True).strip()


def generate():
    evidence = json.loads((DOC / 'evidencias/execucao.json').read_text())
    current = {str(p.relative_to(ROOT)): sha(p.read_bytes())
               for folder in ['backend', 'frontend'] for p in inventory(ROOT / folder)}
    if current != evidence['hashes']:
        raise ValueError('Fontes diferentes da execução. Rode npm run a3:verificar novamente.')
    if len(evidence['runs']) != 9 or any(r['exitCode'] != 0 for r in evidence['runs']):
        raise ValueError('Verificação incompleta ou falhou.')
    reports = [json.loads((DOC / f'evidencias/{n}.json').read_text()) for n in ['backend', 'frontend']]
    if any(not r['success'] or r['numFailedTests'] or r['numPendingTests'] for r in reports):
        raise ValueError('Testes não aprovados integralmente.')
    acceptance = json.loads((DOC / 'aceitacao.json').read_text())
    cases = acceptance['casos']
    accepted = sum(c['status'] == 'Passou' for c in cases)
    case_md = '# Casos de aceitação A3\n\n' + '\n\n'.join(
        f'{k}: {acceptance[k]}' for k in ['data', 'executor', 'ambiente']) + '\n\n'
    for c in cases:
        case_md += f"## {c['id']} — {c['titulo']}\n\n"
        for label, key in [('ID', 'id'), ('Requisito', 'req'), ('Título', 'titulo'),
                           ('Pré-condição', 'pre'), ('Dados de entrada', 'dados')]:
            case_md += f'{label}: {c[key]}\n\n'
        case_md += 'Passos:\n\n' + '\n'.join(f'{i}. {s}' for i, s in enumerate(c['passos'], 1))
        case_md += f"\n\nResultado esperado: {c['esperado']}\n\nResultado obtido: {c['obtido']}\n\n"
        case_md += 'Status: ' + '  '.join(f"({'X' if c['status'] == s else ' '}) {s}" for s in ['Passou', 'Falhou', 'Bloqueado']) + '\n\n'
    (DOC / '08_Casos_Aceitacao.md').write_text(case_md)
    cov = json.loads((DOC / 'evidencias/coverage-final.json').read_text())
    totals = {k: [0, 0] for k in ['Linhas', 'Instruções', 'Funções', 'Ramificações']}
    rows = []
    for name, item in sorted(cov.items()):
        lines = {}
        for key, hit in item['s'].items():
            line = item['statementMap'][key]['start']['line']
            lines[line] = max(lines.get(line, 0), hit)
        metrics = {'Linhas': list(lines.values()), 'Instruções': list(item['s'].values()),
                   'Funções': list(item['f'].values()), 'Ramificações': [v for hits in item['b'].values() for v in hits]}
        percentages = []
        for key, values in metrics.items():
            hits, total = sum(v > 0 for v in values), len(values)
            pct = 100 * hits / total if total else 100
            if pct < 80:
                raise ValueError(f'{name}: {key} abaixo de 80%')
            totals[key][0] += hits
            totals[key][1] += total
            percentages.append(f'{pct:.2f}%')
        rows.append('| ' + name.split('/backend/src/')[-1] + ' | ' + ' | '.join(percentages) + ' |')
    base = git('rev-parse', 'HEAD')
    quality = f'''# Relatório final de qualidade A3

Preparado em {datetime.now().astimezone().isoformat(timespec='seconds')}.
Execução: {evidence['finishedAt']}. Node: {evidence['node']}.

## Conclusão

Implementação e verificações técnicas concluídas no escopo registrado. A entrega
formal ainda requer apresentação/submissão. Após a correção de impressão,
Felipe Vergara Chico (QA) confirmou a execução manual do CT-A3-010 e autorizou
o aceite. A ressalva de impressão está encerrada.

Não houve implantação na VPS nesta preparação. Os resultados são do build local.

## Métricas

- Backend: {reports[0]['numPassedTests']} testes Vitest aprovados.
- Frontend: {reports[1]['numPassedTests']} testes Vitest aprovados.
- Persistência operacional: 1 teste Node aprovado (check-9.log).
- Verificações de tipagem, lint e build: seis comandos aprovados.
- Aceitação: {accepted}/{len(cases)} casos aprovados ({100*accepted/len(cases):.0f}%): nove por execução técnica em navegador e CT-A3-010 por confirmação do QA.
- Defeitos conhecidos registrados: 6 encontrados e 6 corrigidos/retestados tecnicamente; DEF-006 confirmado pelo QA após a correção.
- Requisitos rastreados: 21 (9 RF, 8 RN, 4 RNF); não equivale a 100% de homologação.
- Plano A1: 30 casos históricos preservados em 04_Testes; A3: 10 cenários adicionais. Casos documentados não equivalem à quantidade de funções de teste automatizadas.
- RNF004: extensão experimental validada em teste isolado e revisão, sem adicionar categoria ao produto.

## Cobertura do backend

O frontend tem testes, mas não teve cobertura medida. Percentuais abaixo cobrem somente backend/src.

'''
    for metric, (hits, total) in totals.items():
        quality += f'- {metric}: {100*hits/total if total else 100:.2f}% ({hits}/{total}).\n'
    quality += '\n| Arquivo | Linhas | Instruções | Funções | Ramificações |\n| --- | --- | --- | --- | --- |\n' + '\n'.join(rows)
    quality += f'''\n\n## Revisão exata e conferência

Commit-base: {base}. Há alterações locais não commitadas: esse hash não identifica sozinho a entrega A3.
O MANIFESTO_SHA256.txt na raiz do ZIP identifica os bytes entregues, incluindo código,
testes, documentação, evidências e executável. execucao.json associa as fontes de backend
e frontend à execução. O histórico Git e o README integral estão neste dossiê e no pacote.
Não foram criados commits nem enviado código ao remoto.

Repositório configurado: https://github.com/miguel-mduarte/Sistema_Empresarial_QA
(disponibilidade pública não verificada; a conferência não depende desse acesso).

## Limitações e fechamento

CT-A3-010: relato do QA confirmou corte de colunas (DEF-006). CSS corrigido e
seis cenários automatizados de impressão A4 aprovados. QA confirmou
a execução manual após a correção, registrada no CT-A3-010.
Os registros distinguem os testes automatizados da validação manual do QA.
Aceite aprovado pelo QA, sem ressalva de impressão. A confirmação manual é um
relato do responsável; não foram anexados novos PDFs produzidos por ele.
Os testes não cobrem carga, concorrência entre processos ou segurança de exposição pública.
O JSON é destinado à execução local de uma única instância, sem autenticação.
Após mudanças nas fontes, rodar a3:verificar e a3:documentos novamente.
'''
    (DOC / '09_Relatorio_Qualidade.md').write_text(quality)
    OUT.mkdir(parents=True, exist_ok=True)
    ss = styles()
    story = [Paragraph('Folha Clara — Dossiê A3', ss['TitleA1'])]
    story += render_md((DOC / 'README.md').read_text(), ss)
    for p in [DOC / '09_Relatorio_Qualidade.md'] + sorted(DOC.glob('0[1-8]_*.md')):
        story += [PageBreak()] + render_md(p.read_text(), ss)
    story += [PageBreak(), Paragraph('Evidência: README integral', ss['H1A1'])]
    raw_style = ss['SmallA1'].clone('RawA3', fontName='Body', fontSize=7, leading=10)
    for line in (ROOT / 'README.md').read_text().splitlines():
        story.append(Preformatted('\n'.join(textwrap.wrap(line, 98, replace_whitespace=False)) or ' ', raw_style))
    history = git('log', '-32', '--date=iso-strict', '--format=%H%n%ad | %an%n%s%n')
    story += [PageBreak(), Paragraph('Evidência: histórico real de commits', ss['H1A1'])]
    for line in history.splitlines():
        story.append(Paragraph(escape(line or ' '), ss['SmallA1']))
    pdf = OUT / 'Dossie_A3_Folha_Clara.pdf'
    def footer(canvas, doc):
        canvas.setFont('Body', 8)
        canvas.drawString(44, 25, 'Folha Clara | A3 | Aprovado pelo QA')
        canvas.drawRightString(A4[0]-44, 25, str(doc.page))
    SimpleDocTemplate(str(pdf), pagesize=A4, leftMargin=44, rightMargin=44,
                      topMargin=49, bottomMargin=46, title='Folha Clara — Dossiê A3').build(story, onFirstPage=footer, onLaterPages=footer)
    entries = {}
    def add(p, name):
        entries[name] = p.read_bytes()
    def tree(folder, prefix, filtered=False):
        paths = inventory(folder) if filtered else sorted(folder.rglob('*'))
        for p in paths:
            if p.is_file() and not p.is_symlink():
                add(p, prefix + '/' + p.relative_to(folder).as_posix())
    for folder in ['backend', 'frontend', 'scripts', 'docs']:
        tree(ROOT / folder, '05_Codigo_Fonte/' + folder, True)
    for filename in ['README.md', 'package.json', '.gitignore', 'Trabalho_Integrador_A1_A3_GQS.pdf', 'T1 - Requisitos do Cliente.docx']:
        if (ROOT / filename).exists():
            add(ROOT / filename, '05_Codigo_Fonte/' + filename)
    for name in ['01_Visao.md', '02_ERS.md', '03_Rastreabilidade.md']:
        add(ROOT / 'docs/a1' / name, '01_Requisitos/' + name)
    add(ROOT / 'docs/a1/04_Modelagem.md', '02_Analise/Modelagem.md')
    tree(ROOT / 'docs/a1/diagramas', '02_Analise/diagramas')
    add(ROOT / 'docs/a1/05_Arquitetura.md', '03_Projeto/Arquitetura_A1.md')
    add(DOC / '04_Manual_Tecnico.md', '03_Projeto/Decisoes_A3.md')
    tree(DOC / 'evidencias', '04_Testes/evidencias')
    if (OUT / 'impressao').exists():
        tree(OUT / 'impressao', '04_Testes/impressao')
    for name in ['07_Rastreabilidade.md', '08_Casos_Aceitacao.md', 'aceitacao.json']:
        add(DOC / name, '04_Testes/' + name)
    add(ROOT / 'docs/a1/08_Casos_Teste.md', '04_Testes/Plano_A1_Historico.md')
    add(ROOT / 'scripts/banco_a3.mjs', '06_Banco_Dados/banco_a3.mjs')
    entries['06_Banco_Dados/README.md'] = b'Persistencia JSON, sem SQL. Use npm run banco -- init|demo|check|backup|restore no codigo fonte (apos build). Consulte manual tecnico e manual do usuario. Nenhuma base pessoal foi incluida.\n'
    for folder in ['backend', 'frontend']:
        tree(ROOT / folder / 'dist', '07_Executavel/' + folder + '/dist')
    for name in ['package.json', 'package-lock.json']:
        add(ROOT / 'backend' / name, '07_Executavel/backend/' + name)
    add(ROOT / 'scripts/servir_a3.mjs', '07_Executavel/scripts/servir_a3.mjs')
    entries['07_Executavel/README.md'] = b'Node 24 e npm. Nesta pasta: npm --prefix backend ci --omit=dev; depois node scripts/servir_a3.mjs. Abra http://127.0.0.1:3000. Requer rede para instalar dependencias. Sem autenticacao: uso local. JSON criado em backend/data; configure COLABORADORES_DB_PATH para outro caminho. Fontes e reproducao em 05_Codigo_Fonte.\n'
    for name in ['03_Manual_Usuario.md', '04_Manual_Tecnico.md']:
        add(DOC / name, '08_Manuais/' + name)
    add(DOC / '05_Termo_Homologacao.md', '09_Homologacao/Termo_Assinado_QA.md')
    for name in ['01_Defeitos.md', '02_Revisao_Tecnica.md', '09_Relatorio_Qualidade.md']:
        add(DOC / name, '10_Qualidade/' + name)
    add(pdf, '10_Qualidade/' + pdf.name)
    entries['10_Qualidade/Historico_Git.txt'] = history.encode()
    entries['10_Qualidade/Revisao.txt'] = (f'Base: {base}\nAlteracoes locais:\n' + git('status', '--short') + '\n').encode()
    add(DOC / '06_Apresentacao.md', '11_Apresentacao/Roteiro.md')
    add(DOC / 'README.md', 'LEIA-ME.md')
    entries['MANIFESTO_SHA256.txt'] = ''.join(f'{sha(data)}  {name}\n' for name, data in sorted(entries.items())).encode()
    archive = OUT / 'Entrega_A3_Folha_Clara.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
        for name, data in sorted(entries.items()):
            z.writestr(name, data)
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        for name, data in entries.items():
            assert sha(z.read(name)) == sha(data)
    print(f'PDF: {pdf}\nZIP: {archive}\nArquivos: {len(entries)}; manifesto verificado.')


if __name__ == '__main__':
    generate()
