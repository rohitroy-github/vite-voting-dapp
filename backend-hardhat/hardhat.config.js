require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

// Optional plugin for Solidity coverage reports.
// Enable only when needed because it slows test execution.
// require("solidity-coverage");

// Gas usage estimator.
// Set REPORT_GAS_USAGE=true in .env to print gas/cost stats after tests.
require("hardhat-gas-reporter");

// Environment values loaded from .env.
// Keep secrets out of source control.
const SEPOLIA_ALCHEMY_RPC_URL = process.env.SEPOLIA_ALCHEMY_RPC_URL;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        // Higher runs optimize runtime gas for frequently called functions.
        // Lower runs reduce deployment bytecode size and deployment cost.
        runs: 1000,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    // Ephemeral in-memory chain used by default for local testing.
    // State resets for each run, which keeps tests deterministic.
    hardhat: {
      allowUnlimitedContractSize: true,
      mining: {
        // Mine one block every 5 seconds to better simulate public chain timing.
        // Useful for testing time-dependent logic.
        interval: 5000,
      },
    },

    // Public Ethereum testnet for staging deployments.
    // Requires SEPOLIA_ALCHEMY_RPC_URL and METAMASK_PRIVATE_KEY in .env.
    // If METAMASK_PRIVATE_KEY is missing, no account will be configured.
    sepolia: {
      url: SEPOLIA_ALCHEMY_RPC_URL || "",
      accounts: METAMASK_PRIVATE_KEY ? [METAMASK_PRIVATE_KEY] : [],
      chainId: 11155111,
    },

    // External local node (persistent process) started with: npx hardhat node
    // Useful for manual testing with frontend and wallet integrations.
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },

  etherscan: {
    // API key used by Hardhat verify task after deploying to public networks.
    apiKey: ETHERSCAN_API_KEY,
  },

  gasReporter: {
    // Toggle report output with REPORT_GAS_USAGE=true in .env.
    enabled: process.env.REPORT_GAS_USAGE === "true",
    // Monochrome output is easier to parse in CI logs.
    noColors: true,
    // Display fiat estimates in INR while gas usage is still measured in ETH units.
    currency: "INR",
    token: "ETH",
    // Uncomment to save report to file instead of stdout:
    // outputFile: "gas-report.txt",
    // Optional API key for live ETH to INR conversion.
    // Without this key, conversion may fall back or be unavailable.
    coinmarketcap: COINMARKETCAP_API_KEY,
  },

  mocha: {
    // Increase timeout for slower RPC calls, deployments, and integration-style tests.
    timeout: 60000,
  },
};
