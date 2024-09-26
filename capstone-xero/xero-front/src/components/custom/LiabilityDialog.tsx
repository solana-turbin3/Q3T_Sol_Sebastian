"use client"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FundData, LiabilityData } from "@/lib/types/program-types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "../ui/separator";
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger
} from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useStore } from "@/store";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useToast } from "@/hooks/use-toast";
import { SCALING_FACTOR } from "@/lib/types/consts";
import { formatBNToString, formatBNToDate } from "@/lib/utils";

const formSchema = z.object({
    identifier: z.string().max(20).min(4),
    amount: z.number(),
    category: z.enum([
        'accountsPayable', 
        'loansPayable', 
        'wagesPayable', 
        'taxesPayable', 
        'other'
    ])
});

export default function LiabilityDialog({
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
    const [isRegisteringLoading, setIsRegisteringLoading] = useState(false)
    const [liabilities, setLiabilities] = useState<anchor.ProgramAccount<LiabilityData>[]>([]);
    const [isOpen, setIsOpen] = useState(false);   

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: "",
            amount: 1,
            category: "accountsPayable",
        }
    });

    const getCategory = (categoryString: string) => {
        switch (categoryString) {
            case "accountsPayable": 
                return { accountsPayable: {} };
            case "loansPayable":
                return { loansPayable: {} };
            case "wagesPayable":
                return { wagesPayable: {} };
            case "taxesPayable":
                return { wagesPayable: {} };
            case "other":
                return { other: {} };
        }
    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (program && publicKey) {
            const createLiability = async () => {
                try {
                    setIsRegisteringLoading(true);
                    const scaledAmount = new anchor.BN(values.amount).mul(SCALING_FACTOR);

                    const instruction = await program.methods
                        .registerLiability(
                            fund.name,
                            values.identifier,
                            scaledAmount,
                            getCategory(values.category) as any
                        )
                        .accounts({
                            manager: publicKey
                        })
                        .instruction();
                    
                    const transaction = new anchor.web3.Transaction();
                    transaction.add(instruction);

                    const signature = await sendTransaction(transaction, connection);
                
                    const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      
                    toast ({
                        title: "Liability registered succesfully",
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
                    console.error("Error when creating liability: ", e);
                    toast({
                        title: "Error",
                        description: "There was an error registering the liability",
                        variant: "destructive"
                    });
                } finally {
                    setIsRegisteringLoading(false)
                }
            };
            createLiability()
        }
    }

    const fetchLiabilities = async () => {
        if (program) {
            const liabilities = await program.account.liability.all([
                {
                    memcmp: {
                        offset: 9,
                        bytes: fundPubkey.toBase58()
                    }
                }
            ]);
            setLiabilities(liabilities);
        }
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            fetchLiabilities()
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger className="w-full">
                <Button className="w-full">Liabilities</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{fund.name} Liabilities</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="see" className="w-full flex flex-col items-center justify-center">
                    <TabsList className="">
                        <TabsTrigger value="see">See liabilities</TabsTrigger>
                        <TabsTrigger value="register">Register liability</TabsTrigger>
                    </TabsList>
                    <TabsContent value="see" className="w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Identifier</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Creation date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {liabilities.map(liability => (
                                    <TableRow key={liability.account.identifier}>
                                        <TableCell>{liability.account.identifier}</TableCell>
                                        <TableCell>{formatBNToString(liability.account.liabilityAmount.div(SCALING_FACTOR))}</TableCell>
                                        <TableCell>{JSON.stringify(liability.account.category)}</TableCell>
                                        <TableCell>{formatBNToDate(liability.account.creationDate)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="register" className="w-full flex flex-col gap-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
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
                                    name="identifier"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Identifier</FormLabel>
                                            <FormControl>
                                                <Input {...field}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a verified email to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="accountsPayable">Accounts Payable</SelectItem>
                                                    <SelectItem value="loansPayable">Loans Payable</SelectItem>
                                                    <SelectItem value="wagesPayable">Wages Payable</SelectItem>
                                                    <SelectItem value="taxesPayable">Taxes Payable</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator />

                                <div className="w-full flex flex-col items-center justify-center">
                                    {isRegisteringLoading ?
                                        <Button className="w-3/5" disabled>
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                            Registering
                                        </Button>
                                    :
                                        <Button type="submit" className="w-3/5">Register</Button>
                                    }
                                </div> 
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
