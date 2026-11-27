// ===== THE MAN WHO SOLD THE EIFFEL TOWER (Victor Lustig, Paris 1925) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
const LON=2.35,LAT=48.86;
function rnd(s){let x=s;return()=>{x=(x*9301+49297)%233280;return x/233280;};}
const FLM=[];function flFree(){while(FLM.length){const m=FLM.pop();gl.deleteVertexArray(m.vao);gl.deleteBuffer(m.pb);gl.deleteBuffer(m.nb);gl.deleteBuffer(m.ib);}}
function lineC(P,a,b,r,c,o){const d=sub(b,a),L=Math.hypot(...d)||1e-4;draw(CYL,Object.assign({P,p:a,r:[Math.acos(clamp(d[1]/L,-1,1)),Math.atan2(d[0],d[2]),0],s:[r,L,r],c:c||[.15,.12,.1],noShadow:1},o||{}));}
function camPlaque(e,tg,dist,dx,dy,k,val,dig,cap){const f=norm(sub(tg,e));const r=norm(cross(f,[0,1,0]));const u=cross(r,f);const p=[e[0]+f[0]*dist+r[0]*dx+u[0]*dy,e[1]+f[1]*dist+r[1]*dx+u[1]*dy,e[2]+f[2]*dist+r[2]*dx+u[2]*dy];
 const d=sub(e,p);const yaw=Math.atan2(d[0],d[2]);const pit=Math.atan2(d[1],Math.hypot(d[0],d[2]));plaque3D(cxf(xf(p,[0,yaw,0]),xf([0,0,0],[-pit,0,0])),val,dig,cap,k);}
// override: broad/acacia canopies use a leaf-tinted smooth shade (grass pattern turned steep canopies into rock)
tree=function(P,k,c,type){k=k||1;type=type||'broad';const v=Math.abs(Math.round((P.M[12]*7.3+P.M[14]*3.1)))%3;const tc=c||(type==='pine'?[.2,.42,.24]:type==='acacia'?[.42,.56,.24]:[.32,.56,.24]);
 const key=type+v;const def=treeDef(type,v*3+1);
 const tm=propMesh('trunk'+key,trunkSDF(def),[-2,-.06,-2],[2,def.trunkH+1.8,2],.035);draw(tm,{P,s:[k,k,k],c:[.4,.28,.17],pat:2,patS:7});
 const cm=propMesh('can'+key,canopySDF(def,v*1.7),type==='pine'?[-1.5,.8,-1.5]:[-2.4,1.0,-2.4],type==='pine'?[1.5,4.6,1.5]:[2.4,4.0,2.4],.05);draw(cm,{P,s:[k,k,k],c:tc});};
// ---------- environments ----------
const DAY={sky:[.82,.82,.84],gnd:[.52,.5,.46],sunC:[.82,.76,.64],sunD:[-.5,.72,.45],fog:[.84,.87,.92],fogD:.0035,skyTop:[.34,.55,.86],clouds:.4,toon:.15};
const D=o=>Object.assign({},DAY,o);
const GOLDH={sky:[.88,.78,.66],gnd:[.5,.42,.34],sunC:[.95,.72,.5],sunD:[-.7,.3,.5],fog:[.94,.8,.66],fogD:.003,skyTop:[.4,.48,.8],clouds:.5,toon:.15};
const GH=o=>Object.assign({},GOLDH,o);
const SPACE={bg:[.04,.07,.13],fog:[.04,.07,.13],fogD:0,sky:[.9,.9,.95],gnd:[.5,.5,.56],sunC:[.55,.52,.48],sunD:[.8,.3,.5],ink:.8,inkFar:50};
const IN=o=>Object.assign({noSky:1,sky:[.75,.68,.58],gnd:[.42,.34,.26],sunC:[.55,.5,.42],sunD:[-.3,.8,.5],fog:[.3,.24,.2],fogD:.02,plC:[.9,.75,.5],plR:9,toon:.12},o);
// ---------- the Eiffel Tower (procedural lattice, 30 units tall) ----------
function beamMesh(list){const P=[],N=[],I=[];for(const[a,b,r]of list){const d=norm(sub(b,a));const u=norm(cross(d,Math.abs(d[1])>.9?[1,0,0]:[0,1,0]));const v=cross(d,u);
  const cs=[[1,1],[-1,1],[-1,-1],[1,-1]].map(([x,y])=>[u[0]*x*r+v[0]*y*r,u[1]*x*r+v[1]*y*r,u[2]*x*r+v[2]*y*r]);
  for(let f=0;f<4;f++){const c0=cs[f],c1=cs[(f+1)%4];const n=norm([c0[0]+c1[0],c0[1]+c1[1],c0[2]+c1[2]]);const base=P.length/3;
   for(const[p,c]of[[a,c0],[a,c1],[b,c1],[b,c0]]){P.push(p[0]+c[0],p[1]+c[1],p[2]+c[2]);N.push(...n);}I.push(base,base+1,base+2,base,base+2,base+3);}}
 return mesh(P,N,I);}
let TOWER=null;
function tw(h){return 6.25*Math.exp(-h/9.8);}
function buildTower(){const L=[];const RA=.1,BR=.045;
 // four legs up to the second platform (h=11.5)
 for(const sx of[-1,1])for(const sz of[-1,1]){const lw=h=>lerp(2.5,tw(11.5),h/11.5);const rail=(h,ox,oz)=>[sx*(tw(h)-ox*lw(h)),h,sz*(tw(h)-oz*lw(h))];
  const hs=[];for(let h=0;h<=11.5001;h+=11.5/12)hs.push(h);
  for(let i=1;i<hs.length;i++){const h0=hs[i-1],h1=hs[i];for(const[ox,oz]of[[0,0],[1,0],[0,1],[1,1]])L.push([rail(h0,ox,oz),rail(h1,ox,oz),RA*(1-h0/30)]);
   for(const[a0,a1,b0,b1]of[[[0,0],[1,0],[0,0],[1,0]],[[0,1],[1,1],[0,1],[1,1]],[[0,0],[0,1],[0,0],[0,1]],[[1,0],[1,1],[1,0],[1,1]]]){L.push([rail(h0,...a0),rail(h1,...a1),BR]);L.push([rail(h0,...a1),rail(h1,...a0),BR]);}}}
 // single shaft to the top
 const hs=[];for(let h=11.5;h<=27.6;h+=16.1/14)hs.push(h);const C=(h,sx,sz)=>[sx*tw(h),h,sz*tw(h)];
 for(let i=1;i<hs.length;i++){const h0=hs[i-1],h1=hs[i];const cs=[[1,1],[-1,1],[-1,-1],[1,-1]];for(let c=0;c<4;c++){L.push([C(h0,...cs[c]),C(h1,...cs[c]),.08]);const n=cs[(c+1)%4];L.push([C(h0,...cs[c]),C(h1,...n),.035]);L.push([C(h0,...n),C(h1,...cs[c]),.035]);}}
 // arches under the first platform
 for(let f=0;f<4;f++){const pts=[];for(let i=0;i<=16;i++){const th=i/16*Math.PI;const x=Math.cos(th)*3.55,y=1.2+Math.sin(th)*3.6;pts.push(f<2?[x,y,(f?1:-1)*(tw(y)-.05)]:[(f==2?1:-1)*(tw(y)-.05),y,x]);}
  for(let i=1;i<pts.length;i++)L.push([pts[i-1],pts[i],.1]);}
 TOWER=beamMesh(L);}
function tower(P,o){o=o||{};if(!TOWER)buildTower();const c=o.c||[.5,.37,.27],g=o.gold||0;draw(TOWER,{P,c,gold:g});
 // platforms + top
 draw(BOX,{P,p:[0,5.75,0],s:[2*tw(5.75)+.4,.55,2*tw(5.75)+.4],c:mix3(c,[0,0,0],.12),gold:g});draw(BOX,{P,p:[0,6.2,0],s:[2*tw(5.75)+.5,.08,2*tw(5.75)+.5],c:mix3(c,[1,1,1],.15),gold:g});
 draw(BOX,{P,p:[0,11.5,0],s:[2*tw(11.5)+.5,.42,2*tw(11.5)+.5],c:mix3(c,[0,0,0],.12),gold:g});
 draw(BOX,{P,p:[0,27.7,0],s:[1.1,.6,1.1],c:mix3(c,[0,0,0],.1),gold:g});draw(CYL,{P,p:[0,28,0],s:[.35,1.4,.35],c,gold:g});lineC(P,[0,29.3,0],[0,31,0],.06,c,{gold:g});
 if(o.rust){const r=rnd(77);for(let i=0;i<40;i++){const h=r()*24;const w=tw(h);draw(SPHL,{P,p:[(r()<.5?-1:1)*w,h,(r()-.5)*2*w],s:[.35,.35,.35],c:[.62,.26,.12],noInk:1,a:.85*o.rust,u:1});}}}
// ---------- Paris ----------
let GK='';
function flatHF(x,z){return 0;}
function parisGround(c){if(GK!=='F'){setGrid(-160,160,-200,80,flatHF);GK='F';}draw(GRID,{c:c||[.5,.62,.34],pat:1,patS:1.1});}
function haus(P,w,floors,c,o){o=o||{};house(P,{w,d:8,floors,style:'plaster',wall:c||[.92,.87,.76],roof:[.42,.45,.5],trim:[.96,.95,.9],door:true});
 const h=floors*2.6+.4;for(let f=1;f<floors;f++)draw(BOX,{P,p:[0,.4+f*2.6-.05,4.1],s:[w,.12,.3],c:[.25,.25,.27],noInk:1});}
function boulevard(z0,n,side){for(let i=0;i<n;i++){const x=-22+i*9;haus(xf([x,0,z0],[0,side,0]),8.6,4,[[.93,.88,.76],[.9,.84,.72],[.95,.91,.82]][i%3]);}}
function street(o){o=o||{};parisGround([.52,.6,.4]);road(-80,6,80,6,9,flatHF,[.5,.48,.46]);road(-80,0,80,0,0,flatHF);
 draw(BOX,{p:[0,.02,10.8],s:[160,.06,2.6],c:[.74,.72,.68],pat:6,patS:2});draw(BOX,{p:[0,.02,1.2],s:[160,.06,2.6],c:[.74,.72,.68],pat:6,patS:2});
 for(let i=0;i<8;i++){lamppost(xf([-24+i*7,0,11.6]),o.lamps);tree(xf([-20.5+i*7,0,11.8]),.9,null,'broad');}}
// ---------- props ----------
const NEWS=document.createElement('canvas');NEWS.width=640;NEWS.height=860;let NWD=0;function drawNews(){if(NWD)return;NWD=1;const g=NEWS.getContext('2d');g.fillStyle='#ece4cf';g.fillRect(0,0,640,860);
 g.fillStyle='#1c1a18';g.textAlign='center';g.font='700 62px Cinzel';g.fillText('LA GAZETTE',320,80);g.fillRect(30,100,580,4);g.font='600 22px Montserrat';g.fillText('PARIS · 1925',320,128);g.fillRect(30,142,580,2);
 g.font='900 74px Montserrat';g.fillText('LA TOUR',320,230);g.fillText('ROUILLE !',320,310);g.font='600 30px Montserrat';g.fillText('Repairs will cost a fortune',320,360);
 g.fillStyle='#8a7c66';g.fillRect(60,390,250,220);g.fillStyle='#5a4c3a';g.beginPath();g.moveTo(185,400);g.lineTo(120,600);g.lineTo(250,600);g.closePath();g.fill();
 g.fillStyle='#4a4136';for(let i=0;i<10;i++){g.fillRect(330,395+i*22,250-(i%3)*30,9);}for(let i=0;i<9;i++){g.fillRect(60,640+i*22,520-(i%4)*40,9);}}
const LETTER=document.createElement('canvas');LETTER.width=600;LETTER.height=800;let LTD=0;function drawLetter(){if(LTD)return;LTD=1;const g=LETTER.getContext('2d');g.fillStyle='#f6f1e4';g.fillRect(0,0,600,800);
 g.strokeStyle='#9a7a4a';g.lineWidth=5;g.strokeRect(20,20,560,760);g.fillStyle='#1f2a44';g.textAlign='center';g.font='700 34px Cinzel';g.fillText('MINISTÈRE',300,100);g.font='600 22px Cinzel';g.fillText('RÉPUBLIQUE FRANÇAISE · PARIS',300,140);
 g.fillStyle='#b8862a';g.fillRect(140,165,320,3);g.fillStyle='#2a2118';g.font='700 30px Montserrat';g.fillText('CONFIDENTIAL',300,230);
 g.fillStyle='#4a3b2a';for(let i=0;i<10;i++)g.fillRect(70,280+i*36,460-(i%3)*60,9);g.font='italic 40px DejaVu Serif';g.fillStyle='#1f2a44';g.fillText('Deputy Director',300,700);}
