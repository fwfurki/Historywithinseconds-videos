import sys;sys.path.insert(0,'/home/claude/w/tools')
from sfxlib import *
D=79.4;m=Mix(D,23);t=m.t;nz=m.noise()
m.pad(0,26.6,[49,73.4,98],.09,2,2)
m.pad(6.6,19,[98,123.5,146.8],.05,2,1.5)
m.pad(19,26.6,[92.5,110,138.6],.05,1,1)
m.pad(26.6,51.6,[46.2,69.3,92.5],.10,1,.3,trem=.5)
m.pulse(26.6,39,46,84,.09,rise=True);m.pulse(39,51.5,46,104,.10,rise=True)
m.riser(48.6,51.75,.25)
m.pad(52.5,71.3,[43.6,65.4,87.3],.10,3,2)
m.pad(59,71.3,[87.3,103.8,130.8],.04,3,2)
m.pad(71.3,79.4,[98,116.5,146.8,196],.06,2,2.5)
m.whoosh(0,1.6,.4);m.ding(1.35,880,.18);m.ding(1.35,1320,.08)
fire=m.flt(nz,300,3000)*(0.6+.4*np.abs(np.sin(t*7)))*(np.random.default_rng(3).random(m.N)>.0)
m.sfx+=fire*(m.env(2.6,6.6,.2,.3)+m.env(26.9,43.3,.3,.4)*.8+m.env(51.0,51.6,.05,.1))*.07
m.sfx+=m.flt(nz,250,900)*(m.env(2.6,6.6,.4,.4)+m.env(33.9,39.2,.4,.4))*(1+.4*np.sin(2*np.pi*.9*t))*.06   # crowd murmur
for tt in(6.65,26.65,51.65):m.thud(tt,.7)
for tt in(6.8,14.8,51.7,71.5):m.tick(tt,.15);m.whoosh(tt,.6,.18)
m.sfx+=m.flt(nz,200,1200)*m.env(6.6,14.6,1,.8)*.035     # harbour water
for tt in(8.2,12.0):
    L=int(1.6*sr);n=np.arange(L)/sr;h=(np.sin(2*np.pi*110*n)+.5*np.sin(2*np.pi*220*n)+.3*np.sin(2*np.pi*330*n))*np.minimum(1,n/.1)*np.clip((1.6-n)/.3,0,1);m.put(m.sfx,tt,h*.12)
m.boom(18.4,.5,.5,90);m.sfx+=m.flt(nz,800,4000)*m.env(18.4,19.1,.01,.5)*.25
m.ding(19.2,523,.12,1.5);m.ding(39.3,523,.12,1.5)
for tt in(21.9,23.0,24.0):m.thud(tt,.3)
m.whoosh(26.9,.9,.5)
for k in range(8):m.sfx+=0;m.put(m.sfx,28.7+k*.32,m.flt(np.random.default_rng(k).standard_normal(int(.25*sr)).tolist()+[0]*(m.N-int(.25*sr)),300,1500)[:int(.25*sr)]*np.hanning(int(.25*sr)),.25)
# telegraph clicks: morse-ish
rng=np.random.default_rng(5);tt=46.0
while tt<50.9:
    m.click(tt,.35);d=.07 if rng.random()<.6 else .2;m.click(tt+d,.25);tt+=d+.08+(.25 if rng.random()<.2 else 0)
L=int(1.4*sr);n=np.arange(L)/sr;wh=(np.sin(2*np.pi*620*n)+np.sin(2*np.pi*740*n))*np.minimum(1,n/.08)*np.clip((1.4-n)/.3,0,1);m.put(m.sfx,50.1,wh*.07)
m.boom(51.88,1.4,2.2,40);m.boom(51.9,.8,.9,90);m.sfx+=m.flt(nz,0,200)*m.env(52,59.3,.1,3)*.6
for k in range(30):m.click(52.3+m.rng.random()*2.5,.15)
m.sfx+=m.flt(nz,150,1500)*m.env(59.3,61.6,.3,.6)*.3
m.whoosh(61.6,2.2,.35);m.thud(63.9,.6)
m.counter(65.0,66.6,38,.2);m.counter(67.3,68.4,30,.2)
m.ding(69.3,392,.10,2)
m.sfx+=m.flt(nz,300,1500)*m.env(71.3,75.2,1,1)*(1+.5*np.sin(2*np.pi*.4*t))*.06
m.ding(75.05,440,.12,2);m.ding(77.65,660,.14,2);m.ding(77.65,990,.06,2)
m.save('/home/claude/w/halifax/music.wav','/home/claude/w/halifax/sfx.wav')
print('ok')
