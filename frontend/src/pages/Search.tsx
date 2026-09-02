import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import type { Property } from '../types/property'

function Search() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [maxRent, setMaxRent] = useState('')

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (city) params.city = city
      if (propertyType) params.property_type = propertyType
      if (maxRent) params.max_rent = maxRent

      const response = await api.get('/properties', { params })
      setProperties(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProperties()
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1F2933] mb-6">
          Hitta din <span className="text-[#8fae3d]">lokal</span>
        </h1>

        <form onSubmit={handleSearch} className="bg-[#F7F8F5] p-6 rounded-2xl shadow-sm mb-8 flex flex-wrap gap-4">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Stad"
            className="flex-1 min-w-[150px] px-3 py-2 rounded-lg border border-gray-300"
          />
          <input
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            placeholder="Lokaltyp (t.ex. butik)"
            className="flex-1 min-w-[150px] px-3 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="number"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
            placeholder="Max hyra (kr/mån)"
            className="flex-1 min-w-[150px] px-3 py-2 rounded-lg border border-gray-300"
          />
          <button
            type="submit"
            className="bg-[#8fae3d] text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90"
          >
            Sök
          </button>
        </form>

        {loading ? (
          <p className="text-[#1F2933]">Laddar lokaler...</p>
        ) : properties.length === 0 ? (
          <p className="text-[#1F2933]">Inga lokaler hittades.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                to={`/lokaler/${property.id}`}
                className="block bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-[#1F2933] mb-1">{property.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{property.city} · {property.property_type}</p>
                <p className="text-sm text-[#1F2933] mb-1">{property.size_sqm} m²</p>
                <p className="text-[#8fae3d] font-semibold">{property.monthly_rent} kr/mån</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search