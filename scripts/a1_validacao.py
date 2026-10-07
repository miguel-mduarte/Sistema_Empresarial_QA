"""Validações estruturais da A1. Somente biblioteca padrão; sem alterar arquivos."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUISITOS = ({f"RF{i:03}" for i in range(1, 10)}
              | {f"RN{i:03}" for i in range(1, 9)}
              | {f"RNF{i:03}" for i in range(1, 5)})
DOCUMENTOS = ["README.md", "IDENTIFICACAO.md", "01_Visao.md", "02_ERS.md",
              "03_Rastreabilidade.md", "04_Modelagem.md", "05_Arquitetura.md",
              "06_PGQ.md", "07_Plano_Testes.md", "09_Planejamento.md",
              "diagramas/casos_uso.puml", "diagramas/classes.puml", "diagramas/sequencia.puml"]


def validar_casos(casos):
    if not isinstance(casos, list) or len(casos) < 20:
        raise ValueError("A1 exige pelo menos 20 casos documentados.")
    ids, requisitos = set(), set()
    for caso in casos:
        if not isinstance(caso, list) or len(caso) != 8:
            raise ValueError("Cada CT precisa de ID, requisito, título, pré-condição, dados, passos, esperado e teste.")
        cid, req, titulo, pre, dados, passos, esperado, teste = caso
        if not isinstance(cid, str) or not re.fullmatch(r"CT-\d{3}", cid) or cid in ids:
            raise ValueError(f"ID de caso inválido ou duplicado: {cid}")
        ids.add(cid)
        if not all(isinstance(v, str) and v.strip() for v in (req, titulo, pre, dados, esperado)):
            raise ValueError(f"{cid}: campos obrigatórios vazios.")
        if not isinstance(passos, list) or not passos or not all(isinstance(p, str) and p.strip() for p in passos):
            raise ValueError(f"{cid}: passos inválidos.")
        vinculados = {r.strip() for r in req.split(",")}
        if not vinculados <= REQUISITOS:
            raise ValueError(f"{cid}: requisito desconhecido: {vinculados - REQUISITOS}")
        requisitos |= vinculados
        if teste is not None and (not isinstance(teste, str) or not teste.strip()):
            raise ValueError(f"{cid}: título de teste inválido.")
    if requisitos != REQUISITOS:
        raise ValueError(f"Requisitos sem CT: {sorted(REQUISITOS - requisitos)}")
    return {"casos": len(casos), "requisitos": len(requisitos),
            "automatizados": sum(c[7] is not None for c in casos),
            "planejados": sum(c[7] is None for c in casos)}


def validar_relatorio(relatorio, casos):
    testes = [t for suite in relatorio.get("testResults", []) for t in suite.get("assertionResults", [])]
    if (relatorio.get("success") is not True or not testes
            or relatorio.get("numTotalTests") != len(testes)
            or relatorio.get("numPassedTests") != len(testes)
            or relatorio.get("numFailedTests") != 0
            or relatorio.get("numPendingTests") != 0
            or any(t.get("status") != "passed" for t in testes)):
        raise ValueError("Evidência incompleta: todos os testes devem ter sido executados e aprovados.")
    for caso in casos:
        if caso[7] and sum(t.get("title") == caso[7] for t in testes) != 1:
            raise ValueError(f"{caso[0]}: teste associado ausente ou ambíguo na execução.")


def fontes_projeto(root=ROOT):
    """Inclui código novo ainda não commitado; não segue links ou dados locais."""
    excluidas = {"node_modules", "dist", "coverage", ".git", "__pycache__", ".venv", ".vite"}
    extensoes = {".ts", ".tsx", ".js", ".mjs", ".cjs", ".css", ".html", ".json", ".md", ".svg"}
    def percorrer(pasta):
        for p in sorted(pasta.iterdir()):
            if p.is_symlink() or p.name in excluidas:
                continue
            relativo = p.relative_to(root).as_posix()
            if relativo == "backend/data":
                continue
            if p.is_dir():
                yield from percorrer(p)
            elif not (p.name.startswith(".env") and p.name != ".env.example"):
                if p.suffix in extensoes or p.name in {".gitignore", ".env.example"}:
                    yield p
    for nome in ("backend", "frontend"):
        yield from percorrer(root/nome)


def validar_documentacao(root=ROOT):
    docs = root / "docs/a1"
    obrigatorios = [docs / nome for nome in DOCUMENTOS] + [root/"README.md", root/"backend/package-lock.json",
        root/"frontend/package-lock.json", root/"T1 - Requisitos do Cliente.docx", root/"Trabalho_Integrador_A1_A3_GQS.pdf"]
    for path in obrigatorios:
        if not path.is_file() or path.stat().st_size == 0:
            raise ValueError(f"Entregável obrigatório ausente/vazio: {path.relative_to(root)}")
    casos = json.loads((docs/"casos.json").read_text(encoding="utf8"))
    resumo = validar_casos(casos)
    matriz = (docs/"03_Rastreabilidade.md").read_text(encoding="utf8")
    for req in REQUISITOS:
        if not re.search(rf"^\| {req} \|", matriz, re.M):
            raise ValueError(f"{req} ausente da matriz de rastreabilidade.")
    titulos = []
    for path in (root/"backend/test").glob("*.test.ts"):
        titulos.extend(re.findall(r'\btest\(\s*"([^"\n]+)"', path.read_text(encoding="utf8")))
    for caso in casos:
        if caso[7] and titulos.count(caso[7]) != 1:
            raise ValueError(f"{caso[0]}: título automatizado não encontrado univocamente no código.")
    return resumo
