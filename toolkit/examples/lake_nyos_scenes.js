// ===== LAKE NYOS (1986) — HistoryWithinSeconds =====
const SUBS=window.SUBS_DATA;
const LON=10.3,LAT=6.4;
// ---- terrain ----
function noise2(x,z){return Math.sin(x*.21+z*.13)*Math.cos(z*.17-x*.07)+.5*Math.sin(x*.47-z*.39);}
function hf(x,z){const r=Math.hypot(x,z);const ang=Math.atan2(x,z);// ang=0 toward +z (valley)
 const notch=Math.exp(-ang*ang/.18);const rimH=14-4.5*notch;
 let h;if(r<11)h=-10+16*Math.pow(r/11,2);else if(r<13.5)h=lerp(6,rimH,ss(11,13.5,r));
 else h=rimH*(1-ss(13.5,46,r))+rimH*.12*Math.exp(-Math.pow((r-13.5)/3,2));
 // valley channel toward village (+z)
 if(z>8){const vw=Math.exp(-Math.pow(x/(5+z*.08),2));h-=vw*Math.min(1,(z-8)/10)*h*.45;}
 if(r>15)h+=noise2(x,z)*.9*ss(15,30,r);
 // surrounding hills
 h+=4.5*Math.exp(-Math.pow((x+38)/12,2)-Math.pow((z-20)/16,2))+5*Math.exp(-Math.pow((x-40)/13,2)-Math.pow((z-28)/14,2));
 return Math.max(h,r<11?-10+16*Math.pow(r/11,2):-.2);}
let GRID_KEY='';function terrain(c){if(GRID_KEY!=='T'){setGrid(-70,70,-60,80,hf);GRID_KEY='T';}draw(GRID,{c:c||[.45,.68,.32]});}
const VILLAGE=[60,105,150,195,240,285].map(a=>[Math.sin(a*Math.PI/180)*7.5,48+Math.cos(a*Math.PI/180)*7.5]);const CAMH=(x,z,h)=>[x,hf(x,z)+h,z];
const TREES=[];(()=>{let s=3;const r=()=>{s=(s*9301+49297)%233280;return s/233280;};for(let i=0;i<110;i++){const a=r()*Math.PI*2,d=16+r()*26;const x=Math.sin(a)*d,z=Math.cos(a)*d;if(Math.abs(x)<12&&z>6)continue;TREES.push([x,z,.8+r()*.6]);}for(let i=0;i<14;i++){const x=(r()<.5?-1:1)*(15+r()*10),z=40+r()*22;TREES.push([x,z,.9+r()*.5]);}})();
function forest(){TREES.forEach(([x,z,k])=>tree(xf([x,hf(x,z)-.1,z]),k*1.3,[.28,.55,.25]));}
const VANG=[60,105,150,195,240,285];function village(o){o=o||{};VILLAGE.forEach(([x,z],i)=>hut(xf([x,hf(x,z)-.05,z],[0,VANG[i]*Math.PI/180+Math.PI,0]),{light:o.light,wall:[[.78,.55,.36],[.72,.5,.34],[.8,.62,.42]][i%3]}));
 draw(CYL,{p:[0,hf(0,48)-.02,48],s:[5,.03,5],c:[.72,.6,.42]});}
function lake(o){o=o||{};draw(CYL,{p:[0,5.95,0],s:[11.2,.06,11.2],c:o.c||[.28,.58,.86],g:.6,gold:o.gold||0});}
// ---- palettes ----
const DAY={sky:[.66,.72,.8],gnd:[.45,.44,.4],sunC:[.62,.58,.5],fog:[.72,.84,.95],fogD:.004};
const DUSK={sky:[.62,.6,.7],gnd:[.45,.4,.38],sunC:[.78,.58,.42],sunD:[-.7,.4,.4],fog:[.96,.78,.62],fogD:.002};
const NIGHT={sky:[.42,.46,.66],gnd:[.26,.26,.34],sunC:[.42,.48,.68],sunD:[.4,.7,.3],fog:[.17,.22,.4],fogD:.006};
const MORN={sky:[.72,.72,.76],gnd:[.5,.47,.42],sunC:[.7,.6,.45],sunD:[-.6,.45,.5],fog:[.86,.84,.82],fogD:.005};
function stars(){for(let i=0;i<60;i++){const a=i*2.39,e=.25+((i*37)%50)/100;draw(SPHL,{p:[Math.cos(a)*300*Math.cos(e),40+Math.sin(e)*260,Math.sin(a)*300*Math.cos(e)],s:[.8,.8,.8],c:[1,1,.95],u:1,id:0});}
 draw(SPH,{p:[-120,160,-200],s:[14,14,14],c:[1,.97,.88],u:1,id:0});}
