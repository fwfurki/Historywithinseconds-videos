#!/bin/bash
# final.sh <dir> <END seconds>
D=$1;END=$2;cd $D
ffmpeg -y -loglevel error -f concat -safe 0 -i <(printf "file '$D/h1.mp4'\nfile '$D/h2.mp4'\n") -c copy video.mp4
ffmpeg -y -loglevel error -i video.mp4 -i narr_f.wav -i music.wav -i sfx.wav -filter_complex \
"[0:v]vignette=PI/6,format=yuv420p[v];\
[1:a]aresample=44100,volume=1.0,apad=whole_dur=${END},asplit=3[nv][key][key2];\
[2:a]volume=0.30,equalizer=f=2500:t=q:w=1.5:g=-6[bed];\
[bed][key]sidechaincompress=threshold=0.015:ratio=12:attack=15:release=350[duck];\
[3:a]volume=0.55,[key2]sidechaincompress=threshold=0.02:ratio=4:attack=10:release=300[fxd];\
[nv][duck][fxd]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.89,aresample=44100[a]" \
 -map "[v]" -map "[a]" -t ${END} -c:v libx264 -preset slow -crf 17 -maxrate 16M -bufsize 32M -pix_fmt yuv420p -c:a aac -b:a 192k -ar 44100 -movflags +faststart final.mp4
ffprobe -v error -show_entries format=duration,bit_rate -of default=nw=1 final.mp4
