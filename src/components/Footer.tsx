import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <li>
    <Link
      to={to}
      className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
    >
      {label}
    </Link>
  </li>
)

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const exploreLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Explorar juegos', to: '/search' },
    { label: 'Próximos lanzamientos', to: '/search?dateOption=upcoming' },
    { label: 'Top Rated', to: '/search?ordering=-metacritic' },
  ]

  const genreLinks = [
    { label: 'Action', to: '/search?genres=action' },
    { label: 'RPG', to: '/search?genres=role-playing-games-rpg' },
    { label: 'Strategy', to: '/search?genres=strategy' },
    { label: 'Indie', to: '/search?genres=indie' },
    { label: 'Horror', to: '/search?genres=horror' },
  ]

  const accountLinks = [
    { label: 'Iniciar sesión', to: '/login' },
    { label: 'Registrarse', to: '/register' },
    { label: 'Mi perfil', to: '/profile' },
  ]

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-black text-sm bg-cyan-400">
                CK
              </div>
              <span className="font-black text-lg text-white">
                Check<span className="text-cyan-400">PointGG</span>
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed">
              La comunidad gamer donde descubres, reseñas y calificas los mejores videojuegos.
            </p>

            <a
              href="https://rawg.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-cyan-400 transition-colors"
            >
              🎮 Powered by RAWG API
            </a>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Explorar
            </h4>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <FooterLink key={link.label} to={link.to} label={link.label} />
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Géneros
            </h4>
            <ul className="space-y-2.5">
              {genreLinks.map((link) => (
                <FooterLink key={link.label} to={link.to} label={link.label} />
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Mi cuenta
            </h4>
            <ul className="space-y-2.5">
              {accountLinks.map((link) => (
                <FooterLink key={link.label} to={link.to} label={link.label} />
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {currentYear} CheckPointGG. Hecho con 🎮 y ❤️
          </p>

          <motion.div
            className="h-0.5 w-24 rounded-full hidden sm:block bg-cyan-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <p className="text-xs text-gray-600">
            Datos provistos por{' '}
            <a
              href="https://rawg.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              RAWG.io
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer