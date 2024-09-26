use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken, 
    token::{
        Mint, 
        Token, 
        TokenAccount, 
        transfer, 
        Transfer
    }
};

use crate::state::InvestmentFund;

#[derive(Accounts)]
#[instruction(fund_name: String)]
pub struct VaultDeposit<'info> {
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
    pub investment_fund: Box<Account<'info, InvestmentFund>>,
    #[account(
        constraint = stablecoin_mint.key() == investment_fund.stablecoin_mint
    )]
    pub stablecoin_mint: Box<Account<'info, Mint>>,
    #[account(
        mut,
        associated_token::mint = stablecoin_mint,
        associated_token::authority = investment_fund
    )]
    pub fund_stablecoin_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = stablecoin_mint,
        associated_token::authority = manager
    )]
    pub manager_stablecoin_ata: Box<Account<'info, TokenAccount>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> VaultDeposit<'info> {
    pub fn deposit_into_vault(
        &mut self,
        deposit_amount: u64,
    ) -> Result<()> {

        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.manager_stablecoin_ata.to_account_info(),
            to: self.fund_stablecoin_vault.to_account_info(),
            authority: self.manager.to_account_info()
        };
        let cpi_context = CpiContext::new(
            cpi_program, 
            cpi_accounts, 
        );

        transfer(cpi_context, deposit_amount)?;

        Ok(())
    }
}

