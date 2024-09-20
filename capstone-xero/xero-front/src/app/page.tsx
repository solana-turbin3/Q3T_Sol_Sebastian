"use client"
import Footer from "@/components/custom/Footer";
import InvestorFunds from "@/components/custom/InvestorFunds";
import ManagerFunds from "@/components/custom/ManagerFunds";
import Navbar from "@/components/custom/Navbar";
import { UserRole } from "@/lib/types/user-role";
import { useEffect, useState } from "react";
import { 
    useWallet, 
    useAnchorWallet, 
    useConnection 
} from "@solana/wallet-adapter-react";
import { IDL, Xero } from "@/lib/solana-program/idl";
import * as anchor from "@coral-xyz/anchor"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert";
import { useStore } from "@/store";

export default function Home() {

    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const { setProgram } = useStore();

    const [userRole, setUserRole] = useState<UserRole>(UserRole.Investor);

    useEffect(() => {
        if (anchorWallet) {
            let provider: anchor.Provider;
            try {
                provider = anchor.getProvider();
            } catch {
                provider = new anchor.AnchorProvider(connection, anchorWallet, {
                    commitment: "confirmed"
                });

                anchor.setProvider(provider);
            }

            const program = new anchor.Program(IDL as Xero);
            setProgram(program);
            console.log("program is configured")
        }
    }, [anchorWallet, connection]);

    return (
        <div className="flex flex-col justify-between w-full min-h-screen items-center">
            <Navbar setUserRole={setUserRole} userRole={userRole}/>
                {publicKey ? (
                    <div>
                        {userRole === UserRole.Investor && (
                            <InvestorFunds />
                        )}
                        {userRole === UserRole.Manager && (
                            <ManagerFunds />
                        )}
                    </div>
                ) : (
                    <div>
                        <Alert variant="destructive" className="flex items-center justify-center">
                            <div className="flex items-center justify-center">
                                <ExclamationTriangleIcon className="mr-2" />
                                <AlertTitle>Please connect your wallet</AlertTitle>
                            </div>
                        </Alert>
                    </div>
                )}
            <Footer />
        </div>
    );
}
