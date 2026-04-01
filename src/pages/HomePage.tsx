import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getTrendingGames,
  getTopRatedGames,
  getUpcomingGames,
  getRandomGames,
} from "../services/rawgApi";
import GameCard from "../components/GameCard";
import FadeIn from "../components/FadeIn";
import type { Game } from "../types";

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    className="rounded-2xl overflow-hidden animate-pulse"
    style={{ backgroundColor: "#0a0f1e" }}
  >
    <div className="h-40 sm:h-48" style={{ backgroundColor: "#0f1629" }} />
    <div className="p-4 space-y-3">
      <div
        className="h-4 rounded-lg w-3/4"
        style={{ backgroundColor: "#0f1629" }}
      />
      <div
        className="h-3 rounded-lg w-1/2"
        style={{ backgroundColor: "#0f1629" }}
      />
    </div>
  </div>
);

// ── Sección reutilizable ──────────────────────────────────────────────────────
interface SectionProps {
  title: string;
  subtitle: string;
  linkTo: string;
  games: Game[];
  loading: boolean;
  delay?: number;
}

const Section = ({
  title,
  subtitle,
  linkTo,
  games,
  loading,
  delay = 0,
}: SectionProps) => (
  <FadeIn delay={delay}>
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-7 sm:h-8 rounded-full"
              style={{ backgroundColor: "#00d4ff" }}
            />
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {title}
            </h2>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm pl-4">{subtitle}</p>
        </div>
        <Link
          to={linkTo}
          className="text-xs sm:text-sm hover:opacity-70 transition-opacity shrink-0"
          style={{ color: "#00d4ff" }}
        >
          Ver todos →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : games.slice(0, 4).map((game, i) => (
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
    </div>
  </FadeIn>
);

// ── Carrusel ──────────────────────────────────────────────────────────────────
const HeroCarousel = ({ games }: { games: Game[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (games.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % games.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [games]);

  if (games.length === 0) return null;

  const game = games[current];

  return (
    <div className="relative h-[45vh] sm:h-[55vh] lg:h-[70vh] overflow-hidden rounded-2xl sm:rounded-3xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={game.id}
          src={game.background_image}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/80 to-transparent" />

      {/* Partículas */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: "#00d4ff",
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Contenido */}
      <div className="absolute inset-0 flex items-end p-5 sm:p-8 lg:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={game.id}
            className="space-y-2 sm:space-y-4 max-w-xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Géneros */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {game.genres?.slice(0, 2).map((genre) => (
                <span
                  key={genre.id}
                  className="text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
                  style={{
                    backgroundColor: "rgba(0,212,255,0.15)",
                    color: "#00d4ff",
                    border: "1px solid rgba(0,212,255,0.3)",
                  }}
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Título */}
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white leading-tight line-clamp-2">
              {game.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span
                  style={{ color: "#00d4ff" }}
                  className="text-base sm:text-xl"
                >
                  ★
                </span>
                <span className="text-white font-bold text-base sm:text-xl">
                  {game.rating.toFixed(1)}
                </span>
              </div>
              {game.metacritic && (
                <span
                  className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg font-black text-xs sm:text-sm"
                  style={{
                    backgroundColor: "rgba(34,197,94,0.2)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.4)",
                  }}
                >
                  Metacritic {game.metacritic}
                </span>
              )}
            </div>

            {/* Botón */}
            <Link
              to={`/game/${game.slug}`}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-black text-sm sm:text-base transition-all hover:opacity-90"
              style={{ backgroundColor: "#00d4ff" }}
            >
              Ver juego →
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 flex gap-1.5 sm:gap-2">
        {games.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? "20px" : "6px",
              height: "6px",
              backgroundColor:
                i === current ? "#00d4ff" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ── HomePage ──────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [trending, setTrending] = useState<Game[]>([]);
  const [topRated, setTopRated] = useState<Game[]>([]);
  const [upcoming, setUpcoming] = useState<Game[]>([]);
  const [recommended, setRecommended] = useState<Game[]>([]);

  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  useEffect(() => {
    getTrendingGames()
      .then(setTrending)
      .finally(() => setLoadingTrending(false));

    getTopRatedGames()
      .then(setTopRated)
      .finally(() => setLoadingTop(false));

    getUpcomingGames()
      .then(setUpcoming)
      .finally(() => setLoadingUpcoming(false));

    getRandomGames()
      .then(setRecommended)
      .finally(() => setLoadingRecommended(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  const refreshRecommended = () => {
    setLoadingRecommended(true);
    getRandomGames()
      .then(setRecommended)
      .finally(() => setLoadingRecommended(false));
  };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "#030712" }}>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center overflow-hidden py-12 sm:py-20 px-4 sm:px-6">
        {/* Fondo dinámico */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)",
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,212,255,0.05), transparent 70%)",
            }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 w-full">
          <FadeIn delay={0.1} direction="down">
            <div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm"
              style={{
                backgroundColor: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
            >
              <motion.span
                className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full"
                style={{ backgroundColor: "#00d4ff" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span style={{ color: "#00d4ff" }}>
                +500,000 juegos indexados
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black leading-none tracking-tight">
              TU PRÓXIMO
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #00d4ff, #0099cc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                JUEGO
              </span>
              <br />
              TE ESPERA
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto px-4">
              Descubre, reseña y califica videojuegos. La comunidad gamer que te
              ayuda a decidir qué jugar.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <form
              onSubmit={handleSearch}
              className="flex max-w-lg mx-auto gap-2 sm:gap-3 px-4 sm:px-0"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca un juego..."
                className="flex-1 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base text-white placeholder-gray-600 focus:outline-none transition-all"
                style={{
                  backgroundColor: "#0a0f1e",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(0,212,255,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(0,212,255,0.2)")
                }
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-black text-sm sm:text-base"
                style={{ backgroundColor: "#00d4ff" }}
              >
                Buscar
              </motion.button>
            </form>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-4">
              {["Action", "RPG", "Indie", "Strategy", "Horror", "Sports"].map(
                (genre) => (
                  <Link
                    key={genre}
                    to={`/search?genres=${genre.toLowerCase()}`}
                    className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm text-gray-400 hover:text-[#00d4ff] transition-colors"
                    style={{
                      backgroundColor: "rgba(0,212,255,0.05)",
                      border: "1px solid rgba(0,212,255,0.1)",
                    }}
                  >
                    {genre}
                  </Link>
                ),
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CARRUSEL ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <FadeIn delay={0.2}>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-1 h-7 sm:h-8 rounded-full"
                style={{ backgroundColor: "#00d4ff" }}
              />
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  DESTACADOS
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Los mejor valorados de todos los tiempos
                </p>
              </div>
            </div>
            {loadingTop ? (
              <div
                className="h-[45vh] sm:h-[55vh] lg:h-[70vh] rounded-2xl sm:rounded-3xl animate-pulse"
                style={{ backgroundColor: "#0a0f1e" }}
              />
            ) : (
              <HeroCarousel games={topRated.slice(0, 5)} />
            )}
          </div>
        </FadeIn>
      </div>

      {/* ── SECCIONES ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 space-y-14 sm:space-y-20">
        <Section
          title="TRENDING"
          subtitle="Los más populares del momento"
          linkTo="/search?ordering=-added"
          games={trending}
          loading={loadingTrending}
          delay={0.1}
        />

        {/* Recomendaciones */}
        <FadeIn delay={0.2}>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-1 h-7 sm:h-8 rounded-full"
                    style={{ backgroundColor: "#00d4ff" }}
                  />
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    PARA TI
                  </h2>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm pl-4">
                  Recomendaciones que cambian cada visita
                </p>
              </div>
              <motion.button
                onClick={refreshRecommended}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0"
                style={{
                  backgroundColor: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  color: "#00d4ff",
                }}
              >
                <motion.span
                  animate={loadingRecommended ? { rotate: 360 } : { rotate: 0 }}
                  transition={{
                    duration: 0.5,
                    repeat: loadingRecommended ? Infinity : 0,
                  }}
                >
                  🔄
                </motion.span>
                <span className="hidden sm:block">Refrescar</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {loadingRecommended
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : recommended.map((game, i) => (
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
          </div>
        </FadeIn>

        <Section
          title="PRÓXIMOS"
          subtitle="Lo que viene en los próximos meses"
          linkTo="/search?dateOption=upcoming" // cambia esto
          games={upcoming}
          loading={loadingUpcoming}
          delay={0.3}
        />
      </div>
    </div>
  );
};

export default HomePage;
