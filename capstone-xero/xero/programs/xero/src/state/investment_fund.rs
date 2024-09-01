use anchor_lang::prelude::*;

#[account]
pub struct InvestmentFund {
    pub bump: u8,
    pub assets_amount: i64,
    pub liabilities_amount: i64,
    pub share_value: i64,
    // pub shares_mint: Pubkey,
    pub shares_mint_bump: u8,
    pub manager: Pubkey,
    pub name: String,
}

impl InvestmentFund {
    pub fn get_size(name: &str) -> usize {
        return 8
            + 1
            + 8
            + 8
            + 8
            // + 32
            + 1
            + 32
            + name.len()
    }
}