// ===== THE ARROW STORK (Pfeilstorch, Klütz 1822) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
const LON=11.17,LAT=53.97;
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
const DAY={sky:[.8,.82,.86],gnd:[.5,.48,.42],sunC:[.8,.74,.62],sunD:[-.45,.75,.5],fog:[.82,.88,.94],fogD:.004,skyTop:[.3,.54,.88],clouds:.45,toon:.15};
const D=o=>Object.assign({},DAY,o);
const AUT={sky:[.86,.8,.72],gnd:[.52,.44,.34],sunC:[.92,.76,.56],sunD:[-.6,.5,.5],fog:[.9,.84,.76],fogD:.004,skyTop:[.38,.55,.84],clouds:.55,toon:.15};
const AU=o=>Object.assign({},AUT,o);
const WIN={sky:[.84,.86,.9],gnd:[.7,.72,.76],sunC:[.7,.7,.72],sunD:[-.4,.6,.5],fog:[.86,.89,.93],fogD:.005,skyTop:[.5,.62,.82],clouds:.7,toon:.12};
const WI=o=>Object.assign({},WIN,o);
const AFR={sky:[.86,.84,.78],gnd:[.56,.5,.38],sunC:[.95,.84,.64],sunD:[-.3,.8,.4],fog:[.92,.88,.8],fogD:.003,skyTop:[.32,.56,.9],clouds:.3,toon:.15};
const AF=o=>Object.assign({},AFR,o);
const SPACE={bg:[.04,.07,.13],fog:[.04,.07,.13],fogD:0,sky:[.9,.9,.95],gnd:[.5,.5,.56],sunC:[.55,.52,.48],sunD:[.8,.3,.5],ink:.8,inkFar:50};
// ---------- the stork ----------
const WHITE=[.96,.96,.94],BLACKF=[.09,.09,.1],REDB=[.88,.3,.16];
function storkSDF(){return(x,y,z)=>{let d=SD.ell(x,y,z,[0,.74,0],[.16,.16,.31]);
 d=SD.smin(d,SD.ell(x,y,z,[0,.8,.17],[.12,.13,.14]),.08);
 d=SD.smin(d,SD.rc(x,y,z,[0,.84,.22],[0,1.0,.31],.068,.048),.05);
 d=SD.smin(d,SD.rc(x,y,z,[0,1.0,.31],[0,1.13,.29],.048,.044),.03);
 d=SD.smin(d,SD.ell(x,y,z,[0,1.16,.31],[.052,.058,.07]),.03);
 d=SD.smin(d,SD.ell(x,y,z,[0,.72,-.33],[.11,.045,.12]),.05);return d;};}
function wingSDF(){return(x,y,z)=>SD.rc(x,y*5,z,[.12,0,0],[.9,0,0],.17,.12)*.2;}
function foldSDF(){return(x,y,z)=>SD.ell(x,y,z,[0,0,0],[.045,.085,.2]);}
// o: {gold, fly (0..1 blend), flap (phase), spear, legBend}
function stork(P,o){o=o||{};const g=o.gold||0;const m=propMesh('stork',storkSDF(),[-.2,.5,-.48],[.2,1.25,.42],.012);
 draw(m,{P,c:WHITE,gold:g});
 const FX=Object.assign({},P,{noInk:1});
 // beak
 draw(CONE,{P,p:[0,1.15,.36],r:[Math.PI/2+.12,0,0],s:[.028,.24,.022],c:REDB,gold:g});
 for(const sd of[-1,1]){draw(SPHL,{P:FX,p:[sd*.042,1.18,.33],s:[.013,.013,.013],c:[.05,.04,.04]});draw(SPHL,{P:FX,p:[sd*.046,1.184,.336],s:[.004,.004,.003],c:[1,1,1],u:1});}
 const fly=o.fly||0;
 if(fly<.5){// folded black flight feathers on the back sides
  const fm=propMesh('storkfold',foldSDF(),[-.06,-.1,-.22],[.06,.1,.22],.01);
  for(const sd of[-1,1])draw(fm,{P,p:[sd*.118,.71,-.2],r:[-.18,sd*.06,0],c:BLACKF,gold:g*.25});
  // legs
  const lb=o.legBend||0;for(const sd of[-1,1]){const hip=[sd*.07,.62,0],knee=[sd*.07,.34,-.03-lb*.1],ft=[sd*.07,.02,.02];lineC(P,hip,knee,.016,REDB,{gold:g});lineC(P,knee,ft,.014,REDB,{gold:g});
   for(const a of[-.5,0,.5])lineC(P,ft,[ft[0]+Math.sin(a)*.09,.01,ft[2]+Math.cos(a)*.09],.008,REDB,{noInk:1});}
 }else{// open wings, flapping
  const wm=propMesh('storkwing2',wingSDF(),[-.1,-.06,-.22],[1.06,.06,.22],.011);const fl=Math.sin(o.flap||0)*.45;
  for(const sd of[-1,1]){const W1=cxf(P,xf([sd*.12,.8,.02],[0,0,sd*fl]));const R=sd<0?[0,Math.PI,0]:[0,0,0];
   draw(wm,{P:W1,r:R,s:[.62,1,1],c:WHITE,gold:g});
   const W2=cxf(W1,xf([sd*.5,0,0],[0,0,sd*fl*.6]));draw(wm,{P:W2,r:R,s:[.62,.9,.95],c:BLACKF,gold:g*.25});}
  // legs trailing behind
  for(const sd of[-1,1])lineC(P,[sd*.05,.68,-.2],[sd*.05,.64,-.75],.014,REDB,{gold:g});}
 if(o.spear)spear(cxf(P,xf([0,.98,.3],[0,Math.PI/2+.25,.15])),{gold:o.spearGold===undefined?g:o.spearGold,k:o.spearK||1});}
// spear centred at P, along local +x/-x, total length ~.78
function spear(P,o){o=o||{};const g=o.gold||0,k=o.k||1;lineC(P,[-.48*k,0,0],[.3*k,0,0],.011*k,[.5,.32,.17],{gold:g,pat:2,patS:8});
 draw(CONE,{P,p:[.3*k,0,0],r:[0,0,-Math.PI/2],s:[.026*k,.11*k,.012*k],c:[.36,.36,.38],g:.7,gold:g});
 for(let i=0;i<3;i++)draw(CYL,{P,p:[.28*k-i*.018*k,0,0],r:[0,0,Math.PI/2],s:[.016*k,.012*k,.016*k],c:[.3,.22,.14],noInk:1});}
