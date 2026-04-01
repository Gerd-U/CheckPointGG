import axios from "axios"
import type { Game, PaginatedResponse } from "../types"

const API_KEY = import.meta.env.VITE_RAWG_API_KEY
const BASE_URL = "https://api.rawg.io/api"

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
    exclude_additions: true,
  },
})

// Filtra juegos sin imagen de portada en el frontend
const withImage = (games: Game[]) =>
  games.filter((g) => g.background_image && g.background_image !== '')

// Trae una lista de juegos con búsqueda y filtros opcionales
export const getGames = async (params: {
  search?: string
  genres?: string
  ordering?: string
  platforms?: string
  page?: number
  page_size?: number
  dates?: string
} = {}) => {
  const { data } = await apiClient.get<PaginatedResponse<Game>>('/games', {
    params: {
      page_size: params.page_size ?? 20,
      search_precise: true,
      search_exact: true,
      ...params,
    },
  })
  return {
    ...data,
    results: withImage(data.results),
  }
}

// Trae el detalle completo de un juego por su slug
export const getGameDetail = async (slug: string) => {
  const { data } = await apiClient.get<Game>(`/games/${slug}`)
  return data
}

// Trae los juegos más populares del momento
export const getTrendingGames = async () => {
  const { data } = await apiClient.get<PaginatedResponse<Game>>('/games', {
    params: {
      ordering: '-added',
      page_size: 16,
      metacritic: '60,100',
      platforms: '4,18,187,1,186,7',
    },
  })
  return withImage(data.results).slice(0, 8)
}

// Trae todos los géneros disponibles en RAWG
export const getGenres = async () => {
  const { data } = await apiClient.get('/genres')
  return data.results as { id: number; name: string; slug: string }[]
}

// Juegos mejor valorados de todos los tiempos
export const getTopRatedGames = async () => {
  const { data } = await apiClient.get<PaginatedResponse<Game>>('/games', {
    params: {
      ordering: '-metacritic',
      metacritic: '90,100',
      page_size: 16,
    },
  })
  return withImage(data.results).slice(0, 8)
}

// Próximos lanzamientos
export const getUpcomingGames = async () => {
  const today = new Date().toISOString().split('T')[0]
  const nextYear = new Date()
  nextYear.setFullYear(nextYear.getFullYear() + 1)
  const nextYearStr = nextYear.toISOString().split('T')[0]

  const { data } = await apiClient.get<PaginatedResponse<Game>>('/games', {
    params: {
      dates: `${today},${nextYearStr}`,
      ordering: '-added',
      page_size: 16,
    },
  })
  return withImage(data.results).slice(0, 8)
}

// Juegos aleatorios para recomendaciones
export const getRandomGames = async () => {
  const randomPage = Math.floor(Math.random() * 10) + 1
  const { data } = await apiClient.get<PaginatedResponse<Game>>('/games', {
    params: {
      ordering: '-rating',
      page_size: 12,
      page: randomPage,
      metacritic: '60,100',
      platforms: '4,18,187,1,186,7',
    },
  })
  return withImage(data.results).slice(0, 4)
}

// Trae los screenshots de un juego
export const getGameScreenshots = async (slug: string) => {
  const { data } = await apiClient.get(`/games/${slug}/screenshots`)
  return data.results as { id: number; image: string }[]
}

// Trae los trailers de un juego
export const getGameTrailers = async (slug: string) => {
  const { data } = await apiClient.get(`/games/${slug}/movies`)
  return data.results as {
    id: number
    name: string
    preview: string
    data: { max: string }
  }[]
}

// Trae juegos de la misma serie o similares
export const getSimilarGames = async (slug: string) => {
  const { data } = await apiClient.get<PaginatedResponse<Game>>(`/games/${slug}/game-series`)
  return withImage(data.results).slice(0, 6)
}