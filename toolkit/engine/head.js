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
// ---------- shaders ----------
const vs=`#version 300 es
in vec3 p;in vec3 n;uniform mat4 M,R,VP;uniform vec3 iS;out vec3 vN,vW,vO;void main(){vec4 w=M*vec4(p,1.);vW=w.xyz;vO=p;vN=(R*vec4(n*iS,0.)).xyz;gl_Position=VP*w;}`;
const fs=`#version 300 es
precision highp float;in vec3 vN,vW,vO;uniform vec3 col,emi,cam,sunD,sunC,sky,gnd,fogC,plP,plC;uniform float gloss,fogD,plR,gold,alpha,unlit,oid,pulse,texMode;uniform vec4 clipP;uniform sampler2D tex;
layout(location=0) out vec4 o0;layout(location=1) out vec4 o1;
void main(){if(dot(vec4(vW,1.),clipP)>0.)discard;vec3 N=normalize(vN);vec3 V=normalize(cam-vW);if(dot(N,V)<-.05)N=-N;vec3 base=col;
 if(texMode>.5&&texMode<1.5){vec4 tx=texture(tex,vec2(vO.x+.5,.5-vO.y));base=mix(base,tx.rgb,tx.a);}
 if(texMode>2.5){vec4 tx=texture(tex,vec2(vO.x+.5,.5-vO.y));if(tx.a<.5)discard;base=tx.rgb;}
 if(texMode>1.5&&texMode<2.5){vec3 q=normalize(vO);float lo=atan(q.z,-q.x);float la=asin(clamp(q.y,-1.,1.));vec4 tx=texture(tex,vec2(lo/6.2831853+.5,.5-la/3.1415926));base=tx.rgb;}
 vec3 c;
 if(unlit>.5){c=base;}else{
 float d=dot(N,sunD);float lit=smoothstep(-.06,.06,d)*.62+smoothstep(.5,.58,d)*.22;
 vec3 amb=mix(gnd,sky,N.y*.5+.5);
 vec3 L=plP-vW;float dl=length(L);L/=dl;float at=max(1.-dl/plR,0.);at=smoothstep(0.,.35,at)*at;float pd=smoothstep(-.05,.1,dot(N,L));
 vec3 Hh=normalize(sunD+V);float sp=smoothstep(.93,.96,dot(N,Hh))*gloss*.5;
 c=base*(amb+sunC*lit+plC*pd*at)+sunC*sp;
 float rim=smoothstep(.62,.75,1.-max(dot(N,V),0.))*smoothstep(-.2,.3,d)*.18;c+=rim*sunC;}
 c+=emi;
 if(gold>0.){float r=pow(1.-max(dot(N,V),0.),2.2);c=mix(c,c*vec3(1.15,1.0,.75),.35*gold)+vec3(1.,.71,.18)*(r*1.1+.12+.12*pulse)*gold;}
 float f=1.-exp(-pow(length(cam-vW)*fogD,1.4));c=mix(c,fogC,f);
 o0=vec4(c,alpha);
 vec3 vn=normalize(N);o1=vec4(vn.xy*.5+.5,gold>0.?1.:0.,oid);}`;
function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(o);return o;}
function prog(v,f){const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,v));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.bindAttribLocation(p,0,'p');gl.bindAttribLocation(p,1,'n');gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw gl.getProgramInfoLog(p);return p;}
const pr=prog(vs,fs);
const U={};['M','R','VP','iS','col','emi','cam','sunD','sunC','sky','gnd','fogC','plP','plC','gloss','fogD','plR','gold','alpha','unlit','oid','pulse','texMode','tex','clipP'].forEach(k=>U[k]=gl.getUniformLocation(pr,k));
// post: ink outlines + gold halo + desaturation
const pvs=`#version 300 es
in vec3 p;out vec2 uv;void main(){uv=p.xy*.5+.5;gl_Position=vec4(p.xy,0.,1.);}`;
const pfs=`#version 300 es
precision highp float;in vec2 uv;uniform sampler2D cT,aT,dT;uniform vec2 px;uniform float desat,ink,glow,near,far,inkFar;out vec4 o;
float ld(vec2 q){float z=texture(dT,q).r*2.-1.;return 2.*near*far/(far+near-z*(far-near));}
void main(){vec3 c=texture(cT,uv).rgb;vec4 a=texture(aT,uv);float d0=ld(uv);
 float e=0.;vec2 o8[8]=vec2[](vec2(1,0),vec2(-1,0),vec2(0,1),vec2(0,-1),vec2(.7,.7),vec2(-.7,.7),vec2(.7,-.7),vec2(-.7,-.7));
 float wpx=1.6*ink;
 for(int i=0;i<8;i++){vec2 q=uv+o8[i]*px*wpx;vec4 b=texture(aT,q);float d1=ld(q);
  float dz=abs(d1-d0)/min(d0,d1);float ez=smoothstep(.035,.09,dz);
  float en=smoothstep(.35,.6,length(b.xy-a.xy));float ei=abs(b.w-a.w)>.002?1.:0.;
  e=max(e,max(ez,max(en,ei)));}
 float fade=1.-smoothstep(inkFar*.45,inkFar,d0);e*=fade;
 float g=a.z;float hal=0.;for(int r=1;r<=3;r++){float rr=float(r)*9.;for(int i=0;i<8;i++){hal+=texture(aT,uv+o8[i]*px*rr).z;}}hal/=24.;
 float L=dot(c,vec3(.299,.587,.114));vec3 dc=mix(c,vec3(L)*vec3(1.02,1.,.96),desat*(1.-g));
 dc+=vec3(1.,.71,.18)*hal*(1.-g)*glow*.9;
 dc=mix(dc,vec3(.05,.045,.06),e*.92);
 o=vec4(dc,1.);}`;
const pp=prog(pvs,pfs);const PU={};['cT','aT','dT','px','desat','ink','glow','near','far','inkFar'].forEach(k=>PU[k]=gl.getUniformLocation(pp,k));
const quadB=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quadB);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),gl.STATIC_DRAW);
// FBO
function mkTex(ifmt,fmt,type){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,ifmt,W,H,0,fmt,type,null);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
const cTex=mkTex(gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE),aTex=mkTex(gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE),dTex=mkTex(gl.DEPTH_COMPONENT24,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT);
gl.bindTexture(gl.TEXTURE_2D,cTex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
const fbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,cTex,0);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT1,gl.TEXTURE_2D,aTex,0);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,dTex,0);
gl.drawBuffers([gl.COLOR_ATTACHMENT0,gl.COLOR_ATTACHMENT1]);
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
let CLIP=[0,0,0,-1];let OID=1,PULSE=0,TRANS=false;const POST={desat:0,ink:1,glow:1,inkFar:120};let ENVF=null;
function nextId(){OID=(OID+1)%250;return OID;}
function draw(m,o){const p=o.p||[0,0,0],s=o.s||[1,1,1],R=rot(o.r||[0,0,0]);
 let M=mul(mul(new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,p[0],p[1],p[2],1]),R),new Float32Array([s[0],0,0,0,0,s[1],0,0,0,0,s[2],0,0,0,0,1]));
 let RR=R;if(o.P){M=mul(o.P.M,M);RR=mul(o.P.R,R);}
 gl.uniformMatrix4fv(U.M,false,M);gl.uniformMatrix4fv(U.R,false,RR);gl.uniform3f(U.iS,1/s[0],1/s[1],1/s[2]);
 gl.uniform3fv(U.col,o.c||[.5,.5,.5]);gl.uniform3fv(U.emi,o.e||[0,0,0]);gl.uniform1f(U.gloss,o.g||0);
 const g=o.gold!==undefined?o.gold:(o.P&&o.P.gold)||0;gl.uniform1f(U.gold,g);gl.uniform1f(U.unlit,o.u?1:0);gl.uniform1f(U.texMode,o.tex||0);
 const id=o.id!==undefined?o.id:(o.P&&o.P.id!==undefined?o.P.id:nextId());gl.uniform1f(U.oid,id/255);
 const tr=o.a!==undefined&&o.a<1;gl.uniform1f(U.alpha,tr?o.a:1);
 if(tr){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.drawBuffers([gl.COLOR_ATTACHMENT0,gl.NONE]);if(o.add)gl.blendFunc(gl.SRC_ALPHA,gl.ONE);}
 gl.uniform4fv(U.clipP,o.clip||CLIP);gl.bindVertexArray(m.vao);gl.drawElements(gl.TRIANGLES,m.n,m.big?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,0);gl.bindVertexArray(null);
 if(tr){gl.disable(gl.BLEND);gl.depthMask(true);gl.drawBuffers([gl.COLOR_ATTACHMENT0,gl.COLOR_ATTACHMENT1]);}}
