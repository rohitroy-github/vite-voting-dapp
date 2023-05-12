const {ethers} = require("hardhat");

async function main() {
  const Voting = await ethers.getContractFactory("Voting");

  // candidateNames, timeForWhichVotingProcessIsActive(in minutes)
  const contract = await Voting.deploy(
    ["Candidate1", "Candidate2", "Candidate3", "Candidate4", "Candidate5"],
    120
  );

  console.log("Contract successfully deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
