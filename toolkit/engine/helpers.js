
function xf(p,r){const R=rot(r);return{M:mul(new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,p[0],p[1],p[2],1]),R),R};}
function cxf(a,b){return{M:mul(a.M,b.M),R:mul(a.R,b.R)};}
function merge(list){const P=[],N=[],I=[];const f=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 list.forEach(b=>{const R=rot(b.r||[0,0,0]);const tr=v=>[R[0]*v[0]+R[4]*v[1]+R[8]*v[2],R[1]*v[0]+R[5]*v[1]+R[9]*v[2],R[2]*v[0]+R[6]*v[1]+R[10]*v[2]];
  f.forEach(n=>{const u=n[1]?[1,0,0]:[0,1,0];const v=cross(n,u);const base=P.length/3;const nn=tr(n);
   for(const[s,t]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const q=tr([.5*(n[0]+s*u[0]+t*v[0])*b.s[0],.5*(n[1]+s*u[1]+t*v[1])*b.s[1],.5*(n[2]+s*u[2]+t*v[2])*b.s[2]]);P.push(q[0]+b.p[0],q[1]+b.p[1],q[2]+b.p[2]);N.push(...nn);}
   I.push(base,base+1,base+2,base,base+2,base+3);});});return mesh(P,N,I);}
function bergMesh(){const P=[],N=[],I=[];const la=12,lo=18;const V=(i,j)=>{const th=i/la*Math.PI,ph=j/lo*Math.PI*2;let r=1+.28*Math.sin(ph*3+i)+.18*Math.sin(th*5+ph*2)+.12*Math.cos(ph*7+th*3);
 let x=Math.sin(th)*Math.cos(ph)*r,y=Math.cos(th)*r,z=Math.sin(th)*Math.sin(ph)*r;if(y>0)y*=1.25+.5*Math.sin(ph*2);return[x,y,z];};
 for(let i=0;i<la;i++)for(let j=0;j<lo;j++){const a=V(i,j),b=V(i+1,j),c=V(i+1,j+1),d=V(i,j+1);for(const tri of[[a,b,c],[a,c,d]]){const n=norm(cross(sub(tri[1],tri[0]),sub(tri[2],tri[0])));const base=P.length/3;tri.forEach(v=>{P.push(...v);N.push(-n[0],-n[1],-n[2]);});I.push(base,base+1,base+2);}}
 return mesh(P,N,I);}
const BERG=bergMesh();
function xfs(p,r,k){const A=xf(p,r);return{M:mul(A.M,new Float32Array([k,0,0,0,0,k,0,0,0,0,k,0,0,0,0,1])),R:A.R};}
const DAY={fog:[.7,.78,.86],fogD:.012,sky:[.52,.6,.72],gnd:[.3,.32,.25],sunC:[.9,.82,.68],sunD:[-.5,.7,.5]};
const SKIN=[.75,.55,.42],COAT=[.25,.2,.15],SHIRT=[.8,.78,.72];
function ground(c){draw(BOX,{p:[0,-.5,0],s:[600,1,600],c:c||[.3,.38,.2],g:.1});}
// detailed human (height ~1.75)
function man(P,o){o=o||{};const c=o.coat||COAT,sw=o.sw||0,sit=o.sit;
 if(!sit)for(const sd of[-1,1]){draw(CYL,{P,p:[sd*.1,0,0],r:[sd*sw*.5,0,0],s:[.075,.85,.075],c:o.pants||[.2,.18,.16]});draw(BOX,{P,p:[sd*.1,.04,.05],s:[.12,.08,.26],c:[.08,.06,.05]});}
 else for(const sd of[-1,1]){draw(CYL,{P,p:[sd*.1,.85,0],r:[Math.PI/2,0,0],s:[.075,.45,.075],c:o.pants||[.2,.18,.16]});draw(CYL,{P,p:[sd*.1,.4,.45],s:[.07,.45,.07],c:o.pants||[.2,.18,.16]});}
 draw(CYL,{P,p:[0,.82,0],s:[.2,.62,.13],c});draw(BOX,{P,p:[0,1.2,.1],s:[.14,.22,.04],c:SHIRT});
 for(const sd of[-1,1]){const a=o.arms?o.arms[sd>0?1:0]:[sd*-sw*.6,0,sd*.12];const AP=cxf(P,xf([sd*.25,1.42,0],a));draw(CYL,{P:AP,p:[0,-.62,0],s:[.06,.62,.06],c});draw(SPH,{P:AP,p:[0,-.66,0],s:[.06,.07,.06],c:SKIN});}
 draw(CYL,{P,p:[0,1.42,0],s:[.06,.1,.06],c:SKIN});draw(SPH,{P,p:[0,1.64,0],s:[.12,.14,.13],c:SKIN});draw(SPH,{P,p:[0,1.62,.12],s:[.025,.035,.03],c:SKIN});
 for(const sd of[-1,1])draw(BOX,{P,p:[sd*.11,1.6,-.01],s:[.03,.1,.06],c:[.25,.17,.1]});
 if(o.bandage)draw(SPH,{P,p:[0,1.7,0],s:[.135,.11,.14],c:[.95,.93,.88]});
 const hat=o.hat||'flat';if(hat=='top'){draw(CYL,{P,p:[0,1.73,0],s:[.2,.02,.2],c:[.06,.06,.06]});draw(CYL,{P,p:[0,1.74,0],s:[.12,.26,.12],c:[.06,.06,.06]});}
 else if(hat=='flat'&&!o.bandage){draw(CYL,{P,p:[0,1.74,0],s:[.19,.02,.19],c:[.3,.25,.18]});draw(CYL,{P,p:[0,1.74,0],s:[.125,.11,.125],c:[.3,.25,.18]});}}
function rod(P,len,th){len=len||1.1;th=th||.03;draw(CYL,{P,p:[0,0,0],s:[th,len*.75,th],c:[.35,.35,.38],g:.8});draw(CONE,{P,p:[0,len*.75,0],s:[th,len*.25,th],c:[.35,.35,.38],g:.8});}
const TIES=(()=>{const L=[];for(let z=-60;z<60;z+=.7)L.push({p:[0,.05,z],s:[2.4,.12,.25]});return merge(L);})();
const RAILS=merge([{p:[-.72,.18,0],s:[.07,.14,120]},{p:[.72,.18,0],s:[.07,.14,120]}]);
function railway(){draw(BOX,{p:[0,0,0],s:[3.4,.1,120],c:[.42,.38,.32]});draw(TIES,{c:[.32,.22,.14]});draw(RAILS,{c:[.45,.45,.48],g:.8});}
const HILLS=[];for(let i=0;i<24;i++){const a=rnd()*Math.PI*2,r=40+rnd()*60;HILLS.push([Math.cos(a)*r,Math.sin(a)*r,10+rnd()*18,4+rnd()*8]);}
function hills(c){HILLS.forEach(h=>draw(SPH,{p:[h[0],-1,h[1]],s:[h[2],h[3],h[2]],c:c||[.24,.36,.18]}));for(let i=0;i<50;i++){const a=i*2.4,r=18+(i*7%25);draw(CONE,{p:[Math.cos(a)*r,0,Math.sin(a)*r],s:[1,3.5+(i%3),1],c:[.12,.25,.12]});draw(CYL,{p:[Math.cos(a)*r,0,Math.sin(a)*r],s:[.12,.6,.12],c:[.3,.2,.12]});}}
function rockFace(x,z){draw(BERG,{p:[x,0,z],s:[4,3,3],c:[.5,.48,.44],g:.1});draw(BERG,{p:[x+3,0,z-2],s:[3,2.4,3],c:[.46,.44,.4],g:.1});}
// detailed bust for hook
function bust(P,o){o=o||{};draw(SPH,{P,p:[0,0,0],s:[.9,1.05,1.05],c:SKIN});draw(BOX,{P,p:[0,-.6,.25],r:[.3,0,0],s:[.85,.6,.8],c:SKIN});draw(SPH,{P,p:[0,-.85,.45],s:[.35,.25,.3],c:SKIN});
 draw(CONE,{P,p:[0,-.2,1],r:[1.2,0,0],s:[.14,.4,.14],c:SKIN});for(const sd of[-1,1]){draw(SPH,{P,p:[sd*.32,.05,.88],s:[.12,.07,.06],c:[.95,.95,.95]});draw(SPH,{P,p:[sd*.32,.05,.93],s:[.05,.05,.04],c:[.2,.25,.4]});
  draw(SPH,{P,p:[sd*.9,0,0],s:[.1,.22,.15],c:SKIN});draw(BOX,{P,p:[sd*.85,-.25,.15],s:[.12,.5,.3],c:[.25,.17,.1]});draw(BOX,{P,p:[sd*.32,.28,.88],r:[0,0,sd*-.1],s:[.3,.06,.08],c:[.25,.17,.1]});}
 draw(SPH,{P,p:[0,.35,-.1],s:[.95,.75,1.08],c:[.25,.17,.1]});draw(CYL,{P,p:[0,-1.7,0],s:[.45,.8,.45],c:SKIN});draw(CYL,{P,p:[0,-2.6,0],s:[1.5,.9,.8],c:COAT});draw(BOX,{P,p:[0,-1.95,.45],s:[.5,.5,.1],c:SHIRT});}
// x-ray head: stacked glowing rings
const XR=[];for(let i=0;i<=22;i++){const y=-1.3+i*.12;let r;if(y>-.2)r=Math.sqrt(Math.max(0,1-Math.pow((y-.25)/1.05,2)))*.95;else r=.62+.2*Math.max(0,(y+.2)/-.6)*0-.3*Math.max(0,(-.75-y))/.55*1;XR.push([y,Math.max(.25,r)]);}
function xrayHead(t){for(const sd of[-1,1]){draw(TUBE,{p:[sd*.3,2.05,.82],r:[Math.PI/2,0,0],s:[.14,.02,.11],e:[.4,1,1.3]});draw(SPH,{p:[sd*.3,2.05,.84],s:[.04,.04,.02],e:[.4,1,1.3]});}draw(CONE,{p:[0,1.75,.95],r:[1.25,0,0],s:[.09,.3,.09],e:[.1,.4,.6]});draw(BOX,{p:[0,1.38,.9],s:[.35,.02,.02],e:[.4,1,1.3]});for(const sd of[-1,1])draw(BOX,{p:[sd*.35,1.25,.55],r:[0,sd*.7,0],s:[.02,.02,.7],e:[.3,.8,1.1]});draw(SPH,{p:[-.33,1.85,.75],s:[.06,.06,.03],e:[1.5,.4,.2]});XR.forEach(([y,r])=>draw(TUBE,{p:[0,y+2,0],s:[r*.9,.015,r*1.05],e:[.15,.7,1]}));
 for(let k=0;k<12;k++){const a=k/12*Math.PI*2;draw(BOX,{p:[0,2+.25,0],r:[0,a,0],s:[.01,.01,2.1],e:[.08,.35,.55]});}
 for(let i=0;i<6;i++){const y=2.05+i*.1,r=.55*Math.sin((i+1)/7*Math.PI);draw(TUBE,{p:[0,y,0],s:[r*.95,.012,r*1.1],e:[.9,.3,.8]});}}
