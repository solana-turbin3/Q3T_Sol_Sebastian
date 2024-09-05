use anchor_lang::prelude::*;

#[error_code]
pub enum FundError {
    #[msg("string provided is too long or too short")]
    InvalidStringLength,
    #[msg("share value invalid for mint initialization")]
    InvalidInitialShareValue
}