use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

use crate::{errors::FundError, state::InvestmentFund};

#[derive(Accounts)]
#[instruction(fund_name: String, initial_shares: u64)]
pub struct InitializeFund<'info> {
    #[account(mut)]
    pub manager: Signer<'info>,
    #[account(
        init,
        payer = manager,
        space = InvestmentFund::get_size(&fund_name),
        seeds = [b"fund", fund_name.as_bytes(), manager.key().as_ref()],
        bump
    )]
    pub investment_fund: Box<Account<'info, InvestmentFund>>,
    pub stablecoin_mint: Box<Account<'info, Mint>>,
    #[account(
        init,
        payer = manager,
        associated_token::mint = stablecoin_mint,
        associated_token::authority = investment_fund
    )]
    pub fund_stablecoin_vault: Box<Account<'info, TokenAccount>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> InitializeFund<'info> {
    pub fn initialize_fund(
        &mut self,
        bumps: &InitializeFundBumps,
        fund_name: String,
        initial_shares: u64,
        assets_amount: f64,
        liabilities_amount: f64,
    ) -> Result<()> {
        
        require!(
            fund_name.len() > 4 && fund_name.len() <= 32,
            FundError::InvalidNameLength
        );

        let initial_share_value = (assets_amount - liabilities_amount) / initial_shares as f64;

        self.investment_fund.set_inner(InvestmentFund {
            bump: bumps.investment_fund,
            assets_amount,
            liabilities_amount,
            share_value: initial_share_value,
            shares_mint_bump: None,
            manager: self.manager.key(),
            name: fund_name,
        });

        // todo()! Set the minimum liquidity in the liquidity redemption vault.

        Ok(())
    }
}
