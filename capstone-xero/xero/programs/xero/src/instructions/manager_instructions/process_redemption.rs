use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{Mint, Token, TokenAccount}};

use crate::{InvestmentFund, ShareRedemption};

#[derive(Accounts)]
#[instruction(fund_name: String)]
pub struct ProcessShareRedemption<'info> {
    #[account(mut)]
    pub manager: Signer<'info>,
    /// CHECK:
    #[account(
        mut,
        constraint = investor.key() == share_redemption.investor
    )]
    pub investor: UncheckedAccount<'info>,
    #[account(
        seeds = [
            b"fund", 
            fund_name.as_bytes(), 
            manager.key().as_ref()
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
            investor.key().as_ref()
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
        close = investor,
        associated_token::mint = shares_mint,
        associated_token::authority = investment_fund,
        constraint = redemption_vault.key() == share_redemption.redemption_vault
    )]
    pub redemption_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = stablecoin_mint,
        associated_token::authority = investor
    )]
    pub investor_stablecoin_ata: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        constraint = stablecoin_mint.key() == investment_fund.stablecoin_mint
    )]
    pub stablecoin_mint: Box<Account<'info, Mint>>,
    #[account(
        mut,
        associated_token::mint = stablecoin_mint,
        associated_token::authority = investment_fund
    )]
    pub fund_stablecoin_vault: Box<Account<'info, TokenAccount>>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}