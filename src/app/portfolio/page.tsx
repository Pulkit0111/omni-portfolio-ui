'use client'
import { useAccount } from "wagmi";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
import Stars from '@/components/Stars';
export default function Portfolio() {
    const router = useRouter();
    const {isConnected, address} = useAccount();

    useEffect(()=>{
        if(!isConnected){
            router.push('/')
        }
        getPortfolio()
    }, [isConnected, router])

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
            <div className="fixed top-4 right-4 z-20">
                <ConnectButton showBalance={false}/>
            </div>
        </div>
    )
}