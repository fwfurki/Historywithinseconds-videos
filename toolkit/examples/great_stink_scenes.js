// ===== THE GREAT STINK (London, 1858) — HistoryWithinSeconds =====
const SEAL_Y=640;
const SUBS=window.SUBS_DATA;
function lineC(P,a,b,r,c,o){const d=sub(b,a),L=Math.hypot(...d)||1e-4;draw(CYL,Object.assign({P,p:a,r:[Math.acos(clamp(d[1]/L,-1,1)),Math.atan2(d[0],d[2]),0],s:[r,L,r],c:c||[.15,.12,.1],noShadow:1},o||{}));}
function camPlaque(e,tg,dist,dx,dy,k,val,dig,cap){const f=norm(sub(tg,e));const r=norm(cross(f,[0,1,0]));const u=cross(r,f);const p=[e[0]+f[0]*dist+r[0]*dx+u[0]*dy,e[1]+f[1]*dist+r[1]*dx+u[1]*dy,e[2]+f[2]*dist+r[2]*dx+u[2]*dy];
 const d=sub(e,p);const yaw=Math.atan2(d[0],d[2]);const pit=Math.atan2(d[1],Math.hypot(d[0],d[2]));plaque3D(cxf(xf(p,[0,yaw,0]),xf([0,0,0],[-pit,0,0])),val,dig,cap,k);}
// ---------- env ----------
const SUMMER={sky:[.78,.78,.8],gnd:[.48,.45,.4],sunC:[.72,.64,.5],sunD:[-.45,.75,.45],fog:[.86,.84,.78],fogD:.004,skyTop:[.36,.55,.85],clouds:.25};
const HAZE=o=>Object.assign({},SUMMER,{fog:[.8,.82,.66],fogD:.006,skyTop:[.5,.6,.72],clouds:.15},o);
// ---------- London riverside ----------
const RIVER_Z=-14;// river from z=-14 to z=-44
function thames(o){o=o||{};const lv=o.level===undefined?0:o.level;const c=o.clean?[.16,.36,.46]:[.33,.34,.2];
 draw(BOX,{p:[0,-1.4+lv,-29],s:[400,1,30],c,pat:5,patS:.35,g:.6,noShadow:1});
 // mud banks revealed when level drops
 draw(BOX,{p:[0,-2.2,-15.5],r:[.18,0,0],s:[400,1.2,5],c:[.36,.3,.2],pat:7,patS:1.4});draw(BOX,{p:[0,-2.2,-42.5],r:[-.18,0,0],s:[400,1.2,5],c:[.36,.3,.2],pat:7,patS:1.4});
 if(!o.clean){for(let i=0;i<70;i++){const x=((i*37)%140)-70+Math.sin(TIME*.3+i)*.6,z=-16-((i*13)%26);const y=-.9+lv+(lv<-.4&&(z>-19||z<-40)?-.4:0);draw(SPHL,{p:[x+((TIME*.4)%10),y,z],s:[.3+(i%3)*.12,.12,.25],c:[[.3,.24,.14],[.4,.36,.22],[.22,.2,.12]][i%3],noInk:1});}}}
function quay(){draw(BOX,{p:[0,-1,-12.5],s:[400,2.2,3],c:[.62,.58,.5],pat:6,patS:1.2});draw(BOX,{p:[0,.12,-13.9],s:[400,.25,.25],c:[.5,.47,.42]});
 draw(BOX,{p:[0,-1,-45.5],s:[400,2.2,3],c:[.62,.58,.5],pat:6,patS:1.2});}
const TOWNH=(()=>{const L=[];for(let i=0;i<16;i++)L.push([-60+i*7.5,-1+(i%3)*-1.2,i]);return L;})();
function town(o){o=o||{};draw(BOX,{p:[0,-.5,20],s:[400,1,64],c:[.56,.52,.46],pat:6,patS:1.1});road(-80,-6,80,-6,6,null,[.5,.45,.38]);
 TOWNH.forEach(([x,z,i])=>house(xf([x,0,z+4],[0,Math.PI,0]),{w:6.6,d:6,floors:2+(i%3==0),style:i%3==1?'plaster':'brick',wall:[[.66,.42,.32],[.84,.78,.64],[.58,.4,.32]][i%3],roof:[[.32,.3,.32],[.36,.3,.28]][i%2]}));
 for(let i=0;i<8;i++)lamppost(xf([-50+i*14,0,-10.6]),0);
 // far bank houses
 for(let i=0;i<14;i++)house(xf([-60+i*9,0,-52]),{w:7,d:5,floors:2,style:'brick',wall:[[.6,.42,.32],[.7,.6,.48]][i%2],roof:[.34,.32,.34]});draw(BOX,{p:[0,-.5,-75],s:[400,1,50],c:[.5,.48,.42],pat:6,patS:1});}
function fumes(cx_,cz,w,d,t,n,a,y0){for(let i=0;i<(n||30);i++){const ph=((t*.12+i*.137)%1);const x=cx_+(((i*.618)%1)-.5)*w+Math.sin(t*.7+i)*.8,z=cz+(((i*.377)%1)-.5)*d;const r=.9+ph*2.2;
 draw(SPHL,{p:[x,(y0||-1)+ph*7,z],s:[r,r*.6,r],c:[.55,.66,.3],a:(a||.25)*Math.sin(ph*Math.PI),u:1,id:0,noShadow:1,noInk:1});}}
const LDN=[{coat:[.22,.22,.26],hat:'bowler',hatc:[.15,.14,.14],moustache:1},{dress:[.42,.3,.42],hairStyle:'bun',female:1},{coat:[.4,.3,.22],hat:'flat',hatc:[.3,.26,.2],jacket:false,shirt:[.8,.76,.66]},{coat:[.25,.3,.4],hat:'bowler',hatc:[.2,.18,.16]},{dress:[.3,.4,.45],hairStyle:'bun',female:1},{coat:[.32,.26,.2],hat:'flat',hatc:[.25,.22,.18],beard:1}];
const NOSE={armR:[-1.0,0,-.95],elbowR:2.6,worry:1};
// ---------- globe ----------
const LON=-0.12,LAT=51.5;
function sGlobe(t){const k=ease(ss(0,2.1,t));env({eye:[0,0,lerp(5.4,3.2,k)],tgt:[0,0,0],fov:40,bg:[.055,.105,.17],fog:[.055,.105,.17],fogD:0,sky:[.9,.9,.95],gnd:[.55,.55,.6],sunC:[.45,.45,.45],sunD:[-.3,.4,.9],ink:.8,inkFar:50});
 globe3D(xf([0,0,0]),LON,LAT,(1-k)*2.6,ss(1.0,1.5,t));for(let i=0;i<80;i++){const a=i*2.39,e=(i*.618)%1;draw(SPHL,{p:[Math.cos(a)*40,(e-.5)*70,-30+Math.sin(a)*10],s:[.08,.08,.08],c:[1,1,1],u:1,id:0});}}
// ---------- hook ----------
function sHook(t){const k=ease(ss(0,3.7,t));env(HAZE({eye:[lerp(-2,-.5,k),lerp(3.4,2.6,k),lerp(-24,-20,k)],tgt:[0,1.5,-9],fov:46,shadow:{c:[0,0,-12],r:22}}));town();quay();thames();fumes(0,-24,30,16,t+2,46,.3);
 for(let i=0;i<4;i++)person(xf([-2.4+i*1.6,0,-10.4-(i%2)*.6],[0,Math.PI+(i-1.5)*.2,0]),Object.assign({seed:3+i},LDN[i],NOSE));}
// ---------- crowd ----------
function sCrowd(t){const k=ease(ss(0,2.9,t));const E=[lerp(-12,-10,k),lerp(2.6,3.0,k),lerp(-8.6,-8.9,k)],TG=[4,1.4,-5];env(Object.assign({},SUMMER,{eye:E,tgt:TG,fov:46,shadow:{c:[0,0,-4],r:20}}));town();quay();thames();
 for(let i=0;i<14;i++){const lane=i%2?1:-1;const sp=1.25;const x=((i*5.3+lane*t*sp)%34+34)%34-17;const z=-4-((i*1.7)%4)-(lane>0?0:2);person(xf([x,0,z],[0,lane>0?Math.PI/2:-Math.PI/2,0]),Object.assign({seed:10+i,walk:1,phase:t*6.4+i},LDN[i%6]));}
 cart(xf([-4,0,-1.5],[0,Math.PI/2,0]));barrel(xf([5,0,-.5]));crate(xf([6,0,-.3]));
 camPlaque(E,TG,9,0,2.6,1.2,Math.round(2500000*ease(ss(.3,2.4,t))),7,'LONDONERS');}
// ---------- pipes into the river ----------
function outfall(x,t,g){draw(CYL,{p:[x,-.4,-13.6],r:[Math.PI/2,0,0],s:[.55,1.4,.55],c:[.32,.3,.3],g:.5,gold:g});draw(CYL,{p:[x,-.4,-14.35],r:[Math.PI/2,0,0],s:[.42,.1,.42],c:[.12,.1,.08]});
 for(let i=0;i<14;i++){const ph=((t*1.3+i/14)%1);draw(SPHL,{p:[x+Math.sin(i*2.3)*.15,-.4-ph*ph*1.4,-14.4-ph*1.6],s:[.32,.32,.32],c:[.4,.32,.18],a:.9,noInk:1,noShadow:1});}}
function sPipes(t){if(t<2.6){const k=ease(ss(0,2.6,t));env(Object.assign({},SUMMER,{eye:[lerp(-6,-4,k),lerp(1.6,2.2,k),lerp(-24,-22,k)],tgt:[0,-.2,-13],fov:44,shadow:{c:[0,0,-13],r:16}}));town();quay();thames();
  for(let i=0;i<5;i++)outfall(-14+i*7,t,1);fumes(0,-20,30,8,t,20,.2);return;}
 const lt=t-2.6,k=ease(ss(0,2.1,lt));env(HAZE({eye:[lerp(30,22,k),lerp(30,26,k),lerp(30,20,k)],tgt:[0,-1,-28],fov:46,shadow:{c:[0,0,-25],r:50}}));town();quay();thames();for(let i=0;i<10;i++)outfall(-35+i*7,t,1);fumes(0,-28,70,24,t,40,.25);}
// ---------- heat ----------
function sunDisc(p,s){draw(SPH,{p,s:[s,s,s],c:[1,.95,.75],u:1,id:0});draw(SPH,{p,s:[s*1.6,s*1.6,s*1.6],c:[1,.8,.4],a:.25,u:1,add:1,id:0,noShadow:1});}
function thermo(P,v,g){draw(CYL,{P,p:[0,0,0],s:[.22,2.6,.22],c:[.85,.9,.95],a:.6,g:.9,gold:g});draw(SPH,{P,p:[0,0,0],s:[.32,.32,.32],c:[.85,.1,.1]});draw(CYL,{P,p:[0,0,0],s:[.1,.3+2.1*v,.1],c:[.9,.12,.1]});draw(BOX,{P,p:[0,1.3,-.25],s:[.7,3.2,.08],c:[.55,.38,.2],pat:2,patS:3});
 for(let i=0;i<8;i++)draw(BOX,{P,p:[.16,.4+i*.27,-.15],s:[.12,.02,.02],c:[.2,.15,.1]});}
function sHeat(t){const k=ease(ss(0,4.8,t));const E=[lerp(-3,-2,k),lerp(1.8,1.7,k),lerp(-3.5,-5.0,k)],TG=[-1.0,2.2,-11];env(HAZE({eye:E,tgt:TG,fov:44,sunC:[.85,.7,.5],shadow:{c:[0,0,-8],r:14}}));town();quay();thames();sunDisc([10,40,-90],5);
 draw(BOX,{p:[-1.6,1.6,-10.45],s:[.9,3.2,.2],c:[.45,.32,.2],pat:2,patS:3});thermo(xf([-1.6,1.2,-10.1]),ease(ss(.5,3.8,t)),1);
 camPlaque(E,TG,7,.75,.9,.42,Math.round(30*ease(ss(1.8,4.0,t))),2,'DEGREES C');
 for(let i=0;i<14;i++){const ph=(t*.5+i*.07)%1;draw(SPHL,{p:[-6+i*.9,ph*3,-12],s:[.5,.5,.5],c:[1,.9,.7],a:.08*(1-ph),u:1,id:0,noShadow:1,noInk:1});}}
function sShrink(t){const k=ease(ss(0,3.8,t));env(HAZE({eye:[lerp(14,10,k),lerp(4,3.4,k),lerp(-9,-10,k)],tgt:[0,-1.4,-20],fov:44,shadow:{c:[0,0,-18],r:22}}));town();quay();const lv=-ss(0,1.6,t)*.9;thames({level:lv});
 for(let i=0;i<5;i++)outfall(-14+i*7,t,0);fumes(0,-19,40,10,t,40,.32+.1*k,-1.8);
 for(let i=0;i<30;i++){const a=t*6+i*2.3;draw(SPHL,{p:[2+Math.sin(a)*2.5+i%5,-.8+Math.sin(a*1.3)*.5,-16-Math.cos(a)*1.5],s:[.03,.03,.03],c:[.05,.05,.05],noInk:1,noShadow:1});}}
function sStink(t){const k=ease(ss(0,4,t));env(HAZE({eye:[lerp(-1,0,k),1.7,lerp(-4.5,-5.5,k)],tgt:[lerp(-1,0,k),1.5,-10.5],fov:42,dof:[5,4],desat:.1,shadow:{c:[0,0,-10],r:12}}));town();quay();thames();fumes(0,-12,14,6,t,36,.32,-1);
 [[-1.6,-10.5,.15],[-.55,-10.8,-.05],[.55,-10.4,.05],[1.6,-10.7,-.15]].forEach(([x,z,r],i)=>person(xf([x,0,z],[0,r,0]),Object.assign({seed:30+i},LDN[(i+1)%6],NOSE,{head:[.2,i%2?.3:-.3,0]})));}
// ---------- Parliament ----------
function gothic(P,w,h,d,c){draw(BOX,{P,p:[0,h/2,0],s:[w,h,d],c,pat:6,patS:1.5});const n=Math.floor(w/1.6);for(let i=0;i<n;i++){const x=-w/2+.8+i*1.6;draw(BOX,{P,p:[x,h/2,d/2+.12],s:[.25,h,.25],c:[c[0]*1.08,c[1]*1.08,c[2]*1.05]});
  for(let f=0;f<Math.floor(h/3.2);f++){draw(BOX,{P,p:[x+.8,1.6+f*3.2,d/2+.02],s:[.7,1.9,.06],c:[.22,.26,.32],g:.6});draw(CONE,{P,p:[x+.8,2.55+f*3.2,d/2+.03],r:[0,Math.PI/4,0],s:[.5,.5,.05],c:[.22,.26,.32]});}
  draw(CONE,{P,p:[x,h,d/2+.12],s:[.22,1.2,.22],c:[c[0]*1.1,c[1]*1.1,c[2]*1.05]});}}
const CLK=document.createElement('canvas');CLK.width=256;CLK.height=256;function clockTex(h){const g=CLK.getContext('2d');g.fillStyle='#f3ead6';g.beginPath();g.arc(128,128,124,0,Math.PI*2);g.fill();g.strokeStyle='#3a2a18';g.lineWidth=6;g.stroke();
 g.fillStyle='#2a1e12';g.textAlign='center';g.textBaseline='middle';const R=['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI'];for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.font=`700 ${i%3?20:28}px "DejaVu Serif"`;g.fillText(R[i],128+Math.sin(a)*96,128-Math.cos(a)*96);}
 const ha=h/12*Math.PI*2,ma=(h%1)*Math.PI*2;g.lineCap='round';g.strokeStyle='#1a120a';g.lineWidth=9;g.beginPath();g.moveTo(128,128);g.lineTo(128+Math.sin(ha)*55,128-Math.cos(ha)*55);g.stroke();g.lineWidth=5;g.beginPath();g.moveTo(128,128);g.lineTo(128+Math.sin(ma)*86,128-Math.cos(ma)*86);g.stroke();g.fillStyle='#b8862a';g.beginPath();g.arc(128,128,8,0,Math.PI*2);g.fill();}
function parliament(g){const C=[.82,.74,.56];const P=xf([0,0,-50]);gothic(P,60,12,10,C);gothic(xf([-36,0,-50]),10,22,10,C);draw(PRISM,{p:[-36,22,-50],s:[10.5,6,10.5],c:[.34,.36,.4]});
 // clock tower
 const T=xf([34,0,-48]);draw(BOX,{P:T,p:[0,16,0],s:[6,32,6],c:C,pat:6,patS:1.5,gold:g});clockTex(3.1);dynTex('clk',CLK);for(const sd of[1]){draw(QUAD,{P:T,p:[0,26,3.06],s:[4.6,4.6,1],c:[1,1,1],tex:3,u:1});}
 draw(BOX,{P:T,p:[0,33,0],s:[6.6,2,6.6],c:[.7,.62,.45],gold:g});draw(CONE,{P:T,p:[0,34,0],r:[0,Math.PI/4,0],s:[5,10,5],c:[.3,.34,.38],gold:g});}
function sParl(t){if(t<2.5){const k=ease(ss(0,2.5,t));env(HAZE({eye:[lerp(-30,-22,k),lerp(10,8,k),lerp(16,10,k)],tgt:[4,10,-50],fov:46,shadow:{c:[0,0,-40],r:60}}));
  draw(BOX,{p:[0,-.5,20],s:[400,1,64],c:[.56,.52,.46],pat:6,patS:1.1});quay();thames();draw(BOX,{p:[0,-.5,-75],s:[400,1,50],c:[.5,.48,.42],pat:6,patS:1});parliament(0);fumes(0,-30,70,26,t+5,46,.3);return;}
 const lt=t-2.5,k=ease(ss(0,3.7,lt));chamber(lt,{eye:[lerp(.3,0,k),lerp(2.7,2.5,k),lerp(5.2,4.2,k)],tgt:[0,1.9,-3]});}
function chamber(t,o){env({noSky:1,sky:[.7,.68,.6],gnd:[.42,.38,.32],sunC:[.6,.56,.48],sunD:[-.5,.6,.4],fog:[.35,.33,.28],fogD:.01,eye:o.eye,tgt:o.tgt,fov:44,plP:[0,4,0],plC:[.7,.6,.45],plR:12,bloom:1,desat:o.desat||0});
 draw(BOX,{p:[0,-.05,0],s:[12,.1,14],c:[.4,.28,.18],pat:2,patS:2});draw(BOX,{p:[0,3,-4],s:[12,6,.2],c:[.55,.42,.3],pat:2,patS:2.5});draw(BOX,{p:[-5,3,0],s:[.2,6,14],c:[.58,.46,.32],pat:2,patS:2.5});draw(BOX,{p:[5,3,0],s:[.2,6,14],c:[.58,.46,.32],pat:2,patS:2.5});
 // tall windows with soaked curtains (gold)
 for(let i=0;i<3;i++){const x=-3+i*3;draw(BOX,{p:[x,3.2,-3.88],s:[1.4,3.6,.05],c:[.85,.9,.95],u:1,id:0});const sw=Math.sin(t*1.5+i)*.04;
  for(const sd of[-1,1]){draw(BOX,{p:[x+sd*.62,3.2,-3.7],r:[0,0,sw*sd],s:[.5,3.9,.12],c:[.3,.5,.35],gold:1});for(let d=0;d<2;d++){const ph=(t*1.2+d*.5+i*.1)%1;draw(SPHL,{p:[x+sd*.62+(d-.5)*.12,1.25-ph*1.2,-3.65],s:[.02,.03,.02],c:[.6,.75,.85],noInk:1,noShadow:1});}}}
 // green benches + MPs
 for(const sd of[-1,1])for(let r=0;r<2;r++){draw(BOX,{p:[sd*(1.35+r*.8),.25+r*.3,.5],s:[.7,.5+r*.6,6],c:[.2,.42,.3],g:.3});}
 for(let i=0;i<8;i++){const sd=i%2?1:-1;const z=-1.6+Math.floor(i/2)*1.3;person(xf([sd*1.35,0,z],[0,-sd*Math.PI/2,0]),Object.assign({seed:50+i,sit:1,coat:[[.12,.12,.14],[.2,.18,.16],[.15,.16,.2]][i%3],shirt:[.95,.94,.9],hair:HAIRS[i%4]},i%3==0?{armR:[-1.45,0,.55],elbowR:2.0,worry:1}:{head:[0,.3,0]}));}
 // attendant soaking cloth
 const A=xf([.6,0,-3.0],[0,-Math.PI*.25,0]);person(A,{seed:61,coat:[.3,.28,.26],jacket:false,shirt:[.85,.82,.75],armL:[-.9,0,-.2],elbowL:.5,armR:[-.9,0,.2],elbowR:.5,head:[.4,0,0]});draw(CYL,{p:[.1,0,-3.35],s:[.28,.5,.28],c:[.5,.4,.3],pat:2,patS:4});draw(CYL,{p:[.1,.42,-3.35],s:[.25,.02,.25],c:[.75,.85,.88],u:1,id:0});}
// ---------- miasma vs water ----------
function sMiasma(t){if(t<6.3){const k=ease(ss(0,6.3,t));env(HAZE({eye:[lerp(3,2.4,k),lerp(1.8,1.7,k),lerp(-3,-4,k)],tgt:[0,1.5,-10],fov:44,desat:.25,shadow:{c:[0,0,-9],r:10}}));town();quay();thames();
  // a cloud drifting onto a man (what they believed)
  const u=ss(1.2,4.5,t);for(let i=0;i<26;i++){const a=i*2.4;const c=[lerp(-4,.2,u)+Math.cos(a)*.8,1.7+Math.sin(a*1.3)*.5,-9.5+Math.sin(a)*.6];draw(SPHL,{p:c,s:[.6,.45,.6],c:[.55,.68,.28],a:.4,u:1,id:0,noShadow:1,noInk:1,gold:.6});}
  person(xf([.6,0,-9.6],[0,-.5,0]),Object.assign({seed:70},LDN[0],u>.7?NOSE:{}));return;}
 const lt=t-6.3,k=ease(ss(0,3.4,lt));env({noSky:1,sky:[.75,.72,.66],gnd:[.44,.4,.34],sunC:[.66,.6,.5],sunD:[-.4,.7,.5],fog:[.36,.34,.3],fogD:.01,eye:[lerp(0,.1,k),lerp(1.3,1.25,k),lerp(1.6,1.1,k)],tgt:[0,1.05,0],fov:40,dof:[1.3,.9],bloom:1});
 draw(BOX,{p:[0,.45,0],s:[3,.9,1.6],c:[.48,.32,.2],pat:2,patS:3});draw(BOX,{p:[0,2,-1.2],s:[4,4,.1],c:[.7,.66,.56],pat:6,patS:2});
 // glass of water with germs (gold)
 draw(CYL,{p:[0,.9,0],s:[.16,.36,.16],c:[.85,.92,.95],a:.45,g:.9});draw(CYL,{p:[0,.9,0],s:[.145,.27,.145],c:[.55,.6,.42],a:.6,u:1,id:0});
 for(let i=0;i<9;i++){const a=lt*1.3+i*.7;draw(SPHL,{p:[Math.cos(a)*.07,1.0+((i*.37+lt*.1)%1)*.15,Math.sin(a)*.07],s:[.022,.012,.012],r:[0,a,0],c:[1,.71,.18],u:1,id:0,gold:1});}
 // water pump
 draw(CYL,{p:[-.7,.9,-.4],s:[.09,.9,.09],c:[.22,.26,.24],g:.5});draw(BOX,{p:[-.6,1.75,-.4],r:[0,0,.4],s:[.5,.04,.04],c:[.22,.26,.24]});draw(CYL,{p:[-.6,1.55,-.4],r:[0,0,Math.PI/2],s:[.04,.2,.04],c:[.22,.26,.24]});}
// ---------- the law ----------
function sLaw(t){const k=ease(ss(0,5.9,t));const E=[lerp(-1.4,-1.1,k),lerp(2.2,2.0,k),lerp(2.2,1.7,k)],TG=[0,1.1,0];env({noSky:1,sky:[.7,.66,.6],gnd:[.42,.38,.32],sunC:[.62,.56,.48],sunD:[-.4,.7,.4],fog:[.3,.28,.24],fogD:.01,eye:E,tgt:TG,fov:42,plP:[0,3,1],plC:[.8,.65,.45],plR:8,bloom:1,dof:[2.2,1.5]});
 draw(BOX,{p:[0,-.05,0],s:[10,.1,10],c:[.4,.28,.18],pat:2,patS:2});draw(BOX,{p:[0,2.5,-2],s:[10,5,.2],c:[.5,.4,.3],pat:2,patS:2.5});
 draw(BOX,{p:[0,.85,0],s:[2.2,.08,1.2],c:[.2,.4,.28],g:.3});draw(BOX,{p:[0,.42,0],s:[2,.84,1],c:[.4,.26,.15],pat:2,patS:3});
 // document
 draw(BOX,{p:[0,.9,.05],r:[0,.15,0],s:[.6,.01,.8],c:[.95,.92,.82],gold:1});for(let i=0;i<7;i++)draw(BOX,{p:[-.02+Math.sin(.15)*0,.906,-.2+i*.07],r:[0,.15,0],s:[.42,.002,.012],c:[.3,.25,.2],u:1});
 // stamp/seal coming down
 const sd=ss(3.6,4.0,t);draw(CYL,{p:[.15,lerp(1.25,.93,sd),.25],s:[.1,.05,.1],c:[.45,.3,.15]});draw(CYL,{p:[.15,lerp(1.3,.98,sd),.25],s:[.04,.18,.04],c:[.35,.22,.12]});draw(SPH,{p:[.15,lerp(1.5,1.18,sd),.25],s:[.07,.07,.07],c:[.35,.22,.12]});if(sd>=1)draw(CYL,{p:[.15,.915,.25],s:[.1,.01,.1],c:[.7,.12,.1]});
 // quill
 lineC(xf([0,0,0]),[-.5,.92,.3],[-.75,1.3,.55],.012,[.95,.94,.9]);
 camPlaque(E,TG,2.6,-.15,.6,.24,Math.round(18*ease(ss(1.6,3.4,t))),2,'DAYS');}
// ---------- Bazalgette ----------
function plinth(fig,t,o){o=o||{};const a=.6+t*.18;env({noSky:1,sky:[.6,.57,.54],gnd:[.3,.27,.24],sunC:[.5,.47,.42],sunD:[-.3,.8,.6],fog:[.16,.15,.17],fogD:.016,eye:[Math.sin(a)*o.r,o.h,Math.cos(a)*o.r],tgt:[0,o.ty,0],fov:40,dof:[Math.hypot(o.r,o.h-o.ty),o.r*.4],plP:[1.5,5,3],plC:[.9,.78,.55],plR:14,desat:.2});
 draw(BOX,{p:[0,-.5,0],s:[60,1,60],c:[.4,.3,.22],pat:2,patS:1.2,g:.3});for(let i=-3;i<=3;i++)draw(BOX,{p:[i*4,3,-9],s:[3.6,6,.3],c:[.36,.3,.3],pat:6,patS:1});draw(BOX,{p:[0,6.2,-9],s:[30,.3,.5],c:[.6,.46,.22]});
 const pr=o.pr||1.4,ph=o.ph||1;draw(CYL,{p:[0,0,0],s:[pr,ph,pr],c:[.78,.74,.68],pat:6,patS:3,g:.3});draw(CYL,{p:[0,ph,0],s:[pr*1.1,.12,pr*1.1],c:[.86,.82,.76],pat:6,patS:3,g:.3});draw(CYL,{p:[0,0,0],s:[pr*1.12,.1,pr*1.12],c:[.62,.58,.52]});
 fig(cxf(xf([0,ph+.12,0],[0,-t*.35,0]),xf([0,0,0]),{gold:1}));}
const BAZ={coat:[.16,.15,.17],longcoat:1,pants:[.2,.19,.21],shirt:[.95,.94,.9],tie:[.1,.1,.1],moustache:1,beard:0,hair:HAIRS[1],hat:'none',seed:8};
function sBaz(t){plinth(P=>person(P,Object.assign({},BAZ,{armR:[-.5,0,.1],elbowR:.4})),t,{r:3.6,h:2.3,ty:1.95,pr:.9,ph:.9});}
// ---------- tunnel ----------
function tunnelSeg(z0,len,R,g){const n=16;for(let i=0;i<n;i++){const a=(i+.5)/n*Math.PI*2;const x=Math.sin(a)*R,y=R-Math.cos(a)*R;draw(BOX,{p:[x,y,z0-len/2],r:[0,0,a],s:[2*Math.PI*R/n+.05,.35,len],c:[.62,.36,.26],pat:3,patS:2.4,gold:g});}}
function sTunnel(t){if(t<3.0){const k=ease(ss(0,3,t));env({noSky:1,sky:[.75,.66,.56],gnd:[.45,.35,.28],sunC:[.5,.45,.38],sunD:[.2,.8,.3],fog:[.3,.24,.2],fogD:.03,eye:[lerp(-.6,.4,k),lerp(1.9,2.1,k),lerp(5,1,k)],tgt:[0,1.8,-14],fov:46,plP:[0,3,-3+(-t*1.3)],plC:[1,.8,.5],plR:12,bloom:1});
  tunnelSeg(8,40,2.6,0);for(let i=0;i<6;i++){const z=-1-i*4;draw(SPH,{p:[1.8,3.0,z],s:[.12,.12,.12],c:[1,.85,.5],u:1,id:0});}
  [[-.9,-3,.2],[.9,-5.5,-.3],[-.7,-8,.1]].forEach(([x,z,r],i)=>person(xf([x,.35,z],[0,Math.PI+r,0]),{seed:80+i,coat:[.38,.32,.26],jacket:false,shirt:[.75,.68,.55],hat:'flat',hatc:[.3,.26,.2],armR:[-1.6,0,.1],elbowR:.6,armL:[-1.2,0,-.1],elbowL:.8,head:[-.2,0,0]}));
  for(let i=0;i<5;i++)draw(BOX,{p:[.6,.5+i*.12,-2.2],s:[.4,.1,.2],c:[.62,.36,.26],pat:3});return;}
 const lt=t-3.0,k=ease(ss(0,2.5,lt));const E=[lerp(-2.6,-2.2,k),lerp(1.4,1.6,k),lerp(4,3.2,k)],TG=[0,1.6,-6];env({noSky:1,sky:[.75,.66,.56],gnd:[.45,.35,.28],sunC:[.5,.45,.38],sunD:[.2,.8,.3],fog:[.3,.24,.2],fogD:.03,eye:E,tgt:TG,fov:46,plP:[0,3,-2],plC:[1,.8,.5],plR:12,bloom:1});
 tunnelSeg(8,40,2.6,.45);draw(BOX,{p:[0,.32,-10],s:[2.2,.08,40],c:[.33,.3,.2],pat:5,patS:.5,g:.5});camPlaque(E,TG,4.2,0,.95,.62,Math.round(318000000*ease(ss(.2,2.2,lt))),9,'BRICKS');}
