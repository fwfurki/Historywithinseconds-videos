// ===== body.js — smooth SDF-meshed people (skinned, human-like animation) + smooth props =====
// Loaded after people.js: redefines person(), tree(), cow(), hut(); adds rock(), sdfMesh().
const SD={
 smin(a,b,k){const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25;},
 smax(a,b,k){return -SD.smin(-a,-b,k);},
 ell(x,y,z,c,r){const X=(x-c[0])/r[0],Y=(y-c[1])/r[1],Z=(z-c[2])/r[2];const k0=Math.sqrt(X*X+Y*Y+Z*Z);const k1=Math.sqrt(X*X/(r[0]*r[0])+Y*Y/(r[1]*r[1])+Z*Z/(r[2]*r[2]));return k1>1e-9?k0*(k0-1)/k1:-Math.min(r[0],r[1],r[2]);},
 // iq round cone between points a,b with radii r1,r2
 rc(x,y,z,a,b,r1,r2){const bx=b[0]-a[0],by=b[1]-a[1],bz=b[2]-a[2];const l2=bx*bx+by*by+bz*bz;const rr=r1-r2;const a2=l2-rr*rr;const il2=1/l2;
  const px=x-a[0],py=y-a[1],pz=z-a[2];const yy=px*bx+py*by+pz*bz;const zz=yy-l2;const qx=px*l2-bx*yy,qy=py*l2-by*yy,qz=pz*l2-bz*yy;const x2=qx*qx+qy*qy+qz*qz;const y2=yy*yy*l2;const z2=zz*zz*l2;
  const k=Math.sign(rr)*rr*rr*x2;if(Math.sign(zz)*a2*z2>k)return Math.sqrt(x2+z2)*il2-r2;if(Math.sign(yy)*a2*y2<k)return Math.sqrt(x2+y2)*il2-r1;return(Math.sqrt(x2*a2*il2)+yy*rr)*il2-r1;},
 sph(x,y,z,c,r){return Math.hypot(x-c[0],y-c[1],z-c[2])-r;}
};
function hashf(x,y,z){const s=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return s-Math.floor(s);}
function vnoise3(x,y,z){const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z);let fx=x-ix,fy=y-iy,fz=z-iz;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);fz=fz*fz*(3-2*fz);
 const L=(a,b,t)=>a+(b-a)*t;const h=(i,j,k)=>hashf(ix+i,iy+j,iz+k);
 return L(L(L(h(0,0,0),h(1,0,0),fx),L(h(0,1,0),h(1,1,0),fx),fy),L(L(h(0,0,1),h(1,0,1),fx),L(h(0,1,1),h(1,1,1),fx),fy),fz);}
// ---- naive surface nets: f(x,y,z)->distance. returns {P,N,I}
function surfaceNets(f,b0,b1,res){const nx=Math.ceil((b1[0]-b0[0])/res)+1,ny=Math.ceil((b1[1]-b0[1])/res)+1,nz=Math.ceil((b1[2]-b0[2])/res)+1;
 const V=new Float32Array(nx*ny*nz);const id=(i,j,k)=>i+nx*(j+ny*k);
 for(let k=0;k<nz;k++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)V[id(i,j,k)]=f(b0[0]+i*res,b0[1]+j*res,b0[2]+k*res);
 const cx_=nx-1,cy_=ny-1,cz_=nz-1;const vid=new Int32Array(cx_*cy_*cz_).fill(-1);const cid=(i,j,k)=>i+cx_*(j+cy_*k);const P=[];
 const E=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];const C=[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]];const cv=new Float32Array(8);
 for(let k=0;k<cz_;k++)for(let j=0;j<cy_;j++)for(let i=0;i<cx_;i++){let m=0;for(let c=0;c<8;c++){const v=V[id(i+C[c][0],j+C[c][1],k+C[c][2])];cv[c]=v;if(v<0)m|=1<<c;}
  if(m===0||m===255)continue;let sx=0,sy=0,sz=0,n=0;for(const[a,b]of E){const va=cv[a],vb=cv[b];if((va<0)!==(vb<0)){const t=va/(va-vb);sx+=C[a][0]+(C[b][0]-C[a][0])*t;sy+=C[a][1]+(C[b][1]-C[a][1])*t;sz+=C[a][2]+(C[b][2]-C[a][2])*t;n++;}}
  vid[cid(i,j,k)]=P.length/3;P.push(b0[0]+(i+sx/n)*res,b0[1]+(j+sy/n)*res,b0[2]+(k+sz/n)*res);}
 const I=[];const quad=(a,b,c,d)=>{if(a<0||b<0||c<0||d<0)return;I.push(a,b,c,a,c,d);};
 for(let k=1;k<cz_;k++)for(let j=1;j<cy_;j++)for(let i=0;i<cx_;i++){const a=V[id(i,j,k)]<0,b=V[id(i+1,j,k)]<0;if(a===b)continue;quad(vid[cid(i,j-1,k-1)],vid[cid(i,j,k-1)],vid[cid(i,j,k)],vid[cid(i,j-1,k)]);}
 for(let k=1;k<cz_;k++)for(let j=0;j<cy_;j++)for(let i=1;i<cx_;i++){const a=V[id(i,j,k)]<0,b=V[id(i,j+1,k)]<0;if(a===b)continue;quad(vid[cid(i-1,j,k-1)],vid[cid(i,j,k-1)],vid[cid(i,j,k)],vid[cid(i-1,j,k)]);}
 for(let k=0;k<cz_;k++)for(let j=1;j<cy_;j++)for(let i=1;i<cx_;i++){const a=V[id(i,j,k)]<0,b=V[id(i,j,k+1)]<0;if(a===b)continue;quad(vid[cid(i-1,j-1,k)],vid[cid(i,j-1,k)],vid[cid(i,j,k)],vid[cid(i-1,j,k)]);}
 const N=new Float32Array(P.length);const e=res*.5;for(let v=0;v<P.length;v+=3){const x=P[v],y=P[v+1],z=P[v+2];const gx=f(x+e,y,z)-f(x-e,y,z),gy=f(x,y+e,z)-f(x,y-e,z),gz=f(x,y,z+e)-f(x,y,z-e);const l=Math.hypot(gx,gy,gz)||1;N[v]=gx/l;N[v+1]=gy/l;N[v+2]=gz/l;}
 return{P,N,I};}
