/* eslint-disable sonarjs/no-floating-point-equality -- Valores monetários normalizados precisam coincidir exatamente. */
import { describe, expect, test } from "vitest";
import { arredondarMoeda, multiplicarMoeda, somarMoeda, LIMITE_MONETARIO } from "../src/models/valoresMonetarios.js";
import Colaborador from "../src/models/colaboradorModel.js";
import ColaboradorFactory from "../src/models/colaboradorFactory.js";
import type { DadosBase, DadosColaborador } from "../src/models/colaboradorTypes.js";

describe("Unidade RF006/RF008/RN008 - precisão decimal", () => {
  test.each([[2.135, 2.14], [1.005, 1.01], [10.075, 10.08], [0, 0], [0.004, 0], [1e-7, 0], [1e12, 1e12]])(
    "RF006 arredonda %s para %s", (entrada, esperado) => expect(arredondarMoeda(entrada)).toBe(esperado),
  );
  test.each([NaN, Infinity, -1, -Infinity])("RNF002 rejeita número inválido %s", (n) => {
    expect(() => arredondarMoeda(n)).toThrow("finito e não negativo");
  });
  test("RF003/RF006 corrige comissão de 50% sobre 4,27", () => {
    const c = ColaboradorFactory.criar({ matricula: "C", nome: "Comissão", tipo: "Comissionado",
      salarioBase: 1000, valorVendas: 4.27, percentualComissao: 50 });
    expect(c.adicional).toBe(2.14);
    expect(c.salarioFinal).toBe(1002.14);
  });
  test("RF004/RF006 calcula produção decimal e normaliza a base", () => {
    const c = ColaboradorFactory.criar({ matricula: "P", nome: "Produção", tipo: "Produção",
      salarioBase: 1.005, quantidadeProduzida: 0.5, valorPorUnidade: 4.27 });
    expect(c.salarioBase).toBe(1.01);
    expect(c.adicional).toBe(2.14);
    expect(c.salarioFinal).toBe(3.15);
  });
  test("RF006 compara 10 mil comissões com referência inteira independente", () => {
    for (let centavos = 0; centavos < 10000; centavos++) {
      expect(multiplicarMoeda(centavos / 100, 50, true)).toBe(Math.floor((centavos + 1) / 2) / 100);
    }
  });
  test("RF008 soma centavos sem erro binário e aceita folha vazia", () => {
    expect(somarMoeda([0.1, 0.2, 2.14])).toBe(2.44);
    expect(somarMoeda([])).toBe(0);
    expect(somarMoeda([LIMITE_MONETARIO - 0.01, 0.01])).toBe(LIMITE_MONETARIO);
  });
  test("RF006/RF008 bloqueia limites individuais, produtos e total", () => {
    expect(() => arredondarMoeda(LIMITE_MONETARIO + 1)).toThrow("limite numérico seguro");
    expect(() => multiplicarMoeda(1e200, 1e200)).toThrow("limite numérico seguro");
    expect(() => somarMoeda([6e11, 6e11])).toThrow("limite numérico seguro");
    expect(multiplicarMoeda(1e21, 0)).toBe(0);
  });
  test("RNF004/CT-030 extensão por subclasse preserva cálculos existentes", () => {
    class ColaboradorBonusExperimental extends Colaborador<"Bônus experimental"> {
      override calcularAdicional() { return 100; }
    }
    function fabricaExperimental(dados: DadosColaborador | (DadosBase & { tipo: "Bônus experimental" })) {
      if (dados.tipo !== "Bônus experimental") return ColaboradorFactory.criar(dados);
      const colaborador = new ColaboradorBonusExperimental(dados);
      colaborador.definirRemuneracao();
      return colaborador;
    }
    const base = { matricula: "EXT", nome: "Experimento", salarioBase: 1000 };
    const novo = fabricaExperimental({ ...base, tipo: "Bônus experimental" });
    expect(novo.salarioFinal).toBe(1100);
    expect(novo.tipo).toBe("Bônus experimental");
    expect(fabricaExperimental({ ...base, tipo: "Padrão" }).salarioFinal).toBe(1000);
    expect(fabricaExperimental({ ...base, tipo: "Comissionado", valorVendas: 2000, percentualComissao: 10 }).salarioFinal).toBe(1200);
    expect(fabricaExperimental({ ...base, tipo: "Produção", quantidadeProduzida: 20, valorPorUnidade: 5 }).salarioFinal).toBe(1100);
    // Categoria experimental apenas no teste; não adiciona uma quarta categoria ao produto.
  });
});
