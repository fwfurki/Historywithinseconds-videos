#!/bin/bash
# test.sh <dir> frames...
D=$1;shift;cd $D && (echo -n "window.SUBS_DATA="; cat subs.json; echo ";"; cat scenes.js) > all.js && /home/claude/historywithinseconds-videos/toolkit/scripts/build.sh all.js scene.html && rm -rf t && mkdir -p t && OUTDIR=t SCENE=file://$D/scene.html timeout 900 node /home/claude/historywithinseconds-videos/toolkit/scripts/cap.js test "$@" 2>&1 | grep -E "ERR|PAGE" | grep -v "GPU stall"
cd t && python3 - <<'PY'
from PIL import Image
import glob,re
fs=sorted(glob.glob('test_*.jpg'),key=lambda f:int(re.findall(r'\d+',f)[0]))
for g in range(0,len(fs),6):
    im=Image.new('RGB',(1080,1280),'black')
    for i,f in enumerate(fs[g:g+6]):
        a=Image.open(f).resize((360,640));im.paste(a,((i%3)*360,(i//3)*640))
    im.save(f'sheet{g//6}.jpg',quality=85)
print(len(fs),'frames')
PY
