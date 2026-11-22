'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import planta from '../planta.json';
import luz from '../../public/maquete/luz.json';
import { VIEWBOX } from '../planta-svg';

// A maquete assada no Blender (blender/bake.py): cada malha mostra a cor do material vezes a luz gravada
// no lightmap do grupo dela, sem luz em tempo real. O que muda ao vivo é a câmera, a altura das paredes e
// dos móveis na rolagem e o piso do cômodo em foco.
const MARCA_TEXTO = new THREE.Color('#f5d547');
const GRAU = Math.PI / 180;

// O mesmo centro do maquete.py: o meio da caixa dos cômodos, em cm. No glTF, x = (x - cx) / 100 e
// z = (y - cy) / 100, com o y para cima.
const xs = planta.comodos.flatMap((c) => [c.x, c.x + c.largura]);
const ys = planta.comodos.flatMap((c) => [c.y, c.y + c.profundidade]);
const CX = (Math.min(...xs) + Math.max(...xs)) / 2;
const CY = (Math.min(...ys) + Math.max(...ys)) / 2;

const SECOES = planta.comodos.filter((c) => c.nome);
// Centro do piso de cada seção, para onde a câmera mergulha no clique
const CENTROS = Object.fromEntries(
  SECOES.map((c) => [c.id, new THREE.Vector3((c.x + c.largura / 2 - CX) / 100, 0, (c.y + c.profundidade / 2 - CY) / 100)]),
);
function comodoNoPonto({ x, z }) {
  const [px, py] = [x * 100 + CX, z * 100 + CY];
  return SECOES.find((c) => px >= c.x && px <= c.x + c.largura && py >= c.y && py <= c.y + c.profundidade)?.id ?? null;
}

const entre = (a, b, t) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const suave = (t) => t * t * (3 - 2 * t);
const misturar = (a, b, t) => a + (b - a) * t;

// Caminho da câmera, de 0 (planta) a 1 (maquete). No começo ela fica bem longe e com a lente bem fechada,
// quase sem perspectiva, enquadrando o mesmo retângulo do viewBox do SVG (1 unidade = 2 cm): a maquete fica
// exatamente embaixo das paredes e dos nomes da planta. Depois ela se aproxima abrindo a lente, com o mesmo
// enquadramento (dolly zoom), inclina e dá a volta até o lado da varanda, de onde vem o spot do bake (o
// mesmo ângulo do pôster), e no fim gira devagar.
const [vx, vy, vw, vh] = VIEWBOX.map((v) => v * 2);
const INICIO = { alvo: new THREE.Vector3((vx + vw / 2 - CX) / 100, 0, (vy + vh / 2 - CY) / 100), meiaAltura: vh / 200 };
const FIM = { alvo: new THREE.Vector3(0, 0.4, (260 - CY) / 100), meiaAltura: 4.4 }; // o centro da unidade
const AZIMUTE_POSTER = 144; // graus, a partir do lado da entrada: a câmera do pôster, entre a varanda e a cozinha

function posicionar(camera, p) {
  const inclina = suave(entre(0.2, 0.6, p));
  const gira = suave(entre(0.6, 1, p));
  const alvo = INICIO.alvo.clone().lerp(FIM.alvo, inclina);
  const fov = misturar(3, 34, inclina);
  const distancia = misturar(INICIO.meiaAltura, FIM.meiaAltura, inclina) / Math.tan((fov / 2) * GRAU);
  const elevacao = misturar(89.9, 46, inclina) * GRAU;
  const azimute = (AZIMUTE_POSTER * inclina + 12 * gira) * GRAU;
  camera.position.set(
    alvo.x + distancia * Math.cos(elevacao) * Math.sin(azimute),
    alvo.y + distancia * Math.sin(elevacao),
    alvo.z + distancia * Math.cos(elevacao) * Math.cos(azimute),
  );
  camera.fov = fov;
  camera.near = Math.max(0.1, distancia - 40);
  camera.far = distancia + 60;
  camera.lookAt(alvo);
  camera.updateProjectionMatrix();
  return { inclina, alvo };
}

// O que sobe na rolagem: primeiro as paredes, as portas e o vidro, depois os móveis. Pisos, lajes e base ficam.
const FIXOS = /^(Piso_|Laje|Base$)/; // Base sozinha: a base da mesa de jantar sobe
const PAREDES = /^(Paredes|Porta_|Vidro_)/;

const nomeDoNo = (nome) => THREE.PropertyBinding.sanitizeNodeName(nome);

function Modelo({ ativo, progresso, mergulho, aoCarregar }) {
  const { scene } = useGLTF('/maquete/maquete.glb', '/draco/'); // decodificador do Draco servido pelo próprio site
  const mapas = useTexture(Object.fromEntries(Object.entries(luz).map(([g, v]) => [g, `/maquete/${v.arquivo}`])));
  const { gl, invalidate } = useThree();
  const [sobre, setSobre] = useState(null); // cômodo sob o mouse na maquete, depois que a planta some

  const { pisos, sobem } = useMemo(() => {
    const grupoDe = {};
    for (const [g, v] of Object.entries(luz)) for (const n of v.objetos) grupoDe[nomeDoNo(n)] = g;
    for (const t of Object.values(mapas)) {
      t.flipY = false; // UV do glTF
      t.colorSpace = THREE.SRGBColorSpace;
      t.channel = 1; // UV 1 "Luz"
    }
    const pisos = {};
    scene.traverse((o) => {
      if (!o.isMesh) return;
      let no = o; // malha com vários materiais vira um grupo com uma malha por material
      while (no && !(no.name in grupoDe)) no = no.parent;
      const grupo = no && grupoDe[no.name];
      const original = o.material;
      o.material = grupo
        ? new THREE.MeshBasicMaterial({ color: original.color, lightMap: mapas[grupo], lightMapIntensity: luz[grupo].intensidade })
        : new THREE.MeshBasicMaterial({ color: original.color, transparent: true, opacity: 0.25 }); // vidro
      if (no?.name.startsWith('Piso_')) pisos[no.name.slice(5)] = { material: o.material, cor: original.color.clone() };
      original.dispose();
    });
    const sobem = { paredes: [], moveis: [] };
    for (const no of scene.children) {
      if (FIXOS.test(no.name)) continue;
      no.userData.altura = no.scale.y;
      sobem[PAREDES.test(no.name) ? 'paredes' : 'moveis'].push(no);
    }
    return { pisos, sobem };
  }, [scene, mapas]);

  useEffect(() => aoCarregar(), [aoCarregar]);

  const aceso = sobre ?? ativo;
  useEffect(() => {
    for (const [id, p] of Object.entries(pisos)) p.material.color.copy(id === aceso ? MARCA_TEXTO : p.cor);
    gl.domElement.style.cursor = sobre ? 'pointer' : '';
    invalidate();
  }, [aceso, sobre, pisos, gl, invalidate]);

  // A rolagem só avisa que mudou; a câmera e as alturas são refeitas no quadro seguinte
  useEffect(() => {
    window.addEventListener('maquete-progresso', invalidate);
    return () => window.removeEventListener('maquete-progresso', invalidate);
  }, [invalidate]);

  useFrame(({ camera, size }) => {
    const p = progresso.current;
    camera.aspect = size.width / size.height;
    const { inclina, alvo } = posicionar(camera, p);
    const paredes = misturar(0.04, 1, suave(entre(0.25, 0.5, p))); // de cima, parede baixa e alta são iguais
    const moveis = misturar(0.02, 1, suave(entre(0.4, 0.6, p)));
    for (const no of sobem.paredes) no.scale.y = no.userData.altura * paredes;
    for (const no of sobem.moveis) no.scale.y = no.userData.altura * moveis;
    gl.toneMappingExposure = misturar(1.3, 1.05, inclina); // de cima, os pisos pegam menos do spot

    // Mergulho: da posição da rolagem, a câmera avança pela linha de visão até 1,6 m do centro do cômodo
    const m = mergulho.current;
    if (m && CENTROS[m.id]) {
      const t = suave(Math.min(1, (performance.now() - m.inicio) / m.duracao));
      const centro = CENTROS[m.id];
      const perto = centro.clone().add(camera.position.clone().sub(centro).setLength(1.6));
      camera.position.lerp(perto, t);
      camera.fov = misturar(camera.fov, 50, t); // a lente abre para o cômodo inteiro caber quando a câmera chega perto
      camera.near = 0.05;
      camera.lookAt(alvo.lerp(centro, t));
      camera.updateProjectionMatrix();
      if (t < 1) invalidate();
    }
  });

  const abrir = (e) => {
    const id = comodoNoPonto(e.point);
    if (id) document.querySelector(`.planta a[data-comodo="${id}"]`)?.click();
  };

  return (
    <primitive
      object={scene}
      onPointerMove={(e) => {
        e.stopPropagation();
        setSobre(comodoNoPonto(e.point));
      }}
      onPointerOut={() => setSobre(null)}
      onClick={abrir}
    />
  );
}

export default function Maquete({ ativo, progresso, mergulho, aoCarregar }) {
  const camera = useMemo(() => {
    const c = new THREE.PerspectiveCamera(3, vw / vh, 0.1, 400);
    c.manual = true; // a câmera é toda nossa: o caminho acima refaz posição, lente e proporção
    return c;
  }, []);
  return (
    <div className="maquete-3d" aria-hidden="true">
      <Canvas
        camera={camera}
        frameloop="demand"
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.AgXToneMapping; // o mesmo look do render do Blender
        }}
      >
        <Modelo ativo={ativo} progresso={progresso} mergulho={mergulho} aoCarregar={aoCarregar} />
      </Canvas>
    </div>
  );
}
