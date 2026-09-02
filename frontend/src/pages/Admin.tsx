import { useState, useEffect } from 'react'
import api from '../api/client'
import type { AdminStats, SpaceRequest, Match } from '../types/admin'
import type { Property } from '../types/property'
import { getErrorMessage } from '../api/errorHandling'

function Admin() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [requests, setRequests] = useState<SpaceRequest[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedProperty, setSelectedProperty] = useState('')
  const [selectedRequest, setSelectedRequest] = useState('')
  const [score, setScore] = useState('')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      const [statsRes, propsRes, reqsRes, matchesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/properties'),
        api.get('/admin/space-requests'),
        api.get('/admin/matches'),
      ])
      setStats(statsRes.data)
      setProperties(propsRes.data)
      setRequests(reqsRes.data)
      setMatches(matchesRes.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Du har inte åtkomst till adminpanelen.')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.post('/admin/matches', {
        property_id: selectedProperty,
        request_id: selectedRequest,
        score: score ? parseInt(score) : null,
        reason,
      })
      setMessage('Matchning skapad!')
      setSelectedProperty('')
      setSelectedRequest('')
      setScore('')
      setReason('')
      loadData()
    } catch (err: any) {
      setMessage(getErrorMessage(err))
    }
  }

  const updateMatchStatus = async (matchId: string, status: string) => {
    await api.put(`/admin/matches/${matchId}`, { status })
    loadData()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1F2933] mb-8">Adminpanel</h1>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              ['Användare', stats.total_users],
              ['Lokaler', stats.total_properties],
              ['Aktiva lokaler', stats.active_properties],
              ['Lokalbehov', stats.total_space_requests],
              ['Aktiva behov', stats.active_space_requests],
              ['Matchningar', stats.total_matches],
              ['Leads', stats.total_leads],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#F7F8F5] rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-[#8fae3d]">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#F7F8F5] rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold text-[#1F2933] mb-4">Skapa manuell matchning</h2>
          <form onSubmit={handleCreateMatch} className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm text-[#1F2933] mb-1">Lokal</label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                required
                className="px-3 py-2 rounded-lg border border-gray-300 min-w-[200px]"
              >
                <option value="">Välj lokal</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.title} ({p.city})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#1F2933] mb-1">Lokalbehov</label>
              <select
                value={selectedRequest}
                onChange={(e) => setSelectedRequest(e.target.value)}
                required
                className="px-3 py-2 rounded-lg border border-gray-300 min-w-[200px]"
              >
                <option value="">Välj behov</option>
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>{r.city} – {r.description?.slice(0, 30) || 'Utan beskrivning'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#1F2933] mb-1">Poäng (0-100)</label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 w-24"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-[#1F2933] mb-1">Motivering</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              />
            </div>
            <button
              type="submit"
              className="bg-[#8fae3d] text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90"
            >
              Skapa matchning
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-[#1F2933]">{message}</p>}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1F2933] mb-4">Matchningar</h2>
          <div className="space-y-3">
            {matches.map((m) => {
              const prop = properties.find((p) => p.id === m.property_id)
              const req = requests.find((r) => r.id === m.request_id)
              return (
                <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#1F2933]">
                      {prop?.title || 'Okänd lokal'} ↔ {req?.city || 'Okänt behov'}
                    </p>
                    {m.reason && <p className="text-sm text-gray-500">{m.reason}</p>}
                    {m.score !== null && <p className="text-sm text-[#8fae3d]">Poäng: {m.score}</p>}
                  </div>
                  <select
                    value={m.status}
                    onChange={(e) => updateMatchStatus(m.id, e.target.value)}
                    className="px-3 py-1 rounded-lg border border-gray-300 text-sm"
                  >
                    {['new', 'contacted', 'interested', 'viewing_booked', 'negotiation', 'rented', 'not_relevant'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin