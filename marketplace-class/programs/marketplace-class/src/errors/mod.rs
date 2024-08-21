use anchor_lang::prelude::*;

#[error_code]
pub enum MarketplaceError {
    #[msg("name for marketplace is too long or too short")]
    InvalidNameLength
}