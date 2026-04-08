// pasteTheContractAddressHereAfterDeployingTheContract
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

import ABI_JSON from "../../../backend-hardhat/artifacts/contracts/VotingContract.sol/VotingContract.json";

const contractABI = ABI_JSON.abi;

// console.log(contractABI);

export {contractAddress, contractABI};
