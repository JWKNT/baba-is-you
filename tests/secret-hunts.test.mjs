import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSecretHunts, catalogueMeta} from '../lib/catalogue.mjs';
import {renderSecretHunts} from '../lib/secret-hunts.mjs';
import {renderNotes} from '../lib/notes.mjs';

const hunt = {id:'secret-hunt-001',number:1,title:'Map <transformation>',file:'/baba-is-you-media-2/media/secret-hunt-001.mp4',poster:'assets/secret-hunt-001.jpg',seconds:90,recorded:'2027-02-03',notes:{approach:'Move <words>.',mechanics:'A map changes.',attempts:'Both attempts remain.'}};

test('secret hunts have independent padded identities and the same safe media contract', () => {
  assert.doesNotThrow(() => validateSecretHunts([]));
  assert.doesNotThrow(() => validateSecretHunts([hunt]));
  assert.doesNotThrow(() => validateSecretHunts([{...hunt,number:1000,id:'secret-hunt-1000'}]));
  for (const value of [null, {}, [hunt,hunt]]) assert.throws(() => validateSecretHunts(value));
  for (const [key,value] of [['id','level-01'],['id','secret-hunt-01'],['number',0],['recorded','2027-02-30'],['seconds',0],['file','../private.mp4'],['poster','assets/../private.jpg']]) {
    assert.throws(() => validateSecretHunts([{...hunt,[key]:value}]), `${key}: ${value}`);
  }
  assert.throws(() => validateSecretHunts([hunt], () => false), /Missing or unsafe file/);
});

test('a later secret hunt updates Latest without increasing the level count', () => {
  const level = {...hunt,id:'level-01',recorded:'2026-09-10'};
  assert.deepEqual(catalogueMeta([level],[hunt]), {count:1,secretHuntCount:1,latest:'2027-02-03',latestLabel:'Feb 3, 2027'});
});

test('secret hunting uses native grouped links and complete escaped notes without JavaScript', () => {
  const before = JSON.stringify(hunt);
  const html = renderSecretHunts([hunt]);
  assert.match(html,/<details class="world-group" data-world>/);
  assert.match(html,/>Secret hunting</);
  assert.match(html,/id="secret-hunt-001" data-level="secret-hunt-001"/);
  assert.match(html,/data-label="Secret hunt 001"/);
  assert.match(html,/href="\/baba-is-you-media-2\/media\/secret-hunt-001.mp4" data-watch/);
  assert.match(html,/>001<\/span>/);
  assert.match(html,/Map &lt;transformation&gt;/);
  const notes = renderNotes([], [hunt]);
  assert.match(notes,/<details data-notes-id="secret-hunt-001"><summary>Secret hunt 001/);
  assert.match(notes,/Move &lt;words&gt;/);
  assert.doesNotMatch(notes,/ hidden/);
  assert.throws(() => renderNotes([], [{...hunt,notes:{...hunt.notes,attempts:''}}]), /Missing attempts/);
  assert.equal(JSON.stringify(hunt), before);
  assert.equal(renderSecretHunts([]), '');
});
