import { 
    Keypair, 
    Connection, 
  } from '@solana/web3.js';
  import {
    createMint,
  } from '@solana/spl-token';
  import * as fs from 'fs';

  // mint address: 5zrWhzen736KyvbGbWYcYJTpMXnudeptuxMiANhRD3np
  
  async function main() {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
    const secretKeyString = fs.readFileSync('/home/sebatustra/my-solana-wallet/my-keypair.json', 'utf8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));

    const devKeypair = Keypair.fromSecretKey(secretKey);
  
    console.log('Creating mint...');
    
    const mint = await createMint(
      connection,
      devKeypair,
      devKeypair.publicKey,
      null, 
      6
    );
  
    console.log('Mint address base58:', mint.toBase58());
  }
  
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });