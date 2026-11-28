// ===== DAGEN H: THE DAY SWEDEN SWITCHED SIDES (3 Sept 1967) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
const LON=18.07,LAT=59.33;
function rnd(s){let x=s;return()=>{x=(x*9301+49297)%233280;return x/233280;};}
const FLM=[];function flFree(){while(FLM.length){const m=FLM.pop();gl.deleteVertexArray(m.vao);gl.deleteBuffer(m.pb);gl.deleteBuffer(m.nb);gl.deleteBuffer(m.ib);}}
function lineC(P,a,b,r,c,o){const d=sub(b,a),L=Math.hypot(...d)||1e-4;draw(CYL,Object.assign({P,p:a,r:[Math.acos(clamp(d[1]/L,-1,1)),Math.atan2(d[0],d[2]),0],s:[r,L,r],c:c||[.15,.12,.1],noShadow:1},o||{}));}
function camPlaque(e,tg,dist,dx,dy,k,val,dig,cap){const f=norm(sub(tg,e));const r=norm(cross(f,[0,1,0]));const u=cross(r,f);const p=[e[0]+f[0]*dist+r[0]*dx+u[0]*dy,e[1]+f[1]*dist+r[1]*dx+u[1]*dy,e[2]+f[2]*dist+r[2]*dx+u[2]*dy];
 const d=sub(e,p);const yaw=Math.atan2(d[0],d[2]);const pit=Math.atan2(d[1],Math.hypot(d[0],d[2]));plaque3D(cxf(xf(p,[0,yaw,0]),xf([0,0,0],[-pit,0,0])),val,dig,cap,k);}
tree=function(P,k,c,type){k=k||1;type=type||'broad';const v=Math.abs(Math.round((P.M[12]*7.3+P.M[14]*3.1)))%3;const tc=c||(type==='pine'?[.2,.42,.24]:[.34,.54,.26]);
 const key=type+v;const def=treeDef(type,v*3+1);
 const tm=propMesh('trunk'+key,trunkSDF(def),[-2,-.06,-2],[2,def.trunkH+1.8,2],.035);draw(tm,{P,s:[k,k,k],c:[.4,.28,.17],pat:2,patS:7});
 const cm=propMesh('can'+key,canopySDF(def,v*1.7),type==='pine'?[-1.5,.8,-1.5]:[-2.4,1.0,-2.4],type==='pine'?[1.5,4.6,1.5]:[2.4,4.0,2.4],.05);draw(cm,{P,s:[k,k,k],c:tc});};
// ---------- environments ----------
const DAWN={sky:[.86,.8,.78],gnd:[.5,.46,.44],sunC:[.95,.78,.6],sunD:[-.7,.35,.5],fog:[.92,.82,.76],fogD:.004,skyTop:[.38,.5,.82],clouds:.35,cloudC:[1,.86,.78],toon:.15};
const DW=o=>Object.assign({},DAWN,o);
const DAY={sky:[.8,.84,.88],gnd:[.5,.48,.44],sunC:[.84,.78,.66],sunD:[-.45,.75,.45],fog:[.84,.88,.94],fogD:.0035,skyTop:[.3,.52,.88],clouds:.45,toon:.15};
const D=o=>Object.assign({},DAY,o);
const IN=o=>Object.assign({noSky:1,sky:[.8,.76,.7],gnd:[.44,.38,.32],sunC:[.62,.58,.5],sunD:[-.3,.8,.5],fog:[.4,.36,.32],fogD:.016,plC:[.9,.8,.62],plR:10,toon:.12},o);
const SPACE={bg:[.04,.07,.13],fog:[.04,.07,.13],fogD:0,sky:[.9,.9,.95],gnd:[.5,.5,.56],sunC:[.55,.52,.48],sunD:[.8,.3,.5],ink:.8,inkFar:50};
const BLUE=[.12,.36,.72],YEL=[.98,.8,.16];
// ---------- vehicles ----------
function rbox(x,y,z,c,b,r){const q=[Math.abs(x-c[0])-b[0],Math.abs(y-c[1])-b[1],Math.abs(z-c[2])-b[2]];return Math.hypot(Math.max(q[0],0),Math.max(q[1],0),Math.max(q[2],0))+Math.min(Math.max(q[0],q[1],q[2]),0)-r;}
function carSDF(){return(x,y,z)=>{let d=rbox(x,y,z,[0,.62,0],[.7,.2,1.95],.18);const cab=rbox(x,y,z,[0,1.05,-.25],[.6,.2,.95],.16);d=SD.smin(d,cab,.25);
 for(const sx of[-1,1])for(const sz of[-1.3,1.25])d=SD.smax(d,-(Math.hypot(y-.38,z-sz)-.42+Math.max(0,Math.abs(x)-.9)*0),.05)*(Math.abs(x)>.55?1:1);return d;};}
function car(P,o){o=o||{};const c=o.c||[.7,.15,.12],g=o.gold||0;const m=propMesh('car',carSDF(),[-1.0,.1,-2.3],[1.0,1.5,2.3],.03);
 const B=cxf(P,xf([0,0,0]));draw(m,{P:B,c,gold:g,g:.7});
 const GL=[.2,.28,.36];const GA=o.glassA||1;draw(BOX,{P:B,p:[0,1.07,.72],r:[-.6,0,0],s:[1.15,.36,.02],c:GL,g:.9,noInk:1,a:GA<1?GA:undefined});draw(BOX,{P:B,p:[0,1.07,-1.2],r:[.6,0,0],s:[1.1,.34,.02],c:GL,g:.9,noInk:1,a:GA<1?GA:undefined});
 for(const sd of[-1,1]){draw(BOX,{P:B,p:[sd*.76,1.08,-.25],s:[.02,.3,1.6],c:GL,g:.9,noInk:1,a:GA<1?GA:undefined});
  for(const sz of[-1.3,1.25]){draw(CYL,{P:B,p:[sd*.74,.38,sz],r:[0,0,Math.PI/2],s:[.36,.22,.36],c:[.08,.08,.09]});draw(CYL,{P:B,p:[sd*.86,.38,sz],r:[0,0,Math.PI/2],s:[.2,.02,.2],c:[.85,.85,.88],g:.8,noInk:1});}
  draw(SPH,{P:B,p:[sd*.52,.7,2.12],s:[.13,.13,.06],c:o.lights?[1,.95,.75]:[.95,.95,.9],u:o.lights?1:0,noInk:1});
  draw(BOX,{P:B,p:[sd*.55,.72,-2.12],s:[.2,.1,.04],c:o.brake?[1,.15,.1]:[.6,.1,.08],u:o.brake?1:0,noInk:1});}
 draw(BOX,{P:B,p:[0,.5,2.15],s:[1.5,.1,.08],c:[.85,.85,.88],g:.9});draw(BOX,{P:B,p:[0,.5,-2.15],s:[1.5,.1,.08],c:[.85,.85,.88],g:.9});
 // driver (seated on the LEFT side: x>0 when facing +z)
 if(o.driver!==false){draw(SPH,{P:B,p:[.3,1.12,-.1],s:[.11,.13,.11],c:[.92,.75,.62],noInk:1});draw(SPH,{P:B,p:[.3,1.2,-.13],s:[.11,.07,.11],c:o.hair||[.35,.25,.15],noInk:1});}}
function carOpen(P,o){o=o||{};const c=o.c||[.2,.45,.6];// cutaway: body tub, seats, wheel on the left
 draw(BOX,{P,p:[0,.55,0],s:[1.7,.5,4.2],c,g:.6});draw(BOX,{P,p:[0,.82,0],s:[1.5,.06,2.4],c:[.25,.22,.2]});
 for(const sz of[.1,-1])draw(BOX,{P,p:[0,1.05,sz],s:[1.4,.5,.15],c:[.55,.35,.22]});
 draw(BOX,{P,p:[0,.95,1.0],s:[1.5,.25,.3],c:[.3,.28,.26]});const WP=cxf(P,xf([.36,1.15,.75],[-.5,0,0]));draw(TUBE||CYL,{P:WP,s:[.2,.03,.2],c:[.95,.8,.3],gold:o.gold||0});lineC(WP,[0,0,0],[0,-.1,.22],.02,[.2,.2,.2]);
 for(const sd of[-1,1])for(const sz of[-1.3,1.25])draw(CYL,{P,p:[sd*.82,.38,sz],r:[0,0,Math.PI/2],s:[.36,.2,.36],c:[.08,.08,.09]});
 person(cxf(P,xf([.36,.7,.25])),{sit:1,coat:[.3,.3,.36],armR:[-1.05,0,.1],elbowR:.55,armL:[-1.05,0,-.1],elbowL:.55,head:[.05,0,0],hair:HAIRS[2],seed:5});}
function truckSDF(){return(x,y,z)=>{let d=rbox(x,y,z,[0,1.2,1.7],[.95,.75,.7],.15);d=SD.smin(d,rbox(x,y,z,[0,.65,2.55],[.9,.3,.35],.15),.15);return d;};}
function truck(P,o){o=o||{};const m=propMesh('truckcab',truckSDF(),[-1.2,0,.8],[1.2,2.2,3.1],.035);draw(m,{P,c:o.c||[.25,.42,.3],g:.6});
 draw(BOX,{P,p:[0,1.7,-1.4],s:[2.2,2.4,4.6],c:[.72,.7,.64],pat:2,patS:2});draw(BOX,{P,p:[0,.45,-.2],s:[1.6,.3,6.6],c:[.2,.2,.22]});
 draw(BOX,{P,p:[0,1.55,2.42],r:[-.15,0,0],s:[1.6,.55,.03],c:[.2,.28,.36],g:.9,noInk:1});
 for(const sd of[-1,1])for(const sz of[2.0,-2.4,-.9])draw(CYL,{P,p:[sd*.95,.45,sz],r:[0,0,Math.PI/2],s:[.45,.26,.45],c:[.08,.08,.09]});}
function bus(P,o){o=o||{};const c=o.c||[.75,.2,.16];draw(BOX,{P,p:[0,1.55,0],s:[2.4,2.5,10],c,g:.5});draw(BOX,{P,p:[0,2.85,0],s:[2.3,.15,9.8],c:[.92,.9,.86]});draw(BOX,{P,p:[0,.55,0],s:[2.42,.5,10.02],c:[.9,.88,.82]});
 for(const sd of[-1,1])for(let i=0;i<6;i++){if(sd<0&&i===0)continue;draw(BOX,{P,p:[sd*1.21,2.0,3.6-i*1.45],s:[.03,.8,1.25],c:[.25,.32,.4],g:.9,noInk:1});}
 draw(BOX,{P,p:[0,1.95,5.01],s:[2.1,.9,.03],c:[.25,.32,.4],g:.9,noInk:1});draw(BOX,{P,p:[0,2.6,5.02],s:[1.4,.3,.03],c:[.1,.1,.1],noInk:1});
 // door on the RIGHT side (-x when facing +z), opening
 const op=o.door||0;const g=o.gold||0;draw(BOX,{P,p:[-1.22,1.45,3.6+op*.4],s:[.05,2.2,.6],c:[.9,.75,.3],gold:g,g:.6});draw(BOX,{P,p:[-1.22,1.45,3.0-op*.4],s:[.05,2.2,.6],c:[.9,.75,.3],gold:g,g:.6});
 if(op>.2)draw(BOX,{P,p:[-1.19,1.45,3.3],s:[.02,2.2,1.2*op],c:[.12,.1,.08],noInk:1});
 for(const sd of[-1,1])for(const sz of[3.4,-3.2])draw(CYL,{P,p:[sd*1.1,.48,sz],r:[0,0,Math.PI/2],s:[.5,.3,.5],c:[.08,.08,.09]});
 for(const sd of[-1,1])draw(SPH,{P,p:[sd*.85,.85,5.02],s:[.14,.14,.05],c:[.95,.95,.9],noInk:1});}
// ---------- road + city ----------
let GK='';function flat(x,z){return 0;}
function ground(c){if(GK!=='F'){setGrid(-160,160,-160,160,flat);GK='F';}draw(GRID,{c:c||[.48,.6,.34],pat:1,patS:1.2});}
// road along z, centred x=0, width w; mid: dashed centre line
function roadZ(x,z0,z1,w,o){o=o||{};const L=z1-z0,zc=(z0+z1)/2;draw(BOX,{p:[x,.02,zc],s:[w,.04,L],c:[.36,.36,.38],pat:7,patS:3,noShadow:1});
 for(const sd of[-1,1])draw(BOX,{p:[x+sd*(w/2-.25),.045,zc],s:[.12,.01,L],c:[.95,.95,.92],noInk:1,noShadow:1});
 const n=Math.floor(L/4);for(let i=0;i<n;i++)draw(BOX,{p:[x,.045,z0+2+i*4],s:[.14,.01,2],c:o.mid||[.95,.95,.92],noInk:1,noShadow:1});
 if(o.laneL!==undefined&&o.laneL>0)draw(BOX,{p:[x+w/4,.05,zc],s:[w/2-.4,.01,L],c:[1,.75,.2],a:.35*o.laneL,u:1,gold:1,noInk:1,noShadow:1});
 if(o.laneR!==undefined&&o.laneR>0)draw(BOX,{p:[x-w/4,.05,zc],s:[w/2-.4,.01,L],c:[1,.75,.2],a:.35*o.laneR,u:1,gold:1,noInk:1,noShadow:1});}
function sidewalk(x,z0,z1,w){draw(BOX,{p:[x,.08,(z0+z1)/2],s:[w,.16,z1-z0],c:[.72,.7,.66],pat:6,patS:2});}
const WALLS=[[.92,.84,.66],[.86,.62,.42],[.9,.88,.8],[.78,.5,.36],[.94,.9,.74],[.7,.74,.66]];
function cityBlock(side,z0,n,seed){const r=rnd(seed||3);for(let i=0;i<n;i++){const z=z0+i*9.2;const fl=3+Math.floor(r()*3);house(xf([side*12.5,0,z],[0,side>0?-Math.PI/2:Math.PI/2,0]),{w:9,d:8,floors:fl,style:r()<.3?'brick':'plaster',wall:WALLS[Math.floor(r()*6)],roof:[.3,.32,.36],trim:[.95,.94,.9],door:true});}}
function street(o){o=o||{};ground([.5,.55,.45]);roadZ(0,-120,80,10,o);sidewalk(7.0,-120,80,4);sidewalk(-7.0,-120,80,4);cityBlock(1,-110,20,3);cityBlock(-1,-106,20,7);
 for(let i=0;i<14;i++){lamppost(xf([5.6,.16,-100+i*12]),o.lamps);lamppost(xf([-5.6,.16,-94+i*12]),o.lamps);}
 for(let i=0;i<10;i++){tree(xf([6.6,.16,-90+i*16]),.7,null,'broad');}}
// traffic: cars along z, lane side +1 (left traffic, +z) or -1 (right traffic)
const CARC=[[.75,.18,.14],[.2,.42,.62],[.9,.88,.82],[.25,.5,.32],[.88,.7,.2],[.45,.45,.5],[.62,.3,.5]];
// ---------- signs ----------
const HSIGN=document.createElement('canvas');HSIGN.width=512;HSIGN.height=512;(()=>{const g=HSIGN.getContext('2d');g.fillStyle='#f6c62a';g.beginPath();g.arc(256,256,250,0,6.29);g.fill();
 g.strokeStyle='#1d4fa0';g.lineWidth=18;g.beginPath();g.arc(256,256,226,0,6.29);g.stroke();g.fillStyle='#1d4fa0';g.font='900 300px Montserrat';g.textAlign='center';g.textBaseline='middle';g.fillText('H',256,250);
 g.lineWidth=26;g.beginPath();g.arc(256,256,175,Math.PI*.95,Math.PI*1.45);g.stroke();g.beginPath();g.moveTo(256-10,70);g.lineTo(256+40,82);g.lineTo(256-4,108);g.closePath();g.fill();})();
function hsign(P,k,g){useTex('hsign',HSIGN);k=k||1;draw(CYL,{P,p:[0,0,0],s:[.06,2.4*k,.06],c:[.6,.6,.62],g:.6});draw(CYL,{P,p:[0,2.4*k+.45*k,-.03],r:[Math.PI/2,0,0],s:[.48*k,.03,.48*k],c:[.85,.85,.85],gold:g||0});
 draw(QUAD,{P,p:[0,2.4*k+.45*k,.005],s:[.9*k,.9*k,1],c:[1,1,1],tex:3,u:1});}
const RSIGN=document.createElement('canvas');RSIGN.width=256;RSIGN.height=256;(()=>{const g=RSIGN.getContext('2d');g.fillStyle='#2a6ad0';g.beginPath();g.arc(128,128,124,0,6.29);g.fill();g.strokeStyle='#fff';g.lineWidth=10;g.beginPath();g.arc(128,128,112,0,6.29);g.stroke();
 g.fillStyle='#fff';g.beginPath();g.moveTo(60,140);g.lineTo(150,140);g.lineTo(150,175);g.lineTo(205,118);g.lineTo(150,62);g.lineTo(150,97);g.lineTo(60,97);g.closePath();g.fill();})();
const LSIGN=document.createElement('canvas');LSIGN.width=256;LSIGN.height=256;(()=>{const g=LSIGN.getContext('2d');g.translate(256,0);g.scale(-1,1);g.drawImage(RSIGN,0,0);})();
function rsign(P,cv,key,flip){useTex(key,cv);draw(CYL,{P,p:[0,0,0],s:[.05,2.1,.05],c:[.6,.6,.62]});draw(CYL,{P,p:[0,2.4,-.025],r:[Math.PI/2,0,0],s:[.36,.02,.36],c:[.9,.9,.9]});draw(QUAD,{P,p:[0,2.4,.003],s:[.68,.68,1],c:[1,1,1],tex:3,u:1});}
// ---------- people ----------
const _person=person;person=function(P,o,G){_person(G&&G.gold?cxf(P,xf([0,0,0]),{gold:G.gold}):P,o);};
const WORK=i=>({coat:[.85,.5,.15],pants:[.22,.24,.32],jacket:false,shirt:[.85,.5,.15],hat:'cap',hatc:[.9,.9,.86],seed:20+i,hair:HAIRS[i%4]});
const CIT=i=>({coat:[[.36,.4,.5],[.55,.4,.3],[.3,.32,.3],[.6,.52,.4]][i%4],dress:i%3==1?[[.7,.35,.3],[.3,.45,.6],[.75,.62,.3]][i%3]:undefined,hairStyle:i%3==1?'bun':undefined,hair:HAIRS[i%4],seed:30+i});
// ===================== SCENES =====================
function stars(n,R){const r=rnd(3);for(let i=0;i<(n||90);i++){const a=r()*6.28,e=(r()-.3)*1.4;draw(SPHL,{p:[Math.cos(a)*Math.cos(e)*R,Math.sin(e)*R+10,Math.sin(a)*Math.cos(e)*R],s:[.12,.12,.12].map(v=>v*R/60),c:[1,1,1],u:1,id:0,noShadow:1});}}
function sGlobe(t){const k=ease(ss(0,2.6,t));env({...SPACE,eye:[0,0,lerp(5.6,2.9,k)],tgt:[0,0,0],fov:40});globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.6,ss(1.2,1.8,t));stars(80,40);}
// 1. street clock at 4:50, dawn
function clock(P,hh,mm){draw(CYL,{P,p:[0,0,0],s:[.12,3.4,.12],c:[.15,.25,.2],g:.6});draw(CYL,{P,p:[0,3.4,0],s:[.2,.3,.2],c:[.15,.25,.2]});const C=cxf(P,xf([0,3.95,0]));
 draw(SPH,{P:C,s:[.6,.6,.3],c:[.15,.25,.2],g:.6});draw(CYL,{P:C,p:[0,0,-.32],r:[Math.PI/2,0,0],s:[.56,.64,.56],c:[.15,.25,.2],g:.6});for(const sd of[-1,1]){draw(CYL,{P:C,p:[0,0,sd*.31],r:[Math.PI/2,0,0],s:[.5,.012,.5],c:[.97,.95,.88],noInk:1});
  for(let i=0;i<12;i++){const a=i/12*6.283;draw(BOX,{P:C,p:[Math.sin(a)*.4,Math.cos(a)*.4,sd*.325],r:[0,0,-a],s:[.025,.07,.01],c:[.1,.1,.1],noInk:1});}
  const ah=(hh%12+mm/60)/12*6.283,am=mm/60*6.283;draw(BOX,{P:C,p:[Math.sin(ah)*.12,Math.cos(ah)*.12,sd*.33],r:[0,0,-ah],s:[.035,.26,.01],c:[.08,.08,.08],noInk:1});draw(BOX,{P:C,p:[Math.sin(am)*.17,Math.cos(am)*.17,sd*.335],r:[0,0,-am],s:[.025,.36,.01],c:[.08,.08,.08],noInk:1});}}
function sClock(t){const k=ease(ss(0,2.2,t));const E=[lerp(2.4,1.6,k),lerp(2.8,3.6,k),lerp(7,4.2,k)+-20],TG=[5.6,3.9,-24];env(DW({eye:E,tgt:TG,fov:42,shadow:{c:[5,0,-24],r:10},bloom:1}));street({lamps:1});
 clock(xf([5.6,.16,-24]),4,49+ss(.4,1.2,t));}
// 2. every vehicle stops (left traffic)
function lhtCars(t,z0,spd,stop,o){o=o||{};for(let i=0;i<6;i++){const dir=i%2?1:-1;const lane=dir*2.4;// LEFT traffic: moving +z keeps x>0
  const base=z0+i*9*(dir)+(dir>0?-30:30);const z=base+dir*spd*Math.min(t,stop)+dir*spd*.5*ss(stop,stop+.9,t)*.6;const P=xf([lane,0,z],[0,dir>0?0:Math.PI,0]);car(P,{c:CARC[i%7],brake:t>stop-.2,lights:1,gold:o.gold&&i==o.gold?1:0});}}
function sStop(t){const k=ease(ss(0,3.4,t));const E=[lerp(-3.6,-2.6,k),lerp(2.6,3.4,k),lerp(14,10,k)],TG=[1.4,.9,-6];env(DW({eye:E,tgt:TG,fov:44,shadow:{c:[0,0,-6],r:18}}));street({lamps:1});
 for(let i=0;i<5;i++){const z=-24+i*10+lerp(-6,0,ss(0,1.8,t));car(xf([2.4,0,z]),{c:CARC[i],brake:t>1.6,lights:1});car(xf([-2.4,0,-28+i*10-lerp(-6,0,ss(0,1.8,t))],[0,Math.PI,0]),{c:CARC[(i+3)%7],brake:t>1.6,lights:1});}
 hsign(xf([5.6,.16,-2],[0,-.5,0]),1,0);}
// 3. top-down: every car steers to the other side
function sCross(t){const k=ease(ss(0,4.9,t));const E=[lerp(-1,-4,k),lerp(30,24,k),lerp(-4,6,k)],TG=[0,0,lerp(-10,-6,k)];env(DW({eye:E,tgt:TG,fov:44,shadow:{c:[0,0,-8],r:26}}));street({lamps:1});
 const sw=ease(ss(.6,4.4,t));for(let i=0;i<5;i++){const z=-24+i*10+sw*2;const x=lerp(2.4,-2.4,sw);car(xf([x,0,z],[0,-Math.sin(sw*Math.PI)*.5,0]),{c:CARC[i],lights:1,gold:i==2?1:0});
  const z2=-28+i*10-sw*2;car(xf([lerp(-2.4,2.4,sw),0,z2],[0,Math.PI-Math.sin(sw*Math.PI)*.5,0]),{c:CARC[(i+3)%7],lights:1});}}
// 4. the H sign
function sH(t){const a=.6-t*.25;const E=[Math.sin(a)*4.2,lerp(2.4,3.0,ss(0,2.2,t)),Math.cos(a)*4.2],TG=[0,2.9,0];env(DW({eye:E,tgt:TG,fov:40,dof:[4.3,2.5],shadow:{c:[0,0,0],r:6}}));ground([.5,.6,.38]);
 roadZ(-4,-60,60,7);hsign(xf([0,0,0]),1,0);for(let i=0;i<4;i++)tree(xf([6+i*3,0,-8-i*4]),1,null,'pine');}
// 5. left vs right lanes (diagram road)
function sLanes(t){const k=ease(ss(0,5.2,t));const E=[lerp(9,6,k),lerp(9,11,k),lerp(10,12,k)],TG=[0,0,0];env(D({eye:E,tgt:TG,fov:44,shadow:{c:[0,0,0],r:16}}));ground();
 const sw=ss(3.2,4.2,t);roadZ(0,-60,60,8,{laneL:1-sw,laneR:sw});
 for(let i=0;i<3;i++){const z=((t*6+i*12)%36)-18;car(xf([lerp(2,-2,sw),0,z]),{c:CARC[i],gold:i==1?.6:0});const z2=18-((t*6+i*12+6)%36);car(xf([lerp(-2,2,sw),0,z2],[0,Math.PI,0]),{c:CARC[i+3]});}
 for(let i=0;i<8;i++)tree(xf([9+(i%2)*4,0,-20+i*6]),1,null,i%3?'broad':'pine');}
// 6. map: neighbours drive on the right
const MAPC=document.createElement('canvas');MAPC.width=1024;MAPC.height=1024;let MAPD=0;const ML0=-2,ML1=38,MA0=52,MA1=72;
function mapXZ(lon,lat){return[((lon-ML0)/(ML1-ML0)-.5)*20,((MA1-lat)/(MA1-MA0)-.5)*20];}
function drawMap(){if(MAPD)return;MAPD=1;const g=MAPC.getContext('2d');g.fillStyle='#5aa5d8';g.fillRect(0,0,1024,1024);
 const X=x=>(x-ML0)/(ML1-ML0)*1024,Y=y=>(MA1-y)/(MA1-MA0)*1024;g.fillStyle='#cfd9a8';g.strokeStyle='#4a5a2a';g.lineWidth=3;LAND.forEach(poly=>{g.beginPath();poly.forEach(([x,y],i)=>{i?g.lineTo(X(x),Y(y)):g.moveTo(X(x),Y(y));});g.closePath();g.fill();g.stroke();});
 const lab=(t,lo,la,c,s)=>{g.font=`700 ${s||40}px Cinzel`;g.textAlign='center';g.fillStyle=c;g.fillText(t,X(lo),Y(la));};
 lab('NORWAY',9,62,'#3a3020');lab('FINLAND',27,63.5,'#3a3020');lab('DENMARK',9,55.6,'#3a3020',30);lab('SWEDEN',15.5,63.6,'#9a5f08',46);}
function sMap(t){drawMap();useTex('map',MAPC);const k=ease(ss(0,3.1,t));const c=mapXZ(16,62);const E=[c[0]+lerp(1,0,k),lerp(32,27,k),c[1]+lerp(12,9,k)],TG=[c[0],0,c[1]-.5];
 env({noSky:1,bg:[.86,.9,.94],sky:[.85,.85,.85],gnd:[.6,.6,.6],sunC:[.6,.58,.54],sunD:[-.3,.9,.4],fog:[.86,.9,.94],fogD:.004,eye:E,tgt:TG,fov:44,shadow:false});
 draw(QUAD,{p:[0,0,0],r:[-Math.PI/2,0,0],s:[20,20,1],c:[1,1,1],tex:3,u:1});
 const pins=[[10,61,1],[26,63,1],[10,56,1],[16,62.5,0]];pins.forEach(([lo,la,right],i)=>{const p=mapXZ(lo,la);const s=ss(.3+i*.35,.7+i*.35,t);if(s<=0)return;
  const P=xf([p[0],.05,p[1]],[0,0,0],2.2);draw(CYL,{P,p:[0,0,0],s:[.42*s,.06,.42*s],c:right?[.2,.6,.3]:[1,.72,.2],gold:right?0:1});
  // arrow: R = pointing right/forward, L = left
  draw(CONE,{P,p:[(right?.25:-.25)*s,.5*s,0],r:[0,0,right?-Math.PI/2:Math.PI/2],s:[.2*s,.3*s,.12*s],c:right?[.2,.6,.3]:[1,.72,.2],gold:right?0:1});lineC(P,[(right?-.25:.25)*s,.5*s,0],[(right?.1:-.1)*s,.5*s,0],.06*s,right?[.2,.6,.3]:[1,.72,.2]);});}
// 7. steering wheel on the left (cutaway, left traffic)
function sWheel(t){const k=ease(ss(0,3.6,t));const E=[lerp(1.7,1.7,k),lerp(5.4,4.4,k),lerp(-2.6,-1.6,k)],TG=[1.7,.8,.7];env(D({eye:E,tgt:TG,fov:44,shadow:{c:[0,0,0],r:6}}));ground();roadZ(0,-80,80,6.5);
 carOpen(xf([1.6,0,0]),{gold:ss(.6,1.4,t)});draw(BOX,{p:[0,.06,0],s:[.15,.01,40],c:[.95,.95,.92],noInk:1});}
// 8. overtaking blind on a narrow road
function sOvertake(t){const k=ease(ss(0,3.0,t));const E=[lerp(2.4,2.0,k),lerp(2.0,2.2,k),lerp(-9,-7,k)],TG=[1,1.2,10];env(D({eye:E,tgt:TG,fov:44,shadow:{c:[1,0,6],r:16}}));ground([.5,.62,.34]);roadZ(0,-80,120,6);
 for(let i=0;i<10;i++){tree(xf([6+(i%2)*3,0,-20+i*10]),1.1,null,i%3?'pine':'broad');tree(xf([-6-(i%2)*3,0,-16+i*10]),1.1,null,'pine');}
 const tz=4+t*6;truck(xf([1.6,0,tz]));// our car pulls out to the right (into oncoming lane in LEFT traffic) to look
 const out=ss(.6,1.3,t)*(1-ss(1.9,2.5,t));const cz=-3+t*6;car(xf([lerp(1.6,-.9,out),0,cz],[0,-out*.25+ss(1.9,2.3,t)*.2*(1-ss(2.3,2.8,t)),0]),{c:[.2,.42,.62],gold:.8});
 const oz=60-t*22;car(xf([-1.6,0,oz],[0,Math.PI,0]),{c:[.88,.7,.2],lights:1});}
// 9. the 1955 vote
function ballotBox(P){draw(BOX,{P,p:[0,.45,0],s:[.6,.5,.45],c:[.45,.3,.18],pat:2,patS:3});draw(BOX,{P,p:[0,.71,0],s:[.62,.04,.47],c:[.35,.22,.12]});draw(BOX,{P,p:[0,.735,0],s:[.3,.012,.04],c:[.05,.05,.05],noInk:1});}
function hall(){draw(BOX,{p:[0,-.5,0],s:[24,1,24],c:[.52,.38,.26],pat:2,patS:1.6,g:.3});draw(BOX,{p:[0,3,-4],s:[24,6,.2],c:[.85,.82,.72],pat:6,patS:1});
 for(let i=0;i<4;i++){draw(BOX,{p:[-6+i*4,2.6,-3.85],s:[1.6,2.4,.05],c:[.95,.95,.92]});draw(BOX,{p:[-6+i*4,2.6,-3.8],s:[1.4,2.2,.03],c:[.68,.82,.94],g:.8});}
 const flagC=document.createElement('canvas');}
function sVote(t){const k=ease(ss(0,3.2,t));const E=[lerp(2.6,2.0,k),lerp(1.9,1.7,k),lerp(4.4,3.4,k)],TG=[0,.95,0];env(IN({eye:E,tgt:TG,fov:44,plP:[0,3,2],shadow:{c:[0,0,0],r:5}}));hall();
 draw(BOX,{p:[0,.38,0],s:[1.6,.76,.8],c:[.35,.24,.15],pat:2,patS:2});ballotBox(xf([0,.38+.02,0],[0,0,0]));
 for(let i=0;i<4;i++){const ph=ss(i*.55,i*.55+1.4,t);const x=lerp(-3.2,-.55+i*.04,ph);const P=xf([x+(i>1?6:0)*0,0,lerp(1.2,.7,ph)+i*.7*(1-ph)],[0,Math.PI/2+.3,0]);
  if(i<2)person(xf([lerp(-3,-.75,ss(i*.7,i*.7+1.2,t))-i*.9,0,.4+i*.5],[0,Math.PI/2,0]),Object.assign(CIT(i),{walk:ss(i*.7,i*.7+1.2,t)<1?1:0,phase:t*6+i,armR:[-1.0*ss(1.2+i*.7,1.6+i*.7,t),0,.2],elbowR:.3}));}
 for(let i=0;i<4;i++){const s=ss(1.4+i*.5,1.8+i*.5,t);if(s<=0||s>=1)continue;draw(BOX,{p:[0,lerp(1.4,.75,s),0],r:[0,i,0],s:[.18,.005,.12],c:[.96,.95,.9],noInk:1});}
 for(let i=0;i<3;i++)person(xf([2.2+i*.8,0,-1.6],[0,-.4,0]),Object.assign(CIT(i+2),{}));}
// 10. 83% said NO
const NEJ=document.createElement('canvas');NEJ.width=256;NEJ.height=160;(()=>{const g=NEJ.getContext('2d');g.fillStyle='#f6f1e4';g.fillRect(0,0,256,160);g.strokeStyle='#888';g.lineWidth=4;g.strokeRect(4,4,248,152);g.fillStyle='#1d2a44';g.font='900 80px Montserrat';g.textAlign='center';g.textBaseline='middle';g.fillText('NEJ',128,70);g.font='600 22px Montserrat';g.fillText('(NO)',128,128);})();
function sNo(t){const k=ease(ss(0,2.2,t));const E=[lerp(.8,.3,k),lerp(2.4,2.1,k),lerp(2.6,2.1,k)],TG=[0,.8,0];env(IN({eye:E,tgt:TG,fov:44,plP:[0,3,1],shadow:{c:[0,0,0],r:3}}));hall();
 draw(BOX,{p:[0,.38,0],s:[2.4,.76,1.4],c:[.35,.24,.15],pat:2,patS:2});useTex('nej',NEJ);const r=rnd(4);const n=Math.floor(40*ss(0,1.6,t));
 for(let i=0;i<n;i++){const P=xf([(r()-.5)*1.8,.77+i*.004,(r()-.5)*1.0],[0,r()*6,0]);draw(QUAD,{P,r:[-Math.PI/2,0,0],s:[.28,.175,1],c:[1,1,1],tex:3,u:1});}
 if(t>.15)camPlaque(E,TG,1.5,0,.26,.26,Math.round(83*ease(ss(.2,1.3,t))),2,'% SAID NO');}
// 11. parliament does it anyway: gavel
function sParl(t){const k=ease(ss(0,1.8,t));const E=[lerp(1.8,1.3,k),lerp(2.0,1.8,k),lerp(3.2,2.6,k)],TG=[0,1.1,-.6];env(IN({eye:E,tgt:TG,fov:44,plP:[0,3,1],shadow:{c:[0,0,0],r:5}}));
 draw(BOX,{p:[0,-.5,0],s:[24,1,24],c:[.4,.22,.16],pat:2,patS:1.6});draw(BOX,{p:[0,3,-3],s:[24,6,.2],c:[.62,.5,.36],pat:2,patS:1});
 draw(BOX,{p:[0,.5,-.6],s:[2.6,1,.9],c:[.38,.22,.12],pat:2,patS:2});draw(BOX,{p:[0,1.02,-.6],s:[2.7,.05,1],c:[.45,.28,.16]});
 const hit=Math.max(0,Math.sin(Math.PI*clamp(t/0.6,0,1)))*(t<.6?1:0)+Math.max(0,Math.sin(Math.PI*clamp((t-.75)/.6,0,1)))*(t>.75&&t<1.35?1:0);
 person(xf([0,0,-1.5]),{coat:[.12,.12,.16],shirt:[.95,.95,.92],tie:[.15,.2,.4],hair:HAIRS[3],seed:9,armR:[-1.1-hit*.9,0,.3],elbowR:.4,head:[.2,0,0]});
 const GP=xf([.42,1.15+hit*.5,-.65],[0,0,.3+hit*.6]);lineC(GP,[0,0,0],[0,-.0,.35],.025,[.35,.2,.1]);draw(CYL,{P:GP,p:[0,0,.35],r:[0,0,Math.PI/2],s:[.07,.2,.07],c:[.4,.24,.12],gold:1});
 draw(CYL,{p:[.42,1.05,-.3],s:[.12,.04,.12],c:[.35,.2,.1]});
 for(let i=0;i<6;i++)person(xf([-3+i*1.2,0,1.2+(i%2)*.6],[0,Math.PI,0]),{coat:[.2+.05*(i%3),.2,.24],sit:0,hair:HAIRS[i%4],seed:70+i});}
// 12. preparing: painting new lines
function sPrep(t){const k=ease(ss(0,2.6,t));const E=[lerp(-5,-3.4,k),lerp(2.2,2.0,k),lerp(-4,-6,k)],TG=[-1.2,.5,4];env(D({eye:E,tgt:TG,fov:44,shadow:{c:[0,0,4],r:10}}));ground();roadZ(0,-60,60,8);
 const L=ss(0,2.5,t)*6;draw(BOX,{p:[-1.0,.05,2+L/2],s:[.14,.012,L],c:[1,.82,.2],u:1,noInk:1});
 person(xf([-1.0,0,2+L+.6],[0,Math.PI,0]),Object.assign(WORK(0),{walk:1,phase:t*5,lean:.25,armR:[-.9,0,.2],elbowR:.4,armL:[-.9,0,-.2],elbowL:.4}),{gold:.6});
 const CP=xf([-1.0,0,2+L+.1]);draw(BOX,{P:CP,p:[0,.35,0],s:[.4,.3,.5],c:[.85,.5,.15]});for(const sd of[-1,1])draw(CYL,{P:CP,p:[sd*.22,.12,0],r:[0,0,Math.PI/2],s:[.12,.04,.12],c:[.1,.1,.1]});
 for(let i=0;i<4;i++){const c=xf([2.8,0,-2+i*2.5]);draw(CONE,{P:c,p:[0,.35,0],s:[.18,.7,.18],c:[.95,.45,.12]});draw(BOX,{P:c,s:[.4,.04,.4],c:[.2,.2,.2]});}
 person(xf([3.6,0,1],[0,-2,0]),Object.assign(WORK(1),{armR:[-.6,0,.2],elbowR:.8}));}
// 13. 350,000 signs swapped
function sSigns(t){const k=ease(ss(0,3.8,t));const E=[lerp(-4,-3,k),lerp(2.2,2.4,k),lerp(6,5,k)],TG=[1,2.0,0];env(D({eye:E,tgt:TG,fov:44,shadow:{c:[1,0,0],r:8}}));ground();roadZ(-3.5,-60,60,6);
 const sw=ss(.6,1.6,t);const P=xf([1.2,0,0],[0,-.4,0]);if(sw<.5)rsign(cxf(P,xf([0,0,0],[0,0,0])),LSIGN,'lsign');else rsign(P,RSIGN,'rsign');
 // the old sign lifted off / new one put on
 const lift=Math.sin(Math.PI*sw);if(lift>.02)draw(BOX,{p:[1.2,2.4+lift*.6,.2],s:[.75,.75,.03],c:[.9,.9,.9],a:.0,u:1});
 const lad=xf([1.2,0,.6],[-.18,-.4,0]);for(const sd of[-1,1])lineC(lad,[sd*.25,0,0],[sd*.25,2.2,0],.03,[.7,.7,.72]);for(let i=1;i<7;i++)lineC(lad,[-.25,i*.3,0],[.25,i*.3,0],.02,[.7,.7,.72]);
 person(xf([1.25,1.0,.95],[0,Math.PI-.4,0]),Object.assign(WORK(2),{armR:[-2.3,0,.3],elbowR:.4,armL:[-2.1,0,-.3],elbowL:.4,head:[-.3,0,0]}),{gold:.6});
 // stack of old signs on a truck bed
 const TP=xf([-6,0,-6],[0,.2,0]);truck(TP,{c:[.2,.36,.5]});for(let i=0;i<8;i++)draw(CYL,{P:TP,p:[(i%2)*.2-.1,3.0+i*.04,-1.4+(i%3)*.4],s:[.36,.02,.36],c:[.3,.5,.82]});
 if(t>.8)camPlaque(E,TG,4.2,-.2,.95,.46,Math.round(350000*ease(ss(1.0,3.2,t))),6,'ROAD SIGNS');}
// 14. new buses with doors on the right
function sBus(t){const k=ease(ss(0,3.6,t));const E=[lerp(-5.8,-5.4,k),lerp(1.8,1.7,k),lerp(14,11,k)],TG=[-2.8,1.5,2];env(D({eye:E,tgt:TG,fov:44,shadow:{c:[0,0,0],r:12}}));street();
 const z=lerp(-10,0,ease(ss(0,1.6,t)));bus(xf([-2.4,0,z]),{door:ss(1.8,2.4,t),gold:ss(1.6,2.2,t)});
 for(let i=0;i<3;i++){const s=ss(2.4+i*.3,3.4+i*.3,t);person(xf([lerp(-6.2,-3.9,s),.16,lerp(4.4,3.3,s)],[0,1.4,0]),Object.assign(CIT(i),{walk:s>0&&s<1?1:0,phase:t*6+i}));}}
// 15. the H logo everywhere: milk carton + washing line
function carton(P,g){useTex('hsign',HSIGN);draw(BOX,{P,p:[0,.13,0],s:[.1,.26,.1],c:[.96,.96,.94],gold:g});draw(BOX,{P,p:[0,.275,0],s:[.1,.03,.06],c:[.94,.94,.92]});draw(QUAD,{P,p:[0,.14,.051],s:[.085,.085,1],c:[1,1,1],tex:3,u:1});}
function sLogo(t){const sh=t<2.2?0:1;const lt=sh?t-2.2:t;const k=ease(ss(0,sh?2.5:2.2,lt));
 if(!sh){const E=[lerp(.8,.6,k),lerp(1.25,1.15,k),lerp(1.25,1.0,k)],TG=[0,.92,0];env(IN({eye:E,tgt:TG,fov:40,dof:[Math.hypot(...sub(E,TG)),.4],plP:[.5,2,.8],shadow:{c:[0,0,0],r:1.5}}));
  draw(BOX,{p:[0,-.5,0],s:[10,1,10],c:[.6,.5,.38],pat:2,patS:2});draw(BOX,{p:[0,2,-1],s:[8,4,.1],c:[.92,.86,.62],pat:6});draw(BOX,{p:[0,.38,0],s:[1.4,.76,.9],c:[.85,.82,.75]});draw(BOX,{p:[0,.775,0],s:[1.42,.03,.92],c:[.4,.55,.65]});
  carton(xf([0,.79,0],[0,-.3+lt*.15,0]),.4);draw(CYL,{p:[.25,.79,.1],s:[.04,.1,.04],c:[.95,.95,.95],a:.5,u:1});draw(SPH,{p:[-.25,.82,.05],s:[.05,.03,.05],c:[.9,.75,.4]});return;}
 const E=[lerp(-2.2,-1.6,k),lerp(.9,1.0,k),lerp(4.6,4.0,k)+1.5],TG=[0,1.8,1.5];env(D({eye:E,tgt:TG,fov:44,shadow:{c:[0,0,0],r:5}}));ground();house(xf([0,0,-5]),{w:8,d:6,floors:2,style:'wood',wall:[.86,.32,.24],roof:[.3,.3,.32],trim:[.95,.94,.9],door:true});
 for(const sd of[-1,1])lineC(xf([0,0,1.5]),[sd*2.2,0,0],[sd*2.2,1.95,0],.04,[.5,.4,.3]);lineC(xf([0,0,1.5]),[-2.2,1.9,0],[2.2,1.9,0],.008,[.9,.9,.9]);
 useTex('hsign',HSIGN);for(let i=0;i<4;i++){const x=-1.5+i*1.0;const sway=Math.sin(t*2+i)*.06;const P=xf([x,1.88,1.5],[sway,0,0]);const cc=[[.95,.95,.98],[.6,.75,.95],[.98,.86,.9],[.95,.95,.98]][i],gg=i==1?.5:0;
  draw(BOX,{P,p:[0,-.04,0],s:[.4,.07,.012],c:cc,gold:gg});for(const sd of[-1,1])draw(BOX,{P,p:[sd*.1,-.17,0],r:[0,0,sd*.45],s:[.2,.26,.012],c:cc,gold:gg});draw(BOX,{P,p:[0,-.12,0],s:[.22,.12,.012],c:cc,gold:gg});
  draw(QUAD,{P,p:[0,-.12,.008],s:[.13,.13,1],c:[1,1,1],tex:3,u:1});for(const sd of[-1,1])draw(BOX,{P,p:[sd*.15,.0,.01],s:[.03,.06,.02],c:[.85,.7,.4],noInk:1});}}
// 16. experts predicted chaos (imagined)
function sChaos(t){const a=t*.4;const E=[Math.sin(a)*14,9,Math.cos(a)*14],TG=[0,0,0];env(DW({eye:E,tgt:TG,fov:44,desat:.55,shadow:false}));ground([.48,.52,.44]);
 roadZ(0,-40,40,8);draw(BOX,{p:[0,.03,0],s:[40,.04,8],c:[.36,.36,.38],noShadow:1});const r=rnd(6);
 for(let i=0;i<14;i++){const x=(r()-.5)*12,z=(r()-.5)*12;if(Math.abs(x)>4&&Math.abs(z)>4)continue;car(xf([x,0,z],[0,r()*6.28,0]),{c:CARC[i%7]});}
 for(let i=0;i<6;i++)draw(SPHL,{p:[(r()-.5)*8,1.5+((t*.6+i*.17)%1)*2,(r()-.5)*8],s:[.15,.15,.15],c:[1,1,1],u:1,noShadow:1,noInk:1});}
// 17. instead accidents went down: brass chart falls
function sDown(t){const k=ease(ss(0,2.6,t));const E=[lerp(1.6,.8,k),lerp(2.4,2.1,k),lerp(9.4,8.4,k)],TG=[0,1.0,0];env(IN({eye:E,tgt:TG,fov:44,plP:[0,3,2],shadow:{c:[0,0,0],r:4},bloom:1}));
 draw(BOX,{p:[0,-.5,0],s:[20,1,20],c:[.42,.3,.2],pat:2,patS:1.5,g:.3});draw(BOX,{p:[0,2.5,-1.5],s:[10,5,.2],c:[.28,.34,.44],pat:6,patS:1});
 const vals=[1,.92,.98,.95,.58];const lab=['','','','',''];for(let i=0;i<5;i++){const fall=i==4?ease(ss(.6,1.8,t)):0;const h=1.9*lerp(vals[i<4?i:0],vals[i],i==4?fall:1);
  draw(BOX,{p:[-1.6+i*.8,h/2,0],s:[.5,h,.5],c:i==4?[1,.72,.2]:[.62,.5,.32],gold:i==4?1:0,g:.7});}
 draw(BOX,{p:[0,.01,0],s:[4.4,.02,.9],c:[.2,.18,.16]});}
// 18. drivers creep along nervously
function sCreep(t){const k=ease(ss(0,4,t));const E=[lerp(-6.8,-6.0,k),lerp(2.0,1.8,k),lerp(10.5,9.5,k)+t*1.2],TG=[-2.3,1.0,t*1.2-1];env(D({eye:E,tgt:TG,fov:40,dof:[9.8,4],shadow:{c:[-2.4,0,t*1.2],r:8}}));street();
 const z=t*1.2;// RIGHT traffic now: moving +z at x<0; driver sits on the left (x>0 side of the car)
 car(xf([-2.4,0,z]),{c:[.2,.42,.62],gold:.5,driver:false,glassA:.35});draw(SPH,{p:[-2.4+.3,1.12,z-.1],s:[.11,.13,.11],c:[.92,.75,.62],noInk:1});draw(SPH,{p:[-2.4+.3,1.2,z-.13],s:[.11,.07,.11],c:[.35,.25,.15],noInk:1});
 for(let i=0;i<3;i++)car(xf([-2.4,0,z-8-i*7]),{c:CARC[i+2]});
 if(t>.6)camPlaque(E,TG,2.6,.42,.08,.22,Math.round(20*ease(ss(.6,1.6,t))),2,'KM/H');}
// 19. the fear wore off: busy fast traffic by 1969
function sNormal(t){const k=ease(ss(0,5.2,t));const E=[lerp(-9,-7,k),lerp(4,7,k),lerp(16,22,k)],TG=[0,1,lerp(0,-10,k)];env(D({eye:E,tgt:TG,fov:46,shadow:{c:[0,0,-6],r:24}}));street();
 for(let i=0;i<10;i++){const z=((t*14+i*11)%110)-80;car(xf([-2.4,0,z]),{c:CARC[i%7]});const z2=30-((t*14+i*11+5)%110);car(xf([2.4,0,z2],[0,Math.PI,0]),{c:CARC[(i+3)%7]});}}
// 20. archive
function sArchive(t){env({noSky:1,sky:[.46,.42,.38],gnd:[.26,.22,.19],sunC:[.5,.42,.34],sunD:[-.3,.6,.7],fog:[.15,.13,.11],fogD:.03,eye:[lerp(.6,0,ease(ss(0,4,t))),1.95,lerp(5.5,4.4,ease(ss(0,4,t)))],tgt:[0,1.95,0],fov:44,plP:[0,2.5,2],plC:[.85,.65,.38],plR:7});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 draw(BOX,{p:[0,.9,1.2],s:[1.8,.06,.8],c:[.4,.26,.15]});for(const sx of[-.8,.8])draw(BOX,{p:[sx,.45,1.2],s:[.06,.9,.6],c:[.35,.22,.13]});
 car(cxf(xf([0,.93,1.2],[0,.5+t*.15,0]),xf([0,0,0],[0,0,0],.22)),{c:[.2,.42,.62],gold:.6});}
// ---------- timeline ----------
const S=[[0,3.3,sGlobe],[3.3,5.3,sClock],[5.3,8.75,sStop],[8.75,14.1,sCross],[14.1,16.25,sH],[16.25,21.25,sLanes],[21.25,24.4,sMap],[24.4,28.0,sWheel],[28.0,31.0,sOvertake],[31.0,34.25,sVote],[34.25,36.45,sNo],[36.45,38.25,sParl],[38.25,40.8,sPrep],[40.8,44.75,sSigns],[44.75,48.5,sBus],[48.5,53.1,sLogo],[53.1,55.35,sChaos],[55.35,57.95,sDown],[57.95,62.1,sCreep],[62.1,67.45,sNormal],[67.45,74.8,sArchive]];
const END=74.8;
const RIB=[[3.4,.6,'3 SEPT 1967'],[31.1,0,'1955'],[36.5,.4,'1963'],[38.4,.6,'1963–67'],[55.4,.6,'4 SEPT 1967'],[62.3,1,'1969']];
function overlays(T,fn,lt){
 badge('SWEDEN','1967',LON,LAT,T,ss(3.0,3.6,T)*(1-ss(67.1,67.45,T)));
 ribbon(T,RIB,['1955','1969'],ss(3.2,3.6,T)*(1-ss(67.1,67.45,T)));
 if(fn===sGlobe)bigText([['1967',120,GOLD]],.3,3.25,T,560);
 seal(1,'THE SWITCH',14.15,T);seal(2,'THE VOTE',31.05,T);seal(3,'THE PLAN',38.3,T);seal(4,'THE RESULT',55.4,T);
 if(fn===sClock)bigText([['04:50',110,PARCH]],3.6,5.25,T,560);
 if(fn===sStop)tag('EVERY CAR STOPS',W/2,420,5.6,8.6,T,{size:40});
 if(fn===sCross)tag('SWITCH SIDES · SLOWLY',W/2,420,9.0,14.0,T,{size:36});
 if(fn===sH){bigText([['DAGEN H',110,GOLD]],15.2,16.2,T,600);tag('H = HÖGERTRAFIK (RIGHT-HAND TRAFFIC)',W/2,420,14.5,16.2,T,{size:26,f:MF});}
 if(fn===sLanes){tag('BEFORE: DRIVE ON THE LEFT',W/2,420,16.4,19.4,T,{size:32});tag('AFTER: DRIVE ON THE RIGHT',W/2,420,19.5,21.2,T,{size:32});}
 if(fn===sMap)tag('NEIGHBOURS: RIGHT · SWEDEN: LEFT',W/2,420,21.6,24.35,T,{size:28});
 if(fn===sWheel)tag('STEERING WHEEL ON THE LEFT',W/2,420,24.8,27.9,T,{size:32});
 if(fn===sOvertake)tag("CAN'T SEE PAST THE TRUCK",W/2,420,28.4,30.95,T,{size:32});
 if(fn===sVote)tag('1955 REFERENDUM',W/2,420,31.6,34.2,T,{size:38});
 if(fn===sParl)tag('1963: PARLIAMENT SAYS YES',W/2,420,36.6,38.2,T,{size:32});
 if(fn===sPrep)tag('4 YEARS OF PREPARATION',W/2,420,38.6,40.75,T,{size:34});
 if(fn===sBus)tag('DOORS ON THE RIGHT',W/2,420,45.4,48.4,T,{size:38});
 if(fn===sLogo){if(lt<2.2)tag('ON MILK CARTONS...',W/2,420,48.7,50.6,T,{size:36});else tag('...AND UNDERWEAR',W/2,420,50.9,53.0,T,{size:36});}
 if(fn===sChaos)tag('THE FEAR: CHAOS',W/2,420,53.3,55.3,T,{size:38});
 if(fn===sDown)tag('FEWER ACCIDENTS THAN A NORMAL MONDAY',W/2,420,56.0,57.9,T,{size:26,f:MF});
 if(fn===sCreep)tag('NERVOUS · SLOW · CAREFUL',W/2,420,58.4,62.0,T,{size:34});
 if(fn===sNormal)tag('BY 1969: BACK TO NORMAL',W/2,420,64.2,67.4,T,{size:34});
 if(fn===sArchive){archiveCard([['ICELAND FOLLOWED'],'Just one year later, in May 1968,','Iceland also switched from','driving on the left to the right.'],67.8,T);outro(72.8,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;flFree();cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
