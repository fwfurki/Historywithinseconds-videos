# HistoryWithinSeconds: daily video pipeline

This is the playbook for the daily scheduled run. Follow it end to end, with no questions to the owner.

## Channel rules (owner's requirements)
- **Only post videos you create in this run, on NEW topics you choose yourself.** Never post, reuse or reschedule any older video in `videos/` (the files there are archived; several were made at the owner's request and must NOT be posted).
- TikTok channel **HistoryWithinSeconds**: bizarre, disturbing, lesser-known (or famous but gripping) historical events. Audience: **US / English-speaking, not Turkish**.
- Visuals: **fully 3D** in the cel-shaded style below, made with code only (the WebGL engine in `toolkit/engine`). No real photos or footage, no paintings, no slideshows, no external AI image or video services.
- **Bright, clearly visible lighting** (an earlier video was too dark). A strong **hook** in the first 3 seconds and real **suspense**.
- Every scene must be **understandable from the animation alone**: show the action clearly (who, what, where), not abstract shapes. Use a few short on-screen labels per scene. Detailed models (tapered hulls, windows, figures with hats and limbs and so on), not bare blocks.
- Narration: ElevenLabs voice **"True - Crime & Horror Narrator"** (voice_id `tZssYepgGaQmegsMEXjK`), model `eleven_v4`, **generations_count 1** (one take only; never retry a generation). Be economical with credits.
- **Every final video must be over 60 s** (aim for 65–75 s; TikTok Creator Rewards needs more than 1 minute). Scripts run about 150–170 words. Measure the MP3; if the narration is under 61 s, extend the ending with an outro card ("HISTORY / WITHIN SECONDS / Follow for more") so the video reaches at least 61.5 s.
- Gore: none. Keep injuries and deaths non-graphic (silhouettes, X-ray style, aftermath).
- Facts: web-search and verify every number, date and quote before narrating. Hedge where sources disagree.
- Music and SFX: synthesize them yourself with numpy (`sfx_template.py`), so they're copyright-free.
- Avoid Nazi symbols and other hate symbols in visuals.

## Visual style: cel-shaded 3D (owner's reference, Nov 2026; this OVERRIDES the older dark-cinematic look)
The owner likes the look of a popular explainer channel: clean, bright, cel-shaded 3D that anyone can follow at a glance. Recreate that **style** with our own branding. Never copy any other channel's name, logo, characters or wording.
- **Cel-shaded / toon 3D look**: flat, smoothly shaded colours (2–3 light bands with a toon ramp in the fragment shader, not glossy realism), plus **black ink outlines** on every character and key object. Implement the outlines in head.js with the inverted-hull method: draw each mesh a second time with front-face culling, vertices pushed out along the normals by ~0.02–0.04 units, in solid near-black. Test this on frames before rendering.
- **Semi-realistic people**: proportional adult figures with simple faces (eyes, brows, nose and mouth lines), hair, and period clothing in flat colours. Not blocky mannequins, and not chibi/cartoon.
- **Simple, readable 3D sets**: clean houses, streets, rooms, ships, fields. Few props, but each one meaningful. **Bright, even daylight or well-lit interiors**; dusk/night scenes still keep subjects clearly lit.
- **Highlight the subject in GOLD** (our signature, not red): the person/object the narration is about gets a warm **amber-gold glow** (emissive #FFB52E, brighter rim, soft halo, slow pulse) while the rest of the scene desaturates ~40%.
- **"Museum exhibit" intros** for key people (instead of police lineups): the figure stands on a slowly turning stone **plinth** in a softly lit gallery space while the camera arcs around, then the CHRONICLE label appears (see below).
- **Our own "CHRONICLE" explanation system** (unique to HistoryWithinSeconds; never use police/court/"case file" designs or black boxes with red borders). Palette: deep navy #0E1B2C, parchment #EFE3C8, amber-gold #FFB52E; serif display font **Cinzel** (OFL licence, download it from the google/fonts GitHub repo into `toolkit/fonts/`) + Montserrat. Elements:
  1. **Globe opener (first 2–3 s, alongside the hook)**: a small stylised 3D globe spins and zooms to a glowing gold pin on the location, then shrinks into a **corner badge** (bottom-left above the subtitles, small): a mini globe + `PLACE` / `YEAR`. It stays for the whole video.
  2. **Timeline ribbon**: a thin parchment ribbon along the top (below TikTok's ~140-px search bar) with tick marks; a gold marker slides along it whenever the story jumps in time, and the current date is shown in Cinzel (e.g. `14 JULY 1518`). It fades to 40% opacity when nothing is changing.
  3. **Museum labels** for people and objects: a small parchment card with a thin gold rule, appearing beside the gold-glowing subject: NAME (Cinzel), role, and lifespan (e.g. `1874–1922`). It slides in, holds ~2 s, then slides out.
  4. **Engraved counters** for key numbers: not an overlay box but a **3D brass plaque inside the scene** (on a wall, the ground or floating near the action) with **rolling odometer digits** and a short engraved caption (e.g. `DANCERS`, `DAYS ADRIFT`). Digits roll up with a mechanical click SFX as the story escalates.
  5. **Chapter seals**: at each turn of the story, a quick gold wax-seal stamp with a Roman numeral and one word (`I · THE HOOK`, `II · THE ESCALATION`, `III · THE TWIST`), stamped in with a thud SFX, ~1 s.
  6. **Ending, "THE ARCHIVE"**: the last shot pulls back into a dim archive shelf, a parchment card shows one haunting aftermath fact, then the channel outro.
  7. **Subtitles**: 2–4 words at a time, Montserrat ExtraBold, **parchment-white text in a soft rounded navy pill** (70% opacity), with the key word in **amber-gold**, centred at ~70% height, max width ~820 px of 1080. A gentle fade/slide-up, not a hard pop. No other caption style.
  Keep the overlays minimal: the 3D action is the star, and never show more than 2 overlay elements at once besides the subtitles and the corner badge.
- **Pacing**: cut or move the camera every 2–4 s; every sentence of narration should have a matching visual action, so a viewer with the sound off can still follow the story.
- No gore: violence is shown by implication (silhouettes, aftermath, the red highlight), never wounds or blood.

## Posting schedule (Metricool free plan: about 50 posts/month)
- Brand blogId **8271048**, network **tiktok**, autoPublish **true**, tiktokData.isAigc **true**, and tiktokData.title is **required**.
- Pattern **2-2-1**, repeating from **Sun 2026-11-22**: day index = days since 2026-11-22; index mod 3 is 0 or 1 → 2 posts (**10:00 and 18:00 UTC**); index mod 3 is 2 → 1 post (**18:00 UTC**). These are the global TikTok peaks from Metricool's best-time data (10:00 UTC = Europe midday / India evening; 18:00 UTC = Europe evening / US East lunch-to-afternoon). The audience is global English speakers, not one city. Schedule with timezone UTC.
- Before making anything, call getScheduledPosts for the next 4 days. Posts with `draft: true` do NOT count; treat their slots as empty and leave the drafts untouched. Find the **empty slots** of the pattern in the next 48 hours (the earliest first), and make **at most 2 videos per run** to fill them. If none are empty, stop.
- Don't schedule more than 50 posts in a calendar month (count the posts already scheduled or published that month first).
- Caption: 1–2 punchy sentences + emoji + 4–5 hashtags, always ending with `#HistoryWithinSeconds`. Title: a short hook (under 60 characters).

## Quality mode (owner's request, Nov 2026): maximum quality, no rushing
The run starts many hours before the posts go out (it fires at 22:54 UTC, and the earliest slot is 10:00 UTC the next day), so **take as long as quality needs**. Never cut corners to save time. Never fill a slot that is less than 3 hours away.
- **Render natively at 1080×1920** instead of upscaling from 720p: set `W=1080,H=1920` in head.js, the canvas sizes in pre.html and the viewport in cap.js. Keep scene layouts written in 720-px units by wrapping each scene's 2D drawing in `cx.save();cx.scale(1.5,1.5); ... cx.restore();`. Use `toDataURL('image/jpeg',0.97)`. Test frames first to confirm nothing breaks; fall back to 720p only if it truly fails.
- **Richer scenes**: 8–12 distinct shots per video, with smooth cinematic camera moves (dolly, orbit, push-in), never a static camera. Detailed models (period clothing, architecture, props, terrain), atmospheric particles (dust, smoke, embers, rain, snow), and depth layering in the foreground, midground and background. Keep the lighting bright and clear.
- **Review pass**: render a test frame from the start, middle and end of *every* scene, look at each one, and fix anything muddy, dark, cluttered, off-frame or hard to understand. Repeat until every frame looks good. After the full render, extract about 12 frames from the final MP4 and check them again.
- **Sound**: a layered music bed (drone + pulse + rises at the reveals) and an SFX hit synced to each key action.
- **Narration must always be crystal clear; music must NEVER muffle it.** Keep the music bed low (volume about 0.30) and **duck it under the voice** with a sidechain compressor, e.g. `[1:a]volume=2.0,apad,asplit=2[nv][key];[2:a]volume=0.30[bed];[bed][key]sidechaincompress=threshold=0.015:ratio=12:attack=15:release=350[duck];[nv][duck]amix=inputs=2:normalize=0,alimiter=limit=0.89`. Keep the music's energy below 1 kHz during speech (a gentle `equalizer=f=2500:t=q:w=1.5:g=-6` on the bed) so it doesn't fight the voice. After encoding, listen-check by measuring: the speech-only parts must be at least 12 dB louder than the music-only parts (`ebur128` / `volumedetect` on short windows). If not, lower the bed and re-mix.
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
7. Final encode: (already 1080×1920), `vignette=PI/6` (no grain noise, see Engine v2), subtitles drawn in-canvas; audio mixed as in Quality mode (narration on top, ducked music bed); libx264 crf 17 -preset slow, maxrate 16M bufsize 32M; aac 192k; faststart. Check that the duration is over 61 s.
8. Copy the MP4 to `videos/<slug>.mp4` in this repo, commit and push (`git -c push.negotiate=true push origin HEAD`). Media URL: `https://raw.githubusercontent.com/fwfurki/Historywithinseconds-videos/main/videos/<slug>.mp4`
9. Metricool `createScheduledPost` with that URL at the slot. **Immediately** add the topic to the do-not-repeat table in `toolkit/topics.md` (topic, file, slot, post id), then commit and push **before starting the next video**, so a topic can never be used twice, even if the run stops midway.
10. End with a short summary: topics, slots, credits left, and any issues.

## Engine v2 (Nov 2026): use this, it already implements the Visual style + CHRONICLE system
Files in `toolkit/engine/`: `head.js` (WebGL2, native 1080×1920, toon shading, screen-space ink outlines from depth/normal/object-id, GOLD highlight + halo + scene desaturation via `env({desat})` and `gold:1` on draws/transforms, clip planes for cutaways, textured quads), `people.js` (semi-realistic `person()` with faces, hair, hats, dresses, walk/sit/pose presets; huts, trees, cows, barrels), `chronicle.js` (globe3D opener, `badge`, `ribbon`, `museum` label, `seal`, `plaque3D` brass odometer, `subtitle` navy pill with amber key word, `tag`, `bigText`, `archiveCard`, `outro`), `land.js` (Natural Earth 110m land, public domain). Old v1 files are in `engine/legacy/`.
Workflow that worked (see `examples/lake_nyos_*` and `examples/halifax_*`):
1. Narration: download MP3, then `python3 scripts/tighten.py narr_raw.mp3 narr.wav 0.5` (caps pauses at 0.5 s) and `ffmpeg -i narr.wav -af atempo=1.07 narr_f.wav` (eleven_v4 with this voice reads slowly: ~87 s raw for 170 words → ~74 s after this).
2. Segments: silencedetect on narr_f.wav → `segs.txt` (count line + Python list); `python3 scripts/align.py script.txt segs.txt phr.json` maps script phrases to segments (DP, no network needed; whisper models are blocked by the proxy).
3. Subtitles: write `disp.txt` (one line per phrase, numbers as digits, `*` before the key word) → `python3 scripts/subs.py phr.json disp.txt subs.json`. Subtitles are drawn in-canvas (no ASS step).
4. Scenes: `scenes.js` with `S=[[start,end,fn],...]`, `overlays()` and `window.renderFrame`. Test with `scripts/test.sh <dir> frame1 frame2 ...` (builds scene.html and makes 3×2 contact sheets in `<dir>/t/`). Portrait framing means a narrow horizontal FOV (~24° at fov 40): always aim the camera at the subject, and keep cameras above `hf()` terrain and outside buildings.
5. Render 2 halves with `cap.js full` (≈1.3–1.6 s/frame per process on 2 cores, ~30 min per video), audio with `sfxlib.py` (music stem + sfx stem), then `scripts/final.sh <dir> <END>` (concat, ducked mix with loudnorm, crf 17). Film-grain noise is OFF: on flat cel colours it doubled the bitrate (106 MB, over GitHub's 100 MB limit) and TikTok re-encodes it into mush anyway.

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
