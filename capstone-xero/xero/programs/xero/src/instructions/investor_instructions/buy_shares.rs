use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken, 
    token::{
        mint_to, 
        transfer, 
        Mint, 
        MintTo, 
        Token, 
        TokenAccount, 
        Transfer
    }
};

use crate::{errors::FundError, InvestmentFund, SCALING_FACTOR};

#[derive(Accounts)]
#[instruction(fund_name: String, manager: Pubkey)]
pub struct BuyShares<'info> {
    #[account(mut)]
    pub investor: Signer<'info>,
    #[account(
        mut,
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
        seeds = [
            b"shares", 
            investment_fund.key().as_ref()
        ],
        bump = investment_fund.shares_mint_bump.unwrap(),
    )]
    pub shares_mint: Box<Account<'info, Mint>>,
    #[account(
        init_if_needed,
        payer = investor,
        associated_token::mint = shares_mint,
        associated_token::authority = investor
    )]
    pub investor_fund_ata: Box<Account<'info, TokenAccount>>,
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

impl<'info> BuyShares<'info> {
    pub fn buy_shares(
        &mut self,
        invested_amount: u64,
        manager: Pubkey
    ) -> Result<()> {

        let shares_outstanding = self.shares_mint.supply;

        let fund_share_value = self.investment_fund.get_share_value(shares_outstanding)?;

        let number_of_shares = invested_amount
            .checked_mul(SCALING_FACTOR)
            .and_then(|amount| amount.checked_div(fund_share_value))
            .ok_or(FundError::ArithmeticError)?;

        // we transfer the fund shares to the investor
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = MintTo {
            to: self.investor_fund_ata.to_account_info(),
            mint: self.shares_mint.to_account_info(),
            authority: self.investment_fund.to_account_info()
        };
        let seeds = &[
            b"fund", 
            self.investment_fund.name.as_bytes(), 
            manager.as_ref(),
            &[self.investment_fund.bump]
        ];
        let signer_seeds = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(
            cpi_program.clone(), 
            cpi_accounts, 
            signer_seeds
        );
        mint_to(
            cpi_ctx, 
            number_of_shares 
        )?;

        // we transfer the stablecoin to the fund vault
        let cpi_accounts = Transfer {
            from: self.investor_stablecoin_ata.to_account_info(),
            to: self.fund_stablecoin_vault.to_account_info(),
            authority: self.investor.to_account_info()
        };
        let cpi_context = CpiContext::new(
            cpi_program, 
            cpi_accounts
        );
        transfer(
            cpi_context, 
            invested_amount
        )?;

        // update fund assets
        self.investment_fund.assets_amount = self.investment_fund.assets_amount
            .checked_add(invested_amount)
            .ok_or(FundError::ArithmeticError)?;

        Ok(())
    }
}