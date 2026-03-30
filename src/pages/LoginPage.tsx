import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useUserStore()
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (username.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres')
      return
    }

    login(username.trim())
    navigate('/profile')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#030712' }}
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative w-full max-w-md space-y-8">

        {/* Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black glow-cyan"
              style={{ backgroundColor: '#00d4ff' }}
            >
              CK
            </div>
            <span className="font-black text-2xl">
              Check<span style={{ color: '#00d4ff' }}>PointGG</span>
            </span>
          </Link>
          <p className="text-gray-500">Únete a la comunidad gamer</p>
        </div>

        {/* Card del formulario */}
        <div
          className="rounded-2xl p-8 space-y-6"
          style={{
            backgroundColor: '#0a0f1e',
            border: '1px solid rgba(0,212,255,0.15)',
          }}
        >
          <h2 className="text-white font-bold text-xl">Crear cuenta</h2>

          <form onSubmit={handleLogin} className="space-y-4">

            <div className="space-y-2">
              <label className="text-gray-400 text-sm">Nombre de usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                placeholder="Ej: GamerPro123"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all"
                style={{
                  backgroundColor: '#0f1629',
                  border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(0,212,255,0.15)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
                onBlur={(e) => e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-black transition-all hover:opacity-90 glow-cyan"
              style={{ backgroundColor: '#00d4ff' }}
            >
              Entrar
            </button>

          </form>

          <p className="text-gray-700 text-xs text-center">
            Por ahora no necesitas contraseña. La autenticación real viene más adelante.
          </p>

        </div>

        <p className="text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
            ← Volver al inicio
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage