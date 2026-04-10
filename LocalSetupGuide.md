# Local Setup Guide - Decentrocast

This is the single local setup guide for the full Decentrocast project.
Use it to install the backend and frontend, run tests, deploy locally, connect MetaMask, and use the app.

## Prerequisites

- Node.js 18+ and npm
- Git
- MetaMask browser extension

Check your versions:

```powershell
node -v
npm -v
```

## Clone the Repository

```powershell
git clone <GITHUB_REPOSITORY_URL>
cd vite-voting-dapp
```

If you use PowerShell and your folder path contains square brackets like `[dev]`, use `Set-Location -LiteralPath` instead of `cd`.

## Project Structure Used in Local Setup

- `backend-hardhat`: Hardhat, Solidity contracts, deployment scripts, tests
- `frontend-vite`: React + Vite frontend

## 1. Install Dependencies

Install backend dependencies:

```powershell
cd backend-hardhat
npm install
```

Install frontend dependencies in a separate terminal, or after backend install completes:

```powershell
cd frontend-vite
npm install
```

## 2. Compile the Smart Contract

From `backend-hardhat`:

```powershell
npm run compile
```

This compiles the Solidity contract from `contracts/` and updates Hardhat artifacts.

## 3. Run Smart Contract Tests

From `backend-hardhat`:

```powershell
npm test
```

This runs the Hardhat test suite on the in-memory network.

The latest saved backend test log is here:

- `backend-hardhat/test-logs/latest.log`

## 4. Start the Local Hardhat Blockchain

Open Terminal 1 and run:

```powershell
cd backend-hardhat
npm run node
```

Keep this terminal running.

This starts the local blockchain at `http://127.0.0.1:8545` with chain ID `31337`.

## 5. Deploy the Contract to Localhost

Open Terminal 2 and run:

```powershell
cd backend-hardhat
npm run deploy:localhost
```

Equivalent command:

```powershell
npx hardhat run scripts/deploy.js --network localhost
```

Expected output includes:

- Contract name
- Network and chain ID
- Deployer address
- Deployment transaction hash
- Contract address
- Voting window details
- Gas and total deployment cost

Copy the deployed contract address from the terminal output.

## 6. Update the Frontend Contract Address

Open `frontend-vite/src/constants/constant.js` and replace the current contract address value with the address from the localhost deployment.

Update this line:

```javascript
const contractAddress = "0x...";
```

Do not change the ABI import unless the contract path changes.

## 7. Run the Frontend

Open Terminal 3 and run:

```powershell
cd frontend-vite
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173/
```

## 8. Configure MetaMask for Localhost

Add the local Hardhat network to MetaMask:

- Network Name: `Localhost 8545`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency Symbol: `ETH` (optional)

Then:

1. Copy one of the private keys printed by `npm run node` in Terminal 1.
2. Import that account into MetaMask.
3. Switch MetaMask to the `Localhost 8545` network.
4. Connect the wallet to the frontend.

## 9. Use the App

1. Click `Connect MetaMask Wallet`.
2. Approve the wallet connection.
3. Review the candidate list shown in the UI.
4. Enter the candidate index you want to vote for.
5. Submit the vote and confirm the MetaMask transaction.
6. Wait for the transaction to be mined and the UI to refresh.

## Optional Commands

From `backend-hardhat`:

- `npm run clean`: clears Hardhat build outputs
- `npm run deploy`: deploys to the default in-memory Hardhat network for that command only
- `npm run test:log`: runs tests and writes the output to the backend test log

## Optional Sepolia Setup

Create `backend-hardhat/.env` only if you want to deploy to Sepolia or enable gas reporting.

Example:

```env
SEPOLIA_ALCHEMY_RPC_URL=
METAMASK_PRIVATE_KEY=
ETHERSCAN_API_KEY=
COINMARKETCAP_API_KEY=
REPORT_GAS_USAGE=false
```

Notes:

- Do not commit real private keys.
- Localhost development does not require these values.

Deploy to Sepolia with:

```powershell
cd backend-hardhat
npx hardhat run scripts/deploy.js --network sepolia
```
