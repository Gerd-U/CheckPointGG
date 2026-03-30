import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getGames } from '../services/rawgApi'
import GameCard from '../components/GameCard'
import SearchFilters from '../components/SearchFilters'
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
        <div className="mb-8 space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: '#00d4ff' }} />
            <h1 className="text-3xl font-black text-white">
              {query ? `"${query}"` : 'EXPLORAR'}
            </h1>
          </div>
          {totalCount > 0 && (
            <p className="text-gray-600 text-sm pl-4">
              {totalCount.toLocaleString()} juegos encontrados
            </p>
          )}
        </div>

        <div className="flex gap-8 items-start">

          {/* Filtros desktop */}
          <div className="w-64 shrink-0 hidden lg:block sticky top-24">
            <SearchFilters filters={filters} onChange={setFilters} />
          </div>

          <div className="flex-1 space-y-6">

            {/* Filtros móvil */}
            <div className="lg:hidden">
              <SearchFilters filters={filters} onChange={setFilters} />
            </div>

            {/* Estados */}
            {loading ? (
              // Skeleton de carga
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
              </div>
            ) : games.length === 0 ? (
              <div className="text-center py-24 space-y-4">
                <p className="text-6xl">🔍</p>
                <p className="text-white font-bold text-xl">No se encontraron juegos</p>
                <p className="text-gray-500">Intenta con otros filtros o términos</p>
              </div>
            ) : (
              <>
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">

                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className="w-10 h-10 rounded-xl font-bold text-sm transition-all"
                            style={{
                              backgroundColor: isActive ? '#00d4ff' : '#0a0f1e',
                              color: isActive ? '#000' : '#fff',
                              border: isActive ? 'none' : '1px solid rgba(0,212,255,0.15)',
                            }}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: '#0a0f1e',
                        border: '1px solid rgba(0,212,255,0.15)',
                        color: '#00d4ff',
                      }}
                    >
                      Siguiente →
                    </button>

                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage