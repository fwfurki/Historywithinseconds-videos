
const WALLC=[[.85,.68,.45],[.72,.32,.22],[.88,.82,.7],[.8,.55,.35]];
const TERRA=[.62,.3,.18];
// street of roman houses: merged meshes by material
const ST=(()=>{const walls=[[],[],[],[]],roofs=[],ridges=[],dark=[],trim=[];const cols=[];
 for(const sd of[-1,1]){let z=12;let k=0;while(z>-70){const w=4+((k*37)%3),h=3+((k*13)%3)*.8,d=5;const x=sd*(3.2+d/2);const ci=(k+(sd>0?1:0))%4;
  walls[ci].push({p:[x,h/2,z-w/2],s:[d,h,w]});trim.push({p:[x-sd*(d/2+.02),.35,z-w/2],s:[.05,.7,w]});
  // pitched roof (ridge along z)
  for(const r of[-1,1]){roofs.push({p:[x+r*d/4,h+.45,z-w/2],r:[0,0,-r*.38],s:[d/2+.5,.12,w+.3]});}
  for(let t=0;t<w;t+=.35)ridges.push({p:[x,h+.92,z-t-.2],s:[.18,.1,.25]});
  dark.push({p:[x-sd*(d/2+.03),1.1,z-w/2],s:[.04,2.1,1.3]});if(k%2==0)dark.push({p:[x-sd*(d/2+.03),1.9,z-w/2+1.4],s:[.04,.5,.5]},{p:[x-sd*(d/2+.03),1.9,z-w/2-1.4],s:[.04,.5,.5]});
  if(k%3==1)cols.push([x-sd*(d/2+.7),z-w/2-1.2],[x-sd*(d/2+.7),z-w/2+1.2]);
  z-=w+.15;k++;}}
 const stones=[];for(let z=10;z>-70;z-=9)for(const x of[-.8,0,.8])stones.push({p:[x,.15,z],s:[.5,.3,.5]});
 const curbs=[{p:[-2.7,.12,-30],s:[1.1,.24,84]},{p:[2.7,.12,-30],s:[1.1,.24,84]}];
 const pave=[];for(let z=12;z>-70;z-=.9)for(let x=-2.0;x<2.1;x+=.9)pave.push({p:[x+((z*7)%1)*.2,.02,z],s:[.82,.06,.82]});
 return{walls:walls.map(merge),roof:merge(roofs),ridge:merge(ridges),dark:merge(dark),trim:merge(trim),stones:merge(stones),curb:merge(curbs),pave:merge(pave),cols};})();
function street(o){o=o||{};const ash=o.ash||0;const tint=c=>mix3(c,[.55,.53,.5],ash);
 draw(BOX,{p:[0,-.5,-30],s:[300,1,300],c:tint([.4,.36,.3])});draw(ST.pave,{c:tint([.42,.4,.38])});draw(ST.curb,{c:tint([.65,.62,.55])});draw(ST.stones,{c:tint([.6,.58,.52])});
 ST.walls.forEach((m,i)=>draw(m,{c:tint(WALLC[i])}));draw(ST.trim,{c:tint([.55,.15,.1])});if(!o.noroof){draw(ST.roof,{c:tint(TERRA)});draw(ST.ridge,{c:tint([.5,.22,.12])});}
 draw(ST.dark,{c:[.08,.06,.05],e:o.lamps?[.5,.3,.1]:[0,0,0]});
 ST.cols.forEach(([x,z])=>{draw(CYL,{p:[x,0,z],s:[.18,2.8,.18],c:tint([.92,.9,.85])});draw(BOX,{p:[x,2.85,z],s:[.5,.15,.5],c:tint([.92,.9,.85])});});}
function amphora(x,y,z,c){draw(SPH,{p:[x,y+.35,z],s:[.16,.3,.16],c:c||[.7,.38,.22]});draw(CYL,{p:[x,y+.6,z],s:[.05,.2,.05],c:c||[.7,.38,.22]});draw(CONE,{p:[x,y+.1,z],r:[Math.PI,0,0],s:[.06,.12,.06],c:c||[.7,.38,.22]});}
function bakery(P){draw(SPH,{P,p:[0,0,0],s:[1.1,.9,1.1],c:[.75,.5,.3]});draw(BOX,{P,p:[0,.45,1.02],s:[.5,.45,.1],c:[.1,.05,.03],e:[1.4,.6,.15]});
 for(const x of[-2,2]){draw(CONE,{P,p:[x,0,0],s:[.45,1,.45],c:[.55,.53,.5]});draw(CONE,{P,p:[x,1.9,0],r:[Math.PI,0,0],s:[.42,.9,.42],c:[.6,.58,.55]});}}
function tavern(P){draw(BOX,{P,p:[0,.5,0],s:[2.6,1,.6],c:[.9,.85,.75]});for(let i=0;i<3;i++)draw(CYL,{P,p:[-.8+i*.8,.85,0],s:[.2,.18,.2],c:[.5,.25,.15]});for(let i=0;i<4;i++)amphora(-1.2+i*.8,0,.7,undefined);}
function vesuvius(P,o){o=o||{};const g=o.ash?mix3([.36,.4,.24],[.4,.38,.36],o.ash):[.36,.4,.24];draw(CONE,{P,p:[0,0,0],s:[34,22,30],c:g});draw(CONE,{P,p:[-16,0,4],s:[22,13,18],c:mix3(g,[.3,.3,.2],.3)});
 draw(CYL,{P,p:[0,20.5,0],s:[3.4,1.6,3],c:[.3,.25,.22]});draw(CYL,{P,p:[0,21.9,0],s:[2.6,.25,2.3],c:[.12,.1,.1],e:o.glow?[o.glow*1.5,o.glow*.5,0]:[0,0,0]});
 for(let i=0;i<20;i++){const a=i*1.3,r=20+(i%4)*6;draw(SPH,{P,p:[Math.cos(a)*r,0,Math.sin(a)*r*.8],s:[5,2+(i%3),4],c:g});}}
function column(P,h,t,dark){const n=Math.floor(h*14);for(let i=0;i<n;i++){const y=22+i*2.2,r=2+i*.35+Math.sin(i*1.7+t)*.5;draw(SPH,{P,p:[Math.sin(i*2.3+t*.5)*1.2,y,Math.cos(i*1.9)*1.2],s:[r,r*.8,r],c:dark?[.22,.2,.2]:[.45,.42,.4],e:i<3?[.9,.35,.1]:[0,0,0]});}
 if(h>.8)for(let i=0;i<8;i++){const a=i/8*Math.PI*2;draw(SPH,{P,p:[Math.cos(a)*14,22+n*2.2,Math.sin(a)*14],s:[10,4,10],c:[.3,.28,.28]});}}
function caster(x,y,z,ry,curl){const P=xf([x,y,z],[0,ry,0]);const B=[.93,.91,.87];draw(SPH,{P,p:[0,.35,0],s:[.35,.3,.55],c:B});draw(SPH,{P,p:[0,.45,.55],s:[.15,.15,.15],c:B});
 draw(CYL,{P,p:[.15,.2,.2],r:[curl||1.2,0,.2],s:[.07,.55,.07],c:B});draw(CYL,{P,p:[-.15,.2,-.3],r:[-1.3,0,0],s:[.08,.6,.08],c:B});draw(CYL,{P,p:[.15,.15,-.35],r:[-1.6,.3,0],s:[.08,.6,.08],c:B});}
