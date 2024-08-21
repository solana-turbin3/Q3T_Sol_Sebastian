use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{mint_to, transfer_checked, Mint, MintTo, Token, TokenAccount, TransferChecked},
};

use crate::state::{Listing, Marketplace};

#[derive(Accounts)]
#[instruction(name: String)]
pub struct Purchase<'info> {
    #[account(mut)]
    pub taker: Signer<'info>,
    /// CHECK: This is the account that receives the rent from the closed listing
    #[account(mut)]
    pub maker: UncheckedAccount<'info>,
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
        has_one = maker,
        has_one = mint
    )]
    pub listing: Account<'info, Listing>,
    #[account(
        init_if_needed,
        payer = taker,
        associated_token::mint = mint,
        associated_token::authority = taker
    )]
    pub taker_ata: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = marketplace,
        close = maker
    )]
    pub vault: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = rewards,
        associated_token::authority = maker
    )]
    pub maker_rewards_ata: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"rewards", marketplace.key().as_ref()],
        bump = marketplace.rewards_bump,
    )]
    pub rewards: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> Purchase<'info> {
    pub fn make_purchase(&mut self, name: String) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.taker.to_account_info(),
            to: self.maker.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, self.listing.price)?;

        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked {
            to: self.taker_ata.to_account_info(),
            mint: self.mint.to_account_info(),
            authority: self.marketplace.to_account_info(),
            from: self.vault.to_account_info(),
        };

        let seeds = &[b"marketplace", name.as_bytes(), &[self.marketplace.bump]];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            cpi_program.clone(), 
            cpi_accounts, 
            signer_seeds
        );

        transfer_checked(cpi_ctx, 1, self.mint.decimals)?;

        let cpi_accounts = MintTo {
            mint: self.rewards.to_account_info(),
            to: self.maker_rewards_ata.to_account_info(),
            authority: self.marketplace.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            cpi_program, 
            cpi_accounts, 
            signer_seeds
        );

        mint_to(cpi_ctx, 1 * 10u64.pow(self.rewards.decimals as u32))?;

        Ok(())
    }
}
