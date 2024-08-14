use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
use instructions::*;

declare_id!("E4hk9WgWo7dxFHfnE9U7nfMskUsMdkQr3LFZ6KX2ciFm");
#[program]
pub mod staking_class {
    use super::*;

    pub fn initialize_user(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize_user(&ctx.bumps)
    }

    pub fn initialize_config(
        ctx: Context<InitializeConfig>, 
        points_per_stake: u8, 
        max_stake: u8, 
        freeze_period: u32
    ) -> Result<()> {
        ctx.accounts.initialize_config(
            points_per_stake, 
            max_stake, 
            freeze_period,
            &ctx.bumps
        )
    }

    pub fn stake(ctx: Context<Stake>) -> Result<()> {
        ctx.accounts.stake(&ctx.bumps)
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        ctx.accounts.unstake()
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        ctx.accounts.claim()
    }
}