// ---------- map ----------
function sMap(t){const k=ease(ss(0,2.3,t));env({...SUMMER,eye:[lerp(-6,-2,k),lerp(150,140,k),lerp(40,34,k)],tgt:[4,0,-28],fov:46,shadow:false});
 draw(BOX,{p:[0,-.5,-28],s:[300,1,200],c:[.6,.62,.5],pat:1,patS:.8});
 // river (wavy)
 for(let i=0;i<30;i++){const x=-80+i*6;const z=-28+Math.sin(i*.35)*6;draw(BOX,{p:[x,.15,z],r:[0,Math.cos(i*.35)*.35,0],s:[6.6,.3,7],c:[.3,.5,.62],pat:5,patS:.4,g:.6});}
 // city blocks
 for(let i=0;i<60;i++){const x=-50+(i%10)*9,z=(i<30?-6:-50)-Math.floor((i%30)/10)*8+(i<30?0:0);if(Math.abs(z-(-28+Math.sin(((x+80)/6)*.35)*6))<7)continue;draw(BOX,{p:[x,.8,z],s:[6,1.6+(i*7%3),5],c:[[.75,.62,.5],[.68,.56,.48],[.82,.74,.62]][i%3]});}
 // intercepting sewers both banks -> gold, flowing east
 const g=ss(.2,1.2,t);for(const sd of[1,-1]){for(let i=0;i<28;i++){const x=-75+i*6;if((x+75)/150>g*1.1)break;const z=-28+Math.sin(((x+80)/6)*.35)*6+sd*6.5;draw(BOX,{p:[x,1.2,z],r:[0,Math.cos(((x+80)/6)*.35)*.35,0],s:[6.4,.8,.9],c:[1,.71,.18],u:1,id:0,gold:1});}}
 for(let i=0;i<10;i++){const ph=((t*.35+i*.1)%1);const x=-75+ph*150;for(const sd of[1,-1]){const z=-28+Math.sin(((x+80)/6)*.35)*6+sd*6.5;draw(SPH,{p:[x,1.8,z],s:[.8,.8,.8],c:[1,.95,.8],u:1,id:0});}}
 draw(CONE,{p:[86,2,-30],r:[0,0,-Math.PI/2],s:[3,5,3],c:[1,.71,.18],u:1,id:0,gold:1});}
// ---------- clean river + today ----------
function sClean(t){const k=ease(ss(0,3.1,t));env(Object.assign({},SUMMER,{fog:[.82,.88,.95],fogD:.003,skyTop:[.3,.52,.9],clouds:.4,eye:[lerp(-22,-17,k),lerp(4.5,4,k),lerp(-12,-12.5,k)],tgt:[12,6,-50],fov:46,shadow:{c:[0,0,-14],r:40}}));town();quay();thames({clean:1});parliament(0);
 for(let i=0;i<2;i++){const x=-20+i*28+t*1.5;const P=xf([x,-1,-25-i*8],[0,Math.PI/2,0]);draw(BOX,{P,p:[0,.3,0],s:[1.6,.7,6],c:[.4,.26,.18],pat:2,patS:3});draw(CYL,{P,p:[0,.6,0],s:[.06,4,.06],c:[.3,.22,.15]});draw(PRISM,{P,p:[0,1.2,.3],r:[0,Math.PI/2,0],s:[.08,3,2.4],c:[.95,.92,.84]});}
 for(let i=0;i<3;i++)person(xf([-3+i*1.5,0,-10.4],[0,Math.PI+(i-1)*.3,0]),Object.assign({seed:90+i,walk:0},LDN[(i+3)%6]));}
function sToday(t){const k=ease(ss(0,2.8,t));env(Object.assign({},SUMMER,{fog:[.82,.88,.95],fogD:.003,skyTop:[.3,.52,.9],clouds:.4,eye:[lerp(10,8,k),lerp(2.4,2.0,k),lerp(9,7,k)],tgt:[0,-.6,-6],fov:46,clip:[0,0,1,6.5],shadow:{c:[0,0,-6],r:16}}));
 draw(BOX,{p:[0,-.5,-6],s:[60,1,24],c:[.58,.58,.56],pat:6,patS:1.2,clip:[0,0,1,7]});draw(BOX,{p:[0,-5,-6],s:[60,8,24],c:[.45,.35,.25],pat:7,patS:1});
 for(let i=0;i<6;i++)lamppost(xf([-12+i*5,0,-9]),0);for(let i=0;i<4;i++)person(xf([-6+i*3+(i%2?t*1.2:-t*1.2),0,-4-(i%2)*2],[0,i%2?Math.PI/2:-Math.PI/2,0]),Object.assign({seed:100+i,walk:1,phase:t*6.4+i},i%2?{coat:[.3,.45,.65],jacket:false,shirt:[.3,.45,.65]}:{coat:[.2,.2,.22]}));
 // cutaway: old brick sewer beneath, still flowing (gold)
 draw(BOX,{p:[0,-4,6.55],s:[60,7,.1],c:[.35,.28,.2],pat:7,patS:1});const T=xf([0,-4.2,-6],[0,Math.PI/2,0]);for(let i=0;i<16;i++){const a=(i+.5)/16*Math.PI*2;draw(BOX,{P:T,p:[Math.sin(a)*1.6,1.6-Math.cos(a)*1.6-1.6,0],r:[0,0,a],s:[.66,.3,60],c:[.62,.36,.26],pat:3,patS:2.4,gold:1});}
 for(let i=0;i<20;i++){const ph=((t*.25+i*.05)%1);draw(SPHL,{p:[-30+ph*60,-5.5,-6+Math.sin(i)*.4],s:[.3,.15,.3],c:[.45,.4,.3],noInk:1});}}
// ---------- archive ----------
function sArchive(t){env({noSky:1,sky:[.42,.38,.34],gnd:[.24,.2,.17],sunC:[.48,.4,.32],sunD:[-.3,.6,.7],fog:[.14,.12,.1],fogD:.03,eye:[0,1.7,lerp(6.5,5,ease(ss(0,4,t)))],tgt:[0,1.5,0],fov:44,plP:[0,2.5,2],plC:[.8,.6,.35],plR:7,bloom:1});
 for(let s=0;s<3;s++){for(const sd of[-1,1]){const x=sd*2.2;draw(BOX,{p:[x,1.6,-s*2.2],s:[.12,3.2,1.4],c:[.35,.22,.13],pat:2,patS:3});}for(let y=0;y<5;y++){draw(BOX,{p:[0,.3+y*.65,-s*2.2],s:[4.4,.06,1.4],c:[.4,.26,.15],pat:2,patS:3});for(let b=0;b<7;b++)draw(BOX,{p:[-1.8+b*.6,.55+y*.65,-s*2.2],s:[.5,.42,1.1],c:[[.62,.56,.46],[.55,.5,.42],[.5,.45,.38]][(b+y+s)%3]});}}
 draw(BOX,{p:[0,1.28,1.2],s:[1.2,.06,.5],c:[.4,.26,.15]});for(let i=0;i<3;i++)draw(BOX,{p:[-.25+i*.26,1.36,1.2],r:[0,i*.2,0],s:[.22,.1,.11],c:[.62,.36,.26],pat:3});}
// ---------- timeline ----------
const S=[[0,2.4,sGlobe],[2.4,6.15,sHook],[6.15,9.05,sCrowd],[9.05,13.7,sPipes],[13.7,18.6,sHeat],[18.6,22.3,sShrink],[22.3,26.4,sStink],[26.4,32.6,sParl],[32.6,42.3,sMiasma],[42.3,48.25,sLaw],[48.25,51.9,sBaz],[51.9,57.35,sTunnel],[57.35,59.7,sMap],[59.7,62.8,sClean],[62.8,65.7,sToday],[65.7,74.5,sArchive]];
const END=74.5;
const RIB=[[13.75,.0,'SUMMER 1858'],[42.5,.01,'1858'],[51.95,.1,'1859–1875'],[62.85,.98,'TODAY']];
function overlays(T,fn,lt){
 badge('LONDON','SUMMER 1858',LON,LAT,T,ss(2.1,2.7,T)*(1-ss(65.3,65.7,T)));
 ribbon(T,RIB,['1858','TODAY'],ss(13.7,14.1,T)*(1-ss(65.2,65.6,T)));
 if(fn===sGlobe)tag('SUMMER 1858',W/2,1180,.9,2.4,T);
 seal(1,'THE HEAT',13.75,T);seal(2,'THE TWIST',32.65,T);seal(3,'THE FIX',48.3,T);
 if(fn===sHook)tag('LONDON, ENGLAND',W/2,420,2.7,5.9,T);
 if(fn===sPipes){if(lt<2.6)tag('SEWAGE PIPES',W/2,420,9.3,11.5,T);else tag('ALL INTO THE THAMES',W/2,420,11.8,13.6,T,{size:38});}
 if(fn===sShrink)tag('THE RIVER SHRANK',W/2,420,18.8,22.2,T,{size:38});
 if(fn===sStink)bigText([['THE GREAT',84,PARCH],['STINK',120,GOLD]],23.6,26.3,T,470);
 if(fn===sParl){if(lt<2.5)tag('PARLIAMENT',W/2,420,26.6,28.8,T);else tag('CURTAINS SOAKED IN CHEMICALS',W/2,420,29.1,32.5,T,{size:34});}
 if(fn===sMiasma){if(lt<6.3){tag('WHAT THEY BELIEVED:',W/2,420,34.0,38.8,T,{size:34,f:MF});tag('"BAD AIR" MAKES YOU SICK',W/2,500,34.4,38.8,T,{size:36});}else{bigText([['WRONG.',110,GOLD]],39.0,40.0,T,500);tag('THE REAL KILLER: DIRTY WATER',W/2,420,40.1,42.2,T,{size:34});}}
 if(fn===sBaz)museum('JOSEPH BAZALGETTE','Engineer','1819–1891',540,1000,48.6,51.8,T,'r');
 if(fn===sTunnel&&lt<3)tag('82 MILES OF TUNNELS',W/2,420,52.1,54.8,T,{size:38});
 if(fn===sMap)tag('WASTE CARRIED AWAY',W/2,420,57.5,59.6,T,{size:38});
 if(fn===sClean)tag('RIGHT FIX, WRONG REASON',W/2,420,60.0,62.7,T,{size:36});
 if(fn===sToday)tag('STILL IN USE TODAY',W/2,420,63.0,65.6,T,{size:38});
 if(fn===sArchive){archiveCard([['BUILT TO LAST'],'Bazalgette built his tunnels','for about 4 million people.','Today, around 9 million','Londoners still rely on them.'],65.95,T);outro(71.1,T);}
 subtitle(T,SUBS);}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 PULSE=.5+.5*Math.sin(T*3);TIME=T;cx.clearRect(0,0,W,H);renderScene(fn,T-s0);cx.drawImage(gl.canvas,0,0);
 const lt=T-s0;let a=0;if(k>0)a=Math.max(a,(1-lt/.18)*.55);if(T<.2)a=1-T/.2;dark(a);
 overlays(T,fn,lt);
 return out.toDataURL('image/jpeg',.97);};
