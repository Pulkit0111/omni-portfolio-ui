'use client'
import { useEffect, useState } from 'react'

interface StarProps {
  count?: number
  minSize?: number
  maxSize?: number
  minOpacity?: number
  maxOpacity?: number
  minTwinkleSpeed?: number
  maxTwinkleSpeed?: number
}

export default function Stars({
  count = 350,
  minSize = 0.5,
  maxSize = 3.5,
  minOpacity = 0.3,
  maxOpacity = 0.8,
  minTwinkleSpeed = 2000,
  maxTwinkleSpeed = 5000
}: StarProps) {
  const [stars, setStars] = useState<{
    x: number
    y: number
    size: number
    opacity: number
    twinkleSpeed: number
    twinkleOffset: number
  }[]>([])

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random() * (maxOpacity - minOpacity) + minOpacity,
        twinkleSpeed: Math.random() * (maxTwinkleSpeed - minTwinkleSpeed) + minTwinkleSpeed,
        twinkleOffset: Math.random() * Math.PI * 2
      }))
      setStars(newStars)
    }

    generateStars()
  }, [count, minSize, maxSize, minOpacity, maxOpacity, minTwinkleSpeed, maxTwinkleSpeed])

  useEffect(() => {
    let animationFrameId: number

    const animate = (currentTime: number) => {
      setStars(currentStars =>
        currentStars.map(star => ({
          ...star,
          opacity: star.opacity + (
            Math.sin((currentTime / star.twinkleSpeed + star.twinkleOffset)) * 0.2
          )
        }))
      )

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <>
      {stars.map((star, index) => (
        <div
          key={`star-${index}`}
          className="absolute bg-white rounded-full transition-opacity duration-[3000ms] ease-in-out"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity * 0.5})`
          }}
        />
      ))}
    </>
  )
}
