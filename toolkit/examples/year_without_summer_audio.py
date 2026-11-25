import sys;sys.path.insert(0,'/home/claude/historywithinseconds-videos/toolkit/scripts')
from sfxlib import *
D=80.5;m=Mix(D,47);t=m.t;nz=m.noise()
# music: cold, sparse open fifths -> tension -> eruption -> wonder -> haunting
m.pad(0,20.65,[55,82.4,110,164.8],.065,1.0,1.0,trem=.15)
m.pulse(8.7,19.2,55,72,.05,rise=True)
m.riser(17.4,19.3,.12)
m.pad(20.65,29.25,[46.2,69.3,92.5,138.6],.07,.6,.4,trem=.3)
m.pulse(25.05,29.2,46.2,96,.06,rise=True)
m.riser(27.3,29.25,.18)
m.pad(29.3,42.0,[41.2,61.7,82.4,123.5],.075,.2,1.0,trem=.2)
m.pad(42.0,52.7,[49,73.4,98,146.8,196],.065,.8,1.2,trem=.25)
m.pulse(42.0,48.4,49,84,.05)
m.pad(52.7,63.95,[43.7,65.4,87.3,130.8],.07,.6,.8,trem=.35)
m.riser(60.0,61.7,.12)
m.pad(63.95,72.35,[55,82.4,110,164.8,220],.065,.6,1.2)
m.pad(72.35,80.5,[49,73.4,98,146.8],.035,.8,2.5)
cuts=[2.25,7.55,8.7,11.75,14.4,16.8,19.2,20.65,25.05,30.35,33.55,35.7,42.0,48.5,52.7,57.15,58.55,61.65,63.95,68.1,72.35]
for tt in cuts:m.whoosh(tt-.15,.5,.11)
m.whoosh(0,1.4,.35);m.ding(1.05,880,.15);m.ding(1.05,1320,.06)
# cold wind over the farm scenes
wind=m.flt(nz,200,1400)*(1+.6*np.sin(2*np.pi*.23*t)*np.sin(2*np.pi*.07*t+1))
m.sfx+=wind*(m.env(2.25,11.75,.6,.4)+m.env(19.2,20.65,.2,.3)+m.env(48.5,52.7,.8,.4)*.7+m.env(63.95,68.1,.4,.4))*.05
# door creak + footsteps in snow
m.sfx+=m.flt(nz,500,1500)[:]*m.env(2.3,2.9,.05,.3)*.04
for k in range(6):m.thud(2.6+k*.38,.05);m.click(2.62+k*.38,.04)
# frost crackle
for k in range(26):m.click(8.9+k*.1+(k%3)*.02,.06)
# rain
rain=m.flt(nz,800,6000)
m.sfx+=rain*(m.env(11.75,14.4,.2,.3)+m.env(52.7,61.65,.4,.3)*.6)*.05
# market + crowd
murm=m.flt(nz,250,900)*(1+.4*np.sin(2*np.pi*.9*t))
m.sfx+=murm*(m.env(14.4,16.8,.3,.3)*.5+m.env(16.8,19.2,.2,.3)*1.2)*.06
for k in range(8):m.thud(16.9+k*.27,.07)
# globe spin
m.whoosh(20.8,2.6,.25);m.ding(24.0,660,.12);m.ding(24.0,990,.05)
# volcano: rumble build, then the eruption
rum=m.flt(nz,20,120)
m.sfx+=rum*(m.env(25.05,29.25,1.5,.1)*.6+m.env(29.25,42.0,.05,3.0)*1.0)*.25
m.boom(29.25,1.0,2.2,48);m.boom(29.35,.6,1.4,70)
for k in range(10):m.thud(29.6+k*.33,.12)
m.boom(30.4,.35,1.4,40)
# ash falling hiss
m.sfx+=m.flt(nz,2000,7000)*m.env(33.55,35.7,.3,.3)*.02
# plaque counter
m.counter(38.3,40.5,38,.2)
# space: soft shimmer as the veil spreads + photon pings
m.pad(42.0,48.5,[1318.5,1661.2],.005,1,1,trem=2)
for k in range(10):m.tick(45.0+k*.35,.06)
# cooling: descending tone with thermometer
L=int(1.5*sr);n=np.arange(L)/sr;m.put(m.sfx,48.6,np.sin(2*np.pi*np.cumsum(900-500*n/1.5)/sr)*np.exp(-n/1.2)*.08)
# thunder (villa lightning + book)
m.boom(54.25,.55,2.0,38);m.boom(62.8,.45,1.6,40)
# fire crackle + quill scratching
for k in range(30):m.click(57.2+k*.14+(k*7%5)*.02,.05)
scratch=m.flt(nz,2500,6000)*(.5+.5*np.sign(np.sin(2*np.pi*3.1*t)))
m.sfx+=scratch*m.env(58.6,61.5,.1,.2)*.015
# reveal sting at "Frankenstein" and title
m.ding(62.9,392,.12,2.0);m.ding(62.9,587,.06,2.0)
m.boom(64.0,.25,1.0,55)
# seals + ribbon ticks
for tt in(8.75,20.75,52.8):m.thud(tt,.7)
for tt in(2.4,23.45,48.6,52.8):m.tick(tt,.15)
m.ding(72.6,440,.06,2);m.ding(78.05,660,.06,2);m.ding(78.05,990,.03,2)
m.save('/home/claude/w/yws/music.wav','/home/claude/w/yws/sfx.wav')
print('ok')
