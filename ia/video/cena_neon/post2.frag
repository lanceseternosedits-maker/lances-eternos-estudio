#version 330
// Pos: profundidade de campo, desfoque de movimento, bloom, particulas, cor, vinheta, grao, aberracao.
uniform sampler2D tCol;   // rgb + profundidade em a (com mipmaps)
uniform sampler2D tEmi;   // emissivo (com mipmaps)
uniform vec2 uRes;        // resolucao de saida
uniform float uTime, uFocus, uAperture, uCA, uFlash, uExpo, uSeed;
uniform vec2 uBlurDir;    // desfoque direcional em uv
uniform vec3 uCamVel;     // deslocamento de paralaxe das particulas
out vec4 oCol;

float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }

vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14), 0., 1.); }

vec4 dofSample(vec2 uv){
  vec4 c0 = textureLod(tCol, uv, 0.);
  float d = c0.a;
  float coc = clamp(abs(d - uFocus) / max(d, .1) * uAperture, 0., 1.);
  if (coc < .02) return c0;
  float rpx = coc * 34.;
  float lod = log2(max(rpx / 3., 1.));
  vec3 acc = vec3(0.); float w = 0.;
  float ga = 2.39996;
  for (int i=0; i<16; i++){
    float r = sqrt((float(i) + .5) / 16.);
    float a = float(i) * ga;
    vec2 o = vec2(cos(a), sin(a)) * r * rpx / uRes;
    vec4 s = textureLod(tCol, uv + o, lod);
    // evita que fundo borrado vaze por cima do primeiro plano nitido
    float sw = s.a < d - .5 ? .15 : 1.;
    vec3 c = s.rgb;
    float l = dot(c, vec3(.3,.6,.1));
    c *= 1. + smoothstep(1., 4., l) * 1.5;   // bokeh mais brilhante
    acc += c * sw; w += sw;
  }
  return vec4(acc / w, d);
}

vec3 particles(vec2 uv){
  vec3 acc = vec3(0.);
  float asp = uRes.x / uRes.y;
  for (int layer=1; layer<4; layer++){
    float fl = float(layer);
    float scale = 7. + fl*5.;
    vec2 p = uv * vec2(asp, 1.) * scale;
    p += uCamVel.xy * (1. + fl) * 3.;
    p.y -= uTime * (.25 + fl*.12);
    p.x += sin(uTime*.6 + fl) * .3;
    vec2 id = floor(p), f = fract(p) - .5;
    float h = hash2(id + fl*13.1 + uSeed);
    if (h < .9) continue;
    vec2 off = (vec2(hash2(id+1.7+fl), hash2(id+4.3+fl)) - .5) * .7;
    float sz = mix(.05, .16, hash2(id+9.2)) * (layer == 0 ? 2.2 : 1.);
    float d = length(f - off);
    float soft = layer == 0 ? .55 : .25;
    float a = smoothstep(sz, sz*soft, d);
    float tw = .55 + .45*sin(uTime*2.5 + h*30.);
    vec3 c = h > .9 ? vec3(1., .45, .1) : h > .8 ? vec3(1., .85, .25) : h > .7 ? vec3(.15, .85, 1.) : h > .62 ? vec3(1., .25, .7) : vec3(.7, .5, 1.);
    acc += c * a * tw * .45;
  }
  return acc;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 col;
  // aberracao cromatica + desfoque direcional (movimento de camera)
  if (length(uBlurDir) > .0005){
    vec3 acc = vec3(0.);
    for (int i=0; i<10; i++){
      float k = float(i)/9. - .5;
      acc += dofSample(uv + uBlurDir*k).rgb;
    }
    col = acc / 10.;
  } else {
    col = dofSample(uv).rgb;
  }
  if (true){ float ca = max(uCA, .0035);
    vec2 dir = (uv - .5) * ca;
    col.r = mix(col.r, dofSample(uv + dir).r, .9);
    col.b = mix(col.b, dofSample(uv - dir).b, .9);
  }
  // bloom a partir dos mips do emissivo e das altas luzes
  vec3 bloom = vec3(0.);
  float wsum = 0.;
  for (int l=1; l<8; l++){
    float w = 1. / (1. + float(l)*.35);
    bloom += textureLod(tEmi, uv, float(l)).rgb * w;
    vec3 hc = textureLod(tCol, uv, float(l)).rgb;
    bloom += max(hc - 1.2, 0.) * w * .5;
    wsum += w;
  }
  col += bloom / wsum * 1.8;
  col += particles(uv);
  // exposicao e tonemap
  col *= uExpo;
  col = aces(col);
  // grade: sombras azul-petroleo, altas luzes quentes, mais saturacao
  float l = dot(col, vec3(.299,.587,.114));
  col = mix(vec3(l), col, 1.3);
  col += vec3(-.01, .0, .03) * (1. - l) + vec3(.03, .01, -.02) * l;
  col = clamp(col, 0., 1.);
  col = col*col*(3. - 2.*col) * .6 + col * .4;   // contraste suave
  // vinheta
  vec2 q = uv - .5;
  col *= 1. - dot(q*vec2(1.2, .95), q*vec2(1.2, .95)) * 1.5;
  col += uFlash;
  // grao
  col += (hash2(uv*uRes + fract(uTime)*91.) - .5) * .05;
  oCol = vec4(clamp(col, 0., 1.), 1.);
}
