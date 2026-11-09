// Cidade (Referência 7) · ⚙️ "Em qual nível de IA você está?". Identidade: cidade menta + coral, praça central com uma torre de 5 andares
// que acende andar por andar; cada nível muda o mundo: 1 balão de pergunta que some; 2 crachá "QUEM SOU" na praça; 3 placa fixa na
// porta (instruções); 4 carteiro-robô traz o envelope do resumo com o sol nascendo; 5 caminhãozinho-robô trabalha sozinho enquanto
// o bonequinho descansa na rede. Câmera: órbita alta e lenta em volta da torre. Contador: horas livres na semana (ilustrativo).
export default function (K) {
const { THREE, S, M, E, mesh, box, ctex, V, lin, eo, eio, back, hemi, sol } = K;
const paleta = { chao: '#d9efe6', rua: '#9fb3ad', predios: ['#bfe8d8', '#f7c8b8', '#fff3e0', '#a8dcc9', '#ffd9cc', '#e6f5ef'], arvore: '#5cbf8a', roupas: ['#ff7a5c', '#2a9d8f', '#f4a261', '#264653', '#e76f51'],
  destaque: '#ff6b4a', feito: 'rgba(42,157,143,.85)', textoDestaque: '#e24a2a', alto: 3.2, fonte: 'SG' };
let TORRE, andares = [], BAL, CRACHA, PLACA, ROBO, ENV, CAM, REDE, BONECO;
function monta() {
  TORRE = new THREE.Group(); TORRE.scale.setScalar(.8); S.add(TORRE);
  for (let i = 0; i < 5; i++) { const m = new THREE.MeshStandardMaterial({ color: '#f2f2f2', emissive: '#ff6b4a', emissiveIntensity: 0, roughness: .5 });
    const a = box(2.6 - i * .28, .9, 2.6 - i * .28, m, TORRE, 0, .45 + i * .95, 0); andares.push(a); box(2.7 - i * .28, .06, 2.7 - i * .28, M('#264653'), TORRE, 0, .92 + i * .95, 0); }
  TORRE.userData.alto = 4.2;
  // bonequinho principal (o "você") na praça
  BONECO = new THREE.Group(); BONECO.scale.setScalar(1.4); S.add(BONECO); BONECO.position.set(2.6, 0, 2.2); box(.5, .75, .34, M('#ff7a5c'), BONECO, 0, .45, 0); box(.38, .38, .38, M('#f2c9a0'), BONECO, 0, 1.02, 0); box(.42, .12, .42, M('#264653'), BONECO, 0, 1.24, 0);
  BONECO.userData.alto = 1.6;
  const balT = ctex(256, 160, g => { g.fillStyle = '#fff'; g.beginPath(); g.roundRect(4, 4, 248, 120, 30); g.fill(); g.beginPath(); g.moveTo(60, 120); g.lineTo(40, 156); g.lineTo(100, 120); g.fill(); g.fillStyle = '#264653'; g.font = '700 80px SG'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('?', 128, 66); });
  BAL = mesh(new THREE.PlaneGeometry(1.4, .9), new THREE.MeshBasicMaterial({ map: balT, transparent: true }), S, 3.2, 2.6, 2.2); BAL.castShadow = false;
  const crT = ctex(256, 160, g => { g.fillStyle = '#fff'; g.fillRect(0, 0, 256, 160); g.fillStyle = '#2a9d8f'; g.fillRect(0, 0, 256, 44); g.fillStyle = '#fff'; g.font = '700 30px SG'; g.textAlign = 'center'; g.fillText('QUEM SOU', 128, 32); g.fillStyle = '#264653'; g.font = '700 26px SG'; g.textAlign = 'left'; ['• professora', '• resposta curta', '• sem jargão'].forEach((l, i) => g.fillText(l, 16, 80 + i * 28)); });
  CRACHA = mesh(new THREE.PlaneGeometry(1.3, .82), new THREE.MeshBasicMaterial({ map: crT }), S, 3.6, 2.3, 2.2); CRACHA.castShadow = false;
  const plT = ctex(256, 128, g => { g.fillStyle = '#264653'; g.fillRect(0, 0, 256, 128); g.fillStyle = '#fff'; g.font = '700 34px SG'; g.textAlign = 'center'; g.fillText('INSTRUÇÕES', 128, 50); g.font = '700 22px SG'; g.fillText('vale pra toda conversa', 128, 92); });
  PLACA = new THREE.Group(); S.add(PLACA); PLACA.position.set(-1.9, 0, 1.6); box(.08, 1.4, .08, M('#555'), PLACA, 0, .7, 0); mesh(new THREE.PlaneGeometry(1.4, .7), new THREE.MeshStandardMaterial({ map: plT }), PLACA, 0, 1.6, .05); PLACA.userData.alto = 2.1;
  // carteiro-robô com envelope (nível 4)
  ROBO = new THREE.Group(); ROBO.scale.setScalar(1.5); S.add(ROBO); box(.6, .6, .5, M('#9ad1d4', { metalness: .3 }), ROBO, 0, .55, 0); box(.4, .3, .4, M('#cfeef0'), ROBO, 0, 1.0, 0); box(.08, .06, .02, E('#264653', .2), ROBO, -.1, 1.02, .21); box(.08, .06, .02, E('#264653', .2), ROBO, .1, 1.02, .21);
  for (const x of [-.2, .2]) mesh(new THREE.CylinderGeometry(.14, .14, .1, 14), M('#333'), ROBO, x, .14, 0).rotation.z = Math.PI / 2;
  ENV = box(.5, .32, .03, M('#fff2a8'), ROBO, 0, 1.0, .35); ROBO.userData.alto = 1.6;
  // caminhãozinho-robô (nível 5) e rede
  CAM = new THREE.Group(); CAM.scale.setScalar(1.4); S.add(CAM); box(1.2, .6, .7, M('#ff6b4a'), CAM, 0, .45, 0); box(.5, .5, .66, M('#264653'), CAM, .75, .4, 0); for (const [x, z] of [[-.35, .38], [.35, .38], [-.35, -.38], [.6, .38], [.6, -.38]]) mesh(new THREE.CylinderGeometry(.16, .16, .1, 14), M('#222'), CAM, x, .16, z).rotation.x = Math.PI / 2;
  box(.5, .4, .5, M('#f4a261'), CAM, -.2, .95, 0); CAM.userData.alto = 1.6;
  REDE = new THREE.Group(); S.add(REDE); REDE.position.set(-3.2, 0, -1.6); for (const x of [-1, 1]) box(.12, 1.2, .12, M('#7a5232'), REDE, x, .6, 0); const tela = box(1.8, .06, .6, M('#f4a261'), REDE, 0, .75, 0); REDE.userData.alto = 1.5;
}
// estado do mundo em cada etapa (kl = volta ao 1º quadro no loop)
function mundo(et, cena, lt, d, t, kl) {
  const e = kl > .5 ? 0 : et;
  andares.forEach((a, i) => { const on = i < e, at = i === e - 1; a.material.emissiveIntensity = on ? (at ? .55 + .15 * Math.sin(t * 6) : .25) : 0; a.material.color.set(on ? '#ffe2d8' : '#f2f2f2'); });
  BAL.visible = e <= 1; BAL.material.opacity = e === 1 ? 1 - lin(lt, 1.2, 2.2) : 1; BAL.lookAt(BAL.position.clone().add(V(0, 0, 10))); BAL.position.y = 2.6 + Math.sin(t * 3) * .08;
  CRACHA.visible = e >= 2; CRACHA.scale.setScalar(e === 2 && cena === 'e2' ? Math.max(.01, back(lin(lt, .3, .8))) : 1);
  PLACA.visible = e >= 3; PLACA.scale.setScalar(e === 3 && cena === 'e3' ? Math.max(.01, back(lin(lt, .3, .8))) : 1);
  ROBO.visible = e >= 4; if (e >= 4) { const k = cena === 'e4' ? eio(lin(lt, .2, 2.5)) : 1; ROBO.position.set(-8 + k * 9.6, 0, 2.2); ROBO.rotation.y = Math.PI / 2; ENV.visible = cena !== 'e4' || k < .95; }
  CAM.visible = e >= 5; if (e >= 5) { const a = t * .6; CAM.position.set(Math.cos(a) * 6, 0, Math.sin(a) * 6); CAM.rotation.y = -a; }
  REDE.visible = e >= 5;
  // bonequinho: na praça; no nível 5 vai pra rede e balança
  if (e >= 5) { BONECO.position.set(-3.2, .55 + Math.sin(t * 2) * .05, -1.6); BONECO.rotation.z = Math.PI / 2 * .9; } else { BONECO.position.set(2.6, Math.abs(Math.sin(t * 5)) * .04, 2.2); BONECO.rotation.z = 0; }
  // céu/luz: nível 4 = manhã nascendo (luz quente), resto dia claro
  const manha = e === 4 ? 1 : 0; sol.color.set(manha ? '#ffc9a0' : '#fff2dd'); hemi.intensity = 1.1 - manha * .25;
  K.R.setClearColor(manha ? 0xffd9c2 : 0xcdeee3, 1);
}
// órbita alta e lenta em volta da torre; aproxima quando a etapa muda
function camera(et, cena, lt, d, t) { const a = .5 + t * .06, r = cena === 'gancho' ? 21 : 17.5 - Math.min(1, lt / 1.5) * 1.5, y = cena === 'gancho' ? 14 : 11.5;
  const alvo = et === 5 ? V(-1, 1.2, 0) : et === 4 ? V(0, 1.2, 1.4) : V(.6, 1.8, .6); return [V(Math.sin(a) * r, y, Math.cos(a) * r), alvo, .04]; }
const horas = [0, 0, 1, 3, 5, 10];
function contador(et, cena, lt, t) { const ant = horas[Math.max(0, et - 1)], v = horas[et]; const k = /^e/.test(cena) ? eio(lin(lt, .3, 1.5)) : 1; return `${Math.round(ant + (v - ant) * k)} h livres`; }
function alfinete(et) { return [[BAL, 'conversa nova = zero'], [CRACHA, 'você conta quem é'], [PLACA, 'escreve 1 vez'], [ROBO, 'resumo toda manhã'], [CAM, 'faz por você']][et - 1]; }
return { paleta, monta, mundo, camera, contador, contadorRot: 'NA SEMANA', alfinete, chave: 'NÍVEL', etapas: ['PERGUNTA', 'CONTEXTO', 'INSTRUÇÕES', 'TAREFAS', 'AGENTE'],
  fim: ['Perguntar resolve.', 'Configurar liberta.', 'Comenta o nº do seu nível'] };
}
