use anchor_lang::prelude::*;

#[account]
pub struct WhitelistAccount {
    pub bump: u8
}

impl WhitelistAccount {
    pub const LEN: usize = 8 + 1;
}