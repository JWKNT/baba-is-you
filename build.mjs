import {readFileSync,writeFileSync,existsSync} from 'node:fs';
export const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const duration = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
const levels=JSON.parse(readFileSync(new URL('./data/levels.json',import.meta.url)));
const ids=new Set();
for(const l of levels){
 if(!/^level-\d{2,}$/.test(l.id)||ids.has(l.id)||!Number.isFinite(l.seconds)||l.seconds<=0||!Number.isInteger(l.number)||!l.title)throw Error('Invalid level');
 ids.add(l.id);
 for(const key of ['file','poster'])if(!/^(media|assets)\/[\w.-]+$/.test(l[key])||!existsSync(new URL(l[key],import.meta.url)))throw Error(`Missing or unsafe ${key}`);
}
if(!levels.length)throw Error('Add at least one recording');
const first=levels[0];
const rows=levels.map(l=>`<li id="${l.id}" data-level="${l.id}" data-title="${escape(l.title)}" data-poster="${l.poster}" data-seconds="${l.seconds}">
 <a class="level-link" href="${l.file}" data-watch><span class="level-number">${String(l.number).padStart(2,'0')}</span><span class="level-name">${escape(l.title)}</span><span class="duration">${duration(l.seconds)}</span></a>
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
<link rel="stylesheet" href="assets/styles.css"><script src="assets/player.js" defer></script>
</head><body data-site-tone="ochre">
<a href="#player" class="skip-link">Skip to video</a>
<header class="site-header site-header--identity"><div class="site-brand"><img class="site-mark" src="https://jehlp.net/site-theme/v2/marks/puzzles.png" width="32" height="32" alt=""><h1 class="site-title">Baba Is You</h1></div><nav aria-label="Page links"><a href="https://github.com/JWKNT/baba-is-you">Source</a><button type="button" data-theme-toggle aria-label="Use dark theme">◐</button></nav></header>
<main class="page-shell">
<p class="intro">Level recordings <span aria-hidden="true">/</span> ${levels.length} completed <span aria-hidden="true">/</span> <time datetime="2026-09-05">5 September 2026</time></p>
<div class="catalogue">
<section class="player-section" aria-labelledby="playing-title" id="player" tabindex="-1">
 <div class="player-heading"><span id="playing-number" class="level-label">Level ${String(first.number).padStart(2,'0')}</span><h2 id="playing-title">${escape(first.title)}</h2></div>
 <video id="video" controls playsinline preload="metadata" poster="${first.poster}" width="1700" height="950" aria-labelledby="playing-title" aria-describedby="recording-note"><source src="${first.file}" type="video/mp4">Your browser cannot play this video. <a href="${first.file}">Download the MP4</a>.</video>
 <div class="player-tools"><button id="pip" type="button" hidden disabled>Picture-in-picture</button><a id="current-download" href="${first.file}" download>Download clip</a><span id="playing-duration">${duration(first.seconds)}</span></div>
 <p id="player-status" role="status" aria-live="polite"></p>
 <p class="recording-note" id="recording-note">Cropped gameplay, including the win animation. Silent recordings; attempts and restarts are kept.</p>
 <p class="pip-note" id="pip-note">Your browser may offer picture-in-picture in its video controls.</p>
</section>
<section class="level-section" aria-labelledby="levels-title"><div class="list-heading"><h2 id="levels-title">Levels</h2><span>Clip length</span></div><ol class="level-list">${rows}</ol><p class="collection-note">Original game · Slot 2<br>Played with Codex. More levels will be added as we play.</p></section>
</div>
</main><footer class="page-shell">Gameplay from <cite>Baba Is You</cite> by Hempuli. A recording catalogue by jehlp.net.</footer>
</body></html>\n`);
console.log(`Built ${levels.length} levels.`);
