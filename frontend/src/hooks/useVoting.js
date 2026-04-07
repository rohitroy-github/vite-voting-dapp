import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../constants/constant.js";

export function useVoting() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState("");
  const [CanVote, setCanVote] = useState(true);

  useEffect(() => {
    getCandidates();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    // Subscribe to the Voted event so any vote — from any user —
    // immediately refreshes the candidate counts and voting status
    const eventProvider = new ethers.providers.Web3Provider(window.ethereum);
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      eventProvider,
    );
    contractInstance.on("Voted", async () => {
      await Promise.all([getCandidates(), getCurrentStatus()]);
      setIsVoting(false);
    });

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
      }
      contractInstance.removeAllListeners("Voted");
    };
  }, []);

  async function vote() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );

      // Resolve input: accept either a numeric index or a candidate name
      const trimmed = number.trim();
      let candidateIndex;
      if (/^\d+$/.test(trimmed)) {
        candidateIndex = parseInt(trimmed, 10);
      } else {
        const match = candidates.find(
          (c) => c.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (!match) {
          console.error(`No candidate found with name "${trimmed}"`);
          return;
        }
        candidateIndex = match.index;
      }

      setIsVoting(true);
      const tx = await contractInstance.vote(candidateIndex);
      await tx.wait();

      // Keep loader visible until this user's state is synced as well.
      await canVote();
    } catch (err) {
      console.error("Vote failed:", err);
      setIsVoting(false);
    }
  }

  async function canVote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer,
    );
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  }

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer,
    );
    const candidatesList = await contractInstance.getAllVotesOfCandidates();
    const formattedCandidates = candidatesList.map((candidate, index) => ({
      index,
      name: candidate.name,
      voteCount: candidate.voteCount.toNumber(),
    }));
    setCandidates(formattedCandidates);
  }

  async function getCurrentStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer,
    );
    const status = await contractInstance.getVotingStatus();
    setVotingStatus(status);
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        // console.log("Metamask Connected : " + address); // Debug log to confirm connection
        setIsConnected(true);
        canVote();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser");
    }
  }

  function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  function disconnectWallet() {
    setAccount(null);
    setIsConnected(false);
    setCanVote(true);
  }

  return {
    account,
    isConnected,
    isVoting,
    votingStatus,
    candidates,
    number,
    CanVote,
    vote,
    connectToMetamask,
    handleNumberChange,
    disconnectWallet,
  };
}
