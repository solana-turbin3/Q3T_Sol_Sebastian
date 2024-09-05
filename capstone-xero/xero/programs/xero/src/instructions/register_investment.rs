use anchor_lang::prelude::*;

use crate::{
    errors::FundError,
    state::{Investment, InvestmentFund},
};

#[derive(Accounts)]
#[instruction(fund_name: String, identifier: String)]
pub struct RegisterInvestment<'info> {
    #[account(mut)]
    pub manager: Signer<'info>,
    #[account(
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
            b"investment", 
            identifier.as_bytes(), 
            investment_fund.key().as_ref()
        ],
        bump,
        payer = manager,
        space = Investment::get_space(&identifier)
    )]
    pub investment: Account<'info, Investment>,
    pub system_program: Program<'info, System>,
}

impl<'info> RegisterInvestment<'info> {
    pub fn register_investment(
        &mut self,
        bumps: &RegisterInvestmentBumps,
        identifier: String,
        invested_amount: f64,
        interest_rate: f64,
        maturity_date: i64,
    ) -> Result<()> {
        
        require!(
            identifier.len() > 4 && identifier.len() <= 32,
            FundError::InvalidStringLength
        );

        let clock = Clock::get()?;

        self.investment.set_inner(Investment {
            bump: bumps.investment,
            investment_fund: self.investment_fund.key(),
            invested_amount,
            interest_rate,
            init_date: clock.unix_timestamp,
            maturity_date,
            identifier,
        });

        Ok(())
    }
}
