// ---------- CHRONICLE explanation system (HistoryWithinSeconds) ----------
const NAVY='#0E1B2C',PARCH='#EFE3C8',GOLD='#FFB52E',INK='#2a2118';
const CF='Cinzel',MF='Montserrat';
function rrect(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath();}
// land texture (equirectangular) for the globe
const LANDTEX=(()=>{const c=document.createElement('canvas');c.width=2048;c.height=1024;const g=c.getContext('2d');g.fillStyle='#3d8fd1';g.fillRect(0,0,2048,1024);
 // subtle ocean bands
 for(let i=0;i<12;i++){g.fillStyle=`rgba(255,255,255,${.03})`;g.fillRect(0,i*90,2048,40);}
 g.fillStyle='#8cc56a';g.strokeStyle='#2c4a22';g.lineWidth=3;
 LAND.forEach(poly=>{g.beginPath();poly.forEach(([x,y],i)=>{const X=(x+180)/360*2048,Y=(90-y)/180*1024;i?g.lineTo(X,Y):g.moveTo(X,Y);});g.closePath();g.fill();g.stroke();});
 // ice caps tint
 g.fillStyle='rgba(245,248,250,.9)';g.fillRect(0,0,2048,40);g.fillRect(0,960,2048,64);return c;})();
// draw globe (3D) — lon/lat to face camera; returns pin world pos
function globe3D(P,lon,lat,spin,pin){useTex('land',LANDTEX);
 // orient so (lon,lat) faces +z, then spin offset
 const G=cxf(P,xf([0,0,0],[lat*Math.PI/180,0,0]));const G2=cxf(G,xf([0,0,0],[0,(90-lon)*Math.PI/180+spin,0]));
 draw(SPH,{P:G2,s:[1,1,1],c:[1,1,1],tex:2});
 draw(SPH,{P,s:[1.06,1.06,1.06],c:[.6,.85,1],a:.18,u:1});
 if(pin>0){const L=lon*Math.PI/180,A=lat*Math.PI/180;// pin at front (after rotation, location is at +z when spin=0)
  const pp=[Math.sin(-spin)*0+0,0,1];const PP=cxf(P,xf([0,0,1.0],[Math.PI/2,0,0],1));
  draw(CONE,{P:PP,p:[0,.22*pin,0],r:[Math.PI,0,0],s:[.05*pin,.22*pin,.05*pin],c:[1,.71,.18],gold:1});draw(SPH,{P:PP,p:[0,.29*pin,0],s:[.075*pin,.075*pin,.075*pin],c:[1,.75,.25],gold:1});}}
// corner badge: mini globe + PLACE / YEAR (2D), bottom-left above subtitles
function badge(place,year,lon,lat,t,alpha){if(alpha<=0)return;const x=60,y=1530,R=46;cx.save();cx.globalAlpha=alpha;cx.font=`700 30px ${CF}`;let bw=cx.measureText(place).width;cx.font=`800 26px ${MF}`;bw=Math.max(bw,cx.measureText(year).width)+2*R+60;
 rrect(x-12,y-R-12,bw,2*R+24,(R+12));cx.fillStyle='rgba(14,27,44,.72)';cx.fill();cx.strokeStyle='rgba(255,181,46,.85)';cx.lineWidth=2.5;cx.stroke();
 const gx=x+R,gy=y;cx.save();cx.beginPath();cx.arc(gx,gy,R,0,Math.PI*2);cx.clip();cx.fillStyle='#3d8fd1';cx.fillRect(gx-R,gy-R,2*R,2*R);
 const l0=(lon+Math.sin(t*.3)*8)*Math.PI/180,p0=lat*.6*Math.PI/180;cx.fillStyle='#8cc56a';cx.strokeStyle='#2c4a22';cx.lineWidth=1;
 LAND.forEach(poly=>{cx.beginPath();let vis=0,first=true;poly.forEach(([lo,la])=>{const L=lo*Math.PI/180-l0,A=la*Math.PI/180;const X=Math.cos(A)*Math.sin(L),Y=Math.sin(A)*Math.cos(p0)-Math.cos(A)*Math.cos(L)*Math.sin(p0),Z=Math.sin(A)*Math.sin(p0)+Math.cos(A)*Math.cos(L)*Math.cos(p0);
  let px=X,py=Y;if(Z<0){const k=1/Math.hypot(X,Y);px=X*k;py=Y*k;}else vis=1;const sx=gx+px*R,sy=gy-py*R;if(first){cx.moveTo(sx,sy);first=false;}else cx.lineTo(sx,sy);});if(vis){cx.fill();cx.stroke();}});
 const g=cx.createRadialGradient(gx-R*.35,gy-R*.4,R*.1,gx,gy,R);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(0,0,30,.35)');cx.fillStyle=g;cx.fillRect(gx-R,gy-R,2*R,2*R);cx.restore();
 cx.beginPath();cx.arc(gx,gy,R,0,Math.PI*2);cx.strokeStyle=GOLD;cx.lineWidth=2.5;cx.stroke();
 const pulse=.5+.5*Math.sin(t*4);cx.beginPath();cx.arc(gx,gy,5+pulse*4,0,Math.PI*2);cx.fillStyle=GOLD;cx.fill();
 cx.textBaseline='middle';cx.textAlign='left';cx.fillStyle=PARCH;cx.font=`700 30px ${CF}`;cx.fillText(place,x+2*R+20,y-16);
 cx.fillStyle=GOLD;cx.font=`800 26px ${MF}`;cx.fillText(year,x+2*R+20,y+20);cx.restore();}
