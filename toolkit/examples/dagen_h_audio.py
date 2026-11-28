import sys;sys.path.insert(0,'/home/claude/historywithinseconds-videos/toolkit/scripts')
from sfxlib import *
D=74.8;m=Mix(D,67);t=m.t;nz=m.noise()
# music: quiet dawn -> bright, bouncy 60s "civic campaign" feel -> tension (chaos) -> relief -> wry end
m.pad(0,8.75,[110,164.8,220,277.2],.05,1.2,.8,trem=.12)
m.pulse(3.3,8.7,55,70,.03)
m.pad(8.75,21.25,[98,146.8,196,246.9],.055,.6,.6,trem=.2)
m.pulse(8.75,21.2,98,96,.035)
m.pad(21.25,31.0,[87.3,130.8,174.6,220],.06,.5,.5,trem=.25)
m.pulse(24.4,30.9,87.3,104,.045,rise=True)
m.pad(31.0,53.1,[110,164.8,220,261.6],.055,.5,.5,trem=.2)
m.pulse(38.25,53.0,110,112,.04)
m.pad(53.1,55.35,[77.8,116.5,155.6,185],.07,.2,.3,trem=.4)
m.riser(52.0,55.35,.16)
m.pad(55.35,67.45,[98,146.8,196,246.9],.055,.4,.8,trem=.2)
m.pulse(62.1,67.4,98,118,.04)
m.pad(67.45,74.8,[110,164.8,220,329.6],.045,.8,2.5)
cuts=[3.3,5.3,8.75,14.1,16.25,21.25,24.4,28.0,31.0,34.25,36.45,38.25,40.8,44.75,48.5,50.7,53.1,55.35,57.95,62.1,67.45]
for tt in cuts:m.whoosh(tt-.15,.5,.08)
m.whoosh(0,2.2,.3);m.ding(2.2,784,.14);m.ding(2.2,1175,.05)
# dawn birds + town hum
town=m.flt(nz,150,900)*(1+.3*np.sin(2*np.pi*.15*t))
m.sfx+=town*(m.env(3.3,14.1,.4,.4)+m.env(16.25,21.25,.3,.3)+m.env(24.4,31.0,.3,.3)+m.env(40.8,48.5,.3,.3)+m.env(57.95,67.45,.3,.3))*.018
for k in range(6):m.ding(3.6+k*.8,2800+(k%3)*250,.014,.12)
# clock tick + chime at 4:50
for k in range(6):m.click(3.4+k*.33,.06)
m.ding(4.0,659,.08,1.5);m.ding(4.0,988,.04,1.5)
# brakes squeal (soft) and engines idling
L=int(.7*sr);n=np.arange(L)/sr
for tt in(6.6,7.0):m.put(m.sfx,tt,np.sin(2*np.pi*(1800+200*n)*n)*np.hanning(L)*.015)
m.sfx+=m.flt(nz,40,180)*(m.env(5.3,14.1,.4,.5))*.05
# H sign stamp + chord
m.ding(15.2,523,.08,2);m.ding(15.2,659,.06,2);m.ding(15.2,784,.05,2)
# lane swap ding
m.ding(19.5,880,.07,.8)
# map pins pop
for k in range(4):m.ding(21.6+k*.35,700+k*80,.06,.4)
# overtaking: horn blast of the oncoming car + whoosh
L=int(.6*sr);n=np.arange(L)/sr;m.put(m.sfx,29.4,(np.sign(np.sin(2*np.pi*392*n))*.5+np.sin(2*np.pi*494*n))*np.minimum(1,n*20)*np.exp(-n/.5)*.03)
m.whoosh(30.0,.6,.15)
# ballots drop
for k in range(4):m.put(m.sfx,32.5+k*.5,m.flt(m.rng.standard_normal(int(.08*sr)),1500,6000)*np.hanning(int(.08*sr))*.05)
m.counter(34.5,35.6,20,.18)
# gavel
m.thud(36.6,.8);m.click(36.62,.15);m.thud(37.3,.8);m.click(37.32,.15)
# paint roller hiss
m.sfx+=m.flt(nz,2000,6000)*m.env(38.4,40.7,.2,.2)*.01
# signs: clanks + counter
for k in range(3):m.ding(41.2+k*.45,1200-k*100,.05,.25)
m.counter(41.8,44.0,40,.18)
# bus doors (pneumatic hiss)
m.put(m.sfx,46.6,m.flt(m.rng.standard_normal(int(.5*sr)),1500,7000)*np.linspace(1,0,int(.5*sr))*.06)
# logo pops
m.ding(48.8,1047,.06,.6);m.ding(50.9,1175,.06,.6)
# chaos: car horns
for k in range(5):
    L=int(.25*sr);n=np.arange(L)/sr;m.put(m.sfx,53.3+k*.38,np.sign(np.sin(2*np.pi*(330+k*40)*n))*np.hanning(L)*.02)
# relief: bars fall, soft chime
m.whoosh(56.1,.8,.1,up=False);m.ding(56.9,523,.08,2)
m.counter(58.6,59.4,10,.12)
# back to normal: traffic swishes
for k in range(8):m.whoosh(62.4+k*.6,.35,.05)
for tt in(14.15,31.05,38.3,55.4):m.thud(tt,.7)
for tt in(3.4,31.1,36.5,38.4,55.4,62.3):m.tick(tt,.15)
m.ding(67.8,440,.06,2);m.ding(72.85,660,.06,2);m.ding(72.85,990,.03,2)
m.save('/home/claude/w/dagenh/music.wav','/home/claude/w/dagenh/sfx.wav')
print('ok')
