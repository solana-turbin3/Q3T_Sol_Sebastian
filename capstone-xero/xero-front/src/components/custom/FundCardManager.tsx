"use client"
import { FundData } from "@/lib/types/program-types"
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LiabilityDialog from "./LiabilityDialog";
import InvestmentsDialog from "./InvestmentsDialog";
import RedemptionDialog from "./RedemptionDialog";
import { SCALING_FACTOR } from "@/lib/types/consts";
import * as anchor from "@coral-xyz/anchor";
import { useStore } from "@/store";
import { useEffect, useState } from "react";
import * as token from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";

export default function FundCardManager({
    fund,
    fundPubkey
}: {
    fund: FundData,
    fundPubkey: anchor.web3.PublicKey,
}) {

    const { program } = useStore();
    const { connection } = useConnection();

    const [sharesSupply, setSharesSupply] = useState<anchor.BN>();
    const [investmentsCount, setInvestmentsCount] = useState(0);
    
    useEffect(() => {
        if (program) {            
            const fetchDetails = async () => {
                const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("shares"),
                        fundPubkey.toBuffer()
                    ],
                    program.programId
                );

                const [investments, supplyInfo] = await Promise.all([
                    program.account.investment.all(),
                    token.getMint(connection, mint, "confirmed")
                ])

                setInvestmentsCount(investments.length);
                setSharesSupply(new anchor.BN(Number(supplyInfo.supply)))
            }
            fetchDetails();
        }
    }, [program]);

    const unscaledShareSupply = (scaledSupply: anchor.BN): string => {
        return scaledSupply.div(SCALING_FACTOR).toString();
    }

    const getShareValue = (
        assets: anchor.BN, 
        liabilities: anchor.BN, 
        supply: anchor.BN
    ) : string => {
        const numerator = (assets.add(liabilities)).mul(SCALING_FACTOR);

        return numerator.div(supply).toString();
    }

    return (
        <Card className="w-[300px]">
            <CardHeader>
                <CardTitle>{fund.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Total Assets</Label>
                    <Input readOnly placeholder={fund.assetsAmount.div(SCALING_FACTOR).toString()} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Total Liabilities</Label>
                    <Input readOnly placeholder={fund.liabilitiesAmount.div(SCALING_FACTOR).toString()} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Share Value</Label>
                    <Input readOnly placeholder={sharesSupply ? getShareValue(fund.assetsAmount, fund.liabilitiesAmount, sharesSupply) : "0"} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Outstanding Shares</Label>
                    <Input readOnly placeholder={sharesSupply ? unscaledShareSupply(sharesSupply) : "0"} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Active Investments</Label>
                    <Input readOnly placeholder={investmentsCount.toString()} />
                </div>
            </CardContent>
            <CardFooter className="w-full flex flex-col justify-center items-center gap-2">
                <LiabilityDialog fund={fund} fundPubkey={fundPubkey} />
                <InvestmentsDialog fund={fund} fundPubkey={fundPubkey} />
                <RedemptionDialog  fund={fund} fundPubkey={fundPubkey} />
            </CardFooter>
        </Card>
    )
}
