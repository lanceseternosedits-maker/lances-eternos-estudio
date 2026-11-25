# Sistema de Cortes (IA em 60s)

Pega uma live longa, acha os gritos e as reações e entrega os cortes verticais prontos.
Corte só live de quem **libera cortes** (vários streamers têm programa de cortes oficial). Respeite as regras de cada um.

## Do que precisa
- **Claude Code** (vem nos planos pagos do Claude) ou só o Python 3.
- **ffmpeg** instalado (grátis). No Windows: `winget install ffmpeg`. No Mac: `brew install ffmpeg`.
- Opcional, pra legenda: **Whisper** (grátis, roda no PC): `pip install openai-whisper`.

## Passo a passo
1. Baixe a live (a VOD) de quem libera corte e coloque numa pasta junto com o `cortes.py`.
2. Abra o Claude Code nessa pasta e cole o prompt abaixo.
3. Ele te mostra **5 momentos pra aprovar**. Você aprova (ou pede pra trocar algum).
4. Ele corta os 5 em vertical, com zoom e legenda, na pasta `cortes/`.
5. Pra legenda queimada: `whisper live.mp4 --language pt --output_format srt` e depois `--legenda live.srt`.

## Prompt pro Claude Code
```
Corta essa live em 5.
1) Rode: python3 cortes.py live.mp4  e me mostre a lista dos 5 momentos.
2) Pra cada momento, se existir live.srt, leia o que foi dito ali e me diga em 1 frase o que acontece e um título curto de até 6 palavras.
3) Espere eu aprovar. Depois rode: python3 cortes.py live.mp4 --cortar --legenda live.srt
4) No fim, me dê um título e uma legenda com 3 hashtags pra cada corte.
```

## Vídeo longo de melhores momentos (YouTube)
Depois dos cortes, peça: "junta os 5 cortes na ordem, em 16:9, com um título de 1 s antes de cada um".
O Claude monta o comando do ffmpeg (`concat`) pra você.

Feito pelo @iaem60s. Perfil independente, sem ligação com a Rockstar, a Take-Two ou a Anthropic.
