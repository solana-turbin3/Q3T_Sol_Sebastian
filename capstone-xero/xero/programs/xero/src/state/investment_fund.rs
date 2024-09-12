use anchor_lang::prelude::*;

use crate::errors::FundError;

#[account]
pub struct InvestmentFund {
    pub bump: u8,
    pub assets_amount: u64,
    pub liabilities_amount: u64,
    pub shares_mint_bump: Option<u8>,
    pub redemption_vault: Option<Pubkey>,
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
            + 1 + 32
            + 32
            + 32
            + 4 + name.len()
    }

    pub fn get_share_value(
        &self, 
        shares_outstanding: u64
    ) -> Result<u64> {
        self.assets_amount.checked_sub(self.liabilities_amount)
            .and_then(|amount| amount.checked_mul(1_000_000))
            .and_then(|amount| amount.checked_div(shares_outstanding))
            .ok_or(FundError::ArithmeticError.into())
    }
}