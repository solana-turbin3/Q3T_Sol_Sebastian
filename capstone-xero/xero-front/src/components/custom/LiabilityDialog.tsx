import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FundData } from "@/lib/types/program-types";
import { Button } from "../ui/button";

export default function LiabilityDialog({
    fund
}: {
    fund: FundData
}) {
  return (
    <Dialog>
        <DialogTrigger className="w-full">
            <Button className="w-full">Register Liability</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{fund.name} Liabilities</DialogTitle>
            </DialogHeader>
            <div>
                HI from liabilities
            </div>
        </DialogContent>
    </Dialog>
  )
}
