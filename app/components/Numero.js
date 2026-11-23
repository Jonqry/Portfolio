'use client';

// Número que conta do zero até o valor quando aparece na tela, uma vez só.
// O HTML do servidor já vem com o valor final, e o leitor de tela lê sempre o valor final.
import { useEffect, useRef, useState } from 'react';

const DURACAO = 900;

export default function Numero({ valor, casas = 0, prefixo = '', sufixo = '' }) {
  const formato = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
  const final = `${prefixo}${formato.format(valor)}${sufixo}`;
  const [atual, setAtual] = useState(valor);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let quadro = 0;
    const observador = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return;
      observador.disconnect();
      const inicio = performance.now();
      const passo = (agora) => {
        const t = Math.min(1, (agora - inicio) / DURACAO);
        setAtual(valor * (1 - (1 - t) ** 3)); // desacelera no fim
        if (t < 1) quadro = requestAnimationFrame(passo);
      };
      setAtual(0);
      quadro = requestAnimationFrame(passo);
    }, { threshold: 0.6 });
    observador.observe(el);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, [valor]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">{`${prefixo}${formato.format(atual)}${sufixo}`}</span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
