import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateLevels, catalogueMeta, levelNumber, duration, escape } from '../lib/catalogue.mjs';

const levels = JSON.parse(readFileSync(new URL('../data/levels.json', import.meta.url)));
const copy = () => structuredClone(levels);

test('catalogue metadata follows recording dates rather than the build date', () => {
  const fixture = [
    { ...levels[0], recorded: '2027-02-03' },
    { ...levels[0], number: 2, id: 'level-02', recorded: '2026-09-05' },
  ];
  assert.deepEqual(catalogueMeta(fixture), { count: 2, latest: '2027-02-03', latestLabel: 'Feb 3, 2027' });
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