function paper(P,canvas,key,w,h){useTex(key,canvas);draw(BOX,{P,p:[0,-.004,0],s:[w,.006,h],c:[.9,.86,.78]});draw(QUAD,{P,p:[0,.001,0],r:[-Math.PI/2,0,0],s:[w,h,1],c:[1,1,1],tex:3,u:1});}
function envelope(P,c){draw(BOX,{P,s:[.24,.012,.15],c:c||[.95,.92,.84]});draw(PRISM,{P,p:[0,.008,-.075],r:[-Math.PI/2,0,0],s:[.24,.07,.004],c:[.88,.84,.74],noInk:1});draw(CYL,{P,p:[0,.01,.0],s:[.022,.006,.022],c:[.7,.12,.1],noInk:1});}
function money(P,n){for(let i=0;i<n;i++)draw(BOX,{P,p:[(i%2)*.01,.006+i*.008,0],r:[0,(i%3)*.05,0],s:[.16,.007,.09],c:[.62,.72,.56],noInk:i>0});}
function chair(P,c){c=c||[.5,.18,.14];draw(BOX,{P,p:[0,.45,0],s:[.48,.08,.48],c,pat:6,patS:4});draw(BOX,{P,p:[0,.85,-.22],s:[.48,.8,.06],c});for(const x of[-.2,.2])for(const z of[-.2,.2])draw(BOX,{P,p:[x,.22,z],s:[.05,.44,.05],c:[.32,.2,.12]});}
function table(P,w,d,c){c=c||[.42,.26,.15];draw(BOX,{P,p:[0,.76,0],s:[w,.07,d],c,pat:2,patS:2,g:.4});for(const x of[-w/2+.12,w/2-.12])for(const z of[-d/2+.12,d/2-.12])draw(BOX,{P,p:[x,.38,z],s:[.08,.76,.08],c:mix3(c,[0,0,0],.2)});}
function chandelier(P,on){lineC(P,[0,0,0],[0,.8,0],.015,[.7,.55,.25]);for(let i=0;i<8;i++){const a=i/8*6.28;lineC(P,[0,.1,0],[Math.cos(a)*.5,0,Math.sin(a)*.5],.012,[.8,.62,.28]);draw(SPHL,{P,p:[Math.cos(a)*.5,.06,Math.sin(a)*.5],s:[.05,.07,.05],c:[1,.92,.7],u:1,noShadow:1});}draw(SPH,{P,s:[.12,.12,.12],c:[.85,.68,.3],g:.8});}
function hotelRoom(o){o=o||{};draw(BOX,{p:[0,-.5,0],s:[20,1,20],c:[.5,.32,.2],pat:2,patS:1.5,g:.3});draw(BOX,{p:[0,.01,0],s:[6,.02,4],c:[.55,.14,.14],noInk:1});
 for(const[x,z,r]of[[0,-4,0],[-5,0,Math.PI/2],[5,0,-Math.PI/2]]){const P=xf([x,0,z],[0,r,0]);draw(BOX,{P,p:[0,2.4,0],s:[10,4.8,.2],c:[.62,.5,.36],pat:6,patS:1});draw(BOX,{P,p:[0,1,.12],s:[10,.08,.06],c:[.85,.7,.35],g:.6});
  for(const wx of[-2.6,2.6]){draw(BOX,{P,p:[wx,2.5,.12],s:[1.5,2.6,.05],c:[.95,.93,.88]});draw(BOX,{P,p:[wx,2.5,.15],s:[1.3,2.4,.04],c:[.62,.78,.92],g:.8});for(const sx of[-1,1])draw(BOX,{P,p:[wx+sx*1.0,2.6,.2],s:[.45,3,.06],c:[.6,.12,.14],pat:6,patS:3});}
  draw(BOX,{P,p:[0,2.6,.13],s:[1.4,1,.05],c:[.85,.68,.3],g:.7});draw(BOX,{P,p:[0,2.6,.16],s:[1.2,.8,.03],c:[.5,.6,.5]});}
 chandelier(xf([0,3.4,0]));}
// ---------- vehicles ----------
function train(P,t,o){o=o||{};const B=cxf(P,xf([0,.55,0]));draw(CYL,{P:B,p:[0,.75,1.4],r:[Math.PI/2,0,0],s:[.62,3.2,.62],c:[.12,.12,.14],g:.6});draw(BOX,{P:B,p:[0,1.05,-.6],s:[1.5,1.8,1.3],c:[.14,.16,.18]});draw(BOX,{P:B,p:[0,2.0,-.6],s:[1.7,.12,1.5],c:[.4,.12,.1]});
 draw(CYL,{P:B,p:[0,1.6,2.4],s:[.18,.7,.18],c:[.1,.1,.1]});draw(BOX,{P:B,p:[0,-.05,.6],s:[1.3,.3,4.6],c:[.3,.1,.08]});for(const sd of[-1,1])for(let i=0;i<3;i++)draw(CYL,{P:B,p:[sd*.7,-.1,-.4+i*1.1],r:[0,0,Math.PI/2],s:[.42,.12,.42],c:[.5,.12,.1]});
 for(let c=1;c<=(o.cars||2);c++){const C=cxf(B,xf([0,0,-c*5.2]));const CC=[.18,.32,.24];
  if(c===1&&o.lus){const wz=-1.6+2*1.05;draw(BOX,{P:C,p:[.52,.9,0],s:[.66,1.8,4.6],c:CC,pat:2,patS:3});draw(BOX,{P:C,p:[0,1.72,0],s:[1.66,.08,4.56],c:CC});draw(BOX,{P:C,p:[-.8,.45,0],s:[.1,.9,4.6],c:CC,pat:2,patS:3});draw(BOX,{P:C,p:[-.8,1.6,0],s:[.1,.4,4.6],c:CC,pat:2,patS:3});
   draw(BOX,{P:C,p:[-.8,1.15,(wz-.4-2.3)/2],s:[.1,.5,wz-.4+2.3],c:CC,pat:2,patS:3});draw(BOX,{P:C,p:[-.8,1.15,(wz+.4+2.3)/2],s:[.1,.5,2.3-wz-.4],c:CC,pat:2,patS:3});}
  else draw(BOX,{P:C,p:[0,.9,0],s:[1.7,1.8,4.6],c:CC,pat:2,patS:3});draw(BOX,{P:C,p:[0,1.88,0],s:[1.85,.15,4.8],c:[.2,.2,.22]});
  for(const sd of[-1,1])for(let i=0;i<4;i++){if(c===1&&sd<0&&i===2&&o.lus)continue;draw(BOX,{P:C,p:[sd*.86,1.15,-1.6+i*1.05],s:[.04,.5,.7],c:[.9,.85,.6],g:.5});}
  if(c===1&&o.lus){draw(BOX,{P:C,p:[.18,.9,0],s:[.04,1.6,4.4],c:[.82,.74,.56]});person(cxf(C,xf([-.5,.02,-1.6+2*1.05],[0,-Math.PI/2,0],.8),{gold:.8}),Object.assign({},LUS,{armR:[-2.4*o.wave,0,.25],elbowR:1.1,head:[0,0,0]}));}for(const sd of[-1,1])for(const z of[-1.6,1.6])draw(CYL,{P:C,p:[sd*.7,-.15,z],r:[0,0,Math.PI/2],s:[.32,.1,.32],c:[.2,.2,.2]});}
 for(let i=0;i<10;i++){const ph=(t*.9+i/10)%1;draw(SPHL,{P:B,p:[Math.sin(i)*.2*ph,2.0+ph*2.4,2.4-ph*2.5],s:[.25+ph*.6,.25+ph*.6,.25+ph*.6],c:[.94,.94,.92],a:.7*(1-ph),u:1,noShadow:1,noInk:1});}}
