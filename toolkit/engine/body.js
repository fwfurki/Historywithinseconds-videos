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
  // torso
  U(SD.ell(x,y,z,[0,1.275,-.005],F?[.15,.15,.1]:[.165,.155,.105]),0);
  U(SD.rc(x,y,z,[-sh+.04,1.395,-.01],[sh-.04,1.395,-.01],.065,.065),0,.05);
  U(SD.ell(x,y,z,[0,1.08,.008],F?[.13,.15,.092]:[.145,.15,.1]),0,.06);
  U(SD.ell(x,y,z,[0,.93,0],F?[.168,.11,.11]:[.152,.1,.104]),0,.05);
  if(F){for(const sd of[-1,1])U(SD.ell(x,y,z,[sd*.052,1.27,.062],[.055,.05,.045]),0,.03);}
  // neck + head
  U(SD.rc(x,y,z,[0,1.37,-.008],[0,1.54,0],.053*(F?.92:1),.047*(F?.92:1)),1,.03);
  const hk=F?.96:1;U(SD.ell(x,y,z,[0,1.625,.004],[.088*hk,.11*hk,.1*hk]),1,.02);
  U(SD.ell(x,y,z,[0,1.572,.028],[.066*hk,.058*hk,.072*hk]),1,.03);
  U(SD.ell(x,y,z,[0,1.536,.058],[.028,.02,.024]),1,.02);
  for(const sd of[-1,1]){U(SD.ell(x,y,z,[sd*.046,1.6,.064],[.03,.022,.026]),1,.02);U(SD.ell(x,y,z,[sd*.09*hk,1.612,-.002],[.014,.03,.02]),1,.008);}
  U(SD.ell(x,y,z,[0,1.657,.07],[.068*hk,.018,.03]),1,.02);
  U(SD.rc(x,y,z,[0,1.632,.09],[0,1.59,.113],.009,.014),1,.012);U(SD.ell(x,y,z,[0,1.589,.103],[.02,.012,.016]),1,.008);
  for(const sd of[-1,1]){const d=SD.sph(x,y,z,[sd*.034,1.632,.094],.019);best=SD.smax(best,-d,.008);}
  // hair
  if(hs!=='bald'){const hd=Math.max(SD.ell(x,y,z,[0,1.649,-.012],[.096*hk,.106*hk,.108*hk]),(1.69-1.25*Math.max(0,.02-z))-y);U(hd,6,.006);
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
 const HB=boneXF(PP,BN,3);const FX=Object.assign({},HB,{noInk:1,noShadow:1});const ec=o.eyes||[.32,.2,.12];const blink=((tt*.37+(o.seed||0)*.13)%1)<.025?1:0;
 for(const sd of[-1,1]){const ex=sd*.034;draw(SPH,{P:FX,p:[ex,1.632,.086],s:[.0165,.0165,.0165],c:[.97,.96,.94]});
  if(!blink){draw(SPH,{P:FX,p:[ex,1.632,.0985],s:[.0085,.0085,.005],c:ec});draw(SPH,{P:FX,p:[ex,1.632,.1025],s:[.0045,.0045,.0025],c:[.03,.02,.02]});draw(SPH,{P:FX,p:[ex+.003,1.6355,.1045],s:[.0018,.0018,.001],c:[1,1,1],u:1});}
  draw(SPH,{P:FX,p:[ex,1.6405+(blink?-.007:0),.0895],r:[blink?.6:-.25,0,0],s:[.0185,.0095,.0165],c:mix3(sk,[0,0,0],.08)});
  draw(SPH,{P:FX,p:[sd*.037,1.6565,.1005],r:[0,0,sd*(o.worry?-.3:.12)],s:[.021,.0042,.006],c:mix3(hc,[0,0,0],.25)});}
 if(o.mouthO)draw(SPH,{P:FX,p:[0,1.566,.098],s:[.011,.009,.005],c:[.3,.1,.1]});
 const HH=Object.assign({},HB,{id:nextId()});
 if(o.beard)draw(SPH,{P:HH,p:[0,1.55,.05],s:[.07,.05,.06],c:hc});
 if(o.moustache)draw(SPH,{P:Object.assign({},HB,{noShadow:1}),p:[0,1.578,.1],s:[.027,.007,.011],c:hc});
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
function treeCanopy(seed){return(x,y,z)=>{let d=1e9;for(let i=0;i<7;i++){const a=i*2.4+seed,r=.35+.25*((i*37+seed*13)%7)/7;const c=[Math.cos(a)*r*.9,1.9+((i*53)%5)/5*.7,Math.sin(a)*r*.9];d=SD.smin(d,SD.sph(x,y,z,c,.55+((i*17)%5)/18),.35);}
 d=SD.smin(d,SD.sph(x,y,z,[0,2.35,0],.6),.3);return d+.06*vnoise3(x*5+seed,y*5,z*5)-.03;};}
function tree(P,k,c){k=k||1;const v=Math.abs(Math.round((P.M[12]*7.3+P.M[14]*3.1)))%3;const tc=c||[.32,.58,.26];
 const trunk=propMesh('trunk',(x,y,z)=>{let d=SD.rc(x,y,z,[0,0,0],[0,1.9,0],.14,.07);d=SD.smin(d,SD.rc(x,y,z,[0,1.2,0],[.35,1.75,.1],.06,.035),.05);d=SD.smin(d,SD.rc(x,y,z,[0,1.4,0],[-.3,1.9,-.15],.05,.03),.05);return Math.max(d,-y);},[-.5,-.01,-.4],[.6,2.1,.4],.03);
 draw(trunk,{P,s:[k,k,k],c:[.42,.28,.16]});const cm=propMesh('canopy'+v,treeCanopy(v*1.7),[-1.4,1.1,-1.4],[1.4,3.1,1.4],.05);draw(cm,{P,s:[k,k,k],c:tc,pat:1,patS:2.5});}
function rock(P,k,c,seed){seed=seed||0;const m=propMesh('rock'+(seed%3),(x,y,z)=>SD.ell(x,y,z,[0,.3,0],[.6,.4,.5])+.12*vnoise3(x*3+seed,y*3,z*3)+.05*vnoise3(x*8,y*8+seed,z*8)-.06,[-.9,-.2,-.8],[.9,.9,.8],.035);draw(m,{P,s:[k||1,k||1,k||1],c:c||[.55,.52,.48],pat:6,patS:2});}
function cow(P,c){c=c||[.55,.38,.24];const m=propMesh('cow',(x,y,z)=>{let d=SD.ell(x,y,z,[0,.98,0],[.36,.38,.78]);d=SD.smin(d,SD.ell(x,y,z,[0,1.12,.72],[.17,.2,.22]),.12);d=SD.smin(d,SD.ell(x,y,z,[0,1.02,.98],[.14,.13,.16]),.08);
  for(const[a,b]of[[.2,.5],[-.2,.5],[.2,-.5],[-.2,-.5]])d=SD.smin(d,SD.rc(x,y,z,[a,.85,b],[a*.95,.02,b],.08,.05),.06);d=SD.smin(d,SD.rc(x,y,z,[0,1.2,-.7],[0,.75,-.85],.03,.02),.03);return d;},[-.5,-.02,-1.0],[.5,1.45,1.2],.03);
 draw(m,{P,c});draw(SPH,{P,p:[0,.99,1.12],s:[.12,.1,.06],c:[.85,.7,.65]});for(const sd of[-1,1]){draw(CONE,{P,p:[sd*.13,1.27,.82],r:[0,0,sd*-1.1],s:[.03,.2,.03],c:[.92,.9,.82]});draw(SPH,{P:Object.assign({},P,{noInk:1}),p:[sd*.1,1.12,1.0],s:[.025,.025,.02],c:[.05,.05,.05]});}
 draw(SPH,{P,p:[-.2,1.15,-.1],s:[.2,.15,.3],c:[.95,.93,.9]});}
function hut(P,o){o=o||{};const wc=o.wall||[.78,.55,.36],rc=o.roof||[.72,.6,.32];draw(CYL,{P,p:[0,0,0],s:[1.5,1.6,1.5],c:wc,pat:6,patS:3});
 const roof=propMesh('hutroof',(x,y,z)=>{const r=Math.hypot(x,z);return Math.max((r/1.98)*1.62+y-1.62-.0,-(y+.05))+.025*vnoise3(x*9,y*9,z*9)-.01;},[-2.1,-.1,-2.1],[2.1,1.75,2.1],.04);
 draw(roof,{P,p:[0,1.5,0],c:rc,pat:4,patS:4});
 draw(BOX,{P,p:[0,.65,1.47],s:[.6,1.25,.08],c:[.25,.16,.1],pat:2,patS:6});if(o.light)draw(BOX,{P,p:[0,.65,1.5],s:[.45,1.1,.02],c:[1,.8,.4],u:1});}
