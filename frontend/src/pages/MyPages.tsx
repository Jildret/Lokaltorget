import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import type { Property } from '../types/property'
import type { SpaceRequest } from '../types/admin'

function MyPages() {
  const [properties, setProperties] = useState<Property[]>([])
  const [requests, setRequests] = useState<SpaceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/properties/mine/list'),
      api.get('/space-requests/mine'),
    ])
      .then(([propsRes, reqsRes]) => {
        setProperties(propsRes.data)
        setRequests(reqsRes.data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[#1F2933]">Laddar...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1F2933] mb-10">Mina sidor</h1>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1F2933]">Mina lokaler</h2>
            <Link to="/skapa-lokal" className="text-[#8fae3d] underline text-sm">
              + Lägg upp ny lokal
            </Link>
          </div>
          {properties.length === 0 ? (
            <p className="text-gray-500">Du har inte lagt upp några lokaler än.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map((p) => (
                <Link
                  key={p.id}
                  to={`/lokaler/${p.id}`}
                  className="block bg-[#F7F8F5] rounded-xl p-4 hover:shadow-sm transition"
                >
                  <p className="font-semibold text-[#1F2933]">{p.title}</p>
                  <p className="text-sm text-gray-500">{p.city} · {p.size_sqm} m² · {p.monthly_rent} kr/mån</p>
                  <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                    p.status === 'active' ? 'bg-[#8fae3d] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {p.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1F2933]">Mina lokalbehov</h2>
            <Link to="/jag-soker-lokal" className="text-[#8fae3d] underline text-sm">
              + Registrera nytt behov
            </Link>
          </div>
          {requests.length === 0 ? (
            <p className="text-gray-500">Du har inte registrerat några lokalbehov än.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((r) => (
                <div key={r.id} className="bg-[#F7F8F5] rounded-xl p-4">
                  <p className="font-semibold text-[#1F2933]">{r.city}</p>
                  {r.description && <p className="text-sm text-gray-500">{r.description}</p>}
                  <p className="text-sm text-gray-500 mt-1">
                    {r.min_size || '?'}–{r.max_size || '?'} m² · Max {r.max_rent || '?'} kr/mån
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default MyPages