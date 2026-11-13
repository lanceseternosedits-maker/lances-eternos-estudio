"""Motor v3: mesma base do engine.py, com cena scene2.frag, pos post2.frag e duas texturas (medidor e placa)."""
import os
import numpy as np
import moderngl
from engine import VERT, AQUI


class Motor2:
    def __init__(self, w=1080, h=1920, escala=0.5):
        self.W, self.H = w, h
        self.sw, self.sh = int(w * escala) // 2 * 2, int(h * escala) // 2 * 2
        self.ctx = moderngl.create_standalone_context()
        quad = self.ctx.buffer(np.array([-1, -1, 1, -1, -1, 1, 1, 1], "f4"))
        self.pS = self.ctx.program(vertex_shader=VERT, fragment_shader=open(f"{AQUI}/scene2.frag").read())
        self.pP = self.ctx.program(vertex_shader=VERT, fragment_shader=open(f"{AQUI}/post2.frag").read())
        self.vS = self.ctx.vertex_array(self.pS, [(quad, "2f", "p")])
        self.vP = self.ctx.vertex_array(self.pP, [(quad, "2f", "p")])
        self.tCol = self.ctx.texture((self.sw, self.sh), 4, dtype="f4")
        self.tEmi = self.ctx.texture((self.sw, self.sh), 4, dtype="f4")
        for t in (self.tCol, self.tEmi):
            t.filter = (moderngl.LINEAR_MIPMAP_LINEAR, moderngl.LINEAR); t.repeat_x = t.repeat_y = False
        self.fbS = self.ctx.framebuffer(color_attachments=[self.tCol, self.tEmi])
        self.tOut = self.ctx.texture((w, h), 4)
        self.fbP = self.ctx.framebuffer(color_attachments=[self.tOut])
        self.tex = {}
        for nome, un, tam in (("uMeterTex", 2, (512, 320)), ("uSignTex", 3, (1024, 256))):
            t = self.ctx.texture(tam, 3); t.filter = (moderngl.LINEAR, moderngl.LINEAR); t.repeat_x = t.repeat_y = False
            self.tex[nome] = (t, un)
            if nome in self.pS: self.pS[nome] = un
        self.pP["tCol"] = 0; self.pP["tEmi"] = 1

    def _set(self, prog, d):
        for k, v in d.items():
            if k in prog:
                u = prog[k]
                if isinstance(v, (list, tuple)) and len(v) and isinstance(v[0], (list, tuple)):
                    u.write(np.array(v, "f4").tobytes())
                else:
                    u.value = v

    def quadro(self, cena, pos, texturas=None):
        for nome, img in (texturas or {}).items():
            t, un = self.tex[nome]; t.write(img.transpose(1).tobytes())
        for t, un in self.tex.values(): t.use(un)
        self.fbS.use()
        self._set(self.pS, dict(cena, uRes=(self.sw, self.sh)))
        self.vS.render(moderngl.TRIANGLE_STRIP)
        self.tCol.build_mipmaps(); self.tEmi.build_mipmaps()
        self.tCol.use(0); self.tEmi.use(1)
        self.fbP.use()
        self._set(self.pP, dict(pos, uRes=(self.W, self.H)))
        self.vP.render(moderngl.TRIANGLE_STRIP)
        a = np.frombuffer(self.fbP.read(components=3), np.uint8).reshape(self.H, self.W, 3)
        return a[::-1]
