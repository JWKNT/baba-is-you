(() => {
  'use strict';

  const video = document.querySelector('#video');
  const pip = document.querySelector('#pip');
  const pipNote = document.querySelector('#pip-note');
  const status = document.querySelector('#player-status');
  const player = document.querySelector('#player');
  const rows = [...document.querySelectorAll('[data-level]')];
  const standardPip = !!document.pictureInPictureEnabled &&
    typeof video.requestPictureInPicture === 'function';
  let selected = null;

  function supportsSafariPip() {
    if (typeof video.webkitSetPresentationMode !== 'function' ||
        typeof video.webkitSupportsPresentationMode !== 'function') return false;
    try {
      return video.webkitSupportsPresentationMode('picture-in-picture');
    } catch {
      return false;
    }
  }

  function isPip() {
    return document.pictureInPictureElement === video ||
      video.webkitPresentationMode === 'picture-in-picture';
  }

  function syncPip() {
    const active = isPip();
    const supported = standardPip || supportsSafariPip();
    pip.hidden = !supported && !active;
    pipNote.hidden = supported || active;
    pip.textContent = active ? 'Exit picture-in-picture' : 'Picture-in-picture';
    pip.setAttribute('aria-pressed', String(active));
    pip.disabled = !active && (!supported || video.readyState < 2 || !!video.error);
  }

  function select(row, announce = false) {
    if (row) window.BabaWorldBrowser?.reveal(row);
    if (!row || row === selected) return;
    selected = row;
    video.pause();

    const link = row.querySelector('[data-watch]');
    const number = String(row.dataset.number ?? row.dataset.level.slice(6)).padStart(2, '0');
    video.poster = row.dataset.poster;
    video.src = link.getAttribute('href');
    video.load();
    document.querySelector('#playing-title').textContent = row.dataset.title;
    document.querySelector('#playing-number').textContent = `Level ${number}`;
    document.querySelector('#playing-duration').textContent = row.querySelector('.duration').textContent;

    for (const item of rows) {
      const watch = item.querySelector('[data-watch]');
      if (item === row) watch.setAttribute('aria-current', 'true');
      else watch.removeAttribute('aria-current');
    }

    status.textContent = announce ? `Selected level ${number}: ${row.dataset.title}.` : '';
    document.title = `${row.dataset.title} — Baba Is You · jehlp.net`;
    syncPip();
  }

  for (const row of rows) {
    row.querySelector('[data-watch]').addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      select(row, true);
      const hash = `#${row.dataset.level}`;
      if (location.hash !== hash) history.pushState(null, '', hash);
      player.focus({preventScroll: true});
      player.scrollIntoView({block: 'nearest', behavior: 'instant'});
    });
  }

  function fromHash() {
    const row = rows.find(item => `#${item.dataset.level}` === location.hash);
    if (row) select(row);
    else if (!selected || !location.hash) select(rows[0]);
  }

  window.addEventListener('popstate', fromHash);
  window.addEventListener('hashchange', fromHash);
  fromHash();

  for (const name of [
    'loadedmetadata', 'loadeddata', 'emptied', 'enterpictureinpicture',
    'leavepictureinpicture', 'webkitpresentationmodechanged'
  ]) video.addEventListener(name, syncPip);

  video.addEventListener('error', () => {
    status.textContent = 'This clip could not be loaded. Reload the page or choose another level.';
    syncPip();
  });

  pip.addEventListener('click', async () => {
    try {
      if (standardPip) {
        if (document.pictureInPictureElement === video) await document.exitPictureInPicture();
        else await video.requestPictureInPicture();
      } else if (supportsSafariPip() || video.webkitPresentationMode === 'picture-in-picture') {
        video.webkitSetPresentationMode(isPip() ? 'inline' : 'picture-in-picture');
      } else {
        throw new Error('Picture-in-picture is unsupported');
      }
      status.textContent = '';
    } catch {
      status.textContent = 'Picture-in-picture is unavailable right now. You can keep watching in the player.';
    }
    syncPip();
  });
})();
