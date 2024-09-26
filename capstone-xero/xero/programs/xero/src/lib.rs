use anchor_lang::prelude::*;

mod state;
mod instructions;
mod errors;

use instructions::{investor_instructions::*, manager_instructions::*};
use state::*;

declare_id!("E7s9u89mMuVGULoSnY6PA1yLkcAev8MeTMxxA33pskFo");

pub const SCALING_FACTOR: u64 = 1_000_000;

#[program]
pub mod xero {
    use super::*;

    pub fn initialize_fund(
        ctx: Context<InitializeFund>, 
        fund_name: String,
        stablecoin_pubkey: Pubkey,
        assets_amount: u64,
        liabilities_amount: u64,
    ) -> Result<()> {

        ctx.accounts.initialize_fund(
            &ctx.bumps, 
            fund_name, 
            stablecoin_pubkey,
            assets_amount, 
            liabilities_amount,
        )?;

        Ok(())
    }

    pub fn initialize_fund_mint(
        ctx: Context<InitializeFundMint>,
        fund_name: String,
        initial_shares: u64
    ) -> Result<()> {

        ctx.accounts.initialize_fund_mint(
            &ctx.bumps, 
            fund_name, 
            initial_shares
        )?;

        Ok(())
    }

    pub fn register_investment(
        ctx: Context<RegisterInvestment>,
        _fund_name: String,
        identifier: String,
        invested_amount: u64,
        interest_rate: u64,
        maturity_date: i64
    ) -> Result<()> {

        ctx.accounts.register_investment(
            &ctx.bumps, 
            identifier, 
            invested_amount, 
            interest_rate, 
            maturity_date
        )?;

        Ok(())
    }

    pub fn register_liability(
        ctx: Context<RegisterLiability>,
        _fund_name: String,
        identifier: String,
        liability_amount: u64,
        category: LiabilityCategory,
    ) -> Result<()> {

        ctx.accounts.register_liability(
            &ctx.bumps, 
            identifier, 
            liability_amount, 
            category
        )?;

        Ok(())
    }

    pub fn buy_shares(
        ctx: Context<BuyShares>,
        _fund_name: String,
        manager: Pubkey,
        invested_amount: u64,
    ) -> Result<()> {

        ctx.accounts.buy_shares(
            invested_amount, 
            manager
        )?;

        Ok(())
    }

    pub fn process_investment(
        ctx: Context<ProcessInvestment>,
        _fund_name: String,
        _investment_identifier: String
    ) -> Result<()> {

        ctx.accounts.process_investment()?;

        Ok(())
    }

    pub fn redeem_shares(
        ctx: Context<RedeemShares>,
        _fund_name: String,
        _manager: Pubkey,
        shares_to_redeem: u64
    ) -> Result<()> {

        ctx.accounts.redeem_shares(
            &ctx.bumps, 
            shares_to_redeem
        )?;

        Ok(())
    }

    pub fn process_share_redemption(
        ctx: Context<ProcessShareRedemption>,
        _fund_name: String
    ) -> Result<()> {

        ctx.accounts.process_share_redemption()?;

        Ok(())
    }

    pub fn cancel_redeem_shares(
        ctx: Context<CancelRedeemShares>,
        _fund_name: String,
        manager: Pubkey
    ) -> Result<()> {

        ctx.accounts.cancel_redeem_shares(manager)?;

        Ok(())
    }

    pub fn withdraw_from_vault(
        ctx: Context<VaultWithdrawal>,
        _fund_name: String,
        withdrawal_amount: u64
    ) -> Result<()> {

        ctx.accounts.withdraw_from_vault(withdrawal_amount)?;

        Ok(())
    }

    pub fn deposit_into_vault(
        ctx: Context<VaultDeposit>,
        _fund_name: String,
        deposit_amount: u64
    ) -> Result<()> {

        ctx.accounts.deposit_into_vault(deposit_amount)?;

        Ok(())
    }
}
