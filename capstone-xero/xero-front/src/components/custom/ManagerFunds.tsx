import { FundData } from "@/lib/types/program-types";
import { ProgramAccount } from "@coral-xyz/anchor";
import FundCardManager from "./FundCardManager";
import CreateFundDialog from "./CreateFundDialog";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ManagerFunds() {

    const [funds, setFunds] = useState<ProgramAccount<FundData>[]>([]);

    const { program } = useStore();
    const { publicKey } = useWallet();

    useEffect(() => {
        if(program && publicKey) {
            const fetchFunds = async () => {
                try {
                    const allFunds = await program.account.investmentFund.all();
                    const filteredFunds = allFunds.filter(fund => fund.account.manager.toString() === publicKey.toString());
                    setFunds(filteredFunds);
                } catch(e) {
                    console.error("Error fetching funds: ", e);
                }
            };
            fetchFunds();
        }
    }, [program, publicKey])

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <CreateFundDialog />
            <div className="grid grid-cols-3 gap-4">
                {funds.map(fund => (
                    <FundCardManager key={fund.account.name} fund={fund.account} fundPubkey={fund.publicKey}/>
                ))}
            </div>
        </div>
    )
}