const DAYP={fog:[.78,.8,.84],fogD:.0035,sky:[.55,.6,.7],gnd:[.35,.32,.28],sunC:[.95,.85,.7],sunD:[-.4,.7,.5]};
// ---------- scenes ----------
const S=[[0,10.36,sA],[10.36,17.63,sB],[17.63,22.57,sC],[22.57,29.21,sD],[29.21,38.12,sE],[38.12,44.79,sF],[44.79,50.99,sG],[50.99,60.21,sH],[60.21,64.59,sI],[64.59,77,sJ]];
function sA(t){const er=ss(.6,3,t),bury=ss(2.4,4.6,t),grass=ss(6,9.5,t);env({...DAYP,eye:[40-t*1.5,18+t*.8,70-t*2],tgt:[0,6,-40],fov:50});
 const VP=xf([0,0,-130],[0,0,0]);vesuvius(VP,{ash:bury,glow:er*(1-grass)});if(t<7)column(VP,er*(1-ss(5,7,t)),t,0);
 street({ash:bury});draw(BOX,{p:[0,lerp(-2,4.6,bury),-30],s:[200,4,200],c:mix3([.55,.53,.5],[.35,.45,.25],grass)});
 label('79 AD',360,240,110,.1,2.0,t);label('A CITY BURIED',360,240,72,2.1,5.1,t,{color:'#ff6a3d'});label('LOST FOR 1,600+ YEARS',360,240,48,5.3,10.2,t,{color:'#8fd3ff'});}
function sB(t){env({...DAYP,eye:[1.6,1.7,10-t*1.3],tgt:[0,1.6,-12-t],fov:55});street();
 bakery(xf([-2.0,0,-6],[0,0,0]));tavern(xf([2.0,0,-13],[0,-Math.PI/2,0]));
 for(let i=0;i<9;i++){const z=-2-i*4+Math.sin(t+i)*1.5*(i%2?1:-1);man(xf([(i%3-1)*1.1,0,z],[0,i%2?0:Math.PI,0]),{coat:[[.85,.8,.7],[.7,.25,.2],[.4,.5,.6],[.8,.65,.4]][i%4],pants:[.85,.8,.7],hat:'none',sw:.4*Math.sin(t*5+i)});}
 label('POMPEII',360,240,96,.1,1.4,t,{color:'#ffcf5a'});label('A BUSY ROMAN TOWN',360,240,52,1.4,3.3,t);label('BAKERIES',360,240,72,3.35,4.2,t,{color:'#ffcf5a'});label('TAVERNS',360,240,72,4.25,5.3,t,{color:'#ffcf5a'});label('THOUSANDS OF PEOPLE',360,240,48,5.35,7.2,t);}
function sC(t){env({...DAYP,eye:[2,lerp(2,8,ss(0,3,t)),16],tgt:[0,lerp(3,12,ss(0,3,t)),-80],fov:50});street();vesuvius(xf([0,0,-130],[0,0,0]));for(let i=0;i<4;i++)man(xf([-1+i*.7,0,6-i],[0,Math.PI,0]),{coat:[.8,.75,.65],hat:'none'});
 label('MOUNT VESUVIUS',360,240,62,.1,2.7,t,{color:'#ffcf5a'});label('THEY THOUGHT IT WAS DEAD',360,240,42,2.8,4.9,t);}
const CR=[];for(let i=0;i<14;i++)CR.push([(i%2?1:-1)*3.25,.4+((i*7)%10)/10*2.5,-2-i*1.3,(i*3)%4*.4]);
function sD(t){const q=.12*Math.sin(t*40)*(.5+.5*Math.sin(t*3))*(t<6?1:0);env({...DAYP,eye:[1+q,1.6+q*.5,8],tgt:[q,1.5,-4],fov:55});street();
 CR.forEach((c,i)=>{const k=ss(i*.35,i*.35+.6,t);if(k>0)draw(BOX,{p:[c[0],c[1],c[2]],r:[c[3],0,.8+i],s:[.02,.06,.7*k],c:[.1,.08,.06]});});
 for(let i=0;i<4;i++){const f=ss(1.5+i*.6,2+i*.6,t);amphora(2.4,lerp(.9,0,f),-2-i*.8,undefined);}draw(BOX,{p:[2.4,.45,-3.2],s:[.6,.9,3.2],c:[.9,.85,.75]});
 for(let i=0;i<14;i++){const ph=(t*.7+i*.07)%1;draw(SPH,{p:[Math.sin(i*2)*2,ph*3,-3-i*.4],s:[.12+ph*.35,.12+ph*.35,.12+ph*.35],c:[.75,.7,.6]});}
 label('THE GROUND TREMBLES',360,240,52,.1,2.5,t,{color:'#ffcf5a'});label('SMALL EARTHQUAKES',360,240,52,2.5,4.1,t);label('NO ONE UNDERSTANDS',360,240,50,4.15,6.6,t,{color:'#ff6a3d'});}
function sE(t){const ex=2.2,d=Math.max(0,t-ex);const shk=d>0&&d<1?.5*Math.sin(t*40)*Math.exp(-d*2):0;
 env({...DAYP,fog:mix3([.78,.8,.84],[.55,.5,.48],ss(4,8.9,t)),eye:[8+shk,5+shk,30],tgt:[0,lerp(12,40,ss(2,8,t)),-100],fov:58,plP:[0,25,-130],plC:d>0?[4,1.6,.4].map(v=>v*Math.max(.3,Math.exp(-d))):[0,0,0],plR:120});
 street();const VP=xf([0,0,-130],[0,0,0]);vesuvius(VP,{glow:d>0?1:0});if(d>0)column(VP,ss(0,5.5,d),t,0);
 if(d>0)for(let i=0;i<40;i++){const ph=(d*.6+i*.025)%1;draw(SPH,{p:[Math.sin(i*2.1)*ph*30,22+ph*30-ph*ph*25,-130+Math.cos(i*1.7)*ph*25],s:[.8,.8,.8],c:[.2,.15,.1],e:[1.5,.5,.1].map(v=>v*(1-ph))});}
 if(d>4&&Math.sin(t*13)>.92)draw(BOX,{p:[3,60,-120],r:[0,0,.4],s:[.4,22,.4],e:[3,3,3.5]});
 label('AROUND MIDDAY',360,240,58,.1,2.2,t);label('VESUVIUS EXPLODES',360,250,58,2.2,4.5,t,{color:'#ff6a3d',stamp:1});label('20 MILES HIGH',360,240,80,4.6,8.8,t,{color:'#ffcf5a'});}
function sF(t){const dk=ss(0,1.3,t);const rc=ss(4.4,5.0,t);env({fog:mix3([.5,.46,.42],[.3,.27,.25],dk),fogD:.03,sky:[.4,.38,.36],gnd:[.25,.22,.2],sunC:mix3([.6,.55,.5],[.25,.24,.24],dk),sunD:[-.3,.8,.3],eye:[1.5,2.2,7],tgt:[0,1.5,-5],fov:55,plP:[-1,2,0],plC:[1.6,.9,.35],plR:9});
 street({ash:ss(1,6.6,t)*.6,noroof:rc>.5,lamps:1});if(rc>0&&rc<1)for(let i=0;i<20;i++)draw(BOX,{p:[3.5+(i%4)*.5,4-rc*4*(1+(i%3)*.2),-3-(i%5)*.8],r:[i,i,0],s:[.5,.1,.3],c:TERRA});
 if(rc>=1)for(let i=0;i<16;i++)draw(BOX,{p:[3.6+(i%4)*.5,.15,-3-(i%5)*.8],r:[0,i,0],s:[.5,.1,.3],c:TERRA});
 draw(BOX,{p:[0,ss(1,6.6,t)*.6-.3,-5],s:[5.2,.6,40],c:[.6,.58,.55]});
 for(let i=0;i<130;i++){const ph=(t*.9+i*.0077)%1;draw(BOX,{p:[((i*37.7)%9)-4.5,7-ph*7,((i*21.3)%14)-10],s:[.06,.06,.06],c:[.75,.72,.68]});}
 man(xf([-1,0,0],[0,Math.PI,0]),{coat:[.6,.55,.5],hat:'none',arms:[[-2.6,0,.3],[-2.6,0,-.3]]});
 label('THE SUN DISAPPEARS',360,240,52,.1,1.8,t);label('STONES RAIN DOWN FOR HOURS',360,240,40,1.8,4.4,t,{color:'#ffcf5a'});label('ROOFS COLLAPSE',360,240,64,4.45,6.6,t,{color:'#ff6a3d',stamp:1});}