// ---- cutaway profile texture ----
const PROF=document.createElement('canvas');PROF.width=1024;PROF.height=640;const PF=PROF.getContext('2d');
const CO2C=document.createElement('canvas');CO2C.width=1024;CO2C.height=640;const CG=CO2C.getContext('2d');
const PX0=-40,PX1=40,PY0=-36,PY1=14;const pX=x=>(x-PX0)/(PX1-PX0)*1024,pY=y=>(PY1-y)/(PY1-PY0)*640;
function profileTex(t,layer,bub){const g=PF;g.clearRect(0,0,1024,640);
 // earth body
 g.beginPath();g.moveTo(0,640);for(let x=PX0;x<=PX1;x+=.5)g.lineTo(pX(x),pY(hf(x,0)));g.lineTo(1024,640);g.closePath();
 const eg=g.createLinearGradient(0,pY(12),0,640);eg.addColorStop(0,'#a8754a');eg.addColorStop(.45,'#8a5a38');eg.addColorStop(1,'#5e3a26');g.fillStyle=eg;g.fill();
 g.save();g.clip();g.strokeStyle='rgba(60,35,20,.35)';g.lineWidth=5;for(let k=0;k<7;k++){g.beginPath();for(let x=PX0;x<=PX1;x+=1){g.lineTo(pX(x),pY(-4-k*4.4+Math.sin(x*.2+k)*.8));}g.stroke();}
 // magma chamber + conduit
 const mg=g.createRadialGradient(pX(0),pY(-33),10,pX(0),pY(-33),200);mg.addColorStop(0,'#ffd36b');mg.addColorStop(.4,'#ff7a1a');mg.addColorStop(1,'rgba(160,40,10,0)');g.fillStyle=mg;g.beginPath();g.ellipse(pX(0),pY(-33),210,60,0,0,Math.PI*2);g.fill();
 g.fillStyle='rgba(255,140,40,.55)';g.fillRect(pX(-.8),pY(-30),pX(.8)-pX(-.8),pY(-10)-pY(-30));g.restore();
 // grass line
 g.strokeStyle='#5f9a3c';g.lineWidth=10;g.beginPath();for(let x=PX0;x<=PX1;x+=.5){const h=hf(x,0);if(Math.abs(x)<11.2){g.stroke();g.beginPath();continue;}g.lineTo(pX(x),pY(h));}g.stroke();
 // water
 g.beginPath();g.moveTo(pX(-11.2),pY(6));for(let x=-11.2;x<=11.2;x+=.25)g.lineTo(pX(x),pY(Math.min(6,hf(x,0))));g.lineTo(pX(11.2),pY(6));g.closePath();
 const wg=g.createLinearGradient(0,pY(6),0,pY(-10));wg.addColorStop(0,'#5fb4ec');wg.addColorStop(1,'#1d4f8a');g.fillStyle=wg;g.fill();
 g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=4;g.beginPath();g.moveTo(pX(-11.2),pY(6));g.lineTo(pX(11.2),pY(6));g.stroke();
 // CO2 layer (separate gold texture)
 const c=CG;c.clearRect(0,0,1024,640);if(layer>0){const top=-10+layer*9;c.save();c.beginPath();c.moveTo(pX(-11.2),pY(6));for(let x=-11.2;x<=11.2;x+=.25)c.lineTo(pX(x),pY(Math.min(6,hf(x,0))));c.lineTo(pX(11.2),pY(6));c.closePath();c.clip();
  const lg=c.createLinearGradient(0,pY(top),0,pY(-10));lg.addColorStop(0,'rgba(255,214,120,.0)');lg.addColorStop(.12,'rgba(255,200,90,1)');lg.addColorStop(1,'rgba(230,150,40,1)');c.fillStyle=lg;c.fillRect(0,pY(top+.6),1024,640);c.restore();}
 // bubbles rising from conduit into the lake bed
 if(bub>0){for(let i=0;i<26;i++){const ph=((t*.35*bub)+i*.137)%1;const y=lerp(-30,-10+Math.max(layer*9,1)*.9,ph);const x=Math.sin(i*2.1+t*.8)*(.6+ph*3);
  g.beginPath();g.arc(pX(x),pY(y),5+3*Math.sin(i),0,Math.PI*2);g.fillStyle='rgba(255,250,235,.95)';g.fill();g.strokeStyle='rgba(40,30,20,.7)';g.lineWidth=2;g.stroke();}}}
function cutaway(t,layer,bub,goldLayer){profileTex(t,layer,bub);dynTex('prof',PROF);draw(QUAD,{p:[0,(PY0+PY1)/2,0],s:[PX1-PX0,PY1-PY0,1],c:[1,1,1],tex:3,u:1,id:3});
 if(layer>0){dynTex('co2',CO2C);draw(QUAD,{p:[0,(PY0+PY1)/2,.03],s:[PX1-PX0,PY1-PY0,1],c:[1,1,1],tex:3,u:1,id:4,gold:goldLayer});}}
// ---- cloud (CO2) particles ----
const PATH=[[0,7,0],[0,9,9],[0,10.5,14],[0,7,22],[0,3.5,32],[0,1.6,42],[0,1.2,52],[0,1,60]];
function pathAt(u){const n=PATH.length-1;const f=clamp(u,0,1)*n;const i=Math.min(n-1,Math.floor(f));const k=f-i;return mix3(PATH[i],PATH[i+1],k);}
function cloud(front,t,o){o=o||{};for(let i=0;i<170;i++){const u=(i/170);if(u>front)continue;const p=pathAt(u);const spread=2+u*12;const lx=Math.sin(i*12.9898)*spread,lz=Math.cos(i*7.233)*2.5;
  const x=p[0]+lx+Math.sin(t*.6+i)*.6,z=p[2]+lz;const gy=Math.max(hf(x,z),u<.12?6:-99);const y=gy+.9+Math.abs(Math.sin(i*3.7))*2.2;const rr=(1.8+u*2.2)*(.7+.3*Math.sin(i));const edge=ss(front,front-.06,u);
  draw(SPHL,{p:[x,y,z],s:[rr,rr*.55,rr],c:o.c||[.78,1,.8],a:.2*edge*(o.a||1),u:1});}}
// ---- shots ----
function sGlobe(t){const k=ease(ss(0,2.0,t));env({eye:[0,0,lerp(5.4,3.3,k)],tgt:[0,0,0],fov:40,bg:[.055,.105,.17],fog:[.055,.105,.17],fogD:0,sky:[.9,.9,.95],gnd:[.55,.55,.6],sunC:[.45,.45,.45],sunD:[-.3,.4,.9],ink:.8,inkFar:50});
 globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.6,ss(1.1,1.6,t));for(let i=0;i<80;i++){const a=i*2.39,e=(i*.618)%1;draw(SPHL,{p:[Math.cos(a)*40,(e-.5)*70,-30+Math.sin(a)*10],s:[.08,.08,.08],c:[1,1,1],u:1,id:0});}}
function sHook(t){const k=ease(ss(0,3.7,t));env({...DUSK,fogD:.003,eye:[lerp(22,12,k),lerp(38,28,k),lerp(68,52,k)],tgt:[0,4,10],fov:44,desat:.1});
 terrain();lake({gold:.3});forest();village({light:1});}
