// Cenário 1: contagem 5 → 1. Mascote à esquerda, pedestal à direita onde cada item aparece;
// nome em máquina de escrever, odômetro com o número real e a nº 1 por último.
import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Mascote } from './Mascote';
import { Objeto } from './Objetos';
import { Fita, Legenda, NomeItem, Odometro, Comenta } from './Tela';
import { cores, segmentoAtual, suave, pop, mistura3, lim } from './base';

function Camera({ pos, alvo, rolar = 0 }) {
  const { camera } = useThree();
  camera.position.set(...pos);
  camera.lookAt(new THREE.Vector3(...alvo));
  camera.rotateZ(rolar);
  return null;
}

function texturaPiso(cor) {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 512;
  const g = cv.getContext('2d'); g.fillStyle = cor; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 8; i++) { g.fillStyle = `rgba(0,0,0,${0.04 + (i % 3) * 0.03})`; g.fillRect(0, i * 64, 512, 62); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, i * 64 + 62, 512, 2); }
  const tx = new THREE.CanvasTexture(cv); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(3, 3); tx.colorSpace = THREE.SRGBColorSpace; return tx;
}

function Sala({ c, t }) {
  const piso = useMemo(() => texturaPiso(c.piso), [c.piso]);
  return (<group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial map={piso} roughness={0.8} /></mesh>
    <mesh position={[0, 6, -4]} receiveShadow><planeGeometry args={[30, 12]} /><meshStandardMaterial color={c.parede} roughness={0.95} /></mesh>
    {/* rodapé, quadro e prateleira: o cenário nunca fica vazio */}
    <mesh position={[0, 0.15, -3.95]}><boxGeometry args={[30, 0.3, 0.1]} /><meshStandardMaterial color="#ffffff" /></mesh>
    <mesh position={[2.8, 2.6, -3.85]}><boxGeometry args={[2.2, 0.08, 0.4]} /><meshStandardMaterial color="#7a5233" /></mesh>
    {/* varal de luzinhas */}
    {Array.from({ length: 14 }, (_, i) => (
      <mesh key={i} position={[-4.5 + i * 0.7, 4.4 - Math.sin((i / 13) * Math.PI) * 0.5, -3.7]}>
        <sphereGeometry args={[0.07, 12, 8]} /><meshBasicMaterial color={['#ffd84a', '#ff8a5b', '#7fd1ff'][i % 3]} transparent opacity={0.75 + 0.25 * Math.sin(t * 4 + i)} />
      </mesh>))}
    {/* planta */}
    <group position={[3.2, 0, -2.6]}>
      <mesh position={[0, 0.35, 0]} castShadow><cylinderGeometry args={[0.32, 0.25, 0.7, 20]} /><meshStandardMaterial color="#d9d2c5" /></mesh>
      {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[Math.sin(i * 1.3) * 0.25, 1.0 + (i % 2) * 0.3, Math.cos(i * 1.3) * 0.2]} castShadow><sphereGeometry args={[0.32, 16, 12]} /><meshStandardMaterial color={i % 2 ? '#3f9b5a' : '#4fb56a'} /></mesh>)}
    </group>
  </group>);
}

