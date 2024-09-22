import { 
    Keypair, 
    Connection, 
    PublicKey,
} from '@solana/web3.js';
import {
    getOrCreateAssociatedTokenAccount,
    mintTo,
} from '@solana/spl-token';
import * as fs from 'fs';

async function main() {
    const receiver = new PublicKey("5D5g1GojkFXwpFvrRfoXaP4MgawaBRKY7BNHKCAnucXZ");
    const mint = new PublicKey("5zrWhzen736KyvbGbWYcYJTpMXnudeptuxMiANhRD3np")

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const secretKeyString = fs.readFileSync('/home/sebatustra/my-solana-wallet/my-keypair.json', 'utf8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));

    const devKeypair = Keypair.fromSecretKey(secretKey);

    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        devKeypair,
        mint,
        receiver
    );

    const amount = 1_000 * 1_000_000;

    console.log('Minting', amount, 'tokens to', receiverTokenAccount.address.toBase58());

    await mintTo(
        connection,
        devKeypair,
        mint,
        receiverTokenAccount.address,
        devKeypair.publicKey,
        amount
    );

    console.log('Tokens minted successfully');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
  });