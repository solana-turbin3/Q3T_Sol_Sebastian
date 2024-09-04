use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct RegisterExpense<'info> {
    #[account(mut)]
    pub manager: Signer<'info>,
}