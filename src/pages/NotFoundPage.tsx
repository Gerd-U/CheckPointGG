import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFoundPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: '#030712' }}
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }}
        />
      </div>

      <div className="relative text-center space-y-8">

        {/* 404 animado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        >
          <h1
            className="text-[180px] font-black leading-none"
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px rgba(0,212,255,0.3)',
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Mensaje */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-white text-2xl font-black">
            Página no encontrada
          </h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            Parece que esta página no existe o fue eliminada. Vuelve al inicio y sigue explorando juegos.
          </p>
        </motion.div>

        {/* Botones */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/"
            className="px-6 py-3 rounded-xl font-bold text-black transition-all hover:opacity-90 glow-cyan"
            style={{ backgroundColor: '#00d4ff' }}
          >
            Volver al inicio
          </Link>
          <Link
            to="/search"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
            style={{
              backgroundColor: '#0a0f1e',
              border: '1px solid rgba(0,212,255,0.15)',
              color: '#00d4ff',
            }}
          >
            Explorar juegos
          </Link>
        </motion.div>

      </div>
    </div>
  )
}

export default NotFoundPage