// HistoryWithinSeconds engine v2 — WebGL2, native 1080x1920, cel/toon shading,
// screen-space black ink outlines (depth + normal + object-id edges), GOLD subject
// highlight with halo + scene desaturation, textured quads, transparent pass.
const W=1080,H=1920;
const gl=document.getElementById('gl').getContext('webgl2',{antialias:false,preserveDrawingBuffer:true});
const out=document.getElementById('out'),cx=out.getContext('2d',{willReadFrequently:true});
// ---------- math ----------
function mul(a,b){const o=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s;}return o;}
function persp(f,a,n,fa){const t=1/Math.tan(f/2);return new Float32Array([t/a,0,0,0,0,t,0,0,0,0,(fa+n)/(n-fa),-1,0,0,2*fa*n/(n-fa),0]);}
function sub(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]}function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function norm(a){const l=Math.hypot(...a)||1;return[a[0]/l,a[1]/l,a[2]/l]}
function lookAt(e,c,u){const z=norm(sub(e,c)),x=norm(cross(u,z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*e[0]+x[1]*e[1]+x[2]*e[2]),-(y[0]*e[0]+y[1]*e[1]+y[2]*e[2]),-(z[0]*e[0]+z[1]*e[1]+z[2]*e[2]),1]);}
function rot(r){const[a,b,c]=r;const cx_=Math.cos(a),sx=Math.sin(a),cy=Math.cos(b),sy=Math.sin(b),cz=Math.cos(c),sz=Math.sin(c);
 const Rx=[1,0,0,0,0,cx_,sx,0,0,-sx,cx_,0,0,0,0,1],Ry=[cy,0,-sy,0,0,1,0,0,sy,0,cy,0,0,0,0,1],Rz=[cz,sz,0,0,-sz,cz,0,0,0,0,1,0,0,0,0,1];return mul(mul(Ry,Rx),Rz);}
