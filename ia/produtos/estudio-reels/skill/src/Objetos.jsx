// Biblioteca de objetos feitos só com código (sem modelo baixado, sem logo de ninguém).
// No roteiro: "objeto": "tv" | "monitor" | "celular" | "claquete" | "xadrez" | "caixa" | "trofeu" | "livro" | "lampada" | "moeda" | "foguete" | "predio"
import React, { useMemo } from 'react';
import * as THREE from 'three';

const M = ({ cor, brilho = 0, rug = 0.5, met = 0 }) => <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={brilho} roughness={rug} metalness={met} />;
const Caixa = ({ p = [0, 0, 0], s, cor, brilho, rot = [0, 0, 0], rug, met }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><boxGeometry args={s} /><M cor={cor} brilho={brilho} rug={rug} met={met} /></mesh>);
const Cil = ({ p = [0, 0, 0], r, h, cor, rot = [0, 0, 0], brilho, seg = 32, met, rug }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={[r, r, h, seg]} /><M cor={cor} brilho={brilho} met={met} rug={rug} /></mesh>);

function Torno({ perfil, cor, met = 0.3, rug = 0.35, brilho = 0 }) {
  const geo = useMemo(() => new THREE.LatheGeometry(perfil.map(([x, y]) => new THREE.Vector2(x, y)), 48), [perfil]);
  return <mesh geometry={geo} castShadow receiveShadow><M cor={cor} met={met} rug={rug} brilho={brilho} /></mesh>;
}

// tela com "conteúdo": blocos coloridos que piscam (t = segundos)
const Tela = ({ w, h, t, cor, z = 0 }) => (
  <group position={[0, 0, z]}>
    <Caixa s={[w, h, 0.02]} cor="#0d1020" brilho={0.2} />
    {[0, 1, 2, 3].map((i) => (
      <Caixa key={i} p={[-w / 4 + (i % 2) * w / 2, h / 4 - Math.floor(i / 2) * h / 2, 0.015]} s={[w * 0.42, h * 0.4, 0.01]}
        cor={['#ff6b2c', '#3fa7ff', '#ffc93c', '#4fd08a'][i]} brilho={0.6 + 0.4 * Math.sin(t * 3 + i)} />))}
  </group>
);

