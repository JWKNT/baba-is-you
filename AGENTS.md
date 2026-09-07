# Baba Is You catalogue
Read ../site-theme/PHILOSOPHY.md and ../site-theme/docs/DESIGN-SYSTEM.md before UI changes. This is a static level recording catalogue, not a playable game. Keep media cropped to the game and preserve originals outside this repo. Do not upload full desktop recordings.

Edit data/levels.json, then run node build.mjs. Commit the generated index.html with its source. Keep one native video player, progressive direct MP4 links, browser-native picture-in-picture where available, no autoplay, and the shared v2 palette/type/theme contract. No global home link. Public route: https://jehlp.net/baba-is-you/; GitHub Pages main/root; no project CNAME.

Run node --test tests/*.test.mjs and check real video playback/selection plus light/dark, narrow/desktop, keyboard, no-JS and 200% text. Keep explicit staging lists and preserve unrelated work.

Preserve the player history contract: repeat selection must not reset playback or duplicate history; skip/unrelated fragments must not change clips; Back to the empty fragment restores the initial recording. Derive catalogue count/date from validated data, not hard-coded values. Keep primary labels and durations at the shared readable UI size. Test fixtures must allow new recordings without rewriting historical count/date assertions.

World dropdowns are the catalogue navigation; do not restore search or a dedicated PiP button. Keep the single transparent rule-tile ornament distinct from the PNG masthead, and preserve native playback and deep-link behavior.