let CAM=null;
function env(o){gl.useProgram(pr);gl.uniform1i(U.tex,3);gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.viewport(0,0,W,H);gl.enable(gl.DEPTH_TEST);
 const e=o.eye,t=o.tgt;const V=lookAt(e,t,o.up||[0,1,0]),P=persp((o.fov||50)*Math.PI/180,W/H,o.near||.1,o.far||600);const VP=mul(P,V);CAM={VP,e,near:o.near||.1,far:o.far||600};
 gl.uniformMatrix4fv(U.VP,false,VP);gl.uniform3fv(U.cam,e);
 gl.uniform3fv(U.sunD,norm(o.sunD||[-.4,.8,.45]));gl.uniform3fv(U.sunC,o.sunC||[.62,.58,.5]);gl.uniform3fv(U.sky,o.sky||[.62,.66,.74]);gl.uniform3fv(U.gnd,o.gnd||[.42,.4,.36]);
 const fog=o.fog||[.75,.85,.95];gl.uniform3fv(U.fogC,fog);gl.uniform1f(U.fogD,o.fogD||.006);gl.uniform3fv(U.plP,o.plP||[0,-999,0]);gl.uniform3fv(U.plC,o.plC||[0,0,0]);gl.uniform1f(U.plR,o.plR||1);gl.uniform1f(U.pulse,PULSE);
 const bg=o.bg||fog;gl.clearBufferfv(gl.COLOR,0,[bg[0],bg[1],bg[2],1]);gl.clearBufferfv(gl.COLOR,1,[.5,.5,0,0]);gl.clearBufferfi(gl.DEPTH_STENCIL,0,1,0);
 POST.desat=o.desat||0;POST.ink=o.ink===undefined?1:o.ink;POST.glow=o.glow===undefined?1:o.glow;POST.inkFar=o.inkFar||120;CLIP=o.clip||[0,0,0,-1];}
// project world point to screen px
function proj(w){const m=CAM.VP;const x=m[0]*w[0]+m[4]*w[1]+m[8]*w[2]+m[12],y=m[1]*w[0]+m[5]*w[1]+m[9]*w[2]+m[13],ww=m[3]*w[0]+m[7]*w[1]+m[11]*w[2]+m[15];return[(x/ww*.5+.5)*W,(1-(y/ww*.5+.5))*H,ww];}
function post(){gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,W,H);gl.disable(gl.DEPTH_TEST);gl.useProgram(pp);
 gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,cTex);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,aTex);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,dTex);gl.activeTexture(gl.TEXTURE0);
 gl.uniform1i(PU.cT,0);gl.uniform1i(PU.aT,1);gl.uniform1i(PU.dT,2);gl.uniform2f(PU.px,1/W,1/H);gl.uniform1f(PU.desat,POST.desat);gl.uniform1f(PU.ink,POST.ink);gl.uniform1f(PU.glow,POST.glow*(.8+.2*PULSE));
 gl.uniform1f(PU.near,CAM.near);gl.uniform1f(PU.far,CAM.far);gl.uniform1f(PU.inkFar,POST.inkFar);
 const va=gl.createVertexArray();gl.bindVertexArray(va);gl.bindBuffer(gl.ARRAY_BUFFER,quadB);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);gl.bindVertexArray(null);gl.deleteVertexArray(va);
 gl.useProgram(pr);}
