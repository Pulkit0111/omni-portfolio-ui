'use client'
import { useAccount } from "wagmi";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
import Stars from '@/components/Stars';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';
import { BounceLoader } from "react-spinners";
import TokenStrip from '@/components/TokenStrip';

export default function Portfolio() {
    const router = useRouter();
    const {isConnected, address, chain} = useAccount();
    const [avatarBase64, setAvatarBase64] = useState<string>('');
    const [data, setData] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let selectedChain = chain?.name.toLowerCase();

    useEffect(() => {
        const checkConnection = () => {
            if (!isConnected) {
                router.replace('/');
            }
        };

        checkConnection();
        
        window.ethereum?.on('accountsChanged', checkConnection);
        
        return () => {
            window.ethereum?.removeListener('accountsChanged', checkConnection);
        };
    }, [isConnected, router]);

    useEffect(() => {
        if (address) {
            const avatar = createAvatar(micah, {
                seed: address,
                size: 200
            });
            const avatarSvg = avatar.toString();
            const base64Avatar = Buffer.from(avatarSvg).toString('base64');
            setAvatarBase64(base64Avatar);
        }
    }, [address]);

    useEffect(() => {
        if (address) {
            getPortfolio();
        }
    }, [address]);

    if (!isConnected) {
        return null;
    }

    async function getPortfolio(){
        try{
            setIsLoading(true);
            const response = await axios.get(`https://omnichain-portfolio.onrender.com/api/portfolio/${address}`)
            setData(response.data)
            setIsLoading(false);
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-black z-10">
            <Stars />
            <div className="fixed top-6 right-6 z-20">
                <ConnectButton showBalance={false}/>
            </div>
            <div className="flex flex-col items-center justify-center w-[80%] h-[80%] rounded-xl">
                <div className="flex flex-row items-center justify-center w-[50%] h-[30%] mb-5">
                    <img src={`data:image/svg+xml;base64,${avatarBase64}`} alt="avatar"/>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-[80%] pl-10 pr-10">
                    <>
                        {isLoading ? (
                            <div>
                                <BounceLoader
                                    color="#3B5DFF"
                                    loading={isLoading}
                                    size={100}
                                />
                            </div>
                        ) : !selectedChain || !Object.keys(data?.balances || {}).includes(selectedChain) ? (
                            <div className="flex flex-col items-center justify-center gap-6 p-8 bg-red-500 rounded-xl border border-gray-700 text-black">
                                <svg className="w-30 h-30" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
                                </svg>
                                <p className="text-black text-3xl font-bold mb-2">No Data Found</p>
                                <p className="text-black text-lg text-center">We couldn't find any data for <span className="font-bold">{selectedChain}</span>. Please check back later or try another chain.</p>
                            </div>
                        ) : (
                            <>
                                <TokenStrip
                                    logo={data.balances[selectedChain].native.logoUrl}
                                    name={selectedChain}
                                    symbol={data.balances[selectedChain].native.symbol}
                                    balance={Number(data.balances[selectedChain].native.balance).toFixed(2)}
                                    usdValue={Number(data.balances[selectedChain].native.valueInUSD).toFixed(2)}
                                />
                                {data.balances[selectedChain].erc20Tokens.map((token: any) => (
                                    <TokenStrip
                                        key={token.symbol}
                                        logo={token.logoUrl}
                                        name={token.name || token.symbol}
                                        symbol={token.symbol}
                                        balance={Number(token.balance).toFixed(2)}
                                        usdValue={Number(token.valueInUSD).toFixed(2)}
                                    />
                                ))}
                            </>
                        )}
                    </>
                </div>
            </div>
            
        </div>
    )
}