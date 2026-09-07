import {escape, duration, levelNumber} from './catalogue.mjs';

// Existing recording titles use the game's short world prefixes. Unknown future
// prefixes remain separate groups; explicit world/code/name fields can override.
const names = {Lake: 'The Lake', Island: 'Solitary Island', Ruins: 'Temple Ruins',
  Fall: 'Forest of Fall', Forest: 'Deep Forest', Space: 'Rocket Trip', Garden: 'Flower Garden'};

export function levelIdentity(level) {
  for (const key of ['world', 'code', 'name']) {
    if (level[key] !== undefined && (typeof level[key] !== 'string' || !level[key].trim())) throw new Error(`Invalid level ${key}`);
  }
  const match = level.title.match(/^(.+?)\s+((?:Extra\s+)?(?:\d+|[A-Z]))\s+—\s+(.+)$/);
  return {
    world: level.world || (match ? names[match[1]] || match[1] : level.number <= 7 ? 'Opening' : 'Ungrouped'),
    code: level.code || (match ? match[2] : levelNumber(level.number)),
    name: level.name || (match ? match[3] : level.title),
  };
}

export function groupLevels(levels) {
  const groups = new Map();
  for (const level of levels) {
    const identity = levelIdentity(level);
    if (!groups.has(identity.world)) groups.set(identity.world, {name: identity.world, levels: []});
    groups.get(identity.world).levels.push({...level, ...identity});
  }
  return [...groups.values()];
}

export function renderWorlds(levels) {
  return groupLevels(levels).map((world, index) => `<details class="world-group" data-world${index === 0 ? ' open' : ''}>
<summary><span class="world-name">${escape(world.name)}</span><span class="world-count">${world.levels.length}<span class="sr-only"> recordings</span></span></summary>
<ol class="level-list">${world.levels.map(l => `<li id="${l.id}" data-level="${l.id}" data-number="${l.number}" data-title="${escape(l.title)}" data-poster="${l.poster}" data-seconds="${l.seconds}" data-search="${escape(`${l.world} ${l.title} ${l.code} ${l.number}`)}">
 <a class="level-link" href="${l.file}" data-watch><span class="level-number">${escape(l.code)}</span><span class="level-name">${escape(l.name)}</span><span class="duration">${duration(l.seconds)}</span></a>
</li>`).join('\n')}</ol></details>`).join('\n');
}
