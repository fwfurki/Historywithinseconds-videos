// ===== THE KENTUCKY MEAT SHOWER (Bath County, 1876) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
const LON=-83.7,LAT=38.15;
function rnd(s){let x=s;return()=>{x=(x*9301+49297)%233280;return x/233280;};}
const FLM=[];function flFree(){while(FLM.length){const m=FLM.pop();gl.deleteVertexArray(m.vao);gl.deleteBuffer(m.pb);gl.deleteBuffer(m.nb);gl.deleteBuffer(m.ib);}}
function lineC(P,a,b,r,c,o){const d=sub(b,a),L=Math.hypot(...d)||1e-4;draw(CYL,Object.assign({P,p:a,r:[Math.acos(clamp(d[1]/L,-1,1)),Math.atan2(d[0],d[2]),0],s:[r,L,r],c:c||[.15,.12,.1],noShadow:1},o||{}));}
function camPlaque(e,tg,dist,dx,dy,k,val,dig,cap){const f=norm(sub(tg,e));const r=norm(cross(f,[0,1,0]));const u=cross(r,f);const p=[e[0]+f[0]*dist+r[0]*dx+u[0]*dy,e[1]+f[1]*dist+r[1]*dx+u[1]*dy,e[2]+f[2]*dist+r[2]*dx+u[2]*dy];
 const d=sub(e,p);const yaw=Math.atan2(d[0],d[2]);const pit=Math.atan2(d[1],Math.hypot(d[0],d[2]));plaque3D(cxf(xf(p,[0,yaw,0]),xf([0,0,0],[-pit,0,0])),val,dig,cap,k);}
tree=function(P,k,c,type){k=k||1;type=type||'broad';const v=Math.abs(Math.round((P.M[12]*7.3+P.M[14]*3.1)))%3;const tc=c||(type==='pine'?[.2,.42,.24]:[.34,.56,.26]);
 const key=type+v;const def=treeDef(type,v*3+1);
 const tm=propMesh('trunk'+key,trunkSDF(def),[-2,-.06,-2],[2,def.trunkH+1.8,2],.035);draw(tm,{P,s:[k,k,k],c:[.4,.28,.17],pat:2,patS:7});
 const cm=propMesh('can'+key,canopySDF(def,v*1.7),type==='pine'?[-1.5,.8,-1.5]:[-2.4,1.0,-2.4],type==='pine'?[1.5,4.6,1.5]:[2.4,4.0,2.4],.05);draw(cm,{P,s:[k,k,k],c:tc});};
// ---------- environments (early spring, bright clear sky) ----------
const DAY={sky:[.8,.84,.9],gnd:[.5,.48,.42],sunC:[.86,.8,.68],sunD:[-.45,.78,.45],fog:[.82,.88,.95],fogD:.0035,skyTop:[.24,.5,.9],clouds:0,toon:.15};
const D=o=>Object.assign({},DAY,o);
const LAB=o=>Object.assign({noSky:1,sky:[.82,.76,.66],gnd:[.44,.36,.28],sunC:[.62,.56,.46],sunD:[-.3,.8,.5],fog:[.42,.36,.3],fogD:.018,plC:[.95,.82,.6],plR:9,toon:.12},o);
const SPACE={bg:[.04,.07,.13],fog:[.04,.07,.13],fogD:0,sky:[.9,.9,.95],gnd:[.5,.5,.56],sunC:[.55,.52,.48],sunD:[.8,.3,.5],ink:.8,inkFar:50};
const MEAT=[.82,.32,.32],MEATD=[.66,.2,.22],FAT=[.95,.82,.76];
// ---------- terrain: rolling Kentucky hills ----------
let GK='';
function farmHF(x,z){const r=Math.hypot(x,z);const far=ss(25,70,r);return ss(14,24,r)*.3*Math.sin(x*.09)*Math.cos(z*.08)+far*(2.5*Math.sin(x*.035+1)*Math.cos(z*.03)+2.4);}
function farm(o){o=o||{};if(GK!=='F'){setGrid(-130,130,-150,90,farmHF);GK='F';}draw(GRID,{c:o.grass||[.5,.64,.32],pat:1,patS:1.2});
 // farmhouse + barn
 house(xf([-7,groundY(farmHF,-7,-6,7,6),-6],[0,.15,0]),{w:7,d:6,floors:2,style:'wood',wall:[.92,.9,.84],roof:[.35,.3,.3],trim:[.4,.3,.2],door:true});
 house(xf([9,groundY(farmHF,9,-10,8,9),-10],[0,-.3,0]),{w:8,d:9,floors:2,style:'wood',wall:[.66,.2,.16],roof:[.32,.32,.34],trim:[.95,.92,.86],door:true});
 // split-rail fence around the yard
 fence(xf([-8,0,3.5]),10,{c:[.58,.46,.34]});fence(xf([4.5,0,3.5]),8,{c:[.58,.46,.34]});
 // soap corner: kettle on a tripod + table
 kettle(xf([-2,farmHF(-2,1),1]),o.fire!==false);
 table(xf([-.3,farmHF(-.3,1.5),1.5],[0,.3,0]),1.2,.6);
 barrel(xf([-4,farmHF(-4,.5),.5]));crate(xf([-4.6,farmHF(-4.6,1.4),1.4]));cart(xf([4.5,farmHF(4.5,-2),-2],[0,.9,0]));
 road(-60,9,60,7,3.2,farmHF,[.62,.55,.42]);
 const r=rnd(7);for(let i=0;i<26;i++){const a=r()*6.28,d=24+r()*40;const x=Math.cos(a)*d,z=Math.sin(a)*d*.8-10;if(z>14&&Math.abs(x)<20)continue;tree(xf([x,farmHF(x,z)-.1,z]),1.1+r()*.6,null,i%4?'broad':'pine');}
 for(let i=0;i<7;i++){const x=-18+i*6,z=12+(i%2);bush(xf([x,farmHF(x,z),z]),.6,[.34,.54,.26]);}
 cow(xf([16,farmHF(16,6),6],[0,-1.2,0]));cow(xf([19,farmHF(19,9),9],[0,-2.2,0]),[.3,.24,.2]);}
