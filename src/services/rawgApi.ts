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
    exclude_additions: true, // excluye DLCs y contenido adicional
    tags_exclude: 'adult,nsfw,hentai,pornographic', // excluye tags +18
  },
})

// Trae una lista de juegos, con búsqueda y filtros opcionales
export const getGames = async (params: {
  search?: string
  genres?: string
  ordering?: string
  platforms?: string
  page?: number
  page_size?: number  // agrégalo aquí
} = {}) => {
  const { data } = await apiClient.get<PaginatedResponse<Game>>('/games', {
    params: {
      page_size: params.page_size ?? 20,
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

// Juegos mejor valorados de todos los tiempos
export const getTopRatedGames = async () => {
  const { data } = await apiClient.get<PaginatedResponse<Game>>('/games', {
    params: {
      ordering: '-metacritic',
      metacritic: '90,100',
      page_size: 8,
    },
  })
  return data.results
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
      page_size: 8,
    },
  })
  return data.results
}

// Juegos aleatorios para recomendaciones
export const getRandomGames = async () => {
  // Página aleatoria entre 1 y 20 para variar los resultados
  const randomPage = Math.floor(Math.random() * 20) + 1
  const { data } = await apiClient.get<PaginatedResponse<Game>>('/games', {
    params: {
      ordering: '-rating',
      page_size: 4,
      page: randomPage,
    },
  })
  return data.results
}

// Trae los screenshots de un juego
export const getGameScreenshots = async (slug: string) => {
  const { data } = await apiClient.get(`/games/${slug}/screenshots`)
  return data.results as { id: number; image: string }[]
}

