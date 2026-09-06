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

## Recording batch · Lake 04–08 · 2026-09-06

Five new game-only H.264 clips are 1700×950 at 30 fps with faststart. Exported starts, middles and win sequences were visually reviewed; Locked In includes the Area Clear celebration. Long failed attempts before the successful runs were trimmed. No desktop or private application content is included.

All 17 Node tests pass. Chromium played each new clip and checked desktop/mobile light and dark layouts, keyboard focus, 200% text and all 15 no-JavaScript recording links without script errors or horizontal overflow. No player or shared-theme code changed. Rollback: revert this batch commit.

## Recording batch · Lake 09–13 · 2026-09-06

Five additional game-only 1700×950 H.264 recordings reach verified win animations. Two Doors and Burglary retain undo/retry portions; Jelly Throne uses the successful replay. All standard Lake levels are now saved as complete in the game.

All 17 Node tests pass. Chromium played each new recording and checked 1440/390px light/dark layouts, keyboard, 200% text and 20 no-JavaScript links without script errors or overflow. Exported starts, middles and endings were visually checked. Player and theme code are unchanged. Rollback: revert this batch commit.

## Final Lake batch · both extras · 2026-09-06

Submerged Ruins and Sunken Temple complete the collection of all 15 Lake levels (13 standard, two extras). The final game map shows 15/8 and Area Complete; the saved game was backed up after completion. Recording was stopped before export, and the laptop recovered to a full charge.

Both 1700×950 H.264 exports were checked at their starts, middles and winning endings; Sunken Temple retains the Area Complete celebration. All 17 Node tests pass. Chromium played both clips and verified desktop/mobile light/dark layouts, keyboard, 200% text and 22 no-JavaScript links without errors or overflow. The existing native player and PiP implementation remain unchanged. Rollback: revert this final batch commit.

## Island batch · 00–04 · 2026-09-06

Five game-only 1700×950 H.264 recordings cover Poem, Float, Warm River and both Bridge Building puzzles. Starts, middle frames and winning endings were visually reviewed. Attempts and restarts remain in the clips, and the save was backed up after Island 04.

All 17 Node tests pass. Chromium played all five new videos and checked desktop/mobile light/dark layouts, keyboard focus, 200% text and 27 no-JavaScript links without errors or overflow. Player and shared-theme code are unchanged. Rollback: revert this batch commit.

## Island batch · 05–09 · 2026-09-06

Five 1700×950 H.264 recordings cover Victory Spring, Assembly Team, Catch the Thief!, Tiny Pond and Research Facility. Starts, middle frames and winning endings were reviewed. The Catch the Thief! recording includes the island's Area Clear celebration. Research Facility was re-entered after a Steam overlay disappeared, so that overlay is excluded from its published clip. Attempts and undos remain visible.

All 17 Node tests pass. Chromium played all five clips and checked desktop/mobile light/dark layouts, keyboard focus, 200% text and 32 no-JavaScript links without script errors or overflow. The save is backed up through Island 09. No player or theme code changed. Rollback: revert this batch commit.

## Island batch · 10–11 and extras 01–03 · 2026-09-06

Five game-only 1700×950 H.264 clips cover Wireless Connection, Prison, Boiling River, ...Bridges? and Tiny Isle. Starts, middles and endings were visually reviewed against the observed wins. The extra puzzles retain retries and undos. The saved game was backed up after Tiny Isle.

All 17 Node tests pass. Chromium played each new video and verified desktop/mobile light/dark layouts, keyboard focus, 200% text and 37 no-JavaScript links without script errors or overflow. No player or shared-theme code changed. Rollback: revert this batch commit.

## Final Island batch · extras 04–06 · 2026-09-06

Dim Signal, Dungeon and Evaporating River complete all 18 Solitary Island levels (00–11 and six extras). The game shows 18/8 and Area Complete; the final clip retains that celebration. Recording is stopped and the completed Slot 2 save has a verified backup. Dim Signal starts at the final restart, excluding earlier abandoned attempts while retaining the successful run's undos.

All three game-only exports are 1700×950 H.264 at 30 fps, yuv420p, silent and faststart. Durations and starts, middles and winning endings were reviewed. Files are 41.1, 23.9 and 11.9 MiB, below the per-file limit. All 17 Node tests pass. Chromium played each new clip and checked 1440/390px light/dark layouts, keyboard focus, 200% text and 40 no-JavaScript links without errors or overflow. Player and shared-theme code are unchanged. Rollback: revert this final batch commit; original recordings remain outside the repository.

## Catalogue-wide pause edit · 2026-09-06

