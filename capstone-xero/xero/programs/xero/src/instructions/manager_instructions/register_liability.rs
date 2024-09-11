use anchor_lang::prelude::*;

use crate::{
    errors::FundError,
    state::{Liability, LiabilityCategory, InvestmentFund},
};

#[derive(Accounts)]
#[instruction(fund_name: String, identifier: String)]
pub struct RegisterLiability<'info> {
    #[account(mut)]
    pub manager: Signer<'info>,
    #[account(
        mut,
        seeds = [
            b"fund", 
            fund_name.as_bytes(), 
            manager.key().as_ref()
        ],
        bump = investment_fund.bump,
        constraint = investment_fund.manager == manager.key()
    )]
    pub investment_fund: Account<'info, InvestmentFund>,
    #[account(
        init,
        seeds = [
            b"liability", 
            identifier.as_bytes(), 
            investment_fund.key().as_ref()
        ],
        bump,
        payer = manager,
        space = Liability::get_space(&identifier)
    )]
    pub liability: Account<'info, Liability>,
    pub system_program: Program<'info, System>,
}

impl<'info> RegisterLiability<'info> {
    pub fn register_liability(
        &mut self,
        bumps: &RegisterLiabilityBumps,
        identifier: String,
        liability_amount: u64,
        category: LiabilityCategory,
    ) -> Result<()> {

        require!(
            identifier.len() > 4 && identifier.len() <= 32,
            FundError::InvalidStringLength
        );

        let clock = Clock::get()?;

        self.liability.set_inner(Liability {
            bump: bumps.liability,
            investment_fund: self.investment_fund.key(),
            liability_amount,
            creation_date: clock.unix_timestamp,
            category,
            identifier,
        });

        self.investment_fund.liabilities_amount += liability_amount;

        Ok(())
    }
}
