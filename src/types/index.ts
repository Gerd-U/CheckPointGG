// Plataforma donde está disponible el juego (PS5, Xbox, PC, etc)
export interface Platform {
  platform: {
    id: number
    name: string
    slug: string
  }
}

// Género del juego (Action, RPG, etc)
export interface Genre {
  id: number
  name: string
  slug: string
}

// Objeto principal de un juego
export interface Game {
  id: number
  slug: string
  name: string
  released: string
  background_image: string
  rating: number        // rating de 0 a 5
  ratings_count: number // cuánta gente votó
  metacritic: number | null // puede no tener score
  playtime: number
  platforms: Platform[]
  genres: Genre[]
  description_raw?: string // solo viene en el detalle del juego
}

// Respuesta paginada de la API (siempre viene así)
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}