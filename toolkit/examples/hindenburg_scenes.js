
const HZ=12.3,HR=2.1;function hr(z){return HR*Math.sqrt(Math.max(0,1-(z/HZ)*(z/HZ)));}
const SEGS=[];for(let i=0;i<40;i++){const z0=-HZ+i*(2*HZ/40),z1=z0+2*HZ/40;SEGS.push([z0,z1,hr((z0+z1)/2)]);}
const WINS=merge((()=>{const L=[];for(let z=4;z<8.5;z+=.32)for(const sd of[-1,1]){const r=hr(z);L.push({p:[sd*r*.86,-r*.48,z],r:[0,0,sd*.6],s:[.03,.12,.18]});}return L;})());
const GIRD=merge((()=>{const L=[];for(let k=0;k<16;k++){const a=k/16*Math.PI*2;for(let i=0;i<40;i++){const z=-HZ+(i+.5)*(2*HZ/40);const r=hr(z)+.005;L.push({p:[Math.cos(a)*r,Math.sin(a)*r,z],s:[.03,.03,2*HZ/40+.02]});}}return L;})());
// burn: zb = burnt up to this z from tail (-HZ). burn<=-HZ means intact
function airship(P,o){o=o||{};const zb=o.zb===undefined?-99:o.zb;const sil=[.78,.78,.8];
 SEGS.forEach(([z0,z1,r])=>{const zc=(z0+z1)/2;if(zc>zb){draw(CYL,{P,p:[0,0,z0],r:[Math.PI/2,0,0],s:[r,z1-z0+.01,r],c:sil,g:.5});}
  else{draw(TUBE,{P,p:[0,0,zc],r:[Math.PI/2,0,0],s:[r,.05,r],c:[.15,.1,.08],e:o.glow?[1.2,.4,.1]:[0,0,0]});}});
 if(zb>-HZ)draw(GIRD,{P,c:[.2,.15,.12],e:o.glow?[.6,.2,.05]:[0,0,0]});
 for(let k=0;k<14;k++){const z=-HZ+1+k*1.7;if(z>zb)draw(TUBE,{P,p:[0,0,z],r:[Math.PI/2,0,0],s:[hr(z)+.01,.04,hr(z)+.01],c:[.6,.6,.62]});}
 if(zb<-9)for(let k=0;k<4;k++){const a=k*Math.PI/2;draw(BOX,{P,p:[Math.cos(a)*1.0,Math.sin(a)*1.0,-10.6],r:[0,0,a],s:[2.2,.08,2.6],c:[.7,.7,.72]});}
 if(zb<6){draw(BOX,{P,p:[0,-HR-.1,6.5],s:[.6,.4,1.6],c:[.65,.62,.6]});draw(WINS,{P,c:[.1,.1,.1],e:o.lit===0?[0,0,0]:[1.4,1,.5]});}
 if(o.fire&&zb>-HZ){for(let i=0;i<24;i++){const z=Math.max(-HZ,zb-(i%8)*1.1);const r=hr(z);const ph=(o.t*2+i*.37)%1;draw(SPH,{P,p:[Math.sin(i*2.3)*r*.7,r*.4+ph*2.5,z],s:[.8+ph,.9+ph*1.4,.8+ph],c:[.1,.05,0],e:[3,1.2*(1-ph)+.4,.2]});}
  draw(SPH,{P,p:[0,0,zb],s:[hr(zb)+.5,hr(zb)+.5,.9],e:[4,1.8,.4]});}}
