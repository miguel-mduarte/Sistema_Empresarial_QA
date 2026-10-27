import { expect, test } from 'vitest';
import { buildEmployeePayload, employeeToForm, initialEmployeeForm, validateEmployeeForm } from '../src/utils/colaboradorForm';
import { formatarMoeda } from '../src/utils/formatters';

test('RF001/RNF002 - exige matrícula, nome e salário no formulário', () => {
  expect(Object.keys(validateEmployeeForm(initialEmployeeForm))).toEqual(['matricula', 'nome', 'salarioBase']);
});
test.each(['.', '..', ' . '])('RF001/RF009 - rejeita matrícula reservada %s', (matricula) => {
  expect(validateEmployeeForm({ ...initialEmployeeForm, matricula }).matricula).toBeTruthy();
});
test.each(['-1', 'Infinity', '1e308'])('RF006/RNF002 - rejeita valor inválido %s', (salarioBase) => {
  expect(validateEmployeeForm({ ...initialEmployeeForm, salarioBase }).salarioBase).toBeTruthy();
});
test('RF002 - permite zero e ponto interno na matrícula', () => {
  const form = { ...initialEmployeeForm, matricula: ' REG.01 ', nome: ' Ana ', salarioBase: '0' };
  expect(validateEmployeeForm(form)).toEqual({});
  expect(buildEmployeePayload(form)).toEqual({ matricula: 'REG.01', nome: 'Ana', salarioBase: 0, tipo: 'Padrão' });
});
test('RF003/RF004 - valida e converte campos das categorias', () => {
  const base = { ...initialEmployeeForm, matricula: 'A', nome: 'Ana', salarioBase: '1000' };
  expect(validateEmployeeForm({ ...base, tipo: 'Comissionado' }).valorVendas).toBeTruthy();
  expect(validateEmployeeForm({ ...base, tipo: 'Produção' }).quantidadeProduzida).toBeTruthy();
  const c = buildEmployeePayload({ ...base, tipo: 'Comissionado', valorVendas: '4.27', percentualComissao: '50' });
  expect(c).toMatchObject({ tipo: 'Comissionado', valorVendas: Number('4.27'), percentualComissao: 50 });
  const p = buildEmployeePayload({ ...base, tipo: 'Produção', quantidadeProduzida: '5', valorPorUnidade: '2' });
  expect(p).toMatchObject({ tipo: 'Produção', quantidadeProduzida: 5, valorPorUnidade: 2 });
});
test('RF009 - edição preserva campos existentes', () => {
  const form = employeeToForm({ id: 'id', matricula: 'A', nome: 'Ana', tipo: 'Comissionado', salarioBase: 1000,
    valorVendas: 10, percentualComissao: 5, adicional: 0.5, salarioFinal: 1000.5, criadoEm: '2026-10-27' });
  expect(form.valorVendas).toBe('10');
  expect(form.percentualComissao).toBe('5');
});
test('RF007 - valor inválido não aparece como zero', () => {
  expect(formatarMoeda(NaN)).toBe('Valor indisponível');
  expect(formatarMoeda(Infinity)).toBe('Valor indisponível');
  expect(formatarMoeda(0)).toContain('0,00');
});
