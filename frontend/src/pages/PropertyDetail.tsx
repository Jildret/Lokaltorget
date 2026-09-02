import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import type { Property } from '../types/property'
import { useAuth } from '../auth/AuthContext'
import { getErrorMessage } from '../api/errorHandling'

function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [interestMessage, setInterestMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [sent, setSent] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then((response) => setProperty(response.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))

    if (token) {
      api.get('/properties/mine/list')
        .then((response) => {
          const owned = response.data.some((p: Property) => p.id === id)
          setIsOwner(owned)
        })
        .catch(() => setIsOwner(false))
    }
  }, [id, token])

  const handleDelete = async () => {
    if (!confirm('Är du säker på att du vill ta bort denna lokal?')) return
    try {
      await api.delete(`/properties/${id}`)
      navigate('/mina-sidor')
    } catch (err) {
      console.error(err)
    }
  }

  const handleInterest = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.post('/leads', {
        property_id: id,
        message: interestMessage,
      })
      setSent(true)
      setMessage('Din intresseanmälan har skickats!')
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

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[#1F2933]">Lokalen hittades inte.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/sok" className="text-[#8fae3d] underline text-sm mb-6 inline-block">
          ← Tillbaka till sökresultat
        </Link>

        <div className="bg-[#F7F8F5] rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-[#1F2933] mb-2">{property.title}</h1>

          {isOwner && (
            <div className="flex gap-3 mb-4">
              <Link
                to={`/redigera-lokal/${property.id}`}
                className="text-sm text-[#8fae3d] underline"
              >
                Redigera
              </Link>
              <button onClick={handleDelete} className="text-sm text-red-600 underline">
                Ta bort
              </button>
            </div>
          )}

          <p className="text-gray-500 mb-6">{property.address}, {property.city}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Storlek</p>
              <p className="text-lg font-semibold text-[#1F2933]">{property.size_sqm} m²</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hyra</p>
              <p className="text-lg font-semibold text-[#8fae3d]">{property.monthly_rent} kr/mån</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lokaltyp</p>
              <p className="text-[#1F2933]">{property.property_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tillträde</p>
              <p className="text-[#1F2933]">{property.available_from || 'Enligt överenskommelse'}</p>
            </div>
          </div>

          {property.description && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Beskrivning</p>
              <p className="text-[#1F2933]">{property.description}</p>
            </div>
          )}

          {token ? (
            sent ? (
              <p className="text-[#8fae3d] font-semibold">{message}</p>
            ) : showForm ? (
              <form onSubmit={handleInterest}>
                <textarea
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  placeholder="Skriv ett kort meddelande (valfritt)"
                  rows={3}
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-300"
                />
                <button
                  type="submit"
                  className="bg-[#8fae3d] text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90"
                >
                  Skicka intresseanmälan
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#8fae3d] text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90"
              >
                Jag är intresserad
              </button>
            )
          ) : (
            <p className="text-sm text-[#1F2933]">
              <Link to="/logga-in" className="text-[#8fae3d] underline">Logga in</Link> för att anmäla intresse.
            </p>
          )}

          {message && !sent && <p className="mt-4 text-sm text-red-600">{message}</p>}
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail