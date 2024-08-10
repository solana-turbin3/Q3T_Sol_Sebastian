use anchor_lang::prelude::*;

pub mod contexts;
pub mod state;

pub use contexts::*;
declare_id!("9VKLYW8BwkK9P9vs1AkfvtGh7pCiD8oLE1S1GNThwGVw");

#[program]
pub mod amm_class {
    use super::*;

    // Ininitialize pool
    pub fn initialize(
        ctx: Context<Initialize>, 
        seed: u64, 
        fee: u16,
        amount_x: u64,
        amount_y: u64
    ) -> Result<()> {
        ctx.accounts.save_config(
            seed, 
            fee, 
            ctx.bumps.config, 
            ctx.bumps.mint_lp
        )?;
        ctx.accounts.deposit(amount_x, true)?;
        ctx.accounts.deposit(amount_y, false)?;
        ctx.accounts.mint_lp_tokens(amount_x, amount_y)
    }

    // //Deposit liquidity to mint LP tokens
    // pub fn deposit(
    //     ctx: Context<Deposit>, 
    //     amount: u64, 
    //     max_x: u64, 
    //     max_y: u64
    // ) -> Result<()> {
    //     // deposit_token_x
    //     // deposit_token_y
    //     // they both go into the same function deposit_tokens(amount)

    //     // mint lp_token(amount)

    //     Ok(())
    // }

    // // burn LP tokens to withdraw liquidity
    // pub fn withdraw(
    //     ctx: Context<Withdraw>, 
    //     amount: u64, 
    //     min_x: u64, 
    //     min_y: u64
    // ) -> Result<()> {
    //     // withdraw tokens

    //     // burn_lp_token(amount)

    //     Ok(())
    // }


    // pub fn swap(
    //     ctx: Context<Swap>, 
    //     amount: u64, 
    //     min_receive: u64, 
    //     is_x: bool
    // ) -> Result<()> {
    //     // deposit_token()
    //     // withdraw_token()
    //     Ok(())
    // }
}