# Local Setup Guide - Decentrocast

Quick setup guide to clone and run Decentrocast locally.

## Prerequisites

- Node.js 18+ and npm
- Git
- MetaMask browser extension

## Clone the Repository

```bash
git clone <GITHUB_REPOSITORY_URL>
cd vite-voting-dapp
```

## Run Locally

### Terminal 1: Start the Hardhat Blockchain

```bash
cd backend-hardhat
npm install
npx hardhat compile
npx hardhat node
```

Keep this terminal running.

## Test the Smart Contract

Before deploying, run the tests to verify the contract works correctly:

```bash
cd backend-hardhat
npm test
```

### Terminal 2: Deploy Contract

```bash
cd backend-hardhat
npx hardhat run scripts/deploy.js --network localhost
```

Copy the contract address shown in the output.

### Terminal 3: Setup Frontend

```bash
cd frontend-vite
npm install
```

Edit `frontend-vite/src/constants/constant.js` and replace the contract address with the one from Terminal 2:

```javascript
export const contractAddress = "0x..."; // Your deployed address
```

### Terminal 3 (cont'd): Run Frontend

```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

Test output will appear in the terminal and be saved to `test-results/latest.log`.

## Setup MetaMask

1. Add Localhost 8545 network to MetaMask:
   - Network Name: Localhost 8545
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337

2. Import a test account from Terminal 1 output (private key starting with `0x`)

3. Connect MetaMask to Localhost 8545 network

## Use the App

1. Click "Connect MetaMask Wallet"
2. Approve the connection
3. Enter candidate index (0-4) and vote
4. Confirm transaction in MetaMask
