import sys;sys.path.insert(0,'/home/claude/historywithinseconds-videos/toolkit/scripts')
from sfxlib import *
D=77.0;m=Mix(D,23);t=m.t;nz=m.noise()
# ---- music ----
m.pad(0,9.6,[55,82.4,110,164.8],.075,1.0,1.2,trem=.2)
m.riser(7.3,9.7,.16)
m.pad(9.6,24.6,[58.3,87.3,116.5,174.6],.07,1.0,1.0,trem=.3)
m.pulse(9.6,24.5,58.3,84,.06,rise=True)
m.pad(24.6,38.7,[49,73.4,98,146.8],.075,1.0,1.2)
m.pad(32.2,38.7,[392,587],.015,1.5,1.0,trem=.6)
m.riser(36.5,38.8,.14)
m.pad(38.7,48.9,[51.9,77.8,103.8,155.6],.07,1.0,1.0,trem=.25)
m.pulse(43.8,48.8,51.9,96,.06,rise=True)
m.riser(46.9,48.95,.18)
m.pad(48.9,57.9,[46.2,69.3,92.5,138.6],.08,.4,1.0,trem=.4)
m.pad(52.2,57.9,[554,830],.012,1.5,1.0,trem=.9)
m.riser(55.8,57.95,.16)
m.pad(57.9,67.95,[55,82.4,110,164.8],.075,.6,1.2)
m.pulse(62.1,67.9,55,100,.07,rise=True)
m.riser(65.8,68.0,.18)
m.pad(67.95,77,[49,73.4,98,146.8],.07,.8,2.5)
# ---- sfx ----
m.whoosh(0,1.4,.35);m.ding(1.05,880,.15);m.ding(1.05,1320,.06)
for tt in(2.2,4.8,7.6,9.6,12.0,14.6,17.3,19.4,21.7,24.6,29.9,32.2,35.2,38.7,43.8,46.9,48.9,52.2,55.45,57.9,62.1,64.95,67.95):m.whoosh(tt-.15,.5,.12)
rum=m.flt(nz,25,160);hiss=m.flt(nz,300,3000)
# fireball streak + airburst
m.whoosh(2.25,.8,.5);m.boom(2.9,1.2,1.6,50)
m.sfx+=rum*(m.env(2.9,7.6,.05,1.5)*.5+m.env(14.6,21.7,.1,1.5)*.4+m.env(24.6,30,.3,1.0)*.35+m.env(59.1,62.1,.05,1)*.45)
def snaps(a,b,n,amp,seed):
    r=np.random.default_rng(seed)
    for k in range(n):
        tt=a+r.random()*(b-a);L=int(.09*sr);x=r.standard_normal(L)*np.exp(-np.arange(L)/sr/.012);m.put(m.sfx,tt,m.flt(np.pad(x,(0,m.N-L))[:m.N],400,5000)[:L]*amp)
snaps(4.9,7.5,26,.35,1);snaps(24.8,29.6,40,.3,2)
gust=m.flt(nz,120,1800)
m.sfx+=gust*(m.env(4.8,7.6,.1,.8)*.12+m.env(21.8,24.4,.05,1.0)*.22+m.env(24.6,29.8,.4,.8)*.08)
# eerie wind
wind=m.flt(nz,200,900)*(1+.5*np.sin(2*np.pi*.23*t))
m.sfx+=wind*(m.env(7.6,9.6,.3,.4)+m.env(48.9,57.9,.5,.6)+m.env(38.7,43.8,.5,.5)*.6)*.05
# morning birds at camp
for k in range(14):
    tt=9.8+k*.31+(k%3)*.12;L=int(.12*sr);n=np.arange(L)/sr;f=3000+800*np.sin(2*np.pi*13*n)+500*(k%2);sig=np.sin(2*np.pi*np.cumsum(f)/sr)*np.hanning(L);m.put(m.sfx,tt,sig*.04)
# reindeer bells
for k in range(6):m.ding(10.2+k*.42,2100+(k%2)*300,.025,.4)
# approaching fireball roar
roar=m.flt(nz,60,1200)
m.sfx+=roar*(np.clip((t-12.0)/2.6,0,1)**2*(t<15.4))*.25
m.boom(15.4,1.3,1.8,45)
# heat roar at trading post
m.sfx+=m.flt(nz,150,2500)*m.env(19.4,21.7,.4,.4)*.06
# bodies falling (soft thuds)
for tt in(22.4,22.6,22.8):m.thud(tt,.35)
# seals / ribbon
for tt in(9.65,38.75,48.95):m.thud(tt,.7)
for tt in(9.7,32.4,40.6,58.0):m.tick(tt,.15)
# counters
m.counter(27.2,29.6,38,.2);m.ding(29.75,1046,.08,1)
m.counter(40.6,42.9,19,.22)
# Europe night
crick=np.sin(2*np.pi*4300*t)*(np.sin(2*np.pi*28*t)>.3)*((np.sin(2*np.pi*1.4*t))>0)
m.sfx+=crick*m.env(32.2,38.7,.3,.3)*.007
m.ding(35.3,196,.16,2.5);m.ding(35.3,392,.06,2.0)
# plinth
m.ding(44.0,587,.12,1.5)
# footsteps
for k in range(8):m.thud(47.0+k*.24,.12)
m.boom(50.1,.35,.5,70);m.boom(51.2,.35,.5,60)
# airburst diagram
m.whoosh(58.0,1.3,.45);m.boom(59.2,.9,1.4,55)
# space hum, city
hum=np.sin(2*np.pi*55*t)*.5+np.sin(2*np.pi*110*t)*.25
m.sfx+=hum*m.env(62.1,64.95,.4,.3)*.03
traffic=m.flt(nz,80,700)
m.sfx+=traffic*m.env(64.95,67.95,.3,.3)*.04
m.sfx+=roar*(np.clip((t-65.0)/2.9,0,1)**2*(t<67.95))*.18
m.ding(68.2,440,.12,2);m.ding(73.65,660,.13,2);m.ding(73.65,990,.06,2)
m.save('/home/claude/w/tun/music.wav','/home/claude/w/tun/sfx.wav')
print('ok')
