"use client"
import Footer from "@/components/custom/Footer";
import Navbar from "@/components/custom/Navbar";
import { UserRole } from "@/lib/types/user-role";
import Image from "next/image";
import { useState } from "react";

export default function Home() {

    const [userRole, setUserRole] = useState<UserRole>();

    return (
        <div className="flex flex-col justify-between w-full min-h-screen items-center">
            <Navbar setUserRole={setUserRole}/>
            <div>
                the user role is: {userRole}
            </div>
            <Footer />
        </div>
    );
}
