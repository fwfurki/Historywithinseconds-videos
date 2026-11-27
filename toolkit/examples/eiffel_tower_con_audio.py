import sys;sys.path.insert(0,'/home/claude/historywithinseconds-videos/toolkit/scripts')
from sfxlib import *
D=74.0;m=Mix(D,91);t=m.t;nz=m.noise()
# music: sly, swinging con-man feel (minor, light pulse) -> sale (tension) -> twist -> wistful end
m.pad(0,7.8,[65.4,98,130.8,155.6],.06,1.0,.8,trem=.2)
m.pulse(1.6,7.8,65.4,92,.04)
m.pad(7.8,21.6,[61.7,92.5,123.5,146.8],.055,.6,.6,trem=.25)
m.pulse(7.8,21.5,61.7,96,.035)
m.pad(21.6,44.2,[55,82.4,110,130.8],.065,.5,.4,trem=.3)
m.pulse(21.6,44.0,55,104,.05,rise=True)
m.riser(40.5,44.2,.18)
m.pad(44.2,58.95,[58.3,87.3,116.5,138.6],.065,.3,.6,trem=.3)
m.pulse(51.0,58.9,58.3,112,.05,rise=True)
m.pad(58.95,66.4,[49,73.4,98,116.5],.06,.5,1.2)
m.pad(66.4,74.0,[65.4,98,130.8,196],.045,.8,2.5)
cuts=[1.6,4.5,7.8,12.6,17.2,21.6,24.4,28.4,32.6,34.8,38.55,41.15,44.2,47.5,50.85,54.75,56.95,58.95,63.45,66.4]
for tt in cuts:m.whoosh(tt-.15,.5,.09)
m.whoosh(0,1.4,.3);m.ding(1.3,784,.14);m.ding(1.3,1175,.05)
# "SOLD" stamp
m.thud(2.45,.8);m.ding(2.5,523,.08,1.2)
# city ambience (distant traffic hum + chatter-like noise)
city=m.flt(nz,150,900)*(1+.3*np.sin(2*np.pi*.15*t))
m.sfx+=city*(m.env(1.6,7.8,.3,.3)+m.env(12.6,21.6,.3,.3)+m.env(24.4,28.4,.3,.3)+m.env(47.5,58.95,.3,.3)+m.env(63.45,66.4,.3,.3))*.02
# footsteps of walking dealers / Lustig
for k in range(10):m.click(4.7+k*.33,.03)
for k in range(10):m.click(24.6+k*.36,.035)
for k in range(10):m.click(51.0+k*.36,.04)
# spotlight hums on stage
m.ding(8.0,392,.06,2.5);m.ding(35.0,349,.06,2.5)
# newspaper rustle
for k in range(3):m.put(m.sfx,12.8+k*.25,m.flt(m.rng.standard_normal(int(.15*sr)),2000,7000)*np.hanning(int(.15*sr))*.05)
# fair: crowd murmur + distant band chord
m.sfx+=m.flt(nz,300,2500)*m.env(17.2,21.6,.3,.3)*.02
m.ding(17.4,523,.05,1.5);m.ding(17.4,659,.04,1.5);m.ding(17.4,784,.03,1.5)
# official stamp
m.thud(22.75,.9);m.click(22.77,.12)
# letters fly (paper whooshes)
for k in range(5):m.whoosh(24.6+k*.35,.3,.04)
# counter for 7000 tons
m.counter(29.0,30.8,40,.18)
# hush: low drone hit
m.boom(32.7,.25,1.5,45)
# money: rustle + coin-like glint
for k in range(3):m.put(m.sfx,41.8+k*.2,m.flt(m.rng.standard_normal(int(.12*sr)),2500,7000)*np.hanning(int(.12*sr))*.05)
m.ding(42.6,2093,.04,.5);m.ding(42.75,2637,.03,.5)
# train: whistle + chugging
L=int(.9*sr);n=np.arange(L)/sr;m.put(m.sfx,44.35,(np.sin(2*np.pi*740*n)+.6*np.sin(2*np.pi*932*n))*np.minimum(1,n*8)*np.exp(-n/.7)*.05)
for k in range(14):m.put(m.sfx,44.6+k*max(.12,.36-k*.018),m.flt(m.rng.standard_normal(int(.1*sr)),100,1200)*np.hanning(int(.1*sr))*.09)
# shame: single low note
m.ding(48.7,196,.08,2.5)
# police: whistle-like blip, ship horn
L=int(.35*sr);n=np.arange(L)/sr;m.put(m.sfx,55.1,np.sin(2*np.pi*2400*n+3*np.sin(2*np.pi*30*n))*np.hanning(L)*.04)
L=int(1.4*sr);n=np.arange(L)/sr;m.put(m.sfx,57.1,(np.sin(2*np.pi*110*n)+.5*np.sin(2*np.pi*165*n))*np.minimum(1,n*5)*np.exp(-n/1.5)*.09)
waves=m.flt(nz,150,900)*(1+.6*np.sin(2*np.pi*.18*t))
m.sfx+=waves*(m.env(56.95,63.45,.4,.4))*.04
# Alcatraz: gull-ish chirps + low bell
for k in range(3):m.ding(59.5+k*1.1,1400+k*150,.02,.2)
m.ding(60.0,147,.08,3)
# still standing: warm chord
m.ding(64.7,262,.1,3);m.ding(64.7,392,.07,3);m.ding(64.7,523,.05,3)
for tt in(7.85,21.65,47.55):m.thud(tt,.7)
for tt in(1.7,17.3,21.7,51.0,59.1):m.tick(tt,.15)
m.ding(66.8,440,.06,2);m.ding(71.85,660,.06,2);m.ding(71.85,990,.03,2)
m.save('/home/claude/w/lustig/music.wav','/home/claude/w/lustig/sfx.wav')
print('ok')
