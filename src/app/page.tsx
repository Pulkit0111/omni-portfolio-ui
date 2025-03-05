'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const [stars, setStars] = useState<{x: number, y: number, size: number, opacity: number, twinkleSpeed: number, twinkleOffset: number}[]>([])

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({length: 350}, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 3000 + 2000,
        twinkleOffset: Math.random() * Math.PI * 2
      }))
      setStars(newStars)
    }

    generateStars()
  }, [])

  useEffect(() => {
    if (isConnected) {
      router.push('/portfolio')
    }
  }, [isConnected, router])

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
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-black">
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
      <div className='flex flex-row items-center justify-center gap-4 animate-bounce z-10'>
        <ConnectButton/>
      </div>
    </div>
  )
}
