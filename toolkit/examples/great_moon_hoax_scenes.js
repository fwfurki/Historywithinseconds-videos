// ===== THE GREAT MOON HOAX (New York, 1835) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
function lineC(P,a,b,r,c,o){const d=sub(b,a),L=Math.hypot(...d)||1e-4;draw(CYL,Object.assign({P,p:a,r:[Math.acos(clamp(d[1]/L,-1,1)),Math.atan2(d[0],d[2]),0],s:[r,L,r],c:c||[.15,.12,.1],noShadow:1},o||{}));}
function camPlaque(e,tg,dist,dx,dy,k,val,dig,cap){const f=norm(sub(tg,e));const r=norm(cross(f,[0,1,0]));const u=cross(r,f);const p=[e[0]+f[0]*dist+r[0]*dx+u[0]*dy,e[1]+f[1]*dist+r[1]*dx+u[1]*dy,e[2]+f[2]*dist+r[2]*dx+u[2]*dy];
 const d=sub(e,p);const yaw=Math.atan2(d[0],d[2]);const pit=Math.atan2(d[1],Math.hypot(d[0],d[2]));plaque3D(cxf(xf(p,[0,yaw,0]),xf([0,0,0],[-pit,0,0])),val,dig,cap,k);}
function rnd(s){let x=s;return()=>{x=(x*9301+49297)%233280;return x/233280;};}
const NLON=-74.0,NLAT=40.7;
// ---------- envs ----------
const DAY={sky:[.78,.8,.86],gnd:[.5,.47,.42],sunC:[.74,.68,.56],sunD:[-.45,.72,.45],fog:[.84,.87,.92],fogD:.004,skyTop:[.3,.52,.88],clouds:.35};
const NIGHTSKY={noSky:1,bg:[.05,.07,.16],sky:[.45,.5,.7],gnd:[.25,.25,.3],sunC:[.55,.58,.72],sunD:[.3,.7,.5],fog:[.05,.07,.16],fogD:.004};
const INSIDE={noSky:1,sky:[.72,.66,.58],gnd:[.44,.38,.3],sunC:[.5,.47,.42],sunD:[-.4,.7,.5],fog:[.3,.26,.22],fogD:.01};
// ---------- newspaper textures ----------
function paperTex(key,head,sub_,fig){const c=document.createElement('canvas');c.width=640;c.height=880;const g=c.getContext('2d');g.fillStyle='#efe6cf';g.fillRect(0,0,640,880);
 g.fillStyle='#1e1a16';g.textAlign='center';g.textBaseline='middle';g.font='900 92px Cinzel';g.fillText('THE SUN',320,80);g.fillRect(30,130,580,4);g.font='600 22px "DejaVu Serif"';g.fillText('NEW YORK  ·  1835  ·  ONE CENT',320,152);g.fillRect(30,170,580,2);
 g.font='800 40px "DejaVu Serif"';head.forEach((l,i)=>g.fillText(l,320,225+i*48));g.font='italic 24px "DejaVu Serif"';if(sub_)g.fillText(sub_,320,225+head.length*48+10);
 const y0=260+head.length*48;if(fig)fig(g,y0);
 g.fillStyle='rgba(30,26,22,.55)';for(let col=0;col<3;col++)for(let r=0;r<20;r++){const y=(fig?y0+300:y0)+r*20;if(y>850)break;g.fillRect(40+col*192,y,165-(r%5==4?60:0),6);}return c;}
function batFig(g,y0){g.save();g.translate(320,y0+140);g.fillStyle='#2a2420';g.beginPath();g.ellipse(0,40,180,120,0,0,Math.PI*2);g.globalAlpha=.08;g.fill();g.globalAlpha=1;g.fillStyle='#e9dfc5';g.beginPath();g.arc(0,0,120,0,Math.PI*2);g.fill();g.strokeStyle='#2a2420';g.lineWidth=3;g.stroke();
 g.fillStyle='#2a2420';g.beginPath();g.moveTo(0,-20);g.lineTo(-110,-60);g.lineTo(-80,-20);g.lineTo(-100,10);g.lineTo(-60,0);g.lineTo(-20,30);g.lineTo(20,30);g.lineTo(60,0);g.lineTo(100,10);g.lineTo(80,-20);g.lineTo(110,-60);g.closePath();g.fill();
 g.beginPath();g.arc(0,-35,14,0,Math.PI*2);g.fill();g.fillRect(-10,-22,20,55);g.fillRect(-12,30,8,40);g.fillRect(4,30,8,40);g.restore();}
const PAPER1=paperTex('p1',['GREAT','ASTRONOMICAL','DISCOVERIES'],'by Sir John Herschel, at the Cape',batFig);
const PAPER2=paperTex('p2',['SEPTEMBER 16, 1835'],'',null);
const PAPERS=[1,2,3,4,5,6].map(n=>paperTex('pn'+n,['GREAT ASTRONOMICAL','DISCOVERIES — PART '+['I','II','III','IV','V','VI'][n-1]],'',null));
function newspaper(P,tex,key,o){o=o||{};const w=o.w||.64,h=o.h||.88;draw(BOX,{P,p:[0,0,-.004],s:[w,h,.006],c:[.9,.86,.75],gold:o.gold});useTex(key,tex);draw(QUAD,{P,p:[0,0,.002],s:[w,h,1],c:[1,1,1],tex:3,u:o.u===undefined?0:o.u,gold:o.gold});}
// ---------- 1835 people ----------
const NY=[{coat:[.2,.2,.24],hat:'bowler',hatc:[.14,.13,.13],moustache:1,longcoat:1},{dress:[.42,.28,.36],hairStyle:'bun',female:1},{coat:[.36,.28,.2],hat:'flat',hatc:[.28,.24,.2],jacket:false,shirt:[.82,.78,.68]},{coat:[.24,.3,.4],hat:'bowler',hatc:[.2,.18,.16]},{dress:[.3,.42,.4],hairStyle:'bun',female:1,hair:HAIRS[2]},{coat:[.34,.24,.2],longcoat:1,beard:1,hat:'bowler',hatc:[.18,.16,.15]}];
const HERS={coat:[.16,.16,.2],longcoat:1,pants:[.22,.22,.24],shirt:[.95,.94,.9],tie:[.95,.94,.9],hair:[.55,.5,.45],hairStyle:'long',seed:7};
const LOCKE={coat:[.26,.22,.2],pants:[.25,.22,.2],shirt:[.92,.9,.85],tie:[.15,.12,.1],hair:HAIRS[1],seed:12,sit:1};
function readPose(o){return Object.assign({armR:[-1.2,0,.35],elbowR:1.2,armL:[-1.2,0,-.35],elbowL:1.2,head:[.35,0,0]},o||{});}
function heldPaper(P,key,tex,g){newspaper(cxf(P,xf([0,1.25,.42],[-.35,0,0],.85)),tex,key,{gold:g});}
// ---------- New York street ----------
function nyStreet(o){o=o||{};draw(BOX,{p:[0,-.5,-10],s:[200,1,120],c:[.5,.47,.43],pat:6,patS:1.2});road(0,20,0,-70,6,null,[.44,.4,.36]);
 const W_=[[.62,.36,.28],[.7,.44,.34],[.58,.34,.3],[.8,.72,.6]];for(let i=0;i<7;i++)for(const sd of[-1,1]){house(xf([sd*7.4,0,4-i*7.2],[0,sd<0?Math.PI/2:-Math.PI/2,0]),{w:6.8,d:5,floors:3+(i%2),style:i%4==3?'plaster':'brick',wall:W_[(i+(sd>0))%4],roof:[.3,.28,.3]});}
 for(let i=0;i<5;i++)lamppost(xf([i%2?3.6:-3.6,0,2-i*9]),0);barrel(xf([-3.9,0,-1.5]));crate(xf([-4.3,0,-2.1]));cart(xf([3.2,0,-8],[0,.1,0]));}
