import re
segs=[(0,1.51,"In thirty-four seconds,"),(1.85,4.06,"the largest aircraft ever flown"),(4.27,6.06,"became a skeleton of fire."),(6.98,7.79,"May sixth,"),(8.02,9.17,"nineteen thirty-seven."),
(9.74,11.10,"Lakehurst, New Jersey."),(11.77,13.83,"The Hindenburg glides in to land."),(14.39,15.77,"Eight hundred feet long."),(16.34,18.20,"Ninety-seven people on board."),
(19.01,19.97,"Above their heads..."),(20.36,23.09,"seven million cubic feet of hydrogen."),(23.86,25.50,"Shortly after seven PM,"),(25.72,27.69,"the ground crew grabs the landing ropes."),
(28.31,28.63,"Then..."),(29.17,30.88,"a flicker of flame near the tail."),(31.51,34.29,"In seconds, the fire races toward the nose."),(34.80,37.22,"The giant airship crashes to the ground."),
(37.74,39.26,"People leap from the windows."),(39.54,41.40,"Some stagger out of the flames."),(41.91,43.56,"A radio reporter is recording."),(43.90,44.62,"He cries out:"),
(44.97,46.44,"\u201cOh, the humanity!\u201d"),(47.12,48.61,"Thirty-six people die."),(49.16,50.68,"Sixty-two survive."),(51.36,52.14,"To this day,"),
(52.50,55.05,"no one knows for certain what sparked the fire."),(55.78,57.72,"And the age of the giant airships..."),(58.09,59.09,"ended that night.")]
def syl(w):
    w=re.sub('[^a-z]','',w.lower()) or 'a';n=len(re.findall('[aeiouy]+',w));n-= w.endswith('e') and n>1;return max(1,n)+.3
def ts(t):h=int(t//3600);m=int(t%3600//60);s=t%60;return f"{h}:{m:02d}:{s:05.2f}"
ev=[]
for a,b,txt in segs:
    ws=txt.split();wt=[syl(w) for w in ws];tot=sum(wt);t=a;times=[]
    for w,x in zip(ws,wt):d=(b-a)*x/tot;times.append((t,t+d));t+=d
    # chunk into <=3 words, break after punctuation
    chunks=[];cur=[]
    for i,w in enumerate(ws):
        cur.append(i)
        if len(cur)==3 or re.search(r'[,.]$',w) or sum(len(ws[j]) for j in cur)>16:chunks.append(cur);cur=[]
    if cur:chunks.append(cur)
    for ci,ch in enumerate(chunks):
        for k,i in enumerate(ch):
            st=times[i][0];en=times[i][1] if k<len(ch)-1 else (times[ch[0]][0] if False else min(times[i][1]+.25, chunks[ci+1] and times[chunks[ci+1][0]][0] if ci+1<len(chunks) else b+.35))
            parts=[]
            for j in ch:
                w=ws[j].upper().rstrip('.,:')
                parts.append(("{\\c&H00B4FF&\\fscx108\\fscy108}"+w+"{\\c&HFFFFFF&\\fscx100\\fscy100}") if j==i else w)
            ev.append(f"Dialogue: 0,{ts(st)},{ts(en)},S,,0,0,0,,"+" ".join(parts))
hdr="""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: S,Montserrat,80,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,1,0,1,8,4,2,90,190,640,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
open('hb/subs.ass','w').write(hdr+"\n".join(ev)+"\n")
print(len(ev))
