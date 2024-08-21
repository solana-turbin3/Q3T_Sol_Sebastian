# Project Xero

## Summary

Xero is a platform for investment funds to manage their assets and allow anyone to invest in RWA through tokenization. Fund managers will record all necessary data on PDAs to calculate share values transparently and reliably.


## User Stories

### Fund manager

1. As a manager, I want to initialize and configure an investment fund (fund name, administrator pubkey, 
% of assets kept in liquidity vault, initial shares).
2. As a manager, I want to register investments (return rate, init date, maturity date, amount).
3. As a manager, I want to register expenses (amount, date).
4. As a manager, I want that every day the fund share value is automatically calculated and updated.
5. As a manager, I want the process of shares redemptions to be automated.
6. As a manager, I want to receive alerts when the liquidity vault is running out and shares need to be redeemed.
7. As a manager, I want to visualize the historical performance of the fund (off chain data).

### User (investor)

1. As a user, I want to buy shares (tokens) at the current share price, with USDC.
2. As a user, I want to redeem my shares whenever I want, ideally instantly.
3. As a user, I want to have access to all the relevant data of the fund (assets,
liabilities, share value, historic share values). 
4. As a user, I want to be provided with a marketplace where I can trade my tokens for other tokens or SOL in case the liquidity vault is empty.