// ---------- the Moon (as the hoax described it) ----------
function moonBall(P,k){draw(SPH,{P,s:[k,k,k],c:[.86,.86,.84],pat:6,patS:2/k});const r=rnd(4);for(let i=0;i<14;i++){const th=r()*Math.PI*2,ph=(r()-.5)*2.2;const n=[Math.cos(ph)*Math.sin(th),Math.sin(ph),Math.cos(ph)*Math.cos(th)];if(n[2]<.2)continue;const s=(.08+r()*.14)*k;
 draw(SPHL,{P,p:[n[0]*k*.985,n[1]*k*.985,n[2]*k*.985],s:[s,s,s*.25],r:[-ph,th,0],c:[.66,.66,.66],noInk:1});}}
function stars(n,R){for(let i=0;i<(n||90);i++){const a=i*2.39,e=(i*.618)%1;draw(SPHL,{p:[Math.cos(a)*R,(e-.2)*R*1.2,-R*.9+Math.sin(a)*R*.2],s:[.003*R,.003*R,.003*R],c:[1,1,1],u:1,id:0,noShadow:1,noInk:1});}}
function moonHF(x,z){return .7*Math.sin(x*.18)*Math.cos(z*.15)+.4*Math.sin(x*.5+z*.3)+(z<-30?-(z+30)*.0:0);}
let GK='';function lunarLand(o){o=o||{};if(GK!=='M'){setGrid(-60,60,-90,30,moonHF);GK='M';}draw(GRID,{c:[.7,.7,.68],pat:6,patS:.6});
 draw(BOX,{p:[0,-.4,-70],s:[300,.5,40],c:[.18,.42,.58],pat:5,patS:.35,g:.6,noShadow:1});
 const r=rnd(9);for(let i=0;i<34;i++){const x=-40+r()*80,z=-14-r()*36;tree(xf([x,moonHF(x,z)-.1,z]),.9+r()*.5,[.28,.5,.34],'broad');}
 for(let i=0;i<8;i++){const x=-30+r()*60,z=-4-r()*20;rock(xf([x,moonHF(x,z)-.1,z]),.8+r()*.8,[.66,.66,.66],i);}
 const E=xf([30,40,-140]);draw(SPH,{P:E,s:[9,9,9],c:[.3,.55,.85],u:1,id:0});}
function bison(P,g){cow(cxf(P,xf([0,0,0],[0,0,0],.55),g?{gold:1}:{}),[.42,.3,.2]);draw(SPH,{P,p:[0,.62,.25],s:[.2,.2,.22],c:[.32,.22,.15],noInk:1,gold:g});}
function goat(P,g){const Q=cxf(P,xf([0,0,0],[0,0,0],.5),g?{gold:1}:{});cow(Q,[.42,.46,.62]);draw(CONE,{P:Q,p:[0,1.32,.95],r:[.5,0,0],s:[.04,.5,.04],c:[.95,.9,.78],gold:g});}
function beaver(P,t,i,g){const s=Math.sin(t*6+i);const Q=cxf(P,xf([0,0,0],[0,0,s*.06]),g?{gold:1}:{});draw(SPH,{P:Q,p:[0,.55,0],s:[.26,.38,.24],c:[.45,.3,.18]});draw(SPH,{P:Q,p:[0,.98,.04],s:[.17,.16,.17],c:[.48,.32,.2]});
 draw(SPHL,{P:Q,p:[0,.94,.19],s:[.06,.05,.05],c:[.2,.14,.1],noInk:1});for(const sd of[-1,1]){draw(SPHL,{P:Q,p:[sd*.07,1.03,.15],s:[.025,.025,.02],c:[.05,.05,.05],noInk:1});draw(SPHL,{P:Q,p:[sd*.12,1.12,.02],s:[.05,.06,.03],c:[.4,.26,.16]});
  draw(CYL,{P:Q,p:[sd*.1,0,.02+sd*s*.06],s:[.06,.25,.06],c:[.38,.25,.15]});draw(SPHL,{P:Q,p:[sd*.1,.02,.08+sd*s*.06],s:[.07,.03,.12],c:[.3,.2,.12]});draw(CYL,{P:Q,p:[sd*.2,.55,.05],r:[-.8,0,sd*.3],s:[.04,.25,.04],c:[.42,.28,.17]});}
 draw(BOX,{P:Q,p:[0,.15,-.38],r:[.5,0,0],s:[.22,.04,.4],c:[.25,.2,.16],noInk:1});draw(BOX,{P:Q,p:[.0,.62,.2],s:[.14,.14,.14],c:[.52,.38,.24],pat:2,patS:6});}
