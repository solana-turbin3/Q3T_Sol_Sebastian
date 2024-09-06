use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

use crate::{errors::FundError, state::InvestmentFund};

#[derive(Accounts)]
#[instruction(fund_name: String, stablecoin_pubkey: Pubkey)]
pub struct InitializeFund<'info> {
    #[account(mut)]
    pub manager: Signer<'info>,
    #[account(
        init,
        payer = manager,
        space = InvestmentFund::get_space(&fund_name),
        seeds = [
            b"fund", 
            fund_name.as_bytes(), 
            manager.key().as_ref()
        ],
        bump
    )]
    pub investment_fund: Box<Account<'info, InvestmentFund>>,
    #[account(
        constraint = stablecoin_mint.key() == stablecoin_pubkey
    )]
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
        stablecoin_pubkey: Pubkey,
        initial_shares: u64,
        assets_amount: u64,
        liabilities_amount: u64,
    ) -> Result<()> {
        
        require!(
            fund_name.len() > 4 && fund_name.len() <= 32,
            FundError::InvalidStringLength
        );

        let initial_share_value = assets_amount
            .checked_sub(liabilities_amount)
            .and_then(|net_assets| net_assets.checked_mul(1_000_000))
            .and_then(|scaled_net_assets| scaled_net_assets.checked_div(initial_shares))
            .ok_or(FundError::ArithmeticError)?;

        self.investment_fund.set_inner(InvestmentFund {
            bump: bumps.investment_fund,
            assets_amount,
            liabilities_amount,
            share_value: initial_share_value,
            shares_mint_bump: None,
            manager: self.manager.key(),
            stablecoin_mint: stablecoin_pubkey,
            name: fund_name,
        });

        Ok(())
    }
}
