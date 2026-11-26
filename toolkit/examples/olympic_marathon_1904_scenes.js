// ===== THE 1904 OLYMPIC MARATHON (St. Louis) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
const LON=-90.2,LAT=38.63;
function rnd(s){let x=s;return()=>{x=(x*9301+49297)%233280;return x/233280;};}
function lineC(P,a,b,r,c,o){const d=sub(b,a),L=Math.hypot(...d)||1e-4;draw(CYL,Object.assign({P,p:a,r:[Math.acos(clamp(d[1]/L,-1,1)),Math.atan2(d[0],d[2]),0],s:[r,L,r],c:c||[.15,.12,.1],noShadow:1},o||{}));}
function camPlaque(e,tg,dist,dx,dy,k,val,dig,cap){const f=norm(sub(tg,e));const r=norm(cross(f,[0,1,0]));const u=cross(r,f);const p=[e[0]+f[0]*dist+r[0]*dx+u[0]*dy,e[1]+f[1]*dist+r[1]*dx+u[1]*dy,e[2]+f[2]*dist+r[2]*dx+u[2]*dy];
 const d=sub(e,p);const yaw=Math.atan2(d[0],d[2]);const pit=Math.atan2(d[1],Math.hypot(d[0],d[2]));plaque3D(cxf(xf(p,[0,yaw,0]),xf([0,0,0],[-pit,0,0])),val,dig,cap,k);}
// ---------- environments: hot, hazy summer afternoon ----------
const HOT={sky:[.84,.84,.82],gnd:[.52,.5,.4],sunC:[.9,.8,.62],sunD:[-.4,.8,.35],fog:[.88,.88,.84],fogD:.0028,skyTop:[.36,.58,.88],clouds:.25,toon:.15};
const HT=o=>Object.assign({},HOT,o);
const SPACE={bg:[.04,.07,.13],fog:[.04,.07,.13],fogD:0,sky:[.9,.9,.95],gnd:[.5,.5,.56],sunC:[.55,.52,.48],sunD:[.8,.3,.5],ink:.8,inkFar:50};
const DUSTC=[.82,.72,.56];
// ---------- people ----------
const RUN=i=>({jacket:false,noVneck:1,coat:[[.96,.96,.93],[.93,.9,.84],[.95,.93,.9],[.86,.9,.96]][i%4],shirt:[[.95,.95,.92],[.92,.9,.84],[.95,.93,.9],[.88,.9,.95]][i%4],shortSleeve:1,pants:[[.2,.22,.3],[.3,.26,.22],[.92,.9,.86],[.24,.24,.26]][i%4],hair:HAIRS[i%3],skin:SKINS[i%5==4?2:i%2],seed:10+i,moustache:i%3==1?1:0});
const LORZ={jacket:false,noVneck:1,coat:[.96,.96,.93],shirt:[.95,.95,.92],shortSleeve:1,pants:[.2,.22,.3],hair:HAIRS[1],skin:SKINS[0],seed:31};
const HICKS={jacket:false,noVneck:1,coat:[.97,.96,.92],shirt:[.96,.95,.9],shortSleeve:1,pants:[.18,.18,.22],hair:HAIRS[2],skin:SKINS[0],moustache:1,seed:33};
const CARV={jacket:false,noVneck:1,coat:[.94,.92,.86],shirt:[.94,.92,.86],sleeve:[.94,.92,.86],pants:[.24,.22,.26],hair:HAIRS[1],skin:SKINS[1],moustache:1,seed:35};
const LEN={jacket:false,noVneck:1,coat:[.95,.94,.9],shirt:[.95,.94,.9],shortSleeve:1,pants:[.3,.26,.22],hair:HAIRS[1],skin:SKINS[3],seed:37};
const OFF=i=>({coat:[[.2,.2,.22],[.32,.26,.2],[.24,.26,.32]][i%3],shirt:[.95,.94,.9],tie:[.1,.1,.12],pants:[.22,.2,.2],hat:i%2?'bowler':'flat',hatc:[[.14,.13,.12],[.5,.44,.3]][i%2],moustache:1,hair:HAIRS[(i+1)%3],seed:50+i});
function runner(P,o,t,sp){person(P,Object.assign({},o,{walk:1,phase:t*(sp||9.5),lean:.12,armL:[-.25,0,-.08],elbowL:1.25,armR:[-.25,0,.08],elbowR:1.25}));}
// ---------- props ----------
function wheel(P,r,c){draw(TUBE,{P,r:[0,0,Math.PI/2],s:[r,.07,r],c:[.12,.12,.12]});draw(TUBE,{P,r:[0,0,Math.PI/2],s:[r-.04,.05,r-.04],c:c||[.62,.18,.14]});
 for(let i=0;i<6;i++){const a=i/6*Math.PI;draw(BOX,{P,r:[a,0,0],s:[.03,r*1.9,.03],c:c||[.62,.18,.14],noInk:1});}draw(CYL,{P,r:[0,0,Math.PI/2],s:[.07,.12,.07],c:[.75,.6,.3]});}
function car(P,o){o=o||{};const c=o.c||[.55,.12,.1];const sp=o.spin||0;
 draw(BOX,{P,p:[0,.75,0],s:[1.4,.5,3.0],c,g:.5});draw(BOX,{P,p:[0,.95,1.15],s:[1.3,.45,.7],c:mix3(c,[0,0,0],.2),g:.5});
 for(const z of[-.95,.2]){draw(BOX,{P,p:[0,1.12,z],s:[1.3,.2,.75],c:[.15,.12,.1]});draw(BOX,{P,p:[0,1.45,z-.36],s:[1.3,.6,.12],c:[.15,.12,.1]});}
 for(const sd of[-1,1]){for(const z of[-1.05,1.1])wheel(cxf(P,xf([sd*.78,.48,z],[sp,0,0])),.48,o.wc);draw(BOX,{P,p:[sd*.78,.98,1.1],s:[.3,.06,.9],c:[.1,.1,.1]});draw(BOX,{P,p:[sd*.78,.98,-1.05],s:[.3,.06,.9],c:[.1,.1,.1]});
  draw(CYL,{P,p:[sd*.5,1.15,1.55],r:[Math.PI/2,0,0],s:[.1,.14,.1],c:[.85,.66,.28],g:.8});}
 lineC(P,[.3,1.0,.7],[.3,1.55,.45],.025,[.2,.2,.2]);draw(TUBE,{P,p:[.3,1.57,.43],r:[1.0,0,0],s:[.2,.03,.2],c:[.15,.12,.1]});
 if(o.riders)o.riders.forEach((r,i)=>person(cxf(P,xf([i%2?-.3:.3,.82,i<2?.25:-.9],[0,0,0])),Object.assign({sit:1},r)));
 if(o.hood){draw(BOX,{P,p:[0,1.25,1.25],r:[-.9,0,0],s:[1.3,.04,.6],c});}}
function dust(x,z,t,k,o){o=o||{};k=k||1;const n=o.n||26;for(let i=0;i<n;i++){const ph=(t*(o.sp||.6)+i/n)%1;const a=i*2.39;const r=(.3+ph*1.8)*k;
 draw(SPHL,{p:[x+Math.sin(a)*r*.8+(o.dx||0)*ph,.3+ph*1.4*k+Math.cos(a*1.3)*.2,z-ph*(o.trail||4)*k+Math.cos(a)*r*.6],s:[(.35+ph*.9)*k,(.3+ph*.7)*k,(.35+ph*.9)*k],c:DUSTC,a:Math.min(.8,.42*(o.a||1))*(1-ph)*(o.a||1),u:1,id:0,noShadow:1,noInk:1});}}
function road(len,w){draw(BOX,{p:[0,.01,0],s:[w||7,.04,len],c:[.78,.68,.5],pat:7,patS:1.2});}
function fieldsAround(seed){draw(BOX,{p:[0,-.5,0],s:[500,1,500],c:[.5,.6,.3],pat:1,patS:1.4});const r=rnd(seed||5);
 for(let i=0;i<34;i++){const sd=r()<.5?-1:1;const x=sd*(9+r()*40),z=-80+r()*160;tree(xf([x,0,z]),1.1+r()*.7,[.45,.74,.25],'broad');}
 for(let i=0;i<10;i++){const z=-60+i*13;fence(xf([-5.2,0,z]),12,{c:[.66,.58,.44]});}}
function crowdCheap(cx0,cz,rows,cols,t,o){o=o||{};const C=[[.25,.25,.3],[.5,.3,.25],[.85,.84,.8],[.3,.36,.28],[.6,.5,.38],[.7,.25,.22]];
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=r*cols+c;const x=cx0+c*.62+(r%2)*.3,y=r*.55+.9,z=cz-r*.75;const jump=o.cheer?Math.max(0,Math.sin(t*7+i*1.7))*.12:0;
  draw(SPHL,{p:[x,y+.38+jump,z],s:[.23,.34,.17],c:C[i%6],noInk:1});draw(SPHL,{p:[x,y+.8+jump,z],s:[.14,.16,.14],c:SKINS[i%3],noInk:1});
  if(i%3==0)draw(CYL,{p:[x,y+.92+jump,z],s:[.2,.03,.2],c:i%2?[.85,.8,.6]:[.15,.14,.13],noInk:1});
  if(o.cheer&&i%2==0)draw(SPHL,{p:[x+.2,y+.95+jump,z],r:[0,0,-.3+Math.sin(t*9+i)*.4],s:[.05,.24,.05],c:C[i%6],noInk:1});}}
function stadium(o){o=o||{};draw(BOX,{p:[0,-.5,0],s:[500,1,500],c:[.56,.6,.34],pat:1,patS:1.4});
 draw(CYL,{p:[0,.0,0],s:[34,.04,22],c:[.76,.62,.46],pat:7,patS:1.4});draw(CYL,{p:[0,.03,0],s:[29,.04,17],c:[.44,.62,.3],pat:1,patS:1});
 // grandstand along +z side
 for(let r=0;r<8;r++)draw(BOX,{p:[0,r*.55+.27,25+r*.75],s:[46,.55,1.2],c:[.7,.68,.64],pat:6,patS:2});draw(BOX,{p:[0,6.6,28.6],s:[48,.25,8.5],c:[.5,.28,.22]});
 for(let i=0;i<9;i++)lineC(xf([0,0,0]),[-22+i*5.5,0,24.5],[-22+i*5.5,6.5,24.5],.12,[.9,.88,.82]);draw(BOX,{p:[0,3.3,30],s:[48,6.6,.4],c:[.82,.78,.7],pat:3,patS:1});
 if(!o.noCrowd)crowdCheap(-21,25.2,7,68,TIME,{cheer:o.cheer});
 // finish line + tape posts
 draw(BOX,{p:[0,.06,19.5],s:[.25,.03,5],c:[.97,.97,.95],noInk:1});for(const z of[17.2,21.8])lineC(xf([0,0,0]),[0,0,z],[0,1.6,z],.06,[.9,.9,.88]);
 if(!o.noTape)lineC(xf([0,0,0]),[0,1.25,17.2],[0,1.25,21.8],.02,[.95,.2,.15]);
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2;draw(CYL,{p:[Math.cos(a)*44,0,Math.sin(a)*30-6],s:[.1,7,.1],c:[.9,.88,.82]});}
 for(let i=0;i<10;i++){const x=-40+i*9;const a=Math.sin(TIME*2+i)*.2;draw(BOX,{p:[x,7.2,-36],r:[0,a,0],s:[1.2,.7,.02],c:[[.85,.2,.18],[.95,.95,.92],[.2,.3,.6]][i%3],noInk:1});lineC(xf([0,0,0]),[x-.6,0,-36],[x-.6,7.6,-36],.04,[.85,.85,.82]);}}
function well(P,g){draw(CYL,{P,p:[0,0,0],s:[.8,.85,.8],c:[.62,.58,.52],pat:6,patS:3,gold:g});draw(CYL,{P,p:[0,.84,0],s:[.62,.04,.62],c:[.18,.3,.36],noInk:1});
 for(const sd of[-1,1])draw(BOX,{P,p:[sd*.75,1.25,0],s:[.1,2.5,.1],c:[.45,.32,.2],pat:2,patS:5,gold:g});draw(PRISM,{P,p:[0,2.5,0],s:[2.0,.7,1.2],c:[.5,.3,.2],pat:4,patS:3,gold:g});
 lineC(P,[-.75,1.8,0],[.75,1.8,0],.04,[.4,.3,.2]);lineC(P,[0,1.8,0],[0,1.2,0],.01,[.7,.6,.4]);draw(CYL,{P,p:[0,1.0,0],s:[.16,.22,.16],c:[.5,.36,.22],gold:g});}
// dog
function dogSDF(){return(x,y,z)=>{let d=SD.ell(x,y,z,[0,.48,0],[.15,.16,.38]);d=SD.smin(d,SD.ell(x,y,z,[0,.66,.38],[.12,.12,.14]),.06);d=SD.smin(d,SD.rc(x,y,z,[0,.64,.46],[0,.6,.6],.07,.05),.03);
 for(const sd of[-1,1]){d=SD.smin(d,SD.ell(x,y,z,[sd*.07,.8,.36],[.04,.08,.03]),.02);for(const fz of[-.26,.26])d=SD.smin(d,SD.rc(x,y,z,[sd*.08,.42,fz],[sd*.08,.02,fz+.03],.05,.035),.03);}
 d=SD.smin(d,SD.rc(x,y,z,[0,.55,-.36],[0,.72,-.6],.035,.02),.03);return Math.max(d,-y);};}
function dog(P,t){const m=propMesh('dog',dogSDF(),[-.25,-.02,-.7],[.25,.95,.7],.018);const b=Math.abs(Math.sin(t*12))*.12;const Q=cxf(P,xf([0,b,0],[Math.sin(t*12)*.12,0,0]));draw(m,{P:Q,c:[.42,.32,.22]});
 for(const sd of[-1,1])draw(SPHL,{P:Q,p:[sd*.055,.7,.5],s:[.018,.02,.015],c:[.05,.04,.04],noInk:1});draw(SPHL,{P:Q,p:[0,.6,.61],s:[.03,.025,.02],c:[.08,.06,.06],noInk:1});}
// leafy tree override (canopy without the slope-to-rock grass pattern)
function tree(P,k,c,type){k=k||1;type=type||'broad';const v=Math.abs(Math.round((P.M[12]*7.3+P.M[14]*3.1)))%3;const tc=c||[.4,.66,.24];const key=type+v;const def=treeDef(type,v*3+1);
 const tm=propMesh('trunk'+key,trunkSDF(def),[-2,-.06,-2],[2,def.trunkH+1.8,2],.035);draw(tm,{P,s:[k,k,k],c:[.4,.28,.17],pat:2,patS:7});
 const cm=propMesh('can'+key,canopySDF(def,v*1.7),type==='pine'?[-1.5,.8,-1.5]:[-2.4,1.0,-2.4],type==='pine'?[1.5,4.6,1.5]:[2.4,4.0,2.4],.05);draw(cm,{P,s:[k,k,k],c:tc,pat:6,patS:5});}
// apple tree
function appleTree(P,k,seed){tree(P,k,[.45,.74,.25],'broad');const r=rnd(seed||3);for(let i=0;i<18;i++){const a=r()*Math.PI*2,e=r()*1.2;draw(SPHL,{P,p:[Math.cos(a)*1.7*k*Math.cos(e*.5),2.6*k+Math.sin(e)*1.0*k,Math.sin(a)*1.7*k*Math.cos(e*.5)],s:[.1,.1,.1],c:[.86,.2,.14],noInk:1});}}
// ===================== SCENES =====================
function stars(){for(let i=0;i<80;i++){const a=i*2.39,e=(i*.618)%1;draw(SPHL,{p:[Math.cos(a)*40,(e-.5)*70,-30+Math.sin(a)*10],s:[.08,.08,.08],c:[1,1,1],u:1,id:0});}}
function sGlobe(t){const k=ease(ss(0,2.2,t));env({...SPACE,eye:[0,0,lerp(5.6,3.2,k)],tgt:[0,0,0],fov:40});globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.6,ss(1.1,1.6,t));stars();}
// 1. hook: a trainer hands an exhausted runner a cup
function roadside(){fieldsAround(5);road(220,7);}
function sHook(t){const k=ease(ss(0,3.05,t));env(HT({eye:[lerp(2.6,1.9,k),lerp(1.6,1.55,k),lerp(4.2,3.2,k)],tgt:[.1,1.35,0],fov:40,dof:[3.4,2],shadow:{c:[0,0,0],r:6}}));roadside();
 person(xf([-.35,0,0],[0,.5,0]),Object.assign({},HICKS,{worry:1,head:[.35,.2,0],lean:.25,armL:[-.2,0,-.1],elbowL:.3,armR:[-.2,0,.1],elbowR:.3}));
 const up=ss(.3,1.2,t);person(xf([.85,0,.15],[0,-1.2,0]),Object.assign({},OFF(0),{armR:[-1.35*up-.1,0,.05],elbowR:.25}));
 draw(CYL,{p:[lerp(.95,.32,up),lerp(.95,1.32,up),lerp(.38,.42,up)],s:[.06,.12,.06],c:[.92,.92,.9],gold:1});car(xf([3.2,0,-3.5],[0,-.3,0]),{c:[.2,.24,.3]});}
// 2. stadium swoop
function sStad(t){const k=ease(ss(0,2.2,t));const a=lerp(-.6,-.2,k);env(HT({eye:[Math.sin(a)*70,lerp(38,26,k),Math.cos(a)*-70],tgt:[0,2,6],fov:44,shadow:{c:[0,0,6],r:50}}));stadium({cheer:1});
 for(let i=0;i<10;i++){const x=-6+(i%5)*1.3,z=19+Math.floor(i/5)*1.3;person(xf([x,0,z],[0,Math.PI/2,0]),RUN(i));}}
