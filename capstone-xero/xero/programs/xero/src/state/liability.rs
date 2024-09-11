use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum LiabilityCategory {
    AccountsPayable,
    LoansPayable,
    WagesPayable,
    TaxesPayable,
    Other
}

#[account]
pub struct Liability {
    pub bump: u8,
    pub investment_fund: Pubkey,
    pub liability_amount: u64,
    pub creation_date: i64,
    pub category: LiabilityCategory,
    pub identifier: String,
}

impl Liability {
    pub fn get_space(identifier: &str) -> usize {
        return 8
            + 1
            + 32
            + 8
            + 8
            + 1
            + 4 + identifier.len()

    }
}