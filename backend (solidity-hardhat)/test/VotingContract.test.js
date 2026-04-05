const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let VotingContract, voting, owner, addr1, addr2, addr3;

  const candidateNames = ["Alice", "Bob", "Charlie"];
  const duration = 10; // minutes

  beforeEach(async () => {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    VotingContract = await ethers.getContractFactory("VotingContract");
    voting = await VotingContract.deploy(candidateNames, 0, duration);
    await voting.deployed();
  });

  // =============================
  // 🚀 DEPLOYMENT TESTS
  // =============================
  describe("Deployment", function () {
    it("Should initialize candidates correctly", async () => {
      const candidates = await voting.getAllCandidates();
      expect(candidates).to.deep.equal(candidateNames);
    });

    it("Should fail when deployed with no candidates", async () => {
      await expect(VotingContract.deploy([], 0, duration)).to.be.revertedWith(
        "At least one candidate required"
      );
    });

    it("Should fail when deployed with zero duration", async () => {
      await expect(VotingContract.deploy(candidateNames, 0, 0)).to.be.revertedWith(
        "Duration must be greater than 0"
      );
    });

    it("Should fail when any candidate name is empty", async () => {
      await expect(VotingContract.deploy(["Alice", ""], 0, duration)).to.be.revertedWith(
        "Empty candidate name"
      );
    });

    it("Should fail when deployed with duplicate candidate names", async () => {
      await expect(
        VotingContract.deploy(["Alice", "Bob", "Alice"], 0, duration)
      ).to.be.revertedWith("Duplicate candidate");
    });

    it("Should set the correct owner", async () => {
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("Should set correct voting time", async () => {
      const start = await voting.votingStart();
      const end = await voting.votingEnd();

      expect(end).to.be.gt(start);
    });
  });

  // =============================
  // 👤 OWNER FUNCTIONALITY
  // =============================
  describe("Candidate Management", function () {
    it("Owner can add candidate BEFORE voting starts", async () => {
      // Deploy a fresh instance with a 10-minute setup window before voting starts
      const freshVoting = await VotingContract.deploy(candidateNames, 10, duration);
      await freshVoting.deployed();

      await expect(freshVoting.addCandidate("David"))
        .to.emit(freshVoting, "CandidateAdded")
        .withArgs("David");

      const candidates = await freshVoting.getAllCandidates();
      expect(candidates).to.include("David");
    });

    it("Should fail if candidate name is empty", async () => {
      const freshVoting = await VotingContract.deploy(candidateNames, 10, duration);
      await freshVoting.deployed();

      await expect(freshVoting.addCandidate("")).to.be.revertedWith(
        "Candidate name cannot be empty"
      );
    });

    it("Should fail if candidate already exists", async () => {
      const freshVoting = await VotingContract.deploy(candidateNames, 10, duration);
      await freshVoting.deployed();

      await expect(freshVoting.addCandidate("Alice")).to.be.revertedWith(
        "Candidate already exists"
      );
    });

    it("Should fail if non-owner tries to add candidate", async () => {
      await expect(
        voting.connect(addr1).addCandidate("Eve")
      ).to.be.revertedWith("Only the owner can perform this action.");
    });

    it("Should fail if adding candidate AFTER voting starts", async () => {
      await expect(
        voting.addCandidate("LateCandidate")
      ).to.be.revertedWith(
        "Cannot add candidates after voting has started."
      );
    });
  });

  // =============================
  // 🗳️ VOTING LOGIC
  // =============================
  describe("Voting", function () {
    it("Should allow a user to vote", async () => {
      await expect(voting.connect(addr1).vote(0))
        .to.emit(voting, "Voted")
        .withArgs(addr1.address, 0);

      const allVotes = await voting.getAllVotesOfCandidates();
      expect(allVotes[0].voteCount).to.equal(1);
    });

    it("Should prevent double voting", async () => {
      await voting.connect(addr1).vote(0);

      await expect(
        voting.connect(addr1).vote(1)
      ).to.be.revertedWith("You have already voted.");
    });

    it("Should reject invalid candidate index", async () => {
      await expect(
        voting.connect(addr1).vote(999)
      ).to.be.revertedWith("Invalid candidate index");
    });

    it("Should record which candidate a voter voted for", async () => {
      await voting.connect(addr1).vote(1);

      const votedFor = await voting.voterVotedFor(addr1.address);
      expect(votedFor).to.equal("Bob");
    });

    it("Should fail if user hasn't voted and calls voterVotedFor", async () => {
      await expect(
        voting.voterVotedFor(addr1.address)
      ).to.be.revertedWith(
        "This address has not casted a vote yet"
      );
    });
  });

  // =============================
  // ⏱️ TIME-BASED TESTS
  // =============================
  describe("Voting Time Logic", function () {
    it("Should return true when voting is active", async () => {
      expect(await voting.getVotingStatus()).to.equal(true);
    });

    it("Should prevent voting AFTER voting ends", async () => {
      const end = await voting.votingEnd();

      // Move time forward beyond voting end
      await network.provider.send("evm_setNextBlockTimestamp", [
        Number(end) + 1,
      ]);
      await network.provider.send("evm_mine");

      await expect(
        voting.connect(addr1).vote(0)
      ).to.be.revertedWith("Voting is not currently active.");
    });

    it("Should return 0 remaining time after voting ends", async () => {
      const end = await voting.votingEnd();

      await network.provider.send("evm_setNextBlockTimestamp", [
        Number(end) + 5,
      ]);
      await network.provider.send("evm_mine");

      const remaining = await voting.getRemainingTime();
      expect(remaining).to.equal(0);
    });

    it("Should return correct remaining time during voting", async () => {
      const remaining = await voting.getRemainingTime();
      expect(remaining).to.be.gt(0);
    });
  });

  // =============================
  // 📊 DATA RETRIEVAL
  // =============================
  describe("View Functions", function () {
    it("Should return all candidates", async () => {
      const candidates = await voting.getAllCandidates();
      expect(candidates.length).to.equal(3);
    });

    it("Should return vote counts correctly", async () => {
      await voting.connect(addr1).vote(0);
      await voting.connect(addr2).vote(0);
      await voting.connect(addr3).vote(1);

      const votes = await voting.getAllVotesOfCandidates();

      expect(votes[0].voteCount).to.equal(2);
      expect(votes[1].voteCount).to.equal(1);
      expect(votes[2].voteCount).to.equal(0);
    });
  });
});