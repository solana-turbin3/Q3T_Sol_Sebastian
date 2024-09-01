use anchor_lang::prelude::*;
mod state;
mod instructions;
mod errors;

declare_id!("FpGgmLziQeTizXoyRm2ihaFrm1xtu5gx3M9XCK9ye3pU");

#[program]
pub mod xero {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
