import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../store/useUserStore'
import { registerUser, validators } from '../services/authService'
import FadeIn from '../components/FadeIn'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { setUser } = useUserStore()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }))
  }

  const validate = (): boolean => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    }
    let valid = true

    const usernameError = validators.username(form.username)
    if (usernameError) { newErrors.username = usernameError; valid = false }

    const emailError = validators.email(form.email)
    if (emailError) { newErrors.email = emailError; valid = false }

    const passwordError = validators.password(form.password)
    if (passwordError) { newErrors.password = passwordError; valid = false }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
      valid = false
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
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
      const user = await registerUser(form.username, form.email, form.password)
      setUser(user)
      navigate('/profile')
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, general: err.message }))
    } finally {
      setIsLoading(false)
    }
  }

  // Indicador de fortaleza de contraseña
  const getPasswordStrength = () => {
    const p = form.password
    if (!p) return { strength: 0, label: '', color: '' }
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[!@#$%^&*]/.test(p)) score++

    if (score <= 1) return { strength: 25, label: 'Débil', color: '#ef4444' }
    if (score === 2) return { strength: 50, label: 'Regular', color: '#eab308' }
    if (score === 3) return { strength: 75, label: 'Buena', color: '#22c55e' }
    return { strength: 100, label: 'Fuerte', color: '#00d4ff' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
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
            <p className="text-gray-500 text-sm">Crea tu cuenta y únete a la comunidad</p>
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

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-gray-400 text-xs uppercase tracking-wider">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="GamerPro123"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all text-sm"
                  style={{
                    backgroundColor: '#0f1629',
                    border: `1px solid ${errors.username ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}`,
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = errors.username ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}
                />
                {errors.username && (
                  <p className="text-red-400 text-xs">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-gray-400 text-xs uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all text-sm"
                  style={{
                    backgroundColor: '#0f1629',
                    border: `1px solid ${errors.email ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}`,
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = errors.email ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs">{errors.email}</p>
                )}
              </div>

              {/* Password */}
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
                    placeholder="Mínimo 8 caracteres"
                    className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all text-sm"
                    style={{
                      backgroundColor: '#0f1629',
                      border: `1px solid ${errors.password ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}`,
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
                    onBlur={(e) => e.target.style.borderColor = errors.password ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Indicador de fortaleza */}
                {form.password && (
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: '#0f1629' }}>
                      <motion.div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${passwordStrength.strength}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: passwordStrength.color }}>
                      Contraseña {passwordStrength.label}
                    </p>
                  </div>
                )}

                {errors.password && (
                  <p className="text-red-400 text-xs">{errors.password}</p>
                )}

                {/* Requisitos */}
                <div className="grid grid-cols-2 gap-1 pt-1">
                  {[
                    { label: '8+ caracteres', met: form.password.length >= 8 },
                    { label: 'Una mayúscula', met: /[A-Z]/.test(form.password) },
                    { label: 'Un número', met: /[0-9]/.test(form.password) },
                    { label: 'Un símbolo', met: /[!@#$%^&*]/.test(form.password) },
                  ].map((req) => (
                    <div key={req.label} className="flex items-center gap-1.5">
                      <span className={req.met ? 'text-green-400' : 'text-gray-600'}>
                        {req.met ? '✓' : '○'}
                      </span>
                      <span className={`text-xs ${req.met ? 'text-gray-300' : 'text-gray-600'}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirmar password */}
              <div className="space-y-1.5">
                <label className="text-gray-400 text-xs uppercase tracking-wider">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all text-sm"
                    style={{
                      backgroundColor: '#0f1629',
                      border: `1px solid ${errors.confirmPassword ? 'rgba(239,68,68,0.5)' : form.confirmPassword && form.password === form.confirmPassword ? 'rgba(34,197,94,0.5)' : 'rgba(0,212,255,0.15)'}`,
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
                    onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs">{errors.confirmPassword}</p>
                )}
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <p className="text-green-400 text-xs">✓ Las contraseñas coinciden</p>
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
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </motion.button>

            </form>

            {/* Link a login */}
            <p className="text-center text-gray-500 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="font-semibold hover:opacity-80 transition-opacity"
                style={{ color: '#00d4ff' }}
              >
                Inicia sesión
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

export default RegisterPage