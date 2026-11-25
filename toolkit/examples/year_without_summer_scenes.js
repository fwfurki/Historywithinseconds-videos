// ===== THE YEAR WITHOUT A SUMMER (1816) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
function lineC(P,a,b,r,c,o){const d=sub(b,a),L=Math.hypot(...d)||1e-4;draw(CYL,Object.assign({P,p:a,r:[Math.acos(clamp(d[1]/L,-1,1)),Math.atan2(d[0],d[2]),0],s:[r,L,r],c:c||[.15,.12,.1],noShadow:1},o||{}));}
function camPlaque(e,tg,dist,dx,dy,k,val,dig,cap){const f=norm(sub(tg,e));const r=norm(cross(f,[0,1,0]));const u=cross(r,f);const p=[e[0]+f[0]*dist+r[0]*dx+u[0]*dy,e[1]+f[1]*dist+r[1]*dx+u[1]*dy,e[2]+f[2]*dist+r[2]*dx+u[2]*dy];
 const d=sub(e,p);const yaw=Math.atan2(d[0],d[2]);const pit=Math.atan2(d[1],Math.hypot(d[0],d[2]));plaque3D(cxf(xf(p,[0,yaw,0]),xf([0,0,0],[-pit,0,0])),val,dig,cap,k);}
function rnd(s){let x=s;return()=>{x=(x*9301+49297)%233280;return x/233280;};}
// ---------- environments ----------
const SNOWDAY={sky:[.8,.83,.9],gnd:[.8,.82,.86],sunC:[.62,.6,.58],sunD:[-.45,.7,.5],fog:[.86,.88,.92],fogD:.006,skyTop:[.52,.6,.74],clouds:.85,toon:.15};
const GREYDAY=o=>Object.assign({},SNOWDAY,o);
const RAINY={sky:[.7,.72,.78],gnd:[.45,.45,.44],sunC:[.5,.5,.52],sunD:[-.3,.8,.4],fog:[.66,.69,.74],fogD:.01,skyTop:[.42,.46,.55],clouds:.95};
const SUNNY={sky:[.78,.8,.86],gnd:[.48,.46,.4],sunC:[.75,.68,.55],sunD:[-.5,.7,.45],fog:[.84,.88,.94],fogD:.003,skyTop:[.3,.52,.88],clouds:.3};
const SPACE={bg:[.04,.07,.13],fog:[.04,.07,.13],fogD:0,sky:[.9,.9,.95],gnd:[.5,.5,.56],sunC:[.55,.52,.48],sunD:[.8,.3,.5],ink:.8,inkFar:50};
const SNOWC=[.93,.95,.98];
// ---------- snow / rain particles ----------
function snowfall(c,R,H,t,n,sp){for(let i=0;i<(n||120);i++){const fx=(i*.6180339)%1,fz=(i*.3819660+.17)%1,fy=(i*.7548776)%1;const y=c[1]+H-(((fy*H)+t*(sp||1.1))%H);
 const x=c[0]+(fx-.5)*R*2+Math.sin(t*1.3+i)*.25,z=c[2]+(fz-.5)*R*2+Math.cos(t*1.1+i*.7)*.25;draw(SPHL,{p:[x,y,z],s:[.045,.045,.045],c:[1,1,1],u:1,id:0,noShadow:1,noInk:1});}}
function rainfall(c,R,H,t,n){for(let i=0;i<(n||140);i++){const fx=(i*.6180339)%1,fz=(i*.3819660+.17)%1,fy=(i*.7548776)%1;const y=c[1]+H-(((fy*H)+t*14)%H);
 draw(BOX,{p:[c[0]+(fx-.5)*R*2,y,c[2]+(fz-.5)*R*2],r:[0,0,.12],s:[.008,.3,.008],c:[.8,.85,.92],a:.45,u:1,id:0,noShadow:1,noInk:1});}}
// ---------- farm (Vermont) ----------
function snowRoof(P,w,d,h){const rh=Math.min(w,d)*.36;for(const sd of[-1,1])draw(BOX,{P,p:[sd*w/4-sd*.02,h+rh/2+.06,0],r:[0,0,sd*-Math.atan2(rh,w/2)],s:[Math.hypot(w/2,rh)+.3,.12,d+.42],c:SNOWC,noInk:1});}
function leaf(P,b,d,L,w,c,g){const n=norm(d);const m=[b[0]+n[0]*L/2,b[1]+n[1]*L/2,b[2]+n[2]*L/2];draw(SPH,{P,p:m,r:[Math.acos(clamp(n[1],-1,1)),Math.atan2(n[0],n[2]),0],s:[w,L/2,w*.22],c,noInk:1,gold:g});}
function corn(P,k,frost,snow,g){const sc=mix3([.34,.62,.2],[.62,.56,.4],frost);draw(CYL,{P,p:[0,0,0],s:[.045,1.25*k,.045],c:sc,gold:g});
 const lc=mix3([.36,.68,.22],[.66,.6,.42],frost);for(let i=0;i<6;i++){const a=i*2.4,y=(.12+i*.17)*k;const el=lerp(.9,-.35,frost)-i*.05;leaf(P,[0,y,0],[Math.sin(a)*Math.cos(el),Math.sin(el),Math.cos(a)*Math.cos(el)],(.62-i*.05)*k,.075*k,lc,g);}
 if(snow>0){draw(SPHL,{P,p:[0,1.25*k,0],s:[.09*snow,.05*snow,.09*snow],c:SNOWC,noInk:1});for(let i=0;i<3;i++){const a=i*2.4*2;draw(SPHL,{P,p:[Math.sin(a)*.25*k,(.32+i*.34)*k+.08,Math.cos(a)*.25*k],s:[.1*snow*k,.035*snow,.1*snow*k],c:SNOWC,noInk:1});}}}
const CORN=(()=>{const r=rnd(3);const L=[];for(let i=0;i<14;i++)for(let j=0;j<15;j++)L.push([-12+j*1.35+(r()-.5)*.25,8+i*1.3+(r()-.5)*.2,.62+r()*.2]);return L;})();
const FARMER={coat:[.42,.3,.2],jacket:false,shirt:[.84,.78,.66],sleeve:[.42,.3,.2],pants:[.32,.28,.22],hat:'flat',hatc:[.36,.26,.18],beard:1,hair:HAIRS[2],seed:5};
function farm(o){o=o||{};const sn=o.snow===undefined?1:o.snow;const gc=mix3([.42,.6,.3],SNOWC,sn);
 draw(BOX,{p:[0,-.5,10],s:[240,1,160],c:gc,pat:sn>.5?6:1,patS:sn>.5?.4:1.2});
 house(xf([0,0,0]),{w:5,d:5,floors:2,style:'wood',wall:[.9,.88,.82],roof:[.32,.3,.3],door:true});if(sn>.3)snowRoof(xf([0,0,0]),5,5,5.6);
 house(xf([-10,0,-2],[0,.15,0]),{w:6,d:8,floors:2,style:'wood',wall:[.62,.2,.16],roof:[.3,.28,.28],door:false});if(sn>.3)snowRoof(xf([-10,0,-2],[0,.15,0]),6,8,5.6);
 fence(xf([1.5,0,6.5]),26,{c:[.62,.56,.46]});fence(xf([-12.8,0,18],[0,Math.PI/2,0]),22,{c:[.62,.56,.46]});
 const r=rnd(11);for(let i=0;i<26;i++){const x=-40+r()*80,z=34+r()*30;tree(xf([x,0,z]),1+r()*.6,mix3([.2,.42,.24],SNOWC,.35*sn),'pine');}
 for(let i=0;i<10;i++){const x=10+r()*25,z=-12-r()*20;tree(xf([x,0,z]),1+r()*.5,mix3([.2,.42,.24],SNOWC,.35*sn),'pine');}
 CORN.forEach(([x,z,k],i)=>corn(xf([x,0,z],[0,i*1.3,0]),k,o.frost===undefined?1:o.frost,sn,o.goldCorn||0));
 barrel(xf([3.4,0,2.9]));cart(xf([5.5,0,-1.5],[0,.6,0]));}
