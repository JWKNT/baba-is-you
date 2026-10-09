import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Wrenfold is opt-in for recording note prose, not navigation or playback controls', async () => {
  const css = await readFile(new URL('../assets/styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.level-notes p \{[^}]*font: 1rem\/1\.6 var\(--reading, var\(--serif\)\);/);
  assert.equal((css.match(/--reading/g) || []).length, 1);
  assert.match(css, /\.world-group > summary \{[^}]*font: 1\.1rem\/1\.4 var\(--serif\);/);
  assert.match(css, /#playing-duration \{[^}]*var\(--mono\)/);
});
