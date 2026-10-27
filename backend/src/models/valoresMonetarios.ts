import ErroDeNegocio from "../errors/erroDeNegocio.js";

// Limite técnico por valor monetário e por folha; mantém centavos representáveis em JSON.
export const LIMITE_MONETARIO = 1_000_000_000_000;
const LIMITE_CENTAVOS = 100_000_000_000_000n;

function fracao(valor: number): [bigint, bigint] {
  if (!Number.isFinite(valor) || valor < 0) {
    throw new ErroDeNegocio("Informe um número finito e não negativo.");
  }
  // Usa a representação decimal da entrada, não o produto binário de floats.
  const [mantissa, expoente = "0"] = String(valor).toLowerCase().split("e");
  const [inteiro, decimal = ""] = mantissa.split(".");
  const escala = decimal.length - Number(expoente);
  const numerador = BigInt(inteiro + decimal);
  return escala >= 0
    ? [numerador, 10n ** BigInt(escala)]
    : [numerador * 10n ** BigInt(-escala), 1n];
}

function centavos(numerador: bigint, denominador: bigint): bigint {
  // Half-up: frações de meio centavo ou mais arredondam para cima.
  return (numerador * 200n + denominador) / (2n * denominador);
}

function reais(valor: bigint): number {
  if (valor > LIMITE_CENTAVOS) {
    throw new ErroDeNegocio("O valor calculado excede o limite numérico seguro de R$ 1 trilhão. Reduza os valores informados.");
  }
  return Number(valor) / 100;
}

export function arredondarMoeda(valor: number): number {
  return reais(centavos(...fracao(valor)));
}

export function multiplicarMoeda(a: number, b: number, percentual = false): number {
  const [an, ad] = fracao(a);
  const [bn, bd] = fracao(b);
  return reais(centavos(an * bn, ad * bd * (percentual ? 100n : 1n)));
}

export function somarMoeda(valores: number[]): number {
  return reais(valores.reduce((total, valor) => total + centavos(...fracao(valor)), 0n));
}
