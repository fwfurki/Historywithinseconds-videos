// ===== THE CARRINGTON EVENT (1859) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
const FLM=[];function flFree(){while(FLM.length){const m=FLM.pop();gl.deleteVertexArray(m.vao);gl.deleteBuffer(m.pb);gl.deleteBuffer(m.nb);gl.deleteBuffer(m.ib);}}
function gridMesh(V,both,eps){const ni=V.length,nj=V[0].length;const P=[],N=[],I=[];
 const nrm=(i,j)=>{const a=V[Math.min(ni-1,i+1)][j],b=V[Math.max(0,i-1)][j],c=V[i][Math.min(nj-1,j+1)],d=V[i][Math.max(0,j-1)];return norm(cross(sub(a,b),sub(c,d)));};
 for(const side of both?[1,-1]:[1]){const base=P.length/3;for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const n=nrm(i,j);const v=V[i][j];const e=side<0?(eps||.012):0;P.push(v[0]-n[0]*e,v[1]-n[1]*e,v[2]-n[2]*e);N.push(n[0]*side,n[1]*side,n[2]*side);}
  for(let i=0;i<ni-1;i++)for(let j=0;j<nj-1;j++){const a=base+i*nj+j,b=a+nj,c=b+1,d=a+1;if(side>0)I.push(a,b,c,a,c,d);else I.push(a,c,b,a,d,c);}}
 return mesh(P,N,I);}
function lineC(P,a,b,r,c,o){const d=sub(b,a),L=Math.hypot(...d)||1e-4;draw(CYL,Object.assign({P,p:a,r:[Math.acos(clamp(d[1]/L,-1,1)),Math.atan2(d[0],d[2]),0],s:[r,L,r],c:c||[.15,.12,.1],noShadow:1},o||{}));}
// ---------- environments ----------
const DAYE={sky:[.7,.75,.85],gnd:[.46,.45,.42],sunC:[.62,.58,.5],sunD:[-.4,.8,.45],fog:[.8,.86,.94],fogD:.004,skyTop:[.3,.5,.86],clouds:.45};
function NIGHT(o){const r=Object.assign({noSky:1,sky:[.46,.44,.6],gnd:[.32,.34,.34],sunC:[.5,.56,.62],sunD:[.2,.85,-.3],fog:[.3,.2,.34],fogD:.0016,bloom:1},o||{});r.sky=[.46,.44,.6];r.skyTop=undefined;return r;}
const SKYB=[[.36,.2,.36],[.3,.17,.33],[.22,.14,.3],[.15,.12,.27],[.1,.1,.23],[.07,.08,.19],[.05,.07,.16],[.04,.06,.14]];
function nightDome(c){const C=c||[0,0,0];SKYB.forEach((col,i)=>draw(TUBE,{p:[C[0],-30+i*42,C[2]],s:[390,42.5,390],c:col,u:1,id:0,noInk:1,noShadow:1}));draw(CYL,{p:[C[0],306,C[2]],s:[392,1,392],c:[.035,.05,.13],u:1,id:0,noInk:1,noShadow:1});}
const SPACE={bg:[.015,.02,.05],fog:[.015,.02,.05],fogD:0,sky:[.4,.4,.45],gnd:[.15,.15,.2],sunC:[.6,.55,.5],sunD:[-.8,.3,.5],shadow:false,bloom:1};
function stars(n,R,y0){if(!R)nightDome();for(let i=0;i<(n||160);i++){const a=i*2.39996,e=.08+((i*.618)%1)*.85;const r=R||300;draw(SPHL,{p:[Math.cos(a)*r*Math.cos(e),(y0||0)+Math.sin(e)*r,Math.sin(a)*r*Math.cos(e)],s:[.5,.5,.5].map(v=>v*(r/300)*(.6+.8*((i*7)%5)/5)),c:[1,1,.95],u:1,id:0,noShadow:1});}}
// aurora curtains (static meshes, animated by transform)
const AUR=[0,1,2].map(k=>{const mk=(y0,h,sk)=>{const V=[];for(let i=0;i<=70;i++){const s=i/70;const x=(s-.5)*420,z=Math.sin(s*9+k*2)*22+Math.sin(s*23+k)*6;const hh=h*(0.75+.25*Math.sin(s*13+k*3));V.push([[x,y0+(sk?hh*sk:0),z],[x,y0+hh,z+3]]);}return gridMesh(V,0);};
 return{b:[mk(0,10),mk(6,22),mk(18,30),mk(34,26)],r:[mk(46,26),mk(60,30)]};});
function aurora(t,o){o=o||{};const I=o.I===undefined?1:o.I;const C=o.c||[0,40,-200];const ry=o.ry||0;
 AUR.forEach((A,k)=>{const P=xf([C[0]+Math.sin(t*.35+k)*8+k*30-30,C[1]+k*6,C[2]-k*40],[0,ry+Math.sin(t*.2+k)*.05,0]);const fl=.75+.25*Math.sin(t*1.7+k*2);
  const ga=[.07,.12,.12,.08];A.b.forEach((m,j)=>draw(m,{P,c:[.35,1,.55],a:ga[j]*I*fl,u:1,add:1,id:0,noShadow:1,noInk:1}));const ra=[.1,.06];A.r.forEach((m,j)=>draw(m,{P,c:[1,.3,.45],a:ra[j]*I*fl,u:1,add:1,id:0,noShadow:1,noInk:1}));});}
// ---------- sun ----------
function sun(P,t,o){o=o||{};const g=o.flare||0;draw(SPH,{P,s:[1,1,1],c:[1,.58,.16],e:[.5,.22,.02],id:0,pat:6,patS:6});draw(SPH,{P,s:[1.05,1.05,1.05],c:[1,.55,.12],a:.25,u:1,id:0});draw(SPH,{P,s:[1.18,1.18,1.18],c:[1,.45,.08],a:.1,u:1,id:0});
 const spots=[[.3,.25,.09],[.42,.18,.05],[.2,.32,.04],[-.35,-.1,.07],[-.28,-.16,.04],[.05,-.4,.05]];
 spots.forEach(([x,y,r])=>{const z=Math.sqrt(Math.max(0,1-x*x-y*y));const n=[x,y,z];const a=Math.atan2(x,z),b=-Math.asin(y);draw(SPH,{P,p:n.map(v=>v*1.0),r:[b,a,0],s:[r,r,.01],c:[.25,.1,.02],u:1,id:0});draw(SPH,{P,p:n.map(v=>v*1.001),r:[b,a,0],s:[r*1.7,r*1.7,.008],c:[.75,.35,.08],u:1,id:0});});
 if(g>0){for(const[x,y]of[[.33,.2],[.38,.27]]){const z=Math.sqrt(1-x*x-y*y);draw(SPH,{P,p:[x*1.01,y*1.01,z*1.01],s:[.045*g,.045*g,.045*g],c:[1,1,1],u:1,id:0});draw(SPH,{P,p:[x*1.005,y*1.005,z*1.005],s:[.09*g,.09*g,.09*g],c:[1,.95,.75],a:.45*g,u:1,id:0});}}
 if(o.erupt>0){const e=o.erupt;for(let i=0;i<40;i++){const ph=((i*.137)+e*.6)%1;const a=i*2.4;const d=1+ph*2.2*e;draw(SPHL,{P,p:[.35+Math.cos(a)*ph*.4+d*.25,.22+Math.sin(a)*ph*.4+d*.15,.88+d*.5],s:[.05+ph*.08,.05+ph*.08,.05+ph*.08],c:[1,.62+.3*(1-ph),.2],a:(1-ph)*.85,u:1,id:0});}}}
