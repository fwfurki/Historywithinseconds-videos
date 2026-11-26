// ===== THE PIG WAR (San Juan Island, 1859) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
const LON=-123.05,LAT=48.52;
function rnd(s){let x=s;return()=>{x=(x*9301+49297)%233280;return x/233280;};}
function camPlaque(e,tg,dist,dx,dy,k,val,dig,cap){const f=norm(sub(tg,e));const r=norm(cross(f,[0,1,0]));const u=cross(r,f);const p=[e[0]+f[0]*dist+r[0]*dx+u[0]*dy,e[1]+f[1]*dist+r[1]*dx+u[1]*dy,e[2]+f[2]*dist+r[2]*dx+u[2]*dy];
 const d=sub(e,p);const yaw=Math.atan2(d[0],d[2]);const pit=Math.atan2(d[1],Math.hypot(d[0],d[2]));plaque3D(cxf(xf(p,[0,yaw,0]),xf([0,0,0],[-pit,0,0])),val,dig,cap,k);}
// ---------- environments ----------
const DAY={sky:[.8,.82,.86],gnd:[.5,.48,.42],sunC:[.78,.72,.6],sunD:[-.45,.75,.5],fog:[.82,.88,.94],fogD:.004,skyTop:[.3,.54,.88],clouds:.45,toon:.15};
const D=o=>Object.assign({},DAY,o);
const DUSK={sky:[.86,.74,.62],gnd:[.48,.4,.34],sunC:[.9,.7,.5],sunD:[-.7,.35,.5],fog:[.9,.78,.66],fogD:.005,skyTop:[.42,.5,.78],clouds:.5,toon:.15};
const SPACE={bg:[.04,.07,.13],fog:[.04,.07,.13],fogD:0,sky:[.9,.9,.95],gnd:[.5,.5,.56],sunC:[.55,.52,.48],sunD:[.8,.3,.5],ink:.8,inkFar:50};
// ---------- flags (canvas) ----------
const USF=document.createElement('canvas');USF.width=380;USF.height=200;(()=>{const g=USF.getContext('2d');for(let i=0;i<13;i++){g.fillStyle=i%2?'#f4f1ea':'#b8262c';g.fillRect(0,i*200/13,380,200/13+1);}
 g.fillStyle='#24306a';g.fillRect(0,0,160,108);g.fillStyle='#f4f1ea';for(let r=0;r<5;r++)for(let c=0;c<6;c++){g.beginPath();g.arc(16+c*25.6+(r%2)*6,13+r*21,4.5,0,7);g.fill();}})();
const UKF=document.createElement('canvas');UKF.width=380;UKF.height=200;(()=>{const g=UKF.getContext('2d');g.fillStyle='#22307a';g.fillRect(0,0,380,200);
 g.strokeStyle='#f4f1ea';g.lineWidth=40;g.beginPath();g.moveTo(0,0);g.lineTo(380,200);g.moveTo(380,0);g.lineTo(0,200);g.stroke();g.strokeStyle='#c4262e';g.lineWidth=13;g.beginPath();g.moveTo(0,0);g.lineTo(380,200);g.moveTo(380,0);g.lineTo(0,200);g.stroke();
 g.fillStyle='#f4f1ea';g.fillRect(160,0,60,200);g.fillRect(0,70,380,60);g.fillStyle='#c4262e';g.fillRect(172,0,36,200);g.fillRect(0,82,380,36);})();
function flag(P,which,h,t,k){k=k||1;lineC(P,[0,0,0],[0,h,0],.05*k,[.85,.84,.8]);draw(SPH,{P,p:[0,h,0],s:[.09*k,.09*k,.09*k],c:[.9,.75,.3]});
 useTex(which,which==='us'?USF:UKF);const w=1.6*k,hh=.84*k;draw(flagMesh(t),{P,p:[w/2,h-hh/2-.05,0],s:[w,hh,w],c:[1,1,1],tex:3,u:1,noShadow:1});}
function flagMesh(t){const P=[],N=[],I=[];const nx=12,ny=5;for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){const x=-.5+i/nx,y=-.5+j/ny,u=x+.5;const ph=t*3.2-u*5.5;
  const z=Math.sin(ph)*.07*u;const dz=-Math.cos(ph)*.07*u*5.5+Math.sin(ph)*.07;const n=norm([-dz,0,1]);P.push(x,y,z);N.push(...n);}
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+2,d=a+nx+1;I.push(a,b,c,a,c,d,a,c,b,a,d,c);}const m=mesh(P,N,I);FLM.push(m);return m;}
// ---------- pig ----------
function pigSDF(){return(x,y,z)=>{let d=SD.ell(x,y,z,[0,.45,0],[.27,.26,.46]);d=SD.smin(d,SD.ell(x,y,z,[0,.5,.42],[.2,.2,.21]),.1);
 d=SD.smin(d,SD.rc(x,y,z,[0,.47,.55],[0,.45,.68],.1,.085),.04);d=SD.smin(d,SD.ell(x,y,z,[0,.45,.69],[.085,.075,.03]),.015);
 for(const sd of[-1,1]){d=SD.smin(d,SD.ell(x,y,z,[sd*.12,.69,.42],[.07,.09,.03]),.03);for(const fz of[-.27,.27])d=SD.smin(d,SD.rc(x,y,z,[sd*.14,.32,fz],[sd*.14,.02,fz],.075,.055),.05);}
 d=SD.smin(d,SD.sph(x,y,z,[0,.56,-.46],.045),.03);return Math.max(d,-y);};}
