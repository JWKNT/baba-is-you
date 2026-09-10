import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mediaAvailability} from '../lib/archived-media.mjs';
const root=new URL('file:///sites/baba-is-you/');
const manifest=Buffer.from('{"source":"old.mov"}');
const recording={id:'level-01',file:'media/001-baba.mp4',seconds:10};
const archived={id:recording.id,file:recording.file,seconds:10,bytes:2048,sha256:'a'.repeat(64),manifest:'data/pause-edits-001.json',manifestSha256:createHash('sha256').update(manifest).digest('hex'),repository:'JWKNT/baba-is-you',verifiedCommit:'b'.repeat(40)};
const inventory={version:1,records:[archived]};
const io={exists:url=>url.pathname.endsWith('/data/pause-edits-001.json'),read:()=>manifest,stat:()=>({size:4096})};

test('an exact verified archive satisfies missing media, never missing posters',()=>{
 const assets=mediaAvailability([recording],inventory,root,io);
 assert.equal(assets.bytes(recording.file),2048);assert.ok(assets.exists(recording.file));
 assert.equal(assets.exists('assets/missing.jpg'),false);
});

test('new media needs a local file and archive identity, duration and manifest must match',()=>{
 const fresh={id:'level-02',file:'media/002-new.mp4',seconds:20};
 assert.equal(mediaAvailability([recording,fresh],inventory,root,io).exists(fresh.file),false);
 assert.ok(mediaAvailability([fresh],inventory,root,{...io,exists:()=>true}).exists(fresh.file));
 for(const changed of [{...recording,id:'level-02'},{...recording,seconds:11}]){
  assert.equal(mediaAvailability([changed],inventory,root,io).exists(recording.file),false);
 }
 assert.equal(mediaAvailability([recording],inventory,root,{...io,read:()=>Buffer.from('changed')}).exists(recording.file),false);
});

test('unsafe or unverifiable archive entries fail instead of bypassing checks',()=>{
 for(const change of [{verifiedCommit:''},{sha256:'bad'},{bytes:0},{file:'../private.mp4'},{manifest:'../private.json'},{repository:'other'}]){
  assert.throws(()=>mediaAvailability([recording],{version:1,records:[{...archived,...change}]},root,io),/Invalid archived/);
 }
 assert.throws(()=>mediaAvailability([recording],{version:1,records:[archived,archived]},root,io),/Invalid archived/);
});
