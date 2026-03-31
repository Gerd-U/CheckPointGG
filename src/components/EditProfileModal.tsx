import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../store/useUserStore'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

// Avatares predefinidos como emojis
const avatarOptions = [
  '🎮', '🕹️', '👾', '🧑‍💻', '🦊', '🐺', '🐲', '⚔️',
  '🛡️', '🏆', '💀', '🤖', '👻', '🎯', '🔥', '⚡',
]

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const { profile, updateProfile } = useUserStore()

  const [username, setUsername] = useState(profile?.username ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [avatar, setAvatar] = useState(profile?.avatar ?? '')
  const [error, setError] = useState('')

  const handleSave = () => {
    if (username.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres')
      return
    }
    updateProfile({
      username: username.trim(),
      bio: bio.trim(),
      avatar,
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#0a0f1e',
              border: '1px solid rgba(0,212,255,0.2)',
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between border-b"
              style={{ borderColor: 'rgba(0,212,255,0.1)' }}
            >
              <h2 className="text-white font-bold text-lg">Editar perfil</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Selector de avatar */}
              <div className="space-y-3">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Avatar</p>
                {/* Preview del avatar actual */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                    style={{
                      backgroundColor: avatar ? '#0f1629' : '#00d4ff',
                      border: '2px solid rgba(0,212,255,0.3)',
                    }}
                  >
                    {avatar || profile?.username[0].toUpperCase()}
                  </div>
                  <p className="text-gray-500 text-sm">Elige un avatar de abajo</p>
                </div>

                {/* Grid de emojis */}
                <div className="grid grid-cols-8 gap-2">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className="w-full aspect-square rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110"
                      style={{
                        backgroundColor: avatar === emoji
                          ? 'rgba(0,212,255,0.2)'
                          : '#0f1629',
                        border: avatar === emoji
                          ? '2px solid rgba(0,212,255,0.5)'
                          : '2px solid transparent',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Nombre de usuario</p>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError('') }}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all"
                  style={{
                    backgroundColor: '#0f1629',
                    border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(0,212,255,0.15)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(0,212,255,0.15)'}
                />
                {error && <p className="text-red-400 text-xs">{error}</p>}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Bio</p>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos algo sobre ti..."
                  rows={3}
                  maxLength={150}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none resize-none transition-all"
                  style={{
                    backgroundColor: '#0f1629',
                    border: '1px solid rgba(0,212,255,0.15)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.15)'}
                />
                <p className="text-gray-700 text-xs text-right">{bio.length}/150</p>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{
                    backgroundColor: '#0f1629',
                    border: '1px solid rgba(0,212,255,0.15)',
                    color: 'gray',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90"
                  style={{ backgroundColor: '#00d4ff' }}
                >
                  Guardar cambios
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EditProfileModal