function pig(P,o){o=o||{};const m=propMesh('pig',pigSDF(),[-.4,-.02,-.6],[.4,.85,.8],.02);const g=o.gold||0;draw(m,{P,c:o.c||[.93,.66,.62],gold:g});
 for(const sd of[-1,1]){draw(SPHL,{P,p:[sd*.095,.57,.6],s:[.024,.028,.02],c:[.06,.05,.05],noInk:1,gold:g});draw(SPHL,{P,p:[sd*.03,.46,.72],s:[.014,.02,.008],c:[.45,.25,.25],noInk:1});}
 draw(TUBE,{P,p:[0,.58,-.5],r:[1.2,0,0],s:[.04,.02,.04],c:[.9,.6,.58],noInk:1});}
// ---------- props ----------
function rifle(P,a,b){lineC(P,a,b,.03,[.28,.2,.14]);const d=sub(b,a);lineC(P,[a[0]+d[0]*.35,a[1]+d[1]*.35,a[2]+d[2]*.35],[b[0]+d[0]*.08,b[1]+d[1]*.08,b[2]+d[2]*.08],.011,[.3,.3,.32]);}
function cannon(P,o){o=o||{};const g=o.gold||0;const el=o.el||.08;const B=cxf(P,xf([0,.78,0],[Math.PI/2-el,0,0]));draw(CYL,{P:B,p:[0,-.55,0],s:[.16,1.7,.16],c:[.32,.3,.26],g:.6,gold:g});draw(CYL,{P:B,p:[0,-.6,0],s:[.2,.4,.2],c:[.3,.28,.24],g:.6,gold:g});draw(SPH,{P:B,p:[0,-.6,0],s:[.18,.18,.18],c:[.3,.28,.24],gold:g});
 for(const sd of[-1,1]){draw(TUBE,{P,p:[sd*.36,.48,.05],r:[0,0,Math.PI/2],s:[.48,.08,.48],c:[.42,.3,.18],gold:g});draw(CYL,{P,p:[sd*.36,.48,.05],r:[0,0,Math.PI/2],s:[.08,.1,.08],c:[.3,.22,.14]});
  for(let i=0;i<6;i++){const a=i/6*Math.PI;draw(BOX,{P,p:[sd*.36,.48,.05],r:[a,0,0],s:[.04,.86,.04],c:[.42,.3,.18],noInk:1});}}
 draw(BOX,{P,p:[0,.32,-.75],r:[-.35,0,0],s:[.3,.12,1.3],c:[.45,.32,.2],pat:2,patS:4,gold:g});}
function tent(P,c){draw(PRISM,{P,p:[0,0,0],s:[2.2,1.8,2.6],c:c||[.97,.95,.88]});lineC(P,[0,0,1.35],[0,1.95,1.35],.03,[.5,.38,.24]);lineC(P,[0,0,-1.35],[0,1.95,-1.35],.03,[.5,.38,.24]);draw(BOX,{P,p:[0,.55,1.31],s:[.5,1.1,.02],c:[.3,.28,.24]});}
function potatoes(P,rows,len){for(let r=0;r<rows;r++){const x=(r-(rows-1)/2)*.9;draw(BOX,{P,p:[x,.06,0],s:[.6,.18,len],c:[.36,.26,.18],pat:7,patS:3});
  for(let i=0;i<Math.floor(len/.6);i++)bush(cxf(P,xf([x+(i%2?.06:-.06),.12,-len/2+.3+i*.6])),.28,[.32,.56,.24]);}}
const FAR={coat:[.42,.3,.2],jacket:false,shirt:[.84,.78,.66],sleeve:[.42,.3,.2],pants:[.32,.28,.22],hat:'flat',hatc:[.36,.26,.18],beard:1,hair:HAIRS[2],seed:5};
const GRIF={coat:[.2,.22,.2],shirt:[.94,.92,.88],tie:[.12,.12,.14],pants:[.3,.28,.26],hat:'bowler',hatc:[.15,.14,.13],moustache:1,hair:HAIRS[1],seed:8};
const USS=i=>({coat:[.14,.18,.34],pants:[.42,.5,.66],shirt:[.9,.88,.82],hat:'cap',hatc:[.12,.15,.3],seed:20+i,hair:HAIRS[i%3],moustache:i%3==1?1:0});
const UKS=i=>({coat:[.7,.13,.11],pants:[.14,.14,.2],shirt:[.94,.92,.88],hat:'cap',hatc:[.08,.08,.1],seed:40+i,hair:HAIRS[(i+1)%3]});
function musket(P){lineC(P,[.2,1.0,.08],[.24,2.0,-.08],.016,[.3,.22,.15]);lineC(P,[.24,1.7,-.05],[.25,2.14,-.1],.01,[.5,.5,.55]);}
// ---------- island farm (Cutlar's patch) ----------
function farmHF(x,z){return .5*Math.sin(x*.07)*Math.cos(z*.06)+Math.max(0,(z+30)*-.15)*ss(-30,-60,z)+.6*ss(20,60,Math.abs(x))*Math.sin(z*.1);}
let GK='';function farmLand(){if(GK!=='F'){setGrid(-90,90,-110,70,(x,z)=>Math.max(-3,farmHF(x,z)*(z<-46?ss(-80,-46,z):1)-(z<-55?4*ss(-55,-70,z):0)));GK='F';}draw(GRID,{c:[.42,.6,.3],pat:1,patS:1.2});
 draw(BOX,{p:[0,-1.0,-140],s:[600,1,120],c:[.12,.42,.55],pat:5,patS:.3,g:.6,noShadow:1});}
function patch(o){o=o||{};farmLand();potatoes(xf([0,farmHF(0,6),6]),5,7);house(xf([-7,farmHF(-7,-2)-.1,-2],[0,.3,0]),{w:4.4,d:4,floors:1,style:'wood',wall:[.62,.48,.32],roof:[.36,.3,.26],door:true});
 fence(xf([0,0,10.2]),9,{c:[.6,.5,.38]});fence(xf([-4.6,0,6],[0,Math.PI/2,0]),8,{c:[.6,.5,.38]});fence(xf([4.6,0,6],[0,Math.PI/2,0]),8,{c:[.6,.5,.38]});
 const r=rnd(7);for(let i=0;i<30;i++){const a=r()*Math.PI*2,d=16+r()*30;const x=Math.cos(a)*d,z=-10+Math.sin(a)*d*.8;if(z>-44)tree(xf([x,farmHF(x,z)-.1,z]),1+r()*.7,null,'pine');}
 barrel(xf([-4.8,0,.4]));crate(xf([-5.4,0,.9]));}
// ---------- the relief map ----------
function mapHF(x,z){let d=(-26+4*Math.sin(z*.08))-x;d=Math.max(d,x-(30+5*Math.sin(z*.06+1)));d=Math.max(d,(1-Math.hypot((x+5)/10,(z-6)/14))*9);
 d=Math.max(d,(1-Math.hypot((x-11)/5,(z+3)/7))*5,(1-Math.hypot((x-7)/4,(z-22)/5))*4,(1-Math.hypot((x-16)/3.5,(z-12)/4))*3.5);
 const n=.9*Math.sin(x*.23+1)*Math.cos(z*.19)+.5*Math.sin(x*.5+z*.31);return clamp(d*.45,-2.5,3.2)+(d>0?n*Math.min(1,d*.25)+.2*Math.min(d,8):0);}
const HARO=[[90,-40],[30,-40],[2,-28],[-18,-12],[-18.5,20],[-24,48]],ROSA=[[2,-28],[21,-10],[23,20],[12,48]];
function pathPts(L,f){const seg=[];let tot=0;for(let i=1;i<L.length;i++){const l=Math.hypot(L[i][0]-L[i-1][0],L[i][1]-L[i-1][1]);seg.push(l);tot+=l;}let rem=f*tot;const out=[L[0]];
 for(let i=1;i<L.length;i++){if(rem<=0)break;const l=seg[i-1];const k=Math.min(1,rem/l);out.push([lerp(L[i-1][0],L[i][0],k),lerp(L[i-1][1],L[i][1],k)]);rem-=l;}return out;}
function routeDraw(L,f,c,r,g){const pts=pathPts(L,f);const Y=1.2;const P=xf([0,0,0]);for(let i=1;i<pts.length;i++){lineC(P,[pts[i-1][0],Y,pts[i-1][1]],[pts[i][0],Y,pts[i][1]],r||.55,c,{u:1,noInk:1,gold:g||0});draw(SPHL,{p:[pts[i][0],Y,pts[i][1]],s:[r||.55,r||.55,r||.55],c,u:1,noInk:1,noShadow:1,gold:g||0});}
 const e=pts[pts.length-1];if(f<1&&f>0)draw(SPH,{p:[e[0],Y,e[1]],s:[1.3,1.3,1.3],c:[1,.85,.4],u:1,noShadow:1,gold:1});}
function relief(o){o=o||{};if(GK!=='M'){setGrid(-80,100,-90,90,mapHF);GK='M';}const isl=o.isl||0;
 draw(GRID,{c:[.5,.66,.36],pat:1,patS:2.5});draw(BOX,{p:[0,-1.2,0],s:[400,1,400],c:[.14,.46,.6],pat:5,patS:.35,g:.6,noShadow:1});
 if(isl>0){draw(CYL,{p:[-5,.2,6],s:[10.6,.5,14.6],c:o.islC||[1,.8,.3],a:.35*isl,u:1,noShadow:1,noInk:1,gold:1});}
 const r=rnd(19);for(let i=0;i<60;i++){const x=-80+r()*180,z=-90+r()*180;const h=mapHF(x,z);if(h>1.2)tree(xf([x,h-.2,z]),1.6+r(),null,'pine');}}
// ---------- warship (frigate) ----------
function frigate(P,o){o=o||{};brig(P,Object.assign({hull:[.12,.12,.14],set:[1,1,1,0,0]},o));const S=HS,L=22,B=6.2;
 for(const sd of[-1,1])for(let i=0;i<8;i++){const z=-7.5+i*2;const u=z/L+.5;const w=Math.max(S.bw(u),.02)*B/2;const y=S.top(u)*.52;draw(BOX,{P,p:[sd*(w+.03),y,z],r:[0,0,0],s:[.06,.42,.5],c:[.08,.07,.07],noInk:1});
  if(o.guns)draw(CYL,{P,p:[sd*(w+.25),y,z],r:[0,0,Math.PI/2],s:[.12,.5,.12],c:[.2,.2,.2],noInk:1});}
 flag(cxf(P,xf([0,S.top(0)+.3,-11.8],[0,Math.PI/2,0])),'uk',4,TIME,1.4);}
function sea(c){draw(BOX,{p:[0,-.5,0],s:[900,1,900],c:c||[.14,.44,.58],pat:5,patS:.35,g:.6,noShadow:1});}
function bayLand(){if(GK!=='B'){setGrid(-140,140,-40,160,(x,z)=>{const sh=z-(30+8*Math.sin(x*.05));return clamp(sh*.25,-3,6)+(sh>0?1.5*Math.sin(x*.12)*Math.cos(z*.09)+ss(0,60,sh)*14:0);});GK='B';}
 draw(GRID,{c:[.44,.6,.32],pat:1,patS:1.3});}
function bayHF(x,z){const sh=z-(30+8*Math.sin(x*.05));return clamp(sh*.25,-3,6)+(sh>0?1.5*Math.sin(x*.12)*Math.cos(z*.09)+ss(0,60,sh)*14:0);}
function bayTrees(){const r=rnd(23);for(let i=0;i<50;i++){const x=-120+r()*240,z=48+r()*90;tree(xf([x,bayHF(x,z)-.2,z]),1.4+r()*.8,null,'pine');}}
// ===================== SCENES =====================
function stars(){for(let i=0;i<80;i++){const a=i*2.39,e=(i*.618)%1;draw(SPHL,{p:[Math.cos(a)*40,(e-.5)*70,-30+Math.sin(a)*10],s:[.08,.08,.08],c:[1,1,1],u:1,id:0});}}
function sGlobe(t){const k=ease(ss(0,2.4,t));env({...SPACE,eye:[0,0,lerp(5.6,3.2,k)],tgt:[0,0,0],fov:40});globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.4,ss(1.2,1.8,t));stars();}
// 1. the shot
const PIGPOS=[1.2,0,5.2];
function sShot(t){const fall=ss(1.15,1.5,t);if(t<1.05){const k=ease(ss(0,1.05,t));env(D({eye:[lerp(-2.0,-1.7,k),lerp(2.1,2.0,k),lerp(-1.9,-1.4,k)],tgt:[.9,.7,5.2],fov:42,dof:[5.2,3],shadow:{c:[0,0,4],r:8}}));}
 else{const k=ease(ss(1.05,3.0,t));env(D({eye:[lerp(12.5,13.5,k),lerp(3.0,3.4,k),lerp(3.6,3.0,k)],tgt:[lerp(.5,.3,k),.9,lerp(3.3,3.1,k)],fov:44,dof:[4.4,3],shadow:{c:[0,0,4],r:8}}));}
 patch();const FP=xf([-.4,0,1.2],[0,.35,0]);person(FP,Object.assign({},FAR,{armR:[-1.45,0,.25],elbowR:.35,armL:[-1.25,0,-.35],elbowL:.7,head:[.15,0,0]}));
 rifle(FP,[.14,1.36,-.05],[.06,1.46,1.1]);
 if(false){const ph=t-1.1;for(let i=0;i<10;i++){const a=i*2.4;const r=.08+ph*.5;draw(SPHL,{p:[-.4+.48+Math.sin(a)*r*.5,1.45+ph*.25+Math.cos(a)*r*.4,1.2+1.2+ph*.5],s:[.05+ph*.16,.05+ph*.16,.05+ph*.16],c:[.92,.9,.86],a:.6*(1-ph/1.5),u:1,id:0,noShadow:1,noInk:1});}}
 const root=Math.sin(t*7)*.08*(1-fall);pig(xf([PIGPOS[0],0,PIGPOS[2]],[root,-1.9,fall*1.45]),{gold:t>1.15?0:0});
 for(let i=0;i<5;i++){const ph=ss(1.15,2.6,t);if(ph>0)draw(SPHL,{p:[-6+i*2+ph*6,5+ph*8+i,-12-i*2],s:[.12,.05,.25],c:[.15,.12,.12],noInk:1,noShadow:1});}}
// 2. two empires (bay overview)
function sEmpires(t){const k=ease(ss(0,3.6,t));env(D({eye:[lerp(14,18,k),lerp(10,15,k),lerp(50,56,k)],tgt:[lerp(-4,-10,k),2,lerp(8,2,k)],fov:46,shadow:{c:[4,0,30],r:40}}));sea();bayLand();bayTrees();
 frigate(seaP([-14+t*.8,0,-2],Math.PI/2,t),{guns:1});frigate(seaP([-30+t*.8,0,-14],Math.PI/2+.2,t+1),{guns:1});
 for(let i=0;i<12;i++){const x=6+(i%6)*1.3,z=36+Math.floor(i/6)*1.4;const P=xf([x,bayHF(x,z),z],[0,Math.PI+.4,0]);person(P,USS(i));musket(P);}
 flag(xf([4,bayHF(4,37),37]),'us',6,t,1.4);tent(xf([12,bayHF(12,39),39],[0,.3,0]));tent(xf([15,bayHF(15,41),41],[0,.4,0]));}
// 3. the island on the map
function sIsland(t){const k=ease(ss(0,4.6,t));env(D({eye:[lerp(-10,-2,k),lerp(170,118,k),lerp(120,72,k)],tgt:[0,0,lerp(-2,2,k)],fov:40,fogD:.0006,shadow:{c:[0,0,0],r:90}}));relief({isl:ss(1.0,1.6,t)});}
// 4. the treaty
const TREATY=document.createElement('canvas');TREATY.width=600;TREATY.height=800;let TRD=0;function drawTreaty(){if(TRD)return;TRD=1;const g=TREATY.getContext('2d');g.fillStyle='#efe3c8';g.fillRect(0,0,600,800);g.strokeStyle='#9a7a4a';g.lineWidth=6;g.strokeRect(18,18,564,764);
 g.fillStyle='#3a2a18';g.textAlign='center';g.font='700 54px Cinzel';g.fillText('TREATY',300,110);g.font='600 30px Cinzel';g.fillText('OF OREGON · 1846',300,160);g.fillStyle='#b8862a';g.fillRect(150,190,300,3);
 g.fillStyle='#5a4a36';for(let i=0;i<9;i++){g.fillRect(70,240+i*38,460-(i%3)*60,8);}
 g.fillStyle='#2a2118';g.font='700 34px Montserrat';g.fillText('"...the middle of',300,640);g.fillText('the CHANNEL..."',300,688);}
function sTreaty(t){const k=ease(ss(0,1.7,t));env({noSky:1,sky:[.72,.64,.54],gnd:[.42,.34,.26],sunC:[.55,.5,.44],sunD:[-.3,.8,.4],fog:[.3,.25,.2],fogD:.02,eye:[lerp(.15,.05,k),lerp(2.0,1.75,k),lerp(1.0,.7,k)],tgt:[0,.9,-.05],fov:40,plP:[.6,2,.8],plC:[.6,.5,.36],plR:5,dof:[.85,.5]});
 draw(BOX,{p:[0,.45,0],s:[2.4,.9,1.4],c:[.42,.27,.16],pat:2,patS:2});draw(BOX,{p:[0,-.05,0],s:[8,.1,8],c:[.44,.3,.2],pat:2,patS:2});
 drawTreaty();useTex('treaty',TREATY);draw(BOX,{p:[0,.91,0],r:[0,.1,0],s:[.48,.012,.64],c:[.94,.88,.74]});draw(QUAD,{p:[0,.918,0],r:[-Math.PI/2,.1,0],s:[.46,.62,1],c:[1,1,1],tex:3,u:1});
 lineC(xf([0,0,0]),[.36,.91,.1],[.5,1.25,.2],.008,[.95,.94,.9]);draw(CYL,{p:[-.45,.91,-.2],s:[.06,.1,.06],c:[.12,.1,.12]});}
function sLine(t){const k=ease(ss(0,2.2,t));env(D({eye:[lerp(8,4,k),lerp(110,104,k),lerp(52,62,k)],tgt:[4,0,-6],fov:40,fogD:.0006,shadow:{c:[0,0,0],r:90}}));relief({});routeDraw(HARO,ss(.1,2.0,t)*.22,[1,.78,.3],.6,1);
 if(t>1.9){const q=ss(1.9,2.2,t);draw(SPH,{p:[2,3+Math.sin(t*4)*.3,-28],s:[1.4*q,1.4*q,1.4*q],c:[1,.85,.4],u:1,noShadow:1,gold:1});}}
// 5. two channels
function sChan(t){const k=ease(ss(0,5.3,t));env(D({eye:[lerp(4,-4,k),lerp(118,96,k),lerp(70,62,k)],tgt:[0,0,lerp(2,6,k)],fov:40,fogD:.0006,shadow:{c:[0,0,0],r:90}}));relief({isl:ss(1.6,2.2,t)*.8});
 routeDraw(HARO,.22,[1,.78,.3],.6,0);const a=ss(0,1.1,t),b=ss(.5,1.6,t);routeDraw(HARO.slice(2),a,[1,.78,.3],.6,1);routeDraw(ROSA,b,[1,.62,.25],.6,1);
 if(t>3.4){const q=ease(ss(3.4,3.9,t)),q2=ease(ss(3.7,4.2,t));flag(cxf(xf([-8,mapHF(-8,4)-.3,4],[0,Math.PI*.15,0]),xf([0,0,0],[0,0,0],4*q)),'uk',4,t,1);flag(cxf(xf([-2,mapHF(-2,9)-.3,9],[0,-Math.PI*.15,0]),xf([0,0,0],[0,0,0],4*q2)),'us',4,t,1);}}
// museum plinth
function plinth(fig,t,o){o=o||{};const a=(o.a0||.6)+t*.18;env({noSky:1,sky:[.6,.57,.54],gnd:[.3,.27,.24],sunC:[.5,.47,.42],sunD:[-.3,.8,.6],fog:[.16,.15,.17],fogD:.016,eye:[Math.sin(a)*o.r,o.h,Math.cos(a)*o.r],tgt:[0,o.ty,0],fov:40,dof:[Math.hypot(o.r,o.h-o.ty),o.r*.4],plP:[1.5,5,3],plC:[.9,.78,.55],plR:14,desat:.2});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.4,.3,.22],pat:2,patS:1.2,g:.3});for(let i=-3;i<=3;i++)draw(BOX,{p:[i*4,3,-9],s:[3.6,6,.3],c:[.28,.36,.3],pat:6,patS:1});draw(BOX,{p:[0,6.2,-9],s:[30,.3,.5],c:[.6,.46,.22]});
 for(let i=0;i<30;i++){const b=i*2.39;draw(SPHL,{p:[Math.cos(b)*8,3+((i*.618)%1)*4,-8.6],s:[.03,.03,.03],c:[1,.95,.8],u:1,id:0,noShadow:1,noInk:1});}
 const pr=o.pr||1.4,ph=o.ph||1;draw(CYL,{p:[0,0,0],s:[pr,ph,pr],c:[.78,.74,.68],pat:6,patS:3,g:.3});draw(CYL,{p:[0,ph,0],s:[pr*1.1,.12,pr*1.1],c:[.86,.82,.76],pat:6,patS:3,g:.3});draw(CYL,{p:[0,0,0],s:[pr*1.12,.1,pr*1.12],c:[.62,.58,.52]});
 fig(cxf(xf([0,ph+.12,0],[0,-t*.35,0]),xf([0,0,0]),{gold:1}));}
function sCutlar(t){plinth(P=>{person(P,Object.assign({},FAR,{armR:[-.35,0,.12],elbowR:.9}));rifle(P,[.22,.95,.12],[.3,.05,.3]);},t,{r:3.6,h:2.3,ty:1.95,pr:.9,ph:.9});}
function sPig(t){plinth(P=>pig(cxf(P,xf([0,0,0],[0,0,0],1.05))),t,{r:3.8,h:2.0,ty:1.35,pr:1.0,ph:.9,a0:.9});}
// 6. the offer
function sOffer(t){const sh=t<1.55?0:1;const lt=sh?t-1.55:t;
 if(!sh){const k=ease(ss(0,1.55,t));env(D({eye:[lerp(2.2,1.8,k),1.55,lerp(9.2,8.6,k)],tgt:[.2,1.3,11.6],fov:42,dof:[3,2],shadow:{c:[0,0,11],r:6}}));}
 else{const k=ease(ss(0,2.5,lt));env(D({eye:[lerp(-2.6,-2.2,k),lerp(1.6,1.55,k),lerp(14.3,13.8,k)],tgt:[.4,1.3,11.4],fov:42,dof:[3.3,2],shadow:{c:[0,0,11],r:6}}));}
 patch();const off=sh?0:1;person(xf([-.6,0,11.1],[0,Math.PI/2,0]),Object.assign({},FAR,{armR:[-1.0*off-.2,0,.2],elbowR:.4,head:[.05,0,0]}));
 if(!sh){for(let i=0;i<3;i++)draw(CYL,{p:[-.1+i*.03,1.17+i*.02,11.35],r:[.3,0,0],s:[.04,.006,.04],c:[1,.8,.3],gold:1,noInk:1});}
 const shake=sh?Math.sin(lt*9)*.35*(1-ss(.9,1.4,lt)):0;const pt=sh&&lt>1.0;person(xf([.8,0,11.4],[0,-Math.PI/2,0]),Object.assign({},GRIF,{head:[0,shake,0],armL:pt?[-1.35,0,-.5]:[-.1,0,-.1],elbowL:pt?.1:.2}));}
