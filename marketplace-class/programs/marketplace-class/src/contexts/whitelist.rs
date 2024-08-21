use anchor_lang::prelude::*;
use anchor_spl::{metadata::{MasterEditionAccount, Metadata, MetadataAccount}, token::Mint};

use crate::state::{Marketplace, WhitelistAccount};

#[derive(Accounts)]
#[instruction(name: String)]
pub struct Whitelist<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        seeds = [b"marketplace", name.as_bytes()],
        bump = marketplace.bump,
        constraint = marketplace.admin == admin.key()
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        init,
        seeds = [b"whitelist", mint.key().as_ref()],
        bump,
        payer = admin,
        space = WhitelistAccount::LEN,
    )]
    pub whitelist: Account<'info, WhitelistAccount>,
    pub mint: Account<'info, Mint>,
    pub collection: Account<'info, Mint>,
    #[account(
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            mint.key().as_ref()
        ],
        seeds::program = metadata_program.key(),
        bump,
        constraint = metadata.collection.as_ref().unwrap().key.as_ref() == collection.key().as_ref(),
        constraint = metadata.collection.as_ref().unwrap().verified == true,
    )]
    pub metadata: Account<'info, MetadataAccount>,
    #[account(
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            mint.key().as_ref(),
            b"edition"
        ],
        seeds::program = metadata_program.key(),
        bump,
    )]
    pub edition: Account<'info, MasterEditionAccount>,
    pub system_program: Program<'info, System>,
    pub metadata_program: Program<'info, Metadata>,
}

impl<'info> Whitelist<'info> {
    pub fn add_whitelist(&mut self, bumps: &WhitelistBumps) -> Result<()> {

        self.whitelist.set_inner(WhitelistAccount {
            bump: bumps.whitelist
        });

        Ok(())
    }
}