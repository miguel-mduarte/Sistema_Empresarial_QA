#!/usr/bin/env python3
"""Verifica a A1 e captura evidências atuais antes de gerar PDF e ZIP."""
import argparse
import hashlib
import importlib.util
import json
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path

from a1_validacao import ROOT, fontes_projeto, validar_documentacao, validar_relatorio


def executar(comando, pasta, registros, logdir):
    print(f"\n[{pasta.name}] {' '.join(map(str, comando))}", flush=True)
    resultado = subprocess.run(comando, cwd=pasta, text=True, stdout=subprocess.PIPE,
                               stderr=subprocess.STDOUT, encoding="utf8", errors="replace")
    print(resultado.stdout, flush=True)
    logfile = f"check-{len(registros)+1:02}.log"
    (logdir/logfile).write_text(resultado.stdout, encoding="utf8")
    registros.append({"projeto": pasta.name, "comando": list(map(str, comando)),
                      "exitCode": resultado.returncode, "log": logfile})
    if resultado.returncode:
        raise RuntimeError(f"Verificação falhou: {' '.join(map(str, comando))}. Evidências anteriores preservadas.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--somente-verificar", action="store_true")
    args = parser.parse_args()
    resumo = validar_documentacao()
    print(f"A1: {resumo['casos']} CTs; {resumo['requisitos']} requisitos rastreados.", flush=True)
    if not args.somente_verificar:
        for module in ("reportlab", "pypdf"):
            if importlib.util.find_spec(module) is None:
                raise RuntimeError("Instale as dependências: python -m pip install -r scripts/requirements-a1.txt")
    npm = shutil.which("npm")
    if not npm:
        raise RuntimeError("npm não encontrado. Instale Node.js >=22.13.")
    registros = []
    with tempfile.TemporaryDirectory(prefix="folha-clara-a1-") as temp:
        staging = Path(temp)
        executar([sys.executable, "-m", "unittest", "discover", "-s", "scripts/tests", "-v"], ROOT, registros, staging)
        for projeto in ("backend", "frontend"):
            for tarefa in ("typecheck", "lint", "build"):
                executar([npm, "run", tarefa], ROOT/projeto, registros, staging)
        executar([npm, "run", "test:coverage", "--", f"--coverage.reportsDirectory={staging/'coverage'}",
                  "--reporter=default", "--reporter=json", f"--outputFile={staging/'vitest.json'}"],
                 ROOT/"backend", registros, staging)
        relatorio = json.loads((staging/"vitest.json").read_text(encoding="utf8"))
        casos = json.loads((ROOT/"docs/a1/casos.json").read_text(encoding="utf8"))
        validar_relatorio(relatorio, casos)
        if args.somente_verificar:
            print("A1 verificada. Nenhuma evidência salva ou documento substituído.")
            return
        evid = ROOT/"docs/a1/evidencias"
        evid.mkdir(parents=True, exist_ok=True)
        # Só publicar depois que todas as verificações e a cobertura passarem.
        shutil.copy2(staging/"vitest.json", evid/"vitest-resultados.json")
        shutil.copy2(staging/"coverage/coverage-final.json", evid/"coverage-final.json")
        for registro in registros:
            shutil.copy2(staging/registro["log"], evid/registro["log"])
        git = shutil.which("git")
        revisao = "Pacote sem metadados Git; consultar histórico exportado."
        if git and (ROOT/".git").exists():
            historico = subprocess.check_output([git, "log", "--date=iso-strict", "--format=%H | %ad | %an | %s"], cwd=ROOT, text=True)
            (evid/"historico_commits.txt").write_text(historico, encoding="utf8")
            revisao = subprocess.check_output([git, "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
        metadados = {"executadoEm": datetime.now().astimezone().isoformat(), "revisao": revisao,
                     "verificacoes": registros, "rastreabilidade": resumo,
                     "fontes": {p.relative_to(ROOT).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
                                for p in fontes_projeto()}}
        (evid/"execucao.json").write_text(json.dumps(metadados, ensure_ascii=False, indent=2)+"\n", encoding="utf8")
        linhas = ["# Verificações da preparação A1", "", f"Execução: {metadados['executadoEm']}", "",
                  f"Revisão-base: {revisao}. Hashes dos arquivos testados em execucao.json incluem alterações ainda não commitadas.", "",
                  "| Projeto | Verificação | Resultado |", "| --- | --- | --- |"]
        for registro in registros:
            comando = registro["comando"]
            tarefa = "test:coverage (JSON e cobertura em pasta temporária isolada)" if "test:coverage" in comando else " ".join(comando[1:])
            linhas.append(f"| {registro['projeto']} | {tarefa} | Passou; log {registro['log']} |")
        linhas += ["", f"Vitest: {relatorio['numPassedTests']}/{relatorio['numTotalTests']} testes aprovados; zero falhas/ignorados. Cobertura mínima de 80% por arquivo aprovada em quatro métricas.", "",
                   "Cobertura medida apenas no backend. Detalhes em cobertura-resumo.json e coverage-final.json.", "",
                   f"{resumo['automatizados']} casos documentados associados à automação e {resumo['planejados']} planejados. CT-011 a CT-016 compartilham um teste; CT-017 e CT-018 também. Casos documentados e testes Vitest são contagens diferentes.", "",
                   "Os testes manuais não foram executados por este comando. A revisão visual do PDF deve ser realizada antes da submissão."]
        (evid/"Verificacoes.md").write_text("\n".join(linhas)+"\n", encoding="utf8")
        subprocess.run([sys.executable, str(ROOT/"scripts/gerar_entrega_a1.py")], cwd=ROOT, check=True)
    print("Entrega A1 atualizada em output/. Confira o PDF antes de enviar.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, OSError, subprocess.CalledProcessError) as error:
        print(f"Erro: {error}", file=sys.stderr)
        sys.exit(1)
