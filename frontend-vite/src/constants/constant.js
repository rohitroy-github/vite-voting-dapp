// pasteTheContractAddressHereAfterDeployingTheContract
const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

import ABI_JSON from "../../../backend-hardhat/artifacts/contracts/VotingContract.sol/VotingContract.json";

const contractABI = ABI_JSON.abi;

// console.log(contractABI);

export {contractAddress, contractABI};
