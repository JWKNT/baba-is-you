import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source = readFileSync(new URL('../assets/playback-speed.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const rates = [1, 1.25, 1.5, 2, 3, 4];

function setup({missing = false, rejected = false} = {}) {
  const listeners = {};
  let playbackRate = 1;
  const video = {
    id: 'video', defaultPlaybackRate: 1, currentTime: 17, paused: true,
    get playbackRate() { return playbackRate; },
    set playbackRate(value) {
      if (rejected && value === 4) throw new Error('Unsupported rate');
      playbackRate = value;
    },
    addEventListener(name, handler) { listeners[name] = handler; },
    play() { throw new Error('Speed must not autoplay'); },
    pause() { throw new Error('Speed must not interrupt playback'); },
    load() { this.playbackRate = this.defaultPlaybackRate; listeners.ratechange(); },
  };
  const buttons = rates.map(rate => ({
    dataset: {playbackRate: String(rate)}, pressed: null,
    setAttribute(name, value) { assert.equal(name, 'aria-pressed'); this.pressed = value; },
    addEventListener(name, handler) { assert.equal(name, 'click'); this.click = handler; },
  }));
  const group = {dataset: {playbackSpeed: 'video'}, hidden: true, querySelectorAll: () => buttons};
  const status = {textContent: ''};
  const document = {querySelectorAll: () => [group], getElementById: () => missing ? null : video, querySelector: () => status};
  runInNewContext(source, {document});
  return {video, buttons, group, status, nativeRate(rate) { video.playbackRate = rate; listeners.ratechange(); }};
}

test('six native speed buttons are hidden until enhanced; removed header and note stay absent', () => {
  assert.match(html, /role="group" aria-label="Playback speed" data-playback-speed="video" hidden/);
  for (const rate of rates) assert.ok(html.includes(`data-playback-rate="${rate}" aria-pressed="${rate === 1}">${rate.toFixed(2)}×</button>`));
  assert.doesNotMatch(html, /recording-note|Silent recordings\./);
  assert.doesNotMatch(html.match(/<header\b[\s\S]*?<\/header>/)[0], /github\.com|>Source</);
});

test('every preset sets the rate and selected state without starting or seeking', () => {
  const page = setup();
  assert.equal(page.group.hidden, false);
  for (const [index, rate] of rates.entries()) {
    page.buttons[index].click();
    assert.equal(page.video.playbackRate, rate);
    assert.equal(page.video.defaultPlaybackRate, rate);
    assert.equal(page.buttons[index].pressed, 'true');
    assert.equal(page.buttons.filter(button => button.pressed === 'true').length, 1);
    assert.equal(page.video.currentTime, 17);
    assert.equal(page.video.paused, true);
  }
});

test('speed remains selected when a new clip loads', () => {
  const page = setup();
  page.buttons.at(-1).click();
  page.video.load();
  assert.equal(page.video.playbackRate, 4);
  assert.equal(page.buttons.at(-1).pressed, 'true');
});

test('native rate changes update the presets and the next clip default honestly', () => {
  const page = setup();
  page.nativeRate(2);
  assert.equal(page.buttons[3].pressed, 'true');
  page.nativeRate(1.75);
  assert.equal(page.buttons.some(button => button.pressed === 'true'), false);
  assert.equal(page.video.defaultPlaybackRate, 1.75);
});

test('unsupported and invalid speeds do not claim success; valid retry clears the error', () => {
  const page = setup({rejected: true});
  page.buttons.at(-1).click();
  assert.match(page.status.textContent, /unavailable/);
  assert.equal(page.video.playbackRate, 1);
  assert.equal(page.buttons[0].pressed, 'true');
  for (const value of ['NaN', '0', '-1', '5']) {
    page.buttons.at(-1).dataset.playbackRate = value;
    page.buttons.at(-1).click();
    assert.equal(page.video.playbackRate, 1);
  }
  page.buttons[3].click();
  assert.equal(page.status.textContent, '');
});

test('a missing media target leaves the nonfunctional controls hidden', () => {
  assert.equal(setup({missing: true}).group.hidden, true);
});
