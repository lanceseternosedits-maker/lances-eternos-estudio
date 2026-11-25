# Formato 5: Arquivo Secreto (motor 2D em PIL)

Implementação de referência do Vitor (`codigo_estilo_video.zip`, 15/11), lida inteira antes de rodar: só PIL, numpy e ffmpeg, sem rede nem chave. Os originais estão em `referencia/` (cenas do GPT-4 × TaskRabbit e voz Flite em inglês, só para estudo). Especificação e decisões: `../ESTILO_ARQUIVO_SECRETO.md`.

| Arquivo | O que faz |
|---|---|
| `base.py` | helpers do `render.py` da referência: paleta, fontes Inter Display, curvas (FADE, SLAM, POP), fundo com grid, glow, vinheta, granulação e scanlines, glitch, balões, terminal, cards |
| `mascote.py` | **nosso mascote de blocos** no lugar do apresentador humano (Vitor, 15/11): canto inferior esquerdo, halo ciano, poses explain/point/both/shock (0,28 s), pisca a cada ~3,4 s, balança 3 px, boca e olhos com o volume da voz; PIL com supersampling 2x |
| `render2.py` | motor: carrega `<pasta>/cenas.py`, faz folha de miniaturas, renderiza cada cena em arquivo próprio (2 processos), concatena sem reencodar e junta o áudio (final ~9 Mbit/s) |
| `plan.py` | linha do tempo: a duração das cenas vem da narração (`plano.json` + `vo/durs.json`) → `timeline.json`, `narration.wav`, `mouth.json` |
| `audio2.py` | trilha sintetizada (pad em Lá menor, kick + hi-hat 112 BPM, silêncio de 1 compasso no suspense), ducking de 55% sob a voz, efeitos; gera também a versão sem narração |
| `voz.py` | voz masculina pt-BR no Gemini TTS, uma chamada por frase (~US$ 0,02 por vídeo) |

## Fazer um vídeo novo (modelo: `posts/2026-11-16-robo-inventou-uma-regra/`)
1. `roteiro.json` com `segmentos` = uma frase por clip (`cena`, `clip`, `fala`), `voz` (Charon), `estilo`, `tela` (texto de cada cena) e `fontes`.
2. `. ~/.secrets/gemini.env; python3 video/cena_arquivo/voz.py <post>/roteiro.json <post>/arquivo` (frase pronta não é refeita). Se passar de 35 s, `atempo` até 1,15 nos wav e aperte o `plano.json`.
3. `<post>/arquivo/plano.json` (cenas, clips, cauda) → `python3 video/cena_arquivo/plan.py <post>/arquivo`.
4. `<post>/arquivo/cenas.py`: copie o do modelo e troque o conteúdo (FUN, SFX, MUTE). Conteúdo entre y 300 e 1300; o mascote fica embaixo à esquerda.
5. Folha: `python3 video/cena_arquivo/render2.py <post>/arquivo preview hook@0 chat@3 ...` (abra `folha.png`).
6. `python3 video/cena_arquivo/audio2.py <post>/arquivo` e `python3 video/cena_arquivo/render2.py <post>/arquivo tudo -j 2` (~1 min 15 s para 35 s) → `reel.mp4` e `reel_sem_voz.mp4`. Copie o `reel.mp4` para a pasta do post e rode `python3 checar.py posts/<pasta>`.
Os intermediários (cenas, wav, `_video.mp4`) ficam fora do git (`arquivo/.gitignore`).
