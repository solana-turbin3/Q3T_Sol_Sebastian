import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import WalletContextProvider from "@/lib/providers/wallet-provider";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import Head from "next/head";
import { Toaster } from "@/components/ui/toaster"

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Project Xero",
    description: "Turbin3 capstone project",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <Head>
                <meta lang="en" />
            </Head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <WalletContextProvider>
                        {children}
                    </WalletContextProvider>
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    );
}
