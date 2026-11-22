import sys;sys.path.insert(0,'/home/claude/w/tools')
from sfxlib import *
D=78.4;m=Mix(D,11);t=m.t;nz=m.noise()
A=55.0 # A1
# music: drone + pads; build 17-32, eruption hit, sparse aftermath, outro chord
m.pad(0,32.4,[A,A*1.5,A*2],.10,2,1)
m.pad(6.3,17.6,[110,130.8,164.8],.05,2,2)            # Am calm
m.pad(17.6,32.2,[103.8,123.5,155.6],.06,2,1)          # tension
m.pulse(17.6,32.0,55,72,.10,rise=True)
m.riser(29.5,32.3,.22)
m.pad(32.5,50,[A*.75,A,A*1.5],.10,1.5,3,trem=.3)      # dark
m.pad(50.1,60,[110,130.8,174.6],.05,2.5,2)            # F/Am sorrow
m.pad(60.1,67.5,[98,116.5,146.8],.06,1,1.5)
m.pulse(60.2,67.3,49,80,.08)
m.pad(67.5,78.4,[110,130.8,164.8,220],.06,2,2.5)
# sfx
m.whoosh(0,1.6,.4);m.ding(1.35,880,.18);m.ding(1.35,1320,.08)
m.boom(2.6,.35,.8,50)
for tt in(6.35,32.15,60.15):m.thud(tt,.7)
for tt in(6.45,50.2,61.3,67.6):m.tick(tt,.15);m.whoosh(tt,.6,.18)
# bubbles in cutaways
for (a,b) in((17.6,27.3),(70.8,73.8)):
    k=0
    while a+k*.11<b:
        tt=a+k*.11+m.rng.random()*.08;L=int(.06*sr);n=np.arange(L)/sr;f=500+m.rng.random()*900;m.put(m.sfx,tt,np.sin(2*np.pi*f*n*(1+n*8))*np.exp(-n/.015)*.10);k+=1
    m.sfx+=m.flt(nz,100,600)*m.env(a,b,.6,.6)*.05
# night crickets 27.3-50
cr=np.sin(2*np.pi*4200*t)*(np.sin(2*np.pi*18*t)>.6)*(np.sin(2*np.pi*.7*t)>0)*.012;m.sfx+=cr*m.env(27.3,50,1,1)
m.sfx+=m.flt(nz,0,140)*m.env(28.3,32,1,.8)*(1+.6*np.sin(2*np.pi*1.3*t))*.5   # distant thunder rumble
m.boom(32.45,1.0,1.6,45);m.sfx+=m.flt(nz,200,2200)*m.env(32.5,37.6,.3,1.2)*.28  # eruption + water roar
m.sfx+=m.flt(nz,80,500)*m.env(37.5,47,1.2,1.5)*.22                             # cloud hiss/wind
m.thud(47.6,.35);m.thud(48.4,.3)
m.sfx+=m.flt(nz,200,900)*m.env(50.1,60,1.5,1.5)*.035                           # empty wind
m.counter(51.0,53.7,40,.2)
for tt in(56.7,57.85,59.0):m.thud(tt,.4)
m.counter(62.5,64.5,37,.2)
m.sfx+=m.flt(nz,400,3000)*m.env(67.6,70.8,.3,.5)*.12                           # degassing fountain
m.ding(73.85,440,.12,2);m.ding(76.75,660,.14,2);m.ding(76.75,990,.06,2)
m.save('/home/claude/w/nyos/music.wav','/home/claude/w/nyos/sfx.wav')
print('ok')
