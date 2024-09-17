import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FundData } from "@/lib/types/program-types";
import { Button } from "../ui/button";

export default function InvestmentsDialog({
    fund
}: {
    fund: FundData
}) {
  return (
    <Dialog>
        <DialogTrigger className="w-full">
            <Button className="w-full">Investments</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{fund.name} Investments</DialogTitle>
            </DialogHeader>
            <div>
                HI from investments
            </div>
        </DialogContent>
    </Dialog>
  )
}
