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
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import * as web3 from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const mockLiability: LiabilityData = {
    bump: 255,
    investmentFund: web3.Keypair.generate().publicKey,
    liabilityAmount: new BN(250000 * 1_000_000),
    creationDate: new BN(223232323),
    category: "Accounts Payable",
    identifier: "1234"
};

export default function LiabilityDialog({
    fund
}: {
    fund: FundData
}) {

    const [isRegisteringLoading, setIsRegisteringLoading] = useState(false)
    const [liabilities, setLiabilities] = useState<LiabilityData[]>([mockLiability]);    

    const formatBN = (bn: BN) => bn.toString();

    const formatDate = (bn: BN) => {
        const date = new Date(bn.toNumber() * 1000);
        return date.toLocaleDateString();
    };


    return (
        <Dialog>
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
                                    <TableHead className="text-right">Creation date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {liabilities.map(liability => (
                                    <TableRow key={liability.identifier}>
                                        <TableCell className="font-medium">{liability.identifier}</TableCell>
                                        <TableCell className="text-right">{formatBN(liability.liabilityAmount)}</TableCell>
                                        <TableCell>{liability.category}</TableCell>
                                        <TableCell>{formatDate(liability.creationDate)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="register" className="w-full flex flex-col gap-2">
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Liability Amount</Label>
                                <Input type="number" />
                            </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Liability Category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="1">Accounts Payable</SelectItem>
                                            <SelectItem value="2">Loans Payable</SelectItem>
                                            <SelectItem value="3">Wages Payable</SelectItem>
                                            <SelectItem value="4">Taxes Payable</SelectItem>
                                            <SelectItem value="5">Other</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Liability Identifier</Label>
                                <Input />
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
