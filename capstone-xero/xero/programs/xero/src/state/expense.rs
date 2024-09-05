use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ExpenseCategory {
    LegalFees,
    FundFees,
    OtherFees
}

#[account]
pub struct Expense {
    pub bump: u8,
    pub investment_fund: Pubkey,
    pub expense_amount: u64,
    pub creation_date: i64,
    pub category: ExpenseCategory,
    pub identifier: String,
}

impl Expense {
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