// ---------- globe ----------
const VLON=-72.7,VLAT=44.0,TLON=118.0,TLAT=-8.25,GLON=6.2,GLAT=46.4;
function stars(){for(let i=0;i<80;i++){const a=i*2.39,e=(i*.618)%1;draw(SPHL,{p:[Math.cos(a)*40,(e-.5)*70,-30+Math.sin(a)*10],s:[.08,.08,.08],c:[1,1,1],u:1,id:0});}}
function sGlobe(t){const k=ease(ss(0,2.0,t));env({...SPACE,eye:[0,0,lerp(5.4,3.2,k)],tgt:[0,0,0],fov:40});globe3D(xf([0,0,0]),VLON,VLAT,(1-k)*2.6,ss(1.0,1.5,t));stars();}
// ---------- 1. hook: farmer steps out ----------
function sHook(t){if(t<2.55){const k=ease(ss(0,2.55,t));const fz=lerp(3.1,5.4,ss(0,2.3,t));env(GREYDAY({eye:[lerp(1.3,1.6,k),lerp(1.75,1.9,k),lerp(2.75,3.0,k)],tgt:[lerp(1.6,2.2,k),1.2,14],fov:50,shadow:{c:[1,0,8],r:14}}));farm();
  person(xf([1.5,0,fz],[0,0,0]),Object.assign({},FARMER,{walk:ss(0,.3,t)*(1-ss(2.0,2.3,t)),phase:t*6.4}));snowfall([2,0,9],7,6,t,150);return;}
 const lt=t-2.55,k=ease(ss(0,2.7,lt));env(GREYDAY({eye:[lerp(3.6,7,k),lerp(2.2,9,k),lerp(3.6,0.5,k)],tgt:[lerp(1.8,0,k),lerp(1.2,0,k),lerp(7,16,k)],fov:48,shadow:{c:[0,0,10],r:22}}));farm();
 person(cxf(xf([1.5,0,5.4],[0,.2,0]),xf([0,0,0]),{gold:1}),Object.assign({},FARMER,{worry:1,head:[.15,.25,0],armL:[-.3,0,-.25],elbowL:.3}));snowfall([2,0,10],12,10,t,160);}
// ---------- 2. "In summer." calendar ----------
const CAL=document.createElement('canvas');CAL.width=512;CAL.height=640;(()=>{const g=CAL.getContext('2d');g.fillStyle='#f2ead6';g.fillRect(0,0,512,640);g.strokeStyle='#7a5a32';g.lineWidth=10;g.strokeRect(5,5,502,630);
 g.fillStyle='#8a1f14';g.fillRect(20,20,472,150);g.fillStyle='#f6eedc';g.font='700 92px Cinzel';g.textAlign='center';g.textBaseline='middle';g.fillText('JUNE',256,82);g.font='700 40px Cinzel';g.fillText('1816',256,145);
 g.fillStyle='#2a2118';g.font='700 34px Montserrat';for(let i=0;i<30;i++){const c=(i+6)%7,r=Math.floor((i+6)/7);g.fillText(String(i+1),62+c*65,220+r*80);}
 g.strokeStyle='#b3261e';g.lineWidth=7;g.beginPath();g.arc(62+((5+6)%7)*65,220+Math.floor((5+6)/7)*80,30,0,Math.PI*2);g.stroke();})();
function sJune(t){const k=ease(ss(0,1.2,t));env(GREYDAY({eye:[lerp(-.25,.05,k),1.65,lerp(-1.4,-1.15,k)+3.2+2.53],tgt:[0,1.55,2.53],fov:40,dof:[1.9,1.2],shadow:false}));farm();
 useTex('cal',CAL);draw(BOX,{p:[0,1.55,2.62],s:[.62,.76,.02],c:[.6,.45,.3]});draw(QUAD,{p:[0,1.55,2.64],s:[.56,.7,1],c:[1,1,1],tex:3,u:1,gold:1});
 draw(BOX,{p:[0,1.92,2.64],s:[.66,.05,.05],c:SNOWC,noInk:1});snowfall([0,0,4.5],1.6,3,t,90,.7);}
// ---------- 3. frost on the corn ----------
function sFrost(t){const k=ease(ss(0,3.0,t));const fr=ss(.2,2.4,t);env(GREYDAY({eye:[lerp(-9,-4,k),lerp(1.5,1.7,k),8.6],tgt:[lerp(-6,-1,k),.5,14],fov:44,dof:[5,3],shadow:{c:[-4,0,12],r:10}}));farm({frost:fr,snow:.35+.3*fr,goldCorn:.6*(1-fr)});
 for(let i=0;i<40;i++){const a=i*2.4;const ph=(t*.3+i*.05)%1;draw(SPHL,{p:[-6+Math.cos(a)*4+ph*6,.3+ph*1.4,12+Math.sin(a)*2],s:[.03,.03,.03],c:[.95,.97,1],a:.6*(1-ph),u:1,id:0,noShadow:1,noInk:1});}}
// ---------- 4. Europe: endless rain ----------
function euroTown(o){o=o||{};draw(BOX,{p:[0,-.5,-10],s:[200,1,120],c:[.42,.4,.38],pat:6,patS:1.6,g:.55});road(-40,0,40,0,6,null,[.36,.33,.3]);
 const W_=[[.86,.8,.66],[.78,.66,.5],[.84,.76,.62],[.7,.62,.52]];for(let i=0;i<9;i++)for(const sd of[-1,1]){const x=-24+i*6.2,z=sd*6.6;house(xf([x,0,z],[0,sd<0?0:Math.PI,0]),{w:5.6,d:5,floors:2+((i+(sd>0))%2),style:i%3==1?'brick':'plaster',wall:W_[(i+(sd>0)*2)%4],roof:[[.5,.28,.2],[.42,.24,.18]][i%2]});}
 for(let i=0;i<5;i++)lamppost(xf([-16+i*8,0,3.4]),0);for(let i=0;i<12;i++)draw(CYL,{p:[-20+i*3.6,.015,(i%3-1)*1.2],s:[.5+(i%2)*.4,.01,.35],c:[.6,.66,.74],g:.9,noInk:1});}
function sRain(t){const k=ease(ss(0,2.6,t));env(Object.assign({},RAINY,{eye:[lerp(-12,-9,k),lerp(2.0,2.4,k),lerp(1.5,1.0,k)],tgt:[6,1.6,-1],fov:46,shadow:false}));euroTown();rainfall([-5,0,0],9,9,t,220);
 const r=[[-6,1.2,.3],[-3.5,-1.4,-.4]];r.forEach(([x,z,ry],i)=>{const P=xf([x+t*1.1,0,z],[0,Math.PI/2+ry*.2,0]);person(P,{seed:20+i,walk:1,phase:t*6.4+i,coat:[[.3,.3,.36],[.4,.3,.24]][i],hat:'bowler',hatc:[.15,.14,.14],armR:[-2.4,0,.25],elbowR:1.2});
  draw(CONE,{P,p:[-.05,2.05,.25],s:[.75,.32,.75],c:[[.14,.14,.16],[.3,.18,.16]][i]});lineC(P,[-.05,2.05,.25],[-.05,1.55,.25],.012,[.2,.15,.1]);});}
// ---------- 5. famine + riots ----------
const PRICE=document.createElement('canvas');PRICE.width=512;PRICE.height=320;(()=>{const g=PRICE.getContext('2d');g.fillStyle='#2b2f2a';g.fillRect(0,0,512,320);g.strokeStyle='#7a5a32';g.lineWidth=18;g.strokeRect(9,9,494,302);
 g.fillStyle='#f2efe6';g.font='700 84px Cinzel';g.textAlign='center';g.textBaseline='middle';g.fillText('BREAD',256,110);g.fillStyle='#ffb52e';g.font='800 110px Montserrat';g.fillText('↑ ↑ ↑',256,230);})();
const EU=[{coat:[.36,.3,.24],jacket:false,shirt:[.8,.74,.62],hat:'flat',hatc:[.3,.26,.2]},{dress:[.45,.32,.3],hairStyle:'bun',female:1},{coat:[.3,.32,.38],hat:'bowler',hatc:[.2,.18,.16],moustache:1},{dress:[.32,.38,.42],hairStyle:'bun',female:1,hair:HAIRS[2]},{coat:[.42,.34,.24],jacket:false,shirt:[.75,.7,.6],beard:1}];
function granary(P){draw(BOX,{P,p:[0,3,0],s:[9,6,6],c:[.72,.64,.5],pat:6,patS:1.4});draw(PRISM,{P,p:[0,6,0],s:[9.4,2.6,6.4],c:[.46,.26,.2],pat:4,patS:2.4});
 for(const sd of[-1,1])draw(BOX,{P,p:[sd*.85,1.6,3.03],s:[1.6,3.1,.1],c:[.38,.24,.15],pat:2,patS:4});draw(BOX,{P,p:[0,1.6,3.1],s:[3.6,.18,.12],c:[.25,.22,.2],g:.6});
 useTex('price',PRICE);draw(BOX,{P,p:[3.2,2.2,3.04],s:[1.7,1.08,.05],c:[.4,.3,.2]});draw(QUAD,{P,p:[3.2,2.2,3.08],s:[1.6,1.0,1],c:[1,1,1],tex:3,u:1,gold:1});}
function stall(P){draw(BOX,{P,p:[0,.45,0],s:[2.4,.9,1.1],c:[.55,.4,.26],pat:2,patS:4});for(const x of[-1.1,1.1])draw(CYL,{P,p:[x,.9,-.5],s:[.05,1.5,.05],c:[.45,.32,.2]});draw(BOX,{P,p:[0,2.45,-.1],r:[.25,0,0],s:[2.6,.06,1.5],c:[.7,.3,.22]});
 for(let i=0;i<3;i++)draw(CYL,{P,p:[-.8+i*.8,.9,.1],s:[.32,.25,.32],c:[.6,.46,.28],pat:2,patS:5});}
function square(){draw(BOX,{p:[0,-.5,-5],s:[120,1,80],c:[.5,.47,.43],pat:6,patS:1.2,g:.4});const W_=[[.86,.8,.66],[.78,.66,.5],[.84,.76,.62]];
 for(let i=0;i<4;i++)for(const sd of[-1,1])house(xf([sd*10,0,-8+i*6.2],[0,sd<0?Math.PI/2:-Math.PI/2,0]),{w:5.6,d:5,floors:2+(i%2),style:i%2?'brick':'plaster',wall:W_[(i+(sd>0))%3],roof:[[.5,.28,.2],[.42,.24,.18]][i%2]});
 for(let i=0;i<5;i++)house(xf([-12+i*6,0,-14]),{w:5.6,d:5,floors:2+(i%2),style:'plaster',wall:W_[i%3],roof:[.46,.26,.2]});lamppost(xf([-5,0,1]),0);lamppost(xf([5,0,1]),0);barrel(xf([4,0,-1.2]));crate(xf([4.7,0,-1.0]));}
function sRiot(t){if(t<2.4){const k=ease(ss(0,2.4,t));env(Object.assign({},RAINY,{fogD:.006,clouds:.8,eye:[lerp(2.6,1.6,k),lerp(1.4,1.6,k),lerp(4.6,3.6,k)],tgt:[0,.9,0],fov:44,dof:[3.8,2.4],shadow:{c:[0,0,0],r:6}}));euroTown();
  stall(xf([0,0,0]));person(xf([0,0,-.9]),Object.assign({seed:31,worry:1,head:[.3,0,0]},EU[4]));person(xf([1.35,0,-.1],[0,-Math.PI/2-.3,0]),Object.assign({seed:32,worry:1,armR:[-.6,0,.2],elbowR:.8},EU[1]));return;}
 const lt=t-2.4,k=ease(ss(0,2.4,lt));env(Object.assign({},RAINY,{fogD:.006,clouds:.8,eye:[lerp(-5,-3.6,k),lerp(2.6,2.3,k),lerp(10,8.4,k)],tgt:[0,2.1,-2],fov:46,shadow:{c:[0,0,-1],r:12}}));square();granary(xf([0,0,-4]));
 for(let i=0;i<11;i++){const x=-4.2+(i%6)*1.6+(i>5?.8:0),z=1.2+(i>5?1.4:0);const up=Math.sin(lt*5+i*1.7)>0;person(xf([x,0,z],[0,Math.PI+(x*.05),0]),Object.assign({seed:40+i},EU[i%5],i%2?{armR:[up?-2.9:-2.4,0,.15],elbowR:up?.2:.9}:{armL:[up?-2.8:-2.3,0,-.15],elbowL:.4}));}}
// ---------- 6. nobody knew why ----------
function sWhy(t){const k=ease(ss(0,1.5,t));env(GREYDAY({eye:[lerp(1.9,1.6,k),lerp(1.3,1.2,k),lerp(9.2,8.4,k)],tgt:[1.5,lerp(1.7,1.9,k),5.4],dof:[3.5,2.5],fov:46,shadow:{c:[1.5,0,5],r:8}}));farm();
 draw(SPH,{p:[-22,26,-12],s:[2.2,2.2,2.2],c:[1,.98,.9],a:.6,u:1,id:0,noShadow:1,noInk:1});draw(SPH,{p:[-22,26,-12],s:[3.8,3.8,3.8],c:[1,.95,.85],a:.15,u:1,add:1,id:0,noShadow:1,noInk:1});
 person(xf([1.5,0,5.4],[0,0,0]),Object.assign({},FARMER,{head:[-.55,.25,0],worry:1}));snowfall([1.5,0,3.2],3,5,t,90,.8);}
// ---------- 7. across the world (globe spin) ----------
function sSpin(t){const u=ease(ss(.3,3.2,t));const lon=lerp(VLON,TLON,u),lat=lerp(VLAT,TLAT,u);const zz=lerp(3.4,3.0,ease(ss(2.8,4.4,t)));env({...SPACE,eye:[0,0,zz],tgt:[0,0,0],fov:40});
 globe3D(xf([0,0,0]),lon,lat,0,.6*Math.max(1-ss(0,.4,t),ss(3.0,3.6,t)));stars();}
// ---------- 8. Tambora erupts ----------
function tamHF(x,z){const r=Math.hypot(x,z+60);const cone=30*Math.exp(-Math.pow(r/26,1.5));const crater=r<5?-(5-r)*1.4:0;const isl=Math.min(1,Math.max(0,(95-r)/25));return (cone+crater)*isl+isl*2.5-2.2+.6*Math.sin(x*.2)*Math.cos(z*.17);}
let GK='';function island(c){if(GK!=='T'){setGrid(-160,160,-220,100,tamHF);GK='T';}draw(GRID,{c:c||[.4,.55,.3],pat:1,patS:1.3});draw(BOX,{p:[0,-.6,-40],s:[700,1,600],c:[.12,.4,.52],pat:5,patS:.3,g:.6,noShadow:1});}
const CR=[0,26.5,-60];
function plume(t,k,o){o=o||{};if(k<=0)return;const n=o.n||110,H=o.H||130;
 for(let i=0;i<n;i++){const f=i/n;const a=i*2.39996+t*.15;const top=ss(.68,1,f);const rr=(3+f*9)*(1-top)+top*(10+40*((i*.618)%1));const rad=rr*Math.sqrt((i*.381966)%1)*k;
  const y=CR[1]+(f*H+top*6*Math.sin(i))*k+Math.sin(t*.8+i)*1.2;const sz=(5+f*7+top*5)*(.55+.45*k);const sh=((i*.7548)%1);
  draw(SPH,{p:[CR[0]+Math.cos(a)*rad,y,CR[2]+Math.sin(a)*rad],s:[sz,sz*.85,sz],c:mix3([.34,.31,.29],[.62,.58,.54],sh*.7+f*.3),noInk:1,noShadow:1,gold:o.gold||0});}
 if(o.glow){for(let i=0;i<16;i++){const a=i*2.4+t;draw(SPHL,{p:[CR[0]+Math.cos(a)*3.5,CR[1]+1+((i*.37+t*.8)%1)*9,CR[2]+Math.sin(a)*3.5],s:[2.4,2.4,2.4],c:[1,.55,.15],u:1,add:1,a:.75,id:0,noShadow:1});}
  for(let i=0;i<18;i++){const ph=((t*.7+i*.137)%1);const a=i*2.1;const v=10+(i%5)*3;draw(SPHL,{p:[CR[0]+Math.cos(a)*v*ph*2.2,CR[1]+v*ph*3.2-30*ph*ph,CR[2]+Math.sin(a)*v*ph*2.2],s:[.9,.9,.9],c:[1,.5,.12],u:1,id:0,noShadow:1,noInk:1});}}
 if(o.ring){const r=o.ring;for(let i=0;i<34;i++){const a=i/34*Math.PI*2;const x=CR[0]+Math.cos(a)*r,z=CR[2]+Math.sin(a)*r;draw(SPH,{p:[x,tamHF(x,z)+3,z],s:[6,4.5,6],c:[.5,.47,.44],noInk:1,noShadow:1});}}}
function sTambora(t){const E=4.2;if(t<E){const k=ease(ss(0,E,t));env({...SUNNY,eye:[lerp(-70,-55,k),lerp(14,18,k),lerp(70,52,k)],tgt:[0,lerp(18,22,k),-60],fov:44,shadow:{c:[0,0,-60],r:90}});island();
  for(let i=0;i<4;i++){const ph=(t*.25+i*.25)%1;draw(SPHL,{p:[CR[0]+Math.sin(i)*2,CR[1]+2+ph*10,CR[2]],s:[2+ph*4,1.5+ph*3,2+ph*4],c:[.75,.74,.72],a:.5*(1-ph),u:1,id:0,noShadow:1});}
  for(let i=0;i<6;i++)hut(xf([-38+i*5,tamHF(-38+i*5,-8+(i%2)*4)-.2,-8+(i%2)*4],[0,i,0]));return;}
 const lt=t-E,k=ease(ss(0,1.1,lt));env({...SUNNY,eye:[lerp(-55,-62,k),lerp(18,20,k),lerp(52,60,k)],tgt:[0,lerp(24,48,k),-60],fov:44,bloom:1,shadow:{c:[0,0,-60],r:90}});island();plume(t,.12+ss(0,1.0,lt)*.5,{glow:1,ring:8+lt*14});
 for(let i=0;i<6;i++)hut(xf([-38+i*5,tamHF(-38+i*5,-8+(i%2)*4)-.2,-8+(i%2)*4],[0,i,0]));}
// ---------- 9. largest eruption + buried villages ----------
function sLargest(t){if(t<3.2){const k=ease(ss(0,3.2,t));env({...SUNNY,fog:[.8,.84,.9],fogD:.0007,eye:[lerp(-200,-190,k),lerp(30,45,k),lerp(190,175,k)],tgt:[0,lerp(65,80,k),-60],fov:46,bloom:1,shadow:{c:[0,0,-60],r:120}});island();plume(t,.62+.38*ss(0,3.2,t),{glow:1,ring:26+t*8});return;}
 const lt=t-3.2,k=ease(ss(0,2.2,lt));env({sky:[.66,.64,.6],gnd:[.5,.48,.45],sunC:[.5,.47,.42],sunD:[-.4,.7,.5],fog:[.62,.6,.57],fogD:.012,skyTop:[.48,.46,.44],clouds:.9,eye:[lerp(-30,-31,k),lerp(4,3.4,k),lerp(4,1,k)],tgt:[-30,1.2,-8],fov:46,desat:.25,shadow:{c:[-30,0,-8],r:16}});island([.56,.54,.5]);
 for(let i=0;i<6;i++){const x=-38+i*3.6,z=-9+(i%2)*3.4;hut(xf([x,tamHF(x,z)-.2,z],[0,i,0]),{wall:[.6,.56,.5],roof:[.58,.56,.52]});}
 for(let i=0;i<90;i++){const fx=(i*.618)%1,fy=(i*.754)%1;draw(SPHL,{p:[-40+fx*20,8-((fy*8+lt*.9)%8),-14+((i*.382)%1)*12],s:[.04,.04,.04],c:[.4,.38,.36],u:1,id:0,noShadow:1,noInk:1});}}
// ---------- 10. sulfur into the sky ----------
function sSulfur(t){const k=ease(ss(0,6.2,t));const E=[lerp(-90,-120,k),lerp(70,165,k),lerp(90,120,k)],TG=[0,lerp(70,165,k),-60];env({...SUNNY,fog:[.8,.84,.9],fogD:.0012,eye:E,tgt:TG,fov:46,shadow:false});island();plume(t,1,{ring:50});
 // cloud deck
 for(let i=0;i<40;i++){const a=i*2.39,r=40+((i*.618)%1)*120;draw(SPHL,{p:[Math.cos(a)*r,48+(i%3)*3,-60+Math.sin(a)*r],s:[14,4,14],c:[.97,.97,.98],a:.8,u:1,id:0,noShadow:1,noInk:1});}
 // sulfur droplets rising above the plume (gold)
 const g=ss(1.2,3.0,t);for(let i=0;i<46;i++){const a=i*2.39996,f=(i*.618)%1;const r=(8+f*80)*g;const sz=(5+((i*.38)%1)*5)*(.4+.6*g);draw(SPH,{p:[CR[0]+Math.cos(a+t*.05)*r,CR[1]+150+Math.sin(i)*4,CR[2]+Math.sin(a+t*.05)*r],s:[sz,sz*.6,sz],c:[1,.84,.36],noInk:1,noShadow:1,gold:1});}
 for(let i=0;i<70;i++){const a=i*2.39+t*.2,f=(i*.618)%1;const y=CR[1]+110+f*60*g+Math.sin(t+i)*2;const r=(10+f*70)*g;draw(SPHL,{p:[CR[0]+Math.cos(a)*r,y,CR[2]+Math.sin(a)*r],s:[3.2,3.2,3.2],c:[1,.82,.25],u:1,add:1,id:0,a:.9*g,noShadow:1,noInk:1});}
 if(t>2.4)camPlaque(E,TG,60,0,-5,5.5,Math.round(60000000*ease(ss(2.6,4.8,t))),8,'TONS OF SULFUR');}
// ---------- 11. the veil around the planet ----------
function sVeil(t){const k=ease(ss(0,6.4,t));const G=[-.42,0,0];env({...SPACE,eye:[lerp(-.3,-.6,k),lerp(.3,.45,k),lerp(8.6,7.9,k)],tgt:[0,.05,0],fov:40,bloom:1});
 globe3D(xf(G),lerp(TLON,TLON+50,k),lerp(-5,12,k),0,0);stars();
 // sulfur droplets spread from Indonesia (facing camera) across the whole sphere
 const sp=ss(.1,3.4,t);for(let i=0;i<220;i++){const u=(i+.5)/220;const th=Math.acos(1-2*u);const ph=i*2.39996;let d=[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)];
  const ang=Math.acos(clamp(d[2],-1,1));if(ang>sp*Math.PI*1.05)continue;const R=1.1;draw(SPHL,{p:[G[0]+d[0]*R,G[1]+d[1]*R,G[2]+d[2]*R],s:[.035,.035,.035],c:[1,.82,.3],u:1,id:0,noShadow:1,noInk:1});}
 draw(SPH,{p:G,s:[1.1,1.1,1.1],c:[1,.84,.4],a:.2*sp,u:1,id:0,noShadow:1,noInk:1});
 // sunlight streaks from the right; once the veil is up many bounce back out
 const veil=ss(2.2,3.8,t);for(let i=0;i<16;i++){const y=-.95+i*.125;const ph=((t*.6+i*.37)%1);const x0=2.2,xh=G[0]+Math.sqrt(Math.max(0,1.1*1.1-y*y))+.02;
  const bounce=((i*7)%10)/10<veil*.75;let x;if(bounce){x=ph<.5?lerp(x0,xh,ph*2):lerp(xh,x0,(ph-.5)*2);}else x=lerp(x0,xh-.05,ph);
  const dir=bounce&&ph>=.5?-1:1;const col=bounce&&ph>=.5?[1,.6,.25]:[1,.92,.55];draw(BOX,{p:[x+dir*.22,y,.6],s:[.44,.03,.03],c:col,u:1,add:1,id:0,noShadow:1,noInk:1});draw(SPH,{p:[x,y,.6],s:[.045,.045,.045],c:[1,.97,.8],u:1,id:0,noShadow:1,noInk:1});}}
// ---------- 12. the Earth cooled; summer never came ----------
function thermo(P,v,g){draw(CYL,{P,p:[0,0,0],s:[.11,1.3,.11],c:[.85,.9,.95],a:.6,g:.9,gold:g});draw(SPH,{P,p:[0,0,0],s:[.16,.16,.16],c:[.85,.1,.1]});draw(CYL,{P,p:[0,0,0],s:[.05,.15+1.05*v,.05],c:[.9,.12,.1]});draw(BOX,{P,p:[0,.65,-.12],s:[.35,1.6,.04],c:[.55,.38,.2],pat:2,patS:3});
 for(let i=0;i<8;i++)draw(BOX,{P,p:[.08,.2+i*.135,-.08],s:[.06,.01,.01],c:[.2,.15,.1]});}
function sCool(t){const sn=ss(1.8,4.0,t);const k=ease(ss(0,4.2,t));env(Object.assign({},SUNNY,{sunC:mix3([.75,.68,.55],[.55,.55,.58],ss(0,1.6,t)),skyTop:mix3([.3,.52,.88],[.52,.6,.74],ss(0,1.6,t)),clouds:lerp(.3,.85,ss(0,1.6,t)),fog:mix3([.84,.88,.94],[.86,.88,.92],ss(0,1.6,t)),eye:[lerp(3.4,3.0,k),lerp(1.6,1.75,k),lerp(10.2,9.4,k)],tgt:[1.2,1.3,6.5],fov:44,dof:[3.6,3],shadow:{c:[1.5,0,7],r:9}}));
 farm({snow:sn,frost:.2+.8*sn});draw(BOX,{p:[1.5,.75,6.6],s:[.16,1.5,.16],c:[.5,.4,.28],pat:2,patS:4});thermo(xf([1.5,.9,6.72]),lerp(.75,.12,ease(ss(.1,1.6,t))),1);
 for(let i=0;i<4;i++)bush(xf([-1.5+i*.9,0,6.0]),.6,mix3([.3,.55,.25],SNOWC,sn*.6));if(sn>0)snowfall([1.5,0,7.5],4,4,t,Math.round(120*sn),.8);}
// ---------- 13. villa by Lake Geneva in the storm ----------
function villa(P,lit){house(P,{w:9,d:7,floors:3,style:'plaster',wall:[.9,.86,.74],roof:[.4,.36,.38],trim:[.95,.94,.9]});if(lit){for(let f=0;f<3;f++)for(const xx of[-2.7,2.7]){if(f===0&&xx>0)continue;draw(BOX,{P,p:[xx,1.5+f*2.6,3.56],s:[.5,.76,.02],c:[1,.8,.45],u:1,id:0});}}
 for(const xx of[-3.6,3.6])draw(BOX,{P,p:[xx,1.4,4.5],s:[.3,2.8,.3],c:[.92,.9,.84],pat:6,patS:3});draw(BOX,{P,p:[0,2.85,4.5],s:[8,.2,2.2],c:[.9,.88,.82]});}
function alps(){const r=rnd(5);for(let i=0;i<9;i++){const x=-140+i*36+r()*10,z=-150-r()*40,h=40+r()*40;draw(CONE,{p:[x,-1,z],s:[30+r()*10,h,30],c:[.42,.44,.5]});draw(CONE,{p:[x,h*.62-1,z],s:[(30)*.4,h*.38+.2,30*.4],c:[.95,.96,.98],noInk:1});}}
function sVilla(t){const k=ease(ss(0,4.4,t));const fl=Math.max(0,1-Math.abs(t-1.5)/.12)+Math.max(0,1-Math.abs(t-1.75)/.1)*.6;env(Object.assign({},RAINY,{sky:[.62,.64,.72],fog:[.55,.58,.66],skyTop:[.3,.33,.42],sunC:mix3([.5,.5,.55],[1.2,1.2,1.3],fl),eye:[lerp(-14,-9,k),lerp(4,3.0,k),lerp(30,22,k)],tgt:[0,3.6,0],fov:44,bloom:1,shadow:{c:[0,0,4],r:16}}));
 draw(BOX,{p:[0,-.5,-10],s:[60,1,40],c:[.36,.5,.3],pat:1,patS:1.2});draw(BOX,{p:[0,-1.3,60],s:[400,1,90],c:[.16,.3,.36],pat:5,patS:.3,g:.6,noShadow:1});draw(BOX,{p:[0,-1.0,12.5],s:[60,1.3,2],c:[.6,.58,.54],pat:6,patS:1.5});alps();
 villa(xf([0,0,0]),1);for(let i=0;i<6;i++)tree(xf([-14+i*5.2+(i>2?6:0),0,-6-(i%2)*4]),1.2,[.24,.42,.26],i%2?'broad':'pine');rainfall([-6,0,16],14,14,t,240);}
// ---------- 14. Mary Shelley writing ----------
const MARY={female:1,coat:[.26,.3,.44],longcoat:1,pants:[.26,.3,.44],shirt:[.92,.9,.86],noVneck:1,hairStyle:'long',hair:[.42,.24,.13],seed:9,sit:1};
function salon(t,o){o=o||{};const fl=.85+.15*Math.sin(t*13)*Math.sin(t*7.3);env({noSky:1,sky:[.7,.64,.56],gnd:[.44,.36,.28],sunC:[.45,.42,.4],sunD:[-.3,.7,.5],fog:[.3,.25,.2],fogD:.01,eye:o.eye,tgt:o.tgt,fov:o.fov||44,plP:[2.4,1.2,-1.4],plC:[1.0*fl,.72*fl,.42*fl],plR:9,bloom:1,dof:o.dof});
 draw(BOX,{p:[0,-.05,0],s:[9,.1,9],c:[.44,.3,.2],pat:2,patS:2});draw(BOX,{p:[0,2.5,-3],s:[9,5,.2],c:[.62,.52,.4],pat:6,patS:2});draw(BOX,{p:[-4,2.5,0],s:[.2,5,9],c:[.6,.5,.38],pat:6,patS:2});draw(BOX,{p:[4,2.5,0],s:[.2,5,9],c:[.6,.5,.38],pat:6,patS:2});
 // tall window with rain + lightning
 const lf=Math.max(0,1-Math.abs(((t+.6)%3.2)-.2)/.1);draw(BOX,{p:[-1.5,2.4,-2.88],s:[1.4,2.6,.04],c:mix3([.25,.3,.4],[.95,.95,1],lf),u:1,id:0});draw(BOX,{p:[-1.5,2.4,-2.85],s:[.06,2.6,.05],c:[.85,.82,.75]});draw(BOX,{p:[-1.5,2.4,-2.85],s:[1.4,.06,.05],c:[.85,.82,.75]});
 for(const sd of[-1,1])draw(BOX,{p:[-1.5+sd*.95,2.5,-2.75],s:[.45,3,.1],c:[.5,.16,.14]});
 // fireplace
 draw(BOX,{p:[2.6,.8,-2.7],s:[1.8,1.6,.5],c:[.78,.74,.68],pat:6,patS:3});draw(BOX,{p:[2.6,.55,-2.44],s:[1.0,.9,.1],c:[.12,.08,.06]});draw(BOX,{p:[2.6,1.65,-2.6],s:[2.0,.12,.7],c:[.82,.78,.72]});
 draw(BOX,{p:[2.6,.16,-2.42],s:[.7,.08,.12],c:[.3,.18,.1]});for(let i=0;i<5;i++){const fl=.75+.25*Math.sin(t*(11+i*2.3)+i*1.7);const x=2.6+(i-2)*.13;draw(CONE,{p:[x,.2,-2.42],s:[.085,.42*fl*(1-Math.abs(i-2)*.18),.06],c:[1,.45,.1],u:1,add:1,a:.85,id:0,noShadow:1,noInk:1});draw(CONE,{p:[x,.2,-2.4],s:[.045,.24*fl*(1-Math.abs(i-2)*.18),.035],c:[1,.85,.4],u:1,add:1,a:.9,id:0,noShadow:1,noInk:1});}
 // rug, armchairs with companions
 draw(CYL,{p:[.8,0,-.2],s:[1.6,.02,1.2],c:[.55,.22,.18],noInk:1});
 [[1.8,.5,-2.2],[3.3,-1.0,-2.6]].forEach(([x,z,ry],i)=>{const P=xf([x,0,z],[0,ry,0]);draw(BOX,{P,p:[0,.3,0],s:[.85,.6,.8],c:[.45,.2,.18]});draw(BOX,{P,p:[0,.85,-.38],s:[.85,1.0,.15],c:[.45,.2,.18]});
  person(xf([x,.08,z],[0,ry,0]),{seed:60+i,sit:1,coat:[[.12,.12,.14],[.2,.22,.3]][i],shirt:[.95,.94,.9],hair:HAIRS[i],head:[.1,i?.3:-.3,0]});});
 // writing desk + Mary (desk against the left wall, Mary in profile)
 const DX=-2.75,DZ=-.6;draw(BOX,{p:[DX,1.0,DZ],s:[.7,.06,1.3],c:[.42,.27,.16],pat:2,patS:3});for(const sx of[-.28,.28])for(const sz of[-.55,.55])draw(BOX,{p:[DX+sx,.5,DZ+sz],s:[.06,1.0,.06],c:[.38,.24,.14]});
 draw(BOX,{p:[DX+.08,1.04,DZ+.1],r:[0,.1,0],s:[.3,.012,.42],c:[.96,.93,.84],gold:1});lineC(xf([0,0,0]),[DX+.15,1.05,DZ+.2],[DX+.32,1.23,DZ+.3],.008,[.95,.94,.9]);
 draw(CYL,{p:[DX-.15,1.03,DZ-.45],s:[.025,.12,.025],c:[.95,.92,.82]});draw(SPHL,{p:[DX-.15,1.18,DZ-.45],s:[.022,.04,.022],c:[1,.8,.4],u:1,add:1,id:0,noShadow:1});
 draw(BOX,{p:[DX+.62,.25,DZ+.05],s:[.45,.5,.5],c:[.4,.26,.16],pat:2,patS:4});person(cxf(xf([DX+.62,0,DZ+.05],[0,-Math.PI/2,0]),xf([0,0,0]),{gold:1}),Object.assign({},MARY,{armR:[-.75,0,.05],elbowR:1.25,armL:[-.8,0,-.15],elbowL:1.0,head:[.4,0,0]}));}
function sMary(t){if(t<1.4){const k=ease(ss(0,1.4,t));salon(t,{eye:[lerp(-.9,-.5,k),lerp(2.0,1.9,k),lerp(3.0,2.6,k)],tgt:[2.4,.9,-1.2],fov:46});return;}const k=ease(ss(1.4,4.5,t));salon(t,{eye:[lerp(-3.55,-3.45,k),lerp(1.8,1.65,k),lerp(2.4,1.8,k)],tgt:[-2.2,.95,-.55],dof:[2.6,1.6]});}
// ---------- 15. Frankenstein ----------
const BOOK=document.createElement('canvas');BOOK.width=512;BOOK.height=720;(()=>{const g=BOOK.getContext('2d');g.fillStyle='#4a2416';g.fillRect(0,0,512,720);g.strokeStyle='#d9a63e';g.lineWidth=8;g.strokeRect(26,26,460,668);g.lineWidth=3;g.strokeRect(42,42,428,636);
 g.fillStyle='#ffcf6a';g.textAlign='center';g.textBaseline='middle';g.font='700 62px Cinzel';g.fillText('FRANKEN-',256,300);g.fillText('STEIN',256,375);g.fillStyle='#e2b85a';g.fillRect(140,430,232,3);g.font='600 30px Cinzel';g.fillText('1818',256,480);})();
function sBook(t){const k=ease(ss(0,2.3,t));const lf=Math.max(0,1-Math.abs(t-1.1)/.12);env({noSky:1,sky:[.7,.64,.56],gnd:[.44,.36,.28],sunC:mix3([.42,.4,.4],[1.1,1.1,1.2],lf),sunD:[-.4,.6,.6],fog:[.2,.17,.15],fogD:.02,eye:[lerp(.6,.25,k),lerp(1.75,1.55,k),lerp(1.6,1.05,k)],tgt:[0,.98,0],fov:40,plP:[.8,1.8,.8],plC:[.7,.52,.34],plR:5,dof:[1.2,.7]});
 draw(BOX,{p:[0,-.05,0],s:[6,.1,6],c:[.44,.3,.2],pat:2,patS:2});draw(BOX,{p:[0,2,-1.6],s:[6,4,.2],c:[.5,.42,.32],pat:6,patS:2});
 draw(CYL,{p:[0,0,0],s:[.22,.85,.22],c:[.4,.26,.16],pat:2,patS:4});draw(BOX,{p:[0,.9,0],r:[.35,0,0],s:[.8,.06,.7],c:[.42,.28,.17],pat:2,patS:3});
 const B=xf([0,.96,.02],[.35,0,0]);draw(BOX,{P:B,p:[0,.04,0],s:[.5,.08,.66],c:[.3,.15,.1],gold:1});draw(BOX,{P:B,p:[.0,.04,0],s:[.47,.07,.63],c:[.92,.88,.76]});useTex('book',BOOK);draw(QUAD,{P:B,p:[0,.081,0],r:[-Math.PI/2,0,0],s:[.5,.66,1],c:[1,1,1],tex:3,u:1});
 draw(CYL,{p:[.5,.0,-.3],s:[.04,1.0,.04],c:[.6,.5,.3]});draw(SPHL,{p:[.5,1.05,-.3],s:[.035,.06,.035],c:[1,.8,.4],u:1,add:1,id:0,noShadow:1});}
// ---------- 16. the Year Without a Summer ----------
function sYear(t){const k=ease(ss(0,4.2,t));env(GREYDAY({eye:[lerp(16,10,k),lerp(16,12,k),lerp(34,30,k)],tgt:[-1,0,10],fov:46,shadow:{c:[-2,0,8],r:28}}));farm();
 person(xf([1.5,0,5.4],[0,.4,0]),Object.assign({},FARMER,{worry:1}));snowfall([0,0,14],16,14,t,180,1);}
// ---------- 17. one mountain ----------
function calHF(x,z){const r=Math.hypot(x,z+60);const cone=30*Math.exp(-Math.pow(r/26,1.5));const crater=r<9?-(9-r)*2.4:0;const isl=Math.min(1,Math.max(0,(95-r)/25));return Math.min(cone,25)+crater+isl*2.5-2.2+.6*Math.sin(x*.2)*Math.cos(z*.17);}
let GK2='';function sMtn(t){const k=ease(ss(0,4.2,t));const a=lerp(.4,1.1,k);env({...SUNNY,eye:[Math.sin(a)*120,lerp(70,58,k),-60+Math.cos(a)*120],tgt:[0,12,-60],fov:44,shadow:{c:[0,0,-60],r:90}});
 if(GK!=='C'){setGrid(-160,160,-220,100,calHF);GK='C';}draw(GRID,{c:[.38,.55,.3],pat:1,patS:1.3});draw(BOX,{p:[0,-.6,-40],s:[700,1,600],c:[.12,.42,.55],pat:5,patS:.3,g:.6,noShadow:1});
 draw(CYL,{p:[0,4.2,-60],s:[5.2,.05,5.2],c:[.2,.5,.55],g:.8});draw(TUBE,{p:[0,22.3,-60],s:[9.8,1.4,9.8],c:[1,.71,.18],u:1,id:0,gold:1,a:.9,noShadow:1});
 for(let i=0;i<14;i++){const a=i*2.39,r=50+(i%4)*20;draw(SPHL,{p:[Math.cos(a)*r,40+(i%3)*4,-60+Math.sin(a)*r],s:[10,3,10],c:[.98,.98,.99],a:.8,u:1,id:0,noShadow:1,noInk:1});}}
// ---------- archive (with an early two-wheeled running machine) ----------
function wheel(P,c,r){draw(TUBE,{P,r:[0,0,Math.PI/2],s:[r,.05,r],c:[.3,.2,.12]});draw(TUBE,{P,r:[0,0,Math.PI/2],s:[r-.03,.04,r-.03],c:[.55,.4,.25]});for(let i=0;i<8;i++){const a=i/8*Math.PI*2;lineC(P,[0,0,0],[0,Math.cos(a)*r*.95,Math.sin(a)*r*.95],.008,c||[.5,.36,.22]);}draw(CYL,{P,p:[-.04,0,0],r:[0,0,Math.PI/2],s:[.04,.08,.04],c:[.3,.2,.12]});}
function drais(P){wheel(cxf(P,xf([0,.3,.55])),null,.3);wheel(cxf(P,xf([0,.3,-.55])),null,.3);lineC(P,[0,.62,-.6],[0,.62,.62],.03,[.5,.34,.2]);draw(BOX,{P,p:[0,.66,-.1],s:[.1,.04,.3],c:[.4,.22,.14]});lineC(P,[0,.3,.55],[0,.75,.62],.015,[.4,.28,.16]);lineC(P,[-.15,.76,.62],[.15,.76,.62],.012,[.4,.28,.16]);lineC(P,[0,.3,-.55],[0,.62,-.58],.015,[.4,.28,.16]);}
function sArchive(t){env({noSky:1,sky:[.42,.38,.34],gnd:[.24,.2,.17],sunC:[.48,.4,.32],sunD:[-.3,.6,.7],fog:[.14,.12,.1],fogD:.03,eye:[lerp(.6,0,ease(ss(0,4,t))),1.95,lerp(5.5,4.4,ease(ss(0,4,t)))],tgt:[0,1.95,0],fov:44,plP:[0,2.5,2],plC:[.8,.6,.35],plR:7,bloom:1});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 draw(BOX,{p:[0,.9,1.2],s:[1.8,.06,.8],c:[.4,.26,.15]});for(const sx of[-.8,.8])draw(BOX,{p:[sx,.45,1.2],s:[.06,.9,.6],c:[.35,.22,.13]});drais(cxf(xf([0,.93,1.2],[0,Math.PI/2+.3,0]),xf([0,0,0],[0,0,0],.9),{gold:1}));}
// ---------- timeline ----------
const S=[[0,2.25,sGlobe],[2.25,7.55,sHook],[7.55,8.7,sJune],[8.7,11.75,sFrost],[11.75,14.4,sRain],[14.4,19.2,sRiot],[19.2,20.65,sWhy],[20.65,25.05,sSpin],[25.05,30.35,sTambora],[30.35,35.7,sLargest],[35.7,42.0,sSulfur],[42.0,48.5,sVeil],[48.5,52.7,sCool],[52.7,57.15,sVilla],[57.15,61.65,sMary],[61.65,63.95,sBook],[63.95,68.1,sYear],[68.1,72.35,sMtn],[72.35,80.5,sArchive]];
const END=80.5;
const RIB=[[2.4,.71,'JUNE 1816'],[23.45,.125,'APRIL 1815'],[48.6,.6,'1816'],[52.8,.71,'JUNE 1816']];
function overlays(T,fn,lt){
 if(T<20.65)badge('VERMONT, USA','JUNE 1816',VLON,VLAT,T,ss(2.0,2.6,T)*(1-ss(20.3,20.65,T)));
 else if(T<52.7)badge('INDONESIA','APRIL 1815',TLON,TLAT,T,ss(24.9,25.4,T)*(1-ss(52.3,52.7,T)));
 else badge('SWITZERLAND','JUNE 1816',GLON,GLAT,T,ss(52.8,53.3,T)*(1-ss(63.6,63.95,T)));
 ribbon(T,RIB,['1815','1817'],ss(2.3,2.7,T)*(1-ss(71.9,72.3,T)));
 if(fn===sGlobe)tag('JUNE 1816',W/2,1180,.9,2.25,T);
 seal(1,'THE FREEZE',8.75,T);seal(2,'THE CAUSE',20.75,T);seal(3,'THE LEGACY',52.8,T);
 if(fn===sHook&&lt<2.55)tag('VERMONT, USA',W/2,420,2.5,4.7,T);
 if(fn===sHook&&lt>=2.55)tag('SNOW IN JUNE',W/2,420,5.2,7.4,T);
 if(fn===sFrost)tag('NEW ENGLAND',W/2,420,10.0,11.6,T);
 if(fn===sRain)tag('EUROPE',W/2,420,11.9,14.3,T);
 if(fn===sRiot){if(lt<2.4)tag('HARVESTS FAILED',W/2,420,14.6,16.7,T);else tag('FOOD RIOTS',W/2,420,17.0,19.1,T);}
 if(fn===sWhy)bigText([['WHY?',130,GOLD]],19.4,20.6,T,520);
 if(fn===sSpin){tag('THE OTHER SIDE OF THE WORLD',W/2,420,21.0,23.3,T,{size:34});tag('14 MONTHS EARLIER',W/2,420,23.5,25.0,T);}
 if(fn===sTambora)tag('MOUNT TAMBORA',W/2,420,26.9,30.2,T);
 if(fn===sLargest){if(lt<3.2)tag('LARGEST ERUPTION ON RECORD',W/2,420,30.5,33.4,T,{size:34});else tag('VILLAGES BURIED IN ASH',W/2,420,33.6,35.6,T,{size:36});}
 if(fn===sSulfur)tag('SULFUR, HIGH IN THE SKY',W/2,420,38.3,41.9,T,{size:36});
 if(fn===sVeil){tag('A THIN VEIL AROUND EARTH',W/2,420,42.3,45.8,T,{size:36});tag('SUNLIGHT BOUNCED AWAY',W/2,420,46.1,48.4,T,{size:36});}
 if(fn===sCool)tag('THE EARTH COOLED',W/2,420,48.7,50.1,T);
 if(fn===sVilla)tag('LAKE GENEVA, SWITZERLAND',W/2,420,53.0,57.0,T,{size:36});
 if(fn===sMary)museum('MARY SHELLEY','Writer, aged 18','1797–1851',560,960,58.2,61.5,T,'r');
 if(fn===sYear)bigText([['THE YEAR',80,PARCH],['WITHOUT A',80,PARCH],['SUMMER',118,GOLD]],64.3,68.0,T,430);
 if(fn===sMtn)tag('MOUNT TAMBORA TODAY',W/2,420,68.4,72.2,T);
 if(fn===sArchive){archiveCard([['HORSES TO BICYCLES'],'Oats were scarce, so horses',"became costly to feed. That may",'be why a German inventor built','a horse-free "running machine"','in 1817: an early bicycle.'],72.6,T);outro(78.0,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 if(fn===sTambora&&lt>4.2&&lt<4.9)flash((1-(lt-4.2)/.7)*.9);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