// 7. landing
function sLand(t){const k=ease(ss(0,4.0,t));env(D({eye:[lerp(10,7,k),lerp(2.4,3.2,k),lerp(20,24,k)],tgt:[lerp(0,-1,k),1.2,lerp(32,34,k)],fov:44,shadow:{c:[0,0,34],r:14}}));sea();bayLand();bayTrees();
 boat(xf([4,-.1,27],[0,.3,0]),{hull:[.55,.42,.3]});boat(xf([-3,-.1,26.5],[0,-.2,0]),{hull:[.5,.4,.3]});
 for(let i=0;i<16;i++){const row=Math.floor(i/2),col=i%2;const z=31+row*1.25+t*1.3-1.5,x=-.7+col*1.1+Math.sin(row)*.15;const P=xf([x,Math.max(0,bayHF(x,z)),z],[0,0,0]);person(P,Object.assign(USS(i),{walk:1,phase:t*6.6+col*Math.PI+row*.3}));musket(P);}
 const FP=xf([2.2,Math.max(0,bayHF(2.2,36)),36]);flag(FP,'us',4.5,t,1.2);}
function sShip(t){const k=ease(ss(0,2.15,t));env(D({eye:[lerp(-6,-4,k),lerp(1.2,1.6,k),lerp(22,18,k)],tgt:[2,4,0],fov:46,shadow:{c:[0,0,0],r:20}}));sea();bayLand();bayTrees();frigate(seaP([2,0,lerp(-6,0,t/2.15)],0,t),{guns:1,gold:0});}
// 8. standoff
function redoubt(){for(let i=0;i<5;i++){const x=-6+i*3;cannon(xf([x,bayHF(x,44)+.0,44],[0,Math.PI,0]));}draw(BOX,{p:[0,bayHF(0,42.6)+.4,42.6],s:[18,.9,1.2],c:[.5,.42,.3],pat:7,patS:2});}
function sStand(t){const B=3.85;if(t<B){const k=ease(ss(0,B,t));const E=[lerp(9,6,k),lerp(bayHF(0,52)+3.4,bayHF(0,52)+5,k),lerp(57,60,k)],TG=[-1,bayHF(0,44)+1.2,40];env(D({eye:E,tgt:TG,fov:46,shadow:{c:[0,0,46],r:14}}));sea();bayLand();bayTrees();redoubt();
  for(let i=0;i<20;i++){const x=-8+(i%10)*1.7,z=46+Math.floor(i/10)*1.6;const P=xf([x,bayHF(x,z),z],[0,Math.PI+Math.sin(i)*.2,0]);person(P,USS(i));if(i%2)musket(P);}flag(xf([9,bayHF(9,46),46]),'us',6,t,1.3);
  if(t>1.1){const v=t<3.1?Math.round(461*ease(ss(1.3,2.8,t))):Math.round(14*ease(ss(3.2,3.8,t)));camPlaque(E,TG,7,0,1.1,1.0,v,t<3.1?3:2,t<3.1?'SOLDIERS':'CANNONS');}return;}
 const lt=t-B,k=ease(ss(0,3.6,lt));const E=[lerp(-4,2,k),lerp(bayHF(0,46)+6,bayHF(0,46)+9,k),lerp(48,52,k)],TG=[-4,2,0];env(D({eye:E,tgt:TG,fov:46,shadow:{c:[0,0,10],r:40}}));sea();bayLand();bayTrees();redoubt();
 const SH=[[-18,4,.3],[-6,-4,.1],[8,0,-.2],[-28,-14,.4],[18,-12,-.3]];SH.forEach(([x,z,y],i)=>frigate(seaP([x,0,z],y+Math.PI/2,lt+i),{guns:1,gold:1}));
 if(lt>.3)camPlaque(E,TG,7,0,1.1,1.0,Math.round(5*ease(ss(.4,1.2,lt))),1,'WARSHIPS');}
// 9. one shot
function sOne(t){const k=ease(ss(0,2.3,t));const z0=bayHF(0,44);const ex=lerp(-2.8,-2.2,k),ez=lerp(46.6,46.0,k);env(D({eye:[ex,Math.max(bayHF(ex,ez),z0)+1.6,ez],tgt:[.2,z0+.9,43.6],fov:40,dof:[2.2,1.5],shadow:{c:[0,0,44],r:6}}));sea();bayLand();redoubt();
 frigate(seaP([-6,0,-4],Math.PI/2,t),{guns:1});const P=xf([.75,z0,44.6],[0,Math.PI+.9,0]);person(P,Object.assign(USS(3),{armR:[-1.1,0,.2],elbowR:.6,worry:1}));
 lineC(xf([0,0,0]),[.7,z0+1.15,44.1],[.25,z0+1.05,43.5],.012,[.4,.3,.2]);const fl=.7+.3*Math.sin(t*23);draw(SPHL,{p:[.25,z0+1.06,43.5],s:[.035*fl,.05*fl,.035*fl],c:[1,.6,.2],u:1,add:1,noShadow:1,noInk:1});
 for(let i=0;i<6;i++){const ph=(t*.8+i/6)%1;draw(SPHL,{p:[.25+ph*.05,z0+1.08+ph*.5,43.5],s:[.03+ph*.06,.03+ph*.06,.03+ph*.06],c:[.8,.8,.8],a:.5*(1-ph),u:1,noShadow:1,noInk:1});}}
