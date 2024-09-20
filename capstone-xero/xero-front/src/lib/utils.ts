import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as anchor from "@coral-xyz/anchor"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatBNToString = (bn: anchor.BN) => bn.toString();

export const formatBNToDate = (bn: anchor.BN) => {
    const date = new Date(bn.toNumber() * 1000);
    return date.toLocaleDateString();
};

export const formatDateToUnixTimestamp = (date: Date): anchor.BN => {
    return new anchor.BN(Math.floor(date.getTime() / 1000));
}

export const truncatePubkey = (str: string) => {
    return str.slice(0, 3) + "..." + str.slice(-2);
}