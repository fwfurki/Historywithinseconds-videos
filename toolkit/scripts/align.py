import sys,re,json,ast
script=open(sys.argv[1]).read().replace('\n',' ')
segs=ast.literal_eval(open(sys.argv[2]).read().split('\n')[1])
words=script.split()
def syl(w):
    w2=re.sub('[^a-z]','',w.lower()) or 'a';n=len(re.findall('[aeiouy]+',w2));n-= w2.endswith('e') and n>1;return max(1,n)
sy=[syl(w)+.35 for w in words]
total=sum(sy);dur=sum(b-a for a,b in segs);rate=dur/total
N=len(words);M=len(segs);INF=1e18
import functools
pre=[0]
for s in sy:pre.append(pre[-1]+s)
def cost(i,j,k):
    d=(pre[j]-pre[i])*rate;D=segs[k][1]-segs[k][0]
    c=((d-D)/max(D,.4))**2
    if not re.search(r'[,.?!:;"…]$',words[j-1]) and j<N: c+=1.5
    return c
dp=[[INF]*(N+1) for _ in range(M+1)];bk=[[0]*(N+1) for _ in range(M+1)];dp[0][0]=0
for k in range(M):
    for i in range(N):
        if dp[k][i]>=INF:continue
        for j in range(i+1,min(N,i+30)+1):
            c=dp[k][i]+cost(i,j,k)
            if c<dp[k+1][j]:dp[k+1][j]=c;bk[k+1][j]=i
j=N;out=[]
for k in range(M,0,-1):
    i=bk[k][j];out.append((segs[k-1][0],segs[k-1][1],' '.join(words[i:j])));j=i
out.reverse()
for o in out:print(o)
json.dump(out,open(sys.argv[3],'w'))
