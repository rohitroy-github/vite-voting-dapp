// pasteTheContractAddressHereAfterDeployingTheContract
const contractAddress = "0x5097ace2ac4A9375f0EF380075Fd0A15e5c35118";

import ABI_JSON from "../../../backend (solidity-hardhat)/artifacts/contracts/Voting.sol/Voting.json";

const contractABI = ABI_JSON.abi;

// console.log(contractABI);

export {contractAddress, contractABI};
