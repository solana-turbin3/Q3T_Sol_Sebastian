import { Xero } from "../solana-program/idl";
import { IdlAccounts } from "@coral-xyz/anchor";

export type FundData = IdlAccounts<Xero>["investmentFund"];

export type InvestmentData = IdlAccounts<Xero>["investment"];

export type LiabilityData = IdlAccounts<Xero>["liability"];

export type ShareRedemptionData = IdlAccounts<Xero>["shareRedemption"];