function sdfMesh(f,b0,b1,res){const r=surfaceNets(f,b0,b1,res);return mesh(r.P,Array.from(r.N),r.I);}
// ---------- skeleton ----------
const BJ=[[0,.95,0],[0,1.02,0],[0,1.42,0],[0,1.52,0],[-.19,1.41,0],[-.225,1.125,-.01],[-.25,.87,.005],[.19,1.41,0],[.225,1.125,-.01],[.25,.87,.005],[-.092,.92,0],[-.096,.5,.012],[-.098,.085,-.012],[.092,.92,0],[.096,.5,.012],[.098,.085,-.012]];
const BPAR=[-1,0,1,2,1,4,5,1,7,8,0,10,11,0,13,14];
const BSEG=[[[0,.86,0],[0,1.0,0]],[[0,1.03,0],[0,1.38,0]],[[0,1.42,0],[0,1.52,0]],[[0,1.55,.01],[0,1.7,0]],[[-.19,1.41,0],[-.225,1.125,-.01]],[[-.225,1.125,-.01],[-.25,.87,.005]],[[-.25,.87,.005],[-.262,.76,.015]],
 [[.19,1.41,0],[.225,1.125,-.01]],[[.225,1.125,-.01],[.25,.87,.005]],[[.25,.87,.005],[.262,.76,.015]],[[-.092,.92,0],[-.096,.5,.012]],[[-.096,.5,.012],[-.098,.085,-.012]],[[-.098,.085,-.012],[-.098,.025,.12]],
 [[.092,.92,0],[.096,.5,.012]],[[.096,.5,.012],[.098,.085,-.012]],[[.098,.085,-.012],[.098,.025,.12]]];
function segD(x,y,z,s){const a=s[0],b=s[1];const bx=b[0]-a[0],by=b[1]-a[1],bz=b[2]-a[2];const px=x-a[0],py=y-a[1],pz=z-a[2];let t=(px*bx+py*by+pz*bz)/(bx*bx+by*by+bz*bz);t=Math.max(0,Math.min(1,t));return Math.hypot(px-bx*t,py-by*t,pz-bz*t);}
// ---------- body SDF (rest pose, metres, feet at y=0, facing +z) ----------
function bodySDF(v){const F=v.f,hs=v.hair,dr=v.dress;const sh=F?.172:.19;const ar=F?.9:1,lr=F?.93:1;
 const S=[[-sh,1.41,0],[-.225*sh/.19,1.125,-.01],[-.25*sh/.19+.005*F,.87,.005],[-.262*sh/.19+.005*F,.76,.015]];
 return function(x,y,z,wantPart){let best=1e9,part=0;const U=(d,p,k)=>{if(k){const nb=SD.smin(best,d,k);if(d<best)part=p;best=nb;}else if(d<best){best=d;part=p;}};
  // torso: one smooth tapered elliptical trunk + shoulder yoke (no separate blobs)
  {const zs=F?1.55:1.5;const tz=z*zs;const tr=SD.rc(x,y,tz,[0,.9,0],[0,1.3,0],F?.158:.15,F?.15:.163)/1.25;U(tr,0);
   for(const sd of[-1,1])U(SD.rc(x,y,z,[0,1.395,-.012],[sd*(sh-.045),1.36,-.012],.07,.056),0,.1);
   if(F){for(const sd of[-1,1])U(SD.ell(x,y,z,[sd*.05,1.25,.055],[.05,.045,.04]),0,.04);}}
  // neck + head
  U(SD.rc(x,y,z,[0,1.37,-.012],[0,1.54,-.006],.046*(F?.9:1),.041*(F?.9:1)),1,.035);
  const hk=F?.96:1;U(SD.ell(x,y,z,[0,1.625,.004],[.088*hk,.11*hk,.1*hk]),1,.02);
  U(SD.ell(x,y,z,[0,1.572,.028],[.06*hk,.058*hk,.07*hk]),1,.03);
  U(SD.ell(x,y,z,[0,1.536,.058],[.028,.02,.024]),1,.02);
  for(const sd of[-1,1]){U(SD.ell(x,y,z,[sd*.044,1.602,.066],[.026,.02,.024]),1,.02);U(SD.ell(x,y,z,[sd*.09*hk,1.612,-.002],[.014,.03,.02]),1,.008);}
  U(SD.ell(x,y,z,[0,1.657,.07],[.068*hk,.018,.03]),1,.02);
  U(SD.rc(x,y,z,[0,1.632,.09],[0,1.592,.11],.008,.0115),1,.012);U(SD.ell(x,y,z,[0,1.59,.101],[.017,.011,.014]),1,.008);
  for(const sd of[-1,1]){const d=SD.sph(x,y,z,[sd*.034,1.632,.094],.019);best=SD.smax(best,-d,.008);}
  // hair
  if(hs!=='bald'){const ang=Math.atan2(x,z);const gro=.0022*Math.sin(ang*38+y*25)+.0018*vnoise3(x*60,y*12,z*60);const hd=Math.max(SD.ell(x,y,z,[0,1.649,-.012],[.096*hk,.106*hk,.108*hk])+gro,(1.69-1.25*Math.max(0,.02-z))-y+.004*Math.sin(x*90));U(hd,6,.006);
   if(hs==='bun')U(SD.sph(x,y,z,[0,1.665,-.112],.045),6,.02);
   if(hs==='long')U(SD.ell(x,y,z,[0,1.55,-.07],[.1,.15,.055]),6,.03);}
  // arms (part 2), hands (3)
  for(const sd of[-1,1]){const P=S.map(p=>[p[0]*sd*-1,p[1],p[2]]);const sx=sd>0?-1:1;const Q=S.map(p=>[-p[0]*sx*-1*-1,p[1],p[2]]);}
  for(const sd of[-1,1]){const s=[sd*sh,1.41,0],e=[sd*.225*sh/.19,1.125,-.01],w=[sd*(.25*sh/.19-.005*F),.87,.005],t=[sd*(.262*sh/.19-.005*F),.765,.018];
   U(SD.rc(x,y,z,s,e,.05*ar,.041*ar),2,.035);U(SD.ell(x,y,z,[s[0]*.6+e[0]*.4,1.3,0],[.045*ar,.08,.045*ar]),2,.02);
   U(SD.rc(x,y,z,e,w,.041*ar,.03*ar),2,.02);
   const pc=[w[0]*.55+t[0]*.45,.825,.01];U(SD.ell(x,y,z,pc,[.02*ar,.045,.04*ar]),3,.02);
   U(SD.rc(x,y,z,[pc[0],.81,.012],[t[0],.755,.016],.02*ar,.016*ar),3,.015);
   U(SD.rc(x,y,z,[w[0]-sd*.005,.85,.03],[pc[0]-sd*.012,.8,.05],.011*ar,.009*ar),3,.008);}
  // legs (4), feet (5)
  for(const sd of[-1,1]){const h=[sd*.092*(F?1.05:1),.92,0],k=[sd*.096,.5,.012],a=[sd*.098,.085,-.012];
   U(SD.rc(x,y,z,h,k,.083*lr,.054*lr),4,.04);U(SD.ell(x,y,z,[sd*.097,.36,-.012],[.05*lr,.11,.05*lr]),4,.03);U(SD.rc(x,y,z,k,a,.052*lr,.034*lr),4,.02);
   const fd=Math.max(SD.smin(SD.rc(x,y,z,[sd*.098,.06,-.03],[sd*.098,.04,.12],.04,.032),SD.ell(x,y,z,[sd*.098,.05,-.025],[.038,.045,.05]),.02),-y);U(fd,5,.02);}
  // skirt (7)
  if(dr)U(Math.max(SD.rc(x,y,z,[0,.99,0],[0,.08,0],.142,.33),.06-y),7,.03);
  if(!wantPart&&part===7&&Math.abs(best)<.02&&y<1.42)best+=part===7?(.0045*Math.sin(Math.atan2(x,z)*15+vnoise3(x*4,y*3,z*4)*4)*(1.1-y)):(vnoise3(x*22,y*7,z*22)-.5)*.005;
  return wantPart?part:best;};}
const BODY_CACHE=new Map();
function bodyMesh(v){const key=(v.f?'f':'m')+v.hair+(v.dress?'d':'');let m=BODY_CACHE.get(key);if(m)return m;
 const f=bodySDF(v);const res=(typeof BODY_RES!=='undefined')?BODY_RES:.0105;const r=surfaceNets((x,y,z)=>f(x,y,z,false),[-.42,-.005,v.dress?-.37:-.22],[.42,1.79,v.dress?.37:.24],res);
 const nv=r.P.length/3;const BI=new Float32Array(nv*4),BW=new Float32Array(nv*4),PT=new Float32Array(nv);
 const cand={0:[0,1,2,4,7,10,13],1:[1,2,3],6:[3],7:[0],3:null,2:null,4:null,5:null};
 let Wd=new Float32Array(nv*16);const HM=new Float32Array(nv);
 for(let i=0;i<nv;i++){const x=r.P[i*3],y=r.P[i*3+1],z=r.P[i*3+2];const p=f(x,y,z,true);PT[i]=p===6?1:p;HM[i]=p===6?1:0;let cs=cand[p];
  if(!cs){const L=x<0;if(p===2)cs=L?[1,4,5]:[1,7,8];else if(p===3)cs=L?[5,6]:[8,9];else if(p===4)cs=L?[0,10,11]:[0,13,14];else cs=L?[11,12]:[14,15];}
  let b1=-1,d1=1e9,b2=-1,d2=1e9;for(const b of cs){const d=segD(x,y,z,BSEG[b]);if(d<d1){b2=b1;d2=d1;b1=b;d1=d;}else if(d<d2){b2=b;d2=d;}}
  let w1=1,w2=0;if(b2>=0&&(BPAR[b2]===b1||BPAR[b1]===b2)){const a=Math.pow(d1+.006,-4),c=Math.pow(d2+.006,-4);w1=a/(a+c);w2=c/(a+c);}
  Wd[i*16+b1]+=w1;if(w2>0)Wd[i*16+b2]+=w2;}
 // neighbour lists + smoothing (removes tearing at joints)
 const nb=Array.from({length:nv},()=>[]);for(let t=0;t<r.I.length;t+=3){const a=r.I[t],b=r.I[t+1],c=r.I[t+2];nb[a].push(b,c);nb[b].push(a,c);nb[c].push(a,b);}
 for(let it=0;it<(typeof SKIN_SMOOTH!=='undefined'?SKIN_SMOOTH:6);it++){const Wn=new Float32Array(nv*16);const Hn=new Float32Array(nv);for(let i=0;i<nv;i++){const L=nb[i];const k=L.length;
   for(let q=0;q<16;q++){let s2=Wd[i*16+q]*k;for(const j of L)s2+=Wd[j*16+q];Wn[i*16+q]=s2/(2*k||1);}let h=HM[i]*k;for(const j of L)h+=HM[j];Hn[i]=h/(2*k||1);}Wd=Wn;if(it<2)HM.set(Hn);}
 for(let i=0;i<nv;i++){const ws=[];for(let q=0;q<16;q++)if(Wd[i*16+q]>.001)ws.push([Wd[i*16+q],q]);ws.sort((a,b)=>b[0]-a[0]);const t3=ws.slice(0,3);const sm=t3.reduce((a,b)=>a+b[0],0)||1;
  for(let q=0;q<3;q++){BI[i*4+q]=t3[q]?t3[q][1]:0;BW[i*4+q]=t3[q]?t3[q][0]/sm:0;}}
 m={vao:gl.createVertexArray(),n:r.I.length,big:nv>65535,skin:1};gl.bindVertexArray(m.vao);
 const buf=(data,loc,sz)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,sz,gl.FLOAT,false,0,0);};
 buf(new Float32Array(r.P),0,3);buf(r.N,1,3);buf(BI,2,4);buf(BW,3,4);buf(PT,4,1);buf(HM,5,1);
 const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.big?new Uint32Array(r.I):new Uint16Array(r.I),gl.STATIC_DRAW);gl.bindVertexArray(null);
 for(let l=2;l<5;l++){}BODY_CACHE.set(key,m);return m;}
// ---------- pose -> bone matrices ----------
function T4(x,y,z){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]);}
function poseBones(R){// R[b]=[rx,ry,rz] local rotations; returns Float32Array(256) BN and world mats
 const Wp=new Array(16),BN=new Float32Array(256);
 for(let b=0;b<16;b++){const j=BJ[b],pa=BPAR[b];const rb=R[b]||[0,0,0];
  const L=mul(pa<0?T4(j[0],j[1]+(R.bob||0),j[2]):mul(Wp[pa],T4(j[0]-BJ[pa][0],j[1]-BJ[pa][1],j[2]-BJ[pa][2])),rot(rb));Wp[b]=L;BN.set(mul(L,T4(-j[0],-j[1],-j[2])),b*16);}
 return BN;}
function boneXF(P,BN,b){const M=BN.subarray(b*16,b*16+16);const Rm=new Float32Array(M);Rm[12]=Rm[13]=Rm[14]=0;return{M:mul(P.M,M),R:mul(P.R,Rm),gold:P.gold,id:P.id};}
// ---------- person (smooth) ----------
const PERSON_SEED={n:0};
function person(P,o){o=o||{};const sk=o.skin||SKINS[0],hc=o.hair||HAIRS[0],coat=o.coat||[.28,.32,.42],pants=o.pants||[.22,.22,.26],shirt=o.shirt||[.92,.9,.85];
 const fem=!!(o.dress||o.female);const hs=o.hairStyle||(fem?'bun':'short');const m=bodyMesh({f:fem,hair:(o.hat&&o.hat!=='none'&&hs==='short')?'short':hs,dress:!!o.dress});
 const w=o.walk||0,ph=o.phase||0;const tt=TIME+(o.seed||0)*1.7;const R=[];for(let b=0;b<16;b++)R[b]=[0,0,0];
 // idle life: breathing + weight shift + small head motion
 R[1][0]+=.018*Math.sin(tt*1.6);R[0][2]+=(1-w)*.012*Math.sin(tt*.55);R[3][1]+=(1-w)*.05*Math.sin(tt*.45+1);R[3][0]+=.02*Math.sin(tt*.7);
 // walk cycle (human gait)
 if(w){for(const sd of[-1,1]){const th=ph+(sd<0?0:Math.PI);const hipB=sd<0?10:13,kneeB=hipB+1,ankB=hipB+2;
   const thigh=-.44*w*Math.sin(th);const swing=Math.max(0,Math.sin(th-.9));const knee=w*(.08+.85*swing*swing+.12*Math.max(0,Math.cos(th)));
   R[hipB][0]+=thigh;R[kneeB][0]+=knee;R[ankB][0]+=-.25*w*Math.cos(th)+.3*w*swing-thigh*.2;
   const shB=sd<0?4:7;R[shB][0]+=.36*w*Math.sin(th);R[shB+1][0]+=-(.22+.25*w*Math.max(0,Math.sin(th)));}
  R[0][1]+=.09*w*Math.sin(ph);R[0][2]+=.035*w*Math.cos(ph);R[1][1]+=-.15*w*Math.sin(ph);R[1][0]+=.06*w;R[3][1]+=.06*w*Math.sin(ph);R.bob=-.022*w*Math.abs(Math.cos(ph));}
 else{for(const sd of[-1,1]){const shB=sd<0?4:7;R[shB+1][0]-=.14;R[shB][2]+=sd*.04;}}
 // explicit poses (compatible with old API: armL/armR euler at shoulder, elbowL/R bend, head, sit, lean)
 for(const sd of[-1,1]){const a=sd<0?o.armL:o.armR;const shB=sd<0?4:7;if(a){R[shB]=[a[0],a[1]||0,(a[2]||0)];}const el=sd<0?o.elbowL:o.elbowR;if(el!==undefined)R[shB+1]=[-el,0,0];}
 if(o.head){R[3][0]+=o.head[0];R[3][1]+=o.head[1]||0;R[3][2]+=o.head[2]||0;}
 if(o.lean)R[1][0]+=o.lean;
 if(o.sit){for(const hb of[10,13]){R[hb]=[-1.45,0,0];R[hb+1]=[1.5,0,0];R[hb+2]=[-.05,0,0];}}
 const BN=poseBones(R);const id=nextId();const PP=Object.assign({},P,{id});
 const mats=new Float32Array([...sk,...(o.dress||coat),...(o.sleeve||shirt),...pants,...(o.shoes||[.13,.1,.08]),...hc,...(o.tie||o.belt||[.2,.14,.1]),...(o.dress||coat)]);
 const mp=[o.sleeve?-.56:(o.shortSleeve?.18:.56),o.dress?1:0,(o.dress||o.noVneck)?0:1,o.longcoat?1:0];
 if(o.sleeve)mats.set(o.sleeve,6);
 draw(m,{P:PP,c:[1,1,1],bones:BN,mats,mp,g:.15});
 // face details on head bone
 const HB=boneXF(PP,BN,3);const FX=Object.assign({},HB,{noInk:1,noShadow:1});const ec=o.eyes||[.32,.2,.12];const blink=((tt*.37+.5+(o.seed||0)*.13)%1)<.025?1:0;
 for(const sd of[-1,1]){const ex=sd*.034;draw(SPH,{P:FX,p:[ex,1.632,.0845],s:[.0148,.0148,.0148],c:blink?mix3(sk,[0,0,0],.08):[.95,.94,.92]});
  if(!blink){draw(SPH,{P:FX,p:[ex,1.631,.0955],s:[.0082,.0082,.0045],c:ec});draw(SPH,{P:FX,p:[ex,1.631,.0988],s:[.0042,.0042,.0022],c:[.03,.02,.02]});draw(SPH,{P:FX,p:[ex+.0028,1.6345,.1003],s:[.0016,.0016,.001],c:[1,1,1],u:1});}
  draw(SPH,{P:FX,p:[ex,1.6395+(blink?-.006:0),.0875],r:[blink?.6:-.25,0,0],s:[.0172,.0092,.0158],c:mix3(sk,[0,0,0],.08)});
  draw(SPH,{P:FX,p:[sd*.037,1.6565,.1005],r:[0,0,sd*(o.worry?-.3:.12)],s:[.021,.0042,.006],c:mix3(hc,[0,0,0],.25)});}
 if(o.mouthO)draw(SPH,{P:FX,p:[0,1.566,.098],s:[.011,.009,.005],c:[.3,.1,.1]});
 const HH=Object.assign({},HB,{id:nextId()});
 if(o.beard)draw(SPH,{P:HH,p:[0,1.55,.05],s:[.07,.05,.06],c:hc});
 if(o.moustache){draw(SPH,{P:Object.assign({},HB,{noShadow:1}),p:[0,1.5748,.1],r:[-.25,0,0],s:[.024,.0055,.012],c:hc});}
 const HT=cxf(Object.assign({},HB,{id:nextId()}),xf([0,1.615,0]));const hat=o.hat||'none';const hcl=o.hatc||[.2,.18,.16];
 if(hat==='cap'){draw(SPH,{P:HT,p:[0,.06,-.005],s:[.106,.065,.112],c:hcl});draw(CYL,{P:HT,p:[0,.06,.1],r:[.2,0,0],s:[.085,.012,.06],c:hcl});}
 if(hat==='flat'){draw(SPH,{P:HT,p:[0,.07,.0],s:[.116,.058,.122],c:hcl});draw(CYL,{P:HT,p:[0,.075,.04],r:[.14,0,0],s:[.125,.018,.13],c:hcl});}
 if(hat==='bowler'){draw(CYL,{P:HT,p:[0,.07,0],s:[.16,.01,.16],c:hcl});draw(SPH,{P:HT,p:[0,.085,0],s:[.104,.088,.108],c:hcl});draw(CYL,{P:HT,p:[0,.074,0],s:[.106,.024,.11],c:[.12,.1,.1]});}
 if(hat==='naval'){draw(CYL,{P:HT,p:[0,.06,0],s:[.112,.058,.117],c:[.95,.95,.95]});draw(CYL,{P:HT,p:[0,.05,0],s:[.115,.024,.12],c:[.1,.1,.15]});draw(CYL,{P:HT,p:[0,.06,.1],r:[.25,0,0],s:[.075,.01,.05],c:[.08,.08,.08]});}
 if(hat==='wrap'){draw(SPH,{P:HT,p:[0,.06,-.012],s:[.112,.085,.118],c:hcl});draw(SPH,{P:HT,p:[.025,.1,-.02],s:[.085,.055,.085],c:hcl});}
 if(hat==='fez'){draw(FR,{P:HT,p:[0,.06,0],s:[.088,.1,.088],c:hcl});}
 if(o.apron)draw(BOX,{P:boneXF(PP,BN,0),p:[0,.75,.12],s:[.3,.6,.015],c:o.apron});
 return BN;}
// ---------- smooth props ----------
const PROP=new Map();function propMesh(key,f,b0,b1,res){let m=PROP.get(key);if(!m){m=sdfMesh(f,b0,b1,res);PROP.set(key,m);}return m;}
// --- trees: trunk + forked branches + separate noisy leaf clumps (types: 'broad' default, 'acacia', 'pine')
function rngS(seed){let x=Math.sin(seed*91.7)*1e4;return()=>{x=Math.sin(x*12.9898+78.233)*43758.5453;return x-Math.floor(x);};}
function treeDef(type,seed){const R=rngS(seed+1);const br=[],cl=[];
 if(type==='pine'){for(let i=0;i<6;i++){const y=1.0+i*.55,r=1.25-i*.19;cl.push({c:[0,y,0],r,cone:1,h:.9});}return{trunkH:4.2,br,cl};}
 const n=type==='acacia'?5:6;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+R()*.8;const up=type==='acacia'?.55:1;const len=(type==='acacia'?1.3:.9)+R()*.5;
  const s=[0,1.3+R()*.6,0];const e=[Math.cos(a)*len,s[1]+len*up*(.8+R()*.5),Math.sin(a)*len];br.push([s,e]);
  const cr=type==='acacia'?.75+R()*.25:.55+R()*.3;cl.push({c:[e[0]*1.05,e[1]+(type==='acacia'?.05:.15),e[2]*1.05],r:cr,flat:type==='acacia'});
  if(type!=='acacia'){const m=[s[0]*.4+e[0]*.6,s[1]*.4+e[1]*.6+.25,s[2]*.4+e[2]*.6];cl.push({c:m,r:cr*.75});const a2=a+.6;cl.push({c:[e[0]+Math.cos(a2)*.35,e[1]+.35,e[2]+Math.sin(a2)*.35],r:cr*.6});}}
 if(type!=='acacia')cl.push({c:[0,2.55+R()*.3,0],r:.75});
 return{trunkH:type==='acacia'?1.5:1.7,br,cl};}
function canopySDF(def,seed){return(x,y,z)=>{let d=1e9;for(const c of def.cl){let e;
  if(c.cone){const ry=y-c.c[1];e=Math.max(Math.hypot(x,z)*(c.h/c.r)+ry-c.h,-ry-.05);e*=.7;}
  else if(c.flat)e=SD.ell(x,y,z,c.c,[c.r*1.35,c.r*.42,c.r*1.35]);else e=SD.sph(x,y,z,c.c,c.r);
  d=SD.smin(d,e,c.cone?.05:.09);}
 const n=vnoise3(x*3.1+seed,y*3.1,z*3.1)*.22+vnoise3(x*7.3,y*7.3+seed,z*7.3)*.1+vnoise3(x*15,y*15,z*15+seed)*.05;return d+n-.14;};}
function trunkSDF(def){return(x,y,z)=>{let d=SD.rc(x,y,z,[0,-.1,0],[0,def.trunkH,0],.17,.09);d=SD.smin(d,SD.rc(x,y,z,[0,0,0],[0,.35,0],.26,.17),.1);
 for(const[s,e]of def.br)d=SD.smin(d,SD.rc(x,y,z,s,e,.085,.04),.07);return Math.max(d+.012*vnoise3(x*14,y*4,z*14),-y-.05);};}
function tree(P,k,c,type){k=k||1;type=type||'broad';const v=Math.abs(Math.round((P.M[12]*7.3+P.M[14]*3.1)))%3;const tc=c||(type==='pine'?[.2,.42,.24]:type==='acacia'?[.42,.56,.24]:[.32,.56,.24]);
 const key=type+v;const def=treeDef(type,v*3+1);
 const tm=propMesh('trunk'+key,trunkSDF(def),[-2,-.06,-2],[2,def.trunkH+1.8,2],.035);draw(tm,{P,s:[k,k,k],c:[.4,.28,.17],pat:2,patS:7});
 const cm=propMesh('can'+key,canopySDF(def,v*1.7),type==='pine'?[-1.5,.8,-1.5]:[-2.4,1.0,-2.4],type==='pine'?[1.5,4.6,1.5]:[2.4,4.0,2.4],.05);draw(cm,{P,s:[k,k,k],c:tc,pat:1,patS:3});}
