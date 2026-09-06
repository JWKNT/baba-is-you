# Release validation · 2026-09-05

- Three Node tests pass: deterministic build/native links, one player and metadata, unique IDs/media size bounds.
- Actual Chromium browser review: 1440px and 390px, light/dark, no document overflow, shared PNG identity loaded, 200% text without clipping. Narrow level rows give duration a second line to keep titles readable.
- Actual H.264 playback advanced, seeking worked, level selection updated source/poster/title/download, browser history and direct `#level-03` navigation worked. Keyboard focus reaches the player/level links; selection moves focus to the player. Five direct MP4 links remain usable without JavaScript. Print and reduced-motion modes checked. No browser script errors.
- Picture-in-picture opened and closed in **headed Chromium**. Headless Chromium cannot establish the native floating-window result. Safari-specific presentation support is feature-detected but was not tested; other browsers retain native video controls and the fallback note.
- Five game-only clips total about 48 MB. No full desktop capture is included. All are 1700×950 H.264, 30 fps, silent, with faststart. Each retains its level title and win animation.
- Shared-theme suite: 22 tests pass; no shared CSS/JS changed. Homepage suite: 15 tests pass after adding the thirteenth authored destination.

Public route: https://jehlp.net/baba-is-you/. Deployment and HTTP verification are recorded in the companion site-theme change record.

Unique icon update: generated Baba character PNG replaces the generic puzzles mark. Chromium verified the 32px masthead in light and dark modes, with a loaded 128px transparent source. All 3 catalogue and 22 theme tests pass.

## Follow-up catalogue and homepage audit

- 17 catalogue tests pass: the original three, four data/metadata tests and ten player interaction tests. They cover selection without autoplay, deep links, unrelated fragments, repeated selection/history, modified native clicks, PiP availability/errors and media failure recovery.
- Tightened the player/list layout and supporting copy; corrected the shared theme button class; made controls, level numbers and durations 14px while retaining 16px level titles. Count/date come from validated recording data. All five media files, posters and data records are unchanged.
- Local browser: light/dark desktop review, actual level-02 playback advancing to completion, level selection and direct level-03 reload without autoplay, and skip-link activation retaining level 03. The embedded browser rejected a PiP request and the visible fallback message was correct; this follow-up does **not** claim a new successful native floating-window test. Safari remains untested.
- At 390px, DOM measurements show no document overflow, a 362.8px video within the viewport, and 14px controls/16px level titles. Doubled root text (32px) has no overflow or clipped primary labels. The browser screenshot compositor sometimes scaled the narrow capture; geometry measurements, not that image's apparent scale, establish the sizing result.
- With JavaScript disabled and a fresh reload, one native player and all five MP4 links remain, no autoplay is set, and the custom PiP button is hidden. Print emulation yields black text on white with the player hidden. Temporary script, text, media and viewport overrides were restored.
- Homepage: 17 tests pass. All 13 destinations remain; Games now groups NDB Idle, Puzzles and clearly labelled Baba recordings, with Links in Reading. Search, no-result feedback, Escape, keyboard disclosure, narrow layout, 200% text and no-JS destination links were checked. Shared runtime assets were not changed.

## Recording batch · opening 06–07 and Lake 01–03

Added five 1700×950 H.264 clips at 30 fps, about 31 MB total. Title cards, game-only framing and win sequences were visually checked. A battery interruption required replaying Turns; no desktop, lock-screen or interrupted source recording is published. The game retained its save progress.

All 17 Node tests pass. Chromium played all five new clips and checked 1440/390px layouts in light/dark, 200% text, keyboard focus and all ten no-JavaScript download links, with no script errors. No player or theme code changed. Rollback: revert this batch commit; original recordings remain unchanged.
