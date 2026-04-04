import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Game } from '../types'
import type { AuthUser } from '../services/authService'

export interface UserReview {
  id: string
  gameId: number
  gameName: string
  gameImage: string
  rating: number
  content: string
  createdAt: string
}

interface UserState {
  // Estado
  profile: AuthUser | null
  isLoggedIn: boolean
  favoriteGames: Game[]
  reviews: UserReview[]

  // Acciones
  setUser: (user: AuthUser) => void
  logout: () => void
  updateProfile: (data: Partial<AuthUser>) => void
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

      // Guarda el usuario después del login o registro
      setUser: (user) => set({
        isLoggedIn: true,
        profile: user,
      }),

      logout: () => set({
        isLoggedIn: false,
        profile: null,
        favoriteGames: [],
        reviews: [],
      }),

      updateProfile: (data) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : null,
      })),

      toggleFavorite: (game) => set((state) => {
        const exists = state.favoriteGames.some((g) => g.id === game.id)
        return {
          favoriteGames: exists
            ? state.favoriteGames.filter((g) => g.id !== game.id)
            : [...state.favoriteGames, game],
        }
      }),

      isFavorite: (gameId) => get().favoriteGames.some((g) => g.id === gameId),

      addReview: (reviewData) => set((state) => ({
        reviews: [
          {
            ...reviewData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
          ...state.reviews,
        ],
      })),

      getGameReview: (gameId) => get().reviews.find((r) => r.gameId === gameId),
    }),
    {
      name: 'checkpointgg-user',
    }
  )
)