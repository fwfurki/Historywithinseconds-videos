import json,re,sys
phr=json.load(open(sys.argv[1]));disp=[l.strip() for l in open(sys.argv[2]) if l.strip()]
assert len(phr)==len(disp),(len(phr),len(disp))
def syl(w):
    if re.search(r'\d',w):return 1.0+len(re.sub(r'\D','',w))*1.1
    w2=re.sub('[^a-z]','',w.lower()) or 'a';n=len(re.findall('[aeiouy]+',w2));n-= w2.endswith('e') and n>1;return max(1,n)+.3
subs=[]
for (a,b,_),d in zip(phr,disp):
    ws=d.split();keys=[i for i,w in enumerate(ws) if w.startswith('*')];ws=[w.lstrip('*').upper() for w in ws]
    wt=[syl(w) for w in ws];tot=sum(wt)
    # chunk
    chunks=[];cur=[]
    for i,w in enumerate(ws):
        cur.append(i)
        if len(cur)==3 or (len(cur)>=2 and sum(len(ws[j]) for j in cur)>15) or re.search(r'[,.?!…]$',w):chunks.append(cur);cur=[]
    if cur:chunks.append(cur)
    # merge single-word tail chunk into previous if short
    t=a
    for ci,ch in enumerate(chunks):
        d_=(b-a)*sum(wt[j] for j in ch)/tot
        key=next((ch.index(k) for k in keys if k in ch),-1)
        en=t+d_ if ci<len(chunks)-1 else b+0.3
        wl=[ws[j] if ws[j].endswith('...') else ws[j].rstrip('.,') for j in ch]
        if key<0:
            nk=[i for i,w in enumerate(wl) if re.search(r'\d',w)]
            key=nk[0] if nk else -1
        subs.append([round(t,3),round(en,3),wl,key])
        t+=d_
# fix overlaps: end = min(end, next start)
for i in range(len(subs)-1):subs[i][1]=min(subs[i][1],subs[i+1][0])
json.dump(subs,open(sys.argv[3],'w'))
print(len(subs))