Reviewed all 40 recordings for unchanged board states lasting at least 20 seconds. Temporal comparison, animation-phase matching and visual review distinguish idle sprite/float animation from moves. Shortened 65 pauses in 32 clips to five seconds each (2.5 seconds retained at either end), removing 2,759 seconds. Total running time is now 5,588.5 seconds instead of 8,347.5 seconds. Eight clips had no qualifying pauses. Source copies and metadata are backed up outside the repository; `data/pause-edits.json` records source hashes, the source commit and every removed interval.

All 32 exports preserve 1700×950, 30 fps, silent H.264/yuv420p and faststart. Exact frame counts and durations pass, and every file is below the repository limit. Checked 194 mapped source frames covering both sides of every cut and each edited clip's start and ending; minimum comparison PSNR was 51 dB at review resolution. Visual pause sheets were reviewed for all 65 cuts. Gameplay moves, retries and win sequences remain in order.

The isolated release candidate passes all 17 existing Node tests. Chromium played and sought to the ending of all 40 videos with matching catalogue/media durations, then checked desktop/mobile light/dark, keyboard focus, 200% text and 40 no-JavaScript links without errors or overflow. Concurrent player-control work is preserved unstaged; this commit changes only media, durations, edit records, documentation and the corresponding generated duration text. Rollback: revert this pause-edit commit to restore the preceding clips and durations.

## Temple Ruins batch · 01–05 · 2026-09-06

Five new recordings cover Fragility, Tunnel Vision, A Present for You, Unreachable Shores and But Where’s the Key. All five wins were observed, the map shows 5/6, the recorder is stopped, and Slot 2 has a verified checkpoint backup. Reviewed all source starts, middle frames and endings for game-only framing and complete win sequences. Original batch footage and per-level source clips remain outside the repository.

Shortened 31 visually reviewed idle intervals of at least 20 seconds to five seconds each, removing 1,227 seconds. Animation-aware comparisons retain gameplay, attempts and undos. The five final clips total 1,294.833 seconds and 98.4 MiB. Source timestamps were normalized before final encoding; all clips pass exact frame-count/duration checks, 1700×950, 30 fps, silent H.264/yuv420p, faststart and per-file size limits. All 72 source-frame comparisons at clip boundaries and both sides of every pause cut pass; minimum PSNR is 49.8 dB at review resolution. The per-batch pause manifest records source hashes and cut intervals.

All 23 Node tests pass. Chromium played and sought to the endings of all five new and two existing clips with matching metadata durations, then checked desktop/mobile light/dark, keyboard focus, 200% text and 45 no-JavaScript links without script errors or overflow. Existing speed controls, player and shared-theme code are preserved. Rollback: revert this batch commit.

## Final Temple Ruins batch · 06–09 and Extra 1 · 2026-09-06

Love Is Out There, Perilous Gang, Double Moat, Walls of Gold and Further Fields complete all 10 Temple Ruins levels. All wins were observed; the map shows 10/6 and Area Complete, retained in the final clip. The recorder is stopped and the completed Slot 2 save has a verified backup. Source starts, middle frames and endings were visually reviewed for game-only framing. Original recordings and per-level source exports remain outside the repository.

Shortened 25 visually reviewed idle intervals of at least 20 seconds to five seconds each, removing 1,581 seconds. The five final clips total 1,248 seconds and 96.5 MiB. All pass exact frame-count/duration checks, 1700×950, 30 fps, silent H.264/yuv420p, faststart and file-size limits. All 60 mapped source-frame checks at clip boundaries and both sides of every cut pass; minimum PSNR is 45.6 dB at review resolution. Source hashes and removed intervals are recorded in the per-batch pause manifest.

All 23 Node tests pass. Chromium played and sought to the endings of the five new and two existing clips with matching durations, then checked desktop/mobile light/dark, keyboard focus, 200% text and 50 no-JavaScript links without script errors or overflow. Existing player, speed controls and shared-theme code are preserved. Rollback: revert this batch commit.

## Forest of Fall batch · 01–05 · 2026-09-06

Hop, Grand Stream, Rocky Road, Telephone and Haunt are five observed wins. The recorder is stopped and Slot 2 has a verified checkpoint backup. All source starts, middles and endings and 15 candidate pauses were visually reviewed. A preliminary capture with a Steam notification was excluded; originals remain outside the repository.

Shortened 15 idle intervals of at least 20 seconds to five seconds, removing 783 seconds. The five final clips total 417 seconds and 23.7 MiB. All pass exact frame counts/durations, 1700×950, 30 fps, silent H.264/yuv420p, faststart and size limits. All 40 mapped source-frame checks at boundaries and both sides of cuts pass, with minimum PSNR 44.8 dB at review resolution. The batch manifest records hashes and removed intervals.

All 23 Node tests pass. Chromium played and sought to the endings of five new and two existing videos with matching durations, and checked desktop/mobile light/dark, keyboard, 200% text and 55 no-JavaScript links without errors or overflow. Existing player, speed controls and shared theme are preserved. Rollback: revert this batch commit.

## Forest of Fall batch · 06–10 · 2026-09-06

Crate Square, Ghost Friend, Ghost Guard, Leaf Chamber and Not There are five observed wins. The map shows 10/7, and Ghost Friend retains the Area Clear celebration. Recording is stopped and Slot 2 has a verified checkpoint backup. Source starts, middle frames and endings were reviewed for title cards, completed levels and game-only framing. Original footage remains outside the repository.

Shortened 40 visually reviewed idle intervals of at least 20 seconds to five seconds, removing 1,428 seconds. The five final clips total 1,084 seconds and 72.1 MiB. All pass exact frame-count/duration checks, 1700×950, 30 fps, silent H.264/yuv420p, faststart and file-size limits. All 90 mapped source-frame checks at boundaries and both sides of every cut pass; minimum PSNR is 44.7 dB at review resolution. The batch manifest records source hashes and cut intervals.

All 23 Node tests pass. Chromium played and sought to the endings of five new and two existing videos with matching durations, then checked desktop/mobile light/dark, keyboard, 200% text and 60 no-JavaScript links without errors or overflow. Existing player, speed controls and shared theme are preserved. Rollback: revert this batch commit.


## Forest of Fall batch · 11–12 and A–C · 2026-09-06

Catch, Dead End, Literacy, Broken Playground and Fetching are five observed wins. The map shows 15/7. Recording is stopped and Slot 2 has a checkpoint backup. All source starts, middle frames and endings were reviewed for title cards, completed levels and game-only framing. Catch excludes a 20-second tail containing a Steam notification after the win, retaining a clean completed-level map. Inter-level Steam settings footage is excluded entirely. Originals remain outside the repository.

Shortened 19 visually reviewed idle intervals of at least 20 seconds to five seconds, removing 1,143 seconds. The five final clips total 640 seconds and 35.2 MiB. All pass exact frame counts/durations, 1700×950, 30 fps, silent H.264/yuv420p, faststart and size limits. All 48 mapped source-frame checks at boundaries and both sides of each cut pass; minimum PSNR is 46.1 dB at review resolution. The batch manifest records source hashes, pause cuts and the manual notification trim.

All 23 Node tests pass. Chromium played and sought to the endings of five new and two existing videos with matching durations, then checked desktop/mobile light/dark, keyboard, 200% text and 65 no-JavaScript links without errors or overflow. Existing player, speed controls and shared theme are preserved. Rollback: revert this batch commit.

## Final Forest of Fall batch · D–E and extras 01–03 · 2026-09-06

Scenic Pond, Skeletal Door, Jump, Even Less There and Deep Pool complete all 20 Forest of Fall levels. All wins were observed; the map shows 20/7 and the final clip retains Area Complete. Recording is stopped and the completed Slot 2 save is backed up. Source starts, middles and endings were reviewed for title cards, completed levels and game-only framing. Originals remain outside the repository.

Shortened 26 visually reviewed idle intervals of at least 20 seconds to five seconds, removing 1,246 seconds. The five final clips total 746 seconds and 48.4 MiB. All pass exact frame counts/durations, 1700×950, 30 fps, silent H.264/yuv420p, faststart and size limits. All 62 mapped source-frame checks at boundaries and both sides of each cut pass; minimum PSNR is 44.9 dB at review resolution. The batch manifest records source hashes and pause cuts.

All 23 Node tests pass. Chromium played and sought to the endings of five new and two existing videos with matching durations, then checked desktop/mobile light/dark, keyboard, 200% text and 70 no-JavaScript links without errors or overflow. Existing player, speed controls and shared theme are preserved. Rollback: revert this batch commit.

## Deep Forest batch · 01–05 · 2026-09-06

Renovating, Toolshed, Keep Out!, Baba Doesn't Respond and Patrol are five observed wins. The map shows 5/9. Recording is stopped and Slot 2 has a verified checkpoint backup. All source starts, middle frames and endings were reviewed for title cards, game-only framing and completed levels. Attempts, corrections and the restart in Baba Doesn't Respond remain in order. Originals stay outside Git.

Shortened 26 visually reviewed idle intervals of at least 20 seconds to five seconds, removing 1,422 seconds. The five final clips total 743 seconds and 43.3 MiB. All pass exact frame counts/durations, 1700×950, 30 fps, silent H.264/yuv420p, faststart and file-size limits. All 62 mapped source-frame checks at boundaries and both sides of every cut pass; minimum PSNR is 45.2 dB at review resolution. The batch manifest records source hashes and pause cuts.

To accommodate the requested expansion, recordings 71 onward use the companion JWKNT/baba-is-you-media Pages repository. It publishes main/root without a CNAME; HTTPS is enforced. The catalogue stays at its existing address with the same native player, downloads and PiP. Build validation resolves the exact approved companion path to its sibling checkout and rejects arbitrary URLs and traversal. A focused path-policy test accompanies the change; all 24 Node tests pass.

Chromium played and sought to the endings of the five companion clips and two existing clips with matching durations. Desktop/mobile light/dark, keyboard, 200% text and 75 no-JavaScript links pass without script errors or overflow. Media is published and checked for HTTPS MP4 responses, exact sizes and byte-range support before the catalogue links are released. Player, speed controls and shared-theme code are unchanged. Rollback: revert this catalogue batch commit to remove its links; companion media can remain available.


## Deep Forest batch · 06–10 · 2026-09-06

Canyon, Concrete Goals, Victory in the Open, Moving Floor and Lovely House are five observed wins. The map shows 10/9 and five blossoms; Moving Floor retains the Area Clear celebration. Recording is stopped and Slot 2 has a verified checkpoint backup. Source starts, middles and endings were reviewed for game-only framing, titles and wins. Originals remain outside Git.

Shortened 19 visually reviewed idle intervals of at least 20 seconds to five seconds, removing 991 seconds. The final clips total 733 seconds and 37.3 MiB. All pass exact frame counts and durations, 1700×950, 30 fps, silent H.264/yuv420p, faststart and size limits. All 48 mapped source-frame checks pass, with minimum PSNR 44.3 dB at review resolution. The batch manifest records source hashes and cuts.

All 24 Node tests pass. Chromium played and sought to the endings of the five new clips and two existing clips with matching durations. Desktop/mobile light/dark, keyboard, 200% text and 80 no-JavaScript links pass without errors or overflow. Videos publish through the existing companion repository before the catalogue links; HTTPS, exact sizes and byte ranges are checked. Player, speed controls and shared-theme code are unchanged. Rollback: revert this catalogue batch commit; companion media can remain available.


## Deep Forest batch · 11–14 and A · 2026-09-06

Supermarket, Lock the Door, Factory, Tiny Pasture and Nearly are five observed wins. The map shows 15/9. Recording is stopped and Slot 2 has a verified checkpoint backup. Source starts, middles and endings were reviewed for game-only framing, titles and wins. Originals remain outside Git.

Shortened 24 visually reviewed idle intervals of at least 20 seconds to five seconds, removing 1,362 seconds. Nearly has no qualifying pause and remains intact. The five clips total 629 seconds and 35.6 MiB. All pass exact frame counts and durations, 1700×950, 30 fps, silent H.264/yuv420p, faststart and size limits. All 58 mapped source-frame checks pass, with minimum PSNR 45.0 dB at review resolution. The batch manifest records source hashes and cuts.

All 24 Node tests pass. Chromium played and sought to the endings of the five new and two existing clips with matching durations. Desktop/mobile light/dark, keyboard, 200% text and 85 no-JavaScript links pass without errors or overflow. Videos publish through the companion repository before catalogue links; HTTPS, exact sizes and byte ranges are checked. Player, speed controls and shared-theme code are unchanged. Rollback: revert this catalogue batch commit; companion media can remain available.


## Deep Forest batch · B–E and Extra 1 · 2026-09-06

Not Quite, Passing Through, Salvage, Insulation and Crumbling Floor are five observed wins. The map shows 20/9. Recording is stopped and Slot 2 has a verified checkpoint backup. Source starts, middles and endings were reviewed for game-only framing, title cards and wins. Attempts and undos remain in order; originals stay outside Git.

Shortened 22 visually reviewed idle intervals of at least 20 seconds to five seconds, removing 838 seconds. The final clips total 665 seconds and 47.4 MiB. All pass exact frame counts and durations, 1700×950, 30 fps, silent H.264/yuv420p, faststart and file-size limits. All 54 mapped source-frame checks pass, with minimum PSNR 43.1 dB at review resolution. The batch manifest records source hashes and cuts.

All 24 Node tests pass. Chromium played and sought to the endings of five new and two existing clips with matching durations. Desktop/mobile light/dark, keyboard, 200% text and 90 no-JavaScript links pass without errors or overflow. Videos publish through the companion repository before catalogue links; HTTPS, exact sizes and byte ranges are checked. Player, speed controls and shared-theme code are unchanged. Rollback: revert this catalogue batch commit; companion media can remain available.
