'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import Stars from '@/components/Stars'
import { useEffect } from 'react'
export default function Home() {
  const router = useRouter()
  const { isConnected } = useAccount()

  useEffect(() => {
    if (isConnected) {
      router.push('/portfolio')
    }
  }, [isConnected, router])

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-black">
      <Stars />
      <div className='flex flex-row items-center justify-center gap-4 animate-bounce z-10'>
        <ConnectButton/>
      </div>
    </div>
  )
}