// 10. the admiral
const ADM={coat:[.1,.12,.22],shirt:[.95,.94,.9],pants:[.1,.12,.22],hat:'cap',hatc:[.06,.06,.1],longcoat:1,hair:[.78,.76,.72],moustache:1,seed:61};
function sAdm(t){const k=ease(ss(0,2.7,t));const SP=xf([0,0,0]);env(D({eye:[lerp(2.6,2.2,k),lerp(3.4,3.5,k),lerp(-4.8,-5.3,k)],tgt:[0,3.3,-8.1],fov:42,dof:[3.4,2],desat:.35,shadow:{c:[0,2,-8],r:8}}));sea();brig(SP,{hull:[.12,.12,.14],set:[1,1,1,0,0]});
 const up=ss(.6,1.0,t);person(cxf(xf([0,HS.deckY(.12),-8.2],[0,.5,0]),xf([0,0,0]),{gold:1}),Object.assign({},ADM,{armR:[-1.9*up-.1,0,.25],elbowR:.3,head:[0,Math.sin(t*5)*.25*ss(1.2,1.4,t)*(1-ss(2.2,2.5,t)),0]}));
 for(let i=0;i<3;i++)person(xf([-1.5+i*.9,HS.deckY(.3),-4+i*.4],[0,Math.PI,0]),UKS(i));}
function sSquab(t){const k=ease(ss(0,4.1,t));const E=[lerp(14,9,k),bayHF(0,52)+lerp(9,7,k),lerp(62,57,k)],TG=[-3,1,22];env(D({eye:E,tgt:TG,fov:46,shadow:{c:[0,0,20],r:40}}));sea();bayLand();bayTrees();redoubt();
 const SH=[[-18,4,.3],[-6,-4,.1],[8,0,-.2]];SH.forEach(([x,z,y],i)=>frigate(seaP([x,0,z],y+Math.PI/2+ss(.5,3.5,t)*.6,t+i),{guns:t<1.2?1:0}));
 pig(cxf(xf([0,bayHF(0,32)+.0,32],[0,.5+t*.2,0]),xf([0,0,0],[0,0,0],3.2),{gold:1}));}
// 11. joint occupation
function sShare(t){const k=ease(ss(0,4.7,t));const X=lerp(-14,13,ss(.36,.62,t/4.7));const E=[X*.75,Math.max(bayHF(X*.75,31),0)+6.5,31],TG=[X,bayHF(X,45)+2.0,46];env(D({eye:E,tgt:TG,fov:46,shadow:{c:[TG[0],0,40],r:22}}));sea();bayLand();bayTrees();
 // English camp (left)
 house(xf([-16,groundY(bayHF,-16,42,5,5),42]),{w:5,d:5,floors:2,style:'wood',wall:[.94,.92,.86],roof:[.36,.3,.28],door:true});flag(xf([-11.5,bayHF(-11.5,45),45]),'uk',7,t,1.4);
 for(let i=0;i<6;i++){const x=-14+(i%3)*1.3,z=42.5+Math.floor(i/3)*1.2;person(xf([x,bayHF(x,z),z],[0,Math.PI+.6,0]),UKS(i));}
 // American camp (right)
 for(let i=0;i<5;i++){const x=10+i*2.6,z=47+(i%2)*1.6;tent(xf([x,bayHF(x,z),z],[0,.1,0]));}flag(xf([8,bayHF(8,44),44]),'us',7,t,1.4);
 for(let i=0;i<6;i++){const x=11+(i%3)*1.3,z=42.5+Math.floor(i/3)*1.2;person(xf([x,bayHF(x,z),z],[0,Math.PI-.6,0]),USS(i));}
 if(t>2.6)camPlaque(E,TG,9,0,2.0,.9,Math.round(12*ease(ss(2.8,4.4,t))),2,'YEARS');}
// 12. the Kaiser
const KAI={coat:[.14,.17,.3],shirt:[.95,.94,.9],pants:[.12,.12,.16],hat:'cap',hatc:[.1,.1,.14],longcoat:1,hair:[.9,.89,.86],beard:1,moustache:1,seed:71};
function sKaiser(t){plinth(P=>person(P,Object.assign({},KAI,{armR:[-.3,0,.1],elbowR:.8})),t,{r:3.6,h:2.3,ty:1.95,pr:.9,ph:.9,a0:.2});}
function sAward(t){const k=ease(ss(0,2.4,t));env(D({eye:[lerp(-2,-6,k),lerp(108,96,k),lerp(66,60,k)],tgt:[-4,0,6],fov:40,fogD:.0006,shadow:{c:[0,0,0],r:90}}));relief({isl:1,islC:[.5,.7,1]});
 routeDraw(HARO,1,[1,.78,.3],.7,1);flag(cxf(xf([-5,mapHF(-5,6)-.3,6]),xf([0,0,0],[0,0,0],4*ease(ss(.2,.7,t)))),'us',4,t,1);}
// 13. only casualty
function sCas(t){const k=ease(ss(0,3.1,t));const E=[lerp(4.4,3.8,k),lerp(2.3,2.1,k),lerp(12.4,11.4,k)],TG=[.9,1.2,5.2];env(Object.assign({},DUSK,{eye:E,tgt:TG,fov:42,dof:[3.6,2.2],shadow:{c:[0,0,5],r:8}}));patch();
 pig(cxf(xf([PIGPOS[0],0,PIGPOS[2]],[0,-1.9+t*.1,0]),xf([0,0,0]),{gold:1}));if(t>.5)camPlaque(E,TG,4,0,.42,.38,Math.round(1*ss(1.6,2.1,t)),1,'CASUALTIES');}
// archive
function sArchive(t){env({noSky:1,sky:[.42,.38,.34],gnd:[.24,.2,.17],sunC:[.48,.4,.32],sunD:[-.3,.6,.7],fog:[.14,.12,.1],fogD:.03,eye:[lerp(.6,0,ease(ss(0,4,t))),1.95,lerp(5.5,4.4,ease(ss(0,4,t)))],tgt:[0,1.95,0],fov:44,plP:[0,2.5,2],plC:[.8,.6,.35],plR:7,bloom:1});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 draw(BOX,{p:[0,.9,1.2],s:[1.8,.06,.8],c:[.4,.26,.15]});for(const sx of[-.8,.8])draw(BOX,{p:[sx,.45,1.2],s:[.06,.9,.6],c:[.35,.22,.13]});pig(cxf(xf([0,.93,1.2],[0,.6+t*.15,0]),xf([0,0,0],[0,0,0],.6),{gold:1}));
 flag(xf([-.6,.93,1.3]),'uk',.9,t,.35);flag(xf([.6,.93,1.3]),'us',.9,t,.35);}
// ---------- timeline ----------
const S=[[0,2.9,sGlobe],[2.9,5.9,sShot],[5.9,9.55,sEmpires],[9.55,14.25,sIsland],[14.25,16.0,sTreaty],[16.0,18.0,sLine],[18.0,23.4,sChan],[23.4,26.4,sCutlar],[26.4,28.8,sPig],[28.8,32.85,sOffer],[32.85,36.9,sLand],[36.9,39.05,sShip],[39.05,46.55,sStand],[46.55,48.85,sOne],[48.85,51.55,sAdm],[51.55,55.7,sSquab],[55.7,60.4,sShare],[60.4,64.45,sKaiser],[64.45,66.85,sAward],[66.85,70.2,sCas],[70.2,78.6,sArchive]];
const END=78.6;
const RIB=[[3.0,.5,'15 JUNE 1859'],[14.3,0,'1846'],[23.4,.5,'JUNE 1859'],[32.9,.51,'JULY 1859'],[39.1,.52,'AUGUST 1859'],[55.8,.54,'1860'],[60.5,1,'1872']];
function overlays(T,fn,lt){
 badge('SAN JUAN ISLAND','1859',LON,LAT,T,ss(2.6,3.2,T)*(1-ss(70.0,70.4,T)));
 ribbon(T,RIB,['1846','1872'],ss(2.9,3.3,T)*(1-ss(69.8,70.2,T)));
 if(fn===sGlobe)bigText([['ONE PIG.',96,PARCH],['TWO EMPIRES.',96,GOLD]],.5,2.85,T,560);
 seal(1,'THE BORDER',9.6,T);seal(2,'THE STANDOFF',32.9,T);seal(3,'THE TWIST',48.9,T);
 if(fn===sShot)tag('SAN JUAN ISLAND',W/2,420,3.0,5.8,T);
 if(fn===sEmpires){const a=proj([-14+lt*.8,13,-2]),b=proj([9,bayHF(9,37)+3,37]);tag('BRITISH EMPIRE',a[0],Math.max(330,a[1]-60),6.4,9.4,T,{size:34,pointer:1});tag('UNITED STATES',b[0],b[1]-60,6.8,9.4,T,{size:34,pointer:1});}
 if(fn===sIsland){tag('BRITISH COLONY (TODAY CANADA)',W/2,420,10.0,12.4,T,{size:30});tag('UNITED STATES',W/2,420,12.5,14.1,T,{size:34});}
 if(fn===sLine)tag('BORDER: 49th PARALLEL',W/2,420,16.1,17.9,T,{size:34});
 if(fn===sChan){tag('HARO STRAIT',260,1060,18.4,23.2,T,{size:30,pointer:1});tag('ROSARIO STRAIT',820,1060,18.9,23.2,T,{size:30,pointer:1});tag('BOTH CLAIMED IT',W/2,420,21.7,23.3,T);}
 if(fn===sCutlar)museum('LYMAN CUTLAR','American settler',null,560,960,23.7,26.3,T,'r');
 if(fn===sPig)museum('THE PIG','Owned by a British company',null,560,960,26.6,28.7,T,'r');
 if(fn===sOffer){if(lt<1.55)tag('HE OFFERED TO PAY',W/2,420,29.0,30.3,T,{size:36});else tag('THREAT: ARREST',W/2,420,30.5,32.7,T);}
 if(fn===sLand)tag('U.S. ARMY LANDS',W/2,420,33.2,35.2,T);
 if(fn===sShip)tag('BRITISH WARSHIPS',W/2,420,37.1,38.95,T);
 if(fn===sOne)tag('ONE SHOT = WAR',W/2,420,46.8,48.75,T);
 if(fn===sAdm)museum('ADM. R. L. BAYNES','Royal Navy commander',null,560,1120,49.2,51.45,T,'r');
 if(fn===sSquab)bigText([['"A SQUABBLE',70,PARCH],['ABOUT A PIG"',70,GOLD]],52.0,55.6,T,560);
 if(fn===sShare){const a=proj([-14,6,45]),b=proj([13,5,46]);if(a[0]>120&&a[0]<960)tag('ENGLISH CAMP',a[0],1190,55.8,60.3,T,{size:34});if(b[0]>120&&b[0]<960)tag('AMERICAN CAMP',b[0],1190,55.8,60.3,T,{size:34});}
 if(fn===sKaiser)museum('KAISER WILHELM I','Emperor of Germany','1797–1888',560,960,61.0,64.3,T,'r');
 if(fn===sAward)tag('ISLAND → UNITED STATES',W/2,420,64.7,66.75,T,{size:34});
 if(fn===sCas)bigText([['THE ONLY',76,PARCH],['CASUALTY',96,GOLD]],67.0,70.0,T,430);
 if(fn===sArchive){archiveCard([['STILL STANDING'],'Both army camps are now a','US national park. At the old','British camp, American rangers','still raise the British flag.'],70.5,T);outro(76.4,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;flFree();cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 if(fn===sShot&&lt>1.12&&lt<1.4)flash((1-(lt-1.12)/.28)*.55);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