function batman(P,t,o){o=o||{};const fl=Math.sin(t*7+(o.seed||0))*.45;person(P,Object.assign({coat:[.4,.32,.26],jacket:false,shirt:[.45,.36,.28],pants:[.4,.32,.26],hair:[.3,.22,.15],seed:o.seed||1,armR:[-.2,0,1.3],elbowR:.2,armL:[-.2,0,-1.3],elbowL:.2},o.pose||{}));
 for(const sd of[-1,1]){const W=cxf(P,xf([sd*.12,1.38,-.14],[0,0,sd*(.15+fl)]));lineC(W,[0,0,0],[sd*.75,.35,0],.025,[.28,.2,.16]);lineC(W,[sd*.75,.35,0],[sd*1.35,.05,0],.02,[.28,.2,.16]);
  for(let i=0;i<3;i++){const a=(-.2-i*.42);draw(PRISM,{P:W,p:[sd*(.45+i*.32),.0,-.01],r:[0,0,Math.PI+sd*a],s:[.55,1.0-i*.12,.012],c:[.34,.24,.22]});}}}
function temple(P,g){draw(BOX,{P,p:[0,.2,0],s:[6,.4,4],c:[.86,.82,.72],pat:6,patS:2,gold:g});draw(BOX,{P,p:[0,.5,0],s:[5.4,.2,3.4],c:[.88,.84,.74],gold:g});for(let i=0;i<6;i++)for(const sd of[-1,1]){draw(CYL,{P,p:[-2.4+i*.96,.6,sd*1.4],s:[.18,2.6,.18],c:[.9,.86,.76],gold:g});}
 draw(BOX,{P,p:[0,3.3,0],s:[5.6,.3,3.6],c:[.88,.84,.74],gold:g});draw(PRISM,{P,p:[0,3.45,0],s:[5.8,1.1,3.8],c:[.86,.66,.3],gold:g});}
function scopeIris(T,a){if(a<=0)return;cx.save();cx.globalAlpha=a;cx.fillStyle='#0b0d12';cx.beginPath();cx.rect(0,0,W,H);cx.arc(W/2,880,470,0,Math.PI*2,true);cx.fill();cx.strokeStyle='#b8862a';cx.lineWidth=14;cx.beginPath();cx.arc(W/2,880,470,0,Math.PI*2);cx.stroke();
 cx.strokeStyle='rgba(255,220,150,.35)';cx.lineWidth=2;cx.beginPath();cx.moveTo(W/2-40,880);cx.lineTo(W/2+40,880);cx.moveTo(W/2,840);cx.lineTo(W/2,920);cx.stroke();cx.restore();}
// ---------- scenes ----------
function deskEnv(o){return Object.assign({},INSIDE,o);}
function sPaper(t){const k=ease(ss(0,1.9,t));const sp=(1-ease(ss(0,.9,t)))*6;env(deskEnv({eye:[0,1.8,lerp(1.5,1.25,k)],tgt:[0,.9,0],fov:44,plP:[.6,2,1],plC:[.75,.62,.42],plR:5}));
 draw(BOX,{p:[0,.4,0],s:[3,.8,2],c:[.42,.28,.17],pat:2,patS:3});newspaper(xf([0,.81+sp*.12,0],[-Math.PI/2+sp*.05,sp,0],1+sp*.15),PAPER1,'p1',{gold:t>.9?1:0});
 lineC(xf([0,0,0]),[.55,.82,.2],[.8,.86,.55],.01,[.95,.94,.9]);draw(CYL,{p:[-.7,.8,-.4],s:[.08,.12,.08],c:[.15,.15,.18],g:.6});}
function sGlobe(t){const k=ease(ss(0,2.0,t));env({bg:[.055,.105,.17],fog:[.055,.105,.17],fogD:0,sky:[.9,.9,.95],gnd:[.55,.55,.6],sunC:[.45,.45,.45],sunD:[-.3,.4,.9],ink:.8,inkFar:50,eye:[0,0,lerp(5.4,3.2,k)],tgt:[0,0,0],fov:40});
 globe3D(xf([0,0,0]),NLON,NLAT,(1-k)*2.6,ss(1.0,1.5,t));stars(80,40);}
function moonSky(t,o){env(Object.assign({},NIGHTSKY,{sunD:[.6,.5,.6]},o));stars(140,120);}
function sBat(t){const k=ease(ss(0,1.4,t));moonSky(t,{eye:[0,0,8],tgt:[0,lerp(-.2,.2,k),0],fov:40,sunC:[.8,.8,.8],sky:[.6,.6,.65]});moonBall(xf([.4,1.2,-30],[0,.4,0]),5.5);
 batman(cxf(xf([lerp(-1.2,1.0,k),lerp(-.9,.4,k),0],[.2,.4,-.3]),xf([0,0,0]),{gold:1}),t,{seed:2});}
function sUni(t){const k=ease(ss(0,1.25,t));env(Object.assign({},NIGHTSKY,{bg:null,noSky:1,eye:[lerp(3.4,2.8,k),1.3,lerp(4.6,4.0,k)],tgt:[0,.7,0],fov:42,sunD:[-.5,.6,.5],sunC:[.88,.86,.8],sky:[.62,.62,.66],gnd:[.42,.42,.42],dof:[4.5,3],bloom:1}));stars(140,120);
 if(GK!=='M'){setGrid(-60,60,-90,30,moonHF);GK='M';}draw(GRID,{c:[.7,.7,.68],pat:6,patS:.6});moonBall(xf([-6,9,-30]),4);
 const Q=cxf(xf([0,moonHF(0,0),0],[0,.6,0]),xf([0,0,0],[0,0,0],.85),{gold:1});cow(Q,[.42,.5,.78]);draw(CONE,{P:Q,p:[0,1.35,1.0],r:[.6,0,0],s:[.05,.6,.05],c:[1,.95,.8]});}
function sReaders(t){const k=ease(ss(0,2.0,t));env(Object.assign({},DAY,{eye:[lerp(-1.6,-1.0,k),lerp(1.7,1.6,k),lerp(6,4.8,k)],tgt:[0,1.4,0],fov:46,shadow:{c:[0,0,0],r:10}}));nyStreet();
 [[-1.3,.2,.3],[0,-.4,0],[1.3,.3,-.3],[-.5,-1.6,.15],[.9,-1.9,-.2]].forEach(([x,z,ry],i)=>{const P=xf([x,0,z],[0,ry,0]);person(P,Object.assign({seed:3+i},NY[i],readPose(i==1?{worry:1,head:[.1,0,0]}:{})));heldPaper(P,'p1',PAPER1,i==1?1:0);});}
