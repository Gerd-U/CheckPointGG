import { useEffect, useState } from 'react'
import { getGenres } from '../services/rawgApi'

const orderingOptions = [
  { label: 'Relevancia', value: '' },
  { label: 'Mejor rating', value: '-rating' },
  { label: 'Mejor Metacritic', value: '-metacritic' },
  { label: 'Más recientes', value: '-released' },
  { label: 'Nombre A-Z', value: 'name' },
]

const platformOptions = [
  { label: 'Todas', value: '' },
  { label: 'PC', value: '4' },
  { label: 'PlayStation 5', value: '187' },
  { label: 'PlayStation 4', value: '18' },
  { label: 'Xbox Series X', value: '186' },
  { label: 'Xbox One', value: '1' },
  { label: 'Nintendo Switch', value: '7' },
]

// Genera rangos de fechas dinámicamente
const getDateRange = (option: string): string => {
  const today = new Date()
  const format = (d: Date) => d.toISOString().split('T')[0]

  if (option === 'upcoming') {
    const nextYear = new Date(today)
    nextYear.setFullYear(today.getFullYear() + 1)
    return `${format(today)},${format(nextYear)}`
  }
  if (option === 'thisyear') {
    const startOfYear = new Date(today.getFullYear(), 0, 1)
    const endOfYear = new Date(today.getFullYear(), 11, 31)
    return `${format(startOfYear)},${format(endOfYear)}`
  }
  if (option === 'recent') {
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)
    return `${format(thirtyDaysAgo)},${format(today)}`
  }
  return ''
}

const dateOptions = [
  { label: 'Todas las fechas', value: '' },
  { label: 'Próximos lanzamientos', value: 'upcoming' },
  { label: 'Este año', value: 'thisyear' },
  { label: 'Últimos 30 días', value: 'recent' },
]

export interface Filters {
  genres: string
  ordering: string
  platforms: string
  dates: string     // rango de fechas para la API
  dateOption: string // opción seleccionada en el select
}

interface SearchFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

const selectStyle = {
  backgroundColor: '#0f1629',
  border: '1px solid rgba(0,212,255,0.15)',
  color: 'white',
}

const SearchFilters = ({ filters, onChange }: SearchFiltersProps) => {
  const [genres, setGenres] = useState<{ id: number; name: string; slug: string }[]>([])

  useEffect(() => {
    getGenres().then(setGenres)
  }, [])

  const handleChange = (key: keyof Filters, value: string) => {
    // Si cambia la fecha calculamos el rango real para la API
    if (key === 'dateOption') {
      onChange({
        ...filters,
        dateOption: value,
        dates: getDateRange(value),
      })
      return
    }
    onChange({ ...filters, [key]: value })
  }

  return (
    <div
      className="rounded-2xl p-5 space-y-5"
      style={{
        backgroundColor: '#0a0f1e',
        border: '1px solid rgba(0,212,255,0.1)',
      }}
    >
      {/* Título */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#00d4ff' }} />
        <h3 className="text-white font-bold">Filtros</h3>
      </div>

      {/* Fecha */}
      <div className="space-y-2">
        <p className="text-gray-500 text-xs uppercase tracking-wider">Período</p>
        <select
          value={filters.dateOption}
          onChange={(e) => handleChange('dateOption', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl focus:outline-none text-sm"
          style={selectStyle}
        >
          {dateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Género */}
      <div className="space-y-2">
        <p className="text-gray-500 text-xs uppercase tracking-wider">Género</p>
        <select
          value={filters.genres}
          onChange={(e) => handleChange('genres', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl focus:outline-none text-sm"
          style={selectStyle}
        >
          <option value="">Todos los géneros</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.slug}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ordenamiento */}
      <div className="space-y-2">
        <p className="text-gray-500 text-xs uppercase tracking-wider">Ordenar por</p>
        <select
          value={filters.ordering}
          onChange={(e) => handleChange('ordering', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl focus:outline-none text-sm"
          style={selectStyle}
        >
          {orderingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Plataforma */}
      <div className="space-y-2">
        <p className="text-gray-500 text-xs uppercase tracking-wider">Plataforma</p>
        <select
          value={filters.platforms}
          onChange={(e) => handleChange('platforms', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl focus:outline-none text-sm"
          style={selectStyle}
        >
          {platformOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Limpiar filtros */}
      <button
        onClick={() => onChange({ genres: '', ordering: '', platforms: '', dates: '', dateOption: '' })}
        className="w-full py-2 rounded-xl text-sm transition-all hover:opacity-80"
        style={{
          backgroundColor: 'rgba(0,212,255,0.08)',
          border: '1px solid rgba(0,212,255,0.15)',
          color: '#00d4ff',
        }}
      >
        Limpiar filtros
      </button>
    </div>
  )
}

export default SearchFilters