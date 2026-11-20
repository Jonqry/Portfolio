// Testes do cálculo da demo. Rodam com o test runner do próprio Node: npm test
// Os valores esperados saem do Simulador (mesmas entradas, mesmo resultado).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enquadrar, simularDemo, linkSimulador, lerReais } from './simulador-demo.mjs';

test('cenário padrão do Simulador: Faixa 3, PRICE, 1ª parcela de R$ 1.508,57', () => {
  const r = simularDemo(6_000_00, 250_000_00);
  assert.deepEqual(r.enquadramento, { programa: 'MCMV', faixa: 3, taxaAnual: 0.0816 });
  assert.equal(r.sistema, 'PRICE');
  assert.equal(r.entrada, 50_000_00);
  assert.equal(r.primeiraParcela, 1_508_57);
  assert.equal(r.nivel, 'atencao');
});

test('o teto do imóvel é inclusivo e, passando dele, sobe de faixa', () => {
  assert.deepEqual(enquadrar(6_000_00, 400_000_00), { programa: 'MCMV', faixa: 3, taxaAnual: 0.0816 });
  assert.deepEqual(enquadrar(6_000_00, 400_000_01), { programa: 'MCMV', faixa: 4, taxaAnual: 0.1 });
  assert.deepEqual(enquadrar(2_000_00, 275_000_01), { programa: 'MCMV', faixa: 3, taxaAnual: 0.0816 });
});

test('renda acima de R$ 13 mil ou imóvel acima de R$ 600 mil vai para o SBPE, no SAC', () => {
  assert.equal(enquadrar(13_000_00, 300_000_00).programa, 'MCMV');
  assert.deepEqual(enquadrar(13_000_01, 300_000_00), { programa: 'SBPE', motivo: 'renda', taxaAnual: 0.1139 });
  assert.deepEqual(enquadrar(11_000_00, 650_000_00), { programa: 'SBPE', motivo: 'imovel', taxaAnual: 0.1139 });
  assert.equal(simularDemo(20_000_00, 700_000_00).sistema, 'SAC');
});

test('a renda usa a maior parcela do contrato, como no Simulador', () => {
  // Aqui a última parcela da PRICE sai maior que a primeira pelo arredondamento.
  const r = simularDemo(10_342_05, 120_907_07);
  assert.equal(r.primeiraParcela, 875_74);
  assert.ok(r.percentual > r.primeiraParcela / 10_342_05);
});

test('passa de 30% da renda: não cabe', () => {
  assert.equal(simularDemo(3_000_00, 250_000_00).nivel, 'acima');
});

test('o link abre o Simulador completo com os mesmos valores', () => {
  assert.equal(
    linkSimulador(6_000_00, 250_000_00, 50_000_00),
    'https://simulador-financiamento-blush.vercel.app/?valor=250000&entrada=50000&renda=6000',
  );
});

test('lê valores como o corretor digita', () => {
  assert.equal(lerReais('250.000'), 250_000_00);
  assert.equal(lerReais('R$ 6.000,50'), 6_000_50);
  assert.equal(lerReais('6000'), 6_000_00);
  assert.equal(lerReais(''), null);
  assert.equal(lerReais('abc'), null);
});