// swallow (tiny)
function swallow(P,flap,c){const fl=Math.sin(flap)*.6;draw(SPHL,{P,p:[0,0,0],s:[.05,.045,.11],c:c||[.12,.16,.32],noInk:1});draw(SPHL,{P,p:[0,-.01,.04],s:[.035,.03,.04],c:[.85,.5,.35],noInk:1});
 for(const sd of[-1,1]){draw(BOX,{P:cxf(P,xf([sd*.03,0,0],[0,0,sd*fl])),p:[sd*.11,0,0],r:[0,sd*.25,0],s:[.2,.008,.06],c:c||[.12,.16,.32],noInk:1});draw(BOX,{P,p:[sd*.02,0,-.15],r:[0,sd*.35,0],s:[.012,.008,.12],c:c||[.12,.16,.32],noInk:1});}}
function flyPose(pos,vel,bank){const yaw=Math.atan2(vel[0],vel[2]);const pit=-Math.atan2(vel[1],Math.hypot(vel[0],vel[2]));return xf(pos,[pit,yaw,bank||0]);}
function wpt(P,v){const m=P.M;return[m[0]*v[0]+m[4]*v[1]+m[8]*v[2]+m[12],m[1]*v[0]+m[5]*v[1]+m[9]*v[2]+m[13],m[2]*v[0]+m[6]*v[1]+m[10]*v[2]+m[14]];}
// nest
function nestSDF(){return(x,y,z)=>{const r=Math.hypot(x,z);let d=Math.hypot(r-.5,(y-.14)*1.3)-.17;d=SD.smin(d,SD.ell(x,y,z,[0,.08,0],[.55,.1,.55]),.08);return d+(vnoise3(x*14,y*14,z*14)-.5)*.05;};}
function nest(P,k){k=k||1;const m=propMesh('nest',nestSDF(),[-.72,-.05,-.72],[.72,.36,.72],.014);draw(m,{P:cxf(P,xf([0,0,0],[0,0,0],k)),c:[.5,.37,.22],pat:7,patS:6});
 const r=rnd(5);for(let i=0;i<26;i++){const a=r()*6.28,b=a+.6+r()*.8,rr=.45+r()*.25;lineC(P,[Math.cos(a)*rr*k,(.12+r()*.18)*k,Math.sin(a)*rr*k],[Math.cos(b)*(rr+.12)*k,(.1+r()*.2)*k,Math.sin(b)*(rr+.12)*k],.014*k,[.56,.42,.26],{noInk:1});}}
// ---------- terrain ----------
let GK='';
function villHF(x,z){return .35*Math.sin(x*.08)*Math.cos(z*.07)+.25*Math.sin(x*.21+z*.13);}
function village(o){o=o||{};if(GK!=='V'){setGrid(-80,80,-90,70,villHF);GK='V';}draw(GRID,{c:o.grass||[.44,.6,.3],pat:1,patS:1.2});
 const H=[[-6,-2,.2,'plaster',[.94,.9,.8]],[3,-4,-.15,'brick',[.7,.4,.3]],[10,1,.3,'plaster',[.9,.84,.7]],[-14,4,-.2,'wood',[.6,.46,.32]],[-2,-14,.1,'plaster',[.95,.93,.86]],[12,-14,-.3,'brick',[.68,.38,.28]],[-16,-12,.25,'plaster',[.88,.82,.7]]];
 H.forEach(([x,z,r,st,wc],i)=>house(xf([x,groundY(villHF,x,z,5,5),z],[0,r,0]),{w:5,d:5.4,floors:i%3==0?2:1,style:st,wall:wc,roof:[[.62,.28,.2],[.36,.3,.3],[.5,.3,.22]][i%3],door:true}));
 road(-40,8,40,6,3.2,villHF,[.6,.54,.44]);
 fence(xf([-9,0,5]),8,{c:[.62,.52,.4]});lamppost(xf([2,villHF(2,4.2),4.2]));barrel(xf([-3.2,villHF(-3.2,1.6),1.6]));cart(xf([6,villHF(6,4),4],[0,.6,0]));
 const r=rnd(11);for(let i=0;i<22;i++){const a=r()*6.28,d=22+r()*30;const x=Math.cos(a)*d,z=Math.sin(a)*d*.8-6;tree(xf([x,villHF(x,z)-.1,z]),1.1+r()*.6,o.leaf||null,i%3?'broad':'pine');}
 if(!o.leaf)for(let i=0;i<8;i++){const x=-20+i*5.5,z=11+(i%2);bush(xf([x,villHF(x,z),z]),.6,o.leaf||[.3,.52,.24]);}}
// nest position on house 0 ridge (2 floors: h=5.6, rh=1.8)
const NESTP=()=>{const x=-6,z=-2,y=groundY(villHF,x,z,5,5);return [x,y+5.6+1.8+.02,z];};
// ===================== SCENES =====================
function stars(n,R){const r=rnd(3);for(let i=0;i<(n||90);i++){const a=r()*6.28,e=(r()-.3)*1.4;draw(SPHL,{p:[Math.cos(a)*Math.cos(e)*R,Math.sin(e)*R+10,Math.sin(a)*Math.cos(e)*R],s:[.12,.12,.12].map(v=>v*R/60),c:[1,1,1],u:1,id:0,noShadow:1});}}
function sGlobe(t){const k=ease(ss(0,1.6,t));env({...SPACE,eye:[0,0,lerp(5.4,3.0,k)],tgt:[0,0,0],fov:40});globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.2,ss(.7,1.3,t));stars(80,40);}
// 1. landing on the roof with a spear
function sLand(t){const N=NESTP();const f=ss(0,2.3,t);const p=[lerp(N[0]-6,N[0],ease(f)),N[1]+.95+lerp(2.4,0,ease(f)),lerp(N[2]+2,N[2],ease(f))];
 const k=ease(ss(0,3.5,t));const TG=[lerp(p[0],N[0],ease(ss(.4,2.6,t))),lerp(p[1]-.5,N[1]+1.0,ease(ss(.4,2.6,t))),lerp(p[2],N[2],ease(ss(.4,2.6,t)))];
 const E=[lerp(N[0]+3,N[0]+3.4,k),lerp(N[1]+1.6,N[1]+.9,k),lerp(N[2]+7,N[2]+4.4,k)];env(D({eye:E,tgt:TG,fov:42,shadow:{c:[N[0],N[1]-4,N[2]],r:14}}));village();
 nest(xf(N),1.1);
 if(f<1){stork(cxf(flyPose(p,[1,-.35,-.3],.15),xf([0,-.75,0])),{fly:1,flap:t*9,spear:1,gold:1});}
 else{const s=ss(2.3,2.6,t);stork(xf([N[0],N[1]+.2,N[2]],[0,1.3+s*.4,0]),{spear:1,gold:1,legBend:1-s});}}
// 2. the mystery: slow orbit close-up
function sMyst(t){const N=NESTP();const a=.9+t*.16;const E=[N[0]+Math.sin(a)*3.6,N[1]+1.5,N[2]+Math.cos(a)*3.6];env(D({eye:E,tgt:[N[0],N[1]+.95,N[2]],fov:40,dof:[3.6,2.5],desat:.35,shadow:{c:N,r:4}}));village();
 nest(xf(N),1.1);stork(xf([N[0],N[1]+.2,N[2]],[0,1.7+Math.sin(t*.8)*.15,0]),{spear:1,gold:1});}
// 3. autumn: they vanish
function sVanish(t){const k=ease(ss(0,4.7,t));env(AU({eye:[lerp(-1,-4,k),lerp(7,9,k),lerp(20,24,k)],tgt:[lerp(-3,-2,k),lerp(4.5,7.5,k),0],fov:46,shadow:{c:[0,0,0],r:24}}));
 village({grass:[.55,.56,.3],leaf:[.86,.5,.18]});const N=NESTP();nest(xf(N),1.1);
 const r=rnd(21);for(let i=0;i<9;i++){const d=Math.max(0,t-i*.18);const p=[-4+r()*10+d*1.4,1.2+d*(1.6+r()),2+r()*6-d*2.5];const a=1-ss(3.6,4.6,t);if(a<=0)continue;stork(cxf(flyPose(p,[.4,.6,-.8],.1),xf([0,-.75,0],[0,0,0],1)),{fly:1,flap:t*8+i,gold:0});}
 for(let i=0;i<26;i++){const d=Math.max(0,t-.3);const p=[2+(i%7)*.9+d*2,2+Math.floor(i/7)*.5+d*1.8+Math.sin(i)*.3,5-(i%5)*.6-d*2];swallow(flyPose(p,[.6,.5,-.6]),t*20+i);}
 // falling leaves
 for(let i=0;i<40;i++){const fx=(i*.618)%1,fz=(i*.382)%1;const y=8-((i*.73+t*1.2)%8);draw(BOX,{p:[-12+fx*24+Math.sin(t*2+i)*.4,y,-4+fz*16],r:[t*3+i,i,t*2],s:[.14,.01,.1],c:[.9,.5+.2*(i%3)*.1,.15],noInk:1,noShadow:1});}}
// 4. Aristotle exhibit
function plinth(fig,t,o){o=o||{};const a=(o.a0||.6)+t*.18;env({noSky:1,sky:[.62,.58,.54],gnd:[.32,.28,.24],sunC:[.55,.5,.44],sunD:[-.3,.8,.6],fog:[.2,.18,.2],fogD:.014,eye:[Math.sin(a)*o.r,o.h,Math.cos(a)*o.r],tgt:[0,o.ty,0],fov:40,dof:[Math.hypot(o.r,o.h-o.ty),o.r*.4],plP:[1.5,5,3],plC:[.95,.82,.58],plR:14,desat:.15});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.62,.58,.52],pat:6,patS:1.5,g:.3});// marble floor
 for(let i=-3;i<=3;i++){draw(CYL,{p:[i*3.2,0,-8],s:[.45,7,.45],c:[.86,.84,.78],pat:6,patS:2});draw(BOX,{p:[i*3.2,7,-8],s:[1.2,.3,1.2],c:[.8,.78,.72]});}
 draw(BOX,{p:[0,3.5,-9.5],s:[30,9,.3],c:[.38,.32,.46],pat:6,patS:1});
 const pr=o.pr||1.4,ph=o.ph||1;draw(CYL,{p:[0,0,0],s:[pr,ph,pr],c:[.86,.83,.78],pat:6,patS:3,g:.3});draw(CYL,{p:[0,ph,0],s:[pr*1.1,.12,pr*1.1],c:[.92,.9,.86],pat:6,patS:3,g:.3});draw(CYL,{p:[0,0,0],s:[pr*1.12,.1,pr*1.12],c:[.7,.66,.6]});
 fig(cxf(xf([0,ph+.12,0],[0,-t*.3,0]),xf([0,0,0]),{gold:o.gold||1}),t);}
const ARI={coat:[.82,.84,.9],shirt:[.82,.84,.9],sleeve:[.82,.84,.9],pants:[.82,.84,.9],longcoat:1,noVneck:1,jacket:false,shoes:[.45,.32,.2],hair:[.82,.8,.76],beard:1,moustache:1,seed:31};
function sAri(t){plinth((P,tt)=>{person(P,Object.assign({},ARI,{armR:[-1.25,0,.3],elbowR:.9,head:[.15,.25,0]}));
  const m=ss(1.4,2.6,tt);const BP=cxf(P,xf([.36,1.5,.42]));// small bird morphing on his hand
  draw(SPH,{P:BP,p:[0,.06,0],s:[.07,.065,.1],c:mix3([.5,.45,.42],[.48,.42,.34],m),gold:1});draw(SPH,{P:BP,p:[0,.05,.05],s:[.055,.05,.05],c:mix3([.25,.22,.22],[.92,.48,.2],m),noInk:1});
  draw(BOX,{P:BP,p:[0,.06,-.13],r:[.3,0,0],s:[.04,.012,.1],c:mix3([.9,.42,.15],[.42,.36,.3],m),noInk:1});draw(SPH,{P:BP,p:[0,.12,.07],s:[.04,.04,.04],c:[.45,.4,.36]});
  for(let i=0;i<10;i++){const a=i*.63+tt*2;const q=Math.sin(Math.PI*clamp((tt-1.3)/1.5,0,1));draw(SPHL,{P:BP,p:[Math.cos(a)*.16,.08+Math.sin(a*1.3)*.1,Math.sin(a)*.16],s:[.012*q,.012*q,.012*q],c:[1,.85,.4],u:1,noShadow:1,noInk:1});}
 },t,{r:3.4,h:2.1,ty:1.85,pr:.8,ph:.8,a0:.3,gold:.22});}
// 5. myth: asleep under the lake (cutaway diorama)
function sLake(t){const k=ease(ss(0,4.0,t));env(WI({eye:[lerp(-.8,.8,k),lerp(-.3,-.1,k),lerp(10.5,9.6,k)],tgt:[0,-.6,0],fov:42,shadow:{c:[0,0,0],r:8},clouds:.8}));
 draw(BOX,{p:[0,-60,0],s:[300,1,300],c:[.82,.84,.88],noShadow:1});
 draw(BOX,{p:[-4.4,-.9,0],s:[4.4,2.8,3],c:[.56,.42,.28],pat:7,patS:1});draw(BOX,{p:[4.4,-.9,0],s:[4.4,2.8,3],c:[.56,.42,.28],pat:7,patS:1});
 draw(BOX,{p:[-4.4,.58,0],s:[4.42,.16,3.02],c:[.95,.96,.98]});draw(BOX,{p:[4.4,.58,0],s:[4.42,.16,3.02],c:[.95,.96,.98]});
 for(const x of[-5.5,-3.6,4,5.8])tree(xf([x,.6,-.6]),.55,[.5,.42,.32],'broad');
 draw(BOX,{p:[0,-2.0,0],s:[4.4,.6,3],c:[.42,.3,.2],pat:7,patS:3});draw(BOX,{p:[0,-1.55,0],s:[4.4,.3,3],c:[.33,.24,.16],pat:7,patS:4});
 for(let i=0;i<8;i++){const x=-1.75+i*.5,z=1.56;const P=xf([x,-1.45+((i*7)%3)*.05,z],[0,i%2?1.4:-1.4,.2]);draw(SPH,{P,s:[.09,.075,.16],c:[.14,.18,.38]});draw(SPH,{P,p:[0,-.01,.09],s:[.06,.05,.06],c:[.88,.52,.36],noInk:1});draw(SPH,{P,p:[0,.03,.13],s:[.05,.05,.05],c:[.14,.18,.38]});
  const zz=ss(.2,1,(t*.5+i*.23)%1);draw(SPHL,{p:[x,-1.25+zz*1.4,z-.05],s:[.03,.03,.03],c:[.9,.97,1],a:.7*(1-zz),u:1,noShadow:1,noInk:1});}
 draw(BOX,{p:[0,-.55,0],s:[4.4,1.9,3],c:[.24,.5,.68],g:.4,noShadow:1});for(let i=0;i<5;i++)draw(BOX,{p:[0,-.2-i*.3,1.505],s:[4.4,.02,.01],c:[.5,.72,.86],noInk:1,noShadow:1});
 draw(BOX,{p:[0,.48,0],s:[4.4,.2,3],c:[.8,.9,.97],g:.8});
 const FP=xf([.9,.58,.3],[0,-.9,0]);person(FP,{coat:[.42,.3,.22],pants:[.3,.26,.22],hat:'flat',hatc:[.3,.24,.18],beard:1,armR:[-.9,0,.3],elbowR:.6,armL:[-.9,0,-.3],elbowL:.6,seed:12});
 const up=ss(.8,3.2,t);draw(BOX,{p:[-.2,.585,.3],s:[.7,.02,.7],c:[.12,.2,.26]});for(let i=0;i<6;i++)lineC(xf([0,0,0]),[-.2+(i-2.5)*.1,1.0,.3],[-.2+(i-2.5)*.12,-.3+up*1.0,.3],.008,[.82,.78,.66],{noInk:1});
 for(let i=0;i<3;i++){const P=xf([-.3+i*.12,-.25+up*1.05,.3+i*.05],[0,i,.3]);draw(SPH,{P,s:[.08,.065,.14],c:[.14,.18,.38]});}
 for(let i=0;i<25;i++){const fx=(i*.618)%1,fz=(i*.382)%1;const y=3.5-((i*.71+t*.6)%3);draw(SPHL,{p:[-4+fx*8,y,-1.5+fz*3.5],s:[.025,.025,.025],c:[1,1,1],u:1,noShadow:1,noInk:1});}}
// 6. 1703: they fly to the Moon
function moonBall(P,k){draw(SPH,{P,s:[k,k,k],c:[.9,.9,.86],pat:6,patS:2/k});const r=rnd(4);for(let i=0;i<14;i++){const th=r()*Math.PI*2,ph=(r()-.5)*2.2;const n=[Math.cos(ph)*Math.sin(th),Math.sin(ph),Math.cos(ph)*Math.cos(th)];if(n[2]<.1)continue;const cs=k*(.08+r()*.14);
 draw(SPH,{P,p:[n[0]*k*.985,n[1]*k*.985,n[2]*k*.985],s:[cs,cs,cs*.25],r:[-Math.asin(n[1]),Math.atan2(n[0],n[2]),0],c:[.72,.72,.7],noInk:1});}}
function sMoon(t){const k=ease(ss(0,4.3,t));env({...SPACE,bg:[.06,.1,.2],fog:[.06,.1,.2],eye:[lerp(-3,0,k),lerp(-1,.5,k),lerp(14,11,k)],tgt:[lerp(1,2.5,k),lerp(2,3,k),-20],fov:44,sunD:[.4,.4,.8],sunC:[.75,.72,.66],sky:[.75,.78,.9],gnd:[.4,.42,.5]});stars(160,70);
 moonBall(xf([6,8,-40],[0,t*.03,0]),7);
 for(let i=0;i<10;i++){const d=t*1.6-i*.6;const p=[-3.2+d*.7+(i%2)*.8,-1.5+d*.75+(i%3)*.4,6-d*2.6];stork(cxf(flyPose(p,[.7,.75,-2.6],.1),xf([0,-.75,0],[0,0,0],1.2)),{fly:1,flap:t*7+i*1.3,gold:i==0?1:0});}
}
// 7. Klütz: the hunter
function coastHF(x,z){const sh=-z-24+3*Math.sin(x*.08);return clamp(sh*-.06,-3,0)+(sh<0?.4*Math.sin(x*.15)*Math.cos(z*.12):0)-(sh>0?Math.min(3,sh*.4):0);}
function coast(){if(GK!=='C'){setGrid(-90,90,-90,60,coastHF);GK='C';}draw(GRID,{c:[.5,.64,.32],pat:1,patS:1.2});draw(BOX,{p:[0,-1.1,-80],s:[500,1,110],c:[.14,.42,.56],pat:5,patS:.3,g:.6,noShadow:1});
 // church + village of Klütz in the distance
 const cz=-30,cxp=-18;draw(BOX,{p:[cxp,3,cz],s:[4,6,9],c:[.72,.42,.3],pat:3,patS:2});draw(BOX,{p:[cxp,8,cz+5.2],s:[3.2,16,3.2],c:[.7,.4,.28],pat:3,patS:2});draw(CONE,{p:[cxp,16,cz+5.2],s:[2.4,7,2.4],c:[.3,.42,.38]});
 for(const sd of[-1,1])draw(BOX,{p:[cxp+sd*1,6+1.2,cz],r:[0,0,sd*-.7],s:[3.2,.16,9.4],c:[.5,.26,.2],pat:4,patS:2});
 [[-16,-12],[0,-18],[-20,-22],[8,-14]].forEach(([x,z],i)=>house(xf([x,groundY(coastHF,x,z,5,5),z],[0,i*.4,0]),{w:5,d:5,floors:1,style:i%2?'brick':'plaster',wall:i%2?[.72,.42,.3]:[.92,.88,.78],roof:[.6,.3,.22]}));
 const r=rnd(31);for(let i=0;i<18;i++){const x=-60+r()*120,z=-8+r()*50;if(Math.abs(x)<8&&z>0&&z<20)continue;tree(xf([x,coastHF(x,z)-.1,z]),1.1+r()*.5,null,i%2?'broad':'pine');}
 grass('cg',coastHF,-10,10,4,18,140,[.4,.58,.26],3);}
