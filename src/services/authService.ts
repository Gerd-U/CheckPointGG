// ─────────────────────────────────────────────────────────────────────────────
// services/authService.ts
// Simula un backend de autenticación usando un JSON local.
// Cuando tengas un backend real, solo reemplaza estas funciones
// por llamadas HTTP y el resto de la app no cambia.
// ─────────────────────────────────────────────────────────────────────────────

import usersData from '../data/users.json'

// Tipos
export interface AuthUser {
  id: string
  username: string
  email: string
  bio: string
  joinedAt: string
  role: string
}

interface RawUser extends AuthUser {
  password: string
}

// Validaciones reutilizables
export const validators = {
  username: (value: string): string => {
    if (!value.trim()) return 'El nombre de usuario es requerido'
    if (value.trim().length < 3) return 'Mínimo 3 caracteres'
    if (value.trim().length > 20) return 'Máximo 20 caracteres'
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo letras, números y guión bajo'
    return ''
  },

  email: (value: string): string => {
    if (!value.trim()) return 'El email es requerido'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido'
    return ''
  },

  password: (value: string): string => {
    if (!value) return 'La contraseña es requerida'
    if (value.length < 8) return 'Mínimo 8 caracteres'
    if (!/[A-Z]/.test(value)) return 'Debe tener al menos una mayúscula'
    if (!/[0-9]/.test(value)) return 'Debe tener al menos un número'
    if (!/[!@#$%^&*]/.test(value)) return 'Debe tener al menos un símbolo (!@#$%^&*)'
    return ''
  },
}

// Simula delay de red
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

// Login — busca el usuario en el JSON
export const loginUser = async (
  usernameOrEmail: string,
  password: string
): Promise<AuthUser> => {
  await delay(600) // simula latencia de red

  const users = usersData as RawUser[]

  // Busca por username O email
  const user = users.find(
    (u) =>
      (u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
        u.email.toLowerCase() === usernameOrEmail.toLowerCase()) &&
      u.password === password
  )

  if (!user) throw new Error('Usuario o contraseña incorrectos')

  // No devuelve la contraseña al frontend
  const { password: _, ...safeUser } = user
  return safeUser
}

// Registro — verifica que no exista y agrega al "JSON"
// En producción esto sería un POST a tu API
export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<AuthUser> => {
  await delay(600)

  // Valida el formato de la contraseña antes de registrar
  const passwordError = validators.password(password)
  if (passwordError) throw new Error(passwordError)

  const users = usersData as RawUser[]

  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('El nombre de usuario ya está en uso')
  }

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('El email ya está registrado')
  }

  const newUser: AuthUser = {
    id: crypto.randomUUID(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    bio: 'Nuevo en CheckPointGG 🎮',
    joinedAt: new Date().toISOString(),
    role: 'user',
  }

  return newUser
}