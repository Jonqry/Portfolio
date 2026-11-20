// Cálculo da demo do Simulador na home.
//
// É uma cópia do necessário do repositório do Simulador (Jonqry/simulador-financiamento,
// src/lib/taxasReferencia.ts e src/lib/financiamento/*), sem pacote compartilhado:
// enquadramento no MCMV, 1ª parcela com seguros e taxa, e o limite de 30% da renda.
// Se as taxas mudarem lá, mude aqui também. Dinheiro em centavos, como no Simulador.
//
// A demo fixa o que o Simulador abre por padrão: 20% de entrada, 420 meses,
// Norte/Nordeste, não cotista do FGTS e os seguros de exemplo.

export const SIMULADOR_URL = 'https://simulador-financiamento-blush.vercel.app/';

const PRAZO_MESES = 420;
const ENTRADA = 0.2;
const LIMITE_RENDA = 0.3;
const MARGEM_ATENCAO = 0.05;
const ENCARGOS = { mipMensal: 0.00011, dfiMensal: 0.000071, taxaAdministracao: 25_00 };

// Colunas: [cotista N/NE, cotista S/SE/CO, não cotista N/NE, não cotista S/SE/CO], % ao ano, nominais.
// A demo usa só a coluna "não cotista N/NE", que é o padrão do Simulador.
const TABELA_MCMV = [
  { faixa: 1, rendaAte: 2_160_00, taxa: 0.045 },
  { faixa: 1, rendaAte: 2_850_00, taxa: 0.0475 },
  { faixa: 1, rendaAte: 3_200_00, taxa: 0.05 },
  { faixa: 2, rendaAte: 3_500_00, taxa: 0.0525 },
  { faixa: 2, rendaAte: 4_000_00, taxa: 0.06 },
  { faixa: 2, rendaAte: 5_000_00, taxa: 0.07 },
  { faixa: 3, rendaAte: 9_600_00, taxa: 0.0816 },
  { faixa: 4, rendaAte: 13_000_00, taxa: 0.1 },
];
const TETO_IMOVEL = { 1: 275_000_00, 2: 275_000_00, 3: 400_000_00, 4: 600_000_00 };
const TAXA_SBPE = 0.1139;

/**
 * Programa e taxa pela renda e pelo valor do imóvel, como `enquadrar` no Simulador:
 * se o imóvel passa do teto da faixa, sobe para a próxima faixa com teto maior;
 * acima do teto da Faixa 4, SBPE. O teto é inclusivo.
 */
export function enquadrar(rendaMensal, valorImovel) {
  const linha = TABELA_MCMV.find((l) => rendaMensal <= l.rendaAte);
  if (!linha) return { programa: 'SBPE', motivo: 'renda', taxaAnual: TAXA_SBPE };

  let tetoAnterior = 0;
  for (const outra of TABELA_MCMV) {
    const valeComoDegrau = outra === linha || (outra.faixa > linha.faixa && TETO_IMOVEL[outra.faixa] > tetoAnterior);
    if (!valeComoDegrau) continue;
    tetoAnterior = TETO_IMOVEL[outra.faixa];
    if (valorImovel <= tetoAnterior) return { programa: 'MCMV', faixa: outra.faixa, taxaAnual: outra.taxa };
  }
  return { programa: 'SBPE', motivo: 'imovel', taxaAnual: TAXA_SBPE };
}

/** Prestação fixa da PRICE: PMT = P · i / (1 - (1 + i)^-n). */
function prestacaoPrice(principal, taxaMensal, prazo) {
  if (taxaMensal === 0) return Math.round(principal / prazo);
  return Math.round(principal * (taxaMensal / (1 - Math.pow(1 + taxaMensal, -prazo))));
}

/**
 * O que sai do bolso em cada mês: juros + amortização + MIP (sobre o saldo
 * antes do pagamento) + DFI (sobre o imóvel) + taxa. Mesmo motor do Simulador:
 * arredonda ao centavo todo mês e a última parcela quita o saldo.
 */
function parcelasComEncargos(sistema, principal, taxaMensal, valorImovel) {
  const amortizacaoSac = Math.floor(principal / PRAZO_MESES);
  const prestacao = prestacaoPrice(principal, taxaMensal, PRAZO_MESES);
  const dfi = Math.round(valorImovel * ENCARGOS.dfiMensal);
  const totais = [];
  let saldo = principal;
  for (let numero = 1; numero <= PRAZO_MESES && saldo > 0; numero++) {
    const juros = Math.round(saldo * taxaMensal);
    let amortizacao;
    if (numero === PRAZO_MESES) amortizacao = saldo;
    else if (sistema === 'SAC') amortizacao = Math.min(amortizacaoSac, saldo);
    else amortizacao = Math.min(prestacao - juros, saldo);
    const mip = Math.round(saldo * ENCARGOS.mipMensal);
    saldo -= amortizacao;
    totais.push(juros + amortizacao + mip + dfi + ENCARGOS.taxaAdministracao);
  }
  return totais;
}

/**
 * Simulação da demo. Recebe renda e valor do imóvel em centavos e devolve o
 * programa, o sistema que o Simulador abre (MCMV → PRICE, SBPE → SAC), a 1ª
 * parcela com seguros e taxa e quanto a maior parcela do contrato pesa na renda.
 */
export function simularDemo(rendaMensal, valorImovel) {
  if (!Number.isSafeInteger(rendaMensal) || rendaMensal <= 0) throw new RangeError('Renda deve ser positiva');
  if (!Number.isSafeInteger(valorImovel) || valorImovel <= 0) throw new RangeError('Valor do imóvel deve ser positivo');

  const enquadramento = enquadrar(rendaMensal, valorImovel);
  const sistema = enquadramento.programa === 'MCMV' ? 'PRICE' : 'SAC';
  const entrada = Math.round(valorImovel * ENTRADA);
  const totais = parcelasComEncargos(sistema, valorImovel - entrada, enquadramento.taxaAnual / 12, valorImovel);
  const primeiraParcela = totais[0];

  const percentual = Math.max(...totais) / rendaMensal;
  let nivel = 'ok';
  if (percentual > LIMITE_RENDA) nivel = 'acima';
  else if (percentual > LIMITE_RENDA - MARGEM_ATENCAO) nivel = 'atencao';

  return { enquadramento, sistema, entrada, primeiraParcela, percentual, nivel };
}

/** Link para o Simulador completo com os mesmos valores (em reais, formato de máquina). */
export function linkSimulador(rendaMensal, valorImovel, entrada) {
  const reais = (centavos) => String(centavos / 100);
  const params = new URLSearchParams({ valor: reais(valorImovel), entrada: reais(entrada), renda: reais(rendaMensal) });
  return `${SIMULADOR_URL}?${params}`;
}

/** Lê um valor digitado em reais ("250.000", "6000,50") e devolve centavos, ou null se não for número. */
export function lerReais(texto) {
  const limpo = String(texto).trim().replace(/\s|R\$/g, '').replace(/\./g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(limpo)) return null;
  return Math.round(Number(limpo) * 100);
}
