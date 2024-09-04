use anchor_lang::prelude::*;

#[account]
pub struct InvestmentFund {
    pub bump: u8,
    pub assets_amount: f64,
    pub liabilities_amount: f64,
    pub share_value: f64,
    pub shares_mint_bump: Option<u8>,
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
            + 1 + 1
            + 32
            + name.len()
    }
}