let seed=7;function rnd(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
const ss=(a,b,x)=>{x=Math.min(Math.max((x-a)/(b-a),0),1);return x*x*(3-2*x)};const lerp=(a,b,t)=>a+(b-a)*t;const mix3=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const clamp=(x,a,b)=>Math.min(Math.max(x,a),b);const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
// ---------- v3: render scale (supersampling), shadows, SSAO, sky ----------
const RS=(typeof RENDER_SCALE!=='undefined')?RENDER_SCALE:1.5;const RW=Math.round(W*RS),RH=Math.round(H*RS);const SMS=2048;
let TIME=0,SHPASS=false,SH_ON=0,LVP=new Float32Array(16);
function ortho(l,r,b,t,n,f){return new Float32Array([2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(f-n),0,-(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1]);}
function inv4(m){const a=m,o=new Float32Array(16);const b00=a[0]*a[5]-a[1]*a[4],b01=a[0]*a[6]-a[2]*a[4],b02=a[0]*a[7]-a[3]*a[4],b03=a[1]*a[6]-a[2]*a[5],b04=a[1]*a[7]-a[3]*a[5],b05=a[2]*a[7]-a[3]*a[6],b06=a[8]*a[13]-a[9]*a[12],b07=a[8]*a[14]-a[10]*a[12],b08=a[8]*a[15]-a[11]*a[12],b09=a[9]*a[14]-a[10]*a[13],b10=a[9]*a[15]-a[11]*a[13],b11=a[10]*a[15]-a[11]*a[14];
 let d=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;d=1/d;
 o[0]=(a[5]*b11-a[6]*b10+a[7]*b09)*d;o[1]=(a[2]*b10-a[1]*b11-a[3]*b09)*d;o[2]=(a[13]*b05-a[14]*b04+a[15]*b03)*d;o[3]=(a[10]*b04-a[9]*b05-a[11]*b03)*d;o[4]=(a[6]*b08-a[4]*b11-a[7]*b07)*d;o[5]=(a[0]*b11-a[2]*b08+a[3]*b07)*d;o[6]=(a[14]*b02-a[12]*b05-a[15]*b01)*d;o[7]=(a[8]*b05-a[10]*b02+a[11]*b01)*d;
 o[8]=(a[4]*b10-a[5]*b08+a[7]*b06)*d;o[9]=(a[1]*b08-a[0]*b10-a[3]*b06)*d;o[10]=(a[12]*b04-a[13]*b02+a[15]*b00)*d;o[11]=(a[9]*b02-a[8]*b04-a[11]*b00)*d;o[12]=(a[5]*b07-a[4]*b09-a[6]*b06)*d;o[13]=(a[0]*b09-a[1]*b07+a[2]*b06)*d;o[14]=(a[13]*b01-a[12]*b03-a[14]*b00)*d;o[15]=(a[8]*b03-a[9]*b01+a[10]*b00)*d;return o;}
// ---------- shaders ----------
const vsT=`in vec3 p;in vec3 n;uniform mat4 M,R,VP;uniform vec3 iS;out vec3 vN,vW,vO;
#if SKIN
in vec4 bi;in vec4 bw;in float pt;in float hm;uniform mat4 BN[16];flat out float vP;out float vH;
#endif
void main(){vec3 pp=p,nn=n;
#if SKIN
 mat4 S=BN[int(bi.x)]*bw.x+BN[int(bi.y)]*bw.y+BN[int(bi.z)]*bw.z;pp=(S*vec4(p,1.)).xyz;nn=mat3(S)*n;vP=pt;vH=hm;
#endif
 vec4 w=M*vec4(pp,1.);vW=w.xyz;vO=p;vN=(R*vec4(nn*iS,0.)).xyz;gl_Position=VP*w;}`;
const vs='#version 300 es\n#define SKIN 0\n'+vsT;
const fsT=`precision highp float;in vec3 vN,vW,vO;uniform vec3 col,emi,cam,sunD,sunC,sky,gnd,fogC,plP,plC;uniform float gloss,fogD,plR,gold,alpha,unlit,oid,pulse,patS,time,useSh,toon;uniform vec4 clipP;
#if SKIN
flat in float vP;in float vH;uniform vec3 mc[8];uniform vec4 mp;
#endif
uniform sampler2D tex;uniform highp sampler2DShadow sm;uniform mat4 LVP;
layout(location=0) out vec4 o0;layout(location=1) out vec4 o1;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return .55*vn(p)+.3*vn(p*2.1)+.15*vn(p*4.3);}
void main(){
#if DISC
 if(dot(vec4(vW,1.),clipP)>0.)discard;
#endif
 vec3 N=normalize(vN);vec3 V=normalize(cam-vW);if(dot(N,V)<-.05)N=-N;vec3 base=col;
#if SKIN
 {int pt=int(vP+.5);vec3 q=vO;bool dress=mp.y>.5;
  vec3 cloth=dress?mc[7]:mc[1];
  if(pt==2||pt==3){float t=length(q-vec3(sign(q.x)*.19,1.41,0.));float sl=abs(mp.x);base=t<sl?((mp.x<0.&&t>.3)?mc[2]:cloth):mc[0];if(t<sl&&t>sl-.022)base*=.82;}
  else if(pt==7){base=mc[7];}
  else{ // torso, head/neck, legs, feet: position based (smooth boundaries)
   float coll=1.395+.03*smoothstep(.0,-.08,q.z);float nr=length(vec2(q.x,q.z*1.15));
   if(q.y>1.47||(q.y>1.37&&nr<.068-max(0.,1.41-q.y)*.3)){base=mc[0];float lip=smoothstep(.022,.015,abs(q.x))*smoothstep(.009,.003,abs(q.y-1.566))*step(.06,q.z);base=mix(base,mix(mc[0],vec3(.6,.3,.28),.38),lip);}
   else if(dress&&q.y>.12){base=mc[7];}
   else if(q.y<.105){base=mc[4];}
   else{base=q.y<.905?(dress?mc[0]*.97:mc[3]):cloth;
    if(!dress&&mp.w<.25&&q.y>=.905&&q.y<.955)base=vec3(.16,.11,.08);
    {float hem=mp.w>.75?.52:.79;if(mp.w>.25&&q.y>hem&&q.y<.96){base=mc[1];if(q.y<hem+.018)base*=.78;if(q.z>.06&&abs(q.x)<.012+(.96-q.y)*.25&&q.y<.93)base=mix(mc[3],mc[1],.15);}}
    if(mp.z>.5&&q.z>0.&&q.y>1.16&&q.y<coll&&abs(q.x)<(q.y-1.16)*.3+.008){base=mc[2];float tw=.009+.006*smoothstep(1.36,1.39,q.y);if(abs(q.x)<tw&&q.y<1.395&&q.y>1.18)base=mc[6]*(1.-.15*step(1.37,q.y));}
    if(mp.z>.5&&q.z>0.&&q.y>1.33&&q.y<1.4&&abs(q.x)>.012&&abs(q.x)<.06&&(q.y-1.33)>(abs(q.x)-.012)*.9)base=mc[2]*.97;
    if(mp.z>.5&&q.z>0.&&q.y>1.16&&q.y<coll){float ed=abs(abs(q.x)-((q.y-1.16)*.3+.008));base=mix(base,mc[1]*.75,smoothstep(.008,.0,ed)*.8);}
    if(mp.w<.75&&mp.z>.5&&q.z>.05&&q.y<1.1&&q.y>.97){float bt=smoothstep(.009,.004,length(vec2(q.x-.01,mod(q.y-.97,.065)-.032)));base=mix(base,vec3(.85,.75,.45),bt);}}}
  base=mix(base,mc[5],smoothstep(.35,.65,vH));}
#endif
#if TEX==1
 {vec4 tx=texture(tex,vec2(vO.x+.5,.5-vO.y));base=mix(base,tx.rgb,tx.a);}
#elif TEX==3
 {vec4 tx=texture(tex,vec2(vO.x+.5,.5-vO.y));if(tx.a<.5)discard;base=tx.rgb;}
#elif TEX==2
 {vec3 q=normalize(vO);float lo=atan(q.z,-q.x);float la=asin(clamp(q.y,-1.,1.));vec4 tx=texture(tex,vec2(lo/6.2831853+.5,.5-la/3.1415926));base=tx.rgb;}
#endif
 float wfres=0.;
#if PAT>0
 {vec3 an=abs(N);vec2 uv=an.y>max(an.x,an.z)?vW.xz:(an.x>an.z?vW.zy:vW.xy);uv*=patS;
#if PAT==1
  base*=.74+.3*fbm(uv*.28)+.1*vn(uv*2.6)+.08*vn(uv*11.)+.06*vn(uv*37.);base=mix(base,base*vec3(.9,1.0,.78),smoothstep(.55,.85,fbm(uv*.09+3.))*.5);base=mix(base,base*vec3(1.05,.98,.8),smoothstep(.6,.9,vn(uv*.5))*.25);
#elif PAT==2
  float pl=floor(uv.y*2.2);float g=sin(uv.x*9.+vn(vec2(uv.x*.7,pl*3.1))*6.);base*=.86+.06*g+.1*h21(vec2(pl,3.));base*=1.-.35*step(fract(uv.y*2.2),.06);
#elif PAT==3
  float r=floor(uv.y*3.6);float u2=uv.x*1.8+.5*mod(r,2.);float m=max(step(fract(uv.y*3.6),.09),step(fract(u2),.05));base=mix(base*(.88+.2*h21(vec2(floor(u2),r))),vec3(.82,.79,.72),m*.85);
#elif PAT==4
  float r=uv.y*4.;float sc=fract(r+.15*sin(uv.x*7.));base*=.78+.26*sc;base*=1.-.3*step(.93,sc);
#elif PAT==5
  {vec2 p2=vW.xz;float hx=0.,hz=0.;vec2 D[5]=vec2[](vec2(1.,.3),vec2(-.4,1.),vec2(.7,-.8),vec2(-1.,-.2),vec2(.2,.9));float F[5]=float[](.9,1.4,2.3,3.7,5.9);float A[5]=float[](.05,.035,.022,.012,.007);
   for(int i=0;i<5;i++){vec2 d=normalize(D[i]);float ph=dot(d,p2)*F[i]+time*(1.1+.35*float(i));float c2=cos(ph)*A[i]*F[i];hx+=d.x*c2;hz+=d.y*c2;}
   float nz=vn(p2*2.5+time*.3)-.5;hx+=nz*.08;hz+=(vn(p2*2.5-time*.27+7.)-.5)*.08;
   N=normalize(vec3(-hx*1.6,1.,-hz*1.6));base*=.82+.1*vn(p2*.15);
   float crest=smoothstep(.88,.97,vn(p2*1.3+vec2(time*.15,0.))*vn(p2*3.1-time*.2));base=mix(base,vec3(.9,.95,.98),crest*.35);wfres=1.;}
#elif PAT==6
  base*=.9+.16*fbm(uv*1.5);
#elif PAT==8
  {vec2 o2=vO.xz*2.2+vO.y*1.3;float sp=smoothstep(.56,.6,fbm(o2+vec2(3.1,1.7)));base=mix(base,vec3(.93,.91,.87),sp);base=mix(base,vec3(.12,.1,.09),smoothstep(.07,.05,vO.y));}
#else
  base*=.82+.3*fbm(uv*.8);base=mix(base,base*.8,step(.8,vn(uv*6.)));
#endif
 }
#endif
 vec3 c;
#if UNLIT
 c=base;
#else
 float shd=0.;
#if SHADOW
 {vec4 q=LVP*vec4(vW+N*.06,1.);vec3 s=q.xyz/q.w*.5+.5;if(s.x>0.&&s.x<1.&&s.y>0.&&s.y<1.&&s.z<1.){float t=1.6/2048.;shd=1.-.25*(texture(sm,vec3(s.xy+vec2(-t,-t),s.z-.0015))+texture(sm,vec3(s.xy+vec2(t,-t),s.z-.0015))+texture(sm,vec3(s.xy+vec2(-t,t),s.z-.0015))+texture(sm,vec3(s.xy+vec2(t,t),s.z-.0015)));}}
#endif
 float d=dot(N,sunD);float lt=smoothstep(-.06,.06,d)*.62+smoothstep(.5,.58,d)*.22;float ls=pow(clamp((d+.2)/1.2,0.,1.),1.3)*.86;float lit=mix(ls,lt,toon)*(1.-.75*shd);
 vec3 amb=mix(gnd,sky,N.y*.5+.5);
 vec3 L=plP-vW;float dl=length(L);L/=dl;float at=max(1.-dl/plR,0.);at=smoothstep(0.,.35,at)*at;float pd=mix(clamp(dot(N,L)*.8+.2,0.,1.),smoothstep(-.05,.1,dot(N,L)),toon);
 vec3 Hh=normalize(sunD+V);float sp=mix(pow(max(dot(N,Hh),0.),24.)*.6,smoothstep(.93,.96,dot(N,Hh))*.5,toon)*gloss*(1.-shd);
 c=base*(amb+sunC*lit+plC*pd*at)+sunC*sp;
 float rim=smoothstep(.62,.75,1.-max(dot(N,V),0.))*smoothstep(-.2,.3,d)*.18*(1.-shd);c+=rim*sunC;
#if PAT==5
 {vec3 rf=reflect(-V,N);float fr=.04+.96*pow(1.-max(dot(N,V),0.),5.);vec3 rc=mix(fogC*1.02,sky*1.12+vec3(.03,.05,.08),smoothstep(-.05,.45,rf.y));c=mix(c,rc,clamp(fr*1.15,0.,.85));
  float gl=pow(max(dot(rf,sunD),0.),160.)*2.2+pow(max(dot(rf,sunD),0.),28.)*.18;c+=sunC*gl*(1.-shd);}
#endif
#endif
 c+=emi;
#if GOLD
 {float r=pow(1.-max(dot(N,V),0.),2.2);c=mix(c,c*vec3(1.15,1.0,.75),.35*gold)+vec3(1.,.71,.18)*(r*1.1+.12+.12*pulse)*gold;}
#endif
 float f=1.-exp(-pow(length(cam-vW)*fogD,1.4));c=mix(c,fogC,f);
 o0=vec4(c,alpha);
 o1=vec4(N.xy*.5+.5,gold>0.?1.:0.,oid);}`;
function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(o);return o;}
function prog(v,f){const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,v));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.bindAttribLocation(p,0,'p');gl.bindAttribLocation(p,1,'n');gl.bindAttribLocation(p,2,'bi');gl.bindAttribLocation(p,3,'bw');gl.bindAttribLocation(p,4,'pt');gl.bindAttribLocation(p,5,'hm');gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw gl.getProgramInfoLog(p);return p;}
const UNAMES=['M','R','VP','iS','col','emi','cam','sunD','sunC','sky','gnd','fogC','plP','plC','gloss','fogD','plR','gold','alpha','unlit','oid','pulse','tex','clipP','patS','time','useSh','sm','LVP','toon','BN','mc','mp'];
const PCACHE=new Map();let ENVV=0,ENVU=null;let pr=null,U=null;
function getP(k){let e=PCACHE.get(k);if(!e){const[pat,tx,disc,shd,unl,gd,sk]=k.split('_').map(Number);const hd='#version 300 es\n#define SKIN '+(sk||0)+'\n';const src=hd+'#define PAT '+pat+'\n#define TEX '+tx+'\n#define DISC '+disc+'\n#define SHADOW '+shd+'\n#define UNLIT '+unl+'\n#define GOLD '+gd+'\n'+fsT;
 const p=prog(hd+vsT,src);const u={};UNAMES.forEach(n=>u[n]=gl.getUniformLocation(p,n));e={p,u,v:-1};PCACHE.set(k,e);}return e;}
function useK(k){const e=getP(k);if(pr!==e.p){pr=e.p;U=e.u;gl.useProgram(pr);}if(e.v!==ENVV){e.v=ENVV;applyEnvU();}}
function applyEnvU(){const E=ENVU;if(!E)return;gl.uniform1i(U.tex,3);gl.uniform1i(U.sm,4);gl.uniform1f(U.useSh,SH_ON);gl.uniformMatrix4fv(U.LVP,false,LVP);gl.uniform1f(U.time,TIME);gl.uniformMatrix4fv(U.VP,false,E.VP);gl.uniform3fv(U.cam,E.e);
 gl.uniform3fv(U.sunD,E.sunD);gl.uniform3fv(U.sunC,E.sunC);gl.uniform3fv(U.sky,E.sky);gl.uniform3fv(U.gnd,E.gnd);gl.uniform3fv(U.fogC,E.fog);gl.uniform1f(U.fogD,E.fogD);gl.uniform3fv(U.plP,E.plP);gl.uniform3fv(U.plC,E.plC);gl.uniform1f(U.plR,E.plR);gl.uniform1f(U.pulse,PULSE);gl.uniform1f(U.toon,E.toon);}
// shadow depth program
const svsT=`in vec3 p;uniform mat4 M,LVP;out vec3 vW;
#if SKIN
in vec4 bi;in vec4 bw;uniform mat4 BN[16];
#endif
void main(){vec3 pp=p;
#if SKIN
 mat4 S=BN[int(bi.x)]*bw.x+BN[int(bi.y)]*bw.y+BN[int(bi.z)]*bw.z;pp=(S*vec4(p,1.)).xyz;
#endif
 vec4 w=M*vec4(pp,1.);vW=w.xyz;gl_Position=LVP*w;}`;const svs='#version 300 es\n#define SKIN 0\n'+svsT;
const sfs=`#version 300 es
precision highp float;in vec3 vW;uniform vec4 clipP;void main(){if(dot(vec4(vW,1.),clipP)>0.)discard;}`;
const spr=prog(svs,sfs);const SU={M:gl.getUniformLocation(spr,'M'),LVP:gl.getUniformLocation(spr,'LVP'),clipP:gl.getUniformLocation(spr,'clipP')};
const sprS=prog('#version 300 es\n#define SKIN 1\n'+svsT,sfs);const SUS={M:gl.getUniformLocation(sprS,'M'),LVP:gl.getUniformLocation(sprS,'LVP'),clipP:gl.getUniformLocation(sprS,'clipP'),BN:gl.getUniformLocation(sprS,'BN')};
// post: ink outlines + SSAO + sky/clouds + gold halo + desaturation (hi-res), then downsample
const pvs=`#version 300 es
in vec3 p;out vec2 uv;void main(){uv=p.xy*.5+.5;gl_Position=vec4(p.xy,0.,1.);}`;
const pfsT=`precision highp float;in vec2 uv;uniform sampler2D cT,aT,dT,skT;uniform vec2 px;uniform float desat,ink,glow,near,far,inkFar,rs,focal,aoAmt,dofF,dofR;out vec4 o;
float ld(vec2 q){float z=texture(dT,q).r*2.-1.;return 2.*near*far/(far+near-z*(far-near));}
void main(){vec3 c=texture(cT,uv).rgb;vec4 a=texture(aT,uv);float zr=texture(dT,uv).r;float d0=ld(uv);float bgm=step(.99999,zr);
 vec2 o8[8]=vec2[](vec2(1,0),vec2(-1,0),vec2(0,1),vec2(0,-1),vec2(.7,.7),vec2(-.7,.7),vec2(.7,-.7),vec2(-.7,-.7));
#if DOF
 {float coc=clamp(abs(d0-dofF)/dofR-.15,0.,1.)*(1.-.0*bgm);float rr=coc*7.*rs;vec3 acc=c;float wsum=1.;for(int i=0;i<8;i++){for(int j=1;j<=2;j++){vec2 q=uv+o8[i]*px*rr*float(j)*.5;float dq=ld(q);float cq=clamp(abs(dq-dofF)/dofR-.15,0.,1.);float wq=dq<d0?cq:1.;acc+=texture(cT,q).rgb*wq;wsum+=wq;}}c=acc/wsum;}
#endif
#if SKY
 c=mix(c,texture(skT,uv).rgb,bgm);
#endif
 float e=0.;float wpx=1.6*ink*rs;
 for(int i=0;i<8;i++){vec2 q=uv+o8[i]*px*wpx;vec4 b=texture(aT,q);float d1=ld(q);
  float dz=abs(d1-d0)/min(d0,d1);float ez=smoothstep(.035,.09,dz);
  float en=smoothstep(.62,.9,length(b.xy-a.xy));float ei=abs(b.w-a.w)>.002?1.:0.;
  e=max(e,max(ez,max(en,ei)));}
 float fade=1.-smoothstep(inkFar*.45,inkFar,d0);e*=fade;
#if AO
 {float rp=clamp(.45*focal/d0,3.*rs,46.*rs);float oc=0.;for(int i=0;i<8;i++){vec2 q=uv+o8[i]*px*rp*(i<4?1.:.6);float d1=ld(q);float dd=d0-d1;oc+=smoothstep(.02*d0,.06*d0,dd)*(1.-smoothstep(.6,1.6,dd));}
  c*=1.-aoAmt*(1.-bgm)*oc/8.;}
#endif
 float g=a.z;
#if GLOW
 {float hal=0.;for(int r=1;r<=3;r++){float rr=float(r)*9.*rs;for(int i=0;i<8;i++){hal+=texture(aT,uv+o8[i]*px*rr).z;}}hal/=24.;c+=vec3(1.,.71,.18)*hal*(1.-g)*glow*.9;}
#endif
 float L=dot(c,vec3(.299,.587,.114));vec3 dc=mix(c,vec3(L)*vec3(1.02,1.,.96),desat*(1.-g));
 dc=mix(dc,vec3(.07,.055,.06),e*.8);
 o=vec4(dc,1.);}`;
