const {ethers} = require("hardhat");

async function main() {
  const VotingContract = await ethers.getContractFactory("VotingContract");

  // candidateNames, setupWindowMinutes, durationInMinutes
  const contract = await VotingContract.deploy(
    ["Candidate1", "Candidate2", "Candidate3", "Candidate4", "Candidate5"],
    5,
    10
  );

  console.log("Contract successfully deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