function liner(P,t){draw(BOX,{P,p:[0,1.6,0],s:[5,3.2,30],c:[.12,.12,.14]});draw(PRISM,{P,p:[0,1.6,15],r:[Math.PI/2,0,0],s:[5,3.4,3.2],c:[.12,.12,.14]});draw(BOX,{P,p:[0,.3,0],s:[5.05,.6,30.1],c:[.6,.14,.12]});
 draw(BOX,{P,p:[0,3.8,-1],s:[4.4,1.3,18],c:[.95,.94,.9]});draw(BOX,{P,p:[0,4.9,-2],s:[3.6,1.0,10],c:[.95,.94,.9]});for(let i=0;i<3;i++){draw(CYL,{P,p:[0,5.4,-6+i*4],s:[.8,3.2,.8],c:[.9,.55,.15]});draw(CYL,{P,p:[0,8.4,-6+i*4],s:[.82,.6,.82],c:[.1,.1,.1]});}
 for(let i=0;i<14;i++)for(const sd of[-1,1])draw(SPHL,{P,p:[sd*2.52,2.2,-12+i*1.8],s:[.15,.15,.05],c:[.9,.9,.85],noInk:1});
 for(let i=0;i<8;i++){const ph=(t*.5+i/8)%1;draw(SPHL,{P,p:[0,9+ph*4,-2-ph*6],s:[.5+ph*1.5,.5+ph*1.5,.5+ph*1.5],c:[.4,.4,.42],a:.6*(1-ph),u:1,noShadow:1,noInk:1});}}
function sea(c){draw(BOX,{p:[0,-.5,0],s:[900,1,900],c:c||[.14,.44,.58],pat:5,patS:.35,g:.6,noShadow:1});}
// ---------- people ----------
const _person=person;person=function(P,o,G){_person(G&&G.gold?cxf(P,xf([0,0,0]),{gold:G.gold}):P,o);};
const LUS={coat:[.13,.14,.2],shirt:[.95,.94,.9],tie:[.55,.1,.12],pants:[.13,.14,.2],hat:'bowler',hatc:[.1,.1,.12],moustache:1,hair:HAIRS[1],shoes:[.08,.07,.07],seed:61};
const POI={coat:[.45,.36,.28],shirt:[.94,.92,.86],tie:[.2,.3,.45],pants:[.4,.34,.28],hat:'bowler',hatc:[.32,.24,.18],moustache:1,hair:HAIRS[2],seed:72};
const DEAL=i=>({coat:[[.3,.32,.3],[.36,.3,.26],[.24,.26,.32],[.4,.38,.34]][i%4],shirt:[.94,.92,.86],tie:[[.4,.1,.1],[.1,.2,.4],[.2,.3,.2],[.3,.2,.1]][i%4],pants:[.26,.24,.22],hat:i%2?'bowler':'flat',hatc:[.2,.18,.16],moustache:i%2,beard:i==2?1:0,hair:HAIRS[i%3],seed:80+i});
const GEND=i=>({coat:[.12,.16,.32],pants:[.14,.16,.3],shirt:[.9,.9,.88],hat:'cap',hatc:[.1,.12,.25],moustache:i%2,seed:90+i,hair:HAIRS[i%3]});
// ===================== SCENES =====================
function stars(n,R){const r=rnd(3);for(let i=0;i<(n||90);i++){const a=r()*6.28,e=(r()-.3)*1.4;draw(SPHL,{p:[Math.cos(a)*Math.cos(e)*R,Math.sin(e)*R+10,Math.sin(a)*Math.cos(e)*R],s:[.12,.12,.12].map(v=>v*R/60),c:[1,1,1],u:1,id:0,noShadow:1});}}
function sGlobe(t){const k=ease(ss(0,1.6,t));env({...SPACE,eye:[0,0,lerp(5.4,3.0,k)],tgt:[0,0,0],fov:40});globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.2,ss(.7,1.3,t));stars(80,40);}
const TP=[0,0,-70],TK=2.2;// tower position & scale (66 units tall)
function sTower(t){const k=ease(ss(0,2.9,t));const E=[lerp(-14,-6,k),lerp(2,6,k),lerp(30,10,k)],TG=[TP[0],lerp(26,36,k),TP[2]];env(D({eye:E,tgt:TG,fov:46,far:900,shadow:{c:[0,0,-50],r:70}}));parisGround();
 tower(xf(TP,[0,.4,0],TK),{gold:1});const r=rnd(3);for(let i=0;i<30;i++){const x=-60+r()*120,z=-140+r()*80;if(Math.abs(x)<22&&z>-95&&z<-45)continue;tree(xf([x,0,z]),1.5+r(),null,'broad');}
 for(let i=0;i<6;i++){haus(xf([-46+i*0,0,-10-i*14],[0,Math.PI/2,0]),12,5);haus(xf([46,0,-10-i*14],[0,-Math.PI/2,0]),12,5);}}
function sNotOwn(t){const k=ease(ss(0,3.3,t));const E=[TP[0]+lerp(2.2,1.4,k),lerp(1.5,1.7,k),TP[2]+lerp(30,28.8,k)],TG=[TP[0]+lerp(.4,.2,k),lerp(2.0,5.2,k),TP[2]+lerp(18,14,k)];env(D({eye:E,tgt:TG,fov:46,far:900,shadow:{c:[0,0,TP[2]+18],r:16}}));parisGround();
 tower(xf(TP,[0,.4,0],TK),{gold:0});draw(BOX,{p:[TP[0],.02,TP[2]+16],s:[40,.04,24],c:[.78,.72,.6],pat:7,patS:2});
 const shr=Math.sin(Math.PI*ss(.6,1.6,t));person(xf([TP[0]+.6,0,TP[2]+23.5],[0,.25,0]),Object.assign({},LUS,{armL:[-.3-shr*.6,0,-.5*shr],elbowL:.9*shr+.1,armR:[-.3-shr*.6,0,.5*shr],elbowR:.9*shr+.1,head:[0,Math.sin(t*2)*.2,0]}),{gold:1});
 for(let i=0;i<5;i++){const z=TP[2]+14+i*1.5,x=TP[0]-7+i*3.2+t*.8;person(xf([x,0,z],[0,1.5,0]),Object.assign(DEAL(i),{walk:1,phase:t*6+i}));}}
// museum alternative: theatre stage with curtains + spotlight
function stage(fig,t,o){o=o||{};const a=(o.a0||.4)+t*.14;env({noSky:1,sky:[.8,.72,.66],gnd:[.42,.32,.28],sunC:[.7,.62,.54],sunD:[-.2,.8,.6],fog:[.16,.09,.1],fogD:.018,eye:[Math.sin(a)*o.r,o.h,Math.cos(a)*o.r],tgt:[0,o.ty,0],fov:40,dof:[o.r,o.r*.45],plP:[.6,3.5,2.2],plC:[1.2,1.0,.75],plR:10,desat:.1});
 draw(BOX,{p:[0,-.5,0],s:[40,1,40],c:[.42,.26,.16],pat:2,patS:1.5,g:.35});draw(CYL,{p:[0,.005,0],s:[1.6,.01,1.6],c:[1,.9,.7],u:1,a:.35,noShadow:1});
 for(let i=0;i<14;i++){const x=-6.5+i*1;draw(CYL,{p:[x,3,-3.2+Math.sin(i*1.7)*.15],s:[.55,6,.55],c:[.58,.1,.12],pat:6,patS:4});}
 draw(BOX,{p:[0,6.2,-2.9],s:[16,.6,.5],c:[.8,.62,.25],g:.6});
 fig(cxf(xf([0,0,0],[0,-t*.25+(o.y0||0),0]),xf([0,0,0]),{gold:o.gold||1}),t);}
