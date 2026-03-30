import axios from 'axios'
import type { Game, PaginatedResponse } from '../types'

//variable de entorno para el api
const API_KEY = import.meta.env.VITE_RAWG_API_KEY
const BASE_URL = 'https://api.rawg.io/api'

// Instancia de axios con la configuración base
// Todos los requests que hagamos con apiClient ya llevan la key automáticamente
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
})

// Trae una lista de juegos, con búsqueda y filtros opcionales
export const getGames = async (params: {
  search?: string
  genres?: string    // slug del género, ej: "action"
  ordering?: string  // ej: "-rating", "-metacritic"
  platforms?: string // id de plataforma, ej: "4" es PC
  page?: number
} = {}) => {
  const { data } = await apiClient.get<PaginatedResponse<Game>>('/games', {
    params: {
      page_size: 20,
      search_precise: true,
      search_exact: true,
      ...params,
    },
  })
  return data
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
      page_size: 8,
    },
  })
  return data.results
}

// Trae todos los géneros disponibles en RAWG
export const getGenres = async () => {
  const { data } = await apiClient.get('/genres')
  return data.results as { id: number; name: string; slug: string }[]
}