"""Base mínima do motor v6, refeita em 14/11 (o engine.py original não veio no zip do Drive).
Os shaders usam só gl_FragCoord, então o vértice é um quad de tela cheia."""
import os

AQUI = os.path.dirname(os.path.abspath(__file__))

VERT = """#version 330
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
"""


class Motor:  # o video.py (v1) usava o Motor antigo; o v6 usa o Motor2 do engine2.py
    def __init__(self, *a, **k):
        raise RuntimeError("Motor v1 não está no pacote; use engine2.Motor2 (video5.py)")