function sDate(t){const a=.25+t*.09;env({...DAY,eye:[Math.sin(a)*48,30,Math.cos(a)*48],tgt:[0,5,4],fov:44});terrain();lake();forest();village();}
function sVolc(t){const k=ease(ss(0,3.3,t));env({...DAY,eye:[lerp(-36,-46,k),lerp(32,28,k),lerp(40,30,k)],tgt:[0,7,0],fov:42});terrain();lake();forest();village();}
function sVillage(t){const k=ss(0,3,t);env({...DUSK,fogD:.002,eye:CAMH(lerp(.8,.2,k),58.5-k*2,2.1),tgt:[0,hf(0,47)+1.3,47],fov:42,plP:[1.2,hf(1,49)+1.2,49.2],plC:[1,.65,.3],plR:8});terrain();forest();village({light:1});
 const f=ss(0,2.8,t);person(xf([lerp(.6,-1.1,f),hf(0,48),lerp(51,45.6,f)],[0,Math.PI+.25,0]),{walk:f<1?.8:0,phase:t*6,dress:[.85,.55,.2],skin:SKINS[2],hat:'wrap',hatc:[.2,.45,.7]});
 person(xf([lerp(1.2,-.4,f),hf(0,48),lerp(51.2,45.9,f)],[0,Math.PI+.25,0],.62),{walk:f<1?.9:0,phase:t*6+1,skin:SKINS[2],coat:[.9,.85,.3],pants:[.3,.3,.35],hair:HAIRS[1]});
 person(xf([2.3,hf(2.3,49),49.5],[0,-.9,0]),{sit:1,skin:SKINS[3],coat:[.55,.25,.18],hair:HAIRS[1]});fire(1.1,49.3,t);}
function fire(x,z,t){const y=hf(x,z);for(let i=0;i<5;i++)draw(BOX,{p:[x,y+.05,z],r:[0,i*.6,.25],s:[.6,.06,.06],c:[.35,.22,.12]});for(let i=0;i<4;i++){const f=.5+.5*Math.sin(t*9+i*2);draw(CONE,{p:[x+Math.sin(i*1.7)*.1,y+.05,z+Math.cos(i*1.7)*.1],s:[.18,.45+f*.25,.18],c:[1,.55+i*.08,.12],u:1,id:7});}}
function sCut1(t){const k=ease(ss(0,4.4,t));env({...DAY,eye:[lerp(34,10,k),lerp(20,-2,k),lerp(62,40,k)],tgt:[0,lerp(2,-7,k),0],fov:46,clip:[0,0,1,-.2]});terrain();lake();forest();
 cutaway(t,ss(1,4.4,t)*.25,1,0);}
function sCut2(t){const k=ease(ss(0,5,t));env({...DAY,eye:[lerp(8,-6,k),lerp(-3,-6,k),lerp(34,28,k)],tgt:[0,-5,0],fov:46,clip:[0,0,1,-.2],desat:.3});terrain();lake();
 cutaway(t+4.4,lerp(.25,.62,ss(0,5,t)),1,1);}
function sRumble(t){const q=ss(1,1.5,t)*(1-ss(4,4.8,t));const sh=Math.sin(t*37)*.06*q;const e=CAMH(2.4,56.4,1.75);env({...NIGHT,eye:[e[0]+sh,e[1]+sh,e[2]],tgt:[-.8,hf(0,48)+1.6,48],fov:40,plP:[1.1,hf(1,49)+1.2,49.3],plC:[1,.65,.3],plR:8});stars();terrain();forest();village({light:1});fire(1.1,49.3,t);
 const look=ss(1.2,2.2,t);person(xf([-.4,hf(-.4,51),51.2],[0,lerp(.25,Math.PI*.95,look),0]),{skin:SKINS[3],coat:[.55,.25,.18],hair:HAIRS[1],head:[-.25*look,0,0],worry:1});
 person(xf([-1.6,hf(-1.6,51),51.6],[0,lerp(.5,Math.PI*1.05,look),0]),{dress:[.85,.55,.2],skin:SKINS[2],hat:'wrap',hatc:[.2,.45,.7],head:[-.2*look,0,0],worry:1,...(look>.5?POSE.cover:{})});}
