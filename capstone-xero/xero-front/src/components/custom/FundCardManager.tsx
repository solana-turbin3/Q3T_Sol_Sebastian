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
import { formatCurrency, formatNumber, getShareValue, unscaledShareSupply } from "@/lib/utils";

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
    
    useEffect(() => {
        if (program) {            
            const fetchDetails = async () => {
                try {
                    const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
                        [
                            Buffer.from("shares"),
                            fundPubkey.toBuffer()
                        ],
                        program.programId
                    );
                    const supplyInfo = await token.getMint(connection, mint, "confirmed")
                    setSharesSupply(new anchor.BN(Number(supplyInfo.supply)))

                } catch(e) {
                    console.error("Error fetchiing info: ", e);
                }

            }
            fetchDetails();
        }
    }, [program]);

    return (
        <Card className="w-[300px]">
            <CardHeader>
                <CardTitle>{fund.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Total Assets</Label>
                    <Input readOnly placeholder={formatCurrency(fund.assetsAmount.div(SCALING_FACTOR).toString())} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Total Liabilities</Label>
                    <Input readOnly placeholder={formatCurrency(fund.liabilitiesAmount.div(SCALING_FACTOR).toString())} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Share Value</Label>
                    <Input readOnly placeholder={sharesSupply ? formatCurrency(getShareValue(fund.assetsAmount, fund.liabilitiesAmount, sharesSupply)) : "$0"} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Outstanding Shares</Label>
                    <Input readOnly placeholder={sharesSupply ? formatNumber(unscaledShareSupply(sharesSupply)) : "0"} />
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