// ---------- people ----------
const CARR={coat:[.16,.15,.18],pants:[.2,.19,.22],moustache:1,hair:HAIRS[2],tie:[.12,.1,.1],shirt:[.94,.93,.9],seed:1};
const OP={coat:[.3,.28,.3],jacket:false,shirt:[.9,.88,.8],sleeve:[.9,.88,.8],pants:[.22,.2,.22],moustache:1,hair:HAIRS[0],tie:[.15,.1,.1],seed:5};
const MINER=[{coat:[.55,.3,.2],jacket:false,shirt:[.62,.25,.2],hat:'flat',hatc:[.35,.28,.2],beard:0,moustache:1,hair:HAIRS[0]},{coat:[.3,.35,.5],jacket:false,shirt:[.3,.35,.5],hat:'bowler',hatc:[.25,.2,.16],hair:HAIRS[2]},{coat:[.45,.4,.3],hat:'none',hair:HAIRS[1],moustache:1},{coat:[.25,.3,.25],jacket:false,shirt:[.75,.7,.55],hat:'flat',hatc:[.3,.3,.3]}];
// ---------- globe ----------
const LON=-0.17,LAT=51.24;
function sGlobe(t){const k=ease(ss(0,1.6,t));env({eye:[0,0,lerp(5.4,3.3,k)],tgt:[0,0,0],fov:40,bg:[.055,.105,.17],fog:[.055,.105,.17],fogD:0,sky:[.9,.9,.95],gnd:[.55,.55,.6],sunC:[.45,.45,.45],sunD:[-.3,.4,.9],ink:.8,inkFar:50});
 globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.6,ss(.9,1.4,t));for(let i=0;i<80;i++){const a=i*2.39,e=(i*.618)%1;draw(SPHL,{p:[Math.cos(a)*40,(e-.5)*70,-30+Math.sin(a)*10],s:[.08,.08,.08],c:[1,1,1],u:1,id:0});}}
// ---------- town (night) ----------
function flatHF(x,z){return 0;}
const TOWN=(()=>{const L=[];for(let i=0;i<7;i++)for(const sd of[-1,1])L.push([sd*(9+(i%2)*.6),-8-i*8,i]);return L;})();
function town(o){o=o||{};draw(BOX,{p:[0,-.5,-40],s:[300,1,300],c:o.ground||[.38,.46,.32],pat:1,patS:1.2});road(0,10,0,-80,6,null,[.5,.44,.36]);
 TOWN.forEach(([x,z,i])=>house(xf([x,0,z],[0,x<0?Math.PI/2:-Math.PI/2,0]),{w:5,d:6,floors:i%3?2:1,style:i%3==0?'brick':i%3==1?'wood':'plaster',wall:[[.8,.55,.42],[.86,.8,.68],[.66,.72,.78]][i%3],roof:[[.36,.3,.3],[.3,.34,.4]][i%2]}));
 for(let i=0;i<6;i++){lamppost(xf([i%2?4:-4,0,-4-i*11]),1);}for(let i=0;i<6;i++)tree(xf([(i%2?1:-1)*15,0,-12-i*12]),.9,null,i%3?'broad':'pine');
 for(let i=0;i<4;i++)fence(xf([i%2?6.5:-6.5,0,-2-i*14],[0,Math.PI/2,0]),5);}
function sHookSky(t){const T=1.76+t;const k=ease(ss(0,1.95,t));env(NIGHT({eye:[lerp(1,0,k),lerp(1.8,1.6,k),lerp(8,5,k)],tgt:[0,lerp(6,10,k),-30],fov:50,sky:[.42,.16,.24],skyTop:[.06,.1,.2]}));stars();aurora(T,{I:1.2,c:[0,30,-160]});town();
 for(let i=0;i<4;i++)person(xf([-1.8+i*1.2,0,-1-i%2*.8],[0,Math.PI+(i-1.5)*.15,0]),Object.assign({seed:i+2,head:[-.55,0,0]},i==1?{dress:[.4,.3,.5],hairStyle:'bun'}:{coat:[[.3,.3,.35],[.4,.3,.2],[.25,.3,.4],[.5,.25,.2]][i],hat:['bowler','none','flat','bowler'][i]},i==2?{armR:[-2.6,0,-.3],elbowR:.1}:{}));}
// ---------- telegraph office ----------
function office(t,o){o=o||{};const fd=Math.hypot(o.tgt[0]-o.eye[0],o.tgt[1]-o.eye[1],o.tgt[2]-o.eye[2]);
 env({dof:[fd,fd*.45],noSky:1,sky:[.6,.56,.54],gnd:[.36,.33,.3],sunC:[.48,.45,.42],sunD:[.7,.5,.3],fog:[.25,.22,.22],fogD:.01,eye:o.eye,tgt:o.tgt,fov:o.fov||42,plP:[1.4,2.4,0],plC:[1,.75,.45].map(v=>v*(o.glow||1)),plR:7,desat:o.desat||0,bloom:1});
 draw(BOX,{p:[0,-.05,0],s:[8,.1,8],c:[.48,.35,.23],pat:2,patS:2});draw(BOX,{p:[-3,1.6,0],s:[.1,3.2,8],c:[.62,.6,.52],pat:6,patS:2});draw(BOX,{p:[0,1.6,-3],s:[8,3.2,.1],c:[.6,.56,.48],pat:6,patS:2});draw(BOX,{p:[-2.94,.55,0],s:[.04,1.1,8],c:[.42,.3,.2],pat:2,patS:3});draw(BOX,{p:[0,.55,-2.94],s:[8,1.1,.04],c:[.42,.3,.2],pat:2,patS:3});
 draw(BOX,{p:[3,.5,0],s:[.1,1,8],c:[.6,.55,.45]});draw(BOX,{p:[3,2.9,0],s:[.1,.6,8],c:[.6,.55,.45]});for(const z of[-3,-1.3,1.3,3])draw(BOX,{p:[3,1.6,z],s:[.1,2.2,.25],c:[.6,.55,.45]});
 // window: night sky with aurora colours
 draw(BOX,{p:[3.4,1.6,0],s:[.1,2.2,6],c:[.12,.1,.24],u:1,id:0});draw(BOX,{p:[3.36,1.25,0],s:[.04,.5,6],c:[.25,.8,.5],u:1,id:0,a:.55});draw(BOX,{p:[3.36,1.95,0],s:[.04,.6,6],c:[.75,.25,.4],u:1,id:0,a:.45});
 // ceiling lamp
 draw(CYL,{p:[.8,2.6,.2],s:[.015,.6,.015],c:[.2,.2,.2]});draw(FR,{p:[.8,2.45,.2],r:[Math.PI,0,0],s:[.22,.18,.22],c:[.25,.4,.3],g:.5});draw(SPH,{p:[.8,2.25,.2],s:[.07,.07,.07],c:[1,.9,.6],u:1});
 // desk
 draw(BOX,{p:[1.5,.8,0],s:[1.2,.08,2.6],c:[.5,.32,.18],pat:2,patS:4,g:.4});for(const[x,z]of[[1,-1.2],[2,-1.2],[1,1.2],[2,1.2]])draw(BOX,{p:[x,.4,z],s:[.08,.8,.08],c:[.4,.26,.15]});
 // telegraph key + sounder
 const tap=o.tap?Math.max(0,Math.sin(t*(o.wild?40:22)))*(Math.sin(t*3.1)>-.3||o.wild?1:0):0;const gk=o.gk||0;
 draw(BOX,{p:[1.5,.88,.2],s:[.35,.06,.2],c:[.3,.2,.12],gold:gk});draw(BOX,{p:[1.45,.95-tap*.03,.2],r:[0,0,-tap*.1],s:[.3,.03,.05],c:[.75,.6,.3],g:.7,gold:gk});draw(SPH,{p:[1.32,.98-tap*.03,.2],s:[.05,.03,.05],c:[.1,.1,.1],gold:gk});
 draw(BOX,{p:[1.6,.95,-.5],s:[.3,.15,.2],c:[.6,.5,.3],g:.6,gold:gk});draw(BOX,{p:[1.6,1.06+tap*.02,-.5],s:[.26,.03,.06],c:[.75,.6,.3],g:.7,gold:gk});
 // paper tape / message slips
 draw(BOX,{p:[1.2,.86,.75],s:[.5,.02,.35],c:[.95,.93,.85]});
 // battery jars (glass) on shelf at desk end
 const gb=o.gb||0;for(let i=0;i<4;i++){const z=-1.05+i*.0;const x=1.2+i*.18;draw(CYL,{p:[x,.84,-1.0],s:[.07,.2,.07],c:[.75,.88,.9],a:.7,g:.8,gold:gb});draw(CYL,{p:[x,.84,-1.0],s:[.05,.15,.05],c:[.35,.55,.6],gold:gb});draw(CYL,{p:[x,1.04,-1.0],s:[.012,.06,.012],c:[.7,.5,.3],gold:gb});}
 if(!o.unplug){for(let i=0;i<2;i++)lineC(xf([0,0,0]),[1.2+i*.54,1.08,-1.0],[1.55,.98,-.5],.008,[.15,.1,.08]);}
 else{const u=o.unplug;for(let i=0;i<2;i++)lineC(xf([0,0,0]),[lerp(1.2+i*.54,1.05+i*.7,u),lerp(1.08,.86,u),lerp(-1.0,-1.25,u)],[1.55,.98,-.5],.008,[.15,.1,.08]);}
 // wires leaving through wall
 lineC(xf([0,0,0]),[1.6,1.0,-.5],[2.95,2.7,-.6],.01,[.15,.1,.08]);lineC(xf([0,0,0]),[1.62,1.0,-.48],[2.95,2.75,-.4],.01,[.15,.1,.08]);
 // wall clock
 const CL=xf([.2,2.25,-2.9]);draw(CYL,{P:CL,r:[Math.PI/2,0,0],s:[.32,.06,.32],c:[.45,.3,.15],gold:o.gClock||0});clockTex(o.clockH===undefined?3.1:o.clockH);dynTex('clk',CLK);draw(QUAD,{P:CL,p:[0,0,.065],s:[.56,.56,1],c:[1,1,1],tex:3,u:1});
 for(let i=0;i<5;i++)draw(BOX,{p:[-2.9,1.2+i*.35,-1.5],s:[.2,.25,.6],c:[.5,.4,.3]});
 if(o.sparks>0){const sp=o.sparks;for(let i=0;i<30;i++){const ph=((t*1.8+i*.071)%1);const a=i*2.4;const src=i%2?[1.6,1.05,-.5]:[1.45,.98,.2];draw(SPHL,{p:[src[0]+Math.cos(a)*ph*.7,src[1]+ph*.6-ph*ph*1.2,src[2]+Math.sin(a)*ph*.7],s:[.012,.012,.012],c:[1,.9,.55],u:1,a:(1-ph)*sp});}
  for(const src of[[1.6,1.05,-.5],[1.45,.98,.2]]){const f=.5+.5*Math.sin(t*37+src[2]*9);draw(SPH,{p:src,s:[.035*f*sp,.035*f*sp,.035*f*sp],c:[.85,.92,1],u:1,id:0});}}}
const CLK=document.createElement('canvas');CLK.width=256;CLK.height=256;function clockTex(h){const g=CLK.getContext('2d');g.fillStyle='#f3ead6';g.beginPath();g.arc(128,128,124,0,Math.PI*2);g.fill();g.strokeStyle='#3a2a18';g.lineWidth=6;g.stroke();
 g.fillStyle='#2a1e12';g.font='700 34px "DejaVu Serif"';g.textAlign='center';g.textBaseline='middle';const R=['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI'];for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.font=`700 ${i%3?20:28}px "DejaVu Serif"`;g.fillText(R[i],128+Math.sin(a)*96,128-Math.cos(a)*96);}
 const ha=h/12*Math.PI*2,ma=(h%1)*Math.PI*2;g.lineCap='round';g.strokeStyle='#1a120a';g.lineWidth=9;g.beginPath();g.moveTo(128,128);g.lineTo(128+Math.sin(ha)*55,128-Math.cos(ha)*55);g.stroke();g.lineWidth=5;g.beginPath();g.moveTo(128,128);g.lineTo(128+Math.sin(ma)*86,128-Math.cos(ma)*86);g.stroke();g.fillStyle='#b8862a';g.beginPath();g.arc(128,128,8,0,Math.PI*2);g.fill();}
function sNoPower(t){const T=3.7+t;if(t<1.9){const k=ease(ss(0,1.9,t));office(t,{eye:[lerp(.1,.3,k),1.65,lerp(2.6,2.2,k)],tgt:[1.4,1.0,-.2],tap:1,wild:1,gk:1,unplug:1,gb:.6,sparks:.6});person(xf([.35,0,.9],[0,Math.PI/2+.9,0]),Object.assign({},OP,{worry:1,mouthO:1,armL:[-.3,0,-.4],armR:[-.3,0,.4],elbowL:.6,elbowR:.6,head:[0,-.3,0]}));return;}
 const lt=t-1.9,k=ease(ss(0,1.75,lt));office(t,{eye:[lerp(.4,.6,k),lerp(1.35,1.25,k),lerp(-1.6,-1.4,k)],tgt:[1.4,.95,-.6],fov:40,tap:1,wild:1,gk:1,unplug:1,gb:1,sparks:.4});}
// ---------- England / observatory ----------
function engHF(x,z){return .4*Math.sin(x*.05)*Math.cos(z*.04)+Math.max(0,(-z-40)*.08);}
let GK='';function engGround(){if(GK!=='E'){setGrid(-120,120,-160,80,engHF);GK='E';}draw(GRID,{c:[.46,.64,.36],pat:1,patS:1.2});}
function observatoryDome(P){draw(CYL,{P,p:[0,0,0],s:[2.2,2.4,2.2],c:[.88,.86,.8],pat:6,patS:2});draw(SPH,{P,p:[0,2.4,0],s:[2.3,2.1,2.3],c:[.75,.78,.8],g:.6});draw(BOX,{P,p:[0,3.6,1.3],r:[-.6,0,0],s:[.7,2.2,.3],c:[.2,.22,.26]});draw(CYL,{P,p:[.9,3.2,1.5],r:[-.9,0,0],s:[.12,1.5,.12],c:[.3,.3,.32]});}
function sEngland(t){const k=ease(ss(0,2.5,t));env({...DAYE,eye:[lerp(-22,-14,k),lerp(7,5,k),lerp(20,15,k)],tgt:[0,3,0],fov:42});engGround();
 house(xf([-3,groundY(engHF,-3,0,7,6),0],[0,.3,0]),{w:7,d:6,floors:2,style:'brick',wall:[.78,.52,.4],roof:[.3,.32,.38]});observatoryDome(xf([5,groundY(engHF,5,2,4,4),2],[0,-.5,0]));
 for(let i=0;i<10;i++)tree(xf([-30+i*7,engHF(-30+i*7,-25),-25-(i%3)*6]),1,null,i%3?'broad':'pine');fence(xf([0,engHF(0,9),9]),20);for(let i=0;i<5;i++)bush(xf([-8+i*3.5,engHF(-8+i*3.5,7),7]),.8);road(-30,12,30,12,3.5,engHF);}
