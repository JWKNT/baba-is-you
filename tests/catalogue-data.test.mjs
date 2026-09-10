import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateLevels, catalogueMeta, levelNumber, duration, escape, localAssetURL } from '../lib/catalogue.mjs';

const levels = JSON.parse(readFileSync(new URL('../data/levels.json', import.meta.url)));
const copy = () => structuredClone(levels);

test('catalogue metadata follows recording dates rather than the build date', () => {
  const fixture = [
    { ...levels[0], recorded: '2027-02-03' },
    { ...levels[0], number: 2, id: 'level-02', recorded: '2026-09-05' },
  ];
  assert.deepEqual(catalogueMeta(fixture), { count: 2, secretHuntCount: 0, latest: '2027-02-03', latestLabel: 'Feb 3, 2027' });
});

test('identity, title, duration and date errors fail before rendering', () => {
  for (const value of [null, {}, []]) assert.throws(() => validateLevels(value));
  for (const [key, value] of [
    ['number', 0], ['number', -1], ['number', 1.5], ['number', 2], ['id', 'level-02'],
    ['title', '  '], ['title', {}], ['seconds', 0], ['seconds', Infinity],
    ['recorded', '2026-02-30'], ['recorded', '2026-13-01'], ['recorded', 'September 5'], ['recorded', null],
  ]) {
    const fixture = copy();
    fixture[0][key] = value;
    assert.throws(() => validateLevels(fixture), `${key}: ${value}`);
  }
});

test('media and poster paths have distinct safe file policies', () => {
  for (const [key, value] of [
    ['file', 'assets/level-01.jpg'], ['poster', 'media/01-where-do-i-go.mp4'],
    ['file', '../private.mp4'], ['file', 'https://example.com/a.mp4'],
    ['poster', 'assets/poster.svg'], ['poster', 'assets/../poster.png'],
  ]) {
    const fixture = copy();
    fixture[0][key] = value;
    assert.throws(() => validateLevels(fixture), /Missing or unsafe/);
  }
  assert.throws(() => validateLevels(levels, () => false), /Missing or unsafe file/);
});

test('future three-digit levels and text escaping remain supported', () => {
  const fixture = [{ ...levels[0], number: 100, id: 'level-100' }];
  assert.doesNotThrow(() => validateLevels(fixture));
  assert.equal(levelNumber(100), '100');
  assert.equal(duration(3601), '60:01');
  assert.equal(escape('<&"\''), '&lt;&amp;&quot;&#39;');
});

test('companion media stays restricted to the two approved stores and resolves beside the catalogue', () => {
  const root = new URL('file:///sites/baba-is-you/');
  for (const [store, number] of [['baba-is-you-media', 71], ['baba-is-you-media', 118], ['baba-is-you-media-2', 119]]) {
    const file = `/${store}/media/${number}-example.mp4`;
    assert.doesNotThrow(() => validateLevels([{ ...levels[0], file }]));
    assert.equal(localAssetURL(file, root).href, `file:///sites${file}`);
  }
  assert.equal(localAssetURL('media/01-example.mp4', root).href, 'file:///sites/baba-is-you/media/01-example.mp4');
  for (const file of ['/other/media/a.mp4', '/baba-is-you-media/media/../a.mp4', '//evil.example/a.mp4', '/baba-is-you-media/media/a.mp4?x', '/baba-is-you-media/media/%2e%2e.mp4', '/baba-is-you-media-2/media/../a.mp4', '/baba-is-you-media-2/media/%2e%2e.mp4', '/baba-is-you-media-2/media/a.mp4?x', '/baba-is-you-media-3/media/a.mp4', '/baba-is-you-media-20/media/a.mp4']) {
    assert.throws(() => validateLevels([{ ...levels[0], file }]), /Missing or unsafe/);
    assert.throws(() => localAssetURL(file, root), /Unsafe/);
  }
});
