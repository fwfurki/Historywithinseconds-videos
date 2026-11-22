
const W=720,H=1280;
const gl=document.getElementById('gl').getContext('webgl',{antialias:true,preserveDrawingBuffer:true});
const out=document.getElementById('out'),cx=out.getContext('2d',{willReadFrequently:true});
// ---------- math ----------
function mul(a,b){const o=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s;}return o;}
function persp(f,a,n,fa){const t=1/Math.tan(f/2);return new Float32Array([t/a,0,0,0,0,t,0,0,0,0,(fa+n)/(n-fa),-1,0,0,2*fa*n/(n-fa),0]);}
function sub(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]}function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function norm(a){const l=Math.hypot(...a)||1;return[a[0]/l,a[1]/l,a[2]/l]}
function lookAt(e,c,u){const z=norm(sub(e,c)),x=norm(cross(u,z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*e[0]+x[1]*e[1]+x[2]*e[2]),-(y[0]*e[0]+y[1]*e[1]+y[2]*e[2]),-(z[0]*e[0]+z[1]*e[1]+z[2]*e[2]),1]);}
function rot(r){const[a,b,c]=r;const cx_=Math.cos(a),sx=Math.sin(a),cy=Math.cos(b),sy=Math.sin(b),cz=Math.cos(c),sz=Math.sin(c);
 const Rx=[1,0,0,0,0,cx_,sx,0,0,-sx,cx_,0,0,0,0,1],Ry=[cy,0,-sy,0,0,1,0,0,sy,0,cy,0,0,0,0,1],Rz=[cz,sz,0,0,-sz,cz,0,0,0,0,1,0,0,0,0,1];return mul(mul(Ry,Rx),Rz);}
// ---------- seeded rng ----------
let seed=7;function rnd(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
// ---------- gl ----------
const vs=`attribute vec3 p;attribute vec3 n;uniform mat4 M,R,VP;uniform vec3 iS;varying vec3 vN,vW;void main(){vec4 w=M*vec4(p,1.);vW=w.xyz;vN=(R*vec4(n*iS,0.)).xyz;gl_Position=VP*w;}`;
const fs=`precision highp float;varying vec3 vN,vW;uniform vec3 col,emi,cam,sunD,sunC,sky,gnd,fogC,plP,plC;uniform float gloss,fogD,plR;
void main(){vec3 N=normalize(vN);if(!gl_FrontFacing)N=-N;vec3 V=normalize(cam-vW);
vec3 amb=mix(gnd,sky,N.y*.5+.5);float d=max(dot(N,sunD),0.);vec3 H=normalize(sunD+V);
float sp=pow(max(dot(N,H),0.),8.+gloss*120.)*gloss*1.6;
vec3 L=plP-vW;float dl=length(L);L/=dl;float at=max(1.-dl/plR,0.);at*=at;vec3 H2=normalize(L+V);
vec3 c=col*(amb+sunC*d+plC*max(dot(N,L),0.)*at)+(sunC*sp)+plC*at*pow(max(dot(N,H2),0.),8.+gloss*120.)*gloss*1.6;
float rim=pow(1.-max(dot(N,V),0.),3.)*.25;c+=rim*sky*col*2.;c=1.-exp(-c*2.3);c+=emi;
float f=1.-exp(-pow(length(cam-vW)*fogD,1.4));gl_FragColor=vec4(mix(c,fogC,f),1.);}`;
function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(o);return o;}
const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);gl.useProgram(pr);
const U={};['M','R','VP','iS','col','emi','cam','sunD','sunC','sky','gnd','fogC','plP','plC','gloss','fogD','plR'].forEach(k=>U[k]=gl.getUniformLocation(pr,k));
const aP=gl.getAttribLocation(pr,'p'),aN=gl.getAttribLocation(pr,'n');gl.enableVertexAttribArray(aP);gl.enableVertexAttribArray(aN);
gl.enable(gl.DEPTH_TEST);
function mesh(P,N,I,dyn){const m={pb:gl.createBuffer(),nb:gl.createBuffer(),ib:gl.createBuffer(),n:I.length};
 gl.bindBuffer(gl.ARRAY_BUFFER,m.pb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(P),dyn?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);
 gl.bindBuffer(gl.ARRAY_BUFFER,m.nb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(N),dyn?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(I),gl.STATIC_DRAW);return m;}
function boxM(){const P=[],N=[],I=[];const f=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 f.forEach(n=>{const u=n[1]?[1,0,0]:[0,1,0];const v=cross(n,u);const b=P.length/3;
 for(const[s,t]of[[-1,-1],[1,-1],[1,1],[-1,1]]){P.push(.5*(n[0]+s*u[0]+t*v[0]),.5*(n[1]+s*u[1]+t*v[1]),.5*(n[2]+s*u[2]+t*v[2]));N.push(...n);}
 I.push(b,b+1,b+2,b,b+2,b+3);});return mesh(P,N,I);}
function cylM(s,caps){const P=[],N=[],I=[];for(let i=0;i<=s;i++){const a=i/s*Math.PI*2,c=Math.cos(a),z=Math.sin(a);P.push(c,0,z,c,1,z);N.push(c,0,z,c,0,z);if(i<s){const b=i*2;I.push(b,b+1,b+3,b,b+3,b+2);}}
 if(caps){for(const y of[0,1]){const b=P.length/3;P.push(0,y,0);N.push(0,y?1:-1,0);for(let i=0;i<=s;i++){const a=i/s*Math.PI*2;P.push(Math.cos(a),y,Math.sin(a));N.push(0,y?1:-1,0);if(i<s)I.push(b,b+1+i,b+2+i);}}}return mesh(P,N,I);}
function sphM(la,lo){const P=[],N=[],I=[];for(let i=0;i<=la;i++){const th=i/la*Math.PI;for(let j=0;j<=lo;j++){const ph=j/lo*Math.PI*2;const x=Math.sin(th)*Math.cos(ph),y=Math.cos(th),z=Math.sin(th)*Math.sin(ph);P.push(x,y,z);N.push(x,y,z);
 if(i<la&&j<lo){const a=i*(lo+1)+j,b=a+lo+1;I.push(a,b,a+1,b,b+1,a+1);}}}return mesh(P,N,I);}
function coneM(s){const P=[],N=[],I=[];for(let i=0;i<=s;i++){const a=i/s*Math.PI*2,c=Math.cos(a),z=Math.sin(a);const n=norm([c,.7,z]);P.push(c,0,z,0,1,0);N.push(...n,...n);if(i<s){const b=i*2;I.push(b,b+1,b+2);}}return mesh(P,N,I);}
const CONE=coneM(9),BOX=boxM(),CYL=cylM(40,true),TUBE=cylM(40,false),SPH=sphM(10,16);
// dynamic heightfield grid
const GX=36,GZ=200;const gP=new Float32Array((GX+1)*(GZ+1)*3),gN=new Float32Array(gP.length);const gI=[];
for(let j=0;j<GZ;j++)for(let i=0;i<GX;i++){const a=j*(GX+1)+i,b=a+GX+1;gI.push(a,b,a+1,b,b+1,a+1);}
const GRID=mesh(gP,gN,gI,true);
function setGrid(x0,x1,z0,z1,hf){for(let j=0;j<=GZ;j++)for(let i=0;i<=GX;i++){const k=(j*(GX+1)+i)*3,x=x0+(x1-x0)*i/GX,z=z0+(z1-z0)*j/GZ;gP[k]=x;gP[k+1]=hf(x,z);gP[k+2]=z;}
 const dx=(x1-x0)/GX,dz=(z1-z0)/GZ;for(let j=0;j<=GZ;j++)for(let i=0;i<=GX;i++){const k=(j*(GX+1)+i)*3;
 const l=gP[((j*(GX+1))+Math.max(i-1,0))*3+1],r=gP[((j*(GX+1))+Math.min(i+1,GX))*3+1],d=gP[((Math.max(j-1,0)*(GX+1))+i)*3+1],u=gP[((Math.min(j+1,GZ)*(GX+1))+i)*3+1];
 const nn=norm([(l-r)/(2*dx),1,(d-u)/(2*dz)]);gN[k]=nn[0];gN[k+1]=nn[1];gN[k+2]=nn[2];}
 gl.bindBuffer(gl.ARRAY_BUFFER,GRID.pb);gl.bufferSubData(gl.ARRAY_BUFFER,0,gP);gl.bindBuffer(gl.ARRAY_BUFFER,GRID.nb);gl.bufferSubData(gl.ARRAY_BUFFER,0,gN);}
function draw(m,o){const p=o.p||[0,0,0],s=o.s||[1,1,1],R=rot(o.r||[0,0,0]);
 let M=mul(mul(new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,p[0],p[1],p[2],1]),R),new Float32Array([s[0],0,0,0,0,s[1],0,0,0,0,s[2],0,0,0,0,1]));
 let RR=R;if(o.P){M=mul(o.P.M,M);RR=mul(o.P.R,R);}
 gl.uniformMatrix4fv(U.M,false,M);gl.uniformMatrix4fv(U.R,false,RR);gl.uniform3f(U.iS,1/s[0],1/s[1],1/s[2]);
 gl.uniform3fv(U.col,o.c||[.5,.5,.5]);gl.uniform3fv(U.emi,o.e||[0,0,0]);gl.uniform1f(U.gloss,o.g||0);
 gl.bindBuffer(gl.ARRAY_BUFFER,m.pb);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,m.nb);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,0,0);
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.ib);gl.drawElements(gl.TRIANGLES,m.n,gl.UNSIGNED_SHORT,0);}
function env(o){const e=o.eye,t=o.tgt;const V=lookAt(e,t,[0,1,0]),P=persp((o.fov||55)*Math.PI/180,W/H,.1,400);gl.uniformMatrix4fv(U.VP,false,mul(P,V));gl.uniform3fv(U.cam,e);
 gl.uniform3fv(U.sunD,norm(o.sunD||[-.4,.8,.3]));gl.uniform3fv(U.sunC,o.sunC||[.25,.28,.35]);gl.uniform3fv(U.sky,o.sky||[.12,.14,.2]);gl.uniform3fv(U.gnd,o.gnd||[.04,.035,.03]);
 gl.uniform3fv(U.fogC,o.fog);gl.uniform1f(U.fogD,o.fogD||.02);gl.uniform3fv(U.plP,o.plP||[0,-99,0]);gl.uniform3fv(U.plC,o.plC||[0,0,0]);gl.uniform1f(U.plR,o.plR||1);
 gl.clearColor(o.fog[0],o.fog[1],o.fog[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);}
// ---------- helpers ----------
const ss=(a,b,x)=>{x=Math.min(Math.max((x-a)/(b-a),0),1);return x*x*(3-2*x)};const lerp=(a,b,t)=>a+(b-a)*t;const mix3=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
