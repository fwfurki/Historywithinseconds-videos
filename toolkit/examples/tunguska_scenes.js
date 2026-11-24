// ===== THE TUNGUSKA EVENT (1908) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
function lineC(P,a,b,r,c,o){const d=sub(b,a),L=Math.hypot(...d)||1e-4;draw(CYL,Object.assign({P,p:a,r:[Math.acos(clamp(d[1]/L,-1,1)),Math.atan2(d[0],d[2]),0],s:[r,L,r],c:c||[.15,.12,.1],noShadow:1},o||{}));}
// ---------- custom geometry: pine (trunk + canopy) ----------
function geoCone(A,cx_,cy,cz,r,h,seg){const[P,N,I]=A;const b=P.length/3;const sl=r/h;for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2,c=Math.cos(a),s=Math.sin(a);const n=norm([c,sl,s]);P.push(cx_+c*r,cy,cz+s*r);N.push(...n);P.push(cx_,cy+h,cz);N.push(...n);}
 for(let i=0;i<seg;i++){const a=b+i*2;I.push(a,a+1,a+2,a+2,a+1,a+3);}
 const c0=P.length/3;P.push(cx_,cy,cz);N.push(0,-1,0);for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2;P.push(cx_+Math.cos(a)*r,cy,cz+Math.sin(a)*r);N.push(0,-1,0);}for(let i=0;i<seg;i++)I.push(c0,c0+2+i,c0+1+i);}
function geoCyl(A,cx_,cy,cz,r0,r1,h,seg){const[P,N,I]=A;const b=P.length/3;for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2,c=Math.cos(a),s=Math.sin(a);P.push(cx_+c*r0,cy,cz+s*r0);N.push(c,0,s);P.push(cx_+c*r1,cy+h,cz+s*r1);N.push(c,0,s);}
 for(let i=0;i<seg;i++){const a=b+i*2;I.push(a,a+1,a+2,a+2,a+1,a+3);}}
const PINE_T=(()=>{const A=[[],[],[]];geoCyl(A,0,-.3,0,.2,.07,6.6,8);return mesh(...A);})();
const PINE_C=(()=>{const A=[[],[],[]];const L=[[1.4,1.3,2.0],[2.3,1.15,1.9],[3.2,.95,1.7],[4.1,.72,1.5],[4.9,.48,1.3]];L.forEach(([y,r,h])=>geoCone(A,0,y,0,r,h,9));return mesh(...A);})();
const POLE=(()=>{const A=[[],[],[]];geoCyl(A,0,-.3,0,.2,.1,5.2,8);for(let i=0;i<5;i++){const y=1.6+i*.7;const a=i*2.3;geoCyl(A,Math.cos(a)*.1,y,Math.sin(a)*.1,.05,.02,.35,5);}return mesh(...A);})();
const PCOL=[[.17,.36,.22],[.2,.4,.24],[.15,.33,.2],[.22,.42,.26]];
function pine(P,k,i,fall,o){o=o||{};const PP=fall?cxf(P,xf([0,0,0],[fall,0,0])):P;const kk=k||1;draw(PINE_T,{P:PP,s:[kk,kk,kk],c:o.burnt?[.22,.18,.15]:[.42,.3,.2],pat:2,patS:6,gold:o.gold});if(!o.burnt)draw(PINE_C,{P:PP,s:[kk,kk,kk],c:o.c||(o.dead&&fall>1.2?[.42,.4,.24]:PCOL[i%4]),gold:o.gold});}
function pole(P,k,o){o=o||{};draw(POLE,{P,s:[k,k,k],c:[.4,.36,.32],pat:2,patS:6,gold:o.gold||0});}
// ---------- environments ----------
const MORN={sky:[.74,.78,.86],gnd:[.46,.45,.4],sunC:[.66,.6,.5],sunD:[.55,.55,.45],fog:[.82,.86,.92],fogD:.0035,skyTop:[.32,.52,.86],clouds:.35};
function tHF(x,z){return 1.6*Math.sin(x*.031+1)*Math.cos(z*.027)+.8*Math.sin(x*.07+z*.05);}
let GK='';function taigaGround(c){if(GK!=='T'){setGrid(-170,170,-200,140,tHF);GK='T';}draw(GRID,{c:c||[.42,.55,.32],pat:1,patS:1.3});}
// deterministic forest positions
function rnd(s){let x=s;return()=>{x=(x*9301+49297)%233280;return x/233280;};}
const FOREST=(()=>{const r=rnd(7);const L=[];for(let i=0;i<900;i++){const x=(r()-.5)*300,z=(r()-.5)*300-30;L.push([x,z,.8+r()*.5,Math.floor(r()*4)]);}return L;})();
function forest(cx_,cz,R,o){o=o||{};FOREST.forEach(([x,z,k,v],i)=>{const d=Math.hypot(x-cx_,z-cz);if(d>R||(o.skip&&d<o.skip)||(o.box&&!o.box(x,z)))return;
  let fall=0;if(o.wave!==undefined){const ar=o.wave-d;fall=ar>0?Math.min(1,ar/6):0;fall=ease(fall)*1.45;}
  if(o.flat&&d>(o.pole||0))fall=1.5;const burnt=o.flat&&d<40;
  const yaw=Math.atan2(x-(o.cx??cx_),z-(o.cz??cz));const P=xf([x,tHF(x,z)-.1,z],[0,yaw,0]);
  if(o.pole&&d<o.pole){pole(P,k,{gold:o.goldPole});return;}
  pine(P,k,v,fall,{burnt:burnt||(fall>1.2&&o.burn),dead:o.flat});});}
function camPlaque(e,tg,dist,dx,dy,k,val,dig,cap){const f=norm(sub(tg,e));const r=norm(cross(f,[0,1,0]));const u=cross(r,f);const p=[e[0]+f[0]*dist+r[0]*dx+u[0]*dy,e[1]+f[1]*dist+r[1]*dx+u[1]*dy,e[2]+f[2]*dist+r[2]*dx+u[2]*dy];
 const d=sub(e,p);const yaw=Math.atan2(d[0],d[2]);const pit=Math.atan2(d[1],Math.hypot(d[0],d[2]));plaque3D(cxf(xf(p,[0,yaw,0]),xf([0,0,0],[-pit,0,0])),val,dig,cap,k);}
// ---------- sky objects ----------
function fireball(p,dir,s,t,o){o=o||{};draw(SPH,{p,s:[s,s,s],c:[1,.97,.85],u:1,id:0});draw(SPH,{p,s:[s*1.9,s*1.9,s*1.9],c:[1,.75,.3],a:.45,u:1,add:1,id:0,noShadow:1});draw(SPH,{p,s:[s*3.4,s*3.4,s*3.4],c:[1,.6,.2],a:.18,u:1,add:1,id:0,noShadow:1});
 const n=o.trail||26;for(let i=1;i<n;i++){const f=i/n;const q=[p[0]-dir[0]*f*s*28+Math.sin(i*1.7+t)*.25*f*s,p[1]-dir[1]*f*s*28+Math.cos(i*2.3)*.2*f*s,p[2]-dir[2]*f*s*28];const r=s*(.7+f*1.6);
  draw(SPHL,{p:q,s:[r,r,r],c:f<.25?[1,.7,.3]:[.82,.78,.74],a:(1-f)*(f<.25?.6:.45),u:1,id:0,noShadow:1,add:f<.25?1:0});}}
function burst(p,k,a){if(k<=0)return;const c=k*.4;draw(SPH,{p,s:[c,c,c],c:[1,.97,.88],u:1,id:0,a:Math.min(1,a*1.2)});draw(SPH,{p,s:[k*.75,k*.75,k*.75],c:[1,.6,.2],a:.4*a,u:1,add:1,id:0,noShadow:1});draw(SPH,{p,s:[k*1.3,k*1.3,k*1.3],c:[.9,.42,.12],a:.12*a,u:1,add:1,id:0,noShadow:1});
 for(let i=0;i<18;i++){const an=i/18*Math.PI*2;draw(SPHL,{p:[p[0]+Math.cos(an)*k*1.25,p[1]+Math.sin(an*3)*k*.12,p[2]+Math.sin(an)*k*1.25],s:[k*.35,k*.22,k*.35],c:[.55,.5,.46],a:.35*a,u:1,id:0,noShadow:1});}}
function ring(c,r,h,a,col){if(a<=0||r<=0)return;draw(TUBE,{p:c,s:[r,h,r],c:col||[.72,.64,.52],a,u:1,id:0,noShadow:1,noInk:1});draw(TUBE,{p:[c[0],c[1],c[2]],s:[r*.97,h*1.6,r*.97],c:col||[.74,.68,.58],a:a*.45,u:1,id:0,noShadow:1,noInk:1});}
function dust(c,r,t,a,n){for(let i=0;i<(n||40);i++){const an=i*2.39996;const rr=r*(.85+.3*((i*.618)%1));const y=.6+((i*.37)%1)*2.5;draw(SPHL,{p:[c[0]+Math.cos(an)*rr,c[1]+y,c[2]+Math.sin(an)*rr],s:[1.6,1.2,1.6],c:[.7,.62,.5],a:a*.4,u:1,id:0,noShadow:1});}}
// ---------- people ----------
const EVK=[{coat:[.48,.34,.22],jacket:false,shirt:[.52,.38,.24],sleeve:[.48,.34,.22],pants:[.32,.24,.18],hat:'flat',hatc:[.3,.22,.16],hair:HAIRS[1],skin:SKINS[1]},{coat:[.62,.46,.3],jacket:false,shirt:[.6,.44,.3],pants:[.34,.26,.2],hair:HAIRS[1],skin:SKINS[1],dress:[.55,.36,.26],hairStyle:'bun'},{coat:[.4,.3,.22],jacket:false,shirt:[.45,.33,.24],pants:[.28,.22,.18],hat:'flat',hatc:[.45,.32,.2],hair:HAIRS[1],skin:SKINS[1],moustache:1}];
const KUL={coat:[.36,.34,.28],longcoat:1,pants:[.26,.25,.22],shirt:[.85,.83,.78],hat:'flat',hatc:[.32,.3,.26],hair:HAIRS[2],moustache:1,beard:1,seed:4};
function reindeer(P,o){o=o||{};cow(P,[.5,.4,.32]);const A=o.ant||[.62,.52,.4];for(const sd of[-1,1]){const b=[sd*.12,1.36,.66];const t1=[sd*.34,1.9,.5];lineC(P,b,t1,.025,A,{noShadow:0});lineC(P,[sd*.24,1.65,.58],[sd*.42,1.82,.78],.018,A);lineC(P,t1,[sd*.3,2.1,.72],.018,A);lineC(P,t1,[sd*.5,2.04,.36],.018,A);}}
function chum(P,c){draw(CONE,{P,s:[1.7,3.2,1.7],c:c||[.6,.48,.34],pat:2,patS:3});for(let i=0;i<6;i++){const a=i/6*Math.PI*2;lineC(P,[Math.cos(a)*.15,2.9,Math.sin(a)*.15],[Math.cos(a)*.35,3.9,Math.sin(a)*.35],.03,[.35,.25,.16]);}draw(BOX,{P,p:[0,.7,1.55],r:[-.5,0,0],s:[.7,1.3,.04],c:[.3,.2,.13]});}
// ---------- globe ----------
const LON=101.9,LAT=60.9;
function sGlobe(t){const k=ease(ss(0,1.9,t));env({eye:[0,0,lerp(5.4,3.2,k)],tgt:[0,0,0],fov:40,bg:[.055,.105,.17],fog:[.055,.105,.17],fogD:0,sky:[.9,.9,.95],gnd:[.55,.55,.6],sunC:[.45,.45,.45],sunD:[-.3,.4,.9],ink:.8,inkFar:50});
 globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.6,ss(1.0,1.5,t));for(let i=0;i<80;i++){const a=i*2.39,e=(i*.618)%1;draw(SPHL,{p:[Math.cos(a)*40,(e-.5)*70,-30+Math.sin(a)*10],s:[.08,.08,.08],c:[1,1,1],u:1,id:0});}}
