import sys;sys.path.insert(0,'/home/claude/historywithinseconds-videos/toolkit/scripts')
from sfxlib import *
D=78.6;m=Mix(D,59);t=m.t;nz=m.noise()
# music: pastoral-uneasy -> explanation -> rising standoff -> release -> warm resolution
m.pad(0,9.55,[73.4,110,146.8,220],.06,1.0,.8,trem=.2)
m.pulse(2.9,9.5,73.4,84,.04)
m.pad(9.55,23.4,[65.4,98,130.8,196],.06,.8,.8,trem=.25)
m.pad(23.4,32.85,[58.3,87.3,116.5,174.6],.06,.6,.6,trem=.3)
m.pulse(28.8,32.8,58.3,96,.04)
m.pad(32.85,48.8,[55,82.4,110,164.8],.07,.4,.3,trem=.35)
m.pulse(32.85,48.7,55,104,.06,rise=True)
m.riser(44.6,48.8,.2)
m.pad(48.9,60.4,[65.4,98,130.8,164.8,196],.065,.3,1.2)
m.pad(60.4,70.2,[73.4,110,146.8,185,220],.06,.8,1.2)
m.pad(70.2,78.6,[65.4,98,130.8,196],.035,.8,2.5)
cuts=[2.9,5.9,9.55,14.25,16.0,18.0,23.4,26.4,28.8,30.35,32.85,36.9,39.05,42.9,46.55,48.85,51.55,55.7,60.4,64.45,66.85,70.2]
for tt in cuts:m.whoosh(tt-.15,.5,.1)
m.whoosh(0,1.4,.3);m.ding(1.5,880,.14);m.ding(1.5,1320,.05)
# farm ambience: birds chirps + breeze
br=m.flt(nz,300,1800)*(1+.5*np.sin(2*np.pi*.2*t))
m.sfx+=br*(m.env(2.9,5.9,.3,.3)+m.env(28.8,32.85,.3,.3)+m.env(66.85,70.2,.3,.3))*.025
for k in range(7):
    tt=3.0+k*.33;L=int(.08*sr);n=np.arange(L)/sr;m.put(m.sfx,tt,np.sin(2*np.pi*np.cumsum(2600+900*np.sin(n*90))/sr)*np.exp(-n/.04)*.03)
# pig grunts (low filtered noise bursts) before the shot
for tt in(3.05,3.5,3.85):m.put(m.sfx,tt,m.flt(m.rng.standard_normal(int(.18*sr)),90,500)*np.hanning(int(.18*sr))*.12)
# the shot: crack + boom + echo, birds scatter
L=int(.05*sr);m.put(m.sfx,4.02,m.rng.standard_normal(L)*np.exp(-np.arange(L)/sr/.01)*.7)
m.boom(4.02,.7,.5,90);m.boom(4.35,.18,.8,70)
for k in range(10):m.click(4.15+k*.06,.06)
# map: soft wind-like tones, treaty paper, line drawing rise
m.sfx+=m.flt(nz,2500,7000)*m.env(14.3,14.9,.05,.3)*.03
L=int(1.9*sr);n=np.arange(L)/sr;m.put(m.sfx,16.1,np.sin(2*np.pi*np.cumsum(300+500*n/1.9)/sr)*np.minimum(1,n*3)*np.exp(-n/2.5)*.05)
m.ding(17.9,660,.08);m.ding(18.1,740,.06);m.ding(18.6,587,.06)
m.ding(21.45,523,.08,.8);m.ding(21.7,659,.08,.8)
# plinth reveals
m.ding(23.5,392,.08,2);m.ding(26.5,523,.07,1.5)
# coins
for k in range(3):m.ding(29.0+k*.09,2400+k*300,.05,.25)
# marching boots + oars
for k in range(12):m.thud(33.0+k*.32,.09);m.click(33.02+k*.32,.03)
waves=m.flt(nz,150,900)*(1+.6*np.sin(2*np.pi*.18*t))
m.sfx+=waves*(m.env(32.85,46.55,.4,.4)*.6+m.env(51.55,55.7,.3,.3)*.5)*.04
# ship creak + cannon roll
m.put(m.sfx,37.2,m.flt(m.rng.standard_normal(int(.7*sr)),200,900)*np.hanning(int(.7*sr))*.05)
m.boom(37.5,.25,1.2,40)
# counters
m.counter(40.4,41.9,30,.18);m.counter(42.2,42.8,14,.18);m.counter(43.3,44.1,5,.2)
for tt in(44.25,44.9,45.5):m.boom(tt,.18,.6,50)
# fuse hiss + heartbeat
m.sfx+=m.flt(nz,3000,8000)*m.env(46.6,48.8,.1,.1)*(.6+.4*np.sin(2*np.pi*9*t))*.03
for k in range(3):m.thud(46.8+k*.7,.35);m.thud(47.05+k*.7,.22)
# release
m.ding(48.95,330,.1,2.5);m.ding(48.95,494,.06,2.5)
# kaiser decision: gavel-like double thud
m.thud(64.15,.6);m.thud(64.45,.8);m.ding(64.6,523,.08,1.5);m.ding(64.6,784,.05,1.5)
# casualty counter + sting
m.counter(68.4,68.9,1,.25);m.ding(69.0,262,.12,2.5);m.ding(69.0,392,.06,2.5)
for tt in(9.6,32.9,48.9):m.thud(tt,.7)
for tt in(3.0,14.3,23.4,32.9,39.1,55.8,60.5):m.tick(tt,.15)
m.ding(70.5,440,.06,2);m.ding(76.45,660,.06,2);m.ding(76.45,990,.03,2)
m.save('/home/claude/w/pig/music.wav','/home/claude/w/pig/sfx.wav')
print('ok')