function kettle(P,fire){for(let i=0;i<3;i++){const a=i/3*6.28;lineC(P,[Math.cos(a)*.6,0,Math.sin(a)*.6],[0,1.5,0],.025,[.3,.22,.14]);}
 lineC(P,[0,1.5,0],[0,1.05,0],.008,[.2,.2,.2]);draw(SPH,{P,p:[0,.75,0],s:[.38,.32,.38],c:[.12,.12,.13],g:.5});draw(CYL,{P,p:[0,.95,0],s:[.36,.06,.36],c:[.1,.1,.11]});
 draw(CYL,{P,p:[0,1.0,0],s:[.3,.01,.3],c:[.85,.8,.62],noInk:1});
 for(let i=0;i<5;i++){const a=i*1.3;lineC(P,[Math.cos(a)*.3,.04,Math.sin(a)*.3],[-Math.cos(a)*.3,.08,-Math.sin(a)*.3],.04,[.38,.26,.16]);}
 if(fire){for(let i=0;i<6;i++){const ph=(TIME*1.6+i/6)%1;draw(CONE,{P,p:[Math.sin(i*2)*.12,.15+ph*.2,Math.cos(i*2)*.12],s:[.1*(1-ph),.3*(1-ph)+.05,.1*(1-ph)],c:[1,.55+.3*ph,.15],u:1,noInk:1,noShadow:1});}
}}
function table(P,w,d,c){c=c||[.55,.4,.25];draw(BOX,{P,p:[0,.76,0],s:[w,.07,d],c,pat:2,patS:2});for(const x of[-w/2+.08,w/2-.08])for(const z of[-d/2+.08,d/2-.08])draw(BOX,{P,p:[x,.38,z],s:[.07,.76,.07],c:mix3(c,[0,0,0],.2)});}
// ---------- meat flakes ----------
function flake(P,k,i){const c=i%3?MEAT:MEATD;draw(SPH,{P,s:[.028*k,.007*k,.02*k],r:[0,i,0],c,noInk:1,g:.5});draw(SPH,{P,p:[.016*k*Math.cos(i*2.1),.001*k,.014*k*Math.sin(i*2.1)],s:[.018*k,.006*k,.012*k],r:[0,i*1.7,0],c:mix3(c,[.4,.05,.08],.25),noInk:1,g:.5});draw(SPH,{P,p:[-.014*k*Math.cos(i*1.3),.001*k,-.012*k*Math.sin(i*1.3)],s:[.014*k,.006*k,.01*k],r:[0,i*.7,0],c,noInk:1});if(i%2)draw(SPH,{P,p:[.006*k,.004*k,.003*k],s:[.01*k,.004*k,.006*k],r:[0,i,0],c:FAT,noInk:1});}
// falling flakes in a box around c: size [sx,sy,sz]; dens 0..1
function fall(c,sx,sy,sz,n,dens,k,seed){const r=rnd(seed||5);for(let i=0;i<n;i++){const fx=r(),fz=r(),off=r(),sp=.8+r()*.5;if(r()>dens)continue;const y=c[1]+sy-((off*sy+TIME*sp*1.6)%sy);
  const x=c[0]+(fx-.5)*sx+Math.sin(TIME*1.3+i)*.15,z=c[2]+(fz-.5)*sz;draw(SPH,{p:[x,y,z],r:[TIME*2+i,i,TIME*1.5],s:[.03*k,.008*k,.022*k],c:i%3?MEAT:MEATD,noInk:1,noShadow:1});draw(SPH,{p:[x+.012*k,y,z+.01*k],r:[TIME*2+i,i+1,TIME*1.5],s:[.016*k,.007*k,.014*k],c:MEATD,noInk:1,noShadow:1});}}
// flakes lying on the ground in a rect (amount 0..1)
function lying(c,sx,sz,n,amt,k,hf,seed){const r=rnd(seed||9);const m=Math.floor(n*amt);for(let i=0;i<m;i++){const x=c[0]+(r()-.5)*sx,z=c[2]+(r()-.5)*sz;const y=(hf?hf(x,z):c[1])+.01;flake(xf([x,y,z],[0,r()*6,0]),k*(.7+r()*.6),i);}}
// ---------- animals ----------
const VB=[.13,.11,.1],VF=[.5,.48,.46],VH=[.78,.24,.2],VK=[.93,.9,.82];
function vultSDF(){return(x,y,z)=>{let d=SD.ell(x,y,z,[0,0,0],[.14,.13,.3]);d=SD.smin(d,SD.ell(x,y,z,[0,.05,.22],[.09,.1,.11]),.06);d=SD.smin(d,SD.ell(x,y,z,[0,-.03,-.42],[.09,.025,.2]),.05);return d;};}
function vwingSDF(){return(x,y,z)=>{let d=SD.rc(x,y*6,z,[.1,0,0],[.75,0,-.05],.2,.15)/6;return d;};}
function vulture(P,o){o=o||{};const g=o.gold||0;const m=propMesh('vult',vultSDF(),[-.2,-.2,-.55],[.2,.2,.4],.012);draw(m,{P,c:VB,gold:g});
 const FX=Object.assign({},P,{noInk:1});
 // neck + bare red head + ivory hooked beak
 lineC(P,[0,.08,.3],[0,.12,.4],.04,VB,{gold:g});draw(SPH,{P,p:[0,.13,.45],s:[.05,.05,.07],c:VH,gold:g});draw(CONE,{P,p:[0,.12,.53],r:[Math.PI/2+.4,0,0],s:[.022,.07,.02],c:VK,gold:g});
 for(const sd of[-1,1])draw(SPHL,{P:FX,p:[sd*.035,.15,.48],s:[.009,.009,.009],c:[.05,.04,.04]});
 const fly=o.fly||0;
 if(!fly){for(const sd of[-1,1]){draw(SPH,{P,p:[sd*.13,.03,-.05],r:[-.15,0,0],s:[.06,.12,.34],c:[.17,.14,.12],gold:g*.4});lineC(P,[sd*.06,-.12,0],[sd*.07,-.36,.02],.014,[.85,.8,.75]);}
  draw(SPH,{P,p:[0,.02,-.2],r:[-.3,0,0],s:[.08,.03,.2],c:VB});}
 else{const wm=propMesh('vwing',vwingSDF(),[-.1,-.06,-.3],[.98,.06,.22],.012);const fl=Math.sin(o.flap||0)*.5*(o.flapA===undefined?1:o.flapA)+(o.dihedral||.12);
  for(const sd of[-1,1]){const W1=cxf(P,xf([sd*.12,.05,0],[0,0,sd*fl]));const R=sd<0?[0,Math.PI,0]:[0,0,0];draw(wm,{P:W1,r:R,s:[.6,1,1],c:VB,gold:g});
   const W2=cxf(W1,xf([sd*.45,0,0],[0,0,sd*fl*.5]));draw(wm,{P:W2,r:R,s:[.65,.9,.95],c:VF,gold:g*.5});
   for(let f=0;f<4;f++)draw(BOX,{P:W2,p:[sd*(.5+f*.015),0,.05-f*.07],r:[0,sd*(.25-f*.12),0],s:[.24,.008,.035],c:VF,noInk:1});}}}
