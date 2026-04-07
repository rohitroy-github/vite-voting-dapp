// pasteTheContractAddressHereAfterDeployingTheContract
const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

import ABI_JSON from "../../../backend (solidity-hardhat)/artifacts/contracts/VotingContract.sol/VotingContract.json";

const contractABI = ABI_JSON.abi;

// console.log(contractABI);

export {contractAddress, contractABI};
