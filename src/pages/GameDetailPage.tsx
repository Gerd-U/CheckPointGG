import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getGameDetail, getGameScreenshots } from '../services/rawgApi'
import { useUserStore } from '../store/useUserStore'
import ScreenshotGallery from '../components/ScreenshotGallery'
import ReviewForm from '../components/ReviewForm'
import FadeIn from '../components/FadeIn'
import type { Game } from '../types'

interface Screenshot {
  id: number
  image: string
}

const GameDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite, isLoggedIn } = useUserStore()

  const [game, setGame] = useState<Game | null>(null)
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const fetchData = async () => {
      setLoading(true)
      try {
        const [gameData, screenshotsData] = await Promise.all([
          getGameDetail(slug),
          getGameScreenshots(slug),
        ])
        setGame(gameData)
        setScreenshots(screenshotsData)
      } catch {
        navigate('/404')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug, navigate])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6" style={{ backgroundColor: '#030712' }}>
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-64 sm:h-96 rounded-2xl" style={{ backgroundColor: '#0a0f1e' }} />
          <div className="h-8 w-1/2 rounded-xl" style={{ backgroundColor: '#0a0f1e' }} />
          <div className="h-4 w-1/3 rounded-xl" style={{ backgroundColor: '#0a0f1e' }} />
        </div>
      </div>
    )
  }

  if (!game) return null

  const favorite = isFavorite(game.id)

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6" style={{ backgroundColor: '#030712' }}>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Hero imagen */}
        <FadeIn direction="down">
          <div className="relative h-56 sm:h-96 rounded-2xl overflow-hidden">
            {game.background_image ? (
              <img
                src={game.background_image}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl"
                style={{ backgroundColor: '#0a0f1e' }}>
                🎮
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
          </div>
        </FadeIn>

        {/* Info principal */}
        <FadeIn>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-black text-white">{game.name}</h1>

                {/* Géneros */}
                <div className="flex flex-wrap gap-2">
                  {game.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: 'rgba(0,212,255,0.08)',
                        color: 'rgba(0,212,255,0.7)',
                        border: '1px solid rgba(0,212,255,0.15)',
                      }}
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botón favorito */}
              <motion.button
                onClick={() => { if (isLoggedIn) toggleFavorite(game) }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shrink-0 transition-all"
                style={{
                  backgroundColor: favorite ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,255,0.08)',
                  border: `1px solid ${favorite ? 'rgba(239,68,68,0.3)' : 'rgba(0,212,255,0.2)'}`,
                  color: favorite ? '#ef4444' : '#00d4ff',
                }}
              >
                {favorite ? '❤️ En favoritos' : '🤍 Agregar a favoritos'}
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-8">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider">Rating</p>
                <p className="text-white font-black text-xl">
                  <span style={{ color: '#00d4ff' }}>★</span> {game.rating.toFixed(1)}
                  <span className="text-gray-600 text-sm font-normal ml-1">
                    ({game.ratings_count.toLocaleString()})
                  </span>
                </p>
              </div>

              {game.metacritic && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Metacritic</p>
                  <p
                    className="font-black text-xl"
                    style={{ color: game.metacritic >= 75 ? '#22c55e' : '#eab308' }}
                  >
                    {game.metacritic}
                  </p>
                </div>
              )}

              {game.released && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Lanzamiento</p>
                  <p className="text-white font-semibold">
                    {new Date(game.released).toLocaleDateString('es-ES', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
              )}

              {game.playtime > 0 && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Tiempo promedio</p>
                  <p className="text-white font-semibold">{game.playtime}h</p>
                </div>
              )}
            </div>

            {/* Plataformas */}
            {game.platforms && (
              <div className="flex flex-wrap gap-2">
                {game.platforms.map((p) => (
                  <span
                    key={p.platform.id}
                    className="text-xs px-3 py-1 rounded-lg"
                    style={{
                      backgroundColor: '#0a0f1e',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#9ca3af',
                    }}
                  >
                    {p.platform.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Descripción */}
        {game.description_raw && (
          <FadeIn delay={0.1}>
            <div
              className="rounded-2xl p-6 space-y-3"
              style={{
                backgroundColor: '#0a0f1e',
                border: '1px solid rgba(0,212,255,0.08)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#00d4ff' }} />
                <h2 className="text-white font-bold text-lg">Descripción</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-6">
                {game.description_raw}
              </p>
            </div>
          </FadeIn>
        )}

        {/* Screenshots */}
        {screenshots.length > 0 && (
          <FadeIn delay={0.15}>
            <ScreenshotGallery screenshots={screenshots} />
          </FadeIn>
        )}

        {/* Formulario de reseña */}
        <FadeIn delay={0.2}>
          <ReviewForm game={game} />
        </FadeIn>

      </div>
    </div>
  )
}

export default GameDetailPage