function mast(x,z){draw(CYL,{p:[x,0,z],s:[.5,9,.5],c:[.55,.15,.1]});for(let k=1;k<9;k++)draw(BOX,{p:[x,k,z],s:[1.4,.06,1.4],c:[.55,.15,.1]});draw(CYL,{p:[x,9,z],s:[.8,.6,.8],c:[.4,.4,.42]});}
function hangar(){draw(BOX,{p:[-40,8,-60],s:[30,16,60],c:[.55,.55,.52]});draw(CYL,{p:[-40,16,-90],r:[Math.PI/2,0,0],s:[15,60,4],c:[.5,.5,.48]});}
const DUSK={fog:[.72,.6,.6],fogD:.006,sky:[.6,.52,.6],gnd:[.3,.28,.25],sunC:[.95,.7,.5],sunD:[.6,.25,-.6]};
function field(){draw(BOX,{p:[0,-.5,0],s:[600,1,600],c:[.35,.42,.25]});draw(BOX,{p:[0,.01,0],s:[60,.02,60],c:[.45,.42,.35]});}
// ---------- scenes ----------
const S=[[0,6.98,sA],[6.98,11.77,sB],[11.77,19.01,sC],[19.01,23.86,sD],[23.86,28.31,sE],[28.31,37.74,sF],[37.74,41.91,sG],[41.91,47.12,sH],[47.12,51.36,sI],[51.36,55.78,sJ],[55.78,59.4,sK],[59.4,64,sL]];
const SH=xf([0,9,0],[0,0,0]);
function sA(t){const zb=lerp(-HZ,HZ,ss(0,4.5,t));const tilt=-ss(1.5,5.5,t)*.35,dy=-ss(2,6,t)*5;env({...DUSK,fog:[.5,.4,.4],eye:[26,6,22],tgt:[0,6,0],fov:55,plP:[0,8,0],plC:[3,1.4,.4],plR:60});field();
 airship(xf([0,9+dy,0],[tilt,0,0]),{zb,fire:1,glow:1,t,lit:0});mast(0,15);
 label('34 SECONDS',360,240,100,.1,1.8,t,{color:'#ff6a3d'});label('THE LARGEST AIRCRAFT EVER FLOWN',360,240,34,1.85,4.2,t,{color:'#ffcf5a'});label('A SKELETON OF FIRE',360,240,56,4.25,6.9,t,{color:'#ff6a3d',stamp:1});}
function sB(t){env({...DUSK,eye:[30-t,5,40],tgt:[0,5,0],fov:52});field();mast(0,15);hangar();for(let i=0;i<10;i++)man(xf([-6+i*1.3,0,10+(i%3)],[0,Math.PI,0]),{coat:[.75,.72,.6],hat:'flat'});
 label('MAY 6, 1937',360,240,72,.1,2.7,t);label('LAKEHURST, NEW JERSEY',360,240,46,2.75,4.7,t,{color:'#8fd3ff'});}
function sC(t){const z=lerp(-34,-2,t/7.24);env({...DUSK,eye:[16,5,24],tgt:[0,8,z*.4],fov:55});field();mast(0,15);hangar();airship(xf([0,10,z],[0,0,0]),{});
 label('THE HINDENBURG',360,240,66,.1,2.6,t,{color:'#ffcf5a'});label('804 FEET LONG',360,240,66,2.62,4.5,t);label('97 PEOPLE ON BOARD',360,240,54,4.57,7.2,t,{color:'#ffcf5a'});}
function sD(t){env({fog:[.03,.08,.14],fogD:.01,sky:[.1,.2,.3],gnd:[.05,.08,.1],sunC:[.2,.3,.4],eye:[14*Math.cos(.6+t*.08),5,14*Math.sin(.6+t*.08)],tgt:[0,0,0],fov:55});
 draw(GIRD,{e:[.1,.5,.8]});for(let k=0;k<14;k++){const z=-HZ+1+k*1.7;draw(TUBE,{p:[0,0,z],r:[Math.PI/2,0,0],s:[hr(z),.03,hr(z)],e:[.2,.7,1]});}
 for(let k=0;k<13;k++){const z=-HZ+1.85+k*1.7;const r=hr(z)*.85;draw(SPH,{p:[0,0,z],s:[r,r,.75],c:[.1,.05,.03],e:[.9,.25,.1].map(v=>v*(.7+.3*Math.sin(t*3+k)))});}
 label('ABOVE THEIR HEADS...',360,240,48,.1,1.3,t);label('7 MILLION CUBIC FEET',360,240,54,1.35,4.8,t,{color:'#ff6a3d'});label('OF HYDROGEN',360,320,52,1.6,4.8,t,{color:'#ff6a3d'});}
