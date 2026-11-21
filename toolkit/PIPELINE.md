# HistoryWithinSeconds: daily video pipeline

This is the playbook for the daily scheduled run. Follow it end to end, with no questions to the owner.

## Channel rules (owner's requirements)
- **Only post videos you create in this run, on NEW topics you choose yourself.** Never post, reuse or reschedule any older video in `videos/` (the files there are archived; several were made at the owner's request and must NOT be posted).
- TikTok channel **HistoryWithinSeconds**: bizarre, disturbing, lesser-known (or famous but gripping) historical events. Audience: **US / English-speaking, not Turkish**.
- Visuals: **fully 3D**, made with code only (the WebGL engine in `toolkit/engine`). No real photos or footage, no paintings, no slideshows, no external AI image or video services.
- **Bright, clearly visible lighting** (an earlier video was too dark). A strong **hook** in the first 3 seconds and real **suspense**.
- Every scene must be **understandable from the animation alone**: show the action clearly (who, what, where), not abstract shapes. Use a few short on-screen labels per scene. Detailed models (tapered hulls, windows, figures with hats and limbs and so on), not bare blocks.
- Narration: ElevenLabs voice **"True - Crime & Horror Narrator"** (voice_id `tZssYepgGaQmegsMEXjK`), model `eleven_v4`, **generations_count 1** (one take only; never retry a generation). Be economical with credits.
- **Every final video must be over 60 s** (aim for 65–75 s; TikTok Creator Rewards needs more than 1 minute). Scripts run about 150–170 words. Measure the MP3; if the narration is under 61 s, extend the ending with an outro card ("HISTORY / WITHIN SECONDS / Follow for more") so the video reaches at least 61.5 s.
- Gore: none. Keep injuries and deaths non-graphic (silhouettes, X-ray style, aftermath).
- Facts: web-search and verify every number, date and quote before narrating. Hedge where sources disagree.
- Music and SFX: synthesize them yourself with numpy (`sfx_template.py`), so they're copyright-free.
- Avoid Nazi symbols and other hate symbols in visuals.

## Posting schedule (Metricool free plan: about 50 posts/month)
- Brand blogId **8271048**, network **tiktok**, autoPublish **true**, tiktokData.isAigc **true**, and tiktokData.title is **required**.
- Pattern **2-2-1**, repeating from **Sun 2026-11-22**: day index = days since 2026-11-22; index mod 3 is 0 or 1 → 2 posts (12:00 and 18:00 America/New_York); index mod 3 is 2 → 1 post (18:00 America/New_York).
- Before making anything, call getScheduledPosts for the next 4 days. Posts with `draft: true` do NOT count; treat their slots as empty and leave the drafts untouched. Find the **empty slots** of the pattern in the next 48 hours (the earliest first), and make **at most 2 videos per run** to fill them. If none are empty, stop.
- Don't schedule more than 50 posts in a calendar month (count the posts already scheduled or published that month first).
- Caption: 1–2 punchy sentences + emoji + 4–5 hashtags, always ending with `#HistoryWithinSeconds`. Title: a short hook (under 60 characters).

## Quality mode (owner's request, Nov 2026): maximum quality, no rushing
The run starts many hours before the posts go out (it fires around 01:54 ET, and the earliest slot is 12:00 ET), so **take as long as quality needs**. Never cut corners to save time. Never fill a slot that is less than 3 hours away.
- **Render natively at 1080×1920** instead of upscaling from 720p: set `W=1080,H=1920` in head.js, the canvas sizes in pre.html and the viewport in cap.js. Keep scene layouts written in 720-px units by wrapping each scene's 2D drawing in `cx.save();cx.scale(1.5,1.5); ... cx.restore();`. Use `toDataURL('image/jpeg',0.97)`. Test frames first to confirm nothing breaks; fall back to 720p only if it truly fails.
- **Richer scenes**: 8–12 distinct shots per video, with smooth cinematic camera moves (dolly, orbit, push-in), never a static camera. Detailed models (period clothing, architecture, props, terrain), atmospheric particles (dust, smoke, embers, rain, snow), and depth layering in the foreground, midground and background. Keep the lighting bright and clear.
- **Review pass**: render a test frame from the start, middle and end of *every* scene, look at each one, and fix anything muddy, dark, cluttered, off-frame or hard to understand. Repeat until every frame looks good. After the full render, extract about 12 frames from the final MP4 and check them again.
- **Sound**: a layered music bed (drone + pulse + rises at the reveals) and an SFX hit synced to each key action, mixed under a clear narration.
- **Encode**: in cap.js use `-crf 14 -preset slow`; final encode libx264 `-preset slow -crf 17 -maxrate 14M -bufsize 28M`, with no lanczos upscale when rendering natively. Keep the audio at aac 192k.

## Steps per video
1. Pick a topic **not already in `toolkit/topics.md`**. Write and verify the script (150–170 words, short lines, hook first, suspense, and a haunting last line).
2. ElevenLabs: check `account_get_usage`. If fewer than 2,000 characters remain, stop and report. Then `creative_generate_speech` (voice/model above, generations_count 1). Wait about 30 s, then `creative_get_generations` → `full_res_url`. Download it with curl (the domain elevenlabsusercontent.com is allowed).
3. Timing: `ffmpeg -i narr.mp3 -af silencedetect=n=-38dB:d=0.18 -f null -` → speech segments; map each to a script phrase (the segment count should equal the phrase count). Build the subtitles with `subs_template.py` (edit `segs` and the output path).
4. Scenes: write `scenes_own.js` (see `examples/hindenburg_scenes.js` and `pompeii_scenes.js`), defining `S=[[start,end,fn],...]` and `window.renderFrame`. Time the labels and actions to the speech segments. Assemble:
   `pre.html + '<script>' + head.js + lab.js + helpers.js + scenes_own.js + '</script></body></html>'` → `scene.html`.
   (`examples/titanic_scenes_standalone.js` carries its own helpers: assemble it with head.js + lab.js only.)
5. Test frames: `SCENE=file:///ABS/scene.html node toolkit/scripts/cap.js test 100 400 ...` → check them visually (brightness, framing, label width under 680 px), and fix.
6. Render in 2 parallel halves: `SCENE=... node cap.js full 0 N1 h1.mp4` and `... full N1 N h2.mp4` (30 fps, 1080×1920 native — see Quality mode), then concat with `-c copy`.
7. Final encode: (already 1080×1920), `vignette=PI/6`, `noise=alls=3:allf=t`, `subtitles=subs.ass`; narration at volume 2.0 with apad, the SFX bed at 0.55, amix normalize=0, alimiter 0.89; libx264 crf 17 -preset slow, maxrate 16M bufsize 32M; aac 192k; faststart. Check that the duration is over 61 s.
8. Copy the MP4 to `videos/<slug>.mp4` in this repo, commit and push (`git -c push.negotiate=true push origin HEAD`). Media URL: `https://raw.githubusercontent.com/fwfurki/Historywithinseconds-videos/main/videos/<slug>.mp4`
9. Metricool `createScheduledPost` with that URL at the slot. **Immediately** add the topic to the do-not-repeat table in `toolkit/topics.md` (topic, file, slot, post id), then commit and push **before starting the next video**, so a topic can never be used twice, even if the run stops midway.
10. End with a short summary: topics, slots, credits left, and any issues.

## Rendering environment notes
- Chrome is at /usr/bin/google-chrome; playwright is at /opt/npm-tools/node_modules/playwright (or set the PW env var).
- If the playwright path or fonts differ in the new workspace, adapt `cap.js`. The fonts used are Montserrat (labels and subtitles) and DejaVu Serif (quotes).

## MAXIMUM QUALITY MODE (owner's standing request, overrides speed)
Time is not a constraint: there is no 15–20 minute budget. Spend whatever time is needed on each video; quality comes first.
- **Script:** draft, then rewrite at least once for a sharper 3-second hook, rising suspense, a mid-video twist and a haunting final line. Verify every fact with 2+ sources.
- **Scenes:** at least 8–10 distinct scenes per video, each with deliberate camera motion (dolly, orbit, push-in), richer models (more parts, props, crowds, environment detail), particles/weather where it fits, and smooth eased transitions. No scene held static more than ~4 s.
- **Frame QA:** test-render at least one frame per scene plus each transition, view them, fix brightness/framing/clarity, then re-test. Do a second full QA pass on frames from the finished render before upload.
- **Image quality:** in `renderFrame`, return `out.toDataURL('image/jpeg',0.97)` (not 0.9). Intermediate encode is crf 12 preset slow (cap.js). Final encode crf 17 preset slow, maxrate 16M.
- **Audio:** layered SFX matched to on-screen actions, music bed that builds with the suspense and ducks under narration; listen-check levels (narration always clearly on top).
- **Subtitles:** word-synced, checked against the audio for drift.
- Never trade away these steps to finish faster. The only hard limits stay the same: 1 ElevenLabs take per video, max 2 videos per run, post limits.
