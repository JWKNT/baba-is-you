import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rawDuration,rawFootageRecords,renderRawFootage,renderRawTotals} from '../lib/raw-footage.mjs';
const source='a'.repeat(64);
const record=(id,start,end)=>({id,capturedSeconds:end-start,originalCaptureCount:1,knownMissingInputs:0,allocations:[{sourceSha256:source,sourceSecondsWindow:[start,end]}]});

test('shared captures use disjoint allocations and cannot inflate totals',()=>{
 const data={version:1,records:[record('level-01',0,10),record('secret-hunt-001',10,20)]};
 const rows=rawFootageRecords(data);
 const html=renderRawTotals([{id:'level-01'}],[{id:'secret-hunt-001'}],rows);
 assert.match(html,/20 s<\/strong> total/);assert.match(html,/levels 10 s; secret hunts 10 s/);
 assert.throws(()=>rawFootageRecords({version:1,records:[record('level-01',0,11),record('secret-hunt-001',10,20)]}),/overlaps/);
 assert.throws(()=>rawFootageRecords({version:1,records:[{...record('level-01',0,10),capturedSeconds:12}]}),/differs/);
});

test('missing footage remains unavailable and gap inputs do not add duration',()=>{
 assert.equal(rawDuration(3661),'1 h 1 min 1 s');
 assert.match(renderRawFootage({...record('level-01',0,9),knownMissingInputs:8}),/8 missing-video inputs are excluded/);
 assert.match(renderRawFootage(null),/unavailable/);
 assert.match(renderRawTotals([{id:'level-01'}],[],new Map()),/Source durations unavailable for 1 recording; excluded/);
});

test('maintained data covers every current recording and renders native raw sections',()=>{
 const root=new URL('../',import.meta.url);
 const data=rawFootageRecords(JSON.parse(readFileSync(new URL('data/raw-footage.json',root))));
 const recordings=[...JSON.parse(readFileSync(new URL('data/levels.json',root))),...JSON.parse(readFileSync(new URL('data/secret-hunts.json',root)))];
 for(const entry of recordings)assert.ok(data.has(entry.id),`add raw-footage data for ${entry.id}`);
 const page=readFileSync(new URL('index.html',root),'utf8');
 assert.equal((page.match(/<h3>Raw footage<\/h3>/g)||[]).length,recordings.length);
});
