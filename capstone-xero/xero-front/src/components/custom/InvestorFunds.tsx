import { FundData } from "@/lib/types/program-types"
import * as anchor from "@coral-xyz/anchor";
import FundCardInvestor from "./FundCardInvestor";
import { useEffect, useState } from "react";
import { useStore } from "@/store";

export default function InvestorFunds() {
    const [funds, setFunds] = useState<anchor.ProgramAccount<FundData>[]>([]);

    const { program } = useStore();

    useEffect(() => {
        if (program) {
            const fetchFunds = async () => {
                try {
                    const allFunds = await program.account.investmentFund.all();
                    setFunds(allFunds);
                } catch(e) {
                    console.error("Error fetching funds: ", e);
                }
            };
            fetchFunds();
        }
    }, [program])

    return (
        <div className="grid grid-cols-4 gap-4">
            {funds.map(fund => (
                <FundCardInvestor key={fund.account.name} fund={fund.account} fundPubkey={fund.publicKey} />
            ))}
        </div>
    )
}
