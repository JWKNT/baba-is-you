(() => {
  'use strict';
  const groups = [...document.querySelectorAll('[data-world]')];
  const entries = groups.map(group => ({group, rows: [...group.querySelectorAll('[data-level]')]}));
  window.BabaWorldBrowser = {reveal(row) {
    for (const {group, rows} of entries) {
      const selected = rows.includes(row);
      group.classList.toggle('has-current', selected);
      if (selected) group.open = true;
    }
  }};

  // Print every recording, then restore the reader's chosen open worlds.
  let printState;
  function expandForPrint() {
    if (printState) return;
    printState = groups.map(group => group.open);
    groups.forEach(group => { group.open = true; });
  }
  function restoreAfterPrint() {
    if (!printState) return;
    groups.forEach((group, index) => { group.open = printState[index]; });
    printState = null;
  }
  window.addEventListener('beforeprint', expandForPrint);
  window.addEventListener('afterprint', restoreAfterPrint);
  window.matchMedia?.('print').addEventListener('change', event => {
    if (event.matches) expandForPrint(); else restoreAfterPrint();
  });
})();
