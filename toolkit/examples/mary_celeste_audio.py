import sys;sys.path.insert(0,'/home/claude/w/tools')
from sfxlib import *
D=76.0;m=Mix(D,31);t=m.t;nz=m.noise()
# ---- music: D minor mystery ----
m.pad(0,13.3,[73.4,110,174.6],.08,2,2)
m.pad(2.3,13.3,[146.8,220],.03,2,1.5,trem=.3)
m.pad(13.3,27.8,[65.4,98,155.6],.07,1.5,1.5)
m.pad(27.8,41.3,[73.4,110,146.8,174.6],.08,1.5,.5,trem=.4)
m.pulse(27.8,41.2,73.4,84,.07,rise=True)
m.riser(39.2,41.4,.18)
m.pad(41.3,54.3,[69.3,103.8,138.6],.08,.6,1.0)
m.pulse(41.3,59.7,69.3,96,.08,rise=True)
m.pad(54.3,62.1,[73.4,110,155.6],.08,1,.5,trem=.6)
m.riser(60.0,62.2,.2)
m.pad(62.1,68.1,[58.3,87.3,116.5,174.6],.09,.5,2.5)
m.pad(68.1,76,[73.4,110,146.8,220],.06,1.5,2.5)
# ---- ambience ----
sea=m.flt(nz,120,900)*(1+.5*np.sin(2*np.pi*.18*t))
seaEnv=m.env(2.3,11.4,.6,.4)+m.env(13.3,21.3,.4,.4)+m.env(27.8,36.8,.4,.4)+m.env(54.3,68.1,.4,1.5)
m.sfx+=sea*seaEnv*.05
wind=m.flt(m.rng.standard_normal(m.N),400,2500)*(1+.6*np.sin(2*np.pi*.11*t+1))
m.sfx+=wind*(m.env(2.3,11.4,.5,.4)+m.env(27.8,34.3,.4,.4)+m.env(62.1,68.1,.4,1.5))*.018
# sail flaps
for tt in np.arange(5.8,9.0,.55)+.0:m.put(m.sfx,tt,m.flt(np.r_[m.rng.standard_normal(int(.12*sr)),np.zeros(m.N-int(.12*sr))],150,1200)[:int(.12*sr)]*np.hanning(int(.12*sr)),.25)
# creaks (wood)
def creak(tt,a=.08,f=180,dur=.6):
    L=int(dur*sr);n=np.arange(L)/sr;fr=f*(1+.15*np.sin(2*np.pi*3*n));ph=np.cumsum(fr)/sr;sig=np.sign(np.sin(2*np.pi*ph))*np.exp(-((n-dur/2)/(dur/3))**2);sig=m.flt(np.r_[sig,np.zeros(m.N-L)],200,2000)[:L];m.put(m.sfx,tt,sig*a)
for tt in(3.5,9.4,10.6,33.0,33.9,37.5,39.8,42.5,45.5,49.0,52.5,55.0):creak(tt,.06,150+(tt*37)%80)
# whooshes on cuts
for tt in(2.36,5.7,7.12,9.1,11.4,13.3,18.2,21.3,24.3,27.8,31.4,32.8,34.3,36.8,39.1,41.3,46.8,48.4,54.3,56.2,57.9,59.8,62.1,64.5,68.1):m.whoosh(tt-.15,.5,.12)
m.whoosh(0,1.6,.35);m.ding(1.35,880,.16);m.ding(1.35,1320,.07)
m.boom(9.25,.45,.9,60)
for tt in(13.35,27.85,41.35):m.thud(tt,.7)
for tt in(13.4,28.0,49.6,53.2):m.tick(tt,.15)
m.ding(11.6,587,.12,1.5);m.ding(21.6,587,.12,1.5)
m.counter(18.5,20.4,38,.18)
m.click(24.35,.3);m.click(25.34,.3)
m.counter(26.5,27.3,7,.25)
# oars
for tt in np.arange(34.4,36.0,.75):m.put(m.sfx,tt,m.flt(np.r_[m.rng.standard_normal(int(.25*sr)),np.zeros(m.N-int(.25*sr))],300,3000)[:int(.25*sr)]*np.hanning(int(.25*sr)),.18)
for tt in np.arange(64.6,68.0,1.1):m.put(m.sfx,tt,m.flt(np.r_[m.rng.standard_normal(int(.25*sr)),np.zeros(m.N-int(.25*sr))],300,3000)[:int(.25*sr)]*np.hanning(int(.25*sr)),.1)
# reveals
m.ding(37.0,659,.08,1.2);m.ding(39.2,587,.08,1.2)
m.ding(43.2,523,.12,1.4);m.ding(44.6,587,.12,1.4);m.ding(46.8,659,.13,1.6)
for k in range(16):m.ding(46.95+k*.07,1400+k*90,.025,.3)
m.sfx+=m.flt(nz,2000,6000)*m.env(48.6,49.8,.1,.6)*.015   # chalk-ish hiss
m.thud(54.45,.45);m.thud(54.7,.3)
m.ding(56.3,196,.12,.8);m.click(56.3,.4)
slosh=m.flt(nz,100,700)*(.5+.5*np.sin(2*np.pi*.9*t))**2
m.sfx+=slosh*m.env(57.9,59.8,.3,.4)*.12
m.boom(66.6,.4,1.4,48)
m.ding(68.4,440,.12,2);m.ding(73.45,660,.13,2);m.ding(73.45,990,.06,2)
m.save('/home/claude/w/mc/music.wav','/home/claude/w/mc/sfx.wav')
print('ok')
