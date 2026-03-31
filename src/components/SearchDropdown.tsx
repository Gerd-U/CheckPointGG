import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getGames } from '../services/rawgApi'
import useDebounce from '../hooks/useDebounce'
import type { Game } from '../types'

interface SearchDropdownProps {
  query: string
  onClose: () => void
}

const SearchDropdown = ({ query, onClose }: SearchDropdownProps) => {
  const [results, setResults] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)

  // Espera 400ms después de que el usuario deje de escribir
  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    // No busca si el query es muy corto
    if (debouncedQuery.trim().length < 2) {
      setResults([])
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        const data = await getGames({
          search: debouncedQuery,
          page_size: 5, // solo 5 resultados en el dropdown
        })
        setResults(data.results)
      } finally {
        setLoading(false)
      }
    }

    search()
  }, [debouncedQuery])

  // No muestra el dropdown si no hay query
  if (query.trim().length < 2) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-2xl z-50"
        style={{
          backgroundColor: '#0a0f1e',
          border: '1px solid rgba(0,212,255,0.2)',
        }}
      >
        {loading ? (
          <div className="p-4 text-center">
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin mx-auto"
              style={{ borderColor: '#00d4ff', borderTopColor: 'transparent' }}
            />
          </div>

        ) : results.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No se encontraron juegos
          </div>

        ) : (
          <div>
            {results.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/game/${game.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5"
                >
                  {/* Imagen miniatura */}
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-12 h-8 object-cover rounded-lg shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">
                      {game.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      ★ {game.rating.toFixed(1)} · {game.genres?.[0]?.name}
                    </p>
                  </div>

                  {/* Metacritic */}
                  {game.metacritic && (
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded-lg shrink-0"
                      style={{
                        backgroundColor: game.metacritic >= 75
                          ? 'rgba(34,197,94,0.15)'
                          : 'rgba(234,179,8,0.15)',
                        color: game.metacritic >= 75 ? '#22c55e' : '#eab308',
                      }}
                    >
                      {game.metacritic}
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}

            {/* Ver todos los resultados */}
            <Link
              to={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-t"
              style={{
                color: '#00d4ff',
                borderColor: 'rgba(0,212,255,0.1)',
              }}
            >
              Ver todos los resultados →
            </Link>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default SearchDropdown