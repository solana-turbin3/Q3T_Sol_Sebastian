# Solana Smart Contract Development Repository

## Introduction

This repository contains various programs and projects developed during the Turbine Cohort course for Solana smart contract development. It includes code from the lessons, as well as the final project.

## Final Project: Xero - Investment Fund Management Platform

### Overview

Xero is a decentralized platform built on Solana that enables investment funds to manage their assets and allows anyone to invest in Real World Assets (RWA) through tokenization. The platform ensures transparency and reliability by recording all necessary data on Program Derived Accounts (PDAs) to calculate share values.

### Key Features

1. Fund initialization and configuration
2. Investment registration
3. Expense tracking
4. Semi-automated share redemption process
5. Share purchase and redemption for investors
6. Transparent access to fund data

### Technical Details

- Smart Contract: Developed using Anchor framework
- Frontend: Next.js application
- Deployment: The program is deployed on Solana devnet
- Program Address: `E7s9u89mMuVGULoSnY6PA1yLkcAev8MeTMxxA33pskFo`
- Explorer: https://explorer.solana.com/address/E7s9u89mMuVGULoSnY6PA1yLkcAev8MeTMxxA33pskFo?cluster=devnet
  
### Getting Started

The project is located in the `capstone-xero` directory. To run the project locally, follow these steps:

#### Smart Contract (Anchor)

1. Ensure you have Rust and Anchor installed on your system.
2. Navigate to the `capstone-xero/xero` directory.
3. Build the project:
   ```
   anchor build
   ```
4. Run tests:
   ```
   anchor test
   ```

#### Frontend (Next.js)

1. Ensure you have Node.js installed on your system.
2. Navigate to the `capstone-xero/xero-front` directory.
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
4. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```
5. Open your browser and go to `http://localhost:3000` to view the application.

Note: Make sure you have the necessary environment variables set up for both the smart contract and frontend to interact with the Solana devnet.