// ---------- hook: airburst over taiga ----------
const EPI=[0,0,-60];
function sHook(t){if(t<2.6){const k=ease(ss(0,2.6,t));env({...MORN,eye:[lerp(-30,-26,k),lerp(16,14,k),lerp(70,60,k)],tgt:[0,lerp(18,22,k),-60],fov:46,bloom:1,fogD:.003,shadow:{c:[0,0,-20],r:90}});taigaGround();forest(0,-20,95);
  const u=ss(0,.75,t);const fp=[lerp(-120,EPI[0],u),lerp(100,34,u),lerp(-120,EPI[2],u)];if(t<.75)fireball(fp,norm([120,-70,60]),2.4,t);
  const b=ss(.7,1.0,t);burst([EPI[0],34,EPI[2]],b*(4+ss(1,2.6,t)*3),1-ss(1.4,2.6,t)*.6);return;}
 const lt=t-2.6,k=ease(ss(0,2.8,lt));env({...MORN,eye:[lerp(16,15,k),lerp(2.6,3.2,k),lerp(-24,-21,k)],tgt:[-20,lerp(4,5,k),-34],fov:46,bloom:1,shadow:{c:[-2,0,-30],r:30}});taigaGround();
 const W_=10+lt*22;forest(EPI[0],EPI[2],110,{wave:W_,box:(x,z)=>Math.hypot(x-16,z+24)>7});burst([EPI[0],26,EPI[2]],3.5,.5*(1-ss(0,2.8,lt)));ring([EPI[0],tHF(0,-60)-.5,EPI[2]],W_,3.4,.45*(1-ss(1.8,2.8,lt)));dust([EPI[0],0,EPI[2]],W_,lt,.8*(1-ss(1.8,2.8,lt)),44);}
// ---------- mystery tease ----------
function bog(c,R,o){o=o||{};draw(CYL,{p:[c[0],tHF(c[0],c[2])-.45,c[2]],s:[R,.5,R],c:[.32,.38,.26],pat:7,patS:1.5});draw(CYL,{p:[c[0],tHF(c[0],c[2])-.12,c[2]],s:[R*.6,.2,R*.6],c:[.18,.3,.3],pat:5,patS:.6,g:.6});
 for(let i=0;i<16;i++){const a=i*2.4,r=R*(.6+.35*((i*.618)%1));draw(SPHL,{p:[c[0]+Math.cos(a)*r,tHF(c[0],c[2])-.05,c[2]+Math.sin(a)*r],s:[.8,.35,.8],c:[.5,.55,.28],noInk:1});}}
function sMystery(t){const k=ease(ss(0,2,t));env({...MORN,sunD:[.3,.6,.6],eye:[lerp(14,9,k),lerp(5,3.2,k),lerp(-44,-50,k)],tgt:[0,1.5,-60],fov:44,desat:.25,shadow:{c:[0,0,-60],r:40}});taigaGround([.46,.5,.32]);
 bog([0,0,-60],7);forest(0,-60,40,{pole:16,flat:1,goldPole:.8*ss(.4,1.2,t)});}
// ---------- herders ----------
function camp(t,o){o=o||{};const C=[30,0,40];taigaGround();forest(30,20,70,{skip:13});for(const[x,z,r]of[[26,36,.3],[35,34,-.4]])chum(xf([x,tHF(x,z)-.05,z],[0,r,0]));
 draw(BOX,{p:[31,tHF(31,40)+.05,40],s:[.6,.1,.6],c:[.3,.25,.2]});
 const deer=[[24,43,.9],[27,45,-.6],[36,44,2.4],[38,40,1.6]];deer.forEach(([x,z,r],i)=>{const sh=o.shove||0;const P=xf([x+sh*.5,tHF(x,z),z+sh*.8],[0,r,o.knock?-o.knock*(i%2?1:-1)*1.2:0],.72);reindeer(P);});}
function sHerders(t){if(t<2.4){const k=ease(ss(0,2.4,t));env({...MORN,eye:[lerp(20,22,k),lerp(4,4.6,k),lerp(56,54,k)],tgt:[31,2.2,40],fov:42,shadow:{c:[31,0,40],r:16}});camp(t);
  [[29,40.6,2.8],[32.5,41.6,3.3],[30.6,43.2,2.6]].forEach(([x,z,r],i)=>person(xf([x,tHF(x,z),z],[0,r,0]),Object.assign({seed:20+i},EVK[i],{head:[-.1,0,0]})));return;}
 const lt=t-2.4,k=ease(ss(0,2.6,lt));env({...MORN,eye:[lerp(31.5,31.2,k),lerp(1.2,1.1,k),lerp(47,46.4,k)],tgt:[lerp(28,20,k),lerp(6,9,k),lerp(30,26,k)],fov:46,bloom:1,shadow:{c:[31,0,40],r:14}});camp(t);
 [[29,40.6,2.6],[32.5,41.6,3.0],[30.6,43.2,2.9]].forEach(([x,z,r],i)=>person(xf([x,tHF(x,z),z],[0,r,0]),Object.assign({seed:20+i},EVK[i],{head:[-.6,0,0],worry:1,mouthO:i==1?1:0},i==0?{armR:[-2.5,0,-.3],elbowR:.1}:{})));
 const u=ss(.0,2.6,lt);fireball([lerp(70,-30,u),lerp(60,45,u),lerp(-40,-30,u)],norm([-100,-15,10]),1.7,t,{trail:30});}
function sSplit(t){const k=ease(ss(0,2.7,t));env({...MORN,eye:[30,1.4,48],tgt:[lerp(20,10,k),lerp(14,16,k),-20],fov:52,bloom:1,noSky:0,shadow:false,desat:-.1});camp(t);
 const u=ss(0,.9,t);fireball([lerp(40,0,u),lerp(46,40,u),lerp(-40,-60,u)],norm([-40,-6,-20]),2,t,{trail:30});
 const b=ss(.75,1.1,t);burst([0,40,-60],b*(12+ss(1.1,2.7,t)*16),1);
 // split line across sky
 const sp=ss(.55,.95,t)*(1-ss(1.6,2.6,t));if(sp>0)draw(BOX,{p:[0,40,-62],r:[0,0,-.06],s:[220*sp,1.2,.5],c:[1,1,.95],u:1,id:0});}
// ---------- trading post ----------
function post_(t,o){o=o||{};const C=[-60,0,90];taigaGround();forest(-60,60,90,{box:(x,z)=>Math.hypot(x+60,z-90)>11&&!(Math.abs(x+57)<9&&z>86)});
 house(xf([-60,groundY(tHF,-60,90,6,5),90],[0,.1,0]),{w:6,d:5,floors:1,style:'wood',wall:[.62,.45,.3],roof:[.42,.34,.26]});
 const y0=groundY(tHF,-60,90,6,5);draw(BOX,{p:[-59.7,y0+.225,93.1],r:[0,.1,0],s:[2.4,.45,1.2],c:[.5,.36,.24],pat:2,patS:3});
 fence(xf([-66,tHF(-66,95),96],[0,.1,0]),5);barrel(xf([-57,y0,93]),[.5,.36,.22]);crate(xf([-63,y0,93.2]),[.55,.42,.28]);
 return y0;}
const TRADER={coat:[.5,.3,.22],jacket:false,shirt:[.75,.32,.24],sleeve:[.75,.32,.24],pants:[.25,.24,.22],hair:HAIRS[0],beard:1,moustache:1,seed:9};
function sPost(t){const glow=[1,.55,.25];
 if(t<2.1){const k=ease(ss(0,2.1,t));env({...MORN,eye:[lerp(-55.5,-56.5,k),lerp(2.8,2.4,k),lerp(104,101,k)],tgt:[-59.8,1.5,92.5],fov:44,plP:[-40,30,40],plC:glow.map(v=>v*1.6),plR:120,bloom:1,shadow:{c:[-60,0,92],r:14}});const y0=post_(t);
  person(xf([-59.6,y0,93.05],[0,.1,0]),Object.assign({},TRADER,{sit:1,head:[-.2,-.5,0]}));burst([-20,32,-60],10,.8);return;}
 const lt=t-2.1,k=ease(ss(0,2.3,lt));const y0=groundY(tHF,-60,90,6,5);env({...MORN,eye:[lerp(-58.9,-59.1,k),lerp(y0+1.35,y0+1.3,k),lerp(96.4,95.9,k)],tgt:[-59.6,y0+1.05,93.1],fov:40,plP:[-50,12,60],plC:glow.map(v=>v*2.2),plR:80,bloom:1,dof:[2.6,1.6],desat:.35,shadow:{c:[-60,0,92],r:8}});post_(t);
 const sh=ss(.2,.7,lt);person(Object.assign(xf([-59.6,y0,93.05],[0,.1,0]),{gold:1}),Object.assign({},TRADER,{sit:1,lean:-.2*sh,armR:[lerp(-.3,-1.5,sh),0,lerp(.1,.35,sh)],elbowR:lerp(.2,1.7,sh),head:[.15*sh,-.4,0],worry:1,mouthO:1}));
}
// ---------- thrown ----------
function sThrown(t){const k=ease(ss(0,2.9,t));const W_=lerp(-6,30,ss(.2,1.6,t));env({...MORN,eye:[lerp(21,20.5,k),lerp(1.8,2.1,k),lerp(42,43,k)],tgt:[31,1.0,41.5],fov:44,bloom:1,shadow:{c:[31,0,40],r:16}});
 const hit=ss(.55,1.0,t);camp(t,{shove:hit,knock:0});
 // shock dust wall coming from the epicentre direction (-z)
 const zf=lerp(14,54,ss(.1,1.5,t));for(let i=0;i<40;i++){const x=16+i*.75;const zz=zf-((i*.37)%1)*4;draw(SPHL,{p:[x,tHF(x,zz)+.4+((i*.53)%1)*1.8,zz],s:[1.5,1.1,1.5],c:[.62,.54,.42],a:.2*(1-ss(1.4,2.4,t)),u:1,id:0,noShadow:1});}
 [[29,40.6,2.8],[32.5,41.6,3.3],[30.6,43.2,2.6]].forEach(([x,z,r],i)=>{const f=ease(ss(.55+i*.08,1.25+i*.08,t));const P=cxf(xf([x,tHF(x,z),z+f*1.2],[0,0,0]),xf([0,0,0],[f*1.35,0,0]));person(P,Object.assign({seed:20+i},EVK[i],{armL:[-1.8*f,0,-.6*f],armR:[-1.8*f,0,.6*f],elbowL:.4,elbowR:.4,worry:1,mouthO:1,head:[-.3*f,0,0]}));});}
// ---------- flattening ----------
function sFlatten(t){if(t<5.3){const k=ease(ss(0,5.3,t));const E=[lerp(70,60,k),lerp(58,52,k),lerp(30,10,k)],TG=[0,0,-62];env({...MORN,eye:E,tgt:TG,fov:46,bloom:1,shadow:{c:[0,0,-60],r:110}});taigaGround();
  const W_=lerp(8,120,ss(0,4.6,t));forest(EPI[0],EPI[2],125,{wave:W_});ring([EPI[0],-.5,EPI[2]],W_,3.6,.5*(1-ss(4,5.3,t)));draw(SPH,{p:[0,2,-60],s:[2.2,2.2,2.2],c:[1,.75,.25],u:1,id:0,a:.8,gold:1});
  camPlaque(E,TG,30,0,3.4,4.0,Math.round(80000000*ease(ss(2.6,5.0,t))),8,'TREES FLATTENED');return;}
 const lt=t-5.3,k=ease(ss(0,2.3,lt));env({...MORN,eye:[lerp(6,0,k),lerp(118,128,k),lerp(-20,-50,k)],tgt:[0,0,-60],up:[0,0,-1],fov:46,shadow:{c:[0,0,-60],r:120}});taigaGround([.5,.55,.36]);
 forest(EPI[0],EPI[2],130,{flat:1});const pl=.5+.5*Math.sin(t*5);draw(SPH,{p:[0,3,-60],s:[3+pl,3+pl,3+pl],c:[1,.75,.25],u:1,id:0,gold:1});
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const r0=12,r1=12+ss(.2,1.2,lt)*26;lineC(xf([0,0,0]),[Math.sin(a)*r0,6,-60+Math.cos(a)*r0],[Math.sin(a)*r1,6,-60+Math.cos(a)*r1],.6,[1,.71,.18],{u:1,id:0,gold:1});
  const tp=[Math.sin(a)*r1,6,-60+Math.cos(a)*r1];draw(CONE,{p:tp,r:[Math.PI/2,a,0],s:[1.6,3,1.6],c:[1,.71,.18],u:1,id:0,gold:1});}}
// ---------- Europe at midnight ----------
const CLK=document.createElement('canvas');CLK.width=256;CLK.height=256;function clockTex(h){const g=CLK.getContext('2d');g.fillStyle='#f3ead6';g.beginPath();g.arc(128,128,124,0,Math.PI*2);g.fill();g.strokeStyle='#3a2a18';g.lineWidth=6;g.stroke();
 g.fillStyle='#2a1e12';g.textAlign='center';g.textBaseline='middle';const R=['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI'];for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.font=`700 ${i%3?20:28}px "DejaVu Serif"`;g.fillText(R[i],128+Math.sin(a)*96,128-Math.cos(a)*96);}
 const ha=h/12*Math.PI*2,ma=(h%1)*Math.PI*2;g.lineCap='round';g.strokeStyle='#1a120a';g.lineWidth=9;g.beginPath();g.moveTo(128,128);g.lineTo(128+Math.sin(ha)*55,128-Math.cos(ha)*55);g.stroke();g.lineWidth=5;g.beginPath();g.moveTo(128,128);g.lineTo(128+Math.sin(ma)*86,128-Math.cos(ma)*86);g.stroke();g.fillStyle='#b8862a';g.beginPath();g.arc(128,128,8,0,Math.PI*2);g.fill();}
const GLOWSKY=[[.98,.82,.62],[.92,.76,.62],[.8,.68,.62],[.62,.56,.6],[.44,.44,.56],[.3,.32,.48],[.2,.23,.4],[.14,.17,.33]];
function glowDome(){GLOWSKY.forEach((col,i)=>draw(TUBE,{p:[0,-30+i*40,-40],s:[380,40.5,380],c:col,u:1,id:0,noInk:1,noShadow:1}));draw(CYL,{p:[0,290,-40],s:[382,1,382],c:[.12,.15,.3],u:1,id:0,noInk:1,noShadow:1});}
const EUN=o=>Object.assign({noSky:1,sky:[.7,.66,.66],gnd:[.36,.34,.34],sunC:[.62,.55,.5],sunD:[-.2,.5,-.85],fog:[.5,.46,.52],fogD:.0012,bloom:1},o);
function street(t,o){o=o||{};draw(BOX,{p:[0,-.5,-30],s:[200,1,200],c:[.5,.48,.44],pat:6,patS:1.2});road(0,12,0,-90,7,null,[.48,.45,.42]);
 for(let i=0;i<6;i++)for(const sd of[-1,1]){const x=sd*9.5,z=-6-i*9;house(xf([x,0,z],[0,sd<0?Math.PI/2:-Math.PI/2,0]),{w:7,d:7,floors:2+(i%2),style:i%3==0?'brick':'plaster',wall:[[.72,.48,.38],[.86,.8,.68],[.7,.74,.78]][(i+(sd>0))%3],roof:[[.34,.3,.32],[.3,.32,.4]][i%2]});}
 for(let i=0;i<6;i++)lamppost(xf([i%2?4.5:-4.5,0,-2-i*12]),1);
 // clock tower at end
 draw(BOX,{p:[0,8,-64],s:[6,16,6],c:[.62,.56,.48],pat:3,patS:1.6});draw(PRISM,{p:[0,16,-64],s:[6.6,4,6.6],c:[.3,.32,.38]});
 clockTex(o.clockH||12.4);dynTex('clk',CLK);draw(CYL,{p:[0,12,-60.9],r:[Math.PI/2,0,0],s:[2,.1,2],c:[.5,.36,.2],gold:o.gClock||0});draw(QUAD,{p:[0,12,-60.8],s:[3.6,3.6,1],c:[1,1,1],tex:3,u:1});}
function sEurope(t){if(t<3.0){const k=ease(ss(0,3,t));env(EUN({eye:[lerp(-2,1,k),lerp(2,2.4,k),lerp(16,12,k)],tgt:[0,lerp(10,14,k),-60],fov:48}));glowDome();street(t,{clockH:12.45});
  for(let i=0;i<3;i++)person(xf([-1.8+i*1.6,0,4-i*1.2],[0,Math.PI+(i-1)*.25,0]),Object.assign({seed:40+i,head:[-.5,0,0]},i==1?{dress:[.45,.32,.42],hairStyle:'bun',female:1}:{coat:[[.25,.25,.3],0,[.38,.3,.22]][i],hat:i?'bowler':'flat'},i==2?{armR:[-2.6,0,-.3],elbowR:.1}:{}));return;}
 const lt=t-3.0,k=ease(ss(0,3.5,lt));env(EUN({eye:[lerp(3.15,3.0,k),lerp(2.15,2.05,k),lerp(-2.6,-3.2,k)],tgt:[lerp(2.3,2.2,k),lerp(2.5,3.6,k),-16],fov:44,plP:[3.5,4,-3],plC:[1,.85,.6],plR:8}));glowDome();street(t,{clockH:12.5});
 bench(xf([2.6,0,-6],[0,Math.PI,0]));const G=xf([2.6,0,-6.05],[0,Math.PI,0]);person(G,{seed:44,sit:1,coat:[.25,.28,.34],hat:'bowler',hatc:[.2,.18,.16],moustache:1,armL:[-1.1,0,-.3],armR:[-1.1,0,.3],elbowL:1.0,elbowR:1.0,head:[.35,0,0]});
 draw(BOX,{P:G,p:[0,1.08,.45],r:[-.5,0,0],s:[.62,.42,.02],c:[.95,.93,.86],gold:1});draw(BOX,{P:G,p:[0,1.09,.452],r:[-.5,0,0],s:[.5,.04,.005],c:[.3,.28,.26],u:1});}
// ---------- remote taiga, 19 years ----------
function sRemote(t){const k=ease(ss(0,5.1,t));env({...MORN,sunD:[.4,.7,.3],eye:[lerp(-40,-20,k),lerp(40,24,k),lerp(120,95,k)],tgt:[lerp(-20,-10,k),0,lerp(60,50,k)],fov:46,shadow:{c:[-15,0,60],r:60}});taigaGround();forest(-15,60,90,{skip:0});
 // river
 for(let i=0;i<14;i++){const z=20+i*8;const x=-38+Math.sin(i*.6)*6;draw(BOX,{p:[x,tHF(x,z)+.15,z],r:[0,Math.sin(i*.6+.3)*.5,0],s:[5,.1,9],c:[.2,.38,.5],pat:5,patS:.5,g:.6,noShadow:1});}
 if(t>2.0){const u=t-2;for(let i=0;i<3;i++){const z=78-u*1.2-i*1.6,x=-26+i*.4;person(xf([x,tHF(x,z),z],[0,Math.PI,0],1.6),Object.assign({seed:50+i,walk:1,phase:u*6.5+i},i==0?KUL:{coat:[.4,.36,.3],hat:'flat',hatc:[.3,.28,.24]}));}}
 plaque3D(xf([-20,16,76],[-.5,-.25,0],4.2),t<1.9?0:Math.round(19*ease(ss(1.9,4.2,t))),2,'YEARS LATER');}
// ---------- Kulik plinth ----------
function plinth(fig,t,o){o=o||{};const a=.6+t*.18;env({noSky:1,sky:[.6,.57,.54],gnd:[.3,.27,.24],sunC:[.5,.47,.42],sunD:[-.3,.8,.6],fog:[.16,.15,.17],fogD:.016,eye:[Math.sin(a)*o.r,o.h,Math.cos(a)*o.r],tgt:[0,o.ty,0],fov:40,dof:[Math.hypot(o.r,o.h-o.ty),o.r*.4],plP:[1.5,5,3],plC:[.9,.78,.55],plR:14,desat:.2});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.4,.3,.22],pat:2,patS:1.2,g:.3});for(let i=-3;i<=3;i++)draw(BOX,{p:[i*4,3,-9],s:[3.6,6,.3],c:[.36,.3,.3],pat:6,patS:1});draw(BOX,{p:[0,6.2,-9],s:[30,.3,.5],c:[.6,.46,.22]});
 const pr=o.pr||1.4,ph=o.ph||1;draw(CYL,{p:[0,0,0],s:[pr,ph,pr],c:[.78,.74,.68],pat:6,patS:3,g:.3});draw(CYL,{p:[0,ph,0],s:[pr*1.1,.12,pr*1.1],c:[.86,.82,.76],pat:6,patS:3,g:.3});draw(CYL,{p:[0,0,0],s:[pr*1.12,.1,pr*1.12],c:[.62,.58,.52]});
 fig(cxf(xf([0,ph+.12,0],[0,-t*.35,0]),xf([0,0,0]),{gold:1}));}
function sKulik(t){plinth(P=>person(P,Object.assign({},KUL,{armR:[-.4,0,.15],elbowR:.3})),t,{r:3.6,h:2.3,ty:1.95,pr:.9,ph:.9});}
// ---------- the search ----------
function sSearch(t){const k=ease(ss(0,2,t));const z=-20-t*1.3;env({...MORN,sunD:[.3,.6,.6],eye:[lerp(3.2,2.6,k),lerp(2.2,2.0,k),z+lerp(4.5,4,k)],tgt:[0,1.6,z-3],fov:44,desat:.15,shadow:{c:[0,0,z],r:14}});taigaGround([.46,.5,.32]);
 forest(0,-60,62,{flat:1,pole:16,cx:0,cz:-60,box:(x,z)=>Math.abs(x)>1.4||z>-14});person(Object.assign(xf([0,tHF(0,z),z],[0,Math.PI,0]),{gold:1}),Object.assign({},KUL,{walk:1,phase:t*6.2}));
 lineC(xf([0,0,0]),[.45,tHF(0,z)+1.4,z+.1],[.6,tHF(0,z)+.1,z+.5],.03,[.4,.3,.2]);}
// ---------- nothing ----------
function sNothing(t){if(t<3.3){const k=ease(ss(0,3.3,t));env({...MORN,sunD:[.3,.6,.6],eye:[lerp(-2,-1,k),lerp(2.4,3.4,k),lerp(-40,-42,k)],tgt:[0,lerp(1.2,.5,k),-60],fov:44,desat:.3,shadow:{c:[0,0,-55],r:22}});taigaGround([.46,.5,.32]);
  bog([0,0,-60],7);forest(0,-60,45,{pole:16,flat:1});person(xf([-1,tHF(-1,-48),-48],[0,Math.PI+.2,0]),Object.assign({},KUL,{head:[.2,lerp(-.5,.5,ss(.5,2.5,t)),0],armR:[-.3,0,.4],elbowR:.4}));return;}
 if(t<6.55){const lt=t-3.3,a=lt*.22+.4;env({...MORN,sunD:[.3,.6,.6],eye:[Math.sin(a)*21,lerp(2.2,3.2,lt/3.2),-60+Math.cos(a)*21],tgt:[0,3,-60],fov:42,desat:.45,bloom:1,shadow:{c:[0,0,-60],r:22}});taigaGround([.46,.5,.32]);
  bog([0,0,-60],5);forest(0,-60,50,{pole:16,flat:1,goldPole:1});return;}
 const lt=t-6.55,k=ease(ss(0,2.5,lt));env({...MORN,sunD:[.3,.6,.6],eye:[lerp(20,26,k),lerp(30,40,k),lerp(-20,-12,k)],tgt:[0,0,-60],fov:46,desat:.3,shadow:{c:[0,0,-60],r:60}});taigaGround([.46,.5,.32]);bog([0,0,-60],6);forest(0,-60,80,{pole:16,flat:1,goldPole:1});}
// ---------- airburst diagram ----------
function sAir(t){const k=ease(ss(0,3.9,t));env({...MORN,sunD:[.2,.8,.6],eye:[lerp(-8,-5,k),lerp(10,12,k),lerp(22,28,k)],tgt:[0,17,-60],fov:46,bloom:1,shadow:{c:[0,0,-60],r:70}});taigaGround();
 const u=ss(.1,1.3,t);const R=[lerp(-70,0,u),lerp(80,40,u),-60];const blown=ss(1.3,1.6,t);
 if(blown<.01){rock(xf(R,[t,t*.7,0],2.2),1,[.5,.45,.4],1);draw(SPH,{p:R,s:[2.8,2.8,2.8],c:[1,.7,.3],a:.35,u:1,add:1,id:0,noShadow:1});for(let i=1;i<22;i++){const f=i/22;draw(SPHL,{p:[R[0]-f*40*.87,R[1]+f*40*.5,R[2]],s:[1.4+f*3,1.4+f*3,1.4+f*3],c:f<.3?[1,.7,.3]:[.85,.8,.75],a:(1-f)*.5,u:1,id:0,noShadow:1});}}
 burst([0,40,-60],blown*(2.8+ss(1.6,3,t)*2),1-ss(2.4,3.9,t)*.7);
 const c=ss(1.5,2.6,t);if(c>0){ring([0,tHF(0,-60)-.5,-60],lerp(4,60,ss(2.0,3.9,t)),3,.4*(1-ss(3.2,3.9,t)));for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const f=ss(1.5,2.4,t);lineC(xf([0,0,0]),[0,40,-60],[Math.sin(a)*f*24,lerp(40,2,f),-60+Math.cos(a)*f*8],.25,[1,.8,.4],{u:1,id:0,a:.6*(1-ss(2.8,3.6,t))});}}
 const W_=c>0?lerp(0,60,ss(2.2,3.9,t)):-10;forest(0,-60,70,{wave:W_>0?W_+16:undefined,pole:W_>0?16:0});
 // altitude marker
 lineC(xf([0,0,0]),[-14,0,-60],[-14,40,-60],.25,[1,.71,.18],{u:1,id:0});for(const y of[0,40])draw(BOX,{p:[-14,y,-60],s:[4,.4,.4],c:[1,.71,.18],u:1,id:0});}
// ---------- future / city ----------
function sSpace(t){const k=ease(ss(0,2.8,t));env({bg:[.015,.02,.05],fog:[.015,.02,.05],fogD:0,sky:[.6,.6,.65],gnd:[.25,.25,.3],sunC:[.6,.55,.5],sunD:[-.8,.3,.5],shadow:false,bloom:1,eye:[0,0,lerp(7,5.6,k)],tgt:[0,0,0],fov:40});
 for(let i=0;i<160;i++){const a=i*2.39996,e=((i*.618)%1)-.5;draw(SPHL,{p:[Math.cos(a)*60,e*90,-40+Math.sin(a)*8],s:[.09,.09,.09],c:[1,1,.95],u:1,id:0});}
 globe3D(xf([0,0,0]),-20,30,t*.2,0);for(let i=0;i<5;i++){const ph=(t*.25+i*.21)%1;const a=i*1.3;const p=[Math.cos(a)*lerp(5,1.6,ph),Math.sin(a)*lerp(5,1.6,ph)*.6,Math.sin(a*2)];rock(xf(p,[t+i,t*.5,0],.28),1,[.6,.54,.46],i);}}
const CITY=(()=>{let s=3;const r=()=>{s=(s*9301+49297)%233280;return s/233280;};const B=[];for(let i=-7;i<=7;i++)for(let j=0;j<10;j++){if(r()<.15)continue;const h=6+r()*r()*40;B.push([i*9+r()*2,-j*9-r()*2,4+r()*3,h,4+r()*3]);}return B;})();
const CBLD=merge(CITY.map(([x,z,w,h,d])=>({p:[x,h/2,z],s:[w,h,d]})));
const CWIN=merge((()=>{const L=[];CITY.forEach(([x,z,w,h,d],bi)=>{const fl=Math.floor(h/2);for(let f=0;f<fl;f++){const y=1.2+f*2;for(let c=0;c<Math.max(1,Math.floor(w/1.4));c++){const cx_=x-w/2+.7+c*1.4;if(cx_>x+w/2-.4)continue;L.push({p:[cx_,y,z+d/2+.03],s:[.8,1.1,.04]});}}});return L;})());
function sCity(t){const k=ease(ss(0,2.9,t));env({...MORN,sunD:[-.4,.7,.5],eye:[lerp(-22,-16,k),lerp(7,8,k),lerp(64,58,k)],tgt:[0,lerp(34,40,k),-90],fov:48,bloom:1,fogD:.0025,shadow:{c:[0,0,-30],r:70}});
 draw(BOX,{p:[0,-.5,-40],s:[400,1,400],c:[.4,.42,.4],pat:6,patS:.8});draw(CBLD,{c:[.62,.68,.76],g:.5});draw(CWIN,{c:[.25,.35,.5],g:.8,noInk:1});
 for(let i=0;i<12;i++)tree(xf([-60+i*11,0,12]),1,null,'broad');
 const u=ss(.2,2.9,t);fireball([lerp(-45,15,u),lerp(80,60,u),lerp(-170,-160,u)],norm([60,-30,10]),1.4,t,{trail:22});}
