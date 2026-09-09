# Baba Is You · level recordings

A static video catalogue at https://jehlp.net/baba-is-you/. One native player, world navigation and playback speeds. Shared styling comes from jehlp.net/site-theme/v2. A fresh base-game playthrough began on September 6, 2026. It includes hidden and extra levels within the base campaign, excluding the separate New Adventures and Museum packs. The previous catalogue has been cleared at the owner's request.

Recordings are silent and cropped to the game. All moves, mistakes, undos, restarts, and victory animations are retained; only long idle thinking pauses are cut. New recordings are published in batches of five completions. Pause manifests document original hashes and retained source intervals. Original recordings remain outside Git.


## Add a level

1. Put a **game-only cropped** H.264 MP4 (yuv420p, faststart) in `../baba-is-you-media-2/media/` for entries 119 onward, using `/baba-is-you-media-2/media/…` in the catalogue. Entries 71–118 remain in `../baba-is-you-media/media/`; entries 1–70 remain in `media/`. Never add an uncropped desktop recording.
2. Export a representative JPEG frame into `assets/`.
3. Add its unique `level-NN` id, number, title, approved file/poster paths, duration in seconds and ISO recording date to `data/levels.json`. Include `notes.approach`, `notes.mechanics`, and `notes.attempts`; the build rejects missing notes.
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

GitHub Pages publishes `main` at the repository root. Do not add a CNAME: the custom domain is inherited from the account site. Entries 1–70 keep their media alongside the catalogue. Entries 71–118 use `JWKNT/baba-is-you-media`, published under `https://jehlp.net/baba-is-you-media/`. Entries 119 onward use the second companion `JWKNT/baba-is-you-media-2`, under `https://jehlp.net/baba-is-you-media-2/`. Each companion publishes `main` from the root with no CNAME; set up and verify the second site's deployment before its first catalogue link is published. Existing recordings stay at their original URLs.

Publish and verify companion videos before publishing their catalogue links. Every repository must remain below the Pages size limit; individual clips are checked against the file limit. Keep all three checkouts beside one another for build verification, and keep originals elsewhere. Only the two exact companion media prefixes are allowed; arbitrary remote URLs, other numbered stores and traversal paths are rejected.

Game art and gameplay belong to Hempuli. This repository contains the recorded playthroughs and the catalogue, not the game. Public authorship: jehlp.net.

## Level notes

Each recording has Approach, Mechanics, and Attempts alongside the video on desktop and below it on narrow screens. Notes follow selection and browser history. With JavaScript disabled, native disclosures expose every level’s notes. Keep notes grounded in the actual fresh attempt, including mistakes and undos.