function sG(t){const inside=t>1.32;if(!inside){env({fog:[.3,.27,.25],fogD:.03,sky:[.4,.38,.36],gnd:[.25,.22,.2],sunC:[.25,.24,.24],eye:[1.5,2,6],tgt:[0,1.4,-8],fov:55,plP:[0,2,-3],plC:[1.6,.9,.35],plR:12});street({ash:.6,lamps:1});
  for(let i=0;i<8;i++){const z=-1-i*1.2-t*3;man(xf([(i%3-1)*1,0,z],[0,Math.PI,0]),{coat:[.6,.5,.4],hat:'none',sw:.6*Math.sin(t*9+i)});if(i%3==0)draw(SPH,{p:[(i%3-1)*1+.3,1.7,z],s:[.08,.12,.08],e:[3,1.6,.4]});}
  label('MANY FLEE',360,240,80,0,1.32,t,{color:'#ffcf5a'});return;}
 env({fog:[.25,.18,.12],fogD:.05,sky:[.4,.3,.2],gnd:[.2,.14,.1],sunC:[.15,.12,.1],eye:[2.4,1.6,3.2],tgt:[0,.9,0],fov:52,plP:[.3,1.2,.3],plC:[2.2,1.2,.5].map(v=>v*(.85+.15*Math.sin(t*17))),plR:6});
 draw(BOX,{p:[0,-.5,0],s:[20,1,20],c:[.5,.4,.3]});draw(BOX,{p:[0,1.5,-1.6],s:[6,3,.2],c:[.72,.32,.22]});draw(BOX,{p:[-2,1.5,0],s:[.2,3,6],c:[.85,.68,.45]});
 for(let i=0;i<3;i++)draw(BOX,{p:[-.5+i*1.1,1.8,-1.48],s:[.8,.9,.03],c:[.2,.35,.3]});draw(BOX,{p:[.3,.45,.3],s:[1.2,.9,.8],c:[.45,.3,.18]});draw(SPH,{p:[.3,.95,.3],s:[.08,.05,.12],c:[.8,.6,.3],e:[3,1.6,.4]});
 man(xf([-.6,0,.2],[0,.8,0]),{sit:1,coat:[.7,.25,.2],hat:'none'});man(xf([-.4,0,-.6],[0,.4,0]),{sit:1,coat:[.4,.5,.6],hat:'none'});man(xf([1.2,0,-.5],[0,-.6,0]),{sit:1,coat:[.85,.8,.7],hat:'none'});
 label('SOME STAY',360,240,80,1.32,2.9,t,{color:'#ff6a3d'});label('HIDING IN THEIR HOMES',360,240,46,2.9,6.2,t);}
function sH(t){const col=ss(.8,2.4,t),sz=lerp(-100,15,ss(2.6,8.8,t));env({fog:[.55,.45,.4],fogD:.005,sky:[.55,.45,.4],gnd:[.25,.2,.18],sunC:[.7,.5,.35],sunD:[.6,.3,-.6],eye:[30,9,40],tgt:[0,6,-50],fov:55});
 street({ash:.6});const VP=xf([0,0,-130],[0,0,0]);vesuvius(VP,{ash:.6,glow:.5});if(col<1)column(VP,1-col*.6,t,1);
 if(t>2.4)for(let i=0;i<70;i++){const fx=(i%10-4.5)*8,fz=sz-((i*7)%10)*3;const r=4+(i%4)*2;draw(SPH,{p:[fx+Math.sin(t*2+i)*1.5,r*.6+((i*3)%5),fz],s:[r,r*.8,r],c:[.48,.44,.42],e:[.25,.1,.03]});}
 for(let i=0;i<5;i++){const z=sz+30+i*2+t*1.5;if(z<14)man(xf([(i-2)*1.4,0,z],[0,0,0]),{coat:[.6,.5,.4],hat:'none',sw:.7*Math.sin(t*10+i)});}
 label('THE NEXT MORNING',360,240,56,.1,1.1,t);label('THE COLUMN COLLAPSES',360,240,48,1.1,2.9,t,{color:'#ffcf5a'});label('A SCORCHING CLOUD',360,240,56,2.95,6.7,t,{color:'#ff6a3d'});label('FASTER THAN ANYONE CAN RUN',360,240,38,6.8,9.2,t,{stamp:1});}
