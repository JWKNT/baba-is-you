import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source = readFileSync(new URL('../assets/player.js', import.meta.url), 'utf8');

function element(properties = {}) {
  const listeners = new Map();
  const attributes = new Map();
  return {
    textContent: '', hidden: false, disabled: false,
    addEventListener(name, listener) {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(listener);
    },
    dispatch(name, event = {}) {
      return (listeners.get(name) ?? []).map(listener => listener(event));
    },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    getAttribute(name) { return attributes.get(name) ?? null; },
    removeAttribute(name) { attributes.delete(name); },
    ...properties
  };
}

function setup({hash = '', standard = false, safari = false, safariSupported = false,
  safariQuery = true, rejectPip = false, explicitNumber = '2'} = {}) {
  const calls = {pause: 0, play: 0, load: 0, focus: 0, scroll: 0, history: [], requestPip: 0, exitPip: 0};
  const rows = [1, 2].map(number => {
    const id = `level-0${number}`;
    const link = element({href: `https://example.test/media/${id}.mp4`});
    link.setAttribute('href', `media/${id}.mp4`);
    const duration = element({textContent: `${number}:00`});
    return {
      dataset: {level: id, title: `Recording ${number}`, poster: `assets/${id}.jpg`,
        ...(number === 2 && explicitNumber !== null ? {number: explicitNumber} : {})},
      link,
      querySelector(selector) {
        if (selector === '[data-watch]') return link;
        if (selector === '.duration') return duration;
        throw new Error(`Unexpected row selector: ${selector}`);
      }
    };
  });
  const video = element({
    readyState: 0, error: null, currentTime: 0,
    pause() { calls.pause++; },
    play() { calls.play++; },
    load() { calls.load++; this.readyState = 0; this.error = null; this.currentTime = 0; }
  });
  const pip = element({hidden: true, disabled: true});
  const pipNote = element();
  const status = element();
  const nodes = {
    '#video': video, '#pip': pip, '#pip-note': pipNote, '#player-status': status,
    '#playing-title': element(), '#playing-number': element(),
    '#playing-duration': element(),
    '#player': element({focus() { calls.focus++; }, scrollIntoView() { calls.scroll++; }})
  };
  const document = {
    pictureInPictureEnabled: standard, pictureInPictureElement: null,
    querySelector: selector => nodes[selector], querySelectorAll: () => rows
  };
  if (standard) {
    video.requestPictureInPicture = async () => {
      calls.requestPip++;
      if (rejectPip) throw new Error('Denied by browser');
      document.pictureInPictureElement = video;
    };
    document.exitPictureInPicture = async () => {
      calls.exitPip++;
      document.pictureInPictureElement = null;
    };
  }
  if (safari) {
    video.webkitPresentationMode = 'inline';
    video.webkitSetPresentationMode = mode => {
      if (rejectPip) throw new Error('Denied by browser');
      video.webkitPresentationMode = mode;
    };
    if (safariQuery) video.webkitSupportsPresentationMode = mode =>
      mode === 'picture-in-picture' && safariSupported;
  }
  calls.revealed = [];
  const window = element({BabaWorldBrowser: {reveal(row) { calls.revealed.push(row.dataset.level); }}});
  const location = {hash};
  const history = {pushState(_state, _title, nextHash) {
    calls.history.push(nextHash);
    location.hash = nextHash;
  }};
  runInNewContext(source, {document, window, location, history});

  return {
    rows, video, pip, pipNote, status, nodes, document, calls,
    click(index, modifiers = {}) {
      const event = {button: 0, defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; }, ...modifiers};
      rows[index].link.dispatch('click', event);
      return event;
    },
    navigate(nextHash, event = 'hashchange') {
      location.hash = nextHash;
      window.dispatch(event);
    },
    setSafariSupport(value) { safariSupported = value; },
    ready(state = 2, event = 'loadeddata') { video.readyState = state; video.dispatch(event); },
    async clickPip() { await Promise.all(pip.dispatch('click')); }
  };
}

test('selection updates the player and metadata without playing or a download control', () => {
  const page = setup({explicitNumber: '7'});
  assert.equal(page.click(1).defaultPrevented, true);
  assert.equal(page.video.src, 'media/level-02.mp4');
  assert.equal(page.video.poster, 'assets/level-02.jpg');
  assert.equal(page.nodes['#playing-title'].textContent, 'Recording 2');
  assert.equal(page.nodes['#playing-number'].textContent, 'Level 07');
  assert.equal(page.nodes['#playing-duration'].textContent, '2:00');
  assert.equal(page.rows[0].link.getAttribute('aria-current'), null);
  assert.equal(page.rows[1].link.getAttribute('aria-current'), 'true');
  assert.equal(page.status.textContent, 'Selected level 07: Recording 2.');
  assert.equal(page.calls.pause, 2);
  assert.equal(page.calls.play, 0);
  assert.equal(page.calls.focus, 1);
  assert.equal(page.calls.scroll, 1);
});