function sErupt(t){const e=ss(.2,3.5,t);const sh=Math.sin(t*41)*.15*(1-ss(1,4,t))*ss(0,.3,t);env({...NIGHT,sky:[.5,.54,.72],sunC:[.55,.6,.78],eye:[26+sh,30+sh,46],tgt:[0,lerp(10,14,e),0],fov:46});stars();terrain();lake({c:mix3([.28,.58,.86],[.55,.35,.3],ss(1,5,t))});forest();village({light:1});
 const H=e*22;for(let i=0;i<26;i++){const y=6+i/26*H;const r=1.2+Math.sin(i*1.7+t*6)*.3+(i/26)*1.6;draw(SPHL,{p:[Math.sin(i*2.3+t*3)*.5,y,Math.cos(i*1.9)*.5],s:[r,r*1.1,r],c:[.92,.97,1],id:9});}
 for(let i=0;i<20;i++){const ph=(t*.8+i*.05)%1;const a=i*2.4;draw(SPHL,{p:[Math.cos(a)*ph*9,6+H-ph*ph*H*.9,Math.sin(a)*ph*9],s:[.5,.5,.5],c:[.95,.98,1],id:9});}
 if(t>.6)draw(TUBE,{p:[0,6.02,0],s:[2+ss(.6,4,t)*9,.3,2+ss(.6,4,t)*9],c:[.95,.98,1],a:1-ss(2,4.5,t)});}
function sCloud(t){const f=ease(ss(0,6.4,t));env({...NIGHT,sky:[.5,.54,.72],sunC:[.55,.6,.78],eye:[lerp(34,24,f),lerp(32,17,f),lerp(24,68,f)],tgt:[0,lerp(7,2,f),lerp(8,44,f)],fov:46});stars();terrain();lake({c:[.55,.35,.3]});forest();village({light:1});
 cloud(lerp(.05,.84,ss(0,6.4,t)),t);}
function sHomes(t){const k=ss(0,2.8,t);env({...NIGHT,eye:CAMH(lerp(7,5,k),lerp(59,57,k),3.6),tgt:[0,hf(0,47)+.8,46],fov:44});stars();terrain();forest();village({light:1});cloud(.84+k*.16,t+6,{a:.7});
 for(let i=0;i<9;i++){const ph=(t*.35+i*.11)%1;draw(SPHL,{p:[-4+Math.sin(i*3)*5,hf(0,47)+.6,lerp(38,53,ph)],s:[2,.7,2],c:[.78,1,.8],a:.16,u:1});}}
function sFall(t){env({...NIGHT,eye:CAMH(1.4,53.8,1.25),tgt:[-1.6,hf(0,50)+.45,50.6],fov:46,plP:[1.1,hf(1,49)+1.2,49.3],plC:[.7,.45,.25],plR:8});stars();terrain();forest();village({light:1});cloud(1,t+9,{a:.3});
 const f1=ss(.4,1.8,t),f2=ss(.9,2.4,t);
 const fallP=(x,z,ry,f)=>{const lift=f*(Math.max(hf(x-.9,z),hf(x-1.7,z),hf(x,z))-hf(x,z)+.22);const P=xf([x,hf(x,z)+.05+lift,z],[0,0,f*Math.PI/2*.97]);return cxf(P,xf([0,0,0],[0,ry,0]));};
 person(fallP(-.4,51.2,1.2,f1),{skin:SKINS[3],coat:[.55,.25,.18],hair:HAIRS[1]});{const kk=ss(.35,1,f2);person(cxf(xf([-1.9,hf(-1.9,50.2)-.5*kk,50.2],[0,1.9,Math.sin(t*3)*.06*(1-kk)]),xf([0,.5*kk,0],[.45*kk,0,0])),{dress:[.85,.55,.2],skin:SKINS[2],hat:'wrap',hatc:[.2,.45,.7],head:[.4*kk,0,0],...(kk<.5?POSE.cover:{armL:[-.4,0,-.1],armR:[-.4,0,.1],elbowL:.8,elbowR:.8})});}
 const cf=ss(1.2,2.8,t);cow(cxf(xf([2.8,hf(2.8,48.5),48.5],[0,-.8,0]),xf([0,0,0],[0,0,cf*Math.PI/2*.95])));}
function sMorning(t){const k=ss(0,6.5,t);env({...MORN,eye:CAMH(lerp(-4,-2,k),lerp(65,62,k),5.5),tgt:[-1,hf(0,47)+2.2,46],fov:44,desat:.45});terrain([.55,.62,.4]);forest();village();
 [[-4,52.5,.3],[4.5,53,2],[-5.5,49,4],[3.5,44.5,1]].forEach(([x,z,r])=>cow(cxf(xf([x,hf(x,z),z],[0,r,0]),xf([0,0,0],[0,0,Math.PI/2*.95]))));
 const v=Math.round(1746*ease(ss(.9,3.6,t)));plaque3D(xf([-1.5,hf(0,44)+6.4,43],[0,-.05,0],2.0),v,4,'LIVES LOST');}
