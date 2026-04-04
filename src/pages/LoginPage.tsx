import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../store/useUserStore'
import { loginUser, validators } from '../services/authService'
import FadeIn from '../components/FadeIn'

const LoginPage = () => {
  const navigate = useNavigate()
  const { setUser } = useUserStore()

  const [form, setForm] = useState({
    usernameOrEmail: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    usernameOrEmail: '',
    password: '',
    general: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Limpia el error del campo al escribir
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }))
  }

  const validate = (): boolean => {
    const newErrors = { usernameOrEmail: '', password: '', general: '' }
    let valid = true

    if (!form.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'El usuario o email es requerido'
      valid = false
    }

    const passwordError = validators.password(form.password)
    if (passwordError) {
      newErrors.password = passwordError
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const user = await loginUser(form.usernameOrEmail, form.password)
      setUser(user)
      navigate('/profile')
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, general: err.message }))
    } finally {
      setIsLoading(false)
    }
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
        <FadeIn direction="down">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black"
                style={{ backgroundColor: '#00d4ff' }}
              >
                CK
              </div>
              <span className="font-black text-2xl">
                Check<span style={{ color: '#00d4ff' }}>PointGG</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm">Inicia sesión en tu cuenta</p>
          </div>
        </FadeIn>

        {/* Card */}
        <FadeIn delay={0.1}>
          <div
            className="rounded-2xl p-6 sm:p-8 space-y-5"
            style={{
              backgroundColor: '#0a0f1e',
              border: '1px solid rgba(0,212,255,0.15)',
            }}
          >
            {/* Error general */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl text-sm text-red-400"
                style={{
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                }}
              >
                ⚠️ {errors.general}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Usuario o email */}
              <div className="space-y-1.5">
                <label className="text-gray-400 text-xs uppercase tracking-wider">
                  Usuario o Email
                </label>
                <input
                  type="text"
                  name="usernameOrEmail"
                  value={form.usernameOrEmail}
                  onChange={handleChange}
                  placeholder="GamerPro o tu@email.com"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all text-sm"
                  style={{
                    backgroundColor: '#0f1629',
                    border: `1px solid ${errors.usernameOrEmail ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}`,
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = errors.usernameOrEmail ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}
                />
                {errors.usernameOrEmail && (
                  <p className="text-red-400 text-xs">{errors.usernameOrEmail}</p>
                )}
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5">
                <label className="text-gray-400 text-xs uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña"
                    className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all text-sm"
                    style={{
                      backgroundColor: '#0f1629',
                      border: `1px solid ${errors.password ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}`,
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
                    onBlur={(e) => e.target.style.borderColor = errors.password ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}
                  />
                  {/* Botón mostrar/ocultar contraseña */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs">{errors.password}</p>
                )}
              </div>

              {/* Botón submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl font-bold text-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: '#00d4ff' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </motion.button>

            </form>

            {/* Credenciales de prueba */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{
                backgroundColor: 'rgba(0,212,255,0.04)',
                border: '1px solid rgba(0,212,255,0.1)',
              }}
            >
              <p className="text-gray-500 text-xs uppercase tracking-wider">Cuentas de prueba</p>
              {[
                { user: 'GamerPro', pass: 'Gamer123!' },
                { user: 'PixelMaster', pass: 'Pixel456!' },
                { user: 'NightOwl', pass: 'Night789!' },
              ].map((account) => (
                <button
                  key={account.user}
                  type="button"
                  onClick={() => {
                    setForm({ usernameOrEmail: account.user, password: account.pass })
                    setErrors({ usernameOrEmail: '', password: '', general: '' })
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors hover:bg-white/5"
                >
                  <span style={{ color: '#00d4ff' }}>{account.user}</span>
                  <span className="text-gray-600 font-mono">{account.pass}</span>
                </button>
              ))}
            </div>

            {/* Link a registro */}
            <p className="text-center text-gray-500 text-sm">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="font-semibold hover:opacity-80 transition-opacity"
                style={{ color: '#00d4ff' }}
              >
                Regístrate
              </Link>
            </p>

          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-center">
            <Link to="/" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
              ← Volver al inicio
            </Link>
          </p>
        </FadeIn>

      </div>
    </div>
  )
}

export default LoginPage