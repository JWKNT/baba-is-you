# Fresh playthrough validation

## Batch 1 — September 6, 2026
- Replaced previous 120-recording catalogue with fresh base levels 00–04 in Slot 3.
- Five 1680×960 H.264/yuv420p/30fps faststart MP4s; no audio streams. Originals remain outside Git. Each file under 100 MiB.
- Timestamp-based idle cuts preserve every game input, failed attempt, restart, and ten seconds after each winning input. Kept source intervals and hashes in data/pause-edits-001 through 005.json.
- Inspected each clip's victory frame and game-only crop; Level 03 includes the failed first attempt and restart.
- Deterministic build and 27 Node tests passed; git diff --check passed.
- Browser: native playback, clip selection/deep-link update, light/dark themes, 390px width, 200% text without horizontal overflow, keyboard skip-link focus, no-JavaScript direct MP4 links.
- No shared theme or player code changes. Existing main/root route and canonical URL preserved.

## Notes panel
- Required per-level Approach, Mechanics, and Attempts are generated from catalogue data; incomplete notes fail the build.
- Notes follow selection and Back/Forward without restarting a repeated selection. Native disclosures expose all notes without JavaScript.
- 30 tests passed, including missing-note/escaping checks and selection/history synchronization.
- Browser inspected desktop and 390px notes, 200% text with no horizontal overflow, and actual no-JavaScript disclosure expansion. QA overrides restored.
- Initial five recordings verified live at 9bc1db3; video byte ranges returned HTTP 206 and obsolete main clip returned 404. Companion cleanup d9922ae also built successfully.

## Batch 2 — ten recordings
- Base 05–07 and Lake 01–02 added. Every logged input falls within a kept source interval; all five victory frames inspected. Failed attempts and undo sequences retained.
- All ten recordings have complete level-specific notes. Latest dataset rebuilt deterministically; 30 tests and diff whitespace checks passed. Desktop player/notes layout inspected for Lake 02.

## Batch 3 — fifteen recordings
- Lake 03–07 added with Approach, Mechanics, and Attempts notes. All 356 gameplay inputs within the five edited clip ranges are covered, including Lock’s 17 undos.
- Five game-only silent H.264 files validated, each under 9 MB. Victory/crop frames inspected; Affection ends at source 122.8 seconds after its victory and map return, before accidental reentry.
- All 30 tests, deterministic build, and whitespace checks passed. Desktop dark and 390px light layout inspected; native playback advances with readyState 4. Existing full keyboard/no-JS/200%/history QA remains applicable to unchanged UI code.
- Added a strict input-tool argument count to reject unquoted split sequences before any game input.

## Batch 4 — twenty recordings
- Lake 08–12 added with individual approach, mechanics, and attempts notes. All 476 logged inputs audited against retained intervals; all five victory frames and crops inspected. Silent H.264 files range from 2.3 to 12.4 MB.
- Locked In retains a continuous 20-second post-input tail for the Area Clear milestone. Editor now supports --tail and never removes a gap inside the selected victory tail. Default remains ten seconds.
- Reusable tools/verify_batch.py checks input counts, interval coverage, stream types, file sizes, and generates a victory contact sheet.
- All 30 tests, deterministic rebuild, and whitespace checks passed. Desktop player and new notes inspected; native playback checked. UI source remains unchanged from the full accessibility/responsive QA.
- Third batch 098904e verified live with notes, streaming HTTP206, and browser playback readyState4.

## Batch 5 — twenty-five recordings
- Lake13 and both Lake extras, plus Solitary Island00–01, added with full per-level notes. All689 inputs verified against edit intervals; all five victory frames inspected. Silent files range2.7–10.3MB.
- Lake completed15/8 including both extras. Main-map early side path needs3 flowers; moved to Solitary Island after checking it.
- All30 tests, deterministic rebuild, and whitespace checks passed. Mobile390px extra labels and desktop detailed notes inspected; longest new clip played through native player.
- Fourth batch26193cd verified live: twenty clips, matching notes, HTTP206, browser readyState4/playback27.4s.

## Batch 6 — thirty recordings
- Solitary Island02–06 added with Approach, Mechanics, and Attempts notes. All330 logged inputs covered by kept intervals, including Victory Spring’s failed crossings and undo sequence. All five victory frames and game-only crops inspected; silent H.264 files2.4–4.8MB.
- All30 tests and deterministic build passed. Desktop notes layout inspected and native playback verified; UI source unchanged from full responsive/accessibility QA.
- Fifth batch3c9cc26 verified live as a25-recording deployment was confirmed through successful Actions run34088407628 and public video HTTP206; legacy Pages build error came from duplicate build requests.

## Batch 7 — thirty-five recordings
- Solitary Island07–11 added with full individual notes. All 1,304 logged inputs audited against retained intervals, including deaths, restarts, undos, blocked moves, and autonomous waits. All five victory frames and crops inspected. Silent files range from 5.1 to 20.8 MB.
- Catch the Thief! retains a continuous 20-second victory tail for Area Clear. Other clips retain ten seconds.
- All 30 tests, deterministic build, and whitespace checks passed. New desktop notes inspected and native playback verified. UI source remains unchanged from full responsive/accessibility QA.
- Sixth batch 11fc1d9 verified live: successful Actions run34090219651, thirty-recording HTML, and HTTP206 for Assembly Team.

## Batch 8 — 36–40 (2026-09-07)
- Dungeon, Dim Signal, …Bridges?, Boiling River, and Fragility; complete Approach, Mechanics, Attempts notes beside each video. Temple Ruins added through catalogue data.
- `python3 tools/verify_batch.py 36 40`: all 1,235 recorded inputs covered, one video stream and no audio per export, 4.2–25.9 MB files. Victory contact sheet inspected for every clip.
- `node build.mjs`, all 30 node tests, and `git diff --check` passed.
- Real native Fragility playback readyState4, time advanced to27.05s, no media error; browser error log empty.
- Desktop light and390px dark layouts inspected. Notes remain legible at200% root text size with document width390px (no horizontal overflow).
- JavaScript-disabled page retained40 native note disclosures and direct recording links. Fragility disclosure opened and keyboard Return collapsed it. Restored scripts, normal text size, default viewport and light theme afterward.
- Parked Tiny Isle and Evaporating River attempts are not listed as complete. Their raw parts remain in the workspace for eventual joined recordings. New local tools preserve multipart attempts and route observed multiple-YOU grids without consulting game internals.

## Batch 9 — 41–45 (2026-09-07)
- Temple Ruins02–06 published with individual Approach, Mechanics, Attempts notes; third flower earned.
- All1,136 logged inputs covered by kept edit intervals. All five victory frames inspected; game-only crops, one video stream, no audio. Files6.5–28.8MB. Love Is Out There retains20seconds after the last input for Area Clear.
- Build, all30 tests, deterministic rebuild, and whitespace checks passed. Native Love Is Out There playback reached11.09seconds with readyState4 and no media error. Selection to But Where’s the Key updated its video/title/notes. Browser error log empty.
- Desktop light notes and390px dark layout inspected, including200% text (32px root; scrollWidth390). JavaScript-disabled page exposes45 native note disclosures and direct links; newest disclosure opens and keyboard Return toggles it. Restored JavaScript, normal text, default viewport, light theme.
- Previous40-level release75c19c8 verified through successful Actions34104665537, public45-independent prior40 count, and HTTP206 for Fragility.
