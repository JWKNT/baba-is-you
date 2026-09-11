import {escape} from './catalogue.mjs';

const sha256 = value => typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
const positiveInteger = value => Number.isSafeInteger(value) && value > 0;
const nonempty = value => typeof value === 'string' && value.trim().length > 0;

function validateUntimedOriginal(source) {
  const frames = source.recoveredFrameIndexWindowInclusive;
  const gaps = source.knownMissingInputNumbers;
  if (source.sourceSecondsWindow !== null || !positiveInteger(source.originalBytes) ||
      !nonempty(source.sourceName) || !nonempty(source.provenance) || !nonempty(source.durationUnknownReason) ||
      source.originalTimestampsAvailable !== false || !positiveInteger(source.recoveredFrameCount) ||
      !Array.isArray(frames) || frames.length !== 2 || frames[0] !== 0 || frames[1] !== source.recoveredFrameCount - 1 ||
      !Array.isArray(gaps) || gaps.some((number, index) => !positiveInteger(number) || (index && number <= gaps[index - 1])) ||
      typeof source.missingInputCountIsExhaustive !== 'boolean' ||
      !nonempty(source.evidence?.path) || !sha256(source.evidence?.sha256) ||
      (source.capturedSeconds !== undefined && source.capturedSeconds !== null)) {
    throw new Error('Invalid unknown-duration original or recovery evidence');
  }
}

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
    const unknown = record.unknownDurationAllocations === undefined ? [] : record.unknownDurationAllocations;
    if (!/^(?:level-\d{2,}|secret-hunt-\d{3,})$/.test(record.id) || records.has(record.id) ||
        !Array.isArray(unknown) || !Number.isFinite(record.capturedSeconds) || record.capturedSeconds < 0 ||
        (!unknown.length && record.capturedSeconds === 0) ||
        !Number.isSafeInteger(record.originalCaptureCount) || record.originalCaptureCount < 1 ||
        !Number.isSafeInteger(record.knownMissingInputs) || record.knownMissingInputs < 0 ||
        !Array.isArray(record.allocations) || record.allocations.length + unknown.length !== record.originalCaptureCount) {
      throw new Error('Invalid raw footage record');
    }
    let total = 0, bytes = 0, byteCounts = 0;
    const originals = new Set();
    for (const [allocation, untimed] of [...record.allocations.map(value => [value, false]), ...unknown.map(value => [value, true])]) {
      if (!allocation || !sha256(allocation.sourceSha256)) throw new Error('Invalid raw footage allocation');
      if (originals.has(allocation.sourceSha256)) throw new Error('Raw footage original counted more than once');
      originals.add(allocation.sourceSha256);
      const prior = sources.get(allocation.sourceSha256);
      if (untimed) validateUntimedOriginal(allocation);
      // An untimed original is assigned whole and exclusively: no invented time
      // partition can prove it disjoint from another allocation of that source.
      if (prior && (untimed || prior.untimed)) throw new Error('Unknown-duration original must be allocated exclusively');
      const windows = prior?.windows ?? [];
      if (!untimed) {
        const window = allocation.sourceSecondsWindow;
        const [start, end] = Array.isArray(window) ? window : [];
        if (!Array.isArray(window) || window.length !== 2 || !Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
          throw new Error('Invalid raw footage allocation');
        }
        if (windows.some(([a, b]) => start < b - .000001 && end > a + .000001)) throw new Error('Raw footage shared allocation overlaps');
        windows.push([start, end]); total += end - start;
      }
      if (allocation.originalBytes !== undefined && !positiveInteger(allocation.originalBytes)) {
        throw new Error('Invalid raw footage allocation');
      }
      if (prior?.originalBytes !== undefined && allocation.originalBytes !== undefined && prior.originalBytes !== allocation.originalBytes) {
        throw new Error('Raw footage original byte counts differ');
      }
      if (allocation.originalBytes !== undefined) {bytes += allocation.originalBytes; byteCounts++;}
      sources.set(allocation.sourceSha256, {windows, untimed, originalBytes: allocation.originalBytes ?? prior?.originalBytes});
    }
    if (Math.abs(total - record.capturedSeconds) > .001) throw new Error('Raw footage duration differs from allocations');
    if (record.originalBytes !== undefined && (!positiveInteger(record.originalBytes) || byteCounts !== record.originalCaptureCount || !Number.isSafeInteger(bytes) || bytes !== record.originalBytes)) {
      throw new Error('Raw footage original bytes differ from allocations');
    }
    if (unknown.reduce((sum, source) => sum + source.knownMissingInputNumbers.length, 0) > record.knownMissingInputs) {
      throw new Error('Raw footage missing-input count understates recovery evidence');
    }
    records.set(record.id, record);
  }
  return records;
}

export function renderRawFootage(record) {
  if (!record) return '<h3>Raw footage</h3><p>Source duration unavailable.</p>';
  const unknown = record.unknownDurationAllocations ?? [];
  if (unknown.length) {
    const incomplete = unknown.some(source => !source.missingInputCountIsExhaustive);
    const bytes = record.originalBytes === undefined ? '' : ` The ${record.originalCaptureCount} original${record.originalCaptureCount === 1 ? '' : 's'} total${record.originalCaptureCount === 1 ? 's' : ''} ${record.originalBytes.toLocaleString('en-US')} bytes.`;
    const gaps = record.knownMissingInputs ? ` ${incomplete ? 'At least ' : ''}${record.knownMissingInputs} inputs have known missing video.` : '';
    return `<h3>Raw footage</h3><p>Known-duration subtotal: <strong>${escape(rawDuration(record.capturedSeconds))}</strong>, before editing or speed changes, including pauses and menus. Duration is unknown for ${unknown.length} of ${record.originalCaptureCount} original captures; their time is excluded from this subtotal.${bytes}${gaps}${incomplete ? ' Other input coverage is not fully certified.' : ''}</p>`;
  }
  return `<h3>Raw footage</h3><p>${escape(rawDuration(record.capturedSeconds))} captured before editing or speed changes, including pauses and menus.${record.knownMissingInputs ? ` ${record.knownMissingInputs} missing-video inputs are excluded from this time.` : ''}</p>`;
}

export function renderRawTotals(levels, hunts, records) {
  const sum = items => items.reduce((total, item) => total + (records.get(item.id)?.capturedSeconds ?? 0), 0);
  const missing = [...levels, ...hunts].filter(item => !records.has(item.id)).length;
  const levelSeconds = sum(levels), huntSeconds = sum(hunts);
  const unknown = new Set([...levels, ...hunts].flatMap(item => records.get(item.id)?.unknownDurationAllocations?.map(source => source.sourceSha256) ?? [])).size;
  return `<p class="collection-note raw-footage-total">Raw footage: <strong>${rawDuration(levelSeconds + huntSeconds)}</strong> ${unknown || missing ? 'known-duration subtotal' : 'total'} — levels ${rawDuration(levelSeconds)}${hunts.length ? `; secret hunts ${rawDuration(huntSeconds)}` : ''}. Captured before edits and speed changes; shared recordings are counted once.${unknown ? ` Duration is unknown for ${unknown} original capture${unknown === 1 ? '' : 's'}; their time is excluded from this subtotal.` : ''}${missing ? ` Source durations unavailable for ${missing} recording${missing === 1 ? '' : 's'}; excluded from totals.` : ''}</p>`;
}
