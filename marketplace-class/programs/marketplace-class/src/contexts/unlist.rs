use anchor_lang::prelude::*;
use anchor_spl::token::{
    close_account, transfer_checked, CloseAccount, Mint, Token, TokenAccount, TransferChecked,
};

use crate::state::{Listing, Marketplace};

#[derive(Accounts)]
#[instruction(name: String)]
pub struct Unlist<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
        seeds = [b"marketplace", name.as_bytes()],
        bump = marketplace.bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        mut,
        close = maker,
        seeds = [b"listing", marketplace.key().as_ref(), mint.key().as_ref()],
        bump = listing.bump,
        has_one = mint,
        has_one = maker,
    )]
    pub listing: Account<'info, Listing>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = marketplace,
    )]
    pub vault: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = maker
    )]
    pub mint_ata: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

impl<'info> Unlist<'info> {
    pub fn unlist(&mut self, name: String) -> Result<()> {

        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked {
            to: self.mint_ata.to_account_info(),
            from: self.vault.to_account_info(),
            mint: self.mint.to_account_info(),
            authority: self.marketplace.to_account_info()
        };

        let seeds = &[
            b"marketplace",
            name.as_bytes(),
            &[self.marketplace.bump]
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            cpi_program.clone(), 
            cpi_accounts, 
            signer_seeds
        );

        transfer_checked(cpi_ctx, 1, self.mint.decimals)?;

        let cpi_accounts = CloseAccount {
            account: self.vault.to_account_info(),
            destination: self.maker.to_account_info(),
            authority: self.marketplace.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            cpi_program, 
            cpi_accounts, 
            signer_seeds
        );

        close_account(cpi_ctx)?;

        Ok(())
    }
}
