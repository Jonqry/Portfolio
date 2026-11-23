'use client';

// Demo do Simulador na home: dois campos e a resposta na hora.
// O visual é o do próprio Simulador (a "via do cliente"), dentro de uma moldura de cômodo.
import { useEffect, useRef, useState } from 'react';
import { Bitter } from 'next/font/google';
import { simularDemo, linkSimulador, lerReais } from '../lib/simulador-demo.mjs';
import s from './DemoSimulador.module.css';

const bitter = Bitter({ subsets: ['latin'], variable: '--fonte-via' });
const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const porcento = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 2 });
const milhar = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function Campo({ id, rotulo, valor, onChange }) {
  // Como no Simulador: os pontos de milhar entram ao sair do campo, nunca durante a digitação.
  function formatar() {
    const centavos = lerReais(valor);
    if (centavos !== null) onChange(milhar.format(centavos / 100));
  }
  return (
    <div className={s.campo}>
      <label htmlFor={id}>{rotulo}</label>
      <div className={s.entrada}>
        <span aria-hidden="true">R$</span>
        <input id={id} inputMode="decimal" autoComplete="off" value={valor} onChange={(e) => onChange(e.target.value)} onBlur={formatar} />
      </div>
    </div>
  );
}

// A parcela rola do valor anterior até o novo quando a pessoa muda a renda ou o imóvel.
// O leitor de tela recebe só o valor final.
function Parcela({ centavos }) {
  const [mostrado, setMostrado] = useState(centavos);
  const atual = useRef(centavos);

  useEffect(() => {
    const de = atual.current;
    if (de === centavos || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      atual.current = centavos;
      setMostrado(centavos);
      return;
    }
    const inicio = performance.now();
    let quadro = 0;
    const passo = (agora) => {
      const t = Math.min(1, (agora - inicio) / 350);
      atual.current = Math.round(de + (centavos - de) * (1 - (1 - t) ** 3));
      setMostrado(atual.current);
      if (t < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [centavos]);

  return (
    <p className={s.parcela}>
      <span aria-hidden="true">{reais.format(mostrado / 100)}</span>
      <span className="sr-only">{reais.format(centavos / 100)}</span>
    </p>
  );
}

function Resultado({ renda, valor }) {
  if (!renda || !valor) {
    return <p className={s.vazio}>Digite a renda e o valor do imóvel para ver a parcela.</p>;
  }
  const r = simularDemo(renda, valor);
  const cabe = r.nivel !== 'acima';
  const programa =
    r.enquadramento.programa === 'MCMV' ? `Minha Casa, Minha Vida, Faixa ${r.enquadramento.faixa}` : 'SBPE (taxa de mercado)';
  const peso = porcento.format(r.percentual);
  const frase = {
    ok: `Usa ${peso} da renda. Cabe com folga.`,
    atencao: `Usa ${peso} da renda. Cabe, mas perto do limite de 30%.`,
    acima: `Usa ${peso} da renda, acima do limite de 30%.`,
  }[r.nivel];

  return (
    <>
      <div className={s.cabecalho}>
        <div>
          <p className={s.programa}>{programa}</p>
          <p className={s.sistema}>
            {r.sistema === 'PRICE' ? 'Tabela PRICE' : 'SAC'}, {porcento.format(r.enquadramento.taxaAnual)} ao ano
          </p>
        </div>
        <span key={String(cabe)} className={`${s.carimbo} ${cabe ? s.bom : s.critico}`} aria-hidden="true">
          {cabe ? 'Cabe na renda' : 'Não cabe na renda'}
        </span>
      </div>
      <p className={s.rotulo}>1ª parcela</p>
      <Parcela centavos={r.primeiraParcela} />
      <p className={`${s.renda} ${s[r.nivel]}`}>{frase}</p>
      <a className={s.botao} href={linkSimulador(renda, valor, r.entrada)} target="_blank" rel="noopener noreferrer">
        Abrir o simulador completo
      </a>
    </>
  );
}

export default function DemoSimulador() {
  const [renda, setRenda] = useState('6.000');
  const [valor, setValor] = useState('250.000');

  return (
    <section id="simulador" aria-labelledby="simulador-titulo" className={`${s.comodo} ${bitter.variable}`}>
      <div className={s.via}>
        <div className={s.texto}>
          <h2 id="simulador-titulo" className={s.titulo}>A parcela cabe na renda do cliente?</h2>
          <p>
            Uma versão curta do simulador de financiamento que fiz para o dia a dia do corretor. Mude os valores e veja a
            resposta.
          </p>
          <Campo id="demo-renda" rotulo="Renda bruta mensal" valor={renda} onChange={setRenda} />
          <Campo id="demo-valor" rotulo="Valor do imóvel" valor={valor} onChange={setValor} />
          <p className={s.nota}>Com 20% de entrada, 35 anos e as taxas de novembro de 2026.</p>
        </div>
        <div className={s.folha} aria-live="polite">
          <Resultado renda={lerReais(renda)} valor={lerReais(valor)} />
        </div>
      </div>
    </section>
  );
}
