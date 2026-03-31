import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../store/useUserStore'
import SearchDropdown from './SearchDropdown'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, profile, logout } = useUserStore()

  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`)
      setSearch('')
      setShowDropdown(false)
      setMenuOpen(false)
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        backgroundColor: 'rgba(3,7,18,0.92)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(0,212,255,0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm"
              style={{ backgroundColor: '#00d4ff' }}
            >
              CK
            </div>
            <span className="font-black text-base sm:text-lg tracking-tight">
              Check<span style={{ color: '#00d4ff' }}>PointGG</span>
            </span>
          </Link>

          {/* Buscador desktop */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xs lg:max-w-sm hidden md:block">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowDropdown(true) }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(0,212,255,0.4)'; setShowDropdown(true) }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(0,212,255,0.15)'; setTimeout(() => setShowDropdown(false), 200) }}
                placeholder="Buscar juegos..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
                style={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(0,212,255,0.15)' }}
              />
              {showDropdown && (
                <SearchDropdown query={search} onClose={() => { setShowDropdown(false); setSearch('') }} />
              )}
            </div>
          </form>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link
              to="/search"
              className={`text-sm transition-colors ${isActive('/search') ? 'text-[#00d4ff]' : 'text-gray-400 hover:text-white'}`}
            >
              Explorar
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black text-sm shrink-0"
                    style={{ backgroundColor: '#00d4ff' }}
                  >
                    {profile?.username[0].toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{profile?.username}</span>
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
                className="px-4 py-2 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90"
                style={{ backgroundColor: '#00d4ff' }}
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Botones móvil */}
          <div className="flex md:hidden items-center gap-2">
            {/* Botón buscar móvil */}
            <button
              onClick={() => { setMenuOpen(!menuOpen) }}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: 'rgba(0,212,255,0.1)' }}
          >
            <div className="px-4 py-4 space-y-4">

              {/* Buscador móvil */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar juegos..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none"
                    style={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(0,212,255,0.15)' }}
                  />
                </div>
              </form>

              {/* Links móvil */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive('/') ? 'text-[#00d4ff]' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                >
                  🏠 Inicio
                </Link>
                <Link
                  to="/search"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive('/search') ? 'text-[#00d4ff]' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                >
                  🔍 Explorar
                </Link>

                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive('/profile') ? 'text-[#00d4ff]' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                    >
                      👤 {profile?.username}
                    </Link>
                    <button
                      onClick={() => { logout(); setMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-white/5 transition-colors"
                    >
                      🚪 Cerrar sesión
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl font-bold text-black text-sm"
                    style={{ backgroundColor: '#00d4ff' }}
                  >
                    Iniciar sesión
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar