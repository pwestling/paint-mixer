import { openDB, DBSchema } from 'idb'

export interface Paint {
  id: string
  brand: string
  name: string
  series?: string
  notes?: string
  spectrum: number[]
  K: number[]
  S: number[]
  defaultWetMicrons: number
}

export interface Palette {
  id: string
  name: string
  paintIds: string[]
}

export interface Mix {
  id: string
  name: string
  components: { paintId: string; φ: number }[]
  savedLab?: number[]
  savedCR?: number[]
  timestamp: number
}

export interface Settings {
  id: string
  illuminant: string
  filmμm: number
  deltaEFormula: string
}

interface PaintMixDB extends DBSchema {
  paints: {
    key: string
    value: Paint
  }
  palettes: {
    key: string
    value: Palette
  }
  mixes: {
    key: string
    value: Mix
  }
  settings: {
    key: string
    value: Settings
  }
}

export const dbPromise = openDB<PaintMixDB>('paintmix', 1, {
  upgrade(db) {
    db.createObjectStore('paints', { keyPath: 'id' })
    db.createObjectStore('palettes', { keyPath: 'id' })
    db.createObjectStore('mixes', { keyPath: 'id' })
    db.createObjectStore('settings', { keyPath: 'id' })
  },
})

function parseCSV(text: string) {
  const lines = text.trim().split(/\n+/)
  const [, ...rows] = lines
  return rows.map(line => line.split(',')).map(fields => {
    const brand = fields[0]
    const name = fields[1]
    const series = fields[2]
    const defaultWetMicrons = Number(fields[3])
    const spectrum = fields.slice(4).map(Number)
    return { brand, name, series, defaultWetMicrons, spectrum }
  })
}

export async function initDB() {
  const db = await dbPromise
  const count = await db.count('paints')
  if (count === 0) {
    const res = await fetch('/reflectance.csv')
    const text = await res.text()
    const rows = parseCSV(text)
    for (const row of rows) {
      const paint: Paint = {
        id: crypto.randomUUID(),
        brand: row.brand,
        name: row.name,
        series: row.series,
        notes: '',
        spectrum: row.spectrum,
        K: new Array(33).fill(0),
        S: new Array(33).fill(0),
        defaultWetMicrons: row.defaultWetMicrons,
      }
      await db.add('paints', paint)
    }
  }
}
