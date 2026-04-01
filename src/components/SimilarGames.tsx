import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Game } from '../types'

interface SimilarGamesProps {
  games: Game[]
}

const SimilarGames = ({ games }: SimilarGamesProps) => {
  if (games.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#00d4ff' }} />
        <h3 className="text-white font-bold text-lg">De la misma serie</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {games.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link to={`/game/${game.slug}`}>
              <div
                className="group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: '#0a0f1e',
                  border: '1px solid rgba(0,212,255,0.08)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.08)'}
              >
                {/* Imagen */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/80 to-transparent" />

                  {/* Rating encima de la imagen */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    <span style={{ color: '#00d4ff' }} className="text-xs">★</span>
                    <span className="text-white text-xs font-bold">{game.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 space-y-1">
                  <h4 className="text-white text-sm font-semibold leading-tight line-clamp-1 group-hover:text-[#00d4ff] transition-colors">
                    {game.name}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {game.genres?.slice(0, 1).map((genre) => (
                      <span
                        key={genre.id}
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'rgba(0,212,255,0.08)',
                          color: 'rgba(0,212,255,0.7)',
                        }}
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SimilarGames