// 3. the start
function sStart(t){const sh=t<2.2?0:1;const fire=t>3.3;
 if(!sh){const k=ease(ss(0,2.2,t));env(HT({eye:[lerp(10,8.5,k),lerp(1.4,1.6,k),lerp(14.5,16.5,k)],tgt:[-1,1.2,20],fov:42,shadow:{c:[0,0,19],r:10}}));}
 else{const k=ease(ss(2.2,4.1,t));env(HT({eye:[lerp(-6,-7,k),lerp(2.4,2.0,k),lerp(23,22,k)],tgt:[1,1.4,19.5],fov:42,shadow:{c:[0,0,19],r:10}}));}
 stadium({noTape:1});for(let i=0;i<12;i++){const x=-1.2-(Math.floor(i/6))*1.1,z=17.4+(i%6)*.85;const go=ss(3.3,4.1,t);person(xf([x+go*2.2,0,z],[0,Math.PI/2,0]),Object.assign({},RUN(i),go>0?{walk:go,phase:t*9+i,lean:.12*go}:{lean:.15,armL:[.2,0,-.1],elbowL:.6,armR:[-.3,0,.1],elbowR:.8}));}
 const SP=xf([1.8,0,22.6],[0,-Math.PI/2,0]);person(SP,Object.assign({},OFF(1),{armR:[-2.9,0,.15],elbowR:.1}));
 if(fire){const ph=t-3.3;for(let i=0;i<8;i++){const a=i*2.4;draw(SPHL,{p:[1.8+Math.sin(a)*ph*.4,2.45+ph*.5+Math.cos(a)*ph*.3,22.6+.25],s:[.08+ph*.25,.08+ph*.25,.08+ph*.25],c:[.94,.93,.9],a:.6*(1-ph/.9),u:1,id:0,noShadow:1,noInk:1});}}
 if(sh&&t>2.6){const E=[lerp(-6,-7,ease(ss(2.2,4.1,t))),lerp(2.4,2.0,ease(ss(2.2,4.1,t))),lerp(23,22,ease(ss(2.2,4.1,t)))];camPlaque(E,[1,1.4,19.5],6,0,1.5,.8,Math.round(90*ease(ss(2.7,3.4,t))),2,'°F · 32°C');}}
// 4. dust: tracking shot alongside runners with cars
function sDust(t){const z0=t*3.2;const k=ease(ss(0,5.5,t));const E=[lerp(-3.4,-3.0,k),lerp(1.5,2.3,k),z0-lerp(3,5,k)],TG=[.8,1.2,z0+3];env(HT({eye:E,tgt:TG,fov:44,fogD:.01,shadow:{c:[0,0,z0+3],r:12}}));roadside();
 for(let i=0;i<8;i++){const x=-1.8+(i%3)*1.3+Math.sin(i)*.3,z=z0+1+Math.floor(i/3)*1.6+(i%2)*.5;runner(xf([x,0,z]),RUN(i),t+i*.3);}
 const cz=z0+5+Math.sin(t*.7)*1;car(xf([2.4,0,cz]),{spin:t*7,riders:[OFF(0),OFF(1),OFF(2)]});dust(2.9,cz-1.4,t,1.2,{n:30,trail:2.5,a:1.2,dx:3.5});dust(3.2,cz-4,t+.5,1.4,{n:16,trail:2,a:.6,dx:4});
 if(t>.25&&t<3.2)camPlaque(E,TG,6,0,1.5,.8,Math.round(32*ease(ss(.4,1.3,t))),2,'RUNNERS');}
// 5. course map with one water stop
const COURSE=(()=>{const L=[];for(let i=0;i<=120;i++){const u=i/120;const a=u*Math.PI*2;L.push([(Math.sin(a)*26+Math.sin(a*3)*5)*.6,(-Math.cos(a)*34+Math.sin(a*2)*6)*.6+4]);}return L;})();
function courseHF(x,z){return .8*Math.sin(x*.12+1)*Math.cos(z*.1)+.5*Math.sin(x*.3+z*.2);}
let GK='';function sMap(t){if(GK!=='C'){setGrid(-70,70,-90,60,courseHF);GK='C';}const k=ease(ss(0,4.6,t));env(HT({eye:[lerp(4,0,k),lerp(98,86,k),lerp(42,36,k)],tgt:[0,0,2],fov:40,fogD:.0006,shadow:{c:[0,0,2],r:50}}));
 draw(GRID,{c:[.62,.64,.34],pat:1,patS:2.5});const r=rnd(9);for(let i=0;i<70;i++){const x=-70+r()*140,z=-90+r()*150;if(Math.abs(x)<24&&z>-22&&z<30)continue;tree(xf([x,courseHF(x,z)-.2,z]),2+r(),[.45,.74,.25],'broad');}
 const f=ss(0,2.2,t);const n=Math.floor(f*120);for(let i=1;i<=n;i++){const a=COURSE[i-1],b=COURSE[i];lineC(xf([0,0,0]),[a[0],courseHF(a[0],a[1])+.6,a[1]],[b[0],courseHF(b[0],b[1])+.6,b[1]],.85,[.95,.84,.6],{noInk:1});draw(SPHL,{p:[b[0],courseHF(b[0],b[1])+.6,b[1]],s:[.85,.85,.85],c:[.95,.84,.6],noInk:1,noShadow:1});}
 {const c0=COURSE[0];draw(CYL,{p:[c0[0],.6,c0[1]-3],s:[4,1.2,3],c:[.82,.78,.7]});draw(CYL,{p:[c0[0],1.25,c0[1]-3],s:[3.2,.1,2.2],c:[.44,.62,.3]});}
 for(let m=1;m<25;m++){const i=Math.round(m/24.85*120);if(i>n)break;const p=COURSE[i];draw(CYL,{p:[p[0],courseHF(p[0],p[1])+.6,p[1]],s:[.5,1.2,.5],c:[.95,.94,.9],noInk:1});}
 const wi=Math.round(12/24.85*120),wp=COURSE[wi];if(n>=wi){const q=ease(ss(2.2,2.8,t));well(cxf(xf([wp[0],courseHF(wp[0],wp[1])+.4,wp[1]]),xf([0,0,0],[0,0,0],3.4*q)),1);draw(SPH,{p:[wp[0],12+Math.sin(t*3)*.5,wp[1]],s:[1.6*q,2.1*q,1.6*q],c:[.3,.6,1],gold:0});draw(CONE,{p:[wp[0],13.6+Math.sin(t*3)*.5,wp[1]],s:[1.35*q,1.6*q,1.35*q],c:[.3,.6,1]});}}
