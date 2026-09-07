(() => {
  'use strict';

  const video = document.querySelector('#video');
  const status = document.querySelector('#player-status');
  const player = document.querySelector('#player');
  const rows = [...document.querySelectorAll('[data-level]')];
  const notes = document.querySelector('#level-notes');
  const panels = notes ? [...notes.querySelectorAll('[data-notes-id]')] : [];
  let selected = null;

  function select(row, announce = false) {
    if (row) window.BabaWorldBrowser?.reveal(row);
    if (!row || row === selected) return;
    selected = row;
    if (notes) notes.dataset.enhanced = 'true';
    for (const panel of panels) {
      panel.hidden = panel.dataset.notesId !== row.dataset.level;
      panel.open = !panel.hidden;
    }
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

  video.addEventListener('error', () => {
    status.textContent = 'This clip could not be loaded. Reload the page or choose another level.';
  });

})();
