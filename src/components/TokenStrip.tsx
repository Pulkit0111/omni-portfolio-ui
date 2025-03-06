interface TokenStripProps {
    logo: string;
    name: string;
    symbol: string;
    balance: string;
    usdValue: string;
}

export default function TokenStrip({ logo, name, symbol, balance, usdValue }: TokenStripProps) {
    return (
        <div className="w-[70%] mx-auto bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-4 mb-4 hover:border-blue-500 transition-all duration-300">
            <div className="grid grid-cols-3 items-center">
                {/* Token Logo */}
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                        <img 
                            src={logo} 
                            alt={`${name} logo`}
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/fallback-token.png'
                            }}
                        />
                    </div>
                    <span className="text-white font-medium">
                        {symbol}
                    </span>
                </div>

                {/* Balance */}
                <div className="text-center">
                    <span className="text-white text-xl font-bold">{balance}</span>
                </div>

                {/* USD Value */}
                <div className="text-right">
                    <span className="text-gray-300 text-xl font-bold">${usdValue}</span>
                </div>
            </div>
        </div>
    );
}
