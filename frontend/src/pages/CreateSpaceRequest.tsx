import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { getErrorMessage } from '../api/errorHandling'

function CreateSpaceRequest() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [city, setCity] = useState('')
  const [minSize, setMinSize] = useState('')
  const [maxSize, setMaxSize] = useState('')
  const [maxRent, setMaxRent] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[#1F2933]">Du måste vara inloggad för att registrera ett lokalbehov.</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.post('/space-requests', {
        city,
        min_size: minSize ? parseFloat(minSize) : null,
        max_size: maxSize ? parseFloat(maxSize) : null,
        max_rent: maxRent ? parseFloat(maxRent) : null,
        description,
      })
      setMessage('Ditt lokalbehov är registrerat!')
      setTimeout(() => navigate('/'), 1000)
    } catch (err: any) {
      setMessage(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12">
      <form onSubmit={handleSubmit} className="bg-[#F7F8F5] p-8 rounded-2xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#1F2933] mb-2">Jag söker lokal</h1>
        <p className="text-sm text-gray-500 mb-6">Berätta vad ni letar efter, så kan fastighetsägare hitta er.</p>

        <label className="block text-sm text-[#1F2933] mb-1">Stad</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300"
        />

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm text-[#1F2933] mb-1">Min storlek (m²)</label>
            <input
              type="number"
              value={minSize}
              onChange={(e) => setMinSize(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-[#1F2933] mb-1">Max storlek (m²)</label>
            <input
              type="number"
              value={maxSize}
              onChange={(e) => setMaxSize(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
            />
          </div>
        </div>

        <label className="block text-sm text-[#1F2933] mb-1">Max hyra (kr/mån)</label>
        <input
          type="number"
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300"
        />

        <label className="block text-sm text-[#1F2933] mb-1">Beskrivning av verksamheten</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="T.ex. Vi söker en butikslokal med skyltfönster..."
          className="w-full mb-6 px-3 py-2 rounded-lg border border-gray-300"
        />

        <button
          type="submit"
          className="w-full bg-[#8fae3d] text-white font-semibold py-2 rounded-lg hover:opacity-90"
        >
          Registrera lokalbehov
        </button>

        {message && <p className="mt-4 text-sm text-[#1F2933]">{message}</p>}
      </form>
    </div>
  )
}

export default CreateSpaceRequest