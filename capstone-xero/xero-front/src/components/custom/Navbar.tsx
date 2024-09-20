"use client"
import { Separator } from "../ui/separator";
import dynamic from 'next/dynamic';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserRole } from "@/lib/types/user-role";
import { ModeToggle } from "./ModeToggle";

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export default function Navbar({
    setUserRole,
    userRole
}: {
    setUserRole: Function,
    userRole: UserRole
}) {
    return (
        <header className="w-full flex flex-col items-center">
            <div className="flex flex-row w-full justify-between items-center p-2">
                <p className="text-xl"><strong>PROJECT XERO</strong></p>

                <Select onValueChange={(value) => setUserRole(value)} value={userRole}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={UserRole.Investor}>Investor</SelectItem>
                            <SelectItem value={UserRole.Manager}>Manager</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div className="flex flex-row gap-x-4 justify-center items-center">
                    <ModeToggle />
                    <WalletMultiButtonDynamic />
                </div>
            </div>
            <Separator />
        </header>
    )
}
