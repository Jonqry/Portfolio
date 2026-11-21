'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import planta from '../planta.json';
import luz from '../../public/maquete/luz.json';
import { VIEWBOX } from '../planta-svg';

// A maquete assada no Blender (blender/bake.py): cada malha mostra a cor do material vezes a luz gravada
// no lightmap do grupo dela, sem luz em tempo real. O que muda ao vivo é só o piso do cômodo em foco.
const MARCA_TEXTO = new THREE.Color('#f5d547');

// O mesmo centro do maquete.py: o meio da caixa dos cômodos, em cm. No glTF, x = (x - cx) / 100 e
// z = (y - cy) / 100, com o y para cima.
const xs = planta.comodos.flatMap((c) => [c.x, c.x + c.largura]);
const ys = planta.comodos.flatMap((c) => [c.y, c.y + c.profundidade]);
const CX = (Math.min(...xs) + Math.max(...xs)) / 2;
const CY = (Math.min(...ys) + Math.max(...ys)) / 2;

// Câmera de cima, ortográfica, enquadrando o mesmo retângulo do viewBox do SVG (1 unidade = 2 cm),
// para a maquete ficar exatamente embaixo das paredes e dos nomes da planta.
function cameraDaPlanta() {
  const [vx, vy, vw, vh] = VIEWBOX.map((v) => v * 2);
  const x = (vx + vw / 2 - CX) / 100;
  const z = (vy + vh / 2 - CY) / 100;
  const camera = new THREE.OrthographicCamera(-vw / 200, vw / 200, vh / 200, -vh / 200, 0.1, 100);
  camera.position.set(x, 30, z);
  camera.up.set(0, 0, -1);
  camera.lookAt(x, 0, z);
  camera.manual = true; // o R3F não refaz o enquadramento quando a tela muda de tamanho
  return camera;
}

const nomeDoNo = (nome) => THREE.PropertyBinding.sanitizeNodeName(nome);

function Modelo({ ativo, aoCarregar }) {
  const { scene } = useGLTF('/maquete/maquete.glb');
  const mapas = useTexture(Object.fromEntries(Object.entries(luz).map(([g, v]) => [g, `/maquete/${v.arquivo}`])));
  const invalidate = useThree((s) => s.invalidate);

  const pisos = useMemo(() => {
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
    return pisos;
  }, [scene, mapas]);

  useEffect(() => aoCarregar(), [aoCarregar]);

  useEffect(() => {
    for (const [id, p] of Object.entries(pisos)) p.material.color.copy(id === ativo ? MARCA_TEXTO : p.cor);
    invalidate();
  }, [ativo, pisos, invalidate]);

  return <primitive object={scene} />;
}

export default function Maquete({ ativo, aoCarregar }) {
  const camera = useMemo(cameraDaPlanta, []);
  return (
    <div className="maquete-3d" aria-hidden="true">
      <Canvas
        camera={camera}
        frameloop="demand"
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.AgXToneMapping; // o mesmo look do render do Blender
          gl.toneMappingExposure = 1.3; // vista de cima, os pisos pegam menos do spot que no pôster
        }}
      >
        <Modelo ativo={ativo} aoCarregar={aoCarregar} />
      </Canvas>
    </div>
  );
}
