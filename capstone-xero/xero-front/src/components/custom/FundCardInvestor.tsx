"use client"
import { FundData, ShareRedemptionData } from "@/lib/types/program-types";
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
import { formatBNToDate, formatCurrency, formatNumber, getShareValue, unscaledShareSupply } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function FundCardInvestor({
    fund,
    fundPubkey,
    fetchFunds
}: {
    fund: FundData,
    fundPubkey: anchor.web3.PublicKey,
    fetchFunds: Function
}) {

    const { program } = useStore();
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { toast } = useToast();

    const [userRedemption, setUserRedemption] = useState<ShareRedemptionData>();

    const [isRedeemLoading, setIsRedeemLoading] = useState(false);
    const [isBuyingLoading, setIsBuyingLoading] = useState(false);
    const [isCancelingLoading, setIsCancelingLoading] = useState(false)

    const [usdcBuyAmount, setUsdcAmount] = useState(0);
    const [sharesRedeemAmount, setSharesAmount] = useState(0);

    const [sharesSupply, setSharesSupply] = useState<anchor.BN>();
    const [ownedShares, setOwnedShares] = useState<anchor.BN>();

    const [isBuyPopoverOpen, setIsBuyPopoverOpen] = useState(false);
    const [isRedeemPopoverOpen, setIsRedeemPopoverOpen] = useState(false);

    const handleBuyOpenChange = (open: boolean) => {
        setIsBuyPopoverOpen(open)
    };

    const handleRedeemOpenChange = (open: boolean) => {
        if (open) {
            fetchRedemptions()
        }
        setIsRedeemPopoverOpen(open)
    };

    const fetchRedemptions = async () => {
        if (program && publicKey) {
            const [userRedemptionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
                [
                    Buffer.from("redemption"),
                    fundPubkey.toBuffer(),
                    publicKey.toBuffer()
                ],
                program.programId
            );
            const userRedemption = await program.account.shareRedemption.fetchNullable(userRedemptionPDA);
            if (!userRedemption) {
                setUserRedemption(undefined)
            } else {
                setUserRedemption(userRedemption)
            }
        }
    }

    const fetchDetails = async () => {
        const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from("shares"),
                fundPubkey.toBuffer()
            ],
            program!.programId
        );

        const supplyInfo = await token.getMint(connection, mint, "confirmed");
        try {
            const userAta = token.getAssociatedTokenAddressSync(mint, publicKey!);
            const userTokenAccount = await token.getAccount(connection, userAta);
            const amountBN = new anchor.BN(Number(userTokenAccount.amount));
            setOwnedShares(amountBN.div(SCALING_FACTOR));
        } catch {
            console.error("Error fetching user token account for fund");
        }

        setSharesSupply(new anchor.BN(Number(supplyInfo.supply)))
    }

    useEffect(() => {
        if (program && publicKey) {
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
                    await Promise.all([
                        fetchFunds(),
                        fetchDetails()
                    ]);
                    setUsdcAmount(0);
                    handleBuyOpenChange(false)
                    const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
                    toast ({
                        title: `Shares bought succesfully`,
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
                    await Promise.all([
                        fetchFunds(),
                        fetchDetails()
                    ]);
                    const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
                    setSharesAmount(0);
                    handleRedeemOpenChange(false);
                    toast ({
                        title: `Shares redeemed succesfully`,
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
    };

    const cancelRedemption = () => {
        if (program && publicKey) {
            const execute = async () => {
                try {
                    setIsCancelingLoading(true);
                    const instruction = await program.methods
                        .cancelRedeemShares(
                            fund.name,
                            fund.manager,
                        )
                        .accounts({
                            investor: publicKey
                        })
                        .instruction();
    
                    const transaction = new anchor.web3.Transaction();
                    transaction.add(instruction);
                    const signature = await sendTransaction(transaction, connection);
                    await Promise.all([
                        fetchFunds(),
                        fetchDetails()
                    ]);
                    handleRedeemOpenChange(false);
                    const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
                    toast ({
                        title: `Shares bought succesfully`,
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
                    console.error("Error redeeming shares: ", e);
                    toast({
                        title: "Error",
                        description: "There was an error canceling share redemption",
                        variant: "destructive"
                    });
                } finally {
                    setIsCancelingLoading(false)
                }
            }
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
                    <Input readOnly placeholder={formatCurrency(fund.assetsAmount.div(SCALING_FACTOR).toString())} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Total Liabilities</Label>
                    <Input readOnly placeholder={formatCurrency(fund.liabilitiesAmount.div(SCALING_FACTOR).toString())} />
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
                                <Input readOnly placeholder={formatCurrency(fund.assetsAmount.div(SCALING_FACTOR).toString())} />
                                </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Total Liabilities</Label>
                                <Input readOnly placeholder={formatCurrency(fund.liabilitiesAmount.div(SCALING_FACTOR).toString())} />
                                </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Share Value</Label>
                                <Input readOnly placeholder={sharesSupply ? formatCurrency(getShareValue(fund.assetsAmount, fund.liabilitiesAmount, sharesSupply)) : "0"} />
                                </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Outstanding Shares</Label>
                                <Input readOnly placeholder={sharesSupply ? formatNumber(unscaledShareSupply(sharesSupply)) : "0"} />
                            </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Shares owned</Label>
                                <Input readOnly placeholder={ ownedShares ? formatNumber(ownedShares.toString()) : "0"} />
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-center gap-3">
                            <Popover open={isRedeemPopoverOpen} onOpenChange={handleRedeemOpenChange}>
                                <PopoverTrigger className="w-1/3">
                                    <Button disabled={!ownedShares || ownedShares.isZero()} className="w-full">Redeem Shares</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    {userRedemption ? (
                                        <div className="flex flex-col gap-3 justify-center ">
                                            <p>Redemption in Progress</p>
                                            <div className="grid max-w-sm items-center gap-1.5">
                                                <Label>Shares</Label>
                                                <Input 
                                                    value={formatNumber(userRedemption.sharesToRedeem.div(SCALING_FACTOR).toString())}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="grid max-w-sm items-center gap-1.5">
                                                <Label>Creation date</Label>
                                                <Input 
                                                    value={formatBNToDate(userRedemption.creationDate)}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="grid max-w-sm items-center gap-1.5">
                                                {isCancelingLoading ? 
                                                    <Button disabled>
                                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                        Canceling
                                                    </Button>
                                                : 
                                                    <Button onClick={() => cancelRedemption()}>Cancel</Button>
                                                }
                                            </div>
                                        </div>
                                    ) : (
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
                                    )}
                                </PopoverContent>
                            </Popover>
                            <Popover open={isBuyPopoverOpen} onOpenChange={handleBuyOpenChange}>
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
