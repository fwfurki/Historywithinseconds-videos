// ===== MARY CELESTE (1872) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
const LON=-25.1,LAT=36.9;
const SEA={sky:[.7,.75,.85],gnd:[.45,.47,.5],sunC:[.62,.58,.5],sunD:[-.5,.75,.4],fog:[.8,.87,.95],fogD:.0025,skyTop:[.28,.5,.86],clouds:.45};
function sea(c){draw(BOX,{p:[0,-.5,0],s:[1400,1,1400],c:c||[.12,.36,.55],g:.6,pat:5,patS:.35});}
const dY=z=>HS.deckY(z/22+.5);
function onDeck(SP,x,z,yaw,k){return cxf(SP,xf([x,dY(z),z],[0,yaw||0,0],k||1));}
// ---- people ----
const CAPT={coat:[.14,.16,.24],pants:[.14,.16,.24],moustache:1,hair:HAIRS[0],hat:'cap',hatc:[.1,.1,.14],tie:[.1,.1,.12]};
const WIFE={dress:[.36,.26,.46],hairStyle:'bun',hair:HAIRS[2],female:1};
const WIFEB={coat:[.36,.26,.46],pants:[.36,.26,.46],sleeve:[.36,.26,.46],hairStyle:'bun',hair:HAIRS[2],female:1,noVneck:1};
const GIRL={dress:[.86,.52,.5],hairStyle:'bun',hair:HAIRS[2],female:1};
const CREW=[{coat:[.2,.26,.42],hat:'cap',hatc:[.15,.18,.3]},{coat:[.62,.24,.2],jacket:false,shirt:[.9,.88,.82],hat:'flat'},{coat:[.3,.3,.32],hat:'cap',beard:1,hair:HAIRS[1]},
 {coat:[.25,.4,.55],jacket:false,shirt:[.85,.82,.75],hat:'none',hair:HAIRS[2]},{coat:[.42,.32,.22],hat:'flat',moustache:1},{coat:[.18,.22,.3],hat:'cap',skin:SKINS[1]},{coat:[.55,.5,.4],jacket:false,shirt:[.8,.82,.86],hat:'none',hair:HAIRS[0],beard:1}];
function crewP(P,i,o){person(P,Object.assign({seed:i+3},CREW[i%7],o||{}));}
// ---- globe ----
function sGlobe(t){const k=ease(ss(0,2.0,t));env({eye:[0,0,lerp(5.4,3.3,k)],tgt:[0,0,0],fov:40,bg:[.055,.105,.17],fog:[.055,.105,.17],fogD:0,sky:[.9,.9,.95],gnd:[.55,.55,.6],sunC:[.45,.45,.45],sunD:[-.3,.4,.9],ink:.8,inkFar:50});
 globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.6,ss(1.1,1.6,t));for(let i=0;i<80;i++){const a=i*2.39,e=(i*.618)%1;draw(SPHL,{p:[Math.cos(a)*40,(e-.5)*70,-30+Math.sin(a)*10],s:[.08,.08,.08],c:[1,1,1],u:1,id:0});}}
// ---- hook: drifting ship ----
function sHook(t){const k=ease(ss(0,3.4,t));const T=2.36+t;env({...SEA,eye:[lerp(70,38,k),lerp(42,16,k),lerp(-40,-22,k)],tgt:[0,lerp(4,6,k),2],fov:40,desat:.3});sea();
 brig({...seaP([0,0,0],.0,T),gold:1},{torn:1,flap:.15});
 for(let i=0;i<10;i++){const a=i*.9;draw(SPHL,{p:[Math.cos(a)*30+Math.sin(T*.3+i)*2,.05,Math.sin(a)*30],s:[3,.05,1.2],c:[.95,.98,1],a:.3,u:1});}}
function sSails(t){const T=5.7+t;
 if(t<1.42){const k=ease(ss(0,1.42,t));env({...SEA,eye:[lerp(-7,-6,k),lerp(3.2,3.6,k),lerp(-17,-15,k)],tgt:[0,lerp(7,9,k),2],fov:46,desat:.25});sea();brig({...seaP([0,0,0],0,T,.5)},{flap:.5,torn:1,set:[1,1,1,0,0]});
  return;}
 const lt=t-1.42,k=ease(ss(0,2,lt));env({...SEA,eye:[lerp(11,9,k),lerp(4.2,3.2,k),lerp(-8,-5,k)],tgt:[0,-.8,-.5],fov:42,clip:[1,0,0,0],desat:.3,shadow:false});sea();
 brig(xf([0,0,0]),{hatchOpen:0});hold(lt,{gold:ss(.2,.8,lt)});}
function hold(t,o){o=o||{};// cargo hold contents (ship local at origin, no bob)
 draw(BOX,{p:[0,-1.75,0],s:[5.2,.1,17],c:[.42,.32,.2],pat:2,patS:2});
 if(!PROP.get('barrel'))barrel(xf([0,-50,0]));const BM=PROP.get('barrel');for(let r=0;r<2;r++)for(let i=0;i<17;i++)for(let j=0;j<5;j++){const z=-7.4+i*.84,x=-1.68+j*.84;const y=-1.7+r*1.0;if(Math.abs(x)>2.0-r*.3)continue;
  draw(BM,{p:[x,y,z],s:[1.08,1.1,1.08],c:(i+j+r)%3?[.6,.42,.24]:[.52,.36,.2],gold:o.gold||0,noShadow:1});}
 for(let i=0;i<5;i++)draw(BOX,{p:[0,-.2,-7+i*3.4],s:[5.4,.25,.25],c:[.4,.3,.2]});
 if(o.water){const wl=-1.75+o.water;draw(BOX,{p:[0,wl-.5,0],s:[5.0,1,17],c:[.2,.45,.6],a:.7,g:.6,pat:5,patS:2,u:0});}}
function sEmpty(t){const T=9.1+t;const k=ease(ss(0,2.3,t));const SP=seaP([0,0,0],0,T,.6);env({...SEA,eye:[lerp(1.6,.9,k),dY(-10.6)+lerp(2.6,2.3,k),lerp(-13.6,-12.6,k)],tgt:[0,dY(-6)+1.2,lerp(-6,-4,k)],fov:46,desat:.2});sea();
 brig(SP,{wheelSpin:Math.sin(T*1.3)*.9,gWheel:1,flap:.3});}
function plinth(fig,t,o){o=o||{};const a=.6+t*.18;env({noSky:1,sky:[.6,.57,.54],gnd:[.3,.27,.24],sunC:[.5,.47,.42],sunD:[-.3,.8,.6],fog:[.16,.15,.17],fogD:.016,eye:[Math.sin(a)*o.r,o.h,Math.cos(a)*o.r],tgt:[0,o.ty,0],fov:40,dof:[Math.hypot(o.r,o.h-o.ty),o.r*.4],plP:[1.5,5,3],plC:[.9,.78,.55],plR:14,desat:.2});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.4,.3,.22],pat:2,patS:1.2,g:.3});for(let i=-3;i<=3;i++)draw(BOX,{p:[i*4,3,-9],s:[3.6,6,.3],c:[.36,.3,.3],pat:6,patS:1});draw(BOX,{p:[0,6.2,-9],s:[30,.3,.5],c:[.6,.46,.22]});
 const pr=o.pr||1.4,ph=o.ph||1;draw(CYL,{p:[0,0,0],s:[pr,ph,pr],c:[.78,.74,.68],pat:6,patS:3,g:.3});draw(CYL,{p:[0,ph,0],s:[pr*1.1,.12,pr*1.1],c:[.86,.82,.76],pat:6,patS:3,g:.3});draw(CYL,{p:[0,0,0],s:[pr*1.12,.1,pr*1.12],c:[.62,.58,.52]});
 fig(cxf(xf([0,ph+.12,0],[0,-t*.35,0]),xf([0,0,0]),{gold:1}));}
function sShipPlinth(t){plinth(P=>{brig(cxf(P,xf([0,.55,0],[0,.4,0],.11)),{});draw(BOX,{P,p:[0,.25,0],s:[.9,.5,2.8],c:[.45,.32,.2],pat:2,patS:3});},t,{r:7.2,h:3.4,ty:1.9,pr:1.9,ph:.8});}
// ---- New York departure ----
function nyHF(x,z){return x<-24?1.2+Math.min(6,(-24-x)*.15)+Math.sin(z*.07)*.4:-3;}
let GK='';function nyGround(){if(GK!=='NY'){setGrid(-140,-14,-140,140,nyHF);GK='NY';}draw(GRID,{c:[.5,.6,.4],pat:1,patS:1.2});}
const NYH=(()=>{let s=7;const r=()=>{s=(s*9301+49297)%233280;return s/233280;};const L=[];for(let z=-80;z<=80;z+=7)for(let x=-30;x>-70;x-=8){if(r()<.2)continue;L.push([x+r()*2,z+r()*2,r()]);}return L;})();
function sNY(t){const T=13.3+t;const k=ease(ss(0,4.9,t));const z=lerp(-2,22,ss(0,4.9,t));env({...SEA,eye:[lerp(-2,16,k),lerp(9,11,k),lerp(-34,-14,k)],tgt:[lerp(-3,2,k),4,z+lerp(-2,4,k)],fov:42});sea();nyGround();
 NYH.forEach(([x,z,q],i)=>{const y=groundY(nyHF,x,z,5,6);house(xf([x,y,z],[0,Math.PI/2,0]),{w:5,d:6,floors:q>.6?3:2,style:q<.3?'brick':q<.7?'plaster':'wood',wall:[[.78,.5,.38],[.86,.8,.68],[.7,.72,.76]][i%3],roof:[[.36,.3,.3],[.3,.34,.4]][i%2]});});
 for(let i=-4;i<=4;i++){draw(BOX,{p:[-20,.4,i*16],s:[9,.4,3],c:[.5,.38,.25],pat:2,patS:1.6});for(let j=0;j<5;j++)draw(CYL,{p:[-24+j*2,-2,i*16+1.3],s:[.18,2.6,.18],c:[.35,.27,.2]});}
 brig(xf([-28+18,0,-40],[0,.1,0],.9),{hull:[.3,.24,.2],set:[0,0,0,0,0],main:0});brig(xf([-10,0,40],[0,Math.PI+.2,0],.85),{hull:[.2,.3,.25],set:[0,0,0,0,0],main:0});
brig({...seaP([2,0,z],0,T,.6),gold:ss(.5,1.2,t)*.8},{foam:1});}
// ---- cargo ----
function sCargo(t){const k=ease(ss(0,3.1,t));env({...SEA,eye:[lerp(16,12.5,k),lerp(5.5,4,k),lerp(-13,-8.5,k)],tgt:[0,-.6,0],fov:40,clip:[1,0,0,0],desat:.3,shadow:false});sea();
 brig(xf([0,0,0]),{});hold(t,{gold:1});plaque3D(xf([4.5,3.4,1.5],[0,2.2,0],1.3),Math.round(1700*ease(ss(.3,2.2,t))),4,'BARRELS');}
