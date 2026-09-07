import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {levelIdentity, groupLevels, renderWorlds} from '../lib/worlds.mjs';

test('world names, extras, letter levels and opening numbers are derived without mutating records', () => {
  const level = {number: 63, title: 'Fall A — Literacy'};
  assert.deepEqual(levelIdentity(level), {world:'Forest of Fall', code:'A', name:'Literacy'});
  assert.deepEqual(levelIdentity({number: 23, title:'Island 00 — Poem'}), {world:'Solitary Island', code:'00', name:'Poem'});
  assert.equal(levelIdentity({number: 90, title:'Forest Extra 1 — Crumbling Floor'}).code, 'Extra 1');
  assert.equal(levelIdentity({number: 1, title:'Where Do I Go?'}).world, 'Opening');
  assert.equal(levelIdentity({number: 120, title:'Future 01 — Test'}).world, 'Future');
  assert.equal(levelIdentity({number: 120, title:'Unprefixed'}).world, 'Ungrouped');
  assert.equal(levelIdentity({...level, world:'Custom'}).world, 'Custom');
  assert.throws(() => levelIdentity({...level, world: {}}), /Invalid/);
  assert.deepEqual(level, {number:63, title:'Fall A — Literacy'});
});

test('all real recordings preserve order, identity, native links and full player titles', () => {
  const levels = JSON.parse(readFileSync(new URL('../data/levels.json', import.meta.url)));
  const original = JSON.stringify(levels);
  const groups = groupLevels(levels);
  assert.equal(groups.reduce((n, g) => n + g.levels.length, 0), levels.length);
  assert.equal(new Set(groups.flatMap(g => g.levels.map(l => l.id))).size, levels.length);
  for (const group of groups) assert.deepEqual(group.levels.map(l => l.id), levels.filter(l => levelIdentity(l).world === group.name).map(l => l.id));
  const html = renderWorlds(levels);
  for (const l of levels) assert.ok(html.includes(`href="${l.file}" data-watch`));
  assert.equal((html.match(/data-world open/g) || []).length, 1);
  assert.equal(JSON.stringify(levels), original);
});

test('500 recordings use the same renderer, with escaped labels and no fixed group limit', () => {
  const levels = Array.from({length:500}, (_, i) => ({id:`level-${i+1}`,number:i+1,title:`World ${Math.floor(i/20)} 01 — Name <${i}>`,file:`media/${i}.mp4`,poster:`assets/${i}.jpg`,seconds:60}));
  const html = renderWorlds(levels);
  assert.equal(groupLevels(levels).length,25);
  assert.equal((html.match(/data-watch/g)||[]).length,500);
  assert.ok(html.includes('Name &lt;499&gt;'));
});

function setup() {
  const groups = [0,1,2].map(i => ({open:i===0, rows:[{},{}], querySelectorAll(){return this.rows;}, classList:{toggle(){}}}));
  const window = {listeners:{},addEventListener(name,fn){this.listeners[name]=fn;}};
  runInNewContext(readFileSync(new URL('../assets/world-browser.js', import.meta.url),'utf8'), {window,document:{querySelectorAll:()=>groups}});
  return {groups,window};
}

test('selection reveals its world without depending on a search form', () => {
  const p=setup();p.window.BabaWorldBrowser.reveal(p.groups[2].rows[0]);
  assert.equal(p.groups[2].open,true);
  assert.equal(p.groups[0].open,true);
});

test('print temporarily reveals all worlds and restores disclosure state', () => {
  const p=setup();
  p.window.listeners.beforeprint();p.window.listeners.beforeprint();
  assert.ok(p.groups.every(g=>g.open));
  p.window.listeners.afterprint();
  assert.deepEqual(p.groups.map(g=>g.open),[true,false,false]);
});

test('page replaces search and dedicated PiP with one decorative rule-tile divider', () => {
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  assert.doesNotMatch(html,/type="search"|id="pip"|pip-note|search-status|data-search/);
  assert.equal((html.match(/class="rule-divider"/g)||[]).length,1);
  assert.match(html,/class="rule-divider" aria-hidden="true"/);
  assert.doesNotMatch(html,/disablepictureinpicture/i);
});
