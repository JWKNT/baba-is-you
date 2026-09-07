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
- 10 levels completed: base 00–07 and Lake 01–02, fresh Slot 3. Game on Lake map at completed Lake 02. No active recorder.
- First batch (base 00–04) live at main commit 9bc1db3. Second batch and notes panel ready for publication now. Companion cleanup d9922ae verified built; old videos removed.
- Ten silent edits/posters ready; every level has Approach, Mechanics, and Attempts notes. Notes panel follows selection/history, uses native disclosures without JS. 30 tests passed; responsive/light/dark/no-JS/playback checks completed.
- Capture tools/record: window-only 1708x1016. Export 1680x960 crop at (14,56), no audio, H.264/yuv420p/30fps/faststart. Keep every input and ten seconds after win; only idle gaps removed.
- Input tools/input: timed macOS events explicitly authorized after CUA input failed. U D L R E(return) S(space) Z(undo) N(restart) B(escape). 120ms hold, 180ms gap. Quote spaced sequences and supply recordings/NNN.jsonl.
- Session helper: python3 tools/session.py start N; stop. Start before entering each level; stop >=10 seconds after winning. Never overwrite an active attempt. Originals remain in ignored recordings/.
- The build requires complete notes for every catalogue entry. tools/catalogue.py preserves existing notes, but new entries need notes added to data/levels.json before building.
- No walkthroughs, previous-run solutions, or game internals consulted. In-game observations only.
- User requires continued work through at least 2026-09-07 09:30 America/New_York. Active heartbeat continue-baba-is-you-playthrough every five minutes resumes if idle. Caffeinate -di -t 36000 prevents idle sleep.

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
6. Base 05 — Volcano. Shift the whole BABA IS YOU sentence left one cell to exit without losing control. Move IS and PUSH from the rock rule to form LAVA IS PUSH. Push a straight path through the lava to the flag. Source 006.
- PUSH can make a HOT hazard traversable: it moves away before Baba overlaps it. Do not assume an initially dangerous terrain stays immovable.
- New user instruction: continue through at least 2026-09-07 09:30 America/New_York. Heartbeat continue-baba-is-you-playthrough created every 5 minutes for continuation if idle. Include level-specific notes alongside every uploaded video, retrofit initial five too.
7. Base 06 — Off Limits. Break WALL IS STOP, move WALL into the BABA IS YOU vertical sentence while pushing BABA aside, creating WALL IS YOU in one move. Move the walls right three and down two so an upper wall reaches the flag, avoiding interference with the control sentence. Source 007.
- Replace a rule noun by pushing a new noun into its slot and the old noun out in the same move: control transfers without an intermediate no-YOU state.
- When controlling many objects, choose a route that keeps remote copies from pushing apart the controlling rule. Some walls can be lost to DEFEAT while others still win.

- Overnight safeguard: caffeinate -di -t 36000 launched, preventing idle display/system sleep during this authorized run. Heartbeat wakes this task if idle.
- Notes feature ships with the second batch (ten completions). Site-theme docs/DECISIONS.md and docs/CHANGELOG.md have local append-only notes documenting the pattern; runtime theme files untouched.
8. Base 07 — Grass Yard. Use the IS in BABA IS YOU as a crossing point: FLAG above it, WIN below. Walls have no STOP, so words can be routed outside the visible enclosure. FLAG routed along the bottom and top borders; WIN routed down the open column right of the grass, then left and up. Multiple bad WIN routes and undo sequences retained. Source 008.
- Inspect dark obstacles carefully before batching long move sequences. Created tools/grid.py to brighten an observed screenshot and overlay cell coordinates for analysis only; recordings remain unmodified apart from crop/idle cuts.
- A word pushed into a corridor with blocked ends may be irrecoverable even when the adjacent tile initially looks open. Check both the destination and the square needed for the following push.
9. Lake 01 — Icy Waters. Push SINK down out of BABA IS YOU AND SINK. Route that spare word around the lower edge and push it into the bottom jellyfish; both disappear, leaving a route to the flag. Source 009.
- Text can be sacrificed to a SINK object. Read WALL versus WATER carefully: here the water-like blue texture has no STOP rule, while WALL IS STOP is fixed at the lower-right.
- The initial attempted whole-rule push was blocked by a wall. The successful disconnection used the exposed SINK word at the right end.
10. Lake 02 — Turns. Form STAR IS SINK AND PUSH and push the star into the skull; both vanish. Store CRAB temporarily in the upper-left room, reuse AND above BABA IS YOU, then route CRAB into place to form CRAB AND BABA IS YOU. The outside crab reaches the flag. Source 010.
- AND combines both properties and nouns. The same AND can be reused after its first job is finished.
- Failed first attempt: exit route was one cell short and hit the wall, so a long batch shifted unrelated words. Restarted and checked intermediate states. Entire attempt and restart retained.
- When routing a noun into a narrow rule column, store it somewhere it can still be pushed out; plan the return path before inserting the conjunction.
