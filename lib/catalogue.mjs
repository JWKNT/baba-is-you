export const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

export const duration = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
export const levelNumber = number => String(number).padStart(2, '0');

export function validateLevels(levels, assetExists = () => true) {
  if (!Array.isArray(levels) || !levels.length) throw new Error('Add at least one recording');
  const ids = new Set();
  const numbers = new Set();
  for (const level of levels) {
    if (!level || !Number.isSafeInteger(level.number) || level.number < 1 || numbers.has(level.number)) {
      throw new Error('Each level needs a unique positive number');
    }
    if (level.id !== `level-${levelNumber(level.number)}` || ids.has(level.id)) throw new Error('Level ID must match its number');
    if (typeof level.title !== 'string' || !level.title.trim()) throw new Error('Each level needs a title');
    if (!Number.isFinite(level.seconds) || level.seconds <= 0) throw new Error('Invalid recording duration');
    if (typeof level.recorded !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(level.recorded) ||
        !Number.isFinite(Date.parse(level.recorded)) || new Date(level.recorded).toISOString().slice(0, 10) !== level.recorded) {
      throw new Error('Recording date must be a real ISO date');
    }
    for (const [field, pattern] of [
      ['file', /^(?:media\/|\/baba-is-you-media(?:-2)?\/media\/)[\w-][\w.-]*\.mp4$/],
      ['poster', /^assets\/[\w-][\w.-]*\.(?:jpg|jpeg|png|webp)$/],
    ]) {
      if (typeof level[field] !== 'string' || !pattern.test(level[field]) || !assetExists(level[field])) {
        throw new Error(`Missing or unsafe ${field}`);
      }
    }
    ids.add(level.id);
    numbers.add(level.number);
  }
}

export function catalogueMeta(levels) {
  validateLevels(levels);
  const latest = levels.reduce((date, level) => level.recorded > date ? level.recorded : date, levels[0].recorded);
  return {
    count: levels.length,
    latest,
    latestLabel: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(latest)),
  };
}

// Resolve only the two approved companion stores for local build verification.
export function localAssetURL(path, root) {
  if (/^\/baba-is-you-media(?:-2)?\/media\/[\w-][\w.-]*\.mp4$/.test(path)) return new URL(`..${path}`, root);
  if (/^(?:media\/[\w-][\w.-]*\.mp4|assets\/[\w-][\w.-]*\.(?:jpg|jpeg|png|webp))$/.test(path)) return new URL(path, root);
  throw new Error('Unsafe asset path');
}
