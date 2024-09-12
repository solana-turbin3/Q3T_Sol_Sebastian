use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken, 
    token::{
        Mint, 
        Token, 
        TokenAccount, 
        Transfer, 
        transfer
    }
};

use crate::{InvestmentFund, ShareRedemption};

#[derive(Accounts)]
#[instruction(fund_name: String, manager: Pubkey)]
pub struct RedeemShares<'info> {
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
        init,
        seeds = [
            b"redemption", 
            investment_fund.key().as_ref(), 
            investor.key().as_ref(), 
            // Clock::get().unwrap().unix_timestamp.to_le_bytes().as_ref()
        ],
        bump,
        payer = investor,
        space = ShareRedemption::get_space(),
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

impl<'info> RedeemShares<'info> {
    pub fn redeem_shares(
        &mut self,
        bumps: &RedeemSharesBumps,
        shares_to_redeem: u64
    ) -> Result<()> {

        let shares_outstanding = self.shares_mint.supply;

        let share_value = self.investment_fund.get_share_value(shares_outstanding)?;

        self.share_redemption.set_inner(ShareRedemption {
            bump: bumps.share_redemption,
            investor: self.investor.key(),
            investment_fund: self.investment_fund.key(),
            shares_to_redeem,
            creation_date: Clock::get()?.unix_timestamp,
            share_value
        });

        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.investor_fund_ata.to_account_info(),
            to: self.redemption_vault.to_account_info(),
            authority: self.investor.to_account_info(),
        };
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_context, shares_to_redeem)?;

        Ok(())
    }
}