// timeline ribbon: keys=[[time,pos(0..1),label],...]
function ribbon(T,keys,range,alphaAll){if(alphaAll<=0)return;let k=0;for(let i=0;i<keys.length;i++)if(T>=keys[i][0])k=i;
 const kt=keys[k][0],prev=keys[Math.max(0,k-1)];const mv=ss(kt,kt+1.1,T);const pos=k>0?lerp(prev[1],keys[k][1],mv):keys[0][1];
 const active=Math.max(1-ss(kt+2.2,kt+3.2,T),0);const a=(.45+.55*active)*alphaAll;
 const x0=120,x1=960,y=205;cx.save();cx.globalAlpha=a;
 cx.fillStyle='rgba(14,27,44,.55)';rrect(x0-30,y-26,x1-x0+60,52,26);cx.fill();
 cx.strokeStyle=PARCH;cx.lineWidth=4;cx.beginPath();cx.moveTo(x0,y);cx.lineTo(x1,y);cx.stroke();
 for(let i=0;i<=20;i++){const xx=lerp(x0,x1,i/20);const big=i%5==0;cx.lineWidth=big?3:2;cx.beginPath();cx.moveTo(xx,y-(big?13:7));cx.lineTo(xx,y+(big?13:7));cx.stroke();}
 cx.font=`600 20px ${MF}`;cx.fillStyle='rgba(239,227,200,.8)';cx.textAlign='left';cx.fillText(range[0],x0-10,y+44);cx.textAlign='right';cx.fillText(range[1],x1+10,y+44);
 const mx=lerp(x0,x1,pos);cx.fillStyle=GOLD;cx.beginPath();cx.moveTo(mx,y+16);cx.lineTo(mx-13,y-4);cx.lineTo(mx-13,y-18);cx.lineTo(mx+13,y-18);cx.lineTo(mx+13,y-4);cx.closePath();cx.fill();
 cx.shadowColor='rgba(255,181,46,.9)';cx.shadowBlur=18*active;cx.fill();cx.shadowBlur=0;
 const lab=keys[k][2];cx.font=`700 40px ${CF}`;cx.textAlign='center';const tw=cx.measureText(lab).width;const lx=clamp(mx,tw/2+40,W-tw/2-40);
 cx.globalAlpha=alphaAll*(.6+.4*active);cx.fillStyle='rgba(14,27,44,.78)';rrect(lx-tw/2-22,y+34,tw+44,58,14);cx.fill();cx.strokeStyle='rgba(255,181,46,.7)';cx.lineWidth=2;cx.stroke();
 cx.fillStyle=PARCH;cx.textBaseline='middle';cx.fillText(lab,lx,y+64);cx.restore();}
// museum label card near (x,y)
function museum(name,role,years,x,y,t0,t1,T,side){if(T<t0||T>t1)return;const a=Math.min(ss(t0,t0+.35,T),1-ss(t1-.35,t1,T));const dx=(1-a)*(side==='l'?-60:60);
 cx.save();cx.globalAlpha=a;cx.font=`700 42px ${CF}`;const w1=cx.measureText(name).width;cx.font=`600 28px ${MF}`;const w2=cx.measureText(role).width;const w=Math.max(w1,w2,200)+64;const h=years?168:130;
 const X=clamp(x+dx-(side==='l'?w:0),30,W-30-w),Y=y;cx.shadowColor='rgba(0,0,0,.35)';cx.shadowBlur=18;cx.shadowOffsetY=6;
 cx.fillStyle=PARCH;rrect(X,Y,w,h,10);cx.fill();cx.shadowColor='transparent';
 cx.strokeStyle='#b8862a';cx.lineWidth=2;rrect(X+8,Y+8,w-16,h-16,6);cx.stroke();
 cx.fillStyle=GOLD;cx.fillRect(X+32,Y+70,w-64,3);
 cx.fillStyle=INK;cx.textAlign='left';cx.textBaseline='middle';cx.font=`700 42px ${CF}`;cx.fillText(name,X+32,Y+42);
 cx.font=`600 28px ${MF}`;cx.fillStyle='#4a3b2a';cx.fillText(role,X+32,Y+100);if(years){cx.font=`700 28px ${CF}`;cx.fillStyle='#9a6a12';cx.fillText(years,X+32,Y+138);}cx.restore();}
// chapter seal (stamped wax seal + word) ~1.1s
const ROM=['','I','II','III','IV','V','VI'];
function seal(n,word,t0,T){const d=T-t0;if(d<0||d>1.25)return;const a=Math.min(1,(1.25-d)/.25);const k=d<.16?2.2-1.2*(d/.16):1+.05*Math.exp(-(d-.16)*10)*Math.sin((d-.16)*40);
 const x=W/2,y=(typeof SEAL_Y!=="undefined"?SEAL_Y:760);cx.save();cx.globalAlpha=a;cx.translate(x,y);cx.scale(k,k);
 cx.fillStyle='rgba(14,27,44,.75)';rrect(-250,90,500,76,38);cx.fill();cx.strokeStyle=GOLD;cx.lineWidth=2;cx.stroke();
 cx.fillStyle=PARCH;cx.font=`700 40px ${CF}`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(ROM[n]+' · '+word,0,129);
 cx.beginPath();for(let i=0;i<=48;i++){const an=i/48*Math.PI*2;const r=86+(i%2?6:0)+Math.sin(an*5)*3;cx.lineTo(Math.cos(an)*r,Math.sin(an)*r);}cx.closePath();
 const g=cx.createRadialGradient(-25,-25,10,0,0,95);g.addColorStop(0,'#ffe08a');g.addColorStop(.6,'#e09a1c');g.addColorStop(1,'#9a5f08');cx.fillStyle=g;cx.fill();
 cx.beginPath();cx.arc(0,0,64,0,Math.PI*2);cx.strokeStyle='rgba(110,64,6,.8)';cx.lineWidth=4;cx.stroke();
 cx.fillStyle='#6b3f05';cx.font=`900 64px ${CF}`;cx.fillText(ROM[n],0,4);cx.fillStyle='rgba(255,240,190,.55)';cx.fillText(ROM[n],-2,1);cx.restore();}
