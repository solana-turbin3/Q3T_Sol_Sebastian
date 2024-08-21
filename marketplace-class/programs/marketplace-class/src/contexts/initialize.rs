use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

use crate::state::Marketplace;
use crate::errors::MarketplaceError;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        space = Marketplace::LEN,
        seeds = [b"marketplace", name.as_bytes()],
        bump
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        init,
        payer = admin,
        seeds = [b"rewards", marketplace.key().as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = marketplace
    )]
    pub rewards: Account<'info, Mint>,
    #[account(
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump
    )]
    pub treasury: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl<'info> Initialize<'info> {
    pub fn init(
        &mut self, 
        bumps: &InitializeBumps, 
        name: String, 
        fee: u16
    ) -> Result<()> {

        require!(name.len() > 3 && name.len() <= 32, MarketplaceError::InvalidNameLength);

        self.marketplace.set_inner(Marketplace {
            admin: self.admin.key(),
            fee,
            bump: bumps.marketplace,
            treasury_bump: bumps.treasury,
            rewards_bump: bumps.rewards,
            name
        });

        Ok(())
    }
}
