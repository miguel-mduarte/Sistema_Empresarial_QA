#!/usr/bin/env python3
"""Gera o dossiê e pacote A1 a partir dos documentos e evidências locais.

Requer scripts/requirements-a1.txt. Reutiliza evidências salvas; para atualizar
testes e verificações antes de gerar, execute npm run a1:entrega.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import zipfile
import sys
from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape
from zoneinfo import ZoneInfo
from a1_validacao import fontes_projeto, validar_documentacao, validar_relatorio

from reportlab.graphics.shapes import Drawing, Ellipse, Line, Polygon, Rect, String
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    CondPageBreak,
)

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs/a1"
EVID = DOCS / "evidencias"
OUTPUT = ROOT / "output"
PDF = OUTPUT / "pdf/Dossie_A1_Folha_Clara.pdf"
FONT_DIR = Path("/usr/share/fonts/truetype/dejavu")
GENERATED_AT = datetime.now().astimezone()
INK = colors.HexColor("#173448")
ACCENT = colors.HexColor("#007F79")
PALE = colors.HexColor("#EDF5F5")
WIDTH = A4[0] - 88


def dump(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf8")


def coverage_summary():
    data = json.loads((EVID / "coverage-final.json").read_text())
    if not data:
        raise ValueError("Relatório de cobertura vazio.")
    totals = {key: [0, 0] for key in ("instrucoes", "ramificacoes", "funcoes", "linhas")}
    files = {}
    for name, item in data.items():
        line_hits = {}
        for sid, count in item["s"].items():
            line = item["statementMap"][sid]["start"]["line"]
            line_hits[line] = max(line_hits.get(line, 0), count)
        counts = {
            "instrucoes": list(item["s"].values()),
            "ramificacoes": [v for values in item["b"].values() for v in values],
            "funcoes": list(item["f"].values()),
            "linhas": list(line_hits.values()),
        }
        metrics = {}
        for key, values in counts.items():
            covered, total = sum(v > 0 for v in values), len(values)
            pct = int(10000 * covered / total) / 100 if total else 100
            metrics[key] = {"cobertos": covered, "total": total, "percentual": pct}
            totals[key][0] += covered
            totals[key][1] += total
            if pct < 80:
                raise ValueError(f"Cobertura abaixo de 80%: {name} {key} {pct}")
        normalized = "backend/src/" + name.replace("\\", "/").split("/backend/src/", 1)[-1]
        files[normalized] = metrics
    summary = {
        "escopo": "backend/src/**/*.ts; frontend não medido",
        "global": {k: {"cobertos": c, "total": t, "percentual": int(10000*c/t)/100 if t else 100}
                   for k, (c, t) in totals.items()},
        "arquivos": files,
    }
    dump(EVID / "cobertura-resumo.json", summary)
    return summary


def test_cases():
    cases = json.loads((DOCS / "casos.json").read_text())
    result = json.loads((EVID / "vitest-resultados.json").read_text())
    validar_relatorio(result, cases)
    if len(cases) < 20 or len({c[0] for c in cases}) != len(cases):
        raise ValueError("Casos insuficientes ou IDs duplicados")
    assertions = {}
    for suite in result["testResults"]:
        for test in suite["assertionResults"]:
            assertions.setdefault(test["title"], []).append((suite["name"], test))
    date = datetime.fromtimestamp(result["startTime"] / 1000, ZoneInfo("America/Sao_Paulo"))
    sections = []
    for cid, req, title, pre, inputs, steps, expected, match in cases:
        status = "( ) Passou  ( ) Falhou  ( ) Bloqueado"
        obtained = "Não executado. Preencher após execução planejada, com observações e evidência."
        source = "Execução manual/revisão planejada."
        if match:
            found = assertions.get(match, [])
            if len(found) != 1:
                raise ValueError(f"Título não resolve univocamente: {match}")
            path, assertion = found[0]
            passed = assertion["status"] == "passed"
            status = "(X) Passou  ( ) Falhou  ( ) Bloqueado" if passed else "( ) Passou  (X) Falhou  ( ) Bloqueado"
            obtained = ("Asserções do cenário aprovadas" if passed else "Falha registrada") + f" na rodada de {date:%d/%m/%Y %H:%M:%S} (America/Sao_Paulo)."
            short_path = "backend/test/" + Path(path).name
            source = f"{short_path} :: {match}."
            if cid in {"CT-011", "CT-012", "CT-013", "CT-014", "CT-015", "CT-016", "CT-017", "CT-018"}:
                source += " Cenário coberto dentro de teste agrupado; não é uma execução independente."
        block = f"## {cid} - {title}\n\nID: {cid}\n\nTítulo: {title}\n\nRequisito(s): {req}\n\nPré-condição: {pre}\n\nDados de entrada: {inputs}\n\nPassos:\n\n"
        block += "\n".join(f"{i}. {step}" for i, step in enumerate(steps, 1))
        block += f"\n\nResultado esperado: {expected}\n\nResultado obtido: {obtained}\n\nStatus: {status}\n\nEvidência: {source}\n"
        sections.append(block)
    automaticos = sum(c[7] is not None for c in cases)
    intro = (f"# 8. Especificação de casos de teste\n\n{len(cases)} casos documentados no template solicitado; "
             f"{automaticos} vinculados à automação e {len(cases)-automaticos} planejados. "
             "Os resultados referem-se às asserções executadas no backend, não à execução de interface. "
             f"A suíte completa contém {result['numTotalTests']} testes. "
             "Cada pré-condição deve ser preparada antes de reproduzir o caso isoladamente.\n\n")
    (DOCS / "08_Casos_Teste.md").write_text(intro + "\n".join(sections), encoding="utf8")
    return cases, sections, result, date


def styles():
    import reportlab
    bundled = Path(reportlab.__file__).parent / "fonts"
    for name, filename, fallback in [("Body", "DejaVuSans.ttf", "Vera.ttf"), ("BodyBold", "DejaVuSans-Bold.ttf", "VeraBd.ttf")]:
        font = FONT_DIR/filename
        pdfmetrics.registerFont(TTFont(name, str(font if font.exists() else bundled/fallback)))
    pdfmetrics.registerFontFamily("Body", normal="Body", bold="BodyBold", italic="Body", boldItalic="BodyBold")
    ss = getSampleStyleSheet()
    ss.add(ParagraphStyle(name="TextA1", fontName="Body", fontSize=9.2, leading=12.3, spaceAfter=6, textColor=INK))
    ss.add(ParagraphStyle(name="SmallA1", parent=ss["TextA1"], fontSize=7.7, leading=10.5, spaceAfter=4))
    ss.add(ParagraphStyle(name="TitleA1", fontName="BodyBold", fontSize=23, leading=29, textColor=INK, spaceAfter=18))
    ss.add(ParagraphStyle(name="H1A1", fontName="BodyBold", fontSize=17, leading=22, textColor=INK, spaceAfter=14, keepWithNext=True))
    ss.add(ParagraphStyle(name="H2A1", fontName="BodyBold", fontSize=11, leading=15, textColor=ACCENT, spaceBefore=9, spaceAfter=6, keepWithNext=True))
    ss.add(ParagraphStyle(name="TableA1", parent=ss["SmallA1"], fontSize=7.6, leading=10))
    ss.add(ParagraphStyle(name="CTtitle", parent=ss["H2A1"], fontSize=11, leading=14))
    ss.add(ParagraphStyle(name="CTbody", parent=ss["TextA1"], fontSize=9, leading=12, spaceAfter=4))
    return ss


def inline(text):
    text = escape(text)
    text = re.sub(r"`([^`]+)`", r"<b>\1</b>", text)
    return text


def render_md(text, ss, small=False):
    out, lines, i = [], text.splitlines(), 0
    body = ss["CTbody" if small else "TextA1"]
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        if line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                parts = [p.strip() for p in lines[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r"[:\- ]+", p) for p in parts):
                    rows.append([Paragraph(inline(p), ss["TableA1"]) for p in parts])
                i += 1
            n = len(rows[0])
            weights = [1] * n
            if n == 3: weights = [0.85, 1.4, 1.75]
            if n == 5: weights = [0.7, 0.85, 1, 2, 1.3]
            if n == 7: weights = [0.55, 1.6, 0.6, 0.6, 0.8, 1, 1.2]
            table = Table(rows, colWidths=[WIDTH*w/sum(weights) for w in weights], repeatRows=1, hAlign="LEFT")
            table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), PALE),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7F9FA")]),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LINEBELOW", (0, 0), (-1, 0), 0.7, ACCENT),
            ]))
            out.extend([table, Spacer(1, 9)])
            continue
        if line.startswith("# "):
            out.append(Paragraph(inline(line[2:]), ss["H1A1"]))
        elif line.startswith("## "):
            out.append(Paragraph(inline(line[3:]), ss["CTtitle" if small else "H2A1"]))
        elif re.match(r"^(- |\d+\. )", line):
            out.append(Paragraph(inline(line), body))
        else:
            combined = [line]
            while i + 1 < len(lines) and lines[i + 1].strip() and not re.match(r"^(#|\||- |\d+\. )", lines[i + 1].strip()):
                i += 1
                combined.append(lines[i].strip())
            out.append(Paragraph(inline(" ".join(combined)), body))
        i += 1
    return out


def label(d, x, y, text, size=9, anchor="middle", bold=False):
    d.add(String(x, y, text, fontName="BodyBold" if bold else "Body", fontSize=size, fillColor=INK, textAnchor=anchor))


def arrow(d, x1, y1, x2, y2, dashed=False, triangle=False):
    import math
    d.add(Line(x1, y1, x2, y2, strokeColor=INK, strokeWidth=0.8, strokeDashArray=[3, 3] if dashed else None))
    a = math.atan2(y2-y1, x2-x1)
    back = 8 if triangle else 5
    pts = [x2, y2, x2-back*math.cos(a)+3*math.sin(a), y2-back*math.sin(a)-3*math.cos(a),
           x2-back*math.cos(a)-3*math.sin(a), y2-back*math.sin(a)+3*math.cos(a)]
    d.add(Polygon(pts, fillColor=colors.white if triangle else INK, strokeColor=INK, strokeWidth=0.6))


def use_case_diagram():
    d = Drawing(WIDTH, 510)
    d.add(Rect(90, 20, 410, 475, fillColor=colors.HexColor("#FAFCFC"), strokeColor=ACCENT))
    label(d, 295, 477, "Folha Clara", 13, bold=True)
    d.add(Ellipse(38, 279, 9, 11, fillColor=colors.white, strokeColor=INK))
    d.add(Line(38, 268, 38, 237, strokeColor=INK))
    d.add(Line(21, 255, 55, 255, strokeColor=INK))
    d.add(Line(38, 237, 24, 218, strokeColor=INK))
    d.add(Line(38, 237, 52, 218, strokeColor=INK))
    label(d, 42, 200, "Administrador", 8)
    entries = [("UC01 Cadastrar", 425), ("UC02 Consultar", 365), ("UC03 Gerar folha", 305),
               ("UC04 Resumo", 245), ("UC05 Alterar", 185), ("UC06 Excluir", 125), ("UC08 Folha individual", 65)]
    for text, y in entries:
        d.add(Line(56, 253, 115, y, strokeColor=INK, strokeWidth=0.6))
        d.add(Ellipse(195, y, 80, 22, fillColor=PALE, strokeColor=ACCENT))
        label(d, 195, y-3, text, 8.6)
        if "UC06" not in text:
            arrow(d, 275, y, 357, 250, dashed=True)
    d.add(Ellipse(425, 250, 67, 30, fillColor=colors.white, strokeColor=ACCENT))
    label(d, 425, 255, "UC07 Calcular", 8.7)
    label(d, 425, 241, "remuneração", 8.7)
    label(d, 369, 433, "«include»", 9)
    label(d, 374, 416, "em todas as setas", 7.5)
    label(d, 374, 404, "tracejadas", 7.5)
    return d


def class_box(d, x, y, w, title, fields, methods):
    h = 35 + len(fields)*12 + (14 if methods else 0) + len(methods)*12
    d.add(Rect(x, y-h, w, h, fillColor=colors.white, strokeColor=ACCENT))
    d.add(Rect(x, y-27, w, 27, fillColor=PALE, strokeColor=ACCENT))
    label(d, x+w/2, y-17, title, 8, bold=True)
    yy = y-42
    for f in fields:
        label(d, x+7, yy, f, 7.5, "start"); yy -= 12
    if methods:
        d.add(Line(x, yy+5, x+w, yy+5, strokeColor=ACCENT))
        yy -= 8
        for m in methods:
            label(d, x+7, yy, m, 7.2, "start"); yy -= 12
    return h


def class_diagram():
    d = Drawing(WIDTH, 575)
    class_box(d, 150, 560, 212, "Colaborador", ["id, matricula, nome: string", "tipo: TipoColaborador", "salarioBase: number", "adicional, salarioFinal: number", "criadoEm; atualizadoEm?"], ["+ calcularAdicional(): number", "+ definirRemuneracao()", "+ static arredondarValor(valor)"])
    class_box(d, 4, 290, 151, "ColaboradorPadrao", [], [])
    class_box(d, 178, 290, 151, "ColaboradorComissionado", ["valorVendas: number", "percentualComissao: number"], ["+ calcularAdicional(): number"])
    class_box(d, 352, 290, 151, "ColaboradorProducao", ["quantidadeProduzida: number", "valorPorUnidade: number"], ["+ calcularAdicional(): number"])
    for x in (79, 253, 427):
        d.add(Line(x, 290, x, 335, strokeColor=INK))
        d.add(Line(x, 335, 256, 335, strokeColor=INK))
    arrow(d, 256, 335, 256, 415, triangle=True)
    class_box(d, 8, 143, 180, "ColaboradorFactory", [], ["+ static tiposSuportados", "+ static criar(dados)"])
    for x, y in ((79, 255), (253, 203), (427, 203)):
        arrow(d, 100, 143, x, y, dashed=True)
    label(d, 50, 179, "cria", 8)
    class_box(d, 285, 145, 216, "ColaboradorRepository", ["databasePath: string"], ["+ garantirBancoDeDados(); listar()", "+ adicionar(); substituir(); excluir()", "+ salvar(colaboradores)"])
    d.add(Line(501, 130, 506, 130, strokeColor=INK, strokeDashArray=[3, 3]))
    d.add(Line(506, 130, 506, 424, strokeColor=INK, strokeDashArray=[3, 3]))
    arrow(d, 506, 424, 362, 424, dashed=True)
    label(d, 440, 438, "persiste", 8)
    return d


def sequence_diagram():
    d = Drawing(WIDTH, 555)
    xs = [29, 112, 209, 309, 408, 484]
    names = ["Operador", "Interface", "API/validação", "Service", "Fábrica/modelo", "JSON/Repo"]
    for x, name in zip(xs, names):
        d.add(Rect(x-35 if x>35 else 0, 512, 70 if x>35 else 64, 28, fillColor=PALE, strokeColor=ACCENT))
        label(d, x if x>35 else 32, 523, name, 6.9, bold=True)
        d.add(Line(x, 512, x, 15, strokeColor=colors.grey, strokeDashArray=[3, 3], strokeWidth=.6))
    def message(a, b, y, text, response=False):
        arrow(d, xs[a], y, xs[b], y, dashed=response)
        label(d, (xs[a]+xs[b])/2, y+7, text, 6.6)
    message(0, 1, 486, "confirmar dados")
    message(1, 2, 460, "POST cadastro")
    label(d, xs[2]+5, 440, "validar / matchedData", 6.6, "start")
    d.add(Rect(94, 30, 410, 399, fillColor=None, strokeColor=ACCENT))
    label(d, 101, 416, "alt [entrada inválida]", 7.2, "start", True)
    message(2, 1, 392, "400 + erros", True)
    d.add(Line(94, 379, 504, 379, strokeColor=ACCENT, strokeDashArray=[4, 2]))
    label(d, 101, 366, "[entrada válida]", 7.2, "start", True)
    message(2, 3, 344, "cadastrar(dados)")
    message(3, 5, 318, "listar()")
    message(5, 3, 292, "registros", True)
    d.add(Rect(101, 40, 397, 240, fillColor=None, strokeColor=ACCENT))
    label(d, 108, 266, "alt [matrícula duplicada]", 7.2, "start", True)
    message(3, 2, 244, "erro 409", True)
    message(2, 1, 221, "409 + mensagem", True)
    d.add(Line(101, 210, 498, 210, strokeColor=ACCENT, strokeDashArray=[4, 2]))
    label(d, 108, 198, "[matrícula livre]", 7.2, "start", True)
    message(3, 4, 177, "criar e calcular")
    message(4, 3, 155, "modelo", True)
    message(3, 5, 133, "adicionar; temporário + rename")
    message(5, 3, 111, "registro", True)
    message(3, 2, 89, "colaborador", True)
    message(2, 1, 67, "201 + cadastro", True)
    message(1, 0, 15, "exibir resultado", True)
    return d


def page_footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setStrokeColor(ACCENT)
    canvas.line(44, h-34, w-44, h-34)
    canvas.setFont("Body", 7)
    canvas.setFillColor(INK)
    canvas.drawString(44, h-26, "FOLHA CLARA  /  GARANTIA DA QUALIDADE DE SOFTWARE")
    canvas.drawString(44, 27, f"A1 · Gerado em {GENERATED_AT:%d/%m/%Y}")
    canvas.drawRightString(w-44, 27, str(doc.page))
    canvas.restoreState()


def build_pdf(sections, result, date, summary):
    ss = styles()
    story = [Spacer(1, 55), Paragraph("FOLHA CLARA", ss["TitleA1"]),
             Paragraph("Entrega A1", ss["TitleA1"]),
             Paragraph("Planejamento, Modelagem e Garantia da Qualidade", ss["H1A1"]),
             Spacer(1, 20)]
    story.extend(render_md((DOCS/"IDENTIFICACAO.md").read_text(), ss))
    story.extend([Spacer(1, 18), Paragraph("Fontes: Trabalho_Integrador_A1_A3_GQS.pdf e T1 - Requisitos do Cliente.docx. Baseline técnica: código e evidências disponíveis neste pacote.", ss["SmallA1"]), PageBreak()])
    story.extend(render_md((DOCS/"README.md").read_text(), ss))
    for filename in ["01_Visao.md", "02_ERS.md", "03_Rastreabilidade.md", "04_Modelagem.md", "05_Arquitetura.md", "06_PGQ.md", "07_Plano_Testes.md"]:
        story.append(PageBreak())
        story.extend(render_md((DOCS/filename).read_text(), ss))
        if filename == "04_Modelagem.md":
            for title, figure, note in [
                ("4.1 Diagrama de casos de uso", use_case_diagram(), "Linhas contínuas: associação com ator. Setas tracejadas: dependência «include». Exclusão não inclui cálculo no próprio endpoint."),
                ("4.2 Diagrama de classes", class_diagram(), "Triângulo vazio: generalização. Setas tracejadas: dependência. Atributos de remuneração especializados por categoria. Métodos são resumidos; fonte PlantUML acompanha o pacote."),
                ("4.3 Diagrama de sequência - UC01", sequence_diagram(), "Retornos tracejados; mensagens contínuas. Fragmentos alt distinguem erro de entrada, duplicidade e sucesso. API agrupa rota, validação, controller e tratamento de erro; JSON/Repo agrupa persistência.")]:
                story.extend([PageBreak(), Paragraph(title, ss["H1A1"]), figure, Spacer(1, 12), Paragraph(note, ss["TextA1"])])
    for idx in range(0, len(sections), 2):
        story.append(PageBreak())
        story.append(Paragraph("8. Casos de teste" + (" - continuação" if idx else ""), ss["H1A1"]))
        if idx == 0:
            counts = validar_documentacao()
            story.append(Paragraph(f"{counts['casos']} casos; {counts['automatizados']} com evidência automatizada e {counts['planejados']} planejados. Status reflete somente o cenário e as asserções descritas. Executar a suíte completa para reproduzir sua preparação.", ss["SmallA1"]))
        for section in sections[idx:idx+2]:
            # CondPageBreak evita separar o título da ficha, mantendo fluxo caso o texto cresça.
            story.append(CondPageBreak(285))
            story.extend(render_md(section, ss, small=True))
            story.append(Spacer(1, 9))
    for filename in ["09_Planejamento.md", "evidencias/Verificacoes.md"]:
        story.append(PageBreak())
        story.extend(render_md((DOCS/filename).read_text(), ss))
    story.extend([PageBreak(), Paragraph("10. Evidências e proveniência", ss["H1A1"])])
    info = f"Rodada Vitest iniciada em {date:%d/%m/%Y %H:%M:%S} (America/Sao_Paulo): {result['numPassedTests']} aprovados de {result['numTotalTests']}; {result['numFailedTests']} falhas e {result['numPendingTests']} pendentes. Detalhes por asserção em 04_Testes/evidencias/vitest-resultados.json no ZIP."
    story.append(Paragraph(info, ss["TextA1"]))
    rows = [["Métrica backend", "Cobertos / total", "Percentual"]]
    for k, v in summary["global"].items():
        rows.append([k.capitalize(), f"{v['cobertos']} / {v['total']}", f"{v['percentual']:.2f}%"])
    tablemd = "\n".join("| " + " | ".join(row) + " |" for row in rows)
    story.extend(render_md(tablemd, ss))
    story.append(Paragraph("Histórico recente real do repositório", ss["H2A1"]))
    for line in (EVID/"historico_commits.txt").read_text().splitlines()[:8]:
        sha, when, author, subject = line.split(" | ", 3)
        story.append(Paragraph(inline(f"{sha[:7]} · {when[:10]} · {subject}"), ss["SmallA1"]))
    story.append(Paragraph("O histórico completo acompanha o pacote. Os novos artefatos desta A1 são arquivos de trabalho preparados sobre a revisão indicada, sem criação de commits ou submissão remota automática. O manifesto SHA-256 identifica os arquivos entregues, inclusive documentação ainda não commitada.", ss["TextA1"]))
    story.append(Paragraph("Referências documentais", ss["H2A1"]))
    story.append(Paragraph("1. Trabalho_Integrador_A1_A3_GQS.pdf, documento de 28/09/2026: seção 5 (A1), seção 7 (estrutura) e seção 8 (avaliação). 2. T1 - Requisitos do Cliente.docx: objetivo, escopo, requisitos, regras, relatórios e aceitação. 3. Código local backend/src, frontend/src e backend/test; arquivos de dependências e histórico Git anexados.", ss["TextA1"]))
    PDF.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(PDF), pagesize=A4, rightMargin=44, leftMargin=44,
                            topMargin=49, bottomMargin=46, title="Folha Clara - Dossiê A1",
                            author="Felipe Vergara Chico; Nicolas Uliana Ramos; Victor Pithan Altnetter; Miguel Marques Durte")
    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)


def package():
    entries = {}
    def add(path, name):
        entries[name] = path.read_bytes()
    def add_text(name, text):
        entries[name] = text.encode("utf8")
    for folder, names in {
        "01_Requisitos": ["01_Visao.md", "02_ERS.md", "03_Rastreabilidade.md"],
        "02_Analise": ["04_Modelagem.md"],
        "03_Projeto": ["05_Arquitetura.md", "09_Planejamento.md"],
        "04_Testes": ["07_Plano_Testes.md", "08_Casos_Teste.md", "casos.json"],
        "10_Qualidade": ["06_PGQ.md"],
    }.items():
        for filename in names: add(DOCS/filename, f"{folder}/{filename}")
    for source in (DOCS/"diagramas").iterdir():
        add(source, "02_Analise/diagramas/" + source.name)
    for source in EVID.iterdir():
        add(source, "04_Testes/evidencias/" + source.name)
    add(DOCS/"IDENTIFICACAO.md", "IDENTIFICACAO.md")
    add(PDF, "Dossie_A1_Folha_Clara.pdf")
    for name in ["Trabalho_Integrador_A1_A3_GQS.pdf", "T1 - Requisitos do Cliente.docx"]:
        add(ROOT/name, "01_Requisitos/fontes/"+name)
    for path in fontes_projeto():
        add(path, "05_Codigo_Fonte/" + path.relative_to(ROOT).as_posix())
    add(ROOT/"README.md", "05_Codigo_Fonte/README.md")
    add(ROOT/".gitignore", "05_Codigo_Fonte/.gitignore")
    add(ROOT/"package.json", "05_Codigo_Fonte/package.json")
    for path in (ROOT/"scripts").rglob("*"):
        if path.is_file() and not path.is_symlink() and path.suffix in {".py", ".mjs", ".txt"}:
            add(path, "05_Codigo_Fonte/" + path.relative_to(ROOT).as_posix())
    for path in DOCS.rglob("*"):
        if path.is_file(): add(path, "05_Codigo_Fonte/docs/a1/"+str(path.relative_to(DOCS)))
    for name in ["Trabalho_Integrador_A1_A3_GQS.pdf", "T1 - Requisitos do Cliente.docx"]:
        add(ROOT/name, "05_Codigo_Fonte/"+name)
    add(EVID/"historico_commits.txt", "05_Codigo_Fonte/HISTORICO_COMMITS.txt")
    add_text("06_Banco_Dados/README.md", "# Persistência\n\nO projeto usa JSON, sem SGBD ou scripts SQL. A API cria automaticamente backend/data/colaboradores.json como []. Configure COLABORADORES_DB_PATH para outro local. Registros pessoais não integram o pacote. O modelo e a estratégia de escrita estão em 03_Projeto/05_Arquitetura.md.\n")
    add_text("07_Executavel/README.md", "# Execução\n\nA1 entrega fontes e instruções reproduzíveis em 05_Codigo_Fonte/README.md. Builds e dependências instaladas não estão empacotados. Versão executável final é item da A3.\n")
    add_text("08_Manuais/README.md", "# Manuais\n\nInstalação e execução inicial estão no README do código. Manuais completos de usuário e técnico são entregáveis da A3, não exigidos na A1.\n")
    add_text("09_Homologacao/README.md", "# Homologação\n\nA1 contém planejamento e critérios. Não houve assinatura ou aceite formal; termo de homologação é previsto para a A3.\n")
    add_text("11_Apresentacao/README.md", "# Apresentação\n\nUse o dossiê A1 como roteiro: visão, ERS, UML, arquitetura, PGQ, testes e planejamento. Slides não constam dos nove entregáveis obrigatórios da A1.\n")
    add_text("README.md", "# Entrega A1 - Folha Clara\n\nAbra Dossie_A1_Folha_Clara.pdf para leitura consolidada. Identificação em IDENTIFICACAO.md. Fontes editáveis distribuídas nas pastas numeradas. Código completo, instruções de instalação e histórico exportado em 05_Codigo_Fonte. Casos e evidências em 04_Testes. A estrutura inclui pastas da A3 com sua situação explicitada.\n\nA1: 20/10/2026. Professor: Paulo Cesar Furlanetto Marques. Os 30 casos têm 28 cenários com evidência automatizada e 2 verificações planejadas, sem homologação declarada.\n\nMANIFESTO_SHA256.txt permite conferir a integridade dos arquivos. O histórico é uma exportação real; consulte o repositório Git original para branches e revisões.\n")
    manifest = "\n".join(f"{hashlib.sha256(data).hexdigest()}  {name}" for name, data in sorted(entries.items())) + "\n"
    entries["MANIFESTO_SHA256.txt"] = manifest.encode()
    zip_path = OUTPUT / "Entrega_A1_Folha_Clara.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as archive:
        for name, data in sorted(entries.items()):
            archive.writestr("Projeto_FolhaPagamento/"+name, data)
    with zipfile.ZipFile(zip_path) as archive:
        if archive.testzip(): raise ValueError("ZIP com erro de integridade")
    return zip_path, len(entries)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--capturar-evidencias", action="store_true", help="Executar verificações e testes atuais antes de gerar (equivale a npm run a1:entrega).")
    args = parser.parse_args()
    if args.capturar_evidencias:
        subprocess.run([sys.executable, str(ROOT/"scripts/preparar_a1.py")], cwd=ROOT, check=True)
        return
    validar_documentacao()
    metadata = EVID / "execucao.json"
    if metadata.exists():
        saved = json.loads(metadata.read_text(encoding="utf8"))["fontes"]
        current = {p.relative_to(ROOT).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in fontes_projeto()}
        if saved != current:
            raise ValueError("Código diferente das evidências salvas. Execute npm run a1:entrega para revalidar.")
    else:
        print("Aviso: evidências antigas sem hashes de código. Use npm run a1:entrega para atualizar.", file=sys.stderr)
    summary = coverage_summary()
    cases, sections, result, date = test_cases()
    build_pdf(sections, result, date, summary)
    from pypdf import PdfReader
    reader = PdfReader(str(PDF))
    text = "\n".join(p.extract_text() for p in reader.pages)
    for case in cases:
        assert case[0] in text, case[0]
    for ra in ("1292416373", "1292413395", "1292414778", "1292413635"):
        assert ra in text, ra
    bundle, count = package()
    print(json.dumps({"pdf": str(PDF), "paginas": len(reader.pages), "zip": str(bundle), "arquivos": count,
                      "casos": len(cases), "testes_aprovados": result["numPassedTests"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
