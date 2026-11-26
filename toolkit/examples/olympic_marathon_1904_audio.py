import sys;sys.path.insert(0,'/home/claude/historywithinseconds-videos/toolkit/scripts')
from sfxlib import *
D=74.8;m=Mix(D,71);t=m.t;nz=m.noise()
# music: ragtime-ish bouncy pulse (period feel) that sours as the race falls apart
m.pad(0,7.65,[61.7,92.5,123.5,185],.06,.8,.6,trem=.2)
m.pulse(2.4,7.6,61.7,96,.04)
m.pad(7.65,24.75,[65.4,98,130.8,196],.06,.4,.6,trem=.25)
m.pulse(11.0,24.7,65.4,128,.05)
m.pad(24.75,41.85,[58.3,87.3,116.5,174.6],.06,.5,.6,trem=.3)
m.pulse(24.75,41.8,58.3,120,.045)
m.pad(41.85,49.85,[69.3,103.8,138.6,207.7],.065,.4,.4,trem=.35)
m.pulse(44.1,48.0,69.3,140,.05)
m.pad(49.85,61.25,[55,82.4,110,155.6],.07,.4,.6,trem=.4)
m.pulse(49.85,61.2,55,72,.06,rise=True)
m.riser(57.3,59.0,.15)
m.pad(61.25,66.2,[65.4,98,130.8,196,246.9],.06,.3,1.0)
m.pad(66.2,74.8,[61.7,92.5,123.5,185],.035,.8,2.5)
cuts=[2.4,5.45,7.65,9.85,11.75,17.25,21.85,24.75,27.3,29.75,32.25,35.8,38.3,41.85,44.15,48.05,49.85,53.5,58.95,61.25,63.2,66.2]
for tt in cuts:m.whoosh(tt-.15,.5,.1)
m.whoosh(0,1.4,.3);m.ding(1.2,880,.14);m.ding(1.2,1320,.05)
# hook sting
m.ding(3.3,233,.1,2.0);m.ding(3.3,349,.06,2.0)
# crowd murmur/cheer
crowd=m.flt(nz,300,2500)*(1+.3*np.sin(2*np.pi*1.3*t))
m.sfx+=crowd*(m.env(5.45,11.75,.4,.4)*.5+m.env(44.15,48.05,.3,.3)*1.4+m.env(58.95,61.25,.3,.3)*1.0)*.05
# starter pistol
L=int(.05*sr);m.put(m.sfx,7.65+3.3,m.rng.standard_normal(L)*np.exp(-np.arange(L)/sr/.01)*.6);m.boom(10.95,.4,.5,90)
# heat counter
m.counter(10.35,11.0,9,.18)
# road: footsteps + engine putter + dust hiss
for k in range(40):m.click(11.8+k*.135,.03)
eng=np.sign(np.sin(2*np.pi*14*t))*m.flt(nz,80,600)
m.sfx+=eng*(m.env(11.75,17.25,.3,.3)*.5+m.env(26.0,29.75,.3,.3)*.5+m.env(53.5,58.95,.3,.3)*.4)*.03
m.sfx+=m.flt(nz,1500,6000)*m.env(13.0,17.25,.4,.4)*.02
m.counter(12.2,13.0,32,.16)
# map
L=int(2.4*sr);n=np.arange(L)/sr;m.put(m.sfx,17.35,np.sin(2*np.pi*np.cumsum(250+350*n/2.4)/sr)*np.minimum(1,n*3)*np.exp(-n/3)*.04)
m.ding(19.6,1046,.1,1.0);m.ding(19.75,1318,.06,1.0)
# well bucket splash
m.put(m.sfx,22.6,m.flt(m.rng.standard_normal(int(.4*sr)),400,3000)*np.exp(-np.arange(int(.4*sr))/sr/.1)*.08)
# cramp: groan-ish low + car horn (two-tone)
for tt,f in((27.5,330),(27.75,262)):
    L=int(.22*sr);n=np.arange(L)/sr;m.put(m.sfx,tt,np.sign(np.sin(2*np.pi*f*n))*np.minimum(1,n*40)*np.exp(-n/.2)*.04)
# plinth
m.ding(29.9,392,.08,2)
# apple crunch + snore
for k in range(3):m.put(m.sfx,35.0+k*.18,m.flt(m.rng.standard_normal(int(.07*sr)),1500,6000)*.12)
for k in range(2):
    L=int(.9*sr);n=np.arange(L)/sr;m.put(m.sfx,36.0+k*1.1,m.flt(m.rng.standard_normal(L),80,400)*np.sin(np.pi*n/.9)*.06)
m.ding(37.0,523,.08,1.0)
# dog barks
for tt in(38.5,38.9,39.6,40.4,41.0):
    L=int(.12*sr);n=np.arange(L)/sr;m.put(m.sfx,tt,m.flt(m.rng.standard_normal(L),300,1500)*np.exp(-n/.05)*.25)
# breakdown: bang + hiss
m.boom(41.95,.35,.4,70);m.sfx+=m.flt(nz,2000,8000)*m.env(42.0,44.1,.05,.6)*.03
# truth: record-stop style down-sweep
L=int(.5*sr);n=np.arange(L)/sr;m.put(m.sfx,48.1,np.sin(2*np.pi*np.cumsum(600-500*n/.5)/sr)*np.exp(-n/.3)*.06)
# heartbeat for Hicks
for k in range(8):m.thud(50.0+k*1.1,.3);m.thud(50.25+k*1.1,.18)
# gold sting, doctors counter
m.ding(61.35,523,.1,2.0);m.ding(61.35,784,.06,2.0);m.ding(61.35,1046,.03,2.0)
m.counter(63.8,64.6,4,.2)
for tt in(7.75,24.85,41.95):m.thud(tt,.7)
for tt in(7.8,17.4,24.8,41.9,44.2,49.9,59.0):m.tick(tt,.15)
m.ding(66.5,440,.06,2);m.ding(72.65,660,.06,2);m.ding(72.65,990,.03,2)
m.save('/home/claude/w/mara/music.wav','/home/claude/w/mara/sfx.wav')
print('ok')