export function Contagem(projeto) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const c = cores(projeto);
  const { segmentos, tempos } = projeto;
  const k = segmentoAtual(tempos, t);
  const seg = segmentos[k], tp = tempos[k];
  const ts = t - tp.t0, dur = tp.fim - tp.t0;
  const itens = segmentos.filter((s) => s.tipo === 'item');
  const fim = seg.tipo === 'cta';
  const masc = projeto.mascote || {};

  // câmera: plano aberto no começo de cada frase, desliza (smootherstep) para perto do objeto; nunca parada
  const lado = (seg.n || 0) % 2 ? 1 : -1;
  const aberto = [0.5 * lado, 2.7, 12.8], perto = [0.6 + 0.3 * lado, 2.1, 9.2];
  const x = seg.tipo === 'item' ? suave((ts - dur * 0.35) / (dur * 0.5)) : 0;
  const empurra = ts * 0.12;
  let pos = mistura3(aberto, perto, x); pos = [pos[0], pos[1], pos[2] - empurra];
  let alvo = mistura3([0, 1.35, 0], [0.3, 1.25, 0], x);
  if (fim) { pos = [0, 2.8, 13.5 - ts * 0.15]; alvo = [0, 1.4, 0]; }
  const rolar = 0.05 * Math.sin(t * 0.4);

  // objeto da vez: entra com pop e gira devagar
  const ent = pop(ts / 0.5);
  const acao = fim ? 'comemorar' : seg.tipo === 'gancho' ? 'pular' : seg.n === 1 ? 'comemorar' : (seg.n || 0) % 2 ? 'acenar' : 'digitar';

  return (
    <AbsoluteFill style={{ background: c.parede }}>
      <ThreeCanvas width={width} height={height} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 40, near: 0.1, far: 100 }}>
        <Camera pos={pos} alvo={alvo} rolar={rolar} />
        <color attach="background" args={[c.parede]} />
        <hemisphereLight args={['#ffffff', '#b98a63', 0.9]} />
        <directionalLight position={[4, 8, 6]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} />
        <pointLight position={[1.4, 3.2, 2.5]} intensity={6} distance={8} color={c.destaque} />
        <Sala c={c} t={t} />
        <Mascote t={t} cor={masc.cor} acessorio={masc.acessorio} corAcessorio={masc.corAcessorio} acao={acao} posicao={[-1.15, 0, 0.4]} escala={0.9} giro={0.35} />
        {!fim ? (<group position={[1.15, 0, 0]}>
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow><cylinderGeometry args={[0.8, 0.9, 0.6, 40]} /><meshStandardMaterial color="#ffffff" roughness={0.4} /></mesh>
          <mesh position={[0, 0.61, 0]}><cylinderGeometry args={[0.82, 0.82, 0.04, 40]} /><meshStandardMaterial color={c.destaque} /></mesh>
          {seg.tipo === 'item' ? (
            <group position={[0, 0.63, 0]} scale={lim(ent, 0, 1.2) * 0.85} rotation={[0, Math.sin(t * 0.8) * 0.5 - 0.3, 0]}>
              <Objeto tipo={seg.objeto} t={t} cor={c.destaque} />
            </group>) : null}
        </group>) : (
          <group position={[0.2, 0, -0.6]}>
            {itens.slice().reverse().map((s, i) => (
              <group key={i} position={[(i - 2) * 0.95 + 0.4, 0, -Math.abs(i - 2) * 0.25]} scale={0.48 * lim(pop((ts - i * 0.12) / 0.4), 0, 1.2)}>
                <Objeto tipo={s.objeto} t={t} cor={c.destaque} />
              </group>))}
          </group>)}
      </ThreeCanvas>
      <AbsoluteFill>
        <Fita texto={projeto.titulo} sub={projeto.subtitulo} t={t} c={c} />
        {seg.tipo === 'item' ? <NomeItem n={seg.n} nome={seg.nome} t={ts} c={c} /> : null}
        {seg.tipo === 'item' && seg.numero ? <Odometro valor={seg.numero} rotulo={seg.rotulo || projeto.rotulo_numero || ''} t={ts} c={c} /> : null}
        {fim ? <Comenta palavra={projeto.palavra} perfil={projeto.perfil || '@seuperfil'} brinde={projeto.brinde || 'o seu link'} t={ts} c={c} /> : null}
        <Legenda palavras={tp.palavras} t={t} c={c} />
      </AbsoluteFill>
      {projeto.audio?.voz ? <Audio src={staticFile(projeto.audio.voz)} /> : null}
      {projeto.audio?.trilha ? <Audio src={staticFile(projeto.audio.trilha)} volume={projeto.audio.volume_trilha ?? 0.25} /> : null}
    </AbsoluteFill>
  );
}
