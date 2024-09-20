"use client"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Separator } from "../ui/separator";
import { useStore } from "@/store";
import * as anchor from "@coral-xyz/anchor";
import { SCALING_FACTOR } from "@/lib/types/consts";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
    fundName: z.string().max(20).min(4),
    stablecoinMint: z.string().min(1),
    initialAssets: z.number(),
    initialLiabilities: z.number(),
    initialShares: z.number()
});

export default function CreateFundDialog() {

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { program } = useStore();
    const { sendTransaction, publicKey } = useWallet();
    const { connection } = useConnection();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fundName: "",
            stablecoinMint: "",
            initialAssets: 1,
            initialLiabilities: 1,
            initialShares: 1
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (program && publicKey) {
            const initializeFund = async () => {
                try {
                    setIsLoading(true);

                    const stablecoinPubkey = new anchor.web3.PublicKey(values.stablecoinMint);
                    const scaledAssets = new anchor.BN(values.initialAssets).mul(SCALING_FACTOR);
                    const scaledLiabilities = new anchor.BN(values.initialLiabilities).mul(SCALING_FACTOR);
                    const scaledShares = new anchor.BN(values.initialShares).mul(SCALING_FACTOR);
                    
                    const instruction1 = await program.methods
                        .initializeFund(
                            values.fundName,
                            stablecoinPubkey,
                            scaledAssets,
                            scaledLiabilities,
                        )
                        .accounts({
                            manager: publicKey,
                            stablecoinMint: stablecoinPubkey
                        })
                        .instruction();
    
                    const instruction2 = await program.methods
                        .initializeFundMint(
                            values.fundName,
                            scaledShares
                        )
                        .accounts({
                            manager: publicKey
                        })
                        .instruction();
    
                    const transaction = new anchor.web3.Transaction();
                    transaction.add(instruction1);
                    transaction.add(instruction2);
    
                    const signature = await sendTransaction(transaction, connection);

                    const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      
                    toast ({
                        title: "Fund created succesfully",
                        description: "Check your transaction here: " + link,
                    });
                } catch(e) {
                    console.error("Error in initializeFund: ", e);
                    toast({
                        title: "Error",
                        description: "There was an error creating the fund",
                        variant: "destructive"
                    });
                } finally {
                    setIsLoading(false);
                }
            }
            initializeFund();
        } else {
            alert("Sorry, something failed, please reload.");
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button className="w-full">Create new Fund</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create a new Investment Fund
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="fundName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fund Name</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="stablecoinMint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stablecoin Mint</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="initialAssets"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Initial Assets</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            type="number"
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="initialLiabilities"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Initial Liabilities</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            type="number"
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="initialShares"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Initial Shares</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field} 
                                            type="number"
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Separator />

                        <div className="w-full flex justify-center items-center">
                            {isLoading ? 
                                <Button className="w-1/3" disabled>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Creating
                                </Button>
                            : 
                                <Button className="w-1/3" type="submit">Create Fund</Button>
                            }
                        </div>
                        
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
