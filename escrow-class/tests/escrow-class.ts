import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EscrowClass } from "../target/types/escrow_class";
import * as token from "@solana/spl-token";
import { expect } from "chai";

describe("escrow-class", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env()
    const connection = provider.connection;
    anchor.setProvider(provider);

    const program = anchor.workspace.EscrowClass as Program<EscrowClass>;

    const god = anchor.web3.Keypair.generate();

    const decimals = 6;
    const escrowSeed = 999;
    const receive = 5;
    const deposit = 6;

    const maker = anchor.web3.Keypair.generate();
    const taker = anchor.web3.Keypair.generate();

    let mintA: anchor.web3.PublicKey;
    let mintB: anchor.web3.PublicKey;

    let makerAtaA: anchor.web3.PublicKey;
    let makerAtaB: anchor.web3.PublicKey;

    let takerAtaB: anchor.web3.PublicKey;
    let takerAtaA: anchor.web3.PublicKey;

    let escrow: anchor.web3.PublicKey;
    let vault: anchor.web3.PublicKey;

    before(async () => {

        const airdropForGod = await connection.requestAirdrop(
            god.publicKey,
            100 * anchor.web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(airdropForGod, "confirmed");

        const airdropForMaker = await connection.requestAirdrop(
            maker.publicKey,
            10 * anchor.web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(airdropForMaker, "confirmed");

        const airdropForTaker = await connection.requestAirdrop(
            taker.publicKey,
            10 * anchor.web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(airdropForTaker, "confirmed");

        mintA = await token.createMint(
            connection,
            god,
            god.publicKey,
            null,
            decimals
        );

        mintB = await token.createMint(
            connection,
            god,
            god.publicKey,
            null,
            decimals
        );

        makerAtaA = (await token.getOrCreateAssociatedTokenAccount(
            connection,
            god,
            mintA,
            maker.publicKey
        )).address;

        takerAtaB = (await token.getOrCreateAssociatedTokenAccount(
            connection,
            god,
            mintB,
            taker.publicKey
        )).address;

        await token.mintTo(
            connection,
            god,
            mintA,
            makerAtaA,
            god,
            10 * (10 ** decimals)
        );

        await token.mintTo(
            connection,
            god,
            mintB,
            takerAtaB,
            god,
            10 * (10 ** decimals)
        );
    });

    it("It initializes the vault and escrow account", async () => {
        await program.methods
            .initialize(
                new anchor.BN(escrowSeed),
                new anchor.BN(receive * (10 ** decimals)),
                new anchor.BN(deposit * (10 ** decimals)),
            )
            .accounts({
                maker: maker.publicKey,
                mintA: mintA,
                mintB: mintB,
                tokenProgram: token.TOKEN_PROGRAM_ID
            })
            .signers([
                maker
            ])
            .rpc();

        const escrowAccount = (await program.account
            .escrow.all())[0];

        escrow = escrowAccount.publicKey;
        vault = token.getAssociatedTokenAddressSync(
            mintA,
            escrow,
            true
        );

        const vaultInfo = await token.getAccount(
            connection, 
            vault, 
            "confirmed"
        );

        const makerAtaAInfo = await token.getAccount(
            connection,
            makerAtaA,
            "confirmed"
        );

        expect(Number(escrowAccount.account.seed))
            .to.equal(escrowSeed);

        expect(escrowAccount.account.maker.toString())
            .to.equal(maker.publicKey.toString());

        expect(Number(vaultInfo.amount))
            .to.equal(deposit * (10 ** decimals));

        expect(Number(makerAtaAInfo.amount))
            .to.equal((10 * (10 ** decimals)) - (deposit * (10 ** decimals)));
    });

    it("it finalizes the escrow", async () => {
        await program.methods
            .makeExchange()
            .accounts({
                taker: taker.publicKey,
                escrow,
                tokenProgram: token.TOKEN_PROGRAM_ID,

            })
            .signers([
                taker
            ])
            .rpc();

        makerAtaB = (await token.getOrCreateAssociatedTokenAccount(
            connection,
            god,
            mintB,
            maker.publicKey
        )).address;

        const makerAtaBInfo = await token.getAccount(
            connection,
            makerAtaB,
            "confirmed"
        );

        takerAtaA = (await token.getOrCreateAssociatedTokenAccount(
            connection,
            god,
            mintA,
            taker.publicKey
        )).address;

        const takerAtaAInfo = await token.getAccount(
            connection,
            takerAtaA,
            "confirmed"
        );

        expect(Number(makerAtaBInfo.amount))
            .to.equal(Number(receive * (10 ** decimals)))

        expect(Number(takerAtaAInfo.amount))
            .to.equal(Number(deposit * (10 ** decimals)))
    });

});
