'use client'
import { WagmiProvider, createConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { polygon, mainnet, arbitrum } from 'viem/chains'
const config = getDefaultConfig({
  appName: 'Omni Wallet',
  projectId: 'YOUR_PROJECT_ID',
  chains: [polygon, mainnet, arbitrum],
})

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize='compact' theme={darkTheme({
          accentColor: '#3B5DFF',
          accentColorForeground: 'black',
          borderRadius: 'none',
          fontStack: 'system'
        })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 