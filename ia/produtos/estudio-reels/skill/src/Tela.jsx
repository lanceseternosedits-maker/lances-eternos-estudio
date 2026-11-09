// Peças 2D por cima da cena 3D. Tudo dentro da área segura do Reels/TikTok:
// nada importante acima de y=260, abaixo de y=1500, nem a menos de 130 px da direita.
import React from 'react';
import '@fontsource/archivo-black/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import { lim, pop, suave, formata } from './base';

export const TITULO = "'Archivo Black', 'Arial Black', sans-serif";
export const CORPO = "Inter, Arial, sans-serif";
const AREA = { left: 70, right: 130 };

// Fita crepe no topo com a tese (2 a 4 palavras) e uma linha de promessa embaixo
export function Fita({ texto, sub, t, c }) {
  const e = pop(t / 0.45);
  return (
    <div style={{ position: 'absolute', top: 285, left: AREA.left, right: AREA.right, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        transform: `rotate(-2.2deg) scale(${0.6 + 0.4 * e})`, opacity: lim(t / 0.2), background: c.fita, color: c.texto,
        fontFamily: TITULO, fontSize: texto.length > 18 ? 58 : 70, lineHeight: 1.05, padding: '22px 34px 18px', textAlign: 'center',
        boxShadow: '0 8px 0 rgba(0,0,0,.12)', textTransform: 'uppercase', letterSpacing: 0.5,
        clipPath: 'polygon(0 6%, 3% 0, 8% 5%, 14% 0, 22% 4%, 30% 0, 40% 5%, 52% 0, 63% 4%, 74% 0, 85% 5%, 93% 0, 100% 5%, 98% 50%, 100% 95%, 92% 100%, 84% 95%, 72% 100%, 60% 96%, 48% 100%, 36% 95%, 24% 100%, 12% 96%, 4% 100%, 0 94%, 2% 50%)',
      }}>{texto}</div>
      {sub ? <div style={{ marginTop: 14, opacity: lim((t - 0.3) / 0.3), fontFamily: TITULO, fontSize: 36, color: '#fff', background: c.destaque, padding: '8px 20px', borderRadius: 12, transform: 'rotate(1.5deg)', boxShadow: '0 5px 0 rgba(0,0,0,.25)', textTransform: 'uppercase', textAlign: 'center' }}>{sub}</div> : null}
    </div>
  );
}

