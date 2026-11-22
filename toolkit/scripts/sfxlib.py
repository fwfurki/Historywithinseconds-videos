import numpy as np,wave
sr=44100
class Mix:
    def __init__(s,D,seed=1):
        s.N=int(sr*D);s.t=np.arange(s.N)/sr;s.rng=np.random.default_rng(seed);s.mus=np.zeros(s.N);s.sfx=np.zeros(s.N)
    def flt(s,x,lo,hi):
        X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/sr)
        if hi:X*=1/(1+(f/hi)**4)
        if lo:X*=1/(1+(lo/np.maximum(f,1))**4)
        return np.fft.irfft(X,len(x))
    def env(s,a,b,att=.05,rel=.5):
        e=np.zeros(s.N);i0,i1=max(0,int(a*sr)),min(s.N,int(b*sr))
        if i1<=i0:return e
        seg=np.arange(i1-i0)/sr;e[i0:i1]=np.minimum(1,seg/max(att,1e-3))*np.clip((b-a-seg)/max(rel,1e-3),0,1);return e
    def noise(s):return s.rng.standard_normal(s.N)
    def put(s,buf,tt,sig,a=1.):
        i=int(tt*sr);L=min(len(sig),s.N-i)
        if L>0 and i>=0:buf[i:i+L]+=sig[:L]*a
    # --- one-shots ---
    def boom(s,tt,a=1.,dec=1.2,f0=55):
        L=int(dec*4*sr);n=np.arange(L)/sr;f=f0*np.exp(-n*1.5)+25
        sig=np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-n/dec);nz=s.rng.standard_normal(L);nz=np.convolve(nz,np.ones(40)/40,'same')*np.exp(-n/(dec*.4))*3
        s.put(s.sfx,tt,(sig+nz*.6)*a)
    def thud(s,tt,a=.8):
        L=int(.6*sr);n=np.arange(L)/sr;sig=np.sin(2*np.pi*(70*np.exp(-n*8)+45)*n)*np.exp(-n/.12);cl=s.rng.standard_normal(L)*np.exp(-n/.008)*.5
        s.put(s.sfx,tt,(sig+cl)*a)
    def click(s,tt,a=.25):
        L=int(.03*sr);n=np.arange(L)/sr;sig=s.rng.standard_normal(L)*np.exp(-n/.003)+np.sin(2*np.pi*2400*n)*np.exp(-n/.006)*.6
        s.put(s.sfx,tt,sig*a)
    def counter(s,t0,t1,n,a=.22):
        # clicks spaced by ease-in-out count progression (n clicks max 40)
        k=min(n,38)
        for i in range(k):
            u=(i+.5)/k;x=u
            tt=t0+(t1-t0)*(np.arccos(1-2*x)/np.pi)
            s.click(tt,a)
    def whoosh(s,tt,dur=.8,a=.5,up=True):
        L=int(dur*sr);n=np.arange(L)/sr;nz=s.rng.standard_normal(L);e=np.sin(np.pi*n/dur)**2
        x=np.zeros(s.N);x[:L]=nz;y=s.flt(x,300 if up else 150,2500)[:L]
        s.put(s.sfx,tt,y*e*a)
    def ding(s,tt,f=880,a=.25,dec=1.2):
        L=int(dec*4*sr);n=np.arange(L)/sr;sig=(np.sin(2*np.pi*f*n)+.4*np.sin(2*np.pi*f*2.01*n)+.2*np.sin(2*np.pi*f*3.02*n))*np.exp(-n/dec)
        s.put(s.sfx,tt,sig*a)
    def tick(s,tt,a=.2):
        L=int(.12*sr);n=np.arange(L)/sr;sig=np.sin(2*np.pi*1200*n)*np.exp(-n/.02)+np.sin(2*np.pi*1800*n)*np.exp(-n/.01)*.5
        s.put(s.sfx,tt,sig*a)
    def save(s,path_mus,path_sfx):
        for buf,p in((s.mus,path_mus),(s.sfx,path_sfx)):
            m=np.abs(buf).max() or 1;y=buf/m*.9 if m>.9 else buf
            w=wave.open(p,'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(y,-1,1)*32767).astype(np.int16).tobytes());w.close()
    # --- music helpers ---
    def pad(s,a,b,freqs,amp=.1,att=1.5,rel=1.5,trem=0):
        e=s.env(a,b,att,rel);x=sum(np.sin(2*np.pi*f*s.t+i)*(1/(1+i*.6)) for i,f in enumerate(freqs))
        x+=sum(np.sin(2*np.pi*f*1.003*s.t)*.3 for f in freqs)
        if trem:x*=1+.25*np.sin(2*np.pi*trem*s.t)
        s.mus+=x*e*amp
    def pulse(s,a,b,f,bpm,amp=.12,rise=False):
        beat=60/bpm;tt=a
        while tt<b:
            L=int(.35*sr);n=np.arange(L)/sr;g=amp*(1+(1.2*(tt-a)/(b-a) if rise else 0))
            s.put(s.mus,tt,np.sin(2*np.pi*f*n)*np.exp(-n/.12)*g+np.sin(2*np.pi*f*2*n)*np.exp(-n/.05)*g*.3);tt+=beat
    def riser(s,a,b,amp=.15):
        L=int((b-a)*sr);n=np.arange(L)/sr;f=80+400*(n/(b-a))**2;sig=np.sin(2*np.pi*np.cumsum(f)/sr)*(n/(b-a))**2
        nz=s.rng.standard_normal(L)*(n/(b-a))**3*.3;s.put(s.mus,a,(sig+nz)*amp)
