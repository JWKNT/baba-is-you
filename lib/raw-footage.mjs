import {escape} from './catalogue.mjs';

export function rawDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return 'Unavailable';
  const total = Math.round(seconds), hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60), remainder = total % 60;
  return [hours ? `${hours} h` : '', minutes ? `${minutes} min` : '', `${remainder} s`].filter(Boolean).join(' ');
}

export function rawFootageRecords(data) {
  if (data?.version !== 1 || !Array.isArray(data.records)) throw new Error('Invalid raw footage data');
  const records = new Map(), sources = new Map();
  for (const record of data.records) {
    if (!/^(?:level-\d{2,}|secret-hunt-\d{3,})$/.test(record.id) || records.has(record.id) ||
        !Number.isFinite(record.capturedSeconds) || record.capturedSeconds <= 0 ||
        !Number.isSafeInteger(record.originalCaptureCount) || record.originalCaptureCount < 1 ||
        !Number.isSafeInteger(record.knownMissingInputs) || record.knownMissingInputs < 0 ||
        !Array.isArray(record.allocations) || record.allocations.length !== record.originalCaptureCount) {
      throw new Error('Invalid raw footage record');
    }
    let total = 0;
    for (const allocation of record.allocations) {
      const [start, end] = allocation.sourceSecondsWindow ?? [];
      if (!/^[0-9a-f]{64}$/.test(allocation.sourceSha256) || !Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
        throw new Error('Invalid raw footage allocation');
      }
      const prior = sources.get(allocation.sourceSha256) ?? [];
      if (prior.some(([a, b]) => start < b - .000001 && end > a + .000001)) throw new Error('Raw footage shared allocation overlaps');
      prior.push([start, end]); sources.set(allocation.sourceSha256, prior); total += end - start;
    }
    if (Math.abs(total - record.capturedSeconds) > .001) throw new Error('Raw footage duration differs from allocations');
    records.set(record.id, record);
  }
  return records;
}

export function renderRawFootage(record) {
  if (!record) return '<h3>Raw footage</h3><p>Source duration unavailable.</p>';
  return `<h3>Raw footage</h3><p>${escape(rawDuration(record.capturedSeconds))} captured before editing or speed changes, including pauses and menus.${record.knownMissingInputs ? ` ${record.knownMissingInputs} missing-video inputs are excluded from this time.` : ''}</p>`;
}

export function renderRawTotals(levels, hunts, records) {
  const sum = items => items.reduce((total, item) => total + (records.get(item.id)?.capturedSeconds ?? 0), 0);
  const missing = [...levels, ...hunts].filter(item => !records.has(item.id)).length;
  const levelSeconds = sum(levels), huntSeconds = sum(hunts);
  return `<p class="collection-note raw-footage-total">Raw footage: <strong>${rawDuration(levelSeconds + huntSeconds)}</strong> total — levels ${rawDuration(levelSeconds)}${hunts.length ? `; secret hunts ${rawDuration(huntSeconds)}` : ''}. Captured before edits and speed changes; shared recordings are counted once.${missing ? ` Source durations unavailable for ${missing} recording${missing === 1 ? '' : 's'}; excluded from totals.` : ''}</p>`;
}
