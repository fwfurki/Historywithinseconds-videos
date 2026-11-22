import sys,subprocess,re,numpy as np,wave
src,dst,cap=sys.argv[1],sys.argv[2],float(sys.argv[3])
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',src,'-ac','1','-ar','44100',dst+'.tmp.wav'],check=True)
w=wave.open(dst+'.tmp.wav');sr=w.getframerate();x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32);w.close()
log=subprocess.run(['ffmpeg','-hide_banner','-i',dst+'.tmp.wav','-af','silencedetect=n=-38dB:d=0.18','-f','null','-'],capture_output=True,text=True).stderr
st=[float(v) for v in re.findall(r'silence_start: ([\d.]+)',log)];en=[float(v) for v in re.findall(r'silence_end: ([\d.]+)',log)]
pairs=list(zip(st,en));out=[];pos=0
for a,b in pairs:
    if b-a>cap:
        mid_keep=cap/2
        cut0=int((a+mid_keep)*sr);cut1=int((b-mid_keep)*sr)
        out.append(x[pos:cut0]);
        # short crossfade
        pos=cut1
out.append(x[pos:]);y=np.concatenate(out)
w=wave.open(dst,'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes(y.astype(np.int16).tobytes());w.close()
print(len(x)/sr,'->',len(y)/sr)