// ---- captain ----
function sBriggs(t){plinth(P=>person(P,Object.assign({seed:1},CAPT)),t,{r:3.6,h:2.3,ty:1.95,pr:.9,ph:.9});}
function sFamily(t){const k=ease(ss(0,3.5,t));const cxm=lerp(-2.6,1.6,k);
 env({noSky:1,sky:[.6,.57,.54],gnd:[.3,.27,.24],sunC:[.5,.47,.42],sunD:[-.3,.8,.6],fog:[.16,.15,.17],fogD:.016,eye:[cxm+.4,2.0,6.4],tgt:[cxm,1.15,0],fov:44,plP:[cxm,5,3],plC:[.9,.78,.55],plR:14,desat:.15});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.4,.3,.22],pat:2,patS:1.2,g:.3});for(let i=-4;i<=4;i++)draw(BOX,{p:[i*4,3,-3],s:[3.6,6,.3],c:[.36,.3,.3],pat:6,patS:1});draw(BOX,{p:[0,6.2,-3],s:[40,.3,.5],c:[.6,.46,.22]});
 draw(BOX,{p:[0,.15,0],s:[11,.3,1.6],c:[.78,.74,.68],pat:6,patS:3,g:.3});draw(BOX,{p:[0,.32,0],s:[11.2,.06,1.75],c:[.86,.82,.76],pat:6,patS:3});
 const X=[-4.3,-3.3,-2.55,-1.4,-.5,.4,1.3,2.2,3.1,4.0];
 X.forEach((x,i)=>{const gold=(i==0&&t<.1)||(i==1&&t<1.05)||(i==2&&t>1.0&&t<2.2)||(i>2&&t>2.2)?1:0;const P={...xf([x,.35,0],[0,(i%3-1)*.15,0],i==2?.6:1),gold};
  if(i==0)person(P,Object.assign({seed:1},CAPT));else if(i==1)person(P,Object.assign({seed:2},WIFE));else if(i==2)person(P,Object.assign({seed:4},GIRL));else crewP(P,i-3);});
 const n=t<1.05?2:t<2.2?3:Math.min(10,3+Math.floor(ss(2.2,3.1,t)*7+.0001));plaque3D(xf([cxm,3.6,-2.7],[0,0,0],1.1),n,2,'ABOARD');}
// ---- Dei Gratia ----
function sDei(t){const T=27.8+t;const k=ease(ss(0,3.6,t));env({...SEA,eye:[lerp(-34,-24,k),lerp(7,5,k),lerp(30,24,k)],tgt:[0,5,lerp(4,8,k)],fov:42});sea();
 const DP=seaP([0,0,lerp(0,6,t/3.6)],0,T);brig({...DP,gold:ss(.4,1,t)},{hull:[.15,.26,.2],bottom:[.55,.3,.2],foam:1,set:[1,1,1,1,0],jibs3:1});
 person(onDeck(DP,-1.2,8.8,-.6),Object.assign({seed:9},CREW[2],{armR:[-1.9,0,-.5],elbowR:1.7,armL:[-1.7,0,.3],elbowL:1.9,head:[.05,-.4,0]}));
 const sp=onDeck(DP,-1.2,8.8,-.6);draw(CYL,{P:sp,p:[-.05,1.6,.12],r:[Math.PI/2,0,0],s:[.04,.5,.04],c:[.75,.6,.3],g:.7});
}
function sStrange(t){const T=31.4+t;
 if(t<1.4){const k=ease(ss(0,1.4,t));const DP=xf([0,0,0]);env({...SEA,eye:[lerp(4.2,3.8,k),4.6,lerp(11.5,12.5,k)],tgt:[22,5,70],fov:lerp(30,24,k),desat:.25});sea();brig(seaP([0,0,0],0,T,.5),{hull:[.15,.26,.2],foam:1,set:[1,1,1,1,0],jibs3:1});
  brig({...seaP([22,0,72],2.3+Math.sin(T*.9)*.35,T),gold:1},{torn:1,flap:.4,gsw:Math.sin(T*1.2)*.5});return;}
 const lt=t-1.4,k=ease(ss(0,1.5,lt));const SP=seaP([0,0,0],0,T,.4);env({...SEA,eye:[lerp(2.4,1.8,k),dY(-9.6)+lerp(1.9,1.6,k),lerp(-6.8,-7.6,k)],tgt:[0,dY(-9.6)+1.15,-9.4],fov:44,desat:.35,dof:[2.4,1.6]});sea();
 brig(SP,{wheelSpin:Math.sin(T*1.6)*1.3,gWheel:1,flap:.3});}
// ---- boarding ----
function sBoard(t){const T=34.3+t;const k=ease(ss(0,2.5,t));const SP=seaP([0,0,0],0,T,.4);env({...SEA,eye:[lerp(16,13,k),lerp(4,4.6,k),lerp(-9,-6,k)],tgt:[2,1.8,-3],fov:44});sea();brig(SP,{flap:.3,torn:1});
 const bx=lerp(9,4.4,ss(0,1.6,t));const BP=xf([bx,Math.sin(T*1.4)*.1,-3],[0,-.15,0]);boat(BP,{hull:[.9,.85,.7]});
 for(let i=0;i<3;i++){const climb=i==0?ss(1.4,2.5,t):0;const P=cxf(BP,xf([0,(climb>0?.12:-.2)+climb*1.6,-.9+i*.9],[0,i==0?-Math.PI/2:0,0],.9));person(P,Object.assign({seed:11+i},CREW[(i+4)%7],i==0&&climb>0?{armL:[-2.6,0,.2],armR:[-2.4,0,-.2],elbowL:.3,elbowR:.3}:{sit:1,armL:[-1+Math.sin(T*4+i)*.4,0,0],armR:[-1+Math.sin(T*4+i)*.4,0,0],elbowL:.6,elbowR:.6}));}}
// ---- cabin interior ----
function cabin(t,o){o=o||{};const fd=Math.hypot(o.tgt[0]-o.eye[0],o.tgt[1]-o.eye[1],o.tgt[2]-o.eye[2]);
 env({dof:[fd,fd*.5],noSky:1,sky:[.68,.64,.6],gnd:[.42,.38,.33],sunC:[.55,.5,.44],sunD:[.6,.6,.4],fog:[.32,.28,.25],fogD:.008,eye:o.eye,tgt:o.tgt,fov:o.fov||44,plP:[0,2.25,0],plC:[1,.78,.5],plR:8,desat:o.desat||0});
 const sw=Math.sin(TIME*1.1)*.06;
 draw(BOX,{p:[0,-.05,0],s:[7,.1,6],c:[.55,.4,.26],pat:2,patS:2});draw(BOX,{p:[0,2.45,0],s:[7,.1,6],c:[.5,.36,.22],pat:2,patS:2});
 draw(BOX,{p:[-3.5,1.2,0],s:[.1,2.5,6],c:[.66,.5,.32],pat:2,patS:2.5});draw(BOX,{p:[0,1.2,-3],s:[7,2.5,.1],c:[.64,.48,.3],pat:2,patS:2.5});draw(BOX,{p:[3.5,1.2,0],s:[.1,2.5,6],c:[.66,.5,.32],pat:2,patS:2.5});
 for(const z of[-1.6,1.4]){draw(CYL,{p:[3.44,1.55,z],r:[0,0,Math.PI/2],s:[.28,.08,.28],c:[.75,.6,.3],g:.7});draw(CYL,{p:[3.4,1.55,z],r:[0,0,Math.PI/2],s:[.22,.06,.22],c:[.85,.93,1],u:1,id:0});}
 for(let i=0;i<4;i++)draw(BOX,{p:[-1.5+i*1.0,2.36,0],s:[.14,.12,6],c:[.4,.28,.16]});
 // lamp
 draw(CYL,{p:[0,2.0,0],s:[.01,.4,.01],c:[.2,.2,.2]});const LP=xf([Math.sin(sw)*.4,2.0,0]);draw(CYL,{P:LP,p:[0,-.35,0],s:[.1,.25,.1],c:[1,.85,.55],u:1});draw(CONE,{P:LP,p:[0,-.12,0],s:[.16,.12,.16],c:[.3,.25,.2]});
 // table with food
 const gF=o.gFood||0;draw(BOX,{p:[0,.78,0],s:[2.0,.08,1.2],c:[.5,.32,.18],pat:2,patS:3,g:.4});for(const[x,z]of[[-.85,-.5],[.85,-.5],[-.85,.5],[.85,.5]])draw(BOX,{p:[x,.39,z],s:[.08,.78,.08],c:[.42,.27,.15]});
 for(const[x,z]of[[-.55,-.3],[.55,-.3],[-.55,.32],[.55,.32]]){draw(CYL,{p:[x,.82,z],s:[.2,.02,.2],c:[.95,.94,.9],gold:gF});draw(SPH,{p:[x,.86,z],s:[.08,.04,.06],c:[.72,.48,.25],gold:gF});draw(CYL,{p:[x+.2,.82,z+.12],s:[.05,.12,.05],c:[.85,.86,.9],gold:gF});}
 draw(SPH,{p:[0,.9,0],s:[.22,.1,.13],c:[.78,.55,.3],gold:gF});draw(FR,{p:[.2,.82,-.05],s:[.08,.25,.08],c:[.75,.75,.8],g:.5,gold:gF});
 // water cask
 barrel(xf([-2.6,0,-2.2]),o.gFood?[.75,.5,.2]:[.55,.38,.22]);barrel(xf([-1.9,0,-2.4]),[.55,.38,.22]);
 // chairs
 for(const x of[-1.4,1.4])draw(BOX,{p:[x,.45,0],s:[.45,.06,.45],c:[.45,.3,.18]});
 // bunk + belongings
 const gB=o.gBel||0;draw(BOX,{p:[-2.9,.5,1.3],s:[1.1,.15,2.4],c:[.48,.32,.18]});draw(BOX,{p:[-2.9,.62,1.3],s:[1.0,.12,2.3],c:[.85,.82,.72]});draw(BOX,{p:[-2.9,.7,2.2],s:[.8,.12,.45],c:[.95,.95,.92]});
 draw(BOX,{p:[-1.4,.3,2.4],s:[1.0,.6,.6],c:[.42,.28,.16],pat:2,patS:4,gold:gB});draw(BOX,{p:[-1.4,.63,2.4],s:[1.05,.06,.65],c:[.35,.22,.12],gold:gB});
 for(let i=0;i<3;i++)draw(BOX,{p:[-1.45+i*.05,.7+i*.06,2.35],r:[0,i*.3,0],s:[.6,.05,.4],c:[[.3,.35,.55],[.7,.25,.2],[.92,.9,.85]][i],gold:gB});
 draw(BOX,{p:[3.38,1.65,.0],s:[.08,.9,.6],c:[.2,.24,.36],gold:gB});draw(SPH,{p:[3.36,2.05,0],s:[.06,.06,.06],c:[.6,.45,.2]});draw(CYL,{p:[3.3,1.98,-.7],r:[0,0,Math.PI/2],s:[.13,.12,.13],c:[.12,.12,.14],gold:gB});
 // desk (captain)
 draw(BOX,{p:[1.8,.75,-2.45],s:[2.0,.08,.9],c:[.48,.3,.16],pat:2,patS:3,g:.4});draw(BOX,{p:[1.8,.36,-2.45],s:[1.9,.72,.8],c:[.42,.26,.14],pat:2,patS:3});
 draw(BOX,{p:[1.8,1.4,-2.9],s:[1.8,.06,.3],c:[.42,.26,.14]});for(let i=0;i<6;i++)draw(BOX,{p:[1.1+i*.25,1.58,-2.9],s:[.14,.3,.22],c:[[.5,.2,.15],[.25,.3,.45],[.4,.35,.2]][i%3]});
 draw(CYL,{p:[1.2,.8,-2.3],s:[.05,.06,.05],c:[.1,.1,.1]});draw(CYL,{p:[1.25,.84,-2.3],r:[0,0,.5],s:[.008,.2,.008],c:[.9,.9,.85]});
 const gp=o.ghostP||0,gi=o.ghostI||0;
 if(gp>0){for(let i=0;i<3;i++)draw(BOX,{p:[1.85+i*.04,.8+i*.012,-2.4],r:[0,.2*i-.2,0],s:[.42,.012,.55],c:[1,.8,.35],a:.25+.25*gp*(.6+.4*PULSE),u:1,id:0});}
 if(gi>0){const GP={a:.25+.3*gi*(.6+.4*PULSE),u:1,c:[1,.8,.35],id:0};draw(BOX,Object.assign({p:[2.45,.92,-2.5],s:[.4,.3,.4]},GP));
  const SX=xf([1.55,.95,-2.2],[0,.4,0]);draw(BOX,Object.assign({P:SX,p:[0,.15,0],r:[0,0,.52],s:[.04,.4,.02]},GP));draw(BOX,Object.assign({P:SX,p:[.2,.15,0],r:[0,0,-.52],s:[.04,.4,.02]},GP));draw(BOX,Object.assign({P:SX,p:[.1,-.02,0],s:[.42,.04,.02]},GP));}
 if(o.slate){const SL=xf([1.75,.81,-2.35],[-Math.PI/2,0,.08]);draw(BOX,{P:SL,p:[0,0,-.035],s:[.78,.56,.04],c:[.5,.34,.18]});slateTex();dynTex('slate',SLC);draw(QUAD,{P:SL,s:[.7,.48,1],c:[1,1,1],tex:3,u:1,gold:o.gSlate||0});}}
const SLC=document.createElement('canvas');SLC.width=1024;SLC.height=700;function slateTex(){const g=SLC.getContext('2d');g.fillStyle='#2b3032';g.fillRect(0,0,1024,700);for(let i=0;i<1400;i++){g.fillStyle=`rgba(255,255,255,${.02+.03*((i*37)%7)/7})`;g.fillRect((i*733)%1024,(i*491)%700,3,2);}
 g.fillStyle='rgba(240,240,232,.92)';g.font='italic 700 120px "DejaVu Serif"';g.textAlign='left';g.fillText('Nov. 25th',90,210);g.font='italic 64px "DejaVu Serif"';g.fillText('8 a.m. — island of',90,370);g.fillText('Santa Maria in sight',90,460);
 g.strokeStyle='rgba(240,240,232,.6)';g.lineWidth=4;g.beginPath();g.moveTo(90,250);g.lineTo(640,250);g.stroke();}
function sCabin(t){const T=36.8+t;if(t<2.3){const k=ease(ss(0,2.3,t));cabin(t,{eye:[lerp(2.6,2.2,k),1.7,lerp(2.8,2.2,k)],tgt:[0,.85,-.1],gFood:ss(.1,.6,t)});return;}
 const lt=t-2.3,k=ease(ss(0,2.2,lt));cabin(t,{eye:[lerp(1.9,1.5,k),1.7,lerp(-1.4,-1.0,k)],tgt:[-1.9,.7,2.0],gBel:ss(.0,.5,lt)});}
