(() => {
  'use strict';

  for (const group of document.querySelectorAll('[data-playback-speed]')) {
    const video = document.getElementById(group.dataset.playbackSpeed);
    if (!video || typeof video.playbackRate !== 'number') continue;
    const buttons = [...group.querySelectorAll('[data-playback-rate]')];
    const status = document.querySelector(`[data-playback-speed-status="${video.id}"]`);

    function sync() {
      for (const button of buttons) {
        button.setAttribute('aria-pressed', String(Number(button.dataset.playbackRate) === video.playbackRate));
      }
      // Native controls and new clips use the same rate as these presets.
      if (video.defaultPlaybackRate !== video.playbackRate) video.defaultPlaybackRate = video.playbackRate;
    }

    for (const button of buttons) {
      button.addEventListener('click', () => {
        const rate = Number(button.dataset.playbackRate);
        if (!Number.isFinite(rate) || rate < 1 || rate > 4) return;
        try {
          video.playbackRate = rate;
          sync();
          if (status) status.textContent = '';
        } catch {
          if (status) status.textContent = 'That speed is unavailable in this browser.';
        }
      });
    }

    video.addEventListener('ratechange', sync);
    sync();
    group.hidden = false;
  }
})();
