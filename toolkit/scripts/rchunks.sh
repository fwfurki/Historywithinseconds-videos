#!/bin/bash
# rchunks.sh DIR START END  -> renders chunks of 150 frames into DIR/c/NNNNN.mp4 (skips done ones)
D=$1;A=$2;Z=$3;mkdir -p $D/c
for ((s=A;s<Z;s+=150)); do e=$((s+150));[ $e -gt $Z ] && e=$Z;f=$(printf "%s/c/%05d.mp4" $D $s)
 [ -f "$f" ] && continue
 SCENE=file://$D/scene_render.html node /home/claude/historywithinseconds-videos/toolkit/scripts/cap.js full $s $e $f.tmp.mp4 >/dev/null 2>&1 && mv $f.tmp.mp4 $f
done