function plinth(fig,t,o){o=o||{};const a=.6+t*.18;env({noSky:1,sky:[.6,.57,.54],gnd:[.3,.27,.24],sunC:[.5,.47,.42],sunD:[-.3,.8,.6],fog:[.16,.15,.17],fogD:.016,eye:[Math.sin(a)*o.r,o.h,Math.cos(a)*o.r],tgt:[0,o.ty,0],fov:40,dof:[Math.hypot(o.r,o.h-o.ty),o.r*.4],plP:[1.5,5,3],plC:[.9,.78,.55],plR:14,desat:.2});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.4,.3,.22],pat:2,patS:1.2,g:.3});for(let i=-3;i<=3;i++)draw(BOX,{p:[i*4,3,-9],s:[3.6,6,.3],c:[.36,.3,.3],pat:6,patS:1});draw(BOX,{p:[0,6.2,-9],s:[30,.3,.5],c:[.6,.46,.22]});
 const pr=o.pr||1.4,ph=o.ph||1;draw(CYL,{p:[0,0,0],s:[pr,ph,pr],c:[.78,.74,.68],pat:6,patS:3,g:.3});draw(CYL,{p:[0,ph,0],s:[pr*1.1,.12,pr*1.1],c:[.86,.82,.76],pat:6,patS:3,g:.3});draw(CYL,{p:[0,0,0],s:[pr*1.12,.1,pr*1.12],c:[.62,.58,.52]});
 fig(cxf(xf([0,ph+.12,0],[0,-t*.35,0]),xf([0,0,0]),{gold:1}));}
function sCarr(t){plinth(P=>person(P,Object.assign({},CARR)),t,{r:3.6,h:2.3,ty:1.95,pr:.9,ph:.9});}
// projection room: telescope projects sun onto a white board
const PJ=document.createElement('canvas');PJ.width=512;PJ.height=512;function projTex(fl,sk){const g=PJ.getContext('2d');g.fillStyle='#f6f2e6';g.fillRect(0,0,512,512);
 const gr=g.createRadialGradient(256,256,20,256,256,200);gr.addColorStop(0,'#fff3c8');gr.addColorStop(1,'#f0c86a');g.fillStyle=gr;g.beginPath();g.arc(256,256,200,0,Math.PI*2);g.fill();g.strokeStyle='rgba(120,80,20,.5)';g.lineWidth=3;g.stroke();
 g.fillStyle='#3a2408';for(const[x,y,r]of[[318,200,16],[340,214,9],[300,190,7],[190,300,13],[176,310,7],[262,360,8]]){g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();}
 g.strokeStyle='rgba(60,40,20,.85)';g.lineWidth=2.5;g.beginPath();g.arc(256,256,200,0,Math.PI*2);g.stroke();
 if(fl>0){for(const[x,y]of[[298,228],[364,252]]){const r=5+fl*11;const gg=g.createRadialGradient(x,y,1,x,y,r*2.2);gg.addColorStop(0,'rgba(255,255,255,1)');gg.addColorStop(.5,'rgba(255,255,255,.9)');gg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gg;g.beginPath();g.arc(x,y,r*2.2,0,Math.PI*2);g.fill();}}}
function projRoom(t,o){const fd=Math.hypot(o.tgt[0]-o.eye[0],o.tgt[1]-o.eye[1],o.tgt[2]-o.eye[2]);
 env({dof:[fd,fd*.5],noSky:1,sky:[.68,.64,.6],gnd:[.4,.36,.32],sunC:[.6,.55,.48],sunD:[-.6,.6,.4],fog:[.3,.27,.25],fogD:.008,eye:o.eye,tgt:o.tgt,fov:o.fov||42,plP:[0,2.6,1],plC:[1,.85,.6],plR:8,desat:o.desat||0});
 draw(BOX,{p:[0,-.05,0],s:[8,.1,8],c:[.5,.36,.22],pat:2,patS:2});draw(BOX,{p:[0,1.6,-3],s:[8,3.2,.1],c:[.7,.66,.56],pat:6,patS:2});draw(BOX,{p:[-3.5,1.6,0],s:[.1,3.2,8],c:[.68,.64,.55],pat:6,patS:2});draw(BOX,{p:[3.5,1.6,0],s:[.1,3.2,8],c:[.68,.64,.55],pat:6,patS:2});
 draw(BOX,{p:[3.42,1.9,-.5],s:[.06,1.0,.8],c:[.9,.95,1],u:1,id:0});// bright window slot
 // telescope on stand pointing at window
 const TP=xf([1.6,1.5,-.5],[0,-Math.PI/2,0]);draw(CYL,{P:TP,p:[0,0,-1.1],r:[Math.PI/2,0,0],s:[.13,2.4,.13],c:[.72,.56,.3],g:.7,gold:o.gT||0});draw(CYL,{P:TP,p:[0,0,1.2],r:[Math.PI/2,0,0],s:[.17,.3,.17],c:[.3,.25,.2]});
 draw(CYL,{p:[1.6,0,-.5],s:[.06,1.45,.06],c:[.25,.22,.2]});for(let i=0;i<3;i++){const a=i*2.1;lineC(xf([0,0,0]),[1.6,1.1,-.5],[1.6+Math.cos(a)*.6,0,-.5+Math.sin(a)*.6],.03,[.3,.25,.2]);}
 // projected beam + board
 draw(CYL,{p:[.85,1.5,-.5],r:[0,0,Math.PI/2],s:[.12,.6,.12],c:[1,.95,.8],a:.18,u:1,add:1,id:0});
 const flare=o.flare||0;projTex(flare);dynTex('proj',PJ);draw(BOX,{p:[-.2,1.5,-.5],s:[.06,1.2,1.2],c:[.85,.82,.75]});draw(QUAD,{p:[-.165,1.5,-.5],r:[0,Math.PI/2,0],s:[1.1,1.1,1],c:[1,1,1],tex:3,u:1,gold:o.gB||0});draw(CYL,{p:[-.2,0,-.5],s:[.05,.95,.05],c:[.3,.25,.2]});
 // sketch desk
 draw(BOX,{p:[-.6,.8,.9],s:[1.0,.06,.7],c:[.5,.32,.18],pat:2,patS:3});draw(BOX,{p:[-.6,.4,.9],s:[.9,.8,.6],c:[.42,.27,.15]});draw(BOX,{p:[-.6,.84,.9],s:[.5,.01,.38],c:[.97,.95,.9]});draw(CYL,{p:[-.45,.84,.95],s:[.12,.002,.12],c:[.3,.25,.2]});
 for(let i=0;i<5;i++)draw(BOX,{p:[-3.4,1.4+i*.3,1],s:[.15,.22,1.2],c:[[.5,.2,.15],[.25,.3,.45],[.4,.35,.2]][i%3]});}
