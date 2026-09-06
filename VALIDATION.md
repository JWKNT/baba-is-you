# Release validation · 2026-09-05

- Three Node tests pass: deterministic build/native links, one player and metadata, unique IDs/media size bounds.
- Actual Chromium browser review: 1440px and 390px, light/dark, no document overflow, shared PNG identity loaded, 200% text without clipping. Narrow level rows give duration a second line to keep titles readable.
- Actual H.264 playback advanced, seeking worked, level selection updated source/poster/title/download, browser history and direct `#level-03` navigation worked. Keyboard focus reaches the player/level links; selection moves focus to the player. Five direct MP4 links remain usable without JavaScript. Print and reduced-motion modes checked. No browser script errors.
- Picture-in-picture opened and closed in **headed Chromium**. Headless Chromium cannot establish the native floating-window result. Safari-specific presentation support is feature-detected but was not tested; other browsers retain native video controls and the fallback note.
- Five game-only clips total about 48 MB. No full desktop capture is included. All are 1700×950 H.264, 30 fps, silent, with faststart. Each retains its level title and win animation.
- Shared-theme suite: 22 tests pass; no shared CSS/JS changed. Homepage suite: 15 tests pass after adding the thirteenth authored destination.

Public route: https://jehlp.net/baba-is-you/. Deployment and HTTP verification are recorded in the companion site-theme change record.
