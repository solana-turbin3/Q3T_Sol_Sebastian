use anchor_lang::prelude::*;

#[account]
pub struct InvestmentFund {
    pub bump: u8,
    pub assets_amount: u64,
    pub liabilities_amount: u64,
    pub shares_mint_bump: Option<u8>,
    pub manager: Pubkey,
    pub stablecoin_mint: Pubkey,
    pub name: String,
}

impl InvestmentFund {
    pub fn get_space(name: &str) -> usize {
        return 8
            + 1
            + 8
            + 8
            + 1 + 1
            + 32
            + 32
            + 4 + name.len()
    }
}