// Legenda palavra por palavra numa pílula sólida, com "pop" a cada palavra nova
export function Legenda({ palavras, t, c, topo = 1330 }) {
  const atual = palavras.find((w) => t >= w.t0 && t < w.t1 + 0.12) || null;
  if (!atual) return null;
  const e = pop((t - atual.t0) / 0.18);
  const limpa = atual.w.replace(/[.,!?…;:]+$/, '');
  return (
    <div style={{ position: 'absolute', top: topo, left: AREA.left, right: AREA.right, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: c.pilula, color: '#fff', fontFamily: TITULO, fontSize: limpa.length > 11 ? 66 : 82, padding: '14px 38px 18px', borderRadius: 999,
        transform: `scale(${0.75 + 0.25 * e})`, boxShadow: '0 10px 0 rgba(0,0,0,.25)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{limpa}</div>
    </div>
  );
}

// Nome do item batendo letra por letra (máquina de escrever) com o selo "Nº N"
export function NomeItem({ n, nome, t, c }) {
  const letras = Math.floor(lim((t - 0.25) / 0.7) * nome.length);
  const e = pop(t / 0.35);
  return (
    <div style={{ position: 'absolute', top: 520, left: AREA.left, right: AREA.right, display: 'flex', alignItems: 'center', gap: 22 }}>
      <div style={{ background: c.destaque, color: '#fff', fontFamily: TITULO, fontSize: 64, padding: '8px 22px', borderRadius: 18, whiteSpace: 'nowrap', flex: 'none', transform: `scale(${e}) rotate(-4deg)`, boxShadow: '0 6px 0 rgba(0,0,0,.25)' }}>Nº {n}</div>
      <div style={{ fontFamily: TITULO, fontSize: nome.length > 16 ? 46 : 56, color: '#fff', textShadow: '0 4px 0 rgba(0,0,0,.45)', lineHeight: 1.05, textTransform: 'uppercase' }}>
        {nome.slice(0, letras)}<span style={{ opacity: (t * 3) % 1 < 0.5 && letras < nome.length ? 1 : 0 }}>▍</span>
      </div>
    </div>
  );
}

// Odômetro de rolinhos: cada dígito gira até o número final (número da fonte, nunca estimado)
export function Odometro({ valor, rotulo, t, c, topo = 660 }) {
  const alvo = Math.round(valor);
  const prog = suave((t - 0.3) / 1.1);
  const texto = formata(alvo);
  const digitos = texto.split('');
  let ordem = digitos.filter((d) => /\d/.test(d)).length;
  return (
    <div style={{ position: 'absolute', top: topo, left: AREA.left, display: 'flex', alignItems: 'center', gap: 16, opacity: lim(t / 0.25) }}>
      <div style={{ display: 'flex', gap: 5, background: '#14121f', padding: 10, borderRadius: 16, boxShadow: '0 6px 0 rgba(0,0,0,.3)' }}>
        {digitos.map((d, i) => {
          if (!/\d/.test(d)) return <div key={i} style={{ color: '#fff', fontFamily: TITULO, fontSize: 52, alignSelf: 'flex-end' }}>{d}</div>;
          ordem -= 1;
          const fim = Number(d) + 10 * (ordem + 1);          // rola mais nos dígitos da esquerda
          const pos = fim * lim(prog * (1 + ordem * 0.08));
          return (
            <div key={i} style={{ width: 52, height: 72, overflow: 'hidden', background: '#fffaf0', borderRadius: 8, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -(pos % 10) * 72, left: 0, right: 0 }}>
                {Array.from({ length: 11 }, (_, k) => <div key={k} style={{ height: 72, lineHeight: '72px', textAlign: 'center', fontFamily: TITULO, fontSize: 52, color: c.texto }}>{k % 10}</div>)}
              </div>
            </div>);
        })}
      </div>
      <div style={{ fontFamily: TITULO, fontSize: 40, color: '#fff', textShadow: '0 3px 0 rgba(0,0,0,.45)', textTransform: 'uppercase' }}>{rotulo}</div>
    </div>
  );
}

// Trilha de etapas em pílulas: a atual acesa
export function Etapas({ nomes, atual, c, topo = 470 }) {
  return (
    <div style={{ position: 'absolute', top: topo, left: AREA.left, right: AREA.right, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
      {nomes.map((n, i) => (
        <div key={n} style={{ fontFamily: TITULO, fontSize: 23, padding: '8px 13px', borderRadius: 999, textTransform: 'uppercase',
          background: i === atual ? c.destaque : i < atual ? '#ffffffd9' : '#00000059', color: i === atual ? '#fff' : i < atual ? c.texto : '#ffffffb3',
          transform: i === atual ? 'scale(1.08)' : 'none', boxShadow: i === atual ? '0 5px 0 rgba(0,0,0,.25)' : 'none' }}>{i + 1} {n}</div>))}
    </div>
  );
}

// Contador de jogo no canto (sobe durante o vídeo) + selo "ilustrativo" quando o número é de simulação
export function ContadorJogo({ rotulo, valor, ilustrativo, c, topo = 575 }) {
  return (
    <div style={{ position: 'absolute', top: topo, left: AREA.left, right: AREA.right, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
      <div style={{ background: '#14121f', color: '#fff', fontFamily: TITULO, fontSize: 40, padding: '10px 24px', borderRadius: 14, boxShadow: '0 6px 0 rgba(0,0,0,.3)' }}>
        {rotulo}: <span style={{ color: c.destaque }}>{formata(valor)}</span></div>
      {ilustrativo ? <div style={{ fontFamily: CORPO, fontWeight: 800, fontSize: 20, color: '#fff', background: '#00000066', padding: '6px 12px', borderRadius: 8 }}>ILUSTRATIVO</div> : null}
    </div>
  );
}

// Número grande da etapa aparecendo sobre a cena
export function NumeroGrande({ texto, t, c }) {
  const vis = lim(t / 0.2) * lim((1.3 - t) / 0.3);
  if (vis <= 0) return null;
  return (<div style={{ position: 'absolute', top: 700, left: AREA.left + 10, right: AREA.right, textAlign: 'left', fontFamily: TITULO, fontSize: 190, color: '#fff', opacity: vis,
    transform: `scale(${0.7 + 0.3 * pop(t / 0.35)})`, textShadow: `0 10px 0 ${c.destaque}, 0 0 40px rgba(0,0,0,.35)` }}>{texto}</div>);
}

// envelope desenhado (emoji pode faltar no navegador de render)
const Envelope = () => (<svg width="42" height="32" viewBox="0 0 42 32"><rect x="2" y="2" width="38" height="28" rx="4" fill="#fff" /><path d="M3 4 L21 18 L39 4" stroke="#1d1a2b" strokeWidth="3.5" fill="none" strokeLinejoin="round" /></svg>);

// Fechamento: COMENTA PALAVRA grande + notificação de DM (mostra que o "comenta" funciona)
export function Comenta({ palavra, perfil, brinde, t, c, topo = 545, semDM = false }) {
  const e = pop(t / 0.4);
  const dm = semDM ? 0 : suave((t - 0.9) / 0.5);
  return (<>
    <div style={{ position: 'absolute', top: topo, left: AREA.left, right: AREA.right, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ fontFamily: TITULO, fontSize: 60, color: '#fff', textShadow: '0 4px 0 rgba(0,0,0,.45)', transform: `scale(${e})` }}>COMENTA</div>
      <div style={{ fontFamily: TITULO, fontSize: palavra.length > 8 ? 92 : 118, color: '#fff', background: c.destaque, padding: '6px 34px 12px', borderRadius: 24,
        transform: `scale(${e}) rotate(-3deg)`, boxShadow: '0 10px 0 rgba(0,0,0,.3)' }}>{palavra}</div>
    </div>
    {dm > 0 ? (
      <div style={{ position: 'absolute', top: topo + 275, left: AREA.left + 20, right: AREA.right + 20, opacity: dm, transform: `translateY(${(1 - dm) * -40}px)`,
        background: '#fffffff2', borderRadius: 28, padding: '20px 24px', display: 'flex', gap: 18, alignItems: 'center', boxShadow: '0 14px 30px rgba(0,0,0,.25)' }}>
        <div style={{ width: 70, height: 70, borderRadius: 18, background: c.destaque, display: 'grid', placeItems: 'center' }}><Envelope /></div>
        <div style={{ fontFamily: CORPO }}>
          <div style={{ fontWeight: 800, fontSize: 30, color: c.texto }}>{perfil}</div>
          <div style={{ fontWeight: 600, fontSize: 27, color: '#555' }}>Aqui está {brinde}!</div>
        </div>
      </div>) : null}
  </>);
}