function flyP(pos,vel,bank){const yaw=Math.atan2(vel[0],vel[2]);const pit=-Math.atan2(vel[1],Math.hypot(vel[0],vel[2]));return xf(pos,[pit,yaw,bank||0]);}
function sheepSDF(){return(x,y,z)=>{let d=SD.ell(x,y,z,[0,.62,0],[.34,.3,.48]);d+=(vnoise3(x*14,y*14,z*14)-.5)*.05;d=SD.smin(d,SD.ell(x,y,z,[0,.75,.48],[.12,.13,.17]),.06);
 for(const sd of[-1,1])for(const zz of[.28,-.3])d=SD.smin(d,SD.rc(x,y,z,[sd*.15,.45,zz],[sd*.15,.02,zz],.06,.045),.04);return d;};}
function sheep(P,g){const m=propMesh('sheep',sheepSDF(),[-.42,-.02,-.56],[.42,.95,.68],.016);draw(m,{P,c:[.95,.93,.88],gold:g});draw(SPH,{P,p:[0,.76,.6],s:[.1,.1,.11],c:[.18,.16,.15],gold:g*.3});
 for(const sd of[-1,1]){draw(SPH,{P,p:[sd*.12,.8,.52],s:[.07,.025,.04],c:[.2,.18,.16],noInk:1});draw(SPHL,{P:Object.assign({},P,{noInk:1}),p:[sd*.06,.82,.67],s:[.015,.015,.012],c:[.02,.02,.02]});}}
function deerSDF(){return(x,y,z)=>{let d=SD.ell(x,y,z,[0,1.0,0],[.22,.24,.55]);d=SD.smin(d,SD.rc(x,y,z,[0,1.1,.45],[0,1.45,.62],.12,.09),.08);d=SD.smin(d,SD.ell(x,y,z,[0,1.5,.7],[.09,.1,.17]),.05);
 for(const sd of[-1,1])for(const zz of[.38,-.4]){d=SD.smin(d,SD.rc(x,y,z,[sd*.12,.9,zz],[sd*.12,.5,zz+(zz>0?.02:-.05)],.07,.04),.05);d=SD.smin(d,SD.rc(x,y,z,[sd*.12,.5,zz+(zz>0?.02:-.05)],[sd*.12,.02,zz],.035,.03),.02);}
 for(const sd of[-1,1])d=SD.smin(d,SD.ell(x,y,z,[sd*.1,1.6,.62],[.07,.03,.05]),.02);return d;};}
function deer(P,g){const m=propMesh('deer',deerSDF(),[-.32,-.02,-.62],[.32,1.72,.9],.018);draw(m,{P,c:[.62,.42,.26],gold:g});draw(SPH,{P,p:[0,1.47,.87],s:[.04,.035,.03],c:[.1,.08,.08],noInk:1});
 for(const sd of[-1,1]){lineC(P,[sd*.05,1.6,.66],[sd*.22,1.95,.6],.016,[.82,.74,.6],{gold:g});lineC(P,[sd*.15,1.8,.62],[sd*.1,2.0,.72],.012,[.82,.74,.6],{gold:g});lineC(P,[sd*.2,1.9,.6],[sd*.3,2.05,.55],.012,[.82,.74,.6],{gold:g});
  draw(SPHL,{P:Object.assign({},P,{noInk:1}),p:[sd*.075,1.55,.78],s:[.016,.016,.012],c:[.03,.02,.02]});}draw(SPH,{P,p:[0,1.1,-.56],s:[.06,.08,.05],c:[.95,.92,.86],noInk:1});}
// ---------- people ----------
const _person=person;person=function(P,o,G){_person(G&&G.gold?cxf(P,xf([0,0,0]),{gold:G.gold}):P,o);};
const CROUCH={dress:[.36,.42,.6],apron:[.94,.92,.86],shirt:[.95,.93,.88],coat:[.36,.42,.6],sleeve:[.36,.42,.6],hair:HAIRS[2],hairStyle:'bun',shoes:[.25,.18,.12],seed:41,female:1};
const MAN=i=>({coat:[[.42,.34,.24],[.3,.36,.3]][i],shirt:[.92,.9,.84],pants:[[.3,.26,.22],[.24,.22,.26]][i],hat:i?'flat':'bowler',hatc:[.3,.22,.16],beard:i?0:1,moustache:1,jacket:i?false:true,hair:HAIRS[i],seed:51+i*7});
const SCI=i=>({coat:[[.14,.14,.18],[.2,.18,.16],[.16,.18,.24]][i%3],shirt:[.95,.94,.9],tie:[.1,.1,.12],pants:[.16,.16,.18],hat:'bowler',hatc:[.08,.08,.09],longcoat:1,moustache:1,beard:i==1?1:0,hair:HAIRS[(i+1)%4],seed:61+i});
// ===================== SCENES =====================
function stars(n,R){const r=rnd(3);for(let i=0;i<(n||90);i++){const a=r()*6.28,e=(r()-.3)*1.4;draw(SPHL,{p:[Math.cos(a)*Math.cos(e)*R,Math.sin(e)*R+10,Math.sin(a)*Math.cos(e)*R],s:[.12,.12,.12].map(v=>v*R/60),c:[1,1,1],u:1,id:0,noShadow:1});}}
function sGlobe(t){const k=ease(ss(0,2.2,t));env({...SPACE,eye:[0,0,lerp(5.6,2.9,k)],tgt:[0,0,0],fov:40});globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.4,ss(1.0,1.6,t));stars(80,40);}
// 1. clear sky: look up through a tree, tilt down to the farm
function sSky(t){const k=ease(ss(0,3.3,t));const E=[lerp(-1,1.5,k),lerp(1.4,2.6,k),lerp(17,15,k)];const TG=[lerp(-1,-2,k),lerp(16,2,ease(ss(.2,3.2,t))),lerp(0,0,k)];
 env(D({eye:E,tgt:TG,fov:52,shadow:{c:[0,0,0],r:24}}));farm();tree(xf([2.5,0,12]),1.6,null,'broad');tree(xf([-4.5,0,11]),1.4,null,'broad');}
// 2. the first flakes land on the fence rail
function sFirst(t){const k=ease(ss(0,1.6,t));const E=[lerp(-3.4,-3.1,k),lerp(1.45,1.35,k),lerp(5.6,5.0,k)],TG=[-2.6,1.0,3.5];env(D({eye:E,tgt:TG,fov:42,dof:[Math.hypot(...sub(E,TG)),1.4],shadow:{c:TG,r:4}}));farm();
 fall([-2.6,0,3.8],5,4,3,90,1,1.4,3);lying([-2.6,0,3.6],5,3,40,ss(0,1.6,t),1.2,farmHF,4);for(let i=0;i<4;i++)flake(xf([-3.5+i*.5,1.1,3.5]),1.4,i);}
// 3. museum plinth: Mrs Crouch
function plinth(fig,t,o){o=o||{};const a=(o.a0||.6)+t*.2;env({noSky:1,sky:[.66,.62,.58],gnd:[.34,.3,.26],sunC:[.58,.52,.46],sunD:[-.3,.8,.6],fog:[.22,.2,.22],fogD:.014,eye:[Math.sin(a)*o.r,o.h,Math.cos(a)*o.r],tgt:[0,o.ty,0],fov:40,dof:[Math.hypot(o.r,o.h-o.ty),o.r*.4],plP:[1.5,5,3],plC:[.95,.82,.58],plR:14,desat:.12});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.6,.56,.5],pat:6,patS:1.5,g:.3});
 for(let i=-3;i<=3;i++){draw(CYL,{p:[i*3.2,0,-8],s:[.45,7,.45],c:[.86,.84,.78],pat:6,patS:2});draw(BOX,{p:[i*3.2,7,-8],s:[1.2,.3,1.2],c:[.8,.78,.72]});}
 draw(BOX,{p:[0,3.5,-9.5],s:[30,9,.3],c:[.3,.38,.36],pat:6,patS:1});
 const pr=o.pr||.8,ph=o.ph||.8;draw(CYL,{p:[0,0,0],s:[pr,ph,pr],c:[.86,.83,.78],pat:6,patS:3,g:.3});draw(CYL,{p:[0,ph,0],s:[pr*1.1,.12,pr*1.1],c:[.92,.9,.86],pat:6,patS:3,g:.3});draw(CYL,{p:[0,0,0],s:[pr*1.12,.1,pr*1.12],c:[.7,.66,.6]});
 fig(cxf(xf([0,ph+.12,0],[0,-t*.3,0]),xf([0,0,0]),{gold:o.gold||1}),t);
 // a few flakes drifting down over the exhibit
 for(let i=0;i<14;i++){const y=4-((i*.37+t*.5)%3.2);draw(SPH,{p:[Math.sin(i*2.1)*1.1,y,Math.cos(i*1.7)*1.1],r:[t*2+i,i,t],s:[.03,.008,.025],c:MEAT,noInk:1,noShadow:1});}}
function sCrouch(t){plinth((P,tt)=>{person(P,Object.assign({},CROUCH,{armR:[-.9,0,.25],elbowR:1.2,armL:[-.2,0,-.15],elbowL:.4,head:[-.15,.2,0]}));lineC(P,[.32,1.05,.35],[.5,.15,.5],.02,[.55,.4,.25]);},t,{r:3.2,h:1.9,ty:1.65,a0:.4,gold:.25});}
// 4. the yard: stirring soap, flakes start falling, she looks up
function sYard(t){const k=ease(ss(0,2.7,t));const E=[lerp(-.4,-.9,k),lerp(1.5,1.35,k),lerp(4.6,4.0,k)],TG=[-2.7,lerp(1.3,1.6,k),1.3];env(D({eye:E,tgt:TG,fov:44,shadow:{c:[-2,0,1],r:6}}));farm();
 const up=ss(.9,1.8,t);const st=Math.sin(t*3)*(1-up);
 person(xf([-3.0,0,1.5],[0,.75,0]),Object.assign({},CROUCH,{armR:[-.9+st*.2,0,.3],elbowR:1.0-up*.4,armL:[-.8+st*.2,0,-.2],elbowL:1.1,head:[-.5*up,0,0],worry:up,mouthO:up*.6}),{gold:1});
 
 fall([-1.5,0,1.5],6,5,5,120,ss(0,1.2,t),1.2,7);lying([-1.5,0,1.5],7,6,80,ss(.3,2.7,t),1.1,farmHF,8);}
// 5. size: a flake on the soap table next to a ruler
const RUL=document.createElement('canvas');RUL.width=1024;RUL.height=128;(()=>{const g=RUL.getContext('2d');g.fillStyle='#e8cf8e';g.fillRect(0,0,1024,128);g.fillStyle='#2a1c0e';
 for(let i=0;i<=48;i++){const x=12+i*20.8;const L=i%8==0?60:i%4==0?42:i%2==0?30:20;g.fillRect(x,0,3,L);if(i%8==0&&i>0){g.font='700 40px Montserrat';g.textAlign='center';g.fillText(String(i/8),x,104);}}})();
function sSize(t){const k=ease(ss(0,2.2,t));const E=[lerp(.35,.18,k),lerp(1.35,1.18,k),lerp(2.15,1.9,k)],TG=[-.3,.8,1.5];env(D({eye:E,tgt:TG,fov:38,dof:[Math.hypot(...sub(E,TG)),.5],shadow:{c:TG,r:1.5}}));farm({fire:true});
 useTex('ruler',RUL);draw(BOX,{p:[-.3,.805,1.62],r:[0,.3,0],s:[.6,.012,.075],c:[.85,.7,.4]});draw(QUAD,{p:[-.3,.812,1.62],r:[-Math.PI/2,0,.3],s:[.6,.075,1],c:[1,1,1],tex:3,u:1});
 // soap bars
 for(let i=0;i<3;i++)draw(BOX,{p:[-.62+i*.13,.82,1.36],r:[0,.3,0],s:[.1,.05,.07],c:[.92,.88,.7]});
 const land=ss(.1,.9,t);flake(xf([-.26,lerp(1.6,.816,land),1.48],[0,.6+t*.2*(1-land),0]),3.4,1);
 if(t>.8)camPlaque(E,TG,1.0,0,.22,.12,Math.round(2*ease(ss(.8,1.6,t))),1,'INCHES');}
// 6. aerial: a strip of land covered in meat, ~100 x 50 yards
function sStrip(t){const k=ease(ss(0,5.6,t));const E=[lerp(-10,-22,k),lerp(10,44,k),lerp(-14,-30,k)],TG=[lerp(-4,0,k),0,lerp(22,32,k)];env(D({eye:E,tgt:TG,fov:46,far:900,shadow:{c:[0,0,0],r:60}}));farm();
 const a=ss(.3,3.5,t);const L=91*a,Wd=46*a;const SC=[0,0,36];
 lying(SC,L,Wd,900,1,7,farmHF,12);if(a>0)draw(BOX,{p:[0,farmHF(0,36)+.05,36],s:[L,.03,Wd],c:[.85,.4,.36],a:.35,u:1,noShadow:1,noInk:1});
 // gold boundary
 for(const[px,pz,sx,sz]of[[0,36-Wd/2,L,.3],[0,36+Wd/2,L,.3],[-L/2,36,.3,Wd],[L/2,36,.3,Wd]])if(a>.05)draw(BOX,{p:[px,farmHF(px,pz)+.12,pz],s:[sx,.08,sz],c:[1,.75,.2],gold:1,u:1,noShadow:1});}
// 7. two men come to look
function sMen(t){const k=ease(ss(0,4.6,t));const E=[lerp(2.6,2.0,k),lerp(1.7,1.5,k),lerp(.2,1.4,k)],TG=[lerp(-2,-1.2,k),1.0,5.4];env(D({eye:E,tgt:TG,fov:44,shadow:{c:[0,0,3],r:8}}));farm();
 lying([-1,0,3],14,10,160,1,1.1,farmHF,8);
 for(let i=0;i<2;i++){const s=ss(0,2.6+i*.3,t);const x=lerp(-7-i*1.2,-1.6+i*.9,s),z=lerp(9.5,5.2+i*.3,s);const bend=ss(2.8,3.6,t)*(i==0?1:.4);
  person(xf([x,farmHF(x,z),z],[0,s<1?2.2:2.9-i*.6,0]),Object.assign(MAN(i),{walk:s<1?1:0,phase:t*6.4+i*2,lean:.55*bend,armR:[-.6*bend-.1,0,.15],elbowR:.3,head:[.45*bend,0,0]}),{gold:i==0?ss(2.8,3.4,t):0});}
 if(t>3.4){const p=lerp(0,1,ss(3.4,4.4,t));flake(xf([-1.75,lerp(.02,.95,p),4.75]),1.6,1);}}
// 8. the taste: close-up, then MUTTON? (sheep) / VENISON? (deer)
function sTaste(t){const k=ease(ss(0,4.9,t));const E=[lerp(1.3,1.9,k),lerp(1.65,1.8,k),lerp(4.9,5.9,k)],TG=[lerp(.5,.7,k),lerp(1.5,1.7,k),3.0];env(D({eye:E,tgt:TG,fov:44,dof:[Math.hypot(...sub(E,TG)),1.8],shadow:{c:[0,0,3],r:6}}));farm();
 const bite=ss(.2,1.0,t)*(1-ss(1.4,1.9,t));const chew=t>1.0&&t<3?Math.abs(Math.sin(t*9))*.4:0;
 person(xf([.4,farmHF(.4,3),3.0],[0,.5,0]),Object.assign(MAN(0),{armR:[-2.2*bite-.2,0,.45*bite+.1],elbowR:2.0*bite+.2,head:[-.05,0,0],mouthO:chew+bite*.5}),{gold:.7});
 person(xf([1.4,farmHF(1.4,3.4),3.4],[0,-.5,0]),Object.assign(MAN(1),{armR:[-.2,0,.1],elbowR:.4,head:[.1,-.5,0],worry:.6}));
 if(bite>.05)flake(cxf(xf([.4,farmHF(.4,3),3.0],[0,.5,0]),xf([.12,lerp(.9,1.62,bite),lerp(.15,.2,bite)])),1.3,1);
 // the verdict "thought" exhibits
 const sA=ease(ss(2.3,2.8,t)),dA=ease(ss(3.7,4.2,t));
 if(sA>0){const P=xf([-.5,lerp(-1,2.25,sA),2.0],[0,1+t*.4,0]);draw(CYL,{P,p:[0,-.08,0],s:[.42,.08,.42],c:[.9,.86,.78],pat:6});sheep(cxf(P,xf([0,0,0],[0,0,0],.6)),1);}
 if(dA>0){const P=xf([.95,lerp(-1,2.3,dA),1.5],[0,-1-t*.4,0]);draw(CYL,{P,p:[0,-.08,0],s:[.42,.08,.42],c:[.9,.86,.78],pat:6});deer(cxf(P,xf([0,0,0],[0,0,0],.38)),1);}}
// 9. the newspaper spins onto the desk
const NEWS=document.createElement('canvas');NEWS.width=640;NEWS.height=860;(()=>{const g=NEWS.getContext('2d');g.fillStyle='#ece4cf';g.fillRect(0,0,640,860);g.fillStyle='#1c1a18';g.textAlign='center';
 g.font='700 52px Cinzel';g.fillText('THE DAILY NEWS',320,78);g.fillRect(30,98,580,4);g.font='600 22px Montserrat';g.fillText('NEW YORK · MARCH 1876',320,126);g.fillRect(30,140,580,2);
 g.font='900 70px Montserrat';g.fillText('FLESH FELL',320,226);g.fillText('FROM THE SKY',320,302);g.font='600 30px Montserrat';g.fillText('Kentucky farm covered in meat',320,352);
 g.fillStyle='#8aa0b8';g.fillRect(60,385,250,220);g.fillStyle='#c25050';for(let i=0;i<30;i++)g.fillRect(70+(i*53)%230,395+(i*37)%200,10,6);g.fillStyle='#5a4c3a';g.fillRect(60,560,250,45);
 g.fillStyle='#4a4136';for(let i=0;i<10;i++)g.fillRect(330,395+i*22,250-(i%3)*30,9);for(let i=0;i<9;i++)g.fillRect(60,640+i*22,520-(i%4)*40,9);})();
function paper(P,canvas,key,w,h){useTex(key,canvas);draw(BOX,{P,p:[0,-.004,0],s:[w,.006,h],c:[.9,.86,.78]});draw(QUAD,{P,p:[0,.001,0],r:[-Math.PI/2,0,0],s:[w,h,1],c:[1,1,1],tex:3,u:1});}
function office(){draw(BOX,{p:[0,-.5,0],s:[12,1,12],c:[.45,.3,.2],pat:2,patS:2});draw(BOX,{p:[0,2,-1.4],s:[8,4,.1],c:[.5,.56,.48],pat:6,patS:1});
 draw(BOX,{p:[1.6,2.0,-1.32],s:[1.2,1.6,.05],c:[.95,.93,.88]});draw(BOX,{p:[1.6,2.0,-1.28],s:[1.05,1.45,.03],c:[.64,.8,.94]});table(xf([0,0,0]),1.6,.9,[.4,.25,.14]);
 draw(CYL,{p:[-.55,.81,-.25],s:[.06,.02,.06],c:[.2,.2,.22]});lineC(xf([0,0,0]),[-.55,.82,-.25],[-.48,1.0,-.2],.006,[.9,.9,.9]);draw(CYL,{p:[.6,.81,-.2],s:[.08,.18,.08],c:[.85,.68,.3],g:.7});}
function sPaper(t){const k=ease(ss(0,2.1,t));const E=[lerp(.4,.05,k),lerp(1.9,1.55,k),lerp(1.0,.55,k)],TG=[0,.8,.02];env(LAB({eye:E,tgt:TG,fov:44,plP:[.5,2.2,.8],shadow:{c:[0,0,0],r:2}}));office();
 const s=ease(ss(0,.9,t));paper(xf([0,lerp(1.5,.81,s),lerp(-.2,.02,s)],[lerp(1.2,0,s),lerp(6,0,s),0]),NEWS,'news',.4,.54);}
// 10. scientists arrive and collect samples
function sSci(t){const k=ease(ss(0,1.7,t));const E=[lerp(.6,1.2,k),lerp(1.6,1.5,k),lerp(1.0,1.8,k)],TG=[3,1.2,7.5];env(D({eye:E,tgt:TG,fov:44,shadow:{c:[2,0,5],r:8}}));farm();lying([0,0,4],16,8,160,1,1.1,farmHF,8);
 for(let i=0;i<3;i++){const s=ss(0,1.5+i*.15,t);const x=lerp(5+i*1.3,2.2+i*1.1,s),z=lerp(11,6.4+i*.5,s);const P=xf([x,farmHF(x,z),z],[0,-2.4,0]);
  person(P,Object.assign(SCI(i),{walk:s<1?1:0,phase:t*6.6+i,armL:[-.1,0,-.15],elbowL:.2}),{gold:i==1?.6:0});
  draw(BOX,{P,p:[-.32,.62,.02],s:[.14,.22,.3],c:[.32,.18,.1],g:.4});}}
// 11. algae theory: nostoc swells when wet
function sAlgae(t){const k=ease(ss(0,3.3,t));const E=[lerp(.55,.3,k),lerp(1.3,1.17,k),lerp(.9,.62,k)],TG=[0,.88,0];env(LAB({eye:E,tgt:TG,fov:40,dof:[Math.hypot(...sub(E,TG)),.4],plP:[.6,2,.6],shadow:{c:[0,0,0],r:1.5}}));office();
 draw(CYL,{p:[0,.81,0],s:[.16,.03,.16],c:[.85,.92,1],a:.35,u:1,noShadow:1});draw(CYL,{p:[0,.805,0],s:[.162,.006,.162],c:[.85,.92,1],g:.8});
 const sw=ss(.8,2.8,t);const sc=lerp(.05,.11,sw);draw(SPH,{p:[0,.82+sc*.25,0],s:[sc,sc*.45,sc*.9],c:mix3([.22,.3,.12],[.24,.5,.2],sw),gold:.3,g:.8});draw(SPH,{p:[.03,.83+sc*.3,.02],s:[sc*.5,sc*.3,sc*.45],c:[.3,.55,.24],noInk:1,g:.8});
 for(let i=0;i<5;i++){const ph=((t-.6)*1.2+i/5)%1;if(t<.6)continue;draw(SPH,{p:[.02*Math.sin(i),lerp(1.2,.86,ph),.01],s:[.012,.016,.012],c:[.6,.82,1],a:.8,u:1,noShadow:1,noInk:1});}
 lineC(xf([0,0,0]),[.04,1.24,0],[.12,1.42,.02],.012,[.85,.92,1],{a:.6,u:1});}
// 12. but there had been no rain: bright dry sun
function sNoRain(t){const k=ease(ss(0,1.7,t));const E=[lerp(-6,-3,k),1.6,lerp(10,11,k)],TG=[lerp(-2,2,k),lerp(4,7,k),-4];env(D({eye:E,tgt:TG,fov:50,shadow:{c:[0,0,0],r:20},bloom:1}));farm();lying([-1,0,2],18,12,150,1,1.1,farmHF,8);
 draw(SPH,{p:[30,60,-90],s:[5,5,5],c:[1,.92,.6],u:1,gold:.6,noShadow:1});}
// 13. the microscope
function scope(P){const B=[.78,.58,.24];draw(BOX,{P,p:[0,.02,0],s:[.28,.04,.22],c:[.15,.15,.17]});lineC(P,[0,.04,-.08],[0,.28,-.08],.025,B,{g:.8});lineC(P,[0,.26,-.08],[0,.3,.0],.03,B,{g:.8});
 lineC(P,[0,.42,.02],[0,.16,.02],.03,[.2,.2,.22],{g:.6});lineC(P,[0,.42,.02],[0,.5,.02],.02,B,{g:.9});draw(BOX,{P,p:[0,.13,.02],s:[.16,.012,.12],c:[.2,.2,.22]});draw(BOX,{P,p:[0,.14,.02],s:[.07,.004,.025],c:[.85,.92,1],a:.6,u:1});
 draw(SPH,{P,p:[0,.141,.02],s:[.012,.002,.01],c:MEAT,noInk:1});for(const sd of[-1,1])draw(CYL,{P,p:[sd*.05,.26,-.08],r:[0,0,Math.PI/2],s:[.03,.02,.03],c:B,g:.8});}
function sScope(t){const k=ease(ss(0,4.9,t));const E=[lerp(.8,.42,k),lerp(1.4,1.38,k),lerp(1.1,.6,k)],TG=[0,lerp(1.02,1.12,k),.02];env(LAB({eye:E,tgt:TG,fov:40,dof:[Math.hypot(...sub(E,TG)),.5],plP:[.6,2,.6],shadow:{c:[0,0,0],r:1.5}}));office();scope(cxf(xf([0,.8,0]),xf([0,0,0]),{gold:ss(0,1,t)*.6}));}
// 2D microscope view (overlay)
function lensView(T,t0,t1,kind){if(T<t0||T>t1)return;const a=Math.min(ss(t0,t0+.2,T),1-ss(t1-.2,t1,T));const x=W/2,y=900,R=330*a;cx.save();cx.beginPath();cx.arc(x,y,R,0,Math.PI*2);cx.save();cx.clip();
 cx.fillStyle='#f6e2df';cx.fillRect(x-R,y-R,2*R,2*R);const r=rnd(kind*7+3);
 if(kind==0){for(let i=0;i<40;i++){const px=x+(r()-.5)*2*R,py=y+(r()-.5)*2*R,rr=30+r()*36;cx.beginPath();cx.arc(px,py,rr,0,Math.PI*2);cx.fillStyle='#fbefed';cx.fill();cx.strokeStyle='#c4545e';cx.lineWidth=7;cx.stroke();}}
 else if(kind==1){cx.save();cx.translate(x,y);cx.rotate(-.35);for(let i=-12;i<12;i++){cx.fillStyle=i%2?'#c84a52':'#e7a0a2';cx.fillRect(-R*1.3,i*28,R*2.6,26);for(let j=-12;j<12;j++){cx.fillStyle='rgba(120,20,40,.35)';cx.fillRect(j*44,i*28,4,26);}}cx.restore();}
 else{cx.fillStyle='#dfe6ef';cx.fillRect(x-R,y-R,2*R,2*R);for(let i=0;i<26;i++){const px=x+(r()-.5)*2*R,py=y+(r()-.5)*2*R;cx.beginPath();cx.ellipse(px,py,26,20,r()*3,0,Math.PI*2);cx.fillStyle='#f6f8fb';cx.fill();cx.strokeStyle='#7b8fb0';cx.lineWidth=5;cx.stroke();cx.beginPath();cx.arc(px,py,8,0,Math.PI*2);cx.fillStyle='#8a5aa0';cx.fill();}}
 const g=cx.createRadialGradient(x,y,R*.6,x,y,R);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.5)');cx.fillStyle=g;cx.fillRect(x-R,y-R,2*R,2*R);cx.restore();
 cx.beginPath();cx.arc(x,y,R,0,Math.PI*2);cx.strokeStyle='#c9932c';cx.lineWidth=16;cx.stroke();cx.strokeStyle='#1b1712';cx.lineWidth=4;cx.beginPath();cx.arc(x,y,R+9,0,Math.PI*2);cx.stroke();cx.restore();}
// 14. who threw it? looking straight up into the empty sky
function sWho(t){const a=-.6+t*.25;const E=[1.2,.6,5.6];const TG=[1.2+Math.sin(a)*4,3.2,5.6-Math.cos(a)*4];env(D({eye:E,tgt:TG,fov:54,shadow:{c:[0,0,2],r:10}}));farm();
 person(xf([-.6,0,1.0],[0,.5,0]),Object.assign({},CROUCH,{head:[-.6,0,0],worry:1,mouthO:.5,armR:[-.2,0,.25],elbowR:.5,armL:[-.2,0,-.25],elbowL:.5}),{gold:.3});lying([0,0,3],10,8,120,1,1.1,farmHF,8);
 fall([1,1,3],10,10,8,140,1,1.6,21);}
// 15. vultures circling high above the farm
function circling(c,R,h,n,t,g,seed){for(let i=0;i<n;i++){const a=t*.45+i/n*6.28;const rr=R*(.7+.3*Math.sin(i*1.7));const p=[c[0]+Math.cos(a)*rr,h+Math.sin(i*2.3)*2.5,c[2]+Math.sin(a)*rr];
 vulture(cxf(flyP(p,[-Math.sin(a),0,Math.cos(a)],-.35),xf([0,0,0],[0,0,0],2.2)),{fly:1,flap:t*3+i,flapA:.25,dihedral:.18,gold:g});}}
function sReveal(t){const k=ease(ss(0,3.6,t));const E=[lerp(-4,-6,k),lerp(2,3,k),lerp(12,16,k)],TG=[0,lerp(5,13,ease(ss(.3,2.4,t))),-2];env(D({eye:E,tgt:TG,fov:50,shadow:{c:[0,0,0],r:20}}));farm();
 circling([0,0,-2],12,21,7,t,ss(1.5,2.6,t));}
// 16. a startled vulture throws up and takes off lighter
function sExplain(t){const k=ease(ss(0,5,t));const PP=[3.8,farmHF(3.8,3.6),3.6];const tk0=ss(2.3,4.8,t);const E=[PP[0]+lerp(2.2,3.4,k),PP[1]+1.6+tk0*1.6,PP[2]+lerp(3.4,3.8,k)],TG=[PP[0]+tk0*tk0*1.2-.4,PP[1]+1.5+tk0*2.0,PP[2]-tk0*1.0];
 env(D({eye:E,tgt:TG,fov:42,dof:[Math.hypot(...sub(E,TG)),2],shadow:{c:PP,r:5}}));farm();
 lineC(xf(PP),[0,0,0],[0,1.4,0],.08,[.5,.38,.26],{pat:2,patS:6});
 const startle=ss(.4,.8,t),tk=ss(2.3,4.8,t);
 // a dog bounds in from the left to startle it
 const wv=ss(.2,.6,t);const mx=lerp(-3.2,-1.6,ss(0,.9,t));person(xf([PP[0]+mx,farmHF(PP[0]+mx,PP[2]+1.6),PP[2]+1.6],[0,1.3,0]),Object.assign(MAN(1),{walk:t<.9?1:0,phase:t*7,armR:[-2.6*wv,0,.3],elbowR:.3,armL:[-2.6*wv,0,-.3],elbowL:.3,mouthO:wv}));
 const vp=[PP[0]+tk*tk*1.2,PP[1]+1.62+tk*2.0,PP[2]-tk*1.0];
 if(tk<.02)vulture(cxf(xf(vp,[0,-1.9+startle*.5,0]),xf([0,0,0],[0,0,0],1.3)),{gold:.35});
 else vulture(cxf(flyP(vp,[1,1.2,-1],.1),xf([0,0,0],[0,0,0],1.3)),{fly:1,flap:t*12,gold:.5});
 // the dropped meal falls (small, non-graphic red chunks)
 const dr=ss(1.2,2.4,t);if(dr>0){for(let i=0;i<5;i++){const y=lerp(PP[1]+1.8,PP[1]+.03,ease(ss(1.2+i*.06,2.0+i*.06,t)));flake(xf([PP[0]+.25+i*.06,y,PP[2]+.15+(i%2)*.1],[0,i,0]),2,i);}}}
// 17. the whole flock overhead, meat raining down on the farm
function sFlock(t){const k=ease(ss(0,4.7,t));const E=[lerp(-3,-8,k),lerp(1.6,6,k),lerp(14,26,k)],TG=[0,lerp(10,8,k),0];env(D({eye:E,tgt:TG,fov:50,shadow:{c:[0,0,0],r:24}}));farm();
 circling([0,0,0],9,18,9,t,.8);fall([0,0,1],22,18,16,320,1,3,33);lying([0,0,1],26,18,260,ss(0,4,t),2.2,farmHF,34);}
// 18. the jar in a university cabinet today
function jar(P,g){draw(CYL,{P,p:[0,0,0],s:[.14,.36,.14],c:[.85,.92,1],a:.3,u:1,noShadow:1});draw(CYL,{P,p:[0,.02,0],s:[.13,.28,.13],c:[.95,.9,.7],a:.35,u:1,noShadow:1});
 draw(CYL,{P,p:[0,.36,0],s:[.12,.06,.12],c:[.55,.4,.25],g:.4});draw(SPH,{P,p:[0,.14,0],s:[.07,.05,.05],r:[.3,.5,.2],c:MEATD,gold:g,noInk:1});draw(SPH,{P,p:[.03,.1,.02],s:[.04,.03,.03],c:[.88,.66,.6],gold:g,noInk:1});
 }
