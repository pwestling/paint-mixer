import { useEffect, useState } from 'react'
import { dbPromise, Paint } from '../utils/db'

export default function Library() {
  const [paints, setPaints] = useState<Paint[]>([])

  useEffect(() => {
    dbPromise.then(db => db.getAll('paints')).then(setPaints)
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Paint Library</h1>
      <button className="px-4 py-2 bg-blue-500 text-white rounded">+ Paint</button>
      <ul className="list-disc pl-6">
        {paints.map(p => (
          <li key={p.id}>{`${p.brand} ${p.name}`}</li>
        ))}
      </ul>
    </div>
  )
}
