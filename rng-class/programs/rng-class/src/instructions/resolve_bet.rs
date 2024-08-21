use anchor_lang::prelude::*;

use crate::state::Bet;

#[derive(Accounts)]
pub struct ResolveBet<'info> {
    pub house: SystemAccount<'info>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", house.key().as_ref()],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    #[account(
        mut,
        close = player,
        seeds = [b"bet", vault.key().as_ref(), bet.seed.to_le_bytes().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>,
    #[account(
        address = solana_program::sysvar::instructions::ID
    )]
    pub instructions_sysvar: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> ResolveBet<'info> {
    pub fn resolve_bet(
        &mut self, 
        sig: &[u8],
        bumps: &ResolveBetBumps
    ) -> Result<()> {

        

        Ok(())
    }
}