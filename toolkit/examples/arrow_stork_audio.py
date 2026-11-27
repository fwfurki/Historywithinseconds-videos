import sys;sys.path.insert(0,'/home/claude/historywithinseconds-videos/toolkit/scripts')
from sfxlib import *
D=74.6;m=Mix(D,73);t=m.t;nz=m.noise()
# music: curious/wondering (D major-ish) -> myths (lighter, playful) -> clue (tension) -> answer (warm release)
m.pad(0,9.0,[73.4,110,146.8,220],.06,1.0,.8,trem=.15)
m.pulse(1.6,9.0,73.4,80,.035)
m.pad(9.0,25.9,[65.4,98,130.8,164.8,196],.055,.8,.8,trem=.25)
m.pulse(13.75,25.9,65.4,88,.03)
m.pad(25.9,43.55,[61.7,92.5,123.5,185],.065,.5,.4,trem=.3)
m.pulse(25.9,43.4,61.7,100,.05,rise=True)
m.riser(40.0,43.6,.18)
m.pad(43.55,60.65,[73.4,110,146.8,185,220],.065,.3,1.2)
m.pad(60.65,74.6,[65.4,98,130.8,196],.045,.8,2.5)
cuts=[1.6,5.1,9.0,13.75,17.6,21.6,25.9,28.1,30.35,34.1,35.8,37.65,43.55,46.55,49.85,52.4,57.0,60.65,66.4]
for tt in cuts:m.whoosh(tt-.15,.5,.09)
m.whoosh(0,1.4,.3);m.ding(1.3,880,.14);m.ding(1.3,1320,.05)
# wing beats on landing + nest creak
for k in range(7):m.put(m.sfx,1.8+k*.32,m.flt(m.rng.standard_normal(int(.12*sr)),200,1200)*np.hanning(int(.12*sr))*.10)
m.thud(3.95,.35)
# village birdsong/breeze
br=m.flt(nz,300,1800)*(1+.5*np.sin(2*np.pi*.2*t))
m.sfx+=br*(m.env(1.6,13.75,.3,.3)+m.env(25.9,30.35,.3,.3)+m.env(46.55,52.4,.3,.3)+m.env(60.65,66.4,.3,.3))*.022
for k in range(9):
    tt=2.2+k*.41;L=int(.08*sr);n=np.arange(L)/sr;m.put(m.sfx,tt,np.sin(2*np.pi*np.cumsum(2700+900*np.sin(n*90))/sr)*np.exp(-n/.04)*.025)
# flock departs: many wingbeats
for k in range(22):m.put(m.sfx,9.2+k*.17,m.flt(m.rng.standard_normal(int(.09*sr)),250,1500)*np.hanning(int(.09*sr))*.06)
# Aristotle morph sparkle
for k in range(6):m.ding(15.2+k*.12,1800+k*220,.03,.4)
# lake: ice creak + bubbles
m.put(m.sfx,17.8,m.flt(m.rng.standard_normal(int(.6*sr)),120,700)*np.hanning(int(.6*sr))*.06)
for k in range(10):m.ding(18.2+k*.33,900+(k*137)%500,.02,.12)
# moon: airy shimmer
m.sfx+=m.flt(nz,3000,8000)*m.env(21.6,25.9,.5,.5)*.012
m.ding(22.0,523,.06,2);m.ding(22.0,784,.04,2)
# hunter: distant crack (soft), birds scatter
L=int(.04*sr);m.put(m.sfx,28.15,m.rng.standard_normal(L)*np.exp(-np.arange(L)/sr/.01)*.35);m.boom(28.15,.35,.6,90)
for k in range(6):m.click(28.3+k*.07,.04)
# spear/arm
m.ding(32.8,392,.07,1.2)
# exam: two reveal stings
m.ding(34.4,659,.08,1.4);m.ding(36.0,523,.1,1.8);m.ding(36.0,784,.06,1.8)
# route drawing rise + counter
L=int(4.0*sr);n=np.arange(L)/sr;m.put(m.sfx,38.05,np.sin(2*np.pi*np.cumsum(220+440*n/4)/sr)*np.minimum(1,n*3)*np.exp(-n/5)*.04)
m.counter(42.05,43.05,30,.18)
# answer: warm chord + soaring wind
m.ding(43.65,294,.1,3);m.ding(43.65,440,.07,3);m.ding(43.65,587,.05,3)
m.sfx+=m.flt(nz,400,2500)*m.env(43.55,46.55,.4,.4)*.03
# winter wind, then savanna insects + frog croaks
m.sfx+=m.flt(nz,500,3000)*(1+.6*np.sin(2*np.pi*.3*t))*m.env(46.55,49.85,.3,.3)*.035
m.sfx+=m.flt(nz,4000,7000)*(.6+.4*np.sin(2*np.pi*14*t))*m.env(49.85,52.4,.2,.3)*.015
for k in range(4):m.put(m.sfx,50.1+k*.55,np.sin(2*np.pi*np.cumsum(180+60*np.sin(np.arange(int(.18*sr))/sr*60))/sr)*np.hanning(int(.18*sr))*.07)
# museum reveals
m.ding(52.6,392,.08,2);m.ding(57.2,523,.08,2);m.ding(57.2,659,.05,2)
m.counter(62.25,64.25,25,.2)
for tt in(9.05,25.95,43.6):m.thud(tt,.7)
for tt in(1.7,13.8,21.7,26.0,52.5):m.tick(tt,.15)
m.ding(66.8,440,.06,2);m.ding(72.45,660,.06,2);m.ding(72.45,990,.03,2)
m.save('/home/claude/w/stork/music.wav','/home/claude/w/stork/sfx.wav')
print('ok')