// brass odometer plaque texture (canvas) -> used on a 3D quad
const PLQ=document.createElement('canvas');PLQ.width=1024;PLQ.height=512;const PG=PLQ.getContext('2d');
function plaqueTex(value,digits,caption){const g=PG;g.clearRect(0,0,1024,512);const gr=g.createLinearGradient(0,0,0,512);gr.addColorStop(0,'#f3cf6f');gr.addColorStop(.5,'#c9932c');gr.addColorStop(1,'#9b6a17');g.fillStyle=gr;g.fillRect(0,0,1024,512);
 g.strokeStyle='#6e4a0e';g.lineWidth=14;g.strokeRect(14,14,996,484);g.strokeStyle='#ffe7a3';g.lineWidth=4;g.strokeRect(34,34,956,444);
 for(const[x,y]of[[60,60],[964,60],[60,452],[964,452]]){g.beginPath();g.arc(x,y,13,0,Math.PI*2);g.fillStyle='#7a5512';g.fill();}
 const n=digits,cw=Math.min(150,800/n),x0=512-n*cw/2,y0=90,ch=230;
 for(let i=0;i<n;i++){const X=x0+i*cw+6;g.fillStyle='#1b1712';g.fillRect(X,y0,cw-12,ch);const place=Math.pow(10,n-1-i);const v=value/place;const dig=Math.floor(v)%10;let fr=v-Math.floor(v);
  // roll: only the fraction near the end of each count rolls
  fr=i==n-1?fr:ss(.9,1,fr);g.save();g.beginPath();g.rect(X,y0,cw-12,ch);g.clip();g.fillStyle='#f4ead2';g.font=`700 ${Math.floor(cw*1.15)}px ${CF}`;g.textAlign='center';g.textBaseline='middle';
  for(const k of[0,1]){g.fillText(String((dig+k)%10),X+(cw-12)/2,y0+ch/2+10+(k-fr)*ch);}
  g.restore();const sh=g.createLinearGradient(0,y0,0,y0+ch);sh.addColorStop(0,'rgba(0,0,0,.6)');sh.addColorStop(.2,'rgba(0,0,0,0)');sh.addColorStop(.8,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,0,.6)');g.fillStyle=sh;g.fillRect(X,y0,cw-12,ch);}
 g.fillStyle='#4a300a';g.font=`700 64px ${CF}`;g.textAlign='center';g.textBaseline='middle';g.fillText(caption,512,400);g.fillStyle='rgba(255,236,170,.6)';g.fillText(caption,510,397);}
function dynTex(key,c){useTex(key,c);gl.activeTexture(gl.TEXTURE3);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);gl.activeTexture(gl.TEXTURE0);}
function plaque3D(P,value,digits,caption,k){plaqueTex(value,digits,caption);dynTex('plq_dyn',PLQ);
 k=k||1;const id=nextId();draw(BOX,{P,p:[0,0,-.06*k],s:[2.25*k,1.18*k,.1*k],c:[.55,.38,.12],g:.6,id});draw(QUAD,{P,p:[0,0,0],s:[2*k,1*k,1],c:[1,1,1],tex:1,u:1,id});}
// subtitles: navy pill, parchment text, amber key word
function subtitle(T,SUBS){let cur=null;for(const s of SUBS)if(T>=s[0]&&T<s[1]){cur=s;break;}if(!cur)return;const[a,b,words,key]=cur;const k=ss(a,a+.14,T),o=1-ss(b-.08,b,T);
 cx.save();cx.globalAlpha=Math.min(k,o);cx.font=`800 64px ${MF}`;const sp=cx.measureText(' ').width;const ws=words.map(w=>cx.measureText(w).width);let tw=ws.reduce((x,y)=>x+y,0)+sp*(words.length-1);
 let sc=1;if(tw>780){sc=780/tw;}const y=1344+(1-k)*18;cx.translate(W/2,y);cx.scale(sc,sc);
 cx.fillStyle='rgba(14,27,44,.72)';rrect(-tw/2-36,-52,tw+72,104,52);cx.fill();
 let x=-tw/2;cx.textBaseline='middle';cx.textAlign='left';words.forEach((w,i)=>{cx.fillStyle=(i===key)?GOLD:'#F6EEDC';cx.fillText(w,x,4);x+=ws[i]+sp;});cx.restore();}
