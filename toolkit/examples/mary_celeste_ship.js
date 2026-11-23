// ===== brigantine asset (Mary Celeste) — local +z = bow, waterline y=0 =====
function gridMesh(V,both,eps){const ni=V.length,nj=V[0].length;const P=[],N=[],I=[];
 const nrm=(i,j)=>{const a=V[Math.min(ni-1,i+1)][j],b=V[Math.max(0,i-1)][j],c=V[i][Math.min(nj-1,j+1)],d=V[i][Math.max(0,j-1)];return norm(cross(sub(a,b),sub(c,d)));};
 for(const side of both?[1,-1]:[1]){const base=P.length/3;for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const n=nrm(i,j);const v=V[i][j];const e=side<0?(eps||.012):0;P.push(v[0]-n[0]*e,v[1]-n[1]*e,v[2]-n[2]*e);N.push(n[0]*side,n[1]*side,n[2]*side);}
  for(let i=0;i<ni-1;i++)for(let j=0;j<nj-1;j++){const a=base+i*nj+j,b=a+nj,c=b+1,d=a+1;if(side>0)I.push(a,b,c,a,c,d);else I.push(a,c,b,a,d,c);}}
 return mesh(P,N,I);}
function lineC(P,a,b,r,c,o){const d=sub(b,a),L=Math.hypot(...d)||1e-4;draw(CYL,Object.assign({P,p:a,r:[Math.acos(clamp(d[1]/L,-1,1)),Math.atan2(d[0],d[2]),0],s:[r,L,r],c:c||[.22,.17,.12],noShadow:1},o||{}));}
// hull builder: L length, B beam, F freeboard, Dr draft, sheer
function hullSet(L,B,F,Dr,sh,stern){const N=34;
 const bw=u=>u>.62?Math.pow(Math.max(0,1-Math.pow((u-.62)/.38,2)),.62):(u<.12?(stern||.78)+(1-(stern||.78))*Math.sin(u/.12*Math.PI/2):1);
 const top=u=>F+sh*Math.pow((u-.42)/.58,2)*(u>.42?1.15:.7);const dk=u=>Dr*(1-.75*ss(.8,1,u)-.15*ss(.12,0,u));
 const up=[[1,1],[1.03,.62],[1.01,.25],[.98,0]],lo=[[.98,0],[.9,-.32],[.68,-.66],[.36,-.9],[0,-1]];
 const pt=(u,px,py,sd)=>{const z=(u-.5)*L,w=Math.max(bw(u),.015)*B/2;return[sd*px*w,py>=0?py*top(u):py*dk(u),z];};
 const U=[];for(let i=0;i<=N;i++)U.push(i/N);
 const upper=sd=>U.map(u=>up.map(([x,y])=>pt(u,x,y,sd)));
 const lower=U.map(u=>[...lo.map(([x,y])=>pt(u,x,y,-1)),...lo.slice(0,-1).reverse().map(([x,y])=>pt(u,x,y,1))]);
 const deckY=u=>top(u)-.62*F/1.9;
 const inner=sd=>U.map(u=>{const w=Math.max(bw(u),.015)*B/2*.93,z=(u-.5)*L;return[[sd*w,top(u)-.02,z],[sd*w,deckY(u),z]];});
 const deck=U.map(u=>{const w=Math.max(bw(u),.015)*B/2*.94,z=(u-.5)*L;return[[-w,deckY(u),z],[0,deckY(u)+.06,z],[w,deckY(u),z]];});
 const rail=sd=>U.map(u=>{const w=Math.max(bw(u),.015)*B/2,z=(u-.5)*L,y=top(u);return[[sd*w*1.03,y,z],[sd*w*.9,y+.02,z]];});
 // transom fan
 const tr=(()=>{const ring=[...up.map(([x,y])=>pt(0,x,y,-1)),...up.slice().reverse().map(([x,y])=>pt(0,x,y,1))];const c=[0,top(0)*.5,-L/2];const P=[],Nn=[],I=[];P.push(...c);Nn.push(0,0,-1);ring.forEach(v=>{P.push(...v);Nn.push(0,0,-1);});for(let k=1;k<ring.length;k++)I.push(0,k,k+1);return mesh(P,Nn,I);})();
 return{up:[gridMesh(upper(1),1),gridMesh(upper(-1),1)],lo:gridMesh(lower,1),inn:[gridMesh(inner(1),1),gridMesh(inner(-1),1)],deck:gridMesh(deck,1),rail:[gridMesh(rail(1),1),gridMesh(rail(-1),1)],tr,top,deckY,bw,L,B};}
const HS=hullSet(22,6.2,2.0,2.3,1.0);
const BOATH=hullSet(4.6,1.6,.55,.3,.18,.55);
// billowed sail: corners bl,br,tr,tl (3D local), bulge vector n, flutter
const SAILC=new Map();const FLM=[];function flFree(){while(FLM.length){const m=FLM.pop();gl.deleteVertexArray(m.vao);gl.deleteBuffer(m.pb);gl.deleteBuffer(m.nb);gl.deleteBuffer(m.ib);}}
function sailMesh(key,bl,br,tr,tl,bul,fl){const k=key+(fl?Math.round(TIME*30):'');if(!fl&&SAILC.has(k))return SAILC.get(k);
 const V=[];const n=10;for(let i=0;i<=n;i++){const t=i/n;const row=[];for(let j=0;j<=n;j++){const s=j/n;const b=[0,1,2].map(q=>(1-t)*((1-s)*bl[q]+s*br[q])+t*((1-s)*tl[q]+s*tr[q]));
  let f=Math.sin(Math.PI*s)*Math.sin(Math.PI*(.12+t*.8))*1;if(fl)f+=fl*Math.sin(TIME*7+s*6+t*3)*(.3+s*.7);row.push([b[0]+bul[0]*f,b[1]+bul[1]*f,b[2]+bul[2]*f]);}V.push(row);}
 const m=gridMesh(V,1,.02);if(!fl)SAILC.set(k,m);else{FLM.push(m);}return m;}
const SAILCOL=[.95,.92,.82];
function furled(P,y,z,w){draw(CYL,{P,p:[-w/2,y+.12,z],r:[0,0,-Math.PI/2],s:[.16,w,.16],c:[.88,.84,.72]});}
// wheel (steering)
function wheel(P,spin,g){const S=cxf(P,xf([0,0,0],[0,0,spin]));for(let k=0;k<8;k++){const a=k*Math.PI/4;draw(BOX,{P:S,p:[Math.cos(a)*.42,Math.sin(a)*.42,0],r:[0,0,a],s:[.84+.24,.045,.045],c:[.5,.32,.16],gold:g});}
 for(let k=0;k<20;k++){const a=k/20*Math.PI*2;draw(BOX,{P:S,p:[Math.cos(a)*.42,Math.sin(a)*.42,0],r:[0,0,a+Math.PI/2],s:[.15,.06,.07],c:[.55,.36,.18],gold:g});}
 draw(CYL,{P:S,p:[0,0,-.12],r:[Math.PI/2,0,0],s:[.07,.24,.07],c:[.75,.6,.3],g:.6,gold:g});}
// lifeboat (yawl)
function boat(P,o){o=o||{};const g=o.gold||0,a=o.a;const hc=o.hull||[.96,.95,.9];const B=BOATH;
 const op=a!==undefined?{a,u:1}:{};
 B.up.forEach(m=>draw(m,Object.assign({P,c:hc,gold:g},op)));draw(B.lo,Object.assign({P,c:hc,gold:g},op));draw(B.tr,Object.assign({P,c:hc,gold:g},op));
 if(a!==undefined)return;B.rail.forEach(m=>draw(m,{P,c:[.55,.38,.2],gold:g}));B.inn.forEach(m=>draw(m,{P,c:[.72,.56,.36],pat:2,patS:5,gold:g}));
 draw(BOX,{P,p:[0,.12,0],s:[1.2,.04,3.8],c:[.6,.45,.28],pat:2,patS:5,gold:g});for(const z of[-1.2,-.2,.8])draw(BOX,{P,p:[0,.35,z],s:[1.4,.06,.28],c:[.62,.46,.28],gold:g});}
// main ship
function brig(P,o){o=o||{};const g=o.gold||0;const L=22,B=6.2;const hc=o.hull||[.13,.14,.16];const S=HS;
 const SP=Object.assign({},P);
 S.up.forEach(m=>draw(m,{P:SP,c:hc,g:.35,gold:g}));draw(S.lo,{P:SP,c:o.bottom||[.62,.32,.18],g:.2,gold:g});draw(S.tr,{P:SP,c:hc,gold:g});
 S.rail.forEach(m=>draw(m,{P:SP,c:[.62,.46,.26],gold:g}));S.inn.forEach(m=>draw(m,{P:SP,c:[.9,.88,.8],gold:g}));draw(S.deck,{P:SP,c:[.72,.6,.44],pat:2,patS:2.4,gold:g});
 // stripe along hull
 const zf=L*.22,zm=-L*.12;const dy=u=>S.deckY(u);const U=z=>z/L+.5;
 // bowsprit + jib boom
 const bt=S.top(1);const bs0=[0,bt-.1,L/2-1.2],bs1=[0,bt+1.6,L/2+6.5];lineC(SP,bs0,bs1,.17,[.5,.38,.24],{noShadow:0});
 // figurehead knob
 draw(SPH,{P:SP,p:[0,bt-.35,L/2+.15],s:[.25,.35,.3],c:[.85,.72,.4]});
 // masts
 const fH=19,mH=20;const fy=dy(U(zf)),my=dy(U(zm));
 draw(CYL,{P:SP,p:[0,fy-.2,zf],s:[.26,fH*.62,.26],c:[.58,.44,.28]});draw(CYL,{P:SP,p:[0,fy+fH*.6,zf],s:[.17,fH*.42,.17],c:[.6,.46,.3]});
 draw(CYL,{P:SP,p:[0,my-.2,zm],s:[.27,mH*.64,.27],c:[.58,.44,.28]});draw(CYL,{P:SP,p:[0,my+mH*.62,zm],s:[.17,mH*.38,.17],c:[.6,.46,.3]});
 // tops (platforms)
 draw(BOX,{P:SP,p:[0,fy+fH*.6,zf],s:[1.8,.12,1.2],c:[.45,.34,.22]});draw(BOX,{P:SP,p:[0,my+mH*.62,zm],s:[1.6,.12,1.1],c:[.45,.34,.22]});
 // shrouds
 for(const sd of[-1,1]){for(const[zz,yy,h]of[[zf,fy,fH*.6],[zm,my,mH*.62]]){for(let k=0;k<4;k++){const zb=zz-1+k*.55;lineC(SP,[sd*B*.5,S.top(U(zb))+.05,zb],[sd*.7,yy+h,zz],.03,[.15,.12,.1]);}
   for(let r=1;r<7;r++){const f=r/7;lineC(SP,[sd*lerp(B*.5,.7,f),lerp(S.top(U(zz))+.05,yy+h,f),zz-1],[sd*lerp(B*.5,.7,f),lerp(S.top(U(zz))+.05,yy+h,f),zz+.65],.015,[.15,.12,.1]);}}}
 // stays
 lineC(SP,[0,fy+fH*.98,zf],bs1,.03,[.15,.12,.1]);lineC(SP,[0,fy+fH*.6,zf],[0,bt+.6,L/2+2.5],.035,[.15,.12,.1]);lineC(SP,[0,my+mH*.98,zm],[0,fy+fH*.95,zf],.03,[.15,.12,.1]);lineC(SP,[0,my+mH*.6,zm],[0,fy+fH*.6,zf],.03,[.15,.12,.1]);
 // fore yards + square sails
 const yards=[[fy+4.2,10.5],[fy+8.6,9.2],[fy+12.4,7.4],[fy+15.6,5.6],[fy+18.2,4.2]];const set=o.set||[1,1,1,0,0];const fl=o.flap||0;const sw=o.sw||0;
 yards.forEach(([yy,w],k)=>{const SY=cxf(SP,xf([0,0,zf+.35],[0,sw,0]));draw(CYL,{P:SY,p:[-w/2,yy,0],r:[0,0,-Math.PI/2],s:[.12,w,.12],c:[.5,.38,.24]});
  if(k<yards.length-1){const[y2,w2]=yards[k+1];if(set[k]){const bot=yy+.1,topY=y2-.15;const tear=o.torn&&k==2;
    draw(sailMesh('sq'+k+(tear?'t':''),[-w/2*.98,bot+(tear?1.5:0),0],[w/2*.98,bot,0],[w2/2,topY,0],[-w2/2,topY,0],[0,0,1.1],(fl||tear)?(tear?.6:fl):0),{P:SY,c:SAILCOL,g:.1,gold:g});}
   else furled(SY,yy,0,w*.9);}
  else furled(SY,yy,0,w*.9);});
 // jibs
 const jib=[[[0,bt+.4,L/2+1.2],[0,fy+7,zf+.4],1],[[0,bt+1.1,L/2+4],[0,fy+11,zf+.4],1],[[0,bt+1.5,L/2+6.2],[0,fy+15,zf+.4],o.jibs3?1:0]];
 jib.forEach(([a,b,on],k)=>{if(!on)return;const foot=[a[0],a[1],a[2]-(L/2+(k?2:1.5)-zf)*.55];foot[1]=dy(U(foot[2]))+1.6+k*.6;draw(sailMesh('jb'+k,foot,a,b,b,[.55,0,.1],fl*.6),{P:SP,c:SAILCOL,g:.1,gold:g});});
 // main gaff sail (fore-and-aft)
 const gsw=o.gsw||.25;const GS=cxf(SP,xf([0,0,zm-.3],[0,gsw,0]));const by=my+1.6,gy=my+11.5;
 draw(CYL,{P:GS,p:[0,by,0],r:[-Math.PI/2,0,0],s:[.11,-9.5,.11],c:[.5,.38,.24]});lineC(GS,[0,gy,0],[0,gy+3.2,-8.6],.11,[.5,.38,.24],{noShadow:0});
 if(o.main!==0)draw(sailMesh('gaff',[0,by+.15,-9.3],[0,by+.15,-.2],[0,gy-.2,-.2],[0,gy+3.0,-8.4],[.9,0,0],fl*.5),{P:GS,c:SAILCOL,g:.1,gold:g});
 // deck furniture
 const dyz=z=>dy(U(z));
 // aft cabin trunk
 draw(BOX,{P:SP,p:[0,dyz(-6.5)+.55,-6.5],s:[3.6,1.1,4.2],c:[.88,.86,.78],pat:2,patS:3,gold:g});draw(BOX,{P:SP,p:[0,dyz(-6.5)+1.15,-6.5],s:[3.9,.12,4.5],c:[.55,.42,.26],gold:g});
 for(const sd of[-1,1])for(const zz of[-7.6,-5.4])draw(BOX,{P:SP,p:[sd*1.81,dyz(-6.5)+.6,zz],s:[.03,.38,.5],c:[.2,.25,.32],g:.8});
 draw(BOX,{P:SP,p:[0,dyz(-6.5)+.5,-4.38],s:[.8,.95,.05],c:[.48,.32,.18]});
 // galley deckhouse
 draw(BOX,{P:SP,p:[0,dyz(1.8)+.8,1.8],s:[2.6,1.6,2.8],c:[.9,.88,.8],pat:2,patS:3});draw(BOX,{P:SP,p:[0,dyz(1.8)+1.65,1.8],s:[2.9,.12,3.1],c:[.55,.42,.26]});draw(CYL,{P:SP,p:[.6,dyz(1.8)+1.6,2.4],s:[.13,.9,.13],c:[.2,.2,.2]});
 for(const sd of[-1,1])draw(BOX,{P:SP,p:[sd*1.31,dyz(1.8)+1.0,1.8],s:[.03,.4,.5],c:[.2,.25,.32],g:.8});
 // main hatch (lifeboat stowed over it) + fore hatch
 const hz=-1.6,fz=7.6;const hatchOpen=o.hatchOpen||0;
 draw(BOX,{P:SP,p:[0,dyz(hz)+.25,hz],s:[2.2,.5,2.6],c:[.5,.38,.24],pat:2,patS:3});draw(BOX,{P:SP,p:[0,dyz(fz)+.25,fz],s:[1.8,.5,1.8],c:[.5,.38,.24],pat:2,patS:3});
 if(!hatchOpen){draw(BOX,{P:SP,p:[0,dyz(hz)+.52,hz],s:[2.0,.06,2.4],c:[.62,.48,.3],pat:2,patS:3});draw(BOX,{P:SP,p:[0,dyz(fz)+.52,fz],s:[1.6,.06,1.6],c:[.62,.48,.3],pat:2,patS:3});}
 else{draw(BOX,{P:SP,p:[0,dyz(hz)+.5,hz],s:[1.9,.02,2.3],c:[.05,.04,.03]});draw(BOX,{P:SP,p:[0,dyz(fz)+.5,fz],s:[1.5,.02,1.5],c:[.05,.04,.03]});
  draw(BOX,{P:SP,p:[2.0,dyz(hz)+.06,hz+.3],r:[0,.3,0],s:[1.0,.06,2.4],c:[.62,.48,.3],pat:2,patS:3,gold:o.gHatch||0});draw(BOX,{P:SP,p:[-1.7,dyz(fz)+.06,fz-.2],r:[0,-.4,0],s:[1.6,.06,1.6],c:[.62,.48,.3],pat:2,patS:3,gold:o.gHatch||0});}
 // boat chocks over main hatch
 for(const zz of[hz-1,hz+1])draw(BOX,{P:SP,p:[0,dyz(hz)+.7,zz],s:[1.4,.3,.25],c:[.45,.32,.2],gold:o.gChock||0});
 if(o.boat!==0)boat(cxf(SP,xf([0,dyz(hz)+.95,hz])),{});
 // pump near mainmast
 const pz=zm-1.4,py=dyz(pz);const pa=o.pumpApart||0;draw(CYL,{P:SP,p:[1.2,py,pz],s:[.18,1.0,.18],c:[.45,.35,.25],gold:o.gPump||0});
 if(!pa){draw(BOX,{P:SP,p:[1.2,py+1.05,pz],r:[0,0,.35],s:[1.3,.07,.07],c:[.4,.3,.2],gold:o.gPump||0});}
 else{draw(BOX,{P:SP,p:[1.9,py+.06,pz+.6],r:[0,.6,0],s:[1.3,.07,.07],c:[.4,.3,.2],gold:o.gPump||0});draw(CYL,{P:SP,p:[1.6,py+.1,pz-.7],r:[0,0,Math.PI/2],s:[.12,.6,.12],c:[.45,.35,.25],gold:o.gPump||0});draw(CYL,{P:SP,p:[.5,py+.05,pz+.4],r:[0,.3,Math.PI/2-.05],s:[.03,1.8,.03],c:[.35,.3,.25],gold:o.gPump||0});}
 // wheel at stern
 const wz=-9.6;draw(BOX,{P:SP,p:[0,dyz(wz)+.5,wz],s:[.35,1.0,.35],c:[.5,.36,.2]});wheel(cxf(SP,xf([0,dyz(wz)+1.15,wz+.25])),o.wheelSpin||0,o.gWheel||0);
 // barrels lashed on deck
 for(let k=0;k<3;k++)barrel(cxf(SP,xf([-2.1,dyz(4.5),3.8+k*.75])),[.55,.38,.22]);
 // anchor cats at bow
 for(const sd of[-1,1])draw(BOX,{P:SP,p:[sd*1.9,S.top(.88)+.1,L*.38],r:[0,sd*.5,0],s:[.18,.18,1.4],c:[.4,.3,.2]});
 if(o.foam){for(const sd of[-1,1])draw(SPHL,{P:SP,p:[sd*1.6,.02,L*.36],r:[0,sd*.3,0],s:[.9,.05,4.5],c:[.97,.99,1],a:.65*o.foam,u:1});draw(SPHL,{P:SP,p:[0,.02,-L*.7],s:[2.8,.04,6],c:[.95,.98,1],a:.35*o.foam,u:1});}}
// ship pose on sea: bob/roll
function seaP(p,yaw,t,k){k=k===undefined?1:k;return xf([p[0],p[1]+Math.sin(t*1.1)*.12*k,p[2]],[Math.sin(t*.8)*.03*k,yaw,Math.sin(t*.95+1)*.05*k]);}