// --- rocks: faceted boulders (random plane cuts + noise)
function rockSDF(seed){const R=rngS(seed+11);const pl=[];for(let i=0;i<15;i++){const u=R()*2-1,a=R()*Math.PI*2;const r=Math.sqrt(1-u*u);const n=[r*Math.cos(a),Math.abs(u)*.8+.05*(u<0?-1:1)*(i%3),r*Math.sin(a)];const l=Math.hypot(...n);pl.push([n[0]/l,n[1]/l,n[2]/l,.26+R()*.24]);}
 return(x,y,z)=>{const q=[x/1.25,(y-.25)/.85,z];let d=-1e9;for(const p of pl)d=SD.smax(d,q[0]*p[0]+q[1]*p[1]+q[2]*p[2]-p[3],.012);
  d=SD.smax(d,SD.ell(x,y,z,[0,.25,0],[.8,.6,.72]),.05);d=Math.max(d,-y-.05);const cr=Math.abs(vnoise3(x*4.5+seed,y*4.5,z*4.5)-.5);return d+.014*vnoise3(x*6+seed,y*6,z*6)+.008*vnoise3(x*18,y*18+seed,z*18)-.006;};}
function smoothstepJ(a,b,x){x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x);}
function rock(P,k,c,seed){seed=(seed||0)%4;const m=propMesh('rockF'+seed,rockSDF(seed),[-.9,-.2,-.8],[.9,.9,.8],.025);draw(m,{P,s:[k||1,k||1,k||1],c:c||[.56,.53,.49],pat:6,patS:2.5});}
// --- cow: detailed SDF (ribcage, hips, neck, head with muzzle, ears, horns, jointed legs, hooves, tail, udder) + patch pattern
function cowSDF(){return(x,y,z)=>{let d=SD.ell(x,y,z,[0,1.0,.1],[.34,.36,.62]);d=SD.smin(d,SD.ell(x,y,z,[0,1.02,-.45],[.32,.34,.38]),.18);
 for(const sd of[-1,1]){d=SD.smin(d,SD.ell(x,y,z,[sd*.2,1.18,-.55],[.1,.1,.12]),.08);d=SD.smin(d,SD.ell(x,y,z,[sd*.21,1.1,.42],[.12,.16,.18]),.1);}
 d=SD.smin(d,SD.ell(x,y,z,[0,.8,.05],[.24,.12,.5]),.15);
 d=SD.smin(d,SD.rc(x,y,z,[0,1.1,.55],[0,1.22,.82],.2,.15),.1);
 d=SD.smin(d,SD.ell(x,y,z,[0,1.2,.92],[.13,.15,.16]),.06);d=SD.smin(d,SD.rc(x,y,z,[0,1.17,.95],[0,1.02,1.13],.11,.085),.06);d=SD.smin(d,SD.ell(x,y,z,[0,1.0,1.14],[.09,.07,.07]),.04);
 for(const sd of[-1,1]){d=SD.smin(d,SD.ell(x,y,z,[sd*.17,1.25,.9],[.09,.035,.05]),.02);
  for(const zz of[.42,-.5]){const front=zz>0;const top=[sd*.17,.85,zz],kn=[sd*.16,.45,zz+(front?.02:-.06)],an=[sd*.16,.12,zz+(front?0:.02)];
   d=SD.smin(d,SD.rc(x,y,z,top,kn,front?.09:.11,.055),.06);d=SD.smin(d,SD.rc(x,y,z,kn,an,.05,.04),.02);d=SD.smin(d,SD.ell(x,y,z,kn,[.06,.06,.06]),.02);d=SD.smin(d,SD.rc(x,y,z,an,[an[0],.02,an[2]+.02],.045,.05),.015);}}
 d=SD.smin(d,SD.rc(x,y,z,[0,1.22,-.78],[0,.62,-.86],.035,.02),.04);d=SD.smin(d,SD.ell(x,y,z,[0,.58,-.86],[.05,.09,.05]),.02);
 d=SD.smin(d,SD.ell(x,y,z,[0,.72,-.3],[.12,.08,.1]),.06);return Math.max(d,-y);};}
function cow(P,c){c=c||[.55,.38,.24];const m=propMesh('cowD',cowSDF(),[-.5,-.02,-1.0],[.5,1.45,1.25],.022);
 draw(m,{P,c,pat:8,patS:1});const FX=Object.assign({},P,{noInk:1});draw(SPH,{P:FX,p:[0,.99,1.17],s:[.085,.06,.03],c:[.85,.66,.62]});
 for(const sd of[-1,1]){draw(SPH,{P:FX,p:[sd*.03,.99,1.2],s:[.012,.01,.006],c:[.25,.15,.15]});draw(CONE,{P,p:[sd*.11,1.31,.93],r:[.3,0,sd*-1.0],s:[.025,.17,.025],c:[.92,.88,.78]});
  draw(SPH,{P:FX,p:[sd*.105,1.21,1.03],s:[.022,.024,.016],c:[.06,.05,.05]});draw(SPH,{P:FX,p:[sd*.11,1.215,1.045],s:[.006,.006,.003],c:[1,1,1],u:1});}}
function hut(P,o){o=o||{};const wc=o.wall||[.78,.55,.36],rc=o.roof||[.72,.6,.32];draw(CYL,{P,p:[0,0,0],s:[1.5,1.6,1.5],c:wc,pat:6,patS:3});
 const roof=propMesh('hutroof',(x,y,z)=>{const r=Math.hypot(x,z);return Math.max((r/1.98)*1.62+y-1.62-.0,-(y+.05))+.025*vnoise3(x*9,y*9,z*9)-.01;},[-2.1,-.1,-2.1],[2.1,1.75,2.1],.04);
 draw(roof,{P,p:[0,1.5,0],c:rc,pat:4,patS:4});
 draw(BOX,{P,p:[0,.65,1.47],s:[.6,1.25,.08],c:[.25,.16,.1],pat:2,patS:6});if(o.light)draw(BOX,{P,p:[0,.65,1.5],s:[.45,1.1,.02],c:[1,.8,.4],u:1});}

// --- grass tufts: merged blades over an area (cached by key); hfn(x,z)->ground height
function grassField(key,hfn,x0,x1,z0,z1,n,seed){let m=PROP.get('grass'+key);if(!m){const P=[],N=[],I=[];const R=rngS(seed||3);
 for(let i=0;i<n;i++){const x=x0+R()*(x1-x0),z=z0+R()*(z1-z0),y=hfn(x,z);const nb=4+Math.floor(R()*4);
  for(let b=0;b<nb;b++){const a=R()*Math.PI*2,h=.12+R()*.16,w=.018+R()*.012,lean=.25+R()*.35;const cx=Math.cos(a),sz=Math.sin(a);
   const bx=x+cx*.03,bz=z+sz*.03;const tx=bx+cx*h*lean,tz=bz+sz*h*lean;const px=-sz*w,pz=cx*w;const k=P.length/3;
   P.push(bx-px,y,bz-pz,bx+px,y,bz+pz,tx,y+h,tz);const nn=norm([cx*.3,1,sz*.3]);N.push(...nn,...nn,...nn);I.push(k,k+1,k+2);}}
 m=mesh(P,N,I);PROP.set('grass'+key,m);}return m;}
function grass(key,hfn,x0,x1,z0,z1,n,c,seed){draw(grassField(key,hfn,x0,x1,z0,z1,n,seed),{c:c||[.42,.62,.3],noInk:1});}
// ===== reusable detailed structures & decorations (all sit on the ground: foundations go below) =====
// groundY(hfn,x,z,w,d): lowest terrain point under a footprint (use for anything wider than ~0.5 m)
const PRISM=(()=>{const P=[],N=[],I=[];const tri=[[-.5,0],[.5,0],[0,1]];for(const zz of[.5,-.5]){const b=P.length/3;tri.forEach(([x,y])=>{P.push(x,y,zz);N.push(0,0,Math.sign(zz));});I.push(b,b+1,b+2);}
 for(let i=0;i<3;i++){const a=tri[i],c=tri[(i+1)%3];const n=norm([c[1]-a[1],-(c[0]-a[0]),0]);const b=P.length/3;P.push(a[0],a[1],.5,c[0],c[1],.5,c[0],c[1],-.5,a[0],a[1],-.5);for(let k=0;k<4;k++)N.push(...n);I.push(b,b+1,b+2,b,b+2,b+3);}return mesh(P,N,I);})();
function groundY(hfn,x,z,w,d){if(!hfn)return 0;return Math.min(hfn(x-w/2,z-d/2),hfn(x+w/2,z-d/2),hfn(x-w/2,z+d/2),hfn(x+w/2,z+d/2),hfn(x,z));}
// house: P at ground centre facing +z. o:{w,d,h,wall,roof,trim,style:'plaster'|'brick'|'wood',door,floors,hfn,x,z}
function house(P,o){o=o||{};const w=o.w||4,d=o.d||5,h=o.h||(o.floors||1)*2.6+.4,wc=o.wall||[.86,.8,.68],rc=o.roof||[.36,.3,.3],tc=o.trim||[.94,.93,.89];
 const pat=o.style==='brick'?3:o.style==='wood'?2:6,ps=o.style==='brick'?2.2:o.style==='wood'?2.5:1.5;
 draw(BOX,{P,p:[0,-1+.2,0],s:[w+.16,2.4,d+.16],c:[.5,.48,.45],pat:6,patS:3});
 draw(BOX,{P,p:[0,.4+(h-.4)/2,0],s:[w,h-.4,d],c:wc,pat,patS:ps});
 const rh=Math.min(w,d)*.36;for(const sd of[-1,1])draw(BOX,{P,p:[sd*w/4-sd*.02,h+rh/2-.05,0],r:[0,0,sd*-Math.atan2(rh,w/2)],s:[Math.hypot(w/2,rh)+.38,.14,d+.5],c:rc,pat:4,patS:2.6});
 draw(BOX,{P,p:[0,h+rh-.04,0],s:[.22,.12,d+.52],c:mix3(rc,[0,0,0],.25)});
 for(const sd of[-1,1])draw(PRISM,{P,p:[0,h-.02,sd*(d/2-.02)],s:[w,rh,.06],c:wc,pat,patS:ps});
 draw(BOX,{P,p:[w*.28,h+rh*.6,-d*.15],s:[.42,1.1,.42],c:[.55,.3,.25],pat:3,patS:3});draw(BOX,{P,p:[w*.28,h+rh*.6+.58,-d*.15],s:[.5,.08,.5],c:[.4,.38,.36]});
 const fl=o.floors||1;for(let f=0;f<fl;f++)for(const xx of[-w*.3,w*.3]){if(f===0&&o.door!==false&&xx>0)continue;const y=1.5+f*2.6;
  draw(BOX,{P,p:[xx,y,d/2+.03],s:[.72,.98,.06],c:tc});draw(BOX,{P,p:[xx,y,d/2+.05],s:[.56,.82,.04],c:[.2,.26,.34],g:.9});draw(BOX,{P,p:[xx,y,d/2+.075],s:[.04,.82,.03],c:tc});draw(BOX,{P,p:[xx,y,d/2+.075],s:[.56,.04,.03],c:tc});draw(BOX,{P,p:[xx,y-.52,d/2+.1],s:[.8,.07,.14],c:tc});}
 if(o.door!==false){draw(BOX,{P,p:[w*.3,1.0,d/2+.03],s:[.95,1.75,.06],c:tc});draw(BOX,{P,p:[w*.3,.97,d/2+.06],s:[.78,1.62,.05],c:o.doorC||[.35,.2,.14],pat:2,patS:5});draw(SPH,{P,p:[w*.3+.28,.95,d/2+.1],s:[.035,.035,.035],c:[.85,.7,.3],g:.8});
  draw(BOX,{P,p:[w*.3,.3,d/2+.35],s:[1.1,.18,.6],c:[.55,.52,.48],pat:6,patS:3});}
 for(let f=0;f<fl;f++)for(const sd of[-1,1]){const y=1.5+f*2.6;draw(BOX,{P,p:[sd*(w/2+.03),y,0],s:[.06,.98,.72],c:tc});draw(BOX,{P,p:[sd*(w/2+.05),y,0],s:[.04,.82,.56],c:[.2,.26,.34],g:.9});}}
