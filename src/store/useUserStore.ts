import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Game } from '../types'

// Forma de una reseña
export interface UserReview {
  id: string
  gameId: number
  gameName: string
  gameImage: string
  rating: number
  content: string
  createdAt: string
}

interface UserProfile {
  id: string
  username: string
  bio: string
}

interface UserState {
  // Estado
  profile: UserProfile | null
  isLoggedIn: boolean
  favoriteGames: Game[]
  reviews: UserReview[]

  // Acciones
  login: (username: string) => void
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
  toggleFavorite: (game: Game) => void
  isFavorite: (gameId: number) => boolean
  addReview: (review: Omit<UserReview, 'id' | 'createdAt'>) => void
  getGameReview: (gameId: number) => UserReview | undefined
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoggedIn: false,
      favoriteGames: [],
      reviews: [],

      login: (username) => set({
        isLoggedIn: true,
        profile: {
          id: crypto.randomUUID(),
          username,
          bio: 'Apasionado de los videojuegos 🎮',
        }
      }),

      logout: () => set({
        isLoggedIn: false,
        profile: null,
        favoriteGames: [],
        reviews: [],
      }),

      updateProfile: (data) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : null
      })),

      toggleFavorite: (game) => set((state) => {
        const exists = state.favoriteGames.some((g) => g.id === game.id)
        return {
          favoriteGames: exists
            ? state.favoriteGames.filter((g) => g.id !== game.id)
            : [...state.favoriteGames, game]
        }
      }),

      isFavorite: (gameId) => get().favoriteGames.some((g) => g.id === gameId),

      // Agrega una nueva reseña
      addReview: (reviewData) => set((state) => ({
        reviews: [
          {
            ...reviewData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
          ...state.reviews,
        ]
      })),

      // Busca si el usuario ya reseñó este juego
      getGameReview: (gameId) => get().reviews.find((r) => r.gameId === gameId),
    }),
    {
      name: 'checkpointgg-user',
    }
  )
)