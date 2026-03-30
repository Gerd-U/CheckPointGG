import { motion } from 'framer-motion'

interface FadeInProps {
  children: React.ReactNode
  delay?: number      // retraso en segundos
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
}

// Componente genérico que anima cualquier cosa que envuelva
const FadeIn = ({ children, delay = 0, direction = 'up', className }: FadeInProps) => {

  // Calcula el punto de inicio según la dirección
  const directionOffset = {
    up:    { y: 24, x: 0 },
    down:  { y: -24, x: 0 },
    left:  { y: 0, x: 24 },
    right: { y: 0, x: -24 },
    none:  { y: 0, x: 0 },
  }

  const { x, y } = directionOffset[direction]

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}

export default FadeIn