
function xf(p,r){const R=rot(r);return{M:mul(new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,p[0],p[1],p[2],1]),R),R};}
function cxf(a,b){return{M:mul(a.M,b.M),R:mul(a.R,b.R)};}
// ---- merged mesh builder (boxes with optional y/x rotation) ----
function merge(list){const P=[],N=[],I=[];const f=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 list.forEach(b=>{const R=rot(b.r||[0,0,0]);const tr=v=>[R[0]*v[0]+R[4]*v[1]+R[8]*v[2],R[1]*v[0]+R[5]*v[1]+R[9]*v[2],R[2]*v[0]+R[6]*v[1]+R[10]*v[2]];
  f.forEach(n=>{const u=n[1]?[1,0,0]:[0,1,0];const v=cross(n,u);const base=P.length/3;const nn=tr(n);
   for(const[s,t]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const q=tr([.5*(n[0]+s*u[0]+t*v[0])*b.s[0],.5*(n[1]+s*u[1]+t*v[1])*b.s[1],.5*(n[2]+s*u[2]+t*v[2])*b.s[2]]);P.push(q[0]+b.p[0],q[1]+b.p[1],q[2]+b.p[2]);N.push(...nn);}
   I.push(base,base+1,base+2,base,base+2,base+3);});});return mesh(P,N,I);}
// ---- Titanic geometry (length 27, bow +z) ----
const HL=13.5;function hw(z){if(z>7.5)return 1.45*Math.sqrt(Math.max(0,(HL-z)/(HL-7.5)));if(z<-10)return 1.45*(.62+.38*Math.max(0,(z+HL)/3.5));return 1.45;}
const PROF_UP=[[1,1.75],[1,.6],[1,-.2]],PROF_LO=[[1,-.2],[.95,-.65],[.75,-.98],[.35,-1.1],[0,-1.12]];
function hullMesh(z0,z1,prof,cap){const P=[],N=[],I=[];const n=Math.max(4,Math.round((z1-z0)*2.2));const k=prof.length;
 const zs=[];for(let i=0;i<=n;i++)zs.push(z0+(z1-z0)*i/n);
 for(const sd of[-1,1]){const b0=P.length/3;zs.forEach(z=>{const w=hw(z);prof.forEach(([xf_,y])=>{P.push(sd*w*xf_,y,z);N.push(sd*xf_,(1-xf_)*-1,0);});});
  for(let i=0;i<n;i++)for(let j=0;j<k-1;j++){const a=b0+i*k+j,b=a+k;I.push(a,b,a+1,b,b+1,a+1);}}
 if(cap)for(const z of[z0,z1]){const w=hw(z);if(w<.05)continue;const b0=P.length/3;const dir=z==z0?-1:1;P.push(0,0,z);N.push(0,0,dir);
  const pts=[];prof.forEach(([a,y])=>pts.push([-w*a,y]));prof.slice().reverse().forEach(([a,y])=>pts.push([w*a,y]));pts.forEach(q=>{P.push(q[0],q[1],z);N.push(0,0,dir);});
  for(let i=0;i<pts.length-1;i++)I.push(b0,b0+1+i,b0+2+i);}
 return mesh(P,N,I);}
function deckMesh(z0,z1){const L=[];for(let z=z0;z<z1-.01;z+=.5){const zc=Math.min(z+.25,z1);const w=hw(zc);if(w<.05)continue;L.push({p:[0,1.74,zc],s:[w*2-.04,.06,.52]});}return merge(L);}
function shipPart(z0,z1){const inR=z=>z>=z0&&z<z1;const W=[],SUP=[],BOAT=[],DAV=[],RAIL=[],BLK=[];
 for(let z=-12.6;z<12.6;z+=.32){if(!inR(z))continue;const w=hw(z);if(w<.3)continue;for(const y of[.35,.85,1.3])for(const sd of[-1,1])if(((z*31+y*7)|0)%5)W.push({p:[sd*(w+.012),y,z],s:[.02,.09,.11]});}
 // superstructure tiers
 const tiers=[[-9.4,9.2,2.5,1.75,2.35],[-7.8,7.6,2.2,2.35,2.85],[-6,6.2,1.7,2.85,3.25]];
 tiers.forEach(([a,b,w,y0,y1])=>{const lo=Math.max(a,z0),hi=Math.min(b,z1);if(hi<=lo)return;SUP.push({p:[0,(y0+y1)/2,(lo+hi)/2],s:[w,y1-y0,hi-lo]});
  for(let z=lo+.2;z<hi;z+=.28)for(const sd of[-1,1])W.push({p:[sd*(w/2+.012),(y0+y1)/2+.05,z],s:[.02,.16,.14]});
  RAIL.push({p:[w/2,y1+.07,(lo+hi)/2],s:[.03,.03,hi-lo]},{p:[-w/2,y1+.07,(lo+hi)/2],s:[.03,.03,hi-lo]});});
 if(inR(8.6))SUP.push({p:[0,3.0,8.6],s:[2.9,.5,.8]});if(inR(-11))SUP.push({p:[0,2.05,-11],s:[2,0.6,1.6]});
 for(let i=0;i<8;i++){const z=7.4-i*(i<4?1.0:1.0)-(i>=4?5.4:0);if(!inR(z))continue;for(const sd of[-1,1]){BOAT.push({p:[sd*1.42,2.58,z],s:[.3,.24,.82]});DAV.push({p:[sd*1.3,2.7,z-.35],s:[.05,.6,.05]},{p:[sd*1.3,2.7,z+.35],s:[.05,.6,.05]});}}
 for(const sd of[-1,1])for(let z=-12.5;z<12.8;z+=.5){if(!inR(z))continue;RAIL.push({p:[sd*(hw(z)-.03),1.86,z],s:[.03,.03,.5]});}
 // gold stripe
 for(let z=-12.8;z<12.8;z+=.5){if(!inR(z))continue;const w=hw(z);if(w<.1)continue;for(const sd of[-1,1])BLK.push({p:[sd*(w+.008),1.55,z],s:[.015,.05,.51]});}
 return{hullU:hullMesh(z0,z1,PROF_UP,true),hullL:hullMesh(z0,z1,PROF_LO,true),deck:deckMesh(z0,z1),win:merge(W),sup:SUP.length?merge(SUP):null,boat:BOAT.length?merge(BOAT):null,dav:DAV.length?merge(DAV):null,rail:merge(RAIL),gold:merge(BLK),
  fun:[6,2.6,-.8,-4.2].filter(inR),mast:[10.6,-10.6].filter(inR)};}
const FRONT=shipPart(-2.5,13.5),BACK=shipPart(-13.5,-2.5);
const FUN=[.8,.56,.24];
function drawPart(sp,P,o){o=o||{};const lit=o.lit===undefined?1:o.lit;
 draw(sp.hullU,{P,c:[.035,.035,.04],g:.5});draw(sp.hullL,{P,c:[.42,.08,.05],g:.3});draw(sp.deck,{P,c:[.5,.4,.27]});draw(sp.gold,{P,c:[.7,.55,.2],e:[.05,.04,.01]});
 if(sp.sup)draw(sp.sup,{P,c:[.88,.87,.83]});draw(sp.rail,{P,c:[.85,.85,.82]});if(sp.boat)draw(sp.boat,{P,c:[.92,.92,.9]});if(sp.dav)draw(sp.dav,{P,c:[.2,.2,.2]});
 draw(sp.win,{P,c:[.05,.05,.06],e:[1.6*lit,1.05*lit,.45*lit].map(v=>v*(lit<1&&lit>0?(.6+.4*Math.sin(o.t*40)):1)),g:.6});
 sp.fun.forEach(z=>{const FP=cxf(P,xf([0,3.2,z],[-.12,0,0]));draw(CYL,{P:FP,s:[.42,2.2,.56],c:FUN,g:.3});draw(CYL,{P:FP,p:[0,2.2,0],s:[.43,.55,.57],c:[.05,.05,.05]});
  for(const h of[.6,1.2,1.8])draw(TUBE,{P:FP,p:[0,h,0],s:[.44,.04,.58],c:[.55,.38,.15]});});
 sp.mast.forEach(z=>{const MP=cxf(P,xf([0,1.75,z],[z>0?-.06:-.06,0,0]));draw(CYL,{P:MP,s:[.06,7,.06],c:[.6,.5,.35]});if(z>0)draw(CYL,{P:MP,p:[0,4.2,0],s:[.22,.35,.22],c:[.3,.25,.2]});
  draw(BOX,{P:MP,p:[0,5.4,0],s:[1.6,.05,.05],c:[.5,.42,.3]});});}
function titanic(P,o){o=o||{};drawPart(FRONT,P,o);drawPart(BACK,P,o);if(!o.nowire){draw(BOX,{P,p:[0,8.6,0],r:[Math.atan2(0,21.2),0,0],s:[.02,.02,21.2],c:[.2,.2,.2]});}}
// ---- iceberg ----
function bergMesh(){const P=[],N=[],I=[];const la=12,lo=18;const V=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*Math.PI*2;let r=1+.28*Math.sin(ph*3+i)+.18*Math.sin(th*5+ph*2)+.12*Math.cos(ph*7+th*3);
 let x=Math.sin(th)*Math.cos(ph)*r,y=Math.cos(th)*r,z=Math.sin(th)*Math.sin(ph)*r;if(y>0)y*=1.25+.5*Math.sin(ph*2);return[x,y,z];};
 for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=V(i,j),b=V(i+1,j),c=V(i+1,j+1),d=V(i,j+1);for(const tri of[[a,b,c],[a,c,d]]){const n=norm(cross(sub(tri[1],tri[0]),sub(tri[2],tri[0])));const base=P.length/3;tri.forEach(v=>{P.push(...v);N.push(-n[0],-n[1],-n[2]);});I.push(base,base+1,base+2);}}
 return mesh(P,N,I);}
const BERG=bergMesh();
function berg(p,s){draw(BERG,{p,s:s||[6,5,5],c:[.78,.86,.95],g:.35});}
// ---- env ----
const NIGHT={fog:[.2,.26,.38],fogD:.011,sky:[.42,.48,.64],gnd:[.12,.14,.2],sunC:[.5,.55,.7],sunD:[-.5,.5,.4]};
function sea(c){draw(BOX,{p:[0,-.5,0],s:[800,1,800],c:c||[.04,.08,.14],g:.9});}
function figure(x,y,z,c,P,s){s=s||1;draw(CYL,{P,p:[x,y,z],s:[.13*s,.5*s,.13*s],c:c||[.12,.1,.1]});draw(SPH,{P,p:[x,y+.6*s,z],s:[.1*s,.1*s,.1*s],c:[.55,.42,.33]});}
function lboat(P,n,lit){draw(BOX,{P,p:[0,.12,0],s:[.62,.32,1.8],c:[.92,.92,.9],g:.3});draw(BOX,{P,p:[0,.3,0],s:[.66,.05,1.84],c:[.5,.38,.25]});for(let k=0;k<(n||4);k++)figure(((k%2)-.5)*.3,.2,-.6+k*.32,[[.2,.15,.12],[.5,.1,.1],[.15,.2,.35]][k%3],P,.8);
 if(lit)draw(SPH,{P,p:[0,.8,.8],s:[.06,.06,.06],e:[2,1.5,.8]});}
// ---------- scenes ----------
const S=[[0,9.62,sA],[9.62,17.79,sB],[17.79,22.91,sC],[22.91,27.37,sD],[27.37,33.95,sE],[33.95,40.78,sF],[40.78,49.68,sG],[49.68,57.47,sH],[57.47,64.7,sI],[64.7,69.16,sJ],[69.16,76.04,sK],[76.04,85.5,sL]];
function wake(t,sp){for(let i=0;i<40;i++){const ph=((t*sp*.08+i/40)%1);draw(BOX,{p:[(i%2?1:-1)*(1.6+ph*4),-.44,-13-ph*30],r:[0,(i%2?1:-1)*.3,0],s:[.6+ph*2,.05,1.2],c:[.7,.78,.85],g:.4});}}
function sA(t){const a=-.9+t*.11;env({...NIGHT,eye:[Math.cos(a)*23,4.5+t*.25,Math.sin(a)*23+2],tgt:[0,2.5,1],fov:52});sea();titanic(xf([0,0,0],[0,0,0]),{t});wake(t,6);
 label('11:40 PM',360,240,104,.2,2.1,t,{color:'#ff4d3a'});label('2 HRS 40 MIN LEFT',360,240,60,2.2,6.6,t,{color:'#ffcf5a'});label('ALMOST NO ONE KNEW',360,240,54,6.7,9.5,t,{color:'#ff4d3a'});}