// 6. the well
function sWell(t){const k=ease(ss(0,2.9,t));env(HT({eye:[lerp(3.2,2.6,k),lerp(2.0,1.8,k),lerp(5.4,4.6,k)],tgt:[-1.1,1.3,0],fov:42,dof:[4.4,2.5],shadow:{c:[0,0,0],r:6}}));fieldsAround(7);road(220,7);
 well(xf([-2.2,0,0]),0);person(xf([-1.25,0,.35],[0,-1.4,0]),Object.assign({},RUN(2),{armR:[-1.3,0,.25],elbowR:1.5,head:[-.1,0,0],lean:.1}));draw(CYL,{p:[-1.42,1.48,.47],s:[.12,.14,.12],c:[.5,.36,.22]});
 for(let i=0;i<2;i++)runner(xf([-.2+i*1.1,0,-9+t*3+i*1.5]),RUN(i+4),t+i);}
// 7. Lorz: cramp, then the car
function sLorz(t){const sh=t<2.55?0:1;const lt=sh?t-2.55:t;
 if(!sh){const z0=t*2.2*(1-ss(1.2,2.0,t))+2.2*ss(1.2,2.0,t)*1.2;const k=ease(ss(0,2.55,t));env(HT({eye:[lerp(-3.4,-3.0,k),1.6,z0+lerp(3.2,2.4,k)],tgt:[0,1.2,z0],fov:42,dof:[3.6,2],shadow:{c:[0,0,z0],r:8}}));roadside();
  const cr=ss(1.0,1.6,t);person(cxf(xf([0,0,z0],[0,0,0]),xf([0,0,0]),{gold:1}),Object.assign({},LORZ,cr>0?{worry:1,lean:.35*cr,armR:[-.6,0,.3],elbowR:1.6,armL:[-.2,0,-.1],elbowL:.4,walk:1-cr,phase:t*9}:{walk:1,phase:t*9,lean:.12,armL:[-.25,0,-.08],elbowL:1.25,armR:[-.25,0,.08],elbowR:1.25}));return;}
 const k=ease(ss(0,2.45,lt));env(HT({eye:[lerp(-6,-5,k),lerp(2.4,2.0,k),lerp(-4,-3,k)],tgt:[0,1.1,2],fov:42,shadow:{c:[0,0,2],r:10}}));roadside();
 const cz=lerp(-8,1.8,ease(ss(0,1.1,lt)))+ss(1.6,2.45,lt)*4;car(xf([1.2,0,cz]),{spin:cz*2,c:[.2,.3,.22],riders:[OFF(1)]});if(lt<1.2)dust(1.2,cz-1.6,lt,.9,{n:18,trail:4});
 const hop=ss(1.05,1.55,lt);if(hop<1)person(cxf(xf([lerp(-.2,.9,hop),hop*.8,lerp(2.4,2.0,hop)],[0,lerp(Math.PI,Math.PI/2,hop),0]),xf([0,0,0]),{gold:1}),Object.assign({},LORZ,{lean:.2,armR:[-1.2*hop,0,.2],elbowR:.4}));
 else person(cxf(xf([1.5,.82,cz-.9],[0,0,0]),xf([0,0,0]),{gold:1}),Object.assign({},LORZ,{sit:1,armL:[-1.8,0,-.3],elbowL:.3}));}
// 8. Carvajal plinth
function plinth(fig,t,o){o=o||{};const a=(o.a0||.6)+t*.18;env({noSky:1,sky:[.6,.57,.54],gnd:[.3,.27,.24],sunC:[.5,.47,.42],sunD:[-.3,.8,.6],fog:[.16,.15,.17],fogD:.016,eye:[Math.sin(a)*o.r,o.h,Math.cos(a)*o.r],tgt:[0,o.ty,0],fov:40,dof:[Math.hypot(o.r,o.h-o.ty),o.r*.4],plP:[1.5,5,3],plC:[.9,.78,.55],plR:14,desat:.2});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.42,.3,.24],pat:2,patS:1.2,g:.3});for(let i=-3;i<=3;i++)draw(BOX,{p:[i*4,3,-9],s:[3.6,6,.3],c:[.42,.24,.22],pat:6,patS:1});draw(BOX,{p:[0,6.2,-9],s:[30,.3,.5],c:[.6,.46,.22]});
 for(let i=0;i<30;i++){const b=i*2.39;draw(SPHL,{p:[Math.cos(b)*8,3+((i*.618)%1)*4,-8.6],s:[.03,.03,.03],c:[1,.95,.8],u:1,id:0,noShadow:1,noInk:1});}
 const pr=o.pr||1.4,ph=o.ph||1;draw(CYL,{p:[0,0,0],s:[pr,ph,pr],c:[.78,.74,.68],pat:6,patS:3,g:.3});draw(CYL,{p:[0,ph,0],s:[pr*1.1,.12,pr*1.1],c:[.86,.82,.76],pat:6,patS:3,g:.3});draw(CYL,{p:[0,0,0],s:[pr*1.12,.1,pr*1.12],c:[.62,.58,.52]});
 fig(cxf(xf([0,ph+.12,0],[0,-t*.35,0]),xf([0,0,0]),{gold:1}));}
function sCarvP(t){plinth(P=>person(P,Object.assign({},CARV,{armR:[-.3,0,.12],elbowR:.4})),t,{r:3.6,h:2.3,ty:1.95,pr:.9,ph:.9});}
// 9. the orchard
function orchard(){draw(BOX,{p:[0,-.5,0],s:[300,1,300],c:[.52,.62,.3],pat:1,patS:1.3});road(220,6);draw(BOX,{p:[0,0,0],s:[1,1,1],c:[0,0,0],a:0,u:1});
 for(let i=0;i<4;i++)for(let j=0;j<5;j++)appleTree(xf([-7-i*4.5,0,-12+j*5+(i%2)*2]),1,i*7+j);fence(xf([-4.6,0,-2],[0,Math.PI/2,0]),26,{c:[.66,.58,.44]});}
