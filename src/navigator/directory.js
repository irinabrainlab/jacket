const cyrillic = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'đ', е: 'e', ж: 'ž', з: 'z', и: 'i', ј: 'j',
  к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  ћ: 'ć', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'č', џ: 'dž', ш: 'š',
}

export const LETTERS = [
  '0–9', 'A', 'B', 'C', 'Č', 'Ć', 'D', 'Dž', 'Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Lj',
  'M', 'N', 'Nj', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž',
]

export function letterOf(name) {
  if (/^\d/.test(name)) return '0–9'
  if (name.startsWith('Dž')) return 'Dž'
  if (name.startsWith('Lj')) return 'Lj'
  if (name.startsWith('Nj')) return 'Nj'
  return name[0]
}

function latin(value) {
  return [...value.toLowerCase()].map((char) => cyrillic[char] ?? char).join('')
}

export function fold(value) {
  return latin(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'dj')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function foldNumber(value) {
  return latin(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '')
}

export function areaSlug(name) {
  return fold(name).replace(/\s+/g, '-')
}

export function compareNumbers(a, b) {
  const parts = (value) => {
    const match = foldNumber(value).match(/^(\d+)([a-z]*)(?:\/(\d+))?/)
    if (!match) return [Number.MAX_SAFE_INTEGER, value, 0]
    return [Number(match[1]), match[2], Number(match[3] || 0)]
  }
  const [an, as, ax] = parts(a)
  const [bn, bs, bx] = parts(b)
  return an - bn || as.localeCompare(bs) || ax - bx
}

const areaFiles = import.meta.glob('./areas/*.json')

let indexReady

export function loadDirectory() {
  if (!indexReady) {
    indexReady = import('./streets.json').then((mod) => {
      const rows = mod.default.map(([name, area]) => ({ name, area, letter: letterOf(name) }))
      const counts = new Map()
      for (const row of rows) counts.set(row.area, (counts.get(row.area) ?? 0) + 1)
      const areas = [...counts.keys()]
        .sort((a, b) => a.localeCompare(b, 'sr'))
        .map((name) => ({ name, count: counts.get(name) }))
      return { rows, areas }
    })
  }
  return indexReady
}

const areaCache = new Map()

export function loadAreaNumbers(area) {
  const slug = areaSlug(area)
  if (!areaCache.has(slug)) {
    const load = areaFiles[`./areas/${slug}.json`]
    areaCache.set(slug, load ? load().then((mod) => mod.default) : Promise.resolve(null))
  }
  return areaCache.get(slug)
}
