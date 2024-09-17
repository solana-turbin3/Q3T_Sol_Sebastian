"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { FC, ReactNode, useMemo } from "react"
import { clusterApiUrl } from "@solana/web3.js"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");


const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    let endpoint = process.env.NEXT_PUBLIC_HELIUS_URL;

    if (!endpoint) {
        endpoint = clusterApiUrl("devnet")
    }
    const wallets = useMemo(() => [], []);
  
    return (
        <ConnectionProvider endpoint={endpoint} config={{commitment: "confirmed"}}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
  
export default WalletContextProvider;
