# Baba Is You · level recordings

A static video catalogue at https://jehlp.net/baba-is-you/. One native player, level links, MP4 downloads, and feature-detected picture-in-picture. Shared styling comes from jehlp.net/site-theme/v2. The collection covers opening levels 1–7 and all 15 levels of The Lake, including both extras, plus Island 00–09, played in Slot 2. The silent, cropped recordings retain attempts and win animations; the final Lake clip includes the Area Complete celebration. Catalogue sequence numbers are unique across worlds, while titles carry the in-game world and level numbers.

## Add a level

1. Put a **game-only cropped** H.264 MP4 (yuv420p, faststart) in `media/`. Never add an uncropped desktop recording.
2. Export a representative JPEG frame into `assets/`.
3. Add its unique `level-NN` id, number, title, local file/poster paths, duration in seconds and ISO recording date to `data/levels.json`.
4. Run `node build.mjs` and `node --test tests/*.test.mjs`. Check playback and layout, then commit the data, media, poster and generated HTML.

The build uses Node's standard library, with no install step. Preview from the parent directory with `python3 -m http.server 8765 --directory ..`, then open `/baba-is-you/`. Theme assets use the production shared theme. Plain MP4 links still work without JavaScript; JavaScript enhances selection and shareable `#level-NN` links. Browser-native PiP controls remain available where the scripted API is absent. Selection never autoplays.

## Catalogue contract

`lib/catalogue.mjs` validates level identity, real ISO dates, positive durations and local media/poster paths. The build derives the recording count and latest recording date from the data, never from the build clock. Number labels support more than two digits. Keep catalogue metadata tests independent of the current recording count.

`assets/player.js` owns selection, history and PiP. Selecting the same clip preserves playback; unrelated fragments such as the skip target do not change clips. Returning to the empty fragment restores the first recording. PiP support is refreshed after media metadata loads, and failed requests leave normal playback available. The runtime tests cover these contracts; they do not replace real browser/media checks.

## Publishing and storage

GitHub Pages publishes `main` at the repository root. Do not add a CNAME: the custom domain is inherited from the account site. Media is stored alongside the catalogue; all individual clips are checked against GitHub's file limit. As the library grows, monitor Pages/repository capacity and move larger media to object storage before approaching hosting limits; update the build's allowed media URL policy at that time. Keep original recordings elsewhere.

Game art and gameplay belong to Hempuli. This repository contains the recorded playthroughs and the catalogue, not the game. Public authorship: jehlp.net.
