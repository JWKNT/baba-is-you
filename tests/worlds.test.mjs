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
  const emitter = (properties = {}) => ({listeners:{}, addEventListener(name, fn) {this.listeners[name]=fn;}, ...properties});
  const groups = ['Opening', 'Lake', 'Forest'].map((name, i) => {
    const rows = [1,2].map(n => ({hidden:false,dataset:{search:`${name} ${n} ${n === 1 ? 'Café' : 'Bridge'}`}}));
    return {open:i === 0,hidden:false,rows,querySelectorAll:()=>rows,classList:{toggle(){}}};
  });
  const input = emitter({value:'', focus(){this.focused=true;}});
  const form = emitter({hidden:true});
  const status = {textContent:''};
  const window = emitter();
  runInNewContext(readFileSync(new URL('../assets/world-browser.js', import.meta.url),'utf8'), {window, document:{querySelector:s=>({'.world-search':form,'#level-search':input,'#search-status':status}[s]), querySelectorAll:()=>groups}});
  return {groups,input,form,status,window, search(query){input.value=query;input.listeners.input();}};
}

test('search spans closed worlds, matches multiple normalized terms and restores open state', () => {
  const p = setup();
  assert.equal(p.form.hidden,false);
  p.groups[1].open=true;
  p.search('forest cafe');
  assert.deepEqual(p.groups.map(g=>g.hidden),[true,true,false]);
  assert.equal(p.groups[2].open,true);
  assert.equal(p.groups[2].rows[1].hidden,true);
  assert.equal(p.status.textContent,'1 matching recording.');
  p.search('not-a-level');
  assert.match(p.status.textContent,/No matching/);
  p.input.listeners.keydown({key:'Escape',preventDefault(){}});
  assert.deepEqual(p.groups.map(g=>g.open),[true,true,false]);
  assert.ok(p.groups.every(g=>!g.hidden && g.rows.every(r=>!r.hidden)));
  assert.equal(p.status.textContent,'');
});

test('selection reveals its world, clears a conflicting filter, and reset retains focus', () => {
  const p=setup();
  p.search('Lake');
  p.window.BabaWorldBrowser.reveal(p.groups[2].rows[0]);
  assert.equal(p.input.value,'');
  assert.equal(p.groups[2].open,true);
  assert.equal(p.groups[2].hidden,false);
  p.search('Lake');
  p.form.listeners.reset({preventDefault(){}});
  assert.equal(p.input.focused,true);
  assert.equal(p.input.value,'');
});

test('print temporarily reveals all groups and restores search and disclosure state', () => {
  const p=setup();p.search('Lake 1');
  const before=JSON.stringify(p.groups.map(g=>[g.open,g.hidden,g.rows.map(r=>r.hidden)]));
  p.window.listeners.beforeprint();
  assert.ok(p.groups.every(g=>g.open&&!g.hidden&&g.rows.every(r=>!r.hidden)));
  p.window.listeners.afterprint();
  assert.equal(JSON.stringify(p.groups.map(g=>[g.open,g.hidden,g.rows.map(r=>r.hidden)])),before);
});