// ---------- archive ----------
function sArchive(t){env({noSky:1,sky:[.42,.38,.34],gnd:[.24,.2,.17],sunC:[.48,.4,.32],sunD:[-.3,.6,.7],fog:[.14,.12,.1],fogD:.03,eye:[0,1.7,lerp(6.5,5,ease(ss(0,4,t)))],tgt:[0,1.5,0],fov:44,plP:[0,2.5,2],plC:[.8,.6,.35],plR:7,bloom:1});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 draw(BOX,{p:[0,1.28,1.2],s:[1.2,.06,.5],c:[.4,.26,.15]});lineC(xf([0,0,0]),[-.5,1.36,1.2],[.5,1.38,1.25],.07,[.42,.36,.3]);rock(xf([.15,1.32,1.0],[0,1,0],.15),1,[.5,.45,.4],2);}
// ---------- timeline ----------
const S=[[0,2.2,sGlobe],[2.2,7.6,sHook],[7.6,9.6,sMystery],[9.6,14.6,sHerders],[14.6,17.3,sSplit],[17.3,21.7,sPost],[21.7,24.6,sThrown],[24.6,32.2,sFlatten],[32.2,38.7,sEurope],[38.7,43.8,sRemote],[43.8,46.9,sKulik],[46.9,48.9,sSearch],[48.9,57.9,sNothing],[57.9,62.1,sAir],[62.1,64.95,sSpace],[64.95,67.95,sCity],[67.95,77.0,sArchive]];
const END=77.0;
const RIB=[[9.7,.02,'30 JUNE 1908'],[32.4,.03,'NIGHTS AFTER'],[40.6,.16,'1927'],[58.0,.98,'TODAY']];
function overlays(T,fn,lt){
 badge('SIBERIA','JUNE 1908',LON,LAT,T,ss(1.9,2.5,T)*(1-ss(67.5,67.9,T)));
 ribbon(T,RIB,['1908','TODAY'],ss(9.6,10.0,T)*(1-ss(67.4,67.8,T)));
 if(fn===sGlobe)tag('30 JUNE 1908',W/2,1180,.9,2.2,T);
 seal(1,'THE BLAST',9.65,T);seal(2,'THE SEARCH',38.75,T);seal(3,'THE TWIST',48.95,T);
 if(fn===sHook){if(lt<2.6)tag('SIBERIA, RUSSIA',W/2,420,2.5,4.7,T);else tag('A MID-AIR EXPLOSION',W/2,420,5.0,7.5,T,{size:38});}
 if(fn===sMystery)bigText([['WHAT WAS IT?',96,GOLD]],7.8,9.5,T,520);
 if(fn===sHerders&&lt>2.4)tag('FIREBALL',W/2,420,12.1,14.5,T);
 if(fn===sPost){if(lt<2.1)tag('A TRADING POST',W/2,420,17.5,19.3,T);else tag('HEAT LIKE FIRE',W/2,420,19.6,21.6,T);}
 if(fn===sThrown)tag('SHOCKWAVE',W/2,420,21.9,24.5,T);
 if(fn===sFlatten){if(lt<5.3)tag('2,000 KM² OF FOREST',W/2,420,24.8,27.6,T,{size:38});else tag('ALL POINTING AWAY',W/2,420,29.9,32.1,T);}
 if(fn===sEurope){if(lt<3)tag('EUROPE',W/2,420,32.5,35.1,T);else tag('BRIGHT AS DUSK',W/2,420,35.4,38.6,T,{size:38});}
 if(fn===sRemote)tag('NO ROADS. ONLY FOREST.',W/2,420,38.9,40.4,T,{size:36});
 if(fn===sKulik)museum('LEONID KULIK','Meteorite scientist','1883–1942',540,1000,44.0,46.8,T,'r');
 if(fn===sSearch)tag('A GIANT CRATER?',W/2,420,47.0,48.8,T);
 if(fn===sNothing){bigText([['NO CRATER.',96,PARCH]],50.1,51.1,T,520);bigText([['NO ROCK.',96,GOLD]],51.2,52.15,T,520);if(lt>6.55)tag('STILL STANDING',W/2,420,55.6,57.8,T);}
 if(fn===sAir){tag('EXPLODED IN THE AIR',W/2,420,58.2,62.0,T,{size:38});if(lt>1.3){const pp=proj([-14,22,-60]);tag('5–10 KM UP',pp[0]+120,pp[1],59.3,62,T,{size:34,f:MF});}}
 if(fn===sSpace)tag('EVERY FEW CENTURIES',W/2,420,62.3,64.9,T,{size:38});
 if(fn===sCity)tag('NEXT TIME?',W/2,420,65.2,67.9,T);
 if(fn===sArchive){archiveCard([['JUNE 30 · ASTEROID DAY'],'Because of Tunguska, the','United Nations made June 30','"Asteroid Day", to warn the','world about space rocks.'],68.2,T);outro(73.6,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 if(fn===sHook&&lt>.7&&lt<1.2)flash((1-(lt-.7)/.5)*.85);
 if(fn===sSplit&&lt>.8&&lt<1.6)flash((1-(lt-.8)/.8)*.9);
 if(fn===sAir&&lt>1.3&&lt<1.7)flash((1-(lt-1.3)/.4)*.5);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
