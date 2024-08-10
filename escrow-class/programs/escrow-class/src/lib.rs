use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use instructions::*;
use state::*;

declare_id!("gGcRun3friTWnQfwLUYS4XJb2VbrS72JzppxAiiYYJt");

#[program]
pub mod escrow_class {
    use super::*;

    pub fn initialize(ctx: Context<Make>, seed: u64, receive: u64, deposit: u64) -> Result<()> {
        ctx.accounts.init_escrow(seed, receive, &ctx.bumps)?;
        ctx.accounts.deposit(deposit)
    }

    pub fn make_exchange(ctx: Context<Take>) -> Result<()> {
        ctx.accounts.deposit()?;
        ctx.accounts.wihdraw_and_close_vault()
    }

    pub fn cancel_escrow(ctx: Context<Cancel>, _seed: u64) -> Result<()> {
        ctx.accounts.cancel_escrow()
    }
}
