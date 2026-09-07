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
- 25 levels completed: base00–07, Lake01–13 + Extras1–2, Solitary Island00–01. Fresh Slot3. On Float map node403328; no active recorder. Fifth batch25 clips audited and ready to publish. Lake15/8 complete; main early side route gated by3 flowers (have1). Fourth batch26193cd verified Pages built, twenty live recordings/notes and HTTP206 for newest clip. Third batch 098904e verified built/live: fifteen recordings, notes, HTTP 206, browser playback readyState 4 at 42.6 seconds.
- First batch (base 00–04) was published at main commit 9bc1db3. Second batch and notes panel live at main commit 5b86a3f; public ten-level page and notes verified. Companion cleanup d9922ae verified built; old videos removed.
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

11. Lake 03 — Affection. Replace PUSH with MOVE in LOVE IS PUSH, using MOVE from KEKE IS MOVE. Heart travels vertically through algae; wait below enclosure for it to touch Baba. Source 011 end 122.8 excludes accidental reentry after completion; victory and gameplay inputs preserved.

12. Lake 04 — Pillar Yard. Align two pillars on flag row; push front pillar through star ring while Baba stays outside. Move PILLAR noun around left side of cage, then replace BABA in BABA IS YOU. Right moves inside pillar to flag. Source 012.
- Deliver a non-YOU object through DEFEAT first, then give it control. This avoids needing to remove the hazard itself.

13. Lake 05 — Brick Wall. Form BABA IS WIN vertically using the BABA in horizontal BABA IS YOU. Spare IS from FLAG rule moved up then left; WIN moved left then up. Source 013.
- YOU and WIN on the same object win immediately. Consider this before elaborate attempts to enter an enclosure. Dark outlined square floor tiles are decorative, unlike pipe-outline WALL.

14. Lake 06 — Lock. Use two keys to open first two doors. Bring ROCK word outside, form ROCK IS KEY IS OPEN horizontally, using spare IS from KEY IS PUSH. Rock converts permanently to third key. Restore spare IS to KEY IS PUSH, push new key into final door, reach flag. Source 014. Bad routing pushed PUSH to bottom edge; 17 undos restored checkpoint, all retained.
- OPEN and SHUT destroy each other on contact. Noun transformations persist after the transformation rule is broken; properties such as PUSH require an active rule.

15. Lake 07 — Novice Locksmith. Share IS between KEY IS OPEN and KEY IS PUSH. Open first door, then reuse horizontal KEY noun to replace SHUT in DOOR IS SHUT. Final door becomes pushable key; push aside to flag. Source 015. Input command briefly split at unquoted spaces; recovered seven events from misnamed DLUUUU file. Added input argument-count guard so this cannot silently recur.

16. Lake 08 — Locked In. Replace WALL IS STOP with WALL IS JELLY while detaching JELLY IS STOP. Cross harmless jelly boundary. Use outside spare IS and WIN to form BABA IS WIN vertically, keeping horizontal BABA IS YOU. Source 016, tail20 retains Area Clear animation. Lake quota8/8 and first flower earned; more levels remain.
- Added --tail to editor and continuous post-input tail preservation for longer milestone animations. Default remains10 seconds, area-clear used20.

17. Lake 09 — Changeless. Shift ROCK IS ROCK left twice, push first ROCK up outside overhanging wall to break identity rule. Rearrange bottom FLAG IS ROCK into ROCK IS FLAG; touch restored flag. Source 017. Identity prevention inferred from rule/title; did not test conflicting transform before removing it. No undo/restart.

18. Lake 10 — Two Doors. Make KEY IS SHUT horizontally using fixed KEY noun that is already OPEN and PUSH. Key destroys itself, clearing the narrow passage to assemble FLAG IS WIN. Replace KEKE with DOOR in vertical KEKE IS YOU; move controlled door right three onto flag. Source 018. No undo/restart.
- Confirmed: one object simultaneously OPEN and SHUT destroys itself. It does not require a second object.
- Route words around KEKE IS YOU using top row112, avoiding accidentally breaking control. IS must enter the horizontal KEY rule before SHUT because of surrounding hedges.

19. Lake 11 — Jelly Throne. Initial JELLY IS YOU shortcut blocked by isolated wall; pushed flag once and found wall beyond prevents exiting. FLAG IS JELLY visibly crossed out by FLAG IS FLAG, confirming identity blocks noun transformations. Built JELLY IS BABA vertically ending at fixed BABA word, creating second controlled Baba below wall. Used exterior Baba to replace lower JELLY IS WIN noun with FLAG from FLAG IS STOP, thereby removing STOP and making flag win. Walked exterior Baba to flag. Source019 retains blocked pushes, failed transformation, pause-menu inspection, and misrouted FLAG recovery; no restart.
- When YOU cannot be reached by a new sentence, use the existing controlled noun as the result of a transformation: X IS BABA creates a new controllable object elsewhere.
- With two YOU objects, an input can move one while the other is blocked; inspect both after long routes.

20. Lake 12 — Crab Storage. Give flag OPEN using a vertical rule sharing FLAG IS PUSH, push it into shut door, retrieve CRAB. Build BABA IS BABA vertically under fixed upper BABA; this identity prevents BABA IS CRAB as CRAB passes upper gate. Push CRAB past DEFEAT into WIN, then touch crab. Source020, no undo/restart.
- Self-identity can protect a controlled noun from an unavoidable temporary transformation.
- Steam friend notifications occasionally appear in game overlay. Disable their popups between levels if possible; avoid modifying game-state settings.

21. Lake13 — Burglary. Move star out of the WALL rule column, build WALL IS SHUT and STAR IS OPEN sharing immutable STAR IS PUSH. Push star up through wall at463208, escape. Break outside KEY IS DEFEAT, bring outside IS and WIN inside to make KEY IS WIN vertically, touch key. First attempt trapped star under WALL noun and required restart; later adjusted IS/OPEN alignment after KEY word blocked a left push. Source021 preserves all failed moves and restart.
- Need explore Lake side blue node and any remaining extras; map currently13/8 at completed13, no other numbered nodes visible.

- Lake side blue node at307280 is Extra1 Submerged Ruins, not a world link. Entered before recording because node type was unknown; started022 before any puzzle input, then pause title confirmed code. Keep all blue extras in scope.

22. Lake Extra1 — Submerged Ruins. First shifted top nouns, making FLAG IS WIN but CRAB IS DEFEAT blocked access; undid one move. Formed ROCK IS BABA vertically using fixed BABA in BABA IS YOU, creating second Baba from rock. Used walls to hold upper Baba while lower Baba crossed harmless crabs into goal chamber. Upper Baba then shifted CRAB/FLAG, lower Baba reached newly winning flag. Source022 retains initial attempt/undo and all movements.
- Stage a controlled object beyond a hazard before activating the hazardous rule. Independent blocking can separate simultaneously controlled objects into useful positions.

23. Lake Extra2 — Sunken Temple. Shifted upper rules, making flag WIN and single crab DEFEAT. Temporarily made ROCK IS YOU to extract trapped rock; restored BABA IS YOU. Shared IS between horizontal BABA IS YOU and vertical ROCK IS PUSH, freeing spare IS as crate. Parked PUSH temporarily to route spare IS; restored PUSH, staged rock235388 and IS187388, pushed chain right twice: rock331388 beyond crab, IS283388 on crab, Baba235388 safe. Replaced BABA with ROCK in control rule; controlled rock moved right to flag. Source023. No restart/undo; extensive planning gaps removed, every action retained.
- A spare text word can be the second pushable object in a hazard-crossing chain. Sharing an IS can free that word even when every initial sentence appears necessary.
- Temporary control can extract a physically trapped pushable object; restore original control after moving it into a usable position.
- PUSH was parked at187340 to keep route244 clear, then restored before moving the IS crate behind rock. Restore rules before a crate blocks the needed standing square.

24. Solitary Island00 — Poem. Shift IS column down twice, keeping FLAG IS WIN and BABA IS YOU intact. Push VIOLET left, move ROSE out temporarily. Route spare IS into295256, restore ROSE295232 to form vertical ROSE IS FLAG using FLAG295280. Touch an outside rose-turned-flag. Five undos corrected an IS route one cell too far. Source024.
- Identical IS words can replace one another in a pushed stack without breaking lower rules. Move a temporarily blocking noun out, insert the connective, then restore the noun.

25. Solitary Island01 — Float. Tested up movement: floating Baba still blocked by wall. Shifted BABA IS YOU left once to free space below noun. Moved ROCK noun out of lower rule, around right wall, above BABA, then pushed down to transfer control. Grounded rocks moved right four and won at flag. Source025; no undo/restart.
- FLOAT does not bypass STOP walls. Grounded controlled rocks successfully interact with grounded WIN flag.
