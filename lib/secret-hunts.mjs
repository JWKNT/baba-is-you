import {secretHuntNumber} from './catalogue.mjs';
import {renderRecordingGroup} from './worlds.mjs';

export const secretHuntLabel = hunt => `Secret hunt ${secretHuntNumber(hunt.number)}`;

export function renderSecretHunts(hunts) {
  if (!hunts.length) return '';
  return renderRecordingGroup({
    name: 'Secret hunting',
    levels: hunts.map(hunt => ({...hunt, code: secretHuntNumber(hunt.number), name: hunt.title})),
  }, {labelFor: secretHuntLabel});
}
