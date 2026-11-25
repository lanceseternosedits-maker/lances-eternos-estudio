import ctypes, sys
L = "/usr/lib/x86_64-linux-gnu/"
for lib in ["libflite.so.1", "libflite_usenglish.so.1", "libflite_cmulex.so.1"]:
    try: ctypes.CDLL(L + lib, mode=ctypes.RTLD_GLOBAL)
    except OSError as e: print("warn", e)
fl = ctypes.CDLL(L + "libflite.so.1", mode=ctypes.RTLD_GLOBAL)
voice_name = sys.argv[1] if len(sys.argv) > 1 else "rms"
vl = ctypes.CDLL(L + f"libflite_cmu_us_{voice_name}.so.1", mode=ctypes.RTLD_GLOBAL)
fl.flite_init()
reg = getattr(vl, f"register_cmu_us_{voice_name}"); reg.restype = ctypes.c_void_p
V = reg(None)
vp = ctypes.c_void_p
for f, r, a in [("flite_synth_text", vp, [ctypes.c_char_p, vp]), ("utt_relation", vp, [vp, ctypes.c_char_p]),
                ("relation_head", vp, [vp]), ("item_next", vp, [vp]), ("item_feat_string", ctypes.c_char_p, [vp, ctypes.c_char_p]),
                ("utt_wave", vp, [vp]), ("cst_wave_save_riff", ctypes.c_int, [vp, ctypes.c_char_p]),
                ("feat_set_float", None, [vp, ctypes.c_char_p, ctypes.c_float]), ("delete_utterance", None, [vp]),
                ("item_feat_float", ctypes.c_float, [vp, ctypes.c_char_p]), ("item_daughter", vp, [vp]),
                ("item_as", vp, [vp, ctypes.c_char_p])]:
    fn = getattr(fl, f); fn.restype = r; fn.argtypes = a
feats = ctypes.cast(V + 8, ctypes.POINTER(vp))[0]

def setf(k, v): fl.feat_set_float(feats, k.encode(), v)

def phones(text):
    u = fl.flite_synth_text(text.encode(), V)
    out = []; it = fl.relation_head(fl.utt_relation(u, b"Word"))
    while it:
        w = fl.item_feat_string(it, b"name").decode()
        sw = fl.item_as(it, b"SylStructure"); ph = []
        syl = fl.item_daughter(sw) if sw else None
        while syl:
            seg = fl.item_daughter(syl); s = []
            while seg:
                s.append(fl.item_feat_string(seg, b"name").decode()); seg = fl.item_next(seg)
            ph.append("".join(x for x in s))
            ph[-1] = "-".join(s) + ("'" if fl.item_feat_string(syl, b"stress") == b"1" else "")
            syl = fl.item_next(syl)
        out.append(f"{w}=[{' | '.join(ph)}]"); it = fl.item_next(it)
    fl.delete_utterance(u)
    return " ".join(out)

def synth(text, path, stretch=1.0, f0=None):
    setf("duration_stretch", stretch)
    if f0: setf("int_f0_target_mean", f0)
    u = fl.flite_synth_text(text.encode(), V)
    fl.cst_wave_save_riff(fl.utt_wave(u), path.encode())
    fl.delete_utterance(u)

if __name__ == "__main__":
    for line in sys.argv[2:]:
        print(line, "->", phones(line))
