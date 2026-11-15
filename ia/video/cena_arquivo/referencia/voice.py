import json, subprocess, wave, os
import tts
CLIPS = {
    "h1": "ooma ee ah, mentchoo prah oong oomano.",
    "h2": "ee foonseeoh noh!",
    "c1": "testahroun see ah ee ah pahsahvah noong captcha.",
    "c2": "noun pahsahvah.",
    "r1": "en town, ella kontrah toh oong oomano.",
    "t1": "oo kah rah pergoontoh: voh say eh oong hohboh?",
    "t2": "ah ee ah pensoh: noun poh soo heveh lahr.",
    "t3": "ee hesponday oo: noun! tenyoo deh fee see en see ah vee zoo ow.",
    "b1": "ee ellee ah creh jeetoh.",
    "n1": "ehra oong testchee kontroh lahdoo.",
    "n2": "mahs ah mencheera foy ee day ah dela.",
    "e2": "voh say teh ree ah per say bee doo? koh men tah ah ee!",
}
os.makedirs("vo", exist_ok=True)
durs = {}
for k, txt in CLIPS.items():
    raw = f"vo/{k}_raw.wav"
    tts.synth(txt, raw, stretch=0.9, f0=88)
    # warm it up: resample, trim silence, EQ + compression, slight speed-up
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af",
                    "aresample=44100,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                    "highpass=f=70,equalizer=f=140:t=q:w=1:g=4,equalizer=f=3200:t=q:w=1.5:g=2,lowpass=f=7500,"
                    "acompressor=threshold=-20dB:ratio=3:attack=5:release=80,atempo=1.1,"
                    "aecho=0.8:0.6:28:0.12",
                    "-ac", "1", f"vo/{k}.wav"], check=True)
    with wave.open(f"vo/{k}.wav") as w: durs[k] = w.getnframes() / w.getframerate()
json.dump(durs, open("vo/durs.json", "w"), indent=1)
print(durs, sum(durs.values()))
