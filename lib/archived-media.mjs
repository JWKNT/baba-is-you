import {existsSync, readFileSync, statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {localAssetURL} from './catalogue.mjs';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const hash = /^[0-9a-f]{64}$/;
const commit = /^[0-9a-f]{40}$/;
const media = /^(?:media\/|\/baba-is-you-media(?:-2)?\/media\/)[\w-][\w.-]*\.mp4$/;

// Only an exact previously verified recording can use its archived inventory.
// New media and every poster still require a physical local file.
export function mediaAvailability(recordings, inventory, root, io = {}) {
  const exists = io.exists ?? existsSync;
  const read = io.read ?? readFileSync;
  const stat = io.stat ?? statSync;
  if (inventory?.version !== 1 || !Array.isArray(inventory.records)) throw new Error('Invalid archived media inventory');
  const archived = new Map();
  for (const row of inventory.records) {
    const repository = row.file?.startsWith('/baba-is-you-media-2/') ? 'JWKNT/baba-is-you-media-2'
      : row.file?.startsWith('/baba-is-you-media/') ? 'JWKNT/baba-is-you-media' : 'JWKNT/baba-is-you';
    if (!media.test(row.file) || archived.has(row.file) || typeof row.id !== 'string' ||
        !hash.test(row.sha256) || !hash.test(row.manifestSha256) || !commit.test(row.verifiedCommit) ||
        row.repository !== repository || !/^data\/pause-edits-(?:\d{3,}|secret-hunt-\d{3,})\.json$/.test(row.manifest) ||
        !Number.isSafeInteger(row.bytes) || row.bytes <= 1000 || row.bytes >= 100 * 1024 * 1024 ||
        !Number.isFinite(row.seconds) || row.seconds <= 0) throw new Error('Invalid archived media record');
    archived.set(row.file, row);
  }
  const byFile = new Map(recordings.map(recording => [recording.file, recording]));
  function bytes(path) {
    if (!media.test(path)) throw new Error('Unsafe media path');
    const local = localAssetURL(path, root);
    if (exists(local)) return stat(local).size;
    const row = archived.get(path), recording = byFile.get(path);
    if (!row || !recording || row.id !== recording.id || row.seconds !== recording.seconds) {
      throw new Error(`Missing local media without matching verified archive: ${path}`);
    }
    const manifest = new URL(row.manifest, root);
    if (!exists(manifest) || sha256(read(manifest)) !== row.manifestSha256) {
      throw new Error(`Archived media manifest changed: ${path}`);
    }
    return row.bytes;
  }
  return {
    bytes,
    exists(path) {
      if (!media.test(path)) return exists(localAssetURL(path, root));
      try { return bytes(path) > 1000; } catch { return false; }
    },
  };
}
