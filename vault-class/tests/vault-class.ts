import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VaultClass } from "../target/types/vault_class";
import { expect } from "chai";

describe("vault-class", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.VaultClass as Program<VaultClass>;

  const user = anchor.web3.Keypair.generate()

  const [statePda, stateBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("state"),
      user.publicKey.toBuffer()
    ],
    program.programId
  );

  const [vauldPda, vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      statePda.toBuffer()
    ],
    program.programId
  );

  const airdropAmount = 10000000000

  it("The vault is initialized correctly", async () => {
    let airdropSignature = await connection.requestAirdrop(
      user.publicKey,
      airdropAmount
    );

    await connection.confirmTransaction(airdropSignature, "confirmed");

    await program.methods
      .initialize()
      .accounts({
        user: user.publicKey
      })
      .signers([
        user
      ])
      .rpc();

    const vaultState = await program.account
      .vaultState
      .fetch(statePda);

    expect(vaultState.stateBump).to.equal(stateBump);
    expect(vaultState.vaultBump).to.equal(vaultBump);
  });

  it("The vault processes deposits", async () => {
    await program.methods
    .deposit(new anchor.BN(airdropAmount / 10))
    .accounts({
      user: user.publicKey,
    })
    .signers([
      user
    ])
    .rpc();

    const vaultBalance = await connection.getBalance(vauldPda);

    expect(vaultBalance).to.equal(airdropAmount / 10)
  })

  it("The vault processes withdrawals", async () => {
    await program.methods
      .withdraw(new anchor.BN(airdropAmount / 10))
      .accounts({
        user: user.publicKey,
      })
      .signers([
        user
      ])
      .rpc();

    const vaultBalance = await connection.getBalance(vauldPda);

    expect(vaultBalance).to.equal(0)
  })



});