const JLAB=document.createElement('canvas');JLAB.width=256;JLAB.height=128;(()=>{const g=JLAB.getContext('2d');g.fillStyle='#f4ecd6';g.fillRect(0,0,256,128);g.fillStyle='#2a2118';g.textAlign='center';g.font='italic 700 34px DejaVu Serif';g.fillText('Olympia',128,52);g.fillText('Springs',128,96);})();
function cabinet(){draw(BOX,{p:[0,-.5,0],s:[20,1,20],c:[.5,.34,.22],pat:2,patS:1.5,g:.3});draw(BOX,{p:[0,2.5,-1.2],s:[10,5,.2],c:[.72,.66,.56],pat:6,patS:1});
 draw(BOX,{p:[0,.5,0],s:[1.6,1,.8],c:[.36,.22,.13],pat:2,patS:3});draw(BOX,{p:[0,1.02,0],s:[1.66,.04,.86],c:[.42,.27,.16]});
 for(const sx of[-.8,.8])for(const sz of[-.4,.4])draw(BOX,{p:[sx,1.5,sz],s:[.04,1,.04],c:[.62,.48,.24],g:.7});draw(BOX,{p:[0,2.0,0],s:[1.66,.05,.86],c:[.42,.27,.16]});
 
 for(let i=0;i<4;i++){const x=-3.6+i*.6;draw(BOX,{p:[x,2.6,-1.05],s:[.4,.6,.04],c:[[.55,.4,.3],[.4,.45,.55],[.6,.55,.4],[.45,.5,.4]][i]});}}
function sJar(t){const k=ease(ss(0,4.8,t));const a=.5-k*.7;const E=[Math.sin(a)*1.4,lerp(1.55,1.4,k),Math.cos(a)*1.4+.05],TG=[0,1.2,0];env(LAB({eye:E,tgt:TG,fov:40,dof:[Math.hypot(...sub(E,TG)),.6],plP:[.6,2.2,1],plC:[.7,.6,.45],fog:[.2,.17,.14],shadow:{c:[0,1,0],r:1.5}}));cabinet();
 jar(xf([0,1.04,0]),.5);useTex('jlab',JLAB);draw(QUAD,{p:[0,1.19,.075],s:[.1,.05,1],c:[1,1,1],tex:3,u:1});}
// 19. archive
function sArchive(t){env({noSky:1,sky:[.46,.42,.38],gnd:[.26,.22,.19],sunC:[.5,.42,.34],sunD:[-.3,.6,.7],fog:[.15,.13,.11],fogD:.03,eye:[lerp(.6,0,ease(ss(0,4,t))),1.95,lerp(5.5,4.4,ease(ss(0,4,t)))],tgt:[0,1.95,0],fov:44,plP:[0,2.5,2],plC:[.85,.65,.38],plR:7});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 draw(BOX,{p:[0,.9,1.2],s:[1.8,.06,.8],c:[.4,.26,.15]});for(const sx of[-.8,.8])draw(BOX,{p:[sx,.45,1.2],s:[.06,.9,.6],c:[.35,.22,.13]});
 jar(cxf(xf([0,.93,1.2],[0,.4+t*.15,0]),xf([0,0,0],[0,0,0],1.6)),.3);}
// ---------- timeline ----------
const S=[[0,2.6,sGlobe],[2.6,5.8,sSky],[5.8,7.4,sFirst],[7.4,10.3,sCrouch],[10.3,13.0,sYard],[13.0,15.25,sSize],[15.25,20.85,sStrip],[20.85,25.5,sMen],[25.5,30.4,sTaste],[30.4,32.4,sPaper],[32.4,34.2,sSci],[34.2,37.5,sAlgae],[37.5,39.2,sNoRain],[39.2,44.2,sScope],[44.2,47.25,sWho],[47.25,51.0,sReveal],[51.0,56.05,sExplain],[56.05,60.8,sFlock],[60.8,65.7,sJar],[65.7,73.6,sArchive]];
const END=73.6;
const RIB=[[2.7,0,'3 MARCH 1876'],[30.5,.15,'SPRING 1876'],[60.9,1,'TODAY']];
function overlays(T,fn,lt){
 badge('BATH COUNTY, KY','1876',LON,LAT,T,ss(2.4,3.0,T)*(1-ss(65.3,65.7,T)));
 ribbon(T,RIB,['1876','TODAY'],ss(2.6,3.0,T)*(1-ss(65.3,65.7,T)));
 if(fn===sGlobe)bigText([['1876',120,GOLD]],.3,2.55,T,560);
 seal(1,'THE SHOWER',7.45,T);seal(2,'THE TASTE',20.9,T);seal(3,'THE SCIENCE',39.25,T);seal(4,'THE ANSWER',47.3,T);
 if(fn===sSky)tag('NOT A CLOUD IN THE SKY',W/2,420,3.0,5.7,T,{size:36});
 if(fn===sFirst)tag('RED FLAKES FALLING',W/2,420,5.9,7.35,T,{size:38});
 if(fn===sCrouch)museum('MRS. CROUCH','Farm wife, making soap',null,560,960,8.4,10.2,T,'r');
 if(fn===sStrip)tag('≈ 100 × 50 YARDS COVERED',W/2,420,17.0,20.8,T,{size:34});
 if(fn===sMen)tag('TWO NEIGHBOURS',W/2,420,21.6,24.0,T,{size:38});
 if(fn===sTaste){tag('MUTTON?',300,760,27.9,30.35,T,{size:40});tag('VENISON?',780,760,29.3,30.35,T,{size:40});}
 if(fn===sSci)tag('SCIENTISTS TAKE SAMPLES',W/2,420,32.5,34.15,T,{size:34});
 if(fn===sAlgae)tag('THEORY: ALGAE (NOSTOC)',W/2,420,34.5,37.4,T,{size:34});
 if(fn===sNoRain)tag('BUT: NO RAIN THAT DAY',W/2,420,37.6,39.15,T,{size:36});
 if(fn===sScope){lensView(T,41.2,42.3,0);lensView(T,42.3,43.2,1);lensView(T,43.2,44.15,2);
  tag('LUNG TISSUE',W/2,1290-60,41.25,42.25,T,{size:38});tag('MUSCLE',W/2,1290-60,42.35,43.15,T,{size:38});tag('CARTILAGE',W/2,1290-60,43.25,44.1,T,{size:38});}
 if(fn===sWho){tag('REAL ANIMAL FLESH',W/2,420,44.3,45.9,T,{size:38});tag('BUT FROM WHERE?',W/2,420,46.0,47.2,T,{size:38});}
 if(fn===sReveal)bigText([['VULTURES',110,GOLD]],49.8,50.95,T,600);
 if(fn===sExplain){tag('STARTLED → THROWS UP ITS MEAL',W/2,420,51.3,53.6,T,{size:30});tag('LIGHTER = FASTER ESCAPE',W/2,420,53.7,56.0,T,{size:34});}
 if(fn===sFlock)tag('A WHOLE FLOCK AT ONCE',W/2,420,56.3,60.7,T,{size:36});
 if(fn===sJar)tag('A JAR STILL KEPT TODAY',W/2,420,61.4,65.6,T,{size:36});
 if(fn===sArchive){archiveCard([['A MEAT FESTIVAL'],'The county where it happened now','celebrates that day every year,','with a "mystery meat" chili contest.'],65.9,T);outro(70.9,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;flFree();cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
