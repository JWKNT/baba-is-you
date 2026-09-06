import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {localAssetURL} from '../lib/catalogue.mjs';
const root=new URL('../',import.meta.url);
const levels=JSON.parse(readFileSync(new URL('data/levels.json',root)));
test('rebuild is deterministic and every recording has a native link',()=>{
 const before=readFileSync(new URL('index.html',root),'utf8');
 execFileSync(process.execPath,['build.mjs'],{cwd:root});
 const after=readFileSync(new URL('index.html',root),'utf8');assert.equal(after,before);
 for(const l of levels){assert.ok(after.includes(`href="${l.file}" data-watch`));assert.ok(after.includes(`id="${l.id}"`));assert.ok(statSync(localAssetURL(l.file,root)).size>1000);}
});
test('page has one native player, no autoplay and the correct public identity',()=>{
 const html=readFileSync(new URL('index.html',root),'utf8');
 assert.equal((html.match(/<video\b/g)||[]).length,1);assert.ok(html.includes('controls playsinline'));assert.ok(!html.includes('autoplay'));
 assert.ok(html.includes('rel="canonical" href="https://jehlp.net/baba-is-you/"'));assert.ok(!/href="\/(?:"|index)/.test(html));
});
test('all level identities are distinct and media files fit the repository limit',()=>{
 assert.equal(new Set(levels.map(l=>l.id)).size,levels.length);
 for(const l of levels)assert.ok(statSync(localAssetURL(l.file,root)).size<100*1024*1024);
});