function cartM(P){draw(BOX,{P,p:[0,.75,0],s:[1.3,.12,2.2],c:[.45,.33,.2]});for(const sd of[-1,1])draw(BOX,{P,p:[sd*.65,.95,0],s:[.06,.35,2.2],c:[.4,.3,.18]});
 for(const sd of[-1,1]){const WP=cxf(P,xf([sd*.75,.5,-.3],[0,0,Math.PI/2]));draw(TUBE,{P:WP,p:[0,-.04,0],s:[.5,.08,.5],c:[.3,.2,.12]});for(let k=0;k<6;k++)draw(BOX,{P:WP,r:[0,k*Math.PI/6,0],s:[.04,.04,1],c:[.35,.25,.15]});}
 draw(BOX,{P,p:[0,.7,2],s:[.08,.08,2.2],c:[.4,.3,.18]});}
function ox(P,c){c=c||[.4,.28,.18];draw(SPH,{P,p:[0,1,0],s:[.42,.45,.9],c});draw(SPH,{P,p:[0,1.15,.95],s:[.2,.22,.3],c});for(const sd of[-1,1])draw(CONE,{P,p:[sd*.15,1.35,1],r:[0,0,sd*-1.2],s:[.04,.25,.04],c:[.85,.82,.7]});
 for(const[a,b]of[[.2,.55],[-.2,.55],[.2,-.55],[-.2,-.55]])draw(CYL,{P,p:[a,0,b],s:[.08,.8,.08],c});}
function house(P){draw(BOX,{P,p:[0,1.6,0],s:[6,3.2,5],c:[.88,.86,.8]});draw(BOX,{P,p:[0,3.6,1.3],r:[.6,0,0],s:[6.4,.15,3.2],c:[.35,.2,.15]});draw(BOX,{P,p:[0,3.6,-1.3],r:[-.6,0,0],s:[6.4,.15,3.2],c:[.35,.2,.15]});
 draw(BOX,{P,p:[0,.15,3.3],s:[6,.3,1.6],c:[.5,.4,.3]});draw(BOX,{P,p:[0,2.4,3.6],s:[6.2,.1,1.4],c:[.8,.78,.72]});for(let k=0;k<5;k++)draw(CYL,{P,p:[-2.8+k*1.4,.3,4.1],s:[.07,2.1,.07],c:[.95,.95,.92]});
 draw(BOX,{P,p:[0,1.2,2.52],s:[.9,1.9,.05],c:[.35,.22,.12]});for(const x of[-2,2])for(const y of[1.3,2.6]){draw(BOX,{P,p:[x,y,2.52],s:[.8,.9,.04],c:[.1,.1,.12],e:[.4,.3,.15]});draw(BOX,{P,p:[x,y,2.55],s:[.06,.9,.02],c:[.9,.9,.9]});}}
function horse(P){const c=[.32,.2,.12];draw(SPH,{P,p:[0,1.1,0],s:[.3,.33,.75],c});draw(BOX,{P,p:[0,1.5,.75],r:[-.7,0,0],s:[.18,.18,.6],c});draw(BOX,{P,p:[0,1.75,1.05],r:[.4,0,0],s:[.16,.16,.45],c});
 for(const[a,b]of[[.14,.45],[-.14,.45],[.14,-.45],[-.14,-.45]])draw(CYL,{P,p:[a,0,b],s:[.05,.85,.05],c});}
function skull(P){const B=[.92,.88,.78];draw(SPH,{P,p:[0,0,0],s:[.85,.95,1.05],c:B,g:.4});draw(BOX,{P,p:[0,-.55,.45],s:[.75,.45,.6],c:B,g:.4});
 for(const sd of[-1,1])draw(SPH,{P,p:[sd*.3,-.12,.82],s:[.2,.18,.15],c:[.05,.04,.03]});draw(CONE,{P,p:[0,-.42,.95],r:[Math.PI,0,0],s:[.08,.15,.05],c:[.05,.04,.03]});
 for(let k=0;k<8;k++)draw(BOX,{P,p:[-.28+k*.08,-.72,.72],s:[.06,.1,.06],c:[.96,.94,.86]});draw(BOX,{P,p:[0,-1,.35],s:[.65,.2,.7],c:B});draw(SPH,{P,p:[-.2,.75,.5],s:[.15,.1,.15],c:[.05,.04,.03]});}
