# Baba Is You · level recordings

A static video catalogue at https://jehlp.net/baba-is-you/. One native player, world navigation and playback speeds. Shared styling comes from jehlp.net/site-theme/v2. The collection covers opening levels 1–7, all 15 Lake levels (including both extras), all 18 Solitary Island levels (00–11 and six extras), all 10 Temple Ruins levels (01–09 and one extra), all 20 Forest of Fall levels (01–12, A–E and three extras), all 21 Deep Forest levels (01–14, A–E and both extras), all 15 Rocket Trip levels (01–13 and both extras), all 12 Flower Garden levels (01–10 and both extras), and Chasm A–B, played in Slot 2. The silent, cropped recordings shorten pauses of at least 20 seconds to about five seconds while retaining attempts and win animations; the final Lake, Island, Ruins, Fall and Deep Forest clips include the Area Complete celebrations. Catalogue sequence numbers are unique across worlds, while titles carry the in-game world and level numbers.

Pause edits are documented in `data/pause-edits.json` and the per-batch `data/pause-edits-*.json` records, including source hashes, removed intervals and before/after durations. Original recordings are preserved outside this repository.

## Add a level

1. Put a **game-only cropped** H.264 MP4 (yuv420p, faststart) in `../baba-is-you-media/media/` for entries 71 onward, using `/baba-is-you-media/media/…` in the catalogue. Earlier clips remain in `media/`. Never add an uncropped desktop recording.
2. Export a representative JPEG frame into `assets/`.
3. Add its unique `level-NN` id, number, title, approved file/poster paths, duration in seconds and ISO recording date to `data/levels.json`.
4. Run `node build.mjs` and `node --test tests/*.test.mjs`. Check playback and layout, then commit the data, media, poster and generated HTML.

The build uses Node's standard library, with no install step. Preview from the parent directory with `python3 -m http.server 8765 --directory ..`, then open `/baba-is-you/`. Theme assets use the production shared theme. Level links open the video directly without JavaScript; JavaScript enhances selection and shareable `#level-NN` links. Picture-in-picture is left to browser-native controls where available. Selection never autoplays.

The page has no dedicated download controls or save-slot label. `controlslist="nodownload"` asks supporting browsers to omit their download menu item; public video files remain accessible. Keep the direct level links as the native playback fallback.

## Catalogue contract

`lib/worlds.mjs` groups recordings in first-seen world order, translating existing
short title prefixes into full world names. Within each native `details` group,
rows show the in-world number and short name; original IDs, full player titles,
URLs and recording order remain unchanged. New records may explicitly supply
nonempty `world`, `code` and `name` strings when their title has no standard prefix.
Unrecognized prefixes become their own groups; unprefixed records after the seven
opening levels remain visibly Ungrouped until assigned, never silently discarded.

`assets/world-browser.js` exposes `reveal(row)` to open the current world on
selection/history changes. Native disclosures and direct media links work without
JavaScript. Print temporarily expands the full catalogue. There is no search UI.
Keep this controller local until another real consumer needs the same behavior.

`lib/ornament.mjs` supplies one decorative three-tile SVG divider above the world
list. It uses transparent geometry and theme colors, separate from the PNG
masthead identity. Do not stack a second header rule against it.

`assets/playback-speed.js` enhances a native video with six 1.00×–4.00× speed presets. The chosen speed survives clip changes for the current page session and follows changes made through native controls. It does not play, pause, seek, or store preferences. The group stays hidden without JavaScript; its segmented appearance comes from the existing shared component CSS.

`lib/catalogue.mjs` validates level identity, real ISO dates, positive durations and approved media/poster paths. The build derives the recording count and latest recording date from the data, never from the build clock. Number labels support more than two digits. Keep catalogue metadata tests independent of the current recording count.

`assets/player.js` owns selection and history. Selecting the same clip preserves playback; unrelated fragments such as the skip target do not change clips. Returning to the empty fragment restores the first recording. There is no custom PiP button or controller; native video functionality is not disabled. The runtime tests cover these contracts; they do not replace real browser/media checks.

## Publishing and storage

GitHub Pages publishes `main` at the repository root. Do not add a CNAME: the custom domain is inherited from the account site. Entries 1–70 keep their media alongside the catalogue. Entries 71 onward use the companion `JWKNT/baba-is-you-media` repository, published from `main` at the root under `https://jehlp.net/baba-is-you-media/`. Publish and verify companion videos before publishing their catalogue links. Both repositories must remain below the Pages size limit; individual clips are checked against the file limit. Keep both checkouts beside one another for build verification, and keep originals elsewhere. Only this exact companion media path is allowed; arbitrary remote URLs and traversal paths are rejected.

Game art and gameplay belong to Hempuli. This repository contains the recorded playthroughs and the catalogue, not the game. Public authorship: jehlp.net.
