import sys;sys.path.insert(0,'/home/claude/historywithinseconds-videos/toolkit/scripts')
from sfxlib import *
D=73.6;m=Mix(D,47);t=m.t;nz=m.noise()
# music: pastoral-but-uneasy farm (major-ish, light) -> mystery (minor, pulse) -> science tension -> reveal -> wry end
m.pad(0,7.4,[98,146.8,196,246.9],.05,1.0,.8,trem=.15)
m.pulse(2.6,7.3,98,84,.03)
m.pad(7.4,20.85,[87.3,130.8,174.6,207.7],.055,.6,.6,trem=.2)
m.pulse(10.3,20.8,87.3,90,.035)
m.pad(20.85,30.4,[92.5,138.6,185,220],.055,.5,.5,trem=.25)
m.pulse(20.85,30.3,92.5,100,.04)
m.pad(30.4,47.25,[82.4,123.5,164.8,196],.065,.5,.4,trem=.3)
m.pulse(34.2,47.1,82.4,108,.05,rise=True)
m.riser(43.5,47.3,.18)
m.pad(47.25,60.8,[73.4,110,146.8,174.6],.065,.3,.6,trem=.3)
m.pulse(51.0,60.7,73.4,112,.045)
m.pad(60.8,65.7,[98,146.8,196,246.9],.05,.6,1.0)
m.pad(65.7,73.6,[98,146.8,196,293.7],.045,.8,2.5)
cuts=[2.6,5.8,7.4,10.3,13.0,15.25,20.85,25.5,30.4,32.4,34.2,37.5,39.2,44.2,47.25,51.0,56.05,60.8,65.7]
for tt in cuts:m.whoosh(tt-.15,.5,.08)
m.whoosh(0,1.8,.3);m.ding(1.7,784,.14);m.ding(1.7,1175,.05)
# farm ambience: birdsong chirps + soft wind
wind=m.flt(nz,200,1200)*(1+.4*np.sin(2*np.pi*.12*t))
farm=m.env(2.6,30.4,.4,.4)+m.env(32.4,34.2,.2,.2)+m.env(37.5,39.2,.2,.2)+m.env(44.2,60.8,.3,.4)
m.sfx+=wind*farm*.015
for k in range(18):
    tt=3.0+k*1.6+(k%3)*.3
    if tt<30:m.ding(tt,2600+(k%4)*300,.015,.12);m.ding(tt+.1,3100+(k%3)*200,.012,.1)
# flakes landing: soft wet pats
r=np.random.default_rng(3)
for k in range(40):
    tt=5.9+k*.18+r.random()*.1
    if tt<13:m.put(m.sfx,tt,m.flt(r.standard_normal(int(.05*sr)),300,2500)*np.hanning(int(.05*sr))*.05)
# fire crackle at the kettle
for k in range(30):m.click(10.3+k*.09+r.random()*.05,.04)
# size counter
m.counter(13.9,14.6,2,.18);m.thud(13.8,.4)
# strip reveal: rising chord
m.ding(16.0,392,.06,3);m.ding(16.4,494,.05,3)
# footsteps of the men
for k in range(9):m.click(21.0+k*.34,.04)
# taste: a crunch-less "hmm" chime, then two pops for the exhibits
m.ding(26.0,330,.06,1.2)
m.ding(27.85,659,.09,1.2);m.ding(27.9,988,.04,1.2)
m.ding(29.2,587,.09,1.2);m.ding(29.25,880,.04,1.2)
# newspaper: rustle + press thud
for k in range(3):m.put(m.sfx,30.5+k*.2,m.flt(m.rng.standard_normal(int(.15*sr)),2000,7000)*np.hanning(int(.15*sr))*.05)
m.thud(31.3,.5)
for k in range(8):m.click(32.5+k*.3,.04)
# water drops on the algae
for k in range(4):m.ding(34.9+k*.85,1400,.04,.15)
# no rain: bright shimmer
m.ding(37.6,1047,.05,1.5);m.ding(37.6,1568,.03,1.5)
# microscope: focus clicks + three reveals
for k in range(4):m.click(39.6+k*.25,.08)
for tt,f in((41.2,440),(42.3,494),(43.2,523)):m.ding(tt,f,.08,.8)
m.boom(44.25,.25,1.2,50)
# who? wind gust
m.whoosh(45.9,1.2,.12)
# vultures: wing flaps + low hit at the reveal
for k in range(10):m.put(m.sfx,47.6+k*.35,m.flt(r.standard_normal(int(.12*sr)),150,900)*np.hanning(int(.12*sr))*.07)
m.boom(49.85,.5,2.0,45);m.ding(49.9,220,.08,2.5)
# startled: shout-like blip, splat-ish drop, big flaps on take-off
m.whoosh(51.4,.4,.1)
for k in range(5):m.put(m.sfx,52.3+k*.07,m.flt(r.standard_normal(int(.05*sr)),200,1500)*np.hanning(int(.05*sr))*.05)
for k in range(8):m.put(m.sfx,53.3+k*.22,m.flt(r.standard_normal(int(.14*sr)),120,800)*np.hanning(int(.14*sr))*.1)
# flock rain of flakes
for k in range(60):
    tt=56.2+k*.075+r.random()*.05
    m.put(m.sfx,tt,m.flt(r.standard_normal(int(.04*sr)),300,2500)*np.hanning(int(.04*sr))*.035)
# jar: glass ting
m.ding(61.0,1760,.06,1.5);m.ding(61.05,2637,.03,1.5)
for tt in(7.45,20.9,39.25,47.3):m.thud(tt,.7)
for tt in(2.7,30.5,60.9):m.tick(tt,.15)
m.ding(65.9,440,.06,2);m.ding(70.95,660,.06,2);m.ding(70.95,990,.03,2)
m.save('/home/claude/w/meat/music.wav','/home/claude/w/meat/sfx.wav')
print('ok')
