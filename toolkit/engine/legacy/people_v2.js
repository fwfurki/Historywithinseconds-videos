// ---------- transforms ----------
function xf(p,r,k){const R=rot(r||[0,0,0]);k=k||1;return{M:mul(new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,p[0],p[1],p[2],1]),mul(R,new Float32Array([k,0,0,0,0,k,0,0,0,0,k,0,0,0,0,1]))),R};}
function cxf(a,b,extra){const o={M:mul(a.M,b.M),R:mul(a.R,b.R)};if(a.gold)o.gold=a.gold;if(extra)Object.assign(o,extra);return o;}
function withId(P,id){return Object.assign({},P,{id});}
function merge(list){const P=[],N=[],I=[];const f=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 list.forEach(b=>{const R=rot(b.r||[0,0,0]);const tr=v=>[R[0]*v[0]+R[4]*v[1]+R[8]*v[2],R[1]*v[0]+R[5]*v[1]+R[9]*v[2],R[2]*v[0]+R[6]*v[1]+R[10]*v[2]];
  f.forEach(n=>{const u=n[1]?[1,0,0]:[0,1,0];const v=cross(n,u);const base=P.length/3;const nn=tr(n);
   for(const[s,t]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const q=tr([.5*(n[0]+s*u[0]+t*v[0])*b.s[0],.5*(n[1]+s*u[1]+t*v[1])*b.s[1],.5*(n[2]+s*u[2]+t*v[2])*b.s[2]]);P.push(q[0]+b.p[0],q[1]+b.p[1],q[2]+b.p[2]);N.push(...nn);}
   I.push(base,base+1,base+2,base,base+2,base+3);});});return mesh(P,N,I);}
const TORSO=frM(24,.8,1,true),LIMB=frM(16,1,.8,true),SKIRT=frM(28,1,.42,true);
// ---------- semi-realistic person (height ~1.76, feet at origin, facing +z) ----------
const SKINS=[[.93,.76,.62],[.78,.56,.4],[.55,.37,.25],[.36,.24,.16]];
const HAIRS=[[.18,.12,.08],[.08,.06,.05],[.45,.3,.15],[.6,.58,.55]];
function person(P,o){o=o||{};const sk=o.skin||SKINS[0],hc=o.hair||HAIRS[0],coat=o.coat||[.28,.32,.42],pants=o.pants||[.22,.22,.26],shirt=o.shirt||[.92,.9,.85];
 const bid=nextId(),hid=nextId(),hairId=nextId(),hatId=nextId();const B=withId(P,bid),HD=withId(P,hid);
 const w=o.walk||0,ph=o.phase||0;const sw=Math.sin(ph)*w;
 // legs
 const sitting=o.sit;
 for(const sd of[-1,1]){let hipR=[sd*sw*.55,0,0],kn=Math.max(0,-sd*Math.cos(ph)*w*.7);if(sitting){hipR=[-1.45,0,0];kn=1.5;}
  const HP=cxf(B,xf([sd*.095,.93,0],hipR));
  if(o.dress){}else draw(LIMB,{P:HP,p:[0,0,0],r:[Math.PI,0,0],s:[.078,.45,.078],c:pants});
  const KP=cxf(HP,xf([0,-.45,0],[kn,0,0]));if(!o.dress||sitting)draw(LIMB,{P:KP,r:[Math.PI,0,0],s:[.068,.44,.068],c:o.dress?sk:pants});else draw(CYL,{P:KP,p:[0,-.44,0],s:[.05,.44,.05],c:[.85,.82,.78]});
  draw(BOX,{P:KP,p:[0,-.46,.05],s:[.1,.08,.25],c:o.shoes||[.12,.09,.07]});}
 // torso
 if(o.dress){draw(SKIRT,{P:B,p:[0,.08,0],s:[.34,.88,.28],c:o.dress});draw(TORSO,{P:B,p:[0,.92,0],s:[.17,.52,.11],c:o.dress});}
 else{draw(TORSO,{P:B,p:[0,.9,0],s:[.19,.54,.12],c:coat});if(o.longcoat)draw(SKIRT,{P:B,p:[0,.45,0],r:[0,0,0],s:[.22,.5,.15],c:coat});
  draw(BOX,{P:B,p:[0,1.28,.105],r:[-.08,0,0],s:[.1,.26,.03],c:shirt});if(o.tie)draw(BOX,{P:B,p:[0,1.24,.122],s:[.035,.2,.02],c:o.tie});
  for(const sd of[-1,1])draw(BOX,{P:B,p:[sd*.075,1.3,.115],r:[-.1,0,sd*.35],s:[.05,.22,.025],c:mix3(coat,[0,0,0],.25)});
  draw(CYL,{P:B,p:[0,.9,0],s:[.158,.07,.1],c:o.belt||mix3(coat,[0,0,0],.4)});draw(SPH,{P:B,p:[0,.92,0],s:[.16,.1,.1],c:pants});}
 if(o.apron)draw(BOX,{P:B,p:[0,.75,.13],s:[.3,.6,.02],c:o.apron});
 // arms
 for(const sd of[-1,1]){const a=(sd<0?o.armL:o.armR)||[-sd*sw*.5*(-1)*-1,0,0];const ar=[a[0],a[1]||0,(a[2]||0)+sd*.1];const el=(sd<0?o.elbowL:o.elbowR)||(w?.35:.12);
  const SP=cxf(B,xf([sd*.215,1.41,0],ar));draw(SPH,{P:SP,s:[.075,.075,.075],c:o.dress||coat});draw(LIMB,{P:SP,r:[Math.PI,0,0],s:[.06,.3,.06],c:o.dress||coat});
  const EP=cxf(SP,xf([0,-.3,0],[-el,0,0]));draw(LIMB,{P:EP,r:[Math.PI,0,0],s:[.052,.27,.052],c:o.sleeve||o.dress||coat});draw(SPH,{P:withId(EP,hid),p:[0,-.31,0],s:[.045,.06,.035],c:sk});}
 // neck + head
 const HR=o.head||[0,0,0];draw(CYL,{P:HD,p:[0,1.42,0],s:[.05,.12,.05],c:sk});
 const HP=cxf(HD,xf([0,1.62,0],HR));
 draw(SPH,{P:HP,s:[.1,.122,.112],c:sk});draw(SPH,{P:HP,p:[0,-.07,.025],s:[.078,.06,.08],c:sk});
 for(const sd of[-1,1]){draw(SPH,{P:HP,p:[sd*.038,.012,.096],s:[.019,.014,.01],c:[.98,.98,.96]});draw(SPH,{P:HP,p:[sd*.038,.012,.104],s:[.009,.01,.005],c:o.eyes||[.12,.09,.07]});
  draw(BOX,{P:HP,p:[sd*.04,.042,.1],r:[0,0,sd*(o.worry?-.25:.08)],s:[.038,.008,.01],c:mix3(hc,[0,0,0],.3)});draw(SPH,{P:HP,p:[sd*.1,0,0],s:[.018,.032,.024],c:mix3(sk,[0,0,0],.08)});}
 draw(CONE,{P:HP,p:[0,-.005,.105],r:[1.35,0,0],s:[.018,.04,.016],c:mix3(sk,[.6,.3,.25],.12)});
 draw(BOX,{P:HP,p:[0,-.058,.1],s:o.mouthO?[.022,.018,.008]:[.036,.006,.008],c:[.42,.16,.14]});
 if(o.beard)draw(SPH,{P:withId(HP,hairId),p:[0,-.08,.04],s:[.085,.07,.08],c:hc});
 if(o.moustache)draw(BOX,{P:withId(HP,hairId),p:[0,-.04,.103],s:[.05,.012,.012],c:hc});
 const HH=withId(HP,hairId);const hs=o.hairStyle||'short';
 if(hs!=='bald'){draw(SPH,{P:HH,p:[0,.03,-.012],s:[.106,.112,.114],c:hc,r:[-.25,0,0]});
  if(hs==='long'){draw(BOX,{P:HH,p:[0,-.08,-.07],s:[.2,.22,.06],c:hc});}
  if(hs==='bun'){draw(SPH,{P:HH,p:[0,.05,-.12],s:[.055,.055,.055],c:hc});}}
 const HT=withId(HP,hatId);const hat=o.hat||'none';const hcl=o.hatc||[.2,.18,.16];
 if(hat==='cap'){draw(CYL,{P:HT,p:[0,.06,0],s:[.115,.06,.12],c:hcl});draw(BOX,{P:HT,p:[0,.07,.11],r:[.15,0,0],s:[.18,.015,.08],c:hcl});}
 if(hat==='flat'){draw(CYL,{P:HT,p:[0,.07,.01],s:[.12,.05,.125],c:hcl});draw(CYL,{P:HT,p:[0,.11,.03],r:[.12,0,0],s:[.13,.02,.14],c:hcl});}
 if(hat==='bowler'){draw(CYL,{P:HT,p:[0,.075,0],s:[.17,.012,.17],c:hcl});draw(SPH,{P:HT,p:[0,.09,0],s:[.11,.09,.115],c:hcl});}
 if(hat==='naval'){draw(CYL,{P:HT,p:[0,.06,0],s:[.115,.06,.12],c:[.95,.95,.95]});draw(CYL,{P:HT,p:[0,.05,0],s:[.118,.025,.123],c:[.1,.1,.15]});draw(BOX,{P:HT,p:[0,.07,.11],r:[.2,0,0],s:[.15,.012,.07],c:[.08,.08,.08]});}
 if(hat==='wrap'){draw(SPH,{P:HT,p:[0,.06,-.01],s:[.12,.09,.125],c:hcl});draw(SPH,{P:HT,p:[.03,.1,-.02],s:[.09,.06,.09],c:hcl});}
 if(hat==='fez'){draw(FR,{P:HT,p:[0,.06,0],s:[.09,.1,.09],c:hcl});}}
