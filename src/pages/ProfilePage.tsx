import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../store/useUserStore'
import GameCard from '../components/GameCard'
import FadeIn from '../components/FadeIn'
import EditProfileModal from '../components/EditProfileModal'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { profile, isLoggedIn, favoriteGames, reviews} = useUserStore()
  const [editOpen, setEditOpen] = useState(false)

  if (!isLoggedIn || !profile) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6" style={{ backgroundColor: '#030712' }}>
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">

        {/* ── Tarjeta de perfil ──────────────────────────────────── */}
        <FadeIn direction="down">
          <div
            className="rounded-2xl p-5 sm:p-8 relative overflow-hidden"
            style={{
              backgroundColor: '#0a0f1e',
              border: '1px solid rgba(0,212,255,0.1)',
            }}
          >
            {/* Fondo decorativo */}
            <div
              className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full opacity-5 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, #00d4ff, transparent 70%)',
                transform: 'translate(30%, -30%)',
              }}
            />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 relative">

              {/* Avatar */}
              <motion.div
                className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: profile.avatar ? '#0f1629' : '#00d4ff',
                  border: '2px solid rgba(0,212,255,0.3)',
                  fontSize: profile.avatar ? '2.5rem' : undefined,
                  color: profile.avatar ? undefined : 'black',
                }}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              >
                {profile.avatar ? (
                  <span className="text-4xl sm:text-5xl">{profile.avatar}</span>
                ) : (
                  <span className="text-3xl sm:text-4xl font-black text-black">
                    {profile.username[0].toUpperCase()}
                  </span>
                )}
              </motion.div>

              <div className="flex-1 space-y-2 sm:space-y-3 text-center sm:text-left w-full">
                <FadeIn delay={0.2}>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.username}</h1>
                  <p className="text-gray-500 text-sm">{profile.bio}</p>
                </FadeIn>

                {/* Estadísticas */}
                <div className="flex justify-center sm:justify-start gap-4 sm:gap-6 pt-1">
                  {[
                    { value: reviews.length, label: 'Reseñas' },
                    { value: favoriteGames.length, label: 'Favoritos' },
                    ...(reviews.length > 0 ? [{
                      value: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
                      label: 'Promedio',
                    }] : []),
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <p className="text-xl sm:text-2xl font-black" style={{ color: '#00d4ff' }}>
                        {stat.value}
                      </p>
                      <p className="text-gray-600 text-xs uppercase tracking-wider">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  onClick={() => setEditOpen(true)}
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:opacity-80"
                  style={{
                    backgroundColor: 'rgba(0,212,255,0.08)',
                    border: '1px solid rgba(0,212,255,0.2)',
                    color: '#00d4ff',
                  }}
                >
                  ✏️ Editar
                </button>
              </div>

            </div>
          </div>
        </FadeIn>

        {/* ── Reseñas ────────────────────────────────────────────── */}
        <FadeIn delay={0.2}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 sm:h-7 rounded-full" style={{ backgroundColor: '#00d4ff' }} />
              <h2 className="text-xl sm:text-2xl font-black text-white">MIS RESEÑAS</h2>
            </div>

            {reviews.length === 0 ? (
              <div
                className="rounded-2xl p-8 sm:p-12 text-center space-y-4"
                style={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(0,212,255,0.08)' }}
              >
                <p className="text-4xl sm:text-5xl">✍️</p>
                <p className="text-gray-500 text-sm sm:text-base">Aún no has escrito ninguna reseña</p>
                <button
                  onClick={() => navigate('/search')}
                  className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-black text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#00d4ff' }}
                >
                  Buscar juegos
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link to={`/game/${review.gameId}`}>
                      <div
                        className="rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-5 transition-all hover:-translate-y-0.5"
                        style={{
                          backgroundColor: '#0a0f1e',
                          border: '1px solid rgba(0,212,255,0.08)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.08)'}
                      >
                        <img
                          src={review.gameImage}
                          alt={review.gameName}
                          className="w-20 sm:w-24 h-14 sm:h-16 object-cover rounded-xl shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-white font-bold text-sm sm:text-base truncate">{review.gameName}</h3>
                            <div className="flex gap-0.5 shrink-0">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className="text-xs sm:text-sm" style={{ color: i < review.rating ? '#00d4ff' : '#1e2a45' }}>★</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-500 text-xs sm:text-sm line-clamp-2">{review.content}</p>
                          <p className="text-gray-700 text-xs">
                            {new Date(review.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* ── Favoritos ──────────────────────────────────────────── */}
        <FadeIn delay={0.3}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 sm:h-7 rounded-full" style={{ backgroundColor: '#00d4ff' }} />
              <h2 className="text-xl sm:text-2xl font-black text-white">JUEGOS FAVORITOS</h2>
            </div>

            {favoriteGames.length === 0 ? (
              <div
                className="rounded-2xl p-8 sm:p-12 text-center space-y-4"
                style={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(0,212,255,0.08)' }}
              >
                <p className="text-4xl sm:text-5xl">🎮</p>
                <p className="text-gray-500 text-sm sm:text-base">Aún no tienes juegos favoritos</p>
                <button
                  onClick={() => navigate('/search')}
                  className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-black text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#00d4ff' }}
                >
                  Explorar juegos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {favoriteGames.map((game, i) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <GameCard game={game} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

      </div>

      {/* Modal de edición */}
      <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} />

    </div>
  )
}

export default ProfilePage