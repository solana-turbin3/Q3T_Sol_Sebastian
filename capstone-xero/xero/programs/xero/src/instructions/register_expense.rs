use anchor_lang::prelude::*;

use crate::{
    errors::FundError,
    state::{Expense, ExpenseCategory, InvestmentFund},
};

#[derive(Accounts)]
#[instruction(fund_name: String, identifier: String)]
pub struct RegisterExpense<'info> {
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
            b"expense", 
            identifier.as_bytes(), 
            investment_fund.key().as_ref()
        ],
        bump,
        payer = manager,
        space = Expense::get_space(&identifier)
    )]
    pub expense: Account<'info, Expense>,
    pub system_program: Program<'info, System>,
}

impl<'info> RegisterExpense<'info> {
    pub fn register_expense(
        &mut self,
        bumps: &RegisterExpenseBumps,
        identifier: String,
        expense_amount: u64,
        category: ExpenseCategory,
    ) -> Result<()> {

        require!(
            identifier.len() > 4 && identifier.len() <= 32,
            FundError::InvalidStringLength
        );

        let clock = Clock::get()?;

        self.expense.set_inner(Expense {
            bump: bumps.expense,
            investment_fund: self.investment_fund.key(),
            expense_amount,
            creation_date: clock.unix_timestamp,
            category,
            identifier,
        });

        self.investment_fund.liabilities_amount += expense_amount;

        Ok(())
    }
}