function sProj(t){const T=12.9+t;if(t<2.3){const k=ease(ss(0,2.3,t));projRoom(t,{eye:[lerp(-2.8,-2.2,k),1.8,lerp(2.4,2.2,k)],tgt:[0,1.4,-.2],flare:ss(.3,1.0,t)});
  person(xf([-.95,0,.4],[0,lerp(.6,1.0,ss(.4,1.2,t)),0]),Object.assign({},CARR,{armR:[-1.2,0,-.1],elbowR:.9,head:[-.1,lerp(0,.5,ss(.4,1.2,t)),0],worry:ss(.4,.9,t)>.5?1:0}));return;}
 const lt=t-2.3,k=ease(ss(0,2.06,lt));projRoom(t,{eye:[lerp(1.5,1.3,k),1.68,lerp(-2.0,-1.8,k)],tgt:[-.17,1.5,-.5],fov:30,flare:1});}
// ---------- space ----------
function sSun(t){const k=ease(ss(0,3.8,t));env({...SPACE,eye:[lerp(.4,.9,k),lerp(.2,.4,k),lerp(6.2,5.0,k)],tgt:[.35,.35,0],fov:40,bloom:0});stars(200,120);sun(xf([0,0,0],[0,t*.03,0]),t,{flare:1,erupt:ss(.3,3.8,t)});}
function sCME(t){const T=21.08+t;const k=ease(ss(0,4.8,t));env({...SPACE,eye:[lerp(6,3,k),lerp(2,-2,k),lerp(52,46,k)],tgt:[0,lerp(2,-2,k),0],fov:44,bloom:0});stars(220,200);
 sun(xf([0,15,0],[0,.6,0],5),T,{});const EP=xf([0,-15,0],[.3,0,0],1.6);globe3D(EP,-75,40,T*.25,0);
 for(let i=0;i<6;i++){const a=i/6*Math.PI;draw(TUBE,{p:[0,-15,0],r:[0,a,Math.PI/2],s:[2.9+i%2*.7,.05,2.2+i%2*.5],c:[.55,.8,1],a:.3,u:1,id:0});}
 const u=ss(.2,4.4,t);for(let i=0;i<110;i++){const ph=(i*.6180339)%1;const sp=(i*.37)%1;const f=clamp(u*1.2-ph*.35,0,1);const y=lerp(9.5,-12.5,f);const r=.6+5*f;const a=i*2.39;
  if(f>0&&f<1)draw(SPHL,{p:[Math.cos(a)*r*sp,y+Math.sin(a*1.7)*.8,Math.sin(a)*r*sp],s:[.22,.22,.22],c:i%3?[1,.66,.22]:[1,.85,.45],u:1,id:0});}
 if(u>.9){const f=ss(.9,1,u);for(const yy of[-12.9,-17.1])draw(SPH,{p:[0,yy,0],s:[1.4*f,.25*f,1.4*f],c:[.35,1,.55],a:.5*f,u:1,id:0});}}
// ---------- aurora: town + Cuba ----------
function sAurora(t){const T=25.91+t;const k=ease(ss(0,3.7,t));env(NIGHT({eye:[lerp(14,10,k),lerp(14,10,k),lerp(20,14,k)],tgt:[0,lerp(10,16,k),-40],fov:44,sky:[.45,.2,.3],skyTop:[.08,.14,.26]}));stars();aurora(T,{I:1.3,c:[0,25,-170]});town();
 for(let i=0;i<5;i++)person(xf([-2+i*1.1,0,2-i%2],[0,Math.PI,0]),Object.assign({seed:10+i,head:[-.5,0,0]},i%2?{dress:[.45,.3,.4],hairStyle:'bun'}:{coat:[.3,.3,.35],hat:'bowler'},i==2?{armR:[-2.6,0,-.3],elbowR:.1}:{}));}
function sCuba(t){const T=29.6+t;const k=ease(ss(0,1.9,t));env(NIGHT({eye:[lerp(8,6,k),lerp(2.5,2.2,k),lerp(10,8,k)],tgt:[0,lerp(6,9,k),-30],fov:46,sky:[.5,.18,.28],skyTop:[.08,.12,.26]}));stars();aurora(T,{I:.9,c:[0,45,-200]});
 draw(BOX,{p:[0,-.5,-30],s:[300,1,300],c:[.62,.58,.42],pat:7,patS:1.4});draw(BOX,{p:[0,-.45,-80],s:[300,1,60],c:[.1,.25,.4],pat:5,patS:.4,g:.6});
 for(let i=0;i<5;i++)house(xf([-12+i*6,0,-12-(i%2)*3],[0,0,0]),{w:4.5,d:4.5,floors:1,style:'plaster',wall:[[.95,.9,.78],[.9,.75,.6],[.8,.88,.92]][i%3],roof:[.7,.35,.25]});
 for(let i=0;i<7;i++)palm(xf([-14+i*5,0,-4-(i%2)*4],[0,i,0]),1.3);
 for(let i=0;i<3;i++)person(xf([-1+i*1.2,0,1],[0,Math.PI,0]),Object.assign({seed:20+i,head:[-.5,0,0],skin:SKINS[1+i%2]},i==1?{dress:[.9,.85,.7],hairStyle:'bun'}:{coat:[.9,.88,.8],jacket:false,shirt:[.92,.9,.82],hat:'flat',hatc:[.8,.7,.45]},i==0?{armR:[-2.6,0,-.3],elbowR:.1}:{}));}
// ---------- Rocky Mountain miners ----------
function mtHF(x,z){const r=Math.hypot(x,z);return r<14?0:Math.min(14,(r-14)*.22)*(.7+.3*Math.sin(x*.07+z*.05))+Math.max(0,(-z-70))*.2;}
function camp(t,o){o=o||{};if(GK!=='M'){setGrid(-140,140,-180,100,mtHF);GK='M';}draw(GRID,{c:[.36,.42,.3],pat:1,patS:1.1});
 for(let i=0;i<26;i++){const a=i*2.4,r=16+((i*7)%11)*2.2;const x=Math.cos(a)*r,z=Math.sin(a)*r-6;tree(xf([x,mtHF(x,z)-.1,z]),1.1+((i*3)%4)*.12,[.16,.32,.2],'pine');}
 // snow caps far
 for(let i=0;i<5;i++)draw(CONE,{p:[-80+i*40,10,-150],s:[30,45+i%2*10,22],c:[.4,.42,.5],pat:6,patS:.3});for(let i=0;i<5;i++)draw(CONE,{p:[-80+i*40,38+i%2*10,-150],s:[11,17,8],c:[.92,.94,.98]});
 // tents
 for(const[x,z,r]of[[-4,-3,.4],[4,-4,-.3],[-1,-7,0]]){draw(PRISM,{p:[x,0,z],r:[0,r,0],s:[2.6,1.9,3],c:[.88,.84,.72]});draw(CYL,{p:[x,0,z],r:[0,0,0],s:[.04,1.95,.04],c:[.4,.3,.2]});}
 // campfire
 const F=[0,0,0];for(let i=0;i<8;i++){const a=i/8*Math.PI*2;rock(xf([Math.cos(a)*.7,0,Math.sin(a)*.7]),.28,null,i);}for(let i=0;i<3;i++)draw(CYL,{p:[0,.12,0],r:[Math.PI/2,i*1.05,0],s:[.07,1.1,.07],c:[.3,.2,.12]});
 if(o.fire!==0)flames(0,.1,0,t,o.fk||.55);
 // pan rig
 if(o.cook){draw(CYL,{p:[0,.75,0],s:[.32,.05,.32],c:[.12,.12,.13],g:.6,gold:o.gPan||0});lineC(xf([0,0,0]),[.32,.78,0],[.95,.85,.1],.025,[.12,.12,.13]);for(let i=0;i<3;i++){draw(SPH,{p:[-.12+i*.13,.81,-.05+(i%2)*.1],s:[.08,.02,.08],c:[.98,.97,.94],noInk:1});draw(SPH,{p:[-.12+i*.13,.83,-.05+(i%2)*.1],s:[.035,.02,.035],c:[1,.75,.15],noInk:1});}
  draw(FR,{p:[-.5,.1,.45],s:[.12,.3,.12],c:[.3,.32,.36],g:.6});for(let i=0;i<6;i++){const ph=(t*.5+i/6)%1;draw(SPHL,{p:[ph*.1,.85+ph*.9,Math.sin(i)*.05],s:[.06+ph*.12,.06+ph*.12,.06+ph*.12],c:[.9,.9,.92],a:.35*(1-ph),u:1});}}}