function press(P,t){const dn=Math.max(0,Math.sin(t*4));draw(BOX,{P,p:[0,.5,0],s:[1.6,1,2.6],c:[.38,.26,.16],pat:2,patS:3});for(const sd of[-1,1])draw(BOX,{P,p:[sd*.7,1.6,0],s:[.18,3.2,.3],c:[.35,.24,.15],pat:2,patS:4});
 draw(BOX,{P,p:[0,3.1,0],s:[1.6,.3,.4],c:[.35,.24,.15],pat:2,patS:4});draw(CYL,{P,p:[0,1.75+.4*(1-dn),0],s:[.08,1.3,.08],c:[.25,.25,.28],g:.7});
 draw(BOX,{P,p:[0,1.55+.4*(1-dn),0],s:[1.0,.12,.9],c:[.3,.3,.32],g:.6});lineC(P,[0,2.9,0],[.9*Math.cos(t*4),2.9,.9*Math.sin(t*4)],.04,[.25,.25,.28]);
 draw(BOX,{P,p:[0,1.03,0],s:[.95,.02,.85],c:[.94,.9,.8]});for(let i=0;i<8;i++)draw(BOX,{P,p:[1.6,.05+i*.025,.4],s:[.9,.02,.8],c:[.94,.9,.8]});}
const SIGN=document.createElement('canvas');SIGN.width=1024;SIGN.height=256;(()=>{const g=SIGN.getContext('2d');g.fillStyle='#1b2a3e';g.fillRect(0,0,1024,256);g.strokeStyle='#d9a63e';g.lineWidth=10;g.strokeRect(10,10,1004,236);g.fillStyle='#f2e6c8';g.font='900 150px Cinzel';g.textAlign='center';g.textBaseline='middle';g.fillText('THE SUN',512,138);})();
function sPress(t){if(t<1.6){const k=ease(ss(0,1.6,t));env(Object.assign({},DAY,{eye:[lerp(3,2.4,k),lerp(1.8,2.6,k),lerp(10,8,k)],tgt:[-6.5,lerp(3.4,4.2,k),-1],fov:46,shadow:{c:[-5,0,-1],r:12}}));nyStreet();
  useTex('sign',SIGN);draw(QUAD,{p:[-3.98,4.8,-.5],r:[0,Math.PI/2,0],s:[4.2,1.05,1],c:[1,1,1],tex:3,u:1,gold:1});
  const P=xf([-3,0,1.6],[0,Math.PI/2,0]);person(P,{seed:9,coat:[.36,.28,.2],jacket:false,shirt:[.85,.8,.7],hat:'flat',hatc:[.3,.25,.2],armR:[-1.6,0,.2],elbowR:.4});newspaper(cxf(P,xf([.3,2.05,.38],[0,0,.2],.6)),PAPER1,'p1');return;}
 const lt=t-1.6,k=ease(ss(0,4.0,lt));env(deskEnv({eye:[lerp(3.4,2.6,k),lerp(2.4,2.1,k),lerp(4.2,3.4,k)],tgt:[.2,1.4,0],fov:46,plP:[1,3,1.5],plC:[.9,.75,.5],plR:9,bloom:1,shadow:{c:[0,0,0],r:6}}));
 draw(BOX,{p:[0,-.05,0],s:[12,.1,12],c:[.42,.3,.2],pat:2,patS:2});draw(BOX,{p:[0,2.5,-2.5],s:[12,5,.2],c:[.6,.4,.3],pat:3,patS:2});draw(BOX,{p:[-3.5,2.5,0],s:[.2,5,12],c:[.6,.4,.3],pat:3,patS:2});
 press(xf([0,0,-.6]),lt);person(xf([1.3,0,.6],[0,-2.4,0]),{seed:10,coat:[.3,.26,.2],jacket:false,shirt:[.86,.82,.72],apron:[.82,.78,.68],armR:[-1.0,0,.3],elbowR:.8,armL:[-1.0,0,-.3],elbowL:.8});
 newspaper(xf([1.0,1.3,1.0],[-.3,-.5,0],1.3),PAPER1,'p1',{gold:1});}
function plinth(fig,t,o){o=o||{};const a=.6+t*.18;env({noSky:1,sky:[.6,.57,.54],gnd:[.3,.27,.24],sunC:[.5,.47,.42],sunD:[-.3,.8,.6],fog:[.16,.15,.17],fogD:.016,eye:[Math.sin(a)*o.r,o.h,Math.cos(a)*o.r],tgt:[0,o.ty,0],fov:40,dof:[Math.hypot(o.r,o.h-o.ty),o.r*.4],plP:[1.5,5,3],plC:[.62,.54,.4],plR:14,desat:.2});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.4,.3,.22],pat:2,patS:1.2,g:.3});for(let i=-3;i<=3;i++)draw(BOX,{p:[i*4,3,-9],s:[3.6,6,.3],c:[.3,.32,.4],pat:6,patS:1});draw(BOX,{p:[0,6.2,-9],s:[30,.3,.5],c:[.6,.46,.22]});
 for(let i=0;i<30;i++){const b=i*2.39;draw(SPHL,{p:[Math.cos(b)*8,3+((i*.618)%1)*4,-8.6],s:[.03,.03,.03],c:[1,.95,.8],u:1,id:0,noShadow:1,noInk:1});}
 const pr=o.pr||1.4,ph=o.ph||1;draw(CYL,{p:[0,0,0],s:[pr,ph,pr],c:[.78,.74,.68],pat:6,patS:3,g:.3});draw(CYL,{p:[0,ph,0],s:[pr*1.1,.12,pr*1.1],c:[.86,.82,.76],pat:6,patS:3,g:.3});draw(CYL,{p:[0,0,0],s:[pr*1.12,.1,pr*1.12],c:[.62,.58,.52]});
 fig(cxf(xf([0,ph+.12,0],[0,-t*.35,0]),xf([0,0,0]),{gold:1}));}
function sHerschel(t){plinth(P=>{person(P,Object.assign({},HERS,{armR:[-.6,0,.15],elbowR:1.3}));lineC(P,[.32,1.05,.32],[.45,1.25,.55],.025,[.7,.55,.25]);},t,{r:3.6,h:2.3,ty:1.95,pr:.9,ph:.9});}
// giant fictional telescope
function bigScope(P,el,g){draw(BOX,{P,p:[0,3,0],s:[1,6,1],c:[.45,.32,.2],pat:2,patS:2});for(const sd of[-1,1])lineC(P,[sd*4,0,-3],[0,6,0],.22,[.45,.32,.2]);for(const sd of[-1,1])lineC(P,[sd*4,0,3],[0,6,0],.22,[.45,.32,.2]);
 const T=cxf(P,xf([0,6.3,0],[-el,0,0]));draw(CYL,{P:T,p:[0,0,-9],r:[Math.PI/2,0,0],s:[3.8,18,3.8],c:[.62,.5,.3],g:.6,gold:g});for(const z of[-8,-2,4,9])draw(CYL,{P:T,p:[0,0,z],r:[Math.PI/2,0,0],s:[3.95,.4,3.95],c:[.85,.65,.25],g:.7});
 draw(CYL,{P:T,p:[0,0,9.05],r:[Math.PI/2,0,0],s:[3.6,.1,3.6],c:[.7,.85,.95],g:1,a:.85,gold:g});draw(CYL,{P:T,p:[0,0,-9.2],r:[Math.PI/2,0,0],s:[.7,2,.7],c:[.4,.32,.2],g:.6});}
