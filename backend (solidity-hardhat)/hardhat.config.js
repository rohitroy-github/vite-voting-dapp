require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

// Uncomment to enable Solidity test coverage reports
// require("solidity-coverage");

// Gas usage estimator — enable via REPORT_GAS_USAGE=true in .env
require("hardhat-gas-reporter");

const SEPOLIA_ALCHEMY_RPC_URL = process.env.SEPOLIA_ALCHEMY_RPC_URL;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000, // Higher = optimized for frequent calls; lower = optimized for deployment cost
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    // In-memory network spun up for each test run — no persistence
    hardhat: {
      allowUnlimitedContractSize: true,
      mining: {
        interval: 5000, // Simulate a new block creation every 5 seconds to mimic real network conditions and allow time-based functions to work properly during testing
      },
    },

    // Public Ethereum testnet — requires SEPOLIA_ALCHEMY_RPC_URL and METAMASK_PRIVATE_KEY in .env
    sepolia: {
      url: SEPOLIA_ALCHEMY_RPC_URL || "",
      accounts: METAMASK_PRIVATE_KEY ? [METAMASK_PRIVATE_KEY] : [],
      chainId: 11155111,
    },

    // Local Hardhat node — run with: npx hardhat node
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },

  etherscan: {
    // Used to verify contracts on Etherscan after deployment
    apiKey: ETHERSCAN_API_KEY,
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS_USAGE === "true",
    noColors: true,
    currency: "INR",   // Display estimated costs in Indian Rupees
    token: "ETH",      // Estimate gas costs in ETH terms
    // outputFile: "gas-report.txt",  // Uncomment to write report to a file instead of stdout
    coinmarketcap: COINMARKETCAP_API_KEY, // Required for live price conversion
  },
};
