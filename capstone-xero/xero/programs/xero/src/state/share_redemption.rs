use anchor_lang::prelude::*;

#[account]
pub struct ShareRedemption {
    pub bump: u8,
    pub investor: Pubkey,
    pub investment_fund: Pubkey,
    pub redemption_vault: Pubkey,
    pub shares_to_redeem: u64,
    pub creation_date: i64,
    pub share_value: u64
}

impl ShareRedemption {
    pub fn get_space() -> usize {
        return 8
            + 1
            + 32
            + 32
            + 32
            + 8
            + 8
            + 8
    }
}