function capeLand(){draw(BOX,{p:[0,-.5,0],s:[300,1,300],c:[.55,.6,.36],pat:1,patS:1});const r=rnd(2);for(let i=0;i<12;i++){const x=-60+r()*120,z=-40-r()*60;rock(xf([x,0,z]),2+r()*3,[.55,.52,.46],i);}
 // flat-topped mountain backdrop
 draw(FR,{p:[10,0,-130],s:[80,26,16],c:[.5,.5,.54],pat:6,patS:.4});}
function sScope(t){const k=ease(ss(0,5.4,t));const E=[lerp(30,22,k),lerp(4,6,k),lerp(30,26,k)],TG=[0,lerp(6,9,k),0];env(Object.assign({},DAY,{eye:E,tgt:TG,fov:46,shadow:{c:[0,0,0],r:30}}));capeLand();bigScope(xf([0,0,0],[0,-.4,0]),.15,ss(2.8,3.4,t));
 [[6,8,.3],[7.5,7.2,-.4]].forEach(([x,z,ry],i)=>person(xf([x,0,z],[0,ry-2.2,0]),Object.assign({seed:20+i},NY[i*2],{head:[-.4,0,0]})));
 if(t>2.9)camPlaque(E,TG,24,0,2.6,2.3,Math.round(24*ease(ss(3.0,4.8,t))),2,'FEET WIDE');}
function sAim(t){const k=ease(ss(0,2.0,t));env(Object.assign({},DAY,{skyTop:[.1,.16,.36],fog:[.36,.42,.6],sky:[.5,.55,.7],sunC:[.5,.5,.6],eye:[lerp(-22,-26,k),lerp(3,2,k),lerp(16,20,k)],tgt:[0,lerp(10,16,k),-6],fov:46,clouds:.1,bloom:1,shadow:false}));capeLand();bigScope(xf([0,0,0],[0,-.4,0]),lerp(.15,.75,ease(ss(0,1.6,t))),1);
 moonBall(xf([30,62,-80]),7);stars(60,140);}
function sSix(t){const k=ease(ss(0,1.9,t));env(deskEnv({eye:[0,lerp(2.6,2.4,k),lerp(1.6,1.4,k)],tgt:[0,.8,0],fov:46,plP:[.6,2.4,1],plC:[.9,.75,.5],plR:6}));draw(BOX,{p:[0,.4,0],s:[3.6,.8,2.4],c:[.42,.28,.17],pat:2,patS:3});
 for(let i=0;i<6;i++){const a=ss(i*.22,i*.22+.3,t);if(a<=0)continue;const x=(-1.25+(i%3)*1.25)*a,z=(i<3?-.5:.5)*a;newspaper(xf([x,.81+i*.004,z+(1-a)*.5],[-Math.PI/2,(i-2.5)*.08,0],.82),PAPERS[i],'pn'+(i+1),{gold:i===5&&t>1.4?1:0});}
 camPlaque([0,2.6,1.6],[0,.8,0],1.6,0,.32,.16,Math.min(6,Math.floor(ss(0,1.4,t)*6.99)),1,'ARTICLES');}
// telescope view tour
function sMoonTour(t){const seg=t<1.8?0:t<3.7?1:t<5.7?2:3;const lt=[t,t-1.8,t-3.7,t-5.7][seg];const k=ease(ss(0,2,lt));
 const cams=[[[lerp(-8,-4,k),lerp(7,6,k),10],[0,-1,-55]],[[lerp(5,3.5,k),1.6,lerp(8,6.5,k)],[0,.6,0]],[[lerp(-4,-3,k),1.4,lerp(5,4,k)],[0,.6,0]],[[lerp(2.6,2.0,k),1.2,lerp(3.2,2.6,k)],[0,.8,0]]];
 env(Object.assign({},NIGHTSKY,{eye:cams[seg][0],tgt:cams[seg][1],fov:44,sunD:[-.5,.6,.5],sunC:[.88,.86,.8],sky:[.62,.62,.66],gnd:[.42,.42,.42],shadow:{c:[0,0,-2],r:14}}));stars(140,140);lunarLand();
 if(seg==1)for(let i=0;i<7;i++){const x=-3+(i%4)*1.8+Math.sin(t+i)*.1,z=-1.2-(i>3?1.6:0)+(i%2)*.4;bison(xf([x+t*.2,moonHF(x,z)-.05,z],[0,1.4+i*.1,0]),i==2?1:0);}
 if(seg==2)for(let i=0;i<5;i++){const x=-2.4+i*1.2,z=-1+(i%2)*.8;goat(xf([x,moonHF(x,z)-.05,z],[0,.6-i*.25,0]),i==2?1:0);}
 if(seg==3)for(let i=0;i<4;i++){const x=-1.4+i*.9+lt*.25,z=-.4-(i%2)*.7;beaver(xf([x,moonHF(x,z)-.05,z],[0,1.4,0]),t,i,i==1?1:0);}}
function sBatmen(t){const k=ease(ss(0,5.4,t));env(Object.assign({},NIGHTSKY,{eye:[lerp(-7,-4.5,k),lerp(2.6,3.6,k),lerp(11,8,k)],tgt:[0,2.6,-6],fov:46,sunD:[-.5,.6,.5],sunC:[.86,.84,.8],sky:[.6,.6,.64],gnd:[.42,.42,.42],bloom:1,shadow:{c:[0,0,-6],r:14}}));stars(140,140);lunarLand();
 temple(xf([0,moonHF(0,-7)-.1,-7]),ss(2.6,3.4,t));
 for(let i=0;i<4;i++){const a=t*.5+i*1.6;const P=xf([Math.cos(a)*4.5,4+Math.sin(t*1.3+i)*.6+i*.4,-6+Math.sin(a)*3],[.25,-a,0]);batman(i==0?cxf(P,xf([0,0,0]),{gold:1}):P,t,{seed:i});}
 // two winged builders carrying a stone block (temple building)
 for(let i=0;i<2;i++){const P=xf([-3.2+i*1.1,moonHF(-3,-3)-.05,-3.4],[0,.7,0]);batman(P,t*.2,{seed:10+i,pose:{armR:[-1.3,0,.2],elbowR:.6,armL:[-1.3,0,-.2],elbowL:.6}});}
 draw(BOX,{p:[-2.65,1.3,-3.0],r:[0,.7,0],s:[1.2,.45,.6],c:[.86,.82,.72],pat:6,patS:2});}
