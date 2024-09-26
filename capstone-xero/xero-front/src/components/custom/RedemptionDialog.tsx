"use client"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FundData, ShareRedemptionData } from "@/lib/types/program-types";
import { Button } from "../ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import * as anchor from "@coral-xyz/anchor";
import { useStore } from "@/store";
import { formatBNToDate, formatBNToString, formatCurrency, formatNumber, truncatePubkey } from "@/lib/utils";
import { SCALING_FACTOR } from "@/lib/types/consts";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import * as token from "@solana/spl-token";

export default function RedemptionDialog({
    fund,
    fundPubkey
}: {
    fund: FundData,
    fundPubkey: anchor.web3.PublicKey,
}) {

    const { program } = useStore();
    const { sendTransaction, publicKey } = useWallet();
    const { connection } = useConnection();
    const { toast } = useToast();

    const [redemptions, setRedemptions] = useState<anchor.ProgramAccount<ShareRedemptionData>[]>([]);
    const [isProcessingAllLoading, setIsProcessingAllLoading] = useState(false);
    const [vaultUsdcBalance, setVaultUsdcBalance] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const processAll = () => {
        if(program && publicKey) {
            const process = async () => {
                try {
                    setIsProcessingAllLoading(true);

                    
                    const transaction = new anchor.web3.Transaction();
                    for (const redemption of redemptions) {

                        const investor = redemption.account.investor;
                        const [investorRedemptionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
                            [
                                Buffer.from("redemption"),
                                fundPubkey.toBuffer(),
                                investor.toBuffer()
                            ],
                            program.programId
                        );
                        const [sharesMint] = anchor.web3.PublicKey.findProgramAddressSync(
                            [
                                Buffer.from("shares"),
                                fundPubkey.toBuffer()
                            ],
                            program.programId
                        );
                        const redemptionVaultATA = token.getAssociatedTokenAddressSync(
                            sharesMint,
                            fundPubkey,
                            true
                        );
                        const investorStablecoinATA = token.getAssociatedTokenAddressSync(
                            fund.stablecoinMint,
                            investor,
                        );
                        const fundStablecoinVault = token.getAssociatedTokenAddressSync(
                            fund.stablecoinMint,
                            fundPubkey,
                            true
                        );

                        const instruction = await program.methods
                            .processShareRedemption(
                                fund.name
                            )
                            .accountsStrict({
                                investor: investor,
                                manager: publicKey,
                                investmentFund: fundPubkey,
                                shareRedemption: investorRedemptionPDA,
                                sharesMint: sharesMint,
                                redemptionVault: redemptionVaultATA,
                                investorStablecoinAta: investorStablecoinATA,
                                stablecoinMint: fund.stablecoinMint,
                                fundStablecoinVault: fundStablecoinVault,
                                systemProgram: anchor.web3.SystemProgram.programId,
                                tokenProgram: token.TOKEN_PROGRAM_ID,
                                associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID
                            })
                            .instruction();

                        transaction.add(instruction)
                    }

                    const signature = await sendTransaction(transaction, connection);
                    const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      
                    toast ({
                        title: `${redemptions.length} redemptions processed succesfully`,
                        description: (
                            <>
                                Check your transaction{' '}
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    here
                                </a>
                            </>
                        ),
                    });
                } catch(e) {
                    console.error(e);
                    toast({
                        title: "Error",
                        description: "There was an error registering the share redemptions",
                        variant: "destructive"
                    });
                } finally {
                    setIsProcessingAllLoading(false)
                }
            }
            process();
        }
    }

    const getRedemptionsTotalUsdc = (
        redemptions: anchor.ProgramAccount<ShareRedemptionData>[]
    ): number => {
        let total = new anchor.BN(0);
        for (const redemption of redemptions) {
            const redeemValue = redemption.account.shareValue
                .mul(redemption.account.sharesToRedeem)
                .div(SCALING_FACTOR);
            total = total.add(redeemValue);
        }
        return total.toNumber() / SCALING_FACTOR.toNumber();
    }

    const getTotalSharesToRedeem = (
        redemptions: anchor.ProgramAccount<ShareRedemptionData>[]
    ): number => {
        return redemptions.reduce((prev, curr) => {
            return prev + Number(curr.account.sharesToRedeem.div(SCALING_FACTOR))
        }, 0);
    }

    const fetchDetails = async () => {
        if (program) {
            const fundStablecoinVault = token.getAssociatedTokenAddressSync(
                fund.stablecoinMint,
                fundPubkey,
                true
            );
            const [tokenAccount, redemptions] = await Promise.all([
                token.getAccount(connection, fundStablecoinVault),
                program.account.shareRedemption.all([
                    {
                        memcmp: {
                            offset: 41,
                            bytes: fundPubkey.toBase58()
                        }
                    }
                ])
            ]);
            setRedemptions(redemptions);
            const supplyInBN = new anchor.BN(Number(tokenAccount.amount));
            setVaultUsdcBalance(Number(supplyInBN.div(SCALING_FACTOR)));
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            fetchDetails()
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger className="w-full">
                <Button className="w-full">Share Redemptions</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{fund.name} Redemptions</DialogTitle>
                </DialogHeader>
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col gap-2 justify-center items-center">
                        <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                            <Label>Shares to Redeem</Label>
                            <Input 
                                readOnly 
                                value={formatNumber(getTotalSharesToRedeem(redemptions).toString())}
                            />
                        </div>
                        <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                            <Label>Total amount in USDC to redeem</Label>
                            <Input readOnly value={formatCurrency(getRedemptionsTotalUsdc(redemptions).toString())}/>
                        </div>
                        <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                            <Label>Current balance in USDC vault</Label>
                            <Input readOnly value={formatCurrency(vaultUsdcBalance.toString())}/>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Investor</TableHead>
                                <TableHead>Shares to redeem</TableHead>
                                <TableHead>Share Value</TableHead>
                                <TableHead>Amount in USDC</TableHead>
                                <TableHead>Creation date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {redemptions.map(redemption => (
                                <TableRow key={Number(redemption.account.creationDate)}>
                                    <TableCell>{truncatePubkey(redemption.account.investor.toString())}</TableCell>
                                    <TableCell>{formatNumber(formatBNToString(redemption.account.sharesToRedeem.div(SCALING_FACTOR)))}</TableCell>
                                    <TableCell>{formatCurrency(formatBNToString(redemption.account.shareValue.div(SCALING_FACTOR)))}</TableCell>
                                    <TableCell>{formatNumber(formatBNToString((redemption.account.sharesToRedeem.mul(redemption.account.shareValue)).div(SCALING_FACTOR)))}</TableCell>
                                    <TableCell>{formatBNToDate(redemption.account.creationDate)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Separator />
                    <div className="w-full flex flex-col items-center justify-center">
                        {isProcessingAllLoading ?
                            <Button className="w-3/5" disabled>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                Processing
                            </Button>
                        :
                            <Button onClick={() => processAll()} className="w-3/5">Process All Redemptions</Button>
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
