// ===== HALIFAX EXPLOSION (1917) — HistoryWithinSeconds =====
const SEAL_Y=620;
const SUBS=window.SUBS_DATA;
const LON=-63.6,LAT=44.65;
// ---- world: The Narrows runs along z; Halifax (west, x<0), Dartmouth (east, x>0) ----
function halfW(z){return 11+16*ss(25,80,Math.abs(z));}
function hf(x,z){const w=halfW(z);let h;
 if(x<-w)h=.8+Math.min(14,(-w-x)*.32)+Math.sin(z*.08+x*.05)*.6;else if(x>w)h=.8+Math.min(10,(x-w)*.24)+Math.cos(z*.07)*.5;else h=-3;
 const e=Math.min(Math.abs(x+w),Math.abs(x-w));if(e<2.5&&Math.abs(x)>=w-0.01)h=lerp(-1,h,ss(0,2.5,e));
 return h;}
let GK='';function terrain(c){if(GK!=='T'){setGrid(-90,90,-90,90,hf);GK='T';}draw(GRID,{c:c||[.52,.66,.4],pat:1,patS:1.2});}
function water(c){draw(BOX,{p:[0,-.5,0],s:[600,1,600],c:c||[.3,.55,.78],g:.6,pat:5,patS:.45});}
// city: merged house meshes (Halifax side), destroyed + snow variants
const CITY=(()=>{let s=5;const r=()=>{s=(s*9301+49297)%233280;return s/233280;};const walls=[[],[],[]],roofs=[[],[]],win=[],rub=[[],[]],chim=[],trim=[],found=[];const pos=[];
 for(let z=-46;z<=46;z+=4.2)for(let x=-20;x>-60;x-=4.6){if(r()<.18)continue;if(Math.abs(z-6)<3.2)continue;const xx=x+r()*1.2,zz=z+r()*1.2;const y=hf(xx,zz);const w=2.2+r()*.8,d=2.6+r()*.6,h=2+r()*1.4;const ry=0;
  const ymin=Math.min(hf(xx-w/2,zz-d/2),hf(xx+w/2,zz-d/2),hf(xx-w/2,zz+d/2),hf(xx+w/2,zz+d/2));walls[Math.floor(r()*3)].push({p:[xx,(ymin-1.2+y+h)/2,zz],s:[w,y+h-(ymin-1.2),d]});found.push({p:[xx,(ymin-1.2+y+.35)/2,zz],s:[w+.08,y+.35-(ymin-1.2),d+.08]});
  for(const sd of[-1,1])roofs[Math.floor(r()*2)].push({p:[xx,y+h+.45,zz+sd*d/4],r:[sd*.6,0,0],s:[w+.3,.12,d/2+.55]});
  win.push({p:[xx+w/2+.03,y+h*.6,zz-.5],s:[.04,.5,.4]},{p:[xx+w/2+.03,y+h*.6,zz+.5],s:[.04,.5,.4]},{p:[xx+w/2+.03,y+.55,zz],s:[.04,.9,.45]});
  trim.push({p:[xx+w/2+.015,y+h*.6,zz-.5],s:[.04,.62,.52]},{p:[xx+w/2+.015,y+h*.6,zz+.5],s:[.04,.62,.52]},{p:[xx+w/2+.015,y+.6,zz],s:[.04,1.02,.57]},{p:[xx+w/2+.06,y+h*.6-.3,zz-.5],s:[.1,.05,.56]},{p:[xx+w/2+.06,y+h*.6-.3,zz+.5],s:[.1,.05,.56]});
  if(r()<.5)chim.push({p:[xx-.4,y+h+.9,zz],s:[.3,.8,.3]});
  pos.push([xx,y,zz,w,h,d]);
  for(let k=0;k<3;k++)rub[0].push({p:[xx+(r()-.5)*w,y+.35+r()*.3,zz+(r()-.5)*d],r:[r()*.5,r()*3,r()*.5],s:[.14,.14,1.6+r()*1.2]});
  if(r()<.55)rub[1].push({p:[xx+(r()<.5?-1:1)*w*.4,y+.5+r()*.5,zz],r:[0,0,(r()-.5)*.3],s:[.2,1+r()*1.4,d*(.4+r()*.5)]});}
 return{walls:walls.map(merge),roofs:roofs.map(merge),win:merge(win),trim:merge(trim),found:merge(found),chim:merge(chim),rub:rub.map(merge),pos};})();
const WALLC=[[.86,.8,.68],[.72,.5,.38],[.62,.68,.74]],ROOFC=[[.38,.3,.28],[.3,.34,.4]];
function city(o){o=o||{};const sn=o.snow||0;const T=c=>mix3(c,[.95,.96,.98],sn);
 if(!(o.ruin>=1)){CITY.walls.forEach((m,i)=>draw(m,{c:T(WALLC[i]),pat:i==1?3:6,patS:i==1?2.2:1.5}));CITY.roofs.forEach((m,i)=>draw(m,{c:T(ROOFC[i]),pat:4,patS:2.6}));draw(CITY.win,{c:[.18,.2,.26],g:.8});draw(CITY.found,{c:T([.5,.48,.45]),pat:6,patS:3});draw(CITY.trim,{c:T([.93,.92,.88])});draw(CITY.chim,{c:T([.55,.3,.25]),pat:3,patS:3});}
 else{const PM=propMesh('rubblePile',(x,y,z)=>Math.max(SD.ell(x,y,z,[0,0,0],[1.4,.55,1.6])+.18*vnoise3(x*2.5,y*2.5,z*2.5)+.08*vnoise3(x*7,y*7,z*7)-.1,-y),[-1.8,-.05,-2],[1.8,.9,2],.06);
 CITY.pos.forEach(([x,y,z],i)=>draw(PM,{p:[x,y-.05,z],r:[0,i*1.7,0],c:T(i%3?[.48,.4,.34]:[.36,.32,.3]),pat:7,patS:1.5}));draw(CITY.rub[0],{c:T([.16,.12,.1])});draw(CITY.rub[1],{c:T([.66,.58,.48]),pat:3,patS:2});}}
const DART=(()=>{const L=[],R=[],Wn=[],Tr=[];for(let i=0;i<26;i++){const z=-44+i*3.6,x=16+(i%4)*5;const y=hf(x,z);const h=2+(i%3)*.5;const ym=Math.min(hf(x-1.1,z-1.3),hf(x+1.1,z-1.3),hf(x-1.1,z+1.3),hf(x+1.1,z+1.3))-1.2;L.push({p:[x,(ym+y+h)/2,z],s:[2.2,y+h-ym,2.6]});for(const sd of[-1,1])R.push({p:[x,y+h+.42,z+sd*.65],r:[sd*.6,0,0],s:[2.5,.12,1.85]});
 for(const dz of[-.6,.6]){Wn.push({p:[x-1.13,y+h*.62,z+dz],s:[.04,.45,.38]});Tr.push({p:[x-1.115,y+h*.62,z+dz],s:[.04,.57,.5]});}}return{w:merge(L),r:merge(R),wn:merge(Wn),tr:merge(Tr)};})();
const PIERS=(()=>{const L=[];for(let i=-3;i<=3;i++){const z=i*11;const w=halfW(z);L.push({p:[-w+3.5,.35,z],s:[8,.5,2.4]});for(let k=0;k<6;k++)L.push({p:[-w+.5+k*1.4,-.6,z+1.1],s:[.25,2,.25]},{p:[-w+.5+k*1.4,-.6,z-1.1],s:[.25,2,.25]});}return merge(L);})();
const RAIL=(()=>{const L=[];for(let z=-80;z<80;z+=.8)L.push({p:[-halfW(z)-3.2,hf(-halfW(z)-3.2,z)+.08,z],s:[1.6,.08,.22]});return merge(L);})();
const HTREES=(()=>{let s=9;const r=()=>{s=(s*9301+49297)%233280;return s/233280;};const L=[];for(let i=0;i<34;i++){const x=24+r()*30,z=-60+r()*120;L.push([x,z,.8+r()*.5,r()<.6?'pine':'broad']);}for(let i=0;i<22;i++){const x=-62-r()*20,z=-60+r()*120;L.push([x,z,.9+r()*.5,r()<.5?'pine':'broad']);}return L;})();
function harbourTrees(sn){HTREES.forEach(([x,z,k,ty])=>tree(xf([x,hf(x,z)-.05,z]),k,sn?mix3(ty==='pine'?[.2,.42,.24]:[.32,.56,.24],[.93,.94,.96],sn*.7):null,ty));}
function harbour(o){o=o||{};water(o.water);terrain(o.ground);if(!o.noCity)city(o);draw(DART.w,{c:mix3([.8,.74,.6],[.95,.96,.98],o.snow||0),pat:6,patS:1.5});draw(DART.r,{c:mix3([.35,.3,.3],[.95,.96,.98],o.snow||0),pat:4,patS:2.6});draw(DART.wn,{c:[.18,.2,.26],g:.8});draw(DART.tr,{c:[.93,.92,.88]});
 if(!o.noTrees)harbourTrees(o.snow||0);
 if(!(o.ruin>=1))draw(PIERS,{c:[.45,.35,.25],pat:2,patS:1.6});draw(RAIL,{c:[.3,.25,.2]});}
// ---- ships ----
function hullMesh(){const P=[],N=[],I=[];const S=[];const n=22;for(let i=0;i<=n;i++){const u=i/n;// u=0 stern, 1 bow
  const bw=u>.75?Math.sqrt(Math.max(0,1-Math.pow((u-.75)/.25,2))):(u<.08?.8+.2*(u/.08):1);S.push([u-.5,bw]);}
 const ring=[[1,1],[1,.3],[.75,-.6],[0,-1],[-.75,-.6],[-1,.3],[-1,1]];
 const rings=S.map(([z,bw])=>ring.map(([x,y])=>[x*.5*Math.max(bw,.02),y*.5,z]));
 for(let i=0;i<n;i++)for(let j=0;j<ring.length-1;j++){const a=rings[i][j],b=rings[i+1][j],c=rings[i+1][j+1],d=rings[i][j+1];const nn=norm(cross(sub(b,a),sub(d,a)));const base=P.length/3;[a,b,c,d].forEach(v=>{P.push(...v);N.push(...nn);});I.push(base,base+1,base+2,base,base+2,base+3);}
 // deck
 for(let i=0;i<n;i++){const a=rings[i][0],b=rings[i+1][0],c=rings[i+1][6],d=rings[i][6];const base=P.length/3;[a,b,c,d].forEach(v=>{P.push(...v);N.push(0,1,0);});I.push(base,base+1,base+2,base,base+2,base+3);}
 // stern cap
 {const base=P.length/3;rings[0].forEach(v=>{P.push(...v);N.push(0,0,-1);});for(let j=1;j<ring.length-1;j++)I.push(base,base+j,base+j+1);}
 return mesh(P,N,I);}
const HULL=hullMesh();
// ship along local +z (bow), length L
function ship(P,o){o=o||{};const L=o.L||14,B=o.B||2.4,D=o.D||2;const hc=o.hull||[.18,.18,.2],gid=nextId();const SP=withId(P,gid);
 draw(HULL,{P:SP,p:[0,.2,0],s:[B,D,L],c:hc});draw(HULL,{P:SP,p:[0,-.35,0],s:[B*1.01,D*.45,L*1.0],c:o.keel||[.6,.15,.12]});
 draw(BOX,{P:SP,p:[0,1.2,-L*.08],s:[B*.6,1.1,L*.16],c:o.sup||[.92,.9,.84]});draw(BOX,{P:SP,p:[0,1.9,-L*.04],s:[B*.5,.5,L*.08],c:o.sup||[.92,.9,.84]});
 for(let k=0;k<4;k++)draw(BOX,{P:SP,p:[B*.31,1.25,-L*.13+k*.5],s:[.02,.25,.3],c:[.15,.18,.25]});
 draw(CYL,{P:SP,p:[0,1.7,-L*.2],s:[.38,1.6,.38],c:o.fun||[.2,.2,.2]});draw(CYL,{P:SP,p:[0,2.75,-L*.2],s:[.4,.35,.4],c:o.band||[.85,.2,.15]});
 for(const zz of[L*.28,-L*.36]){draw(CYL,{P:SP,p:[0,.9,zz],s:[.08,3.6,.08],c:[.35,.28,.2]});draw(BOX,{P:SP,p:[0,2.9,zz],s:[1.4,.06,.06],c:[.35,.28,.2]});draw(BOX,{P:SP,p:[0,1.2,zz],r:[.3,0,0],s:[.06,.06,2.4],c:[.35,.28,.2]});}
 draw(BOX,{P:SP,p:[0,.71,0],s:[B*.92,.02,L*.86],c:[.62,.5,.36],pat:2,patS:3.5});
 if(!o.noFoam){draw(SPHL,{P:SP,p:[0,.02,L*.02],s:[B*.75,.03,L*.56],c:[.95,.98,1],a:.55,u:1});draw(SPHL,{P:SP,p:[0,.025,L*.5],s:[B*.45,.03,L*.08],c:[1,1,1],a:.7,u:1});}
 for(const sd of[-1,1]){draw(BOX,{P:SP,p:[sd*B*.47,1.0,L*.02],s:[.03,.03,L*.8],c:[.85,.85,.82]});for(let k=-6;k<=6;k++)draw(BOX,{P:SP,p:[sd*B*.47,.86,k*L*.065],s:[.025,.3,.025],c:[.85,.85,.82]});
  for(let k=-5;k<=5;k++)draw(SPH,{P:Object.assign({},SP,{noInk:1}),p:[sd*(B*.5+.005),.42,k*L*.07],s:[.012,.07,.07],c:[.75,.78,.82]});
  const LB=cxf(SP,xf([sd*B*.36,1.55,-L*.12]));draw(HULL,{P:LB,s:[.38,.32,1.4],c:[.95,.95,.92]});draw(CYL,{P:SP,p:[sd*B*.36,1.25,-L*.12-.5],s:[.03,.45,.03],c:[.3,.3,.32]});draw(CYL,{P:SP,p:[sd*B*.36,1.25,-L*.12+.5],s:[.03,.45,.03],c:[.3,.3,.32]});}
 for(let k=0;k<6;k++)draw(BOX,{P:SP,p:[0,1.95,-L*.04-.45+k*.18],s:[B*.51,.12,.1],c:[.12,.15,.22]});
 for(const zz of[L*.18,-L*.3])draw(BOX,{P:SP,p:[0,.8,zz],s:[B*.5,.14,L*.12],c:[.3,.24,.18],pat:2,patS:4});
 if(o.cargo){for(let k=0;k<6;k++)barrel(cxf(SP,xf([-.6+(k%3)*.6,.95,L*.18+Math.floor(k/3)*.65])),o.gold?[.75,.5,.2]:[.6,.4,.22]);}
 if(o.name){nameTex(o.name);dynTex('nm'+o.name,NM);for(const sd of[-1,1])draw(QUAD,{P:SP,p:[sd*(B*.5+.02),.55,L*.05],r:[0,sd*Math.PI/2,0],s:[L*.5,L*.05,1],c:[1,1,1],tex:3,u:1});}}
const NM=document.createElement('canvas');NM.width=1024;NM.height=100;function nameTex(s){const g=NM.getContext('2d');g.clearRect(0,0,1024,100);g.fillStyle='#f4f1e8';g.font='800 86px Montserrat';g.textAlign='center';g.textBaseline='middle';g.fillText(s,512,52);}
function smoke(x,y,z,t,k,o){o=o||{};k=k||1;for(let i=0;i<18;i++){const ph=(t*.25+i/18)%1;const r=(.6+ph*2.2)*k;draw(SPHL,{p:[x+Math.sin(i*2.1)*ph*1.5*k+ph*3*k*(o.drift||1),y+ph*9*k,z+Math.cos(i*1.3)*ph*1.2*k],s:[r,r*.8,r],c:o.c||[.32,.3,.3],a:.55*(1-ph),u:o.u?1:0});}}
function flames(x,y,z,t,k){k=k||1;for(let i=0;i<10;i++){const f=.5+.5*Math.sin(t*9+i*1.9),g=.5+.5*Math.sin(t*13+i*2.7);const px=x+Math.sin(i*2.4)*.55*k,pz=z+Math.cos(i*2.4)*.75*k;const h=(1.1+f*.9)*k;
 draw(SPHL,{p:[px,y+h*.45,pz],s:[.32*k*(1-.25*g),h*.55,.32*k*(1-.25*g)],c:[1,.48+.1*g,.1],u:1,id:7,a:.92});draw(SPHL,{p:[px,y+h*.3,pz],s:[.18*k,h*.32,.18*k],c:[1,.86,.4],u:1,id:7,a:.95});}
 for(let i=0;i<14;i++){const ph=(t*.9+i*.071)%1;draw(SPHL,{p:[x+Math.sin(i*3.3+t)*.8*k,y+ph*4*k,z+Math.cos(i*2.1)*.8*k],s:[.04*k,.04*k,.04*k],c:[1,.7,.25],u:1,a:1-ph*.9});}}
// ---- palettes ----
const DAY={sky:[.68,.72,.8],gnd:[.46,.45,.42],sunC:[.6,.57,.5],sunD:[.5,.6,.45],fog:[.78,.85,.92],fogD:.004};
const COLD={sky:[.66,.7,.78],gnd:[.45,.45,.45],sunC:[.55,.55,.55],sunD:[.4,.7,.4],fog:[.86,.88,.92],fogD:.009};
// Mont-Blanc + Imo motion: collision near z=-6 (just north of Pier 6 at z=0); MB drifts to pier 6
function mbPos(T){if(T<14.8)return[3,0,lerp(30,8,ss(7,14.8,T))];if(T<18.8)return[lerp(3,-1,ss(14.8,18.8,T)),0,lerp(8,-4,ss(14.8,18.8,T))];return[lerp(-1,-7.5,ss(26,34,T)),0,lerp(-4,-1.2,ss(26,34,T))];}
function imoPos(T){return[lerp(1,3,ss(17,19,T)),0,lerp(-40,-9,ss(9,18.6,T))];}
// ---- shots ----
function sGlobe(t){const k=ease(ss(0,2.0,t));env({eye:[0,0,lerp(5.4,3.3,k)],tgt:[0,0,0],fov:40,bg:[.055,.105,.17],fog:[.055,.105,.17],fogD:0,sky:[.9,.9,.95],gnd:[.55,.55,.6],sunC:[.45,.45,.45],sunD:[-.3,.4,.9],ink:.8,inkFar:50});
 globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.6,ss(1.1,1.6,t));for(let i=0;i<80;i++){const a=i*2.39,e=(i*.618)%1;draw(SPHL,{p:[Math.cos(a)*40,(e-.5)*70,-30+Math.sin(a)*10],s:[.08,.08,.08],c:[1,1,1],u:1,id:0});}}
function crowd(cx0,cz,n,t,face){for(let i=0;i<n;i++){const x=cx0-Math.floor(i/5)*1.3-(i%2)*.3,z=cz-2.2+(i%5)*1.1;const kid=i%4==3;
 person(xf([x,hf(x,z),z],[0,face+Math.sin(i)*.3,0],kid?.62:1),{coat:[[.25,.28,.38],[.4,.3,.22],[.3,.3,.3],[.55,.2,.18],[.2,.35,.3]][i%5],dress:i%3==1?[[.35,.25,.4],[.5,.3,.25],[.25,.3,.45]][i%3]:0,hat:kid?'cap':['bowler','flat','none','flat','bowler'][i%5],hairStyle:i%3==1?'bun':'short',
  ...(i%6==0?POSE.point:{}),head:[-.1,0,0]});}}
function sHook(t){// crowd on hillside watching burning ship (gold)
 const k=ease(ss(0,3.8,t));const T=30;const p=mbPos(T);env({...DAY,bloom:1,eye:[lerp(-25,-22,k),hf(-24,6)+lerp(3.2,2.8,k),6],tgt:[lerp(-6,-4,k),1.6,-1],fov:44,desat:.35});harbour();
 ship({...xf(p,[0,-1.1,0]),gold:1},{cargo:1,hull:[.2,.2,.22],sup:[.85,.82,.75],gold:1});flames(p[0],2,p[2],t,1.2);smoke(p[0],3,p[2],t,1.3);
 crowd(-15.5,4.6,10,t,-Math.PI/2+Math.PI);grass('hook',hf,-22,-12.2,0,10,500);}
function sCity(t){const a=-.5+t*.06;env({...DAY,eye:[Math.sin(a)*70,38,Math.cos(a)*70],tgt:[-6,0,0],fov:44});harbour();
 ship(xf(mbPos(7+t),[0,Math.PI,0]),{});[[8,-30,0],[-4,26,Math.PI],[6,40,.2],[-2,-50,0]].forEach(([x,z,r],i)=>ship(xf([x,0,z],[0,r,0]),{hull:[.45,.48,.52],sup:[.7,.72,.74],fun:[.4,.42,.45],band:[.3,.3,.32]}));
 for(let i=0;i<4;i++)smoke(-50+i*30,8,-80,t+i,1.5,{c:[.5,.5,.52]});}
function sShips(t){const k=ease(ss(0,3.3,t));env({...DAY,eye:[lerp(14,10,k),5,lerp(30,4,k)],tgt:[0,1.5,lerp(10,-14,k)],fov:46});harbour();
 [[6,20,0],[-5,8,Math.PI],[7,-6,.1],[-6,-22,Math.PI],[5,-34,0]].forEach(([x,z,r],i)=>{ship(xf([x,0,z],[0,r,0]),{hull:[.42,.45,.5],sup:[.72,.73,.74],fun:[.35,.36,.4],band:[.25,.25,.28],L:12+i%2*4});smoke(x,4.5,z,t+i*.7,.6,{c:[.55,.55,.57]});});}
function sCollide(t){const T=14.8+t;const pm=mbPos(T),pi=imoPos(T);const hit=T>18.4?1:0;const sh=hit?Math.sin(t*50)*.15*Math.exp(-(T-18.4)*3):0;
 env({...DAY,eye:[lerp(26,22,t/4.5)+sh,30+sh,lerp(14,8,t/4.5)],tgt:[1,0,-6],fov:44});harbour();
 ship({...xf(pm,[0,Math.PI+lerp(0,.35,ss(15,18,T)),0]),gold:.0},{hull:[.2,.2,.22],sup:[.85,.82,.75],cargo:1});ship(xf(pi,[0,lerp(0,-.15,ss(16,18,T)),0]),{hull:[.15,.15,.17],sup:[.6,.58,.55],band:[.9,.9,.9],name:'BELGIAN RELIEF',L:15});
 if(T>18.3&&T<19.6)for(let i=0;i<16;i++){const ph=(T-18.3)/1.3;draw(SPHL,{p:[1+Math.sin(i*2)*ph*3,1.5+ph*2-ph*ph*3,-6+Math.cos(i*3)*ph*3],s:[.12,.12,.12],c:[1,.85,.3],u:1});}}
function plinth(fig,t,o){o=o||{};// museum gallery: stone plinth, slow turn, camera arcs
 const a=.6+t*.18;env({noSky:1,sky:[.5,.48,.46],gnd:[.25,.22,.2],sunC:[.45,.42,.38],sunD:[-.3,.8,.6],fog:[.13,.12,.14],fogD:.02,eye:[Math.sin(a)*o.r,o.h,Math.cos(a)*o.r],tgt:[0,o.ty,0],fov:40,dof:[Math.hypot(o.r,o.h-o.ty),o.r*.35],plP:[1.5,5,3],plC:[.8,.7,.5],plR:12,desat:.25});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.36,.27,.2],pat:2,patS:1.2,g:.3});for(let i=-3;i<=3;i++)draw(BOX,{p:[i*4,3,-9],s:[3.6,6,.3],c:[.3,.25,.25],pat:6,patS:1});draw(BOX,{p:[0,6.2,-9],s:[30,.3,.5],c:[.55,.42,.2]});
 draw(CYL,{p:[0,0,0],s:[o.pr||1.4,o.ph||1,o.pr||1.4],c:[.74,.7,.64],pat:6,patS:3,g:.3});draw(CYL,{p:[0,o.ph||1,0],s:[(o.pr||1.4)*1.1,.12,(o.pr||1.4)*1.1],c:[.82,.78,.72],pat:6,patS:3,g:.3});draw(CYL,{p:[0,0,0],s:[(o.pr||1.4)*1.12,.1,(o.pr||1.4)*1.12],c:[.6,.56,.5]});
 fig(cxf(xf([0,(o.ph||1)+.12,0],[0,-t*.35,0]),xf([0,0,0]),{gold:1}));}
function sMB(t){plinth(P=>ship(cxf(P,xf([0,.35,0],[0,0,0],.4)),{hull:[.2,.2,.22],sup:[.85,.82,.75],cargo:1,noFoam:1}),t,{r:13,h:5.2,ty:1.5,pr:2.6,ph:.8});}
function sCargo(t){const k=ease(ss(0,4.6,t));env({...DAY,eye:[lerp(9,7,k),lerp(5,4,k),lerp(9,5,k)],tgt:[0,.8,1.5],fov:44,clip:[1,0,0,-.0],desat:.3});water();
 const P=xf([0,0,0]);ship(P,{hull:[.2,.2,.22],sup:[.85,.82,.75],cargo:1,gold:1});
 // interior cutaway: holds with crates
 for(let h=0;h<3;h++){const z=-4+h*3.2;draw(BOX,{p:[.0,-.2,z+1.6],s:[2.3,.06,2.9],c:[.4,.3,.2]});for(let i=0;i<8;i++)draw(BOX,{p:[-.7+(i%2)*.6,-.6+Math.floor(i/2)%2*.55,z+.7+Math.floor(i/4)*.9],s:[.5,.5,.8],c:h==1?[.75,.6,.35]:[.65,.5,.3],gold:h==1&&t<1.6?1:0});}
 for(let i=0;i<4;i++)draw(CYL,{p:[-.6+i*.35,-.95,2.3],s:[.15,.5,.15],c:[.6,.62,.6],gold:t>1.6&&t<2.7?1:0});}
function sFire(t){const T=26.8+t;const p=mbPos(T);const ig=ss(.2,1,t);env({...DAY,eye:[lerp(p[0]+10,p[0]+12,t/4.2),4.5,p[2]+lerp(9,11,t/4.2)],tgt:[p[0]-1,1.8,p[2]-1],fov:44});harbour();
 ship(xf(p,[0,Math.PI+.35,0]),{hull:[.2,.2,.22],sup:[.85,.82,.75],cargo:1});const fp=[p[0]-.6,1.3,p[2]-2.5];if(ig>0){flames(fp[0],fp[1],fp[2],t,ig*1.2);smoke(fp[0],fp[1]+1.5,fp[2],t,ig*.9);}
 // lifeboat rowing away
 const bz=lerp(p[2]+1,p[2]+8,ss(1.6,4.2,t)),bx=lerp(p[0]+2,p[0]+6,ss(1.6,4.2,t));const BP=xf([bx,0,bz],[0,.9,0]);draw(HULL,{P:BP,p:[0,.15,0],s:[1.1,.6,3.2],c:[.85,.82,.75]});
 for(let i=0;i<4;i++)person(cxf(BP,xf([0,-.25,-1+i*.65],[0,0,0],.75)),{sit:1,coat:[.2,.25,.4],hat:'naval',armL:[-1+Math.sin(t*5+i)*.5,0,0],armR:[-1+Math.sin(t*5+i)*.5,0,0]});}
function sDrift(t){const T=31.4+t;const p=mbPos(T);env({...DAY,eye:[22,12,22],tgt:[-6,1,-1],fov:40,desat:.3});harbour();
 ship({...xf(p,[0,Math.PI+.5,0]),gold:1},{hull:[.2,.2,.22],sup:[.85,.82,.75],cargo:1});flames(p[0]-.4,1.3,p[2]-2,t,1.4);smoke(p[0]-.4,2.8,p[2]-2,t,1.5);}
function sCrowd(t){const sh=t<1.5?0:t<3.2?1:2;const lt=t-[0,1.5,3.2][sh];const p=mbPos(36);
 if(sh==0){env({...DAY,eye:[lerp(-9,-10,lt),2.6,lerp(11,10,lt)],tgt:[-17,hf(-17,5)+1.2,5],fov:44});harbour();ship(xf(p,[0,Math.PI+.5,0]),{cargo:1});flames(p[0]-.4,1.3,p[2]-2,t,1.4);smoke(p[0]-.4,2.8,p[2]-2,t,1.5);crowd(-15.5,5,10,t,Math.PI/2+.1);}
 if(sh==1){env({...DAY,eye:[lerp(-17,-16.5,lt),hf(-18,6)+1.1,8.2],tgt:[-20,hf(-20,6)+.9,5.5],fov:42});harbour();grass('st',hf,-23,-14,2,10,600);for(let i=0;i<3;i++)person(xf([-19.5-i*.8,hf(-20,6),5.6+i*.3],[0,Math.PI/2+.5,0],.62),{coat:[[.55,.2,.18],[.25,.4,.6],[.4,.3,.22]][i],hat:'cap',head:[-.15,0,0],...(i==1?POSE.point:{})});}
 if(sh==2){const hx=-21.5,hz=6,y0=hf(hx,hz);env({...DAY,eye:[hx+5.8,y0+1.9,hz+lerp(1.0,.6,lt)],tgt:[hx+1,y0+1.65,hz],fov:38});harbour();
  const WC=[.86,.8,.68];draw(BOX,{p:[hx-.3,y0+1.6,hz],s:[1.4,3.2,3.4],c:[.3,.24,.2]});for(const sd of[-1,1])draw(BOX,{p:[hx+.5,y0+1.6,hz+sd*1.65],s:[1.1,3.2,.1],c:WC});draw(BOX,{p:[hx+.5,y0+3.15,hz],s:[1.1,.1,3.4],c:WC});
  draw(BOX,{p:[hx+1,y0+.55,hz],s:[.1,1.1,3.4],c:WC});draw(BOX,{p:[hx+1,y0+2.75,hz],s:[.1,.9,3.4],c:WC});for(const sd of[-1,1])draw(BOX,{p:[hx+1,y0+1.7,hz+sd*1.25],s:[.1,1.2,.9],c:WC});
  draw(BOX,{p:[hx+1.02,y0+1.7,hz],s:[.05,1.25,.06],c:[.95,.95,.92]});draw(BOX,{p:[hx+1.02,y0+1.7,hz],s:[.05,.06,1.65],c:[.95,.95,.92]});draw(BOX,{p:[hx+1.08,y0+1.08,hz],s:[.2,.06,1.8],c:[.95,.95,.92]});
  for(let i=0;i<2;i++)person(xf([hx+.62,y0+.12,hz-.4+i*.8],[0,Math.PI/2,0]),{coat:[[.4,.3,.5],[.3,.3,.3]][i],dress:i==0?[.4,.3,.5]:0,hairStyle:i==0?'bun':'short',hair:HAIRS[i*2],head:[-.05,0,0],...(i==1?{armR:[-1.6,0,0],elbowR:1.2}:{})});
  draw(BOX,{p:[hx+1,y0+1.7,hz],s:[.03,1.2,1.6],c:[.75,.88,1],a:.22,u:1});}}
function coleman(P,o){person(P,Object.assign({coat:[.2,.22,.3],sleeve:[.94,.93,.9],shirt:[.94,.93,.9],tie:[.15,.15,.2],moustache:1,hair:HAIRS[0],pants:[.2,.22,.3]},o||{}));}
function sVince(t){plinth(P=>coleman(P,{}),t,{r:3.6,h:2.3,ty:1.95,pr:.9,ph:.9});}
function office(t,o){o=o||{};const fd=Math.hypot(o.tgt[0]-o.eye[0],o.tgt[1]-o.eye[1],o.tgt[2]-o.eye[2]);env({dof:[fd,fd*.4],noSky:1,sky:[.62,.6,.58],gnd:[.38,.34,.3],sunC:[.5,.47,.42],sunD:[.7,.5,.3],fog:[.3,.27,.25],fogD:.01,eye:o.eye,tgt:o.tgt,fov:o.fov||42,plP:[2.4,2.2,0],plC:[1,.6,.3].map(v=>v*(o.glow||.8)),plR:7,desat:o.desat||0});
 draw(BOX,{p:[0,-.05,0],s:[8,.1,8],c:[.45,.33,.22],pat:2,patS:2});draw(BOX,{p:[-3,1.6,0],s:[.1,3.2,8],c:[.62,.58,.48],pat:6,patS:2});draw(BOX,{p:[0,1.6,-3],s:[8,3.2,.1],c:[.6,.55,.45],pat:6,patS:2});draw(BOX,{p:[-2.94,.55,0],s:[.04,1.1,8],c:[.42,.3,.2],pat:2,patS:3});draw(BOX,{p:[0,.55,-2.94],s:[8,1.1,.04],c:[.42,.3,.2],pat:2,patS:3});draw(CYL,{p:[.5,2.6,.6],s:[.015,.6,.015],c:[.2,.2,.2]});draw(FR,{p:[.5,2.45,.6],r:[Math.PI,0,0],s:[.22,.18,.22],c:[.25,.4,.3],g:.5});draw(SPH,{p:[.5,2.25,.6],s:[.07,.07,.07],c:[1,.9,.6],u:1});
 draw(BOX,{p:[3,.5,0],s:[.1,1,8],c:[.6,.55,.45]});draw(BOX,{p:[3,2.9,0],s:[.1,.6,8],c:[.6,.55,.45]});for(const z of[-3,-1.3,1.3,3])draw(BOX,{p:[3,1.6,z],s:[.1,2.2,.25],c:[.6,.55,.45]});
 // window view: harbour glow + smoke
 draw(BOX,{p:[3.4,1.6,0],s:[.1,2.2,6],c:[1,.72,.4],u:1,id:0});for(let i=0;i<6;i++){const ph=(t*.2+i/6)%1;draw(SPHL,{p:[3.35,1+ph*1.6,-1+Math.sin(i)*1.5],s:[.35+ph*.4,.3+ph*.3,.05],c:[.25,.22,.22],u:1,a:.7,id:0});}
 draw(BOX,{p:[1.5,.8,0],s:[1.2,.08,2.6],c:[.5,.32,.18],pat:2,patS:4,g:.4});for(const[x,z]of[[1,-1.2],[2,-1.2],[1,1.2],[2,1.2]])draw(BOX,{p:[x,.4,z],s:[.08,.8,.08],c:[.4,.26,.15]});
 // telegraph key + sounder
 const tap=o.tap?Math.max(0,Math.sin(t*22))*(Math.sin(t*3.1)>-.3?1:0):0;draw(BOX,{p:[1.5,.88,.2],s:[.35,.06,.2],c:[.3,.2,.12],gold:o.gk||0});draw(BOX,{p:[1.45,.95-tap*.03,.2],r:[0,0,-tap*.1],s:[.3,.03,.05],c:[.75,.6,.3],g:.7,gold:o.gk||0});draw(SPH,{p:[1.32,.98-tap*.03,.2],s:[.05,.03,.05],c:[.1,.1,.1],gold:o.gk||0});
 draw(BOX,{p:[1.6,.95,-.5],s:[.3,.15,.2],c:[.6,.5,.3],g:.6});draw(BOX,{p:[1.2,.86,.7],s:[.5,.02,.35],c:[.95,.93,.85]});
 if(o.cap)draw(CYL,{p:[1.7,.86,.75],s:[.13,.06,.14],c:[.2,.2,.25],gold:1});
 for(let i=0;i<5;i++)draw(BOX,{p:[-2.9,1.2+i*.35,-1.5],s:[.2,.25,.6],c:[.5,.4,.3]});}
function sRun(t){// He could run / instead he warns
 if(t<2.1){office(t,{eye:[-1.9,1.6,1.9],tgt:[.9,1.35,-.6],glow:.9});coleman(xf([lerp(.7,.5,t/2),0,-.8],[0,Math.PI/2+lerp(.2,1.1,ss(.3,1.5,t)),0]),{head:[0,lerp(0,-.6,ss(.3,1.4,t)),0],worry:1});}
 else{const lt=t-2.1;office(t,{eye:[lerp(-.6,-.2,lt/1.8),1.3,lerp(1.6,1.2,lt/1.8)],tgt:[1.5,.95,.2],glow:.9,tap:lt>.6,gk:1});coleman(xf([.75,0,.2],[0,Math.PI/2,0]),{sit:1,armR:[-.9,0,.1],elbowR:1.0,armL:[-.6,0,-.1],elbowL:1.2,head:[.2,0,0]});
  draw(BOX,{p:[.75,.45,.2],s:[.45,.06,.45],c:[.4,.26,.15]});}}
function sMsg(t){// close on key + telegram overlay; train in the distance
 if(t<2.6){office(t,{eye:[3.1,1.7,2.0],tgt:[1.0,1.15,.15],fov:42,glow:1,tap:1,gk:1});coleman(xf([.75,0,.2],[0,Math.PI/2,0]),{sit:1,armR:[-.9,0,.1],elbowR:1.0,armL:[-.6,0,-.1],elbowL:1.2,head:[.2,0,0]});draw(BOX,{p:[.75,.45,.2],s:[.45,.06,.45],c:[.4,.26,.15]});}
 else{const lt=t-2.6;env({...DAY,eye:[-40,hf(-40,40)+6,58],tgt:[-34,hf(-34,40)+1,30],fov:42});harbour();train(-halfW(30)-3.2,lerp(60,52,ss(0,1.5,lt)),t);}}
function train(x,z,t){const y=hf(x,z)+.1;const P=xf([x,y,z],[0,Math.PI,0]);draw(BOX,{P,p:[0,.9,0],s:[1.3,1.3,4],c:[.15,.15,.17]});draw(CYL,{P,p:[0,1.1,1.6],r:[Math.PI/2,0,0],s:[.6,3,.6],c:[.2,.2,.22]});draw(CYL,{P,p:[0,1.6,2.6],s:[.2,.8,.2],c:[.15,.15,.15]});
 for(let k=1;k<4;k++){draw(BOX,{P,p:[0,1.1,-k*4.6],s:[1.4,1.7,4.2],c:[.45,.18,.14]});for(let w=0;w<5;w++)draw(BOX,{P,p:[.71,1.3,-k*4.6-1.6+w*.8],s:[.02,.45,.5],c:[1,.85,.5],u:1});}
 smoke(x,y+2.6,z-2.6,t,.5,{c:[.85,.85,.88]});}
function sBlast(t){const e=t-.25;const sh=e>0?Math.sin(t*45)*.6*Math.exp(-e*1.5):0;
 env({...DAY,eye:[44+sh,22+sh,50],tgt:[-6,lerp(5,13,ss(0,3,e)),-1],fov:48,plP:[-7.5,6,-1.2],plC:e>0?[3,2,1].map(v=>v*Math.exp(-e*.7)):[0,0,0],plR:90});harbour({ruin:e>.5?1:0});
 if(e<0){const p=mbPos(51);ship(xf(p,[0,Math.PI+.5,0]),{cargo:1});flames(p[0]-.4,1.3,p[2]-2,t,1.4);smoke(p[0]-.4,2.8,p[2]-2,t,1.5);}
 if(e>0){const fb=ss(0,1.4,e);const R=3+fb*13;const fc=mix3([1,.95,.75],[1,.45,.1],ss(.2,1.6,e));
  const fa=clamp(2.6-e*.9,0,1);if(fa>0)for(let i=0;i<16;i++){const a=i*2.39,el=(i%4)/4;const rr=R*(.45+.15*Math.sin(i*1.7));const q=R*.55;draw(SPHL,{p:[-7.5+Math.cos(a)*q*Math.cos(el),1+R*.5+Math.sin(el*3.1+i)*q*.6,-1.2+Math.sin(a)*q*Math.cos(el)],s:[rr,rr*.9,rr],c:mix3(fc,[1,.8,.4],(i%3)*.2),e:[.45,.22,.02],id:8,a:fa>.98?1:fa});}draw(SPH,{p:[-7.5,1+R*.5,-1.2],s:[R*.7,R*.65,R*.7],c:[1,.85,.45],e:[.6,.4,.1],id:8,a:fa>.98?1:fa});draw(TUBE,{p:[-7.5,.1,-1.2],s:[4+ss(0,3,e)*45,.8,4+ss(0,3,e)*45],c:[.95,.97,1],a:clamp(1-e*.33,0,1)});
  for(let i=0;i<34;i++){const ph=ss(.5,3.4,e);const a=i*2.4;const r=(2.2+ph*3.4)*(.8+.3*Math.sin(i*3.1));const hh=3+ph*24*(.35+.65*Math.abs(Math.sin(i*1.3)));draw(SPHL,{p:[-7.5+Math.cos(a)*(2.5+ph*6)*(hh>18?1.6:1),hh,-1.2+Math.sin(a)*(2.5+ph*6)*(hh>18?1.6:1)],s:[r,r*.85,r],c:mix3([1,.62,.22],[.36+.06*Math.sin(i),.32,.31],ss(.7,2.6,e+i*.01)),u:1});}
  for(let i=0;i<26;i++){const ph=ss(0,2.4,e);const a=i*1.7;draw(BOX,{p:[-7.5+Math.cos(a)*ph*26,2+ph*16-ph*ph*14,-1.2+Math.sin(a)*ph*26],r:[i,i*2,0],s:[.7,.4,.5],c:[.2,.18,.18]});}}}
function sCloudWide(t){const k=ease(ss(0,3.5,t));env({...DAY,sky:[.62,.6,.6],fog:[.8,.78,.76],eye:[lerp(60,70,k),lerp(30,36,k),lerp(55,62,k)],tgt:[-8,14,0],fov:46,desat:.25});harbour({ruin:1});
 const H=22+t*1.2;for(let i=0;i<26;i++){draw(SPHL,{p:[-7.5+Math.sin(i*2)*2,2+i/26*H,-1.2+Math.cos(i*3)*2],s:[3.2,3,3.2],c:[.4,.37,.36],id:9});}
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2;draw(SPHL,{p:[-7.5+Math.cos(a)*10,H+2,-1.2+Math.sin(a)*10],s:[6,4,6],c:[.45,.42,.4],id:9});}draw(SPHL,{p:[-7.5,H+4,-1.2],s:[10,6,10],c:[.48,.45,.43],id:9});
 for(let i=0;i<8;i++)smoke(-30+i*3,hf(-30+i*3,-10+i*6)+1,-10+i*6,t+i,1,{c:[.35,.33,.33]});}
function sWave(t){const sh=t<2.2?0:1;const lt=sh?t-2.2:t;
 if(!sh){const wx=lerp(-1,-14,ss(0,2.2,lt));env({...DAY,sky:[.62,.6,.6],fog:[.8,.78,.76],eye:[-26,9,18],tgt:[-12,2,0],fov:44});harbour({ruin:1});
  draw(BOX,{p:[wx,1.2,0],r:[0,0,.25],s:[3,5*(1-ss(1.6,2.2,lt)*.6),70],c:[.6,.8,.92]});draw(BOX,{p:[wx-1.3,3,0],s:[1,1,70],c:[.95,.98,1],a:.85});
  for(let i=0;i<10;i++)draw(SPHL,{p:[wx-1.6,3.3+Math.sin(i*3+t*6)*.4,-30+i*6.5],s:[1.4,.8,1.4],c:[.97,.99,1]});}
 else{env({...DAY,sky:[.62,.6,.6],fog:[.8,.78,.76],eye:[-14,56,40],tgt:[-31,0,-12],fov:46});harbour({ruin:1});
  const u=ss(0,2.4,lt);const ax=lerp(-7.5,-7.5-38,u),az=lerp(-1.2,-8,u),ay=2+Math.sin(u*Math.PI)*26;const AP={...xf([ax,ay,az],[u*12,u*5,0],3),gold:1};
  draw(CYL,{P:AP,p:[0,-1.2,0],s:[.18,2.4,.18],c:[.35,.35,.38]});draw(TUBE,{P:AP,p:[0,-1.3,0],r:[0,0,Math.PI/2],s:[.9,.2,.9],c:[.35,.35,.38]});draw(BOX,{P:AP,p:[0,1.2,0],s:[1.2,.15,.15],c:[.35,.35,.38]});
  for(let i=1;i<12;i++){const uu=u*i/12;draw(SPHL,{p:[lerp(-7.5,-45.5,uu),2+Math.sin(uu*Math.PI)*26,lerp(-1.2,-8,uu)],s:[.25,.25,.25],c:[1,.75,.3],u:1});}
  if(u>=1)draw(TUBE,{p:[-45.5,hf(-45.5,-8)+.1,-8],s:[1+lt,.2,1+lt],c:[.4,.35,.3],a:.6});
  const v=Math.round(4*ease(ss(.5,2.4,lt))*10)/10;}}
function sToll(t){const k=ease(ss(0,4,t));env({...DAY,sky:[.62,.6,.6],fog:[.8,.78,.76],eye:[lerp(-12,-8,k),14,lerp(36,30,k)],tgt:[-26,4,4],fov:44,desat:.5});harbour({ruin:1});
 for(let i=0;i<6;i++)smoke(-24-i*4,hf(-24-i*4,i*5-10)+.5,i*5-10,t+i*.3,.8,{c:[.4,.38,.38]});
 const P1=xf([-20,hf(-20,8)+5,8],[0,-.6,0],2.2);plaque3D(P1,t<2.3?Math.round(2000*ease(ss(.2,1.8,t))):2000,4,'LIVES LOST');
 if(t>2.4)plaque3D(xf([-30,hf(-30,-6)+6.5,-6],[0,-.45,0],2.2),Math.round(9000*ease(ss(2.5,3.6,t))),4,'INJURED');}
function sEmpty(t){office(t,{eye:[lerp(-.8,-.4,t/1.7),1.4,lerp(1.8,1.5,t/1.7)],tgt:[1.5,.95,.4],glow:.25,cap:1,desat:.5});draw(BOX,{p:[3.4,1.6,0],s:[.12,2.2,6],c:[.55,.55,.6],u:1,id:0});}
function sSnow(t){const k=ease(ss(0,3.4,t));env({...COLD,eye:[lerp(-6,-10,k),lerp(16,20,k),lerp(34,40,k)],tgt:[-24,3,2],fov:46,desat:.25});harbour({ruin:1,snow:ss(0,3,t)*.85,ground:mix3([.52,.66,.4],[.93,.94,.96],ss(0,2.5,t))});
 for(let i=0;i<160;i++){const x=-40+((i*37)%60),z=-20+((i*53)%50);const y=((20-((t*3+i*.7)%20)));draw(SPHL,{p:[x+Math.sin(t+i)*.5,y,z],s:[.12,.12,.12],c:[1,1,1],u:1,id:0});}}
function sArchive(t){env({noSky:1,sky:[.32,.28,.26],gnd:[.18,.15,.13],sunC:[.4,.33,.26],sunD:[-.3,.6,.7],fog:[.1,.09,.08],fogD:.035,eye:[0,1.7,lerp(6.5,5,ease(ss(0,4,t)))],tgt:[0,1.5,0],fov:44,plP:[0,2.5,2],plC:[.7,.52,.3],plR:7});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}}
// ---- timeline ----
const S=[[0,2.6,sGlobe],[2.6,6.6,sHook],[6.6,11.1,sCity],[11.1,14.6,sShips],[14.6,19.1,sCollide],[19.1,21.6,sMB],[21.6,26.6,sCargo],[26.6,31.2,sFire],[31.2,33.9,sDrift],[33.9,39.2,sCrowd],[39.2,43.3,sVince],[43.3,47.4,sRun],[47.4,51.6,sMsg],[51.6,55.4,sBlast],[55.4,59.3,sCloudWide],[59.3,64.8,sWave],[64.8,69.2,sToll],[69.2,71.3,sEmpty],[71.3,75.0,sSnow],[75.0,79.4,sArchive]];
const END=79.4;
const RIB=[[6.8,.3,'6 DEC 1917'],[14.8,.36,'8:45 AM'],[51.7,.42,'9:04 AM'],[71.5,.88,'7 DEC 1917']];
function telegram(T){const t0=47.6;if(T<t0||T>51.6)return;const words=['MUNITIONS','SHIP','ON','FIRE.','MAKING','FOR','PIER','6.','GOODBYE.'];const wt=[47.62,48.2,48.5,48.75,49.41,49.85,50.05,50.3,50.87];
 const a=Math.min(ss(t0,t0+.3,T),1-ss(51.3,51.6,T));cx.save();cx.globalAlpha=a;const X=110,Y=880,w=860,h=330;cx.shadowColor='rgba(0,0,0,.45)';cx.shadowBlur=24;cx.fillStyle=PARCH;rrect(X,Y,w,h,10);cx.fill();cx.shadowColor='transparent';
 cx.strokeStyle='#b8862a';cx.lineWidth=3;rrect(X+12,Y+12,w-24,h-24,6);cx.stroke();cx.fillStyle='#9a6a12';cx.font=`700 30px ${CF}`;cx.textAlign='left';cx.textBaseline='middle';cx.fillText('TELEGRAM · RICHMOND STATION',X+40,Y+52);
 cx.fillStyle=GOLD;cx.fillRect(X+40,Y+78,w-80,3);cx.fillStyle=INK;cx.font=`700 50px 'DejaVu Serif'`;let x=X+40,y=Y+140;words.forEach((wd,i)=>{if(T<wt[i])return;const ww=cx.measureText(wd+' ').width;if(x+ww>X+w-30){x=X+40;y+=72;}cx.fillText(wd,x,y);x+=ww;});cx.restore();}
function overlays(T,fn,lt){
 badge('HALIFAX','CANADA · 1917',LON,LAT,T,ss(2.4,3,T)*(1-ss(74.8,75.2,T)));
 ribbon(T,RIB,['DEC 1917',''],ss(6.6,7.1,T)*(1-ss(74.7,75.1,T)));
 if(fn===sGlobe){tag('HALIFAX · NOVA SCOTIA',W/2,1180,1.3,2.6,T);}
 if(fn===sHook){bigText([['20 MINUTES.',92,PARCH],['A FLOATING BOMB.',80,GOLD]],2.8,6.5,T,420);}
 seal(1,'THE HARBOUR',6.65,T);seal(2,'THE FIRE',26.65,T);seal(3,'THE BLAST',51.65,T);
 if(fn===sCity){tag('HALIFAX HARBOUR',W/2,420,8.0,11,T);}
 if(fn===sShips){tag('WARTIME CONVOYS',W/2,420,11.4,14.5,T);}
 if(fn===sCollide){tag('THE NARROWS',W/2,420,15.2,19,T);if(T>17.2){const p=proj(imoPos(T));tag('IMO',p[0],p[1]-140,17.2,19,T,{pointer:1,size:34});}}
 if(fn===sMB){museum('MONT-BLANC','French cargo ship','Bound for Europe',560,980,19.4,21.5,T,'r');}
 if(fn===sCargo){const items=[['TNT',21.9],['PICRIC ACID',23.0],['FUEL ON DECK',24.0]];items.forEach(([s,t0],i)=>tag(s,W/2,420+i*96,t0,26.5,T,{size:42}));}
 if(fn===sFire){tag('CREW ABANDONS SHIP',W/2,420,28.6,31.1,T);}
 if(fn===sDrift){const p=proj([-halfW(0)+3.5,.5,0]);tag('PIER 6',p[0],p[1]-110,31.5,33.8,T,{pointer:1});}
 if(fn===sVince){museum('VINCE COLEMAN','Train dispatcher','1872–1917',540,1000,39.6,43.2,T,'r');}
 if(fn===sMsg&&lt>2.6){const p=proj([-halfW(30)-3.2,2,lerp(60,52,ss(0,1.5,lt-2.6))]);tag('INCOMING TRAIN',p[0],p[1]-120,50.0,51.5,T,{pointer:1,size:34});}
 telegram(T);
 if(fn===sCloudWide){tag('LARGEST MAN-MADE BLAST',W/2,420,55.7,59.2,T);tag('(BEFORE THE ATOMIC BOMB)',W/2,510,56.3,59.2,T,{size:30,f:MF});}
 if(fn===sWave){if(lt<2.2)tag('TSUNAMI',W/2,420,59.5,61.4,T);else tag('ANCHOR: ~4 KM AWAY',W/2,420,61.8,64.7,T);}
 if(fn===sEmpty){tag('VINCE COLEMAN · 1872–1917',W/2,420,69.3,71.2,T,{size:36});}
 if(fn===sSnow){tag('THE NEXT MORNING',W/2,420,71.6,74.9,T);}
 if(fn===sArchive){archiveCard([['HALIFAX · 1917'],'Every year, Nova Scotia still','sends Boston a Christmas tree','to say thank you.'],75.3,T);outro(77.6,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 if(fn===sBlast&&lt>.25&&lt<.9)flash((1-(lt-.25)/.65)*.95);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
