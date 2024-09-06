use anchor_lang::prelude::*;

use crate::{errors::FundError, Investment, InvestmentFund};

#[derive(Accounts)]
#[instruction(fund_name: String, investment_identifier: String)]
pub struct UpdateShareValue<'info> {
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

impl<'info> UpdateShareValue<'info> {
    pub fn update_share_value(
        &mut self,
    ) -> Result<()> {

        // calculate the generated revenue since last day
        let investment = &self.investment;

        let daily_rate = investment.interest_rate
            .checked_mul(1_000_000)
            .and_then(|scaled_monthly_rate| scaled_monthly_rate.checked_div(30))
            .ok_or(FundError::ArithmeticError)?;

        let daily_interest = investment.invested_amount
            .checked_mul(daily_rate)
            .and_then(|scaled_interest| scaled_interest.checked_div(1_000_000))
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