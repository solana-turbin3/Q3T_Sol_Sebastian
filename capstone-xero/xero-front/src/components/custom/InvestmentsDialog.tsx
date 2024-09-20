"use client"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FundData, InvestmentData } from "@/lib/types/program-types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Separator } from "../ui/separator";
import * as anchor from "@coral-xyz/anchor";
import { useEffect, useState } from "react";
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { formatBNToDate, formatBNToString, formatDateToUnixTimestamp } from "@/lib/utils";
import { SCALING_FACTOR } from "@/lib/types/consts";
import { useStore } from "@/store";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    identifier: z.string().max(20).min(4),
    amount: z.number(),
    interestRate: z.number(),
    date: z.date()
});

export default function InvestmentsDialog({
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
    const [isProcessingLoading, setIsProcessingLoading] = useState(false);
    const [investments, setInvestments] = useState<anchor.ProgramAccount<InvestmentData>[]>([]);
    const [isRegisteringLoading, setIsRegisteringLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: "",
            amount: 1,
            interestRate: 0.01,
            date: new Date()
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (program && publicKey) {
            const createInvestment = async () => {
                try {
                    setIsRegisteringLoading(true);
                    const scaledAmount = new anchor.BN(values.amount).mul(SCALING_FACTOR);
                    const scaledInterestRate = new anchor.BN(values.interestRate).mul(SCALING_FACTOR);
                    const maturityDateInUnix = formatDateToUnixTimestamp(values.date);

                    const instruction = await program.methods
                        .registerInvestment(
                            fund.name,
                            values.identifier,
                            scaledAmount,
                            scaledInterestRate,
                            maturityDateInUnix
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
                        title: "Investment registered succesfully",
                        description: "Check your transaction here: " + link,
                    });
                } catch(e) {
                    console.error("Error when creating investment: ", e);
                    toast({
                        title: "Error",
                        description: "There was an error registering the investment",
                        variant: "destructive"
                    });
                } finally {
                    setIsRegisteringLoading(false);
                }
            };
            createInvestment()
        }
    }

    const processAllInvestments = () => {
        if(program && publicKey) {
            const processAll = async() => {
                try {
                    setIsProcessingLoading(true);
                    const transaction = new anchor.web3.Transaction();
                    for (const investment of investments) {
                        const instruction = await program.methods
                            .processInvestment(
                                fund.name,
                                investment.account.identifier
                            )
                            .accounts({
                                manager: publicKey
                            })
                            .instruction();

                        transaction.add(instruction);
                    }

                    const signature = await sendTransaction(transaction, connection);
                    const link = `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      
                    toast ({
                        title: `${investments.length} investments processed succesfully`,
                        description: "Check your transaction here: " + link,
                    });
                } catch(e) {
                    console.error("Error processing all investments: ", e);
                    toast({
                        title: "Error",
                        description: "There was an error processing the investments",
                        variant: "destructive"
                    });
                } finally {
                    setIsProcessingLoading(false)
                }
            };
            processAll()
        }
    }

    useEffect(() => {
        if (program) {
            const fetchDetails = async () => {
                const investments = await program.account.investment.all();
                const filteredInvestments = investments.filter(investment => investment.account.investmentFund.toString() === fundPubkey.toString());
                setInvestments(filteredInvestments);
            }
            fetchDetails();
        }
    }, [program])

    return (
        <Dialog>
            <DialogTrigger className="w-full">
                <Button className="w-full">Investments</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{fund.name} Investments</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="see" className="w-full flex flex-col items-center justify-center">
                    <TabsList>
                        <TabsTrigger value="see">See investments</TabsTrigger>
                        <TabsTrigger value="register">Register investment</TabsTrigger>
                    </TabsList>
                    <TabsContent value="see" className="w-full flex flex-col gap-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Identifier</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Interest rate</TableHead>
                                    <TableHead>Creation date</TableHead>
                                    <TableHead>Maturity date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {investments.map(investment => (
                                    <TableRow key={investment.account.identifier}>
                                        <TableCell>{investment.account.identifier}</TableCell>
                                        <TableCell>{formatBNToString(investment.account.investedAmount.div(SCALING_FACTOR))}</TableCell>
                                        <TableCell>{formatBNToString(investment.account.interestRate.div(SCALING_FACTOR))}</TableCell>
                                        <TableCell>{formatBNToDate(investment.account.initDate)}</TableCell>
                                        <TableCell>{formatBNToDate(investment.account.maturityDate)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Separator />
                        <div className="w-full flex flex-col items-center justify-center">
                            {isProcessingLoading ?
                                <Button className="w-3/5" disabled>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Processing
                                </Button>
                            :
                                <Button onClick={() => processAllInvestments()} className="w-3/5">Process Investments</Button>
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="register" className="w-full flex flex-col gap-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                
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
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Invested Amount</FormLabel>
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
                                    name="interestRate"
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
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Maturity Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                        >
                                                            {field.value ? (
                                                                field.value.toLocaleString()
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>

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
                        </Form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
