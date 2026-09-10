import {escape} from './catalogue.mjs';
import {secretHuntLabel} from './secret-hunts.mjs';
import {renderRawFootage} from './raw-footage.mjs';
export function renderNotes(levels, secretHunts = [], raw = null) {
 const recordings = [...levels, ...secretHunts.map(hunt => ({...hunt, code: secretHuntLabel(hunt)}))];
 return `<section class="level-notes" id="level-notes" aria-labelledby="notes-heading"><h2 id="notes-heading">Recording notes</h2>${recordings.map(level => {
  for (const key of ['approach','mechanics','attempts']) {
   if (typeof level.notes?.[key] !== 'string' || !level.notes[key].trim()) throw new Error(`Missing ${key} notes for ${level.id}`);
  }
  return `<details data-notes-id="${level.id}"><summary>${escape(level.code)} · ${escape(level.title)}</summary>${[['approach','Approach'],['mechanics','Mechanics'],['attempts','Attempts']].map(([key,label])=>`<h3>${label}</h3><p>${escape(level.notes[key])}</p>`).join('')}${raw ? renderRawFootage(raw.get(level.id)) : ''}</details>`;
 }).join('')}</section>`;
}
