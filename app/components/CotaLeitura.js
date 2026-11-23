'use client';

// Cota na lateral da tela que vai medindo o quanto da página já foi lido.
// Só aparece em telas largas (regras no globals.css).
import { useEffect, useRef } from 'react';

export default function CotaLeitura() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let pedido = 0;
    const medir = () => {
      pedido = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const lido = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 1;
      el.style.setProperty('--lido', lido.toFixed(4));
    };
    const agendar = () => {
      if (!pedido) pedido = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    return () => {
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      cancelAnimationFrame(pedido);
    };
  }, []);

  return (
    <div ref={ref} className="cota-leitura" aria-hidden="true">
      <span className="cota-leitura-medida" />
    </div>
  );
}