function flash(a,col){if(a<=0)return;cx.fillStyle=col||`rgba(255,240,210,${a})`;cx.globalAlpha=1;if(!col)cx.fillStyle=`rgba(255,240,210,${a})`;cx.fillRect(0,0,W,H);}
function dark(a){if(a<=0)return;cx.fillStyle=`rgba(0,0,0,${Math.min(1,a)})`;cx.fillRect(0,0,W,H);}
// archive card + outro
function archiveCard(lines,t0,T){if(T<t0)return;const a=ss(t0,t0+.5,T);cx.save();cx.globalAlpha=a;const w=860,h=110+lines.length*62,X=(W-w)/2,Y=560+(1-a)*30;
 cx.shadowColor='rgba(0,0,0,.5)';cx.shadowBlur=30;cx.fillStyle=PARCH;rrect(X,Y,w,h,14);cx.fill();cx.shadowColor='transparent';cx.strokeStyle='#b8862a';cx.lineWidth=3;rrect(X+12,Y+12,w-24,h-24,8);cx.stroke();
 cx.fillStyle='#9a6a12';cx.font=`700 30px ${CF}`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText('· THE ARCHIVE ·',W/2,Y+52);cx.fillStyle=GOLD;cx.fillRect(W/2-150,Y+80,300,3);
 cx.fillStyle=INK;cx.font=`700 40px ${MF}`;lines.forEach((l,i)=>{if(typeof l==='object'){cx.fillStyle='#9a6a12';cx.font=`700 46px ${CF}`;cx.fillText(l[0],W/2,Y+130+i*62);cx.fillStyle=INK;cx.font=`700 40px ${MF}`;}else cx.fillText(l,W/2,Y+130+i*62);});cx.restore();}
function outro(t0,T){if(T<t0)return;const a=ss(t0,t0+.6,T);cx.save();cx.globalAlpha=a;cx.fillStyle='rgba(14,27,44,.86)';cx.fillRect(0,0,W,H);
 cx.textAlign='center';cx.textBaseline='middle';cx.fillStyle=PARCH;cx.font=`700 96px ${CF}`;cx.fillText('HISTORY',W/2,820);cx.fillStyle=GOLD;cx.font=`700 64px ${CF}`;cx.fillText('WITHIN SECONDS',W/2,920);
 cx.fillStyle=GOLD;cx.fillRect(W/2-200,985,400,3);cx.fillStyle='#d9ccb0';cx.font=`700 44px ${MF}`;cx.fillText('Follow for more',W/2,1060);cx.restore();}
// in-scene simple label (small parchment tag) for places/objects
function tag(txt,x,y,t0,t1,T,o){if(T<t0||T>t1)return;o=o||{};const a=Math.min(ss(t0,t0+.25,T),1-ss(t1-.25,t1,T));cx.save();cx.globalAlpha=a;cx.font=`700 ${o.size||40}px ${o.f||CF}`;const w=cx.measureText(txt).width+44;
 const X=clamp(x-w/2,24,W-24-w);cx.fillStyle=o.bg||'rgba(239,227,200,.95)';rrect(X,y-34,w,68,12);cx.fill();cx.strokeStyle=GOLD;cx.lineWidth=3;cx.stroke();
 if(o.pointer){cx.beginPath();cx.moveTo(clamp(x,X+20,X+w-20)-12,y+34);cx.lineTo(clamp(x,X+20,X+w-20)+12,y+34);cx.lineTo(clamp(x,X+20,X+w-20),y+54);cx.closePath();cx.fillStyle=o.bg||'rgba(239,227,200,.95)';cx.fill();}
 cx.fillStyle=o.color||INK;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(txt,X+w/2,y+2);cx.restore();}
// big centre title (hook)
function bigText(lines,t0,t1,T,y){if(T<t0||T>t1)return;const a=Math.min(ss(t0,t0+.2,T),1-ss(t1-.25,t1,T));cx.save();cx.globalAlpha=a;cx.textAlign='center';cx.textBaseline='middle';
 lines.forEach((l,i)=>{const[txt,size,col]=l;cx.font=`700 ${size}px ${CF}`;cx.lineWidth=size*.16;cx.strokeStyle='rgba(14,27,44,.9)';cx.lineJoin='round';const yy=(y||560)+i*size*1.15;cx.strokeText(txt,W/2,yy);cx.fillStyle=col||PARCH;cx.fillText(txt,W/2,yy);});cx.restore();}