test('initial deep links select a recording and legacy rows retain their number', () => {
  const page = setup({hash: '#level-02', explicitNumber: null});
  assert.equal(page.video.src, 'media/level-02.mp4');
  assert.equal(page.nodes['#playing-number'].textContent, 'Level 02');
  assert.equal(page.calls.play, 0);
  assert.equal(page.calls.history.length, 0);
  assert.equal(setup({hash: '#unknown'}).video.src, 'media/level-01.mp4');
});

test('initial links, repeat selection and history reveal the corresponding world', () => {
  const page = setup({hash:'#level-02'});
  assert.deepEqual(page.calls.revealed, ['level-02']);
  page.click(1);
  page.navigate('', 'popstate');
  assert.deepEqual(page.calls.revealed, ['level-02','level-02','level-01']);
});

test('skip and unrelated fragments retain the clip and playback position', () => {
  const page = setup();
  page.click(1);
  page.video.currentTime = 35;
  const loads = page.calls.load;
  page.navigate('#player');
  page.navigate('#unrelated');
  assert.equal(page.video.src, 'media/level-02.mp4');
  assert.equal(page.video.currentTime, 35);
  assert.equal(page.calls.load, loads);
});

test('repeat selections avoid duplicate history and Back/Forward restore level fragments', () => {
  const page = setup();
  page.click(1);
  page.video.currentTime = 12;
  page.click(1);
  assert.deepEqual(page.calls.history, ['#level-02']);
  assert.equal(page.video.currentTime, 12);
  page.navigate('', 'popstate');
  assert.equal(page.video.src, 'media/level-01.mp4');
  page.navigate('#level-02', 'popstate');
  page.navigate('#level-02', 'hashchange');
  assert.equal(page.video.src, 'media/level-02.mp4');
  assert.equal(page.calls.load, 4);
  assert.equal(page.calls.play, 0);
});

test('modified and non-primary clicks retain direct link behavior', () => {
  for (const modifiers of [{ctrlKey: true}, {metaKey: true}, {shiftKey: true}, {altKey: true}, {button: 1}]) {
    const page = setup();
    assert.equal(page.click(1, modifiers).defaultPrevented, false);
    assert.equal(page.video.src, 'media/level-01.mp4');
    assert.equal(page.calls.history.length, 0);
    assert.equal(page.calls.focus, 0);
  }
});

test('unsupported PiP retains the native-controls note', () => {
  for (const options of [{}, {safari: true}, {safari: true, safariQuery: false}]) {
    const page = setup(options);
    page.ready();
    assert.equal(page.pip.hidden, true);
    assert.equal(page.pip.disabled, true);
    assert.equal(page.pipNote.hidden, false);
  }
});

test('Safari PiP availability refreshes after metadata and tracks its presentation mode', async () => {
  const page = setup({safari: true});
  page.setSafariSupport(true);
  page.ready(1, 'loadedmetadata');
  assert.equal(page.pip.hidden, false);
  assert.equal(page.pipNote.hidden, true);
  assert.equal(page.pip.disabled, true);
  page.ready();
  assert.equal(page.pip.disabled, false);
  await page.clickPip();
  assert.equal(page.video.webkitPresentationMode, 'picture-in-picture');
  assert.equal(page.pip.textContent, 'Exit picture-in-picture');
  assert.equal(page.pip.getAttribute('aria-pressed'), 'true');
  await page.clickPip();
  assert.equal(page.video.webkitPresentationMode, 'inline');
  page.setSafariSupport(false);
  page.video.dispatch('loadedmetadata');
  assert.equal(page.pip.hidden, true);
  assert.equal(page.pipNote.hidden, false);
});

test('standard PiP enters and exits without starting playback', async () => {
  const page = setup({standard: true});
  assert.equal(page.pip.hidden, false);
  assert.equal(page.pip.disabled, true);
  page.ready();
  await page.clickPip();
  assert.equal(page.calls.requestPip, 1);
  assert.equal(page.pip.getAttribute('aria-pressed'), 'true');
  page.video.readyState = 0;
  page.video.dispatch('emptied');
  assert.equal(page.pip.disabled, false, 'an active PiP window can still be closed');
  await page.clickPip();
  assert.equal(page.calls.exitPip, 1);
  assert.equal(page.pip.getAttribute('aria-pressed'), 'false');
  assert.equal(page.calls.play, 0);
});

test('PiP failures leave playback available and announce the failure', async () => {
  for (const options of [{standard: true}, {safari: true, safariSupported: true}]) {
    const page = setup({...options, rejectPip: true});
    page.ready();
    await page.clickPip();
    assert.match(page.status.textContent, /Picture-in-picture is unavailable/);
    assert.equal(page.pip.getAttribute('aria-pressed'), 'false');
    assert.equal(page.video.src, 'media/level-01.mp4');
    assert.equal(page.calls.play, 0);
  }
});

test('video failures offer available recovery and selecting another clip clears the error', () => {
  const page = setup({standard: true});
  page.ready();
  page.video.error = {code: 4};
  page.video.dispatch('error');
  assert.match(page.status.textContent, /This clip could not be loaded/);
  assert.equal(page.pip.disabled, true);
  assert.doesNotMatch(page.status.textContent, /download/i);
  page.click(1);
  page.ready();
  assert.match(page.status.textContent, /^Selected level 02:/);
  assert.equal(page.pip.disabled, false);
  assert.equal(page.calls.play, 0);
});
