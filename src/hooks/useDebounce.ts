import { useState, useEffect } from 'react'

// Retrasa la actualización de un valor hasta que el usuario
// deje de escribir por 'delay' milisegundos
const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Inicia un timer cada vez que cambia el valor
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Si el valor cambia antes de que termine el timer, lo cancela
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce