import test from 'node:test';
import assert from 'node:assert/strict';
import {renderNotes} from '../lib/notes.mjs';
const level={id:'level-01',code:'00',title:'Baba & You',notes:{approach:'Push <WIN>.',mechanics:'Rules change.',attempts:'A restart is retained.'}};
test('notes are escaped and available as native disclosures before enhancement',()=>{
 const html=renderNotes([level]);
 assert.match(html,/<details data-notes-id="level-01">/);
 assert.match(html,/Baba &amp; You/);
 assert.match(html,/Push &lt;WIN&gt;/);
 assert.ok(!html.includes(' hidden'));
});
test('publication rejects levels with incomplete notes',()=>{
 assert.throws(()=>renderNotes([{...level,notes:{...level.notes,attempts:''}}]),/Missing attempts/);
});
