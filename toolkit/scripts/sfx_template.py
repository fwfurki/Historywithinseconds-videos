import numpy as np,wave
sr=44100;D=64.0;N=int(sr*D);t=np.arange(N)/sr;rng=np.random.default_rng(17)
def flt(x,lo,hi):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/sr);X*=1/(1+(f/hi)**4)
    if lo:X*=1/(1+(lo/np.maximum(f,1))**4)
    return np.fft.irfft(X,len(x))
def env(a,b,att=.05,rel=.5):e=np.zeros(N);i0,i1=int(a*sr),min(N,int(b*sr));seg=np.arange(i1-i0)/sr;e[i0:i1]=np.minimum(1,seg/att)*np.clip((b-a-seg)/rel,0,1);return e
noise=rng.standard_normal(N)
def hit(tt,f,dec,a):
    global out;i=int(tt*sr);L=min(int(dec*6*sr),N-i);n=np.arange(L)/sr;out[i:i+L]+=np.sin(2*np.pi*f*n)*np.exp(-n/dec)*a
drone=(np.sin(2*np.pi*55*t)*.5+np.sin(2*np.pi*73.4*t)*.3+np.sin(2*np.pi*58.3*t)*.2)*env(0,59.4,1.5,1.5);out=drone*.1
wind=flt(noise,150,700)*env(6.9,28.3,1,.5)*.6;out+=wind*.18
engines=(np.sin(2*np.pi*48*t)+.5*np.sin(2*np.pi*96*t))*(1+.3*np.sin(2*np.pi*6*t))*env(11.7,28.3,1,.4);out+=engines*.08
fire=flt(noise,200,2500)*(env(0,7,.2,1)+env(29.1,51.3,.3,2))*(0.6+.4*np.sin(t*9));out+=fire*.18
out+=flt(noise,0,200)*env(29.17,33,.05,3)**2*1.6*.5
out+=flt(noise,0,150)*env(34.8,38.5,.05,3)**2*2*.6
for k in range(40):hit(35+rng.random()*3,300+rng.random()*800,.02,.12)
crowd=flt(noise,400,2000)*env(37.7,47,.5,1)*(0.5+.5*np.abs(np.sin(t*3)));out+=crowd*.1
music=sum(np.sin(2*np.pi*f*t)*a for f,a in((220,.4),(261.6,.3),(329.6,.3)))*env(55.7,64,1.5,1.5);out+=music*.14
for tt in(0.0,4.27,20.36,29.17,34.8,47.12,59.4):hit(tt,42,.3,.4)
out=out/np.abs(out).max()*.9
w=wave.open('hb/bed.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((out*32767).astype(np.int16).tobytes());w.close()