function sLustig(t){stage(P=>person(P,Object.assign({},LUS,{armR:[-.25,0,.15],elbowR:1.4,armL:[-.1,0,-.1],elbowL:.2,head:[.05,0,0]})),t,{r:2.7,h:1.85,ty:1.45,a0:.2,gold:.55});}
function sNews(t){const k=ease(ss(0,4.6,t));const E=[lerp(.5,.05,k),lerp(1.75,1.42,k),lerp(1.15,.68,k)],TG=[lerp(.15,0,k),.8,lerp(0,.06,k)];env(D({eye:E,tgt:TG,fov:42,dof:[Math.hypot(...sub(E,TG)),.9],shadow:{c:[0,0,0],r:4}}));
 parisGround([.55,.6,.42]);draw(BOX,{p:[0,.01,0],s:[30,.02,14],c:[.7,.66,.6],pat:6,patS:2});haus(xf([8,0,-10]),9,4);haus(xf([-4,0,-14]),9,4,[.9,.84,.72]);draw(BOX,{p:[2,2.6,-5.6],r:[.35,0,0],s:[8,.06,2.2],c:[.75,.14,.14]});
 table(xf([0,0,0]),.9,.9,[.78,.76,.7]);draw(CYL,{p:[.32,.8,.25],s:[.05,.05,.05],c:[.95,.95,.92]});draw(CYL,{p:[.32,.84,.25],s:[.045,.01,.045],c:[.3,.18,.1],noInk:1});
 chair(xf([0,0,-.7]),[.3,.36,.3]);person(xf([0,0,-.66]),Object.assign({},LUS,{sit:1,lean:.1,armR:[-.75,0,.45],elbowR:.9,armL:[-.75,0,-.45],elbowL:.9,head:[.55,0,0]}));
 drawNews();paper(xf([0,.805,.1],[0,0,0]),NEWS,'news',.44,.6);}
function sFair(t){const k=ease(ss(0,4.4,t));const E=[lerp(30,24,k),lerp(3,6,k),lerp(-18,-30,k)],TG=[TP[0],lerp(9,22,k),TP[2]];env(GH({eye:E,tgt:TG,fov:46,far:900,sunD:[-.4,.6,.5],shadow:{c:[0,0,TP[2]],r:60}}));parisGround([.56,.62,.4]);
 tower(xf(TP,[0,.4,0],TK),{c:[.62,.36,.22]});const r=rnd(8);
 for(let i=0;i<34;i++){const a=r()*6.28,d=20+r()*14;const x=TP[0]+Math.cos(a)*d,z=TP[2]+Math.sin(a)*d+10;if(z<TP[2]-10)continue;person(xf([x,0,z],[0,r()*6,0]),{coat:[[.3,.25,.35],[.5,.3,.2],[.2,.3,.4],[.6,.55,.4]][i%4],dress:i%3==0?[[.6,.3,.35],[.3,.4,.6],[.75,.7,.55]][i%3]:undefined,hat:i%3?'bowler':'flat',hatc:[.2,.18,.16],walk:1,phase:t*6+i,seed:i});}
 for(let i=0;i<8;i++){const x=TP[0]-24+i*7;lineC(xf([0,0,0]),[x,0,TP[2]+30],[x,7,TP[2]+30],.08,[.9,.88,.82]);draw(BOX,{p:[x+.7,6.3,TP[2]+30],s:[1.3,.8,.05],c:[[.2,.3,.7],[.95,.95,.95],[.8,.15,.15]][i%3],noInk:1});}}
function sDesk(t){const k=ease(ss(0,2.8,t));const E=[lerp(.9,.6,k),lerp(1.75,1.55,k),lerp(1.4,1.0,k)],TG=[0,.85,0];env(IN({eye:E,tgt:TG,fov:42,dof:[Math.hypot(...sub(E,TG)),.7],plP:[.8,2.2,.6],shadow:{c:[0,0,0],r:3}}));
 draw(BOX,{p:[0,-.5,0],s:[10,1,10],c:[.45,.3,.2],pat:2,patS:2});draw(BOX,{p:[0,2,-1.3],s:[8,4,.1],c:[.32,.38,.32],pat:6,patS:1});
 table(xf([0,0,0]),1.6,.8,[.38,.22,.12]);drawLetter();paper(xf([.05,.81,.05],[0,.15,0]),LETTER,'letter',.3,.4);
 for(let i=0;i<5;i++)envelope(xf([-.55,.81+i*.014,.1+(i%2)*.01],[0,.2*i,0]));
 // the stamp comes down
 const st=ss(.9,1.25,t)-ss(1.45,1.9,t);const SP=xf([.08,1.15-.3*st,.1]);draw(CYL,{P:SP,s:[.05,.08,.05],c:[.35,.2,.12]});draw(SPH,{P:SP,p:[0,.11,0],s:[.06,.06,.06],c:[.35,.2,.12]});draw(BOX,{P:SP,p:[0,-.05,0],s:[.11,.03,.08],c:[.2,.2,.2]});
 if(t>1.25)draw(CYL,{p:[.08,.818,.1],s:[.045,.002,.045],c:[.75,.12,.1],noInk:1});
 person(xf([0,0,-.62]),Object.assign({},LUS,{hat:'none',sit:1,armR:[-1.15+.2*st,0,.25],elbowR:1.0,armL:[-1.2,0,-.3],elbowL:1.1,head:[.5,0,0]}));chair(xf([0,0,-.68]),[.4,.2,.14]);
 draw(CYL,{p:[-.6,.81,-.2],s:[.05,.16,.05],c:[.85,.7,.3],g:.7});lineC(xf([0,0,0]),[-.6,.97,-.2],[-.5,1.2,-.15],.006,[.15,.15,.2]);}
function hotelFront(){street();const P=xf([0,0,-4]);draw(BOX,{P,p:[0,7,0],s:[30,14,8],c:[.94,.9,.8],pat:6,patS:1.2});draw(BOX,{P,p:[0,14.2,0],s:[31,.6,8.6],c:[.86,.82,.72]});
 for(let f=0;f<4;f++)for(let i=0;i<9;i++){const x=-12+i*3,y=3.2+f*3;draw(BOX,{P,p:[x,y,4.03],s:[1.3,2,.06],c:[.97,.96,.92]});draw(BOX,{P,p:[x,y,4.06],s:[1.05,1.8,.04],c:[.3,.38,.48],g:.8});if(f>0)draw(BOX,{P,p:[x,y-1.1,4.3],s:[1.6,.1,.5],c:[.2,.2,.22]});}
 for(let i=0;i<6;i++)draw(CYL,{P,p:[-5+i*2,0,4.6],s:[.32,4.2,.32],c:[.96,.95,.9]});draw(BOX,{P,p:[0,4.4,4.6],s:[12,.5,1.2],c:[.96,.95,.9]});
 draw(BOX,{P,p:[0,2.6,6.6],r:[-.25,0,0],s:[5,.06,3],c:[.65,.12,.14]});for(const x of[-2.4,2.4])lineC(P,[x,0,7.8],[x,2.3,7.8],.04,[.8,.65,.3]);
 draw(BOX,{P,p:[0,1.2,4.05],s:[2.2,2.4,.06],c:[.3,.18,.1],pat:2});}
