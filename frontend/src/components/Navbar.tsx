import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function Navbar() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-[#1F2933]">
          Lokal<span className="text-[#8fae3d]">torget</span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/sok" className="text-[#1F2933] hover:text-[#8fae3d] transition-colors">
            Sök lokaler
          </Link>

          {token ? (
            <>
              <Link to="/skapa-lokal" className="text-[#1F2933] hover:text-[#8fae3d] transition-colors">
                Lägg upp lokal
              </Link>
              <Link to="/jag-soker-lokal" className="text-[#1F2933] hover:text-[#8fae3d] transition-colors">
                Jag söker lokal
              </Link>
              <Link to="/mina-sidor" className="text-[#1F2933] hover:text-[#8fae3d] transition-colors">
                Mina sidor
              </Link>
              {user?.role === 'admin' && (
              <Link to="/admin" className="text-[#1F2933] hover:text-[#8fae3d] transition-colors">
                Adminpanel
              </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-[#1F2933] hover:text-[#8fae3d] transition-colors"
              >
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link to="/logga-in" className="text-[#1F2933] hover:text-[#8fae3d] transition-colors">
                Logga in
              </Link>
              <Link
                to="/registrera"
                className="bg-[#8fae3d] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Skapa konto
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar