import { Link } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import type { Game } from '../types'

interface GameCardProps {
  game: Game
}

const GameCard = ({ game }: GameCardProps) => {
  const { isFavorite, toggleFavorite, isLoggedIn } = useUserStore()
  const favorite = isFavorite(game.id)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) return
    toggleFavorite(game)
  }

  return (
    <Link to={`/game/${game.slug}`}>
      <div
        className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{
          backgroundColor: '#0a0f1e',
          border: '1px solid rgba(0,212,255,0.08)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0,212,255,0.08)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {/* Imagen */}
        <div className="relative h-48 overflow-hidden">
          {game.background_image ? (
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: '#0f1629' }}>
              🎮
            </div>
          )}

          {/* Gradiente sobre la imagen */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent" />

          {/* Botón favorito */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{
              backgroundColor: favorite ? 'rgba(239,68,68,0.9)' : 'rgba(10,15,30,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {favorite ? '❤️' : '🤍'}
          </button>

          {/* Metacritic badge */}
          {game.metacritic && (
            <div
              className="absolute bottom-3 left-3 px-2 py-1 rounded-lg text-xs font-black"
              style={{
                backgroundColor: game.metacritic >= 75 ? 'rgba(34,197,94,0.9)' : 'rgba(234,179,8,0.9)',
                color: '#000',
              }}
            >
              {game.metacritic}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-3">

          {/* Título */}
          <h3
            className="font-bold text-white leading-tight line-clamp-2 group-hover:transition-colors"
            style={{ fontSize: '0.95rem' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#00d4ff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
          >
            {game.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[#00d4ff]">★</span>
              <span className="text-white font-semibold text-sm">
                {game.rating.toFixed(1)}
              </span>
              <span className="text-gray-600 text-xs">
                ({game.ratings_count.toLocaleString()})
              </span>
            </div>

            {/* Plataformas */}
            <div className="flex gap-1 text-xs text-gray-600">
              {game.platforms?.slice(0, 3).map((p) => (
                <span key={p.platform.id} title={p.platform.name}>
                  {p.platform.slug === 'pc' ? '🖥️' :
                   p.platform.slug.includes('playstation') ? '🎮' :
                   p.platform.slug.includes('xbox') ? '🎯' :
                   p.platform.slug.includes('nintendo') ? '🕹️' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* Géneros */}
          <div className="flex flex-wrap gap-1">
            {game.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="text-xs px-2 py-0.5 rounded-full"
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
      </div>
    </Link>
  )
}

export default GameCard