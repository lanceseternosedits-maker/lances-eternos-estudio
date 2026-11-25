#version 330
// v3: direcao de arte da referencia. Fundo preto com cidade de luzes, chao preto espelhado,
// mascotes foscos tipo argila (cor chapada, sombra suave), objetos de neon grandes (tubo medidor, placa).
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uCamPos, uCamTgt;
uniform float uFov, uRoll;
uniform vec4 uC[2];          // pos.xyz, yaw
uniform vec4 uCa[2];         // bracoE, bracoD, squash, piscar
uniform vec4 uCb[2];         // -, visivel, luzes, sobrancelha
uniform vec4 uFace[2];       // boca aberta, olhar x, olhar y, sorriso
uniform vec4 uTable;         // pos.xyz, visivel
uniform float uKingTilt;
uniform vec4 uMeter;         // pos.xyz, visivel
uniform float uLevel;        // 0..1 nivel do liquido
uniform vec3 uMeterCol;      // cor do liquido
uniform sampler2D uMeterTex; // painel do medidor
uniform vec4 uSign;          // pos.xyz, visivel
uniform vec2 uSignSize;      // meia largura/altura
uniform sampler2D uSignTex;
uniform vec4 uNodes[14];
uniform float uGraph;
uniform float uTema;        // 0 cidade neon, 1 estudio LED, 2 data center, 3 cidade por do sol
uniform vec3 uTemaCor;      // cor de destaque do tema

layout(location=0) out vec4 oCol;
layout(location=1) out vec4 oEmi;
#define PI 3.14159265

float hash1(float n){ return fract(sin(n)*43758.5453); }
float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float sdRBox(vec3 p, vec3 b, float r){ vec3 q=abs(p)-b+r; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r; }
float sdCyl(vec3 p, float h, float r){ vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h); return min(max(d.x,d.y),0.)+length(max(d,0.)); }
float sdCaps(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-r; }
float smin(float a, float b, float k){ float h=clamp(.5+.5*(b-a)/k,0.,1.); return mix(b,a,h)-k*h*(1.-h); }

vec3 charLocal(vec3 p, int i){ vec3 q = p - uC[i].xyz; q.xz = rot(uC[i].w) * q.xz; return q; }

// ids: 1 chao, 2 trilho neon, 3 base escura, 5 mesa, 6 tabuleiro, 7 peca, 20 tubo, 21 painel medidor, 22 moldura,
//      23 placa, 24 moldura placa, 40 no, 41 aresta, 100+ci*10+k personagem (k: 0 corpo 1 corpo baixo 2 olho 3 sobrancelha 4 gravata 5 membro 6 antena 7 tela rosto)
vec2 mapChar(vec3 p, int i){
  if (uCb[i].y < .5) return vec2(1e5, 0.);
  vec3 q = charLocal(p, i);
  float bb = length(q - vec3(0., .95, 0.)) - 1.5;
  if (bb > .3) return vec2(bb, 0.);
  float sq = uCa[i].z; bool robo = i == 1;
  float base = 100. + float(i)*10.;
  vec3 qb = q; qb.y = (q.y - .24)/sq; qb.xz *= sqrt(sq);
  float bh = .6;
  vec3 qc = qb - vec3(0., bh, 0.);
  float body = sdRBox(qc, vec3(.62, bh, .5), .1) * min(sq, 1.);
  vec3 qe = q; qe.y = (q.y - .24)/sq + .24;
  float bodyId = base + ((robo && qc.y < -.12) ? 1. : 0.);
  if (!robo){
    // boca esculpida no rosto: fenda de sorriso fechada, "D" arredondado aberta
    float op = uFace[i].x;
    vec3 qm = qe - vec3(0., .80 - .045*op, .5);
    qm.y -= uFace[i].w * 2.2 * qm.x * qm.x;
    vec2 rr = vec2(.105 + .025*op, .016 + .075*op);
    vec2 mq = qm.xy / rr; mq.y *= qm.y > 0. ? 1.6 : 1.;   // topo mais reto, fundo redondo
    float m2 = (length(mq) - 1.) * min(rr.x, rr.y);
    float cav = max(m2, abs(qm.z) - .07);
    if (-cav > body){ body = -cav; bodyId = base + 4.; }
  }
  vec2 res = vec2(body, bodyId);
  float eyeY = robo ? 1.12 : 1.08;
  float bl = max(uCa[i].w, .06);
  if (!robo){
    for (int s=0; s<2; s++){
      float sx = s==0 ? -.22 : .22;
      float e = sdRBox(qe - vec3(sx + uFace[i].y*.06, eyeY + uFace[i].z*.04, .5), vec3(.07, .13*bl, .02), .025);
      if (e < res.x) res = vec2(e, base + 2.);
      vec3 pb = qe - vec3(sx, 1.33 + .02*uCb[i].w, .5);
      pb.xy = rot((s==0? 1.:-1.)*.28*uCb[i].w) * pb.xy;
      float b = sdRBox(pb, vec3(.13, .035, .025), .02);
      if (b < res.x) res = vec2(b, base + 3.);
    }
  } else {
    // faixa de tela no rosto (levemente afundada) + antena
    float face = sdRBox(qe - vec3(0., 1.1, .49), vec3(.5, .24, .03), .04);
    if (face < res.x) res = vec2(face, base + 7.);
    float a = sdCaps(qe - vec3(.3, 1.58, 0.), vec3(0.), vec3(0.,.22,0.), .025);
    if (a < res.x) res = vec2(a, base + 5.);
    float ab = length(qe - vec3(.3, 1.86, 0.)) - .075;
    if (ab < res.x) res = vec2(ab, base + 6.);
  }
  for (int s=0; s<2; s++){
    float side = s==0 ? -1. : 1.;
    float ang = s==0 ? uCa[i].x : uCa[i].y;
    vec3 pa = qe - vec3(side*.72, .92, 0.);
    pa.xy = rot(side*ang) * pa.xy;
    float arm = sdRBox(pa - vec3(side*.03, -.24, 0.), vec3(.1, .26, .12), .07);
    if (arm < res.x) res = vec2(arm, base + 5.);
  }
  for (int s=0; s<2; s++){
    float side = s==0 ? -1. : 1.;
    float leg = sdRBox(q - vec3(side*.3, .13, 0.), vec3(.13, .14, .15), .05);
    if (leg < res.x) res = vec2(leg, base + 5.);
  }
  return res;
}

vec2 mapTable(vec3 p){
  if (uTable.w < .5) return vec2(1e5, 0.);
  vec3 q = p - uTable.xyz;
  float bb = length(q - vec3(0., .6, 0.)) - 1.2;
  if (bb > .3) return vec2(bb, 0.);
  vec2 res = vec2(sdRBox(q - vec3(0., .72, 0.), vec3(.62, .05, .62), .02), 5.);
  res.x = min(res.x, min(sdCyl(q - vec3(0., .36, 0.), .36, .1), sdCyl(q - vec3(0., .02, 0.), .02, .35)));
  float top = sdRBox(q - vec3(0., .775, 0.), vec3(.5, .01, .5), .005);
  if (top < res.x) res = vec2(top, 6.);
  vec3 pk = q - vec3(.12, .785, .06);
  pk.x -= .07; pk.xy = rot(-uKingTilt) * pk.xy; pk.x += .07;
  float k = sdCyl(pk - vec3(0., .02, 0.), .02, .07);
  k = smin(k, sdCyl(pk - vec3(0., .12, 0.), .1, .04), .04);
  k = smin(k, length(pk - vec3(0., .24, 0.)) - .055, .03);
  k = min(k, sdRBox(pk - vec3(0., .33, 0.), vec3(.012, .045, .012), .005));
  k = min(k, sdRBox(pk - vec3(0., .34, 0.), vec3(.035, .012, .012), .005));
  for (int j=0; j<4; j++){
    vec3 pp = q - vec3(-.31 + float(j)*.125, .785, -.31 + float(j%2)*.25);
    float pw = sdCyl(pp - vec3(0.,.02,0.), .02, .045);
    pw = smin(pw, sdCyl(pp - vec3(0.,.07,0.), .05, .022), .03);
    pw = smin(pw, length(pp - vec3(0.,.13,0.)) - .035, .02);
    k = min(k, pw);
  }
  if (k < res.x) res = vec2(k, 7.);
  return res;
}

vec2 mapProps(vec3 p){
  vec2 res = vec2(p.y, 1.);
  // trilhos neon baixos ao fundo (linhas laranja como na referencia)
  float r1 = sdRBox(p - vec3(0., .35, -3.4), vec3(5., .025, .025), .02);
  float r2 = sdRBox(p - vec3(0., .95, -3.4), vec3(5., .025, .025), .02);
  vec3 pp = p - vec3(0., .5, -3.4); pp.x = mod(pp.x + .9, 1.8) - .9;
  float posts = sdRBox(pp, vec3(.03, .5, .03), .01);
  float rail = min(min(r1, r2), posts);
  if (uTema < .5 && rail < res.x) res = vec2(rail, 2.);
  // medidor (tubo de vidro com liquido neon)
  if (uMeter.w > .5){
    vec3 q = p - uMeter.xyz;
    float bb = sdRBox(q - vec3(0., 2.2, 0.), vec3(1.1, 2.5, .8), .0);
    if (bb < .5){
      float baseB = sdRBox(q - vec3(0., .2, 0.), vec3(.75, .2, .6), .05);
      if (baseB < res.x) res = vec2(baseB, 3.);
      float tube = sdRBox(q - vec3(0., 2.0, 0.), vec3(.6, 1.6, .45), .12);
      if (tube < res.x) res = vec2(tube, 20.);
      float frame = sdRBox(q - vec3(0., 3.75, 0.), vec3(.75, .18, .55), .05);
      if (frame < res.x) res = vec2(frame, 22.);
      float panel = sdRBox(q - vec3(0., 2.35, .47), vec3(.5, .3, .03), .04);
      if (panel < res.x) res = vec2(panel, 21.);
    } else res.x = min(res.x, bb);
  }
  // placa de neon
  if (uSign.w > .5){
    vec3 q = p - uSign.xyz;
    float fr = sdRBox(q, vec3(uSignSize + .08, .07), .06);
    if (fr < res.x) res = vec2(fr, 24.);
    float sc = sdRBox(q - vec3(0., 0., .06), vec3(uSignSize, .015), .02);
    if (sc < res.x) res = vec2(sc, 23.);
  }
  return res;
}


float sdBox2(vec3 p, vec3 b){ vec3 q=abs(p)-b; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.); }
vec2 mapEnv(vec3 p){
  vec2 res = vec2(1e5, 0.);
  if (uTema < .5) return res;
  if (uTema < 1.5){ // estudio moderno: parede de LED ao fundo, colunas brancas, sanca de luz
    float wall = sdBox2(p - vec3(0., 3.2, -6.5), vec3(12., 3.2, .15));
    if (wall < res.x) res = vec2(wall, 50.);
    vec3 q = p - vec3(0., 2.5, -5.4); q.x = mod(q.x + 2.6, 5.2) - 2.6;
    float col = sdRBox(q, vec3(.35, 2.5, .35), .05);
    if (col < res.x) res = vec2(col, 51.);
    float teto = sdBox2(p - vec3(0., 6.6, 0.), vec3(14., .1, 14.));
    if (teto < res.x) res = vec2(teto, 51.);
    vec3 r = p - vec3(0., 6.45, 0.); r.z = mod(r.z + 1.5, 3.) - 1.5;
    float faixa = sdBox2(r, vec3(9., .04, .06));
    if (faixa < res.x) res = vec2(faixa, 52.);
    // bancada/plataforma redonda onde os personagens ficam
    float plat = sdCyl(p - vec3(0., .06, .3), .06, 2.6);
    if (plat < res.x) res = vec2(plat, 55.);
    return res;
  }
  if (uTema < 2.5){ // data center: corredor de racks com leds, calha de cabos no teto
    vec3 q = p; q.x = abs(q.x) - 4.6; q.z = mod(q.z + .8, 1.6) - .8;
    float rack = sdRBox(q - vec3(0., 1.45, 0.), vec3(.55, 1.45, .7), .03);
    rack = max(rack, p.z - 4.5);
    if (rack < res.x) res = vec2(rack, 53.);
    vec3 c = p; c.x = abs(c.x) - 4.6;
    float calha = sdBox2(c - vec3(0., 3.6, 0.), vec3(.35, .06, 30.));
    if (calha < res.x) res = vec2(calha, 51.);
    float fundo = sdBox2(p - vec3(0., 3., -26.), vec3(8., 6., .2));
    if (fundo < res.x) res = vec2(fundo, 50.);
    return res;
  }
  // cidade ao por do sol: predios em volta da cobertura, beiral com vidro
  vec3 q = p; vec2 id = floor((q.xz + 2.5) / 5.); q.xz = mod(q.xz + 2.5, 5.) - 2.5;
  float hh = 2. + 9. * hash2(id * 1.7 + 3.1);
  float bld = sdBox2(q - vec3(0., hh*.5 - 4., 0.), vec3(1.7, hh*.5, 1.7));
  float longe = length(p.xz - vec2(0., .3)) - 9.;
  bld = max(bld, -longe);
  if (bld < res.x) res = vec2(bld, 54.);
  float vidro = sdBox2(p - vec3(0., .55, -4.2), vec3(6., .55, .03));
  if (vidro < res.x) res = vec2(vidro, 56.);
  return res;
}

vec2 mapGraph(vec3 p){
  vec2 res = vec2(1e5, 0.);
  if (uGraph < .01) return res;
  for (int i=0; i<14; i++){
    float d = length(p - uNodes[i].xyz) - uNodes[i].w * uGraph;
    if (d < res.x) res = vec2(d, 40.);
  }
  for (int i=0; i<13; i++){
    int j = (i*5 + 3) % 14;
    float d = min(sdCaps(p, uNodes[i].xyz, mix(uNodes[i].xyz, uNodes[j].xyz, uGraph), .012),
                  sdCaps(p, uNodes[i].xyz, mix(uNodes[i].xyz, uNodes[i+1].xyz, uGraph), .012));
    if (d < res.x) res = vec2(d, 41.);
  }
  return res;
}

vec2 map(vec3 p){
  vec2 r = mapProps(p);
  vec2 t = mapTable(p); if (t.x < r.x) r = t;
  for (int i=0; i<2; i++){ vec2 c = mapChar(p, i); if (c.x < r.x) r = c; }
  vec2 g = mapGraph(p); if (g.x < r.x) r = g;
  vec2 e = mapEnv(p); if (e.x < r.x) r = e;
  return r;
}

vec3 calcNormal(vec3 p){
  vec2 e = vec2(.0015, 0.);
  return normalize(vec3(map(p+e.xyy).x - map(p-e.xyy).x, map(p+e.yxy).x - map(p-e.yxy).x, map(p+e.yyx).x - map(p-e.yyx).x));
}
float softShadow(vec3 ro, vec3 rd, float k){
  float res = 1., t = .03;
  for (int i=0; i<24; i++){ float h = map(ro + rd*t).x; res = min(res, k*h/t); t += clamp(h, .03, .4); if (res < .01 || t > 8.) break; }
  return clamp(res, 0., 1.);
}
float calcAO(vec3 p, vec3 n){
  float o = 0., s = 1.;
  for (int i=1; i<=5; i++){ float h = .03 + .1*float(i); o += (h - map(p + n*h).x) * s; s *= .7; }
  return clamp(1. - 1.3*o, 0., 1.);
}

