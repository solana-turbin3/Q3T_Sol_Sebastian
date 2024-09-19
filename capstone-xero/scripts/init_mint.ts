import { 
    Keypair, 
    Connection, 
    PublicKey,
    sendAndConfirmTransaction,
    Transaction
  } from '@solana/web3.js';
  import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    TOKEN_PROGRAM_ID
  } from '@solana/spl-token';
  import * as fs from 'fs';
  
  async function main() {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
    const secretKeyString = fs.readFileSync('/home/sebatustra/my-solana-wallet/my-keypair.json', 'utf8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const fromWallet = Keypair.fromSecretKey(secretKey);
  
    console.log('Creating mint...');
    
    const mint = await createMint(
      connection,
      fromWallet,
      fromWallet.publicKey,
      null,
      6
    );
  
    console.log('Mint address:', mint.toBase58());
  
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    );
  
    // Specify the amount to mint
    const amount = 1_000_000_000; // 1 token with 9 decimal places
  
    console.log('Minting', amount, 'tokens to', fromWallet.publicKey.toBase58());
  
    // Mint the tokens to the "fromTokenAccount" we just created
    await mintTo(
      connection,
      fromWallet,
      mint,
      fromTokenAccount.address,
      fromWallet.publicKey,
      amount
    );
  
    console.log('Tokens minted successfully');
  }
  
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });