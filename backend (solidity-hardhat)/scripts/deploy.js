const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();

  const candidateNames = [
    "Candidate1",
    "Candidate2",
    "Candidate3",
    "Candidate4",
    "Candidate5",
  ];
  const setupWindowMinutes = 5;
  const votingDurationMinutes = 10;

  const VotingContract = await ethers.getContractFactory("VotingContract");

  // candidateNames, setupWindowMinutes, durationInMinutes
  const contract = await VotingContract.deploy(
    candidateNames,
    setupWindowMinutes,
    votingDurationMinutes,
  );

  await contract.deployed();

  const votingStart = await contract.votingStart();
  const votingEnd = await contract.votingEnd();
  const receipt = await contract.deployTransaction.wait();
  const gasPriceWei =
    receipt.effectiveGasPrice ||
    contract.deployTransaction.gasPrice ||
    ethers.constants.Zero;
  const gasPriceEth = ethers.utils.formatEther(gasPriceWei);
  const totalCostWei = receipt.gasUsed.mul(gasPriceWei);
  const totalCostEth = ethers.utils.formatEther(totalCostWei);

  const startIso = new Date(votingStart.toNumber() * 1000).toISOString();
  const endIso = new Date(votingEnd.toNumber() * 1000).toISOString();

  console.log("✅ Contract successfully deployed:", contract.address);

  console.log("\n================ Deployment Summary ================");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId || "unknown");
  console.log("Deployer:", deployer.address);
  console.log("Deployment Tx Hash:", contract.deployTransaction.hash);
  console.log("Deployed Block:", receipt.blockNumber);
  console.log("Contract Address:", contract.address);

  console.log("\nConstructor Inputs:");
  console.log("Candidates:", candidateNames.join(", "));
  console.log("Setup Window (minutes):", setupWindowMinutes);
  console.log("Voting Duration (minutes):", votingDurationMinutes);

  console.log("\nOn-chain Voting Window:");
  console.log("votingStart (unix):", votingStart.toString());
  console.log("votingStart (UTC):", startIso);
  console.log("votingEnd (unix):", votingEnd.toString());
  console.log("votingEnd (UTC):", endIso);

  console.log("\nGas and Cost:");
  console.log("Gas Used:", receipt.gasUsed.toString());
  console.log("Gas Price (ETH):", gasPriceEth);
  console.log("Total Cost (ETH):", totalCostEth);
  console.log("====================================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
