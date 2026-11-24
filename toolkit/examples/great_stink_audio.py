import sys;sys.path.insert(0,'/home/claude/historywithinseconds-videos/toolkit/scripts')
from sfxlib import *
D=74.5;m=Mix(D,31);t=m.t;nz=m.noise()
m.pad(0,13.7,[55,82.4,110,138.6],.07,1.0,1.2,trem=.2)
m.riser(11.5,13.8,.14)
m.pad(13.7,26.4,[58.3,87.3,116.5,174.6],.07,1.0,1.0,trem=.3)
m.pulse(13.7,26.3,58.3,80,.055,rise=True)
m.pad(26.4,32.6,[49,73.4,98,146.8],.07,1.0,1.0)
m.riser(30.5,32.7,.16)
m.pad(32.6,42.3,[46.2,69.3,92.5,138.6],.075,.4,1.0,trem=.4)
m.pad(42.3,48.25,[55,82.4,110,164.8],.07,.6,1.0)
m.pulse(42.3,48.2,55,96,.06,rise=True)
m.riser(46.3,48.35,.16)
m.pad(48.25,59.7,[65.4,98,130.8,196],.07,.6,1.0,trem=.25)
m.pulse(51.9,59.6,65.4,104,.065,rise=True)
m.pad(59.7,65.7,[61.7,92.5,123.5,185],.07,.8,1.2)
m.pad(65.7,74.5,[49,73.4,98,146.8],.03,.8,2.5)
for tt in(2.4,6.15,9.05,11.65,13.7,18.6,22.3,26.4,28.9,32.6,38.9,42.3,48.25,51.9,54.9,57.35,59.7,62.8,65.7):m.whoosh(tt-.15,.5,.12)
m.whoosh(0,1.4,.35);m.ding(1.05,880,.15);m.ding(1.05,1320,.06)
# river lapping + flies + crowd
lap=m.flt(nz,150,900)*(1+.5*np.sin(2*np.pi*.6*t))
m.sfx+=lap*(m.env(2.4,6.15,.3,.3)+m.env(9.05,26.4,.3,.3)*.8+m.env(59.7,62.8,.3,.3))*.035
buzz=np.sin(2*np.pi*(190+12*np.sin(2*np.pi*5*t))*t)*(.5+.5*np.sin(2*np.pi*.7*t))
m.sfx+=buzz*(m.env(18.6,26.4,.5,.5))*.012
murm=m.flt(nz,250,900)*(1+.4*np.sin(2*np.pi*.9*t))
m.sfx+=murm*(m.env(6.15,9.05,.3,.3)+m.env(28.9,32.6,.3,.3)*.6)*.045
for k in range(16):m.thud(6.3+k*.18,.06)
# pipes gush
gush=m.flt(nz,200,2500)
m.sfx+=gush*m.env(9.05,13.7,.2,.3)*.05
# seals & ribbon
for tt in(13.75,32.65,48.3):m.thud(tt,.7)
for tt in(13.75,42.5,51.95,62.85):m.tick(tt,.15)
m.counter(6.45,8.55,38,.2);m.counter(15.5,17.7,30,.2);m.counter(43.9,45.7,18,.22);m.counter(52.1,54.1,38,.2)
# heat shimmer tone
m.pad(13.7,18.6,[1760,2217],.006,1,1,trem=3)
# disgust sting at Great Stink
m.boom(23.6,.4,.6,70)
# drips in chamber
for k in range(12):m.click(29.0+k*.3,.08)
m.boom(39.05,.4,.6,60)
m.thud(45.75,.6)
m.ding(48.6,587,.12,1.5)
# tunnel: echoey trowel taps
for k in range(14):m.click(52.0+k*.2,.12);
m.sfx+=m.flt(nz,40,300)*m.env(51.9,57.35,.4,.3)*.08
m.whoosh(57.4,2.0,.25)
# today: traffic hum + flowing water below
m.sfx+=m.flt(nz,80,700)*m.env(62.8,65.7,.3,.3)*.04
m.ding(65.95,440,.06,2);m.ding(71.15,660,.06,2);m.ding(71.15,990,.03,2)
m.save('/home/claude/w/stk/music.wav','/home/claude/w/stk/sfx.wav')
print('ok')
