use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken, 
    token::{
        Mint, 
        Token, 
        TokenAccount, 
        transfer, 
        Transfer, 
        Burn, 
        burn
    }
};

use crate::{errors::FundError, InvestmentFund, ShareRedemption, SCALING_FACTOR};

#[derive(Accounts)]
#[instruction(fund_name: String)]
pub struct ProcessShareRedemption<'info> {
    #[account(mut)]
    pub manager: Signer<'info>,
    /// CHECK:
    #[account(
        mut,
        constraint = investor.key() == share_redemption.investor,
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
        mut,
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
        associated_token::authority = investment_fund,
        constraint = redemption_vault.key() == investment_fund.redemption_vault.unwrap()
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

impl<'info> ProcessShareRedemption<'info> {
    pub fn process_share_redemption(
        &mut self,
    ) -> Result<()> {

        let stablecoin_to_transfer = self.share_redemption.shares_to_redeem
            .checked_mul(self.share_redemption.share_value)
            .and_then(|amount| amount.checked_div(SCALING_FACTOR))
            .ok_or(FundError::ArithmeticError)?;

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
            to: self.investor_stablecoin_ata.to_account_info(),
            authority: self.investment_fund.to_account_info()
        };
        let cpi_context = CpiContext::new_with_signer(
            cpi_program.clone(), 
            cpi_accounts, 
            signer_seeds
        );
        transfer(cpi_context, stablecoin_to_transfer)?;

        let cpi_accounts = Burn {
            mint: self.shares_mint.to_account_info(),
            from: self.redemption_vault.to_account_info(),
            authority: self.investment_fund.to_account_info(),
        };
        let cpi_context = CpiContext::new_with_signer(
            cpi_program, 
            cpi_accounts, 
            signer_seeds
        );
        burn(cpi_context, self.share_redemption.shares_to_redeem)?;

        Ok(())
    }
}