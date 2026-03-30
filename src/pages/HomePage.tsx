import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getTrendingGames } from '../services/rawgApi'
import GameCard from '../components/GameCard'
import FadeIn from '../components/FadeIn'
import type { Game } from '../types'

const HomePage = () => {
  const navigate = useNavigate()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getTrendingGames()
        setGames(data)
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search)}`)
  }

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#030712' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
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

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">

          {/* Cada elemento entra con un delay diferente para efecto escalonado */}
          <FadeIn delay={0.1} direction="down">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border-glow"
              style={{ backgroundColor: 'rgba(0,212,255,0.05)' }}
            >
              <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
              <span className="text-[#00d4ff]">+500,000 juegos indexados</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-6xl sm:text-8xl font-black leading-none tracking-tight">
              TU PRÓXIMO
              <br />
              <span className="text-gradient-cyan">JUEGO</span>
              <br />
              TE ESPERA
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Descubre, reseña y califica videojuegos. La comunidad gamer que te ayuda a decidir qué jugar.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <form onSubmit={handleSearch} className="flex max-w-lg mx-auto gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca un juego..."
                className="flex-1 px-5 py-4 rounded-2xl text-white placeholder-gray-600 focus:outline-none border-glow"
                style={{ backgroundColor: '#0a0f1e' }}
              />
              <button
                type="submit"
                className="px-6 py-4 rounded-2xl font-bold text-black transition-all hover:opacity-90 glow-cyan"
                style={{ backgroundColor: '#00d4ff' }}
              >
                Buscar
              </button>
            </form>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="flex flex-wrap justify-center gap-2">
              {['Action', 'RPG', 'Indie', 'Strategy', 'Horror', 'Sports'].map((genre) => (
                <Link
                  key={genre}
                  to={`/search?genres=${genre.toLowerCase()}`}
                  className="px-4 py-1.5 rounded-full text-sm text-gray-400 hover:text-[#00d4ff] transition-colors border-glow"
                  style={{ backgroundColor: 'rgba(0,212,255,0.05)' }}
                >
                  {genre}
                </Link>
              ))}
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ── TRENDING ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-8">

        <FadeIn direction="left">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#00d4ff' }} />
                <h2 className="text-3xl font-black text-white">TRENDING</h2>
              </div>
              <p className="text-gray-500 text-sm pl-4">Los más populares del momento</p>
            </div>
            <Link to="/search" className="text-sm text-[#00d4ff] hover:opacity-70 transition-opacity">
              Ver todos →
            </Link>
          </div>
        </FadeIn>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: '#0a0f1e' }}>
                <div className="h-48" style={{ backgroundColor: '#0f1629' }} />
                <div className="p-4 space-y-3">
                  <div className="h-4 rounded-lg w-3/4" style={{ backgroundColor: '#0f1629' }} />
                  <div className="h-3 rounded-lg w-1/2" style={{ backgroundColor: '#0f1629' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Las cards entran escalonadas una tras otra
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, i) => (
              <FadeIn key={game.id} delay={i * 0.05} direction="up">
                <GameCard game={game} />
              </FadeIn>
            ))}
          </div>
        )}

      </section>
    </div>
  )
}

export default HomePage