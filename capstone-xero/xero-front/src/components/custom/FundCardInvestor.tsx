"use client"
import { FundData } from "@/lib/types/program-types";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import * as anchor from "@coral-xyz/anchor";
import { SCALING_FACTOR } from "@/lib/types/consts";
import { useStore } from "@/store";
import { useConnection, useWallet} from "@solana/wallet-adapter-react";
import * as token from "@solana/spl-token";
import { getShareValue, unscaledShareSupply } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function FundCardInvestor({
    fund,
    fundPubkey
}: {
    fund: FundData,
    fundPubkey: anchor.web3.PublicKey,
}) {

    const { program } = useStore();
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { toast } = useToast();

    const [isRedeemLoading, setIsRedeemLoading] = useState(false);
    const [isBuyingLoading, setIsBuyingLoading] = useState(false);

    const [usdcBuyAmount, setUsdcAmount] = useState(0);
    const [sharesRedeemAmount, setSharesAmount] = useState(0);

    const [sharesSupply, setSharesSupply] = useState<anchor.BN>();
    const [ownedShares, setOwnedShares] = useState<anchor.BN>();

    

    useEffect(() => {
        if (program && publicKey) {
            const fetchDetails = async () => {
                const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("shares"),
                        fundPubkey.toBuffer()
                    ],
                    program.programId
                );

                const supplyInfo = await token.getMint(connection, mint, "confirmed");

                try {
                    const userTokenAccount = await token.getAccount(connection, publicKey);
                    const amountBN = new anchor.BN(Number(userTokenAccount.amount));
                    setOwnedShares(amountBN.div(SCALING_FACTOR));
                } catch {
                    console.error("Error fetching user token account for fund");
                }

                setSharesSupply(new anchor.BN(Number(supplyInfo.supply)))
            }
            fetchDetails();
        }
    }, [program, publicKey]);

    const buyShares = () => {
        if (program && publicKey) {
            const execute = async () => {
                try {
                    setIsBuyingLoading(true);

                    const [sharesMint] = anchor.web3.PublicKey.findProgramAddressSync(
                        [
                            Buffer.from("shares"),
                            fundPubkey.toBuffer()
                        ],
                        program.programId
                    );
                    const investorFundATA = token.getAssociatedTokenAddressSync(
                        sharesMint,
                        publicKey
                    );
                    const investorStablecoinATA = token.getAssociatedTokenAddressSync(
                        fund.stablecoinMint,
                        publicKey,
                    );
                    const fundStablecoinVault = token.getAssociatedTokenAddressSync(
                        fund.stablecoinMint,
                        fundPubkey,
                        true
                    );

                    const instruction = await program.methods
                        .buyShares(
                            fund.name,
                            fund.manager,
                            new anchor.BN(usdcBuyAmount).mul(SCALING_FACTOR)
                        )
                        .accountsStrict({
                            investor: publicKey,
                            sharesMint: sharesMint,
                            investmentFund: fundPubkey,
                            investorFundAta: investorFundATA,
                            investorStablecoinAta: investorStablecoinATA,
                            stablecoinMint: fund.stablecoinMint,
                            fundStablecoinVault: fundStablecoinVault,
                            systemProgram: anchor.web3.SystemProgram.programId,
                            tokenProgram: token.TOKEN_PROGRAM_ID,
                            associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID
                        })
                        .instruction();

                    const transaction = new anchor.web3.Transaction();
                    transaction.add(instruction);
                    const signature = await sendTransaction(transaction, connection);
                    setUsdcAmount(0);
                    const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
                    toast ({
                        title: `Shares bought succesfully`,
                        description: "Check your transaction here: " + link,
                    });
                } catch(e) {
                    console.error("Error buying shares: ", e);
                    toast({
                        title: "Error",
                        description: "There was an error buying shares",
                        variant: "destructive"
                    });
                } finally {
                    setIsBuyingLoading(false);
                }
            };
            execute()
        }
    };

    const redeemShares = () => {
        if (program && publicKey) {
            const execute = async () => {
                try {
                    setIsRedeemLoading(true);
                    const instruction = await program.methods
                        .redeemShares(
                            fund.name,
                            fund.manager,
                            new anchor.BN(sharesRedeemAmount).mul(SCALING_FACTOR)
                        )
                        .accounts({
                            investor: publicKey
                        })
                        .instruction();

                    const transaction = new anchor.web3.Transaction();
                    transaction.add(instruction);

                    const signature = await sendTransaction(transaction, connection);
                    const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
                    setSharesAmount(0);
                    toast ({
                        title: `Shares redeemed succesfully`,
                        description: "Check your transaction here: " + link,
                    });
                } catch(e) {
                    console.error("Error redeeming shares: ", e);
                    toast({
                        title: "Error",
                        description: "There was an error redeeming shares",
                        variant: "destructive"
                    });
                } finally {
                    setIsRedeemLoading(false)
                }
            };
            execute()
        }
    }

    return (
        <Card className="w-[250px]">
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
            </CardContent>
            <CardFooter className="w-full flex justify-center items-center">
                <Dialog>
                    <DialogTrigger className="w-full">
                        <Button className="w-full">See details</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{fund.name} details</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Total Assets</Label>
                                <Input readOnly placeholder={fund.assetsAmount.div(SCALING_FACTOR).toString()} />
                                </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Total Liabilities</Label>
                                <Input readOnly placeholder={fund.liabilitiesAmount.div(SCALING_FACTOR).toString()} />
                                </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Share Value</Label>
                                <Input readOnly placeholder={sharesSupply ? getShareValue(fund.assetsAmount, fund.liabilitiesAmount, sharesSupply) : "0"} />
                                </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Outstanding Shares</Label>
                                <Input readOnly placeholder={sharesSupply ? unscaledShareSupply(sharesSupply) : "0"} />
                            </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Shares owned</Label>
                                <Input readOnly placeholder={ ownedShares ? ownedShares.toString() : "0"} />
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-center gap-3">
                            <Popover>
                                <PopoverTrigger className="w-1/3">
                                    <Button className="w-full">Redeem Shares</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="flex flex-col gap-3 justify-center ">
                                        <p>Redeem Shares</p>
                                        <div className="grid max-w-sm items-center gap-1.5">
                                            <Label>Shares to redeem</Label>
                                            <Input 
                                                placeholder={"shares"}
                                                type="number" 
                                                onChange={(e) => setSharesAmount(Number(e.target.value))}
                                                value={sharesRedeemAmount}
                                                disabled={isRedeemLoading}
                                            />
                                        </div>
                                        <div className="grid max-w-sm items-center gap-1.5">
                                            {isRedeemLoading ? 
                                                <Button disabled>
                                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                    Redeeming shares
                                                </Button>
                                            : 
                                                <Button onClick={() => redeemShares()}>Redeem</Button>
                                            }
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger className="w-1/3">
                                    <Button className="w-full">Buy Shares</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="flex flex-col gap-3 justify-center ">
                                        <p>Buy Shares</p>
                                        <div className="grid max-w-sm items-center gap-1.5">
                                            <Label>Amount to invest</Label>
                                            <Input 
                                                placeholder={"amount in USDC"} 
                                                type="number" 
                                                onChange={(e) => setUsdcAmount(Number(e.target.value))}
                                                value={usdcBuyAmount}
                                                disabled={isBuyingLoading}
                                            />
                                        </div>
                                        <div className="grid max-w-sm items-center gap-1.5">
                                            {isBuyingLoading ? 
                                                <Button disabled>
                                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                    Buying shares
                                                </Button>
                                            : 
                                                <Button onClick={() => buyShares()}>Invest</Button>
                                            }
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                    </DialogContent>
                </Dialog>
                
            </CardFooter>
        </Card>   
    )
}