function sB(t){env({...NIGHT,eye:[-40+t*2,9,30],tgt:[0,1,-5],fov:45});sea();titanic(xf([0,0,t*1.2-6],[0,0,0]),{t});wake(t,6);
 for(let i=0;i<30;i++)draw(SPH,{p:[-80+i*6,40+Math.sin(i*7)*12,-140],s:[.25,.25,.25],e:[2,2,2.2]});
 label('APRIL 14, 1912',360,240,70,.2,2.9,t);label('THE NORTH ATLANTIC',360,240,50,2.9,4.6,t,{color:'#8fd3ff'});label('CALM · BLACK · FREEZING',360,240,46,4.7,8.0,t);}
function sC(t){env({...NIGHT,eye:[6,2.2,22-t*.6],tgt:[0,2,6],fov:55});sea();titanic(xf([0,0,0],[0,0,0]),{t});wake(t,9);
 for(let i=0;i<14;i++){const z=30-((t*6+i*4)%50);draw(BERG,{p:[(i%2?1:-1)*(4+(i%3)*2),-.2,z],s:[.5,.3,.4],c:[.78,.86,.95]});}
 label('ICE WARNINGS ALL DAY',360,240,48,.2,3.1,t,{color:'#8fd3ff'});label('SHE KEPT HER SPEED',360,240,54,3.2,5.1,t,{color:'#ffcf5a',stamp:1});}
function sD(t){const bz=lerp(140,40,ss(0,4.4,t));env({...NIGHT,fog:[.24,.3,.42],eye:[0,8+.05*Math.sin(t*2),10.6],tgt:[0,4,60],fov:58});sea();titanic(xf([0,0,0],[0,0,0]),{t});
 berg([-1,-1,bz],[9,8,7]);
 label('A LOOKOUT SEES IT',360,240,52,.2,2.1,t);label('ICEBERG, RIGHT AHEAD!',360,250,52,2.2,4.4,t,{color:'#ff4d3a',stamp:1});}
function sE(t){const shk=t>1.6&&t<5?.06*Math.sin(t*50):0;const yaw=-ss(0,3,t)*.18;env({...NIGHT,eye:[9+shk,1.5+shk,16],tgt:[0,1.5,0],fov:55});sea();
 titanic(xf([0,0,0],[0,yaw,0]),{t});berg([5.2,-1.5,lerp(16,-12,t/6.6)],[3.6,5,4.5]);
 for(let i=0;i<20;i++){const ph=(t*1.4+i*.05)%1;if(t<1.6)break;draw(BOX,{p:[2.2+ph*.5,3-ph*3.4,lerp(10,-6,(t/6.6))+i*.3],r:[i,i*2,0],s:[.18,.15,.15],c:[.85,.9,.98]});}
 label('TOO LATE TO TURN',360,240,58,.2,1.8,t);label('BELOW THE WATERLINE',360,240,52,1.9,6.5,t,{color:'#8fd3ff'});}
function sF(t){const wl=lerp(.05,1.5,ss(0,6.5,t));env({fog:[.25,.22,.18],fogD:.05,sky:[.5,.45,.38],gnd:[.25,.2,.15],sunC:[.4,.37,.3],sunD:[.2,1,.3],eye:[0,1.5,6],tgt:[0,1,-6],fov:58,plP:[0,2.5,1],plC:[1,.8,.5],plR:10});
 draw(BOX,{p:[0,-.05,-10],s:[3,.1,30],c:[.45,.35,.25]});for(const sd of[-1,1]){draw(BOX,{p:[sd*1.5,1.2,-10],s:[.1,2.6,30],c:[.75,.72,.65]});for(let i=0;i<8;i++){draw(BOX,{p:[sd*1.44,1,-i*3],s:[.06,2,.9],c:[.4,.28,.15]});draw(BOX,{p:[sd*1.43,1.1,-i*3+.3],s:[.04,.08,.08],c:[.7,.6,.3],g:.9});}}
 draw(BOX,{p:[0,2.55,-10],s:[3,.1,30],c:[.8,.78,.72]});for(let i=0;i<8;i++)draw(SPH,{p:[0,2.4,-i*3],s:[.12,.08,.12],e:[2,1.6,.9].map(v=>v*(t>4&&i%3==1&&Math.sin(t*30)>0?.2:1))});
 setGrid(-1.45,1.45,-30,8,(x,z)=>wl+.04*Math.sin(x*4+t*5)+.05*Math.sin(z*1.5-t*4));draw(GRID,{c:[.08,.22,.3],g:1});
 label('THE BOW IS FLOODING',360,240,50,.2,2.8,t,{color:'#8fd3ff'});label('SHE WILL SINK',360,240,66,4.7,6.8,t,{color:'#ff4d3a',stamp:1});}
function sG(t){env({...NIGHT,eye:[6,3.2,12-t*.3],tgt:[1,1.8,2],fov:55});sea();const P=xf([0,-.25,0],[.035,0,0]);titanic(P,{t});
 const by=lerp(2.6,-.1,ss(.5,4.5,t)),bz2=t>4.5?(t-4.5)*.25:0;lboat(cxf(P,xf([1.95+bz2*3,by-.15,3.4],[0,0,0])),3,1);if(t<4.5)for(const sd of[-.35,.35])draw(BOX,{P,p:[1.95,(by+2.9)/2,3.4+sd*2],s:[.01,2.9-by,.01],c:[.8,.8,.75]});
 lboat(xf([5,-.4,-2-t*.2],[0,.3,0]),2,1);
 label('20 LIFEBOATS',360,240,66,.1,1.6,t,{color:'#ffcf5a'});label('ROOM FOR BARELY HALF',360,240,50,1.7,4.6,t,{color:'#ff4d3a'});label('MANY LEFT HALF EMPTY',360,240,48,5.6,8.9,t,{stamp:1});}
function sH(t){env({...NIGHT,eye:[14,3,18],tgt:[0,1,0],fov:50});sea();const P=xf([0,-1.1-t*.05,0],[.12+t*.006,0,0]);titanic(P,{t});
 lboat(xf([7,-.4,8-t*.3],[0,.5,0]),4,1);lboat(xf([10,-.4,3-t*.2],[0,.8,0]),3,1);
 label('2:05 AM',360,240,96,.1,1.7,t,{color:'#ff4d3a'});label('THE LAST LIFEBOAT IS GONE',360,240,40,1.75,4.1,t);label('1,500 STILL ON BOARD',360,240,54,4.2,7.8,t,{color:'#ff4d3a',stamp:1});}
function sI(t){const br=4.97,d=Math.max(0,t-br);const shk=d>0&&d<1.2?.12*Math.sin(t*45):0;env({...NIGHT,eye:[24+shk,3+shk,10],tgt:[0,3,0],fov:52});sea();
 const pitch=lerp(.17,.42,ss(0,br,t)),lit=t<4.6?1:(t<br?.5:0);
 if(d<=0)titanic(xf([0,-1.6-t*.1,0],[pitch,0,0]),{t,lit,nowire:1});
 else{const pv=[0,-2.1,-2.5];const Pf=cxf(xf(pv,[0,0,0]),cxf(xf([0,-d*1.2,0],[pitch+d*.25,0,0]),xf([0,0,2.5],[0,0,0])));drawPart(FRONT,Pf,{t,lit:0});
  const Pb=cxf(xf(pv,[0,0,0]),cxf(xf([0,d*.2,0],[pitch-Math.min(d,1.2)*.35,0,0]),xf([0,0,2.5],[0,0,0])));drawPart(BACK,Pb,{t,lit:0});}
 label('THE STERN RISES',360,240,58,1.8,4.9,t,{color:'#ffcf5a'});label('SHE SNAPS IN HALF',360,250,58,br,7.2,t,{color:'#ff4d3a',stamp:1});}
function sJ(t){env({...NIGHT,eye:[22,3.5,14],tgt:[0,3,-4],fov:50});sea();const sink=ss(0,3,t);
 const Pb=cxf(xf([0,lerp(-1,-16,sink*sink),-2.5],[0,0,0]),xf([0,0,2.5],[1.25,0,0]));if(sink<1)drawPart(BACK,Pb,{t,lit:0});
 for(let i=0;i<30;i++)draw(BOX,{p:[Math.sin(i*2.1)*5,-.42,Math.cos(i*1.7)*5-2],r:[0,i,0],s:[.3,.05,.6],c:[.4,.3,.2]});
 label('2:20 AM',360,240,104,.1,1.9,t,{color:'#ff4d3a'});label('THE TITANIC IS GONE',360,240,56,1.95,4.4,t);}
