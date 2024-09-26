"use client"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FundData } from "@/lib/types/program-types";
import { useStore } from "@/store";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import * as token from "@solana/spl-token";
import { SCALING_FACTOR } from "@/lib/types/consts";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function VaultManagement({
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
    
    const [vaultUsdcBalance, setVaultUsdcBalance] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
    const [isDepositLoading, setIsDepositLoading] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState(0);
    const [depositAmount, setDepositAmount] = useState(0);

    const [isWithdrawPopoverOpen, setIsWithdrawPopoverOpen] = useState(false);
    const [isDepositPopoverOpen, setIsDepositPopoverOpen] = useState(false);

    const fetchDetails = async () => {
        if (program) {
            const fundStablecoinVault = token.getAssociatedTokenAddressSync(
                fund.stablecoinMint,
                fundPubkey,
                true
            );
            const tokenAccount= await token.getAccount(connection, fundStablecoinVault, "confirmed");
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

    const handleWithdrawOpenChange = (open: boolean) => {
        setIsWithdrawPopoverOpen(open)
    }

    const handleDepositOpenChange = (open: boolean) => {
        setIsDepositPopoverOpen(open)
    }

    const withdrawFromVault = () => {
        if (program && publicKey) {
            const execute = async () => {
                try {
                    setIsWithdrawLoading(true);
                    const instruction = await program.methods
                        .withdrawFromVault(
                            fund.name,
                            new anchor.BN(withdrawalAmount).mul(SCALING_FACTOR)
                        )
                        .accounts({
                            manager: publicKey,
                            stablecoinMint: fund.stablecoinMint
                        })
                        .instruction();

                    const transaction = new anchor.web3.Transaction();
                    transaction.add(instruction);
                    const signature = await sendTransaction(transaction, connection);
                    await fetchDetails();
                    setWithdrawalAmount(0);
                    handleWithdrawOpenChange(false);
                    const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
                    toast ({
                        title: `Succesfull withdrawal`,
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
                    console.error("Error withdrawing from vault: ", e);
                    toast({
                        title: "Error",
                        description: "There was an error withdrawing USDC",
                        variant: "destructive"
                    });
                } finally {
                    setIsWithdrawLoading(false)
                }
            }
            execute();
        }
    }

    const depositIntoVault = () => {
        if (program && publicKey) {
            const execute = async () => {
                try {
                    setIsDepositLoading(true);
                    const instruction = await program.methods
                        .depositIntoVault(
                            fund.name,
                            new anchor.BN(depositAmount).mul(SCALING_FACTOR)
                        )
                        .accounts({
                            manager: publicKey,
                            stablecoinMint: fund.stablecoinMint
                        })
                        .instruction();

                    const transaction = new anchor.web3.Transaction();
                    transaction.add(instruction);
                    const signature = await sendTransaction(transaction, connection);
                    await fetchDetails();
                    setDepositAmount(0);
                    handleDepositOpenChange(false);
                    const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
                    toast ({
                        title: `Deposit succesful`,
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
                    console.error("Error depositing into vault: ", e);
                    toast({
                        title: "Error",
                        description: "There was an error depositing USDC",
                        variant: "destructive"
                    });
                } finally {
                    setIsDepositLoading(false)
                }
            }
            execute();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
           <DialogTrigger className="w-full">
                <Button className="w-full">USDC Vault</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{fund.name} USDC Vault</DialogTitle>
                </DialogHeader>
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col gap-2 justify-center items-center">
                        <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                            <Label>Current balance in USDC vault</Label>
                            <Input readOnly value={formatCurrency(vaultUsdcBalance.toString())}/>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-center gap-3">
                        <Popover open={isWithdrawPopoverOpen} onOpenChange={handleWithdrawOpenChange}>
                            <PopoverTrigger className="w-1/3">
                                <Button className="w-full">Withdraw</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="flex flex-col gap-3 justify-center ">
                                    <p>Withdraw from Vault</p>
                                    <div className="grid max-w-sm items-center gap-1.5">
                                        <Label>Withdraw</Label>
                                        <Input 
                                            placeholder={"USDC"}
                                            type="number" 
                                            onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                                            value={withdrawalAmount}
                                            disabled={isWithdrawLoading}
                                        />
                                    </div>
                                    <div className="grid max-w-sm items-center gap-1.5">
                                        {isWithdrawLoading ? 
                                            <Button disabled>
                                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                Withdrawing
                                            </Button>
                                        : 
                                            <Button onClick={() => withdrawFromVault()}>Withdraw</Button>
                                        }
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Popover open={isDepositPopoverOpen} onOpenChange={handleDepositOpenChange}>
                            <PopoverTrigger className="w-1/3">
                                <Button className="w-full">Deposit</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="flex flex-col gap-3 justify-center ">
                                    <p>Deposit into Vault</p>
                                    <div className="grid max-w-sm items-center gap-1.5">
                                        <Label>Deposit</Label>
                                        <Input 
                                            placeholder={"USDC"}
                                            type="number" 
                                            onChange={(e) => setDepositAmount(Number(e.target.value))}
                                            value={depositAmount}
                                            disabled={isDepositLoading}
                                        />
                                    </div>
                                    <div className="grid max-w-sm items-center gap-1.5">
                                        {isDepositLoading ? 
                                            <Button disabled>
                                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                Depositing
                                            </Button>
                                        : 
                                            <Button onClick={() => depositIntoVault()}>Deposit</Button>
                                        }
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}
