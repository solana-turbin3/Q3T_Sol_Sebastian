use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{Mint, Token, TokenAccount}};

use crate::{errors::FundError, state::InvestmentFund};

#[derive(Accounts)]
#[instruction(name: String, initial_shares: u64)]
pub struct InitializeFund<'info> {
    #[account(mut)]
    pub manager: Signer<'info>,
    #[account(
        init,
        payer = manager,
        space = InvestmentFund::get_size(&name),
        seeds = [b"fund", name.as_bytes(), manager.key().as_ref()],
        bump
    )]
    pub investment_fund: Account<'info, InvestmentFund>,
    #[account(
        init,
        payer = manager,
        seeds = [b"shares", investment_fund.key().as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = investment_fund
    )]
    pub shares_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = manager,
        associated_token::mint = shares_mint,
        associated_token::authority = manager
    )]
    pub manager_shares_ata: Account<'info, TokenAccount>,
    pub stablecoin_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = manager,
        associated_token::mint = stablecoin_mint,
        associated_token::authority = investment_fund
    )]
    pub fund_stablecoin_vault: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> InitializeFund<'info> {
    pub fn initialize_fund(
        &mut self, 
        bumps: &InitializeFundBumps, 
        name: String, 
        initial_shares: u64,
        assets_amount: i64,
        liabilities_amount: i64,
    ) -> Result<()> {

        require!(name.len() > 4 && name.len() <= 32, FundError::InvalidNameLength);

        let share_value: i64 = ((assets_amount - liabilities_amount) as f64 / initial_shares as f64) as i64;

        self.investment_fund.set_inner(InvestmentFund {
            bump: bumps.investment_fund,
            assets_amount,
            liabilities_amount,
            share_value,
            shares_mint_bump: bumps.shares_mint,
            manager: self.manager.key(),
            name
        });

        Ok(())
    }
}

