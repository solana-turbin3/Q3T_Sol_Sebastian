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
  interest_rate: 0.02 * scalingFactor,
  maturity_date: Math.floor(tomorrow.getTime() / 1000),
  identifier: "investment1",
};
const investment2 = {
  amount: 100_000 * scalingFactor,
  interest_rate: 0.02 * scalingFactor,
  maturity_date: Math.floor(afterTomorrow.getTime() / 1000),
  identifier: "investment2",
};

const liability1 = {
  amount: 45_000 * scalingFactor,
  identifier: "liability1",
  category: { accountsPayable: {} }
};
const liability2 = {
  amount: 55_000 * scalingFactor,
  identifier: "liability2",
  category: { wagesPayable: {} }
};

const initialStablecoinVaultBalance = 250_000 * scalingFactor;

describe("xero", () => {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;

  anchor.setProvider(provider);

  const program = anchor.workspace.Xero as Program<Xero>;
  const manager = anchor.web3.Keypair.generate();
  const investor = anchor.web3.Keypair.generate();
  
  let fundStablecoinVault: anchor.web3.PublicKey;
  let investorStablecoinATA: token.Account;
  let stablecoinMint: anchor.web3.PublicKey;
  const [investmentFundPDA] = anchor.web3.PublicKey.findProgramAddressSync(
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
        investmentFundPDA.toBuffer()
    ],
    program.programId
  );
  const [investment1PDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("investment"),
      Buffer.from(investment1.identifier),
      investmentFundPDA.toBuffer(),
    ],
    program.programId
  );
  const [investment2PDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("investment"),
      Buffer.from(investment2.identifier),
      investmentFundPDA.toBuffer(),
    ],
    program.programId
  );
  const [liability1PDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("liability"),
      Buffer.from(liability1.identifier),
      investmentFundPDA.toBuffer()
    ],
    program.programId
  );
  const [liability2PDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("liability"),
      Buffer.from(liability2.identifier),
      investmentFundPDA.toBuffer()
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
  const redemptionVaultATA = token.getAssociatedTokenAddressSync(
    sharesMint,
    investmentFundPDA,
    true
  );

  const [investorRedemptionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [
        Buffer.from("redemption"),
        investmentFundPDA.toBuffer(),
        investor.publicKey.toBuffer()
    ],
    program.programId
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
      investmentFundPDA,
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

    const fundDataAccount = await program.account.investmentFund.fetch(investmentFundPDA, "confirmed");
    expect(Number(fundDataAccount.assetsAmount)).to.eq(fund.initialAssets);
    expect(Number(fundDataAccount.liabilitiesAmount)).to.eq(fund.initialLiabilities);
    expect(fundDataAccount.manager.toString()).to.eq(manager.publicKey.toString());
    expect((Number(fundDataAccount.assetsAmount) - Number(fundDataAccount.liabilitiesAmount)) / ((Number(fundMint.supply)))).to.equal(1);

    expect(Number(managerSharesAccount.amount)).to.eq(fund.initialShares);

    const tx3 = await token.mintTo(
        connection,
        manager,
        stablecoinMint,
        fundStablecoinVault,
        manager,
        initialStablecoinVaultBalance
    );
    await connection.confirmTransaction(tx3, "confirmed");
    const fundStablecoinBalance = (await token.getAccount(
        connection,
        fundStablecoinVault,
        "confirmed"
    )).amount;

    expect(Number(fundStablecoinBalance)).to.eq(initialStablecoinVaultBalance)

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
    expect(investment1Data.investmentFund.toString()).to.eq(investmentFundPDA.toString());
    expect(Number(investment1Data.investedAmount)).to.eq(investment1.amount);
    expect(Number(investment1Data.interestRate)).to.eq(investment1.interest_rate);

    const investment2Data = await program.account.investment.fetch(investment2PDA);
    expect(investment2Data.identifier).to.eq(investment2.identifier);
    expect(investment2Data.investmentFund.toString()).to.eq(investmentFundPDA.toString());
    expect(Number(investment2Data.investedAmount)).to.eq(investment2.amount);
    expect(Number(investment2Data.interestRate)).to.eq(investment2.interest_rate);
  });

  it("Registers expenses", async () => {
    const tx1 = await program.methods
      .registerLiability(
        fund.name,
        liability1.identifier,
        new anchor.BN(liability1.amount),
        liability1.category
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
      .registerLiability(
        fund.name,
        liability2.identifier,
        new anchor.BN(liability2.amount),
        liability2.category
      )
      .accounts({
        manager: manager.publicKey,
      })
      .signers([
        manager
      ])
      .rpc()

    connection.confirmTransaction(tx2, "confirmed");

    const liability1Data = await program.account.liability.fetch(liability1PDA);
    expect(liability1Data.identifier).to.eq(liability1.identifier);
    expect(Number(liability1Data.liabilityAmount)).to.eq(liability1.amount);
    expect(liability1Data.category).to.eql({ accountsPayable: {} });

    const liability2Data = await program.account.liability.fetch(liability2PDA);
    expect(liability2Data.identifier).to.eq(liability2.identifier);
    expect(Number(liability2Data.liabilityAmount)).to.eq(liability2.amount);
    expect(liability2Data.category).to.eql({ wagesPayable: {} });

    const fundDataAccount = await program.account.investmentFund.fetch(investmentFundPDA);
    expect(Number(fundDataAccount.liabilitiesAmount)).to.eq(0 + liability1.amount + liability2.amount);
  });

  it("Sells share tokens to the investor at correct price, fund vault gets the stablecoin invested amount", async () => {
    const amountToInvest = 100_000 * scalingFactor;
    const fundDataAccountBefore = await program.account.investmentFund.fetch(investmentFundPDA);
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
        investmentFund: investmentFundPDA,
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

    const fundDataAccountAfter = await program.account.investmentFund.fetch(investmentFundPDA);
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
    expect(Number(stablecoinVaultBalance)).to.eq(amountToInvest + initialStablecoinVaultBalance);
  });

  it("Processes an investment and increases the funds assets accordingly", async () => {
    const fundBefore = await program.account.investmentFund.fetch(investmentFundPDA);

    const tx = await program.methods
      .processInvestment(
        fund.name,
        investment2.identifier
      )
      .accounts({
        manager: manager.publicKey
      })
      .signers([
        manager
      ])
      .rpc()

    await connection.confirmTransaction(tx, "confirmed");

    const fundAfter = await program.account.investmentFund.fetch(investmentFundPDA);
    const interestAdded = fundAfter.assetsAmount.sub(fundBefore.assetsAmount);

    const investmentAmount = new anchor.BN(investment2.amount);
    const interestRate = new anchor.BN(investment2.interest_rate);
    const daysInMonth = new anchor.BN(30);

    const calculatedInteredAdded = investmentAmount.mul(interestRate).div(daysInMonth);
    const calculatedInteredAddedScaled = calculatedInteredAdded.div(new anchor.BN(scalingFactor));

    expect(Number(calculatedInteredAddedScaled)).to.eq(Number(interestAdded))
  })

  it("Creates a share redemption request", async () => {
    const fundDataAccountBefore = await program.account.investmentFund.fetch(investmentFundPDA);
    const userSharesBefore = (await token.getAccount(connection, investorFundATA, "confirmed")).amount;
    const outstandingSharesBefore = (await token.getMint(
        connection, 
        sharesMint, 
        "confirmed"
        )).supply;

    const shareValueBefore = ((fundDataAccountBefore.assetsAmount.sub(fundDataAccountBefore.liabilitiesAmount))
        .mul(new anchor.BN(scalingFactor)).div(new anchor.BN(Number(outstandingSharesBefore))))
    
    const tx = await program.methods
        .redeemShares(
            fund.name,
            manager.publicKey,
            new anchor.BN(Number(userSharesBefore))
        )
        .accounts({
            investor: investor.publicKey
        })
        .signers([
            investor
        ])
        .rpc();

    await connection.confirmTransaction(tx, "confirmed");

    const userSharesAfter = (await token.getAccount(connection, investorFundATA, "confirmed")).amount;
    const redemptionVaultSharesAfter = (await token.getAccount(connection, redemptionVaultATA, "confirmed")).amount;

    expect(Number(userSharesAfter)).to.eq(0);
    expect(Number(redemptionVaultSharesAfter)).to.eq(Number(userSharesBefore));

    const redemptionData = await program.account.shareRedemption.fetch(investorRedemptionPDA);

    expect(redemptionData.investmentFund.toString()).to.eq(investmentFundPDA.toString());
    expect(redemptionData.investor.toString()).to.eq(investor.publicKey.toString());
    expect(Number(redemptionData.sharesToRedeem)).to.eq(Number(userSharesBefore));
    expect(Number(redemptionData.shareValue)).to.eq(Number(shareValueBefore))
  });

  it("Processes the share redemption request", async () => {

    const redemptionData = await program.account.shareRedemption.fetch(investorRedemptionPDA);

    const outstandingSharesBefore = (await token.getMint(
        connection, 
        sharesMint, 
        "confirmed"
        )).supply;

    const sharesToBurn = redemptionData.sharesToRedeem;

    const investorStablecoinBalanceBefore = (await token.getAccount(
        connection,
        investorStablecoinATA.address,
        "confirmed"
    )).amount;

    const stablecoinAmountToReceive = (redemptionData.shareValue.mul(redemptionData.sharesToRedeem)).div(new anchor.BN(scalingFactor));


    const tx = await program.methods
        .processShareRedemption(
            fund.name
        )
        .accountsStrict({
            investor: investor.publicKey,
            manager: manager.publicKey,
            investmentFund: investmentFundPDA,
            shareRedemption: investorRedemptionPDA,
            sharesMint: sharesMint,
            redemptionVault: redemptionVaultATA,
            investorStablecoinAta: investorStablecoinATA.address,
            stablecoinMint: stablecoinMint,
            fundStablecoinVault: fundStablecoinVault,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: token.TOKEN_PROGRAM_ID,
            associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID
        })
        .signers([
            manager
        ])
        .rpc()

    await connection.confirmTransaction(tx, "confirmed");

    const outstandingSharesAfter = (await token.getMint(
        connection, 
        sharesMint, 
        "confirmed"
    )).supply;

    const investorStablecoinBalanceAfter = (await token.getAccount(
            connection,
            investorStablecoinATA.address,
            "confirmed"
        )).amount;

    expect(Number(outstandingSharesAfter)).to.eq(Number(outstandingSharesBefore) - Number(sharesToBurn));
    expect(Number(investorStablecoinBalanceAfter)).to.eq(Number(investorStablecoinBalanceBefore) + Number(stablecoinAmountToReceive))
    
  });

  it("Creates a share redemption and allows the investor to cancel it", async () => {

    const userSharesBefore = (await token.getAccount(connection, investorFundATA, "confirmed")).amount;
    const tx1 = await program.methods
        .redeemShares(
            fund.name,
            manager.publicKey,
            new anchor.BN(Number(userSharesBefore))
        )
        .accounts({
            investor: investor.publicKey
        })
        .signers([
            investor
        ])
        .rpc();

    await connection.confirmTransaction(tx1, "confirmed");

    const tx2 = await program.methods
        .cancelRedeemShares(
            fund.name,
            manager.publicKey
        )
        .accounts({
            investor: investor.publicKey
        })
        .signers([
            investor
        ])
        .rpc()

    await connection.confirmTransaction(tx2, "confirmed");

    const userSharesAfter = (await token.getAccount(connection, investorFundATA, "confirmed")).amount;

    const redeemAccounts = await program.account.shareRedemption.all();
    expect(redeemAccounts.length).to.eq(0);
    expect(Number(userSharesBefore)).to.eq(Number(userSharesAfter));
  });

  it("Allows the manager to withdraw all funds from the stablecoin vault", async () => {
    const stablecoinVaultBalanceBefore = (await token.getAccount(connection, fundStablecoinVault, "confirmed")).amount;

    const balanceInBN = new anchor.BN(Number(stablecoinVaultBalanceBefore));

    const managerStablecoinATA = token.getAssociatedTokenAddressSync(
        stablecoinMint,
        manager.publicKey,
    );

    const tx = await program.methods
        .withdrawFromVault(
            fund.name,
            balanceInBN
        )
        .accounts({
            manager: manager.publicKey,
            stablecoinMint: stablecoinMint,
        })
        .signers([
            manager
        ])
        .rpc();
        
    await connection.confirmTransaction(tx, "confirmed");

    const stablecoinVaultBalanceAfter = (await token.getAccount(connection, fundStablecoinVault, "confirmed")).amount;
    const managerStablecoinBalanceAfter = (await token.getAccount(connection, managerStablecoinATA, "confirmed")).amount;

    expect(Number(stablecoinVaultBalanceAfter)).to.eq(0);
    expect(managerStablecoinBalanceAfter).to.eq(stablecoinVaultBalanceBefore);


  })

});
