use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

use crate::{errors::FundError, state::InvestmentFund};

#[derive(Accounts)]
#[instruction(fund_name: String, initial_shares: u64)]
pub struct InitializeFundMint<'info> {
    #[account(mut)]
    pub manager: Signer<'info>,
    #[account(
        mut,
        seeds = [b"fund", fund_name.as_bytes(), manager.key().as_ref()],
        bump = investment_fund.bump,
        constraint = investment_fund.manager == manager.key()
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
    pub shares_mint: Box<Account<'info, Mint>>,
    #[account(
        init,
        payer = manager,
        associated_token::mint = shares_mint,
        associated_token::authority = manager
    )]
    pub manager_shares_ata: Box<Account<'info, TokenAccount>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> InitializeFundMint<'info> {
    pub fn initialize_fund_mint(
        &mut self,
        bumps: &InitializeFundMintBumps,
        fund_name: String,
        initial_shares: u64,
    ) -> Result<()> {
        
        let fund = &mut self.investment_fund;
        let initial_share_value =
            (fund.assets_amount - fund.liabilities_amount) / initial_shares as f64;

        require!(
            fund.share_value == initial_share_value,
            FundError::InvalidShareValue
        );

        fund.shares_mint_bump = Some(bumps.shares_mint);

        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = MintTo {
            to: self.manager_shares_ata.to_account_info(),
            mint: self.shares_mint.to_account_info(),
            authority: self.investment_fund.to_account_info(),
        };
        let manager_key = self.manager.key();
        let seeds = &[b"shares", fund_name.as_bytes(), manager_key.as_ref()];
        let signer_seeds = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        mint_to(cpi_ctx, initial_shares * 10u64.pow(6))?;

        Ok(())
    }
}
