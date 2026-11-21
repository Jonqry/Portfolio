'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// A maquete 3D entra por trás da planta SVG, só no navegador e só se houver WebGL (DESIGN.md, seções 5 e 6).
// A planta continua sendo a página: os links, o teclado e o leitor de tela usam o SVG, e o 3D só acompanha.
const Maquete = dynamic(() => import('./Maquete'), { ssr: false });

function temWebGL() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

const comodoDe = (alvo) => alvo?.closest?.('a[data-comodo]')?.dataset.comodo ?? null;

export default function PlantaViva({ children }) {
  const caixa = useRef(null);
  const [ligada, setLigada] = useState(false);
  const [pronta, setPronta] = useState(false);
  const [ativo, setAtivo] = useState(null);

  useEffect(() => setLigada(temWebGL()), []);

  // O cômodo sob o mouse ou com o foco do teclado acende também no 3D
  useEffect(() => {
    const el = caixa.current;
    const mouse = (e) => setAtivo(comodoDe(e.target));
    const foco = (e) => setAtivo(comodoDe(e.target));
    const saiu = () => setAtivo(null);
    el.addEventListener('pointerover', mouse);
    el.addEventListener('pointerleave', saiu);
    el.addEventListener('focusin', foco);
    el.addEventListener('focusout', saiu);
    return () => {
      el.removeEventListener('pointerover', mouse);
      el.removeEventListener('pointerleave', saiu);
      el.removeEventListener('focusin', foco);
      el.removeEventListener('focusout', saiu);
    };
  }, []);

  return (
    <div ref={caixa} className={`planta-viva${pronta ? ' com-3d' : ''}`}>
      {ligada && <Maquete ativo={ativo} aoCarregar={() => setPronta(true)} />}
      {children}
    </div>
  );
}
