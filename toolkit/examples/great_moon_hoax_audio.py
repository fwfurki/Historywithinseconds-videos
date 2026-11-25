import sys;sys.path.insert(0,'/home/claude/historywithinseconds-videos/toolkit/scripts')
from sfxlib import *
D=80.3;m=Mix(D,53);t=m.t;nz=m.noise()
# music: playful-mysterious waltz-ish pulse in a minor key, wonder pad on the Moon, tension at the truth
m.pad(0,8.85,[61.7,92.5,123.5,185],.06,.4,.8,trem=.2)
m.pad(8.85,26.95,[65.4,98,130.8,196],.06,.6,.8,trem=.15)
m.pulse(8.85,26.9,65.4,108,.05)
m.riser(24.9,27.0,.12)
m.pad(26.95,40.4,[73.4,110,146.8,220,293.7],.06,.8,1.0,trem=.5)
for k in range(14):m.ding(27.2+k*.95,[587,659,784,880,784,659,587][k%7],.05,1.6)
m.pad(40.4,56.55,[55,82.4,110,164.8],.06,.6,.8,trem=.2)
m.pulse(42.5,56.5,55,96,.05,rise=True)
m.riser(54.6,56.6,.14)
m.pad(56.55,72.3,[49,73.4,98,146.8],.065,.4,1.0,trem=.3)
m.pulse(58.95,66.1,49,80,.05)
m.pad(72.3,80.3,[55,82.4,110,164.8],.035,.8,2.5)
cuts=[1.9,4.2,5.6,6.85,8.85,10.45,14.45,17.6,23.0,25.0,26.95,28.75,30.65,32.65,35.0,40.4,42.5,47.8,51.45,53.35,56.55,58.95,63.0,66.2,72.3]
for tt in cuts:m.whoosh(tt-.15,.5,.11)
# hook: paper slap + sting
m.whoosh(0,.9,.4);m.thud(.85,.5);m.ding(.9,440,.1,1.5);m.ding(.9,660,.05,1.5)
m.whoosh(1.9,1.4,.3);m.ding(3.0,880,.14);m.ding(3.0,1320,.05)
# wing flaps
for k in range(9):m.whoosh(4.3+k*.14,.12,.08,False)
for k in range(24):m.whoosh(35.2+k*.21,.14,.05,False)
# unicorn shimmer
m.ding(5.75,1175,.08,1.0);m.ding(5.85,1568,.05,1.0)
# street murmur
murm=m.flt(nz,250,900)*(1+.4*np.sin(2*np.pi*.9*t))
m.sfx+=murm*(m.env(6.85,10.45,.3,.3)+m.env(40.4,42.5,.2,.3)*.7+m.env(53.35,56.55,.3,.3)*.5)*.05
# printing press clanks (platen at sin(4t) peaks)
for k in range(10):m.thud(10.45+.39+k*1.57,.35);m.click(10.45+.4+k*1.57,.12)
# telescope creak / swing
m.sfx+=m.flt(nz,300,900)*m.env(23.0,24.6,.3,.4)*.05
m.counter(20.6,22.4,24,.22)
m.counter(25.0,26.4,6,.25)
# lunar ambience
m.sfx+=m.flt(nz,100,400)*m.env(26.95,40.4,.6,.6)*.02
# bison hooves, goat bleat-ish tone, beaver steps
for k in range(12):m.thud(28.9+k*.15,.05)
for k in range(8):m.click(32.8+k*.27,.08)
# reveal stings
m.boom(36.1,.3,1.2,60);m.ding(39.1,523,.08,1.5)
m.boom(40.5,.25,.8,70)
# night crickets at the Cape
cr=np.sin(2*np.pi*4200*t)*(np.sin(2*np.pi*14*t)>.6)*(np.sin(2*np.pi*.8*t)>0)
m.sfx+=cr*m.env(42.5,47.8,.4,.4)*.012
# magnifier / paper rustles
for tt in(48.0,51.5,51.8,52.1,52.4,52.7,63.0):m.whoosh(tt,.3,.12)
m.thud(63.75,.45);m.boom(63.8,.3,.8,60)
# quill scratch
scratch=m.flt(nz,2500,6000)*(.5+.5*np.sign(np.sin(2*np.pi*3.3*t)))
m.sfx+=scratch*m.env(59.0,62.9,.1,.2)*.015
# laugh-ish bounce and letters landing
for k in range(5):m.ding(67.4+k*.22,330+k*25,.03,.3)
for k in range(28):m.click(68.8+k*.12+(k*7%5)*.02,.07)
# seals + ribbon ticks
for tt in(8.95,27.0,56.6):m.thud(tt,.7)
for tt in(9.0,25.1,63.1):m.tick(tt,.15)
m.ding(72.6,440,.06,2);m.ding(77.85,660,.06,2);m.ding(77.85,990,.03,2)
m.save('/home/claude/w/moon/music.wav','/home/claude/w/moon/sfx.wav')
print('ok')
