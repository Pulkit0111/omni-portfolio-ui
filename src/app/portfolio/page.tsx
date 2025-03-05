'use client'
import { useAccount } from "wagmi";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
import Stars from '@/components/Stars';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';


export default function Portfolio() {
    const router = useRouter();
    const {isConnected, address, chain} = useAccount();
    const [avatarBase64, setAvatarBase64] = useState<string>('');
    const [data, setData] = useState<any>({});

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
            const response = await axios.get(`http://localhost:8080/api/portfolio/${address}`)
            console.log(response.data)
            setData(response.data)
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
                        {Object.keys(data?.balances || {}).includes(selectedChain || '') ? (
                            <>
                                <div className="flex flex-row items-center justify-around w-[80%] h-[20%] border-2 border-white mt-2.5 mb-2.5 rounded-lg">
                                    <p>{data.balances[selectedChain!].native.symbol}</p>
                                    <p>{Number(data.balances[selectedChain!].native.balance).toFixed(2)} {data.balances[selectedChain!].native.symbol}</p>
                                    <p>${Number(data.balances[selectedChain!].native.valueInUSD).toFixed(2)}</p>
                                </div>
                            </>
                        ):(
                            <>
                            </>
                        )}
                        {Object.keys(data?.balances || {}).includes(selectedChain || '') ? (
                            <>
                                {data.balances[selectedChain!].erc20Tokens.map((token: any) => (
                                    <div className="flex flex-row items-center justify-around w-[80%] h-[20%] border-2 border-white mt-2.5 mb-2.5 rounded-lg">
                                        <p>{token.symbol}</p>
                                        <p>{Number(token.balance).toFixed(2)} {token.symbol}</p>
                                        <p>${Number(token.valueInUSD).toFixed(2)}</p>
                                    </div>
                                ))}
                            </>
                            ) : (
                            <>
                                <div className="flex flex-row items-center justify-around w-[80%] h-[20%] border-2 border-white mt-2.5 mb-2.5 rounded-lg">
                                    <p>No Data for {selectedChain}</p>
                                </div>
                            </>
                        )}
                    </>
                </div>
            </div>
            
        </div>
    )
}