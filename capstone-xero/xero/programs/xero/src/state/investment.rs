use anchor_lang::prelude::*;

#[account]
pub struct Investment {
    pub bump: u8,
    pub investment_fund: Pubkey,
    pub invested_amount: u64,
    pub interest_rate: u64,
    pub init_date: i64,
    pub maturity_date: i64,
    pub identifier: String
}

impl Investment {
    pub fn get_space(identifier: &str) -> usize {
        return 8
            + 1
            + 32
            + 8
            + 8
            + 8
            + 8
            + 4 + identifier.len()
    }
}