function flames(x,y,z,t,k){k=k||1;for(let i=0;i<10;i++){const f=.5+.5*Math.sin(t*9+i*1.9),g=.5+.5*Math.sin(t*13+i*2.7);const px=x+Math.sin(i*2.4)*.55*k,pz=z+Math.cos(i*2.4)*.75*k;const h=(1.1+f*.9)*k;
 draw(SPHL,{p:[px,y+h*.45,pz],s:[.32*k*(1-.25*g),h*.55,.32*k*(1-.25*g)],c:[1,.48+.1*g,.1],u:1,id:7,a:.92});draw(SPHL,{p:[px,y+h*.3,pz],s:[.18*k,h*.32,.18*k],c:[1,.86,.4],u:1,id:7,a:.95});}
 for(let i=0;i<14;i++){const ph=(t*.9+i*.071)%1;draw(SPHL,{p:[x+Math.sin(i*3.3+t)*.8*k,y+ph*4*k,z+Math.cos(i*2.1)*.8*k],s:[.04*k,.04*k,.04*k],c:[1,.7,.25],u:1,a:1-ph*.9});}}
const MNIGHT=o=>NIGHT(Object.assign({plP:[0,1.2,0],plC:[1.2,.7,.35],plR:10,sunC:[.55,.6,.62]},o));
function sMiners(t){const T=31.5+t;
 if(t<2.8){const k=ease(ss(0,2.8,t));env(MNIGHT({eye:[lerp(9,7.5,k),lerp(1.8,1.6,k),lerp(11,9,k)],tgt:[0,lerp(5,8,k),-20],fov:46}));stars();aurora(T,{I:1.3,c:[0,40,-170]});camp(t);
  const up=ss(1.2,2.4,t);[[-3.2,-1.2,.6],[3.2,-2.2,-.5],[-1,-4.6,.1]].forEach(([x,z,r],i)=>{const sit=up<.5;person(xf([x,0,z],[0,r+Math.PI*.15,0]),Object.assign({seed:30+i},MINER[i],sit?{sit:1}:{head:[-.3,0,0]}));});
  return;}
 if(t<4.3){const lt=t-2.8,k=ease(ss(0,1.5,lt));env(MNIGHT({eye:[lerp(-2.4,-2.2,k),lerp(1.1,1.0,k),lerp(1.6,1.3,k)],tgt:[-1.2,lerp(1.8,2.3,k),-1],fov:40,dof:[2.0,2]}));stars();aurora(T,{I:1.4,c:[0,40,-170]});camp(t);
  person(xf([-1.2,0,-1],[0,.6,0]),Object.assign({seed:30},MINER[0],{head:[-.6,0,0],mouthO:1,worry:1}));return;}
 if(t<7.2){const lt=t-4.3,k=ease(ss(0,2.9,lt));env(MNIGHT({eye:[lerp(2.2,1.7,k),lerp(1.6,1.4,k),lerp(2.2,1.8,k)],tgt:[0,.75,0],fov:42,dof:[2.4,1.8]}));stars();aurora(T,{I:1.1,c:[0,40,-170]});camp(t,{cook:1,gPan:1,fk:.3});
  person(xf([1.25,0,.3],[0,-Math.PI/2-.2,0]),Object.assign({seed:31},MINER[1],{armR:[-1.0,0,.1],elbowR:.4,head:[.3,0,0]}));person(xf([-1.3,0,.7],[0,Math.PI/2+.4,0]),Object.assign({seed:32},MINER[3],{sit:1,head:[.25,0,0]}));return;}
 const lt=t-7.2,k=ease(ss(0,1.8,lt));env(MNIGHT({eye:[0,lerp(.75,.62,k),lerp(.9,.75,k)],tgt:[0,.15,0],fov:40,plP:[.6,1.2,.6],plR:5,dof:[.8,.5]}));
 draw(BOX,{p:[0,-.05,0],s:[6,.1,6],c:[.32,.24,.18],pat:7,patS:3});const WP=xf([0,.07,0],[-Math.PI/2,0,.2]);draw(CYL,{P:WP,r:[Math.PI/2,0,0],s:[.3,.07,.3],c:[.85,.65,.3],g:.8,gold:1});draw(CYL,{P:WP,p:[0,.32,0],r:[Math.PI/2,0,0],s:[.06,.04,.06],c:[.85,.65,.3],g:.8});
 clockTex(1.05);dynTex('clk2',CLK);draw(QUAD,{P:WP,p:[0,0,.075],s:[.52,.52,1],c:[1,1,1],tex:3,u:1});draw(TUBE,{P:WP,p:[0,.33,0],r:[0,0,Math.PI/2],s:[.07,.03,.07],c:[.85,.65,.3],g:.8});
 for(let i=0;i<10;i++)draw(SPH,{p:[-.6+i*.12,0,-.45-Math.sin(i)*.1],s:[.03,.02,.03],c:[.85,.65,.3],g:.8});}
// ---------- telegraph chaos ----------
function poles(t,o){o=o||{};const L=[];for(let i=0;i<12;i++){const z=-i*14;draw(CYL,{p:[6,0,z],s:[.14,6,.14],c:[.4,.3,.2]});draw(BOX,{p:[6,5.6,z],s:[1.6,.12,.12],c:[.4,.3,.2]});
  if(i<11)for(const dx of[-.6,.6])lineC(xf([0,0,0]),[6+dx,5.65,z],[6+dx,5.65,z-14],.02,[.12,.1,.1]);}
 if(o.sparks){for(let i=0;i<12;i++){const f=Math.sin(t*23+i*5.1);if(f>.4)for(const dx of[-.6,.6])draw(SPH,{p:[6+dx,5.7,-i*14],s:[.25,.25,.25].map(v=>v*f),c:[.85,.92,1],u:1,id:0});}}
 if(o.pulse){for(let i=0;i<8;i++){const ph=((t*.35+i/8)%1);draw(SPH,{p:[5.4,5.65,-ph*150],s:[.2,.2,.2],c:[1,.8,.35],u:1,id:0,gold:1});draw(SPH,{p:[5.4,5.65,-ph*150],s:[.5,.5,.5],c:[1,.75,.3],a:.35,u:1,add:1,id:0});}}}
function sSurge(t){const T=40.52+t;if(t<2.8){const k=ease(ss(0,2.8,t));env(NIGHT({eye:[lerp(-4,-2,k),lerp(2,2.6,k),lerp(10,6,k)],tgt:[5,4.5,-30],fov:44,sky:[.45,.2,.3],skyTop:[.08,.14,.26]}));stars();aurora(T,{I:1.1,c:[0,40,-180]});
  draw(BOX,{p:[0,-.5,-60],s:[300,1,300],c:[.36,.44,.3],pat:1,patS:1.2});road(1,10,1,-150,4,null,[.5,.44,.36]);poles(T,{sparks:1});house(xf([-5,0,-4],[0,Math.PI/2,0]),{w:5,d:7,floors:1,style:'wood',wall:[.72,.6,.45],roof:[.3,.3,.35]});
  draw(BOX,{p:[-2.47,1.6,-4],s:[.05,.8,1.6],c:[1,.85,.5],u:1});return;}
 if(t<4.8){const lt=t-2.8,k=ease(ss(0,2,lt));office(lt,{eye:[lerp(-1.4,-1.1,k),1.5,lerp(1.9,1.6,k)],tgt:[1.3,1.1,0],tap:1,wild:1,sparks:lt>.25&&lt<1.1?1:.3,gk:1});
  const jolt=ss(.2,.4,lt)*(1-ss(.9,1.8,lt));person(xf([.62-jolt*.35,0,.25],[0,Math.PI/2,0]),Object.assign({},OP,{sit:1,lean:-.35*jolt,armR:[lerp(-.9,-2.4,jolt),0,lerp(.1,.5,jolt)],elbowR:lerp(1.0,.3,jolt),armL:[-.6,0,-.1],elbowL:1.2,head:[-.15*jolt,0,0],mouthO:jolt>.5?1:0,worry:1}));draw(BOX,{p:[.62-jolt*.35,.45,.25],s:[.45,.06,.45],c:[.4,.26,.15]});return;}
 const lt=t-4.8,k=ease(ss(0,2.2,lt));office(lt,{eye:[lerp(.2,.4,k),lerp(1.4,1.3,k),lerp(1.4,1.1,k)],tgt:[1.5,.98,-.2],fov:40,tap:1,wild:1,sparks:1,gk:1});}
// ---------- Boston ----------
function sBoston(t){const T=47.55+t;
 if(t<3.5){const k=ease(ss(0,3.5,t));const u=ss(.9,2.2,t);office(t,{eye:[lerp(.2,.4,k),lerp(1.7,1.55,k),lerp(-2.4,-2.1,k)],tgt:[1.35,.95,-.8],tap:0,gb:ss(.9,1.4,t),unplug:u,day:0});
  person(xf([.62,0,-.2],[0,Math.PI/2+.25,0]),Object.assign({},OP,{seed:6,coat:[.2,.25,.35],jacket:true,sit:1,armR:[lerp(-.9,-1.3,u),0,lerp(.1,-.2,u)],elbowR:lerp(1,.5,u),armL:[-1.1,0,-.2],elbowL:.6,head:[.3,.2,0]}));draw(BOX,{p:[.62,.45,-.2],s:[.45,.06,.45],c:[.4,.26,.15]});return;}
 if(t<6.85){const lt=t-3.5,k=ease(ss(0,3.35,lt));env(NIGHT({eye:[lerp(2,1,k),lerp(7,8,k),lerp(14,10,k)],tgt:[5,4,-40],fov:44,sky:[.38,.2,.3],skyTop:[.08,.14,.26]}));stars();aurora(T,{I:.9,c:[0,40,-180]});
  draw(BOX,{p:[0,-.5,-60],s:[300,1,300],c:[.36,.44,.3],pat:1,patS:1.2});road(1,10,1,-150,4,null,[.5,.44,.36]);poles(T,{pulse:1});for(let i=0;i<8;i++)tree(xf([12+(i%3)*4,0,-10-i*16]),1,[.18,.34,.22],'pine');return;}
 const lt=t-6.85,k=ease(ss(0,2,lt));office(lt,{eye:[lerp(-.2,-.5,k),lerp(2.0,2.1,k),lerp(-.6,-.2,k)],tgt:[.2,2.1,-2.9],fov:38,tap:1,clockH:lerp(9,11,ss(0,1.9,lt)),gClock:1,unplug:1});}
// ---------- today ----------
const CITY=(()=>{let s=3;const r=()=>{s=(s*9301+49297)%233280;return s/233280;};const B=[];for(let i=-7;i<=7;i++)for(let j=0;j<10;j++){if(r()<.15)continue;const h=6+r()*r()*40;B.push([i*9+r()*2,-j*9-r()*2,4+r()*3,h,4+r()*3]);}return B;})();
const WIN=document.createElement('canvas');WIN.width=128;WIN.height=256;(()=>{const g=WIN.getContext('2d');g.fillStyle='#1a2030';g.fillRect(0,0,128,256);for(let y=0;y<16;y++)for(let x=0;x<8;x++){if(((x*7+y*13)%5)==0)continue;g.fillStyle=((x+y*3)%4)?'#ffd98a':'#fff1c4';g.fillRect(4+x*16,4+y*16,9,10);}})();
const CWIN=(()=>{const G=[[],[],[]];CITY.forEach(([x,z,w,h,d],bi)=>{const g=x<-25?0:x<20?1:2;const fl=Math.floor(h/1.6);for(let f=0;f<fl;f++){const y=1+f*1.6;for(let c=0;c<Math.max(1,Math.floor(w/1.4));c++){if(((bi*13+f*7+c*3)%5)==0)continue;const cx_=x-w/2+.7+c*1.4;if(cx_>x+w/2-.4)continue;G[g].push({p:[cx_,y,z+d/2+.03],s:[.7,.8,.04]});}
  for(let c=0;c<Math.max(1,Math.floor(d/1.4));c++){if(((bi*11+f*5+c)%4)==0)continue;const cz=z-d/2+.7+c*1.4;if(cz>z+d/2-.4)continue;for(const sd of[-1,1])G[g].push({p:[x+sd*(w/2+.03),y,cz],s:[.04,.8,.7]});}}});return G.map(merge);})();
const CBLD=merge(CITY.map(([x,z,w,h,d])=>({p:[x,h/2,z],s:[w,h,d]})));
function city(t,o){o=o||{};draw(BOX,{p:[0,-.5,-40],s:[400,1,400],c:[.22,.24,.27]});
 const off=o.off||0;draw(CBLD,{c:[.26,.3,.38],g:.5});CWIN.forEach((m,g)=>{const dark=off>(g+1)/3.2;draw(m,{c:dark?[.12,.13,.17]:[1,.82,.45],u:dark?0:1,noInk:1,noShadow:1});});
 for(let i=0;i<9;i++){const z=20-i*0;const x=-60+i*15;draw(BOX,{p:[x,6,20],s:[.3,12,.3],c:[.5,.52,.55]});draw(BOX,{p:[x,11.5,20],s:[3,.2,.2],c:[.5,.52,.55]});if(i<8)for(const dx of[-1.2,1.2])lineC(xf([0,0,0]),[x+dx*0,11.6,20+dx],[x+15,11.6,20+dx],.04,[.15,.15,.18]);}
 if(o.sparkX!==undefined){for(let i=0;i<20;i++){const ph=(t*2+i*.05)%1;const a=i*2.4;draw(SPHL,{p:[o.sparkX+Math.cos(a)*ph*2,11.6+ph*2-ph*ph*4,20+Math.sin(a)*ph*2],s:[.08,.08,.08],c:[.8,.9,1],u:1,a:1-ph});}draw(SPH,{p:[o.sparkX,11.6,20],s:[.7,.7,.7].map(v=>v*(.6+.4*Math.sin(t*40))),c:[.85,.92,1],u:1,id:0});}}
