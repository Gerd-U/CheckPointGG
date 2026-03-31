import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getGames } from '../services/rawgApi'
import GameCard from '../components/GameCard'
import SearchFilters from '../components/SearchFilters'
import FadeIn from '../components/FadeIn'
import type { Game } from '../types'

interface Filters {
  genres: string
  ordering: string
  platforms: string
}

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    genres: '',
    ordering: '',
    platforms: '',
  })

  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const PAGE_SIZE = 20
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [query, filters])

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true)
      try {
        const data = await getGames({
          search: query || undefined,
          genres: filters.genres || undefined,
          ordering: filters.ordering || undefined,
          platforms: filters.platforms || undefined,
          page,
        })
        setGames(data.results)
        setTotalCount(data.count)
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [query, filters, page])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ backgroundColor: '#030712' }}>
      <div className="max-w-7xl mx-auto">

        {/* Título */}
        <FadeIn direction="left" className="mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#00d4ff' }} />
              <h1 className="text-3xl font-black text-white">
                {query ? `"${query}"` : 'EXPLORAR'}
              </h1>
            </div>
            {totalCount > 0 && (
              <motion.p
                className="text-gray-600 text-sm pl-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {totalCount.toLocaleString()} juegos encontrados
              </motion.p>
            )}
          </div>
        </FadeIn>

        <div className="flex gap-8 items-start">

          {/* Filtros desktop */}
          <FadeIn direction="left" delay={0.1} className="w-64 shrink-0 hidden lg:block sticky top-24">
            <SearchFilters filters={filters} onChange={setFilters} />
          </FadeIn>

          <div className="flex-1 space-y-6">

            {/* Filtros móvil */}
            <div className="lg:hidden">
              <SearchFilters filters={filters} onChange={setFilters} />
            </div>

            {/* AnimatePresence permite animar la salida de elementos */}
            <AnimatePresence mode="wait">
              {loading ? (
                // Skeleton animado
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden animate-pulse"
                      style={{ backgroundColor: '#0a0f1e' }}
                    >
                      <div className="h-48" style={{ backgroundColor: '#0f1629' }} />
                      <div className="p-4 space-y-3">
                        <div className="h-4 rounded-lg w-3/4" style={{ backgroundColor: '#0f1629' }} />
                        <div className="h-3 rounded-lg w-1/2" style={{ backgroundColor: '#0f1629' }} />
                      </div>
                    </div>
                  ))}
                </motion.div>

              ) : games.length === 0 ? (
                // Sin resultados
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24 space-y-4"
                >
                  <p className="text-6xl">🔍</p>
                  <p className="text-white font-bold text-xl">No se encontraron juegos</p>
                  <p className="text-gray-500">Intenta con otros filtros o términos</p>
                </motion.div>

              ) : (
                // Grid de juegos con entrada escalonada
                <motion.div
                  key={`${query}-${page}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {games.map((game, i) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <GameCard game={game} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <motion.div
                      className="flex items-center justify-center gap-2 pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80"
                        style={{
                          backgroundColor: '#0a0f1e',
                          border: '1px solid rgba(0,212,255,0.15)',
                          color: '#00d4ff',
                        }}
                      >
                        ← Anterior
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                          let pageNum = i + 1
                          if (totalPages > 5) {
                            if (page <= 3) pageNum = i + 1
                            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
                            else pageNum = page - 2 + i
                          }

                          const isActive = pageNum === page

                          return (
                            <motion.button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 rounded-xl font-bold text-sm transition-colors"
                              style={{
                                backgroundColor: isActive ? '#00d4ff' : '#0a0f1e',
                                color: isActive ? '#000' : '#fff',
                                border: isActive ? 'none' : '1px solid rgba(0,212,255,0.15)',
                              }}
                            >
                              {pageNum}
                            </motion.button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80"
                        style={{
                          backgroundColor: '#0a0f1e',
                          border: '1px solid rgba(0,212,255,0.15)',
                          color: '#00d4ff',
                        }}
                      >
                        Siguiente →
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage