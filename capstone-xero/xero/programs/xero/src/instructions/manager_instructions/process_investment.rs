use anchor_lang::prelude::*;

use crate::{errors::FundError, Investment, InvestmentFund};

#[derive(Accounts)]
#[instruction(fund_name: String, investment_identifier: String)]
pub struct ProcessInvestment<'info> {
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
        mut,
        seeds = [
            b"investment", 
            investment_identifier.as_bytes(), 
            investment_fund.key().as_ref()
        ],
        bump = investment.bump
    )]
    pub investment: Account<'info, Investment>,
    pub system_program: Program<'info, System>
}

impl<'info> ProcessInvestment<'info> {
    pub fn process_investment(
        &mut self,
    ) -> Result<()> {

        let investment = &self.investment;

        let daily_interest = investment.invested_amount
            .checked_mul(investment.interest_rate)
            .and_then(|scaled_interest| scaled_interest.checked_div(30)) // Now divide by 30
            .and_then(|scaled_interest| scaled_interest.checked_div(1_000_000)) // Scale back by 1_000_000
            .ok_or(FundError::ArithmeticError)?;

        // add the revenue to the fund assets
        self.investment_fund.assets_amount += daily_interest;

        // if it is the madutiry_date day, close the investment account
        let clock = Clock::get()?;
        if clock.unix_timestamp >= investment.maturity_date {
            self.investment.close(self.manager.to_account_info())?;
        }

        Ok(())
    }
}