// fundo: cidade de luzes pequenas no escuro (vira bokeh com o desfoque)
vec3 city(vec3 rd){
  // cidade de bokeh densa e colorida como na referencia: discos grandes desfocados + luzes pequenas + varais de lampadas
  float a = atan(rd.x, -rd.z);
  vec3 acc = vec3(0.);
  for (int l=0; l<3; l++){
    float fl = float(l);
    float sc = 4.5 + fl*4.5;
    vec2 g = vec2(a*sc, rd.y*sc*1.3) + fl*7.3;
    vec2 id = floor(g), f = fract(g) - .5;
    float h = hash2(id + fl*3.1);
    float on = step(l == 0 ? .5 : .42, h) * smoothstep(1.1, .15, rd.y) * smoothstep(-.35, -.05, rd.y);
    vec2 off = (vec2(hash2(id+1.3), hash2(id+7.1)) - .5) * .5;
    float d = length(f - off);
    float r = l == 0 ? .3 : l == 1 ? .2 : .085;
    float disc = smoothstep(r, r*.8, d) * (l < 2 ? .7 + .3*smoothstep(r*.4, r*.95, d) : 1.);
    float hc = hash2(id + 17.7 + fl);
    vec3 c = hc > .82 ? vec3(.2, .45, 1.) : hc > .64 ? vec3(1., .3, .62) : hc > .46 ? vec3(1., .5, .12) : hc > .28 ? vec3(1., .82, .3) : hc > .14 ? vec3(.6, .3, 1.) : vec3(.3, .9, 1.);
    acc += c * on * disc * (l == 0 ? .45 : l == 1 ? .8 : 1.7) * (.75 + .25*sin(uTime*2. + h*50.));
  }
  // varais de lampadas quentes
  for (int s=0; s<3; s++){
    float fs = float(s);
    float yy = .1 + fs*.13 - .05*pow(sin(a*1.6 + fs*2.), 2.);
    float bead = (fract(a*34. + fs*.37) - .5) / 34.;
    float dd = length(vec2(bead, rd.y - yy));
    acc += vec3(1., .72, .35) * smoothstep(.0055, .0018, dd) * 1.8;
    acc += vec3(1., .6, .25) * smoothstep(.002, .0, abs(rd.y - yy)) * .08;
  }
  // faixas verticais de predios iluminados
  float sx = floor(a * 30.);
  float bld = step(.82, hash1(sx)) * smoothstep(.35, .0, rd.y) * smoothstep(-.1, .05, rd.y) * step(rd.y, .05 + .25*hash1(sx+3.));
  acc += vec3(.25, .12, .4) * bld * .25;
  return acc;
}


vec3 fundo(vec3 rd){
  if (uTema < .5) return city(rd);
  if (uTema < 1.5) return mix(vec3(.02,.02,.03), uTemaCor*.06, smoothstep(-.2,.6,rd.y));
  if (uTema < 2.5) return vec3(.005,.01,.02);
  // por do sol: lilas -> rosa -> laranja -> dourado e sol baixo
  float y = rd.y;
  vec3 c = mix(vec3(1.,.72,.35), vec3(1.,.42,.38), smoothstep(-.05,.15,y));
  c = mix(c, vec3(.55,.32,.62), smoothstep(.15,.45,y));
  c = mix(c, vec3(.16,.12,.32), smoothstep(.45,.9,y));
  vec3 sd = normalize(vec3(0.,.07,-1.));
  float sun = max(dot(rd, sd), 0.);
  c += vec3(1.,.75,.4) * (pow(sun, 400.)*3. + pow(sun, 18.)*.35);
  return c * .9;
}

struct Hit { float t; float m; bool ok; };
Hit march(vec3 ro, vec3 rd, int steps, float tmax){
  float t = 0.; vec2 h;
  for (int i=0; i<160; i++){
    if (i >= steps) break;
    h = map(ro + rd*t);
    if (h.x < .0006*t + .0004) return Hit(t, h.y, true);
    t += h.x * .9;
    if (t > tmax) break;
  }
  return Hit(t, 0., false);
}

vec3 meterLight(vec3 p){ // luz colorida emitida pelo liquido do medidor
  if (uMeter.w < .5) return vec3(0.);
  vec3 lp = uMeter.xyz + vec3(0., .4 + 3.2*uLevel*.5, .3);
  float d = length(p - lp);
  return uMeterCol * 1.6 / (1. + d*d*.6) * (.3 + uLevel);
}

