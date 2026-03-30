import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import type { Game } from '../types'

interface ReviewFormProps {
  game: Game
}

const ratingLabels = ['', 'Terrible', 'Malo', 'Regular', 'Bueno', 'Excepcional']
const ratingColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#00d4ff']

const ReviewForm = ({ game }: ReviewFormProps) => {
  const navigate = useNavigate()
  const { isLoggedIn, addReview, getGameReview } = useUserStore()

  const existingReview = getGameReview(game.id)

  const [rating, setRating] = useState(existingReview?.rating ?? 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [content, setContent] = useState(existingReview?.content ?? '')
  const [submitted, setSubmitted] = useState(!!existingReview)

  const activeRating = hoveredRating || rating

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    if (rating === 0) return
    if (content.trim().length < 10) return

    addReview({
      gameId: game.id,
      gameName: game.name,
      gameImage: game.background_image,
      rating,
      content: content.trim(),
    })

    setSubmitted(true)
  }

  // Vista de reseña enviada
  if (submitted) {
    return (
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{
          backgroundColor: '#0a0f1e',
          border: '1px solid rgba(0,212,255,0.15)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#00d4ff' }} />
          <h3 className="text-white font-bold text-lg">Tu reseña</h3>
        </div>

        <div
          className="rounded-xl p-4 space-y-3"
          style={{ backgroundColor: '#0f1629' }}
        >
          {/* Estrellas */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="text-xl"
                  style={{ color: i < rating ? ratingColors[rating] : '#1e2a45' }}
                >
                  ★
                </span>
              ))}
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: ratingColors[rating] }}
            >
              {ratingLabels[rating]}
            </span>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">{content}</p>
        </div>

        <p className="text-gray-600 text-xs text-center">
          Reseña publicada — ve a tu perfil para verla
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-6 space-y-5"
      style={{
        backgroundColor: '#0a0f1e',
        border: '1px solid rgba(0,212,255,0.1)',
      }}
    >
      {/* Título */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#00d4ff' }} />
        <h3 className="text-white font-bold text-lg">Escribe tu reseña</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Selector de estrellas */}
        <div className="space-y-3">
          <p className="text-gray-500 text-xs uppercase tracking-wider">Tu puntuación</p>

          <div className="flex items-center gap-3">
            {/* Estrellas interactivas */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-3xl transition-all duration-100 hover:scale-125"
                  style={{ color: i < activeRating ? ratingColors[activeRating] : '#1e2a45' }}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Etiqueta animada */}
            {activeRating > 0 && (
              <span
                className="text-sm font-bold transition-all"
                style={{ color: ratingColors[activeRating] }}
              >
                {ratingLabels[activeRating]}
              </span>
            )}
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <p className="text-gray-500 text-xs uppercase tracking-wider">Tu reseña</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué te pareció el juego? Comparte tu experiencia..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none resize-none transition-all text-sm"
            style={{
              backgroundColor: '#0f1629',
              border: '1px solid rgba(0,212,255,0.15)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0,212,255,0.15)'}
          />

          {/* Contador y validación */}
          <div className="flex justify-between items-center">
            {content.length > 0 && content.length < 10 ? (
              <p className="text-red-400 text-xs">Mínimo 10 caracteres</p>
            ) : (
              <span />
            )}
            <p
              className="text-xs ml-auto"
              style={{ color: content.length >= 10 ? '#00d4ff' : '#374151' }}
            >
              {content.length} caracteres
            </p>
          </div>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={rating === 0 || content.trim().length < 10}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
          style={{
            backgroundColor: '#00d4ff',
            color: '#000',
          }}
        >
          {isLoggedIn ? 'Publicar reseña' : 'Inicia sesión para reseñar'}
        </button>

      </form>
    </div>
  )
}

export default ReviewForm