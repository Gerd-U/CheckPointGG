import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGameDetail, getGameScreenshots, getSimilarGames } from '../services/rawgApi'
import { useUserStore } from '../store/useUserStore'
import ReviewForm from '../components/ReviewForm'
import ScreenshotGallery from '../components/ScreenshotGallery'
import SimilarGames from '../components/SimilarGames'
import FadeIn from '../components/FadeIn'
import { motion } from 'framer-motion'
import type { Game } from '../types'

const GameDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, toggleFavorite, isFavorite } = useUserStore()

  const [game, setGame] = useState<Game | null>(null)
  const [screenshots, setScreenshots] = useState<{ id: number; image: string }[]>([])
  const [similarGames, setSimilarGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const fetchGame = async () => {
      setLoading(true)
      try {
        const [gameData, screenshotsData, similarData] = await Promise.all([
          getGameDetail(slug!),
          getGameScreenshots(slug!),
          getSimilarGames(slug!),
        ])
        setGame(gameData)
        setScreenshots(screenshotsData)
        setSimilarGames(similarData)
      } catch (err) {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [slug])

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-20"
        style={{ backgroundColor: '#030712' }}
      >
        <div className="space-y-3 text-center">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin mx-auto"
            style={{ borderColor: '#00d4ff', borderTopColor: 'transparent' }}
          />
          <p className="text-gray-500 text-sm">Cargando juego...</p>
        </div>
      </div>
    )
  }

  if (!game) return null

  const favorite = isFavorite(game.id)

  const handleFavorite = () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    toggleFavorite(game)
  }

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#030712' }}>

      {/* ── Imagen hero ───────────────────────────────────────────── */}
      <motion.div
        className="relative h-56 sm:h-72 md:h-96 overflow-hidden"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/50 to-transparent" />
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 relative space-y-6 sm:space-y-8 pb-20">

        {/* ── Géneros ───────────────────────────────────────────────── */}
        <FadeIn delay={0.1} direction="up">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {game.genres?.map((genre) => (
              <span
                key={genre.id}
                className="text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
                style={{
                  backgroundColor: 'rgba(0,212,255,0.08)',
                  color: 'rgba(0,212,255,0.8)',
                  border: '1px solid rgba(0,212,255,0.2)',
                }}
              >
                {genre.name}
              </span>
            ))}
          </div>
        </FadeIn>

        {/* ── Título y favorito ─────────────────────────────────────── */}
        <FadeIn delay={0.2}>
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              {game.name}
            </h1>
            <motion.button
              onClick={handleFavorite}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors"
              style={{
                backgroundColor: favorite ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,255,0.08)',
                border: favorite ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(0,212,255,0.2)',
                color: favorite ? '#f87171' : '#00d4ff',
              }}
            >
              {favorite ? '❤️ Favorito' : '🤍 Favorito'}
            </motion.button>
          </div>
        </FadeIn>

        {/* ── Ratings ───────────────────────────────────────────────── */}
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">

            <div className="space-y-1">
              <p className="text-gray-600 text-xs uppercase tracking-wider">Rating comunidad</p>
              <div className="flex items-center gap-2">
                <span style={{ color: '#00d4ff' }} className="text-xl sm:text-2xl font-black">
                  {game.rating.toFixed(1)}
                </span>
                <div className="space-y-0.5">
                  <div className="w-20 sm:w-24 h-1.5 rounded-full" style={{ backgroundColor: '#0f1629' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: '#00d4ff' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(game.rating / 5) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-gray-600 text-xs">{game.ratings_count.toLocaleString()} votos</p>
                </div>
              </div>
            </div>

            {game.metacritic && (
              <div className="space-y-1">
                <p className="text-gray-600 text-xs uppercase tracking-wider">Metacritic</p>
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl"
                  style={{
                    backgroundColor: game.metacritic >= 75 ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                    border: game.metacritic >= 75 ? '2px solid rgba(34,197,94,0.5)' : '2px solid rgba(234,179,8,0.5)',
                    color: game.metacritic >= 75 ? '#22c55e' : '#eab308',
                  }}
                >
                  {game.metacritic}
                </div>
              </div>
            )}

            {game.playtime > 0 && (
              <div className="space-y-1">
                <p className="text-gray-600 text-xs uppercase tracking-wider">Tiempo promedio</p>
                <p className="text-white font-bold text-base sm:text-lg">{game.playtime}h</p>
              </div>
            )}

          </div>
        </FadeIn>

        {/* ── Descripción ───────────────────────────────────────────── */}
        {game.description_raw && (
          <FadeIn delay={0.4}>
            <div
              className="rounded-2xl p-4 sm:p-6 space-y-3"
              style={{
                backgroundColor: '#0a0f1e',
                border: '1px solid rgba(0,212,255,0.08)',
              }}
            >
              <h2 className="text-white font-bold text-base sm:text-lg">Acerca del juego</h2>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                {game.description_raw.slice(0, 600)}
                {game.description_raw.length > 600 && '...'}
              </p>
            </div>
          </FadeIn>
        )}

        {/* ── Screenshots ───────────────────────────────────────────── */}
        <FadeIn delay={0.5}>
          <ScreenshotGallery screenshots={screenshots} />
        </FadeIn>

        {/* ── Juegos similares ──────────────────────────────────────── */}
        {similarGames.length > 0 && (
          <FadeIn delay={0.6}>
            <SimilarGames games={similarGames} />
          </FadeIn>
        )}

        {/* ── Reseña ────────────────────────────────────────────────── */}
        <FadeIn delay={0.7}>
          <ReviewForm game={game} />
        </FadeIn>

      </div>
    </div>
  )
}

export default GameDetailPage