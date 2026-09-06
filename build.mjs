import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {escape, duration, levelNumber, validateLevels, catalogueMeta} from './lib/catalogue.mjs';
const levels=JSON.parse(readFileSync(new URL('./data/levels.json',import.meta.url)));
validateLevels(levels, path => existsSync(new URL(path, import.meta.url)));
const meta=catalogueMeta(levels);
const first=levels[0];
const speeds=[1, 1.25, 1.5, 2, 3, 4].map(rate=>`<button type="button" data-playback-rate="${rate}" aria-pressed="${rate === 1}">${rate.toFixed(2)}×</button>`).join('');
const rows=levels.map(l=>`<li id="${l.id}" data-level="${l.id}" data-number="${l.number}" data-title="${escape(l.title)}" data-poster="${l.poster}" data-seconds="${l.seconds}">
 <a class="level-link" href="${l.file}" data-watch><span class="level-number">${levelNumber(l.number)}</span><span class="level-name">${escape(l.title)}</span><span class="duration">${duration(l.seconds)}</span></a>
 <a class="download" href="${l.file}" download aria-label="Download level ${l.number}: ${escape(l.title)}">MP4</a>
</li>`).join('\n');
writeFileSync(new URL('./index.html',import.meta.url),`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Baba Is You — level recordings · jehlp.net</title>
<meta name="description" content="A growing catalogue of Baba Is You level recordings, with cropped gameplay, downloads, and picture-in-picture playback.">
<meta name="author" content="jehlp.net"><meta name="theme-color" content="#fbfaf7">
<link rel="canonical" href="https://jehlp.net/baba-is-you/">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script src="https://jehlp.net/site-theme/v2/theme.js"></script>
<link rel="stylesheet" href="https://jehlp.net/site-theme/v2/base.css">
<link rel="stylesheet" href="https://jehlp.net/site-theme/v2/components.css">
<link rel="stylesheet" href="assets/styles.css?v=20260906-speed"><script src="assets/playback-speed.js?v=20260906-speed" defer></script><script src="assets/player.js?v=20260905-audit" defer></script>
</head><body data-site-tone="ochre">
<a href="#player" class="skip-link">Skip to video</a>
<header class="site-header site-header--identity"><div class="site-brand"><img class="site-mark" src="https://jehlp.net/site-theme/v2/marks/baba-is-you.png" width="32" height="32" alt=""><h1 class="site-title">Baba Is You</h1></div><nav aria-label="Page links"><button class="theme-toggle" type="button" data-theme-toggle aria-label="Use dark theme" aria-pressed="false">◐</button></nav></header>
<main class="page-shell">
<div class="intro"><p>${meta.count} level ${meta.count === 1 ? 'recording' : 'recordings'}</p><p>Latest <time datetime="${meta.latest}">${meta.latestLabel}</time></p></div>
<div class="catalogue">
<section class="player-section" aria-labelledby="playing-title" id="player" tabindex="-1">
 <div class="player-heading"><span id="playing-number" class="level-label">Level ${levelNumber(first.number)}</span><h2 id="playing-title">${escape(first.title)}</h2></div>
 <video id="video" controls playsinline preload="metadata" poster="${first.poster}" width="1700" height="950" aria-labelledby="playing-title"><source src="${first.file}" type="video/mp4">Your browser cannot play this video. <a href="${first.file}">Download the MP4</a>.</video>
 <div class="playback-speed ui-segmented" role="group" aria-label="Playback speed" data-playback-speed="video" hidden>${speeds}</div>
 <p class="speed-status" data-playback-speed-status="video" role="status" aria-live="polite"></p>
 <div class="player-tools"><button id="pip" type="button" hidden disabled>Picture-in-picture</button><a id="current-download" href="${first.file}" download>Download clip</a><span id="playing-duration">${duration(first.seconds)}</span></div>
 <p id="player-status" role="status" aria-live="polite"></p>
 <p class="pip-note" id="pip-note">Your browser may offer picture-in-picture in its video controls.</p>
</section>
<section class="level-section" aria-labelledby="levels-title"><div class="list-heading"><h2 id="levels-title">Levels</h2></div><ol class="level-list">${rows}</ol><p class="collection-note">Original game · Slot 2<br>Played with Codex.</p></section>
</div>
</main><footer class="page-shell"><cite>Baba Is You</cite> by Hempuli.</footer>
</body></html>\n`);
console.log(`Built ${levels.length} levels.`);