function sWhy(t){const k=ease(ss(0,2.1,t));env(Object.assign({},DAY,{eye:[lerp(-3,-2,k),lerp(1.4,1.6,k),lerp(3.2,2.6,k)],tgt:[0,1.5,0],fov:44,dof:[2.8,2],desat:.15,shadow:{c:[0,0,0],r:8}}));nyStreet();
 const P=xf([0,0,0],[0,-.5,0]);person(P,Object.assign({seed:3},NY[3],readPose({worry:1,head:[.15,.3,0]})));heldPaper(P,'p1',PAPER1,1);}
function smallScope(P,g){for(const a of[0,2.1,4.2])lineC(P,[Math.sin(a)*.7,0,Math.cos(a)*.7],[0,1.6,0],.04,[.4,.3,.2]);const T=cxf(P,xf([0,1.7,0],[-.6,0,0]));draw(CYL,{P:T,p:[0,0,-1.6],r:[Math.PI/2,0,0],s:[.22,3.2,.22],c:[.55,.42,.24],pat:2,patS:4,gold:g});draw(CYL,{P:T,p:[0,0,1.55],r:[Math.PI/2,0,0],s:[.25,.12,.25],c:[.8,.62,.25],g:.7,gold:g});}
function capeNight(t,o){env(Object.assign({},NIGHTSKY,{bg:[.07,.1,.22],fog:[.07,.1,.22],sky:[.55,.6,.8],sunC:[.7,.72,.86],sunD:[-.3,.6,.6],gnd:[.3,.32,.4],plP:[1.2,1.6,1.2],plC:[.95,.7,.35],plR:6,bloom:1},o));stars(200,120);
 draw(BOX,{p:[0,-.5,0],s:[200,1,200],c:[.42,.48,.34],pat:1,patS:1});draw(FR,{p:[10,0,-110],s:[70,24,14],c:[.26,.28,.38],pat:6,patS:.4});
 house(xf([-6,0,-4],[0,.4,0]),{w:6,d:5,floors:1,style:'plaster',wall:[.9,.88,.8],roof:[.36,.32,.3]});draw(CYL,{p:[1.2,.0,1.0],s:[.06,1.0,.06],c:[.4,.3,.2]});draw(SPHL,{p:[1.2,1.08,1.0],s:[.09,.12,.09],c:[1,.8,.4],u:1,add:1,id:0,noShadow:1});}
function sCape(t){const k=ease(ss(0,5.3,t));capeNight(t,{eye:[lerp(-3,-1.8,k),lerp(1.6,1.9,k),lerp(5.6,4.2,k)],tgt:[0,1.6,0],fov:46});smallScope(xf([.6,0,-.4],[0,.5,0]),0);
 person(cxf(xf([-.4,0,.2],[0,.9,0]),xf([0,0,0]),{gold:1}),Object.assign({},HERS,{armR:[-1.8,0,.2],elbowR:.5,head:[-.35,0,0]}));}
function sDetail(t){const k=ease(ss(0,3.6,t));env(deskEnv({eye:[lerp(.5,.15,k),lerp(1.5,1.25,k),lerp(.9,.55,k)],tgt:[lerp(.1,0,k),.82,lerp(-.05,0,k)],fov:42,plP:[.6,2,1],plC:[.9,.75,.5],plR:5,dof:[.7,.5]}));
 draw(BOX,{p:[0,.4,0],s:[3,.8,2],c:[.42,.28,.17],pat:2,patS:3});newspaper(xf([0,.81,0],[-Math.PI/2,0,0],1),PAPER1,'p1');
 // magnifying glass sliding over the page
 const M=xf([lerp(-.15,.15,k),.9,lerp(.15,-.05,k)]);draw(TUBE,{P:M,s:[.12,.02,.12],c:[.8,.62,.25],g:.8,gold:1});draw(CYL,{P:M,p:[0,-.005,0],s:[.115,.01,.115],c:[.8,.9,1],a:.35,u:1});lineC(M,[.12,0,.04],[.36,0,.16],.018,[.3,.2,.12]);}
function sReprint(t){const k=ease(ss(0,1.9,t));env(deskEnv({eye:[0,lerp(3.6,3.0,k),lerp(2.4,2.0,k)],tgt:[0,.8,-.2],fov:48,plP:[.6,3,1],plC:[.9,.75,.5],plR:7}));draw(BOX,{p:[0,.4,0],s:[5,.8,3],c:[.42,.28,.17],pat:2,patS:3});
 for(let i=0;i<14;i++){const a=ss(i*.07,i*.07+.35,t);if(a<=0)continue;const x=((i*.618)%1-.5)*3.6,z=((i*.382)%1-.5)*2;newspaper(xf([x*a,.81+i*.003,z*a],[-Math.PI/2,(i-7)*.17,0],.72),PAPER1,'p1');}}
function sMission(t){const k=ease(ss(0,3.2,t));env(deskEnv({eye:[lerp(-2.6,-2.0,k),lerp(2.0,1.9,k),lerp(4.4,3.6,k)],tgt:[.6,1.7,-1.6],fov:46,plP:[0,3.2,1],plC:[.9,.8,.6],plR:9,shadow:{c:[0,0,0],r:6}}));
 draw(BOX,{p:[0,-.05,0],s:[10,.1,10],c:[.42,.3,.2],pat:2,patS:2});draw(BOX,{p:[0,2.5,-3],s:[10,5,.2],c:[.78,.74,.64],pat:6,patS:2});
 // easel with a Moon chart
 const E=xf([1.1,0,-2.2],[0,-.2,0]);for(const sd of[-1,1])lineC(E,[sd*.5,0,0],[0,2.4,-.1],.03,[.4,.28,.18]);draw(BOX,{P:E,p:[0,1.7,.05],s:[1.3,1.0,.04],c:[.95,.92,.84]});moonBall(cxf(E,xf([0,1.72,.1])),.36);
 lineC(E,[-.55,1.4,.12],[-.2,1.62,.12],.012,[.85,.6,.2],{u:1});draw(CONE,{P:E,p:[-.2,1.62,.12],r:[0,0,-1.0],s:[.04,.08,.04],c:[.85,.6,.2],u:1});
 person(xf([.1,0,-1.8],[0,.4,0]),{seed:40,coat:[.14,.14,.16],longcoat:1,shirt:[.95,.94,.9],armR:[-1.4,0,.6],elbowR:.3,head:[0,-.3,0]});
 for(let i=0;i<6;i++){const x=-1.8+(i%3)*1.0,z=.2+Math.floor(i/3)*1.0;draw(BOX,{p:[x,.25,z+.05],s:[.8,.5,.4],c:[.4,.26,.16],pat:2,patS:3});person(xf([x,.08,z],[0,Math.PI+.2,0]),Object.assign({seed:41+i,sit:1},NY[i]));}}
