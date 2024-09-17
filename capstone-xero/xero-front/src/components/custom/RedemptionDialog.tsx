import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FundData } from "@/lib/types/program-types";
import { Button } from "../ui/button";

export default function RedemptionDialog({
    fund
}: {
    fund: FundData
}) {
  return (
    <Dialog>
        <DialogTrigger className="w-full">
            <Button className="w-full">Share Redemptions</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{fund.name} Redemptions</DialogTitle>
            </DialogHeader>
            <div>
                HI from redemptions
            </div>
        </DialogContent>
    </Dialog>
  )
}
