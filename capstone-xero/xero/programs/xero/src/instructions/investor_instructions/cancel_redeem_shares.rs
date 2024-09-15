use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{transfer, Mint, Token, TokenAccount, Transfer}};

use crate::{InvestmentFund, ShareRedemption};

#[derive(Accounts)]
#[instruction(fund_name: String, manager: Pubkey)]
pub struct CancelRedeemShares<'info> {
    #[account(mut)]
    pub investor: Signer<'info>,
    #[account(
        seeds = [
            b"fund", 
            fund_name.as_bytes(), 
            manager.as_ref()
        ],
        bump = investment_fund.bump,
    )]
    pub investment_fund: Box<Account<'info, InvestmentFund>>,
    #[account(
        mut,
        close = investor,
        seeds = [
            b"redemption", 
            investment_fund.key().as_ref(), 
            investor.key().as_ref(), 
        ],
        bump = share_redemption.bump,

    )]
    pub share_redemption: Box<Account<'info, ShareRedemption>>,
    #[account(
        seeds = [
            b"shares", 
            investment_fund.key().as_ref()
        ],
        bump = investment_fund.shares_mint_bump.unwrap(),
    )]
    pub shares_mint: Box<Account<'info, Mint>>,
    #[account(
        mut,
        associated_token::mint = shares_mint,
        associated_token::authority = investor
    )]
    pub investor_fund_ata: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = shares_mint,
        associated_token::authority = investment_fund,
        constraint = redemption_vault.key() == investment_fund.redemption_vault.unwrap()
    )]
    pub redemption_vault: Box<Account<'info, TokenAccount>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> CancelRedeemShares<'info> {
    pub fn cancel_redeem_shares(
        &mut self,
        manager: Pubkey
    ) -> Result<()> {

        let seeds = &[
            b"fund", 
            self.investment_fund.name.as_bytes(), 
            manager.as_ref(),
            &[self.investment_fund.bump]
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.redemption_vault.to_account_info(),
            to: self.investor_fund_ata.to_account_info(),
            authority: self.investment_fund.to_account_info(),
        };
        let cpi_context = CpiContext::new_with_signer(
            cpi_program, 
            cpi_accounts,
            signer_seeds
        );

        transfer(cpi_context, self.share_redemption.shares_to_redeem)?;

        Ok(())
    }
}