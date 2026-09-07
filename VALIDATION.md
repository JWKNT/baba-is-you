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