const HUN={coat:[.28,.36,.24],shirt:[.92,.9,.84],pants:[.6,.52,.38],hat:'flat',hatc:[.24,.26,.2],longcoat:1,moustache:1,hair:HAIRS[1],shoes:[.2,.14,.1],seed:44};
function sHunt(t){const A=2.2;if(t<A){const k=ease(ss(0,A,t));env(D({eye:[lerp(1.6,1.2,k),lerp(1.5,1.3,k),lerp(14.2,13.6,k)],tgt:[-2.5,3.6,0],fov:46,shadow:{c:[0,0,8],r:14}}));coast();
  const up=ss(.6,1.6,t);const HP=xf([0,coastHF(0,10),10],[0,Math.PI-.25,0]);person(HP,Object.assign({},HUN,{armR:[-1.6*up-.1,0,.2],elbowR:.3,armL:[-1.5*up-.1,0,-.35],elbowL:.5,head:[-.5*up,0,0]}));
  lineC(HP,[.12,1.35-.4*(1-up),.05+.3*up],[.1,1.35+.62*up,.05+1.0*up-.3*(1-up)],.022,[.3,.22,.15]);
  const p=[lerp(-7,4,t/A),7.2,lerp(1,3,t/A)];stork(cxf(flyPose(p,[1,0,.2],.1),xf([0,-.75,0])),{fly:1,flap:t*6,gold:1,spear:1});return;}
 const lt=t-A,k=ease(ss(0,2.2,lt));env(D({eye:[lerp(-2,-2.3,k),lerp(1.9,1.7,k),lerp(6.5,6.0,k)],tgt:[4.6,.9,15],fov:40,shadow:{c:[2,0,13],r:10}}));coast();
 if(lt<.5)for(let i=0;i<8;i++){const ph=lt/.5;draw(SPHL,{p:[0+ph*.4,2.2+ph*.5,10.5],s:[.08+ph*.3,.08+ph*.3,.08+ph*.3],c:[.92,.92,.9],a:.5*(1-ph),u:1,noShadow:1,noInk:1});}
 const HP=xf([0,coastHF(0,10),10],[0,2.6,0]);person(HP,Object.assign({},HUN,{armR:[-1.0,0,.2],elbowR:.4,armL:[-.3,0,-.2],elbowL:.3}));lineC(HP,[.15,1.2,.2],[.15,1.9,.7],.022,[.3,.22,.15]);
 // the stork glides down into the meadow (far)
 const f=ss(0,1.8,lt);const p=[lerp(6.5,5,f),lerp(4.5,.0,ease(f)),lerp(13.5,16,f)];if(f<1)stork(cxf(flyPose(p,[-.3,-.8,.5],.4),xf([0,-.75,0])),{fly:1,flap:lt*3,gold:1,spear:1});
 else stork(xf([5,coastHF(5,16),16],[0,-.8,0]),{gold:1,spear:1});}
// 8. the spear: longer than your arm
const PROF={coat:[.2,.2,.24],shirt:[.95,.94,.9],tie:[.1,.1,.12],pants:[.32,.3,.28],hair:[.7,.68,.64],moustache:1,seed:52};
function room(){draw(BOX,{p:[0,-.5,0],s:[20,1,20],c:[.5,.36,.24],pat:2,patS:1.5});draw(BOX,{p:[0,3,-3],s:[20,7,.2],c:[.84,.78,.62],pat:6,patS:1});
 draw(BOX,{p:[2.6,2,-2.85],s:[1.6,2.2,.08],c:[.95,.95,.9]});draw(BOX,{p:[2.6,2,-2.8],s:[1.4,2,.04],c:[.6,.78,.92]});for(let i=0;i<4;i++)draw(BOX,{p:[-2.4,1.0+i*.55,-2.7],s:[1.8,.06,.5],c:[.45,.3,.18],pat:2});
 for(let i=0;i<12;i++)draw(BOX,{p:[-3.1+i*.13,1.25+Math.floor(i/6)*.55,-2.7],s:[.1,.38,.36],c:[[.5,.2,.15],[.2,.3,.45],[.35,.4,.2]][i%3]});
 draw(BOX,{p:[0,.85,0],s:[2.6,.08,1.3],c:[.45,.3,.18],pat:2,patS:2});for(const sx of[-1.2,1.2])for(const sz of[-.55,.55])draw(BOX,{p:[sx,.42,sz],s:[.08,.84,.08],c:[.38,.25,.15]});}
function sSpear(t){const k=ease(ss(0,3.8,t));env(D({noSky:1,eye:[lerp(1.0,.5,k),lerp(1.8,1.7,k),lerp(4.0,3.5,k)],tgt:[.25,1.3,0],fov:42,dof:[3.6,2],plP:[1,3,2],plC:[.7,.6,.45],plR:8,fog:[.75,.7,.62],fogD:.02,shadow:{c:[0,1,0],r:3}}));room();
 const SP=xf([0,.89,0],[0,1.57+.25,0]);draw(BOX,{P:SP,p:[0,.03,0],s:[.5,.06,.36],c:[.55,.4,.25],pat:2,patS:3});stork(cxf(SP,xf([0,.06,0])),{gold:0,spear:1,spearGold:1});
 // a man holds his arm next to the spear for scale
 const arm=ss(1.4,2.4,t);person(xf([.95,0,.35],[0,-1.2,0]),Object.assign({},PROF,{armR:[-1.45*arm-.1,0,.1+.3*arm],elbowR:.1,head:[.25,-.2,0]}));}
// 9. examining: tropical wood, African spear
function sExam(t){const sh=t<1.7?0:1;const lt=sh?t-1.7:t;const k=ease(ss(0,1.7,lt));
 const SP=xf([0,.95,0],[0,.5,0]);const SPR=cxf(SP,xf([0,.98,.3],[0,Math.PI/2+.25,.15]));const Nk=wpt(SPR,[0,0,0]);const F=wpt(SPR,sh?[.3,0,0]:[-.3,0,0]);
 const d=norm(sub(F,Nk));const fw=[Math.sin(.5),0,Math.cos(.5)];let pp=norm(cross(d,[0,1,0]));if(pp[0]*fw[0]+pp[2]*fw[2]<0)pp=[-pp[0],-pp[1],-pp[2]];const dd=lerp(.8,.62,k);const E=[F[0]+pp[0]*dd+d[0]*.12,F[1]+.25,F[2]+pp[2]*dd+d[2]*.12];
 env(D({noSky:1,eye:E,tgt:F,fov:38,dof:[Math.hypot(...sub(E,F)),.5],plP:[F[0]+.5,F[1]+1,F[2]+1],plC:[.8,.7,.5],plR:5,fog:[.75,.7,.62],fogD:.02,shadow:{c:F,r:1.5}}));
 room();draw(BOX,{P:SP,p:[0,-.03,0],s:[.5,.06,.36],c:[.55,.4,.25],pat:2,patS:3});stork(SP,{gold:0,spear:1,spearGold:.35});
 const G=xf([F[0]+pp[0]*.16+d[0]*.04*Math.sin(lt*2),F[1]+.03,F[2]+pp[2]*.16],[0,Math.atan2(pp[0],pp[2]),0]);draw(TUBE,{P:G,r:[Math.PI/2,0,0],s:[.07,.01,.07],c:[.75,.6,.25],g:.8});draw(CYL,{P:G,r:[Math.PI/2,0,0],s:[.066,.003,.066],c:[.85,.92,1],a:.18,u:1,noShadow:1});lineC(G,[.05,-.05,0],[.13,-.15,0],.01,[.3,.2,.12]);}
// 10. the route: Africa -> Germany (map on the floor)
const MAPC=document.createElement('canvas');MAPC.width=1024;MAPC.height=1024;let MAPD=0;
const ML0=-20,ML1=50,MA0=-8,MA1=64;function mapXZ(lon,lat){return[((lon-ML0)/(ML1-ML0)-.5)*20,((MA1-lat)/(MA1-MA0)-.5)*20];}
function drawMap(){if(MAPD)return;MAPD=1;const g=MAPC.getContext('2d');g.fillStyle='#5aa5d8';g.fillRect(0,0,1024,1024);g.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<20;i++)g.fillRect(0,i*52,1024,24);
 g.fillStyle='#d9c58e';g.strokeStyle='#5a4a2a';g.lineWidth=3;LAND.forEach(poly=>{g.beginPath();poly.forEach(([x,y],i)=>{const X=(x-ML0)/(ML1-ML0)*1024,Y=(MA1-y)/(MA1-MA0)*1024;i?g.lineTo(X,Y):g.moveTo(X,Y);});g.closePath();g.fill();g.stroke();});
 // greener Europe / Sahara tint
 g.globalCompositeOperation='source-atop';const gr=g.createLinearGradient(0,0,0,1024);gr.addColorStop(0,'rgba(110,160,80,.55)');gr.addColorStop(.38,'rgba(110,160,80,.35)');gr.addColorStop(.5,'rgba(230,190,110,.5)');gr.addColorStop(.7,'rgba(230,190,110,.35)');gr.addColorStop(.85,'rgba(90,150,70,.55)');g.fillStyle=gr;g.fillRect(0,0,1024,1024);g.globalCompositeOperation='source-over';
 g.font='700 34px Cinzel';g.fillStyle='rgba(60,40,20,.8)';g.textAlign='center';g.fillText('EUROPE',(15-ML0)/(ML1-ML0)*1024,(MA1-49)/(MA1-MA0)*1024);g.fillText('AFRICA',(18-ML0)/(ML1-ML0)*1024,(MA1-18)/(MA1-MA0)*1024);}
const ROUTE=[[31,11],[33,22],[32.5,31],[30,38],[29,41.2],[24,44],[19,48],[14,52],[11.2,54]];
function routePts(f){const L=ROUTE.map(([lo,la])=>mapXZ(lo,la));const seg=[];let tot=0;for(let i=1;i<L.length;i++){const l=Math.hypot(L[i][0]-L[i-1][0],L[i][1]-L[i-1][1]);seg.push(l);tot+=l;}
 let rem=f*tot;const out=[L[0]];for(let i=1;i<L.length;i++){if(rem<=0)break;const l=seg[i-1];const q=Math.min(1,rem/l);out.push([lerp(L[i-1][0],L[i][0],q),lerp(L[i-1][1],L[i][1],q)]);rem-=l;}return out;}
function sRoute(t){const f=ss(.4,4.4,t);const pts=routePts(f);const e=pts[pts.length-1];const c0=mapXZ(25,32);const fk=ease(ss(0,5.8,t));
 const TG=[lerp(c0[0],e[0],.55),0,lerp(c0[1],e[1],.55)-.5];const E=[TG[0]+lerp(2,1,fk),lerp(17,13,fk),TG[2]+lerp(9,7,fk)];
 env({noSky:1,sky:[.8,.8,.82],gnd:[.5,.48,.44],sunC:[.7,.66,.6],sunD:[-.3,.9,.4],fog:[.22,.2,.22],fogD:.01,eye:E,tgt:TG,fov:44,shadow:{c:TG,r:14}});
 drawMap();useTex('map',MAPC);draw(BOX,{p:[0,-.08,0],s:[20.6,.12,20.6],c:[.42,.28,.16],pat:2,patS:2});draw(QUAD,{p:[0,0,0],r:[-Math.PI/2,0,0],s:[20,20,1],c:[1,1,1],tex:3,u:1});
 const Y=.35;for(let i=1;i<pts.length;i++){lineC(xf([0,0,0]),[pts[i-1][0],Y,pts[i-1][1]],[pts[i][0],Y,pts[i][1]],.09,[1,.72,.2],{u:1,noInk:1,gold:1});draw(SPHL,{p:[pts[i][0],Y,pts[i][1]],s:[.09,.09,.09],c:[1,.72,.2],u:1,noInk:1,noShadow:1,gold:1});}
 const a=mapXZ(31,11),b=mapXZ(11.2,54);draw(CYL,{p:[a[0],.02,a[1]],s:[.4,.06,.4],c:[.85,.3,.2]});draw(CYL,{p:[b[0],.02,b[1]],s:[.4+.1*Math.sin(t*5),.06,.4+.1*Math.sin(t*5)],c:[1,.75,.25],gold:1});
 const pp=pts.length>1?pts[pts.length-2]:[e[0],e[1]+1];const v=[e[0]-pp[0],0,e[1]-pp[1]];stork(cxf(flyPose([e[0],Y+.8,e[1]],(Math.hypot(v[0],v[2])>1e-3?v:[0,0,-1])),xf([0,-.75,0],[0,0,0],1.8)),{fly:1,flap:t*8,gold:1,spear:1});
 if(t>4.3)camPlaque(E,TG,7,0,2.6,.9,Math.round(3000*ease(ss(4.4,5.4,t))),4,'KM FLOWN');}
// 11. they migrated: soaring flock
function sFlock(t){const k=ease(ss(0,2.8,t));env(D({eye:[lerp(-2,0,k),lerp(11,11.5,k),lerp(10,9,k)],tgt:[0,15.5,-4],fov:48,shadow:false,clouds:.6}));
 for(let i=0;i<15;i++){const row=Math.floor(Math.sqrt(i)),col=i-row*row;const p=[(col-row)*1.3+Math.sin(t*.7)*.3,15.5+Math.sin(t*1.3+i)*.15+row*.25,-2-row*1.6+t*.5];stork(cxf(flyPose(p,[0,.05,1],Math.sin(t+i)*.1),xf([0,-.75,0],[0,0,0],1.1)),{fly:1,flap:t*5+i*.8,gold:i==0?1:0});}}
// 12. why: winter takes the food away
function pondHF(x,z){return .3*Math.sin(x*.12)*Math.cos(z*.1)-(1.1*(1-ss(4,7,Math.hypot(x-1,z-2))));}
function sWhy(t){const B=3.3;if(t<B){const k=ease(ss(0,B,t));env(WI({eye:[lerp(7,6,k),lerp(3.6,3.0,k),lerp(13,12,k)],tgt:[-1,1.2,1],fov:44,shadow:{c:[0,0,0],r:12}}));
  if(GK!=='P'){setGrid(-50,50,-50,40,pondHF);GK='P';}draw(GRID,{c:[.92,.93,.96],pat:6,patS:3});draw(CYL,{p:[1,-.65,2],s:[5.5,.1,5.5],c:[.66,.8,.9],g:.8});house(xf([-9,groundY(pondHF,-9,-6,5,5),-6],[0,.5,0]),{w:5,d:5,floors:1,style:'wood',wall:[.62,.46,.32],roof:[.95,.96,.98]});
  const r=rnd(41);for(let i=0;i<14;i++){const a=r()*6.28,d=9+r()*14;const x=Math.cos(a)*d,z=Math.sin(a)*d;tree(xf([x,pondHF(x,z)-.1,z]),1+r()*.4,[.5,.42,.32],'broad');}
  for(let i=0;i<6;i++)draw(CYL,{p:[-3+i*.6,-.2+.4,4.5+Math.sin(i)*.6],s:[.02,.9,.02],c:[.6,.52,.34]});
  // frog hidden under the ice (x-ray outline)
  draw(SPH,{p:[1.6,-.85,2.4],s:[.18,.1,.22],c:[.4,.6,.3],a:.5,u:1,noShadow:1});
  // a lone stork takes off
  const f=ss(1.2,3.2,t);const p=[lerp(-1,-6,f),lerp(-.2,3.5,f*f),lerp(3,-4,f)];if(f<=0)stork(xf([-1,pondHF(-1,3),3],[0,-2.2,0]),{gold:1});else stork(cxf(flyPose(p,[-.6,.4,-.8]),xf([0,-.75,0])),{fly:1,flap:t*8,gold:1});
  for(let i=0;i<80;i++){const fx=(i*.618)%1,fz=(i*.382)%1;const y=6-((i*.71+t*.9)%6);draw(SPHL,{p:[-8+fx*16,y,-4+fz*12],s:[.04,.04,.04],c:[1,1,1],u:1,noShadow:1,noInk:1});}return;}
 const lt=t-B,k=ease(ss(0,2.6,lt));env(AF({eye:[lerp(-6,-4,k),lerp(2.2,1.8,k),lerp(10,8.5,k)],tgt:[0,.7,0],fov:42,shadow:{c:[0,0,0],r:12}}));
 if(GK!=='A'){setGrid(-60,60,-60,40,(x,z)=>.25*Math.sin(x*.1)*Math.cos(z*.13)-(.8*(1-ss(5,9,Math.hypot(x+1,z-1)))));GK='A';}draw(GRID,{c:[.62,.6,.32],pat:1,patS:1.2});
 draw(CYL,{p:[-1,-.45,1],s:[8,.1,8],c:[.2,.45,.4],pat:5,patS:.6,g:.6,noShadow:1});
 const r=rnd(51);for(let i=0;i<10;i++){const a=r()*6.28,d=11+r()*16;tree(xf([Math.cos(a)*d,-.1,Math.sin(a)*d-6]),1.2+r()*.5,null,'acacia');}
 for(let i=0;i<5;i++){const x=-3+i*1.5,z=1+Math.sin(i*2)*1.5;stork(xf([x,-.5,z],[0,i*1.3+Math.sin(lt+i)*.2,0]),{gold:i==2?1:0});}
 for(let i=0;i<4;i++){const hop=Math.max(0,Math.sin(lt*4+i*1.7))*.25;const P=xf([-2+i*1.4,-.38+hop,2.8+i*.3]);draw(SPH,{P,s:[.09,.06,.11],c:[.38,.62,.28]});draw(SPH,{P,p:[0,.02,.07],s:[.04,.03,.03],c:[.06,.06,.06],noInk:1});}
 for(let i=0;i<24;i++){const a=i*.9+lt*3;draw(SPHL,{p:[Math.cos(a)*(.5+i%4*.3)+1,.4+Math.sin(a*1.7)*.2,Math.sin(a)*(.5+i%3*.3)+2],s:[.02,.02,.02],c:[.15,.12,.08],noInk:1,noShadow:1});}}
// 13. Rostock: the display case
function sCase(t,close){const a=(close?1.2:.4)+t*.15;const r=close?2.2:4.2,h=close?1.85:2.4,ty=close?1.75:1.5;
 env({noSky:1,sky:[.66,.62,.58],gnd:[.34,.3,.26],sunC:[.55,.5,.44],sunD:[-.3,.8,.6],fog:[.22,.2,.22],fogD:.012,eye:[Math.sin(a)*r,h,Math.cos(a)*r],tgt:[0,ty,0],fov:40,dof:[r,r*.5],plP:[1.5,4,2],plC:[.95,.82,.58],plR:10,desat:.25});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.45,.32,.22],pat:2,patS:1.2,g:.3});draw(BOX,{p:[0,3.5,-5],s:[30,9,.3],c:[.3,.38,.34],pat:6,patS:1});
 for(let i=-2;i<=2;i++){if(!i)continue;const x=i*2.6;draw(BOX,{p:[x,.5,-3.6],s:[1.4,1,1],c:[.4,.28,.18],pat:2});draw(BOX,{p:[x,1.3,-3.6],s:[1.3,.6,.9],c:[.8,.9,.95],a:.25,u:1,noShadow:1});
  draw(SPH,{p:[x,1.2,-3.6],s:[.15,.12,.25],c:[[.5,.4,.3],[.3,.3,.35],[.7,.5,.3],[.4,.35,.25]][i+2]});}
 draw(BOX,{p:[0,.45,0],s:[1.3,.9,1.3],c:[.42,.28,.16],pat:2,patS:2});draw(BOX,{p:[0,.93,0],s:[1.2,.06,1.2],c:[.3,.22,.14]});
 stork(xf([0,.96,0],[0,-.6+Math.sin(t*.3)*.05,0]),{gold:1,spear:1});
 // glass case edges + panes
 const gy=.96,gh=1.5;for(const[x,z]of[[-.6,-.6],[.6,-.6],[-.6,.6],[.6,.6]])lineC(xf([0,0,0]),[x,gy,z],[x,gy+gh,z],.012,[.75,.6,.3],{g:.8});
 draw(BOX,{p:[0,gy+gh,0],s:[1.24,.04,1.24],c:[.75,.6,.3],g:.8});draw(BOX,{p:[0,gy+gh/2,0],s:[1.2,gh,1.2],c:[.85,.92,.96],a:.12,u:1,noShadow:1,g:1});
 // small brass label on the case
 draw(BOX,{p:[0,.7,.66],s:[.5,.16,.02],c:[.85,.66,.3],g:.8});}
function sRost(t){sCase(t,0);}
function sName(t){sCase(t,1);}
// 14. not the last: more storks arrive with arrows
function sMore(t){const k=ease(ss(0,5.6,t));const E=[lerp(10,8,k),lerp(3,4,k),lerp(16,13,k)],TG=[-4,6,-6];env(AU({eye:E,tgt:TG,fov:46,sunD:[-.7,.3,.4],sunC:[.95,.72,.5],fog:[.92,.8,.68],shadow:{c:[-4,0,-4],r:24}}));village();
 const N=NESTP();nest(xf(N),1.1);
 for(let i=0;i<9;i++){const d=t*1.6-i*.45;const p=[-18+d*2.4+(i%3)*1.2,7.5+Math.sin(i)*1.2-d*.2,-5+(i%4)*1.5-d*.3];stork(cxf(flyPose(p,[2.4,-.2,-.3],.05),xf([0,-.75,0])),{fly:1,flap:t*6+i,gold:1,spear:i%2==0,spearK:.8});}
 if(t>.8)camPlaque(E,TG,9,0,2.0,1.0,Math.round(25*ease(ss(1.6,3.6,t))),2,'ARROW STORKS');}
// archive
function sArchive(t){env({noSky:1,sky:[.46,.42,.38],gnd:[.26,.22,.19],sunC:[.5,.42,.34],sunD:[-.3,.6,.7],fog:[.15,.13,.11],fogD:.03,eye:[lerp(.6,0,ease(ss(0,4,t))),1.95,lerp(5.5,4.4,ease(ss(0,4,t)))],tgt:[0,1.95,0],fov:44,plP:[0,2.5,2],plC:[.85,.65,.38],plR:7,bloom:1});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 draw(BOX,{p:[0,.9,1.2],s:[1.8,.06,.8],c:[.4,.26,.15]});for(const sx of[-.8,.8])draw(BOX,{p:[sx,.45,1.2],s:[.06,.9,.6],c:[.35,.22,.13]});
 stork(cxf(xf([0,.93,1.2],[0,.6+t*.15,0]),xf([0,0,0],[0,0,0],.55)),{gold:1,spear:1});}
// ---------- timeline ----------
const S=[[0,1.6,sGlobe],[1.6,5.1,sLand],[5.1,9.0,sMyst],[9.0,13.75,sVanish],[13.75,17.6,sAri],[17.6,21.6,sLake],[21.6,25.9,sMoon],[25.9,30.35,sHunt],[30.35,34.1,sSpear],[34.1,37.65,sExam],[37.65,43.55,sRoute],[43.55,46.55,sFlock],[46.55,52.4,sWhy],[52.4,57.0,sRost],[57.0,60.65,sName],[60.65,66.4,sMore],[66.4,74.6,sArchive]];
const END=74.6;
const RIB=[[1.7,.92,'1822'],[13.8,.04,'c. 340 BC'],[21.7,.5,'1703'],[26.0,.92,'1822'],[52.5,1,'TODAY']];
function overlays(T,fn,lt){
 badge('KLÜTZ, GERMANY','1822',LON,LAT,T,ss(1.4,2.0,T)*(1-ss(66.0,66.4,T)));
 ribbon(T,RIB,['340 BC','TODAY'],ss(1.6,2.0,T)*(1-ss(66.0,66.4,T)));
 if(fn===sGlobe)bigText([['1822',120,GOLD]],.3,1.55,T,560);
 seal(1,'THE MYSTERY',9.05,T);seal(2,'THE CLUE',25.95,T);seal(3,'THE ANSWER',43.6,T);
 if(fn===sLand)tag('A SPEAR IN ITS NECK',W/2,420,3.3,5.0,T,{size:36});
 if(fn===sMyst)tag('A 2,000-YEAR MYSTERY',W/2,420,5.6,8.9,T,{size:36});
 if(fn===sVanish)tag('EVERY AUTUMN: GONE',W/2,420,10.2,13.6,T,{size:36});
 if(fn===sAri){museum('ARISTOTLE','Greek philosopher','384–322 BC',560,960,14.0,16.2,T,'r');tag('BIRDS TURN INTO OTHER BIRDS?',W/2,420,15.2,17.5,T,{size:30});}
 if(fn===sLake)tag('MYTH: ASLEEP UNDER LAKES',W/2,420,17.9,21.5,T,{size:32});
 if(fn===sMoon)tag('1703: "THEY FLY TO THE MOON"',W/2,420,22.0,25.8,T,{size:30});
 if(fn===sHunt)tag('KLÜTZ · BALTIC COAST',W/2,420,26.2,28.3,T,{size:34});
 if(fn===sSpear){tag('LONGER THAN YOUR ARM',W/2,420,32.7,34.0,T,{size:34});}
 if(fn===sExam){if(lt<1.7)tag('TROPICAL WOOD',W/2,420,34.3,35.75,T,{size:36});else tag('AN AFRICAN SPEAR',W/2,420,35.95,37.55,T,{size:36});}
 if(fn===sRoute){const a=mapXZ(31,11),b=mapXZ(11.2,54);const pa=proj([a[0],.4,a[1]]),pb=proj([b[0],.4,b[1]]);tag('HIT HERE',pa[0],pa[1]-70,38.0,41.0,T,{size:30,pointer:1});tag('LANDED HERE',pb[0],pb[1]-70,40.5,43.4,T,{size:30,pointer:1});}
 if(fn===sFlock)bigText([['THEY',80,PARCH],['MIGRATED',96,GOLD]],44.6,46.5,T,520);
 if(fn===sWhy){if(lt<3.3)tag('WINTER: NO FROGS, NO INSECTS',W/2,420,46.9,49.8,T,{size:30});else tag('SOUTH: FOOD ALL WINTER',W/2,420,50.0,52.3,T,{size:32});}
 if(fn===sRost)museum('THE ARROW STORK','University of Rostock','Found 1822',560,1000,52.8,56.8,T,'r');
 if(fn===sName)bigText([['PFEILSTORCH',84,GOLD],['"ARROW STORK"',60,PARCH]],57.4,60.5,T,520);
 if(fn===sArchive){archiveCard([['ONE BIRD, ONE ANSWER'],'For centuries, Europeans guessed','birds slept all winter. A wounded','stork proved they fly to Africa.'],66.8,T);outro(72.4,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;flFree();cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 if(fn===sHunt&&lt>2.2&&lt<2.4)flash((1-(lt-2.2)/.2)*.35);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
