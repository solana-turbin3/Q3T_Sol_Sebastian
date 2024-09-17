import { FundData } from "@/lib/types/program-types"
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog";
import LiabilityDialog from "./LiabilityDialog";
import InvestmentsDialog from "./InvestmentsDialog";
import RedemptionDialog from "./RedemptionDialog";

export default function FundCardManager({
    fund
}: {
    fund: FundData
}) {
    return (
        <Card className="w-[300px]">
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
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Shares Value</Label>
                    <Input readOnly placeholder={fund.liabilitiesAmount} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Outstanding Shares</Label>
                    <Input readOnly placeholder={fund.liabilitiesAmount} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Active Investments</Label>
                    <Input readOnly placeholder={fund.liabilitiesAmount} />
                </div>
            </CardContent>
            <CardFooter className="w-full flex flex-col justify-center items-center gap-2">
                <LiabilityDialog fund={fund} />
                <InvestmentsDialog fund={fund} />
                <RedemptionDialog  fund={fund} />
            </CardFooter>
        </Card>
    )
}
