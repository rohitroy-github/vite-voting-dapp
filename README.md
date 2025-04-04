# Voting DApp (EVM-Based)

Voting DApp is a **decentralized voting application** built with **ViteJS** for a secure and transparent voting system.

Currently, the app operates on **Localhost** and the **Ethereum Sepolia Testnet** using Alchemy.

---

## Snapshots

| ![image](https://github.com/rohitroy-github/vite-voting-dapp/assets/68563695/797ef5ad-8df6-484b-8a75-ceff84e576fd) | ![image](https://github.com/rohitroy-github/vite-voting-dapp/assets/68563695/d50d4440-79d4-485f-932a-b320358ae7c1) |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| ![image](https://github.com/rohitroy-github/vite-voting-dapp/assets/68563695/8063f77f-676e-4b13-b179-992fc9e62530) |                                                                                                                    |

---

## Tech Stack

### Frontend:

- **Vite JS** - Fast and modern frontend tooling

### Backend:

- **Node.js** - Server-side runtime
- **Hardhat** - Ethereum development framework
- **Metamask Wallet** - User authentication and transactions
- **Ethers.js** - Blockchain interaction library
- **Alchemy** - Web3 infrastructure provider

---

## Localhost (Steps To Run / Execute)

### Backend (Solidity-Hardhat):

1. Navigate to the `backend` folder:
   ```sh
   cd solidity-hardhat
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Compile and deploy the contract:
   ```sh
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network sepolia
   ```
4. Copy the **CONTRACT_ADDRESS** from the terminal output and paste it into `frontend/src/constants/constant.js`.

### Frontend:

1. Navigate to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```

---

## Project Status & Contributions

The project is complete but undergoing continuous improvements. Suggestions for enhancements are welcome!

If you like the project, leave a ⭐! 😊
