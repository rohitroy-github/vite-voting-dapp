/** @type import('hardhat/config').HardhatUserConfig */

// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: `${process.env.SEPOLIA_ALCHEMY_RPC}`,
      accounts: [`${process.env.METAMASK_PRIVATE_KEY}`],
      chainId: 11155111,
    },
  },
};