vec3 shade(vec3 p, vec3 rd, float m, out vec3 emi, bool cheap){
  vec3 n = calcNormal(p);
  vec3 alb = vec3(.5); float spec = .2, gloss = 30.; emi = vec3(0.);
  bool clay = false;
  if (m < 1.5){
    alb = vec3(.012, .012, .016); spec = 1.; gloss = 200.;
    if (uTema > .5 && uTema < 1.5){ alb = vec3(.16,.16,.18); spec = .6; gloss = 90.; }
    if (uTema > 1.5 && uTema < 2.5){ vec2 t = abs(fract(p.xz*.833) - .5); alb = vec3(.05,.055,.065); emi = uTemaCor * .5 * smoothstep(.485, .5, max(t.x, t.y)); }
    if (uTema > 2.5){ vec2 t = abs(fract(p.xz*.5) - .5); alb = mix(vec3(.32,.27,.27), vec3(.22,.19,.2), smoothstep(.47,.5,max(t.x,t.y))); spec = .4; gloss = 60.; }
  }
  else if (m < 2.5){ alb = vec3(.02); emi = vec3(1., .42, .08) * 2.2; }
  else if (m < 3.5){ alb = vec3(.03, .03, .035); spec = .6; }
  else if (m < 5.5){ alb = vec3(.05, .04, .045); spec = .5; }
  else if (m < 6.5){ vec3 q = p - uTable.xyz; float c = mod(floor(q.x*8.) + floor(q.z*8.), 2.); alb = mix(vec3(.04, .05, .09), vec3(.85, .82, .76), c); spec = .9; gloss = 120.; }
  else if (m < 7.5){ alb = vec3(.9, .88, .84); clay = true; spec = .4; }
  else if (m < 20.5){ // tubo: liquido neon ate o nivel, vidro escuro acima
    vec3 q = p - uMeter.xyz;
    float lvl = .4 + 3.2*uLevel;
    float wave = .03*sin(q.x*9. + uTime*5.);
    float liq = step(q.y, lvl + wave);
    float bub = step(.97, hash2(floor(vec2(q.x*20., q.y*20. - uTime*25.)))) * liq;
    alb = vec3(.02, .03, .03); spec = 1.; gloss = 150.;
    emi = uMeterCol * (1.05 + .5*smoothstep(lvl - .4, lvl, q.y)) * liq + vec3(1.)*bub*.4;
    emi += uMeterCol * .03 * (1. - liq);
  }
  else if (m < 21.5){
    vec3 q = p - uMeter.xyz - vec3(0., 2.35, .47);
    vec2 tuv = vec2(q.x/1.0 + .5, q.y/.6 + .5);
    alb = vec3(0.); emi = texture(uMeterTex, tuv).rgb * 2.;
  }
  else if (m < 22.5){ alb = vec3(.03); spec = .7; emi = vec3(0.); }
  else if (m < 23.5){
    vec3 q = p - uSign.xyz;
    vec2 tuv = vec2(q.x/(2.*uSignSize.x) + .5, q.y/(2.*uSignSize.y) + .5);
    alb = vec3(0.); emi = texture(uSignTex, tuv).rgb * 2.2;
  }
  else if (m < 24.5){ alb = vec3(.02); vec3 q = abs(p - uSign.xyz) - vec3(uSignSize, 0.); float e = step(-.03, max(q.x, q.y)); emi = vec3(.1, 1., .75) * 2.5 * e; }
  else if (m > 49.5 && m < 59.5){
    if (m < 50.5){ // tela de LED: gradiente do tema com faixas e pixels
      vec2 g = p.xy * vec2(1., 1.);
      float lin = .5 + .5*sin(g.x*1.3 + uTime*1.2 + sin(g.y*.8 + uTime*.7)*1.5);
      float px = .75 + .25*step(.5, fract(g.x*6.)) * step(.5, fract(g.y*6.));
      alb = vec3(.01); emi = mix(uTemaCor, uTemaCor.zxy, lin) * (.55 + .5*lin) * px * (uTema > 1.5 ? .25 : 1.);
    }
    else if (m < 51.5){ alb = uTema > 1.5 ? vec3(.05,.05,.06) : vec3(.62,.62,.66); spec = .3; }
    else if (m < 52.5){ alb = vec3(.1); emi = vec3(1., .96, .9) * 2.4; }
    else if (m < 53.5){ // rack: chassi escuro, frente com leds piscando voltada pro corredor
      alb = vec3(.035,.04,.05); spec = .7; gloss = 80.;
      float fx = abs(n.x);
      if (fx > .9){
        vec2 c = vec2(p.z*9., p.y*14.); vec2 id = floor(c);
        float on = step(.62, hash2(id + floor(uTime*3. + hash2(id)*6.)));
        float dotm = smoothstep(.32, .15, length(fract(c) - .5));
        emi = mix(uTemaCor, vec3(.2,1.,.4), step(.7, hash2(id+5.))) * on * dotm * 2.2;
        emi += uTemaCor * .05 * step(.5, fract(p.y*7.));
      }
    }
    else if (m < 54.5){ // predio: liso em tom pastel quente, janelas acesas raras
      float hc = hash2(floor((p.xz + 2.5)/5.));
      alb = mix(vec3(.85,.55,.5), vec3(.95,.75,.55), hc) * .55; spec = .15;
      vec2 w = vec2((p.x + p.z)*2.2, p.y*2.6); vec2 wi = floor(w);
      float win = step(.86, hash2(wi)) * step(.25, fract(w.x)) * step(.3, fract(w.y)) * step(abs(n.y), .5);
      emi = vec3(1., .78, .45) * win * 1.4;
    }
    else if (m < 55.5){ alb = vec3(.08,.08,.09); spec = .9; gloss = 120.;
      float aro = smoothstep(.06, .0, abs(length((p - vec3(0.,0.,.3)).xz) - 2.55));
      emi = uTemaCor * aro * 2.5; }
    else { alb = vec3(.02); spec = 1.; gloss = 200.; emi = uTemaCor * .04; }
  }
  else if (m < 40.5){ alb = vec3(0.); emi = vec3(1., .5, .1) * 2.2 * (.8 + .2*hash2(floor(p.xy*5.))); }
  else if (m < 41.5){ alb = vec3(0.); emi = vec3(1., .6, .2) * .9; }
  else {
    int ci = m < 109.5 ? 0 : 1; float k = m - (ci == 0 ? 100. : 110.);
    bool robo = ci == 1; clay = true;
    vec3 q = charLocal(p, ci);
    vec3 qe = q; qe.y = (q.y - .24)/uCa[ci].z + .24;
    vec3 cTop = robo ? vec3(.28, .4, 1.) : vec3(1., .36, .07);
    vec3 cBot = robo ? vec3(.1, .13, .38) : vec3(1., .36, .07);
    if (k < .5){ alb = cTop; if (!robo && q.z > .3){ float bl2 = smoothstep(.13, .0, length(vec2(abs(qe.x) - .38, qe.y - .9))); alb = mix(cTop, vec3(1., .3, .42), bl2 * .55); } }
    else if (k < 1.5) alb = cBot;
    else if (k < 2.5){
      alb = vec3(.01); clay = false; spec = .2;
      // brilho quadrado no olho (como pixel de luz)
      float sx = (qe.x - uFace[ci].y*.06) < 0. ? -.22 : .22; sx += uFace[ci].y*.06;
      vec2 e = vec2(qe.x - sx, qe.y - 1.08 - uFace[ci].z*.04);
      if (e.x > -.045 && e.x < .005 && e.y > .02 && e.y < .07 && uCa[ci].w > .5) emi = vec3(1.4);
    }
    else if (k < 3.5){ alb = vec3(.03, .02, .02); }
    else if (k < 4.5){
      // interior da boca: fundo escuro, lingua rosada embaixo
      float dz = clamp((.5 - qe.z) / .07, 0., 1.);
      float tg = smoothstep(.79, .73, qe.y) * smoothstep(.0, .5, dz);
      alb = mix(vec3(.16, .03, .05), vec3(.85, .32, .38), tg) * (1. - .55*dz); clay = false; spec = .05;
    }
    else if (k < 5.5) alb = robo ? cBot * 1.2 : cTop;
    else if (k < 6.5){ alb = vec3(0.); emi = vec3(1., .25, .7) * 3. * uCb[ci].z; }
    else {
      alb = vec3(.004); clay = false; spec = .8; gloss = 90.;
      // olhos de pixel ciano na tela do rosto + linha de varredura
      vec2 f = vec2(qe.x - uFace[ci].y*.06, qe.y - 1.15 - uFace[ci].z*.03);
      vec2 g = floor(f * vec2(22., 22.));
      float eyeL = step(abs(f.x + .2), .075) * step(abs(f.y), .085 * max(uCa[ci].w, .1));
      float eyeR = step(abs(f.x - .2), .075) * step(abs(f.y), .085 * max(uCa[ci].w, .1));
      vec2 fm = vec2(qe.x, qe.y - .95); float cc = floor(fm.x * 22.);
      float hb = .014 + .075 * uFace[ci].x * (.55 + .45 * sin(cc * 1.9 + uTime * 23.)) + uFace[ci].w * .02 * (fm.x*fm.x*40.);
      eyeL += step(abs(fm.x), .17) * step(abs(fm.y), hb);
      vec2 cell = fract(f * 22.) - .5;
      float px = smoothstep(.5, .35, max(abs(cell.x), abs(cell.y)));
      emi = vec3(.15, .95, 1.) * 3. * (eyeL + eyeR) * px * uCb[ci].z;
      emi += vec3(.05, .25, .4) * .15 * uCb[ci].z;
    }
  }
  // luz
  vec3 keyDir = uTema > 2.5 ? normalize(vec3(-.35, .55, .75)) : normalize(vec3(.45, .85, .65));
  float dif = dot(n, keyDir);
  float sh = (cheap || dif < 0.) ? 1. : softShadow(p + n*.004, keyDir, 14.);
  float ao = cheap ? 1. : calcAO(p, n);
  vec3 col;
  if (clay){
    // argila fosca: difusa embrulhada, sombra suave e cor chapada, como na referencia
    float w = clamp(dif*.5 + .5, 0., 1.);
    vec3 lin = vec3(1., .95, .9) * (.25 + .85*w*w*mix(.55, 1., sh));
    lin *= mix(.55, 1., ao);
    lin += meterLight(p) * .55;
    float fre = pow(1. - max(dot(n, -rd), 0.), 4.);
    lin += vec3(.35, .5, 1.) * fre * .25;
    col = alb * lin;
    vec3 h = normalize(keyDir - rd);
    col += vec3(1.) * pow(max(dot(n, h), 0.), 24.) * .05 * sh;
  } else {
    vec3 lin = vec3(1., .95, .9) * max(dif, 0.) * sh * .9 + vec3(.06, .06, .09) * ao + meterLight(p) * .5;
    col = alb * lin;
    vec3 h = normalize(keyDir - rd);
    col += vec3(1.) * pow(max(dot(n, h), 0.), gloss) * spec * sh * .6;
  }
  col += emi;
  return col;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - .5*uRes) / uRes.y;
  uv = rot(uRoll) * uv;
  vec3 ww = normalize(uCamTgt - uCamPos);
  vec3 uu = normalize(cross(ww, vec3(0.,1.,0.)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(uv.x*uu + uv.y*vv + uFov*ww);
  vec3 ro = uCamPos;

  Hit h = march(ro, rd, 140, 40.);
  vec3 col = fundo(rd); vec3 emi = col; float depth = 60.;
  if (h.ok){
    depth = h.t;
    vec3 p = ro + rd*h.t;
    vec3 e;
    col = shade(p, rd, h.m, e, false);
    emi = e;
    if (h.m < 1.5){
      // chao espelhado: reflexo real com um raio a mais, borrado pela distancia
      vec3 n = vec3(0., 1., 0.);
      vec3 r = reflect(rd, n);
      vec3 jit = vec3(hash2(gl_FragCoord.xy)-.5, 0., hash2(gl_FragCoord.yx+3.)-.5) * .03;
      Hit hr = march(p + n*.01, normalize(r + jit), 70, 25.);
      vec3 rc = fundo(r);
      if (hr.ok){ vec3 e2; rc = shade(p + n*.01 + normalize(r+jit)*hr.t, r, hr.m, e2, true); }
      float fre = .12 + .88*pow(1. - max(dot(n, -rd), 0.), 5.);
      float refl = uTema < .5 ? 1. : uTema < 1.5 ? .55 : uTema < 2.5 ? .7 : .3;
      col += rc * mix(.2, .65, fre) * exp(-h.t*.04) * refl;
      emi += rc * .25;
      // poças de luz difusa no chao
      if (uTema < .5) col += vec3(1., .42, .08) * .02 * exp(-abs(p.z + 3.4)*1.5);
    }
  }
  vec3 fogc = uTema > 2.5 ? vec3(.5,.32,.36) : uTema > 1.5 ? vec3(.0,.01,.02) : vec3(.0,.0,.005);
  col = mix(col, fogc, 1. - exp(-depth * (uTema > 2.5 ? .016 : .012)));
  oCol = vec4(col, depth);
  oEmi = vec4(emi, 1.);
}
