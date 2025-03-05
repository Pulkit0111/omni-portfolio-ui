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
    const {isConnected, address} = useAccount();
    const [avatarBase64, setAvatarBase64] = useState<string>('');
    // const [balances, setBalances] = useState({});
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
            <div className="flex flex-col items-center justify-center w-3/8 h-3/4 rounded-xl">
                <div className="flex flex-row items-center justify-center w-[50%] h-[30%] mb-20">
                    <img src={`data:image/svg+xml;base64,${avatarBase64}`} alt="avatar"/>
                </div>
                <div className="flex flex-row items-center justify-center w-[90%] h-[50%] border-2 border-white rounded-xl">
                    For Tokens
                </div>
            </div>
        </div>
    )
}