function sMissing(t){const T=41.3+t;if(t<5.5){const k=ease(ss(0,5.5,t));cabin(t,{eye:[lerp(.4,1.0,k),lerp(1.8,1.6,k),lerp(.6,-.6,k)],tgt:[1.9,.85,-2.45],fov:42,ghostP:ss(1.9,2.3,t),ghostI:ss(3.3,3.7,t)});return;}
 const lt=t-5.5,k=ease(ss(0,1.6,lt));const SP=seaP([0,0,0],0,T,.4);env({...SEA,eye:[lerp(3.4,2.8,k),dY(-1.6)+lerp(6,5.2,k),lerp(5.2,4.4,k)],tgt:[0,dY(-1.6)+.7,-1.7],fov:44,desat:.35});sea();brig(SP,{boat:0,gChock:1,flap:.3});
 const fa=1-ss(.25,1.1,lt);if(fa>.02){if(fa>.98)boat(cxf(SP,xf([0,dY(-1.6)+.95,-1.6])),{});else boat(cxf(SP,xf([0,dY(-1.6)+.95,-1.6])),{a:fa,hull:[1,.9,.7]});}
 for(let i=0;i<14;i++){const ph=ss(.25,1.6,lt);if(ph>0&&ph<1)draw(SPHL,{p:[Math.sin(i*2.1)*.8,dY(-1.6)+1.0+ph*2.2*(.5+.5*Math.sin(i)),-1.6+Math.cos(i*1.7)*2],s:[.06,.06,.06],c:[1,.85,.4],u:1,a:1-ph});}}
// ---- the log ----
function sLog(t){const k=ease(ss(0,5.9,t));cabin(t,{eye:[lerp(1.85,1.78,k),lerp(2.3,2.05,k),lerp(-.95,-1.3,k)],tgt:[1.75,.82,-2.35],fov:40,slate:1,gSlate:ss(.2,.6,t)*.5,desat:.1});}
// ---- hurry ----
function sHurry(t){const T=54.3+t;const SP=seaP([0,0,0],0,T,.4);
 if(t<1.9){const k=ease(ss(0,1.9,t));env({...SEA,eye:[lerp(-5.5,-4.8,k),dY(7.6)+lerp(4.6,3.8,k),lerp(3.6,4.4,k)],tgt:[-.6,dY(7.6)+.3,7.4],fov:44,desat:.3});sea();brig(SP,{hatchOpen:1,gHatch:1,flap:.4,torn:1});return;}
 if(t<3.6){const lt=t-1.9,k=ease(ss(0,1.7,lt));env({...SEA,eye:[lerp(4.6,4.2,k),dY(-4)+lerp(2.9,2.5,k),lerp(-.6,-1.2,k)],tgt:[1.4,dY(-4)+.3,-4.0],fov:42,desat:.35});sea();brig(SP,{hatchOpen:1,pumpApart:1,gPump:1,flap:.4});return;}
 const lt=t-3.6,k=ease(ss(0,1.9,lt));env({...SEA,eye:[lerp(9,8,k),lerp(1.6,1.2,k),lerp(-6,-4,k)],tgt:[0,-1,-1],fov:44,clip:[1,0,0,0],desat:.2,shadow:false});sea();brig(xf([0,0,0]),{hatchOpen:1});
 hold(lt,{water:.95+Math.sin(lt*3)*.05});for(let i=0;i<6;i++)draw(SPHL,{p:[0,-.8+Math.sin(lt*3+i)*.04,-7+i*2.8],s:[2.6,.04,1.2],c:[.9,.97,1],a:.35,u:1});}
// ---- theory ----
function sTheory(t){const T=59.8+t;const k=ease(ss(0,2.3,t));const SP=seaP([0,0,0],0,T,.5);env({...SEA,eye:[lerp(14,12,k),lerp(5.5,5,k),lerp(4,1,k)],tgt:[1,2.4,-2.5],fov:44});sea();brig(SP,{boat:0,flap:.4});
 const BP=xf([4.7,Math.sin(T*1.4)*.1,-2.5],[0,-.05,0]);boat(BP,{gold:1});
 lineC(xf([0,0,0]),[3.2,HS.top(.39)-.2,-2.5],[4.6,.6,-.7],.03,[.6,.5,.35]);
 const seated=[[-.35,-1.6],[.35,-1.6],[-.35,-.6],[.35,-.6],[-.35,.4],[.35,.4],[0,1.3]];
 seated.forEach(([x,z],i)=>{if(i>4+Math.floor(t*1.2))return;person(cxf(BP,xf([x,-.2,z],[0,0,0],.85)),Object.assign({seed:20+i,sit:1},i==1?WIFEB:i==2?CAPT:CREW[i%7]));});
 person(onDeck(SP,2.4,-2.5,Math.PI/2),Object.assign({seed:30},CREW[3],{armL:[-2.4,0,.2],armR:[-2.2,0,-.2],elbowL:.4,elbowR:.4,lean:.3}));}
function sSailAway(t){const T=62.1+t;const k=ease(ss(0,2.4,t));env({...SEA,eye:[lerp(-4,-6,k),lerp(2.6,3.2,k),lerp(-30,-34,k)],tgt:[0,3,lerp(4,10,k)],fov:42,desat:.25});sea();
 brig({...seaP([lerp(4,7,t/2.4),0,lerp(6,16,t/2.4)],-.15,T),gold:1},{flap:.15,foam:.6});
 const BP=xf([-3,Math.sin(T*1.4)*.12,-14],[0,.5,0]);boat(BP,{});for(let i=0;i<7;i++)person(cxf(BP,xf([i%2?.35:-.35,-.2,-1.6+Math.floor(i/2)*.95],[0,0,0],.85)),Object.assign({seed:40+i,sit:1,head:[0,.3,0]},i==0?CAPT:i==1?WIFEB:CREW[i%7]));}
function sAlone(t){const T=64.5+t;const k=ease(ss(0,3.6,t));env({...SEA,fog:[.82,.86,.9],fogD:lerp(.004,.011,k),skyTop:[.5,.6,.75],clouds:.8,eye:[lerp(6,30,k),lerp(4,40,k),lerp(-10,-34,k)],tgt:[0,0,0],fov:40,desat:.45});sea([.14,.34,.48]);
 const BP=xf([0,Math.sin(T*1.4)*.1,0],[0,.4+t*.05,0]);boat(BP,{gold:.6});for(let i=0;i<7;i++)person(cxf(BP,xf([i%2?.35:-.35,-.2,-1.6+Math.floor(i/2)*.95],[0,0,0],.85)),Object.assign({seed:50+i,sit:1},i==0?CAPT:i==1?WIFEB:CREW[i%7],{armL:[-1+Math.sin(T*3+i)*.3,0,0],armR:[-1+Math.sin(T*3+i)*.3,0,0],elbowL:.7,elbowR:.7}));
}
function sArchive(t){env({noSky:1,sky:[.42,.38,.34],gnd:[.24,.2,.17],sunC:[.48,.4,.32],sunD:[-.3,.6,.7],fog:[.14,.12,.1],fogD:.03,eye:[0,1.7,lerp(6.5,5,ease(ss(0,4,t)))],tgt:[0,1.5,0],fov:44,plP:[0,2.5,2],plC:[.8,.6,.35],plR:7});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 brig(xf([0,1.0+.33,1.4],[0,.7+t*.15,0],.06),{});}
// ---- route map overlay (2D) ----
function routeMap(T,t0,t1){if(T<t0||T>t1)return;const a=Math.min(ss(t0,t0+.35,T),1-ss(t1-.3,t1,T));const X=70,Y=330,w=940,h=520;const lo0=-80,lo1=14,la0=26,la1=50;
 const px=lo=>X+(lo-lo0)/(lo1-lo0)*w,py=la=>Y+(la1-la)/(la1-la0)*h;cx.save();cx.globalAlpha=a;cx.shadowColor='rgba(0,0,0,.4)';cx.shadowBlur=24;rrect(X-14,Y-14,w+28,h+28,16);cx.fillStyle=PARCH;cx.fill();cx.shadowColor='transparent';
 cx.save();rrect(X,Y,w,h,10);cx.clip();cx.fillStyle='#9cc7e0';cx.fillRect(X,Y,w,h);cx.fillStyle='#d9c99c';cx.strokeStyle='#7a6440';cx.lineWidth=2;
 LAND.forEach(poly=>{cx.beginPath();poly.forEach(([lo,la],i)=>{const x=px(lo),y=py(la);i?cx.lineTo(x,y):cx.moveTo(x,y);});cx.closePath();cx.fill();cx.stroke();});
 const R=[[-74,40.6],[-60,40],[-45,38.6],[-25.1,36.9],[-12,36.2],[-5.6,36],[2,38.5],[8.9,44.4]];const prog=ss(t0+.3,t1-.6,T);let tot=0;const seg=[];for(let i=1;i<R.length;i++){const d=Math.hypot(px(R[i][0])-px(R[i-1][0]),py(R[i][1])-py(R[i-1][1]));seg.push(d);tot+=d;}
 cx.strokeStyle=GOLD;cx.lineWidth=7;cx.setLineDash([18,12]);cx.lineCap='round';cx.beginPath();cx.moveTo(px(R[0][0]),py(R[0][1]));let acc=0,tip=[px(R[0][0]),py(R[0][1])];
 for(let i=1;i<R.length;i++){const need=prog*tot-acc;if(need<=0)break;const f=Math.min(1,need/seg[i-1]);tip=[lerp(px(R[i-1][0]),px(R[i][0]),f),lerp(py(R[i-1][1]),py(R[i][1]),f)];cx.lineTo(tip[0],tip[1]);acc+=seg[i-1];}
 cx.stroke();cx.setLineDash([]);cx.beginPath();cx.arc(tip[0],tip[1],11,0,Math.PI*2);cx.fillStyle=GOLD;cx.fill();cx.strokeStyle=INK;cx.lineWidth=3;cx.stroke();
 const lab=(txt,lo,la,dx,dy,al)=>{const x=px(lo),y=py(la);cx.beginPath();cx.arc(x,y,9,0,Math.PI*2);cx.fillStyle=INK;cx.fill();cx.font=`700 34px ${CF}`;cx.textAlign=al||'left';cx.textBaseline='middle';cx.lineWidth=7;cx.strokeStyle='rgba(239,227,200,.9)';cx.strokeText(txt,x+dx,y+dy);cx.fillStyle=INK;cx.fillText(txt,x+dx,y+dy);};
 lab('NEW YORK',-74,40.7,16,-30);if(prog>.95)lab('GENOA',8.9,44.4,-14,-32,'right');cx.restore();
 cx.font=`700 30px ${CF}`;cx.fillStyle='#9a6a12';cx.textAlign='center';cx.fillText('ATLANTIC OCEAN',X+w*.48,Y+h*.62);cx.restore();}
// ---- timeline ----
function sDbg(t){env({...SEA,eye:[3,2.2,3],tgt:[0,.6,0],fov:40});sea();const BP=xf([0,0,0]);boat(xf([1.5,.5,0]),{a:.6,hull:[1,.85,.45]});draw(SPHL,{p:[-1,1,0],s:[.5,.5,.5],c:[1,.8,.4],a:.5,u:1});for(let i=0;i<3;i++)person(cxf(BP,xf([i%2?.35:-.35,-.2,-1.6+i*.95],[0,0,0],.85)),Object.assign({seed:40+i,sit:1,head:[0,.3,0]},i==0?CAPT:i==1?WIFEB:CREW[i%7]));}
const S=[[0,2.36,sGlobe],[2.36,5.7,sHook],[5.7,9.1,sSails],[9.1,11.4,sEmpty],[11.4,13.3,sShipPlinth],[13.3,18.2,sNY],[18.2,21.3,sCargo],[21.3,24.3,sBriggs],[24.3,27.8,sFamily],[27.8,31.4,sDei],[31.4,34.3,sStrange],[34.3,36.8,sBoard],[36.8,41.3,sCabin],[41.3,48.4,sMissing],[48.4,54.3,sLog],[54.3,59.8,sHurry],[59.8,62.1,sTheory],[62.1,64.5,sSailAway],[64.5,68.1,sAlone],[68.1,76.0,sArchive]];
const END=76.0;
const RIB=[[13.4,.12,'7 NOV 1872'],[28.0,.9,'4 DEC 1872'],[49.6,.62,'25 NOV 1872'],[53.2,.9,'4 DEC 1872']];
function overlays(T,fn,lt){
 badge('ATLANTIC','NEAR THE AZORES · 1872',LON,LAT,T,ss(2.2,2.8,T)*(1-ss(67.8,68.2,T)));
 ribbon(T,RIB,['NOV 1872','DEC 1872'],ss(13.3,13.8,T)*(1-ss(67.6,68,T))*(1-ss(15,15.3,T)+ss(18,18.3,T)));
 if(fn===sGlobe)tag('ATLANTIC OCEAN · 1872',W/2,1180,1.2,2.36,T);
 if(fn===sEmpty)bigText([['NO ONE',96,PARCH],['ABOARD.',96,GOLD]],9.25,11.35,T,430);
 if(fn===sHook)tag('ADRIFT',W/2,420,2.8,5.6,T);
 if(fn===sSails&&lt>1.42)tag('CARGO UNTOUCHED',W/2,420,7.3,9.0,T);
 seal(1,'THE VOYAGE',13.35,T);seal(2,'THE DISCOVERY',27.85,T);seal(3,'THE CLUES',41.35,T);
 if(fn===sShipPlinth)museum('MARY CELESTE','American brigantine','BUILT 1861',540,1000,11.6,13.25,T,'r');
 routeMap(T,15.0,18.15);
 if(fn===sCargo)tag('ALCOHOL',W/2,420,18.5,21.2,T);
 if(fn===sBriggs)museum('BENJAMIN BRIGGS','Captain','1835–1872',540,1000,21.6,24.2,T,'r');
 if(fn===sFamily){tag(T<25.3?'HIS WIFE':T<26.4?'THEIR DAUGHTER':'7 CREW',W/2,420,24.4,27.7,T);}
 if(fn===sDei){tag('DEI GRATIA',W/2,420,29.1,31.3,T);tag('NEAR THE AZORES',W/2,510,29.4,31.3,T,{size:32,f:MF});}
 if(fn===sStrange){if(lt<1.4){tag('MARY CELESTE',W/2,420,31.6,32.75,T);}else tag('NO ONE AT THE WHEEL',W/2,420,32.9,34.2,T);}
 if(fn===sBoard)tag('BOARDING PARTY',W/2,420,34.5,36.7,T);
 if(fn===sCabin){if(lt<2.3)tag('FOOD & WATER: STILL HERE',W/2,420,37.0,39.0,T,{size:38});else tag('BELONGINGS: LEFT BEHIND',W/2,420,39.2,41.2,T,{size:38});}
 if(fn===sMissing){if(T>43.2&&T<44.55)tag('1 · SHIP\'S PAPERS',W/2,420,43.2,44.55,T);if(T>44.6&&T<46.75)tag('2 · NAVIGATION TOOLS',W/2,420,44.6,46.75,T);if(T>46.8)tag('3 · THE ONLY LIFEBOAT',W/2,420,46.8,48.35,T);}
 if(fn===sLog){if(T<51.8)tag('THE LAST LOG ENTRY',W/2,420,48.6,51.8,T);else tag('9 DAYS BEFORE SHE WAS FOUND',W/2,420,51.9,54.2,T,{size:38});}
 if(fn===sHurry){if(lt<1.9)tag('HATCHES LEFT OPEN',W/2,420,54.4,56.1,T);else if(lt<3.6)tag('PUMP TAKEN APART',W/2,420,56.3,57.8,T);else tag('WATER IN THE HOLD',W/2,420,58.0,59.7,T);}
 if(fn===sTheory)tag('A THEORY',W/2,420,59.9,62.0,T);
 if(fn===sSailAway)tag('THE SHIP STAYED AFLOAT',W/2,420,62.3,64.4,T,{size:38});
 if(fn===sAlone)bigText([['NEVER',92,PARCH],['SEEN AGAIN.',86,GOLD]],66.6,68.05,T,430);
 if(fn===sArchive){archiveCard([['MARY CELESTE · 1885'],'Years later, a new captain','crashed her into a reef near Haiti','on purpose, to cheat his insurance.'],68.4,T);outro(73.4,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);flFree();
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