function sI(t){env({fog:[.62,.6,.58],fogD:.02,sky:[.6,.58,.56],gnd:[.4,.38,.36],sunC:[.5,.48,.46],eye:[1,2.5,10-t*.4],tgt:[0,1,-12],fov:50});street({ash:1});draw(BOX,{p:[0,.4,-30],s:[6,.8,90],c:[.6,.58,.55]});
 for(let i=0;i<60;i++){const ph=(t*.3+i*.017)%1;draw(BOX,{p:[((i*37.7)%10)-5,5-ph*5,((i*21.3)%16)-12],s:[.04,.04,.04],c:[.7,.7,.7]});}
 label('AROUND 2,000 DEAD',360,240,62,.2,4.3,t,{color:'#ff6a3d'});label('IN POMPEII ALONE',360,320,40,.6,4.3,t);}
function sJ(t){const pour=ss(6.0,7.4,t),rev=ss(7.4,8.6,t);env({...DAYP,fog:[.8,.8,.78],eye:[3.5,2.8,5-t*.12],tgt:[0,.4,0],fov:50});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.6,.57,.52]});draw(BOX,{p:[0,.05,0],s:[3.4,.1,2.4],c:[.45,.42,.38]});
 if(rev<1)draw(BOX,{p:[0,.4-rev*.4,0],s:[3.2,.6,2.2],c:[.55,.52,.48]});
 if(t>1.3&&rev<.6)for(let i=0;i<3;i++)draw(SPH,{p:[-.8+i*.8,.72,(i%2)*.3],s:[.28,.06,.4],c:[.1,.09,.08]});
 if(pour>0&&pour<1){draw(CYL,{p:[-.6,.7,0],s:[.04,1.6,.04],c:[.95,.95,.92]});draw(BOX,{p:[-.6,2.4,0],r:[0,0,.8],s:[.4,.3,.3],c:[.5,.4,.3]});}
 if(rev>0){caster(-.8,0,0,.3,1.4);caster(.4,0,.2,-1.2,.9);caster(1.2,0,-.5,2.2,1.6);}
 man(xf([-2.2,0,-.8],[0,1.1,0]),{coat:[.2,.2,.25],hat:'top'});man(xf([2.3,0,-.4],[0,-1.3,0]),{coat:[.35,.3,.22],arms:[[-.8,0,.2],[-.8,0,-.2]]});
 label('CENTURIES LATER',360,240,58,.1,1.3,t);label('HOLLOW SPACES IN THE ASH',360,240,42,1.3,4.1,t,{color:'#8fd3ff'});label('SHAPED LIKE PEOPLE',360,320,40,4.5,5.6,t*0+t,{});
 label('THEY FILL THEM WITH PLASTER',360,240,38,6.3,8.1,t,{color:'#fff3dc'});label('THE LAST MOMENTS OF POMPEII',360,240,36,8.2,11.6,t,{color:'#ffcf5a'});}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 cx.clearRect(0,0,W,H);fn(T-s0);const img=cx.getImageData(0,0,W,H);cx.drawImage(gl.canvas,0,0);
 const tmp=document.createElement('canvas');tmp.width=W;tmp.height=H;tmp.getContext('2d').putImageData(img,0,0);cx.drawImage(tmp,0,0);
 let a=0;const lt=T-s0;if(k>0)a=Math.max(a,1-lt/.25);if(k<S.length-1)a=Math.max(a,1-(s1-T)/.2);if(T>75.6)a=Math.max(a,(T-75.6)/.7);if(T<.25)a=Math.max(a,1-T/.25);
 if(fn===sE&&lt>2.2&&lt<2.6){cx.fillStyle=`rgba(255,220,170,${(1-(lt-2.2)/.4)*.7})`;cx.fillRect(0,0,W,H);}
 if(a>0){cx.fillStyle=`rgba(0,0,0,${Math.min(1,a)})`;cx.fillRect(0,0,W,H);}
 return out.toDataURL('image/jpeg',.9);};
