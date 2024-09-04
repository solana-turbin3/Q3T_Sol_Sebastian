use anchor_lang::prelude::*;

#[account]
pub struct Investment {
    pub bump: u8,
    pub investment_fund: Pubkey,
    pub invested_amount: f64,
    pub interest_rate: f64,
    pub init_date: i64,
    pub maturity_date: i64,
    pub identifier: String
}

impl Investment {
    pub fn get_size(identifier: &str) -> usize {
        return 8
            + 32
            + 1
            + 8
            + 8
            + 8
            + 8
            + identifier.len()
    }
}