function sHotel(t){const k=ease(ss(0,4.0,t));env(D({eye:[lerp(-8,-4,k),lerp(3.2,2.4,k),lerp(20,16,k)],tgt:[0,3.6,0],fov:46,shadow:{c:[0,0,4],r:16}}));hotelFront();
 for(let i=0;i<5;i++){const s=ss(.2+i*.35,3.4+i*.2,t);const x=lerp(-14+i*6,(i-2)*.7,s),z=lerp(9,4.6,s);person(xf([x,0,z],[0,Math.atan2((i-2)*.7-(-14+i*6),4.6-9)+0,0]),Object.assign(DEAL(i),{walk:s<1?1:0,phase:t*6.5+i}),i==1?{gold:.8}:undefined);}
 for(let i=0;i<5;i++){const s=ss(i*.3,1.4+i*.3,t);if(s<=0||s>=1)continue;const p=[lerp(-1+i,(i-2)*2,s),lerp(14,5,s)+Math.sin(s*Math.PI)*4,lerp(0,8,s)];envelope(cxf(xf(p,[t*3+i,t*2,i]),xf([0,0,0],[0,0,0],6)));}}
function seated(i){const a=[[-1.1,-.8,0],[-1.1,0,0],[-1.1,.8,0],[1.1,-.8,Math.PI],[1.1,.4,Math.PI]][i];return a;}
function meetRoom(t,o){hotelRoom();table(xf([0,0,0]),1.6,3.2,[.36,.22,.12]);for(let i=0;i<5;i++){const[x,z,r]=seated(i);const P=xf([x,0,z],[0,r+Math.PI/2*(x<0?1:-1)+(x<0?Math.PI:0)-Math.PI/2*(x<0?-1:1)+(x<0?0:0),0]);}
 // dealers seated along the sides, facing the table
 const D5=[[-1.05,-.9],[-1.05,0],[-1.05,.9],[1.05,-.9],[1.05,0]];D5.forEach(([x,z],i)=>{const yaw=x<0?Math.PI/2:-Math.PI/2;chair(xf([x-.08*Math.sign(x),0,z],[0,yaw+Math.PI,0]),[.55,.15,.14]);person(xf([x,0,z],[0,yaw,0]),Object.assign(DEAL(i),{hat:'none',sit:1,armR:[-.6,0,.2],elbowR:1.3,armL:[-.6,0,-.2],elbowL:1.3,head:[.15,o&&o.look?(x<0?-.4:.4):0,0]}),i==1?{gold:o&&o.pg||0}:undefined);});
 // Lustig standing at the head of the table
 const hush=o&&o.hush||0;person(xf([0,0,-2.1]),Object.assign({},LUS,{hat:'none',lean:.25*hush,armR:[-1.0+hush*.6,0,.2],elbowR:.6+hush*.2,armL:[-.6,0,-.2],elbowL:.4,head:[.1,Math.sin(t*1.3)*.25*(1-hush),0]}),{gold:o&&o.lg||0});
 for(let i=0;i<5;i++)paper(xf([D5[i][0]*.55,.81,D5[i][1]],[0,i,0]),LETTER,'letter',.22,.3);}
function sMeet(t){const k=ease(ss(0,4.2,t));const E=[lerp(2.6,1.8,k),lerp(2.9,2.4,k),lerp(4.4,3.6,k)],TG=[0,1.0,-.4];env(IN({eye:E,tgt:TG,fov:44,plP:[0,3.2,0],shadow:{c:[0,0,0],r:5}}));meetRoom(t,{look:1,lg:.6});drawLetter();
 if(t>.5)camPlaque(E,TG,3.2,0,.75,.42,Math.round(7000*ease(ss(.6,2.4,t))),4,'TONS OF IRON');}
function sHush(t){const k=ease(ss(0,2.2,t));const E=[lerp(.5,.35,k),1.72,lerp(-.4,-.7,k)],TG=[0,1.62,-2.1];env(IN({eye:E,tgt:TG,fov:38,dof:[Math.hypot(...sub(E,TG)),1],plP:[.5,3,-.5],shadow:{c:[0,0,-1],r:4},desat:.3}));meetRoom(t,{hush:ss(0,.5,t),lg:.25});}
function sPoisson(t){stage(P=>person(P,Object.assign({},POI,{armR:[-.2,0,.1],elbowR:.4,armL:[-.15,0,-.1],elbowL:.3,head:[.1,.2,0]})),t,{r:2.7,h:1.85,ty:1.45,a0:-.3,gold:.55});}
function sBribe(t){const B=2.6;const sh=t<B?0:1;const lt=sh?t-B:t;const k=ease(ss(0,sh?3.1:B,lt));
 const E=sh?[lerp(1.9,1.6,k),lerp(2.3,2.1,k),lerp(2.4,2.1,k)]:[lerp(-2.4,-2.1,k),lerp(1.8,1.7,k),lerp(2.8,2.4,k)],TG=sh?[0,1.0,0]:[0,1.3,0];
 env(IN({eye:E,tgt:TG,fov:sh?38:44,dof:sh?[Math.hypot(...sub(E,TG)),.6]:null,plP:[0,3,1],shadow:{c:[0,0,0],r:4}}));hotelRoom();table(xf([0,0,0]),1.2,.8,[.36,.22,.12]);
 const shrug=sh?0:Math.sin(Math.PI*ss(.5,1.8,lt));person(xf([-.8,0,0],[0,Math.PI/2,0]),Object.assign({},LUS,{hat:'none',armL:[-.3-shrug*.7,0,-.5*shrug],elbowL:.2+shrug*1.2,armR:[-.3-shrug*.7,0,.5*shrug],elbowR:.2+shrug*1.2,head:[0,0,.15*shrug]}),{gold:sh?0:.7});
 const push=sh?ss(.2,1.6,lt):0;person(xf([.8,0,0],[0,-Math.PI/2,0]),Object.assign({},POI,{hat:'none',armR:[-1.0-push*.2,0,.15],elbowR:.4-push*.2,armL:[-.2,0,-.1],elbowL:.3,head:[.2,0,0]}),{gold:sh?.6:0});
 const mx=lerp(.45,.05,push);money(xf([mx,.8,.12],[0,.3,0]),8);envelope(xf([mx-.05,.88,.12],[0,.3,0]),[.9,.82,.6]);if(sh)draw(SPHL,{p:[mx,.86,.12],s:[.2,.08,.15],c:[1,.8,.3],a:.25,u:1,noShadow:1,gold:1});}
function station(){parisGround([.55,.58,.48]);draw(BOX,{p:[0,.3,0],s:[200,.6,6],c:[.7,.68,.64],pat:6,patS:2});for(const x of[-1.4,1.4])draw(BOX,{p:[x,.04,-5],s:[200,.08,.12],c:[.5,.5,.52],g:.7});
 for(let i=0;i<60;i++)draw(BOX,{p:[-100+i*3.4,.02,-5],s:[.3,.06,4],c:[.4,.3,.2],noInk:1});
 for(let i=0;i<8;i++){lineC(xf([0,0,0]),[-20+i*6,.6,2.4],[-20+i*6,6,2.4],.12,[.25,.3,.28]);}draw(BOX,{p:[0,6.2,0],s:[52,.3,7],c:[.3,.36,.34]});
 for(let i=0;i<5;i++)haus(xf([-30+i*12,0,16],[0,Math.PI,0]),11,3,[.9,.85,.74]);}
function sTrain(t){const m=Math.max(0,t-.9);const x=4.7+m*m*1.6+m*.6;const k=ease(ss(0,3.3,t));const E=[lerp(-2.2,-.9,k),lerp(2.0,2.2,k),lerp(-.2,.3,k)],TG=[lerp(-.1,1.6,k),1.6,-4.2];env(D({eye:E,tgt:TG,fov:42,shadow:{c:[0,0,-4],r:8}}));station();
 const TR=xf([x,0,-5],[0,Math.PI/2,0]);train(TR,t,{cars:3,lus:1,wave:ss(.3,.8,t)});}
function sShame(t){const k=ease(ss(0,3.3,t));const E=[lerp(7,6,k),lerp(1.8,1.7,k),lerp(10.3,9.7,k)],TG=[1.0,1.6,2.5];env(D({eye:E,tgt:TG,fov:44,shadow:{c:[0,0,2],r:12},desat:.45}));street({lamps:1});
 // police building across the street
 const PB=xf([-6,0,-4]);house(PB,{w:9,d:8,floors:3,style:'brick',wall:[.66,.56,.5],roof:[.35,.38,.42],door:true});draw(SPH,{P:PB,p:[2.7,3.0,4.4],s:[.25,.25,.25],c:[.4,.6,1],e:[.25,.4,.8],u:1});lineC(PB,[2.7,2.4,4.05],[2.7,2.8,4.4],.04,[.2,.2,.2]);
 for(let i=0;i<2;i++)person(xf([-4.8+i*1.6,0,1.2],[0,0,0]),GEND(i));
 // Poisson stops, looks, and turns away
 const tr=ss(1.2,2.4,t);const walk=t<1.0||t>2.4;const px=t<1.0?lerp(5,3,t):(t>2.4?lerp(3,5,ss(2.4,3.3,t)):3);
 person(xf([px,0,4.6],[0,lerp(-Math.PI/2-.4,Math.PI/2,tr),0]),Object.assign({},POI,{walk:walk?1:0,phase:t*6,head:[.35*tr,0,0],armR:[-.1,0,.1],elbowR:.2}),{gold:1});}
function sReturn(t){const k=ease(ss(0,3.9,t));const lx=lerp(-12,-1,ss(0,3.6,t));env(D({eye:[lx-2.5,1.8,10.8],tgt:[lx+2.5,2.2,4],fov:46,shadow:{c:[lx,0,6],r:14}}));hotelFront();
 person(xf([lerp(-12,-1,ss(0,3.6,t)),0,6.2],[0,Math.PI/2-.2,0]),Object.assign({},LUS,{walk:1,phase:t*6.4}),{gold:1});
 for(let i=0;i<5;i++){const s=ss(1.2+i*.25,3.6+i*.15,t);if(s<=0||s>=1)continue;const p=[lerp(-1,-12+i*6,s),lerp(5,12,s)+Math.sin(s*Math.PI)*3,lerp(6,0,s)];envelope(cxf(xf(p,[t*3+i,t*2,i]),xf([0,0,0],[0,0,0],6)));}}
function sPolice(t){const B=2.2;if(t<B){const k=ease(ss(0,B,t));env(D({eye:[lerp(3,2,k),lerp(1.7,1.6,k),lerp(10,8.6,k)],tgt:[-4,2,0],fov:44,shadow:{c:[-4,0,0],r:10}}));street();
  const PB=xf([-6,0,-4]);house(PB,{w:9,d:8,floors:3,style:'brick',wall:[.66,.56,.5],roof:[.35,.38,.42],door:true});draw(SPH,{P:PB,p:[2.7,3.0,4.4],s:[.25,.25,.25],c:[.4,.6,1],e:[.25,.4,.8],u:1});
  const s=ss(0,1.2,t);person(xf([lerp(0,-3.3,s),0,lerp(4,1.2,s)],[0,-2.4,0]),Object.assign(DEAL(2),{walk:s<1?1:0,phase:t*6.5,armR:s>=1?[-1.3,0,.2]:[-.1,0,.1],elbowR:.3}),{gold:1});
  for(let i=0;i<3;i++){const g=ss(1.1+i*.2,2.2,t);person(xf([-3.5+i*1.2,0,lerp(.4,2.6,g)],[0,.2,0]),Object.assign(GEND(i),{walk:g>0&&g<1?1:0,phase:t*7+i}));}return;}
 const lt=t-B,k=ease(ss(0,2.1,lt));env(GH({eye:[lerp(-30,-26,k),lerp(4,6,k),lerp(30,26,k)],tgt:[lerp(0,6,k),4,0],fov:46,shadow:{c:[0,0,0],r:30}}));sea();
 draw(BOX,{p:[-30,.6,26],s:[30,2.2,6],c:[.6,.56,.5],pat:6,patS:2});liner(xf([lt*1.8,0,0],[0,Math.PI/2,0]),lt);
 person(cxf(xf([lt*1.8+.0,4.45,1.8],[0,Math.PI,0]),xf([0,0,0])),Object.assign({},LUS,{armR:[-.3,0,.2],elbowR:.4}),{gold:1});}
function sAlc(t){const k=ease(ss(0,4.5,t));env(D({eye:[lerp(40,30,k),lerp(10,12,k),lerp(48,40,k)],tgt:[0,7,0],fov:44,far:900,sunD:[-.3,.5,.6],fog:[.82,.86,.9],fogD:.004,shadow:{c:[0,0,0],r:40},desat:.3}));sea([.16,.4,.52]);
 draw(BOX,{p:[0,3,0],s:[24,12,10],c:[.5,.48,.44],pat:6,patS:.6});rock(xf([0,-3,3],[0,0,0]),14,[.5,.48,.44],3);rock(xf([-6,-2,-2],[0,2,0]),12,[.52,.5,.46],1);rock(xf([10,-2,6],[0,1,0]),7,[.52,.5,.46],5);rock(xf([-9,-2,4],[0,2,0]),8,[.48,.46,.42],7);
 draw(BOX,{p:[0,9.5,0],s:[20,5,6],c:[.88,.86,.8],pat:6,patS:1.5});draw(BOX,{p:[0,12.2,0],s:[20.4,.4,6.4],c:[.6,.6,.58]});for(let i=0;i<12;i++)draw(BOX,{p:[-9+i*1.65,10,3.03],s:[.5,2.4,.05],c:[.25,.28,.3]});
 draw(BOX,{p:[-12,9,4],s:[5,3,4],c:[.86,.84,.78],pat:6});draw(CYL,{p:[8,9,2],s:[.9,8,.9],c:[.92,.9,.86]});draw(CYL,{p:[8,17,2],s:[1.1,1.2,1.1],c:[.3,.3,.3]});draw(SPH,{p:[8,17.6,2],s:[.7,.7,.7],c:[1,.95,.7],u:1});
 for(let i=0;i<6;i++){const ph=(t*.2+i/6)%1;draw(SPHL,{p:[-40+ph*80,14+i,(i-3)*12],s:[.3,.12,.5],c:[.95,.95,.95],noInk:1,noShadow:1});}}