function sOrch(t){const SPL=3.55;const sh=t<SPL?0:1;
 if(!sh){const k=ease(ss(0,SPL,t));env(HT({eye:[lerp(-3.2,-4.0,k),lerp(1.7,1.6,k),lerp(4.6,3.8,k)],tgt:[-7,1.6,lerp(-1.5,-.8,k)],fov:42,dof:[5,3],shadow:{c:[-7,0,-1],r:8}}));orchard();
  const pick=ss(1.6,2.2,t),eat=ss(2.4,2.8,t);person(cxf(xf([-6.0,0,-.3],[0,-Math.PI/2+.4,0]),xf([0,0,0]),{gold:1}),Object.assign({},CARV,{armR:eat>0?[-1.3,0,.45]:[-2.6*pick,0,.2],elbowR:eat>0?2.0:.2}));
  if(pick>.9)draw(SPHL,{p:eat>0?[-6.0+.12,1.56,-.18]:[-6.0+.05,2.3,-.5],s:[.08,.08,.08],c:[.86,.2,.14],noInk:1});
  else draw(SPHL,{p:[-6.0+.05,2.32,-.5],s:[.1,.1,.1],c:[.86,.2,.14],noInk:1});return;}
 const lt=t-SPL;const k=ease(ss(0,2.4,lt));env(HT({eye:[lerp(-4.5,-5,k),lerp(3.2,2.8,k),lerp(2.8,2.2,k)],tgt:[-7.4,.4,-1.2],fov:42,dof:[4,2.5],shadow:{c:[-7,0,-1],r:8}}));orchard();
 person(cxf(xf([-7.4,.12,-1.2],[-Math.PI/2+.05,0,0]),xf([0,0,0]),{gold:1}),Object.assign({},CARV,{head:[.2,.3,0]}));
 for(let i=0;i<3;i++){const ph=(lt*.6+i/3)%1;draw(SPHL,{p:[-7.2+ph*.4,1.2+ph*.8,-1.6-ph*.6],s:[.05+ph*.06,.05+ph*.06,.02],c:[1,1,1],a:1-ph,u:1,noShadow:1,noInk:1});}
 if(lt>.2){const E=[lerp(-4.5,-5,k),lerp(3.2,2.8,k),lerp(2.8,2.2,k)];camPlaque(E,[-7.4,.4,-1.2],3.4,0,.75,.45,Math.round(4*ease(ss(.3,.8,lt))),1,'PLACE');}}
// 10. the dog
function sDog(t){const z0=t*3.8;const k=ease(ss(0,3.55,t));env(HT({eye:[lerp(.8,1.4,k),lerp(1.6,1.8,k),z0+lerp(-4.2,-3.0,k)],tgt:[-6,1.0,z0+.7],fov:44,shadow:{c:[-6,0,z0+1],r:10}}));draw(BOX,{p:[0,-.5,0],s:[400,1,400],c:[.62,.64,.32],pat:1,patS:1.3});
 road(400,6);const r=rnd(4);for(let i=0;i<40;i++){const x=-14-r()*40,z=-30+r()*120;tree(xf([x,0,z]),1+r()*.6,[.45,.74,.25],'broad');}for(let i=0;i<10;i++)fence(xf([4,0,-20+i*12],[0,Math.PI/2,0]),11,{c:[.66,.58,.44]});
 runner(cxf(xf([-6.2,0,z0+1.6],[0,-.15,0]),xf([0,0,0]),{gold:1}),Object.assign({},LEN,{worry:1,head:[0,-.6,0]}),t,12);dog(xf([-5.9,0,z0-.2+Math.sin(t*2)*.3],[0,-.1,0]),t);}
// 11. broken car
function sBroke(t){const k=ease(ss(0,2.3,t));env(HT({eye:[lerp(3.4,2.4,k),lerp(1.9,1.7,k),lerp(7.2,6.4,k)],tgt:[0,1.0,0],fov:42,dof:[5,3],shadow:{c:[0,0,0],r:8}}));roadside();
 car(xf([1.3,-.04,0],[0,0,.04]),{c:[.2,.3,.22],hood:1,riders:[OFF(1)]});for(let i=0;i<14;i++){const ph=(t*.7+i/14)%1;draw(SPHL,{p:[1.3+Math.sin(i)*.3*ph,1.4+ph*2.2,1.3+Math.cos(i*1.7)*.3*ph],s:[.15+ph*.4,.15+ph*.4,.15+ph*.4],c:[.95,.95,.95],a:.55*(1-ph),u:1,noShadow:1,noInk:1});}
 const go=ss(.6,1.2,t);person(cxf(xf([lerp(.5,-.4,go),0,lerp(-.4,.2+(t-1)*1.6*go,go)],[0,lerp(-1.2,0,go),0]),xf([0,0,0]),{gold:1}),Object.assign({},LORZ,{walk:go,phase:t*8,lean:.08}));}
// 12. the crowd cheers Lorz
function sCheer(t){const k=ease(ss(0,3.9,t));const lx=lerp(-5,1.2,ss(.2,2.4,t));env(HT({eye:[lerp(9,6,k),lerp(1.7,1.6,k),lerp(10,11.5,k)],tgt:[lx*.7,1.7,20.5],fov:44,bloom:1,shadow:{c:[0,0,20],r:12}}));stadium({cheer:1,noTape:t>2.4});
 const P=xf([lx,0,19.5],[0,Math.PI/2,0]);if(t<2.4)runner(cxf(P,xf([0,0,0]),{gold:1}),LORZ,t,8);else person(cxf(P,xf([0,0,0]),{gold:1}),Object.assign({},LORZ,{armL:[-2.8,0,-.2],elbowL:.2,armR:[-2.8,0,.2],elbowR:.2}));
 for(let i=0;i<5;i++)person(xf([4+i*.9,0,23.2],[0,Math.PI+.3,0]),Object.assign({},OFF(i),{armR:[-2.7+Math.sin(t*8+i)*.3,0,.2],elbowR:.3}));
 if(t>2.5)for(let i=0;i<40;i++){const ph=(t-2.5)*.5;const a=i*2.39;draw(BOX,{p:[lx+Math.cos(a)*(1+i%5)*.6,4-((ph+i*.07)%1)*4,19.5+Math.sin(a)*(1+i%4)*.6],r:[t*3+i,i,0],s:[.08,.08,.01],c:[[1,.8,.3],[.95,.95,.95],[.85,.25,.2]][i%3],noInk:1,noShadow:1});}}
// 13. someone speaks up
function sTruth(t){const k=ease(ss(0,1.8,t));env(HT({eye:[lerp(-1.6,-1.2,k),lerp(2.2,2.1,k),lerp(16.6,17.0,k)],tgt:[2.2,1.7,22.4],fov:42,dof:[5.5,3],desat:.25,shadow:{c:[2,0,22],r:8}}));stadium({noTape:1});
 const pt=ss(.2,.5,t);person(cxf(xf([1.6,0,22.8],[0,Math.PI+.6,0]),xf([0,0,0]),{gold:1}),Object.assign({},OFF(2),{armR:[-1.55*pt,0,.15],elbowR:.05}));
 person(xf([2.7,0,23.1],[0,Math.PI,0]),Object.assign({},OFF(3),{head:[0,.5,0]}));person(xf([3.6,0,23.0],[0,Math.PI-.2,0]),Object.assign({},OFF(4),{worry:1}));
 person(xf([1.2,0,19.6],[0,Math.PI/2+.4,0]),Object.assign({},LORZ,{worry:1,head:[0,.5,0]}));}
// 14. Hicks staggers
function sHicks(t){const z0=t*1.2;/*faces +z*/const k=ease(ss(0,3.65,t));env(HT({eye:[lerp(-2.6,-2.2,k),lerp(1.6,1.5,k),z0+lerp(3.6,2.8,k)],tgt:[0,1.25,z0],fov:42,dof:[3.6,2.2],shadow:{c:[0,0,z0],r:8}}));roadside();
 const sway=Math.sin(t*2.6)*.18;person(cxf(xf([sway,0,z0],[0,sway,sway*.4]),xf([0,0,0]),{gold:1}),Object.assign({},HICKS,{walk:.6,phase:t*5.2,lean:.25,worry:1,head:[.3,0,sway],armL:[-.05,0,-.15],elbowL:.2,armR:[-.05,0,.15],elbowR:.2}));}
// 15. the dose from the car
function sDose(t){const z0=t*1.2;const k=ease(ss(0,5.45,t));const E=[lerp(-4.6,-3.8,k),lerp(1.9,2.3,k),z0+lerp(1.5,-.5,k)],TG=[.8,1.3,z0+.6];env(HT({eye:E,tgt:TG,fov:42,dof:[5,3],shadow:{c:[0,0,z0],r:9}}));roadside();
 const sway=Math.sin(t*2.6)*.12;const hand=ss(.5,1.3,t)*(1-ss(3.6,4.2,t));
 person(cxf(xf([sway,0,z0],[0,sway*.6,sway*.4]),xf([0,0,0]),{gold:1}),Object.assign({},HICKS,{walk:.6,phase:t*5.2,lean:.22,worry:1,armR:[-1.2*hand,0,.3],elbowR:1.2*hand+.2}));
 car(xf([1.9,0,z0-.6]),{spin:z0*2,c:[.22,.2,.3],riders:[OFF(0),OFF(2)]});
 draw(CYL,{p:[lerp(1.45,.5,hand),1.55,z0-.3+hand*.5],s:[.05,.1,.05],c:[.92,.92,.88],gold:1});}
// 16. carried over the line
function sCarry(t){const k=ease(ss(0,2.3,t));const x=lerp(-4,.8,ss(0,2.3,t));env(HT({eye:[lerp(6,5,k),lerp(2.0,1.8,k),lerp(15,15.8,k)],tgt:[x,1.3,19.5],fov:42,shadow:{c:[0,0,19.5],r:10}}));stadium({cheer:1,noTape:x>0});
 const P=xf([x,0,19.5],[0,Math.PI/2,0]);person(cxf(P,xf([0,.05,0]),{gold:1}),Object.assign({},HICKS,{walk:.5,phase:t*6,lean:.3,worry:1,head:[.3,0,.2],armL:[-.3,0,-1.2],elbowL:.1,armR:[-.3,0,1.2],elbowR:.1}));
 for(const sd of[-1,1])person(cxf(P,xf([0,0,sd*.62])),Object.assign({},OFF(sd>0?0:2),{walk:1,phase:t*6+(sd>0?Math.PI:0),armL:sd>0?[-.6,0,-.6]:[0,0,0],armR:sd<0?[-.6,0,.6]:[0,0,0]}));}
// 17. gold + doctors
function sGold(t){plinth(P=>{person(P,Object.assign({},HICKS,{worry:1}));draw(CYL,{P,p:[0,1.12,.15],r:[Math.PI/2,0,0],s:[.065,.015,.065],c:[1,.78,.25],g:.9});lineC(P,[-.08,1.45,.1],[0,1.14,.15],.012,[.2,.3,.7]);lineC(P,[.08,1.45,.1],[0,1.14,.15],.012,[.2,.3,.7]);},t,{r:3.4,h:2.2,ty:1.85,pr:.9,ph:.9,a0:.3});}
function sDocs(t){const k=ease(ss(0,3.0,t));const E=[lerp(3.4,2.8,k),lerp(2.6,2.4,k),lerp(4.4,3.6,k)],TG=[0,.8,0];env({noSky:1,sky:[.74,.7,.64],gnd:[.46,.4,.34],sunC:[.66,.6,.52],sunD:[-.3,.8,.4],fog:[.4,.36,.3],fogD:.02,eye:E,tgt:TG,fov:44,plP:[0,3,1],plC:[.7,.6,.45],plR:8,shadow:{c:[0,0,0],r:5}});
 draw(BOX,{p:[0,-.05,0],s:[12,.1,12],c:[.55,.42,.3],pat:2,patS:2});draw(BOX,{p:[0,2,-3],s:[12,4,.2],c:[.78,.74,.66],pat:6,patS:2});draw(BOX,{p:[-3,2,0],s:[.2,4,12],c:[.75,.7,.62],pat:6,patS:2});
 draw(BOX,{p:[0,.45,0],s:[.9,.12,2.2],c:[.9,.88,.82]});for(const sx of[-.4,.4])for(const sz of[-1,1])draw(BOX,{p:[sx,.2,sz],s:[.06,.4,.06],c:[.4,.3,.2]});
 person(cxf(xf([0,.62,1.0],[-Math.PI/2+.1,0,0]),xf([0,0,0]),{gold:1}),Object.assign({},HICKS,{worry:1}));
 [[-1.0,.3,1.3],[1.0,.3,-1.4],[-1.0,-.8,1.6],[1.0,-.8,-1.7]].forEach(([x,z,ry],i)=>person(xf([x,0,z],[0,ry,0]),Object.assign({},OFF(i),{hat:'none',armR:[-.45,0,.08],elbowR:1.1,head:[.4,0,0]})));
 if(t>.4)camPlaque(E,TG,3.2,0,.85,.45,Math.round(4*ease(ss(.6,1.4,t))),1,'DOCTORS');}
// archive
function sArchive(t){env({noSky:1,sky:[.42,.38,.34],gnd:[.24,.2,.17],sunC:[.48,.4,.32],sunD:[-.3,.6,.7],fog:[.14,.12,.1],fogD:.03,eye:[lerp(.6,0,ease(ss(0,4,t))),1.95,lerp(5.5,4.4,ease(ss(0,4,t)))],tgt:[0,1.95,0],fov:44,plP:[0,2.5,2],plC:[.8,.6,.35],plR:7,bloom:1});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 draw(BOX,{p:[0,.9,1.2],s:[1.8,.06,.8],c:[.4,.26,.15]});for(const sx of[-.8,.8])draw(BOX,{p:[sx,.45,1.2],s:[.06,.9,.6],c:[.35,.22,.13]});car(cxf(xf([0,.93,1.2],[0,.7+t*.12,0]),xf([0,0,0],[0,0,0],.22),{gold:1}),{c:[.2,.3,.22]});}
// ---------- timeline ----------
const S=[[0,2.4,sGlobe],[2.4,5.45,sHook],[5.45,7.65,sStad],[7.65,11.75,sStart],[11.75,17.25,sDust],[17.25,21.85,sMap],[21.85,24.75,sWell],[24.75,29.75,sLorz],[29.75,32.25,sCarvP],[32.25,38.3,sOrch],[38.3,41.85,sDog],[41.85,44.15,sBroke],[44.15,48.05,sCheer],[48.05,49.85,sTruth],[49.85,53.5,sHicks],[53.5,58.95,sDose],[58.95,61.25,sCarry],[61.25,63.2,sGold],[63.2,66.2,sDocs],[66.2,74.8,sArchive]];
const END=74.8;
const RIB=[[7.8,0,'START · 3 PM'],[17.4,.48,'MILE 12'],[24.8,.36,'MILE 9'],[41.9,.77,'MILE 19'],[44.2,1,'FINISH'],[49.9,.88,'FINAL MILES'],[59.0,1,'FINISH']];
function overlays(T,fn,lt){
 badge('ST. LOUIS, USA','30 AUG 1904',LON,LAT,T,ss(2.2,2.8,T)*(1-ss(66.0,66.4,T)));
 ribbon(T,RIB,['START','24.85 MILES'],ss(7.7,8.1,T)*(1-ss(65.8,66.2,T)));
 if(fn===sGlobe)bigText([['OLYMPIC',90,PARCH],['MARATHON',90,PARCH],['1904',120,GOLD]],.4,2.35,T,520);
 if(fn===sHook)tag('RAT POISON?!',W/2,420,3.3,5.4,T);
 if(fn===sStad)tag('1904 OLYMPIC GAMES',W/2,420,5.6,7.6,T,{size:36});
 seal(1,'THE RACE',7.75,T);seal(2,'THE CHAOS',24.85,T);seal(3,'THE FINISH',41.95,T);
 if(fn===sDust)tag("OFFICIALS' CARS",W/2,420,14.4,17.1,T);
 if(fn===sMap)tag('ONE WATER STOP',W/2,420,19.4,21.8,T);
 if(fn===sWell)tag('"A STUDY OF THIRST"',W/2,420,22.1,24.6,T,{size:36});
 if(fn===sLorz&&lt<2.55)museum('FRED LORZ','American runner',null,560,1110,25.1,27.2,T,'r');
 if(fn===sLorz&&lt>=2.55)tag('HE TOOK A RIDE',W/2,420,27.6,29.6,T);
 if(fn===sCarvP)museum('FÉLIX CARVAJAL','Cuban mailman',null,560,960,30.0,32.15,T,'r');
 if(fn===sOrch&&lt<3.55)tag('ROTTEN APPLES',W/2,420,34.1,36.4,T);
 if(fn===sDog)tag('CHASED OFF COURSE',W/2,420,38.6,41.7,T,{size:36});
 if(fn===sDog)museum('LEN TAUNYANE','South African runner',null,560,1110,39.0,41.6,T,'r');
 if(fn===sBroke)tag('THE CAR BROKE DOWN',W/2,420,42.0,44.0,T,{size:36});
 if(fn===sCheer)tag('THE "WINNER"',W/2,420,45.4,47.9,T);
 if(fn===sTruth)bigText([['HE RODE',84,PARCH],['IN A CAR!',96,GOLD]],48.3,49.8,T,470);
 if(fn===sHicks)museum('THOMAS HICKS','American runner',null,560,1110,50.3,53.3,T,'r');
 if(fn===sDose)tag('STRYCHNINE = RAT POISON',W/2,420,54.0,58.8,T,{size:34});
 if(fn===sCarry)tag('HALF-CARRIED',W/2,420,59.2,61.1,T);
 if(fn===sGold)tag('OLYMPIC GOLD',W/2,420,61.4,63.1,T);
 if(fn===sArchive){archiveCard([['CAUGHT, THEN FORGIVEN'],'Fred Lorz was banned for life','for his car ride. The ban was','soon lifted, and the next year','he won the Boston Marathon.'],66.5,T);outro(72.6,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 if(fn===sStart&&lt>3.3&&lt<3.5)flash((1-(lt-3.3)/.2)*.35);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
