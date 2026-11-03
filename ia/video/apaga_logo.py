# Apaga um logo de terceiros (ex.: maçã no monitor) que o modelo de vídeo desenhou: acha por template multi-escala e
# pinta por cima com o degradê horizontal das bordas. Uso: python3 apaga_logo.py entrada.mp4 saida.mp4 recorte_do_logo.png [limiar 0.88] [escala_min] [escala_max]
src,dst,tpl_path=sys.argv[1],sys.argv[2],sys.argv[3]; thr=float(sys.argv[4]) if len(sys.argv)>4 else 0.6
tpl=cv2.imread(tpl_path,0)
cap=cv2.VideoCapture(src); fps=cap.get(5); W=int(cap.get(3)); H=int(cap.get(4))
out=cv2.VideoWriter(dst+".avi",cv2.VideoWriter_fourcc(*"MJPG"),fps,(W,H)); i=0; hits=[]
while True:
    ok,f=cap.read()
    if not ok: break
    if 'last' not in dir(): last=(-99,None)
    g=cv2.cvtColor(f,cv2.COLOR_BGR2GRAY); best=(0,None)
    y0=int(H*0.45)
    for s in np.linspace(float(sys.argv[5]) if len(sys.argv)>5 else 0.6,float(sys.argv[6]) if len(sys.argv)>6 else 2.2,17):
        t=cv2.resize(tpl,None,fx=s,fy=s)
        r=cv2.matchTemplate(g[y0:],t,cv2.TM_CCOEFF_NORMED); _,mv,_,ml=cv2.minMaxLoc(r)
        if mv>best[0]: best=(mv,(ml[0],ml[1]+y0,t.shape[1],t.shape[0]))
    if best[0]>thr: last=(i,best[1])
    if i-last[0]<=4:
        x,y,w,h=last[1]
        px=int(w*0.45)+2; py=int(h*0.12)+1
        a,b=max(0,x-px),min(W-1,x+w+px); c,d=max(0,y-py),min(H,y+h+py)
        Lc=f[c:d,a].astype(np.float32); Rc=f[c:d,b].astype(np.float32); k=np.linspace(0,1,b-a)[None,:,None]
        patch=Lc[:,None,:]*(1-k)+Rc[:,None,:]*k
        f[c:d,a:b]=np.clip(cv2.GaussianBlur(patch,(0,0),2),0,255).astype(np.uint8); hits.append((i,round(best[0],2),x,y,w))
    out.write(f); i+=1
out.release()
subprocess.run(["ffmpeg","-loglevel","error","-y","-i",dst+".avi","-c:v","libx264","-crf","14","-pix_fmt","yuv420p",dst],check=True)
print(len(hits),"quadros corrigidos de",i); print(hits[::6])