function sNever(t){const k=ease(ss(0,2.4,t));env(Object.assign({},DAY,{eye:[lerp(-2.6,-2.0,k),lerp(1.8,1.7,k),lerp(2.6,2.1,k)],tgt:[0,1.45,0],fov:44,dof:[2.6,2],shadow:{c:[0,0,0],r:8}}));capeLand();house(xf([-3,0,-5],[0,.4,0]),{w:6,d:5,floors:1,style:'plaster',wall:[.9,.88,.8],roof:[.36,.32,.3]});smallScope(xf([2.2,0,-1.4],[0,.5,0]),0);
 const P=xf([0,0,0],[0,-.6,0]);person(cxf(P,xf([0,0,0]),{gold:1}),Object.assign({},HERS,readPose({worry:1,head:[.25,-.2,0]})));heldPaper(P,'p1',PAPER1,0);}
function sLocke(t){const k=ease(ss(0,4.0,t));env(deskEnv({eye:[lerp(-1.5,-1.2,k),lerp(1.75,1.65,k),lerp(-1.3,-1.1,k)],tgt:[0,1.2,.1],fov:44,plP:[-.4,1.4,.3],plC:[1,.72,.4],plR:4,bloom:1,dof:[1.9,1.3]}));
 draw(BOX,{p:[0,-.05,0],s:[8,.1,8],c:[.4,.28,.18],pat:2,patS:2});draw(BOX,{p:[0,2.5,-1.6],s:[8,5,.2],c:[.5,.44,.36],pat:2,patS:2.5});
 draw(BOX,{p:[0,1.0,-.55],s:[1.6,.06,.8],c:[.42,.27,.16],pat:2,patS:3});for(const sx of[-.72,.72])draw(BOX,{p:[sx,.5,-.55],s:[.08,1.0,.7],c:[.36,.22,.13]});
 for(let i=0;i<5;i++)draw(BOX,{p:[.45,1.04+i*.012,-.6],r:[0,.1*i,0],s:[.42,.008,.56],c:[.95,.92,.82]});draw(BOX,{p:[-.1,1.04,-.5],r:[0,.1,0],s:[.42,.008,.56],c:[.96,.93,.84],gold:1});
 draw(CYL,{p:[-.55,1.03,-.75],s:[.03,.14,.03],c:[.95,.92,.82]});draw(SPHL,{p:[-.55,1.2,-.75],s:[.025,.045,.025],c:[1,.8,.4],u:1,add:1,id:0,noShadow:1});lineC(xf([0,0,0]),[0,1.05,-.4],[.12,1.25,-.28],.007,[.95,.94,.9]);
 draw(BOX,{p:[0,.3,.1],s:[.5,.6,.5],c:[.4,.26,.16],pat:2,patS:4});person(cxf(xf([0,.1,.15],[0,Math.PI,0]),xf([0,0,0]),{gold:1}),Object.assign({},LOCKE,{armR:[-.85,0,.05],elbowR:1.2,armL:[-.8,0,-.15],elbowL:1.0,head:[.35,0,0]}));}
function sAdmit(t){const k=ease(ss(0,3.2,t));const sp=(1-ease(ss(0,.8,t)))*5;env(deskEnv({eye:[0,lerp(1.95,1.8,k),lerp(1.3,1.15,k)],tgt:[0,.85,0],fov:44,plP:[.6,2,1],plC:[.9,.75,.5],plR:5,bloom:1}));
 draw(BOX,{p:[0,.4,0],s:[3,.8,2],c:[.42,.28,.17],pat:2,patS:3});newspaper(xf([0,.81+sp*.1,0],[-Math.PI/2+sp*.04,-sp,0],1+sp*.12),PAPER2,'p2',{gold:t>.8?1:0});}
function letter(P,c){draw(BOX,{P,s:[.3,.01,.2],c:c||[.96,.94,.88]});draw(PRISM,{P,p:[0,.006,.05],r:[Math.PI/2,0,0],s:[.3,.1,.004],c:[.88,.84,.74],noInk:1});draw(SPHL,{P,p:[0,.012,.0],s:[.025,.006,.025],c:[.7,.15,.1],noInk:1});}
function sLetters(t){const k=ease(ss(0,6,t));const laugh=t>1.0&&t<2.5;const pile=ss(2.6,5.8,t);env(Object.assign({},DAY,{eye:[lerp(-.4,-1.0,k),lerp(1.7,2.4,k),lerp(2.4,3.6,k)],tgt:[0,1.2,0],fov:44,shadow:{c:[0,0,0],r:8}}));capeLand();
 house(xf([-3,0,-5],[0,.4,0]),{w:6,d:5,floors:1,style:'plaster',wall:[.9,.88,.8],roof:[.36,.32,.3]});draw(BOX,{p:[.6,.42,-.6],s:[1.4,.84,.8],c:[.45,.3,.18],pat:2,patS:3});
 person(cxf(xf([0,0,0],[0,.1,0]),xf([0,0,0]),{gold:1}),Object.assign({},HERS,laugh?{head:[-.3+.12*Math.sin(t*18),0,0],armL:[-.6,0,-.2],elbowL:1.4,mouthO:1}:{worry:pile>.3?1:0,head:[.25,.3,0],armR:[-.8,0,.3],elbowR:1.0}));
 const n=Math.floor(pile*60);for(let i=0;i<n;i++){const x=.6+((i*.618)%1-.5)*1.2,z=-.6+((i*.382)%1-.5)*.7;const y=.85+Math.floor(i/6)*.04;letter(xf([x,y,z],[0,i*1.1,0]),[[.96,.94,.88],[.92,.88,.78],[.98,.96,.92]][i%3]);}
 for(let i=0;i<8;i++){const ph=((t*.9+i*.125)%1);if(t<2.6)break;letter(xf([.6+Math.sin(i*2)*.6,3-ph*2.2,-.6+Math.cos(i*3)*.4],[ph*3+i,i,ph*2]));}}
