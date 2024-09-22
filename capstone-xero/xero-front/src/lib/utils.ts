import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as anchor from "@coral-xyz/anchor"
import { SCALING_FACTOR } from "./types/consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatBNToString = (bn: anchor.BN) => bn.toString();

export const formatBNToStringDecimals = (bn: anchor.BN, scale: number = 1_000_000) => {
    const scaledValue = bn.toNumber() / scale;
    return scaledValue.toFixed(6); 
};

export const formatBNToDate = (bn: anchor.BN) => {
    const date = new Date(bn.toNumber() * 1000);
    return date.toLocaleDateString();
};

export const formatDateToUnixTimestamp = (date: Date): anchor.BN => {
    return new anchor.BN(Math.floor(date.getTime() / 1000));
}

export const truncatePubkey = (str: string) => {
    return str.slice(0, 4) + "..." + str.slice(-4);
}

export const getShareValue = (
    assets: anchor.BN, 
    liabilities: anchor.BN, 
    supply: anchor.BN
): string => {

    if (supply.isZero()) {
        return "0.000000"; // Return a string representation of zero with six decimals
    }

    // Add assets and liabilities
    const numerator = assets.add(liabilities);

    // Calculate the share value
    const shareValue = numerator.mul(SCALING_FACTOR).div(supply);

    // Convert to string and scale down to six decimal places
    const scaledValue = shareValue.toNumber() / SCALING_FACTOR.toNumber();

    return scaledValue.toFixed(6); // Format to six decimal places
};

export const unscaledShareSupply = (scaledSupply: anchor.BN): string => {
    return scaledSupply.div(SCALING_FACTOR).toString();
}

export const formatCurrency = (value: string, locale = 'en-US', currency = 'USD', maxDecimals = 6): string => {
    const numberValue = parseFloat(value);
  
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: maxDecimals
    });
  
    return formatter.format(numberValue);
}

export const formatNumber = (
    value: string,
    decimalPlaces: number = 0,
    thousandsSeparator: string = ',',
    decimalSeparator: string = '.'
  ): string => {
    const number = parseFloat(value);
  
    if (isNaN(number)) {
      return 'Invalid Number';
    }
  
    const rounded = number.toFixed(decimalPlaces);
  
    const [integerPart, decimalPart] = rounded.split('.');
  
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  
    return decimalPlaces > 0
      ? `${formattedIntegerPart}${decimalSeparator}${decimalPart}`
      : formattedIntegerPart;
}