function sK(t){env({fog:[.2,.25,.35],fogD:.018,sky:[.45,.5,.62],gnd:[.1,.12,.16],sunC:[.4,.45,.58],sunD:[-.3,.6,.5],eye:[Math.sin(t*.1)*3,2.2,10-t*.3],tgt:[0,0,-6],fov:55});sea([.03,.06,.1]);
 for(let i=0;i<70;i++){const x=Math.sin(i*2.3)*9,z=Math.cos(i*1.9)*9-6;draw(BOX,{p:[x,-.45+.03*Math.sin(t*2+i),z],r:[0,i,0],s:[.35,.08,.25],c:i%3?[.85,.83,.75]:[.4,.3,.2]});}
 lboat(xf([-6,-.4,-14],[0,.4,0]),4,1);lboat(xf([7,-.4,-18],[0,-.6,0]),3,1);
 label('28\u00B0F WATER',360,240,90,.2,2.6,t,{color:'#8fd3ff'});label('BELOW FREEZING',360,320,40,.5,2.6,t);label('THE CRIES GO QUIET',360,240,50,3.7,6.7,t);}
function sL(t){const dawn=ss(0,6,t);env({fog:mix3([.22,.28,.4],[.6,.55,.62],dawn),fogD:.012,sky:mix3([.42,.48,.64],[.6,.55,.6],dawn),gnd:[.15,.15,.2],sunC:mix3([.5,.55,.7],[1,.75,.6],dawn),sunD:[.7,.25,-.6],eye:[6,3,14],tgt:[-3,2,-20],fov:50});sea();
 const cz=lerp(-70,-40,ss(0,8,t));const CP=xf([-8,0,cz],[0,.6,0]);draw(BOX,{P:CP,p:[0,.6,0],s:[2,2.2,15],c:[.06,.06,.07]});draw(BOX,{P:CP,p:[0,2.1,0],s:[1.7,1,7],c:[.85,.84,.8]});
 draw(CYL,{P:CP,p:[0,2.5,0],s:[.4,2.3,.4],c:[.8,.35,.1]});draw(CYL,{P:CP,p:[0,4.5,0],s:[.41,.4,.41],c:[.05,.05,.05]});for(const z of[5,-5])draw(CYL,{P:CP,p:[0,1.7,z],s:[.05,5,.05],c:[.5,.4,.3]});
 for(let i=0;i<10;i++)draw(BOX,{P:CP,p:[1.01,1.2,-6+i*1.3],s:[.02,.12,.15],e:[1.6,1.1,.5]});
 lboat(xf([1,-.4,0],[0,.3,0]),5,1);lboat(xf([4,-.4,-6],[0,-.4,0]),4,1);
 label('~4 AM: THE CARPATHIA',360,240,52,.2,3.7,t,{color:'#ffcf5a'});label('2,200+ ON BOARD',360,240,62,3.8,6.4,t);label('~700 LIVED',360,240,100,7.1,9.2,t,{color:'#ffcf5a',stamp:1});}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 cx.clearRect(0,0,W,H);fn(T-s0);const img=cx.getImageData(0,0,W,H);cx.drawImage(gl.canvas,0,0);
 const tmp=document.createElement('canvas');tmp.width=W;tmp.height=H;tmp.getContext('2d').putImageData(img,0,0);cx.drawImage(tmp,0,0);
 let a=0;const lt=T-s0;if(k>0)a=Math.max(a,1-lt/.25);if(k<S.length-1)a=Math.max(a,1-(s1-T)/.2);if(T>84.2)a=Math.max(a,(T-84.2)/.75);if(T<.25)a=Math.max(a,1-T/.25);
 if(fn===sI&&lt>4.97&&lt<5.4){cx.fillStyle=`rgba(255,240,210,${(1-(lt-4.97)/.43)*.7})`;cx.fillRect(0,0,W,H);}
 if(a>0){cx.fillStyle=`rgba(0,0,0,${Math.min(1,a)})`;cx.fillRect(0,0,W,H);}
 return out.toDataURL('image/jpeg',.9);};