function sArchive(t){env({noSky:1,sky:[.42,.38,.34],gnd:[.24,.2,.17],sunC:[.48,.4,.32],sunD:[-.3,.6,.7],fog:[.14,.12,.1],fogD:.03,eye:[lerp(.6,0,ease(ss(0,4,t))),1.95,lerp(5.5,4.4,ease(ss(0,4,t)))],tgt:[0,1.95,0],fov:44,plP:[0,2.5,2],plC:[.8,.6,.35],plR:7,bloom:1});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 draw(BOX,{p:[0,.9,1.2],s:[1.8,.06,.8],c:[.4,.26,.15]});for(const sx of[-.8,.8])draw(BOX,{p:[sx,.45,1.2],s:[.06,.9,.6],c:[.35,.22,.13]});
 newspaper(xf([-.35,.94,1.2],[-Math.PI/2,.2,0],.7),PAPER1,'p1');smallScope(cxf(xf([.45,.93,1.2],[0,-.6,0],.28),xf([0,0,0]),{gold:1}),1);}
// ---------- timeline ----------
const S=[[0,1.9,sPaper],[1.9,4.2,sGlobe],[4.2,5.6,sBat],[5.6,6.85,sUni],[6.85,8.85,sReaders],[8.85,14.45,sPress],[14.45,17.6,sHerschel],[17.6,23.0,sScope],[23.0,25.0,sAim],[25.0,26.95,sSix],[26.95,35.0,sMoonTour],[35.0,40.4,sBatmen],[40.4,42.5,sWhy],[42.5,47.8,sCape],[47.8,51.45,sDetail],[51.45,53.35,sReprint],[53.35,56.55,sMission],[56.55,58.95,sNever],[58.95,63.0,sLocke],[63.0,66.2,sAdmit],[66.2,72.3,sLetters],[72.3,80.3,sArchive]];
const END=80.3;
const RIB=[[9.0,.6,'25 AUGUST 1835'],[25.1,.75,'AUGUST 1835'],[63.1,.85,'SEPTEMBER 1835']];
function overlays(T,fn,lt){
 badge('NEW YORK','1835',NLON,NLAT,T,ss(3.9,4.4,T)*(1-ss(71.9,72.3,T)));
 ribbon(T,RIB,['JAN 1835','DEC 1835'],ss(8.9,9.3,T)*(1-ss(71.8,72.2,T)));
 if(fn===sGlobe)tag('NEW YORK, 1835',W/2,1180,2.6,4.2,T);
 seal(1,'THE STORY',8.95,T);seal(2,'THE WONDERS',27.0,T);seal(3,'THE TRUTH',56.6,T);
 if(fn===sPaper)bigText([['LIFE ON',96,PARCH],['THE MOON?',110,GOLD]],.25,1.85,T,470);
 if(fn===sBat)tag('BAT-WINGED PEOPLE',W/2,420,4.3,5.55,T);
 if(fn===sUni)tag('UNICORNS',W/2,420,5.7,6.8,T);
 if(fn===sReaders)tag('MANY BELIEVED IT',W/2,420,7.0,8.8,T);
 if(fn===sPress&&lt>=1.6)tag('"THE SUN" NEWSPAPER',W/2,420,10.6,14.3,T,{size:36});
 if(fn===sHerschel)museum('SIR JOHN HERSCHEL','Famous astronomer','1792–1871',560,960,14.8,17.5,T,'r');
 if(fn===sScope){tag('A GIANT TELESCOPE?',W/2,420,17.8,20.3,T);tag('IN SOUTH AFRICA',W/2,420,20.4,22.9,T);}
 if(fn===sAim)tag('AIMED AT THE MOON',W/2,420,23.1,24.9,T);
 if(fn===sMoonTour){const L=['FORESTS & OCEANS','TINY BISON','ONE-HORNED GOATS','BEAVERS ON 2 LEGS'];const st=[26.95,28.75,30.65,32.65,35.0];for(let i=0;i<4;i++)tag(L[i],W/2,420,st[i]+.15,st[i+1]-.1,T);tag('AS DESCRIBED BY THE SUN',W/2,1180,27.1,34.9,T,{size:28,f:MF});}
 if(fn===sBatmen){tag('WINGED MEN',W/2,420,36.0,38.9,T);tag('BUILDING TEMPLES',W/2,420,39.0,40.3,T);}
 if(fn===sWhy)bigText([['WHY',110,PARCH],['BELIEVE IT?',100,GOLD]],40.6,42.4,T,470);
 if(fn===sCape){tag('TRUE: HERSCHEL WAS REAL',W/2,420,42.7,44.9,T,{size:36});tag('MAPPING STARS AT THE CAPE',W/2,420,45.0,47.7,T,{size:34});}
 if(fn===sDetail)tag('CONVINCING "SCIENCE"',W/2,420,48.0,51.3,T);
 if(fn===sReprint)tag('REPRINTED',W/2,420,51.6,53.3,T);
 if(fn===sMission)tag('MISSIONARIES... TO THE MOON?',W/2,420,53.6,56.4,T,{size:34});
 if(fn===sNever)tag('HE NEVER WROTE IT',W/2,420,56.9,58.9,T);
 if(fn===sLocke)museum('RICHARD ADAMS LOCKE','Reporter at The Sun','1800–1871',560,960,59.3,62.9,T,'r');
 if(fn===sAdmit){tag('WEEKS LATER',W/2,420,63.1,64.4,T);bigText([['IT WAS',90,PARCH],['MADE UP',120,GOLD]],64.5,66.1,T,760);}
 if(fn===sLetters){if(lt<2.4)tag('HE LAUGHED...',W/2,420,67.3,68.6,T);else tag('...THEN THE LETTERS CAME',W/2,420,69.1,72.2,T,{size:36});}
 if(fn===sArchive){archiveCard([['A HOAX FOR A HOAX'],'Writer Edgar Allan Poe said','Locke had copied his Moon story.','Nine years later, Poe printed','a hoax of his own: a fake','balloon flight across the ocean.'],72.6,T);outro(77.8,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 if(fn===sMoonTour)scopeIris(T,1);if(fn===sAim)scopeIris(T,ss(1.6,2.0,lt));
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
