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
pub struct VaultWithdrawal<'info> {
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
        init_if_needed,
        payer = manager,
        associated_token::mint = stablecoin_mint,
        associated_token::authority = manager
    )]
    pub manager_stablecoin_ata: Box<Account<'info, TokenAccount>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> VaultWithdrawal<'info> {
    pub fn withdraw_from_vault(
        &mut self,
        withdrawal_amount: u64,
    ) -> Result<()> {

        let manager_key = self.manager.key();
        let seeds = &[
            b"fund", 
            self.investment_fund.name.as_bytes(), 
            manager_key.as_ref(),
            &[self.investment_fund.bump]
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.fund_stablecoin_vault.to_account_info(),
            to: self.manager_stablecoin_ata.to_account_info(),
            authority: self.investment_fund.to_account_info()
        };
        let cpi_context = CpiContext::new_with_signer(
            cpi_program, 
            cpi_accounts, 
            signer_seeds
        );
        transfer(cpi_context, withdrawal_amount)?;

        Ok(())
    }
}