// pose shortcuts
const POSE={point:{armR:[-1.5,0,-.2],elbowR:.05},raise:{armL:[-2.6,0,.25],armR:[-2.6,0,-.25],elbowL:.2,elbowR:.2},cover:{armL:[-1.3,0,-.6],armR:[-1.3,0,.6],elbowL:2.1,elbowR:2.1},
 wave:{armR:[-2.7,0,-.5],elbowR:.4},hips:{armL:[0,0,-.5],armR:[0,0,.5],elbowL:1.6,elbowR:1.6},type:{armL:[-.7,0,-.15],armR:[-.7,0,.15],elbowL:1.3,elbowR:1.3}};
// ---------- generic props ----------
function tree(P,k,c){k=k||1;draw(CYL,{P,p:[0,0,0],s:[.12*k,1.4*k,.12*k],c:[.42,.28,.16]});draw(SPH,{P,p:[0,1.9*k,0],s:[.85*k,.95*k,.85*k],c:c||[.32,.58,.26]});draw(SPH,{P,p:[.35*k,1.55*k,.2*k],s:[.55*k,.6*k,.55*k],c:mix3(c||[.32,.58,.26],[0,0,0],.08)});}
function palm(P,k){k=k||1;for(let i=0;i<6;i++)draw(CYL,{P,p:[Math.sin(i*.3)*.08*k,i*.6*k,0],r:[0,0,-.05],s:[.13*k-.01*i*k,.62*k,.13*k-.01*i*k],c:[.5,.38,.24]});for(let i=0;i<7;i++){const a=i/7*Math.PI*2;draw(BOX,{P,p:[Math.cos(a)*.7*k,3.5*k,Math.sin(a)*.7*k],r:[0,-a,-.5],s:[1.5*k,.04*k,.35*k],c:[.25,.55,.22]});}}
function hut(P,o){o=o||{};const wc=o.wall||[.78,.55,.36],rc=o.roof||[.72,.6,.32];draw(CYL,{P,p:[0,0,0],s:[1.5,1.6,1.5],c:wc});draw(CONE,{P,p:[0,1.55,0],s:[1.95,1.6,1.95],c:rc});
 draw(BOX,{P,p:[0,.65,1.47],s:[.6,1.25,.08],c:[.25,.16,.1]});if(o.light)draw(BOX,{P,p:[0,.65,1.5],s:[.45,1.1,.02],c:[1,.8,.4],u:1});}
function cow(P,c){c=c||[.55,.38,.24];draw(SPH,{P,p:[0,.95,0],s:[.38,.4,.75],c});draw(SPH,{P,p:[0,1.05,.85],s:[.2,.22,.3],c});draw(SPH,{P,p:[0,.98,1.1],s:[.15,.13,.12],c:[.85,.7,.65]});
 for(const sd of[-1,1]){draw(CONE,{P,p:[sd*.14,1.25,.85],r:[0,0,sd*-1.1],s:[.035,.22,.035],c:[.92,.9,.82]});draw(SPH,{P,p:[sd*.1,1.12,1.05],s:[.03,.03,.02],c:[.05,.05,.05]});}
 for(const[a,b]of[[.2,.5],[-.2,.5],[.2,-.5],[-.2,-.5]])draw(CYL,{P,p:[a,0,b],s:[.08,.72,.08],c});draw(SPH,{P,p:[-.2,1.15,-.1],s:[.2,.15,.3],c:[.95,.93,.9]});}
function crate(P,c){draw(BOX,{P,p:[0,.3,0],s:[.6,.6,.6],c:c||[.6,.45,.28]});}
function barrel(P,c){draw(CYL,{P,s:[.28,.85,.28],c:c||[.55,.36,.2]});for(const y of[.15,.7])draw(TUBE,{P,p:[0,y,0],s:[.29,.05,.29],c:[.25,.25,.27]});}
