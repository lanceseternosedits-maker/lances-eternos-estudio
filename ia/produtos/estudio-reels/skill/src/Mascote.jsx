// Mascote em blocos: corpo largo, olhos verticais, bracinhos e quatro perninhas.
// Troque a cor e o acessório no roteiro ("mascote": {"cor": "#3fa7ff", "acessorio": "bone"}) para ter o SEU personagem.
// Acessórios: nenhum, bone, oculos, chapeu, fone, coroa, cachecol. Ações: pular, acenar, digitar, comemorar, parado.
import React from 'react';

const Bloco = ({ p, s, cor, rot = [0, 0, 0], brilho = 0 }) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={cor} roughness={0.55} emissive={cor} emissiveIntensity={brilho} />
  </mesh>
);

function Acessorio({ tipo, cor2 }) {
  if (tipo === 'bone') return (<group position={[0, 1.42, 0]}>
    <mesh castShadow><cylinderGeometry args={[0.52, 0.56, 0.26, 24, 1, false, 0, Math.PI * 2]} /><meshStandardMaterial color={cor2} roughness={0.6} /></mesh>
    <Bloco p={[0, -0.1, 0.62]} s={[0.9, 0.06, 0.5]} cor={cor2} /></group>);
  if (tipo === 'chapeu') return (<group position={[0, 1.38, 0]}>
    <mesh castShadow><cylinderGeometry args={[0.85, 0.85, 0.05, 32]} /><meshStandardMaterial color={cor2} /></mesh>
    <mesh castShadow position={[0, 0.25, 0]}><cylinderGeometry args={[0.45, 0.5, 0.5, 32]} /><meshStandardMaterial color={cor2} /></mesh>
    <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.505, 0.505, 0.1, 32]} /><meshStandardMaterial color="#ffffff" /></mesh></group>);
  if (tipo === 'coroa') return (<group position={[0, 1.38, 0]}>
    {[0, 1, 2, 3, 4].map((i) => <Bloco key={i} p={[-0.4 + i * 0.2, 0.12 + (i % 2) * 0.08, 0.2]} s={[0.12, 0.3 + (i % 2) * 0.16, 0.12]} cor="#ffc93c" brilho={0.15} />)}
    <Bloco p={[0, 0, 0.2]} s={[1, 0.12, 0.14]} cor="#ffc93c" brilho={0.15} /></group>);
  if (tipo === 'oculos') return (<group position={[0, 0.88, 0.53]}>
    {[-0.28, 0.28].map((x) => (<group key={x} position={[x, 0, 0]}>
      <Bloco p={[0, 0.2, 0]} s={[0.4, 0.06, 0.04]} cor="#111" /><Bloco p={[0, -0.2, 0]} s={[0.4, 0.06, 0.04]} cor="#111" />
      <Bloco p={[-0.18, 0, 0]} s={[0.06, 0.46, 0.04]} cor="#111" /><Bloco p={[0.18, 0, 0]} s={[0.06, 0.46, 0.04]} cor="#111" /></group>))}
    <Bloco p={[0, 0.1, 0]} s={[0.18, 0.05, 0.04]} cor="#111" /></group>);
  if (tipo === 'fone') return (<group position={[0, 1.0, 0]}>
    <mesh position={[0, 0.38, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.86, 0.06, 8, 32, Math.PI]} /><meshStandardMaterial color="#222" /></mesh>
    <Bloco p={[-0.86, 0.02, 0]} s={[0.16, 0.42, 0.42]} cor={cor2} /><Bloco p={[0.86, 0.02, 0]} s={[0.16, 0.42, 0.42]} cor={cor2} /></group>);
  if (tipo === 'cachecol') return (<group position={[0, 0.3, 0]}>
    <Bloco p={[0, 0, 0]} s={[1.68, 0.18, 1.08]} cor={cor2} /><Bloco p={[0.45, -0.25, 0.56]} s={[0.22, 0.45, 0.05]} cor={cor2} /></group>);
  return null;
}

export function Mascote({ t, cor = '#e8794a', acessorio = 'bone', corAcessorio = '#5b3cc4', acao = 'pular', posicao = [0, 0, 0], escala = 1, giro = 0 }) {
  const piscar = (t % 3.1) < 0.12 ? 0.15 : 1;                      // pisca a cada ~3 s
  const respira = 1 + Math.sin(t * 2.4) * 0.015;
  let y = 0, bracoE = 0, bracoD = 0, inclina = Math.sin(t * 1.3) * 0.04, pernas = 0;
  if (acao === 'pular') { const f = (t * 1.6) % 1; y = Math.max(0, Math.sin(f * Math.PI)) * 0.35; bracoE = bracoD = -y * 1.6; }
  if (acao === 'comemorar') { const f = (t * 2.2) % 1; y = Math.max(0, Math.sin(f * Math.PI)) * 0.25; bracoE = bracoD = -2.3 + Math.sin(t * 12) * 0.25; }
  if (acao === 'acenar') { bracoD = -2.4 + Math.sin(t * 9) * 0.45; }
  if (acao === 'digitar') { bracoE = -0.9 + Math.sin(t * 22) * 0.12; bracoD = -0.9 + Math.cos(t * 22) * 0.12; inclina = 0.12; }
  if (acao === 'andar') { pernas = t * 10; y = Math.abs(Math.sin(t * 10)) * 0.05; }
  return (
    <group position={[posicao[0], posicao[1] + y, posicao[2]]} scale={escala} rotation={[0, giro, inclina * 0.5]}>
      <group scale={[respira, 1 / respira, respira]}>
        <Bloco p={[0, 0.75, 0]} s={[1.6, 1.05, 1.0]} cor={cor} />
        {/* olhos verticais */}
        <Bloco p={[-0.3, 0.86, 0.51]} s={[0.13, 0.34 * piscar, 0.04]} cor="#141414" />
        <Bloco p={[0.3, 0.86, 0.51]} s={[0.13, 0.34 * piscar, 0.04]} cor="#141414" />
        {/* bracinhos (giram no ombro) */}
        <group position={[-0.86, 0.75, 0]} rotation={[0, 0, -bracoE]}><Bloco p={[-0.12, -0.05, 0]} s={[0.26, 0.22, 0.32]} cor={cor} /></group>
        <group position={[0.86, 0.75, 0]} rotation={[0, 0, bracoD]}><Bloco p={[0.12, -0.05, 0]} s={[0.26, 0.22, 0.32]} cor={cor} /></group>
        {/* perninhas */}
        {[-0.55, -0.2, 0.2, 0.55].map((x, i) => (
          <Bloco key={x} p={[x, 0.12 + (acao === 'andar' ? Math.max(0, Math.sin(pernas + i * Math.PI)) * 0.08 : 0), 0]} s={[0.16, 0.28, 0.5]} cor={cor} />))}
        <Acessorio tipo={acessorio} cor2={corAcessorio} />
      </group>
      {/* sombra de contato */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -y + 0.01, 0]}>
        <circleGeometry args={[0.95, 32]} /><meshBasicMaterial color="#000" transparent opacity={0.18 - y * 0.25} />
      </mesh>
    </group>
  );
}
