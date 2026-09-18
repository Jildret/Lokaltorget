import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api/client'
import { getErrorMessage } from '../api/errorHandling'

function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState(location.state?.email || '')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.post('/auth/verify', { email, code })
      setSuccess(true)
      setMessage('E-postadressen är verifierad! Du kan nu logga in.')
      setTimeout(() => navigate('/logga-in'), 1500)
    } catch (err: any) {
      setMessage(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-[#F7F8F5] p-8 rounded-2xl shadow-sm w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#1F2933] mb-2">Verifiera din e-post</h1>
        <p className="text-sm text-gray-500 mb-6">
          Vi har skickat en 6-siffrig kod till din e-postadress.
        </p>

        <label className="block text-sm text-[#1F2933] mb-1">E-post</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300"
        />

        <label className="block text-sm text-[#1F2933] mb-1">Verifieringskod</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          maxLength={6}
          placeholder="123456"
          className="w-full mb-6 px-3 py-2 rounded-lg border border-gray-300 tracking-widest text-center text-lg"
        />

        <button
          type="submit"
          className="w-full bg-[#8fae3d] text-white font-semibold py-2 rounded-lg hover:opacity-90"
        >
          Verifiera
        </button>

        {message && (
          <p className={`mt-4 text-sm ${success ? 'text-[#8fae3d]' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  )
}

export default VerifyEmail