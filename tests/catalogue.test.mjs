import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {mediaAvailability} from '../lib/archived-media.mjs';
const root=new URL('../',import.meta.url);
const levels=JSON.parse(readFileSync(new URL('data/levels.json',root)));
const secretHunts=JSON.parse(readFileSync(new URL('data/secret-hunts.json',root)));
const recordings=[...levels,...secretHunts];
const availability=mediaAvailability(recordings,JSON.parse(readFileSync(new URL('data/archived-media.json',root))),root);
test('rebuild is deterministic and every recording has a native link',()=>{
 const before=readFileSync(new URL('index.html',root),'utf8');
 execFileSync(process.execPath,['build.mjs'],{cwd:root});
 const after=readFileSync(new URL('index.html',root),'utf8');assert.equal(after,before);
 for(const l of recordings){assert.ok(after.includes(`href="${l.file}" data-watch`));assert.ok(after.includes(`id="${l.id}"`));assert.ok(availability.bytes(l.file)>1000);}
});
test('page has one native player, no autoplay and the correct public identity',()=>{
 const html=readFileSync(new URL('index.html',root),'utf8');
 assert.equal((html.match(/<video\b/g)||[]).length,1);assert.ok(html.includes('controls playsinline'));assert.ok(!html.includes('autoplay'));
 assert.ok(html.includes('rel="canonical" href="https://jehlp.net/baba-is-you/"'));assert.ok(!/href="\/(?:"|index)/.test(html));
});
test('all recording identities are distinct and media files fit the repository limit',()=>{
 assert.equal(new Set(recordings.map(l=>l.id)).size,recordings.length);
 for(const l of recordings)assert.ok(availability.bytes(l.file)<100*1024*1024);
});
test('the visible level count excludes secret hunts and each hunt has native notes',()=>{
 const html=readFileSync(new URL('index.html',root),'utf8');
 assert.ok(html.includes(`${levels.length} level ${levels.length===1?'recording':'recordings'}`));
 if(secretHunts.length)assert.ok(html.includes(`${secretHunts.length} secret ${secretHunts.length===1?'hunt':'hunts'}`));
 for(const hunt of secretHunts)assert.ok(html.includes(`<details data-notes-id="${hunt.id}">`));
});