function sStill(t){const k=ease(ss(0,3.0,t));const E=[lerp(-30,-24,k),lerp(2,6,k),lerp(-10,-30,k)],TG=[TP[0],lerp(30,44,k),TP[2]];env(GH({eye:E,tgt:TG,fov:48,far:900,sunD:[-.6,.25,.6],shadow:{c:[0,0,TP[2]],r:60},bloom:1}));parisGround([.5,.56,.38]);
 tower(xf(TP,[0,.4,0],TK),{gold:1});const r=rnd(5);for(let i=0;i<40;i++){const x=-80+r()*160,z=-150+r()*120;if(Math.abs(x)<34&&z>-110)continue;tree(xf([x,0,z]),1.5+r(),null,'broad');}
 for(let i=0;i<5;i++)haus(xf([-50,0,-30-i*14],[0,Math.PI/2,0]),12,5);}
function sArchive(t){env({noSky:1,sky:[.46,.42,.38],gnd:[.26,.22,.19],sunC:[.5,.42,.34],sunD:[-.3,.6,.7],fog:[.15,.13,.11],fogD:.03,eye:[lerp(.6,0,ease(ss(0,4,t))),1.95,lerp(5.5,4.4,ease(ss(0,4,t)))],tgt:[0,1.95,0],fov:44,plP:[0,2.5,2],plC:[.85,.65,.38],plR:7,bloom:1});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 draw(BOX,{p:[0,.9,1.2],s:[1.8,.06,.8],c:[.4,.26,.15]});for(const sx of[-.8,.8])draw(BOX,{p:[sx,.45,1.2],s:[.06,.9,.6],c:[.35,.22,.13]});
 tower(cxf(xf([0,.93,1.2],[0,.6+t*.15,0]),xf([0,0,0],[0,0,0],.045)),{gold:1});}
// ---------- timeline ----------
const S=[[0,1.6,sGlobe],[1.6,4.5,sTower],[4.5,7.8,sNotOwn],[7.8,12.6,sLustig],[12.6,17.2,sNews],[17.2,21.6,sFair],[21.6,24.4,sDesk],[24.4,28.4,sHotel],[28.4,32.6,sMeet],[32.6,34.8,sHush],[34.8,38.55,sPoisson],[38.55,44.2,sBribe],[44.2,47.5,sTrain],[47.5,50.85,sShame],[50.85,54.75,sReturn],[54.75,58.95,sPolice],[58.95,63.45,sAlc],[63.45,66.4,sStill],[66.4,74.0,sArchive]];
const END=74.0;
const RIB=[[1.7,.62,'1925'],[17.3,0,'1889'],[21.7,.62,'1925'],[51.0,.64,'LATER IN 1925'],[59.1,1,'1947']];
function overlays(T,fn,lt){
 badge('PARIS, FRANCE','1925',LON,LAT,T,ss(1.4,2.0,T)*(1-ss(66.0,66.4,T)));
 ribbon(T,RIB,['1889','1947'],ss(1.6,2.0,T)*(1-ss(66.0,66.4,T)));
 if(fn===sGlobe)bigText([['1925',120,GOLD]],.3,1.55,T,560);
 seal(1,'THE CON',7.85,T);seal(2,'THE SALE',21.65,T);seal(3,'THE TWIST',47.55,T);
 if(fn===sTower)tag('SOLD FOR SCRAP',W/2,420,2.4,4.4,T,{size:40});
 if(fn===sNotOwn){tag('HE DID NOT OWN IT',W/2,420,4.7,5.9,T,{size:36});tag('...AND TRIED AGAIN',W/2,420,6.0,7.7,T,{size:36});}
 if(fn===sLustig)museum('VICTOR LUSTIG','Con artist, "the Count"','1890–1947',560,960,8.6,12.4,T,'r');
 if(fn===sNews)tag('"RUSTING, COSTLY TO REPAIR"',W/2,420,13.4,17.1,T,{size:32});
 if(fn===sFair){tag("BUILT FOR THE 1889 WORLD'S FAIR",W/2,420,17.4,19.4,T,{size:30});tag('MEANT TO BE TEMPORARY',W/2,420,19.5,21.5,T,{size:34});}
 if(fn===sDesk)tag('FAKE GOVERNMENT OFFICIAL',W/2,420,21.9,24.3,T,{size:32});
 if(fn===sHotel)tag('SECRET MEETING · LUXURY HOTEL',W/2,420,25.2,28.3,T,{size:30});
 if(fn===sMeet)tag('FOR THE HIGHEST BIDDER',W/2,420,30.6,32.5,T,{size:34});
 if(fn===sHush)tag('TOP SECRET',W/2,420,32.9,34.7,T,{size:40});
 if(fn===sPoisson)museum('ANDRÉ POISSON','Scrap-metal dealer',null,560,960,35.2,38.4,T,'r');
 if(fn===sBribe){if(lt<2.6)tag('"OFFICIALS ARE POORLY PAID"',W/2,420,38.8,41.1,T,{size:30});else tag('A BRIBE ON TOP',W/2,420,41.6,44.1,T,{size:38});}
 if(fn===sTrain)tag('ESCAPE: TRAIN TO AUSTRIA',W/2,420,44.4,47.4,T,{size:32});
 if(fn===sShame)tag('TOO EMBARRASSED TO REPORT IT',W/2,420,48.6,50.8,T,{size:30});
 if(fn===sReturn)tag('THE SAME CON, AGAIN',W/2,420,51.2,54.6,T,{size:34});
 if(fn===sPolice){if(lt<2.2)tag('THIS TIME: POLICE',W/2,420,55.0,56.9,T,{size:36});else tag('FLED TO AMERICA',W/2,420,57.1,58.9,T,{size:36});}
 if(fn===sAlc)tag('DIED IN ALCATRAZ · 1947',W/2,420,59.3,63.3,T,{size:34});
 if(fn===sStill)bigText([['STILL',80,PARCH],['STANDING',96,GOLD]],64.7,66.35,T,520);
 if(fn===sArchive){archiveCard([['SAVED BY RADIO'],'Paris planned to take the tower','down. It survived partly because','it was useful as a radio antenna.'],66.8,T);outro(71.8,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;flFree();cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