const PPN=['cT','aT','dT','skT','px','desat','ink','glow','near','far','inkFar','rs','focal','aoAmt','dofF','dofR'];const PPC=new Map();
function getPP(k){let e=PPC.get(k);if(!e){const[sk,ao,gw,df]=k.split('_').map(Number);const p=prog(pvs,'#version 300 es\n#define SKY '+sk+'\n#define AO '+ao+'\n#define GLOW '+gw+'\n#define DOF '+(df||0)+'\n'+pfsT);const u={};PPN.forEach(n=>u[n]=gl.getUniformLocation(p,n));e={p,u};PPC.set(k,e);}return e;}
// low-res sky (gradient + cel clouds)
const skfs=`#version 300 es
precision highp float;in vec2 uv;uniform float clouds,time;uniform vec3 fogC,skyTop,cloudC,camP,sunD;uniform mat4 iVP;out vec4 o;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return .5*vn(p)+.28*vn(p*2.03)+.14*vn(p*4.01)+.08*vn(p*8.1);}
void main(){vec4 w=iVP*vec4(uv*2.-1.,1.,1.);vec3 rd=normalize(w.xyz/w.w-camP);float el=rd.y;
 vec3 sk=mix(fogC,skyTop,smoothstep(-.02,.45,el));float sg=pow(max(dot(rd,normalize(sunD)),0.),24.);sk+=vec3(1.,.9,.7)*sg*.25;
 vec2 cp=rd.xz/(max(el,0.)+.06)*1.6+vec2(time*.02,0.);float n=fbm(cp*.55)+.12*vn(cp*3.1);float th=.8-clouds*.26;float k=smoothstep(th,th+.14,n);float n2=fbm(cp*.55+normalize(sunD.xz)*.18);
 vec3 cc=mix(cloudC*.8,cloudC*1.04,clamp((n-n2)*4.+.6,0.,1.));float fadeH=smoothstep(.02,.22,el)*step(.001,clouds);sk=mix(sk,cc,k*fadeH*.95);o=vec4(sk,1.);}`;
const skp=prog(pvs,skfs);const SKU={};['clouds','time','fogC','skyTop','cloudC','camP','sunD','iVP'].forEach(k=>SKU[k]=gl.getUniformLocation(skp,k));
const SKW=Math.round(W/2),SKH=Math.round(H/2);
const dfs=`#version 300 es
precision highp float;in vec2 uv;uniform sampler2D pT;uniform vec2 opx;out vec4 o;void main(){vec2 d=opx*.375;o=vec4((texture(pT,uv+vec2(-d.x,-d.y)).rgb+texture(pT,uv+vec2(d.x,-d.y)).rgb+texture(pT,uv+vec2(-d.x,d.y)).rgb+texture(pT,uv+vec2(d.x,d.y)).rgb)*.25,1.);}`;
const dp=prog(pvs,dfs);const DU={pT:gl.getUniformLocation(dp,'pT'),opx:gl.getUniformLocation(dp,'opx')};
const quadB=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quadB);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),gl.STATIC_DRAW);
// FBOs
function mkTex(ifmt,fmt,type,w,h,lin){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,ifmt,w||RW,h||RH,0,fmt,type,null);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,lin?gl.LINEAR:gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,lin?gl.LINEAR:gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
const cTex=mkTex(gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,0,0,1),aTex=mkTex(gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE),dTex=mkTex(gl.DEPTH_COMPONENT24,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT);
const fbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,cTex,0);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT1,gl.TEXTURE_2D,aTex,0);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,dTex,0);
gl.drawBuffers([gl.COLOR_ATTACHMENT0,gl.COLOR_ATTACHMENT1]);
const pTex=mkTex(gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,0,0,1);const pfbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,pfbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,pTex,0);
const skTex=mkTex(gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,SKW,SKH,1);const skfbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,skfbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,skTex,0);
const smTex=mkTex(gl.DEPTH_COMPONENT24,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,SMS,SMS,1);gl.bindTexture(gl.TEXTURE_2D,smTex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_MODE,gl.COMPARE_REF_TO_TEXTURE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_FUNC,gl.LEQUAL);
const sfbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,sfbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,smTex,0);gl.drawBuffers([gl.NONE]);gl.readBuffer(gl.NONE);
gl.bindFramebuffer(gl.FRAMEBUFFER,null);
// user texture unit 3
const uTex=gl.createTexture();function setTex(src){gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,uTex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,src);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.activeTexture(gl.TEXTURE0);}
const texCache=new Map();function useTex(key,src){let t=texCache.get(key);if(!t){t=gl.createTexture();texCache.set(key,t);gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,src);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.activeTexture(gl.TEXTURE0);}
 else{gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,t);gl.activeTexture(gl.TEXTURE0);}}
// ---------- meshes ----------
function mesh(P,N,I,dyn){const m={vao:gl.createVertexArray(),pb:gl.createBuffer(),nb:gl.createBuffer(),ib:gl.createBuffer(),n:I.length,big:P.length/3>65535};gl.bindVertexArray(m.vao);
 gl.bindBuffer(gl.ARRAY_BUFFER,m.pb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(P),dyn?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
 gl.bindBuffer(gl.ARRAY_BUFFER,m.nb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(N),dyn?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,0,0);
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.big?new Uint32Array(I):new Uint16Array(I),gl.STATIC_DRAW);gl.bindVertexArray(null);return m;}
function boxM(){const P=[],N=[],I=[];const f=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 f.forEach(n=>{const u=n[1]?[1,0,0]:[0,1,0];const v=cross(n,u);const b=P.length/3;
 for(const[s,t]of[[-1,-1],[1,-1],[1,1],[-1,1]]){P.push(.5*(n[0]+s*u[0]+t*v[0]),.5*(n[1]+s*u[1]+t*v[1]),.5*(n[2]+s*u[2]+t*v[2]));N.push(...n);}
 I.push(b,b+1,b+2,b,b+2,b+3);});return mesh(P,N,I);}
// frustum (radius r0 at y=0, r1 at y=1)
function frM(s,r0,r1,caps){const P=[],N=[],I=[];const sl=(r0-r1);for(let i=0;i<=s;i++){const a=i/s*Math.PI*2,c=Math.cos(a),z=Math.sin(a);const nn=norm([c,sl,z]);P.push(c*r0,0,z*r0,c*r1,1,z*r1);N.push(...nn,...nn);if(i<s){const b=i*2;I.push(b,b+1,b+3,b,b+3,b+2);}}
 if(caps){for(const[y,r]of[[0,r0],[1,r1]]){const b=P.length/3;P.push(0,y,0);N.push(0,y?1:-1,0);for(let i=0;i<=s;i++){const a=i/s*Math.PI*2;P.push(Math.cos(a)*r,y,Math.sin(a)*r);N.push(0,y?1:-1,0);if(i<s)I.push(b,b+1+i,b+2+i);}}}return mesh(P,N,I);}
function cylM(s,caps){return frM(s,1,1,caps);}
function sphM(la,lo){const P=[],N=[],I=[];for(let i=0;i<=la;i++){const th=i/la*Math.PI;for(let j=0;j<=lo;j++){const ph=j/lo*Math.PI*2;const x=Math.sin(th)*Math.cos(ph),y=Math.cos(th),z=Math.sin(th)*Math.sin(ph);P.push(x,y,z);N.push(x,y,z);
 if(i<la&&j<lo){const a=i*(lo+1)+j,b=a+lo+1;I.push(a,b,a+1,b,b+1,a+1);}}}return mesh(P,N,I);}
function coneM(s){const P=[],N=[],I=[];for(let i=0;i<=s;i++){const a=i/s*Math.PI*2,c=Math.cos(a),z=Math.sin(a);const n=norm([c,.7,z]);P.push(c,0,z,0,1,0);N.push(...n,...n);if(i<s){const b=i*2;I.push(b,b+1,b+2);}}
 const b=P.length/3;P.push(0,0,0);N.push(0,-1,0);for(let i=0;i<=s;i++){const a=i/s*Math.PI*2;P.push(Math.cos(a),0,Math.sin(a));N.push(0,-1,0);if(i<s)I.push(b,b+2+i,b+1+i);}return mesh(P,N,I);}
function quadM(){return mesh([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],[0,0,1,0,0,1,0,0,1,0,0,1],[0,1,2,0,2,3]);}
const CONE=coneM(20),BOX=boxM(),CYL=cylM(28,true),TUBE=cylM(28,false),SPH=sphM(16,24),SPHL=sphM(8,12),QUAD=quadM(),FR=frM(24,1,.75,true),FR2=frM(24,1,.55,true);
// dynamic heightfield grid
const GX=120,GZ=120;const gP=new Float32Array((GX+1)*(GZ+1)*3),gN=new Float32Array(gP.length);const gI=[];
for(let j=0;j<GZ;j++)for(let i=0;i<GX;i++){const a=j*(GX+1)+i,b=a+GX+1;gI.push(a,b,a+1,b,b+1,a+1);}
const GRID=mesh(gP,gN,gI,true);
function setGrid(x0,x1,z0,z1,hf){for(let j=0;j<=GZ;j++)for(let i=0;i<=GX;i++){const k=(j*(GX+1)+i)*3,x=x0+(x1-x0)*i/GX,z=z0+(z1-z0)*j/GZ;gP[k]=x;gP[k+1]=hf(x,z);gP[k+2]=z;}
 const dx=(x1-x0)/GX,dz=(z1-z0)/GZ;for(let j=0;j<=GZ;j++)for(let i=0;i<=GX;i++){const k=(j*(GX+1)+i)*3;
 const l=gP[((j*(GX+1))+Math.max(i-1,0))*3+1],r=gP[((j*(GX+1))+Math.min(i+1,GX))*3+1],d=gP[((Math.max(j-1,0)*(GX+1))+i)*3+1],u=gP[((Math.min(j+1,GZ)*(GX+1))+i)*3+1];
 const nn=norm([(l-r)/(2*dx),1,(d-u)/(2*dz)]);gN[k]=nn[0];gN[k+1]=nn[1];gN[k+2]=nn[2];}
 gl.bindBuffer(gl.ARRAY_BUFFER,GRID.pb);gl.bufferSubData(gl.ARRAY_BUFFER,0,gP);gl.bindBuffer(gl.ARRAY_BUFFER,GRID.nb);gl.bufferSubData(gl.ARRAY_BUFFER,0,gN);}
// ---------- draw ----------
let GOLDUSED=false;let INK_DEF=.75;let TOON=.12;let CLIP=[0,0,0,-1];let OID=1,PULSE=0,TRANS=false;const POST={desat:0,ink:1,glow:1,inkFar:120,sky:1,clouds:.5,skyTop:[.3,.5,.85],cloudC:[1,1,1],ao:.3,fog:[.75,.85,.95],sunD:[-.4,.8,.45]};let ENVF=null;
function nextId(){OID=(OID+1)%250;return OID;}
function draw(m,o){const p=o.p||[0,0,0],s=o.s||[1,1,1],R=rot(o.r||[0,0,0]);
 let M=mul(mul(new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,p[0],p[1],p[2],1]),R),new Float32Array([s[0],0,0,0,0,s[1],0,0,0,0,s[2],0,0,0,0,1]));
 let RR=R;if(o.P){M=mul(o.P.M,M);RR=mul(o.P.R,R);}
 const tr=o.a!==undefined&&o.a<1;
 if(SHPASS){if(!SH_ON||tr||o.u||o.noShadow||(o.P&&o.P.noShadow))return;const su=m.skin?SUS:SU;gl.useProgram(m.skin?sprS:spr);if(m.skin){gl.uniformMatrix4fv(SUS.LVP,false,LVP);gl.uniformMatrix4fv(SUS.BN,false,o.bones);}gl.uniformMatrix4fv(su.M,false,M);gl.uniform4fv(su.clipP,o.clip||CLIP);gl.bindVertexArray(m.vao);gl.drawElements(gl.TRIANGLES,m.n,m.big?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,0);gl.bindVertexArray(null);return;}
 const clipOn=(o.clip&&o.clip[3]!==-1)||CLIP[0]!==0||CLIP[1]!==0||CLIP[2]!==0;const g=o.gold!==undefined?o.gold:(o.P&&o.P.gold)||0;
 useK((o.pat||0)+'_'+(o.tex||0)+'_'+(clipOn?1:0)+'_'+(SH_ON&&!o.u?1:0)+'_'+(o.u?1:0)+'_'+(g>0?1:0)+'_'+(m.skin?1:0));
 if(m.skin){gl.uniformMatrix4fv(U.BN,false,o.bones);gl.uniform3fv(U.mc,o.mats);gl.uniform4fv(U.mp,o.mp||[.6,0,0,0]);}
 gl.uniformMatrix4fv(U.M,false,M);gl.uniformMatrix4fv(U.R,false,RR);gl.uniform3f(U.iS,1/s[0],1/s[1],1/s[2]);
 gl.uniform3fv(U.col,o.c||[.5,.5,.5]);gl.uniform3fv(U.emi,o.e||[0,0,0]);gl.uniform1f(U.gloss,o.g||0);
 if(g>0)GOLDUSED=true;gl.uniform1f(U.gold,g);gl.uniform1f(U.patS,o.patS||1);
 const id=o.id!==undefined?o.id:(o.P&&o.P.id!==undefined?o.P.id:nextId());gl.uniform1f(U.oid,id/255);
 gl.uniform1f(U.alpha,tr?o.a:1);const noInk=o.noInk||(o.P&&o.P.noInk);
 if(tr){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.drawBuffers([gl.COLOR_ATTACHMENT0,gl.NONE]);if(o.add)gl.blendFunc(gl.SRC_ALPHA,gl.ONE);}
 else if(noInk)gl.drawBuffers([gl.COLOR_ATTACHMENT0,gl.NONE]);
 gl.uniform4fv(U.clipP,o.clip||CLIP);gl.bindVertexArray(m.vao);gl.drawElements(gl.TRIANGLES,m.n,m.big?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,0);gl.bindVertexArray(null);
 if(tr){gl.disable(gl.BLEND);gl.depthMask(true);}if(tr||noInk)gl.drawBuffers([gl.COLOR_ATTACHMENT0,gl.COLOR_ATTACHMENT1]);}
