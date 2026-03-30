import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useUserStore } from '../store/useUserStore'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { isLoggedIn, profile, logout } = useUserStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`)
      setSearch('')
    }
  }

  // Detecta si un link está activo para resaltarlo
  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(0, 212, 255, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm glow-cyan-sm"
            style={{ backgroundColor: '#00d4ff' }}
          >
            CK
          </div>
          <span className="font-black text-lg tracking-tight hidden sm:block">
            Check<span style={{ color: '#00d4ff' }}>PointGG</span>
          </span>
        </Link>

        {/* Buscador */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden md:block">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar juegos..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
              style={{
                backgroundColor: '#0a0f1e',
                border: '1px solid rgba(0,212,255,0.15)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.15)'}
            />
          </div>
        </form>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/search"
            className={`text-sm transition-colors ${
              isActive('/search') ? 'text-[#00d4ff]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Explorar
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {/* Avatar con inicial */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black text-sm"
                  style={{ backgroundColor: '#00d4ff' }}
                >
                  {profile?.username[0].toUpperCase()}
                </div>
                <span>{profile?.username}</span>
              </Link>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-red-400 transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 glow-cyan-sm"
              style={{ backgroundColor: '#00d4ff' }}
            >
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          className="md:hidden text-gray-400 text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-4 space-y-4 border-t"
          style={{ borderColor: 'rgba(0,212,255,0.1)' }}
        >
          <form onSubmit={handleSearch} className="pt-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar juegos..."
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none"
              style={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(0,212,255,0.15)' }}
            />
          </form>

          <Link
            to="/search"
            className="block text-gray-400 hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Explorar
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="block text-gray-400 hover:text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Mi perfil
              </Link>
              <button
                onClick={() => { logout(); setMenuOpen(false) }}
                className="block text-red-400"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-center py-2.5 rounded-xl font-bold text-black"
              style={{ backgroundColor: '#00d4ff' }}
              onClick={() => setMenuOpen(false)}
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar