use anchor_lang::prelude::*;

pub mod state;
pub mod contexts;
pub mod errors;

pub use contexts::*;

declare_id!("3Bccg5YFoKFv9wZV3ZVmXYvrG1wBe8higMV2f9zG1gK4");

#[program]
pub mod marketplace_class {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, fee: u16) -> Result<()> {
        ctx.accounts.init(&ctx.bumps, name, fee)
    }

    pub fn add_whitelist(ctx: Context<Whitelist>, _name: String) -> Result<()> {
        ctx.accounts.add_whitelist(&ctx.bumps)
    }

    pub fn list(ctx: Context<List>, price: u64, name: String) -> Result<()> {
        ctx.accounts.create_list(&ctx.bumps, price, name)
    }

    pub fn purchase(_ctx: Context<Purchase>) -> Result<()> {

        Ok(())
    }

}