function sSilence(t){const sh=t<1.1?0:t<2.3?1:2;const lt=t-[0,1.1,2.3][sh];
 if(sh==0){env({...MORN,eye:CAMH(2.6,lerp(55.5,54.8,lt),1.8),tgt:[-2,hf(-2,44)+1.8,43.5],fov:40,desat:.4});terrain([.55,.62,.4]);forest();village();}
 if(sh==1){env({...MORN,eye:CAMH(2,lerp(51.4,51,lt),1.1),tgt:[.8,hf(.8,48.5)+.25,48.5],fov:38,desat:.4});terrain([.55,.62,.4]);village();
  for(let i=0;i<5;i++)draw(SPH,{p:[.5+i*.16,hf(.8,48.5)+.08,48.6+Math.sin(i*2)*.15],s:[.09,.09,.09],c:[.95,.6,.2]});draw(FR,{p:[1.1,hf(1.1,48.3)+.15,48.3],r:[0,0,1.4],s:[.3,.35,.3],c:[.7,.5,.25]});}
 if(sh==2){env({...MORN,eye:[0,lerp(15,18,lt),lerp(74,76,lt)],tgt:[0,2,46],fov:44,desat:.6});terrain([.55,.62,.4]);forest();village();}}
function sTwist(t){const k=ease(ss(0,7.4,t));env({...DAY,sky:[.7,.66,.6],sunC:[.68,.58,.44],fog:[.88,.8,.68],eye:[lerp(-30,-22,k),lerp(34,28,k),lerp(32,26,k)],tgt:[0,7,0],fov:44,desat:.5});
 terrain([.55,.62,.4]);draw(CYL,{p:[0,5.95,0],s:[11.2,.06,11.2],c:[.3,.55,.8],g:.5,gold:.45});forest();
 if(t>2.2){const v=Math.round(37*ease(ss(2.4,4.4,t)));plaque3D(xf([-2,13,-2],[-.35,-.67,0],2.4),v,2,'LIVES · 1984');}}
function sPipe(t){const k=ease(ss(0,3.3,t));env({...DAY,eye:[lerp(7.2,5.4,k),lerp(8.8,8,k),lerp(7.2,5.4,k)],tgt:[0,7.6,0],fov:46,desat:.4});terrain();lake();forest();
 const P={...xf([0,6,0]),gold:1};draw(BOX,{P,p:[0,.15,0],s:[3,.3,3],c:[.85,.85,.82]});for(const sd of[-1,1])draw(CYL,{P,p:[sd*1.3,0,0],r:[Math.PI/2,0,0],s:[.35,3,.35],c:[.9,.4,.15]});
 draw(CYL,{P,p:[0,.3,0],s:[.22,1.6,.22],c:[.75,.75,.78],g:.6});
 for(let i=0;i<48;i++){const ph=(t*1.2+i*.021)%1;const h=ph*14-ph*ph*9;draw(SPHL,{p:[Math.sin(i*2.1)*ph*1.6,7.9+h,Math.cos(i*1.3)*ph*1.6],s:[.2,.2,.2],c:[.95,.98,1],id:9});}}
function sDeep(t){const k=ease(ss(0,3,t));env({...DAY,sky:[.55,.6,.7],eye:[lerp(4,1,k),lerp(-6,-14,k),lerp(24,18,k)],tgt:[0,lerp(-8,-16,k),0],fov:46,clip:[0,0,1,-.2],desat:.2});terrain();lake();cutaway(t+20,.12+ss(0,3,t)*.08,1,0);}
function sArchive(t){env({sky:[.32,.28,.26],gnd:[.18,.15,.13],sunC:[.4,.33,.26],sunD:[-.3,.6,.7],fog:[.1,.09,.08],fogD:.035,eye:[0,1.7,lerp(6.5,5,ease(ss(0,4,t)))],tgt:[0,1.5,0],fov:44,plP:[0,2.5,2],plC:[.7,.52,.3],plR:7});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13]});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15]});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}}
// ---- timeline ----
const S=[[0,2.6,sGlobe],[2.6,6.3,sHook],[6.3,11.3,sDate],[11.3,14.6,sVolc],[14.6,17.6,sVillage],[17.6,22.1,sCut1],[22.1,27.3,sCut2],[27.3,32.1,sRumble],[32.1,37.5,sErupt],[37.5,44.1,sCloud],[44.1,46.9,sHomes],[46.9,50.1,sFall],[50.1,56.6,sMorning],[56.6,60.1,sSilence],[60.1,67.5,sTwist],[67.5,70.8,sPipe],[70.8,73.8,sDeep],[73.8,78.4,sArchive]];
const END=78.4;
const RIB=[[6.45,.62,'21 AUG 1986'],[50.2,.64,'22 AUG 1986'],[61.3,.55,'15 AUG 1984'],[67.6,.98,'TODAY']];
function overlays(T,fn,lt){
 // badge (after globe), ribbon
 badge('LAKE NYOS','CAMEROON · 1986',LON,LAT,T,ss(2.4,3,T)*(1-ss(73.6,74,T)));
 ribbon(T,RIB,['1980','2026'],ss(6.3,6.8,T)*(1-ss(73.5,73.9,T)));
 if(fn===sGlobe){tag('CAMEROON · WEST AFRICA',W/2,1180,1.3,2.6,T);}
 if(fn===sHook){bigText([['ONE NIGHT.',92,PARCH],['1,700+ LIVES.',92,GOLD]],2.7,6.2,T,420);}
 seal(1,'THE LAKE',6.35,T);seal(2,'THE ERUPTION',32.15,T);seal(3,'THE TWIST',60.15,T);
 if(fn===sDate){const p=proj([0,6,0]);tag('LAKE NYOS',p[0],p[1]-120,7.6,11.2,T,{pointer:1});}
 if(fn===sVolc){const p=proj([0,14,0]);tag('OLD VOLCANO',p[0],p[1]-80,11.6,14.5,T,{pointer:1});}
 if(fn===sVillage){tag('VILLAGES BELOW',W/2,420,14.8,17.5,T);}
 if(fn===sCut1){tag('COLD, DEEP WATER',W/2,420,18.6,22.0,T);}
 if(fn===sCut2){const p=proj([-4,-7,0]);tag('CO₂ BUILDING UP',p[0],p[1]-170,22.4,27.2,T,{pointer:1});}
 if(fn===sRumble){tag('A RUMBLE…',W/2,420,28.4,32,T);}
 if(fn===sErupt){const p=proj([0,6+22*ss(.2,3.5,lt),0]);tag('100 M HIGH',p[0]+200,p[1]+60,34.2,37.4,T);}
 if(fn===sCloud){tag('CO₂ CLOUD · INVISIBLE',W/2,420,38.3,44,T);tag('HEAVIER THAN AIR',W/2,510,40.7,44,T,{size:34,f:MF});}
 if(fn===sFall){tag('NO OXYGEN',W/2,420,47.3,50,T);}
 if(fn===sSilence){tag(['NO FIRE','NO WOUNDS','JUST SILENCE'][lt<1.1?0:lt<2.3?1:2],W/2,440,56.65,60.05,T);}
 if(fn===sTwist){tag('LAKE MONOUN · 1984',W/2,430,61.4,67.4,T);}
 if(fn===sPipe){const p=proj([0,8,0]);tag('DEGASSING PIPE',p[0],p[1]+230,67.7,70.7,T);}
 if(fn===sDeep){tag('STILL RISING',W/2,420,71.2,73.7,T);}
 if(fn===sArchive){archiveCard([['LAKE NYOS · 1986'],'By morning, the blue lake','had turned a murky red.'],74.1,T);outro(76.7,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);cx.clearRect(0,0,W,H);fn(T-s0);post();cx.drawImage(gl.canvas,0,0);
 // cut transitions: quick dip at cuts
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 if(fn===sErupt&&lt>.2&&lt<.6)flash((1-(lt-.2)/.4)*.5);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
