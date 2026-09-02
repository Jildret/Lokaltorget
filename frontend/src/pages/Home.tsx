import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function Home() {
  const { token } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1F2933] mb-4">
          Hitta rätt lokal.<br />
          Eller rätt <span className="text-[#8fae3d]">hyresgäst</span>.
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
          Lokaltorget kopplar ihop fastighetsägare med företag som söker sin nästa lokal.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/sok"
            className="bg-[#8fae3d] text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Jag söker en lokal
          </Link>
          <Link
            to={token ? '/skapa-lokal' : '/registrera'}
            className="bg-[#F7F8F5] text-[#1F2933] font-semibold px-8 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Jag har en ledig lokal
          </Link>
        </div>

        <div className="bg-[#F7F8F5] rounded-2xl p-8 text-left max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-[#1F2933] mb-2">
            Lägg ut din lokal gratis
          </h2>
          <p className="text-gray-500">
            Lägg upp din lediga lokal kostnadsfritt. Vi hjälper dig att hitta potentiella hyresgäster.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home