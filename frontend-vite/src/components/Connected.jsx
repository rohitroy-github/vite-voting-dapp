import { useState, useEffect } from "react";

import { ethers } from "ethers";
import { contractABI, contractAddress } from "../constants/constant.js";
import { shortenAddress } from "../utils/utils.js";

const Connected = (props) => {
  const [votedCandidate, setVotedCandidate] = useState("");
  const [votedCandidateId, setVotedCandidateId] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [votingStartTs, setVotingStartTs] = useState(null);
  const [votingEndTs, setVotingEndTs] = useState(null);
  const [currentTs, setCurrentTs] = useState(null);

  // function : ifAlreadyVoted?ThenToWhom?
  async function getVotedCandidate() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer,
    );

    const voterAddress = await signer.getAddress();
    const hasVoted = await contractInstance.voters(voterAddress);

    if (!hasVoted) {
      setVotedCandidate("");
      setVotedCandidateId(null);
      return;
    }

    const [votedCandidateName, candidateIndex] = await Promise.all([
      contractInstance.voterVotedFor(voterAddress),
      contractInstance.voterToCandidate(voterAddress),
    ]);
    setVotedCandidate(votedCandidateName);
    setVotedCandidateId(candidateIndex.toNumber());
  }

  // Function to fetch the remaining time
  async function getRemainingTime() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer,
      );

      const [startTs, endTs, latestBlock] = await Promise.all([
        contractInstance.votingStart(),
        contractInstance.votingEnd(),
        provider.getBlock("latest"),
      ]);

      const nowTs = latestBlock.timestamp;
      const votingStartTs = startTs.toNumber();
      const votingEndTs = endTs.toNumber();

      setVotingStartTs(votingStartTs);
      setVotingEndTs(votingEndTs);
      setCurrentTs(nowTs);

      if (nowTs < votingStartTs) {
        setRemainingTime("Not started");
        return;
      }

      if (nowTs >= votingEndTs) {
        setRemainingTime(0);
        return;
      }

      const timeInMinutes = Math.ceil((votingEndTs - nowTs) / 60);
      setRemainingTime(timeInMinutes);
    } catch (err) {
      console.error("Error fetching remaining time:", err);
    }
  }

  useEffect(() => {
    if (props.showButton) {
      getVotedCandidate();
    }
  }, [props.showButton]);

  useEffect(() => {
    getRemainingTime();

    const timer = setInterval(() => {
      getRemainingTime();
    }, 30000); // Update every 30 seconds

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(timer);
    };
  }, []);

  // When the local timer reaches zero, immediately re-check the on-chain
  // voting status so the UI flips to Finished without waiting for the next
  // 30-second getRemainingTime poll or a Voted event.
  useEffect(() => {
    if (
      typeof votingEndTs === "number" &&
      typeof currentTs === "number" &&
      currentTs >= votingEndTs
    ) {
      props.refreshVotingStatus();
    }
  }, [currentTs, votingEndTs]);

  useEffect(() => {
    const liveTimer = setInterval(() => {
      setCurrentTs((prev) => (typeof prev === "number" ? prev + 1 : prev));
    }, 1000);

    return () => {
      clearInterval(liveTimer);
    };
  }, []);

  const timerProgress = (() => {
    if (
      typeof votingStartTs !== "number" ||
      typeof votingEndTs !== "number" ||
      typeof currentTs !== "number"
    ) {
      return 100;
    }

    if (currentTs <= votingStartTs) {
      return 100;
    }

    if (currentTs >= votingEndTs) {
      return 0;
    }

    const totalWindow = votingEndTs - votingStartTs;
    const remainingWindow = votingEndTs - currentTs;
    return Math.max(0, Math.min(100, (remainingWindow / totalWindow) * 100));
  })();

  return (
    <div className="flex w-full flex-col text-white">
      <div className="mb-2 w-full text-left">
        <div className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-[12px] px-6 py-[0.65rem] font-['Montserrat',sans-serif] text-[1rem] font-bold text-white transition-all duration-200 hover:bg-white/15">
          Voting Portal
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center py-8 text-center md:flex-row md:items-start">
        {/* leftBlock */}
        <div className="my-4 flex w-full flex-col items-center justify-center md:w-1/2 md:self-stretch md:pr-8">
          <div className="w-full text-center">
            <p className="m-0 p-0 text-base font-extrabold md:m-[1.2rem]">
              Poll ends in {remainingTime}{" "}
              {typeof remainingTime === "number" ? "minutes" : ""}
            </p>
          </div>
          
          <div className="mt-2 w-full px-3 md:px-[1.2rem]">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-1000 ease-linear"
                style={{ width: `${timerProgress}%` }}
              />
            </div>
          </div>
          {props.showButton ? (
            <div className="m-[1.2rem] flex w-full flex-col text-center">
              <p className="m-0 p-0 text-center font-extrabold">
                You voted for Candidate ID{" "}
                <b className="font-medium">
                  {votedCandidateId ?? "-"} - {votedCandidate}
                </b>
              </p>
            </div>
          ) : (
            <div className="m-[1.2rem] flex w-full flex-col text-center">
              <input
                type="text"
                placeholder="Enter candidate name or index"
                value={props.number}
                onChange={props.handleNumberChange}
                className="box-border w-full rounded-[5px] border-2 border-white bg-white p-4 text-center font-['Montserrat',sans-serif] text-base font-extrabold text-black"
              />
              <button
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-[5px] border-2 border-white bg-white p-4 text-center font-['Montserrat',sans-serif] text-base font-extrabold text-black transition-all duration-300 hover:bg-transparent hover:text-white hover:backdrop-blur-sm"
                onClick={props.voteFunction}
                disabled={props.isVoting}
              >
                {props.isVoting ? (
                  <span
                    className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"
                    aria-label="Submitting vote"
                  />
                ) : (
                  "Seal your vote with MetaMask"
                )}
              </button>
            </div>
          )}

          {props.showButton ? (
            <div className="m-[1.2rem] w-full text-left text-[0.7rem]">
              <span className="font-extrabold">Logged voter's address = </span>{" "}
              {props.account}
              <br />
              Your vote has been casted successfully based on the above
              mentioned voter's address. The results will be displayed after the
              poll ends.
            </div>
          ) : (
            <div className="m-[1.2rem] w-full text-left text-[0.7rem]">
              <span className="font-extrabold">Logged voter's address = </span>{" "}
              {props.account}
              <br />
              Choose the index number / name for the respective candidate from
              the mentioned list. Once casted, your vote cannot be altered. So
              please double check before proceeding to final casting.
            </div>
          )}
        </div>

        {/* rightBlock */}
        <div className="relative my-4 flex w-full flex-col items-center justify-center text-center md:w-1/2 md:self-stretch md:pl-8">
          <p className="mb-3 text-lg font-extrabold md:text-xl">
            Live Vote Counts
          </p>
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-1/3 rounded-[2px] border-2 border-white p-4">
                  ID
                </th>
                <th className="w-1/3 rounded-[2px] border-2 border-white p-4">
                  Candidate Name
                </th>
                <th className="w-1/3 rounded-[2px] border-2 border-white p-4">
                  Vote Count
                </th>
              </tr>
            </thead>
            <tbody>
              {props.candidates.map((candidate, index) => (
                <tr key={index}>
                  <td className="w-1/3 rounded-[2px] border-2 border-white p-4">
                    {candidate.index}
                  </td>
                  <td className="w-1/3 rounded-[2px] border-2 border-white p-4">
                    {candidate.name}
                  </td>
                  <td className="w-1/3 rounded-[2px] border-2 border-white p-4">
                    {candidate.voteCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Connected;
