import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rawDuration,rawFootageRecords,renderRawFootage,renderRawTotals} from '../lib/raw-footage.mjs';
const source='a'.repeat(64);
const record=(id,start,end)=>({id,capturedSeconds:end-start,originalCaptureCount:1,knownMissingInputs:0,allocations:[{sourceSha256:source,sourceSecondsWindow:[start,end]}]});
const untimed=()=>({
 sourceSha256:'b'.repeat(64), sourceSecondsWindow:null, originalBytes:16886716,
 sourceName:'damaged-original.mov', provenance:'Original game-window capture; no replay replacement.',
 durationUnknownReason:'Disk Full left no original sample timestamps.',
 recoveredFrameCount:4544, recoveredFrameIndexWindowInclusive:[0,4543], originalTimestampsAvailable:false,
 knownMissingInputNumbers:[46,47], missingInputCountIsExhaustive:false,
 evidence:{path:'handoff/recovery/part2-audit.json',sha256:'c'.repeat(64)}
});
const partial=()=>({...record('level-02',0,10),originalCaptureCount:2,knownMissingInputs:2,unknownDurationAllocations:[untimed()]});

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

test('untimed originals count toward sources and exact bytes, but never captured seconds',()=>{
 const row=partial();
 row.allocations.push({sourceSha256:'d'.repeat(64),sourceSecondsWindow:[0,20],originalBytes:200});
 row.allocations[0].originalBytes=100;
 row.originalCaptureCount=3;row.originalBytes=16887016;row.capturedSeconds=30;
 const rows=rawFootageRecords({version:1,records:[row]});
 assert.equal(rows.get(row.id),row);
 const html=renderRawFootage(row);
 assert.match(html,/Known-duration subtotal: <strong>30 s/);
 assert.match(html,/Duration is unknown for 1 of 3 original captures/);
 assert.match(html,/3 originals total 16,887,016 bytes/);
 assert.match(html,/At least 2 inputs have known missing video/);
 assert.match(html,/Other input coverage is not fully certified/);
 assert.doesNotMatch(html,/151|4544|30 s captured/);
 assert.throws(()=>rawFootageRecords({version:1,records:[{...row,capturedSeconds:181.466667}]}),/differs/);
});

test('an exclusively untimed source has a zero known subtotal, not a fabricated duration',()=>{
 const row={id:'level-03',capturedSeconds:0,originalCaptureCount:1,knownMissingInputs:2,allocations:[],unknownDurationAllocations:[untimed()]};
 const rows=rawFootageRecords({version:1,records:[row]});
 assert.match(renderRawTotals([row],[],rows),/0 s<\/strong> known-duration subtotal/);
 assert.match(renderRawFootage(row),/Duration is unknown/);
 assert.throws(()=>rawFootageRecords({version:1,records:[record('level-03',0,0)]}),/Invalid/);
});

test('unknown timing requires original provenance, complete recovered frame window and gap evidence',()=>{
 const changes=[
  {sourceSecondsWindow:[0,151.466667]},{originalBytes:0},{sourceName:''},{provenance:''},{durationUnknownReason:''},
  {recoveredFrameCount:0},{recoveredFrameIndexWindowInclusive:[1,4543]},{recoveredFrameIndexWindowInclusive:[0,4544]},
  {originalTimestampsAvailable:true},{knownMissingInputNumbers:[47,46]},{knownMissingInputNumbers:[46,46]},
  {missingInputCountIsExhaustive:undefined},{evidence:{path:'audit.json',sha256:'bad'}},
  {evidence:{path:'',sha256:'c'.repeat(64)}},{capturedSeconds:151.466667}
 ];
 for(const change of changes) {
  const row=partial();Object.assign(row.unknownDurationAllocations[0],change);
  assert.throws(()=>rawFootageRecords({version:1,records:[row]}),/Invalid unknown-duration/);
 }
 assert.throws(()=>rawFootageRecords({version:1,records:[{...partial(),unknownDurationAllocations:null}]}),/Invalid/);
 assert.throws(()=>rawFootageRecords({version:1,records:[{...partial(),knownMissingInputs:1}]}),/understates/);
});

test('unknown originals cannot be shared, duplicated or silently given timed allocations',()=>{
 const a=partial(),b={...record('secret-hunt-002',0,10),allocations:[{sourceSha256:'b'.repeat(64),sourceSecondsWindow:[0,10]}]};
 for(const records of [[a,b],[b,a],[a,{...a,id:'secret-hunt-002',allocations:[{sourceSha256:'d'.repeat(64),sourceSecondsWindow:[0,10]}]}]]) {
  assert.throws(()=>rawFootageRecords({version:1,records}),/exclusively/);
 }
 const same=partial();same.unknownDurationAllocations[0].sourceSha256=source;
 assert.throws(()=>rawFootageRecords({version:1,records:[same]}),/counted more than once/);
});

test('original source counts and full-file byte totals remain exact',()=>{
 const row=partial();
 assert.throws(()=>rawFootageRecords({version:1,records:[{...row,originalCaptureCount:1}]}),/Invalid/);
 assert.throws(()=>rawFootageRecords({version:1,records:[{...row,originalBytes:16886716}]}),/bytes differ/);
 row.allocations[0].originalBytes=100;row.originalBytes=16886816;
 assert.doesNotThrow(()=>rawFootageRecords({version:1,records:[row]}));
 assert.throws(()=>rawFootageRecords({version:1,records:[{...row,originalBytes:16886815}]}),/bytes differ/);
 const shared=record('secret-hunt-002',10,20);shared.allocations[0].originalBytes=101;
 assert.throws(()=>rawFootageRecords({version:1,records:[row,shared]}),/byte counts differ/);
});

test('mixed collection labels identify a known subtotal and preserve shared-source accounting',()=>{
 const level=partial(),hunt=record('secret-hunt-002',10,20);
 const rows=rawFootageRecords({version:1,records:[level,hunt]});
 const html=renderRawTotals([level],[hunt],rows);
 assert.match(html,/20 s<\/strong> known-duration subtotal/);
 assert.match(html,/levels 10 s; secret hunts 10 s/);
 assert.match(html,/Duration is unknown for 1 original capture/);
 assert.doesNotMatch(html,/<\/strong> total/);
 assert.match(renderRawTotals([{id:'level-99'}],[],new Map()),/known-duration subtotal/);
});

test('maintained data covers every current recording and renders native raw sections',()=>{
 const root=new URL('../',import.meta.url);
 const data=rawFootageRecords(JSON.parse(readFileSync(new URL('data/raw-footage.json',root))));
 const recordings=[...JSON.parse(readFileSync(new URL('data/levels.json',root))),...JSON.parse(readFileSync(new URL('data/secret-hunts.json',root)))];
 for(const entry of recordings)assert.ok(data.has(entry.id),`add raw-footage data for ${entry.id}`);
 const page=readFileSync(new URL('index.html',root),'utf8');
 assert.equal((page.match(/<h3>Raw footage<\/h3>/g)||[]).length,recordings.length);
});
