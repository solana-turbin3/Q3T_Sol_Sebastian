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
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function FundCardInvestor({
    fund
}: {
    fund: FundData
}) {
    const [isRedeemLoading, setIsRedeemLoading] = useState(false);
    const [isBuyingLoading, setIsBuyingLoading] = useState(false);

    return (
        <Card className="w-[250px]">
            <CardHeader>
                <CardTitle>{fund.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Total Assets</Label>
                    <Input readOnly placeholder={fund.assetsAmount} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Total Liabilities</Label>
                    <Input readOnly placeholder={fund.liabilitiesAmount} />
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
                                <Input readOnly placeholder={fund.assetsAmount} />
                            </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Total Liabilities</Label>
                                <Input readOnly placeholder={fund.liabilitiesAmount} />
                            </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Share Value</Label>
                                <Input readOnly placeholder={"100000"} />
                            </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Outstanding Shares</Label>
                                <Input readOnly placeholder={"100000"} />
                            </div>
                            <div className="grid max-w-sm items-center gap-1.5 w-3/5">
                                <Label>Shares owned</Label>
                                <Input readOnly placeholder={"100000"} />
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
                                            <Label>Amount to redeem</Label>
                                            <Input placeholder={"shares"} />
                                        </div>
                                        <div className="grid max-w-sm items-center gap-1.5">
                                            {isRedeemLoading ? 
                                                <Button disabled>
                                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                    Redeeming shares
                                                </Button>
                                            : 
                                                <Button onClick={() => setIsRedeemLoading(true)}>Redeem</Button>
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
                                            <Input placeholder={"amount in USDC"} />
                                        </div>
                                        <div className="grid max-w-sm items-center gap-1.5">
                                            {isBuyingLoading ? 
                                                <Button disabled>
                                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                    Buying shares
                                                </Button>
                                            : 
                                                <Button onClick={() => setIsBuyingLoading(true)}>Invest</Button>
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
