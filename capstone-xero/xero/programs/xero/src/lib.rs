use anchor_lang::prelude::*;

mod state;
mod instructions;
mod errors;

use instructions::*;
use state::*;

declare_id!("FpGgmLziQeTizXoyRm2ihaFrm1xtu5gx3M9XCK9ye3pU");

#[program]
pub mod xero {
    use super::*;

    pub fn initialize_fund(
        ctx: Context<InitializeFund>, 
        fund_name: String,
        stablecoin_pubkey: Pubkey,
        initial_shares: u64,
        assets_amount: u64,
        liabilities_amount: u64,
    ) -> Result<()> {

        ctx.accounts.initialize_fund(
            &ctx.bumps, 
            fund_name, 
            stablecoin_pubkey,
            initial_shares, 
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
        invested_amount: f64,
        interest_rate: f64,
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

    pub fn register_expense(
        ctx: Context<RegisterExpense>,
        _fund_name: String,
        identifier: String,
        expense_amount: u64,
        category: ExpenseCategory,
    ) -> Result<()> {

        ctx.accounts.register_expense(
            &ctx.bumps, 
            identifier, 
            expense_amount, 
            category
        )?;

        Ok(())
    }
}
