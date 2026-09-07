(() => {
  'use strict';
  const form = document.querySelector('.world-search');
  const input = document.querySelector('#level-search');
  const status = document.querySelector('#search-status');
  const groups = [...document.querySelectorAll('[data-world]')];
  if (!form || !input || !groups.length) return;
  const entries = groups.map(group => ({group, rows: [...group.querySelectorAll('[data-level]')]}));
  const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const searchable = new Map(entries.flatMap(({rows}) => rows.map(row => [row, normalize(row.dataset.search)])));
  let saved = null;

  function filter() {
    const terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
    if (terms.length && !saved) saved = groups.map(group => group.open);
    let count = 0;
    for (const {group, rows} of entries) {
      let matches = 0;
      for (const row of rows) {
        row.hidden = !terms.every(term => searchable.get(row).includes(term));
        if (!row.hidden) matches++;
      }
      group.hidden = matches === 0;
      if (terms.length) group.open = matches > 0;
      count += matches;
    }
    if (!terms.length && saved) {
      groups.forEach((group, index) => { group.open = saved[index]; });
      saved = null;
    }
    status.textContent = terms.length ? count ? `${count} matching ${count === 1 ? 'recording' : 'recordings'}.` : 'No matching recordings. Clear the search to see all worlds.' : '';
  }

  form.hidden = false;
  input.addEventListener('input', filter);
  form.addEventListener('submit', event => event.preventDefault());
  function clear() { input.value = ''; filter(); }
  form.addEventListener('reset', event => { event.preventDefault(); clear(); input.focus(); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); clear(); }
  });
  window.BabaWorldBrowser = {reveal(row) {
    if (row.hidden) clear();
    for (const {group, rows} of entries) {
      const selected = rows.includes(row);
      group.classList.toggle('has-current', selected);
      if (selected) {
        group.open = true;
        if (saved) saved[groups.indexOf(group)] = true;
      }
    }
  }};

  // Print every recording, including closed worlds and filtered-out rows.
  let printState;
  function expandForPrint() {
    if (printState) return;
    printState = entries.map(({group, rows}) => ({open: group.open, hidden: group.hidden, rows: rows.map(row => row.hidden)}));
    entries.forEach(({group, rows}) => { group.open = true; group.hidden = false; rows.forEach(row => { row.hidden = false; }); });
  }
  function restoreAfterPrint() {
    if (!printState) return;
    entries.forEach(({group, rows}, index) => {
      group.open = printState[index].open; group.hidden = printState[index].hidden;
      rows.forEach((row, r) => { row.hidden = printState[index].rows[r]; });
    });
    printState = null;
  }
  window.addEventListener('beforeprint', expandForPrint);
  window.addEventListener('afterprint', restoreAfterPrint);
  window.matchMedia?.('print').addEventListener('change', event => {
    if (event.matches) expandForPrint(); else restoreAfterPrint();
  });
})();