function sToday(t){const T=56.44+t;if(t<3.9){const k=ease(ss(0,3.9,t));env(NIGHT({eye:[lerp(-30,-10,k),lerp(30,22,k),lerp(70,60,k)],tgt:[0,8,-30],fov:44,sky:[.22,.24,.4],skyTop:[.04,.06,.16],bloom:1}));stars();city(T);return;}
 const lt=t-3.9,k=ease(ss(0,4.55,lt));env(NIGHT({eye:[lerp(-10,10,k),lerp(22,26,k),lerp(60,62,k)],tgt:[0,8,-30],fov:44,sky:[.15,.16,.26],skyTop:[.03,.04,.1],bloom:1}));stars();city(T,{off:ss(.6,4,lt)*1.1,sparkX:lt<1.6?-45:lt<3?-15:15});}
function sSunAgain(t){const k=ease(ss(0,1.9,t));env({...SPACE,eye:[lerp(-.5,0,k),lerp(-.2,0,k),lerp(6.4,5.6,k)],tgt:[0,0,0],fov:40,bloom:0});stars(200,120);sun(xf([0,0,0],[0,t*.08+1,0]),t,{flare:ss(.8,1.9,t)*.8});}
function sArchive(t){env({noSky:1,sky:[.42,.38,.34],gnd:[.24,.2,.17],sunC:[.48,.4,.32],sunD:[-.3,.6,.7],fog:[.14,.12,.1],fogD:.03,eye:[0,1.7,lerp(6.5,5,ease(ss(0,4,t)))],tgt:[0,1.5,0],fov:44,plP:[0,2.5,2],plC:[.8,.6,.35],plR:7,bloom:1});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 // telegraph key on shelf
 draw(BOX,{p:[0,1.0+.33,1.2],s:[.6,.1,.35],c:[.3,.2,.12]});draw(BOX,{p:[-.05,1.12+.33,1.2],r:[0,0,-.05],s:[.5,.05,.08],c:[.75,.6,.3],g:.7});draw(SPH,{p:[-.27,1.17+.33,1.2],s:[.08,.05,.08],c:[.1,.1,.1]});}
// ---------- timeline ----------
const S=[[0,1.76,sGlobe],[1.76,3.7,sHookSky],[3.7,7.35,sNoPower],[7.35,9.87,sEngland],[9.87,12.9,sCarr],[12.9,17.26,sProj],[17.26,21.08,sSun],[21.08,25.91,sCME],[25.91,29.6,sAurora],[29.6,31.5,sCuba],[31.5,40.52,sMiners],[40.52,47.55,sSurge],[47.55,56.44,sBoston],[56.44,64.89,sToday],[64.89,66.8,sSunAgain],[66.8,75.0,sArchive]];
const END=75.0;
const RIB=[[7.45,.06,'1 SEPT 1859'],[13.2,.1,'11:18 AM'],[25.95,.3,'NIGHT OF 1–2 SEPT'],[38.8,.34,'1 AM'],[47.6,.4,'2 SEPT 1859'],[56.5,.95,'TODAY']];
function overlays(T,fn,lt){
 badge('WORLDWIDE','SEPTEMBER 1859',-40,42,T,ss(1.6,2.2,T)*(1-ss(66.5,66.9,T)));
 ribbon(T,RIB,['1859','TODAY'],ss(7.35,7.8,T)*(1-ss(66.3,66.7,T)));
 if(fn===sGlobe)tag('SEPTEMBER 1859',W/2,1180,.9,1.76,T);
 if(fn===sNoPower)bigText([['NO POWER.',96,PARCH],['STILL WORKING.',80,GOLD]],3.9,7.25,T,430);
 seal(1,'THE FLARE',7.4,T);seal(2,'THE NIGHT',25.95,T);seal(3,'THE SURGE',40.57,T);
 if(fn===sEngland)tag('ENGLAND',W/2,420,8.75,9.8,T);
 if(fn===sCarr)museum('RICHARD CARRINGTON','Astronomer','1826–1875',540,1000,10.1,12.85,T,'r');
 if(fn===sProj){if(lt<2.3)tag('SUN\'S IMAGE, PROJECTED',W/2,420,13.0,15.1,T,{size:38});else tag('TWO WHITE FLASHES',W/2,420,15.3,17.2,T);}
 if(fn===sSun)tag('FIRST SOLAR FLARE EVER SEEN',W/2,420,17.5,21.0,T,{size:38});
 if(fn===sCME){tag('LESS THAN A DAY',W/2,960,21.2,25.8,T);const pe=proj([0,-15,0]);tag('EARTH',pe[0]+190,pe[1],21.5,25.8,T,{size:34});const ps=proj([0,15,0]);tag('SUN',ps[0]-250,ps[1]+60,21.5,25.8,T,{size:34});}
 if(fn===sAurora)tag('NORTHERN LIGHTS',W/2,420,27.2,29.5,T);
 if(fn===sCuba)tag('EVEN IN CUBA',W/2,420,29.8,31.45,T);
 if(fn===sMiners){if(lt<2.8)tag('ROCKY MOUNTAINS',W/2,420,31.7,34.2,T);else if(lt>4.3&&lt<7.2)tag('BREAKFAST?',W/2,420,36.0,38.6,T);else if(lt>7.2)tag('1 AM',W/2,420,38.8,40.45,T,{size:48});}
 if(fn===sSurge){if(lt<2.8)tag('TELEGRAPH LINES',W/2,420,41.9,43.2,T);else if(lt<4.8)tag('ELECTRIC SHOCKS',W/2,420,43.4,45.2,T);else tag('SPARKS',W/2,420,45.4,47.4,T);}
 if(fn===sBoston){if(lt<3.5)tag('BATTERIES UNPLUGGED',W/2,420,48.2,50.9,T);else if(lt<6.85){tag('BOSTON → PORTLAND, MAINE',W/2,420,51.2,54.3,T,{size:36});tag('POWERED BY THE STORM',W/2,510,52.0,54.3,T,{size:30,f:MF});}else tag('ABOUT 2 HOURS',W/2,420,54.5,56.35,T);}
 if(fn===sToday){if(lt<3.9)tag('TODAY',W/2,420,56.6,60.2,T);else tag('BLACKOUTS COULD LAST WEEKS',W/2,420,60.6,64.8,T,{size:36});}
 if(fn===sArchive){archiveCard([['A CLOSE CALL · 2012'],'In 2012, the sun fired a storm','just as strong. It missed Earth','by only about one week.'],67.1,T);outro(72.4,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);flFree();
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 if(fn===sProj&&lt>.35&&lt<.6)flash((1-(lt-.35)/.25)*.5);
 if(fn===sSurge&&lt>3.0&&lt<3.25)flash((1-(lt-3.0)/.25)*.35,'rgba(200,225,255,.35)');
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
