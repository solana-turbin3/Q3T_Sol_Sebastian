import { Separator } from "../ui/separator";

export default function Footer() {
    return (
        <footer className="w-full flex flex-col items-center">
            <Separator />
            <div className="flex flex-row w-full justify-center items-center p-2">
                <p className="text-xs">Made with ❤️ from Turbin3</p>
            </div>
        </footer>
    )
}
