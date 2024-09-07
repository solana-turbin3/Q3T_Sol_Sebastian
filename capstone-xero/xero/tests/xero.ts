import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Xero } from "../target/types/xero";
import * as token from "@solana/spl-token";
import { expect } from "chai";

const scalingFactor = 10 ** 6;

const fund = {
  name: "Fondo Sigma",
  initialShares: 1_000_000 * scalingFactor,
  initialAssets: 1_000_000 * scalingFactor,
  initialLiabilities: 0 * scalingFactor,
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

const afterTomorrow = new Date();
tomorrow.setDate(afterTomorrow.getDate() + 2);
tomorrow.setHours(0, 0, 0, 0);

const investment1 = {
  amount: 200_000 * scalingFactor,
  interest_rate: 400,
  maturity_date: Math.floor(tomorrow.getTime() / 1000),
  identifier: "investment1",
};
const investment2 = {
  amount: 100_000 * scalingFactor,
  interest_rate: 300,
  maturity_date: Math.floor(afterTomorrow.getTime() / 1000),
  identifier: "investment2",
};

const expense1 = {
  amount: 45_000 * scalingFactor,
  identifier: "expense1",
  category: { fundFees: {} }
};
const expense2 = {
  amount: 55_000 * scalingFactor,
  identifier: "expense2",
  category: { legalFees: {} }
};

describe("xero", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;

  anchor.setProvider(provider);

  const program = anchor.workspace.Xero as Program<Xero>;
  const manager = anchor.web3.Keypair.generate();
  const investor = anchor.web3.Keypair.generate();
  
  let investorStablecoinATA: token.Account;
  let stablecoinMint: anchor.web3.PublicKey;
  const [investmentFundPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
        Buffer.from("fund"),
        Buffer.from(fund.name),
        manager.publicKey.toBuffer()
    ],
    program.programId
  );
  const [sharesMint] = anchor.web3.PublicKey.findProgramAddressSync(
    [
        Buffer.from("shares"),
        investmentFundPda.toBuffer()
    ],
    program.programId
  );
  let fundStablecoinVault: anchor.web3.PublicKey;
  const [investment1PDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("investment"),
      Buffer.from(investment1.identifier),
      investmentFundPda.toBuffer(),
    ],
    program.programId
  );
  const [investment2PDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("investment"),
      Buffer.from(investment2.identifier),
      investmentFundPda.toBuffer(),
    ],
    program.programId
  );
  const [expense1PDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("expense"),
      Buffer.from(expense1.identifier),
      investmentFundPda.toBuffer()
    ],
    program.programId
  );
  const [expense2PDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("expense"),
      Buffer.from(expense2.identifier),
      investmentFundPda.toBuffer()
    ],
    program.programId
  );
  const managerSharesATA = token.getAssociatedTokenAddressSync(
    sharesMint,
    manager.publicKey,
  );
  const investorFundATA = token.getAssociatedTokenAddressSync(
    sharesMint,
    investor.publicKey
  );

  before(async () => {
    await connection.requestAirdrop(
        manager.publicKey,
        10 * anchor.web3.LAMPORTS_PER_SOL
    );

    await connection.requestAirdrop(
        investor.publicKey,
        10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await new Promise(resolve => setTimeout(resolve, 300));

    stablecoinMint = await token.createMint(
        connection,
        manager,
        manager.publicKey,
        null,
        6,
    );

    investorStablecoinATA = await token.getOrCreateAssociatedTokenAccount(
        connection,
        manager,
        stablecoinMint,
        investor.publicKey,
    );

    await token.mintTo(
        connection,
        manager,
        stablecoinMint,
        investorStablecoinATA.address,
        manager.publicKey,
        1000 * anchor.web3.LAMPORTS_PER_SOL,
    );

    fundStablecoinVault = token.getAssociatedTokenAddressSync(
      stablecoinMint,
      investmentFundPda,
      true
    );
  })

  it("Initializes the investment fund data account and mint", async () => {
    const tx1 = await program.methods
      .initializeFund(
        fund.name,
        stablecoinMint,
        new anchor.BN(fund.initialAssets),
        new anchor.BN(fund.initialLiabilities)
      )
      .accounts({
        manager: manager.publicKey,
        stablecoinMint: stablecoinMint,
      })
      .signers([
        manager
      ])
      .rpc();
    await connection.confirmTransaction(tx1, "confirmed");

    const tx2 = await program.methods
      .initializeFundMint(
        fund.name,
        new anchor.BN(fund.initialShares)
      )
      .accounts({
        manager: manager.publicKey,
      })
      .signers([
        manager
      ])
      .rpc();
    await connection.confirmTransaction(tx2, "confirmed");

    const managerSharesAccount = await token.getAccount(
      connection,
      managerSharesATA,
      "confirmed"
    );

    const fundMint = await token.getMint(
        connection,
        sharesMint,
        "confirmed"
    );

    const fundDataAccount = await program.account.investmentFund.fetch(investmentFundPda, "confirmed");
    expect(Number(fundDataAccount.assetsAmount)).to.eq(fund.initialAssets);
    expect(Number(fundDataAccount.liabilitiesAmount)).to.eq(fund.initialLiabilities);
    expect(fundDataAccount.manager.toString()).to.eq(manager.publicKey.toString());
    expect((Number(fundDataAccount.assetsAmount) - Number(fundDataAccount.liabilitiesAmount)) / ((Number(fundMint.supply)))).to.equal(1);

    expect(Number(managerSharesAccount.amount)).to.eq(fund.initialShares);
  });

  it("Registers investments", async () => {
    const tx1 = await program.methods
      .registerInvestment(
        fund.name,
        investment1.identifier,
        new anchor.BN(investment1.amount),
        new anchor.BN(investment1.interest_rate),
        new anchor.BN(investment1.maturity_date),
      )
      .accounts({
        manager: manager.publicKey,
      })
      .signers([
        manager
      ])
      .rpc();

    await connection.confirmTransaction(tx1, "confirmed");

    const tx2 = await program.methods
      .registerInvestment(
        fund.name,
        investment2.identifier,
        new anchor.BN(investment2.amount),
        new anchor.BN(investment2.interest_rate),
        new anchor.BN(investment2.maturity_date),
      )
      .accounts({
        manager: manager.publicKey,
      })
      .signers([
        manager
      ])
      .rpc();

    await connection.confirmTransaction(tx2, "confirmed");

    const investment1Data = await program.account.investment.fetch(investment1PDA);
    expect(investment1Data.identifier).to.eq(investment1.identifier);
    expect(investment1Data.investmentFund.toString()).to.eq(investmentFundPda.toString());
    expect(Number(investment1Data.investedAmount)).to.eq(investment1.amount);
    expect(Number(investment1Data.interestRate)).to.eq(investment1.interest_rate);

    const investment2Data = await program.account.investment.fetch(investment2PDA);
    expect(investment2Data.identifier).to.eq(investment2.identifier);
    expect(investment2Data.investmentFund.toString()).to.eq(investmentFundPda.toString());
    expect(Number(investment2Data.investedAmount)).to.eq(investment2.amount);
    expect(Number(investment2Data.interestRate)).to.eq(investment2.interest_rate);
  });

  it("Registers expenses", async () => {
    const tx1 = await program.methods
      .registerExpense(
        fund.name,
        expense1.identifier,
        new anchor.BN(expense1.amount),
        expense1.category
      )
      .accounts({
        manager: manager.publicKey,
      })
      .signers([
        manager
      ])
      .rpc()

    connection.confirmTransaction(tx1, "confirmed");

    const tx2 = await program.methods
      .registerExpense(
        fund.name,
        expense2.identifier,
        new anchor.BN(expense2.amount),
        expense2.category
      )
      .accounts({
        manager: manager.publicKey,
      })
      .signers([
        manager
      ])
      .rpc()

    connection.confirmTransaction(tx2, "confirmed");

    const expense1Data = await program.account.expense.fetch(expense1PDA);
    expect(expense1Data.identifier).to.eq(expense1.identifier);
    expect(Number(expense1Data.expenseAmount)).to.eq(expense1.amount);
    expect(expense1Data.category).to.eql({ fundFees: {} });

    const expense2Data = await program.account.expense.fetch(expense2PDA);
    expect(expense2Data.identifier).to.eq(expense2.identifier);
    expect(Number(expense2Data.expenseAmount)).to.eq(expense2.amount);
    expect(expense2Data.category).to.eql({ legalFees: {} });

    const fundDataAccount = await program.account.investmentFund.fetch(investmentFundPda);
    expect(Number(fundDataAccount.liabilitiesAmount)).to.eq(0 + expense1.amount + expense2.amount);
  });

  it("Sells share tokens to the investor at correct price, fund vault gets the stablecoin invested amount", async () => {
    const amountToInvest = 100_000 * scalingFactor;
    const fundDataAccountBefore = await program.account.investmentFund.fetch(investmentFundPda);
    const outstandingSharesBefore = (await token.getMint(
      connection, 
      sharesMint, 
      "confirmed"
    )).supply;
    const shareValueBefore = 
      ((Number(fundDataAccountBefore.assetsAmount) - Number(fundDataAccountBefore.liabilitiesAmount)) * scalingFactor)
      / Number(outstandingSharesBefore);

    const sharesToReceive = (amountToInvest) / shareValueBefore;

    const tx = await program.methods
      .buyShares(
        fund.name,
        manager.publicKey,
        new anchor.BN(amountToInvest)
      )
      .accountsStrict({
        investor: investor.publicKey,
        sharesMint: sharesMint,
        investmentFund: investmentFundPda,
        investorFundAta: investorFundATA,
        investorStablecoinAta: investorStablecoinATA.address,
        stablecoinMint: stablecoinMint,
        fundStablecoinVault: fundStablecoinVault,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID
      })
      .signers([
        investor
      ])
      .rpc();

    await connection.confirmTransaction(tx, "confirmed");
    
    const investorShareBalance = (await token.getAccount(connection, investorFundATA, "confirmed")).amount;
    expect(Number(investorShareBalance) / scalingFactor).to.eq(Number(sharesToReceive.toFixed(6)))

    const fundDataAccountAfter = await program.account.investmentFund.fetch(investmentFundPda);
    const outstandingSharesAfter = (await token.getMint(
      connection, 
      sharesMint, 
      "confirmed"
    )).supply;
    const outstandingSharesAfterScaled = Number(outstandingSharesAfter) / scalingFactor;
    expect(Number(outstandingSharesAfterScaled.toFixed(6))).to.eq(Number(outstandingSharesBefore) / scalingFactor + Number(sharesToReceive.toFixed(6)));
    expect(Number(fundDataAccountAfter.assetsAmount)).to.eq(Number(amountToInvest) + Number(fundDataAccountBefore.assetsAmount))

    const shareValueAfter = 
      ((Number(fundDataAccountAfter.assetsAmount) - Number(fundDataAccountAfter.liabilitiesAmount)) * scalingFactor)
      / Number(outstandingSharesAfter);

    expect(Number(shareValueAfter.toFixed(6))).to.eq(Number(shareValueBefore.toFixed(6)));
    
    const stablecoinVaultBalance = (await token.getAccount(connection, fundStablecoinVault, "confirmed")).amount;
    expect(Number(stablecoinVaultBalance)).to.eq(amountToInvest);
  });

  it("Processes an investment and increases the funds assets accordingly", async () => {
    const fundBefore = await program.account.investmentFund.fetch(investmentFundPda);

    const tx = await program.methods
      .processInvestment(
        fund.name,
        investment1.identifier
      )
      .accounts({
        manager: manager.publicKey
      })
      .signers([
        manager
      ])
      .rpc()

    await connection.confirmTransaction(tx, "confirmed");

    const fundAfter = await program.account.investmentFund.fetch(investmentFundPda);
    const interestAdded = fundAfter.assetsAmount.sub(fundBefore.assetsAmount);

    const investment1DailyInterest = new anchor.BN(investment1.amount)
    .mul(new anchor.BN(investment1.interest_rate))
    .mul(new anchor.BN(1_000_000))
    .div(new anchor.BN(30))
    .div(new anchor.BN(1_000_000));

    expect(Number(investment1DailyInterest)).to.eq(Number(interestAdded))
  })

});
