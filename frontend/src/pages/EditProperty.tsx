import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { getErrorMessage } from '../api/errorHandling'

function EditProperty() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [sizeSqm, setSizeSqm] = useState('')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get(`/properties/${id}`).then((response) => {
      const p = response.data
      setTitle(p.title)
      setAddress(p.address)
      setCity(p.city)
      setSizeSqm(String(p.size_sqm))
      setMonthlyRent(String(p.monthly_rent))
      setPropertyType(p.property_type)
      setDescription(p.description || '')
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.put(`/properties/${id}`, {
        title,
        address,
        city,
        size_sqm: parseFloat(sizeSqm),
        monthly_rent: parseFloat(monthlyRent),
        property_type: propertyType,
        description,
        features: [],
      })
      setMessage('Lokalen är uppdaterad!')
      setTimeout(() => navigate(`/lokaler/${id}`), 1000)
    } catch (err: any) {
      setMessage(getErrorMessage(err))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[#1F2933]">Laddar...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12">
      <form onSubmit={handleSubmit} className="bg-[#F7F8F5] p-8 rounded-2xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#1F2933] mb-6">Redigera lokal</h1>

        <label className="block text-sm text-[#1F2933] mb-1">Titel</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300"
        />

        <label className="block text-sm text-[#1F2933] mb-1">Adress</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300"
        />

        <label className="block text-sm text-[#1F2933] mb-1">Stad</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300"
        />

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm text-[#1F2933] mb-1">Storlek (m²)</label>
            <input
              type="number"
              value={sizeSqm}
              onChange={(e) => setSizeSqm(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-[#1F2933] mb-1">Hyra (kr/mån)</label>
            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
            />
          </div>
        </div>

        <label className="block text-sm text-[#1F2933] mb-1">Lokaltyp</label>
        <input
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300"
        />

        <label className="block text-sm text-[#1F2933] mb-1">Beskrivning</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full mb-6 px-3 py-2 rounded-lg border border-gray-300"
        />

        <button
          type="submit"
          className="w-full bg-[#8fae3d] text-white font-semibold py-2 rounded-lg hover:opacity-90"
        >
          Spara ändringar
        </button>

        {message && <p className="mt-4 text-sm text-[#1F2933]">{message}</p>}
      </form>
    </div>
  )
}

export default EditProperty