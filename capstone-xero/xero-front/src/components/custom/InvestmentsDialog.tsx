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
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import * as web3 from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useState } from "react";
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const mockInvestment: InvestmentData = {
    bump: 255,
    investmentFund: web3.Keypair.generate().publicKey,
    investedAmount: new BN(250000 * 1_000_000),
    interestRate: new BN(1 * 1_000_000),
    initDate: new BN(223232323),
    maturityDate: new BN(243232323),
    identifier: "123"
};

export default function InvestmentsDialog({
    fund
}: {
    fund: FundData
}) {

    const [isProcessingLoading, setIsProcessingLoading] = useState(false);
    const [investments, setInvestments] = useState<InvestmentData[]>([mockInvestment]);
    const [isRegisteringLoading, setIsRegisteringLoading] = useState(false)
    const [date, setDate] = useState<Date | undefined>(new Date())

    const formatBN = (bn: BN) => bn.toString();

    const formatDate = (bn: BN) => {
        const date = new Date(bn.toNumber() * 1000);
        return date.toLocaleDateString();
    };

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
                                    <TableHead className="w-[100px]">Identifier</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Interest rate</TableHead>
                                    <TableHead>Creation date</TableHead>
                                    <TableHead>Maturity date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {investments.map(investment => (
                                    <TableRow key={investment.identifier}>
                                        <TableCell className="font-medium">{investment.identifier}</TableCell>
                                        <TableCell className="text-right">{formatBN(investment.investedAmount)}</TableCell>
                                        <TableCell>{formatBN(investment.interestRate)}</TableCell>
                                        <TableCell>{formatDate(investment.initDate)}</TableCell>
                                        <TableCell>{formatDate(investment.maturityDate)}</TableCell>
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
                                <Button onClick={() => setIsProcessingLoading(true)} className="w-3/5">Process Investments</Button>
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="register" className="w-full flex flex-col gap-2">
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Invested Amount</Label>
                                <Input type="number" />
                            </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Interest Rate</Label>
                                <Input type="number" />
                            </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Maturity Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"}>
                                            Pick a date
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            className="rounded-md border"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <Separator />
                        <div className="w-full flex flex-col items-center justify-center">
                            {isRegisteringLoading ?
                                <Button className="w-3/5" disabled>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Registering
                                </Button>
                            :
                                <Button onClick={() => setIsRegisteringLoading(true)} className="w-3/5">Register</Button>
                            }
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
