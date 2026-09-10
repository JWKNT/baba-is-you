import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {escape, duration, levelNumber, validateLevels, validateSecretHunts, catalogueMeta, localAssetURL} from './lib/catalogue.mjs';
import {renderNotes} from './lib/notes.mjs';
import {renderWorlds} from './lib/worlds.mjs';
import {renderSecretHunts} from './lib/secret-hunts.mjs';
import {ruleDivider} from './lib/ornament.mjs';
const levels=JSON.parse(readFileSync(new URL('./data/levels.json',import.meta.url)));
const secretHunts=JSON.parse(readFileSync(new URL('./data/secret-hunts.json',import.meta.url)));
validateLevels(levels, path => existsSync(localAssetURL(path, new URL('./', import.meta.url))));
validateSecretHunts(secretHunts, path => existsSync(localAssetURL(path, new URL('./', import.meta.url))));
const meta=catalogueMeta(levels, secretHunts);
const first=levels[0];
const speeds=[1, 1.25, 1.5, 2, 3, 4].map(rate=>`<button type="button" data-playback-rate="${rate}" aria-pressed="${rate === 1}">${rate.toFixed(2)}×</button>`).join('');
const worlds=renderWorlds(levels);
writeFileSync(new URL('./index.html',import.meta.url),`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Baba Is You — level recordings · jehlp.net</title>
<meta name="description" content="Baba Is You level recordings and secret hunting, with cropped gameplay, world navigation and playback speeds.">
<meta name="author" content="jehlp.net"><meta name="theme-color" content="#fbfaf7">
<link rel="canonical" href="https://jehlp.net/baba-is-you/">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script src="https://jehlp.net/site-theme/v2/theme.js"></script>
<link rel="stylesheet" href="https://jehlp.net/site-theme/v2/base.css">
<link rel="stylesheet" href="https://jehlp.net/site-theme/v2/components.css">
<link rel="stylesheet" href="assets/styles.css?v=20260906-notes"><script src="assets/playback-speed.js?v=20260906-speed" defer></script><script src="assets/world-browser.js?v=20260906-tiles" defer></script><script src="assets/player.js?v=20260910-secret-hunts" defer></script>
</head><body data-site-tone="ochre">
<a href="#player" class="skip-link">Skip to video</a>
<header class="site-header site-header--identity"><div class="site-brand"><img class="site-mark" src="https://jehlp.net/site-theme/v2/marks/baba-is-you.png" width="32" height="32" alt=""><h1 class="site-title">Baba Is You</h1></div><nav aria-label="Page links"><button class="theme-toggle" type="button" data-theme-toggle aria-label="Use dark theme" aria-pressed="false">◐</button></nav></header>
<main class="page-shell">
<div class="intro"><p>${meta.count} level ${meta.count === 1 ? 'recording' : 'recordings'}${meta.secretHuntCount ? ` · ${meta.secretHuntCount} secret ${meta.secretHuntCount === 1 ? 'hunt' : 'hunts'}` : ''}</p><p>Latest <time datetime="${meta.latest}">${meta.latestLabel}</time></p></div>
<div class="catalogue">
<section class="player-section" aria-labelledby="playing-title" id="player" tabindex="-1">
 <div class="player-heading"><span id="playing-number" class="level-label">Level ${levelNumber(first.number)}</span><h2 id="playing-title">${escape(first.title)}</h2></div>
 <video id="video" controls playsinline controlslist="nodownload" preload="metadata" poster="${first.poster}" width="1680" height="960" aria-labelledby="playing-title"><source src="${first.file}" type="video/mp4">Your browser cannot play this video. Choose a recording to open it directly.</video>
 <div class="playback-tools"><div class="playback-speed ui-segmented" role="group" aria-label="Playback speed" data-playback-speed="video" hidden>${speeds}</div><span id="playing-duration">${duration(first.seconds)}</span></div>
 <p class="speed-status" data-playback-speed-status="video" role="status" aria-live="polite"></p>
 <p id="player-status" role="status" aria-live="polite"></p>
</section>
<div class="recording-context">
${renderNotes(levels, secretHunts)}
<section class="level-section" aria-label="Recordings by world and secret hunting">
${ruleDivider}
<div id="worlds">${worlds}${secretHunts.length ? `\n${renderSecretHunts(secretHunts)}` : ''}</div><p class="collection-note">Played with GPT-6 Astra.</p></section>
</div>
</div>
</main><footer class="page-shell"><cite>Baba Is You</cite> by Hempuli.</footer>
</body></html>\n`);
console.log(`Built ${levels.length} levels and ${secretHunts.length} secret hunts.`);