function sE(t){env({...DUSK,eye:[10,2.2,30],tgt:[0,5,10],fov:55});field();mast(0,15);const P=xf([0,10,2],[0,0,0]);airship(P,{});
 for(let i=0;i<8;i++){const x=(i%2?1:-1)*(3+(i>>1)),z=12+(i>>1)*1.5;man(xf([x,0,z],[0,i%2?-1:1,0]),{coat:[.3,.3,.35],arms:[[-2.4,0,0],[-2.4,0,0]]});}
 for(const sd of[-1,1]){const x0=sd*1.5,y0=9,z0=14.2,x1=sd*4,y1=2,z1=13;const dx=x1-x0,dy=y1-y0,dz=z1-z0,L=Math.hypot(dx,dy,dz);draw(BOX,{p:[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],r:[Math.atan2(dz,-dy)*0,0,Math.atan2(dx,-dy)],s:[.04,L,.04],c:[.85,.8,.65]});}
 label('SHORTLY AFTER 7 PM',360,240,52,.1,1.8,t);label('THE GROUND CREW GRABS THE ROPES',360,240,32,1.85,4.4,t,{color:'#ffcf5a'});}
function sF(t){const f0=.86;const zb=t<f0?-99:lerp(-HZ+.5,HZ,ss(f0+.6,6.0,t));const crash=ss(6.4,8.6,t);
 env({...DUSK,eye:[24,4,26],tgt:[0,lerp(8,3,crash),2],fov:56,plP:[0,8,lerp(-10,10,ss(f0,6,t))],plC:t>f0?[3,1.4,.4]:[0,0,0],plR:50});field();mast(0,15);
 const P=xf([0,lerp(10,2.5,crash),2],[-crash*.25,0,0]);airship(P,{zb,fire:t>f0,glow:t>f0,t,lit:t<5?1:0});
 if(t>f0&&t<f0+.9)draw(SPH,{P,p:[0,1.6,-10.5],s:[.5,.5,.5],e:[5,2,.5]});
 for(let i=0;i<8;i++){const x=(i%2?1:-1)*(3+(i>>1)+crash*4*(i%3+1)),z=12+(i>>1)*1.5+crash*6;man(xf([x,0,z],[0,i%2?-1.4:1.4,0]),{coat:[.3,.3,.35],sw:t>f0+1?.7*Math.sin(t*10+i):0});}
 label('A FLICKER OF FLAME',360,240,52,.85,3.2,t,{color:'#ffcf5a'});label('FIRE RACES TO THE NOSE',360,240,46,3.2,6.4,t,{color:'#ff6a3d'});label('IT CRASHES',360,250,80,6.45,9.4,t,{color:'#ff6a3d',stamp:1});}
function sG(t){env({...DUSK,fog:[.5,.38,.32],eye:[12,2.4,15],tgt:[0,2,3],fov:52,plP:[0,4,0],plC:[3,1.3,.4],plR:30});field();
 airship(xf([0,2.5,2],[-.25,0,0]),{zb:HZ,fire:1,glow:1,t,lit:0});
 for(let i=0;i<5;i++){const ph=((t*.9+i*.22)%1);const y=lerp(2.2,0,Math.min(1,ph*1.4));man(xf([3+i*.6,y,3+i*.4+ph*2],[0,.8,ph>.7?0:.6]),{coat:[.4,.35,.3],sw:.8*Math.sin(t*9+i)});}
 for(let i=0;i<3;i++)man(xf([-2+i*.8,0,10+t*1.2+i],[0,.3,0]),{coat:[.25,.25,.3],sw:.4*Math.sin(t*6+i)});
 label('PEOPLE LEAP FROM THE WINDOWS',360,240,34,.1,1.75,t,{color:'#ffcf5a'});label('SOME STAGGER OUT',360,240,52,1.8,4.1,t);}
function sH(t){env({...DUSK,fog:[.45,.36,.32],eye:[-3,1.8,6],tgt:[0,1.4,-6],fov:50,plP:[0,4,-20],plC:[3,1.3,.4],plR:40});field();
 airship(xf([0,2.5,-24],[-.25,.6,0]),{zb:HZ,fire:1,glow:1,t,lit:0});
 man(xf([0,0,0],[0,Math.PI,0]),{coat:[.2,.18,.15],hat:'flat',arms:[[-1.6,0,.1],[-.3,0,-.1]]});draw(CYL,{p:[.3,0,-.4],s:[.03,1.4,.03],c:[.15,.15,.15]});draw(SPH,{p:[.3,1.45,-.4],s:[.08,.1,.08],c:[.6,.6,.62],g:.8});
 draw(BOX,{p:[-1,.5,.3],s:[.9,.5,.6],c:[.3,.2,.12]});draw(CYL,{p:[-1,.76,.3],s:[.3,.02,.3],c:[.05,.05,.05]});
 label('A RADIO REPORTER IS RECORDING',360,240,34,.1,2.9,t);label('“Oh, the humanity!”',360,250,64,3.05,5.2,t,{f:'DejaVu Serif',w:'italic 700',color:'#fff3dc'});}
function sI(t){env({...DUSK,fog:[.55,.48,.48],eye:[20-t,5,20],tgt:[0,1.5,0],fov:52});field();mast(0,15);airship(xf([0,1.6,0],[-.06,0,0]),{zb:HZ,t,lit:0});
 for(let i=0;i<20;i++){const ph=(t*.25+i*.05)%1;draw(SPH,{p:[Math.sin(i*2)*6,1+ph*10,Math.cos(i*3)*8],s:[.4+ph*1.2,.4+ph*1.2,.4+ph*1.2],c:[.3,.28,.28]});}
 label('36 PEOPLE DIE',360,240,72,.1,2.0,t,{color:'#ff6a3d'});label('62 SURVIVE',360,240,80,2.05,4.2,t,{color:'#ffcf5a'});}
function sJ(t){env({fog:[.2,.18,.2],fogD:.02,sky:[.35,.32,.36],gnd:[.15,.14,.14],sunC:[.4,.35,.35],eye:[8*Math.cos(t*.15),3.5,8*Math.sin(t*.15)+4],tgt:[0,1.5,0],fov:52});field();airship(xf([0,1.6,0],[-.06,0,0]),{zb:HZ,t,lit:0});
 label('THE CAUSE?',360,240,80,.1,1.6,t,{color:'#8fd3ff'});label('STILL NOT KNOWN FOR CERTAIN',360,240,40,1.65,4.4,t);}
function sK(t){env({...DUSK,fog:[.55,.42,.45],sunC:[.9,.55,.4],eye:[30,4,30-t*1.2],tgt:[0,7,0],fov:50});field();mast(0,15);hangar();
 label('THE END OF',360,215,50,.2,3.5,t);label('THE AIRSHIP ERA',360,285,64,.4,3.5,t,{color:'#ffcf5a'});}
function sL(t){env({fog:[.08,.07,.09],fogD:.02,sky:[.2,.18,.22],gnd:[.1,.1,.1],sunC:[.4,.35,.35],eye:[14,4,18],tgt:[0,9,0],fov:50});field();airship(xf([0,10,0],[0,t*.08,0]),{});
 label('HISTORY',360,560,80,.2,4.5,t,{color:'#ffcf5a'});label('WITHIN SECONDS',360,640,64,.35,4.5,t);label('Follow for more',360,730,34,.8,4.5,t,{color:'#c9c2b0'});}
window.renderFrame=function(i){const T=i/30;let k=S.length-1;for(let j=0;j<S.length;j++)if(T<S[j][1]){k=j;break;}const[s0,s1,fn]=S[k];
 cx.clearRect(0,0,W,H);fn(T-s0);const img=cx.getImageData(0,0,W,H);cx.drawImage(gl.canvas,0,0);
 const tmp=document.createElement('canvas');tmp.width=W;tmp.height=H;tmp.getContext('2d').putImageData(img,0,0);cx.drawImage(tmp,0,0);
 let a=0;const lt=T-s0;if(k>0)a=Math.max(a,1-lt/.25);if(k<S.length-1)a=Math.max(a,1-(s1-T)/.2);if(T>63.0)a=Math.max(a,(T-63.0)/.5);if(T<.25)a=Math.max(a,1-T/.25);
 if(fn===sF&&lt>6.4&&lt<6.8){cx.fillStyle=`rgba(255,200,140,${(1-(lt-6.4)/.4)*.6})`;cx.fillRect(0,0,W,H);}
 if(a>0){cx.fillStyle=`rgba(0,0,0,${Math.min(1,a)})`;cx.fillRect(0,0,W,H);}
 return out.toDataURL('image/jpeg',.9);};