let CAM=null;
function env(o){const e=o.eye,t=o.tgt;const sunD=norm(o.sunD||[-.4,.8,.45]);
 if(SHPASS){gl.bindFramebuffer(gl.FRAMEBUFFER,sfbo);gl.viewport(0,0,SMS,SMS);gl.enable(gl.DEPTH_TEST);gl.useProgram(spr);pr=null;gl.clearBufferfi(gl.DEPTH_STENCIL,0,1,0);
  if(o.shadow===false||o.bg||(typeof NO_SHADOW!=='undefined')){SH_ON=0;return;}const dist=Math.hypot(e[0]-t[0],e[1]-t[1],e[2]-t[2]);const sc=(o.shadow&&o.shadow.c)||t;const r=(o.shadow&&o.shadow.r)||clamp(dist*.8+3,5,140);
  const lp=[sc[0]+sunD[0]*r*2,sc[1]+sunD[1]*r*2,sc[2]+sunD[2]*r*2];const up=Math.abs(sunD[1])>.97?[0,0,1]:[0,1,0];LVP=mul(ortho(-r,r,-r,r,.1,r*4.5),lookAt(lp,sc,up));gl.uniformMatrix4fv(SU.LVP,false,LVP);CLIP=o.clip||[0,0,0,-1];SH_ON=1;return;}
 gl.activeTexture(gl.TEXTURE4);gl.bindTexture(gl.TEXTURE_2D,smTex);gl.activeTexture(gl.TEXTURE0);
 pr=null;gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.viewport(0,0,RW,RH);gl.enable(gl.DEPTH_TEST);
 const fovr=(o.fov||50)*Math.PI/180;const V=lookAt(e,t,o.up||[0,1,0]),P=persp(fovr,W/H,o.near||.1,o.far||600);const VP=mul(P,V);CAM={VP,e,near:o.near||.1,far:o.far||600,focal:RH/(2*Math.tan(fovr/2))};
 const fog=o.fog||[.75,.85,.95];ENVV++;ENVU={VP,e,sunD,sunC:o.sunC||[.62,.58,.5],sky:o.sky||[.62,.66,.74],gnd:o.gnd||[.42,.4,.36],fog,fogD:o.fogD||.006,plP:o.plP||[0,-999,0],plC:o.plC||[0,0,0],plR:o.plR||1,toon:o.toon===undefined?TOON:o.toon};
 const bg=o.bg||fog;gl.clearBufferfv(gl.COLOR,0,[bg[0],bg[1],bg[2],1]);gl.clearBufferfv(gl.COLOR,1,[.5,.5,0,0]);gl.clearBufferfi(gl.DEPTH_STENCIL,0,1,0);
 POST.desat=o.desat||0;POST.ink=o.ink===undefined?INK_DEF:o.ink;POST.glow=o.glow===undefined?1:o.glow;POST.inkFar=o.inkFar||120;CLIP=o.clip||[0,0,0,-1];
 POST.sky=(o.bg||o.noSky)?0:1;POST.fog=fog;POST.sunD=sunD;POST.skyTop=o.skyTop||mix3(fog,[.22,.45,.86],.6);POST.clouds=o.clouds===undefined?.5:o.clouds;{const lum=fog[0]*.3+fog[1]*.59+fog[2]*.11;POST.cloudC=o.cloudC||mix3(mix3([1,1,1],fog,.15),POST.skyTop,clamp(1-lum*1.7,0,.72));}POST.dof=o.dof||null;POST.ao=(typeof NO_AO!=='undefined')?0:(o.ao===undefined?.32:o.ao);POST.VP=VP;}
// project world point to screen px
function proj(w){const m=CAM.VP;const x=m[0]*w[0]+m[4]*w[1]+m[8]*w[2]+m[12],y=m[1]*w[0]+m[5]*w[1]+m[9]*w[2]+m[13],ww=m[3]*w[0]+m[7]*w[1]+m[11]*w[2]+m[15];return[(x/ww*.5+.5)*W,(1-(y/ww*.5+.5))*H,ww];}
function quad(){const va=gl.createVertexArray();gl.bindVertexArray(va);gl.bindBuffer(gl.ARRAY_BUFFER,quadB);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);gl.bindVertexArray(null);gl.deleteVertexArray(va);}
function post(){gl.disable(gl.DEPTH_TEST);
 if(POST.sky){gl.bindFramebuffer(gl.FRAMEBUFFER,skfbo);gl.viewport(0,0,SKW,SKH);gl.useProgram(skp);gl.uniform1f(SKU.clouds,POST.clouds);gl.uniform1f(SKU.time,TIME);gl.uniform3fv(SKU.fogC,POST.fog);gl.uniform3fv(SKU.skyTop,POST.skyTop);gl.uniform3fv(SKU.cloudC,POST.cloudC);gl.uniform3fv(SKU.camP,CAM.e);gl.uniform3fv(SKU.sunD,POST.sunD);gl.uniformMatrix4fv(SKU.iVP,false,inv4(CAM.VP));quad();}
 const gw=GOLDUSED?1:0;GOLDUSED=false;const PE=getPP((POST.sky?1:0)+'_'+(POST.ao>0?1:0)+'_'+gw+'_'+(POST.dof?1:0));const PU=PE.u;
 gl.bindFramebuffer(gl.FRAMEBUFFER,pfbo);gl.viewport(0,0,RW,RH);gl.useProgram(PE.p);
 gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,cTex);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,aTex);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,dTex);gl.activeTexture(gl.TEXTURE5);gl.bindTexture(gl.TEXTURE_2D,skTex);gl.activeTexture(gl.TEXTURE0);
 gl.uniform1i(PU.cT,0);gl.uniform1i(PU.aT,1);gl.uniform1i(PU.dT,2);gl.uniform1i(PU.skT,5);gl.uniform2f(PU.px,1/RW,1/RH);gl.uniform1f(PU.desat,POST.desat);gl.uniform1f(PU.ink,POST.ink);gl.uniform1f(PU.glow,POST.glow*(.8+.2*PULSE));
 gl.uniform1f(PU.near,CAM.near);gl.uniform1f(PU.far,CAM.far);gl.uniform1f(PU.inkFar,POST.inkFar);gl.uniform1f(PU.rs,RS);gl.uniform1f(PU.focal,CAM.focal);gl.uniform1f(PU.aoAmt,POST.ao);if(POST.dof){gl.uniform1f(PU.dofF,POST.dof[0]);gl.uniform1f(PU.dofR,POST.dof[1]);}
 quad();
 gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,W,H);gl.useProgram(dp);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,pTex);gl.uniform1i(DU.pT,0);gl.uniform2f(DU.opx,1/W,1/H);quad();
 pr=null;}
// full frame: shadow pass + main pass + post
function renderScene(fn,t){SHPASS=true;SH_ON=0;fn(t);SHPASS=false;fn(t);post();}
