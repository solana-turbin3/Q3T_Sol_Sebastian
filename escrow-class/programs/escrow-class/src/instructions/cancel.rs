use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    transfer_checked, 
    Mint, 
    TokenAccount, 
    TokenInterface, 
    CloseAccount, 
    TransferChecked, 
    close_account
};
use crate::Escrow;

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Cancel<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    pub mint_a: InterfaceAccount<'info, Mint>,
    pub mint_b: InterfaceAccount<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = mint_a,
        associated_token::authority = maker,
    )]
    pub maker_ata_a: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"escrow", maker.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump,
        has_one = mint_a,
        has_one = mint_b,
        has_one = maker,
        close = maker
    )]
    pub escrow: Account<'info, Escrow>,
    #[account(
        mut,
        associated_token::mint = mint_a,
        associated_token::authority = escrow,
        
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

impl<'info> Cancel<'info> {
    pub fn cancel_escrow(&mut self) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked {
            from: self.vault.to_account_info(),
            to: self.maker_ata_a.to_account_info(),
            authority: self.escrow.to_account_info(),
            mint: self.mint_a.to_account_info()
        };

        let binding = self.escrow.seed.to_le_bytes();
        
        let seeds = &[
            b"escrow",
            self.maker.to_account_info().key.as_ref(),
            binding.as_ref(),
            &[self.escrow.bump]
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            cpi_program.clone(), 
            cpi_accounts, 
            signer_seeds
        );

        transfer_checked(
            cpi_ctx, 
            self.vault.amount,
            self.mint_a.decimals
        )?;

        let cpi_accounts = CloseAccount {
            account: self.vault.to_account_info(),
            destination: self.maker.to_account_info(),
            authority: self.escrow.to_account_info()
        };


        let cpi_context = CpiContext::new_with_signer(
            cpi_program, 
            cpi_accounts, 
            signer_seeds
        );

        close_account(cpi_context)
    }

}

