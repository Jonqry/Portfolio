'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState } from 'react';

// A maquete 3D entra por trás da planta SVG, só no navegador e só se houver WebGL (DESIGN.md, seções 5 e 6).
// A planta continua sendo a página: os links, o teclado e o leitor de tela usam o SVG, e o 3D só acompanha.
const Maquete = dynamic(() => import('./Maquete'), { ssr: false });

// O 3D só liga com WebGL 2 e num aparelho que aguenta: memória e núcleos de sobra, e sem economia de dados.
// Senão fica a planta SVG, que já é a página inteira (DESIGN.md, seção 6).
function aparelhoAguenta() {
  const { deviceMemory, hardwareConcurrency, connection } = navigator;
  if (deviceMemory && deviceMemory < 4) return false;
  if (hardwareConcurrency && hardwareConcurrency < 4) return false;
  if (connection?.saveData) return false;
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

// Se o 3D der erro (modelo que não carrega, WebGL perdido), ele some e a planta continua.
class SemMaquete extends Component {
  state = { erro: false };
  static getDerivedStateFromError() {
    return { erro: true };
  }
  render() {
    return this.state.erro ? null : this.props.children;
  }
}

const comodoDe = (alvo) => alvo?.closest?.('a[data-comodo]')?.dataset.comodo ?? null;
const entre = (a, b, t) => Math.min(1, Math.max(0, (t - a) / (b - a)));

export default function PlantaViva({ children }) {
  const caixa = useRef(null);
  const progresso = useRef(0); // 0 = planta vista de cima, 1 = maquete (lido pela câmera a cada quadro)
  const [ligada, setLigada] = useState(false);
  const [pronta, setPronta] = useState(false);
  const [ativo, setAtivo] = useState(null);
  const [em3d, setEm3d] = useState(false);

  useEffect(() => setLigada(aparelhoAguenta()), []);

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

  // Rolagem conduzida: com a maquete pronta, tela larga e sem movimento reduzido, o palco fica preso na tela
  // e a rolagem dentro dele vira o progresso da planta para a maquete (DESIGN.md, seção 3)
  useEffect(() => {
    if (!pronta) return;
    const el = caixa.current;
    const palco = el.closest('.palco');
    const nav = document.querySelector('.nav');
    const largo = window.matchMedia('(min-width: 768px)');
    const calmo = window.matchMedia('(prefers-reduced-motion: reduce)');
    const medir = () => {
      const r = palco.getBoundingClientRect();
      const curso = r.height - (window.innerHeight - (nav?.offsetHeight ?? 0));
      const p = palco.classList.contains('rolagem') && curso > 0 ? entre(0, curso, (nav?.offsetHeight ?? 0) - r.top) : 0;
      progresso.current = p;
      el.style.setProperty('--planta-visivel', String(1 - entre(0.12, 0.28, p)));
      el.style.setProperty('--vinheta', String(entre(0.25, 0.6, p)));
      setEm3d(p > 0.28);
      window.dispatchEvent(new Event('maquete-progresso'));
    };
    const fixo = palco.querySelector('.palco-fixo');
    const ligar = () => {
      // Preso na tela, o palco precisa caber inteiro nela, senão o último botão fica inalcançável
      const altura = Math.max(...[...fixo.children].map((c) => c.offsetHeight));
      const cabe = altura <= window.innerHeight - (nav?.offsetHeight ?? 0);
      palco.classList.toggle('rolagem', largo.matches && !calmo.matches && cabe);
      palco.style.setProperty('--altura-nav', `${nav?.offsetHeight ?? 0}px`);
      medir();
    };
    ligar();
    window.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', ligar);
    largo.addEventListener('change', ligar);
    calmo.addEventListener('change', ligar);
    return () => {
      window.removeEventListener('scroll', medir);
      window.removeEventListener('resize', ligar);
      largo.removeEventListener('change', ligar);
      calmo.removeEventListener('change', ligar);
      palco.classList.remove('rolagem');
    };
  }, [pronta]);

  return (
    <div ref={caixa} className={`planta-viva${pronta ? ' com-3d' : ''}${em3d ? ' em-3d' : ''}`}>
      {ligada && (
        <SemMaquete>
          <Maquete ativo={ativo} progresso={progresso} aoCarregar={() => setPronta(true)} />
        </SemMaquete>
      )}
      {children}
    </div>
  );
}
