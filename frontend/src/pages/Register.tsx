import { useState } from 'react'
import api from '../api/client'
import { getErrorMessage } from '../api/errorHandling'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('seeker')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      await api.post('/auth/register', { email, password, role })
      setMessage('Konto skapat! Du kan nu logga in.')
    } catch (err: any) {
      setMessage(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-[#F7F8F5] p-8 rounded-2xl shadow-sm w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#1F2933] mb-6">Skapa konto</h1>

        <label className="block text-sm text-[#1F2933] mb-1">E-post</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300"
        />

        <label className="block text-sm text-[#1F2933] mb-1">Lösenord</label>
        <div className="relative mb-1">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-4">Minst 8 tecken</p>

        <label className="block text-sm text-[#1F2933] mb-1">Jag är...</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-6 px-3 py-2 rounded-lg border border-gray-300"
        >
          <option value="seeker">Företag som söker lokal</option>
          <option value="owner">Fastighetsägare</option>
        </select>

        <button
          type="submit"
          className="w-full bg-[#8fae3d] text-white font-semibold py-2 rounded-lg hover:opacity-90"
        >
          Skapa konto
        </button>

        {message && <p className="mt-4 text-sm text-[#1F2933]">{message}</p>}
      </form>
    </div>
  )
}

export default Register