const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const contractName = "VotingContract";
  const compilerVersion =
    hre.config.solidity?.version ||
    hre.config.solidity?.compilers?.[0]?.version ||
    "unknown";
  const deploymentStartedAt = Date.now();
  const deployer = await ethers.provider.getSigner();
  const balanceBeforeWei = await ethers.provider.getBalance(deployer.address);

  const candidateNames = ["Rohit", "Rishav", "Arshiya", "Era"];
  const setupWindowMinutes = 0;
  const votingDurationMinutes = 3;

  // candidateNames, setupWindowMinutes, durationInMinutes
  const contract = await ethers.deployContract(contractName, [
    candidateNames,
    setupWindowMinutes,
    votingDurationMinutes,
  ]);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const deploymentTx = contract.deploymentTransaction();

  if (!deploymentTx) {
    throw new Error("Deployment transaction not found.");
  }

  const receipt = await deploymentTx.wait();
  const votingStart = await contract.votingStart();
  const votingEnd = await contract.votingEnd();

  const balanceAfterWei = await ethers.provider.getBalance(deployer.address);
  const balanceSpentWei =
    balanceBeforeWei >= balanceAfterWei
      ? balanceBeforeWei - balanceAfterWei
      : 0n;
  const deploymentDurationMs = Date.now() - deploymentStartedAt;

  const startIso = new Date(Number(votingStart) * 1000).toISOString();
  const endIso = new Date(Number(votingEnd) * 1000).toISOString();

  const gasUsed = receipt ? receipt.gasUsed : 0n;
  const gasPriceWei =
    (receipt && receipt.gasPrice) || deploymentTx.gasPrice || 0n;
  const totalCostWei = gasUsed * gasPriceWei;
  const gasPriceEth = ethers.formatEther(gasPriceWei);
  const totalCostEth = ethers.formatEther(totalCostWei);

  console.log("\n================ Deployment Summary ================");
  console.log("Contract Name:", contractName);
  console.log("Compiler Version:", compilerVersion);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId || "unknown");
  console.log("Deployer:", deployer.address);
  console.log("Deployment Tx Hash:", deploymentTx.hash);
  console.log("Deployed Block:", receipt ? receipt.blockNumber : "unknown");
  console.log("Contract Address:", `${contractAddress} ✅`);
  console.log(
    "Deployment Duration (sec):",
    (deploymentDurationMs / 1000).toFixed(2),
  );

  console.log("\nConstructor Inputs:");
  console.log("Candidates:", candidateNames.join(", "));
  console.log("Setup Window (minutes):", setupWindowMinutes);
  console.log("Voting Duration (minutes):", votingDurationMinutes);

  console.log("\nOn-chain Voting Window:");
  console.log("votingStart (unix):", votingStart.toString());
  console.log("votingStart (UTC):", startIso);
  console.log("votingEnd (unix):", votingEnd.toString());
  console.log("votingEnd (UTC):", endIso);

  console.log("\nDeployer Balance:");
  console.log("Balance Before (ETH):", ethers.formatEther(balanceBeforeWei));
  console.log("Balance After (ETH):", ethers.formatEther(balanceAfterWei));
  console.log("Balance Spent (ETH):", ethers.formatEther(balanceSpentWei));

  console.log("\nGas and Cost:");
  console.log("Gas Used:", gasUsed.toString());
  console.log("Gas Price (ETH):", gasPriceEth);
  console.log("Total Cost (ETH):", totalCostEth);
  console.log("====================================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
