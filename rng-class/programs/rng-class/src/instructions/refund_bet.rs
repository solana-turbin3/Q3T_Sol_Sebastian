use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};

use crate::state::Bet;

#[derive(Accounts)]
pub struct RefundBet<'info> {
    pub house: SystemAccount<'info>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", house.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,
    #[account(
        mut,
        close = player,
        seeds = [b"bet", vault.key().as_ref(), bet.seed.to_le_bytes().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>,
    pub system_program: Program<'info, System>
}

impl<'info> RefundBet<'info> {
    pub fn refund_bet(
        &mut self,
        bumps: &RefundBetBumps
    ) -> Result<()> {

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.house.to_account_info(),
            to: self.vault.to_account_info()
        };

        let seeds = &[b"vault", &self.house.key().to_bytes()[..], &[bumps.vault]];

        let signer_seeds = &[&seeds[..]][..];
        let cpi_ctx = CpiContext::new_with_signer(
            cpi_program, 
            cpi_accounts,
            signer_seeds
        );

        transfer(cpi_ctx, self.bet.amount)?;
        Ok(())
    }
}