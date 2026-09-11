# Baba Is You · level recordings

A static video catalogue at https://jehlp.net/baba-is-you/. One native player, world navigation and playback speeds. Shared styling comes from jehlp.net/site-theme/v2. A fresh base-game playthrough began on September 6, 2026. It includes hidden and extra levels within the base campaign, excluding the separate New Adventures and Museum packs. The previous catalogue has been cleared at the owner's request.

Recordings are silent, cropped to the game, and encoded at twice normal gameplay speed. The player's speed buttons apply an additional multiplier. All captured moves, mistakes, undos, restarts, and victory animations are retained; only long idle thinking pauses are cut. Known capture gaps remain explicitly disclosed. New recordings are published in batches of five completions. Pause manifests document original hashes, retained source intervals and encoded timing. Attempt logs and source evidence remain outside Git; redundant published raw footage may be pruned after replacement verification.


## Add a level

1. Put a **game-only cropped** H.264 MP4 (yuv420p, faststart) in `../baba-is-you-media-2/media/` for entries 119 onward, using `/baba-is-you-media-2/media/…` in the catalogue. Entries 71–118 remain in `../baba-is-you-media/media/`; entries 1–70 remain in `media/`. Never add an uncropped desktop recording.
2. Export a representative JPEG frame into `assets/`.
3. Add its unique `level-NN` id, number, title, approved file/poster paths, duration in seconds and ISO recording date to `data/levels.json`. Include `notes.approach`, `notes.mechanics`, and `notes.attempts`; the build rejects missing notes.
4. Run `node build.mjs` and `node --test tests/*.test.mjs`. Check playback and layout, then commit the data, media, poster and generated HTML.

### Raw footage data

`data/raw-footage.json` supplies the Raw footage section beside each recording's
notes and the separate level/secret-hunt totals. Add a record for each new entry:
`id`, `capturedSeconds`, `originalCaptureCount`, `knownMissingInputs`, and
`allocations` containing each original capture's SHA256 and `[start,end]`
`sourceSecondsWindow`. These are original captured seconds, including menus and
idle thinking, before edits or playback-speed changes. Use the full original
capture duration for an exclusively assigned source. Shared sources need disjoint
windows: level146 and Secret001 partition the same source at580.5 seconds. Joined
copies, still-image appendices and missing video add no raw footage. The build
rejects overlapping allocations or inconsistent sums; the data test requires an
entry for every published recording. Missing data displays “unavailable”, never an
invented duration. Source statistics and original evidence remain in the playthrough
handoff; the public data retains the exact allocations needed to extend the totals.

Version1 also accepts an optional `unknownDurationAllocations` array when an
original capture's timestamps cannot be recovered. In that case `capturedSeconds`
is only the sum of the ordinary timed `allocations` (zero is allowed if none are
timed), and `originalCaptureCount` counts both arrays. The page calls this a
**known-duration subtotal**, gives the number of originals with unknown duration,
and excludes their time from both entry and collection subtotals. Never use an
input-log span or a nominal-rate recovery video's duration as captured seconds.

Every unknown-duration allocation is a whole, exclusively assigned original,
with `sourceSha256`, explicit `sourceSecondsWindow: null`, positive exact
`originalBytes`, `sourceName`, `provenance`, `durationUnknownReason`,
`originalTimestampsAvailable: false`, positive `recoveredFrameCount`, and
`recoveredFrameIndexWindowInclusive: [0, recoveredFrameCount - 1]`. It must also
retain sorted unique `knownMissingInputNumbers`, a boolean
`missingInputCountIsExhaustive`, and `evidence: {path, sha256}` identifying the
preserved source/recovery audit. The build validates this evidence declaration;
the audit files remain in the playthrough handoff and are verified during source
QA. Unknown originals cannot also appear in another timed or untimed allocation,
because no original-time partition establishes disjointness. Recovered frames
and inspection/export derivatives never add original bytes or capture counts.

Timed allocations may also carry exact full-file `originalBytes`. An optional
record-level `originalBytes` requires a byte count for every original and must
equal their sum; these are whole original file sizes, never proportional estimates
for a time window. Shared timed originals must agree on file size and still have
disjoint time windows. Unknown-duration entries with this total show their exact
original byte count. Keep `knownMissingInputs` at least as large as the known
missing event lists; when those lists are non-exhaustive, the visible gap count is
labelled “At least” and the remaining input coverage stays explicitly uncertified.

### Archived published media

Already verified MP4s may be absent from these sparse local checkouts.
`data/archived-media.json` records their exact ID/path/duration, byte count, SHA256,
verified repository commit and local pause-manifest hash. The build accepts an
absent MP4 only if the current recording and manifest match that specific verified
entry. New media still must exist locally, and posters always must exist locally.
Do not add an archive entry for an unpublished file or use it to bypass new-media
QA. Refresh an entry only after exact media/publication verification. Published
URLs and remote Git history remain intact; local native playback may require
restoring the needed sparse MP4 or opening its verified public URL. Size tests use
the physical file where present and the verified byte count only for matching
archived entries.

The build uses Node's standard library, with no install step. Preview from the parent directory with `python3 -m http.server 8765 --directory ..`, then open `/baba-is-you/`. Theme assets use the production shared theme. Level links open the video directly without JavaScript; JavaScript enhances selection and shareable `#level-NN` links. Picture-in-picture is left to browser-native controls where available. Selection never autoplays.

The page has no dedicated download controls or save-slot label. `controlslist="nodownload"` asks supporting browsers to omit their download menu item; public video files remain accessible. Keep the direct level links as the native playback fallback.

## Add a secret hunt

Secret hunting records map experiments and discoveries separately from completed
level recordings. Add these records to `data/secret-hunts.json`, which may be an
empty array. Use the same cropped, silent media and Approach, Mechanics and
Attempts notes workflow as levels, with independent identities:

```json
{
  "id": "secret-hunt-001",
  "number": 1,
  "title": "Map transformation",
  "file": "/baba-is-you-media-2/media/secret-hunt-001-map-transformation.mp4",
  "poster": "assets/secret-hunt-001.jpg",
  "seconds": 90,
  "recorded": "2026-09-10",
  "notes": {
    "approach": "Describe the recorded exploration.",
    "mechanics": "Describe only observed interactions.",
    "attempts": "Account for every chronological attempt and recording limit."
  }
}
```

The example duration and notes are illustrative. Use verified media values and
actual observations when adding a record. Keep the pause manifest under
`data/pause-edits-secret-hunt-001.json`. Number hunts independently, padding IDs
to at least three digits. Do not add them to `levels.json` or use level IDs.

Build and test as usual. Secret hunts appear in one native **Secret hunting**
disclosure and use the existing player, notes, playback controls and history,
including `#secret-hunt-001` links. Native MP4 links and all notes remain available
without JavaScript. The introduction reports level recordings and secret hunts
separately; hunts never increase the level count. Latest follows the newest
recording date across both collections. Keep browser QA and media-first release
checks for both kinds of recording.

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

`lib/catalogue.mjs` validates level and secret-hunt identities, real ISO dates,
positive durations and approved media/poster paths. `lib/secret-hunts.mjs` uses
the same group renderer as worlds. The build derives separate collection counts
and the latest recording date from the data, never from the build clock. Number
labels support additional digits. Keep metadata tests independent of current counts.

`assets/player.js` owns selection and history. Selecting the same clip preserves playback; unrelated fragments such as the skip target do not change clips. Returning to the empty fragment restores the first recording. There is no custom PiP button or controller; native video functionality is not disabled. The runtime tests cover these contracts; they do not replace real browser/media checks.

## Publishing and storage

GitHub Pages publishes `main` at the repository root. Do not add a CNAME: the custom domain is inherited from the account site. Entries 1–70 keep their media alongside the catalogue. Entries 71–118 use `JWKNT/baba-is-you-media`, published under `https://jehlp.net/baba-is-you-media/`. Entries 119 onward use the second companion `JWKNT/baba-is-you-media-2`, under `https://jehlp.net/baba-is-you-media-2/`. Each companion publishes `main` from the root with no CNAME; set up and verify the second site's deployment before its first catalogue link is published. Existing recordings stay at their original URLs.

Publish and verify companion videos before publishing their catalogue links. Every repository must remain below the Pages size limit; individual clips are checked against the file limit. Keep all three checkouts beside one another for build verification, and keep originals elsewhere. Only the two exact companion media prefixes are allowed; arbitrary remote URLs, other numbered stores and traversal paths are rejected.

Game art and gameplay belong to Hempuli. This repository contains the recorded playthroughs and the catalogue, not the game. Public authorship: jehlp.net.

## Recording notes

Each recording has Approach, Mechanics, and Attempts alongside the video on desktop and below it on narrow screens. Notes follow selection and browser history. With JavaScript disabled, native disclosures expose every level’s notes. Keep notes grounded in the actual fresh attempt, including mistakes and undos.
