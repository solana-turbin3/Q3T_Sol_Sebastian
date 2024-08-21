use anchor_lang::prelude::*;
pub mod state;
pub mod instructions;
pub mod  error;
pub use instructions::*;

declare_id!("563ZsyfeCDvLEE84usTKY6VMuTrd112yjPeHpUwSzgF9");

#[program]
pub mod rng_class {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>, 
        amount: u64
    ) -> Result<()> {
        ctx.accounts.initialize(amount)
    }

    pub fn place_bet(
        ctx: Context<PlaceBet>, 
        seed: u128, 
        roll: u8, 
        amount: u64
    ) -> Result<()> {
        ctx.accounts.create_bet(seed, roll, amount, &ctx.bumps)
    }


}
