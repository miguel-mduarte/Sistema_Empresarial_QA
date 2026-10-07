import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from a1_validacao import ROOT, fontes_projeto, validar_casos, validar_documentacao, validar_relatorio


class EntregaA1Tests(unittest.TestCase):
    def setUp(self):
        self.casos = json.loads((ROOT/"docs/a1/casos.json").read_text(encoding="utf8"))

    def test_documentacao_tem_requisitos_e_vinculos_com_codigo(self):
        self.assertEqual(validar_documentacao()["requisitos"], 21)

    def test_rejeita_menos_de_vinte_casos(self):
        with self.assertRaisesRegex(ValueError, "20"):
            validar_casos(self.casos[:19])

    def test_rejeita_id_duplicado(self):
        self.casos[1][0] = self.casos[0][0]
        with self.assertRaisesRegex(ValueError, "duplicado"):
            validar_casos(self.casos)

    def test_rejeita_caso_sem_passos(self):
        self.casos[0][5] = []
        with self.assertRaisesRegex(ValueError, "passos"):
            validar_casos(self.casos)

    def test_rejeita_requisito_sem_teste(self):
        self.casos = [c for c in self.casos if "RNF001" not in c[1]]
        with self.assertRaisesRegex(ValueError, "RNF001"):
            validar_casos(self.casos)

    def test_rejeita_relatorio_vazio_mesmo_com_success(self):
        with self.assertRaisesRegex(ValueError, "incompleta"):
            validar_relatorio({"success": True}, self.casos)

    def test_nao_confunde_ignorado_com_aprovado(self):
        report = {"success": True, "numTotalTests": 1, "numPassedTests": 1,
                  "numFailedTests": 0, "numPendingTests": 0,
                  "testResults": [{"assertionResults": [{"status": "pending", "title": "teste"}]}]}
        with self.assertRaisesRegex(ValueError, "incompleta"):
            validar_relatorio(report, [])

    def test_fontes_novas_incluidas_sem_segredos_ou_dados(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            for name in ["frontend/src/novo.ts", "frontend/src/data/tipos.ts", "backend/src/app.ts",
                         "backend/src/data/repo.ts", "backend/.env", "backend/.env.local",
                         "backend/.env.example", "backend/data/pessoas.json", "backend/node_modules/x/index.js"]:
                p = root/name
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text("fixture", encoding="utf8")
            included = {p.relative_to(root).as_posix() for p in fontes_projeto(root)}
            self.assertEqual(included, {"frontend/src/novo.ts", "frontend/src/data/tipos.ts",
                                       "backend/src/app.ts", "backend/src/data/repo.ts", "backend/.env.example"})


if __name__ == "__main__":
    unittest.main()