export function Objeto({ tipo, t = 0, cor = '#ff6b2c' }) {
  switch (tipo) {
    case 'tv': return (<group>
      <Caixa p={[0, 0.7, 0]} s={[1.5, 1.05, 0.7]} cor="#6b4a32" rug={0.7} />
      <group position={[-0.1, 0.72, 0.36]}><Tela w={1.05} h={0.8} t={t} /></group>
      <Cil p={[0.58, 0.95, 0.36]} r={0.06} h={0.04} cor="#ddd" rot={[Math.PI / 2, 0, 0]} />
      <Cil p={[0.58, 0.75, 0.36]} r={0.06} h={0.04} cor="#ddd" rot={[Math.PI / 2, 0, 0]} />
      <Cil p={[-0.25, 1.45, 0]} r={0.02} h={0.6} cor="#999" rot={[0, 0, 0.5]} /><Cil p={[0.25, 1.45, 0]} r={0.02} h={0.6} cor="#999" rot={[0, 0, -0.5]} />
      <Caixa p={[-0.55, 0.1, 0]} s={[0.08, 0.2, 0.08]} cor="#333" /><Caixa p={[0.55, 0.1, 0]} s={[0.08, 0.2, 0.08]} cor="#333" />
    </group>);
    case 'monitor': return (<group>
      <Caixa p={[0, 0.95, 0]} s={[1.6, 1.0, 0.08]} cor="#222" />
      <group position={[0, 0.95, 0.05]}><Tela w={1.45} h={0.85} t={t} /></group>
      <Caixa p={[0, 0.3, 0]} s={[0.12, 0.5, 0.08]} cor="#888" met={0.6} /><Caixa p={[0, 0.04, 0.05]} s={[0.6, 0.05, 0.4]} cor="#888" met={0.6} />
    </group>);
    case 'celular': return (<group position={[0, 0.9, 0]} rotation={[0, 0, Math.sin(t * 1.5) * 0.08]}>
      <Caixa s={[0.72, 1.4, 0.1]} cor="#1b1b22" rug={0.3} />
      <group position={[0, 0, 0.055]}><Tela w={0.62} h={1.22} t={t} /></group>
    </group>);
    case 'claquete': { const abre = 0.25 + Math.max(0, Math.sin(t * 4)) * 0.3; return (<group position={[0, 0.6, 0]}>
      <Caixa s={[1.3, 0.9, 0.1]} cor="#1c1c1c" />
      {[0, 1, 2].map((i) => <Caixa key={i} p={[0, 0.2 - i * 0.22, 0.055]} s={[1.1, 0.03, 0.01]} cor="#f2f2f2" />)}
      <group position={[-0.65, 0.5, 0]} rotation={[0, 0, abre]}>
        <Caixa p={[0.65, 0.08, 0]} s={[1.3, 0.16, 0.1]} cor="#f2f2f2" />
        {[0, 1, 2, 3, 4].map((i) => <Caixa key={i} p={[0.15 + i * 0.26, 0.08, 0.055]} s={[0.12, 0.17, 0.01]} cor="#1c1c1c" rot={[0, 0, 0.5]} />)}
      </group></group>); }
    case 'xadrez': return (<group scale={1.1}>
      <Torno cor="#f4efe6" met={0.05} rug={0.3} perfil={[[0, 0], [0.42, 0], [0.42, 0.1], [0.3, 0.18], [0.2, 0.3], [0.16, 0.8], [0.26, 0.9], [0.22, 0.98], [0.3, 1.15], [0.18, 1.22], [0, 1.24]]} />
      <Caixa p={[0, 1.38, 0]} s={[0.07, 0.28, 0.07]} cor="#f4efe6" /><Caixa p={[0, 1.4, 0]} s={[0.22, 0.07, 0.07]} cor="#f4efe6" />
    </group>);
    case 'caixa': return (<group position={[0, 0.45, 0]} rotation={[0, t * 0.6, 0]}>
      <Caixa s={[0.9, 0.9, 0.9]} cor={cor} /><Caixa s={[0.94, 0.94, 0.16]} cor="#ffffff" /><Caixa s={[0.16, 0.94, 0.94]} cor="#ffffff" />
      <mesh position={[-0.15, 0.55, 0]} rotation={[0, 0, 0.6]}><torusGeometry args={[0.15, 0.05, 8, 20]} /><M cor="#ffffff" /></mesh>
      <mesh position={[0.15, 0.55, 0]} rotation={[0, 0, -0.6]}><torusGeometry args={[0.15, 0.05, 8, 20]} /><M cor="#ffffff" /></mesh>
    </group>);
    case 'trofeu': return (<group>
      <Caixa p={[0, 0.1, 0]} s={[0.6, 0.2, 0.6]} cor="#3a2a1a" />
      <Torno cor="#ffc93c" met={0.8} rug={0.25} brilho={0.08} perfil={[[0, 0.2], [0.12, 0.2], [0.08, 0.45], [0.06, 0.6], [0.35, 0.8], [0.45, 1.25], [0.42, 1.27], [0, 1.0]]} />
      <mesh position={[-0.46, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.16, 0.04, 8, 20, Math.PI]} /><M cor="#ffc93c" met={0.8} rug={0.25} /></mesh>
      <mesh position={[0.46, 1.0, 0]} rotation={[0, 0, -Math.PI / 2]}><torusGeometry args={[0.16, 0.04, 8, 20, Math.PI]} /><M cor="#ffc93c" met={0.8} rug={0.25} /></mesh>
    </group>);
    case 'livro': { const a = 0.4 + Math.sin(t * 2) * 0.15; return (<group position={[0, 0.3, 0]} rotation={[-0.5, 0, 0]}>
      <group rotation={[0, a, 0]}><Caixa p={[-0.45, 0, 0]} s={[0.9, 0.06, 1.1]} cor={cor} /><Caixa p={[-0.45, 0.04, 0]} s={[0.85, 0.04, 1.04]} cor="#fffaf0" /></group>
      <group rotation={[0, -a, 0]}><Caixa p={[0.45, 0, 0]} s={[0.9, 0.06, 1.1]} cor={cor} /><Caixa p={[0.45, 0.04, 0]} s={[0.85, 0.04, 1.04]} cor="#fffaf0" /></group>
    </group>); }
    case 'lampada': return (<group>
      <mesh position={[0, 0.95, 0]}><sphereGeometry args={[0.45, 32, 24]} /><meshStandardMaterial color="#fff6c2" emissive="#ffd84a" emissiveIntensity={0.8 + Math.sin(t * 5) * 0.3} transparent opacity={0.95} /></mesh>
      <Cil p={[0, 0.4, 0]} r={0.2} h={0.35} cor="#9aa0a8" met={0.7} rug={0.3} /><Cil p={[0, 0.18, 0]} r={0.12} h={0.12} cor="#333" />
    </group>);
    case 'moeda': return (<group position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, t * 2]}>
      <Cil r={0.6} h={0.12} cor="#ffc93c" met={0.85} rug={0.25} brilho={0.05} rot={[0, 0, 0]} />
      <Cil p={[0, 0.07, 0]} r={0.42} h={0.02} cor="#e0a92a" met={0.85} rug={0.3} />
    </group>);
    case 'foguete': return (<group position={[0, 0.1 + Math.abs(Math.sin(t * 2)) * 0.1, 0]}>
      <Torno cor="#f4f4f4" met={0.2} perfil={[[0, 0.2], [0.3, 0.25], [0.34, 0.8], [0.25, 1.2], [0.1, 1.45], [0, 1.5]]} />
      <mesh position={[0, 0.85, 0.3]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.05, 24]} /><M cor="#3fa7ff" brilho={0.4} /></mesh>
      {[0, 1, 2].map((i) => <Caixa key={i} p={[Math.sin(i * 2.09) * 0.32, 0.3, Math.cos(i * 2.09) * 0.32]} rot={[0, i * 2.09, 0]} s={[0.04, 0.35, 0.25]} cor={cor} />)}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.2, 0.4 + Math.sin(t * 30) * 0.08, 16]} /><meshBasicMaterial color="#ffb020" /></mesh>
    </group>);
    default: return <Caixa p={[0, 0.5, 0]} s={[0.8, 0.8, 0.8]} cor={cor} />;
  }
}
