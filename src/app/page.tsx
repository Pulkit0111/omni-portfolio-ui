'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
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
    <div className='flex flex-col items-center justify-center h-screen'>
      <ConnectButton />
    </div>
  )
}
