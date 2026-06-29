'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  duration?: number
  formatter: (n: number) => string
  className?: string
}

export function AnimatedNumber({ value, duration = 600, formatter, className }: Props) {
  const [display, setDisplay] = useState(value)
  const startRef = useRef(value)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const targetRef = useRef(value)

  useEffect(() => {
    const prev = display
    targetRef.current = value
    startRef.current = prev
    startTimeRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(startRef.current + (targetRef.current - startRef.current) * eased)
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, duration])

  return <span className={className}>{formatter(display)}</span>
}
