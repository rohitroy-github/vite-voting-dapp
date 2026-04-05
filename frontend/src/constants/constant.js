// pasteTheContractAddressHereAfterDeployingTheContract
const contractAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";

import ABI_JSON from "../../../backend (solidity-hardhat)/artifacts/contracts/VotingContract.sol/VotingContract.json";

const contractABI = ABI_JSON.abi;

// console.log(contractABI);

export {contractAddress, contractABI};
