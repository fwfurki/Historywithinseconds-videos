import sys;sys.path.insert(0,'/home/claude/w/tools')
from sfxlib import *
D=75.0;m=Mix(D,47);t=m.t;nz=m.noise()
# ---- music ----
m.pad(0,7.35,[61.7,92.5,138.6,185],.07,1.5,1.5,trem=.25)
m.pad(1.7,7.35,[370,554],.02,1,1,trem=.7)
m.pad(7.35,17.3,[65.4,98,130.8,164.8],.065,1.2,1.0)
m.pad(17.3,25.9,[55,82.4,110,130.8],.08,1,1,trem=.3)
m.riser(23.6,25.95,.18)
m.pad(25.9,40.5,[61.7,92.5,123.5,185],.075,1,1,trem=.35)
m.pad(25.9,40.5,[370,466],.018,2,1,trem=.9)
m.pulse(21.1,40.4,61.7,80,.06,rise=True)
m.riser(38.3,40.6,.2)
m.pad(40.5,56.4,[58.3,87.3,116.5,174.6],.08,.5,1.0,trem=.5)
m.pulse(40.5,56.3,58.3,104,.08,rise=True)
m.pad(56.4,64.9,[55,82.4,110,164.8],.07,1.2,1.0)
m.riser(62.6,64.95,.16)
m.pad(64.9,75,[49,73.4,98,146.8],.07,.6,2.5)
# ---- sfx ----
m.whoosh(0,1.4,.35);m.ding(1.15,880,.15);m.ding(1.15,1320,.06)
shim=m.flt(m.rng.standard_normal(m.N),3000,9000)*(1+.5*np.sin(2*np.pi*.3*t))
m.sfx+=shim*(m.env(1.76,3.7,.3,.3)+m.env(25.9,31.5,.5,.4)*.8)*.012
murm=m.flt(nz,250,900)*(1+.4*np.sin(2*np.pi*.9*t))
m.sfx+=murm*(m.env(1.76,3.7,.3,.3)+m.env(25.9,29.6,.4,.3))*.04
def clicks(a,b,amp,rate=.09,seed=5):
    r=np.random.default_rng(seed);tt=a
    while tt<b:
        m.click(tt,amp);tt+=rate*(.5+r.random())
clicks(3.7,7.3,.32,.05);clicks(40.6,47.5,.3,.045,7)
buzz=np.sign(np.sin(2*np.pi*120*t))*.5+m.flt(nz,2000,8000)*1.5
crk=(np.random.default_rng(9).random(m.N)>.9993).astype(float);crk=np.convolve(crk,np.exp(-np.arange(300)/40),'same')*m.rng.standard_normal(m.N)
m.sfx+=(buzz*.02+crk*.5)*(m.env(3.7,7.35,.1,.2)+m.env(40.5,47.55,.1,.2)+m.env(60.4,64.9,.2,.3)*.7)
# birds England
for k in range(10):
    tt=7.6+k*.23+(k%3)*.1;L=int(.12*sr);n=np.arange(L)/sr;f=2800+900*np.sin(2*np.pi*14*n)+600*(k%2);sig=np.sin(2*np.pi*np.cumsum(f)/sr)*np.hanning(L);m.put(m.sfx,tt,sig*.05)
for tt in(7.4,25.95,40.57):m.thud(tt,.7)
for tt in(7.45,13.2,25.95,38.8,47.6,56.5):m.tick(tt,.15)
for tt in(1.76,3.7,5.6,7.35,9.87,12.9,15.2,17.26,21.08,25.91,29.6,31.5,34.3,35.8,38.7,40.52,43.32,45.32,47.55,51.05,54.4,56.44,60.34,64.89,66.8):m.whoosh(tt-.15,.5,.12)
m.ding(10.1,587,.12,1.5)
m.whoosh(13.0,.5,.3);m.ding(13.25,1568,.12,1.5);m.ding(13.25,2093,.06,1.2)
rum=m.flt(nz,25,160)
m.sfx+=rum*(m.env(17.26,21.08,.4,.4)+m.env(64.89,66.9,.4,.6))*.35
m.whoosh(21.4,4.2,.3)
m.boom(25.2,.4,1.0,60)
cr=np.zeros(m.N)
for k in range(400):
    tt=29.6+m.rng.random()*10.9;cr+=0
crick=np.sin(2*np.pi*4300*t)*(np.sin(2*np.pi*28*t)>.3)*((np.sin(2*np.pi*1.4*t))>0)
m.sfx+=crick*(m.env(29.6,31.5,.3,.2)+m.env(31.5,38.7,.3,.3))*.008
fire=m.flt(nz,400,3500)*(0.5+.5*np.abs(np.sin(t*5)))
m.sfx+=fire*m.env(31.5,38.7,.4,.3)*.03
for k in range(40):m.click(31.6+m.rng.random()*7,.1)
siz=m.flt(nz,2500,9000)*(1+.3*np.sin(2*np.pi*7*t))
m.sfx+=siz*m.env(35.8,38.7,.2,.3)*.035
for k in range(int(1.8/.25)):m.tick(38.75+k*.25,.12)
m.boom(43.52,.35,.35,120);m.sfx+=m.flt(nz,1500,8000)*m.env(43.5,43.9,.01,.3)*.3
m.click(48.6,.45);m.click(49.6,.45)
rng=np.random.default_rng(11);tt=51.1
while tt<54.3:
    m.click(tt,.3);d=.07 if rng.random()<.6 else .2;m.click(tt+d,.22);tt+=d+.1+(.25 if rng.random()<.2 else 0)
for k in range(16):m.tick(54.45+k*.12,.1)
hum=np.sin(2*np.pi*60*t)*.5+np.sin(2*np.pi*120*t)*.3
m.sfx+=hum*m.env(56.44,61,.5,.4)*.025
def pdown(tt,a=.18):
    L=int(1.3*sr);n=np.arange(L)/sr;f=180*np.exp(-n*2.2)+30;sig=np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-n*1.4);m.put(m.sfx,tt,sig*a);m.boom(tt,.2,.25,90)
for tt in(60.9,62.1,63.5):pdown(tt)
m.ding(67.1,440,.12,2);m.ding(72.45,660,.13,2);m.ding(72.45,990,.06,2)
m.save('/home/claude/w/cr/music.wav','/home/claude/w/cr/sfx.wav')
print('ok')
