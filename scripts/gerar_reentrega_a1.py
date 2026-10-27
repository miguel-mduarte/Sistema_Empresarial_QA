#!/usr/bin/env python3
"""Complementa a A1 com evidências Git reais, sem modificar o dossiê original."""
import argparse
import hashlib
import io
import json
import subprocess
import textwrap
import zipfile
from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape

from pypdf import PdfReader, PdfWriter
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak, Preformatted, Spacer
from reportlab.lib.styles import ParagraphStyle
from gerar_entrega_a1 import styles, render_md

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/reentrega_a1"


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def allowed(name):
    p = Path(name)
    if any(part in {"node_modules", "dist", "coverage", ".git", "__pycache__"} for part in p.parts):
        return False
    if name.startswith("backend/data/") or (p.name.startswith(".env") and p.name != ".env.example"):
        return False
    return (name.startswith(("backend/", "frontend/", "docs/a1/", "scripts/"))
            or name in {"README.md", ".gitignore", "package.json"})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--revision", default="HEAD")
    parser.add_argument("--original", type=Path, default=ROOT/"Dossie_A1_Folha_Clara.pdf")
    args = parser.parse_args()
    revision = git("rev-parse", f"{args.revision}^{{commit}}").decode().strip()
    original = args.original.read_bytes()
    base = PdfReader(io.BytesIO(original))
    names = sorted(git("ls-tree", "-r", "--name-only", revision).decode().splitlines())
    entries = {name: git("show", f"{revision}:{name}") for name in names if allowed(name)}
    readme = entries["README.md"].decode()
    history = git("log", revision, "--format=%H | %aI | %an | %s").decode()
    branch = git("branch", "--show-current").decode().strip()
    remote = git("remote", "get-url", "origin").decode().strip()
    if not remote.startswith("git@github.com:"):
        raise ValueError("Verifique a URL pública do remoto antes de gerar.")
    url = "https://github.com/" + remote.removeprefix("git@github.com:").removesuffix(".git")
    tree_url = f"{url}/tree/{revision}"
    commit_url = f"{url}/commit/{revision}"
    manifest = "".join(f"{sha(data)}  {name}\n" for name, data in sorted(entries.items()))
    captured = datetime.now().astimezone().isoformat(timespec="seconds")
    metadata = {"capturado_em": captured, "commit": revision, "branch_observada": branch,
                "repositorio": url, "arvore": tree_url, "commit_url": commit_url,
                "original_sha256": sha(original), "manifesto_fontes_sha256": sha(manifest.encode()),
                "arquivos_fonte": len(entries), "commits": len(history.splitlines()),
                "criterio": "Snapshot extraído dos objetos Git do commit, não do diretório de trabalho."}
    OUT.mkdir(parents=True, exist_ok=True)
    ss = styles()
    mono = ParagraphStyle("Snapshot", fontName="Courier", fontSize=8.5, leading=11,
                          spaceAfter=2, textColor=ss["TextA1"].textColor)
    story = []

    def para(text):
        story.append(Paragraph(escape(text), ss["TextA1"]))

    def title(text):
        story.append(Paragraph(text, ss["H1A1"]))

    def literal(text):
        for line in text.splitlines():
            for wrapped in textwrap.wrap(line, width=95, replace_whitespace=False,
                                         drop_whitespace=False) or [""]:
                story.append(Preformatted(wrapped, mono))

    title("Complemento de comprovação da A1")
    para("Folha Clara | Organização e Planejamento do Projeto | Reentrega")
    para("Este complemento atende à observação da avaliação sobre a comprovação incompleta do repositório. Apresenta o README integral, o histórico real de commits, a estrutura versionada e a revisão exata do código. O planejamento já apresentado permanece preservado.")
    identification = (ROOT/"docs/a1/IDENTIFICACAO.md").read_text()
    identification = "\n".join(line for line in identification.splitlines()
                               if not line.startswith(("Versão dos artefatos:", "Prazo oficial:")))
    story.extend(render_md(identification, ss))
    para(f"Captura das evidências: {captured}. O dossiê original ocupa as primeiras {len(base.pages)} páginas da versão consolidada; este complemento começa na página {len(base.pages)+1}.")
    para("Roteiro de conferência: seção 1 identifica a revisão e os links; seção 2 reproduz o README; seção 3 lista a estrutura real; seção 4 apresenta todos os commits alcançáveis pela revisão; seção 5 explica a conferência do pacote.")
    para("Escopo desta reentrega: comprovação documental do item 5.9 e do critério de Organização e Planejamento. Não constitui nova homologação, reteste do sistema ou declaração de correção das pendências técnicas da A3. As datas e resultados do dossiê original permanecem históricos.")
    story.append(PageBreak())
    title("1 Identificação exata do repositório")
    for label, value in [("Repositório", url), ("Commit completo", revision),
                         ("Branch local observada", branch), ("Arquivos incluídos", str(len(entries))),
                         ("Commits no histórico", str(len(history.splitlines())))]:
        para(f"{label}: {value}")
    for label, target in [("Código na revisão", tree_url), ("Detalhes do commit", commit_url),
                          ("README na revisão", f"{url}/blob/{revision}/README.md")]:
        story.append(Paragraph(f'{label}: <link href="{escape(target)}" color="#007F79">{escape(target)}</link>', ss["SmallA1"]))
    para("Os endereços foram derivados do remoto Git configurado. Acesso público e permissões do avaliador não foram confirmados. As evidências reproduzidas neste PDF e o snapshot anexado permitem conferência sem depender do acesso ao GitHub.")
    para("O código anexado é exatamente o snapshot do commit acima. Alterações locais posteriores, arquivos não versionados e arquivos de implantação não foram incorporados ao snapshot. Este complemento e seu gerador são artefatos novos, identificados separadamente no manifesto do pacote; não foi criado ou publicado um commit para eles.")
    para("Integridade do snapshot: SHA-256 do arquivo MANIFESTO_FONTES_SHA256.txt")
    literal(metadata["manifesto_fontes_sha256"])
    para("Integridade do dossiê original preservado: SHA-256")
    literal(metadata["original_sha256"])
    story.append(PageBreak())
    title("2 README integral da revisão")
    para(f"Transcrição integral de README.md no commit {revision}. A sintaxe Markdown é preservada abaixo; URLs relativas referem-se à raiz do snapshot.")
    literal(readme)
    story.append(PageBreak())
    title("3 Estrutura real do projeto")
    para("Inventário de caminhos extraído de git ls-tree, não um desenho proposto. A lista abaixo contém todos os arquivos do snapshot entregue. Caminhos com o mesmo prefixo pertencem à mesma pasta.")
    para("backend/src: rotas, validações, controllers, serviços, modelos e persistência. backend/test: testes Vitest. frontend/src: páginas, componentes, hooks e integração com a API. docs/a1: documentos, modelos e evidências. scripts: geração e validação da entrega.")
    literal("\n".join(entries))
    excluded = [name for name in names if name not in entries]
    para("Arquivos versionados não incluídos no snapshot de fontes:")
    literal("\n".join(excluded) or "Nenhum.")
    para("Não integram o snapshot: .git, dependências instaladas, builds, dados locais de colaboradores, credenciais e arquivos não versionados. O JSON operacional é criado pela API; sua ausência no pacote é intencional.")
    story.append(PageBreak())
    title("4 Histórico completo de commits")
    para("Extração real de git log da revisão identificada, em ordem de exibição do Git, incluindo merges. Datas abaixo são datas de autoria com fuso original; nomes e mensagens são reproduzidos como registrados. Não representam atribuição adicional de autoria pela equipe.")
    for record in history.splitlines():
        commit, when, author, subject = record.split(" | ", 3)
        story.append(Paragraph(escape(f"{when} | {author}"), ss["H2A1"]))
        literal(commit)
        para(subject)
    story.append(PageBreak())
    title("5 Como conferir a reentrega")
    para("O ZIP contém o PDF consolidado, este complemento, o snapshot de fontes, o README em texto, o inventário, o histórico completo, os metadados da revisão e manifestos SHA-256. O conteúdo necessário ao critério avaliado também está reproduzido neste PDF.")
    para("Para conferir o snapshot após extrair o ZIP, entre na pasta 05_Codigo_Fonte e execute:")
    literal("sha256sum -c ../MANIFESTO_FONTES_SHA256.txt")
    para("Para conferir todos os arquivos do pacote, na raiz extraída execute:")
    literal("sha256sum -c MANIFESTO_PACOTE_SHA256.txt")
    para("Para conferir a revisão em um clone autorizado, sem trocar a branch de trabalho:")
    literal(f"git show {revision}:README.md\ngit ls-tree -r --name-only {revision}\ngit log {revision} --format='%H | %aI | %an | %s'")
    para("Para instalação e execução, siga os comandos do README reproduzido na seção 2. Caso o ambiente de submissão aceite apenas um PDF, envie o consolidado: ele já contém todas as evidências textuais requeridas. Se aceitar anexos, envie também o ZIP para conferência dos arquivos.")
    para("Reprodução deste complemento: execute scripts/gerar_reentrega_a1.py com --revision e --original apontando para a revisão e o dossiê original. O script requer reportlab e pypdf. Datas de captura e hashes dos PDFs mudam a cada geração; os hashes do snapshot permanecem iguais para a mesma revisão.")

    def footer(canvas, doc):
        canvas.setFont("Body", 8)
        canvas.drawString(44, 27, "Folha Clara | Comprovação do repositório | A1")
        canvas.drawRightString(A4[0]-44, 27, f"Complemento {doc.page}")

    supplement = OUT/"Complemento_Repositorio_A1.pdf"
    SimpleDocTemplate(str(supplement), pagesize=A4, leftMargin=44, rightMargin=44,
                      topMargin=45, bottomMargin=44, title="Folha Clara Comprovação do Repositório A1").build(
                          story, onFirstPage=footer, onLaterPages=footer)
    consolidated = OUT/"Dossie_A1_Folha_Clara_Reentrega.pdf"
    writer = PdfWriter()
    writer.append(base)
    writer.append(str(supplement), outline_item="Complemento de comprovação do repositório")
    writer.add_metadata({"/Title": "Folha Clara A1 Reentrega com comprovação do repositório"})
    with consolidated.open("wb") as stream:
        writer.write(stream)
    # The original pages are retained verbatim in content, not regenerated.
    merged = PdfReader(consolidated)
    assert all(a.extract_text() == b.extract_text() for a, b in zip(base.pages, merged.pages))
    extracted = "\n".join(p.extract_text() for p in PdfReader(supplement).pages)
    for record in history.splitlines():
        assert record.split(" | ")[0] in extracted
    assert revision in extracted and "README integral" in extracted
    package = {f"05_Codigo_Fonte/{n}": b for n, b in entries.items()}
    package.update({consolidated.name: consolidated.read_bytes(), supplement.name: supplement.read_bytes(),
                    "MANIFESTO_FONTES_SHA256.txt": manifest.encode(),
                    "EVIDENCIAS/REVISAO.json": json.dumps(metadata, ensure_ascii=False, indent=2).encode(),
                    "EVIDENCIAS/README_INTEGRAL.md": entries["README.md"],
                    "EVIDENCIAS/HISTORICO_COMPLETO.txt": history.encode(),
                    "EVIDENCIAS/ESTRUTURA_REAL.txt": ("\n".join(entries)+"\n").encode(),
                    "REPRODUCAO/gerar_reentrega_a1.py": Path(__file__).read_bytes()})
    package["MANIFESTO_PACOTE_SHA256.txt"] = "".join(
        f"{sha(b)}  {n}\n" for n, b in sorted(package.items())).encode()
    target = OUT/"Entrega_A1_Folha_Clara_Reentrega.zip"
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
        for name, data in sorted(package.items()):
            archive.writestr(name, data)
    with zipfile.ZipFile(target) as archive:
        assert archive.testzip() is None
        for line in archive.read("MANIFESTO_PACOTE_SHA256.txt").decode().splitlines():
            digest, name = line.split("  ", 1)
            assert digest == sha(archive.read(name))
    print(json.dumps({**metadata, "pdf": str(consolidated), "paginas_original": len(base.pages),
                      "paginas_complemento": len(PdfReader(supplement).pages), "zip": str(target)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
