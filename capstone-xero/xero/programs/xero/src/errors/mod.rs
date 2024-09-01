use anchor_lang::prelude::*;

#[error_code]
pub enum FundError {
    #[msg("name for investment fund is too long or too short")]
    InvalidNameLength
}