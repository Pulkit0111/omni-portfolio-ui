'use client'
import { useAccount } from "wagmi";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import axios from 'axios';
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
        <div>
            <div>
                <ConnectButton showBalance={false}/>
            </div>
        </div>
    )
}