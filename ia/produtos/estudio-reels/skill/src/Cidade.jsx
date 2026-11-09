// Cenário 2: cidade em 5 etapas com contador. Cada etapa MUDA o mundo (sobe um bairro, chega gente),
// a trilha de etapas fica no topo e o contador de jogo sobe. O fim volta ao 1º quadro (loop).
import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Mascote } from './Mascote';
import { Objeto } from './Objetos';
import { Fita, Legenda, Etapas, ContadorJogo, NumeroGrande, Comenta } from './Tela';
import { cores, segmentoAtual, suave, pop, lim, mistura } from './base';

function Camera({ ang, raio, altura, alvoY }) {
  const { camera } = useThree();
  camera.position.set(Math.sin(ang) * raio, altura, Math.cos(ang) * raio);
  camera.lookAt(new THREE.Vector3(0, alvoY, 0));
  return null;
}

const PALETA = ['#ff8a5b', '#7fc8ff', '#ffd166', '#b28dff', '#6fd6a0', '#ff6f91'];
// 5 bairros em volta da praça; cada etapa acende um
function bairros() {
  const lista = [];
  for (let b = 0; b < 5; b++) {
    const a0 = (b / 5) * Math.PI * 2 + 0.3;
    for (let i = 0; i < 7; i++) {
      const a = a0 + (i - 3) * 0.16, r = 4.4 + (i % 3) * 1.25;
      lista.push({ b, x: Math.sin(a) * r, z: Math.cos(a) * r, h: 0.8 + ((i * 7 + b * 3) % 5) * 0.45, w: 0.75 + (i % 2) * 0.25, cor: PALETA[(i + b) % PALETA.length], i });
    }
  }
  return lista;
}

function Predio({ x, z, h, w, cor, cresce }) {
  if (cresce <= 0.001) return null;
  const hh = h * cresce;
  return (<group position={[x, 0, z]}>
    <mesh position={[0, hh / 2, 0]} castShadow receiveShadow><boxGeometry args={[w, hh, w]} /><meshStandardMaterial color={cor} roughness={0.7} /></mesh>
    {cresce > 0.95 ? Array.from({ length: Math.floor(h / 0.45) }, (_, j) => (
      <mesh key={j} position={[0, 0.3 + j * 0.42, 0]}><boxGeometry args={[w + 0.01, 0.12, w * 0.6]} /><meshStandardMaterial color="#fff6d6" emissive="#ffe8a3" emissiveIntensity={0.25} /></mesh>)) : null}
    <mesh position={[0, hh + 0.04, 0]}><boxGeometry args={[w + 0.08, 0.08, w + 0.08]} /><meshStandardMaterial color="#ffffff" /></mesh>
  </group>);
}

// bonequinhos andando em volta da praça (quantidade segue o contador)
function Gente({ n, t }) {
  return (<group>{Array.from({ length: n }, (_, i) => {
    const r = 1.9 + (i % 5) * 0.42, v = 0.25 + (i % 7) * 0.04, a = i * 2.399 + t * v * (i % 2 ? 1 : -1);
    const pulo = Math.abs(Math.sin(t * 8 + i)) * 0.05;
    return (<group key={i} position={[Math.sin(a) * r, pulo, Math.cos(a) * r]} scale={0.55}>
      <mesh position={[0, 0.35, 0]} castShadow><capsuleGeometry args={[0.16, 0.3, 4, 10]} /><meshStandardMaterial color={PALETA[i % PALETA.length]} /></mesh>
      <mesh position={[0, 0.82, 0]} castShadow><sphereGeometry args={[0.16, 14, 10]} /><meshStandardMaterial color="#ffe0c2" /></mesh>
    </group>);
  })}</group>);
}

export function Cidade(projeto) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const c = cores(projeto);
  const { segmentos, tempos } = projeto;
  const k = segmentoAtual(tempos, t);
  const seg = segmentos[k], tp = tempos[k];
  const ts = t - tp.t0, dur = tp.fim - tp.t0;
  const etapas = segmentos.filter((s) => s.tipo === 'etapa');
  const idx = seg.tipo === 'etapa' ? etapas.indexOf(seg) : seg.tipo === 'cta' ? etapas.length : -1;
  const lista = useMemo(bairros, []);
  const masc = projeto.mascote || {};
  const cont = projeto.contador || { rotulo: 'PESSOAS', inicio: 0 };

  // contador: anima do valor da etapa anterior até o desta etapa
  const valores = [cont.inicio || 0, ...etapas.map((e) => e.contador ?? 0)];
  const de = valores[Math.max(0, idx)] ?? 0, ate = valores[Math.max(0, idx + (seg.tipo === 'etapa' ? 1 : 0))] ?? de;
  const valor = seg.tipo === 'etapa' ? mistura(de, ate, suave((ts - 0.4) / 1.6)) : seg.tipo === 'cta' ? valores[valores.length - 1] : valores[0];
  const gente = Math.min(70, Math.round(valor / Math.max(1, valores[valores.length - 1]) * 70));

  // câmera: órbita lenta que sobe a cada etapa; no fim volta ao enquadramento do começo (loop)
  const nivel = seg.tipo === 'cta' ? mistura(etapas.length, 0, suave((ts - (dur - 1.3)) / 1.1)) : Math.max(0, idx) + (seg.tipo === 'etapa' ? suave(ts / 1.2) : 0);
  const ang = 0.35 + t * 0.06 + nivel * 0.25;
  const raio = 12.5 + nivel * 1.1, altura = 6.0 + nivel * 1.6;

  return (
    <AbsoluteFill style={{ background: c.ceu }}>
      <ThreeCanvas width={width} height={height} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 44, near: 0.1, far: 200 }}>
        <Camera ang={ang} raio={raio} altura={altura} alvoY={1.0} />
        <color attach="background" args={[c.ceu]} />
        <fog attach="fog" args={[c.ceu, 22, 48]} />
        <hemisphereLight args={['#ffffff', c.chao, 1.0]} />
        <directionalLight position={[6, 12, 5]} intensity={2.0} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[40, 64]} /><meshStandardMaterial color={c.chao} roughness={1} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow><circleGeometry args={[3.6, 64]} /><meshStandardMaterial color="#efe6d6" roughness={0.9} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}><ringGeometry args={[3.6, 4.0, 64]} /><meshStandardMaterial color="#6d6a75" /></mesh>
        {lista.map((p, i) => {
          const ativo = p.b < idx || (p.b === idx && seg.tipo === 'etapa');
          const cresce = p.b < idx || seg.tipo === 'cta' ? 1 : ativo ? lim(pop((ts - 0.2 - p.i * 0.09) / 0.6), 0, 1.1) : 0;
          return <Predio key={i} {...p} cresce={seg.tipo === 'cta' && nivel < 0.05 ? 0 : cresce} />;
        })}
        {/* objeto da etapa ao lado do mascote */}
        {seg.tipo === 'etapa' && seg.objeto ? (
          <group position={[1.3, 0, 0.5]} scale={0.9 * lim(pop((ts - 0.3) / 0.5), 0, 1.2)} rotation={[0, ang + Math.sin(t) * 0.2, 0]}><Objeto tipo={seg.objeto} t={t} cor={c.destaque} /></group>) : null}
        <Gente n={gente} t={t} />
        <group rotation={[0, ang, 0]}>
          <Mascote t={t} cor={masc.cor} acessorio={masc.acessorio} corAcessorio={masc.corAcessorio} acao={seg.tipo === 'cta' ? 'comemorar' : seg.tipo === 'gancho' ? 'acenar' : 'pular'} posicao={[-0.5, 0, 0]} escala={0.9} />
        </group>
      </ThreeCanvas>
      <AbsoluteFill>
        <Fita texto={projeto.titulo} t={t} c={c} />
        <Etapas nomes={etapas.map((e) => e.nome)} atual={idx} c={c} />
        <ContadorJogo rotulo={cont.rotulo} valor={valor} ilustrativo={cont.ilustrativo} c={c} />
        {seg.tipo === 'etapa' ? <NumeroGrande texto={String(idx + 1)} t={ts} c={c} /> : null}
        {seg.tipo === 'cta' && ts > 0.2 && nivel > 0.5 ? <Comenta topo={700} semDM palavra={projeto.palavra} perfil={projeto.perfil || '@seuperfil'} brinde={projeto.brinde || 'o seu link'} t={ts - 0.2} c={c} /> : null}
        <Legenda palavras={tp.palavras} t={t} c={c} />
      </AbsoluteFill>
      {projeto.audio?.voz ? <Audio src={staticFile(projeto.audio.voz)} /> : null}
      {projeto.audio?.trilha ? <Audio src={staticFile(projeto.audio.trilha)} volume={projeto.audio.volume_trilha ?? 0.25} /> : null}
    </AbsoluteFill>
  );
}
