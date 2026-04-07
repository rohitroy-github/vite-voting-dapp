# Decntrocast (EVM Based)

**Decntrocast** is a **decentralized voting application** built with **ViteJS** to provide a secure, transparent, and tamper-resistant voting experience.

The app currently supports both **Localhost** and the **Ethereum Sepolia Testnet** (via Alchemy RPC).

---

## Snapshots

| ![image](https://github.com/user-attachments/assets/d69f3f21-79c6-4d8a-96e0-40de3fe39da4) | ![image](https://github.com/user-attachments/assets/30bcd94e-38e4-4ad7-8f13-ebed0c1d767c) |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |    
| ![image](https://github.com/user-attachments/assets/ea5b6d28-38fe-4832-a8b4-7252f2c3350b) | ![image](https://github.com/user-attachments/assets/fd389ae1-9463-481f-82b5-76df949bf962)                                                   |

---

## Features

- **Wallet-Based Authentication** - Connect with MetaMask to participate in voting.
- **One Wallet, One Vote** - Each wallet address can cast only one vote.
- **Live Voting Status** - View whether voting is active or finished.
- **Real-Time Candidate Table** - See candidate list and vote counts in the UI.
- **Countdown Visibility** - Track remaining voting time during active sessions.
- **Transparent Final Results** - Display winner and final vote totals after voting ends.
- **Multi-Network Ready** - Supports Localhost and Sepolia deployment workflows.

---

## Tech Stack

### Frontend:

- **Vite JS + React** - Fast and modern frontend development
- **Tailwind CSS** - Utility-first styling
- **Ethers.js** - Wallet connection and contract calls from UI

### Backend:

- **Node.js** - Server-side runtime
- **Hardhat** - Ethereum development framework
- **Solidity** - Smart contract implementation
- **Metamask Wallet** - User authentication and transaction signing
- **Alchemy** - Web3 RPC infrastructure for Sepolia

---

## Localhost (Steps To Run / Execute)

### Backend (Solidity-Hardhat):

1. Navigate to the backend folder:
   ```sh
   cd "backend (solidity-hardhat)"
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Compile contracts:
   ```sh
   npx hardhat compile
   ```
4. Deploy contract (choose one):
   ```sh
   # Localhost
   npx hardhat run scripts/deploy.js --network localhost

   # Sepolia
   npx hardhat run scripts/deploy.js --network sepolia
   ```
5. Copy the deployed **CONTRACT_ADDRESS** from terminal output and update:
   - `frontend/src/constants/constant.js`

### Frontend:

1. Navigate to the frontend folder:
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
4. Open the local URL shown in terminal (usually `http://localhost:5173`) and connect MetaMask.

---

## Project Status & Contributions

The project is functionally complete and actively being improved.

Suggestions, issue reports, and pull requests are always welcome.

If you like the project, leave a ⭐! 😊
