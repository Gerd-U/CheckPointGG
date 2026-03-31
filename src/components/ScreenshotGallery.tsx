import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Screenshot {
  id: number
  image: string
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[]
}

const ScreenshotGallery = ({ screenshots }: ScreenshotGalleryProps) => {
  const [selected, setSelected] = useState<Screenshot | null>(null)

  if (screenshots.length === 0) return null

  const currentIndex = screenshots.findIndex((s) => s.id === selected?.id)

  const goNext = () => {
    const nextIndex = (currentIndex + 1) % screenshots.length
    setSelected(screenshots[nextIndex])
  }

  const goPrev = () => {
    const prevIndex = (currentIndex - 1 + screenshots.length) % screenshots.length
    setSelected(screenshots[prevIndex])
  }

  return (
    <div className="space-y-4">

      {/* Título */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#00d4ff' }} />
        <h3 className="text-white font-bold text-lg">Screenshots</h3>
      </div>

      {/* Grid de miniaturas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {screenshots.slice(0, 6).map((screenshot, i) => (
          <motion.div
            key={screenshot.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => setSelected(screenshot)}
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
            style={{ border: '1px solid rgba(0,212,255,0.1)' }}
          >
            <img
              src={screenshot.image}
              alt={`Screenshot ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                🔍
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          // Overlay — click fuera cierra
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            {/* Fondo */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            {/* Botón cerrar — encima de todo */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg z-50 transition-colors hover:bg-white/20"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
              ✕
            </button>

            {/* Flecha izquierda */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white z-50 transition-colors hover:bg-white/20"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
              ←
            </button>

            {/* Flecha derecha */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white z-50 transition-colors hover:bg-white/20"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
              →
            </button>

            {/* Imagen */}
            <motion.img
              key={selected.id}
              src={selected.image}
              alt="Screenshot"
              className="relative max-w-4xl w-full rounded-2xl z-40"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Contador */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm text-white z-50"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
              {currentIndex + 1} / {screenshots.length}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default ScreenshotGallery