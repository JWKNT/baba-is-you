# Fresh Baba Is You playthrough

## Authorized scope and workflow
- Play every base-game level, including secrets and extras. Exclude separately included level packs.
- Start a brand-new save. No walkthroughs, internet solution searches, or previous-run solution notes.
- Record every level with no audio, only the game image. Keep all failed moves, undos, restarts, experiments, and victory animations. Cut only long inactive thinking pauses.
- Publish every five completions to JWKNT/baba-is-you (https://jehlp.net/baba-is-you/), main/root.
- User authorized wiping previous media/catalogue and replacing it progressively.
- Existing catalogue/tools checkout: /Users/jw/Desktop/bin/baba-is-you. Companion media: /Users/jw/Desktop/bin/baba-is-you-media.
- This workspace stores fresh tools, raw recordings, and reasoning notes. Raw recordings stay out of Git.

## Current checkpoint
- 5 levels completed: base 00–04, fresh Slot 3. Game on map at level 04.
- First five silent edits and posters ready. All 27 catalogue tests pass. Browser playback/selection, light/dark, 390px, 200% text, keyboard and no-JS checks passed.
- Old 120 catalogue entries and all corresponding media/posters cleared from main and companion checkouts. Publishing first fresh batch now.
- Capture: tools/record, window-only 1708x1016. Export crop 1680x960 at (14,56).
- Input: tools/input; timed macOS events explicitly authorized after CUA input failed. U D L R E(return) S(space) Z(undo) N(restart) B(escape). 120ms hold, 180ms gap. Always supply the matching recordings/NNN.jsonl event path.
- Session recorder helper: python3 tools/session.py start N; stop. Start before entering a level. Stop >=10 seconds after winning. Originals stay in ignored recordings/.
- No walkthroughs, old video solutions or game internals consulted. Only in-game observations and prior publishing documentation.

## Resume
Read this file and tools before interacting. Observe game fresh using CUA. Update per-level observations and checkpoint after each completion. Verify edits and publish on each group of five.

## Completed in the fresh run
1. Base 00 — Baba Is You. Eight right moves push the middle rock until Baba reaches the flag. Source 001; begin offset stored in 001.begin excludes setup/intro before any gameplay moves.
2. Base 01 — Where Do I Go? Break WALL IS STOP by pushing IS sideways; walls become traversable. Assemble FLAG IS WIN in upper room and reach flag. Source 002.
3. Base 02 — Now What Is This? WALL IS YOU controls a wall. Push STOP out of FLAG IS STOP, bring WIN down from upper room and replace STOP, then touch a flag. Source 003.

## Observed mechanics
- A valid noun IS YOU controls that noun's objects, not necessarily Baba.
- Moving text breaks and forms rules immediately; absent STOP lets us walk through walls or flags.
- Text remains pushable. Position rules away from the intended route so reaching WIN objects does not push apart the rule.
- Completed levels transition automatically to map; allow ~10 seconds after final input for win and progress animations.
- Input tool ignores nonmapped characters. Always quote a sequence if inserting spaces; otherwise shell splits it and can misdirect the event log. Fixed Level 2's interrupted command and recovered its event log; no moves lost.
4. Base 03 — Out of Reach. One rock sinks with one water tile to open the top room exit. Replace PUSH with WIN in ROCK IS PUSH; touch remaining rock. First attempt trapped WIN at bottom edge, followed by explicit restart and corrected route around WIN before pushing up. Source 004 retains the entire failed attempt and restart.
- SINK consumes the overlapping object and water tile. A visible flag need not be the goal; change the WIN noun.
- Never push text against a room edge unless it is the final desired position. Stand behind the intended push path first.
5. Base 04 — Still Out of Reach. Align three rocks horizontally and push from outside the skull enclosure; the front rock displaces SKULL in SKULL IS DEFEAT while Baba remains outside. Then cross the harmless skull boundary to the flag. Source 005.
- Chains let us manipulate rule text across hazardous tiles without entering them. DEFEAT does not destroy ordinary rocks.
- This board's upper bound is y112. The two initial rules form an immovable block at the upper-left corner; solve with the movable rocks instead.