function fence(P,len,o){o=o||{};const c=o.c||[.82,.78,.7];const n=Math.max(2,Math.round(len/.32));for(let i=0;i<=n;i++){const x=-len/2+i*len/n;draw(BOX,{P,p:[x,.45,0],s:[.07,.9,.035],c,pat:2,patS:6});draw(CONE,{P,p:[x,.9,0],s:[.05,.08,.025],c});}
 for(const y of[.28,.68])draw(BOX,{P,p:[0,y,-.03],s:[len,.07,.03],c:mix3(c,[0,0,0],.1),pat:2,patS:4});}
function lamppost(P,on){draw(CYL,{P,p:[0,0,0],s:[.09,.25,.09],c:[.15,.16,.17],g:.5});draw(CYL,{P,p:[0,.25,0],s:[.045,2.7,.045],c:[.15,.16,.17],g:.5});draw(BOX,{P,p:[0,3.0,0],s:[.32,.4,.32],c:on?[1,.85,.5]:[.85,.88,.85],u:on?1:0,g:.6});draw(CONE,{P,p:[0,3.2,0],s:[.26,.22,.26],c:[.15,.16,.17],g:.5});draw(SPH,{P,p:[0,3.45,0],s:[.04,.04,.04],c:[.15,.16,.17]});}
function crate(P,c){const m=propMesh('crate',(x,y,z)=>{const q=[Math.abs(x)-.27,Math.abs(y-.3)-.27,Math.abs(z)-.27];const o2=Math.hypot(Math.max(q[0],0),Math.max(q[1],0),Math.max(q[2],0))+Math.min(Math.max(q[0],q[1],q[2]),0)-.02;return o2;},[-.36,-.06,-.36],[.36,.66,.36],.02);
 draw(m,{P,c:c||[.62,.47,.3],pat:2,patS:5});for(const sd of[-1,1])draw(BOX,{P,p:[0,.3,sd*.3],r:[0,0,.78],s:[.7,.06,.025],c:mix3(c||[.62,.47,.3],[0,0,0],.2)});}
function barrel(P,c){const m=propMesh('barrel',(x,y,z)=>{const r=.27+.045*Math.sin(Math.min(Math.max(y/.85,0),1)*Math.PI);return Math.max(Math.hypot(x,z)-r,Math.abs(y-.425)-.425);},[-.4,-.05,-.4],[.4,.9,.4],.02);
 draw(m,{P,c:c||[.55,.36,.2],pat:2,patS:7});for(const y of[.12,.32,.53,.73])draw(TUBE,{P,p:[0,y,0],s:[.29+.03*Math.sin(y/.85*Math.PI),.04,.29+.03*Math.sin(y/.85*Math.PI)],c:[.28,.27,.28],g:.6});}
function cart(P,c){c=c||[.55,.4,.25];draw(BOX,{P,p:[0,.75,0],s:[1.3,.1,2.1],c,pat:2,patS:4});for(const sd of[-1,1]){draw(BOX,{P,p:[sd*.63,.95,0],s:[.06,.35,2.1],c,pat:2,patS:4});draw(BOX,{P,p:[0,.95,sd*1.03],s:[1.3,.35,.06],c,pat:2,patS:4});}
 for(const sd of[-1,1])for(const zz of[-.6,.6]){const WP=cxf(P,xf([sd*.72,.42,zz],[0,0,Math.PI/2]));draw(TUBE,{P:WP,p:[0,-.04,0],s:[.42,.08,.42],c:[.35,.24,.15]});draw(CYL,{P:WP,p:[0,-.05,0],s:[.07,.1,.07],c:[.25,.2,.15]});for(let k=0;k<8;k++)draw(BOX,{P:WP,r:[0,k*Math.PI/8,0],s:[.03,.03,.8],c:[.4,.28,.18]});}
 for(const sd of[-1,1])draw(BOX,{P,p:[sd*.35,.7,1.9],r:[-.08,0,0],s:[.06,.06,1.8],c});}
function bush(P,k,c){const m=propMesh('bush',(x,y,z)=>{let d=1e9;for(let i=0;i<5;i++){const a=i*1.26;d=SD.smin(d,SD.sph(x,y,z,[Math.cos(a)*.28,.32+(i%2)*.12,Math.sin(a)*.28],.32),.12);}return Math.max(d+.08*vnoise3(x*6,y*6,z*6)+.04*vnoise3(x*14,y*14,z*14)-.04,-y);},[-.8,-.05,-.8],[.8,.95,.8],.03);draw(m,{P,s:[k||1,k||1,k||1],c:c||[.3,.52,.24],pat:1,patS:4});}
function bench(P){for(let i=0;i<3;i++)draw(BOX,{P,p:[0,.45,-.12+i*.13],s:[1.5,.04,.11],c:[.55,.38,.22],pat:2,patS:5});for(let i=0;i<2;i++)draw(BOX,{P,p:[0,.62+i*.14,-.24],r:[-.15,0,0],s:[1.5,.1,.04],c:[.55,.38,.22],pat:2,patS:5});
 for(const sd of[-1,1]){draw(BOX,{P,p:[sd*.65,.22,0],s:[.06,.44,.36],c:[.18,.18,.2]});draw(BOX,{P,p:[sd*.65,.55,-.25],r:[-.15,0,0],s:[.06,.5,.05],c:[.18,.18,.2]});}}
function signpost(P,txt){draw(CYL,{P,p:[0,0,0],s:[.05,1.9,.05],c:[.45,.32,.2],pat:2,patS:6});draw(BOX,{P,p:[.35,1.65,0],s:[.9,.3,.05],c:[.6,.45,.28],pat:2,patS:5});}
function road(x0,z0,x1,z1,w,hfn,c){const dx=x1-x0,dz=z1-z0,L=Math.hypot(dx,dz),n=Math.ceil(L/1.5);for(let i=0;i<n;i++){const t=(i+.5)/n;const x=x0+dx*t,z=z0+dz*t;draw(BOX,{p:[x,(hfn?hfn(x,z):0)+.02,z],r:[0,Math.atan2(dx,dz),0],s:[w,.05,L/n+.05],c:c||[.55,.47,.36],pat:7,patS:1.2,noShadow:1,noInk:1});}}
