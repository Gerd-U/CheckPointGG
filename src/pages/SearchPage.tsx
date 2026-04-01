import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getGames } from "../services/rawgApi";
import GameCard from "../components/GameCard";
import SearchFilters, { type Filters } from "../components/SearchFilters";
import FadeIn from "../components/FadeIn";
import type { Game } from "../types";

// Calcula el rango de fechas según la opción
const getDateRange = (option: string): string => {
  const today = new Date();
  const format = (d: Date) => d.toISOString().split("T")[0];

  if (option === "upcoming") {
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    return `${format(today)},${format(nextYear)}`;
  }
  if (option === "thisyear") {
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    return `${format(startOfYear)},${format(endOfYear)}`;
  }
  if (option === "recent") {
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return `${format(thirtyDaysAgo)},${format(today)}`;
  }
  return "";
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const genreParam = searchParams.get("genres") || "";
  const dateOptionParam = searchParams.get("dateOption") || "";

  // Inicializa los filtros directamente desde la URL
  // así cuando viene ?dateOption=upcoming ya arranca filtrado
  const getInitialFilters = (): Filters => ({
    genres: genreParam,
    ordering: "",
    platforms: "",
    dateOption: dateOptionParam,
    dates: getDateRange(dateOptionParam),
  });

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(getInitialFilters);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Cuando cambia la URL actualiza los filtros
 useEffect(() => {
  setFilters({
    genres: genreParam,
    ordering: '',
    platforms: '',
    dateOption: dateOptionParam,
    dates: getDateRange(dateOptionParam),
  })
  setPage(1)
}, [genreParam, dateOptionParam, query])
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const data = await getGames({
          search: query || undefined,
          genres: filters.genres || undefined,
          ordering: filters.ordering || undefined,
          platforms: filters.platforms || undefined,
          dates: filters.dates || undefined,
          page,
        });
        setGames(data.results);
        setTotalCount(data.count);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [query, filters, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Título dinámico según filtros activos
  const getTitle = () => {
    if (query) return `"${query}"`;
    if (filters.dateOption === "upcoming") return "PRÓXIMOS LANZAMIENTOS";
    if (filters.dateOption === "recent") return "ÚLTIMOS 30 DÍAS";
    if (filters.dateOption === "thisyear") return "ESTE AÑO";
    if (filters.genres) return filters.genres.toUpperCase();
    return "EXPLORAR";
  };

  return (
    <div
      className="min-h-screen pt-20 pb-16 px-4 sm:px-6"
      style={{ backgroundColor: "#030712" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <FadeIn direction="left" className="mb-6 sm:mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div
                className="w-1 h-7 sm:h-8 rounded-full"
                style={{ backgroundColor: "#00d4ff" }}
              />
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {getTitle()}
              </h1>
            </div>
            {totalCount > 0 && (
              <motion.p
                className="text-gray-600 text-xs sm:text-sm pl-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {totalCount.toLocaleString()} juegos encontrados
              </motion.p>
            )}
          </div>
        </FadeIn>

        <div className="flex gap-6 items-start">
          {/* Filtros desktop */}
          <div className="w-56 xl:w-64 shrink-0 hidden lg:block sticky top-20">
            <SearchFilters filters={filters} onChange={setFilters} />
          </div>

          <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
            {/* Filtros móvil colapsable */}
            <div className="lg:hidden">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: "#0a0f1e",
                  border: "1px solid rgba(0,212,255,0.15)",
                  color: "#00d4ff",
                }}
              >
                <span>🎛️ Filtros</span>
                <motion.span
                  animate={{ rotate: filtersOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {filtersOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-2"
                  >
                    <SearchFilters filters={filters} onChange={setFilters} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resultados */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden animate-pulse"
                      style={{ backgroundColor: "#0a0f1e" }}
                    >
                      <div
                        className="h-36 sm:h-48"
                        style={{ backgroundColor: "#0f1629" }}
                      />
                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div
                          className="h-3 sm:h-4 rounded-lg w-3/4"
                          style={{ backgroundColor: "#0f1629" }}
                        />
                        <div
                          className="h-2 sm:h-3 rounded-lg w-1/2"
                          style={{ backgroundColor: "#0f1629" }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : games.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16 sm:py-24 space-y-4"
                >
                  <p className="text-5xl sm:text-6xl">🔍</p>
                  <p className="text-white font-bold text-lg sm:text-xl">
                    No se encontraron juegos
                  </p>
                  <p className="text-gray-500 text-sm">
                    Intenta con otros filtros o términos
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${query}-${page}-${filters.dateOption}-${filters.genres}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
                      className="flex items-center justify-center gap-1.5 sm:gap-2 pt-2 sm:pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: "#0a0f1e",
                          border: "1px solid rgba(0,212,255,0.15)",
                          color: "#00d4ff",
                        }}
                      >
                        ← Anterior
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }).map(
                          (_, i) => {
                            let pageNum = i + 1;
                            if (totalPages > 5) {
                              if (page <= 3) pageNum = i + 1;
                              else if (page >= totalPages - 2)
                                pageNum = totalPages - 4 + i;
                              else pageNum = page - 2 + i;
                            }
                            const isActive = pageNum === page;
                            return (
                              <motion.button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-bold text-xs sm:text-sm transition-colors"
                                style={{
                                  backgroundColor: isActive
                                    ? "#00d4ff"
                                    : "#0a0f1e",
                                  color: isActive ? "#000" : "#fff",
                                  border: isActive
                                    ? "none"
                                    : "1px solid rgba(0,212,255,0.15)",
                                }}
                              >
                                {pageNum}
                              </motion.button>
                            );
                          },
                        )}
                      </div>

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: "#0a0f1e",
                          border: "1px solid rgba(0,212,255,0.15)",
                          color: "#00d4ff",
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
  );
};

export default SearchPage;
