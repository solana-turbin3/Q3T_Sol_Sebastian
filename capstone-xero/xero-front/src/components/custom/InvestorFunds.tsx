import { FundData } from "@/lib/types/program-types"
import { BN } from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import FundCardInvestor from "./FundCardInvestor";

const mockFund: FundData = {
    bump: 255,
    assetsAmount: new BN(250000 * 1_000_000),
    liabilitiesAmount: new BN(250000 * 1_000_000),
    sharesMintBump: 255,
    redemptionVault: null,
    manager: web3.Keypair.generate().publicKey,
    stablecoinMint: web3.Keypair.generate().publicKey,
    name: "Sigma AGF"
};

export default function InvestorFunds() {
    const funds = [mockFund, mockFund, mockFund, mockFund];

    return (
        <div className="grid grid-cols-4 gap-4">
            {funds.map(fund => (
                <FundCardInvestor fund={fund} />
            ))}
        </div>
    )
}
