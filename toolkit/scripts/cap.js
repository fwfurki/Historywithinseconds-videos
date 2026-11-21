const {chromium}=require(process.env.PW||'/opt/npm-tools/node_modules/playwright');const fs=require('fs');const {spawn}=require('child_process');
(async()=>{const mode=process.argv[2];const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--enable-webgl']});
const p=await b.newPage({viewport:{width:720,height:1280}});p.on('console',m=>console.log('PAGE',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto(process.env.SCENE||'file:///home/claude/v/scene.html');await p.evaluate(()=>document.fonts.ready);
if(mode==='test'){for(const f of process.argv.slice(3)){const t=Date.now();const d=await p.evaluate(i=>renderFrame(i),+f);fs.writeFileSync(`test_${f}.jpg`,Buffer.from(d.split(',')[1],'base64'));console.log(f,Date.now()-t,'ms');}}
else{const a=+process.argv[3],z=+process.argv[4];const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-crf','16','-preset','veryfast','-pix_fmt','yuv420p',process.argv[5]]);
for(let i=a;i<z;i++){const d=await p.evaluate(i=>renderFrame(i),i);if(!ff.stdin.write(Buffer.from(d.split(',')[1],'base64')))await new Promise(r=>ff.stdin.once('drain',r));if(i%300==0)console.log(i);}
ff.stdin.end();await new Promise(r=>ff.on('close',r));}
await b.close();})();
