// Funções comuns: curvas de movimento, segmento atual e cores.
export const lim = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
// smootherstep: começa e termina sem tranco (use em câmera e em tudo que desliza)
export const suave = (x) => { x = lim(x); return x * x * x * (x * (x * 6 - 15) + 10); };
// saída com leve passada do ponto (pop de entrada)
export const pop = (x) => { x = lim(x); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export const mistura = (a, b, x) => a + (b - a) * x;
export const mistura3 = (a, b, x) => a.map((v, i) => mistura(v, b[i], x));

export function segmentoAtual(tempos, t) {
  for (let i = tempos.length - 1; i >= 0; i--) if (t >= tempos[i].t0) return i;
  return 0;
}

export const CORES_PADRAO = {
  parede: '#f3e6d3', piso: '#c98f5a', destaque: '#ff6b2c', texto: '#1d1a2b', fita: '#efe2c2', pilula: '#5b3cc4', ceu: '#9fd4ff', chao: '#9ccf7a',
};
export const cores = (projeto) => ({ ...CORES_PADRAO, ...(projeto.cores || {}) });

// número com separador brasileiro: 3117 -> "3.117"
export const formata = (n) => Math.round(n).toLocaleString('pt-BR');
