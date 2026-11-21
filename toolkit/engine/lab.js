// ---------- overlay text ----------
function label(txt,x,y,size,t0,t1,t,opt){opt=opt||{};if(t<t0||t>t1)return;const a=Math.min(1,(t-t0)/.25,(t1-t)/.25);const pop=opt.stamp?1+.6*Math.max(0,1-(t-t0)/.18):1+.04*(1-ss(t0,t0+.4,t));
 cx.save();cx.globalAlpha=a;cx.translate(x,y);cx.rotate(opt.rot||0);cx.scale(pop,pop);cx.font=`${opt.w||800} ${size}px ${opt.f||'Montserrat'}`;cx.textAlign='center';cx.textBaseline='middle';
 if(opt.box){const m=cx.measureText(txt).width;cx.strokeStyle=opt.color;cx.lineWidth=5;cx.strokeRect(-m/2-18,-size*.75,m+36,size*1.5);}
 cx.lineWidth=size*.14;cx.strokeStyle='rgba(0,0,0,.85)';cx.lineJoin='round';cx.strokeText(txt,0,0);cx.fillStyle=opt.color||'#f2e6d0';cx.fillText(txt,0,0);cx.restore();}
