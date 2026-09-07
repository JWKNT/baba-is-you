# Fresh playthrough validation

## Batch 1 — September 6, 2026
- Replaced previous 120-recording catalogue with fresh base levels 00–04 in Slot 3.
- Five 1680×960 H.264/yuv420p/30fps faststart MP4s; no audio streams. Originals remain outside Git. Each file under 100 MiB.
- Timestamp-based idle cuts preserve every game input, failed attempt, restart, and ten seconds after each winning input. Kept source intervals and hashes in data/pause-edits-001 through 005.json.
- Inspected each clip's victory frame and game-only crop; Level 03 includes the failed first attempt and restart.
- Deterministic build and 27 Node tests passed; git diff --check passed.
- Browser: native playback, clip selection/deep-link update, light/dark themes, 390px width, 200% text without horizontal overflow, keyboard skip-link focus, no-JavaScript direct MP4 links.
- No shared theme or player code changes. Existing main/root route and canonical URL preserved.
